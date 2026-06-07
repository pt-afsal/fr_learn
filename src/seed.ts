import { a2B1QuestionBank, a2B1Topics, completeQuestionSets } from './a2B1Curriculum'
import { enrichedQuestions } from './enrichedQuiz'
import { extraCards, extraDecks, extraQuestions, extraTopics } from './expandedSeed'
import { applyDetailedGrammarTopics } from './grammarDetails'
import type { Question, SkillTopic, UserSettings, VocabCard, VocabDeck, VerbEntry } from './types'

const today = new Date().toISOString()

export const defaultSettings: UserSettings = {
  id: 'main',
  learnerName: '',
  onboardingCompleted: false,
  currentLevel: 'A2',
  targetLevel: 'B1',
  weeklyAvailability: {
    monday: 60,
    tuesday: 60,
    wednesday: 0,
    thursday: 60,
    friday: 30,
    saturday: 120,
    sunday: 30,
  },
  languageMode: 'en',
  speechEnabled: true,
  speechRecognitionEnabled: true,
  aiProvider: 'disabled',
  aiModel: 'gemma4:e2b-it-q4_K_M',
  ollamaHost: 'http://localhost:11434',
}

export const seedTopics: SkillTopic[] = [
  {
    id: 'articles-gender',
    level: 'A1',
    area: 'Nouns',
    titleEn: 'Articles and Gender',
    titleFr: 'Articles et genre',
    explanationEn: 'French nouns are masculine or feminine. Articles must agree with the noun.',
    explanationFr: 'Les noms français sont masculins ou féminins. Les articles doivent s’accorder avec le nom.',
    examples: ['le livre', 'la table', "l'hôtel", 'les amis'],
    confidence: 86,
  },
  {
    id: 'present-er',
    level: 'A1',
    area: 'Verbs',
    titleEn: 'Present Tense: -er Verbs',
    titleFr: 'Présent : verbes en -er',
    explanationEn: 'Regular -er verbs use endings -e, -es, -e, -ons, -ez, -ent in the present tense.',
    explanationFr: 'Les verbes réguliers en -er prennent les terminaisons -e, -es, -e, -ons, -ez, -ent au présent.',
    examples: ['je parle', 'nous aimons', 'ils regardent'],
    confidence: 78,
  },
  {
    id: 'etre-avoir',
    level: 'A1',
    area: 'Core Verbs',
    titleEn: 'Être and Avoir',
    titleFr: 'Être et avoir',
    explanationEn: 'Être and avoir are essential irregular verbs and auxiliaries.',
    explanationFr: 'Être et avoir sont des verbes irréguliers essentiels et des auxiliaires.',
    examples: ['je suis prêt', 'tu as raison', 'elles sont ici'],
    confidence: 82,
  },
  {
    id: 'questions',
    level: 'A1',
    area: 'Sentence Patterns',
    titleEn: 'Question Forms',
    titleFr: 'Les questions',
    explanationEn: 'French questions can use intonation, est-ce que, or inversion.',
    explanationFr: 'Les questions françaises peuvent utiliser l’intonation, est-ce que ou l’inversion.',
    examples: ['Tu viens ?', 'Est-ce que tu viens ?', 'Viens-tu ?'],
    confidence: 48,
  },
  {
    id: 'passe-compose',
    level: 'A2',
    area: 'Past Tenses',
    titleEn: 'Passé Composé',
    titleFr: 'Passé composé',
    explanationEn: 'Passé composé describes completed actions using avoir or être plus a past participle.',
    explanationFr: 'Le passé composé exprime des actions terminées avec avoir ou être plus un participe passé.',
    examples: ["j'ai parlé", 'elle est partie', 'nous avons choisi'],
    confidence: 64,
  },
  {
    id: 'imparfait',
    level: 'A2',
    area: 'Past Tenses',
    titleEn: 'Imparfait',
    titleFr: 'Imparfait',
    explanationEn: 'Imparfait describes background, habits, repeated actions, and ongoing past states.',
    explanationFr: 'L’imparfait décrit le contexte, les habitudes, les actions répétées et les états passés.',
    examples: ['il faisait froid', 'nous allions souvent au parc'],
    confidence: 42,
  },
  {
    id: 'object-pronouns',
    level: 'A2',
    area: 'Pronouns',
    titleEn: 'Direct and Indirect Object Pronouns',
    titleFr: 'Pronoms compléments',
    explanationEn: 'Object pronouns usually come before the conjugated verb.',
    explanationFr: 'Les pronoms compléments se placent généralement avant le verbe conjugué.',
    examples: ['je le vois', 'elle lui parle', 'nous les attendons'],
    confidence: 36,
  },
  {
    id: 'y-en',
    level: 'B1',
    area: 'Pronouns',
    titleEn: 'Y and En',
    titleFr: 'Y et en',
    explanationEn: 'Y often replaces à plus a thing/place. En often replaces de plus a quantity or phrase.',
    explanationFr: 'Y remplace souvent à plus une chose ou un lieu. En remplace souvent de plus une quantité ou un groupe.',
    examples: ["j'y vais", "j'en veux deux", "il s'en souvient"],
    confidence: 28,
  },
  {
    id: 'relative-pronouns',
    level: 'B1',
    area: 'Complex Sentences',
    titleEn: 'Relative Pronouns',
    titleFr: 'Pronoms relatifs',
    explanationEn: 'Qui, que, dont, and où connect clauses and avoid repetition.',
    explanationFr: 'Qui, que, dont et où relient des propositions et évitent les répétitions.',
    examples: ["la femme qui parle", "le livre que j'ai lu", "la ville où j'habite"],
    confidence: 52,
  },
  {
    id: 'conditional',
    level: 'B1',
    area: 'Mood',
    titleEn: 'Conditional Mood',
    titleFr: 'Conditionnel',
    explanationEn: 'The conditional expresses politeness, wishes, hypotheses, and future-in-the-past.',
    explanationFr: 'Le conditionnel exprime la politesse, les souhaits, les hypothèses et le futur dans le passé.',
    examples: ['je voudrais', 'nous irions', 'ce serait mieux'],
    confidence: 44,
  },
  {
    id: 'subjunctive',
    level: 'B2',
    area: 'Mood',
    titleEn: 'Subjunctive Essentials',
    titleFr: 'Essentiel du subjonctif',
    explanationEn: 'The subjunctive appears after many expressions of doubt, emotion, necessity, and desire.',
    explanationFr: 'Le subjonctif apparaît après de nombreuses expressions de doute, d’émotion, de nécessité et de volonté.',
    examples: ["il faut que tu viennes", "je doute qu'il sache", "bien qu'elle soit fatiguée"],
    confidence: 18,
  },
  {
    id: 'si-clauses',
    level: 'B2',
    area: 'Hypothesis',
    titleEn: 'Si Clauses',
    titleFr: 'Phrases avec si',
    explanationEn: 'Si clauses pair tenses carefully to express real or hypothetical conditions.',
    explanationFr: 'Les phrases avec si associent les temps avec précision pour exprimer des conditions réelles ou hypothétiques.',
    examples: ["si j'avais le temps, je voyagerais", "si tu viens, je serai content"],
    confidence: 24,
  },
]

export const seedQuestions: Question[] = [
  {
    id: 'q-articles-1',
    topicId: 'articles-gender',
    type: 'multiple-choice',
    promptEn: 'Choose the correct article: ___ voiture est rouge.',
    promptFr: 'Choisissez le bon article : ___ voiture est rouge.',
    choices: ['Le', 'La', 'Les', 'Un'],
    correctAnswer: 'La',
    explanationEn: 'Voiture is feminine singular, so it takes la.',
    explanationFr: 'Voiture est féminin singulier, donc on utilise la.',
  },
  {
    id: 'q-present-er-1',
    topicId: 'present-er',
    type: 'fill',
    promptEn: 'Complete: Nous ___ français. (parler)',
    promptFr: 'Complétez : Nous ___ français. (parler)',
    correctAnswer: 'parlons',
    explanationEn: 'Nous takes the -ons ending for regular -er verbs.',
    explanationFr: 'Avec nous, les verbes réguliers en -er prennent la terminaison -ons.',
  },
  {
    id: 'q-etre-1',
    topicId: 'etre-avoir',
    type: 'multiple-choice',
    promptEn: 'Choose the correct form: Elles ___ très gentilles.',
    promptFr: 'Choisissez la bonne forme : Elles ___ très gentilles.',
    choices: ['suis', 'es', 'sommes', 'sont'],
    correctAnswer: 'sont',
    explanationEn: 'Elles uses sont, the third-person plural form of être.',
    explanationFr: 'Elles utilise sont, la troisième personne du pluriel du verbe être.',
  },
  {
    id: 'q-questions-1',
    topicId: 'questions',
    type: 'multiple-choice',
    promptEn: 'Which question uses est-ce que correctly?',
    promptFr: 'Quelle question utilise correctement est-ce que ?',
    choices: ['Est-ce que tu viens ?', 'Est-ce tu viens ?', 'Tu est-ce viens ?', 'Viens est-ce que ?'],
    correctAnswer: 'Est-ce que tu viens ?',
    explanationEn: 'Est-ce que comes before the normal subject-verb order.',
    explanationFr: 'Est-ce que se place avant l’ordre normal sujet-verbe.',
  },
  {
    id: 'q-passe-1',
    topicId: 'passe-compose',
    type: 'fill',
    promptEn: 'Complete: Hier, elle ___ au marché. (aller)',
    promptFr: 'Complétez : Hier, elle ___ au marché. (aller)',
    correctAnswer: 'est allée',
    explanationEn: 'Aller uses être in passé composé, and the participle agrees with elle.',
    explanationFr: 'Aller utilise être au passé composé, et le participe s’accorde avec elle.',
  },
  {
    id: 'q-imparfait-1',
    topicId: 'imparfait',
    type: 'multiple-choice',
    promptEn: 'Choose the best past tense: Quand j’étais petit, je ___ souvent chez ma tante.',
    promptFr: 'Choisissez le meilleur temps : Quand j’étais petit, je ___ souvent chez ma tante.',
    choices: ['vais', 'allais', 'suis allé', 'irai'],
    correctAnswer: 'allais',
    explanationEn: 'Souvent signals a repeated past habit, so imparfait fits.',
    explanationFr: 'Souvent indique une habitude passée répétée, donc l’imparfait convient.',
  },
  {
    id: 'q-object-1',
    topicId: 'object-pronouns',
    type: 'multiple-choice',
    promptEn: 'Replace “à Marie”: Je parle à Marie.',
    promptFr: 'Remplacez « à Marie » : Je parle à Marie.',
    choices: ['Je la parle.', 'Je lui parle.', 'Je le parle.', "J'en parle."],
    correctAnswer: 'Je lui parle.',
    explanationEn: 'Parler à someone uses the indirect object pronoun lui.',
    explanationFr: 'Parler à quelqu’un utilise le pronom complément indirect lui.',
  },
  {
    id: 'q-y-en-1',
    topicId: 'y-en',
    type: 'multiple-choice',
    promptEn: 'Replace “au bureau”: Je vais au bureau.',
    promptFr: 'Remplacez « au bureau » : Je vais au bureau.',
    choices: ["J'en vais.", "Je lui vais.", "J'y vais.", 'Je le vais.'],
    correctAnswer: "J'y vais.",
    explanationEn: 'Y replaces à plus a place.',
    explanationFr: 'Y remplace à plus un lieu.',
  },
  {
    id: 'q-relative-1',
    topicId: 'relative-pronouns',
    type: 'multiple-choice',
    promptEn: 'Choose: Le film ___ nous avons vu était excellent.',
    promptFr: 'Choisissez : Le film ___ nous avons vu était excellent.',
    choices: ['qui', 'que', 'dont', 'où'],
    correctAnswer: 'que',
    explanationEn: 'Que is the direct object of avons vu.',
    explanationFr: 'Que est le complément d’objet direct de avons vu.',
  },
  {
    id: 'q-conditional-1',
    topicId: 'conditional',
    type: 'fill',
    promptEn: 'Complete politely: Je ___ un café, s’il vous plaît. (vouloir)',
    promptFr: 'Complétez poliment : Je ___ un café, s’il vous plaît. (vouloir)',
    correctAnswer: 'voudrais',
    explanationEn: 'Je voudrais is the polite conditional form.',
    explanationFr: 'Je voudrais est la forme polie au conditionnel.',
  },
  {
    id: 'q-subjunctive-1',
    topicId: 'subjunctive',
    type: 'fill',
    promptEn: 'Complete: Il faut que tu ___ ici. (être)',
    promptFr: 'Complétez : Il faut que tu ___ ici. (être)',
    correctAnswer: 'sois',
    explanationEn: 'Il faut que triggers the subjunctive; tu sois is correct.',
    explanationFr: 'Il faut que déclenche le subjonctif ; tu sois est correct.',
  },
  {
    id: 'q-si-1',
    topicId: 'si-clauses',
    type: 'multiple-choice',
    promptEn: 'Choose the correct pairing: Si j’avais le temps, je ___ plus.',
    promptFr: 'Choisissez la bonne association : Si j’avais le temps, je ___ plus.',
    choices: ['lis', 'lirais', 'lirai', 'ai lu'],
    correctAnswer: 'lirais',
    explanationEn: 'Si + imparfait pairs with conditional for a hypothetical present.',
    explanationFr: 'Si + imparfait s’associe au conditionnel pour une hypothèse présente.',
  },
]

export const seedDecks: VocabDeck[] = [
  {
    id: 'travel-directions',
    title: 'Travel & Directions',
    description: 'High-frequency navigation and transport words.',
    level: 'A1',
    tags: ['travel', 'city'],
  },
  {
    id: 'daily-life',
    title: 'Daily Life',
    description: 'Common household, schedule, and routine vocabulary.',
    level: 'A1',
    tags: ['routine', 'home'],
  },
  {
    id: 'thoughts-feelings',
    title: 'Thoughts & Feelings',
    description: 'Useful words for opinions, emotions, and nuance.',
    level: 'B1',
    tags: ['emotion', 'opinion'],
  },
  {
    id: 'connectors',
    title: 'B2 Connectors',
    description: 'Linking words for complex argument and contrast.',
    level: 'B2',
    tags: ['writing', 'argument'],
  },
]

export const seedCards: VocabCard[] = [
  ['travel-directions', 'la gare', 'train station', 'f', 'La gare est près du centre.', 'The train station is near the center.', 'transport'],
  ['travel-directions', 'le quai', 'platform', 'm', 'Le train part du quai trois.', 'The train leaves from platform three.', 'transport'],
  ['travel-directions', 'tourner', 'to turn', undefined, 'Tournez à gauche après le pont.', 'Turn left after the bridge.', 'directions'],
  ['travel-directions', 'tout droit', 'straight ahead', undefined, 'Continuez tout droit.', 'Keep going straight ahead.', 'directions'],
  ['travel-directions', 'un billet', 'a ticket', 'm', 'Je voudrais un billet aller-retour.', 'I would like a return ticket.', 'transport'],
  ['travel-directions', 'un arrêt', 'a stop', 'm', 'Je descends au prochain arrêt.', 'I get off at the next stop.', 'city'],
  ['daily-life', 'se réveiller', 'to wake up', undefined, 'Je me réveille à sept heures.', 'I wake up at seven.', 'routine'],
  ['daily-life', 'le repas', 'meal', 'm', 'Le repas est prêt.', 'The meal is ready.', 'home'],
  ['daily-life', 'ranger', 'to tidy', undefined, 'Elle range sa chambre.', 'She tidies her room.', 'home'],
  ['daily-life', 'd’habitude', 'usually', undefined, 'D’habitude, je lis le soir.', 'Usually, I read in the evening.', 'routine'],
  ['daily-life', 'la lessive', 'laundry', 'f', 'Je fais la lessive le dimanche.', 'I do laundry on Sunday.', 'home'],
  ['daily-life', 'le rendez-vous', 'appointment', 'm', 'J’ai un rendez-vous à midi.', 'I have an appointment at noon.', 'schedule'],
  ['thoughts-feelings', 'avoir hâte de', 'to look forward to', undefined, 'J’ai hâte de te revoir.', 'I look forward to seeing you again.', 'emotion'],
  ['thoughts-feelings', 'inquiet', 'worried', undefined, 'Il est inquiet pour son examen.', 'He is worried about his exam.', 'emotion'],
  ['thoughts-feelings', 'selon moi', 'in my opinion', undefined, 'Selon moi, c’est une bonne idée.', 'In my opinion, it is a good idea.', 'opinion'],
  ['thoughts-feelings', 'se rendre compte', 'to realize', undefined, 'Je me rends compte de mon erreur.', 'I realize my mistake.', 'reflection'],
  ['thoughts-feelings', 'malgré', 'despite', undefined, 'Malgré la pluie, nous sortons.', 'Despite the rain, we are going out.', 'contrast'],
  ['thoughts-feelings', 'la confiance', 'confidence/trust', 'f', 'Elle parle avec confiance.', 'She speaks with confidence.', 'emotion'],
  ['connectors', 'cependant', 'however', undefined, 'Cependant, le résultat reste incertain.', 'However, the result remains uncertain.', 'contrast'],
  ['connectors', 'en revanche', 'on the other hand', undefined, 'En revanche, cette option coûte moins cher.', 'On the other hand, this option costs less.', 'contrast'],
  ['connectors', 'afin que', 'so that', undefined, 'Je parle lentement afin que tu comprennes.', 'I speak slowly so that you understand.', 'subjunctive'],
  ['connectors', 'bien que', 'although', undefined, 'Bien qu’il soit tard, elle continue.', 'Although it is late, she continues.', 'subjunctive'],
  ['connectors', 'désormais', 'from now on', undefined, 'Désormais, je réviserai chaque jour.', 'From now on, I will review every day.', 'time'],
  ['connectors', 'à moins que', 'unless', undefined, 'Nous irons dehors à moins qu’il pleuve.', 'We will go outside unless it rains.', 'subjunctive'],
].map(([deckId, frontFr, backEn, gender, exampleFr, exampleEn, tag], index) => ({
  id: `card-${index + 1}`,
  deckId: deckId as string,
  frontFr: frontFr as string,
  backEn: backEn as string,
  gender: gender as VocabCard['gender'],
  exampleFr: exampleFr as string,
  exampleEn: exampleEn as string,
  notes: '',
  tags: [tag as string],
  confidence: index % 5 === 0 ? 32 : index % 3 === 0 ? 58 : 74,
  dueAt: today,
  intervalDays: index % 3 === 0 ? 1 : 3,
}))

export const seedVerbs: VerbEntry[] = [
  verb('etre', 'être', 'to be', 'A1', 'irregular', 'avoir', false, {
    present: ['suis', 'es', 'est', 'sommes', 'êtes', 'sont'],
    passeCompose: ['ai été', 'as été', 'a été', 'avons été', 'avez été', 'ont été'],
    imparfait: ['étais', 'étais', 'était', 'étions', 'étiez', 'étaient'],
    futurSimple: ['serai', 'seras', 'sera', 'serons', 'serez', 'seront'],
    subjunctive: ['sois', 'sois', 'soit', 'soyons', 'soyez', 'soient'],
  }),
  verb('avoir', 'avoir', 'to have', 'A1', 'irregular', 'avoir', false, {
    present: ['ai', 'as', 'a', 'avons', 'avez', 'ont'],
    passeCompose: ['ai eu', 'as eu', 'a eu', 'avons eu', 'avez eu', 'ont eu'],
    imparfait: ['avais', 'avais', 'avait', 'avions', 'aviez', 'avaient'],
    futurSimple: ['aurai', 'auras', 'aura', 'aurons', 'aurez', 'auront'],
    subjunctive: ['aie', 'aies', 'ait', 'ayons', 'ayez', 'aient'],
  }),
  verb('aller', 'aller', 'to go', 'A1', 'irregular', 'etre', false, {
    present: ['vais', 'vas', 'va', 'allons', 'allez', 'vont'],
    passeCompose: ['suis allé(e)', 'es allé(e)', 'est allé(e)', 'sommes allé(e)s', 'êtes allé(e)(s)', 'sont allé(e)s'],
    imparfait: ['allais', 'allais', 'allait', 'allions', 'alliez', 'allaient'],
    futurSimple: ['irai', 'iras', 'ira', 'irons', 'irez', 'iront'],
    subjunctive: ['aille', 'ailles', 'aille', 'allions', 'alliez', 'aillent'],
  }),
  verb('faire', 'faire', 'to do/make', 'A1', 'irregular', 'avoir', false, {
    present: ['fais', 'fais', 'fait', 'faisons', 'faites', 'font'],
    passeCompose: ['ai fait', 'as fait', 'a fait', 'avons fait', 'avez fait', 'ont fait'],
    imparfait: ['faisais', 'faisais', 'faisait', 'faisions', 'faisiez', 'faisaient'],
    futurSimple: ['ferai', 'feras', 'fera', 'ferons', 'ferez', 'feront'],
    subjunctive: ['fasse', 'fasses', 'fasse', 'fassions', 'fassiez', 'fassent'],
  }),
  verb('prendre', 'prendre', 'to take', 'A2', 'irregular', 'avoir', false, {
    present: ['prends', 'prends', 'prend', 'prenons', 'prenez', 'prennent'],
    passeCompose: ['ai pris', 'as pris', 'a pris', 'avons pris', 'avez pris', 'ont pris'],
    imparfait: ['prenais', 'prenais', 'prenait', 'prenions', 'preniez', 'prenaient'],
    futurSimple: ['prendrai', 'prendras', 'prendra', 'prendrons', 'prendrez', 'prendront'],
    subjunctive: ['prenne', 'prennes', 'prenne', 'prenions', 'preniez', 'prennent'],
  }),
  verb('venir', 'venir', 'to come', 'A2', 'irregular', 'etre', false, {
    present: ['viens', 'viens', 'vient', 'venons', 'venez', 'viennent'],
    passeCompose: ['suis venu(e)', 'es venu(e)', 'est venu(e)', 'sommes venu(e)s', 'êtes venu(e)(s)', 'sont venu(e)s'],
    imparfait: ['venais', 'venais', 'venait', 'venions', 'veniez', 'venaient'],
    futurSimple: ['viendrai', 'viendras', 'viendra', 'viendrons', 'viendrez', 'viendront'],
    subjunctive: ['vienne', 'viennes', 'vienne', 'venions', 'veniez', 'viennent'],
  }),
  verb('pouvoir', 'pouvoir', 'can/to be able to', 'A2', 'irregular', 'avoir', false, {
    present: ['peux', 'peux', 'peut', 'pouvons', 'pouvez', 'peuvent'],
    passeCompose: ['ai pu', 'as pu', 'a pu', 'avons pu', 'avez pu', 'ont pu'],
    imparfait: ['pouvais', 'pouvais', 'pouvait', 'pouvions', 'pouviez', 'pouvaient'],
    futurSimple: ['pourrai', 'pourras', 'pourra', 'pourrons', 'pourrez', 'pourront'],
    subjunctive: ['puisse', 'puisses', 'puisse', 'puissions', 'puissiez', 'puissent'],
  }),
  verb('vouloir', 'vouloir', 'to want', 'A2', 'irregular', 'avoir', false, {
    present: ['veux', 'veux', 'veut', 'voulons', 'voulez', 'veulent'],
    passeCompose: ['ai voulu', 'as voulu', 'a voulu', 'avons voulu', 'avez voulu', 'ont voulu'],
    imparfait: ['voulais', 'voulais', 'voulait', 'voulions', 'vouliez', 'voulaient'],
    futurSimple: ['voudrai', 'voudras', 'voudra', 'voudrons', 'voudrez', 'voudront'],
    subjunctive: ['veuille', 'veuilles', 'veuille', 'voulions', 'vouliez', 'veuillent'],
  }),
  verb('parler', 'parler', 'to speak', 'A1', 'regular -er', 'avoir', false, {
    present: ['parle', 'parles', 'parle', 'parlons', 'parlez', 'parlent'],
    passeCompose: ['ai parlé', 'as parlé', 'a parlé', 'avons parlé', 'avez parlé', 'ont parlé'],
    imparfait: ['parlais', 'parlais', 'parlait', 'parlions', 'parliez', 'parlaient'],
    futurSimple: ['parlerai', 'parleras', 'parlera', 'parlerons', 'parlerez', 'parleront'],
    subjunctive: ['parle', 'parles', 'parle', 'parlions', 'parliez', 'parlent'],
  }),
  verb('choisir', 'choisir', 'to choose', 'A1', 'regular -ir', 'avoir', false, {
    present: ['choisis', 'choisis', 'choisit', 'choisissons', 'choisissez', 'choisissent'],
    passeCompose: ['ai choisi', 'as choisi', 'a choisi', 'avons choisi', 'avez choisi', 'ont choisi'],
    imparfait: ['choisissais', 'choisissais', 'choisissait', 'choisissions', 'choisissiez', 'choisissaient'],
    futurSimple: ['choisirai', 'choisiras', 'choisira', 'choisirons', 'choisirez', 'choisiront'],
    subjunctive: ['choisisse', 'choisisses', 'choisisse', 'choisissions', 'choisissiez', 'choisissent'],
  }),
  verb('attendre', 'attendre', 'to wait for', 'A1', 'regular -re', 'avoir', false, {
    present: ['attends', 'attends', 'attend', 'attendons', 'attendez', 'attendent'],
    passeCompose: ['ai attendu', 'as attendu', 'a attendu', 'avons attendu', 'avez attendu', 'ont attendu'],
    imparfait: ['attendais', 'attendais', 'attendait', 'attendions', 'attendiez', 'attendaient'],
    futurSimple: ['attendrai', 'attendras', 'attendra', 'attendrons', 'attendrez', 'attendront'],
    subjunctive: ['attende', 'attendes', 'attende', 'attendions', 'attendiez', 'attendent'],
  }),
  verb('se-souvenir', 'se souvenir', 'to remember', 'B1', 'irregular', 'etre', true, {
    present: ['me souviens', 'te souviens', 'se souvient', 'nous souvenons', 'vous souvenez', 'se souviennent'],
    passeCompose: ['me suis souvenu(e)', 't’es souvenu(e)', 's’est souvenu(e)', 'nous sommes souvenu(e)s', 'vous êtes souvenu(e)(s)', 'se sont souvenu(e)s'],
    imparfait: ['me souvenais', 'te souvenais', 'se souvenait', 'nous souvenions', 'vous souveniez', 'se souvenaient'],
    futurSimple: ['me souviendrai', 'te souviendras', 'se souviendra', 'nous souviendrons', 'vous souviendrez', 'se souviendront'],
    subjunctive: ['me souvienne', 'te souviennes', 'se souvienne', 'nous souvenions', 'vous souveniez', 'se souviennent'],
  }),
]

seedVerbs.push(
  regularErVerb('aimer', 'aimer', 'to like / love', 'A1'),
  regularErVerb('habiter', 'habiter', 'to live', 'A1'),
  regularErVerb('travailler', 'travailler', 'to work', 'A1'),
  regularErVerb('regarder', 'regarder', 'to watch / look at', 'A1'),
  regularErVerb('ecouter', 'écouter', 'to listen', 'A1'),
  regularErVerb('donner', 'donner', 'to give', 'A1'),
  regularErVerb('trouver', 'trouver', 'to find', 'A1'),
  regularErVerb('demander', 'demander', 'to ask / request', 'A1'),
  regularErVerb('porter', 'porter', 'to wear / carry', 'A1'),
  regularErVerb('jouer', 'jouer', 'to play', 'A1'),
  regularErVerb('visiter', 'visiter', 'to visit a place', 'A1'),
  regularErVerb('etudier', 'étudier', 'to study', 'A1'),
  regularErVerb('chercher', 'chercher', 'to look for', 'A1'),
  regularErVerb('penser', 'penser', 'to think', 'A1'),
  regularErVerb('arriver', 'arriver', 'to arrive', 'A1', 'etre'),
  regularErVerb('rester', 'rester', 'to stay', 'A1', 'etre'),
  regularErVerb('entrer', 'entrer', 'to enter', 'A2', 'etre'),
  regularIrVerb('finir', 'finir', 'to finish', 'A1'),
  regularIrVerb('reussir', 'réussir', 'to succeed / pass', 'A2'),
  regularIrVerb('remplir', 'remplir', 'to fill in / fill up', 'A2'),
  regularIrVerb('grandir', 'grandir', 'to grow', 'A2'),
  regularReVerb('vendre', 'vendre', 'to sell', 'A1'),
  regularReVerb('perdre', 'perdre', 'to lose', 'A2'),
  regularReVerb('repondre', 'répondre', 'to answer', 'A2'),
  regularReVerb('rendre', 'rendre', 'to give back / make', 'A2'),
  verb('lire', 'lire', 'to read', 'A1', 'irregular', 'avoir', false, {
    present: ['lis', 'lis', 'lit', 'lisons', 'lisez', 'lisent'],
    passeCompose: avoirPasse('lu'),
    imparfait: ['lisais', 'lisais', 'lisait', 'lisions', 'lisiez', 'lisaient'],
    futurSimple: ['lirai', 'liras', 'lira', 'lirons', 'lirez', 'liront'],
    subjunctive: ['lise', 'lises', 'lise', 'lisions', 'lisiez', 'lisent'],
  }),
  verb('ecrire', 'écrire', 'to write', 'A1', 'irregular', 'avoir', false, {
    present: ['écris', 'écris', 'écrit', 'écrivons', 'écrivez', 'écrivent'],
    passeCompose: avoirPasse('écrit'),
    imparfait: ['écrivais', 'écrivais', 'écrivait', 'écrivions', 'écriviez', 'écrivaient'],
    futurSimple: ['écrirai', 'écriras', 'écrira', 'écrirons', 'écrirez', 'écriront'],
    subjunctive: ['écrive', 'écrives', 'écrive', 'écrivions', 'écriviez', 'écrivent'],
  }),
  verb('boire', 'boire', 'to drink', 'A1', 'irregular', 'avoir', false, {
    present: ['bois', 'bois', 'boit', 'buvons', 'buvez', 'boivent'],
    passeCompose: avoirPasse('bu'),
    imparfait: ['buvais', 'buvais', 'buvait', 'buvions', 'buviez', 'buvaient'],
    futurSimple: ['boirai', 'boiras', 'boira', 'boirons', 'boirez', 'boiront'],
    subjunctive: ['boive', 'boives', 'boive', 'buvions', 'buviez', 'boivent'],
  }),
  verb('dire', 'dire', 'to say / tell', 'A2', 'irregular', 'avoir', false, {
    present: ['dis', 'dis', 'dit', 'disons', 'dites', 'disent'],
    passeCompose: avoirPasse('dit'),
    imparfait: ['disais', 'disais', 'disait', 'disions', 'disiez', 'disaient'],
    futurSimple: ['dirai', 'diras', 'dira', 'dirons', 'direz', 'diront'],
    subjunctive: ['dise', 'dises', 'dise', 'disions', 'disiez', 'disent'],
  }),
  verb('voir', 'voir', 'to see', 'A2', 'irregular', 'avoir', false, {
    present: ['vois', 'vois', 'voit', 'voyons', 'voyez', 'voient'],
    passeCompose: avoirPasse('vu'),
    imparfait: ['voyais', 'voyais', 'voyait', 'voyions', 'voyiez', 'voyaient'],
    futurSimple: ['verrai', 'verras', 'verra', 'verrons', 'verrez', 'verront'],
    subjunctive: ['voie', 'voies', 'voie', 'voyions', 'voyiez', 'voient'],
  }),
  verb('savoir', 'savoir', 'to know a fact / know how', 'A2', 'irregular', 'avoir', false, {
    present: ['sais', 'sais', 'sait', 'savons', 'savez', 'savent'],
    passeCompose: avoirPasse('su'),
    imparfait: ['savais', 'savais', 'savait', 'savions', 'saviez', 'savaient'],
    futurSimple: ['saurai', 'sauras', 'saura', 'saurons', 'saurez', 'sauront'],
    subjunctive: ['sache', 'saches', 'sache', 'sachions', 'sachiez', 'sachent'],
  }),
  verb('devoir', 'devoir', 'to have to / owe', 'A2', 'irregular', 'avoir', false, {
    present: ['dois', 'dois', 'doit', 'devons', 'devez', 'doivent'],
    passeCompose: avoirPasse('dû'),
    imparfait: ['devais', 'devais', 'devait', 'devions', 'deviez', 'devaient'],
    futurSimple: ['devrai', 'devras', 'devra', 'devrons', 'devrez', 'devront'],
    subjunctive: ['doive', 'doives', 'doive', 'devions', 'deviez', 'doivent'],
  }),
  verb('mettre', 'mettre', 'to put / place', 'A2', 'irregular', 'avoir', false, {
    present: ['mets', 'mets', 'met', 'mettons', 'mettez', 'mettent'],
    passeCompose: avoirPasse('mis'),
    imparfait: ['mettais', 'mettais', 'mettait', 'mettions', 'mettiez', 'mettaient'],
    futurSimple: ['mettrai', 'mettras', 'mettra', 'mettrons', 'mettrez', 'mettront'],
    subjunctive: ['mette', 'mettes', 'mette', 'mettions', 'mettiez', 'mettent'],
  }),
  verb('comprendre', 'comprendre', 'to understand', 'A2', 'irregular', 'avoir', false, {
    present: ['comprends', 'comprends', 'comprend', 'comprenons', 'comprenez', 'comprennent'],
    passeCompose: avoirPasse('compris'),
    imparfait: ['comprenais', 'comprenais', 'comprenait', 'comprenions', 'compreniez', 'comprenaient'],
    futurSimple: ['comprendrai', 'comprendras', 'comprendra', 'comprendrons', 'comprendrez', 'comprendront'],
    subjunctive: ['comprenne', 'comprennes', 'comprenne', 'comprenions', 'compreniez', 'comprennent'],
  }),
  verb('apprendre', 'apprendre', 'to learn', 'A2', 'irregular', 'avoir', false, {
    present: ['apprends', 'apprends', 'apprend', 'apprenons', 'apprenez', 'apprennent'],
    passeCompose: avoirPasse('appris'),
    imparfait: ['apprenais', 'apprenais', 'apprenait', 'apprenions', 'appreniez', 'apprenaient'],
    futurSimple: ['apprendrai', 'apprendras', 'apprendra', 'apprendrons', 'apprendrez', 'apprendront'],
    subjunctive: ['apprenne', 'apprennes', 'apprenne', 'apprenions', 'appreniez', 'apprennent'],
  }),
  verb('connaitre', 'connaître', 'to know / be familiar with', 'B1', 'irregular', 'avoir', false, {
    present: ['connais', 'connais', 'connaît', 'connaissons', 'connaissez', 'connaissent'],
    passeCompose: avoirPasse('connu'),
    imparfait: ['connaissais', 'connaissais', 'connaissait', 'connaissions', 'connaissiez', 'connaissaient'],
    futurSimple: ['connaîtrai', 'connaîtras', 'connaîtra', 'connaîtrons', 'connaîtrez', 'connaîtront'],
    subjunctive: ['connaisse', 'connaisses', 'connaisse', 'connaissions', 'connaissiez', 'connaissent'],
  }),
  verb('partir', 'partir', 'to leave', 'A2', 'irregular', 'etre', false, {
    present: ['pars', 'pars', 'part', 'partons', 'partez', 'partent'],
    passeCompose: etrePasse('parti'),
    imparfait: ['partais', 'partais', 'partait', 'partions', 'partiez', 'partaient'],
    futurSimple: ['partirai', 'partiras', 'partira', 'partirons', 'partirez', 'partiront'],
    subjunctive: ['parte', 'partes', 'parte', 'partions', 'partiez', 'partent'],
  }),
  verb('sortir', 'sortir', 'to go out / leave', 'A2', 'irregular', 'etre', false, {
    present: ['sors', 'sors', 'sort', 'sortons', 'sortez', 'sortent'],
    passeCompose: etrePasse('sorti'),
    imparfait: ['sortais', 'sortais', 'sortait', 'sortions', 'sortiez', 'sortaient'],
    futurSimple: ['sortirai', 'sortiras', 'sortira', 'sortirons', 'sortirez', 'sortiront'],
    subjunctive: ['sorte', 'sortes', 'sorte', 'sortions', 'sortiez', 'sortent'],
  }),
  verb('dormir', 'dormir', 'to sleep', 'A2', 'irregular', 'avoir', false, {
    present: ['dors', 'dors', 'dort', 'dormons', 'dormez', 'dorment'],
    passeCompose: avoirPasse('dormi'),
    imparfait: ['dormais', 'dormais', 'dormait', 'dormions', 'dormiez', 'dormaient'],
    futurSimple: ['dormirai', 'dormiras', 'dormira', 'dormirons', 'dormirez', 'dormiront'],
    subjunctive: ['dorme', 'dormes', 'dorme', 'dormions', 'dormiez', 'dorment'],
  }),
  verb('recevoir', 'recevoir', 'to receive', 'B1', 'irregular', 'avoir', false, {
    present: ['reçois', 'reçois', 'reçoit', 'recevons', 'recevez', 'reçoivent'],
    passeCompose: avoirPasse('reçu'),
    imparfait: ['recevais', 'recevais', 'recevait', 'recevions', 'receviez', 'recevaient'],
    futurSimple: ['recevrai', 'recevras', 'recevra', 'recevrons', 'recevrez', 'recevront'],
    subjunctive: ['reçoive', 'reçoives', 'reçoive', 'recevions', 'receviez', 'reçoivent'],
  }),
  verb('ouvrir', 'ouvrir', 'to open', 'A2', 'irregular', 'avoir', false, {
    present: ['ouvre', 'ouvres', 'ouvre', 'ouvrons', 'ouvrez', 'ouvrent'],
    passeCompose: avoirPasse('ouvert'),
    imparfait: ['ouvrais', 'ouvrais', 'ouvrait', 'ouvrions', 'ouvriez', 'ouvraient'],
    futurSimple: ['ouvrirai', 'ouvriras', 'ouvrira', 'ouvrirons', 'ouvrirez', 'ouvriront'],
    subjunctive: ['ouvre', 'ouvres', 'ouvre', 'ouvrions', 'ouvriez', 'ouvrent'],
  }),
  verb('envoyer', 'envoyer', 'to send', 'B1', 'irregular', 'avoir', false, {
    present: ['envoie', 'envoies', 'envoie', 'envoyons', 'envoyez', 'envoient'],
    passeCompose: avoirPasse('envoyé'),
    imparfait: ['envoyais', 'envoyais', 'envoyait', 'envoyions', 'envoyiez', 'envoyaient'],
    futurSimple: ['enverrai', 'enverras', 'enverra', 'enverrons', 'enverrez', 'enverront'],
    subjunctive: ['envoie', 'envoies', 'envoie', 'envoyions', 'envoyiez', 'envoient'],
  }),
  verb('se-lever', 'se lever', 'to get up', 'A2', 'irregular', 'etre', true, {
    present: ['me lève', 'te lèves', 'se lève', 'nous levons', 'vous levez', 'se lèvent'],
    passeCompose: reflexivePasse('levé'),
    imparfait: ['me levais', 'te levais', 'se levait', 'nous levions', 'vous leviez', 'se levaient'],
    futurSimple: ['me lèverai', 'te lèveras', 'se lèvera', 'nous lèverons', 'vous lèverez', 'se lèveront'],
    subjunctive: ['me lève', 'te lèves', 'se lève', 'nous levions', 'vous leviez', 'se lèvent'],
  }),
  verb('se-coucher', 'se coucher', 'to go to bed', 'A2', 'regular -er', 'etre', true, {
    present: ['me couche', 'te couches', 'se couche', 'nous couchons', 'vous couchez', 'se couchent'],
    passeCompose: reflexivePasse('couché'),
    imparfait: ['me couchais', 'te couchais', 'se couchait', 'nous couchions', 'vous couchiez', 'se couchaient'],
    futurSimple: ['me coucherai', 'te coucheras', 'se couchera', 'nous coucherons', 'vous coucherez', 'se coucheront'],
    subjunctive: ['me couche', 'te couches', 'se couche', 'nous couchions', 'vous couchiez', 'se couchent'],
  }),
  verb('se-preparer', 'se préparer', 'to get ready', 'A2', 'regular -er', 'etre', true, {
    present: ['me prépare', 'te prépares', 'se prépare', 'nous préparons', 'vous préparez', 'se préparent'],
    passeCompose: reflexivePasse('préparé'),
    imparfait: ['me préparais', 'te préparais', 'se préparait', 'nous préparions', 'vous prépariez', 'se préparaient'],
    futurSimple: ['me préparerai', 'te prépareras', 'se préparera', 'nous préparerons', 'vous préparerez', 'se prépareront'],
    subjunctive: ['me prépare', 'te prépares', 'se prépare', 'nous préparions', 'vous prépariez', 'se préparent'],
  }),
)

seedTopics.push(...extraTopics, ...a2B1Topics)
applyDetailedGrammarTopics(seedTopics)
seedQuestions.push(...extraQuestions, ...a2B1QuestionBank, ...enrichedQuestions)
seedQuestions.push(...completeQuestionSets(seedTopics, seedQuestions))
seedDecks.push(...extraDecks)
seedCards.push(...extraCards)

function verb(
  id: string,
  infinitive: string,
  meaning: string,
  level: VerbEntry['level'],
  group: VerbEntry['group'],
  auxiliary: VerbEntry['auxiliary'],
  reflexive: boolean,
  forms: Record<string, string[]>,
): VerbEntry {
  const persons = ['je', 'tu', 'il/elle', 'nous', 'vous', 'ils/elles']
  const conjugations = Object.fromEntries(
    Object.entries(forms).map(([tense, values]) => [
      tense,
      Object.fromEntries(values.map((value, index) => [persons[index], value])),
    ]),
  )

  return {
    id,
    infinitive,
    meaning,
    level,
    group,
    auxiliary,
    reflexive,
    conjugations,
    mastery: Object.fromEntries(Object.keys(forms).map((tense, index) => [tense, 35 + index * 8])),
  }
}

function regularErVerb(
  id: string,
  infinitive: string,
  meaning: string,
  level: VerbEntry['level'],
  auxiliary: VerbEntry['auxiliary'] = 'avoir',
) {
  const stem = infinitive.slice(0, -2)
  const participle = `${stem}é`
  return verb(id, infinitive, meaning, level, 'regular -er', auxiliary, false, {
    present: [`${stem}e`, `${stem}es`, `${stem}e`, `${stem}ons`, `${stem}ez`, `${stem}ent`],
    passeCompose: auxiliary === 'etre' ? etrePasse(participle) : avoirPasse(participle),
    imparfait: [`${stem}ais`, `${stem}ais`, `${stem}ait`, `${stem}ions`, `${stem}iez`, `${stem}aient`],
    futurSimple: futurForms(infinitive),
    subjunctive: [`${stem}e`, `${stem}es`, `${stem}e`, `${stem}ions`, `${stem}iez`, `${stem}ent`],
  })
}

function regularIrVerb(id: string, infinitive: string, meaning: string, level: VerbEntry['level']) {
  const stem = infinitive.slice(0, -2)
  return verb(id, infinitive, meaning, level, 'regular -ir', 'avoir', false, {
    present: [`${stem}is`, `${stem}is`, `${stem}it`, `${stem}issons`, `${stem}issez`, `${stem}issent`],
    passeCompose: avoirPasse(`${stem}i`),
    imparfait: [`${stem}issais`, `${stem}issais`, `${stem}issait`, `${stem}issions`, `${stem}issiez`, `${stem}issaient`],
    futurSimple: futurForms(infinitive),
    subjunctive: [`${stem}isse`, `${stem}isses`, `${stem}isse`, `${stem}issions`, `${stem}issiez`, `${stem}issent`],
  })
}

function regularReVerb(id: string, infinitive: string, meaning: string, level: VerbEntry['level']) {
  const stem = infinitive.slice(0, -2)
  return verb(id, infinitive, meaning, level, 'regular -re', 'avoir', false, {
    present: [`${stem}s`, `${stem}s`, stem, `${stem}ons`, `${stem}ez`, `${stem}ent`],
    passeCompose: avoirPasse(`${stem}u`),
    imparfait: [`${stem}ais`, `${stem}ais`, `${stem}ait`, `${stem}ions`, `${stem}iez`, `${stem}aient`],
    futurSimple: futurForms(`${stem}r`),
    subjunctive: [`${stem}e`, `${stem}es`, `${stem}e`, `${stem}ions`, `${stem}iez`, `${stem}ent`],
  })
}

function avoirPasse(participle: string) {
  return ['ai', 'as', 'a', 'avons', 'avez', 'ont'].map((auxiliary) => `${auxiliary} ${participle}`)
}

function etrePasse(participle: string) {
  return [
    `suis ${participle}(e)`,
    `es ${participle}(e)`,
    `est ${participle}(e)`,
    `sommes ${participle}(e)s`,
    `êtes ${participle}(e)(s)`,
    `sont ${participle}(e)s`,
  ]
}

function reflexivePasse(participle: string) {
  return [
    `me suis ${participle}(e)`,
    `t’es ${participle}(e)`,
    `s’est ${participle}(e)`,
    `nous sommes ${participle}(e)s`,
    `vous êtes ${participle}(e)(s)`,
    `se sont ${participle}(e)s`,
  ]
}

function futurForms(stem: string) {
  return ['ai', 'as', 'a', 'ons', 'ez', 'ont'].map((ending) => `${stem}${ending}`)
}
