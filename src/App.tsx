import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { readingExercises, writingPrompts, type ReadingExercise, type WritingPrompt } from './a2B1Curriculum'
import {
  addCard,
  addDeck,
  addTopic,
  addVerb,
  exportSnapshot,
  importSnapshot,
  loadSnapshot,
  normalizeAnswer,
  updateCardReview,
  updateSettings,
  updateTopicConfidence,
  updateVerbMastery,
} from './db'
import type {
  AiProvider,
  CefrLevel,
  ItemType,
  LearningSnapshot,
  Mission,
  Question,
  SkillTopic,
  UserSettings,
  VocabCard,
  VocabDeck,
  VerbEntry,
  ViewId,
} from './types'

const navItems: Array<{ id: ViewId; label: string; icon: string; sideLabel: string }> = [
  { id: 'dashboard', label: 'Dashboard', icon: 'assignment', sideLabel: 'Mission Control' },
  { id: 'grammar', label: 'Grammar', icon: 'map', sideLabel: 'Linguistic Roadmap' },
  { id: 'vocabulary', label: 'Vocabulary', icon: 'menu_book', sideLabel: 'Lexical Bank' },
  { id: 'conjugation', label: 'Conjugation', icon: 'rebase_edit', sideLabel: 'Verb Mastery' },
  { id: 'practice', label: 'Practice Lab', icon: 'biotech', sideLabel: 'The Lab' },
  { id: 'studio', label: 'Content Studio', icon: 'edit_note', sideLabel: 'Studio' },
]

const levels: CefrLevel[] = ['A1', 'A2', 'B1', 'B2']
const persons = ['je', 'tu', 'il/elle', 'nous', 'vous', 'ils/elles']
const tenseLabels: Record<string, string> = {
  present: 'Présent',
  passeCompose: 'Passé composé',
  imparfait: 'Imparfait',
  futurSimple: 'Futur simple',
  subjunctive: 'Subjonctif',
}

type RoadmapStatus = 'locked' | 'current' | 'review' | 'strong' | 'mastered'

interface DailyPlanTask {
  id: string
  type: ItemType | 'writing' | 'ai'
  title: string
  detail: string
  minutes: number
  difficulty: number
  progress: number
  targetView: ViewId
  targetId?: string
}

const curriculumOrder = [
  'subject-pronouns-a1',
  'tu-vous-a1',
  'articles-gender',
  'definite-articles-a1',
  'indefinite-articles-a1',
  'plural-nouns-a1',
  'adjective-agreement-a1',
  'adjective-position-a1',
  'etre-avoir',
  'present-er',
  'present-aller-faire-a1',
  'regular-ir-re-a1',
  'negation-ne-pas-a1',
  'questions',
  'c-est-il-est-a1',
  'possessive-adjectives-a1',
  'demonstrative-adjectives-a1',
  'numbers-time-a1',
  'prepositions-place-a1',
  'il-y-a-a1',
  'futur-proche-a1',
  'imperative-a1',
  'partitive-articles-a2',
  'quantities-a2',
  'reflexive-verbs-a2',
  'passe-compose',
  'passe-compose-avoir-a2',
  'passe-compose-etre-a2',
  'imparfait',
  'pc-imparfait-a2',
  'past-participle-agreement-a2',
  'object-pronouns',
  'pronoun-placement-a2',
  'y-en-intro-a2',
  'comparative-a2',
  'superlative-a2',
  'adverbs-a2',
  'time-expressions-a2',
  'future-simple-intro-a2',
  'conditional-politeness-a2',
  'relative-qui-que-ou-a2',
  'negation-varied-a2',
  'si-present-future-a2',
  'reported-speech-a2',
  'gerondif-intro-a2',
  'futur-simple-irregular-b1',
  'y-en',
  'relative-pronouns',
  'dont-ce-qui-ce-que-b1',
  'double-pronouns-b1',
  'advanced-negation-b1',
  'conditional',
  'si-imparfait-conditional-b1',
  'plus-que-parfait-b1',
  'subjunctive-basic-b1',
  'reported-speech-past-b1',
  'connectors-cause-consequence-b1',
  'opinion-argument-b1',
  'subjunctive',
  'si-clauses',
]

const prerequisiteMap: Record<string, string[]> = {
  'articles-gender': ['subject-pronouns-a1'],
  'definite-articles-a1': ['articles-gender'],
  'indefinite-articles-a1': ['articles-gender'],
  'plural-nouns-a1': ['definite-articles-a1', 'indefinite-articles-a1'],
  'adjective-agreement-a1': ['articles-gender', 'plural-nouns-a1'],
  'adjective-position-a1': ['adjective-agreement-a1'],
  'present-er': ['subject-pronouns-a1'],
  'present-aller-faire-a1': ['etre-avoir', 'present-er'],
  'regular-ir-re-a1': ['present-er'],
  'negation-ne-pas-a1': ['etre-avoir', 'present-er'],
  questions: ['etre-avoir', 'present-er'],
  'possessive-adjectives-a1': ['articles-gender'],
  'demonstrative-adjectives-a1': ['articles-gender'],
  'futur-proche-a1': ['present-aller-faire-a1'],
  'imperative-a1': ['present-er'],
  'partitive-articles-a2': ['definite-articles-a1', 'indefinite-articles-a1'],
  'quantities-a2': ['partitive-articles-a2'],
  'reflexive-verbs-a2': ['present-er'],
  'passe-compose': ['etre-avoir', 'present-er'],
  'passe-compose-avoir-a2': ['passe-compose'],
  'passe-compose-etre-a2': ['passe-compose'],
  imparfait: ['present-er'],
  'pc-imparfait-a2': ['passe-compose', 'imparfait'],
  'past-participle-agreement-a2': ['passe-compose-etre-a2'],
  'object-pronouns': ['present-er'],
  'pronoun-placement-a2': ['object-pronouns'],
  'y-en-intro-a2': ['object-pronouns'],
  'comparative-a2': ['adjective-agreement-a1'],
  'superlative-a2': ['comparative-a2'],
  'future-simple-intro-a2': ['futur-proche-a1'],
  'conditional-politeness-a2': ['future-simple-intro-a2'],
  'relative-qui-que-ou-a2': ['questions'],
  'negation-varied-a2': ['negation-ne-pas-a1'],
  'si-present-future-a2': ['future-simple-intro-a2'],
  'reported-speech-a2': ['relative-qui-que-ou-a2'],
  'gerondif-intro-a2': ['present-er'],
  'futur-simple-irregular-b1': ['future-simple-intro-a2'],
  'dont-ce-qui-ce-que-b1': ['relative-qui-que-ou-a2'],
  'double-pronouns-b1': ['pronoun-placement-a2', 'y-en-intro-a2'],
  'advanced-negation-b1': ['negation-varied-a2'],
  'si-imparfait-conditional-b1': ['conditional-politeness-a2', 'imparfait'],
  'plus-que-parfait-b1': ['pc-imparfait-a2'],
  'subjunctive-basic-b1': ['relative-qui-que-ou-a2'],
  'reported-speech-past-b1': ['reported-speech-a2', 'pc-imparfait-a2'],
  'connectors-cause-consequence-b1': ['reported-speech-a2'],
  'opinion-argument-b1': ['connectors-cause-consequence-b1'],
}

function App() {
  const [snapshot, setSnapshot] = useState<LearningSnapshot | null>(null)
  const [activeView, setActiveView] = useState<ViewId>('dashboard')
  const [selectedTopicId, setSelectedTopicId] = useState('subjunctive')
  const [selectedDeckId, setSelectedDeckId] = useState('travel-directions')
  const [selectedVerbId, setSelectedVerbId] = useState('etre')
  const [notice, setNotice] = useState('')

  const refresh = async () => {
    setSnapshot(await loadSnapshot())
  }

  useEffect(() => {
    let active = true
    void loadSnapshot().then((nextSnapshot) => {
      if (active) setSnapshot(nextSnapshot)
    })
    return () => {
      active = false
    }
  }, [])

  const updateUserSettings = async (patch: Partial<UserSettings>) => {
    if (!snapshot) return
    const next = { ...snapshot.settings, ...patch }
    await updateSettings(next)
    setSnapshot({ ...snapshot, settings: next })
  }

  const routeTo = (view: ViewId, targetId?: string) => {
    if (view === 'grammar' && targetId) setSelectedTopicId(targetId)
    if (view === 'vocabulary' && targetId) setSelectedDeckId(targetId)
    if (view === 'conjugation' && targetId) setSelectedVerbId(targetId)
    setActiveView(view)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (!snapshot) {
    return (
      <div className="min-h-screen bg-background text-on-background font-body-md flex items-center justify-center">
        <div className="border border-outline-variant bg-surface p-stack-lg rounded-xl">
          <Icon name="sync" className="text-primary animate-spin" />
          <span className="ml-2 font-headline-md text-headline-md">Loading L'Expert Français</span>
        </div>
      </div>
    )
  }

  return (
    <AppShell
      activeView={activeView}
      settings={snapshot.settings}
      onNavigate={routeTo}
      onSettings={() => setActiveView('settings')}
    >
      {notice ? (
        <div className="border border-primary bg-primary-fixed text-on-primary-fixed rounded-xl px-stack-md py-3 flex items-center justify-between gap-stack-md">
          <span className="font-body-sm text-body-sm">{notice}</span>
          <button className="text-primary" type="button" onClick={() => setNotice('')}>
            <Icon name="close" />
          </button>
        </div>
      ) : null}

      {activeView === 'dashboard' && (
        <Dashboard
          snapshot={snapshot}
          onNavigate={routeTo}
          languageMode={snapshot.settings.languageMode}
          currentLevel={snapshot.settings.currentLevel}
          onLevelChange={(currentLevel) => void updateUserSettings({ currentLevel })}
        />
      )}
      {activeView === 'grammar' && (
        <GrammarView
          topics={snapshot.topics}
          questions={snapshot.questions}
          selectedTopicId={selectedTopicId}
          languageMode={snapshot.settings.languageMode}
          settings={snapshot.settings}
          currentLevel={snapshot.settings.currentLevel}
          onLevelChange={(currentLevel) => void updateUserSettings({ currentLevel })}
          onSelectTopic={setSelectedTopicId}
          onAnswered={async (question, answer) => {
            const correct = isCorrect(answer, question.correctAnswer)
            await updateTopicConfidence(question.topicId, correct, answer, question.promptEn)
            await refresh()
            return correct
          }}
          onSpeak={snapshot.settings.speechEnabled ? speakFrench : undefined}
        />
      )}
      {activeView === 'vocabulary' && (
        <VocabularyView
          decks={snapshot.decks}
          cards={snapshot.cards}
          selectedDeckId={selectedDeckId}
          currentLevel={snapshot.settings.currentLevel}
          onSelectDeck={setSelectedDeckId}
          onReview={async (card, correct, answer) => {
            await updateCardReview(card.id, correct, answer)
            await refresh()
          }}
          onImportDeck={async (title, rows) => {
            const deckId = slugify(title) || `deck-${Date.now()}`
            await addDeck({
              id: deckId,
              title,
              description: 'Imported personal vocabulary deck.',
              level: snapshot.settings.currentLevel,
              tags: ['imported'],
            })
            await Promise.all(
              rows.map((row, index) =>
                addCard({
                  id: `${deckId}-${Date.now()}-${index}`,
                  deckId,
                  frontFr: row.frontFr,
                  backEn: row.backEn,
                  gender: row.gender,
                  exampleFr: row.exampleFr,
                  exampleEn: row.exampleEn,
                  notes: '',
                  tags: row.tags,
                  confidence: 20,
                  dueAt: new Date().toISOString(),
                  intervalDays: 1,
                }),
              ),
            )
            setSelectedDeckId(deckId)
            setNotice(`Imported ${rows.length} vocabulary cards.`)
            await refresh()
          }}
          languageMode={snapshot.settings.languageMode}
          onSpeak={snapshot.settings.speechEnabled ? speakFrench : undefined}
        />
      )}
      {activeView === 'conjugation' && (
        <ConjugationView
          verbs={snapshot.verbs}
          selectedVerbId={selectedVerbId}
          currentLevel={snapshot.settings.currentLevel}
          onSelectVerb={setSelectedVerbId}
          onAnswered={async (verbEntry, tense, answer, label, correct) => {
            await updateVerbMastery(verbEntry.id, tense, correct, answer, label)
            await refresh()
          }}
          onSpeak={snapshot.settings.speechEnabled ? speakFrench : undefined}
        />
      )}
      {activeView === 'practice' && (
        <PracticeLab
          snapshot={snapshot}
          currentLevel={snapshot.settings.currentLevel}
          onGrammarAnswer={async (question, answer) => {
            const correct = isCorrect(answer, question.correctAnswer)
            await updateTopicConfidence(question.topicId, correct, answer, question.promptEn)
            await refresh()
            return correct
          }}
          onVocabAnswer={async (card, correct, answer) => {
            await updateCardReview(card.id, correct, answer)
            await refresh()
          }}
          onVerbAnswer={async (verbEntry, tense, answer, label, correct) => {
            await updateVerbMastery(verbEntry.id, tense, correct, answer, label)
            await refresh()
          }}
          languageMode={snapshot.settings.languageMode}
        />
      )}
      {activeView === 'studio' && (
        <ContentStudio
          snapshot={snapshot}
          onNotice={setNotice}
          onRefresh={refresh}
        />
      )}
      {activeView === 'settings' && (
        <SettingsView
          settings={snapshot.settings}
          onChange={updateUserSettings}
          onNotice={setNotice}
        />
      )}
    </AppShell>
  )
}

function AppShell({
  activeView,
  settings,
  children,
  onNavigate,
  onSettings,
}: {
  activeView: ViewId
  settings: UserSettings
  children: React.ReactNode
  onNavigate: (view: ViewId) => void
  onSettings: () => void
}) {
  return (
    <div className="min-h-screen bg-background text-on-background font-body-md text-body-md antialiased flex flex-col">
      <TopNav activeView={activeView} onNavigate={onNavigate} onSettings={onSettings} />
      <div className="lg:hidden border-b border-outline-variant bg-surface px-margin-mobile py-stack-sm">
        <select
          className="w-full rounded-lg border-outline-variant bg-surface-container-low text-on-surface"
          value={activeView}
          onChange={(event) => onNavigate(event.currentTarget.value as ViewId)}
          aria-label="Primary view"
        >
          {[...navItems, { id: 'settings' as ViewId, label: 'Settings', icon: 'settings', sideLabel: 'Settings' }].map(
            (item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ),
          )}
        </select>
      </div>
      <div className="flex flex-1 max-w-container-max w-full mx-auto px-margin-mobile md:px-margin-desktop gap-gutter py-stack-lg">
        <SideNav activeView={activeView} settings={settings} onNavigate={onNavigate} onSettings={onSettings} />
        <main className="flex-1 flex flex-col gap-stack-lg min-w-0">{children}</main>
      </div>
    </div>
  )
}

function TopNav({
  activeView,
  onNavigate,
  onSettings,
}: {
  activeView: ViewId
  onNavigate: (view: ViewId) => void
  onSettings: () => void
}) {
  return (
    <header className="bg-surface border-b border-outline-variant sticky top-0 z-50">
      <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto h-16">
        <div className="flex items-center gap-stack-lg min-w-0">
          <button
            className="font-headline-lg text-headline-lg font-bold text-primary truncate"
            type="button"
            onClick={() => onNavigate('dashboard')}
          >
            L'Expert Français
          </button>
          <nav className="hidden md:flex items-end gap-stack-md h-full pt-stack-sm">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                className={
                  activeView === item.id
                    ? 'text-primary border-b-2 border-secondary font-bold pb-1 transition-colors opacity-90 font-label-md text-label-md'
                    : 'text-on-surface-variant hover:text-primary transition-colors pb-[6px] font-label-md text-label-md'
                }
                onClick={() => onNavigate(item.id)}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-stack-sm text-primary">
          <button
            className="p-2 hover:bg-surface-variant rounded-full transition-colors"
            type="button"
            onClick={() => onNavigate('practice')}
            aria-label="Search practice"
          >
            <Icon name="search" />
          </button>
          <button
            className="p-2 hover:bg-surface-variant rounded-full transition-colors"
            type="button"
            onClick={onSettings}
            aria-label="Settings"
          >
            <Icon name="settings" />
          </button>
          <button className="p-2 hover:bg-surface-variant rounded-full transition-colors" type="button" aria-label="Profile">
            <Icon name="account_circle" />
          </button>
        </div>
      </div>
    </header>
  )
}

function SideNav({
  activeView,
  settings,
  onNavigate,
  onSettings,
}: {
  activeView: ViewId
  settings: UserSettings
  onNavigate: (view: ViewId) => void
  onSettings: () => void
}) {
  return (
    <aside className="hidden lg:flex flex-col w-64 bg-surface-container-low border-r border-outline-variant py-stack-md px-stack-sm flex-shrink-0 h-[calc(100vh-80px)] sticky top-20 rounded-xl">
      <div className="flex flex-col items-center mb-stack-lg p-stack-sm">
        <div className="w-16 h-16 rounded-full bg-primary-fixed-dim text-primary flex items-center justify-center font-headline-md text-headline-md font-bold mb-unit">
          JD
        </div>
        <h2 className="font-headline-md text-headline-md font-bold text-on-surface">Jean Dupont</h2>
        <p className="font-label-md text-label-md text-on-surface-variant">
          {levelLabel(settings.currentLevel, settings.languageMode)}
        </p>
        <button
          className="mt-stack-md w-full py-2 bg-secondary text-on-secondary rounded-lg font-label-md text-label-md font-bold hover:bg-secondary-container transition-colors"
          type="button"
          onClick={() => onNavigate('practice')}
        >
          {settings.languageMode === 'fr' ? 'Testez-vous' : 'Test Yourself'}
        </button>
      </div>
      <nav className="flex-1 flex flex-col gap-unit">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={
              activeView === item.id
                ? 'flex items-center gap-stack-sm px-stack-md py-3 bg-primary-container text-on-primary-container rounded-xl font-bold font-body-md text-body-md scale-[0.98] transition-transform duration-100 text-left'
                : 'flex items-center gap-stack-sm px-stack-md py-3 text-on-surface-variant hover:bg-surface-container-high rounded-xl font-body-md text-body-md transition-all text-left'
            }
            type="button"
            onClick={() => onNavigate(item.id)}
          >
            <Icon name={item.icon} fill={activeView === item.id} />
            {item.sideLabel}
          </button>
        ))}
      </nav>
      <div className="mt-auto border-t border-outline-variant pt-stack-md flex flex-col gap-unit">
        <button
          className={
            activeView === 'settings'
              ? 'flex items-center gap-stack-sm px-stack-md py-2 bg-surface-container-high text-primary rounded-lg font-body-md text-body-md transition-all text-left'
              : 'flex items-center gap-stack-sm px-stack-md py-2 text-on-surface-variant hover:bg-surface-container-high rounded-lg font-body-md text-body-md transition-all text-left'
          }
          type="button"
          onClick={onSettings}
        >
          <Icon name="settings" />
          Settings
        </button>
        <button
          className="flex items-center gap-stack-sm px-stack-md py-2 text-on-surface-variant hover:bg-surface-container-high rounded-lg font-body-md text-body-md transition-all text-left"
          type="button"
          onClick={() => onNavigate('studio')}
        >
          <Icon name="help" />
          Support
        </button>
      </div>
    </aside>
  )
}

function Dashboard({
  snapshot,
  languageMode,
  currentLevel,
  onLevelChange,
  onNavigate,
}: {
  snapshot: LearningSnapshot
  languageMode: UserSettings['languageMode']
  currentLevel: CefrLevel
  onLevelChange: (level: CefrLevel) => void
  onNavigate: (view: ViewId, targetId?: string) => void
}) {
  const scopedDecks = snapshot.decks.filter((deck) => isAtOrBelow(deck.level, currentLevel))
  const scopedDeckIds = new Set(scopedDecks.map((deck) => deck.id))
  const scopedTopics = snapshot.topics.filter((topic) => isAtOrBelow(topic.level, currentLevel))
  const scopedCards = snapshot.cards.filter((card) => scopedDeckIds.has(card.deckId))
  const scopedVerbs = snapshot.verbs.filter((verbEntry) => isAtOrBelow(verbEntry.level, currentLevel))
  const topicPool = scopedTopics.length ? scopedTopics : snapshot.topics
  const cardPool = scopedCards.length ? scopedCards : snapshot.cards
  const verbPool = scopedVerbs.length ? scopedVerbs : snapshot.verbs
  const dailyTargetMinutes = getDailyTargetMinutes(snapshot.settings)
  const weeklyCompletedMinutes = snapshot.attempts.length * 8
  const sortedTopics = sortTopicsForStudy(topicPool, topicPool)
  const dailyPlan = buildDailyPlan({
    topics: topicPool,
    cards: cardPool,
    decks: scopedDecks.length ? scopedDecks : snapshot.decks,
    verbs: verbPool,
    dailyTargetMinutes,
    languageMode,
    aiEnabled: snapshot.settings.aiProvider !== 'disabled',
  })
  const plannedMinutes = dailyPlan.reduce((sum, task) => sum + task.minutes, 0)
  const nextUnlocks = sortedTopics.filter((topic) => getRoadmapStatus(topic, topicPool) === 'locked').slice(0, 3)
  const mastery = Math.round(
    average([
      ...topicPool.map((topic) => topic.confidence),
      ...cardPool.map((card) => card.confidence),
      ...verbPool.flatMap((verbEntry) => Object.values(verbEntry.mastery)),
    ]),
  )
  const weakTopic = [...topicPool].sort((a, b) => a.confidence - b.confidence)[0]
  const dueCards = cardPool.filter((card) => new Date(card.dueAt) <= new Date())
  const dueDeck =
    (scopedDecks.length ? scopedDecks : snapshot.decks).find((deck) => dueCards.some((card) => card.deckId === deck.id)) ??
    scopedDecks[0] ??
    snapshot.decks[0]
  const weakVerb = [...verbPool].sort((a, b) => average(Object.values(a.mastery)) - average(Object.values(b.mastery)))[0]
  const missions: Mission[] = [
    {
      id: 'mission-grammar',
      type: 'grammar',
      title: label(languageMode, weakTopic.titleEn, weakTopic.titleFr),
      detail: label(languageMode, 'Review your lowest-confidence grammar skill.', 'Révisez votre point de grammaire le plus fragile.'),
      progress: weakTopic.confidence,
      action: weakTopic.confidence > 0 ? 'Start' : 'Begin',
      targetView: 'grammar',
    },
    {
      id: 'mission-vocab',
      type: 'vocabulary',
      title: dueDeck.title,
      detail: `${dueCards.length || cardPool.filter((card) => card.deckId === dueDeck.id).length} cards ready`,
      progress: Math.round(average(cardPool.filter((card) => card.deckId === dueDeck.id).map((card) => card.confidence))),
      action: 'Continue',
      targetView: 'vocabulary',
    },
    {
      id: 'mission-verb',
      type: 'conjugation',
      title: `${weakVerb.infinitive} drills`,
      detail: label(languageMode, 'Focus on low-mastery verb forms.', 'Travaillez les formes verbales les plus faibles.'),
      progress: Math.round(average(Object.values(weakVerb.mastery))),
      action: 'Review',
      targetView: 'conjugation',
    },
  ]
  void missions

  return (
    <>
      <section>
        <h1 className="font-display text-display text-primary mb-stack-md">Mission Control</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant mb-stack-lg">
          {label(
            languageMode,
            'Bonjour, Jean. Here is your structured learning path for today.',
            'Bonjour, Jean. Voici votre parcours structuré pour aujourd’hui.',
          )}
        </p>
        <div className="bg-surface border border-outline-variant rounded-xl p-stack-md mb-stack-lg flex flex-col lg:flex-row lg:items-center lg:justify-between gap-stack-md">
          <div>
            <span className="font-label-md text-label-md text-secondary">Current Level</span>
            <h2 className="font-headline-lg text-headline-lg text-primary mt-1">
              {levelLabel(currentLevel, languageMode)}
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              {label(
                languageMode,
                'Missions, decks, verb drills, and the roadmap prioritize this level and below.',
                'Les missions, paquets, exercices de verbes et la carte priorisent ce niveau et les précédents.',
              )}
            </p>
          </div>
          <LevelSelector value={currentLevel} onChange={onLevelChange} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-stack-lg">
          <StatCard icon="local_fire_department" label="Daily Streak" value="12" suffix="days" tone="secondary" />
          <StatCard icon="military_tech" label="Mastery Score" value={`${mastery}`} suffix="%" tone="primary" />
          <div className="bg-surface-container-low border border-outline-variant rounded-xl p-stack-md flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-unit">
              <Icon name="trending_up" className="text-primary" />
              <span className="font-label-md text-label-md text-on-surface-variant">CEFR Level Progression</span>
            </div>
            <div className="font-headline-md text-headline-md text-on-surface mb-2">
              {currentLevel} → {snapshot.settings.targetLevel}
            </div>
            <ProgressBar value={Math.min(88, Math.max(18, mastery - 20))} color="bg-primary" />
          </div>
        </div>
      </section>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-gutter">
        <div className="xl:col-span-2 flex flex-col gap-stack-lg">
          <TodayPlan
            tasks={dailyPlan}
            dailyTargetMinutes={dailyTargetMinutes}
            plannedMinutes={plannedMinutes}
            onNavigate={onNavigate}
          />
          <WeeklyPlanPanel
            settings={snapshot.settings}
            completedMinutes={weeklyCompletedMinutes}
            plannedMinutes={plannedMinutes}
            nextUnlocks={nextUnlocks}
            languageMode={languageMode}
          />
        </div>
        <div className="xl:col-span-1">
          <CurriculumRoadmap
            topics={topicPool}
            languageMode={languageMode}
            onSelect={(topic) => onNavigate('grammar', topic.id)}
          />
          <AiCoachPanel settings={snapshot.settings} languageMode={languageMode} className="mt-stack-lg" />
        </div>
      </div>
    </>
  )
}

function StatCard({
  icon,
  label: cardLabel,
  value,
  suffix,
  tone,
}: {
  icon: string
  label: string
  value: string
  suffix: string
  tone: 'primary' | 'secondary'
}) {
  return (
    <div className="bg-surface-container-low border border-outline-variant rounded-xl p-stack-md flex flex-col justify-between">
      <div className="flex items-center gap-2 mb-unit">
        <Icon name={icon} className={tone === 'primary' ? 'text-primary' : 'text-secondary'} />
        <span className="font-label-md text-label-md text-on-surface-variant">{cardLabel}</span>
      </div>
      <div className="font-display text-display text-on-surface">
        {value} <span className="font-headline-md text-headline-md text-on-surface-variant font-normal">{suffix}</span>
      </div>
    </div>
  )
}

function MissionCard({ mission, onStart }: { mission: Mission; onStart: () => void }) {
  const color = mission.type === 'grammar' ? 'bg-secondary' : mission.type === 'vocabulary' ? 'bg-primary' : 'bg-outline'
  const textColor =
    mission.type === 'grammar' ? 'text-secondary' : mission.type === 'vocabulary' ? 'text-primary' : 'text-outline'

  return (
    <div className="bg-surface border border-outline-variant p-stack-md hover:bg-surface-container-lowest transition-colors relative flex flex-col sm:flex-row sm:items-center justify-between gap-stack-md group">
      <div className={`absolute top-0 left-0 w-1 h-full ${color}`} />
      <div className="pl-2">
        <div className="flex items-center gap-2 mb-1">
          <span className={`font-label-md text-label-md ${textColor}`}>{mission.type}</span>
          <div className={`w-2 h-2 rounded-full ${color}`} />
        </div>
        <h3 className="font-headline-md text-headline-md text-on-surface">{mission.title}</h3>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">{mission.detail}</p>
      </div>
      <div className="flex items-center gap-stack-md pl-2 sm:pl-0">
        <div className="hidden sm:flex flex-col items-end">
          <span className="font-label-md text-label-md text-on-surface-variant mb-1">{mission.progress}%</span>
          <div className="w-24">
            <ProgressBar value={mission.progress} color={color} />
          </div>
        </div>
        <button
          className={
            mission.type === 'conjugation'
              ? 'border border-primary text-primary px-4 py-2 rounded font-label-md text-label-md hover:bg-primary-fixed-dim transition-colors'
              : 'bg-primary text-on-primary px-4 py-2 rounded font-label-md text-label-md hover:bg-primary-container transition-colors'
          }
          type="button"
          onClick={onStart}
        >
          {mission.action}
        </button>
      </div>
    </div>
  )
}

function RecentActivityTable({ attempts }: { attempts: LearningSnapshot['attempts'] }) {
  const rows =
    attempts.length > 0
      ? attempts.slice(0, 5).map((attempt) => ({
          session: attempt.label,
          type: attempt.itemType,
          accuracy: attempt.correct ? '100%' : '0%',
        }))
      : [
          { session: 'Imperfect vs. Passé Composé', type: 'Grammar Test', accuracy: '85%' },
          { session: 'Culinary Terms', type: 'Vocab Quiz', accuracy: '62%' },
          { session: 'Future Proche', type: 'Verb Drill', accuracy: '95%' },
        ]

  return (
    <section>
      <SectionTitle title="Recent Activity" />
      <div className="bg-surface border border-outline-variant rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-surface-container-low border-b border-outline-variant">
            <tr>
              <th className="px-stack-md py-3 font-label-md text-label-md text-on-surface-variant">Session</th>
              <th className="px-stack-md py-3 font-label-md text-label-md text-on-surface-variant">Type</th>
              <th className="px-stack-md py-3 font-label-md text-label-md text-on-surface-variant text-right">Accuracy</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {rows.map((row) => (
              <tr key={`${row.session}-${row.type}`} className="hover:bg-surface-container-lowest">
                <td className="px-stack-md py-3 font-body-sm text-body-sm text-on-surface">{row.session}</td>
                <td className="px-stack-md py-3 font-label-md text-label-md text-outline">{row.type}</td>
                <td
                  className={
                    row.accuracy === '0%'
                      ? 'px-stack-md py-3 font-mono-code text-mono-code text-right text-secondary'
                      : 'px-stack-md py-3 font-mono-code text-mono-code text-right text-primary'
                  }
                >
                  {row.accuracy}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function Brainmap({
  topics,
  languageMode,
  onSelect,
}: {
  topics: SkillTopic[]
  languageMode: UserSettings['languageMode']
  onSelect: (topic: SkillTopic) => void
}) {
  return (
    <section className="bg-surface border border-outline-variant rounded-xl p-stack-md sticky top-24">
      <div className="flex justify-between items-center mb-stack-md">
        <h2 className="font-headline-md text-headline-md text-primary">The Brainmap</h2>
        <Icon name="open_in_new" className="text-on-surface-variant" />
      </div>
      <p className="font-body-sm text-body-sm text-on-surface-variant mb-stack-md">
        {label(languageMode, 'A conceptual overview of your grammar mastery.', 'Une vue conceptuelle de votre maîtrise grammaticale.')}
      </p>
      <div className="grid grid-cols-4 sm:grid-cols-5 gap-unit mb-stack-md aspect-square bg-surface-container-lowest border border-outline-variant p-unit rounded-lg">
        {topics.map((topic) => (
          <button
            key={topic.id}
            className={`rounded transition-transform hover:scale-95 ${confidenceColor(topic.confidence)}`}
            title={`${label(languageMode, topic.titleEn, topic.titleFr)} - ${topic.confidence}%`}
            type="button"
            onClick={() => onSelect(topic)}
            aria-label={label(languageMode, topic.titleEn, topic.titleFr)}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {[
          ['bg-surface-variant', 'Untested'],
          ['bg-secondary', 'Weak'],
          ['bg-[#eab308]', 'Learning'],
          ['bg-primary opacity-50', 'Strong'],
          ['bg-outline-variant', 'Mastered'],
        ].map(([className, text]) => (
          <div className="flex items-center gap-1" key={text}>
            <div className={`w-3 h-3 rounded ${className}`} />
            <span className="font-label-md text-[10px] text-on-surface-variant">{text}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

void MissionCard
void RecentActivityTable
void Brainmap

function TodayPlan({
  tasks,
  dailyTargetMinutes,
  plannedMinutes,
  onNavigate,
}: {
  tasks: DailyPlanTask[]
  dailyTargetMinutes: number
  plannedMinutes: number
  onNavigate: (view: ViewId, targetId?: string) => void
}) {
  return (
    <section>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-stack-sm border-b border-outline-variant pb-2 mb-stack-md">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-primary">Today's Study Plan</h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Ordered by prerequisite readiness and increasing difficulty.
          </p>
        </div>
        <div className="font-label-md text-label-md text-primary">
          {plannedMinutes}/{dailyTargetMinutes} min planned
        </div>
      </div>
      <div className="flex flex-col gap-stack-sm">
        {tasks.map((task, index) => (
          <PlanTaskCard key={task.id} task={task} index={index} onNavigate={onNavigate} />
        ))}
      </div>
    </section>
  )
}

function PlanTaskCard({
  task,
  index,
  onNavigate,
}: {
  task: DailyPlanTask
  index: number
  onNavigate: (view: ViewId, targetId?: string) => void
}) {
  const color = task.type === 'grammar' ? 'bg-secondary' : task.type === 'vocabulary' ? 'bg-primary' : 'bg-outline'

  return (
    <div className="bg-surface border border-outline-variant p-stack-md hover:bg-surface-container-lowest transition-colors relative flex flex-col sm:flex-row sm:items-center justify-between gap-stack-md">
      <div className={`absolute top-0 left-0 w-1 h-full ${color}`} />
      <div className="pl-2 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span className="font-label-md text-label-md text-primary">Step {index + 1}</span>
          <span className="font-label-md text-label-md text-on-surface-variant">{task.minutes} min</span>
          <span className="font-label-md text-label-md text-on-surface-variant">Difficulty {task.difficulty}/5</span>
        </div>
        <h3 className="font-headline-md text-headline-md text-on-surface">{task.title}</h3>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">{task.detail}</p>
      </div>
      <div className="flex items-center gap-stack-md pl-2 sm:pl-0">
        <div className="hidden sm:flex flex-col items-end">
          <span className="font-label-md text-label-md text-on-surface-variant mb-1">{task.progress}%</span>
          <div className="w-24">
            <ProgressBar value={task.progress} color={color} />
          </div>
        </div>
        <button
          className="bg-primary text-on-primary px-4 py-2 rounded font-label-md text-label-md hover:bg-primary-container transition-colors"
          type="button"
          onClick={() => onNavigate(task.targetView, task.targetId)}
        >
          Start
        </button>
      </div>
    </div>
  )
}

function WeeklyPlanPanel({
  settings,
  completedMinutes,
  plannedMinutes,
  nextUnlocks,
  languageMode,
}: {
  settings: UserSettings
  completedMinutes: number
  plannedMinutes: number
  nextUnlocks: SkillTopic[]
  languageMode: UserSettings['languageMode']
}) {
  const weeklyTargetMinutes = Math.round(settings.weeklyStudyHours * 60)
  const dailyTargetMinutes = getDailyTargetMinutes(settings)

  return (
    <section className="bg-surface border border-outline-variant rounded-xl p-stack-md">
      <SectionTitle title="This Week's Plan" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-stack-sm mb-stack-md">
        <MiniMetric labelText="Weekly Goal" value={`${settings.weeklyStudyHours}h`} />
        <MiniMetric labelText="Daily Target" value={`${dailyTargetMinutes}m`} />
        <MiniMetric labelText="Study Days" value={`${settings.studyDaysPerWeek}/week`} />
      </div>
      <ProgressBar value={(completedMinutes / Math.max(1, weeklyTargetMinutes)) * 100} color="bg-primary" />
      <p className="font-body-sm text-body-sm text-on-surface-variant mt-stack-sm">
        Today adds {plannedMinutes} minutes toward your weekly goal. Weekly completion is estimated from completed practice attempts.
      </p>
      {nextUnlocks.length ? (
        <div className="mt-stack-md">
          <h3 className="font-headline-md text-headline-md text-primary mb-stack-sm">Next Unlocks</h3>
          <div className="flex flex-col gap-unit">
            {nextUnlocks.map((topic) => (
              <div key={topic.id} className="border border-outline-variant bg-surface-container-low rounded-lg p-stack-sm">
                <span className="font-label-md text-label-md text-on-surface-variant">
                  {topic.level} · Difficulty {getTopicDifficulty(topic)}/5
                </span>
                <p className="font-body-md text-body-md text-on-surface">{label(languageMode, topic.titleEn, topic.titleFr)}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  )
}

function CurriculumRoadmap({
  topics,
  languageMode,
  onSelect,
}: {
  topics: SkillTopic[]
  languageMode: UserSettings['languageMode']
  onSelect: (topic: SkillTopic) => void
}) {
  const orderedTopics = sortTopicsForStudy(topics, topics)

  return (
    <section className="bg-surface border border-outline-variant rounded-xl p-stack-md sticky top-24">
      <div className="flex items-center justify-between mb-stack-md">
        <div>
          <h2 className="font-headline-md text-headline-md text-primary">Curriculum Roadmap</h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Clear topic order with locked, current, review, and mastered states.
          </p>
        </div>
        <Icon name="route" className="text-primary" />
      </div>
      <div className="flex flex-col gap-stack-sm max-h-[620px] overflow-auto pr-1">
        {levels.map((level) => {
          const levelTopics = orderedTopics.filter((topic) => topic.level === level)
          if (!levelTopics.length) return null
          return (
            <div key={level}>
              <h3 className="font-label-md text-label-md text-secondary mb-unit">{level}</h3>
              <div className="flex flex-col gap-unit">
                {levelTopics.map((topic) => {
                  const status = getRoadmapStatus(topic, topics)
                  return (
                    <button
                      key={topic.id}
                      className="text-left border border-outline-variant bg-surface-container-lowest hover:border-primary rounded-lg p-stack-sm"
                      type="button"
                      onClick={() => onSelect(topic)}
                    >
                      <div className="flex items-center justify-between gap-stack-sm">
                        <span className="font-body-sm text-body-sm text-on-surface">
                          {label(languageMode, topic.titleEn, topic.titleFr)}
                        </span>
                        <RoadmapBadge status={status} />
                      </div>
                      <div className="mt-unit flex items-center justify-between gap-stack-sm">
                        <span className="font-label-md text-label-md text-on-surface-variant">
                          Difficulty {getTopicDifficulty(topic)}/5 · {getEstimatedMinutes(topic)} min
                        </span>
                        <span className="font-mono-code text-mono-code text-primary">{topic.confidence}%</span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

function RoadmapBadge({ status }: { status: RoadmapStatus }) {
  const styles: Record<RoadmapStatus, string> = {
    locked: 'bg-surface-variant text-on-surface-variant',
    current: 'bg-primary-fixed text-primary',
    review: 'bg-secondary-fixed text-secondary',
    strong: 'bg-[#fef3c7] text-[#854d0e]',
    mastered: 'bg-surface-container-highest text-on-surface',
  }

  return <span className={`rounded px-2 py-1 font-label-md text-[10px] ${styles[status]}`}>{status}</span>
}

function AiCoachPanel({
  settings,
  languageMode,
  className = '',
}: {
  settings: UserSettings
  languageMode: UserSettings['languageMode']
  className?: string
}) {
  return (
    <section className={`bg-surface border border-outline-variant rounded-xl p-stack-md ${className}`}>
      <div className="flex items-center justify-between gap-stack-sm mb-stack-sm">
        <h2 className="font-headline-md text-headline-md text-primary">AI Coach</h2>
        <Icon name="psychology" className="text-primary" />
      </div>
      <p className="font-body-sm text-body-sm text-on-surface-variant mb-stack-md">
        {settings.aiProvider === 'disabled'
          ? 'AI is off. Enable Ollama, Groq, or Gemini in Settings to unlock coaching actions.'
          : `Using ${settings.aiProvider} for mistake explanations, sentence checks, extra practice, and plan advice.`}
      </p>
      <AiActionButton
        settings={settings}
        endpoint="/api/ai/explain"
        labelText="Ask AI for Plan Advice"
        disabledText="Enable AI in Settings"
        prompt={label(
          languageMode,
          'Suggest one concise improvement to today’s French study plan.',
          'Propose une amélioration concise pour le plan d’étude de français d’aujourd’hui.',
        )}
      />
    </section>
  )
}

function AiActionButton({
  settings,
  endpoint,
  labelText,
  disabledText,
  prompt,
}: {
  settings: UserSettings
  endpoint: '/api/ai/explain' | '/api/ai/generate-practice' | '/api/ai/check-sentence' | '/api/ai/deck-from-text'
  labelText: string
  disabledText: string
  prompt: string
}) {
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState('')

  const run = async () => {
    if (settings.aiProvider === 'disabled') {
      setResponse(disabledText)
      return
    }

    setLoading(true)
    setResponse('')
    try {
      const result = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: settings.aiProvider,
          model: settings.aiModel,
          ollamaHost: settings.ollamaHost,
          prompt,
        }),
      })
      const payload = (await result.json()) as { text?: string; error?: string }
      setResponse(payload.text ?? payload.error ?? 'AI did not return a response.')
    } catch {
      setResponse('AI provider unavailable. Check Settings and the local proxy.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <button
        className="border border-primary text-primary rounded px-stack-md py-2 font-label-md text-label-md disabled:opacity-50"
        type="button"
        disabled={loading}
        onClick={() => void run()}
      >
        {loading ? 'Asking AI...' : labelText}
      </button>
      {response ? (
        <div className="mt-stack-sm border border-outline-variant bg-surface-container-low rounded-lg p-stack-sm">
          <p className="font-body-sm text-body-sm text-on-surface-variant whitespace-pre-wrap">{response}</p>
        </div>
      ) : null}
    </div>
  )
}

function GrammarView({
  topics,
  questions,
  selectedTopicId,
  languageMode,
  settings,
  currentLevel,
  onLevelChange,
  onSelectTopic,
  onAnswered,
  onSpeak,
}: {
  topics: SkillTopic[]
  questions: Question[]
  selectedTopicId: string
  languageMode: UserSettings['languageMode']
  settings: UserSettings
  currentLevel: CefrLevel
  onLevelChange: (level: CefrLevel) => void
  onSelectTopic: (topicId: string) => void
  onAnswered: (question: Question, answer: string) => Promise<boolean>
  onSpeak?: (text: string) => void
}) {
  const visibleLevels = levels.filter((level) => isAtOrBelow(level, currentLevel))
  const visibleTopics = topics.filter((topic) => isAtOrBelow(topic.level, currentLevel))
  const selectedTopic = visibleTopics.find((topic) => topic.id === selectedTopicId) ?? visibleTopics[0] ?? topics[0]
  const questionCountByTopic = useMemo(
    () =>
      questions.reduce<Record<string, number>>((counts, question) => {
        counts[question.topicId] = (counts[question.topicId] ?? 0) + 1
        return counts
      }, {}),
    [questions],
  )
  const topicQuestions = questions.filter((question) => question.topicId === selectedTopic.id)
  const quizSet = topicQuestions.slice(0, 10)
  const [answer, setAnswer] = useState('')
  const [feedback, setFeedback] = useState<{ correct: boolean; explanation: string } | null>(null)
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0)
  const [quizStats, setQuizStats] = useState({ correct: 0, answered: 0 })
  const quizComplete = !feedback && quizSet.length > 0 && quizStats.answered >= quizSet.length
  const activeQuestion = quizSet[activeQuestionIndex] ?? quizSet[0]

  const submitAnswer = async (value: string) => {
    if (!activeQuestion || feedback || quizComplete) return
    const correct = await onAnswered(activeQuestion, value)
    setQuizStats((stats) => ({
      correct: stats.correct + (correct ? 1 : 0),
      answered: stats.answered + 1,
    }))
    setFeedback({
      correct,
      explanation: label(languageMode, activeQuestion.explanationEn, activeQuestion.explanationFr),
    })
  }

  const resetQuiz = () => {
    setAnswer('')
    setFeedback(null)
    setActiveQuestionIndex(0)
    setQuizStats({ correct: 0, answered: 0 })
  }

  return (
    <div className="flex flex-col gap-stack-lg">
      <HeaderBlock
        title={label(languageMode, 'Linguistic Roadmap', 'Feuille de route linguistique')}
        subtitle={label(
          languageMode,
          'A1-B2 grammar topics with organized 10-question quiz sets and confidence-based review.',
          'Points de grammaire A1-B2 avec séries organisées de 10 questions et révision par confiance.',
        )}
      />
      <div className="bg-surface border border-outline-variant rounded-xl p-stack-md flex flex-col md:flex-row md:items-center md:justify-between gap-stack-md">
        <div>
          <span className="font-label-md text-label-md text-secondary">Roadmap Level</span>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Focused on {currentLevel}: {visibleTopics.length} grammar topics and {visibleTopics.length * 10} quiz prompts available.
          </p>
        </div>
        <LevelSelector value={currentLevel} onChange={onLevelChange} />
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_380px] gap-gutter">
        <section className="flex flex-col gap-stack-md">
          {visibleLevels.map((level) => {
            const levelTopics = visibleTopics.filter((topic) => topic.level === level)
            return (
              <div key={level}>
                <SectionTitle title={`${level} Grammar`} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-sm">
                  {levelTopics.map((topic) => (
                    <button
                      key={topic.id}
                      type="button"
                      className={
                        topic.id === selectedTopic.id
                          ? 'text-left bg-primary-fixed border border-primary rounded-xl p-stack-md'
                          : 'text-left bg-surface border border-outline-variant rounded-xl p-stack-md hover:bg-surface-container-lowest transition-colors'
                      }
                      onClick={() => {
                        onSelectTopic(topic.id)
                        setAnswer('')
                        setFeedback(null)
                        setActiveQuestionIndex(0)
                      }}
                    >
                      <div className="flex items-center justify-between gap-stack-sm mb-2">
                        <span className="font-label-md text-label-md text-on-surface-variant">{topic.area}</span>
                        <span className="font-mono-code text-mono-code text-primary">{topic.confidence}%</span>
                      </div>
                      <h3 className="font-headline-md text-headline-md text-on-surface">
                        {label(languageMode, topic.titleEn, topic.titleFr)}
                      </h3>
                      <div className="mt-stack-sm flex flex-wrap items-center gap-unit">
                        <span className="rounded bg-surface-container-low px-2 py-1 font-label-md text-[10px] text-on-surface-variant">
                          {Math.min(questionCountByTopic[topic.id] ?? 0, 10)}Q set
                        </span>
                        <span className="rounded bg-surface-container-low px-2 py-1 font-label-md text-[10px] text-on-surface-variant">
                          Difficulty {getTopicDifficulty(topic)}/5
                        </span>
                      </div>
                      <div className="mt-stack-sm">
                        <ProgressBar value={topic.confidence} color={confidenceColor(topic.confidence)} />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
        </section>
        <aside className="bg-surface border border-outline-variant rounded-xl p-stack-md h-fit sticky top-24">
          <div className="flex items-start justify-between gap-stack-sm">
            <div>
              <span className="font-label-md text-label-md text-secondary">{selectedTopic.level} · {selectedTopic.area}</span>
              <h2 className="font-headline-lg text-headline-lg text-primary mt-1">
                {label(languageMode, selectedTopic.titleEn, selectedTopic.titleFr)}
              </h2>
            </div>
            {onSpeak ? (
              <button className="p-2 text-primary hover:bg-surface-container-low rounded-full" type="button" onClick={() => onSpeak(selectedTopic.examples[0])}>
                <Icon name="volume_up" />
              </button>
            ) : null}
          </div>
          <div className="flex flex-col gap-unit my-stack-md">
            {selectedTopic.examples.map((example) => (
              <button
                key={example}
                className="text-left font-mono-code text-mono-code bg-surface-container-low border border-outline-variant rounded-lg px-stack-sm py-2 hover:border-primary"
                type="button"
                onClick={() => onSpeak?.(example)}
              >
                {example}
              </button>
            ))}
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant mb-stack-lg">
            {label(languageMode, selectedTopic.explanationEn, selectedTopic.explanationFr)}
          </p>
          {quizComplete ? (
            <div className="border-t border-outline-variant pt-stack-md">
              <div className="rounded-xl border border-primary bg-primary-fixed p-stack-md">
                <p className="font-label-md text-label-md text-primary">Quiz set complete</p>
                <h3 className="font-headline-lg text-headline-lg text-on-surface mt-1">
                  {quizStats.correct}/{quizSet.length} correct
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  {quizStats.correct >= 8
                    ? 'Strong result. Review the explanations, then move to the next linked topic.'
                    : 'Review the examples and repeat the set once before moving on.'}
                </p>
                <button
                  className="mt-stack-md bg-primary text-on-primary rounded px-stack-md py-2 font-label-md text-label-md"
                  type="button"
                  onClick={resetQuiz}
                >
                  Repeat 10-question set
                </button>
              </div>
            </div>
          ) : activeQuestion ? (
            <div className="border-t border-outline-variant pt-stack-md">
              <div className="flex items-center justify-between mb-stack-sm">
                <div>
                  <h3 className="font-headline-md text-headline-md text-on-surface">10-question quiz set</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Score {quizStats.correct}/{quizStats.answered}
                  </p>
                </div>
                <span className="font-label-md text-label-md text-on-surface-variant">
                  {activeQuestionIndex + 1}/{quizSet.length}
                </span>
              </div>
              <ProgressBar value={((activeQuestionIndex + (feedback ? 1 : 0)) / Math.max(1, quizSet.length)) * 100} color="bg-primary" />
              <p className="font-body-md text-body-md text-on-surface mb-stack-md">
                {label(languageMode, activeQuestion.promptEn, activeQuestion.promptFr)}
              </p>
              {activeQuestion.type === 'multiple-choice' && activeQuestion.choices ? (
                <div className="grid grid-cols-1 gap-unit">
                  {activeQuestion.choices.map((choice) => (
                    <button
                      className="border border-outline-variant bg-surface-container-lowest rounded-lg px-stack-sm py-2 text-left hover:border-primary disabled:opacity-60"
                      key={choice}
                      type="button"
                      disabled={!!feedback}
                      onClick={() => submitAnswer(choice)}
                    >
                      {choice}
                    </button>
                  ))}
                </div>
              ) : (
                <form
                  className="flex gap-stack-sm"
                  onSubmit={(event) => {
                    event.preventDefault()
                    void submitAnswer(answer)
                  }}
                >
                  <input
                    className="flex-1 rounded-lg border-outline-variant"
                    value={answer}
                    onChange={(event) => setAnswer(event.currentTarget.value)}
                    placeholder="Votre réponse"
                  />
                  <button className="bg-primary text-on-primary rounded px-stack-md font-label-md text-label-md" type="submit">
                    Check
                  </button>
                </form>
              )}
              {feedback ? (
                <div
                  className={
                    feedback.correct
                      ? 'mt-stack-md border border-primary bg-primary-fixed rounded-xl p-stack-sm'
                      : 'mt-stack-md border border-secondary bg-secondary-fixed rounded-xl p-stack-sm'
                  }
                >
                  <p className="font-label-md text-label-md">{feedback.correct ? 'Correct' : 'Review'}</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">{feedback.explanation}</p>
                  <button
                    className="mt-stack-sm text-primary font-label-md text-label-md"
                    type="button"
                    onClick={() => {
                      setFeedback(null)
                      setAnswer('')
                      setActiveQuestionIndex((index) => index + 1)
                    }}
                  >
                    {activeQuestionIndex + 1 >= quizSet.length ? 'Finish set' : 'Next question'}
                  </button>
                  <div className="mt-stack-sm">
                    <AiActionButton
                      settings={settings}
                      endpoint="/api/ai/explain"
                      labelText="Explain with AI"
                      disabledText="Enable AI for explanations"
                      prompt={`Explain this French mistake briefly. Prompt: ${label(
                        languageMode,
                        activeQuestion.promptEn,
                        activeQuestion.promptFr,
                      )}. Correct answer: ${activeQuestion.correctAnswer}. Learner answer: ${answer || 'choice selected'}.`}
                    />
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}
        </aside>
      </div>
    </div>
  )
}

function VocabularyView({
  decks,
  cards,
  selectedDeckId,
  currentLevel,
  languageMode,
  onSelectDeck,
  onReview,
  onImportDeck,
  onSpeak,
}: {
  decks: VocabDeck[]
  cards: VocabCard[]
  selectedDeckId: string
  currentLevel: CefrLevel
  languageMode: UserSettings['languageMode']
  onSelectDeck: (deckId: string) => void
  onReview: (card: VocabCard, correct: boolean, answer: string) => Promise<void>
  onImportDeck: (title: string, rows: ParsedCardRow[]) => Promise<void>
  onSpeak?: (text: string) => void
}) {
  const [mode, setMode] = useState<'flashcards' | 'learn' | 'spelling' | 'matching'>('flashcards')
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [answer, setAnswer] = useState('')
  const [feedback, setFeedback] = useState<string | null>(null)
  const visibleDecks = decks.filter((deck) => isAtOrBelow(deck.level, currentLevel))
  const visibleDeckIds = new Set(visibleDecks.map((deck) => deck.id))
  const selectedDeck = visibleDecks.find((deck) => deck.id === selectedDeckId) ?? visibleDecks[0] ?? decks[0]
  const deckCards = cards.filter((card) => card.deckId === selectedDeck.id)
  const card = deckCards[index % Math.max(deckCards.length, 1)]

  const nextCard = () => {
    setIndex((value) => (value + 1) % Math.max(deckCards.length, 1))
    setFlipped(false)
    setAnswer('')
    setFeedback(null)
  }

  const submitVocabAnswer = async () => {
    if (!card) return
    const correct = isCorrect(answer, mode === 'spelling' ? card.frontFr : card.backEn)
    await onReview(card, correct, answer)
    setFeedback(correct ? 'Correct' : `${card.frontFr} = ${card.backEn}`)
  }

  return (
    <div className="flex flex-col gap-stack-lg">
      <HeaderBlock
        title={label(languageMode, 'Lexical Bank', 'Banque lexicale')}
        subtitle={label(
          languageMode,
          `${visibleDecks.length} decks and ${cards.filter((card) => visibleDeckIds.has(card.deckId)).length} cards for ${currentLevel} and below.`,
          `${visibleDecks.length} paquets et ${cards.filter((card) => visibleDeckIds.has(card.deckId)).length} cartes pour ${currentLevel} et les niveaux précédents.`,
        )}
      />
      <div className="grid grid-cols-1 xl:grid-cols-[320px_minmax(0,1fr)] gap-gutter">
        <aside className="bg-surface border border-outline-variant rounded-xl p-stack-md h-fit">
          <SectionTitle title="Decks" />
          <div className="flex flex-col gap-unit">
            {visibleDecks.map((deck) => {
              const deckCardsCount = cards.filter((item) => item.deckId === deck.id).length
              return (
                <button
                  key={deck.id}
                  className={
                    deck.id === selectedDeck.id
                      ? 'text-left bg-primary-fixed border border-primary rounded-lg p-stack-sm'
                      : 'text-left bg-surface-container-low border border-outline-variant rounded-lg p-stack-sm hover:border-primary'
                  }
                  type="button"
                  onClick={() => {
                    onSelectDeck(deck.id)
                    setIndex(0)
                    setFlipped(false)
                    setAnswer('')
                    setFeedback(null)
                  }}
                >
                  <div className="flex justify-between gap-stack-sm">
                    <span className="font-headline-md text-headline-md text-on-surface">{deck.title}</span>
                    <span className="font-label-md text-label-md text-primary">{deck.level}</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">{deckCardsCount} cards</p>
                </button>
              )
            })}
          </div>
          <CsvImport onImport={onImportDeck} />
        </aside>
        <section className="bg-surface border border-outline-variant rounded-xl p-stack-md min-h-[520px]">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-stack-md mb-stack-md">
            <div>
              <span className="font-label-md text-label-md text-secondary">{selectedDeck.level}</span>
              <h2 className="font-headline-lg text-headline-lg text-primary">{selectedDeck.title}</h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant">{selectedDeck.description}</p>
            </div>
            <SegmentedControl
              value={mode}
              options={[
                ['flashcards', 'Cards'],
                ['learn', 'Learn'],
                ['spelling', 'Spell'],
                ['matching', 'Match'],
              ]}
              onChange={(value) => {
                setMode(value as typeof mode)
                setIndex(0)
                setFlipped(false)
                setAnswer('')
                setFeedback(null)
              }}
            />
          </div>
          {deckCards.length === 0 ? (
            <EmptyState icon="style" title="No cards" detail="Add cards in Content Studio." />
          ) : mode === 'matching' ? (
            <MatchingMode cards={deckCards.slice(0, 6)} />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_260px] gap-gutter">
              <div>
                {mode === 'flashcards' ? (
                  <button
                    className="w-full min-h-[280px] bg-surface-container-lowest border border-outline-variant rounded-xl p-stack-lg text-left hover:border-primary transition-colors"
                    type="button"
                    onClick={() => setFlipped((value) => !value)}
                  >
                    <span className="font-label-md text-label-md text-on-surface-variant">
                      {index + 1}/{deckCards.length}
                    </span>
                    <div className="mt-stack-lg">
                      <h3 className="font-display text-display text-primary">{flipped ? card.backEn : card.frontFr}</h3>
                      <p className="font-body-lg text-body-lg text-on-surface-variant mt-stack-md">
                        {flipped ? card.exampleEn : card.exampleFr}
                      </p>
                    </div>
                  </button>
                ) : (
                  <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-stack-lg">
                    <span className="font-label-md text-label-md text-on-surface-variant">
                      {mode === 'spelling' ? 'English → French' : 'French → English'}
                    </span>
                    <h3 className="font-headline-lg text-headline-lg text-primary mt-stack-sm">
                      {mode === 'spelling' ? card.backEn : card.frontFr}
                    </h3>
                    <form
                      className="mt-stack-lg flex flex-col sm:flex-row gap-stack-sm"
                      onSubmit={(event) => {
                        event.preventDefault()
                        void submitVocabAnswer()
                      }}
                    >
                      <input
                        className="flex-1 rounded-lg border-outline-variant"
                        value={answer}
                        onChange={(event) => setAnswer(event.currentTarget.value)}
                        placeholder={mode === 'spelling' ? 'français' : 'English'}
                      />
                      <button className="bg-primary text-on-primary rounded px-stack-md font-label-md text-label-md" type="submit">
                        Check
                      </button>
                    </form>
                    {feedback ? (
                      <div className="mt-stack-md border border-outline-variant bg-surface-container-low rounded-lg p-stack-sm">
                        <p className="font-body-sm text-body-sm">{feedback}</p>
                        <button className="mt-stack-sm text-primary font-label-md text-label-md" type="button" onClick={nextCard}>
                          Next
                        </button>
                      </div>
                    ) : null}
                  </div>
                )}
                <div className="flex flex-wrap items-center gap-stack-sm mt-stack-md">
                  {onSpeak ? (
                    <button className="border border-primary text-primary rounded px-stack-md py-2" type="button" onClick={() => onSpeak(card.frontFr)}>
                      <Icon name="volume_up" /> <span className="align-middle font-label-md text-label-md">Audio</span>
                    </button>
                  ) : null}
                  <button className="bg-secondary text-on-secondary rounded px-stack-md py-2 font-label-md text-label-md" type="button" onClick={() => void onReview(card, false, 'again').then(nextCard)}>
                    Again
                  </button>
                  <button className="bg-primary text-on-primary rounded px-stack-md py-2 font-label-md text-label-md" type="button" onClick={() => void onReview(card, true, 'known').then(nextCard)}>
                    Know
                  </button>
                  <button className="border border-outline text-on-surface rounded px-stack-md py-2 font-label-md text-label-md" type="button" onClick={nextCard}>
                    Skip
                  </button>
                </div>
              </div>
              <div className="bg-surface-container-low rounded-xl border border-outline-variant p-stack-md">
                <h3 className="font-headline-md text-headline-md text-on-surface">Card Detail</h3>
                <dl className="mt-stack-md flex flex-col gap-stack-sm">
                  <Detail labelText="Gender" value={card.gender ?? '—'} />
                  <Detail labelText="Confidence" value={`${card.confidence}%`} />
                  <Detail labelText="Due" value={new Date(card.dueAt).toLocaleDateString()} />
                  <Detail labelText="Tags" value={card.tags.join(', ')} />
                </dl>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

function MatchingMode({ cards }: { cards: VocabCard[] }) {
  const [selected, setSelected] = useState<{ side: 'fr' | 'en'; value: string } | null>(null)
  const [matched, setMatched] = useState<string[]>([])
  const english = useMemo(() => [...cards].sort((a, b) => a.backEn.localeCompare(b.backEn)), [cards])

  const choose = (side: 'fr' | 'en', value: string, pairId: string) => {
    if (matched.includes(pairId)) return
    if (!selected) {
      setSelected({ side, value })
      return
    }
    const card = cards.find((item) =>
      side === 'fr'
        ? item.id === pairId && item.backEn === selected.value
        : item.id === pairId && item.frontFr === selected.value,
    )
    if (selected.side !== side && card) setMatched((items) => [...items, pairId])
    setSelected(null)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
      <div className="flex flex-col gap-unit">
        {cards.map((card) => (
          <button
            className={
              matched.includes(card.id)
                ? 'border border-primary bg-primary-fixed rounded-lg p-stack-sm text-left'
                : 'border border-outline-variant bg-surface-container-lowest rounded-lg p-stack-sm text-left hover:border-primary'
            }
            key={card.id}
            type="button"
            onClick={() => choose('fr', card.frontFr, card.id)}
          >
            {card.frontFr}
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-unit">
        {english.map((card) => (
          <button
            className={
              matched.includes(card.id)
                ? 'border border-primary bg-primary-fixed rounded-lg p-stack-sm text-left'
                : 'border border-outline-variant bg-surface-container-lowest rounded-lg p-stack-sm text-left hover:border-primary'
            }
            key={card.id}
            type="button"
            onClick={() => choose('en', card.backEn, card.id)}
          >
            {card.backEn}
          </button>
        ))}
      </div>
    </div>
  )
}

function ConjugationView({
  verbs,
  selectedVerbId,
  currentLevel,
  onSelectVerb,
  onAnswered,
  onSpeak,
}: {
  verbs: VerbEntry[]
  selectedVerbId: string
  currentLevel: CefrLevel
  onSelectVerb: (verbId: string) => void
  onAnswered: (verbEntry: VerbEntry, tense: string, answer: string, label: string, correct: boolean) => Promise<void>
  onSpeak?: (text: string) => void
}) {
  const visibleVerbs = verbs.filter((verbEntry) => isAtOrBelow(verbEntry.level, currentLevel))
  const selectedVerb = visibleVerbs.find((verbEntry) => verbEntry.id === selectedVerbId) ?? visibleVerbs[0] ?? verbs[0]
  const tenses = Object.keys(selectedVerb.conjugations)
  const [tense, setTense] = useState(tenses[0])
  const [person, setPerson] = useState(persons[0])
  const [answer, setAnswer] = useState('')
  const [feedback, setFeedback] = useState<string | null>(null)
  const activeTense = tenses.includes(tense) ? tense : tenses[0]
  const expected = selectedVerb.conjugations[activeTense]?.[person] ?? ''

  const checkVerb = async () => {
    const correct = isCorrect(answer, expected)
    await onAnswered(
      selectedVerb,
      activeTense,
      answer,
      `${person} ${selectedVerb.infinitive} (${tenseLabels[activeTense] ?? activeTense})`,
      correct,
    )
    setFeedback(correct ? 'Correct' : `${person} ${expected}`)
  }

  return (
    <div className="flex flex-col gap-stack-lg">
      <HeaderBlock
        title="Verb Mastery"
        subtitle={`${visibleVerbs.length} verbs available for ${currentLevel} and below.`}
      />
      <div className="grid grid-cols-1 xl:grid-cols-[300px_minmax(0,1fr)] gap-gutter">
        <aside className="bg-surface border border-outline-variant rounded-xl p-stack-md h-fit">
          <SectionTitle title="Verb Library" />
          <div className="flex flex-col gap-unit max-h-[520px] overflow-auto pr-1">
            {visibleVerbs.map((verbEntry) => (
              <button
                key={verbEntry.id}
                className={
                  verbEntry.id === selectedVerb.id
                    ? 'text-left bg-primary-fixed border border-primary rounded-lg p-stack-sm'
                    : 'text-left bg-surface-container-low border border-outline-variant rounded-lg p-stack-sm hover:border-primary'
                }
                type="button"
                onClick={() => {
                  onSelectVerb(verbEntry.id)
                  setTense(Object.keys(verbEntry.conjugations)[0])
                  setPerson(persons[0])
                  setAnswer('')
                  setFeedback(null)
                }}
              >
                <div className="flex justify-between gap-stack-sm">
                  <span className="font-headline-md text-headline-md text-on-surface">{verbEntry.infinitive}</span>
                  <span className="font-label-md text-label-md text-primary">{verbEntry.level}</span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant">{verbEntry.meaning}</p>
              </button>
            ))}
          </div>
        </aside>
        <section className="grid grid-cols-1 2xl:grid-cols-[minmax(0,1fr)_360px] gap-gutter">
          <div className="bg-surface border border-outline-variant rounded-xl p-stack-md">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-stack-md mb-stack-md">
              <div>
                <span className="font-label-md text-label-md text-secondary">{selectedVerb.group} · {selectedVerb.auxiliary}</span>
                <h2 className="font-display text-display text-primary">{selectedVerb.infinitive}</h2>
                <p className="font-body-md text-body-md text-on-surface-variant">{selectedVerb.meaning}</p>
              </div>
              {onSpeak ? (
                <button className="border border-primary text-primary rounded px-stack-md py-2" type="button" onClick={() => onSpeak(selectedVerb.infinitive)}>
                  <Icon name="volume_up" /> <span className="align-middle font-label-md text-label-md">Audio</span>
                </button>
              ) : null}
            </div>
              <SegmentedControl
              value={activeTense}
              options={tenses.map((item) => [item, tenseLabels[item] ?? item])}
              onChange={setTense}
            />
            <div className="mt-stack-md overflow-x-auto">
              <table className="w-full text-left border border-outline-variant rounded-xl overflow-hidden">
                <tbody className="divide-y divide-outline-variant">
                  {persons.map((item) => (
                    <tr key={item} className={person === item ? 'bg-primary-fixed' : 'bg-surface-container-lowest'}>
                      <th className="px-stack-md py-3 font-label-md text-label-md text-on-surface-variant">{item}</th>
                      <td className="px-stack-md py-3 font-mono-code text-mono-code text-on-surface">
                        {selectedVerb.conjugations[activeTense]?.[item]}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <SectionTitle title="Mastery Heatmap" className="mt-stack-lg" />
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-unit">
              {Object.entries(selectedVerb.mastery).map(([key, value]) => (
                <button
                  className={`rounded-lg p-stack-sm text-left border border-outline-variant ${confidenceBg(value)}`}
                  key={key}
                  type="button"
                  onClick={() => setTense(key)}
                >
                  <span className="font-label-md text-label-md text-on-surface-variant">{tenseLabels[key] ?? key}</span>
                  <div className="font-headline-md text-headline-md text-on-surface">{value}%</div>
                </button>
              ))}
            </div>
          </div>
          <aside className="bg-surface border border-outline-variant rounded-xl p-stack-md h-fit sticky top-24">
            <SectionTitle title="Drill Mode" />
            <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="person-select">
              Person
            </label>
            <select
              id="person-select"
              className="mt-1 mb-stack-md w-full rounded-lg border-outline-variant"
              value={person}
              onChange={(event) => setPerson(event.currentTarget.value)}
            >
              {persons.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-stack-sm">
              {person} · {tenseLabels[activeTense] ?? activeTense} · {selectedVerb.infinitive}
            </p>
            <form
              className="flex flex-col gap-stack-sm"
              onSubmit={(event) => {
                event.preventDefault()
                void checkVerb()
              }}
            >
              <input
                className="rounded-lg border-outline-variant"
                value={answer}
                onChange={(event) => setAnswer(event.currentTarget.value)}
                placeholder="forme conjuguée"
              />
              <button className="bg-primary text-on-primary rounded px-stack-md py-2 font-label-md text-label-md" type="submit">
                Check
              </button>
            </form>
            {feedback ? (
              <div className="mt-stack-md border border-outline-variant rounded-lg bg-surface-container-low p-stack-sm">
                <p className="font-body-sm text-body-sm">{feedback}</p>
                <button
                  className="mt-stack-sm text-primary font-label-md text-label-md"
                  type="button"
                  onClick={() => {
                    setPerson(persons[(persons.indexOf(person) + 1) % persons.length])
                    setAnswer('')
                    setFeedback(null)
                  }}
                >
                  Next form
                </button>
              </div>
            ) : null}
          </aside>
        </section>
      </div>
    </div>
  )
}

function PracticeLab({
  snapshot,
  currentLevel,
  languageMode,
  onGrammarAnswer,
  onVocabAnswer,
  onVerbAnswer,
}: {
  snapshot: LearningSnapshot
  currentLevel: CefrLevel
  languageMode: UserSettings['languageMode']
  onGrammarAnswer: (question: Question, answer: string) => Promise<boolean>
  onVocabAnswer: (card: VocabCard, correct: boolean, answer: string) => Promise<void>
  onVerbAnswer: (verbEntry: VerbEntry, tense: string, answer: string, label: string, correct: boolean) => Promise<void>
}) {
  const [mode, setMode] = useState<'weak' | 'due' | 'custom'>('weak')
  const [activeType, setActiveType] = useState<'grammar' | 'vocab' | 'verb' | 'reading' | 'writing'>('grammar')
  const [answer, setAnswer] = useState('')
  const [result, setResult] = useState<string | null>(null)
  const [stats, setStats] = useState({ correct: 0, total: 0 })
  const [readingAnswers, setReadingAnswers] = useState<Record<string, { answer: string; correct: boolean }>>({})
  const [writingDraft, setWritingDraft] = useState('')
  const scopedDecks = snapshot.decks.filter((deck) => isAtOrBelow(deck.level, currentLevel))
  const scopedDeckIds = new Set(scopedDecks.map((deck) => deck.id))
  const topicPool = snapshot.topics.filter((topic) => isAtOrBelow(topic.level, currentLevel))
  const cardPool = snapshot.cards.filter((card) => scopedDeckIds.has(card.deckId))
  const verbPool = snapshot.verbs.filter((verbEntry) => isAtOrBelow(verbEntry.level, currentLevel))
  const readingPool = readingExercises.filter((exercise) => isAtOrBelow(exercise.level, currentLevel))
  const writingPool = writingPrompts.filter((prompt) => isAtOrBelow(prompt.level, currentLevel))
  const weakTopic = [...(topicPool.length ? topicPool : snapshot.topics)].sort((a, b) => a.confidence - b.confidence)[0]
  const grammarQuestion = snapshot.questions.find((question) => question.topicId === weakTopic.id) ?? snapshot.questions[0]
  const dueCard = (cardPool.length ? cardPool : snapshot.cards).find((card) => new Date(card.dueAt) <= new Date()) ?? snapshot.cards[0]
  const weakVerb = [...(verbPool.length ? verbPool : snapshot.verbs)].sort(
    (a, b) => average(Object.values(a.mastery)) - average(Object.values(b.mastery)),
  )[0]
  const readingExercise = readingPool[stats.total % Math.max(1, readingPool.length)] ?? readingExercises[0]
  const writingPrompt = writingPool[stats.total % Math.max(1, writingPool.length)] ?? writingPrompts[0]
  const weakTense = Object.entries(weakVerb.mastery).sort((a, b) => a[1] - b[1])[0]?.[0] ?? 'present'
  const person = persons[stats.total % persons.length]
  const expectedVerb = weakVerb.conjugations[weakTense]?.[person] ?? ''

  const submit = async () => {
    let correct = false
    if (activeType === 'grammar') {
      correct = await onGrammarAnswer(grammarQuestion, answer)
      setResult(correct ? 'Correct' : grammarQuestion.correctAnswer)
    }
    if (activeType === 'vocab') {
      correct = isCorrect(answer, dueCard.backEn)
      await onVocabAnswer(dueCard, correct, answer)
      setResult(correct ? 'Correct' : `${dueCard.frontFr} = ${dueCard.backEn}`)
    }
    if (activeType === 'verb') {
      correct = isCorrect(answer, expectedVerb)
      await onVerbAnswer(weakVerb, weakTense, answer, `${person} ${weakVerb.infinitive}`, correct)
      setResult(correct ? 'Correct' : `${person} ${expectedVerb}`)
    }
    setStats((value) => ({ correct: value.correct + (correct ? 1 : 0), total: value.total + 1 }))
  }

  const answerReadingQuestion = (exercise: ReadingExercise, questionId: string, choice: string) => {
    if (readingAnswers[questionId]) return
    const question = exercise.questions.find((item) => item.id === questionId)
    if (!question) return
    const correct = choice === question.correctAnswer
    setReadingAnswers((answers) => ({ ...answers, [questionId]: { answer: choice, correct } }))
    setStats((value) => ({ correct: value.correct + (correct ? 1 : 0), total: value.total + 1 }))
  }

  const next = () => {
    setAnswer('')
    setResult(null)
    setActiveType(activeType === 'grammar' ? 'vocab' : activeType === 'vocab' ? 'verb' : 'grammar')
  }

  const switchPracticeType = (value: typeof activeType) => {
    setActiveType(value)
    setAnswer('')
    setResult(null)
    setReadingAnswers({})
  }

  return (
    <div className="flex flex-col gap-stack-lg">
      <HeaderBlock
        title="Practice Lab"
        subtitle={label(
          languageMode,
          `Mixed adaptive practice for ${currentLevel} and below.`,
          `Pratique adaptative mixte pour ${currentLevel} et les niveaux précédents.`,
        )}
      />
      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_340px] gap-gutter">
        <section className="bg-surface border border-outline-variant rounded-xl p-stack-md">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-stack-md mb-stack-md">
            <SegmentedControl
              value={mode}
              options={[
                ['weak', 'Weak'],
                ['due', 'Due'],
                ['custom', 'Custom'],
              ]}
              onChange={(value) => setMode(value as typeof mode)}
            />
            <SegmentedControl
              value={activeType}
              options={[
                ['grammar', 'Grammar'],
                ['vocab', 'Vocab'],
                ['verb', 'Verb'],
                ['reading', 'Reading'],
                ['writing', 'Writing'],
              ]}
              onChange={(value) => {
                switchPracticeType(value as typeof activeType)
              }}
            />
          </div>
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-stack-lg">
            <span className="font-label-md text-label-md text-secondary">{mode.toUpperCase()} ROUND</span>
            {activeType === 'grammar' && (
              <>
                <h2 className="font-headline-lg text-headline-lg text-primary mt-stack-sm">
                  {label(languageMode, weakTopic.titleEn, weakTopic.titleFr)}
                </h2>
                <p className="font-body-lg text-body-lg text-on-surface mt-stack-md">
                  {label(languageMode, grammarQuestion.promptEn, grammarQuestion.promptFr)}
                </p>
              </>
            )}
            {activeType === 'vocab' && (
              <>
                <h2 className="font-headline-lg text-headline-lg text-primary mt-stack-sm">{dueCard.frontFr}</h2>
                <p className="font-body-lg text-body-lg text-on-surface-variant mt-stack-md">{dueCard.exampleFr}</p>
              </>
            )}
            {activeType === 'verb' && (
              <>
                <h2 className="font-headline-lg text-headline-lg text-primary mt-stack-sm">{weakVerb.infinitive}</h2>
                <p className="font-body-lg text-body-lg text-on-surface-variant mt-stack-md">
                  {person} · {tenseLabels[weakTense] ?? weakTense}
                </p>
              </>
            )}
            {activeType === 'reading' && (
              <ReadingPracticeCard
                exercise={readingExercise}
                answers={readingAnswers}
                onAnswer={answerReadingQuestion}
              />
            )}
            {activeType === 'writing' && (
              <WritingPracticeCard
                prompt={writingPrompt}
                draft={writingDraft}
                settings={snapshot.settings}
                onDraftChange={setWritingDraft}
              />
            )}
            {activeType === 'grammar' || activeType === 'vocab' || activeType === 'verb' ? (
              <>
                <form
                  className="mt-stack-lg flex flex-col sm:flex-row gap-stack-sm"
                  onSubmit={(event) => {
                    event.preventDefault()
                    void submit()
                  }}
                >
                  <input
                    className="flex-1 rounded-lg border-outline-variant"
                    value={answer}
                    onChange={(event) => setAnswer(event.currentTarget.value)}
                    placeholder="Answer"
                  />
                  <button className="bg-primary text-on-primary rounded px-stack-md font-label-md text-label-md" type="submit">
                    Check
                  </button>
                </form>
                {result ? (
                  <div className="mt-stack-md border border-outline-variant rounded-lg bg-surface-container-low p-stack-sm flex items-center justify-between gap-stack-md">
                    <span className="font-body-sm text-body-sm">{result}</span>
                    <button className="text-primary font-label-md text-label-md" type="button" onClick={next}>
                      Next
                    </button>
                  </div>
                ) : null}
              </>
            ) : null}
          </div>
        </section>
        <aside className="bg-surface border border-outline-variant rounded-xl p-stack-md h-fit">
          <SectionTitle title="Session Summary" />
          <div className="grid grid-cols-2 gap-stack-sm">
            <MiniMetric labelText="Answered" value={`${stats.total}`} />
            <MiniMetric labelText="Accuracy" value={`${stats.total ? Math.round((stats.correct / stats.total) * 100) : 0}%`} />
          </div>
          <SectionTitle title="Recommendations" className="mt-stack-lg" />
          <div className="flex flex-col gap-unit">
            <Recommendation text={`Grammar: ${label(languageMode, weakTopic.titleEn, weakTopic.titleFr)}`} />
            <Recommendation text={`Vocabulary: ${dueCard.frontFr}`} />
            <Recommendation text={`Verb: ${weakVerb.infinitive} · ${tenseLabels[weakTense] ?? weakTense}`} />
          </div>
        </aside>
      </div>
    </div>
  )
}

function ReadingPracticeCard({
  exercise,
  answers,
  onAnswer,
}: {
  exercise: ReadingExercise
  answers: Record<string, { answer: string; correct: boolean }>
  onAnswer: (exercise: ReadingExercise, questionId: string, choice: string) => void
}) {
  const answered = exercise.questions.filter((question) => answers[question.id]).length
  const correct = exercise.questions.filter((question) => answers[question.id]?.correct).length

  return (
    <div className="mt-stack-sm">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-stack-sm">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-primary">{exercise.title}</h2>
          <p className="font-label-md text-label-md text-on-surface-variant">
            {exercise.level} · {exercise.theme}
          </p>
        </div>
        <span className="font-label-md text-label-md text-primary">
          {correct}/{answered || exercise.questions.length} comprehension
        </span>
      </div>
      <p className="mt-stack-md font-body-md text-body-md text-on-surface leading-relaxed">{exercise.text}</p>
      <div className="mt-stack-lg flex flex-col gap-stack-sm">
        {exercise.questions.map((question) => {
          const result = answers[question.id]
          return (
            <div key={question.id} className="border border-outline-variant bg-surface rounded-lg p-stack-sm">
              <p className="font-body-md text-body-md text-on-surface mb-stack-sm">{question.prompt}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-unit">
                {question.choices.map((choice) => (
                  <button
                    key={choice}
                    className={
                      result?.answer === choice
                        ? result.correct
                          ? 'border border-primary bg-primary-fixed rounded-lg px-stack-sm py-2 text-left'
                          : 'border border-secondary bg-secondary-fixed rounded-lg px-stack-sm py-2 text-left'
                        : 'border border-outline-variant bg-surface-container-lowest rounded-lg px-stack-sm py-2 text-left hover:border-primary'
                    }
                    type="button"
                    disabled={!!result}
                    onClick={() => onAnswer(exercise, question.id, choice)}
                  >
                    {choice}
                  </button>
                ))}
              </div>
              {result ? (
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-stack-sm">
                  {result.correct ? 'Correct. ' : `Answer: ${question.correctAnswer}. `}
                  {question.explanation}
                </p>
              ) : null}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function WritingPracticeCard({
  prompt,
  draft,
  settings,
  onDraftChange,
}: {
  prompt: WritingPrompt
  draft: string
  settings: UserSettings
  onDraftChange: (value: string) => void
}) {
  const aiPrompt = `Correct this French writing at A2-B1 level. First list mistakes by grammar, vocabulary, tense, word order, and connectors. Then give a polished B1 version. Task: ${prompt.task}. Learner text: ${draft}`

  return (
    <div className="mt-stack-sm">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-stack-sm">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-primary">{prompt.title}</h2>
          <p className="font-label-md text-label-md text-on-surface-variant">{prompt.level} writing task</p>
        </div>
        <span className="font-label-md text-label-md text-primary">{draft.trim().split(/\s+/).filter(Boolean).length} words</span>
      </div>
      <p className="mt-stack-md font-body-md text-body-md text-on-surface">{prompt.task}</p>
      <div className="mt-stack-md grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_240px] gap-stack-md">
        <div>
          <textarea
            className="w-full min-h-[220px] rounded-lg border-outline-variant"
            value={draft}
            onChange={(event) => onDraftChange(event.currentTarget.value)}
            placeholder={prompt.starter}
          />
          <div className="mt-stack-sm">
            <AiActionButton
              settings={settings}
              endpoint="/api/ai/check-sentence"
              labelText="Correct with AI"
              disabledText="Enable AI in Settings for writing correction"
              prompt={aiPrompt}
            />
          </div>
        </div>
        <aside className="border border-outline-variant bg-surface rounded-lg p-stack-sm">
          <h3 className="font-headline-md text-headline-md text-on-surface mb-stack-sm">Checklist</h3>
          <div className="flex flex-col gap-unit">
            {prompt.checklist.map((item) => (
              <label key={item} className="flex items-start gap-unit font-body-sm text-body-sm text-on-surface-variant">
                <input className="mt-1 rounded border-outline-variant text-primary focus:ring-primary" type="checkbox" />
                <span>{item}</span>
              </label>
            ))}
          </div>
        </aside>
      </div>
    </div>
  )
}

function ContentStudio({
  snapshot,
  onNotice,
  onRefresh,
}: {
  snapshot: LearningSnapshot
  onNotice: (message: string) => void
  onRefresh: () => Promise<void>
}) {
  const [deckTitle, setDeckTitle] = useState('Personal Deck')
  const [frontFr, setFrontFr] = useState('')
  const [backEn, setBackEn] = useState('')
  const [topicTitle, setTopicTitle] = useState('')
  const [verbInfinitive, setVerbInfinitive] = useState('')

  const defaultDeck = snapshot.decks[0]

  const addVocabCard = async (event: FormEvent) => {
    event.preventDefault()
    let deck = snapshot.decks.find((item) => item.title.toLocaleLowerCase() === deckTitle.toLocaleLowerCase())
    if (!deck) {
      deck = {
        id: slugify(deckTitle),
        title: deckTitle,
        description: 'Personal vocabulary.',
        level: snapshot.settings.currentLevel,
        tags: ['personal'],
      }
      await addDeck(deck)
    }
    await addCard({
      id: `card-${Date.now()}`,
      deckId: deck.id,
      frontFr,
      backEn,
      exampleFr: frontFr,
      exampleEn: backEn,
      notes: '',
      tags: ['personal'],
      confidence: 10,
      dueAt: new Date().toISOString(),
      intervalDays: 1,
    })
    setFrontFr('')
    setBackEn('')
    onNotice('Vocabulary card saved.')
    await onRefresh()
  }

  const addGrammarTopic = async (event: FormEvent) => {
    event.preventDefault()
    const id = slugify(topicTitle) || `topic-${Date.now()}`
    await addTopic({
      id,
      level: snapshot.settings.currentLevel,
      area: 'Personal',
      titleEn: topicTitle,
      titleFr: topicTitle,
      explanationEn: 'Personal grammar note.',
      explanationFr: 'Note grammaticale personnelle.',
      examples: ['exemple personnel'],
      confidence: 0,
    })
    setTopicTitle('')
    onNotice('Grammar topic saved.')
    await onRefresh()
  }

  const addSimpleVerb = async (event: FormEvent) => {
    event.preventDefault()
    const id = slugify(verbInfinitive)
    const stem = verbInfinitive.endsWith('er') ? verbInfinitive.slice(0, -2) : verbInfinitive
    await addVerb({
      id,
      infinitive: verbInfinitive,
      meaning: 'personal verb',
      level: snapshot.settings.currentLevel,
      group: verbInfinitive.endsWith('er') ? 'regular -er' : 'irregular',
      auxiliary: 'avoir',
      reflexive: false,
      conjugations: {
        present: {
          je: `${stem}e`,
          tu: `${stem}es`,
          'il/elle': `${stem}e`,
          nous: `${stem}ons`,
          vous: `${stem}ez`,
          'ils/elles': `${stem}ent`,
        },
      },
      mastery: { present: 0 },
    })
    setVerbInfinitive('')
    onNotice('Verb entry saved.')
    await onRefresh()
  }

  const downloadBackup = async () => {
    const backup = await exportSnapshot()
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `lexpert-francais-backup-${new Date().toISOString().slice(0, 10)}.json`
    anchor.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col gap-stack-lg">
      <HeaderBlock title="Content Studio" subtitle="Personal deck, grammar, verb, import, and backup tools." />
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-gutter">
        <form className="bg-surface border border-outline-variant rounded-xl p-stack-md flex flex-col gap-stack-sm" onSubmit={addVocabCard}>
          <SectionTitle title="Vocabulary Editor" />
          <input className="rounded-lg border-outline-variant" value={deckTitle} onChange={(event) => setDeckTitle(event.currentTarget.value)} placeholder={defaultDeck?.title ?? 'Deck'} />
          <input className="rounded-lg border-outline-variant" value={frontFr} onChange={(event) => setFrontFr(event.currentTarget.value)} placeholder="français" required />
          <input className="rounded-lg border-outline-variant" value={backEn} onChange={(event) => setBackEn(event.currentTarget.value)} placeholder="English" required />
          <button className="bg-primary text-on-primary rounded px-stack-md py-2 font-label-md text-label-md" type="submit">
            Save Card
          </button>
        </form>
        <form className="bg-surface border border-outline-variant rounded-xl p-stack-md flex flex-col gap-stack-sm" onSubmit={addGrammarTopic}>
          <SectionTitle title="Grammar Editor" />
          <input className="rounded-lg border-outline-variant" value={topicTitle} onChange={(event) => setTopicTitle(event.currentTarget.value)} placeholder="Topic title" required />
          <button className="bg-primary text-on-primary rounded px-stack-md py-2 font-label-md text-label-md" type="submit">
            Save Topic
          </button>
        </form>
        <form className="bg-surface border border-outline-variant rounded-xl p-stack-md flex flex-col gap-stack-sm" onSubmit={addSimpleVerb}>
          <SectionTitle title="Verb Editor" />
          <input className="rounded-lg border-outline-variant" value={verbInfinitive} onChange={(event) => setVerbInfinitive(event.currentTarget.value)} placeholder="parler" required />
          <button className="bg-primary text-on-primary rounded px-stack-md py-2 font-label-md text-label-md" type="submit">
            Save Verb
          </button>
        </form>
      </div>
      <section className="bg-surface border border-outline-variant rounded-xl p-stack-md">
        <SectionTitle title="Import / Export" />
        <div className="flex flex-wrap gap-stack-sm">
          <button className="bg-primary text-on-primary rounded px-stack-md py-2 font-label-md text-label-md" type="button" onClick={() => void downloadBackup()}>
            Export JSON Backup
          </button>
          <label className="border border-primary text-primary rounded px-stack-md py-2 font-label-md text-label-md cursor-pointer">
            Import JSON Backup
            <input
              className="hidden"
              type="file"
              accept="application/json"
              onChange={(event) => {
                const file = event.currentTarget.files?.[0]
                if (!file) return
                void file.text().then(async (text) => {
                  await importSnapshot(JSON.parse(text) as LearningSnapshot)
                  onNotice('Backup imported.')
                  await onRefresh()
                })
              }}
            />
          </label>
        </div>
      </section>
    </div>
  )
}

function SettingsView({
  settings,
  onChange,
  onNotice,
}: {
  settings: UserSettings
  onChange: (patch: Partial<UserSettings>) => Promise<void>
  onNotice: (message: string) => void
}) {
  const [testing, setTesting] = useState(false)

  const testAi = async () => {
    setTesting(true)
    try {
      const response = await fetch('/api/ai/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: settings.aiProvider,
          model: settings.aiModel,
          ollamaHost: settings.ollamaHost,
          prompt: 'Explain when to use the French subjunctive in two short sentences.',
        }),
      })
      const payload = (await response.json()) as { text?: string; error?: string }
      onNotice(payload.text ? `AI ready: ${payload.text.slice(0, 120)}` : payload.error ?? 'AI provider unavailable.')
    } catch {
      onNotice('AI provider unavailable.')
    } finally {
      setTesting(false)
    }
  }

  return (
    <div className="flex flex-col gap-stack-lg">
      <HeaderBlock title="Settings" subtitle="Language, speech, and optional AI provider controls." />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-gutter">
        <section className="bg-surface border border-outline-variant rounded-xl p-stack-md">
          <SectionTitle title="Language" />
          <SegmentedControl
            value={settings.languageMode}
            options={[
              ['en', 'English'],
              ['fr', 'Français'],
            ]}
            onChange={(value) => void onChange({ languageMode: value as UserSettings['languageMode'] })}
          />
          <SectionTitle title="Current Level" className="mt-stack-lg" />
          <p className="font-body-sm text-body-sm text-on-surface-variant mb-stack-sm">
            This controls your dashboard missions, roadmap focus, vocabulary decks, verb list, and Practice Lab.
          </p>
          <LevelSelector
            value={settings.currentLevel}
            onChange={(currentLevel) => void onChange({ currentLevel })}
          />
          <div className="mt-stack-md">
            <p className="font-label-md text-label-md text-on-surface-variant mb-unit">Target level</p>
            <LevelSelector
              value={settings.targetLevel}
              onChange={(targetLevel) => void onChange({ targetLevel })}
            />
          </div>
          <SectionTitle title="Study Time" className="mt-stack-lg" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-stack-sm">
            <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="weekly-hours">
              Weekly hours
              <input
                id="weekly-hours"
                className="mt-1 w-full rounded-lg border-outline-variant text-body-md"
                min="1"
                max="40"
                step="0.5"
                type="number"
                value={settings.weeklyStudyHours}
                onChange={(event) => void onChange({ weeklyStudyHours: Number(event.currentTarget.value) || 1 })}
              />
            </label>
            <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="study-days">
              Study days/week
              <input
                id="study-days"
                className="mt-1 w-full rounded-lg border-outline-variant text-body-md"
                min="1"
                max="7"
                step="1"
                type="number"
                value={settings.studyDaysPerWeek}
                onChange={(event) =>
                  void onChange({ studyDaysPerWeek: Math.max(1, Math.min(7, Number(event.currentTarget.value) || 1)) })
                }
              />
            </label>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-stack-sm">
            Daily plan target: {getDailyTargetMinutes(settings)} minutes.
          </p>
          <SectionTitle title="Speech" className="mt-stack-lg" />
          <ToggleRow
            labelText="Text-to-speech"
            checked={settings.speechEnabled}
            onChange={(checked) => void onChange({ speechEnabled: checked })}
          />
          <ToggleRow
            labelText="Speech recognition"
            checked={settings.speechRecognitionEnabled}
            onChange={(checked) => void onChange({ speechRecognitionEnabled: checked })}
          />
        </section>
        <section className="bg-surface border border-outline-variant rounded-xl p-stack-md">
          <SectionTitle title="AI Coach" />
          <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="provider">
            Provider
          </label>
          <select
            id="provider"
            className="mt-1 mb-stack-md w-full rounded-lg border-outline-variant"
            value={settings.aiProvider}
            onChange={(event) => void onChange({ aiProvider: event.currentTarget.value as AiProvider })}
          >
            <option value="disabled">Disabled</option>
            <option value="ollama">Ollama</option>
            <option value="groq">Groq</option>
            <option value="gemini">Gemini</option>
          </select>
          <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="model">
            Model
          </label>
          <input
            id="model"
            className="mt-1 mb-stack-md w-full rounded-lg border-outline-variant"
            value={settings.aiModel}
            onChange={(event) => void onChange({ aiModel: event.currentTarget.value })}
          />
          <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="ollama">
            Ollama host
          </label>
          <input
            id="ollama"
            className="mt-1 mb-stack-md w-full rounded-lg border-outline-variant"
            value={settings.ollamaHost}
            onChange={(event) => void onChange({ ollamaHost: event.currentTarget.value })}
          />
          <button
            className="bg-primary text-on-primary rounded px-stack-md py-2 font-label-md text-label-md disabled:opacity-50"
            type="button"
            disabled={testing || settings.aiProvider === 'disabled'}
            onClick={() => void testAi()}
          >
            {testing ? 'Testing...' : 'Test AI'}
          </button>
        </section>
      </div>
    </div>
  )
}

function CsvImport({ onImport }: { onImport: (title: string, rows: ParsedCardRow[]) => Promise<void> }) {
  const [title, setTitle] = useState('Imported Deck')

  return (
    <div className="mt-stack-lg border-t border-outline-variant pt-stack-md">
      <SectionTitle title="CSV Import" />
      <input className="w-full rounded-lg border-outline-variant mb-stack-sm" value={title} onChange={(event) => setTitle(event.currentTarget.value)} />
      <label className="block text-center bg-primary text-on-primary rounded px-stack-md py-2 font-label-md text-label-md cursor-pointer">
        Import CSV
        <input
          className="hidden"
          type="file"
          accept=".csv,text/csv"
          onChange={(event) => {
            const file = event.currentTarget.files?.[0]
            if (!file) return
            void file.text().then((text) => onImport(title, parseCsv(text)))
          }}
        />
      </label>
    </div>
  )
}

function HeaderBlock({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <section>
      <h1 className="font-display text-display text-primary mb-stack-sm">{title}</h1>
      <p className="font-body-lg text-body-lg text-on-surface-variant">{subtitle}</p>
    </section>
  )
}

function SectionTitle({ title, className = '' }: { title: string; className?: string }) {
  return (
    <h2 className={`font-headline-lg text-headline-lg text-primary border-b border-outline-variant pb-2 mb-stack-md ${className}`}>
      {title}
    </h2>
  )
}

function ProgressBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="w-full bg-surface-variant h-2 rounded-full overflow-hidden">
      <div className={`${color} h-full rounded-full`} style={{ width: `${Math.max(2, Math.min(100, value))}%` }} />
    </div>
  )
}

function SegmentedControl({
  value,
  options,
  onChange,
}: {
  value: string
  options: Array<[string, string]>
  onChange: (value: string) => void
}) {
  return (
    <div className="inline-flex flex-wrap gap-unit bg-surface-container-low border border-outline-variant rounded-lg p-unit">
      {options.map(([optionValue, optionLabel]) => (
        <button
          key={optionValue}
          className={
            value === optionValue
              ? 'bg-primary text-on-primary rounded px-stack-sm py-2 font-label-md text-label-md'
              : 'text-on-surface-variant hover:bg-surface-container-high rounded px-stack-sm py-2 font-label-md text-label-md'
          }
          type="button"
          onClick={() => onChange(optionValue)}
        >
          {optionLabel}
        </button>
      ))}
    </div>
  )
}

function LevelSelector({ value, onChange }: { value: CefrLevel; onChange: (level: CefrLevel) => void }) {
  return (
    <div className="inline-flex flex-wrap gap-unit bg-surface-container-low border border-outline-variant rounded-lg p-unit">
      {levels.map((level) => (
        <button
          key={level}
          className={
            value === level
              ? 'bg-primary text-on-primary rounded px-stack-md py-2 font-label-md text-label-md'
              : 'text-on-surface-variant hover:bg-surface-container-high rounded px-stack-md py-2 font-label-md text-label-md'
          }
          type="button"
          onClick={() => onChange(level)}
          title={levelLabel(level, 'en')}
        >
          {level}
        </button>
      ))}
    </div>
  )
}

function MiniMetric({ labelText, value }: { labelText: string; value: string }) {
  return (
    <div className="bg-surface-container-low border border-outline-variant rounded-lg p-stack-sm">
      <p className="font-label-md text-label-md text-on-surface-variant">{labelText}</p>
      <p className="font-headline-lg text-headline-lg text-primary">{value}</p>
    </div>
  )
}

function Detail({ labelText, value }: { labelText: string; value: string }) {
  return (
    <div>
      <dt className="font-label-md text-label-md text-on-surface-variant">{labelText}</dt>
      <dd className="font-body-md text-body-md text-on-surface">{value}</dd>
    </div>
  )
}

function Recommendation({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-stack-sm border border-outline-variant rounded-lg bg-surface-container-low p-stack-sm">
      <Icon name="target" className="text-primary" />
      <span className="font-body-sm text-body-sm text-on-surface">{text}</span>
    </div>
  )
}

function ToggleRow({
  labelText,
  checked,
  onChange,
}: {
  labelText: string
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <label className="flex items-center justify-between gap-stack-md border border-outline-variant bg-surface-container-low rounded-lg p-stack-sm mb-stack-sm">
      <span className="font-body-md text-body-md text-on-surface">{labelText}</span>
      <input
        className="rounded border-outline-variant text-primary focus:ring-primary"
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.currentTarget.checked)}
      />
    </label>
  )
}

function EmptyState({ icon, title, detail }: { icon: string; title: string; detail: string }) {
  return (
    <div className="min-h-[280px] border border-outline-variant bg-surface-container-low rounded-xl flex flex-col items-center justify-center text-center p-stack-lg">
      <Icon name={icon} className="text-primary text-4xl" />
      <h3 className="font-headline-md text-headline-md text-on-surface mt-stack-sm">{title}</h3>
      <p className="font-body-sm text-body-sm text-on-surface-variant">{detail}</p>
    </div>
  )
}

function Icon({ name, fill = false, className = '' }: { name: string; fill?: boolean; className?: string }) {
  return <span className={`material-symbols-outlined ${fill ? 'fill' : ''} ${className}`}>{name}</span>
}

interface ParsedCardRow {
  frontFr: string
  backEn: string
  gender?: VocabCard['gender']
  exampleFr: string
  exampleEn: string
  tags: string[]
}

function parseCsv(text: string): ParsedCardRow[] {
  const rows = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.split(',').map((cell) => cell.trim()))

  const dataRows = rows[0]?.[0]?.toLocaleLowerCase() === 'frontfr' ? rows.slice(1) : rows
  return dataRows
    .filter((row) => row[0] && row[1])
    .map((row) => ({
      frontFr: row[0],
      backEn: row[1],
      gender: row[2] === 'm' || row[2] === 'f' || row[2] === 'm/f' ? row[2] : undefined,
      exampleFr: row[3] || row[0],
      exampleEn: row[4] || row[1],
      tags: row[5] ? row[5].split(';').map((tag) => tag.trim()).filter(Boolean) : ['imported'],
    }))
}

function label(languageMode: UserSettings['languageMode'], en: string, fr: string) {
  return languageMode === 'fr' ? fr : en
}

function isAtOrBelow(level: CefrLevel, currentLevel: CefrLevel) {
  return levels.indexOf(level) <= levels.indexOf(currentLevel)
}

function levelLabel(level: CefrLevel, languageMode: UserSettings['languageMode']) {
  const labels: Record<CefrLevel, { en: string; fr: string }> = {
    A1: { en: 'A1 Beginner', fr: 'A1 Débutant' },
    A2: { en: 'A2 Elementary', fr: 'A2 Élémentaire' },
    B1: { en: 'B1 Intermediate', fr: 'B1 Intermédiaire' },
    B2: { en: 'B2 Upper Intermediate', fr: 'B2 Intermédiaire supérieur' },
  }
  return label(languageMode, labels[level].en, labels[level].fr)
}

function getDailyTargetMinutes(settings: UserSettings) {
  const weeklyMinutes = Math.max(1, settings.weeklyStudyHours) * 60
  return Math.max(15, Math.round(weeklyMinutes / Math.max(1, settings.studyDaysPerWeek)))
}

function buildDailyPlan({
  topics,
  cards,
  decks,
  verbs,
  dailyTargetMinutes,
  languageMode,
  aiEnabled,
}: {
  topics: SkillTopic[]
  cards: VocabCard[]
  decks: VocabDeck[]
  verbs: VerbEntry[]
  dailyTargetMinutes: number
  languageMode: UserSettings['languageMode']
  aiEnabled: boolean
}): DailyPlanTask[] {
  const sortedTopics = sortTopicsForStudy(topics, topics)
  const warmupTopic = sortedTopics.find((topic) => topic.confidence < 70) ?? sortedTopics[0]
  const lessonTopic =
    sortedTopics.find((topic) => getRoadmapStatus(topic, topics) === 'current') ??
    sortedTopics.find((topic) => getRoadmapStatus(topic, topics) === 'review') ??
    sortedTopics[0]
  const dueCards = cards.filter((card) => new Date(card.dueAt) <= new Date())
  const dueDeck =
    decks.find((deck) => dueCards.some((card) => card.deckId === deck.id)) ??
    [...decks].sort((a, b) => getDeckDifficulty(a) - getDeckDifficulty(b))[0]
  const deckCards = dueDeck ? cards.filter((card) => card.deckId === dueDeck.id) : []
  const weakVerb = [...verbs].sort((a, b) => average(Object.values(a.mastery)) - average(Object.values(b.mastery)))[0]
  const candidates: DailyPlanTask[] = []

  if (warmupTopic) {
    candidates.push({
      id: `warmup-${warmupTopic.id}`,
      type: 'grammar',
      title: label(languageMode, `Warm-up: ${warmupTopic.titleEn}`, `Échauffement : ${warmupTopic.titleFr}`),
      detail: label(languageMode, 'Repair prerequisites before new material.', 'Réparez les prérequis avant le nouveau contenu.'),
      minutes: 8,
      difficulty: Math.max(1, getTopicDifficulty(warmupTopic) - 1),
      progress: warmupTopic.confidence,
      targetView: 'grammar',
      targetId: warmupTopic.id,
    })
  }

  if (lessonTopic) {
    candidates.push(
      {
        id: `lesson-${lessonTopic.id}`,
        type: 'grammar',
        title: label(languageMode, `Lesson: ${lessonTopic.titleEn}`, `Leçon : ${lessonTopic.titleFr}`),
        detail: label(languageMode, 'Study the rule, examples, and common mistake pattern.', 'Étudiez la règle, les exemples et l’erreur fréquente.'),
        minutes: Math.min(22, getEstimatedMinutes(lessonTopic)),
        difficulty: getTopicDifficulty(lessonTopic),
        progress: lessonTopic.confidence,
        targetView: 'grammar',
        targetId: lessonTopic.id,
      },
      {
        id: `quiz-${lessonTopic.id}`,
        type: 'grammar',
        title: label(languageMode, `Guided quiz: ${lessonTopic.titleEn}`, `Quiz guidé : ${lessonTopic.titleFr}`),
        detail: label(languageMode, 'Answer targeted questions and read feedback.', 'Répondez à des questions ciblées et lisez le retour.'),
        minutes: 12,
        difficulty: Math.min(5, getTopicDifficulty(lessonTopic) + 1),
        progress: lessonTopic.confidence,
        targetView: 'grammar',
        targetId: lessonTopic.id,
      },
    )
  }

  if (dueDeck) {
    candidates.push({
      id: `vocab-${dueDeck.id}`,
      type: 'vocabulary',
      title: `Vocabulary review: ${dueDeck.title}`,
      detail: `${dueCards.length || deckCards.length} cards available. Focus on due and low-confidence cards.`,
      minutes: Math.min(18, Math.max(8, Math.ceil((dueCards.length || deckCards.length) / 2))),
      difficulty: getDeckDifficulty(dueDeck),
      progress: Math.round(average(deckCards.map((card) => card.confidence))),
      targetView: 'vocabulary',
      targetId: dueDeck.id,
    })
  }

  if (weakVerb) {
    candidates.push({
      id: `verb-${weakVerb.id}`,
      type: 'conjugation',
      title: `Verb drill: ${weakVerb.infinitive}`,
      detail: 'Drill the weakest tense/person forms before moving on.',
      minutes: Math.min(14, weakVerb.estimatedMinutes ?? 12),
      difficulty: getVerbDifficulty(weakVerb),
      progress: Math.round(average(Object.values(weakVerb.mastery))),
      targetView: 'conjugation',
      targetId: weakVerb.id,
    })
  }

  candidates.push({
    id: 'production-writing',
    type: aiEnabled ? 'ai' : 'writing',
    title: aiEnabled ? 'AI checked writing' : 'Short writing task',
    detail: aiEnabled
      ? 'Write 5 sentences with today’s grammar and ask AI to check them.'
      : 'Write 5 sentences with today’s grammar; AI checks are available in Settings.',
    minutes: 10,
    difficulty: lessonTopic ? Math.min(5, getTopicDifficulty(lessonTopic) + 1) : 2,
    progress: 0,
    targetView: 'practice',
  })

  const orderedCandidates = candidates.sort((a, b) => a.difficulty - b.difficulty || a.minutes - b.minutes)
  const selected: DailyPlanTask[] = []
  let usedMinutes = 0

  for (const task of orderedCandidates) {
    if (selected.length === 0 || usedMinutes + task.minutes <= dailyTargetMinutes + 5) {
      selected.push(task)
      usedMinutes += task.minutes
    }
  }

  return selected
}

function sortTopicsForStudy(topics: SkillTopic[], allTopics: SkillTopic[]) {
  return [...topics].sort((a, b) => {
    const statusWeight = roadmapStatusWeight(getRoadmapStatus(a, allTopics)) - roadmapStatusWeight(getRoadmapStatus(b, allTopics))
    if (statusWeight) return statusWeight
    const difficulty = getTopicDifficulty(a) - getTopicDifficulty(b)
    if (difficulty) return difficulty
    return getTopicSequence(a) - getTopicSequence(b)
  })
}

function getRoadmapStatus(topic: SkillTopic, allTopics: SkillTopic[]): RoadmapStatus {
  if (!arePrerequisitesMet(topic, allTopics)) return 'locked'
  if (topic.confidence >= 85) return 'mastered'
  if (topic.confidence >= 65) return 'strong'
  if (topic.confidence > 0 && topic.confidence < 45) return 'review'
  return 'current'
}

function roadmapStatusWeight(status: RoadmapStatus) {
  const weights: Record<RoadmapStatus, number> = {
    review: 0,
    current: 1,
    strong: 2,
    locked: 3,
    mastered: 4,
  }
  return weights[status]
}

function arePrerequisitesMet(topic: SkillTopic, allTopics: SkillTopic[]) {
  const prerequisites = topic.prerequisites ?? prerequisiteMap[topic.id] ?? []
  if (!prerequisites.length) return true
  return prerequisites.every((id) => {
    const prerequisite = allTopics.find((candidate) => candidate.id === id)
    return !prerequisite || prerequisite.confidence >= 55
  })
}

function getTopicSequence(topic: SkillTopic) {
  const explicitIndex = curriculumOrder.indexOf(topic.id)
  if (explicitIndex >= 0) return explicitIndex
  return levels.indexOf(topic.level) * 100 + (topic.sequence ?? 99)
}

function getTopicDifficulty(topic: SkillTopic) {
  if (topic.difficulty) return topic.difficulty
  const sequence = getTopicSequence(topic)
  if (topic.level === 'A1') return sequence < 10 ? 1 : 2
  if (topic.level === 'A2') return sequence < 30 ? 2 : 3
  if (topic.level === 'B1') return 4
  return 5
}

function getDeckDifficulty(deck: VocabDeck) {
  if (deck.difficulty) return deck.difficulty
  if (deck.level === 'A1') return deck.id.includes('core') ? 1 : 2
  if (deck.level === 'A2') return 3
  if (deck.level === 'B1') return 4
  return 5
}

function getVerbDifficulty(verbEntry: VerbEntry) {
  if (verbEntry.difficulty) return verbEntry.difficulty
  if (verbEntry.level === 'A1') return verbEntry.group === 'irregular' ? 2 : 1
  if (verbEntry.level === 'A2') return 3
  if (verbEntry.level === 'B1') return 4
  return 5
}

function getEstimatedMinutes(topic: SkillTopic) {
  return topic.estimatedMinutes ?? (getTopicDifficulty(topic) <= 2 ? 14 : 18)
}

function confidenceColor(value: number) {
  if (value <= 0) return 'bg-surface-variant'
  if (value < 35) return 'bg-secondary'
  if (value < 65) return 'bg-[#eab308]'
  if (value < 85) return 'bg-primary opacity-50'
  return 'bg-outline-variant'
}

function confidenceBg(value: number) {
  if (value < 35) return 'bg-secondary-fixed'
  if (value < 65) return 'bg-[#fef3c7]'
  if (value < 85) return 'bg-primary-fixed'
  return 'bg-surface-container-highest'
}

function average(values: number[]) {
  if (values.length === 0) return 0
  return values.reduce((sum, value) => sum + value, 0) / values.length
}

function isCorrect(answer: string, expected: string) {
  const normalizedAnswer = normalizeAnswer(answer)
  const expectedOptions = expected
    .split('/')
    .flatMap((part) => part.split('|'))
    .map((part) => normalizeAnswer(part.replace(/\(e\)|\(s\)|\(e\)\(s\)|\(e\)s/g, '')))
  return expectedOptions.includes(normalizedAnswer)
}

function slugify(value: string) {
  return normalizeAnswer(value)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function speakFrench(text: string) {
  if (!('speechSynthesis' in window)) return
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'fr-FR'
  utterance.rate = 0.9
  window.speechSynthesis.cancel()
  window.speechSynthesis.speak(utterance)
}

export default App
