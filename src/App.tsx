import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react'
import {
  completeTask,
  exportSnapshot,
  importSnapshot,
  loadSnapshot,
  normalizeAnswer,
  resetProgress,
  saveGeneratedReading,
  saveDeckWithCards,
  savePronunciationAttempt,
  saveReadingAttempt,
  saveWritingAttempt,
  updateCardReview,
  updateSettings,
  updateTopicConfidence,
  updateVerbMastery,
} from './db'
import { curatedReadingExercises, curatedWritingPrompts } from './features/contentRegistry'
import { getGrammarGuide } from './grammarGuides'
import {
  formatMinutes,
  generateWeekPlan,
  getWeekStart,
  settingsWeeklyMinutes,
  targetForLevel,
  toDateKey,
  type WeekPlan,
} from './features/planner'
import {
  aiConfigFromSettings,
  evaluateWriting,
  explainGrammar,
  generatePractice,
  generateReading,
  getAiStatus,
  getPronunciationFeedback,
  testAi,
  type AiExplanation,
  type PronunciationFeedback,
} from './services/ai'
import {
  buildConjugationRounds,
  buildMatchPairs,
  createPersonalCards,
  createPersonalDeck,
  parseVocabCsv,
  shuffle,
  type ParsedVocabRow,
} from './studyUtils'
import type {
  ActivityType,
  AiPracticeExercise,
  DayKey,
  LearningLevel,
  LearningSnapshot,
  PlannedTask,
  PronunciationAttempt,
  ReadingExercise,
  SkillTopic,
  TaskCompletion,
  UserSettings,
  VocabCard,
  VerbEntry,
  WeeklyAvailability,
  WritingAttempt,
  WritingEvaluation,
  WritingPrompt,
} from './types'
import { dayKeys } from './types'
import './App.css'

const navItems: Array<{ id: 'today' | 'plan' | 'learn' | 'practice' | 'progress' | 'settings'; label: string; icon: string }> = [
  { id: 'today', label: 'Today', icon: 'T' },
  { id: 'plan', label: 'My plan', icon: 'P' },
  { id: 'learn', label: 'Learn', icon: 'L' },
  { id: 'practice', label: 'Practice', icon: 'R' },
  { id: 'progress', label: 'Progress', icon: 'G' },
  { id: 'settings', label: 'Settings', icon: 'S' },
]

const dayLabels: Record<DayKey, string> = {
  monday: 'Monday', tuesday: 'Tuesday', wednesday: 'Wednesday', thursday: 'Thursday',
  friday: 'Friday', saturday: 'Saturday', sunday: 'Sunday',
}
const timeChoices = [0, 15, 30, 45, 60, 90, 120, 180, 240]
const levelDescriptions: Record<LearningLevel, string> = {
  A1: 'I understand simple words and basic sentences.',
  A2: 'I can handle common daily situations and short texts.',
  B1: 'I can discuss familiar topics and express simple opinions.',
}
const activityMeta: Record<ActivityType, { icon: string; description: string }> = {
  'grammar-lesson': { icon: 'G', description: 'Learn or revise a grammar rule' },
  'grammar-practice': { icon: 'Q', description: 'Answer targeted grammar questions' },
  'vocabulary-review': { icon: 'V', description: 'Review due flashcards' },
  conjugation: { icon: 'C', description: 'Practise verb forms' },
  reading: { icon: 'R', description: 'Read a passage and answer questions' },
  writing: { icon: 'W', description: 'Write and receive local AI feedback' },
  pronunciation: { icon: 'P', description: 'Read aloud and compare transcription' },
  'weekly-review': { icon: 'W', description: 'Review recent mistakes' },
}

type WorkspaceRequest = { type: ActivityType; contentId?: string; task?: PlannedTask }

export default function App() {
  const [snapshot, setSnapshot] = useState<LearningSnapshot | null>(null)
  const [activeView, setActiveView] = useState<(typeof navItems)[number]['id']>('today')
  const [workspace, setWorkspace] = useState<WorkspaceRequest | null>(null)
  const [notice, setNotice] = useState('')

  const refresh = async () => setSnapshot(await loadSnapshot())
  useEffect(() => { void refresh() }, [])

  const saveSettings = async (next: UserSettings) => {
    await updateSettings(next)
    setSnapshot((current) => current ? { ...current, settings: next } : current)
  }

  if (!snapshot) return <LoadingScreen />
  if (!snapshot.settings.onboardingCompleted) {
    return <Onboarding initial={snapshot.settings} onComplete={saveSettings} />
  }

  const weekPlan = generateWeekPlan(snapshot)
  const today = toDateKey(new Date())
  const completedIds = new Set(snapshot.taskCompletions.map((completion) => completion.taskId))
  const completeWorkspace = async (score?: number) => {
    if (workspace?.task) await completeTask(workspace.task.id, workspace.task.date, score)
    setWorkspace(null)
    await refresh()
  }

  return (
    <div className="app-shell">
      <Sidebar active={activeView} settings={snapshot.settings} onNavigate={setActiveView} />
      <main className="main-area">
        <header className="mobile-header">
          <strong>French Path</strong>
        </header>
        {notice && <Notice text={notice} onClose={() => setNotice('')} />}
        {activeView === 'today' && <TodayView snapshot={snapshot} plan={weekPlan} today={today} completed={completedIds} onOpen={(task) => setWorkspace({ type: task.type, contentId: task.contentId, task })} />}
        {activeView === 'plan' && <PlanView snapshot={snapshot} plan={weekPlan} completed={completedIds} onSave={saveSettings} onOpen={(task) => setWorkspace({ type: task.type, contentId: task.contentId, task })} />}
        {activeView === 'learn' && <LearnView snapshot={snapshot} onRefresh={refresh} onOpen={(type, contentId) => setWorkspace({ type, contentId })} />}
        {activeView === 'practice' && <PracticeView snapshot={snapshot} onRefresh={refresh} onOpen={(type, contentId) => setWorkspace({ type, contentId })} />}
        {activeView === 'progress' && <ProgressView snapshot={snapshot} plan={weekPlan} />}
        {activeView === 'settings' && <SettingsView snapshot={snapshot} onSave={saveSettings} onRefresh={refresh} onNotice={setNotice} />}
      </main>
      <MobileNav active={activeView} onNavigate={setActiveView} />
      {workspace && <Workspace snapshot={snapshot} request={workspace} onClose={() => setWorkspace(null)} onDone={completeWorkspace} onRefresh={refresh} />}
    </div>
  )
}

function LoadingScreen() {
  return <div className="center-screen"><div className="loader-card"><span className="spinner" /> <strong>Loading French Path...</strong></div></div>
}

function Sidebar({ active, settings, onNavigate }: { active: string; settings: UserSettings; onNavigate: (id: (typeof navItems)[number]['id']) => void }) {
  return <aside className="sidebar">
    <div className="brand"><div className="brand-mark">F</div><div><strong>French Path</strong><span>Local learning companion</span></div></div>
    <nav>{navItems.map((item) => <button key={item.id} className={`nav-button ${active === item.id ? 'active' : ''}`} onClick={() => onNavigate(item.id)}><span>{item.icon}</span>{item.label}</button>)}</nav>
    <div className="sidebar-footer"><span className="level-pill">{settings.currentLevel} to {settings.targetLevel}</span><small>{formatMinutes(settingsWeeklyMinutes(settings))} planned weekly</small></div>
  </aside>
}

function MobileNav({ active, onNavigate }: { active: string; onNavigate: (id: (typeof navItems)[number]['id']) => void }) {
  return <nav className="mobile-nav" aria-label="Primary">
    {navItems.map((item) => <button
      key={item.id}
      className={`mobile-nav-button ${active === item.id ? 'active' : ''}`}
      onClick={() => onNavigate(item.id)}
      aria-label={item.label}
      title={item.label}
    ><span>{item.icon}</span></button>)}
  </nav>
}

function Notice({ text, onClose }: { text: string; onClose: () => void }) {
  return <div className="notice"><span>{text}</span><button onClick={onClose}>x</button></div>
}

function Onboarding({ initial, onComplete }: { initial: UserSettings; onComplete: (settings: UserSettings) => Promise<void> }) {
  const [step, setStep] = useState(1)
  const [settings, setSettings] = useState<UserSettings>(initial)
  const [placementOpen, setPlacementOpen] = useState(false)
  const weeklyMinutes = settingsWeeklyMinutes(settings)
  const finish = () => void onComplete({ ...settings, targetLevel: targetForLevel(settings.currentLevel), onboardingCompleted: true })
  if (placementOpen) return <PlacementTest onCancel={() => setPlacementOpen(false)} onResult={(currentLevel) => { setSettings({ ...settings, currentLevel, targetLevel: targetForLevel(currentLevel) }); setPlacementOpen(false); setStep(2) }} />
  return <div className="onboarding-shell">
    <div className="onboarding-card">
      <div className="onboarding-brand"><div className="brand-mark large">F</div><div><h1>Build your French path</h1><p>A focused plan for consistent progress from A1 to B1.</p></div></div>
      <div className="stepper"><span className={step >= 1 ? 'done' : ''}>1</span><i /><span className={step >= 2 ? 'done' : ''}>2</span><i /><span className={step >= 3 ? 'done' : ''}>3</span></div>
      {step === 1 && <section>
        <h2>Where should your plan begin?</h2><p className="muted">Choose the level you believe matches your current French. You can change it later.</p>
        <div className="level-grid">{(['A1', 'A2', 'B1'] as LearningLevel[]).map((level) => <button key={level} className={`level-card ${settings.currentLevel === level ? 'selected' : ''}`} onClick={() => setSettings({ ...settings, currentLevel: level, targetLevel: targetForLevel(level) })}><strong>{level}</strong><span>{levelDescriptions[level]}</span><small>Next goal: {targetForLevel(level)}</small></button>)}</div>
        <button className="text-button" onClick={() => setPlacementOpen(true)}>I am unsure - take a short placement test</button>
      </section>}
      {step === 2 && <section>
        <h2>How much time can you study each day?</h2><p className="muted">The weekly plan will use these real daily limits. Zero minutes creates a rest day.</p>
        <AvailabilityEditor value={settings.weeklyAvailability} onChange={(weeklyAvailability) => setSettings({ ...settings, weeklyAvailability })} />
        <div className="summary-strip"><strong>{formatMinutes(weeklyMinutes)} per week</strong><span>{weeklyMinutes >= 420 ? 'Ambitious pace' : weeklyMinutes >= 240 ? 'Steady pace' : 'Light revision pace'}</span></div>
      </section>}
      {step === 3 && <section>
        <h2>Set your learning preferences</h2>
        <label className="field"><span>Your name <small>(optional)</small></span><input value={settings.learnerName} onChange={(event) => setSettings({ ...settings, learnerName: event.target.value })} placeholder="Marzaan" /></label>
        <label className="field"><span>Explanation language</span><select value={settings.languageMode} onChange={(event) => setSettings({ ...settings, languageMode: event.target.value as 'en' | 'fr' })}><option value="en">English</option><option value="fr">French</option></select></label>
        <Toggle label="Enable audio playback" checked={settings.speechEnabled} onChange={(speechEnabled) => setSettings({ ...settings, speechEnabled })} />
        <Toggle label="Enable browser speech recognition" checked={settings.speechRecognitionEnabled} onChange={(speechRecognitionEnabled) => setSettings({ ...settings, speechRecognitionEnabled })} />
        <Toggle label="Enable local Ollama assistant" checked={settings.aiProvider === 'ollama'} onChange={(enabled) => setSettings({ ...settings, aiProvider: enabled ? 'ollama' : 'disabled' })} />
        {settings.aiProvider === 'ollama' && <label className="field"><span>Ollama model tag</span><input value={settings.aiModel} onChange={(event) => setSettings({ ...settings, aiModel: event.target.value })} /></label>}
      </section>}
      <footer className="wizard-footer">{step > 1 ? <button className="secondary-button" onClick={() => setStep(step - 1)}>Back</button> : <span />}{step < 3 ? <button className="primary-button" onClick={() => setStep(step + 1)}>Continue</button> : <button className="primary-button" disabled={weeklyMinutes === 0} onClick={finish}>Create my plan</button>}</footer>
    </div>
  </div>
}

const placementQuestions = [
  { prompt: 'Choose the correct sentence.', choices: ['Je suis etudiante.', 'Je est etudiante.', 'Je etre etudiante.'], answer: 'Je suis etudiante.', level: 'A1' },
  { prompt: 'Complete: Nous ___ francais.', choices: ['parlons', 'parlez', 'parlent'], answer: 'parlons', level: 'A1' },
  { prompt: 'Choose the correct article: ___ table.', choices: ['Le', 'La', 'Les'], answer: 'La', level: 'A1' },
  { prompt: 'Hier, elle ___ au cinema.', choices: ['est allee', 'va', 'allait toujours'], answer: 'est allee', level: 'A2' },
  { prompt: 'Choose the best comparison.', choices: ['Lyon est plus calme que Paris.', 'Lyon est calme plus Paris.', 'Lyon plus calme Paris.'], answer: 'Lyon est plus calme que Paris.', level: 'A2' },
  { prompt: 'Complete: Quand j etais petite, je ___ souvent chez ma grand-mere.', choices: ['vais', 'allais', 'irai'], answer: 'allais', level: 'A2' },
  { prompt: 'Complete: Il faut que vous ___ a l heure.', choices: ['venez', 'viendrez', 'veniez'], answer: 'veniez', level: 'B1' },
  { prompt: 'Choose the connector expressing contrast.', choices: ['cependant', 'donc', 'puisque'], answer: 'cependant', level: 'B1' },
  { prompt: 'Complete: Si j avais plus de temps, je ___ davantage.', choices: ['voyagerai', 'voyage', 'voyagerais'], answer: 'voyagerais', level: 'B1' },
]

function PlacementTest({ onCancel, onResult }: { onCancel: () => void; onResult: (level: LearningLevel) => void }) {
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const complete = Object.keys(answers).length === placementQuestions.length
  const finish = () => {
    const score = placementQuestions.filter((question, index) => answers[index] === question.answer).length
    onResult(score >= 7 ? 'B1' : score >= 4 ? 'A2' : 'A1')
  }
  return <div className="onboarding-shell"><div className="onboarding-card wide"><h1>Short placement test</h1><p className="muted">This is a practical recommendation, not a formal CEFR certification.</p><div className="question-stack">{placementQuestions.map((question, index) => <fieldset key={question.prompt}><legend>{index + 1}. {question.prompt}</legend>{question.choices.map((choice) => <label className="choice" key={choice}><input type="radio" name={`placement-${index}`} checked={answers[index] === choice} onChange={() => setAnswers({ ...answers, [index]: choice })} />{choice}</label>)}</fieldset>)}</div><footer className="wizard-footer"><button className="secondary-button" onClick={onCancel}>Cancel</button><button className="primary-button" disabled={!complete} onClick={finish}>Use my result</button></footer></div></div>
}

function AvailabilityEditor({ value, onChange }: { value: WeeklyAvailability; onChange: (value: WeeklyAvailability) => void }) {
  return <div className="availability-grid">{dayKeys.map((day) => <label key={day}><span>{dayLabels[day]}</span><select value={value[day]} onChange={(event) => onChange({ ...value, [day]: Number(event.target.value) })}>{timeChoices.map((minutes) => <option key={minutes} value={minutes}>{minutes ? formatMinutes(minutes) : 'Rest day'}</option>)}</select></label>)}</div>
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return <label className="toggle-row"><span>{label}</span><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} /></label>
}

function PageHeader({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: ReactNode }) {
  return <div className="page-header"><div>{eyebrow && <small>{eyebrow}</small>}<h1>{title}</h1>{description && <p>{description}</p>}</div>{action}</div>
}

function GrammarTopicContent({ topic, language, speechEnabled, compact = false }: { topic: SkillTopic; language: 'en' | 'fr'; speechEnabled: boolean; compact?: boolean }) {
  const guide = topic.lessonGuide ?? getGrammarGuide(topic)
  return <div className={`grammar-guide ${compact ? 'compact-guide' : ''}`}>
    <section className="grammar-summary grammar-card">
      <h3>{topic.titleEn}</h3>
      <p>{language === 'fr' ? topic.explanationFr : topic.explanationEn}</p>
    </section>
    {guide?.goals?.length ? <section className="grammar-card"><h3>Goals</h3><ul>{guide.goals.map((goal) => <li key={goal}>{goal}</li>)}</ul></section> : null}
    {guide?.rules?.length ? <section className="grammar-card"><h3>How it works</h3><ul>{guide.rules.map((rule) => <li key={rule}>{rule}</li>)}</ul></section> : null}
    {topic.examples.length ? <section className="grammar-card"><h3>Examples</h3><div className="example-box">{topic.examples.map((example) => <div key={example}><span>{example}</span><SpeakButton text={example} enabled={speechEnabled} /></div>)}</div></section> : null}
    {guide?.commonMistakes?.length ? <section className="grammar-card"><h3>Common mistakes</h3><div className="mistake-list">{guide.commonMistakes.map((mistake, index) => <article key={`${mistake.incorrect}-${index}`}><div><strong className="wrong-example">Incorrect: {mistake.incorrect}</strong><strong className="right-example">Correct: {mistake.correct}</strong></div><p>{mistake.explanation}</p></article>)}</div></section> : null}
    {guide?.quickReference?.length ? <section className="grammar-card"><h3>Quick reference</h3><div className="grammar-reference">{guide.quickReference.map((item) => <div key={`${item.label}-${item.value}`}><strong>{item.label}</strong><span>{item.value}</span></div>)}</div></section> : null}
    {guide?.memoryTip ? <div className="memory-tip"><strong>Memory tip</strong><span>{guide.memoryTip}</span></div> : null}
  </div>
}

function TodayView({ snapshot, plan, today, completed, onOpen }: { snapshot: LearningSnapshot; plan: WeekPlan; today: string; completed: Set<string>; onOpen: (task: PlannedTask) => void }) {
  const day = plan.days.find((item) => item.date === today) ?? plan.days[0]
  const completedCount = day.tasks.filter((task) => completed.has(task.id)).length
  const firstPending = day.tasks.find((task) => !completed.has(task.id))
  const name = snapshot.settings.learnerName ? `, ${snapshot.settings.learnerName}` : ''
  return <>
    <PageHeader eyebrow={`${snapshot.settings.currentLevel} -> ${snapshot.settings.targetLevel}`} title={`Bonjour${name}`} description="Your study plan adapts to the time you set aside and the skills that need attention." />
    <section className="hero-card"><div><span className="eyebrow">Today · {dayLabels[day.day]}</span><h2>{day.availableMinutes ? 'Your focused French session' : 'Rest day'}</h2><p>{day.availableMinutes ? `${completedCount} of ${day.tasks.length} activities completed · ${formatMinutes(day.availableMinutes)} planned` : 'No study session is planned today. A rest day helps you maintain a realistic routine.'}</p>{firstPending && <button className="primary-button" onClick={() => onOpen(firstPending)}>Start next activity</button>}</div><ProgressRing value={day.tasks.length ? Math.round((completedCount / day.tasks.length) * 100) : 100} /></section>
    <div className="section-heading"><div><h2>Today's activities</h2><p>Complete the tasks in order or choose the most useful one now.</p></div></div>
    {day.tasks.length ? <div className="task-list">{day.tasks.map((task, index) => <TaskRow key={task.id} task={task} index={index} completed={completed.has(task.id)} onOpen={() => onOpen(task)} />)}</div> : <EmptyState title="Nothing scheduled today" description="Open My plan to add study time for this day, or use Practice for an optional exercise." />}
    <div className="two-column-grid stats-grid"><StatCard label="Vocabulary cards due" value={String(snapshot.cards.filter((card) => new Date(card.dueAt).getTime() <= Date.now()).length)} detail="Spaced repetition queue" /><StatCard label="Offline reading sets" value={String(curatedReadingExercises.length)} detail="Available without Ollama" /><StatCard label="Recent writing attempts" value={String(snapshot.writingAttempts.length)} detail="Saved locally" /><StatCard label="Study time this week" value={formatMinutes(plan.totalMinutes)} detail="Based on your schedule" /></div>
  </>
}

function TaskRow({ task, index, completed, onOpen }: { task: PlannedTask; index: number; completed: boolean; onOpen: () => void }) {
  const meta = activityMeta[task.type]
  return <article className={`task-row ${completed ? 'completed' : ''}`}><div className="task-index">{completed ? 'Done' : index + 1}</div><div className="task-icon">{meta.icon}</div><div className="task-copy"><h3>{task.title}</h3><p>{task.detail}</p></div><span className="time-pill">{formatMinutes(task.estimatedMinutes)}</span><button className={completed ? 'secondary-button compact' : 'primary-button compact'} onClick={onOpen}>{completed ? 'Repeat' : 'Start'}</button></article>
}

function PlanView({ snapshot, plan, completed, onSave, onOpen }: { snapshot: LearningSnapshot; plan: WeekPlan; completed: Set<string>; onSave: (settings: UserSettings) => Promise<void>; onOpen: (task: PlannedTask) => void }) {
  const [editing, setEditing] = useState(false)
  const [availability, setAvailability] = useState(snapshot.settings.weeklyAvailability)
  const save = async () => { await onSave({ ...snapshot.settings, weeklyAvailability: availability }); setEditing(false) }
  return <>
    <PageHeader eyebrow={`Week of ${plan.weekStart}`} title="My weekly plan" description="Your schedule is generated from your availability, review queue, weak topics, and current level." action={<button className="secondary-button" onClick={() => setEditing(!editing)}>{editing ? 'Close editor' : 'Edit availability'}</button>} />
    {editing && <section className="panel"><h2>Weekly availability</h2><AvailabilityEditor value={availability} onChange={setAvailability} /><div className="button-row"><button className="primary-button" onClick={() => void save()}>Save and regenerate plan</button></div></section>}
    <div className="week-grid">{plan.days.map((day) => <section className="day-card" key={day.day}><header><div><strong>{dayLabels[day.day]}</strong><small>{day.date}</small></div><span>{day.availableMinutes ? formatMinutes(day.availableMinutes) : 'Rest'}</span></header>{day.tasks.length ? <div className="mini-task-list">{day.tasks.map((task) => <button key={task.id} className={completed.has(task.id) ? 'done' : ''} onClick={() => onOpen(task)}><span>{completed.has(task.id) ? 'Done' : activityMeta[task.type].icon}</span><i>{task.title}</i><small>{task.estimatedMinutes}m</small></button>)}</div> : <p className="muted">Rest day</p>}</section>)}</div>
  </>
}

function LearnView({ snapshot, onRefresh, onOpen }: { snapshot: LearningSnapshot; onRefresh: () => Promise<void>; onOpen: (type: ActivityType, contentId?: string) => void }) {
  const [tab, setTab] = useState<'grammar' | 'vocabulary' | 'verbs'>('grammar')
  return <>
    <PageHeader title="Learn" description="Browse the curriculum when you want to revise a specific lesson outside the daily session." />
    <div className="tab-bar">{(['grammar', 'vocabulary', 'verbs'] as const).map((item) => <button className={tab === item ? 'active' : ''} onClick={() => setTab(item)} key={item}>{item === 'verbs' ? 'Verbs' : capitalize(item)}</button>)}</div>
    {tab === 'grammar' && <GrammarLibrary snapshot={snapshot} onRefresh={onRefresh} onOpen={onOpen} />}
    {tab === 'vocabulary' && <VocabularyLibrary snapshot={snapshot} onRefresh={onRefresh} onOpen={onOpen} />}
    {tab === 'verbs' && <VerbLibrary snapshot={snapshot} onOpen={onOpen} />}
  </>
}

function GrammarLibrary({ snapshot, onOpen }: { snapshot: LearningSnapshot; onRefresh: () => Promise<void>; onOpen: (type: ActivityType, contentId?: string) => void }) {
  const topics = snapshot.topics.filter((topic) => topic.level !== 'B2').sort((a, b) => (a.sequence ?? 999) - (b.sequence ?? 999))
  const [selectedId, setSelectedId] = useState(topics[0]?.id ?? '')
  const [aiExplanation, setAiExplanation] = useState<AiExplanation | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const selected = topics.find((topic) => topic.id === selectedId) ?? topics[0]
  const requestExplanation = async () => {
    if (!selected) return
    setLoading(true); setError(''); setAiExplanation(null)
    try { setAiExplanation(await explainGrammar(aiConfigFromSettings(snapshot.settings), { level: snapshot.settings.currentLevel, topic: selected.titleEn, lesson: selected.explanationEn, language: snapshot.settings.languageMode })) } catch (reason) { setError(errorMessage(reason)) } finally { setLoading(false) }
  }
  return <div className="library-layout"><aside className="library-list">{(['A1', 'A2', 'B1'] as LearningLevel[]).map((level) => <div key={level}><h3>{level}</h3>{topics.filter((topic) => topic.level === level).map((topic) => <button className={selected?.id === topic.id ? 'selected' : ''} key={topic.id} onClick={() => { setSelectedId(topic.id); setAiExplanation(null) }}><span>{topic.titleEn}</span><small>{topic.confidence}%</small></button>)}</div>)}</aside>{selected && <section className="lesson-panel"><span className="eyebrow">{selected.level} · {selected.area}</span><h2>{selected.titleEn}</h2><p>{snapshot.settings.languageMode === 'fr' ? selected.explanationFr : selected.explanationEn}</p><h3>Examples</h3><ul>{selected.examples.map((example) => <li key={example}>{example}<SpeakButton text={example} enabled={snapshot.settings.speechEnabled} /></li>)}</ul><div className="confidence-line"><span>Confidence</span><Meter value={selected.confidence} /></div><div className="button-row"><button className="primary-button" onClick={() => onOpen('grammar-practice', selected.id)}>Start manual quiz · 10 questions</button><button className="secondary-button" disabled={loading || snapshot.settings.aiProvider !== 'ollama'} onClick={() => void requestExplanation()}>{loading ? 'Generating...' : 'Explain more simply with Ollama'}</button></div>{snapshot.settings.aiProvider !== 'ollama' && <p className="helper">Enable Ollama in Settings to request a personalised explanation.</p>}{error && <ErrorBox text={error} />}{aiExplanation && <div className="ai-box"><h3>Local AI explanation</h3><p>{aiExplanation.explanation}</p><ul>{aiExplanation.examples.map((example) => <li key={example}>{example}</li>)}</ul>{aiExplanation.commonMistakes.length > 0 && <><h4>Common mistakes</h4><ul>{aiExplanation.commonMistakes.map((item) => <li key={item}>{item}</li>)}</ul></>}</div>}</section>}</div>
}

function VocabularyLibrary({ snapshot, onRefresh, onOpen }: { snapshot: LearningSnapshot; onRefresh: () => Promise<void>; onOpen: (type: ActivityType, contentId?: string) => void }) {
  const decks = snapshot.decks.filter((deck) => deck.level !== 'B2').sort((a, b) => {
    if ((a.source === 'personal') !== (b.source === 'personal')) return a.source === 'personal' ? -1 : 1
    return a.title.localeCompare(b.title)
  })
  const [selectedId, setSelectedId] = useState(decks[0]?.id ?? '')
  const [showBuilder, setShowBuilder] = useState(false)
  const deck = decks.find((item) => item.id === selectedId) ?? decks[0]
  const cards = snapshot.cards.filter((card) => card.deckId === deck?.id)
  return <div className="library-layout"><aside className="library-list"><div className="library-list-header"><h3>Decks</h3><button className="secondary-button compact" onClick={() => setShowBuilder((current) => !current)}>{showBuilder ? 'Close' : 'New set'}</button></div>{decks.map((item) => <button className={item.id === deck?.id ? 'selected' : ''} onClick={() => setSelectedId(item.id)} key={item.id}><span>{item.title}</span><small>{item.level}</small></button>)}</aside><section className="lesson-panel">{showBuilder && <VocabSetBuilder currentLevel={snapshot.settings.currentLevel} onCreated={async (deckId) => { await onRefresh(); setSelectedId(deckId); setShowBuilder(false) }} />}{deck && <><div className="split-header"><div><span className="eyebrow">{deck.level} vocabulary {deck.source === 'personal' ? '· personal set' : ''}</span><h2>{deck.title}</h2><p>{deck.description}</p></div><div className="button-row"><button className="primary-button" onClick={() => onOpen('vocabulary-review', deck.id)}>Study this set</button></div></div><div className="summary-strip"><strong>{cards.length} cards</strong><span>{cards.filter((card) => new Date(card.dueAt).getTime() <= Date.now()).length} due now</span></div>{deck.tags.length > 0 && <div className="pill-row">{deck.tags.map((tag) => <span key={tag} className="tag-pill">{tag}</span>)}</div>}<div className="word-grid">{cards.slice(0, 60).map((card) => <article key={card.id}><strong>{card.frontFr}</strong><span>{card.backEn}</span><small>{card.exampleFr}</small></article>)}</div></>}</section></div>
}

function VerbLibrary({ snapshot, onOpen }: { snapshot: LearningSnapshot; onOpen: (type: ActivityType, contentId?: string) => void }) {
  const verbs = snapshot.verbs.filter((verb) => verb.level !== 'B2')
  const [selectedId, setSelectedId] = useState(verbs[0]?.id ?? '')
  const verb = verbs.find((item) => item.id === selectedId) ?? verbs[0]
  return <div className="library-layout"><aside className="library-list"><div className="library-list-header"><h3>Verbs</h3>{verb && <button className="secondary-button compact" onClick={() => onOpen('conjugation', verb.id)}>Practice</button>}</div>{verbs.slice(0, 160).map((item) => <button className={item.id === verb?.id ? 'selected' : ''} onClick={() => setSelectedId(item.id)} key={item.id}><span>{item.infinitive}</span><small>{Math.round(average(Object.values(item.mastery)))}%</small></button>)}</aside>{verb && <section className="lesson-panel"><div className="split-header"><div><span className="eyebrow">{verb.level} · {verb.group}</span><h2>{verb.infinitive}</h2><p>{verb.meaning}</p></div><div className="button-row"><button className="primary-button" onClick={() => onOpen('conjugation', verb.id)}>Start conjugation practice</button></div></div><div className="summary-strip"><strong>{Math.round(average(Object.values(verb.mastery)))}% mastery</strong><span>{Object.keys(verb.conjugations).length} tenses available</span></div>{Object.entries(verb.conjugations).slice(0, 5).map(([tense, forms]) => <div className="verb-table" key={tense}><h3>{humanTense(tense)}</h3>{Object.entries(forms).map(([person, form]) => <div key={person}><span>{person}</span><strong>{form}</strong></div>)}</div>)}</section>}</div>
}

function PracticeView({ snapshot, onRefresh, onOpen }: { snapshot: LearningSnapshot; onRefresh: () => Promise<void>; onOpen: (type: ActivityType, contentId?: string) => void }) {
  const [topic, setTopic] = useState('daily life in France')
  const [focus, setFocus] = useState('passe compose and imparfait')
  const [kind, setKind] = useState<'grammar' | 'vocabulary' | 'conjugation'>('grammar')
  const [generatedPractice, setGeneratedPractice] = useState<AiPracticeExercise | null>(null)
  const [loading, setLoading] = useState('')
  const [error, setError] = useState('')
  const createReading = async () => {
    setLoading('reading'); setError('')
    try { const exercise = await generateReading(aiConfigFromSettings(snapshot.settings), { level: snapshot.settings.currentLevel, topic, grammarFocus: focus }); await saveGeneratedReading(exercise); await onRefresh(); onOpen('reading', exercise.id) } catch (reason) { setError(errorMessage(reason)) } finally { setLoading('') }
  }
  const createPractice = async () => {
    setLoading('practice'); setError('')
    try { setGeneratedPractice(await generatePractice(aiConfigFromSettings(snapshot.settings), { level: snapshot.settings.currentLevel, kind, focus })) } catch (reason) { setError(errorMessage(reason)) } finally { setLoading('') }
  }
  const cards: Array<{ type: ActivityType; title: string; description: string }> = [
    { type: 'grammar-practice', title: 'Grammar quiz', description: 'Target the weakest grammar topics in your path.' },
    { type: 'vocabulary-review', title: 'Vocabulary games', description: 'Flashcards, write mode, and matching with your own or built-in sets.' },
    { type: 'conjugation', title: 'Verb conjugation practice', description: 'Practise verb forms with configurable tense filters and quiz modes.' },
    { type: 'reading', title: 'Reading comprehension', description: 'Choose from curated and generated offline reading sets.' },
    { type: 'writing', title: 'Writing practice', description: 'Write a CEFR-appropriate answer and optionally request local AI feedback.' },
    { type: 'pronunciation', title: 'Pronunciation practice', description: 'Compare a browser speech-to-text result with the expected phrase.' },
  ]
  return <>
    <PageHeader title="Practice" description="Choose an exercise directly, or use Ollama to create new practice material locally." />
    <div className="practice-grid">{cards.map((card) => <button className="practice-card" key={card.type} onClick={() => onOpen(card.type)}><span>{activityMeta[card.type].icon}</span><h3>{card.title}</h3><p>{card.description}</p><i>Start practice</i></button>)}</div>
    <section className="panel ai-studio"><div><span className="eyebrow">Optional · local Ollama</span><h2>AI exercise studio</h2><p>Create an additional reading passage or a small focused practice set. The application continues to work without AI.</p></div><div className="ai-studio-grid"><label className="field"><span>Reading topic</span><input value={topic} onChange={(event) => setTopic(event.target.value)} /></label><label className="field"><span>Grammar or vocabulary focus</span><input value={focus} onChange={(event) => setFocus(event.target.value)} /></label><button className="primary-button" disabled={loading !== '' || snapshot.settings.aiProvider !== 'ollama'} onClick={() => void createReading()}>{loading === 'reading' ? 'Generating...' : 'Generate reading exercise'}</button></div><hr /><div className="ai-studio-grid"><label className="field"><span>Practice type</span><select value={kind} onChange={(event) => setKind(event.target.value as typeof kind)}><option value="grammar">Grammar</option><option value="vocabulary">Vocabulary</option><option value="conjugation">Conjugation</option></select></label><label className="field"><span>Focus</span><input value={focus} onChange={(event) => setFocus(event.target.value)} /></label><button className="secondary-button" disabled={loading !== '' || snapshot.settings.aiProvider !== 'ollama'} onClick={() => void createPractice()}>{loading === 'practice' ? 'Generating...' : 'Generate short practice set'}</button></div>{snapshot.settings.aiProvider !== 'ollama' && <p className="helper">Enable Ollama in Settings to use the AI exercise studio.</p>}{error && <ErrorBox text={error} />}{generatedPractice && <div className="ai-box"><h3>{generatedPractice.title}</h3><p>{generatedPractice.instructions}</p><ol>{generatedPractice.questions.map((question, index) => <li key={`${question.prompt}-${index}`}><strong>{question.prompt}</strong><small>Answer: {question.correctAnswer} · {question.explanation}</small></li>)}</ol></div>}</section>
  </>
}

function ProgressView({ snapshot, plan }: { snapshot: LearningSnapshot; plan: WeekPlan }) {
  const completedThisWeek = snapshot.taskCompletions.filter((item) => item.date >= plan.weekStart)
  const weakTopics = [...snapshot.topics].filter((topic) => topic.level !== 'B2').sort((a, b) => a.confidence - b.confidence).slice(0, 6)
  const strongTopics = [...snapshot.topics].filter((topic) => topic.level !== 'B2').sort((a, b) => b.confidence - a.confidence).slice(0, 6)
  const totalPossible = plan.days.flatMap((day) => day.tasks).length
  const writingAverage = snapshot.writingAttempts.flatMap((attempt) => attempt.feedback ? [average(Object.values(attempt.feedback.scores))] : [])
  return <>
    <PageHeader title="Progress" description="Progress is calculated from saved local activity, not placeholder streaks." />
    <div className="two-column-grid stats-grid"><StatCard label="Current path" value={`${snapshot.settings.currentLevel} -> ${snapshot.settings.targetLevel}`} detail="Personalised learning objective" /><StatCard label="Tasks completed this week" value={`${completedThisWeek.length}/${totalPossible}`} detail="Across your generated plan" /><StatCard label="Reading attempts" value={String(snapshot.readingAttempts.length)} detail="Saved comprehension results" /><StatCard label="Writing average" value={writingAverage.length ? `${Math.round(average(writingAverage) * 10)}%` : '-'} detail="From Ollama-scored submissions" /></div>
    <div className="two-column-grid"><section className="panel"><h2>Topics needing revision</h2>{weakTopics.map((topic) => <ProgressLine key={topic.id} topic={topic} />)}</section><section className="panel"><h2>Strong topics</h2>{strongTopics.map((topic) => <ProgressLine key={topic.id} topic={topic} />)}</section></div>
    <section className="panel"><h2>Recent activity</h2>{snapshot.taskCompletions.slice(0, 12).length ? <div className="history-list">{snapshot.taskCompletions.slice(0, 12).map((item) => <div key={item.id}><span>OK</span><div><strong>{item.taskId.split('-').slice(3).join(' ')}</strong><small>{new Date(item.completedAt).toLocaleString()}</small></div>{item.score !== undefined && <b>{Math.round(item.score)}%</b>}</div>)}</div> : <p className="muted">Complete your first activity to start the history.</p>}</section>
  </>
}

function SettingsView({ snapshot, onSave, onRefresh, onNotice }: { snapshot: LearningSnapshot; onSave: (settings: UserSettings) => Promise<void>; onRefresh: () => Promise<void>; onNotice: (value: string) => void }) {
  const [draft, setDraft] = useState(snapshot.settings)
  const [status, setStatus] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const save = async () => { await onSave({ ...draft, targetLevel: targetForLevel(draft.currentLevel) }); onNotice('Settings saved. Your plan has been regenerated.') }
  const checkAi = async (test = false) => { setStatus('Checking local Ollama...'); try { if (test) { const result = await testAi(aiConfigFromSettings(draft)); setStatus(result.message) } else { const result = await getAiStatus(aiConfigFromSettings(draft)); setStatus(`Connected. ${result.models.length} local model(s) detected.${result.selectedModelAvailable ? ' Selected model is available.' : ' Pull or select the configured model.'}`) } } catch (reason) { setStatus(errorMessage(reason)) } }
  const downloadBackup = async () => { const data = await exportSnapshot(); downloadJson(data, `french-path-backup-${toDateKey(new Date())}.json`) }
  const importBackup = async (event: ChangeEvent<HTMLInputElement>) => { const file = event.target.files?.[0]; if (!file) return; try { await importSnapshot(JSON.parse(await file.text()) as LearningSnapshot); await onRefresh(); onNotice('Backup imported successfully.') } catch { onNotice('The selected backup could not be imported.') } finally { event.target.value = '' } }
  const performReset = async () => { if (!window.confirm('Reset saved progress and return to onboarding?')) return; await resetProgress(); await onRefresh() }
  return <>
    <PageHeader title="Settings" description="All learning progress stays in your browser. Ollama requests go through the bundled local server." action={<button className="primary-button" onClick={() => void save()}>Save settings</button>} />
    <div className="two-column-grid"><section className="panel"><h2>Profile</h2><label className="field"><span>Name</span><input value={draft.learnerName} onChange={(event) => setDraft({ ...draft, learnerName: event.target.value })} /></label><label className="field"><span>Current level</span><select value={draft.currentLevel} onChange={(event) => { const currentLevel = event.target.value as LearningLevel; setDraft({ ...draft, currentLevel, targetLevel: targetForLevel(currentLevel) }) }}><option>A1</option><option>A2</option><option>B1</option></select></label><label className="field"><span>Target</span><input disabled value={draft.targetLevel} /></label><label className="field"><span>Explanation language</span><select value={draft.languageMode} onChange={(event) => setDraft({ ...draft, languageMode: event.target.value as 'en' | 'fr' })}><option value="en">English</option><option value="fr">French</option></select></label><Toggle label="Audio playback" checked={draft.speechEnabled} onChange={(speechEnabled) => setDraft({ ...draft, speechEnabled })} /><Toggle label="Speech recognition" checked={draft.speechRecognitionEnabled} onChange={(speechRecognitionEnabled) => setDraft({ ...draft, speechRecognitionEnabled })} /></section><section className="panel"><h2>Local Ollama assistant</h2><Toggle label="Enable Ollama integration" checked={draft.aiProvider === 'ollama'} onChange={(enabled) => setDraft({ ...draft, aiProvider: enabled ? 'ollama' : 'disabled' })} /><label className="field"><span>Ollama host</span><input value={draft.ollamaHost} onChange={(event) => setDraft({ ...draft, ollamaHost: event.target.value })} /></label><label className="field"><span>Model tag</span><input value={draft.aiModel} onChange={(event) => setDraft({ ...draft, aiModel: event.target.value })} /></label><label className="field"><span>Ollama timeout <small>(minutes)</small></span><input type="number" min={1} max={30} value={Math.round(draft.ollamaTimeoutMs / 60000)} onChange={(event) => setDraft({ ...draft, ollamaTimeoutMs: Math.max(1, Math.min(30, Number(event.target.value) || 10)) * 60000 })} /><small>Default is 10 minutes for long local generations.</small></label><div className="button-row"><button className="secondary-button" disabled={draft.aiProvider !== 'ollama'} onClick={() => void checkAi(false)}>Check connection</button><button className="secondary-button" disabled={draft.aiProvider !== 'ollama'} onClick={() => void checkAi(true)}>Send test prompt</button></div>{status && <p className="status-box">{status}</p>}</section></div>
    <section className="panel"><h2>Backup and reset</h2><p>Your browser stores progress in IndexedDB. Export a JSON backup before moving to another browser or computer.</p><div className="button-row"><button className="secondary-button" onClick={() => void downloadBackup()}>Export JSON backup</button><button className="secondary-button" onClick={() => fileRef.current?.click()}>Import backup</button><button className="danger-button" onClick={() => void performReset()}>Reset progress</button><input hidden type="file" accept="application/json" ref={fileRef} onChange={(event) => void importBackup(event)} /></div></section>
  </>
}

function Workspace({ snapshot, request, onClose, onDone, onRefresh }: { snapshot: LearningSnapshot; request: WorkspaceRequest; onClose: () => void; onDone: (score?: number) => Promise<void>; onRefresh: () => Promise<void> }) {
  return <div className="modal-backdrop"><div className="workspace-modal"><header><div><span className="eyebrow">{activityMeta[request.type].description}</span><h2>{request.task?.title ?? activityTitle(request.type)}</h2></div><button className="close-button" onClick={onClose}>x</button></header><div className="workspace-body">{request.type === 'grammar-lesson' && <GrammarLessonWorkspace snapshot={snapshot} contentId={request.contentId} onDone={onDone} />}{request.type === 'grammar-practice' && <GrammarPracticeWorkspace snapshot={snapshot} contentId={request.contentId} onDone={onDone} onRefresh={onRefresh} />}{request.type === 'vocabulary-review' && <VocabularyWorkspace snapshot={snapshot} contentId={request.contentId} onDone={onDone} onRefresh={onRefresh} />}{request.type === 'conjugation' && <ConjugationWorkspace snapshot={snapshot} contentId={request.contentId} onDone={onDone} onRefresh={onRefresh} />}{request.type === 'reading' && <ReadingWorkspace snapshot={snapshot} contentId={request.contentId} onDone={onDone} />}{request.type === 'writing' && <WritingWorkspace snapshot={snapshot} contentId={request.contentId} onDone={onDone} />}{request.type === 'pronunciation' && <PronunciationWorkspace snapshot={snapshot} expectedText={request.task?.detail} onDone={onDone} />}{request.type === 'weekly-review' && <WeeklyReviewWorkspace snapshot={snapshot} onDone={onDone} />}</div></div></div>
}

function GrammarLessonWorkspace({ snapshot, contentId, onDone }: { snapshot: LearningSnapshot; contentId?: string; onDone: (score?: number) => Promise<void> }) {
  const topic = snapshot.topics.find((item) => item.id === contentId) ?? [...snapshot.topics].filter((item) => item.level !== 'B2').sort((a, b) => a.confidence - b.confidence)[0]
  if (!topic) return <EmptyState title="No grammar topic found" description="The grammar library is empty." />
  return <div className="exercise lesson-workspace">
    <div className="lesson-workspace-content">
      <GrammarTopicContent topic={topic} language={snapshot.settings.languageMode} speechEnabled={snapshot.settings.speechEnabled} compact />
    </div>
    <div className="lesson-workspace-actions">
      <button className="primary-button" onClick={() => void onDone()}>Mark lesson complete</button>
    </div>
  </div>
}

function GrammarPracticeWorkspace({ snapshot, contentId, onDone, onRefresh }: { snapshot: LearningSnapshot; contentId?: string; onDone: (score?: number) => Promise<void>; onRefresh: () => Promise<void> }) {
  const topic = snapshot.topics.find((item) => item.id === contentId) ?? [...snapshot.topics].filter((item) => item.level !== 'B2').sort((a, b) => a.confidence - b.confidence)[0]
  const availableQuestions = snapshot.questions.filter((question) => question.topicId === topic?.id)
  const [setNumber, setSetNumber] = useState(1)
  const [questions, setQuestions] = useState(() => selectGrammarQuestionSet(availableQuestions, 10))
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [score, setScore] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  if (!questions.length || !topic) return <EmptyState title="No quiz available" description="Choose another grammar topic in Learn, or generate an AI practice set from Practice." />
  const percent = Math.round(score / questions.length * 100)
  const checkAll = async () => {
    const nextScore = questions.filter((question) => normalizeAnswer(answers[question.id] ?? '') === normalizeAnswer(question.correctAnswer)).length
    setScore(nextScore)
    setSubmitted(true)
    await Promise.all(questions.map((question) => updateTopicConfidence(
      topic.id,
      normalizeAnswer(answers[question.id] ?? '') === normalizeAnswer(question.correctAnswer),
      answers[question.id] ?? '',
      question.promptEn,
    )))
    await onRefresh()
  }
  const restart = () => {
    setQuestions(selectGrammarQuestionSet(availableQuestions, 10, setNumber))
    setSetNumber(setNumber + 1)
    setAnswers({})
    setScore(0)
    setSubmitted(false)
  }
  if (submitted) {
    return <div className="exercise"><span className="eyebrow">Completed · {topic.titleEn}</span><h3>Your score: {score}/{questions.length} · {percent}%</h3><p>{percent >= 80 ? 'Strong result. Start another set to confirm that the rule is stable.' : 'Review the explanation, then try another set with different questions.'}</p><div className="choice-grid">{questions.map((question, index) => { const prompt = snapshot.settings.languageMode === 'fr' ? question.promptFr : question.promptEn; const response = answers[question.id] ?? ''; const correct = normalizeAnswer(response) === normalizeAnswer(question.correctAnswer); return <fieldset key={question.id} className="grammar-question"><legend>{index + 1}. {prompt}</legend><Feedback correct={correct} answer={question.correctAnswer} explanation={snapshot.settings.languageMode === 'fr' ? question.explanationFr : question.explanationEn} /></fieldset> })}</div><div className="button-row"><button className="secondary-button" onClick={restart}>Start another 10-question set</button><button className="primary-button" onClick={() => void onDone(percent)}>Finish activity</button></div></div>
  }
  return <div className="exercise"><span className="eyebrow">10-question set · {topic.titleEn}</span><p className="helper">Grammar practice already includes both multiple-choice and typed fill-in questions. Answer all 10, then check the whole set at once.</p>{questions.map((question, index) => { const prompt = snapshot.settings.languageMode === 'fr' ? question.promptFr : question.promptEn; const answer = answers[question.id] ?? ''; const parts = inlinePromptParts(prompt); return <fieldset key={question.id} className="grammar-question"><legend>{index + 1}. {question.type === 'fill' && parts ? <span className="inline-answer-line">{parts.before}<input className="inline-answer-input" value={answer} onChange={(event) => setAnswers({ ...answers, [question.id]: event.target.value })} />{parts.after}</span> : prompt}</legend>{question.type === 'multiple-choice' && question.choices ? <div className="choice-grid">{question.choices.map((choice) => <button className={answer === choice ? 'selected' : ''} key={choice} onClick={() => setAnswers({ ...answers, [question.id]: choice })}>{choice}</button>)}</div> : question.type === 'fill' && !parts ? <input className="large-input" value={answer} onChange={(event) => setAnswers({ ...answers, [question.id]: event.target.value })} placeholder="Type your answer" /> : null}</fieldset> })}<button className="primary-button" disabled={questions.some((question) => !(answers[question.id] ?? '').trim())} onClick={() => void checkAll()}>Check all answers</button></div>
}

function VocabSetBuilder({ currentLevel, onCreated }: { currentLevel: LearningLevel; onCreated: (deckId: string) => Promise<void> }) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [level, setLevel] = useState<LearningLevel>(currentLevel)
  const [tags, setTags] = useState('personal,imported')
  const [rows, setRows] = useState<ParsedVocabRow[]>([])
  const [manualFr, setManualFr] = useState('')
  const [manualEn, setManualEn] = useState('')
  const [csvText, setCsvText] = useState('frontFr,backEn,exampleFr,exampleEn,tags\nbonjour,hello,Bonjour tout le monde.,Hello everyone.,greeting')
  const [error, setError] = useState('')

  const addManual = () => {
    if (!manualFr.trim() || !manualEn.trim()) return
    setRows((current) => [...current, { frontFr: manualFr.trim(), backEn: manualEn.trim(), tags: splitLooseTags(tags) }])
    setManualFr('')
    setManualEn('')
  }
  const importCsv = () => {
    const parsed = parseVocabCsv(csvText)
    if (!parsed.length) {
      setError('No valid rows were found in the CSV. Use at least frontFr and backEn columns.')
      return
    }
    setRows((current) => [...current, ...parsed])
    setError('')
  }
  const importFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const parsed = parseVocabCsv(await file.text())
    if (!parsed.length) setError('That file did not contain valid vocabulary rows.')
    else {
      setRows((current) => [...current, ...parsed])
      setError('')
    }
    event.target.value = ''
  }
  const saveSet = async () => {
    if (!title.trim() || rows.length === 0) {
      setError('Add a set title and at least one vocabulary row before saving.')
      return
    }
    const deck = createPersonalDeck(title, description, level, splitLooseTags(tags))
    const cards = createPersonalCards(deck.id, rows)
    await saveDeckWithCards(deck, cards)
    await onCreated(deck.id)
    setTitle('')
    setDescription('')
    setRows([])
    setError('')
  }

  return <section className="builder-panel"><div className="split-header"><div><span className="eyebrow">Create vocabulary set</span><h3>Build your own Quizlet-style set</h3><p className="helper">Add cards one by one or bulk import them from CSV.</p></div><div className="button-row"><button className="secondary-button" onClick={() => fileRef.current?.click()}>Upload CSV</button><input hidden ref={fileRef} type="file" accept=".csv,text/csv" onChange={(event) => void importFile(event)} /></div></div><div className="two-column-grid"><label className="field"><span>Set title</span><input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Week 1 essentials" /></label><label className="field"><span>Level</span><select value={level} onChange={(event) => setLevel(event.target.value as LearningLevel)}><option value="A1">A1</option><option value="A2">A2</option><option value="B1">B1</option></select></label></div><label className="field"><span>Description</span><input value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Useful words for work, travel, or a textbook chapter." /></label><label className="field"><span>Tags</span><input value={tags} onChange={(event) => setTags(event.target.value)} placeholder="travel,chapter-2,verbs" /></label><div className="two-column-grid"><label className="field"><span>French term</span><input value={manualFr} onChange={(event) => setManualFr(event.target.value)} /></label><label className="field"><span>English meaning</span><input value={manualEn} onChange={(event) => setManualEn(event.target.value)} /></label></div><div className="button-row"><button className="secondary-button" onClick={addManual}>Add card manually</button></div><label className="field"><span>CSV paste area</span><textarea rows={6} value={csvText} onChange={(event) => setCsvText(event.target.value)} /></label><div className="button-row"><button className="secondary-button" onClick={importCsv}>Import pasted CSV</button><button className="primary-button" onClick={() => void saveSet()}>Save set</button></div>{error && <ErrorBox text={error} />}{rows.length > 0 && <div className="summary-strip"><strong>{rows.length} cards ready</strong><span>{rows.slice(0, 3).map((row) => row.frontFr).join(' · ')}</span></div>}</section>
}

function VocabularyWorkspace({ snapshot, contentId, onDone, onRefresh }: { snapshot: LearningSnapshot; contentId?: string; onDone: (score?: number) => Promise<void>; onRefresh: () => Promise<void> }) {
  const due = snapshot.cards.filter((card) => new Date(card.dueAt).getTime() <= Date.now())
  const sourceCards = contentId ? snapshot.cards.filter((card) => card.deckId === contentId) : due.length ? due : snapshot.cards
  const cards = sourceCards.slice(0, 12)
  const [mode, setMode] = useState<'flashcards' | 'write' | 'match'>('flashcards')
  const [index, setIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [positive, setPositive] = useState(0)
  const [typedAnswer, setTypedAnswer] = useState('')
  const [typedResult, setTypedResult] = useState<boolean | null>(null)
  const [matchPairs, setMatchPairs] = useState(() => buildMatchPairs(cards, Math.min(6, cards.length)))
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [matchedIds, setMatchedIds] = useState<string[]>([])
  const [matchMistakes, setMatchMistakes] = useState(0)
  const card = cards[index]

  if (!card) return <EmptyState title="No flashcards found" description="There are no cards in this deck." />

  const finishWithScore = (value: number) => void onDone(Math.round(value))
  const rate = async (rating: 'again' | 'difficult' | 'good' | 'easy') => {
    await updateCardReview(card.id, rating)
    const nextPositive = positive + (rating === 'good' || rating === 'easy' ? 1 : 0)
    if (rating === 'good' || rating === 'easy') setPositive(nextPositive)
    await onRefresh()
    if (index + 1 >= cards.length) finishWithScore((nextPositive / cards.length) * 100)
    else { setIndex(index + 1); setRevealed(false) }
  }
  const checkTyped = async () => {
    const correct = normalizeAnswer(typedAnswer) === normalizeAnswer(card.backEn)
    setTypedResult(correct)
    await updateCardReview(card.id, correct ? 'good' : 'again')
    await onRefresh()
  }
  const nextTyped = () => {
    const nextIndex = index + 1
    const earned = positive + (typedResult ? 1 : 0)
    if (typedResult) setPositive(earned)
    if (nextIndex >= cards.length) finishWithScore((earned / cards.length) * 100)
    else {
      setIndex(nextIndex)
      setTypedAnswer('')
      setTypedResult(null)
    }
  }
  const prompts = matchPairs.filter((pair) => !matchedIds.includes(pair.cardId))
  const answers = useMemo(() => shuffle(prompts.map((pair) => ({ cardId: pair.cardId, answer: pair.answer }))), [prompts])
  const pickMatch = async (value: string, type: 'prompt' | 'answer') => {
    const nextPrompt = type === 'prompt' ? value : selectedPrompt
    const nextAnswer = type === 'answer' ? value : selectedAnswer
    if (type === 'prompt') setSelectedPrompt(value)
    else setSelectedAnswer(value)
    if (!nextPrompt || !nextAnswer) return

    const pair = matchPairs.find((item) => item.prompt === nextPrompt)
    if (pair?.answer === nextAnswer) {
      const nextMatched = [...matchedIds, pair.cardId]
      setMatchedIds(nextMatched)
      await updateCardReview(pair.cardId, 'good')
      await onRefresh()
      if (nextMatched.length >= matchPairs.length) {
        const accuracy = ((matchPairs.length - matchMistakes) / matchPairs.length) * 100
        finishWithScore(Math.max(0, accuracy))
      }
    } else {
      setMatchMistakes((current) => current + 1)
    }
    setSelectedPrompt(null)
    setSelectedAnswer(null)
  }
  const resetMatch = () => {
    setMatchPairs(buildMatchPairs(cards, Math.min(6, cards.length)))
    setMatchedIds([])
    setMatchMistakes(0)
    setSelectedPrompt(null)
    setSelectedAnswer(null)
  }

  return <div className="exercise"><div className="study-toolbar"><div><span className="eyebrow">Vocabulary study</span><h3>{contentId ? 'Focused set practice' : 'Review queue'}</h3></div><div className="tab-bar compact-tabs"><button className={mode === 'flashcards' ? 'active' : ''} onClick={() => setMode('flashcards')}>Flashcards</button><button className={mode === 'write' ? 'active' : ''} onClick={() => setMode('write')}>Write</button><button className={mode === 'match' ? 'active' : ''} onClick={() => { setMode('match'); resetMatch() }}>Match</button></div></div>{mode === 'flashcards' && <div className="flashcard-exercise"><span className="eyebrow">Card {index + 1} of {cards.length}</span><button className={`flashcard ${revealed ? 'revealed' : ''}`} onClick={() => setRevealed(true)}><strong>{card.frontFr}</strong>{revealed ? <><b>{card.backEn}</b><span>{card.exampleFr}</span><small>{card.exampleEn}</small></> : <small>Click to reveal</small>}</button>{revealed && <div className="rating-grid"><button onClick={() => void rate('again')}>Again</button><button onClick={() => void rate('difficult')}>Difficult</button><button onClick={() => void rate('good')}>Good</button><button onClick={() => void rate('easy')}>Easy</button></div>}</div>}{mode === 'write' && <div className="quizlet-panel"><span className="eyebrow">Write mode · {index + 1} of {cards.length}</span><h3>{card.frontFr}</h3><p>{card.exampleFr}</p><input value={typedAnswer} disabled={typedResult !== null} onChange={(event) => setTypedAnswer(event.target.value)} placeholder="Type the English meaning" />{typedResult !== null && <Feedback correct={typedResult} answer={card.backEn} explanation={card.exampleEn} />}{typedResult === null ? <button className="primary-button" disabled={!typedAnswer.trim()} onClick={() => void checkTyped()}>Check answer</button> : <button className="primary-button" onClick={nextTyped}>{index + 1 >= cards.length ? 'Finish activity' : 'Next card'}</button>}</div>}{mode === 'match' && <div className="quizlet-panel"><div className="summary-strip"><strong>{matchedIds.length}/{matchPairs.length} pairs matched</strong><span>{matchMistakes} mismatches</span></div><div className="match-grid"><div><h4>French</h4><div className="choice-grid">{prompts.map((pair) => <button key={pair.cardId} className={selectedPrompt === pair.prompt ? 'selected' : ''} onClick={() => void pickMatch(pair.prompt, 'prompt')}>{pair.prompt}</button>)}</div></div><div><h4>English</h4><div className="choice-grid">{answers.map((pair) => <button key={pair.cardId} className={selectedAnswer === pair.answer ? 'selected' : ''} onClick={() => void pickMatch(pair.answer, 'answer')}>{pair.answer}</button>)}</div></div></div>{prompts.length === 0 && <div className="result-footer"><strong>Set complete</strong><button className="primary-button" onClick={() => finishWithScore(((matchPairs.length - matchMistakes) / matchPairs.length) * 100)}>Finish activity</button></div>}</div>}</div>
}
function ConjugationWorkspace({ snapshot, contentId, onDone, onRefresh }: { snapshot: LearningSnapshot; contentId?: string; onDone: (score?: number) => Promise<void>; onRefresh: () => Promise<void> }) {
  const verbs = contentId ? snapshot.verbs.filter((verb) => verb.id === contentId) : [...snapshot.verbs].filter((verb) => verb.level !== 'B2').sort((a, b) => average(Object.values(a.mastery)) - average(Object.values(b.mastery))).slice(0, 24)
  const tenseOptions = [...new Set(verbs.flatMap((verb) => Object.keys(verb.conjugations)))]
  const [mode, setMode] = useState<'write' | 'multiple-choice'>('write')
  const [tenseFilter, setTenseFilter] = useState<string>('all')
  const [rounds, setRounds] = useState(() => buildConjugationRounds(verbs, 10, 'all', 'write'))
  const [index, setIndex] = useState(0)
  const [answer, setAnswer] = useState('')
  const [result, setResult] = useState<boolean | null>(null)
  const [score, setScore] = useState(0)
  const round = rounds[index]

  const restart = (nextMode = mode, nextTense = tenseFilter) => {
    setRounds(buildConjugationRounds(verbs, 10, nextTense, nextMode))
    setIndex(0)
    setAnswer('')
    setResult(null)
    setScore(0)
    setMode(nextMode)
    setTenseFilter(nextTense)
  }

  if (!round) return <EmptyState title="No verb exercise found" description="The selected verb does not contain conjugation forms." />

  const check = async () => {
    const correct = normalizeAnswer(answer) === normalizeAnswer(round.correct)
    setResult(correct)
    if (correct) setScore((current) => current + 1)
    await updateVerbMastery(round.verb.id, round.tense, correct, answer, `${round.person} ${round.verb.infinitive}`)
    await onRefresh()
  }
  const next = () => {
    const nextIndex = index + 1
    if (nextIndex >= rounds.length) void onDone((score / rounds.length) * 100)
    else { setIndex(nextIndex); setAnswer(''); setResult(null) }
  }

  return <div className="exercise"><div className="study-toolbar"><div><span className="eyebrow">Practice verb forms</span><h3>{contentId ? round.verb.infinitive : 'Conjugation'}</h3></div><div className="study-controls"><label className="field inline"><span>Mode</span><select value={mode} onChange={(event) => restart(event.target.value as 'write' | 'multiple-choice', tenseFilter)}><option value="write">Write</option><option value="multiple-choice">Multiple choice</option></select></label><label className="field inline"><span>Tense</span><select value={tenseFilter} onChange={(event) => restart(mode, event.target.value)}><option value="all">All tenses</option>{tenseOptions.map((tense) => <option key={tense} value={tense}>{humanTense(tense)}</option>)}</select></label></div></div><span className="eyebrow">{index + 1}/{rounds.length} · {humanTense(round.tense)}</span><h3><em>{round.verb.infinitive}</em></h3>{mode === 'write' ? <p className="prompt-line">{round.person}<input value={answer} disabled={result !== null} onChange={(event) => setAnswer(event.target.value)} autoFocus /></p> : <div className="quizlet-panel"><div className="choice-grid">{round.choices.map((choice) => <button className={answer === choice ? 'selected' : ''} key={choice} onClick={() => setAnswer(choice)}>{choice}</button>)}</div></div>}{result !== null && <Feedback correct={result} answer={round.correct} explanation={`${round.person} ${round.correct}`} />}{result === null ? <button className="primary-button" disabled={!answer} onClick={() => void check()}>Check answer</button> : <button className="primary-button" onClick={next}>{index + 1 >= rounds.length ? 'Finish activity' : 'Next verb'}</button>}</div>
}
function ReadingWorkspace({ snapshot, contentId, onDone }: { snapshot: LearningSnapshot; contentId?: string; onDone: (score?: number) => Promise<void> }) {
  const all = [...snapshot.generatedReadings, ...curatedReadingExercises].filter((exercise, index, array) => array.findIndex((item) => item.id === exercise.id) === index && exercise.level !== 'B2')
  const [selectedId, setSelectedId] = useState(contentId ?? all.find((item) => item.level === snapshot.settings.currentLevel)?.id ?? all[0]?.id)
  const [answers, setAnswers] = useState<Record<string, string>>({}); const [submitted, setSubmitted] = useState(false); const [score, setScore] = useState(0)
  const exercise = all.find((item) => item.id === selectedId) ?? all[0]
  if (!exercise) return <EmptyState title="No reading exercise found" description="The reading bank is empty." />
  const submit = async () => { const correct = exercise.questions.filter((question) => answers[question.id] === question.correctAnswer).length; const percent = Math.round((correct / exercise.questions.length) * 100); setScore(percent); setSubmitted(true); await saveReadingAttempt({ id: crypto.randomUUID(), exerciseId: exercise.id, answers, score: percent, completedAt: new Date().toISOString() }) }
  return <div className="exercise reading-exercise"><label className="field inline"><span>Exercise</span><select value={exercise.id} disabled={Boolean(contentId)} onChange={(event) => { setSelectedId(event.target.value); setAnswers({}); setSubmitted(false) }}>{all.slice(0, 180).map((item) => <option key={item.id} value={item.id}>{item.level} · {item.title ?? item.titleEn ?? item.id}</option>)}</select></label><span className="eyebrow">{exercise.level} · {exercise.theme ?? 'Reading'}</span><h3>{exercise.title ?? exercise.titleEn ?? 'Reading comprehension'}</h3><article className="passage">{exercise.text}</article>{exercise.questions.map((question, index) => <fieldset key={question.id}><legend>{index + 1}. {question.prompt ?? question.promptFr ?? question.promptEn}</legend>{question.choices.map((choice) => <label className="choice" key={choice}><input type="radio" name={question.id} disabled={submitted} checked={answers[question.id] === choice} onChange={() => setAnswers({ ...answers, [question.id]: choice })} />{choice}</label>)}{submitted && <Feedback correct={answers[question.id] === question.correctAnswer} answer={question.correctAnswer} explanation={question.explanation ?? question.explanationFr ?? question.explanationEn ?? ''} />}</fieldset>)}{submitted ? <div className="result-footer"><strong>Score: {score}%</strong><button className="primary-button" onClick={() => void onDone(score)}>Finish activity</button></div> : <button className="primary-button" disabled={Object.keys(answers).length !== exercise.questions.length} onClick={() => void submit()}>Submit answers</button>}</div>
}

function WritingWorkspace({ snapshot, contentId, onDone }: { snapshot: LearningSnapshot; contentId?: string; onDone: (score?: number) => Promise<void> }) {
  const prompts = curatedWritingPrompts.filter((prompt) => prompt.level !== 'B2')
  const [selectedId, setSelectedId] = useState(contentId ?? prompts.find((item) => item.level === snapshot.settings.currentLevel)?.id ?? prompts[0]?.id)
  const [text, setText] = useState(''); const [evaluation, setEvaluation] = useState<WritingEvaluation | null>(null); const [loading, setLoading] = useState(false); const [error, setError] = useState('')
  const prompt = prompts.find((item) => item.id === selectedId) ?? prompts[0]
  if (!prompt) return <EmptyState title="No writing prompt found" description="The writing bank is empty." />
  const task = writingTask(prompt); const checklist = writingChecklist(prompt)
  const saveOnly = async () => { const attempt: WritingAttempt = { id: crypto.randomUUID(), promptId: prompt.id, originalText: text, completedAt: new Date().toISOString() }; await saveWritingAttempt(attempt); await onDone() }
  const requestEvaluation = async () => { setLoading(true); setError(''); try { const result = await evaluateWriting(aiConfigFromSettings(snapshot.settings), { level: snapshot.settings.currentLevel, task, checklist, text }); setEvaluation(result); await saveWritingAttempt({ id: crypto.randomUUID(), promptId: prompt.id, originalText: text, correctedText: result.correctedText, feedback: result, completedAt: new Date().toISOString() }) } catch (reason) { setError(errorMessage(reason)) } finally { setLoading(false) } }
  const total = evaluation ? average(Object.values(evaluation.scores)) * 10 : undefined
  return <div className="exercise"><label className="field inline"><span>Prompt</span><select value={prompt.id} disabled={Boolean(contentId)} onChange={(event) => { setSelectedId(event.target.value); setEvaluation(null); setText('') }}>{prompts.map((item) => <option key={item.id} value={item.id}>{item.level} · {item.title ?? item.titleEn ?? item.id}</option>)}</select></label><span className="eyebrow">{prompt.level} writing</span><h3>{prompt.title ?? prompt.titleEn}</h3><p>{task}</p><ul className="checklist">{checklist.map((item) => <li key={item}>{item}</li>)}</ul><textarea rows={10} value={text} onChange={(event) => setText(event.target.value)} placeholder={prompt.starter ?? prompt.starterSentence ?? 'Start writing in French...'} /><div className="button-row"><button className="secondary-button" disabled={!text.trim()} onClick={() => void saveOnly()}>Save without AI</button><button className="primary-button" disabled={!text.trim() || loading || snapshot.settings.aiProvider !== 'ollama'} onClick={() => void requestEvaluation()}>{loading ? 'Evaluating...' : 'Evaluate with Ollama'}</button></div>{snapshot.settings.aiProvider !== 'ollama' && <p className="helper">Enable Ollama in Settings for correction and scoring. You can still save your writing locally.</p>}{error && <ErrorBox text={error} />}{evaluation && <div className="ai-box"><h3>Writing feedback · {Math.round(total ?? 0)}%</h3><div className="score-grid">{Object.entries(evaluation.scores).map(([label, value]) => <div key={label}><span>{humanCamel(label)}</span><strong>{value}/10</strong></div>)}</div><h4>Corrected version</h4><p>{evaluation.correctedText}</p><h4>Important corrections</h4><ul>{evaluation.importantMistakes.map((mistake, index) => <li key={`${mistake.original}-${index}`}><strong>{mistake.original}</strong> to {mistake.correction}<small>{mistake.explanation}</small></li>)}</ul><p><strong>Next grammar focus:</strong> {evaluation.recommendedGrammarTopic}</p><button className="primary-button" onClick={() => void onDone(total)}>Finish activity</button></div>}</div>
}

function PronunciationWorkspace({ snapshot, expectedText, onDone }: { snapshot: LearningSnapshot; expectedText?: string; onDone: (score?: number) => Promise<void> }) {
  const promptOptions = useMemo(() => buildPronunciationPrompts(snapshot, expectedText), [snapshot, expectedText])
  const [promptIndex, setPromptIndex] = useState(0)
  const [expected, setExpected] = useState(promptOptions[0] ?? expectedText ?? 'Je voudrais prendre rendez-vous jeudi apres-midi.')
  const [recognized, setRecognized] = useState('')
  const [listening, setListening] = useState(false)
  const [feedback, setFeedback] = useState<PronunciationFeedback | null>(null)
  const [error, setError] = useState('')
  const similarity = recognized ? Math.round(textSimilarity(expected, recognized) * 100) : 0
  const choosePrompt = (nextIndex: number) => {
    if (!promptOptions.length) return
    const safeIndex = ((nextIndex % promptOptions.length) + promptOptions.length) % promptOptions.length
    setPromptIndex(safeIndex)
    setExpected(promptOptions[safeIndex] ?? expected)
    setRecognized('')
    setFeedback(null)
    setError('')
  }
  const record = () => {
    const Recognition = getSpeechRecognition()
    if (!Recognition) { setError('Speech recognition is not available in this browser. Type the recognized phrase manually or use a Chromium-based browser.'); return }
    const recognition = new Recognition(); recognition.lang = 'fr-FR'; recognition.interimResults = false; recognition.maxAlternatives = 1
    let receivedResult = false
    let handledError = false
    recognition.onstart = () => { setListening(true); setError('') }
    recognition.onend = () => {
      setListening(false)
      if (!receivedResult && !handledError) {
        setError('No speech was detected. Try again, speak a bit louder, or type the transcription manually.')
      }
    }
    recognition.onerror = (event: SpeechRecognitionErrorEventLike) => {
      setListening(false)
      if (receivedResult || event.error === 'aborted') return
      handledError = true
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        setError('Microphone access is blocked. Allow microphone permission in the browser, then try again.')
        return
      }
      if (event.error === 'audio-capture') {
        setError('No microphone was found. Check your microphone connection or browser input device.')
        return
      }
      if (event.error === 'network') {
        setError('Speech recognition hit a network problem. Try again in a moment or type the transcription manually.')
        return
      }
      if (event.error === 'no-speech') {
        setError('No speech was detected. Try again, speak a bit louder, or type the transcription manually.')
        return
      }
      setError('The browser could not capture the phrase. Try again or type the transcription manually.')
    }
    recognition.onresult = (event: SpeechRecognitionEventLike) => {
      const transcript = event.results[0]?.[0]?.transcript?.trim()
      if (!transcript) return
      receivedResult = true
      setRecognized(transcript)
      setError('')
    }
    recognition.start()
  }
  const finish = async () => { const attempt: PronunciationAttempt = { id: crypto.randomUUID(), expectedText: expected, recognizedText: recognized, similarity, feedback: feedback?.feedback, completedAt: new Date().toISOString() }; await savePronunciationAttempt(attempt); await onDone(similarity) }
  const askAi = async () => { try { setFeedback(await getPronunciationFeedback(aiConfigFromSettings(snapshot.settings), expected, recognized)) } catch (reason) { setError(errorMessage(reason)) } }
  return <div className="exercise"><p className="helper">This first version compares browser speech-to-text with the expected sentence. It is useful practice feedback, but it is not a phonetic diagnosis.</p><div className="summary-strip"><strong>{promptOptions.length.toLocaleString()} pronunciation prompts available</strong><span>Phrase {Math.min(promptIndex + 1, promptOptions.length)} of {promptOptions.length}</span></div><label className="field"><span>Phrase to read aloud</span><textarea rows={3} value={expected} onChange={(event) => setExpected(event.target.value)} /></label><div className="button-row"><button className="secondary-button" disabled={promptOptions.length <= 1} onClick={() => choosePrompt(promptIndex + 1)}>Next phrase</button><button className="secondary-button" disabled={promptOptions.length <= 1} onClick={() => choosePrompt(Math.floor(Math.random() * promptOptions.length))}>Random phrase</button><SpeakButton text={expected} enabled={snapshot.settings.speechEnabled} label="Listen" /><button className="primary-button" onClick={record}>{listening ? 'Listening...' : 'Start microphone'}</button></div><label className="field"><span>Recognized text <small>(editable fallback)</small></span><textarea rows={3} value={recognized} onChange={(event) => setRecognized(event.target.value)} placeholder="Your browser transcription will appear here." /></label>{recognized && <div className="summary-strip"><strong>Approximate text match: {similarity}%</strong><span>{similarity >= 85 ? 'Very close' : similarity >= 60 ? 'Good start - repeat slowly' : 'Focus on short sections'}</span></div>}{error && <ErrorBox text={error} />}<div className="button-row"><button className="secondary-button" disabled={!recognized || snapshot.settings.aiProvider !== 'ollama'} onClick={() => void askAi()}>Ask Ollama for practice advice</button><button className="primary-button" disabled={!recognized} onClick={() => void finish()}>Save and finish</button></div>{feedback && <div className="ai-box"><h3>Pronunciation practice advice</h3><p>{feedback.feedback}</p><h4>Focus words</h4><p>{feedback.focusWords.join(' · ')}</p><h4>Try these phrases</h4><ul>{feedback.practicePhrases.map((phrase) => <li key={phrase}>{phrase}</li>)}</ul></div>}</div>
}

function WeeklyReviewWorkspace({ snapshot, onDone }: { snapshot: LearningSnapshot; onDone: (score?: number) => Promise<void> }) {
  const mistakes = snapshot.attempts.filter((attempt) => !attempt.correct).slice(0, 12)
  return <div className="exercise"><p>Review the items that recently caused difficulty. Repeating them in the next sessions will strengthen retention.</p>{mistakes.length ? <div className="history-list">{mistakes.map((attempt, index) => <div key={`${attempt.itemId}-${index}`}><span>!</span><div><strong>{attempt.label}</strong><small>Your answer: {attempt.answer || 'No answer'}</small></div></div>)}</div> : <EmptyState title="No recent mistakes" description="Great work. Complete the review to keep the weekly rhythm." />}<button className="primary-button" onClick={() => void onDone()}>Complete weekly review</button></div>
}

function Feedback({ correct, answer, explanation }: { correct: boolean; answer: string; explanation: string }) { return <div className={`feedback ${correct ? 'correct' : 'incorrect'}`}><strong>{correct ? 'Correct' : `Correct answer: ${answer}`}</strong>{explanation && <p>{explanation}</p>}</div> }
function ErrorBox({ text }: { text: string }) { return <div className="error-box">{text}</div> }
function EmptyState({ title, description }: { title: string; description: string }) { return <div className="empty-state"><h3>{title}</h3><p>{description}</p></div> }
function Meter({ value }: { value: number }) { return <div className="meter"><span style={{ width: `${Math.max(2, Math.min(100, value))}%` }} /></div> }
function ProgressRing({ value }: { value: number }) { return <div className="progress-ring" style={{ '--progress': `${value * 3.6}deg` } as React.CSSProperties}><div><strong>{value}%</strong><small>complete</small></div></div> }
function StatCard({ label, value, detail }: { label: string; value: string; detail: string }) { return <article className="stat-card"><span>{label}</span><strong>{value}</strong><small>{detail}</small></article> }
function ProgressLine({ topic }: { topic: SkillTopic }) { return <div className="progress-line"><div><strong>{topic.titleEn}</strong><small>{topic.level} · {topic.area}</small></div><Meter value={topic.confidence} /><b>{topic.confidence}%</b></div> }
function SpeakButton({ text, enabled, label = 'Play audio' }: { text: string; enabled: boolean; label?: string }) { const speak = () => { if (!enabled || !('speechSynthesis' in window)) return; window.speechSynthesis.cancel(); const utterance = new SpeechSynthesisUtterance(text); utterance.lang = 'fr-FR'; window.speechSynthesis.speak(utterance) }; return <button type="button" className="speak-button" disabled={!enabled} onClick={speak}>{label}</button> }

function selectGrammarQuestionSet(questions: LearningSnapshot['questions'], count: number, salt = Date.now()) {
  const preferred = questions.filter((question) => question.id.startsWith('gq-v2-'))
  const source = preferred.length >= count ? preferred : questions
  const shuffled = [...source]
  let seed = Math.abs(Math.floor(salt)) || 1
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    seed = (seed * 1664525 + 1013904223) >>> 0
    const swapIndex = seed % (index + 1)
    ;[shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]]
  }
  return shuffled.slice(0, count)
}

function inlinePromptParts(prompt: string) {
  const match = prompt.match(/_{2,}|-{2,}|\.{3,}/)
  if (!match || match.index === undefined) return null
  return {
    before: prompt.slice(0, match.index),
    after: prompt.slice(match.index + match[0].length),
  }
}

function buildPronunciationPrompts(snapshot: LearningSnapshot, preferred?: string) {
  const prompts = new Set<string>()
  const addPrompt = (value?: string) => {
    const prompt = value?.trim()
    if (!prompt || prompt.length < 2) return
    prompts.add(prompt.replace(/\s+/g, ' '))
  }
  addPrompt(preferred)
  addPrompt('Je voudrais prendre rendez-vous jeudi apres-midi.')

  snapshot.topics.forEach((topic) => {
    topic.examples.forEach(addPrompt)
    addPrompt(`${topic.titleFr}.`)
  })

  snapshot.cards.forEach((card) => {
    addPrompt(card.exampleFr)
    addPrompt(`Je repete : ${card.frontFr}.`)
    addPrompt(`Le mot du jour est ${card.frontFr}.`)
  })

  snapshot.verbs.forEach((verb) => {
    const present = verb.conjugations.present
    if (!present) return
    if (present.je) addPrompt(`Je ${present.je}.`)
    if (present.tu) addPrompt(`Tu ${present.tu}.`)
    if (present['il/elle']) addPrompt(`Il ${present['il/elle']}.`)
    if (present.nous) addPrompt(`Nous ${present.nous}.`)
    if (present.vous) addPrompt(`Vous ${present.vous}.`)
    if (present['ils/elles']) addPrompt(`Ils ${present['ils/elles']}.`)
  })

  if (prompts.size < 1200) {
    const sample = snapshot.cards.slice(0, 60)
    for (let index = 0; index < sample.length && prompts.size < 1200; index += 1) {
      for (let offset = 0; offset < sample.length && prompts.size < 1200; offset += 1) {
        if (index === offset) continue
        addPrompt(`Je revise ${sample[index].frontFr} et ${sample[offset].frontFr}.`)
      }
    }
  }

  return [...prompts]
}

function splitLooseTags(value: string) {
  return value.split(',').map((item) => item.trim()).filter(Boolean)
}

function makeVerbRounds(verbs: VerbEntry[], count: number) {
  const persons = ['je', 'tu', 'il/elle', 'nous', 'vous', 'ils/elles']
  const rounds: Array<{ verb: VerbEntry; tense: string; person: string; correct: string }> = []
  for (let index = 0; index < count; index += 1) {
    const verb = verbs[index % Math.max(1, verbs.length)]
    if (!verb) break
    const tenses = Object.keys(verb.conjugations)
    const tense = tenses[index % tenses.length]
    const person = persons[(index * 2) % persons.length]
    const correct = verb.conjugations[tense]?.[person]
    if (correct) rounds.push({ verb, tense, person, correct })
  }
  return rounds
}
function writingTask(prompt: WritingPrompt) { return prompt.task ?? prompt.descriptionEn ?? prompt.descriptionFr ?? 'Write a short answer in French.' }
function writingChecklist(prompt: WritingPrompt) { return prompt.checklist ?? prompt.grammarChecklist ?? [] }
function humanTense(value: string) { return ({ present: 'Present', passeCompose: 'Passe compose', imparfait: 'Imparfait', futurSimple: 'Futur simple', subjunctive: 'Subjonctif' } as Record<string, string>)[value] ?? value }
function humanCamel(value: string) { return value.replace(/([A-Z])/g, ' $1').replace(/^./, (match) => match.toUpperCase()) }
function activityTitle(type: ActivityType) { return type.split('-').map(capitalize).join(' ') }
function capitalize(value: string) { return value.charAt(0).toUpperCase() + value.slice(1) }
function average(values: number[]) { return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0 }
function errorMessage(reason: unknown) { return reason instanceof Error ? reason.message : 'Something went wrong.' }
function downloadJson(data: unknown, filename: string) { const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }); const url = URL.createObjectURL(blob); const anchor = document.createElement('a'); anchor.href = url; anchor.download = filename; anchor.click(); URL.revokeObjectURL(url) }
function textSimilarity(a: string, b: string) { const left = normalizeAnswer(a); const right = normalizeAnswer(b); if (!left && !right) return 1; const matrix = Array.from({ length: right.length + 1 }, (_, row) => [row]); for (let column = 0; column <= left.length; column += 1) matrix[0][column] = column; for (let row = 1; row <= right.length; row += 1) for (let column = 1; column <= left.length; column += 1) matrix[row][column] = right[row - 1] === left[column - 1] ? matrix[row - 1][column - 1] : Math.min(matrix[row - 1][column - 1], matrix[row][column - 1], matrix[row - 1][column]) + 1; return 1 - matrix[right.length][left.length] / Math.max(left.length, right.length, 1) }

interface SpeechRecognitionEventLike { results: ArrayLike<{ [index: number]: { transcript: string } }> }
interface SpeechRecognitionErrorEventLike { error: 'aborted' | 'audio-capture' | 'network' | 'no-speech' | 'not-allowed' | 'service-not-allowed' | string }
interface RecognitionLike { lang: string; interimResults: boolean; maxAlternatives: number; onstart: (() => void) | null; onend: (() => void) | null; onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null; onresult: ((event: SpeechRecognitionEventLike) => void) | null; start: () => void }
function getSpeechRecognition(): (new () => RecognitionLike) | undefined { const extended = window as typeof window & { SpeechRecognition?: new () => RecognitionLike; webkitSpeechRecognition?: new () => RecognitionLike }; return extended.SpeechRecognition ?? extended.webkitSpeechRecognition }


