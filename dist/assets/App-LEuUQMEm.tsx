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
import { getBookGrammarContent, type BookHighlightColor } from './bookGrammar'
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
  AiProvider,
} from './types'
import { dayKeys } from './types'
import './App.css'

type IconName = 'calendar' | 'map' | 'book' | 'target' | 'chart' | 'settings' | 'lesson' | 'quiz' | 'cards' | 'verb' | 'reading' | 'writing' | 'mic' | 'review' | 'check' | 'flag'

const navItems: Array<{ id: 'plan' | 'learn' | 'practice' | 'progress' | 'settings'; label: string; icon: IconName }> = [
  { id: 'plan', label: 'My plan', icon: 'map' },
  { id: 'learn', label: 'Learn', icon: 'book' },
  { id: 'practice', label: 'Practice', icon: 'target' },
  { id: 'progress', label: 'Progress', icon: 'chart' },
  { id: 'settings', label: 'Settings', icon: 'settings' },
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
const activityMeta: Record<ActivityType, { icon: IconName; description: string }> = {
  'grammar-lesson': { icon: 'lesson', description: 'Learn or revise a grammar rule' },
  'grammar-practice': { icon: 'quiz', description: 'Answer targeted grammar questions' },
  'vocabulary-review': { icon: 'cards', description: 'Review due flashcards' },
  conjugation: { icon: 'verb', description: 'Practise verb forms' },
  reading: { icon: 'reading', description: 'Read a passage and answer questions' },
  writing: { icon: 'writing', description: 'Write and receive local AI feedback' },
  pronunciation: { icon: 'mic', description: 'Read aloud and compare transcription' },
  'weekly-review': { icon: 'review', description: 'Review recent mistakes' },
}

type WorkspaceRequest = { type: ActivityType; contentId?: string; task?: PlannedTask }

export default function App() {
  const [snapshot, setSnapshot] = useState<LearningSnapshot | null>(null)
  const [activeView, setActiveView] = useState<(typeof navItems)[number]['id']>('plan')
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
          <strong>Flâneur</strong>
        </header>
        {notice && <Notice text={notice} onClose={() => setNotice('')} />}
        {activeView === 'plan' && <PlanView snapshot={snapshot} plan={weekPlan} today={today} completed={completedIds} onSave={saveSettings} onOpen={(task) => setWorkspace({ type: task.type, contentId: task.contentId, task })} />}
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
  return <div className="center-screen"><div className="loader-card"><span className="spinner" /> <strong>Loading Flâneur...</strong></div></div>
}

function Sidebar({ active, settings, onNavigate }: { active: string; settings: UserSettings; onNavigate: (id: (typeof navItems)[number]['id']) => void }) {
  return <aside className="sidebar">
    <div className="brand"><div className="brand-mark"><AppIcon name="flag" /></div><div><strong>Flâneur</strong></div></div>
    <nav>{navItems.map((item) => <button key={item.id} className={`nav-button ${active === item.id ? 'active' : ''}`} onClick={() => onNavigate(item.id)}><span><AppIcon name={item.icon} /></span>{item.label}</button>)}</nav>
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
    ><span><AppIcon name={item.icon} /></span></button>)}
  </nav>
}

function Notice({ text, onClose }: { text: string; onClose: () => void }) {
  return <div className="notice"><span>{text}</span><button onClick={onClose}>x</button></div>
}

function AppIcon({ name }: { name: IconName }) {
  const common = { fill: 'none', stroke: 'currentColor', strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2 } as const
  return <svg className="app-icon" viewBox="0 0 24 24" aria-hidden="true">
    {name === 'calendar' && <><rect {...common} x="4" y="5" width="16" height="15" rx="2" /><path {...common} d="M8 3v4M16 3v4M4 10h16" /></>}
    {name === 'map' && <><path {...common} d="M4 6l5-2 6 2 5-2v14l-5 2-6-2-5 2V6z" /><path {...common} d="M9 4v14M15 6v14" /></>}
    {name === 'book' && <><path {...common} d="M5 4h7a4 4 0 0 1 4 4v12H9a4 4 0 0 0-4-4V4z" /><path {...common} d="M19 4h-7a4 4 0 0 0-4 4" /></>}
    {name === 'target' && <><circle {...common} cx="12" cy="12" r="8" /><circle {...common} cx="12" cy="12" r="3" /><path {...common} d="M12 2v3M12 19v3M2 12h3M19 12h3" /></>}
    {name === 'chart' && <><path {...common} d="M4 19h16" /><path {...common} d="M7 16V9M12 16V5M17 16v-4" /></>}
    {name === 'settings' && <><circle {...common} cx="12" cy="12" r="3" /><path {...common} d="M19 12a7 7 0 0 0-.1-1.2l2-1.5-2-3.5-2.4 1a7 7 0 0 0-2-1.2L14 3h-4l-.5 2.6a7 7 0 0 0-2 1.2l-2.4-1-2 3.5 2 1.5A7 7 0 0 0 5 12c0 .4 0 .8.1 1.2l-2 1.5 2 3.5 2.4-1a7 7 0 0 0 2 1.2L10 21h4l.5-2.6a7 7 0 0 0 2-1.2l2.4 1 2-3.5-2-1.5c.1-.4.1-.8.1-1.2z" /></>}
    {name === 'lesson' && <><path {...common} d="M5 5h11a3 3 0 0 1 3 3v11H8a3 3 0 0 1-3-3V5z" /><path {...common} d="M9 9h6M9 13h5" /></>}
    {name === 'quiz' && <><circle {...common} cx="12" cy="12" r="9" /><path {...common} d="M9.5 9a2.5 2.5 0 1 1 4.2 1.8c-.9.8-1.7 1.3-1.7 2.7M12 17h.01" /></>}
    {name === 'cards' && <><rect {...common} x="7" y="5" width="11" height="14" rx="2" /><path {...common} d="M5 8v10a2 2 0 0 0 2 2h8" /><path {...common} d="M10 10h5M10 14h4" /></>}
    {name === 'verb' && <><path {...common} d="M4 12h16" /><path {...common} d="M7 8l-3 4 3 4M17 8l3 4-3 4" /><path {...common} d="M10 7l4 10" /></>}
    {name === 'reading' && <><path {...common} d="M4 6h7a3 3 0 0 1 3 3v10H7a3 3 0 0 0-3-3V6z" /><path {...common} d="M20 6h-6a3 3 0 0 0-3 3" /></>}
    {name === 'writing' && <><path {...common} d="M4 20l4-1 10-10-3-3L5 16l-1 4z" /><path {...common} d="M13 6l3 3" /></>}
    {name === 'mic' && <><rect {...common} x="9" y="3" width="6" height="11" rx="3" /><path {...common} d="M5 11a7 7 0 0 0 14 0M12 18v3M9 21h6" /></>}
    {name === 'review' && <><path {...common} d="M5 5h14v14H5z" /><path {...common} d="M8 10h8M8 14h5" /><path {...common} d="M16 16l3 3 3-4" /></>}
    {name === 'check' && <path {...common} d="M5 12l4 4L19 6" />}
    {name === 'flag' && <><path {...common} d="M6 21V4" /><path {...common} d="M6 5h11l-2 4 2 4H6" /></>}
  </svg>
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
      <div className="onboarding-brand"><div className="brand-mark large"><AppIcon name="flag" /></div><div><h1>Flâneur</h1><p>A focused plan for consistent progress from A1 to B1.</p></div></div>
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
        <label className="field"><span>AI integration</span>
          <select value={settings.aiProvider} onChange={(event) => setSettings({ ...settings, aiProvider: event.target.value as AiProvider })}>
            <option value="disabled">Disabled</option>
            <option value="ollama">Ollama (Local)</option>
            <option value="groq">Groq API</option>
            <option value="gemini">Gemini API</option>
          </select>
        </label>
        {settings.aiProvider === 'ollama' && (
          <label className="field"><span>Ollama model tag</span><input value={settings.aiModel} onChange={(event) => setSettings({ ...settings, aiModel: event.target.value })} /></label>
        )}
        {settings.aiProvider === 'groq' && (
          <>
            <label className="field"><span>Groq API Key</span><input type="password" value={settings.groqApiKey} onChange={(event) => setSettings({ ...settings, groqApiKey: event.target.value })} placeholder="gsk_..." /></label>
            <label className="field"><span>Groq model tag</span><input value={settings.groqModel} onChange={(event) => setSettings({ ...settings, groqModel: event.target.value })} /></label>
          </>
        )}
        {settings.aiProvider === 'gemini' && (
          <>
            <label className="field"><span>Gemini API Key</span><input type="password" value={settings.geminiApiKey} onChange={(event) => setSettings({ ...settings, geminiApiKey: event.target.value })} placeholder="AIzaSy..." /></label>
            <label className="field"><span>Gemini model tag</span><input value={settings.geminiModel} onChange={(event) => setSettings({ ...settings, geminiModel: event.target.value })} /></label>
          </>
        )}
      </section>}
      <footer className="wizard-footer">{step > 1 ? <button className="secondary-button" onClick={() => setStep(step - 1)}>Back</button> : <span />}{step < 3 ? <button className="primary-button" onClick={() => setStep(step + 1)}>Continue</button> : <button className="primary-button" disabled={weeklyMinutes === 0} onClick={finish}>Create my plan</button>}</footer>
    </div>
  </div>
}

const placementQuestions = [
  { prompt: 'Choose the correct sentence.', choices: ['Je suis etudiante.', 'Je est etudiante.', 'Je etre etudiante.'], answer: 'Je suis etudiante.', level: 'A1' },
  { prompt: 'Complete: Nous ___ francais.', choices: ['parlons', 'parlez', 'parlent'], answer: 'parlons', level: 'A1' },
  { prompt: 'In the dining room, ___ est pres de la fenetre.', choices: ['Le table', 'La table', 'Les table'], answer: 'La table', level: 'A1' },
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

function PageHeader({ eyebrow, title, action }: { eyebrow?: string; title: string; action?: ReactNode }) {
  return <div className="page-header"><div>{eyebrow && <small>{eyebrow}</small>}<h1>{title}</h1></div>{action}</div>
}

function parseMarkedText(text: string) {
  const parts: Array<{ text: string; color?: BookHighlightColor }> = []
  const pattern = /\[\[(blue|pink|green|orange)\|(.+?)\]\]/g
  let lastIndex = 0
  let match: RegExpExecArray | null
  while ((match = pattern.exec(text))) {
    if (match.index > lastIndex) parts.push({ text: text.slice(lastIndex, match.index) })
    parts.push({ text: match[2], color: match[1] as BookHighlightColor })
    lastIndex = pattern.lastIndex
  }
  if (lastIndex < text.length) parts.push({ text: text.slice(lastIndex) })
  return parts
}

function MarkedText({ text }: { text: string }) {
  return <>{parseMarkedText(text).map((part, index) => part.color ? <span key={`${part.text}-${index}`} className={`book-hl ${part.color}`}>{part.text}</span> : <span key={`${part.text}-${index}`}>{part.text}</span>)}</>
}

function GrammarTopicContent({ topic, language, speechEnabled, compact = false }: { topic: SkillTopic; language: 'en' | 'fr'; speechEnabled: boolean; compact?: boolean }) {
  const book = getBookGrammarContent(topic.id)
  const guide = topic.lessonGuide ?? getGrammarGuide(topic)
  const sourceBlocks = book?.sourceBlocksByTopic?.[topic.id] ?? book?.sourceBlocks ?? []
  return <div className={`grammar-guide ${compact ? 'compact-guide' : ''}`}>
    <section className="grammar-summary grammar-card grammar-book-summary">
      <div className="grammar-book-heading">
        <div>
          <span className="eyebrow">{topic.level} · {topic.area}</span>
          <h3>{topic.titleFr}</h3>
          <p className="grammar-subtitle">{topic.titleEn}</p>
        </div>
      </div>
      <p>{language === 'fr' ? topic.explanationFr : topic.explanationEn}</p>
    </section>
    {book ? <section className="grammar-card grammar-source-card">
      <div className="grammar-source-header">
        <div>
          <h3>French source</h3>
        </div>
      </div>
      {sourceBlocks.length ? <div className="book-source-blocks">{sourceBlocks.map((block, index) => <article className="book-source-block" key={`${block.label ?? 'source'}-${index}`}>{block.label ? <h4>{block.label}</h4> : null}<div className="book-source-lines">{block.lines.map((line, lineIndex) => <p key={`${line}-${lineIndex}`}><MarkedText text={line} /></p>)}</div></article>)}</div> : <div className="book-source-fallback"><p>Source extract not yet formatted for this topic.</p></div>}
    </section> : null}
    <section className="grammar-card grammar-english-card">
      <h3>English guide</h3>
      <p className="english-intro">{topic.explanationEn}</p>
      {guide?.rules?.length ? <div className="english-detail-block"><strong>How it works</strong><ul>{guide.rules.map((rule) => <li key={rule}>{rule}</li>)}</ul></div> : null}
      {guide?.goals?.length ? <div className="english-detail-block"><strong>What to notice</strong><ul>{guide.goals.map((goal) => <li key={goal}>{goal}</li>)}</ul></div> : null}
    </section>
    {topic.examples.length ? <section className="grammar-card"><h3>Practice sentences</h3><div className="example-box">{topic.examples.map((example) => <div key={example}><span>{example}</span><SpeakButton text={example} enabled={speechEnabled} /></div>)}</div></section> : null}
    {guide?.commonMistakes?.length ? <section className="grammar-card"><h3>Common mistakes</h3><div className="mistake-list">{guide.commonMistakes.map((mistake, index) => <article key={`${mistake.incorrect}-${index}`}><div><strong className="wrong-example">Incorrect: {mistake.incorrect}</strong><strong className="right-example">Correct: {mistake.correct}</strong></div><p>{mistake.explanation}</p></article>)}</div></section> : null}
    {guide?.quickReference?.length ? <section className="grammar-card"><h3>Quick reference</h3><div className="grammar-reference">{guide.quickReference.map((item) => <div key={`${item.label}-${item.value}`}><strong>{item.label}</strong><span>{item.value}</span></div>)}</div></section> : null}
    {guide?.memoryTip ? <div className="memory-tip"><strong>Memory tip</strong><span>{guide.memoryTip}</span></div> : null}
  </div>
}

function PlanView({ snapshot, plan, completed, onSave, onOpen, today }: { snapshot: LearningSnapshot; plan: WeekPlan; completed: Set<string>; onSave: (settings: UserSettings) => Promise<void>; onOpen: (task: PlannedTask) => void; today: string }) {
  const [editing, setEditing] = useState(false)
  const [availability, setAvailability] = useState(snapshot.settings.weeklyAvailability)
  const save = async () => { await onSave({ ...snapshot.settings, weeklyAvailability: availability }); setEditing(false) }

  const todayCardRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (todayCardRef.current) {
      todayCardRef.current.scrollIntoView({
        behavior: 'auto',
        block: 'nearest',
        inline: 'center'
      })
    }
  }, [today])

  return <>
    <PageHeader eyebrow={`Week of ${plan.weekStart}`} title="My weekly plan" action={<button className="secondary-button" onClick={() => setEditing(!editing)}>{editing ? 'Close editor' : 'Edit availability'}</button>} />
    {editing && <section className="panel"><h2>Weekly availability</h2><AvailabilityEditor value={availability} onChange={setAvailability} /><div className="button-row"><button className="primary-button" onClick={() => void save()}>Save and regenerate plan</button></div></section>}
    <div className="week-grid">{plan.days.map((day) => {
      const isToday = day.date === today
      return <section className={`day-card ${isToday ? 'today' : ''}`} key={day.day} ref={isToday ? todayCardRef : undefined}><header><div><strong>{dayLabels[day.day]}{isToday && <span className="today-badge">Today</span>}</strong><small>{day.date}</small></div><span>{day.availableMinutes ? formatMinutes(day.availableMinutes) : 'Rest'}</span></header>{day.tasks.length ? <div className="mini-task-list">{day.tasks.map((task) => <button key={task.id} className={completed.has(task.id) ? 'done' : ''} onClick={() => onOpen(task)}><span>{completed.has(task.id) ? <AppIcon name="check" /> : <AppIcon name={activityMeta[task.type].icon} />}</span><i>{task.title}</i><small>{task.estimatedMinutes}m</small></button>)}</div> : <p className="muted">Rest day</p>}</section>
    })}</div>
    <div className="section-heading"><div><h2>Weekly performance & stats</h2></div></div>
    <div className="two-column-grid stats-grid">
      <StatCard label="Vocabulary cards due" value={String(snapshot.cards.filter((card) => new Date(card.dueAt).getTime() <= Date.now()).length)} detail="Spaced repetition queue" />
      <StatCard label="Offline reading sets" value={String(curatedReadingExercises.length)} detail="Available without Ollama" />
      <StatCard label="Recent writing attempts" value={String(snapshot.writingAttempts.length)} detail="Saved locally" />
      <StatCard label="Study time this week" value={formatMinutes(plan.totalMinutes)} detail="Based on your schedule" />
    </div>
  </>
}

function LearnView({ snapshot, onRefresh, onOpen }: { snapshot: LearningSnapshot; onRefresh: () => Promise<void>; onOpen: (type: ActivityType, contentId?: string) => void }) {
  const [tab, setTab] = useState<'grammar' | 'vocabulary' | 'verbs'>('grammar')
  return <>
    <PageHeader title="Learn" />
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
  return <div className="library-layout"><aside className="library-list">{(['A1', 'A2', 'B1'] as LearningLevel[]).map((level) => <div key={level}><h3>{level}</h3>{topics.filter((topic) => topic.level === level).map((topic) => <button className={selected?.id === topic.id ? 'selected' : ''} key={topic.id} onClick={() => { setSelectedId(topic.id); setAiExplanation(null) }}><span>{topic.titleFr}</span><small>{topic.titleEn}</small></button>)}</div>)}</aside>{selected && <section className="lesson-panel grammar-lesson-panel"><GrammarTopicContent topic={selected} language={snapshot.settings.languageMode} speechEnabled={snapshot.settings.speechEnabled} /><div className="confidence-line"><span>Confidence</span><Meter value={selected.confidence} /></div><div className="button-row"><button className="primary-button" onClick={() => onOpen('grammar-practice', selected.id)}>Quiz</button><button className="secondary-button" disabled={loading || snapshot.settings.aiProvider === 'disabled'} onClick={() => void requestExplanation()}>{loading ? 'Generating...' : 'AI explain'}</button></div>{error && <ErrorBox text={error} />}{aiExplanation && <div className="ai-box"><h3>Local AI explanation</h3><p>{aiExplanation.explanation}</p><ul>{aiExplanation.examples.map((example) => <li key={example}>{example}</li>)}</ul>{aiExplanation.commonMistakes.length > 0 && <><h4>Common mistakes</h4><ul>{aiExplanation.commonMistakes.map((item) => <li key={item}>{item}</li>)}</ul></>}</div>}</section>}</div>
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
  return <div className="library-layout"><aside className="library-list"><div className="library-list-header"><h3>Decks</h3><button className="secondary-button compact" onClick={() => setShowBuilder((current) => !current)}>{showBuilder ? 'Close' : 'New set'}</button></div>{decks.map((item) => <button className={item.id === deck?.id ? 'selected' : ''} onClick={() => setSelectedId(item.id)} key={item.id}><span>{item.title}</span><small>{item.level}</small></button>)}</aside><section className="lesson-panel">{showBuilder && <VocabSetBuilder currentLevel={snapshot.settings.currentLevel} onCreated={async (deckId) => { await onRefresh(); setSelectedId(deckId); setShowBuilder(false) }} />}{deck && <><div className="split-header"><div><span className="eyebrow">{deck.level} vocabulary {deck.source === 'personal' ? '· personal set' : ''}</span><h2>{deck.title}</h2></div><div className="button-row"><button className="primary-button" onClick={() => onOpen('vocabulary-review', deck.id)}>Study</button></div></div><div className="summary-strip"><strong>{cards.length} cards</strong><span>{cards.filter((card) => new Date(card.dueAt).getTime() <= Date.now()).length} due now</span></div>{deck.tags.length > 0 && <div className="pill-row">{deck.tags.map((tag) => <span key={tag} className="tag-pill">{tag}</span>)}</div>}<div className="word-grid">{cards.slice(0, 60).map((card) => <article key={card.id}><strong>{card.frontFr}</strong><span>{card.backEn}</span><small>{card.exampleFr}</small></article>)}</div></>}</section></div>
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
  const cards: Array<{ type: ActivityType; title: string }> = [
    { type: 'grammar-practice', title: 'Grammar quiz' },
    { type: 'vocabulary-review', title: 'Vocabulary games' },
    { type: 'conjugation', title: 'Conjugation' },
    { type: 'reading', title: 'Reading' },
    { type: 'writing', title: 'Writing' },
    { type: 'pronunciation', title: 'Pronunciation' },
  ]
  return <>
    <PageHeader title="Practice" />
    <div className="practice-grid">{cards.map((card) => <button className="practice-card" key={card.type} onClick={() => onOpen(card.type)}><span><AppIcon name={activityMeta[card.type].icon} /></span><h3>{card.title}</h3><i>Start</i></button>)}</div>
    <section className="panel ai-studio"><div><h2>AI studio</h2></div><div className="ai-studio-grid"><label className="field"><span>Reading topic</span><input value={topic} onChange={(event) => setTopic(event.target.value)} /></label><label className="field"><span>Focus</span><input value={focus} onChange={(event) => setFocus(event.target.value)} /></label><button className="primary-button" disabled={loading !== '' || snapshot.settings.aiProvider === 'disabled'} onClick={() => void createReading()}>{loading === 'reading' ? 'Generating...' : 'Generate reading'}</button></div><hr /><div className="ai-studio-grid"><label className="field"><span>Type</span><select value={kind} onChange={(event) => setKind(event.target.value as typeof kind)}><option value="grammar">Grammar</option><option value="vocabulary">Vocabulary</option><option value="conjugation">Conjugation</option></select></label><label className="field"><span>Focus</span><input value={focus} onChange={(event) => setFocus(event.target.value)} /></label><button className="secondary-button" disabled={loading !== '' || snapshot.settings.aiProvider === 'disabled'} onClick={() => void createPractice()}>{loading === 'practice' ? 'Generating...' : 'Generate practice'}</button></div>{error && <ErrorBox text={error} />}{generatedPractice && <div className="ai-box"><h3>{generatedPractice.title}</h3><p>{generatedPractice.instructions}</p><ol>{generatedPractice.questions.map((question, index) => <li key={`${question.prompt}-${index}`}><strong>{question.prompt}</strong><small>Answer: {question.correctAnswer} · {question.explanation}</small></li>)}</ol></div>}</section>
  </>
}

function ProgressView({ snapshot, plan }: { snapshot: LearningSnapshot; plan: WeekPlan }) {
  const completedThisWeek = snapshot.taskCompletions.filter((item) => item.date >= plan.weekStart)
  const weakTopics = [...snapshot.topics].filter((topic) => topic.level !== 'B2').sort((a, b) => a.confidence - b.confidence).slice(0, 6)
  const strongTopics = [...snapshot.topics].filter((topic) => topic.level !== 'B2').sort((a, b) => b.confidence - a.confidence).slice(0, 6)
  const totalPossible = plan.days.flatMap((day) => day.tasks).length
  const writingAverage = snapshot.writingAttempts.flatMap((attempt) => attempt.feedback ? [average(Object.values(attempt.feedback.scores))] : [])
  return <>
    <PageHeader title="Progress" />
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
  const checkAi = async (test = false) => {
    const providerLabel = draft.aiProvider === 'ollama' ? 'Ollama' : draft.aiProvider === 'groq' ? 'Groq' : draft.aiProvider === 'gemini' ? 'Gemini' : 'AI'
    setStatus(`Checking ${providerLabel} connection...`)
    try {
      if (test) {
        const result = await testAi(aiConfigFromSettings(draft))
        setStatus(result.message)
      } else {
        const result = await getAiStatus(aiConfigFromSettings(draft))
        if (draft.aiProvider === 'ollama') {
          setStatus(`Connected. ${result.models.length} local model(s) detected.${result.selectedModelAvailable ? ' Selected model is available.' : ' Pull or select the configured model.'}`)
        } else {
          setStatus(`Connected to ${providerLabel} API. Selected model is available.`)
        }
      }
    } catch (reason) {
      setStatus(errorMessage(reason))
    }
  }
  const downloadBackup = async () => { const data = await exportSnapshot(); downloadJson(data, `french-path-backup-${toDateKey(new Date())}.json`) }
  const importBackup = async (event: ChangeEvent<HTMLInputElement>) => { const file = event.target.files?.[0]; if (!file) return; try { await importSnapshot(JSON.parse(await file.text()) as LearningSnapshot); await onRefresh(); onNotice('Backup imported successfully.') } catch { onNotice('The selected backup could not be imported.') } finally { event.target.value = '' } }
  const performReset = async () => { if (!window.confirm('Reset saved progress and return to onboarding?')) return; await resetProgress(); await onRefresh() }
  return <>
    <PageHeader title="Settings" action={<button className="primary-button" onClick={() => void save()}>Save settings</button>} />
    <div className="two-column-grid"><section className="panel"><h2>Profile</h2><label className="field"><span>Name</span><input value={draft.learnerName} onChange={(event) => setDraft({ ...draft, learnerName: event.target.value })} /></label><label className="field"><span>Current level</span><select value={draft.currentLevel} onChange={(event) => { const currentLevel = event.target.value as LearningLevel; setDraft({ ...draft, currentLevel, targetLevel: targetForLevel(currentLevel) }) }}><option>A1</option><option>A2</option><option>B1</option></select></label><label className="field"><span>Target</span><input disabled value={draft.targetLevel} /></label><label className="field"><span>Explanation language</span><select value={draft.languageMode} onChange={(event) => setDraft({ ...draft, languageMode: event.target.value as 'en' | 'fr' })}><option value="en">English</option><option value="fr">French</option></select></label><Toggle label="Audio playback" checked={draft.speechEnabled} onChange={(speechEnabled) => setDraft({ ...draft, speechEnabled })} /><Toggle label="Speech recognition" checked={draft.speechRecognitionEnabled} onChange={(speechRecognitionEnabled) => setDraft({ ...draft, speechRecognitionEnabled })} /></section><section className="panel"><h2>AI Integration</h2><label className="field"><span>AI Provider</span><select value={draft.aiProvider} onChange={(event) => setDraft({ ...draft, aiProvider: event.target.value as AiProvider })}><option value="disabled">Disabled</option><option value="ollama">Ollama (Local)</option><option value="groq">Groq API</option><option value="gemini">Gemini API</option></select></label>{draft.aiProvider === 'ollama' && <><label className="field"><span>Ollama host</span><input value={draft.ollamaHost} onChange={(event) => setDraft({ ...draft, ollamaHost: event.target.value })} /></label><label className="field"><span>Model tag</span><input value={draft.aiModel} onChange={(event) => setDraft({ ...draft, aiModel: event.target.value })} /></label><label className="field"><span>Ollama timeout <small>(minutes)</small></span><input type="number" min={1} max={30} value={Math.round(draft.ollamaTimeoutMs / 60000)} onChange={(event) => setDraft({ ...draft, ollamaTimeoutMs: Math.max(1, Math.min(30, Number(event.target.value) || 10)) * 60000 })} /><small>Default is 10 minutes for long local generations.</small></label></>}{draft.aiProvider === 'groq' && <><label className="field"><span>Groq API Key</span><input type="password" value={draft.groqApiKey} onChange={(event) => setDraft({ ...draft, groqApiKey: event.target.value })} placeholder="gsk_..." /></label><label className="field"><span>Groq model tag</span><input value={draft.groqModel} onChange={(event) => setDraft({ ...draft, groqModel: event.target.value })} /></label></>}{draft.aiProvider === 'gemini' && <><label className="field"><span>Gemini API Key</span><input type="password" value={draft.geminiApiKey} onChange={(event) => setDraft({ ...draft, geminiApiKey: event.target.value })} placeholder="AIzaSy..." /></label><label className="field"><span>Gemini model tag</span><input value={draft.geminiModel} onChange={(event) => setDraft({ ...draft, geminiModel: event.target.value })} /></label></>}<div className="button-row"><button className="secondary-button" disabled={draft.aiProvider === 'disabled'} onClick={() => void checkAi(false)}>Check connection</button><button className="secondary-button" disabled={draft.aiProvider === 'disabled'} onClick={() => void checkAi(true)}>Send test prompt</button></div>{status && <p className="status-box">{status}</p>}</section></div>
    <section className="panel"><h2>Backup and reset</h2><p>Your browser stores progress in IndexedDB. Export a JSON backup before moving to another browser or computer.</p><div className="button-row"><button className="secondary-button" onClick={() => void downloadBackup()}>Export JSON backup</button><button className="secondary-button" onClick={() => fileRef.current?.click()}>Import backup</button><button className="danger-button" onClick={() => void performReset()}>Reset progress</button><input hidden type="file" accept="application/json" ref={fileRef} onChange={(event) => void importBackup(event)} /></div></section>
  </>
}

function Workspace({ snapshot, request, onClose, onDone, onRefresh }: { snapshot: LearningSnapshot; request: WorkspaceRequest; onClose: () => void; onDone: (score?: number) => Promise<void>; onRefresh: () => Promise<void> }) {
  return <div className="modal-backdrop"><div className="workspace-modal"><header className="workspace-closebar"><button className="close-button" aria-label="Close" onClick={onClose}>x</button></header><div className="workspace-body">{request.type === 'grammar-lesson' && <GrammarLessonWorkspace snapshot={snapshot} contentId={request.contentId} onDone={onDone} />}{request.type === 'grammar-practice' && <GrammarPracticeWorkspace snapshot={snapshot} contentId={request.contentId} onDone={onDone} onRefresh={onRefresh} />}{request.type === 'vocabulary-review' && <VocabularyWorkspace snapshot={snapshot} contentId={request.contentId} onDone={onDone} onRefresh={onRefresh} />}{request.type === 'conjugation' && <ConjugationWorkspace snapshot={snapshot} contentId={request.contentId} onDone={onDone} onRefresh={onRefresh} />}{request.type === 'reading' && <ReadingWorkspace snapshot={snapshot} contentId={request.contentId} onDone={onDone} />}{request.type === 'writing' && <WritingWorkspace snapshot={snapshot} contentId={request.contentId} onDone={onDone} />}{request.type === 'pronunciation' && <PronunciationWorkspace snapshot={snapshot} expectedText={request.task?.detail} onDone={onDone} />}{request.type === 'weekly-review' && <WeeklyReviewWorkspace snapshot={snapshot} onDone={onDone} />}</div></div></div>
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
    return <div className="exercise"><span className="eyebrow">Completed · {topic.titleEn}</span><h3>Your score: {score}/{questions.length} · {percent}%</h3><p>{percent >= 80 ? 'Strong result. Start another set to confirm that the rule is stable.' : 'Review the explanation, then try another set with different questions.'}</p><div className="choice-grid">{questions.map((question, index) => { const prompt = cleanGrammarPrompt(snapshot.settings.languageMode === 'fr' ? question.promptFr : question.promptEn); const response = answers[question.id] ?? ''; const correct = normalizeAnswer(response) === normalizeAnswer(question.correctAnswer); return <fieldset key={question.id} className="grammar-question"><legend>{index + 1}. {prompt}</legend><Feedback correct={correct} answer={question.correctAnswer} explanation={snapshot.settings.languageMode === 'fr' ? question.explanationFr : question.explanationEn} /></fieldset> })}</div><div className="button-row"><button className="secondary-button" onClick={restart}>Start another 10-question set</button><button className="primary-button" onClick={() => void onDone(percent)}>Finish activity</button></div></div>
  }
  return <div className="exercise"><span className="eyebrow">10-question set · {topic.titleEn}</span>{questions.map((question, index) => { const prompt = cleanGrammarPrompt(snapshot.settings.languageMode === 'fr' ? question.promptFr : question.promptEn); const answer = answers[question.id] ?? ''; const parts = inlinePromptParts(prompt); return <fieldset key={question.id} className="grammar-question"><legend>{index + 1}. {question.type === 'fill' && parts ? <span className="inline-answer-line">{parts.before}<input className="inline-answer-input" value={answer} onChange={(event) => setAnswers({ ...answers, [question.id]: event.target.value })} />{parts.after}</span> : prompt}</legend>{question.type === 'multiple-choice' && question.choices ? <div className="choice-grid">{question.choices.map((choice) => <button className={answer === choice ? 'selected' : ''} key={choice} onClick={() => setAnswers({ ...answers, [question.id]: choice })}>{choice}</button>)}</div> : question.type === 'fill' && !parts ? <input className="large-input" value={answer} onChange={(event) => setAnswers({ ...answers, [question.id]: event.target.value })} placeholder="Type your answer" /> : null}</fieldset> })}<button className="primary-button" disabled={questions.some((question) => !(answers[question.id] ?? '').trim())} onClick={() => void checkAll()}>Check</button></div>
}

function VocabSetBuilder({ currentLevel, onCreated }: { currentLevel: LearningLevel; onCreated: (deckId: string) => Promise<void> }) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [title, setTitle] = useState('')
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
    const deck = createPersonalDeck(title, '', level, splitLooseTags(tags))
    const cards = createPersonalCards(deck.id, rows)
    await saveDeckWithCards(deck, cards)
    await onCreated(deck.id)
    setTitle('')
    setRows([])
    setError('')
  }

  return <section className="builder-panel"><div className="split-header"><div><h3>New set</h3></div><div className="button-row"><button className="secondary-button" onClick={() => fileRef.current?.click()}>Upload CSV</button><input hidden ref={fileRef} type="file" accept=".csv,text/csv" onChange={(event) => void importFile(event)} /></div></div><div className="two-column-grid"><label className="field"><span>Set title</span><input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Week 1 essentials" /></label><label className="field"><span>Level</span><select value={level} onChange={(event) => setLevel(event.target.value as LearningLevel)}><option value="A1">A1</option><option value="A2">A2</option><option value="B1">B1</option></select></label></div><label className="field"><span>Tags</span><input value={tags} onChange={(event) => setTags(event.target.value)} placeholder="travel,chapter-2,verbs" /></label><div className="two-column-grid"><label className="field"><span>French term</span><input value={manualFr} onChange={(event) => setManualFr(event.target.value)} /></label><label className="field"><span>English meaning</span><input value={manualEn} onChange={(event) => setManualEn(event.target.value)} /></label></div><div className="button-row"><button className="secondary-button" onClick={addManual}>Add card</button></div><label className="field"><span>CSV</span><textarea rows={6} value={csvText} onChange={(event) => setCsvText(event.target.value)} /></label><div className="button-row"><button className="secondary-button" onClick={importCsv}>Import CSV</button><button className="primary-button" onClick={() => void saveSet()}>Save set</button></div>{error && <ErrorBox text={error} />}{rows.length > 0 && <div className="summary-strip"><strong>{rows.length} cards</strong><span>{rows.slice(0, 3).map((row) => row.frontFr).join(' · ')}</span></div>}</section>
}

function VocabularyWorkspace({ snapshot, contentId, onDone, onRefresh }: { snapshot: LearningSnapshot; contentId?: string; onDone: (score?: number) => Promise<void>; onRefresh: () => Promise<void> }) {
  const due = snapshot.cards.filter((card) => new Date(card.dueAt).getTime() <= Date.now())
  const sourceCards = contentId ? snapshot.cards.filter((card) => card.deckId === contentId) : due.length ? due : snapshot.cards
  const cards = sourceCards.slice(0, 12)
  const [sessionCards, setSessionCards] = useState(() => cards)
  const [mode, setMode] = useState<'flashcards' | 'write' | 'match'>('flashcards')
  const [index, setIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [positive, setPositive] = useState(0)
  const [typedAnswer, setTypedAnswer] = useState('')
  const [typedResult, setTypedResult] = useState<boolean | null>(null)
  const [writeDirection, setWriteDirection] = useState<'en-to-fr' | 'fr-to-en'>('en-to-fr')

  // Cards mode queue state
  const [queue, setQueue] = useState<string[]>(() => cards.map((c) => c.id))
  const [studiedIds, setStudiedIds] = useState<Set<string>>(() => new Set())
  const [firstAttempts, setFirstAttempts] = useState<Record<string, boolean>>({})

  // Swipe state
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null)
  const [swipeOffset, setSwipeOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  // Match mode stable answers list
  const [matchPairs, setMatchPairs] = useState(() => buildMatchPairs(cards, Math.min(6, cards.length)))
  const [shuffledAnswers, setShuffledAnswers] = useState(() => shuffle(matchPairs.map((pair) => ({ cardId: pair.cardId, answer: pair.answer }))))
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [incorrectPrompt, setIncorrectPrompt] = useState<string | null>(null)
  const [incorrectAnswer, setIncorrectAnswer] = useState<string | null>(null)
  const [isMatchLock, setIsMatchLock] = useState(false)
  const [matchedIds, setMatchedIds] = useState<string[]>([])
  const [matchMistakes, setMatchMistakes] = useState(0)

  const card = mode === 'flashcards' ? sessionCards.find((c) => c.id === queue[0]) : sessionCards[index]
  const writeCard = sessionCards[index]

  if (!card) return <EmptyState title="No flashcards found" description="There are no cards in this deck." />

  const finishWithScore = (value: number) => void onDone(Math.round(value))

  const rate = async (rating: 'again' | 'difficult' | 'good' | 'easy') => {
    const cardId = queue[0]
    if (!cardId) return
    await updateCardReview(cardId, rating)
    await onRefresh()

    const isCorrect = rating === 'good' || rating === 'easy'
    const updatedAttempts = { ...firstAttempts }
    if (!(cardId in firstAttempts)) {
      updatedAttempts[cardId] = isCorrect
      setFirstAttempts(updatedAttempts)
    }

    if (isCorrect) {
      const nextStudied = new Set(studiedIds)
      nextStudied.add(cardId)
      setStudiedIds(nextStudied)

      const nextQueue = queue.filter((id) => id !== cardId)
      setQueue(nextQueue)
      setRevealed(false)

      if (nextQueue.length === 0) {
        const correctCount = Object.keys(updatedAttempts).filter((id) => updatedAttempts[id]).length
        const score = Math.round((correctCount / sessionCards.length) * 100)
        finishWithScore(score)
      }
    } else {
      const nextQueue = [...queue.slice(1), cardId]
      setQueue(nextQueue)
      setRevealed(false)
    }
  }

  const checkTyped = async () => {
    const targetAnswer = writeDirection === 'en-to-fr' ? writeCard.frontFr : writeCard.backEn
    const correct = normalizeAnswer(typedAnswer) === normalizeAnswer(targetAnswer)
    setTypedResult(correct)
    await updateCardReview(writeCard.id, correct ? 'good' : 'again')
    await onRefresh()
  }

  const nextTyped = () => {
    const nextIndex = index + 1
    const earned = positive + (typedResult ? 1 : 0)
    if (typedResult) setPositive(earned)
    if (nextIndex >= sessionCards.length) finishWithScore((earned / sessionCards.length) * 100)
    else {
      setIndex(nextIndex)
      setTypedAnswer('')
      setTypedResult(null)
    }
  }

  const prompts = matchPairs
  const answers = shuffledAnswers

  const pickMatch = async (value: string, type: 'prompt' | 'answer') => {
    if (isMatchLock) return

    const nextPrompt = type === 'prompt' ? value : selectedPrompt
    const nextAnswer = type === 'answer' ? value : selectedAnswer
    if (type === 'prompt') setSelectedPrompt(value)
    else setSelectedAnswer(value)
    if (!nextPrompt || !nextAnswer) return

    const pair = matchPairs.find((item) => item.prompt === nextPrompt)
    if (pair?.answer === nextAnswer) {
      const nextMatched = [...matchedIds, pair.cardId]
      setMatchedIds(nextMatched)
      setSelectedPrompt(null)
      setSelectedAnswer(null)
      await updateCardReview(pair.cardId, 'good')
      await onRefresh()
      if (nextMatched.length >= matchPairs.length) {
        const accuracy = ((matchPairs.length - matchMistakes) / matchPairs.length) * 100
        finishWithScore(Math.max(0, accuracy))
      }
    } else {
      setMatchMistakes((current) => current + 1)
      setIncorrectPrompt(nextPrompt)
      setIncorrectAnswer(nextAnswer)
      setIsMatchLock(true)
      setTimeout(() => {
        setIncorrectPrompt(null)
        setIncorrectAnswer(null)
        setSelectedPrompt(null)
        setSelectedAnswer(null)
        setIsMatchLock(false)
      }, 800)
    }
  }

  const resetMatch = () => {
    const nextPairs = buildMatchPairs(sessionCards, Math.min(6, sessionCards.length))
    setMatchPairs(nextPairs)
    setShuffledAnswers(shuffle(nextPairs.map((pair) => ({ cardId: pair.cardId, answer: pair.answer }))))
    setMatchedIds([])
    setMatchMistakes(0)
    setSelectedPrompt(null)
    setSelectedAnswer(null)
    setIncorrectPrompt(null)
    setIncorrectAnswer(null)
    setIsMatchLock(false)
  }

  const randomiseDeck = () => {
    const shuffled = shuffle([...sessionCards])
    setSessionCards(shuffled)
    setQueue(shuffled.map((c) => c.id))
    setStudiedIds(new Set())
    setFirstAttempts({})
    setRevealed(false)
    setIndex(0)
    setPositive(0)
    // Also reset Match since the base set changed
    const nextPairs = buildMatchPairs(shuffled, Math.min(6, shuffled.length))
    setMatchPairs(nextPairs)
    setShuffledAnswers(shuffle(nextPairs.map((pair) => ({ cardId: pair.cardId, answer: pair.answer }))))
    setMatchedIds([])
    setMatchMistakes(0)
    setSelectedPrompt(null)
    setSelectedAnswer(null)
    setIncorrectPrompt(null)
    setIncorrectAnswer(null)
    setIsMatchLock(false)
  }

  useEffect(() => {
    setSessionCards(cards)
    setQueue(cards.map((c) => c.id))
    setStudiedIds(new Set())
    setFirstAttempts({})
    setRevealed(false)
    setIndex(0)
    setPositive(0)
    const nextPairs = buildMatchPairs(cards, Math.min(6, cards.length))
    setMatchPairs(nextPairs)
    setShuffledAnswers(shuffle(nextPairs.map((pair) => ({ cardId: pair.cardId, answer: pair.answer }))))
    setMatchedIds([])
    setMatchMistakes(0)
    setSelectedPrompt(null)
    setSelectedAnswer(null)
    setIncorrectPrompt(null)
    setIncorrectAnswer(null)
    setIsMatchLock(false)
  }, [contentId])

  const handleStart = (clientX: number, clientY: number) => {
    setDragStart({ x: clientX, y: clientY })
    setSwipeOffset(0)
    setIsDragging(false)
  }

  const handleMove = (clientX: number, clientY: number) => {
    if (!dragStart) return
    const diffX = clientX - dragStart.x
    const diffY = clientY - dragStart.y
    if (Math.abs(diffX) > 8 || Math.abs(diffY) > 8) {
      setIsDragging(true)
    }
    if (isDragging) {
      setSwipeOffset(diffX)
    }
  }

  const handleEnd = () => {
    if (!dragStart) return
    if (isDragging) {
      if (swipeOffset < -120) {
        void rate('again')
      } else if (swipeOffset > 120) {
        void rate('good')
      }
    } else {
      setRevealed(true)
    }
    setDragStart(null)
    setSwipeOffset(0)
    setIsDragging(false)
  }

  const getCardStyle = () => {
    if (swipeOffset === 0 && !isDragging) return {}
    const rotate = swipeOffset * 0.08
    return {
      transform: `translateX(${swipeOffset}px) rotate(${rotate}deg)`,
      transition: isDragging ? 'none' : 'transform 0.3s ease-out',
    }
  }

  return (
    <div className="exercise study-shell">
      <div className="study-toolbar">
        <div className="tab-bar compact-tabs">
          <button className={mode === 'flashcards' ? 'active' : ''} onClick={() => setMode('flashcards')}>Cards</button>
          <button className={mode === 'write' ? 'active' : ''} onClick={() => setMode('write')}>Write</button>
          <button className={mode === 'match' ? 'active' : ''} onClick={() => { setMode('match'); resetMatch() }}>Match</button>
        </div>
        {mode === 'flashcards' && (
          <button className="secondary-button compact" onClick={randomiseDeck} style={{ marginRight: 'auto', marginLeft: '10px' }}>
            Randomise
          </button>
        )}
        {mode === 'flashcards' ? (
          <span className="study-count">
            Studied: {studiedIds.size} · Remaining: {queue.length} · Total: {sessionCards.length}
          </span>
        ) : (
          <span className="study-count">{index + 1}/{sessionCards.length}</span>
        )}
      </div>

      {mode === 'flashcards' && (
        <div className="flashcard-exercise">
          <button
            className={`flashcard ${revealed ? 'revealed' : ''} ${swipeOffset < -30 ? 'swipe-left' : ''} ${swipeOffset > 30 ? 'swipe-right' : ''}`}
            style={getCardStyle()}
            onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
            onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
            onMouseUp={handleEnd}
            onMouseLeave={handleEnd}
            onTouchStart={(e) => {
              const t = e.touches[0]
              handleStart(t.clientX, t.clientY)
            }}
            onTouchMove={(e) => {
              const t = e.touches[0]
              handleMove(t.clientX, t.clientY)
            }}
            onTouchEnd={handleEnd}
          >
            {swipeOffset < -40 && <div className="swipe-indicator revise">Revise</div>}
            {swipeOffset > 40 && <div className="swipe-indicator know">Know</div>}
            <strong>{card.frontFr}</strong>
            {revealed ? (
              <>
                <b>{card.backEn}</b>
                <span>{card.exampleFr}</span>
                <small>{card.exampleEn}</small>
              </>
            ) : null}
          </button>
          {revealed && (
            <div className="rating-grid">
              <button onClick={() => void rate('again')}>Again</button>
              <button onClick={() => void rate('difficult')}>Difficult</button>
              <button onClick={() => void rate('good')}>Good</button>
              <button onClick={() => void rate('easy')}>Easy</button>
            </div>
          )}
        </div>
      )}

      {mode === 'write' && (
        <div className="quizlet-panel study-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="study-count">{index + 1}/{sessionCards.length}</span>
            <button
              className="secondary-button compact"
              onClick={() => setWriteDirection(prev => prev === 'en-to-fr' ? 'fr-to-en' : 'en-to-fr')}
            >
              {writeDirection === 'en-to-fr' ? 'English ➔ French' : 'French ➔ English'}
            </button>
          </div>
          <h3>{writeDirection === 'en-to-fr' ? writeCard.backEn : writeCard.frontFr}</h3>
          <p>{writeDirection === 'en-to-fr' ? writeCard.exampleEn : writeCard.exampleFr}</p>
          <input
            value={typedAnswer}
            disabled={typedResult !== null}
            onChange={(event) => setTypedAnswer(event.target.value)}
            placeholder={writeDirection === 'en-to-fr' ? 'French translation' : 'English meaning'}
            autoFocus
          />
          {typedResult !== null && (
            <Feedback
              correct={typedResult}
              answer={writeDirection === 'en-to-fr' ? writeCard.frontFr : writeCard.backEn}
              explanation={writeDirection === 'en-to-fr' ? writeCard.exampleFr : writeCard.exampleEn}
            />
          )}
          {typedResult === null ? (
            <button className="primary-button" disabled={!typedAnswer.trim()} onClick={() => void checkTyped()}>
              Check
            </button>
          ) : (
            <button className="primary-button" onClick={nextTyped}>
              {index + 1 >= sessionCards.length ? 'Finish' : 'Next'}
            </button>
          )}
        </div>
      )}

      {mode === 'match' && (
        <div className="quizlet-panel study-card">
          <div className="match-status">
            <strong>{matchedIds.length}/{matchPairs.length}</strong>
            <span>{matchMistakes}</span>
          </div>
          <div className="match-grid">
            <div>
              <h4>French</h4>
              <div className="choice-grid">
                {prompts.map((pair) => {
                  const isMatched = matchedIds.includes(pair.cardId)
                  const isIncorrect = incorrectPrompt === pair.prompt
                  const isSelected = selectedPrompt === pair.prompt

                  let btnClass = ''
                  if (isMatched) btnClass = 'matched'
                  else if (isIncorrect) btnClass = 'incorrect'
                  else if (isSelected) btnClass = 'selected'

                  return (
                    <button
                      key={pair.cardId}
                      className={btnClass}
                      disabled={isMatched || isMatchLock}
                      onClick={() => void pickMatch(pair.prompt, 'prompt')}
                    >
                      {pair.prompt}
                    </button>
                  )
                })}
              </div>
            </div>
            <div>
              <h4>English</h4>
              <div className="choice-grid">
                {answers.map((pair) => {
                  const isMatched = matchedIds.includes(pair.cardId)
                  const isIncorrect = incorrectAnswer === pair.answer
                  const isSelected = selectedAnswer === pair.answer

                  let btnClass = ''
                  if (isMatched) btnClass = 'matched'
                  else if (isIncorrect) btnClass = 'incorrect'
                  else if (isSelected) btnClass = 'selected'

                  return (
                    <button
                      key={pair.cardId}
                      className={btnClass}
                      disabled={isMatched || isMatchLock}
                      onClick={() => void pickMatch(pair.answer, 'answer')}
                    >
                      {pair.answer}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
          {matchedIds.length === matchPairs.length && (
            <div className="result-footer">
              <strong>Complete</strong>
              <button
                className="primary-button"
                onClick={() => finishWithScore(((matchPairs.length - matchMistakes) / matchPairs.length) * 100)}
              >
                Finish
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
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

  return <div className="exercise study-shell conjugation-shell"><div className="study-toolbar"><div className="study-controls"><label className="field inline"><span>Mode</span><select value={mode} onChange={(event) => restart(event.target.value as 'write' | 'multiple-choice', tenseFilter)}><option value="write">Write</option><option value="multiple-choice">Multiple choice</option></select></label><label className="field inline"><span>Tense</span><select value={tenseFilter} onChange={(event) => restart(mode, event.target.value)}><option value="all">All tenses</option>{tenseOptions.map((tense) => <option key={tense} value={tense}>{humanTense(tense)}</option>)}</select></label></div><span className="study-count">{index + 1}/{rounds.length} · {humanTense(round.tense)}</span></div><div className="conjugation-card"><h3>{round.verb.infinitive}</h3>{mode === 'write' ? <div className="conjugation-answer"><span>{round.person}</span><input value={answer} disabled={result !== null} onChange={(event) => setAnswer(event.target.value)} autoFocus /></div> : <><div className="conjugation-person">{round.person}</div><div className="choice-grid">{round.choices.map((choice) => <button className={answer === choice ? 'selected' : ''} key={choice} onClick={() => setAnswer(choice)}>{choice}</button>)}</div></>}{result !== null && <Feedback correct={result} answer={round.correct} explanation={`${round.person} ${round.correct}`} />}{result === null ? <button className="primary-button" disabled={!answer} onClick={() => void check()}>Check</button> : <button className="primary-button" onClick={next}>{index + 1 >= rounds.length ? 'Finish' : 'Next'}</button>}</div></div>
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
  return <div className="exercise"><label className="field inline"><span>Prompt</span><select value={prompt.id} disabled={Boolean(contentId)} onChange={(event) => { setSelectedId(event.target.value); setEvaluation(null); setText('') }}>{prompts.map((item) => <option key={item.id} value={item.id}>{item.level} · {item.title ?? item.titleEn ?? item.id}</option>)}</select></label><span className="eyebrow">{prompt.level} writing</span><h3>{prompt.title ?? prompt.titleEn}</h3><p>{task}</p><ul className="checklist">{checklist.map((item) => <li key={item}>{item}</li>)}</ul><textarea rows={10} value={text} onChange={(event) => setText(event.target.value)} placeholder={prompt.starter ?? prompt.starterSentence ?? 'Start writing in French...'} /><div className="button-row"><button className="secondary-button" disabled={!text.trim()} onClick={() => void saveOnly()}>Save</button><button className="primary-button" disabled={!text.trim() || loading || snapshot.settings.aiProvider === 'disabled'} onClick={() => void requestEvaluation()}>{loading ? 'Evaluating...' : 'Evaluate'}</button></div>{error && <ErrorBox text={error} />}{evaluation && <div className="ai-box"><h3>Writing feedback · {Math.round(total ?? 0)}%</h3><div className="score-grid">{Object.entries(evaluation.scores).map(([label, value]) => <div key={label}><span>{humanCamel(label)}</span><strong>{value}/10</strong></div>)}</div><h4>Corrected version</h4><p>{evaluation.correctedText}</p><h4>Important corrections</h4><ul>{evaluation.importantMistakes.map((mistake, index) => <li key={`${mistake.original}-${index}`}><strong>{mistake.original}</strong> to {mistake.correction}<small>{mistake.explanation}</small></li>)}</ul><p><strong>Next grammar focus:</strong> {evaluation.recommendedGrammarTopic}</p><button className="primary-button" onClick={() => void onDone(total)}>Finish</button></div>}</div>
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
  return <div className="exercise"><div className="summary-strip"><strong>{promptOptions.length.toLocaleString()} prompts</strong><span>{Math.min(promptIndex + 1, promptOptions.length)}/{promptOptions.length}</span></div><label className="field"><span>Phrase</span><textarea rows={3} value={expected} onChange={(event) => setExpected(event.target.value)} /></label><div className="button-row"><button className="secondary-button" disabled={promptOptions.length <= 1} onClick={() => choosePrompt(promptIndex + 1)}>Next</button><button className="secondary-button" disabled={promptOptions.length <= 1} onClick={() => choosePrompt(Math.floor(Math.random() * promptOptions.length))}>Random</button><SpeakButton text={expected} enabled={snapshot.settings.speechEnabled} label="Listen" /><button className="primary-button" onClick={record}>{listening ? 'Listening...' : 'Record'}</button></div><label className="field"><span>Recognized</span><textarea rows={3} value={recognized} onChange={(event) => setRecognized(event.target.value)} placeholder="Transcription" /></label>{recognized && <div className="summary-strip"><strong>{similarity}%</strong><span>{similarity >= 85 ? 'Very close' : similarity >= 60 ? 'Good start' : 'Repeat'}</span></div>}{error && <ErrorBox text={error} />}<div className="button-row"><button className="secondary-button" disabled={!recognized || snapshot.settings.aiProvider === 'disabled'} onClick={() => void askAi()}>AI advice</button><button className="primary-button" disabled={!recognized} onClick={() => void finish()}>Save</button></div>{feedback && <div className="ai-box"><h3>Pronunciation practice advice</h3><p>{feedback.feedback}</p><h4>Focus words</h4><p>{feedback.focusWords.join(' · ')}</p><h4>Try these phrases</h4><ul>{feedback.practicePhrases.map((phrase) => <li key={phrase}>{phrase}</li>)}</ul></div>}</div>
}

function WeeklyReviewWorkspace({ snapshot, onDone }: { snapshot: LearningSnapshot; onDone: (score?: number) => Promise<void> }) {
  const mistakes = snapshot.attempts.filter((attempt) => !attempt.correct).slice(0, 12)
  return <div className="exercise">{mistakes.length ? <div className="history-list">{mistakes.map((attempt, index) => <div key={`${attempt.itemId}-${index}`}><span>!</span><div><strong>{attempt.label}</strong><small>Your answer: {attempt.answer || 'No answer'}</small></div></div>)}</div> : <EmptyState title="No recent mistakes" description="Great work. Complete the review to keep the weekly rhythm." />}<button className="primary-button" onClick={() => void onDone()}>Complete</button></div>
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
  const premium = questions.filter((question) => !question.id.startsWith('gq-v2-'))
  const source = premium
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

function cleanGrammarPrompt(prompt: string) {
  return prompt
    .replace(/^(At the station|In class|During a trip|At home|At work|At the restaurant|While shopping|In the city|During an appointment|In a workbook)\s*-\s*/i, '')
    .replace(/^(A la gare|En classe|Pendant un voyage|A la maison|Au travail|Au restaurant|En faisant des courses|En ville|Pendant un rendez-vous|Dans un cahier dexercices)\s*-\s*/i, '')
    .replace(/^Choose the correct article:\s*/i, '')
    .replace(/^Choose the correct phrase\.\s*/i, '')
    .replace(/^Choose the correct sentence\.\s*/i, '')
    .replace(/^Choose:\s*/i, '')
    .replace(/^Complete:\s*/i, '')
    .replace(/^Choisissez le bon article\s*:\s*/i, '')
    .replace(/^Choisissez le bon groupe nominal\.\s*/i, '')
    .replace(/^Choisissez la phrase correcte\.\s*/i, '')
    .replace(/^Choisissez\s*:\s*/i, '')
    .replace(/^Completez\s*:\s*/i, '')
    .trim()
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


