/**
 * French Path grammar bank v2
 *
 * 5,000 original, topic-specific questions generated from curated French
 * grammar patterns. The questions are intentionally created locally rather
 * than copied from exercise websites. Every question tests an actual rule:
 * agreement, article choice, tense, word order, pronoun replacement,
 * transformation, register, or meaning in context.
 */
import type { Question } from './types'

type Group =
  | 'subjectPronouns'
  | 'tuVous'
  | 'articlesGender'
  | 'definiteArticles'
  | 'indefiniteArticles'
  | 'contractedArticles'
  | 'pluralNouns'
  | 'adjectiveAgreement'
  | 'adjectivePosition'
  | 'possessives'
  | 'presentEr'
  | 'allerFaire'
  | 'regularIrRe'
  | 'etreAvoir'
  | 'questionForms'
  | 'interrogativeAdverbs'
  | 'answerSi'
  | 'interrogativePronouns'
  | 'presentContinuous'
  | 'imperative'
  | 'futureProche'
  | 'passeCompose'
  | 'passeComposeAvoir'
  | 'passeComposeEtre'
  | 'imparfait'
  | 'pcVsImparfait'
  | 'recentPast'
  | 'plusQueParfait'
  | 'passeSimple'
  | 'objectPronouns'
  | 'pronounPlacement'
  | 'yEn'
  | 'doublePronouns'
  | 'relativeSimple'
  | 'relativeComplex'
  | 'demonstratives'
  | 'indefinites'
  | 'conditionalPoliteness'
  | 'futureSimple'
  | 'irregularFuture'
  | 'siPresentFuture'
  | 'siHypothesis'
  | 'subjunctiveObligation'
  | 'timeChronology'
  | 'timeExpressions'
  | 'prepositions'
  | 'numbersTime'
  | 'placePrepositions'
  | 'negation'
  | 'simpleNegation'
  | 'adverbs'
  | 'gerund'
  | 'reportedSpeech'
  | 'comparative'
  | 'superlative'
  | 'connectors'
  | 'cause'
  | 'nominalisation'
  | 'passive'
  | 'register'
  | 'truncation'
  | 'presentatives'
  | 'demonstrativeAdjectives'
  | 'ilYA'
  | 'cEstIlEst'
  | 'cleft'
  | 'mixed'

type TopicSpec = { id: string; titleEn: string; titleFr: string; group: Group }
type Noun = { noun: string; gender: 'm' | 'f'; plural: string; vowel?: boolean; adjective?: string }
type Adjective = { m: string; f: string; mp: string; fp: string }
type Person = { subject: string; index: number }
type QData = Omit<Question, 'id' | 'topicId'>

const topics: TopicSpec[] = [
  ['subject-pronouns-a1', 'Subject pronouns', 'Pronoms sujets', 'subjectPronouns'],
  ['tu-vous-a1', 'Tu vs vous', 'Tu ou vous', 'tuVous'],
  ['articles-gender', 'Articles and gender', 'Articles et genre', 'articlesGender'],
  ['definite-articles-a1', 'Definite articles', 'Articles définis', 'definiteArticles'],
  ['indefinite-articles-a1', 'Indefinite articles', 'Articles indéfinis', 'indefiniteArticles'],
  ['contracted-articles-a1', 'Contracted articles', 'Articles contractés', 'contractedArticles'],
  ['plural-nouns-a1', 'Plural nouns', 'Noms pluriels', 'pluralNouns'],
  ['adjective-position-a1', 'Adjective position', 'Place des adjectifs', 'adjectivePosition'],
  ['present-aller-faire-a1', 'Aller and faire', 'Aller et faire', 'allerFaire'],
  ['regular-ir-re-a1', 'Regular -ir and -re verbs', 'Verbes rÃ©guliers en -ir et -re', 'regularIrRe'],
  ['adjective-agreement-a1', 'Adjective agreement', 'Accord de l’adjectif', 'adjectiveAgreement'],
  ['present-er', 'Present tense: -er verbs', 'Présent des verbes en -er', 'presentEr'],
  ['etre-avoir', 'Être and avoir', 'Être et avoir', 'etreAvoir'],
  ['questions', 'Question forms', 'Formes de question', 'questionForms'],
  ['passe-compose', 'Passé composé', 'Passé composé', 'passeCompose'],
  ['imparfait', 'Imparfait', 'Imparfait', 'imparfait'],
  ['object-pronouns', 'Object pronouns', 'Pronoms compléments', 'objectPronouns'],
  ['y-en', 'Y and en', 'Y et en', 'yEn'],
  ['relative-pronouns', 'Relative pronouns', 'Pronoms relatifs', 'relativeSimple'],
  ['conditional', 'Conditional', 'Conditionnel', 'conditionalPoliteness'],
  ['subjunctive', 'Subjunctive', 'Subjonctif', 'subjunctiveObligation'],
  ['si-clauses', 'Si clauses', 'Phrases avec si', 'siHypothesis'],
  ['presentatifs-a1', 'Presentatives', 'Présentatifs', 'presentatives'],
  ['interrogative-adverbs-a1', 'Interrogative adverbs', 'Adverbes interrogatifs', 'interrogativeAdverbs'],
  ['question-answer-si-a1', 'Answering negative questions with si', 'Répondre avec si', 'answerSi'],
  ['conditionnel-politesse-a1', 'Polite conditional', 'Conditionnel de politesse', 'conditionalPoliteness'],
  ['present-continuous-a1', 'Être en train de', 'Présent continu', 'presentContinuous'],
  ['time-chronology-a1', 'Time and chronology', 'Temps et chronologie', 'timeChronology'],
  ['c-est-il-est-a1', 'C’est and il est', 'C’est et il est', 'cEstIlEst'],
  ['possessive-adjectives-a1', 'Possessive adjectives', 'Adjectifs possessifs', 'possessives'],
  ['demonstrative-adjectives-a1', 'Ce, cet, cette, ces', 'Ce, cet, cette, ces', 'demonstrativeAdjectives'],
  ['numbers-time-a1', 'Numbers, dates, and time', 'Nombres, dates et heure', 'numbersTime'],
  ['prepositions-place-a1', 'Prepositions of place', 'PrÃ©positions de lieu', 'placePrepositions'],
  ['negation-ne-pas-a1', 'Ne...pas', 'Ne...pas', 'simpleNegation'],
  ['imperative-a1', 'Imperative', 'Impératif', 'imperative'],
  ['futur-proche-a1', 'Near future', 'Futur proche', 'futureProche'],
  ['il-y-a-a1', 'Il y a', 'Il y a', 'ilYA'],
  ['passe-compose-a1', 'Passé composé A1', 'Passé composé A1', 'passeCompose'],
  ['truncation-a2', 'Truncation in informal French', 'Troncation', 'truncation'],
  ['negation-varied-a2', 'Varied negation', 'Négation variée', 'negation'],
  ['prepositions-a2', 'Prepositions', 'Prépositions', 'prepositions'],
  ['relative-qui-que-ou-a2', 'Qui, que and où', 'Qui, que et où', 'relativeSimple'],
  ['focus-cleft-a2', 'Cleft focus', 'Mise en relief', 'cleft'],
  ['pronoun-placement-a2', 'Pronoun placement', 'Place des pronoms', 'pronounPlacement'],
  ['y-en-intro-a2', 'Intro to y and en', 'Introduction à y et en', 'yEn'],
  ['indefinites-a2', 'Indefinites', 'Indéfinis', 'indefinites'],
  ['interrogative-pronouns-a2', 'Interrogative pronouns', 'Pronoms interrogatifs', 'interrogativePronouns'],
  ['demonstrative-pronouns-a2', 'Demonstrative pronouns', 'Pronoms démonstratifs', 'demonstratives'],
  ['adverbs-a2', 'Adverbs', 'Adverbes', 'adverbs'],
  ['gerondif-intro-a2', 'Gérondif introduction', 'Introduction au gérondif', 'gerund'],
  ['passe-compose-avoir-a2', 'Passé composé with avoir', 'Passé composé avec avoir', 'passeComposeAvoir'],
  ['passe-compose-etre-a2', 'Passé composé with être', 'Passé composé avec être', 'passeComposeEtre'],
  ['pc-imparfait-a2', 'Passé composé vs imparfait', 'Passé composé ou imparfait', 'pcVsImparfait'],
  ['time-expressions-a2', 'Time expressions', 'Expressions de temps', 'timeExpressions'],
  ['passe-recent-a2', 'Recent past', 'Passé récent', 'recentPast'],
  ['future-simple-intro-a2', 'Future simple', 'Futur simple', 'futureSimple'],
  ['si-present-future-a2', 'Si + present + future', 'Si + présent + futur', 'siPresentFuture'],
  ['obligation-expressions-a2', 'Obligation expressions', 'Expressions de l’obligation', 'subjunctiveObligation'],
  ['conditional-politeness-a2', 'Polite conditional', 'Conditionnel de politesse', 'conditionalPoliteness'],
  ['reported-speech-a2', 'Reported speech', 'Discours rapporté', 'reportedSpeech'],
  ['comparative-a2', 'Comparative', 'Comparatif', 'comparative'],
  ['superlative-a2', 'Superlative', 'Superlatif', 'superlative'],
  ['connectors-a2', 'Connectors', 'Connecteurs', 'connectors'],
  ['modes-register-a2', 'Modes and register', 'Modes et registres', 'register'],
  ['articles-adjectives-b1', 'Articles and adjectives B1', 'Articles et adjectifs B1', 'adjectiveAgreement'],
  ['nominalisation-b1', 'Nominalisation', 'Nominalisation', 'nominalisation'],
  ['nominalization-b1', 'Nominalization', 'Nominalisation', 'nominalisation'],
  ['truncation-b1', 'Truncation B1', 'Troncation B1', 'truncation'],
  ['negation-b1', 'Negation B1', 'Négation B1', 'negation'],
  ['prepositions-b1', 'Prepositions B1', 'Prépositions B1', 'prepositions'],
  ['relative-simple-b1', 'Simple relatives B1', 'Relatives simples B1', 'relativeSimple'],
  ['relative-complex-b1', 'Complex relatives', 'Relatives complexes', 'relativeComplex'],
  ['focus-cleft-b1', 'Cleft focus B1', 'Mise en relief B1', 'cleft'],
  ['object-pronouns-b1', 'Object pronouns B1', 'Pronoms compléments B1', 'objectPronouns'],
  ['y-en-b1', 'Y and en B1', 'Y et en B1', 'yEn'],
  ['double-pronouns-b1', 'Double pronouns', 'Doubles pronoms', 'doublePronouns'],
  ['indefinites-b1', 'Indefinites B1', 'Indéfinis B1', 'indefinites'],
  ['interrogative-pronouns-b1', 'Interrogative pronouns B1', 'Pronoms interrogatifs B1', 'interrogativePronouns'],
  ['demonstrative-pronouns-b1', 'Demonstrative pronouns B1', 'Pronoms démonstratifs B1', 'demonstratives'],
  ['adverbs-modalization-b1', 'Adverbs and modalisation', 'Adverbes et modalisation', 'adverbs'],
  ['gerund-b1', 'Gérondif B1', 'Gérondif B1', 'gerund'],
  ['plus-que-parfait-b1', 'Plus-que-parfait', 'Plus-que-parfait', 'plusQueParfait'],
  ['passe-simple-b1', 'Passé simple', 'Passé simple', 'passeSimple'],
  ['passive-b1', 'Passive voice', 'Voix passive', 'passive'],
  ['time-connectors-b1', 'Time connectors', 'Connecteurs temporels', 'timeExpressions'],
  ['future-conditional-b1', 'Future and conditional B1', 'Futur et conditionnel B1', 'futureSimple'],
  ['hypothesis-obligation-b1', 'Hypothesis and obligation', 'Hypothèse et obligation', 'siHypothesis'],
  ['opinion-argument-b1', 'Opinion and argument', 'Opinion et argumentation', 'connectors'],
  ['futur-simple-irregular-b1', 'Irregular future', 'Futur irrégulier', 'irregularFuture'],
  ['cause-expressions-b1', 'Cause expressions', 'Expressions de la cause', 'cause'],
  ['t1-d0', 'Totem A1 starter grammar', 'Grammaire de départ', 'presentatives'],
  ['t1-d1', 'Identity and greetings', 'Identité et salutations', 'etreAvoir'],
  ['t1-d2', 'Daily actions', 'Actions quotidiennes', 'presentEr'],
  ['t1-d3', 'Family and description', 'Famille et description', 'adjectiveAgreement'],
  ['t1-d4', 'Places and directions', 'Lieux et directions', 'prepositions'],
  ['t1-d5', 'Food and quantities', 'Nourriture et quantités', 'indefiniteArticles'],
  ['t1-d6', 'Past events starter', 'Événements passés', 'passeCompose'],
  ['t2-d1', 'A2 review grammar', 'Révision A2', 'mixed'],
  ['t2-d2', 'A2 questions', 'Questions A2', 'questionForms'],
  ['t2-d3', 'A2 narration', 'Récit A2', 'pcVsImparfait'],
  ['t2-d4', 'A2 pronouns', 'Pronoms A2', 'pronounPlacement'],
  ['t2-d5', 'A2 time', 'Temps A2', 'timeExpressions'],
  ['t2-d6', 'A2 comparison', 'Comparaison A2', 'comparative'],
  ['t2-d7', 'A2 connectors', 'Connecteurs A2', 'connectors'],
  ['t2-d8', 'A2 final grammar', 'Synthèse A2', 'mixed'],
  ['t3-d1', 'B1 opinions', 'Opinions B1', 'connectors'],
  ['t3-d2', 'B1 complex pronouns', 'Pronoms complexes B1', 'doublePronouns'],
  ['t3-d3', 'B1 hypothesis', 'Hypothèse B1', 'siHypothesis'],
  ['t3-d4', 'B1 passive and formal style', 'Passif et style formel', 'passive'],
  ['t3-d5', 'B1 relatives', 'Relatives B1', 'relativeComplex'],
  ['t3-d6', 'B1 reported speech', 'Discours rapporté B1', 'reportedSpeech'],
  ['t3-d7', 'B1 nuance', 'Nuance B1', 'adverbs'],
  ['t3-d8', 'B1 synthesis', 'Synthèse B1', 'mixed'],
].map(([id, titleEn, titleFr, group]) => ({ id, titleEn, titleFr, group } as TopicSpec))

const nouns: Noun[] = [
  { noun: 'livre', gender: 'm', plural: 'livres' }, { noun: 'table', gender: 'f', plural: 'tables' },
  { noun: 'problème', gender: 'm', plural: 'problèmes' }, { noun: 'solution', gender: 'f', plural: 'solutions' },
  { noun: 'voiture', gender: 'f', plural: 'voitures' }, { noun: 'bureau', gender: 'm', plural: 'bureaux' },
  { noun: 'journal', gender: 'm', plural: 'journaux' }, { noun: 'adresse', gender: 'f', plural: 'adresses', vowel: true },
  { noun: 'hôtel', gender: 'm', plural: 'hôtels', vowel: true }, { noun: 'équipe', gender: 'f', plural: 'équipes', vowel: true },
  { noun: 'appartement', gender: 'm', plural: 'appartements', vowel: true }, { noun: 'expérience', gender: 'f', plural: 'expériences', vowel: true },
  { noun: 'laboratoire', gender: 'm', plural: 'laboratoires' }, { noun: 'réunion', gender: 'f', plural: 'réunions' },
  { noun: 'château', gender: 'm', plural: 'châteaux' }, { noun: 'animal', gender: 'm', plural: 'animaux' },
  { noun: 'prix', gender: 'm', plural: 'prix' }, { noun: 'nez', gender: 'm', plural: 'nez' },
  { noun: 'soupe', gender: 'f', plural: 'soupes' }, { noun: 'fromage', gender: 'm', plural: 'fromages' },
  { noun: 'idée', gender: 'f', plural: 'idées', vowel: true }, { noun: 'exercice', gender: 'm', plural: 'exercices', vowel: true },
  { noun: 'question', gender: 'f', plural: 'questions' }, { noun: 'message', gender: 'm', plural: 'messages' },
]

const adjectives: Adjective[] = [
  { m: 'petit', f: 'petite', mp: 'petits', fp: 'petites' }, { m: 'sérieux', f: 'sérieuse', mp: 'sérieux', fp: 'sérieuses' },
  { m: 'nouveau', f: 'nouvelle', mp: 'nouveaux', fp: 'nouvelles' }, { m: 'beau', f: 'belle', mp: 'beaux', fp: 'belles' },
  { m: 'actif', f: 'active', mp: 'actifs', fp: 'actives' }, { m: 'heureux', f: 'heureuse', mp: 'heureux', fp: 'heureuses' },
  { m: 'prêt', f: 'prête', mp: 'prêts', fp: 'prêtes' }, { m: 'intéressant', f: 'intéressante', mp: 'intéressants', fp: 'intéressantes' },
  { m: 'complet', f: 'complète', mp: 'complets', fp: 'complètes' }, { m: 'ancien', f: 'ancienne', mp: 'anciens', fp: 'anciennes' },
]

const people: Person[] = [
  { subject: 'je', index: 0 }, { subject: 'tu', index: 1 }, { subject: 'il', index: 2 },
  { subject: 'nous', index: 3 }, { subject: 'vous', index: 4 }, { subject: 'elles', index: 5 },
]

const pronounRows = [
  ['___ habitons dans le meme quartier.', 'Nous', ['Je', 'Tu', 'Ils']],
  ['___ es tres organisee aujourd hui.', 'Tu', ['Vous', 'Elles', 'Nous']],
  ['___ arrivent a midi.', 'Ils', ['Il', 'Nous', 'Elle']],
  ['___ travaille a la reception.', 'Elle', ['Ils', 'Vous', 'Nous']],
  ['___ suis pret a partir.', 'Je', ['Tu', 'Nous', 'Ils']],
  ['___ prenez le train de huit heures.', 'Vous', ['Tu', 'Nous', 'Elle']],
] as const

const tuVousRows = [
  ['You are speaking to your manager in a meeting.', 'Vous avez un moment ?', ['Tu as un moment ?', 'Vous as un moment ?', 'Tu avez un moment ?']],
  ['You are greeting your close friend Samir.', 'Tu viens ce soir, Samir ?', ['Vous venez ce soir, Samir ?', 'Tu venez ce soir, Samir ?', 'Vous viens ce soir, Samir ?']],
  ['You are talking to two classmates.', 'Vous etes prets pour le test ?', ['Tu es prets pour le test ?', 'Vous es prets pour le test ?', 'Tu etes pret pour le test ?']],
  ['You are asking one unknown customer politely.', 'Vous cherchez quelque chose ?', ['Tu cherches quelque chose ?', 'Vous cherches quelque chose ?', 'Tu cherchez quelque chose ?']],
] as const

const erVerbs = [
  ['parler', 'parl', 'français'], ['travailler', 'travaill', 'au laboratoire'], ['regarder', 'regard', 'un documentaire'],
  ['préparer', 'prépar', 'le dîner'], ['visiter', 'visit', 'le musée'], ['écouter', 'écout', 'la radio'],
  ['habiter', 'habit', 'à Massy'], ['chercher', 'cherch', 'une solution'], ['étudier', 'étudi', 'la grammaire'],
  ['aimer', 'aim', 'les voyages'], ['arriver', 'arriv', 'à huit heures'], ['demander', 'demand', 'un renseignement'],
] as const
const erEndings = ['e', 'es', 'e', 'ons', 'ez', 'ent']

const adjectivePositionRows = [
  ['une voiture rouge', ['une rouge voiture', 'une voiture rouges', 'rouge une voiture'], 'Most color adjectives come after the noun.', 'La plupart des adjectifs de couleur se placent apres le nom.'],
  ['un petit appartement', ['un appartement petit', 'un petits appartement', 'petit un appartement'], 'Short common adjectives such as petit usually come before the noun.', 'Les adjectifs courts frequents comme petit se placent souvent avant le nom.'],
  ['une belle journee', ['une journee belle', 'une belles journee', 'belle une journee'], 'Beau / belle belongs to the common group often placed before the noun.', 'Beau / belle fait partie du groupe frequent souvent place avant le nom.'],
  ['un film interessant', ['un interessant film', 'un films interessant', 'interessant un film'], 'Most longer descriptive adjectives come after the noun.', 'La plupart des adjectifs descriptifs plus longs suivent le nom.'],
] as const

const allerFaireRows = [
  ['Nous ___ du velo le dimanche. (faire)', 'faisons', ['faites', 'font', 'faissons']],
  ['Je ___ au bureau en metro. (aller)', 'vais', ['vas', 'va', 'aller']],
  ['Vous ___ souvent les courses le samedi. (faire)', 'faites', ['faisons', 'font', 'faire']],
  ['Ils ___ chez le dentiste apres le travail. (aller)', 'vont', ['allez', 'va', 'allent']],
] as const

const regularIrReRows = [
  ['Tu ___ le bus a quelle heure ? (attendre)', 'attends', ['attend', 'attendez', 'attentes']],
  ['Nous ___ toujours le dessert ensemble. (finir)', 'finissons', ['finons', 'finissez', 'finitions']],
  ['Elle ___ ses devoirs avant le diner. (choisir)', 'choisit', ['choisitons', 'choisis', 'choisissons']],
  ['Vous ___ la porte en silence. (vendre)', 'vendez', ['vendons', 'vendes', 'vendent']],
] as const

const demonstrativeRows = [
  ['___ homme travaille avec ma soeur.', 'cet', ['ce', 'cette', 'ces']],
  ['___ valise est beaucoup trop lourde.', 'cette', ['ce', 'cet', 'ces']],
  ['___ dossiers sont deja signes.', 'ces', ['ce', 'cet', 'cette']],
  ['___ livre appartient au professeur.', 'ce', ['cet', 'cette', 'ces']],
] as const

const numbersTimeRows = [
  ['Choose the correct sentence for 7:15.', 'Il est sept heures et quart.', ['Il a sept heures et quart.', 'Nous sommes sept heures et quart.', 'Il est sept ans et quart.']],
  ['Choose the correct date expression.', 'le premier mai', ['la premier mai', 'les premier mai', 'un premier mai']],
  ['Choose the correct sentence for 12:30.', 'Il est midi et demi.', ['Il est douze heures demie.', 'Il a midi et demi.', 'Nous sommes midi et demi.']],
  ['Choose the natural way to say the day.', 'Nous sommes lundi.', ['Il est lundi heures.', 'C est lundi heure.', 'Nous avons lundi.']],
] as const

const placePrepositionRows = [
  ['Le chat dort ___ la chaise.', 'sous', ['sur', 'devant', 'avec']],
  ['La pharmacie est ___ de la banque.', 'a cote', ['sur', 'avec', 'pendant']],
  ['Les enfants jouent ___ le jardin.', 'dans', ['sur', 'a cote', 'sous']],
  ['La boulangerie est ___ la poste.', 'en face de', ['dans', 'avec', 'sans']],
] as const

const simpleNegationRows = [
  ['Je ___ comprends ___ cette consigne.', 'ne / pas', ['pas / ne', 'n / pas de', 'ne / rien']],
  ['Elle ___ aime ___ le cafe.', "n' / pas", ['ne / pas', "n' / plus", 'pas / ne']],
  ['Nous ___ parlons ___ pendant le film.', 'ne / pas', ['n / pas', 'ne / jamais', 'pas / ne']],
  ['Tu ___ oublies ___ ton badge.', "n' / jamais", ['ne / pas', "n' / pas", 'pas / n']],
] as const

const ilYARows = [
  ['Choose the sentence that means “There are three mistakes in this text.”', 'Il y a trois erreurs dans ce texte.', ['Il est trois erreurs dans ce texte.', 'Il a trois erreurs dans ce texte.', 'Y a il trois erreurs dans ce texte.']],
  ['Choose the correct negative form.', "Il n y a pas de train apres minuit.", ['Il ne y a pas train apres minuit.', 'Il y n a pas de train apres minuit.', 'Il n a y pas de train apres minuit.']],
  ['Complete: ___ un supermarche pres de chez nous.', 'Il y a', ['C est', 'Il est', 'Voila']],
  ['Choose the correct question.', 'Est-ce qu il y a une pharmacie ici ?', ['Il y a est-ce qu une pharmacie ici ?', 'Y a-t-il est-ce qu une pharmacie ici ?', 'Est-ce qu il a une pharmacie ici ?']],
] as const

const contexts = [
  'At work', 'During a French class', 'While planning a trip', 'In a formal email', 'At a restaurant',
  'During a phone call', 'At the doctor’s office', 'While talking to a colleague', 'At home', 'At the train station',
]

function pick<T>(items: readonly T[], index: number): T { return items[((index % items.length) + items.length) % items.length] }
function rotate<T>(items: readonly T[], index: number): T[] { const clean = [...new Set(items)]; const shift = ((index % clean.length) + clean.length) % clean.length; return [...clean.slice(shift), ...clean.slice(0, shift)] }
function article(noun: Noun, definite = true) { if (definite) return noun.vowel ? "l'" : noun.gender === 'm' ? 'le' : 'la'; return noun.gender === 'm' ? 'un' : 'une' }
function joinArticle(value: string, noun: string) { return value.endsWith("'") || value.endsWith('’') ? `${value}${noun}` : `${value} ${noun}` }
function cap(value: string) { return value.charAt(0).toUpperCase() + value.slice(1) }
function fourChoices(choices: string[], answer: string) {
  const clean = [...new Set([answer, ...choices])].filter(Boolean)
  return clean.slice(0, 4)
}
function mc(promptEn: string, promptFr: string, choices: string[], answer: string, explanationEn: string, explanationFr: string, variant = 0): QData {
  return { type: 'multiple-choice', promptEn, promptFr, choices: rotate(fourChoices(choices, answer), variant), correctAnswer: answer, explanationEn, explanationFr }
}
function sentenceChoice(correct: string, wrong: string[], explanationEn: string, explanationFr: string, variant: number, promptEn = 'Choose the grammatically correct sentence.', promptFr = 'Choisissez la phrase grammaticalement correcte.'): QData {
  return mc(promptEn, promptFr, [correct, ...wrong], correct, explanationEn, explanationFr, variant)
}
function addPrefix(data: QData, spec: TopicSpec, variant: number): QData {
  const prefix = `${pick(contexts, variant)} — `
  const prefixFr = `${pick(['Au travail', 'Pendant un cours de français', 'En préparant un voyage', 'Dans un e-mail formel', 'Au restaurant', 'Pendant un appel', 'Chez le médecin', 'Avec un collègue', 'À la maison', 'À la gare'], variant)} — `
  return { ...data, promptEn: `${prefix}${data.promptEn}`, promptFr: `${prefixFr}${data.promptFr}`, explanationEn: `${data.explanationEn} Focus: ${spec.titleEn}.`, explanationFr: `${data.explanationFr} Point ciblé : ${spec.titleFr}.` }
}

function subjectPronouns(variant: number): QData {
  const [sentence, answer, wrong] = pick(pronounRows, variant)
  return mc(`Choose the correct subject pronoun: ${sentence}`, `Choisissez le bon pronom sujet : ${sentence}`, [answer, ...wrong], answer, 'Match the pronoun to the verb form and the meaning of the sentence.', 'Associez le pronom a la forme verbale et au sens de la phrase.', variant)
}

function tuVous(variant: number): QData {
  const [context, answer, wrong] = pick(tuVousRows, variant)
  return mc(`Choose the most appropriate sentence. ${context}`, `Choisissez la phrase la plus adaptee. ${context}`, [answer, ...wrong], answer, 'Use tu for one person in an informal situation, and vous for formal singular or any plural addressee.', 'On utilise tu avec une personne dans une situation informelle, et vous au singulier formel ou pour le pluriel.', variant)
}

function articlesGender(variant: number): QData {
  const noun = pick(nouns, variant * 5 + 1); const a = article(noun); const indefinite = article(noun, false); const definitePhrase = joinArticle(a, noun.noun); const indefinitePhrase = joinArticle(indefinite, noun.noun)
  switch (variant % 6) {
    case 0: return mc(`Complete: ___ ${noun.noun} est sur la table.`, `Complétez : ___ ${noun.noun} est sur la table.`, ['le', 'la', "l'", 'les'], a, `${cap(noun.noun)} is ${noun.gender === 'm' ? 'masculine' : 'feminine'} singular${noun.vowel ? ' and begins with a vowel sound, so elision is required' : ''}.`, `${cap(noun.noun)} est ${noun.gender === 'm' ? 'masculin' : 'féminin'} singulier${noun.vowel ? ' et commence par une voyelle, donc il faut élider' : ''}.`, variant)
    case 1: return mc(`Which phrase correctly introduces “${noun.noun}” for the first time?`, `Quel groupe présente correctement « ${noun.noun} » pour la première fois ?`, [indefinitePhrase, `${noun.gender === 'm' ? 'une' : 'un'} ${noun.noun}`, `des ${noun.noun}`, definitePhrase], indefinitePhrase, `A noun introduced for the first time normally takes un or une, according to its gender.`, `Un nom présenté pour la première fois prend normalement un ou une selon son genre.`, variant)
    case 2: { const feminine = pick(nouns.filter((item) => item.gender === 'f' && !item.vowel), variant); const masculine = pick(nouns.filter((item) => item.gender === 'm' && !item.vowel), variant + 3); return mc('Which noun phrase is feminine singular?', 'Quel groupe nominal est féminin singulier ?', [`la ${feminine.noun}`, `le ${masculine.noun}`, `les ${feminine.plural}`, `un ${masculine.noun}`], `la ${feminine.noun}`, 'The feminine singular definite article is la.', 'L’article défini féminin singulier est la.', variant) }
    case 3: return sentenceChoice(`Je cherche ${indefinitePhrase}.`, [`Je cherche ${noun.gender === 'm' ? 'une' : 'un'} ${noun.noun}.`, `Je cherche des ${noun.noun}.`, `Je cherche de ${noun.noun}.`], `${indefinite} agrees with the gender of ${noun.noun}.`, `${indefinite} s’accorde avec le genre de ${noun.noun}.`, variant)
    case 4: { const vowelNoun = pick(nouns.filter((item) => item.vowel), variant); return mc(`Choose the correct definite form for “${vowelNoun.noun}”.`, `Choisissez la forme définie correcte pour « ${vowelNoun.noun} ».`, [`l'${vowelNoun.noun}`, `le ${vowelNoun.noun}`, `la ${vowelNoun.noun}`, `les ${vowelNoun.noun}`], `l'${vowelNoun.noun}`, 'Before a vowel sound, le and la become l’.', 'Devant une voyelle, le et la deviennent l’.', variant) }
    default: { const correct = `${cap(definitePhrase)} est important${noun.gender === 'f' ? 'e' : ''}.`; return sentenceChoice(correct, [`${cap(joinArticle(noun.gender === 'm' ? 'la' : 'le', noun.noun))} est important${noun.gender === 'f' ? 'e' : ''}.`, `${cap(definitePhrase)} est importants.`, `Les ${noun.noun} est important.`], 'The article and adjective must agree with the noun.', 'L’article et l’adjectif doivent s’accorder avec le nom.', variant) }
  }
}

function definiteArticles(variant: number): QData {
  const noun = pick(nouns, variant * 3); const a = article(noun); const definitePhrase = joinArticle(a, noun.noun)
  const plural = noun.plural
  switch (variant % 5) {
    case 0: return mc(`Complete the general statement: ___ ${plural} coûtent parfois cher.`, `Complétez l’énoncé général : ___ ${plural} coûtent parfois cher.`, ['Les', 'Des', 'De', 'Un'], 'Les', 'A general statement about a plural category uses les.', 'Un énoncé général sur une catégorie au pluriel utilise les.', variant)
    case 1: return mc(`Complete: J’aime ___ ${noun.noun}.`, `Complétez : J’aime ___ ${noun.noun}.`, [a, article(noun, false), 'du', 'de'], a, 'After aimer, adorer, or préférer, use the definite article for a general preference.', 'Après aimer, adorer ou préférer, on utilise l’article défini pour un goût général.', variant)
    case 2: return sentenceChoice(`Nous visitons ${definitePhrase} dont tu m’as parlé.`, [`Nous visitons ${joinArticle(article(noun, false), noun.noun)} dont tu m’as parlé.`, `Nous visitons de ${noun.noun} dont tu m’as parlé.`, `Nous visitons les ${noun.noun} dont tu m’as parlé.`], 'The noun is specific because it has already been identified.', 'Le nom est précis parce qu’il a déjà été identifié.', variant)
    case 3: return mc(`Complete: ___ ${noun.noun} de mon collègue est ${noun.gender === 'm' ? 'nouveau' : 'nouvelle'}.`, `Complétez : ___ ${noun.noun} de mon collègue est ${noun.gender === 'm' ? 'nouveau' : 'nouvelle'}.`, [cap(a), cap(article(noun, false)), 'Des', 'Du'], cap(a), 'The possessive complement makes the noun specific, so use the definite article.', 'Le complément possessif rend le nom précis, donc on utilise l’article défini.', variant)
    default: return mc('Which sentence expresses a general preference correctly?', 'Quelle phrase exprime correctement un goût général ?', [`Elle adore ${definitePhrase}.`, `Elle adore de ${noun.noun}.`, `Elle adore ${joinArticle(article(noun, false), noun.noun)}.`, `Elle adore du ${noun.noun}.`], `Elle adore ${definitePhrase}.`, 'General likes use le, la, l’, or les.', 'Les goûts généraux prennent le, la, l’ ou les.', variant)
  }
}

function indefiniteArticles(variant: number): QData {
  const noun = pick(nouns.filter((item) => !item.vowel), variant * 7); const ind = article(noun, false)
  switch (variant % 5) {
    case 0: return mc(`Complete: Dans la pièce, il y a ___ ${noun.noun}.`, `Complétez : Dans la pièce, il y a ___ ${noun.noun}.`, [ind, article(noun), 'de', 'des'], ind, 'Use un or une to introduce one countable object.', 'On utilise un ou une pour présenter un objet comptable.', variant)
    case 1: return mc(`Make the sentence negative: J’ai ${ind} ${noun.noun}. → Je n’ai pas ___ ${noun.noun}.`, `Mettez à la négation : J’ai ${ind} ${noun.noun}. → Je n’ai pas ___ ${noun.noun}.`, ['de', ind, article(noun), 'des'], 'de', 'After a negation, un, une, and des usually become de or d’.', 'Après la négation, un, une et des deviennent généralement de ou d’.', variant)
    case 2: return sentenceChoice(`Elle cherche ${ind} ${noun.noun} pour son projet.`, [`Elle cherche ${article(noun)} ${noun.noun} pour son projet.`, `Elle cherche de ${noun.noun} pour son projet.`, `Elle cherche des ${noun.noun} pour son projet.`], 'The object is mentioned for the first time and is singular.', 'L’objet est mentionné pour la première fois et il est singulier.', variant)
    case 3: return mc('Choose the correct plural introduction.', 'Choisissez la bonne présentation au pluriel.', [`J’ai acheté des ${noun.plural}.`, `J’ai acheté les ${noun.plural}.`, `J’ai acheté de ${noun.plural}.`, `J’ai acheté un ${noun.plural}.`], `J’ai acheté des ${noun.plural}.`, 'Des introduces an unspecified plural quantity.', 'Des présente une quantité plurielle non précisée.', variant)
    default: return mc(`Which sentence correctly introduces a new ${noun.noun}?`, `Quelle phrase présente correctement un nouveau ${noun.noun} ?`, [`Voici ${ind} ${noun.noun}.`, `Voici ${article(noun)} ${noun.noun}.`, `Voici de ${noun.noun}.`, `Voici des ${noun.noun}.`], `Voici ${ind} ${noun.noun}.`, 'A new singular countable noun takes un or une.', 'Un nom comptable singulier nouveau prend un ou une.', variant)
  }
}

function contractedArticles(variant: number): QData {
  const rows = [
    ['aller', 'marché', 'au', 'à le'], ['parler', 'directeur', 'au', 'à le'], ['revenir', 'cinéma', 'du', 'de le'],
    ['penser', 'vacances', 'aux', 'à les'], ['venir', 'Pays-Bas', 'des', 'de les'], ['jouer', 'football', 'au', 'à le'],
    ['sortir', 'bureau', 'du', 'de le'], ['répondre', 'questions', 'aux', 'à les'],
  ] as const
  const [verb, complement, answer, wrong] = pick(rows, variant)
  const before = ['au', 'aux'].includes(answer) ? 'à' : 'de'
  return mc(`Complete: ${cap(verb)} ${before} + ${complement} → ${answer === 'au' || answer === 'du' ? '___' : '___'} ${complement}.`, `Complétez : ${cap(verb)} ${before} + ${complement} → ___ ${complement}.`, [answer, wrong, before, answer === 'au' ? 'du' : answer === 'du' ? 'au' : answer === 'aux' ? 'des' : 'aux'], answer, `${before} + ${answer === 'au' || answer === 'du' ? 'le' : 'les'} contracts to ${answer}.`, `${before} + ${answer === 'au' || answer === 'du' ? 'le' : 'les'} se contracte en ${answer}.`, variant)
}

function pluralNouns(variant: number): QData {
  const noun = pick(nouns, variant * 5)
  const wrongs = [`${noun.noun}x`, `${noun.noun}es`, `${noun.noun}aux`, noun.noun, `${noun.noun}s`]
  switch (variant % 4) {
    case 0: return mc(`Choose the plural of “un ${noun.noun}”.`, `Choisissez le pluriel de « un ${noun.noun} ».`, [noun.plural, ...wrongs], noun.plural, `The correct plural is ${noun.plural}.`, `Le pluriel correct est ${noun.plural}.`, variant)
    case 1: return sentenceChoice(`Il y a plusieurs ${noun.plural} dans la salle.`, [`Il y a plusieurs ${noun.noun} dans la salle.`, `Il y a plusieurs ${noun.noun}x dans la salle.`, `Il y a plusieurs ${noun.noun}es dans la salle.`, `Il y a plusieurs ${noun.noun}s dans la salle.`, `Il y a plusieurs ${noun.noun}aux dans la salle.`], `After plusieurs, use the plural form: ${noun.plural}.`, `Après plusieurs, on utilise le pluriel : ${noun.plural}.`, variant)
    case 2: return mc(`Complete: un ${noun.noun} → des ___.`, `Complétez : un ${noun.noun} → des ___.`, [noun.plural, ...wrongs], noun.plural, `Plural formation must follow the noun pattern.`, `La formation du pluriel dépend du modèle du nom.`, variant)
    default: return mc('Which singular–plural pair is correct?', 'Quel couple singulier–pluriel est correct ?', [`un ${noun.noun} → des ${noun.plural}`, `un ${noun.noun} → des ${noun.noun}x`, `un ${noun.noun} → des ${noun.noun}es`, `un ${noun.noun} → des ${noun.noun}`], `un ${noun.noun} → des ${noun.plural}`, 'The plural form must be written correctly.', 'Le pluriel doit être correctement écrit.', variant)
  }
}

function adjectiveAgreement(variant: number): QData {
  const adjective = pick(adjectives, variant * 3); const form = pick(['m', 'f', 'mp', 'fp'] as const, variant)
  const subject = form === 'm' ? 'Le collègue' : form === 'f' ? 'La collègue' : form === 'mp' ? 'Les collègues' : 'Les étudiantes'
  const verb = form.endsWith('p') ? 'sont' : 'est'
  const answer = adjective[form]
  const extraTrap = `${adjective.m}${form.endsWith('p') ? 'es' : 's'}`
  return mc(`Complete: ${subject} ${verb} ___ .`, `Complétez : ${subject} ${verb} ___ .`, [answer, adjective.m, adjective.f, adjective.mp, adjective.fp, extraTrap], answer, `The adjective must agree with ${subject.toLowerCase()}: ${answer}.`, `L’adjectif s’accorde avec ${subject.toLowerCase()} : ${answer}.`, variant)
}

function adjectivePosition(variant: number): QData {
  const [answer, wrong, explanationEn, explanationFr] = pick(adjectivePositionRows, variant)
  return sentenceChoice(answer, [...wrong], explanationEn, explanationFr, variant, 'Choose the natural noun phrase.', 'Choisissez le groupe nominal naturel.')
}

function possessives(variant: number): QData {
  const rows = [
    ['Marie', 'voiture', 'f', 'sa'], ['Paul', 'livre', 'm', 'son'], ['nous', 'amis', 'p', 'nos'], ['vous', 'bureau', 'm', 'votre'],
    ['elles', 'questions', 'p', 'leurs'], ['je', 'adresse', 'vowel', 'mon'], ['tu', 'idée', 'vowel', 'ton'], ['il', 'équipe', 'vowel', 'son'],
  ] as const
  const [owner, noun, , answer] = pick(rows, variant)
  return mc(`Complete: ${owner === 'je' ? 'Je donne' : owner === 'tu' ? 'Tu donnes' : 'Voici'} ___ ${noun}.`, `Complétez : ${owner === 'je' ? 'Je donne' : owner === 'tu' ? 'Tu donnes' : 'Voici'} ___ ${noun}.`, [answer, 'ma', 'mes', 'leur'], answer, `The possessive adjective depends on the possessed noun. Before a feminine vowel sound, use mon/ton/son.`, `L’adjectif possessif dépend du nom possédé. Devant une voyelle féminine, on utilise mon/ton/son.`, variant)
}

function presentEr(variant: number): QData {
  const [infinitive, stem, complement] = pick(erVerbs, variant * 5); const person = pick(people, variant * 3); const answer = `${stem}${erEndings[person.index]}`
  return mc(`Complete in the present tense: ${cap(person.subject)} ___ ${complement}. (${infinitive})`, `Complétez au présent : ${cap(person.subject)} ___ ${complement}. (${infinitive})`, [`${stem}e`, `${stem}es`, `${stem}ons`, `${stem}ez`, `${stem}ent`], answer, `With ${person.subject}, ${infinitive} takes the ending -${erEndings[person.index]}.`, `Avec ${person.subject}, ${infinitive} prend la terminaison -${erEndings[person.index]}.`, variant)
}

function allerFaire(variant: number): QData {
  const [sentence, answer, wrong] = pick(allerFaireRows, variant)
  return mc(`Complete in the present tense: ${sentence}`, `ComplÃ©tez au prÃ©sent : ${sentence}`, [answer, ...wrong], answer, 'Aller and faire are irregular high-frequency verbs.', 'Aller et faire sont des verbes irrÃ©guliers trÃ¨s frÃ©quents.', variant)
}

function regularIrRe(variant: number): QData {
  const [sentence, answer, wrong] = pick(regularIrReRows, variant)
  return mc(`Complete in the present tense: ${sentence}`, `ComplÃ©tez au prÃ©sent : ${sentence}`, [answer, ...wrong], answer, 'Regular -ir and -re verbs use stable patterns, but not the same endings as -er verbs.', 'Les verbes rÃ©guliers en -ir et en -re suivent des modÃ¨les stables, mais pas les mÃªmes terminaisons que les verbes en -er.', variant)
}

function etreAvoir(variant: number): QData {
  const rows = [
    ['Je', 'suis', 'fatiguée après le voyage', ['ai', 'es', 'sommes']], ['Tu', 'as', 'raison de vérifier', ['es', 'a', 'suis']],
    ['Nous', 'avons', 'besoin de temps', ['sommes', 'êtes', 'ont']], ['Elles', 'sont', 'en retard', ['ont', 'êtes', 'sommes']],
    ['Vous', 'avez', 'un rendez-vous', ['êtes', 'avons', 'ont']], ['Il', 'est', 'prêt à commencer', ['a', 'es', 'sont']],
  ] as const
  const [subject, answer, rest, wrong] = pick(rows, variant)
  return mc(`Complete: ${subject} ___ ${rest}.`, `Complétez : ${subject} ___ ${rest}.`, [answer, ...wrong], answer, `The expression requires ${['suis', 'es', 'est', 'sommes', 'êtes', 'sont'].includes(answer) ? 'être' : 'avoir'}: ${subject.toLowerCase()} ${answer}.`, `L’expression demande ${['suis', 'es', 'est', 'sommes', 'êtes', 'sont'].includes(answer) ? 'être' : 'avoir'} : ${subject.toLowerCase()} ${answer}.`, variant)
}

function questionForms(variant: number): QData {
  const rows = [
    ['Tu viens demain.', 'Est-ce que tu viens demain ?', ['Est-ce tu viens demain ?', 'Tu est-ce que viens demain ?', 'Viens tu est-ce que demain ?']],
    ['Il parle français.', 'Parle-t-il français ?', ['Parle-il français ?', 'Il parle-t français ?', 'Parle-t-elle français ?']],
    ['Vous avez reçu mon message.', 'Avez-vous reçu mon message ?', ['Avez vous reçu mon message ?', 'Vous avez-vous reçu mon message ?', 'Ont-vous reçu mon message ?']],
    ['Elle habite à Paris.', 'Où habite-t-elle ?', ['Où habite-elle ?', 'Où elle habite-t ?', 'Habite où-t-elle ?']],
  ] as const
  const [statement, answer, wrong] = pick(rows, variant)
  return mc(`Transform into a correct question: “${statement}”`, `Transformez en question correcte : « ${statement} »`, [answer, ...wrong], answer, 'Use est-ce que or a correctly formed inversion. Insert -t- only when needed for pronunciation.', 'Utilisez est-ce que ou une inversion correcte. Insérez -t- seulement si nécessaire pour la prononciation.', variant)
}

function interrogativeAdverbs(variant: number): QData {
  const rows = [
    ['reason', 'Pourquoi', 'Pourquoi partez-vous si tôt ?'], ['place', 'Où', 'Où habitez-vous ?'], ['time', 'Quand', 'Quand commence la réunion ?'],
    ['manner', 'Comment', 'Comment allez-vous au travail ?'], ['quantity', 'Combien', 'Combien de temps restez-vous ?'],
  ] as const
  const [meaning, answer, sentence] = pick(rows, variant)
  return mc(`Which interrogative adverb asks about ${meaning}?`, `Quel adverbe interrogatif porte sur ${meaning === 'reason' ? 'la cause' : meaning === 'place' ? 'le lieu' : meaning === 'time' ? 'le moment' : meaning === 'manner' ? 'la manière' : 'la quantité'} ?`, [answer, 'Où', 'Quand', 'Pourquoi', 'Comment', 'Combien'], answer, `${answer} is used in: ${sentence}`, `${answer} s’utilise dans : ${sentence}`, variant)
}

function answerSi(variant: number): QData {
  const rows = [
    ['Tu ne viens pas ce soir ?', 'Si, je viens.', 'You are coming.'], ['Vous n’avez pas reçu le document ?', 'Si, je l’ai reçu.', 'You received it.'],
    ['Elle ne travaille pas demain ?', 'Si, elle travaille.', 'She is working.'], ['Ils ne sont pas disponibles ?', 'Si, ils le sont.', 'They are available.'],
  ] as const
  const [question, answer, meaning] = pick(rows, variant)
  return mc(`${meaning} Answer the negative question: “${question}”`, `${meaning} Répondez à la question négative : « ${question} »`, [answer, answer.replace(/^Si/, 'Oui'), answer.replace(/^Si/, 'Non'), 'Non, pas du tout.'], answer, 'Use si, not oui, to contradict a negative question.', 'On utilise si, et non oui, pour contredire une question négative.', variant)
}

function interrogativePronouns(variant: number): QData {
  const rows = [
    ['masculine singular', 'lequel'], ['feminine singular', 'laquelle'], ['masculine plural', 'lesquels'], ['feminine plural', 'lesquelles'],
    ['a person as subject', 'qui'], ['a thing after a preposition', 'quoi'],
  ] as const
  const [meaning, answer] = pick(rows, variant)
  return mc(`Choose the interrogative pronoun for ${meaning}.`, `Choisissez le pronom interrogatif pour ${meaning}.`, [answer, 'lequel', 'laquelle', 'lesquels', 'lesquelles', 'qui', 'quoi'], answer, `${answer} matches ${meaning}.`, `${answer} correspond à ${meaning}.`, variant)
}

function presentContinuous(variant: number): QData {
  const [, , complement] = pick(erVerbs, variant); const infinitive = pick(erVerbs, variant)[0]
  return mc(`Complete: Je suis ___ ${infinitive} ${complement}.`, `Complétez : Je suis ___ ${infinitive} ${complement}.`, ['en train de', 'en train à', 'dans train de', 'en cours à'], 'en train de', 'Être en train de + infinitive expresses an action in progress.', 'Être en train de + infinitif exprime une action en cours.', variant)
}

function demonstrativeAdjectives(variant: number): QData {
  const [sentence, answer, wrong] = pick(demonstrativeRows, variant)
  return mc(`Complete: ${sentence}`, `ComplÃ©tez : ${sentence}`, [answer, ...wrong], answer, 'Use ce before a masculine singular noun, cet before a masculine singular vowel sound, cette before a feminine singular noun, and ces in the plural.', 'Utilisez ce devant un nom masculin singulier, cet devant un nom masculin avec voyelle, cette devant un nom fÃ©minin singulier et ces au pluriel.', variant)
}

function numbersTime(variant: number): QData {
  const [promptEn, answer, wrong] = pick(numbersTimeRows, variant)
  return mc(promptEn, promptEn, [answer, ...wrong], answer, 'Time and date expressions follow fixed patterns such as il est, le premier, and nous sommes lundi.', 'Les expressions de l heure et de la date suivent des structures fixes comme il est, le premier et nous sommes lundi.', variant)
}

function placePrepositions(variant: number): QData {
  const [sentence, answer, wrong] = pick(placePrepositionRows, variant)
  return mc(`Complete with the correct preposition: ${sentence}`, `ComplÃ©tez avec la bonne prÃ©position : ${sentence}`, [answer, ...wrong], answer, 'The chosen preposition must match the spatial relation.', 'La prÃ©position choisie doit correspondre Ã  la relation spatiale.', variant)
}

function simpleNegation(variant: number): QData {
  const [sentence, answer, wrong] = pick(simpleNegationRows, variant)
  return mc(`Complete the negative form: ${sentence}`, `ComplÃ©tez la forme nÃ©gative : ${sentence}`, [answer, ...wrong], answer, 'Basic negation places ne or n apostrophe before the conjugated verb and pas or another negative word after it.', 'La nÃ©gation de base place ne ou n apostrophe avant le verbe conjuguÃ© et pas ou un autre mot nÃ©gatif aprÃ¨s.', variant)
}

function imperative(variant: number): QData {
  const rows = [
    ['écouter', 'tu', 'Écoute le professeur !', ['Écoutes le professeur !', 'Écoutez le professeur !', 'Écoutons le professeur !']],
    ['prendre', 'vous', 'Prenez le bus !', ['Prendez le bus !', 'Prenons le bus !', 'Prends le bus !']],
    ['aller', 'tu', 'Vas-y !', ['Va-y !', 'Allez-y !', 'Allons-y !']],
    ['attendre', 'nous', 'Attendons ici !', ['Attendez ici !', 'Attend ici !', 'Attends ici !']],
  ] as const
  const [verb, person, answer, wrong] = pick(rows, variant)
  return mc(`Choose the ${person} imperative of ${verb}.`, `Choisissez l’impératif ${person} de ${verb}.`, [answer, ...wrong], answer, 'The imperative uses special person forms and omits the subject pronoun.', 'L’impératif utilise des formes particulières et omet le pronom sujet.', variant)
}

function futureProche(variant: number): QData {
  const [infinitive, , complement] = pick(erVerbs, variant * 3); const forms = ['vais', 'vas', 'va', 'allons', 'allez', 'vont']; const person = pick(people, variant)
  const answer = `${cap(person.subject)} ${forms[person.index]} ${infinitive} ${complement}.`
  return mc('Choose the correct near-future sentence.', 'Choisissez la phrase correcte au futur proche.', [answer, `${cap(person.subject)} ${forms[person.index]} ${infinitive.replace(/er$/, 'é')} ${complement}.`, `${cap(person.subject)} ${infinitive} ${forms[person.index]} ${complement}.`, `${cap(person.subject)} ${forms[person.index]} ${infinitive.replace(/er$/, 'e')} ${complement}.`], answer, 'Near future = aller in the present + infinitive.', 'Futur proche = aller au présent + infinitif.', variant)
}

function passeCompose(variant: number): QData {
  const expandedRows = [
    ['Hier soir, j ai ___ un documentaire jusqu a minuit.', 'regarde', ['suis regarde', 'regardais', 'regarder']],
    ['Elle est ___ au marche avant d aller au bureau.', 'allee', ['alle', 'aller', 'allaient']],
    ['Nous avons ___ le rapport avant midi.', 'fini', ['finis', 'finissions', 'finir']],
    ['Ils sont ___ tres tard a cause du dernier train.', 'arrives', ['arrive', 'arriver', 'arrivaient']],
    ['Tu as ___ ce message ce matin ?', 'recu', ['recois', 'recevoir', 'recevais']],
    ['Marie s est ___ a huit heures pour prendre son avion.', 'reveillee', ['reveille', 'reveiller', 'reveillait']],
    ['Mes collegues ont ___ le projet en dix jours.', 'fait', ['fais', 'faire', 'faisaient']],
    ['J ai ___ mes cles dans le taxi.', 'perdu', ['perdre', 'perdais', 'perdus']],
    ['Elle est ___ chez elle sans attendre la fin de la reunion.', 'rentree', ['rentre', 'rentrer', 'rentrait']],
    ['Nous n avons pas ___ la porte en partant.', 'ferme', ['fermer', 'fermions', 'fermes']],
    ['Ils ont ___ un appartement dans le centre l annee derniere.', 'choisi', ['choisir', 'choisissaient', 'choisis']],
    ['Julie et Emma sont ___ tres tot pour la randonnee.', 'parties', ['parti', 'partir', 'partaient']],
    ['Vous avez ___ pourquoi le magasin etait ferme ?', 'compris', ['comprendre', 'compreniez', 'comprisent']],
    ['J ai ___ de telephoner avant de venir.', 'oublie', ['oublier', 'oubliais', 'oublies']],
    ['Mes soeurs sont ___ devant la gare pendant une heure.', 'restees', ['restes', 'rester', 'restaient']],
    ['Le professeur a ___ les copies cet apres-midi.', 'rendu', ['rendre', 'rendait', 'rendus']],
    ['Nous sommes ___ dans un petit hotel pres du port.', 'descendus', ['descendu', 'descendre', 'descendions']],
    ['Elles sont ___ se promener apres le dejeuner.', 'allees', ['alles', 'aller', 'allaient']],
    ['J ai ___ la bonne reponse au dernier moment.', 'trouve', ['trouver', 'trouvais', 'trouves']],
    ['Tu es ___ te coucher tres tard hier soir.', 'alle', ['allee', 'aller', 'allais']],
  ] as const
  const [sentence2, answer2, wrong2] = pick(expandedRows, variant)
  return mc(`Complete in the passe compose: ${sentence2}`, `Completez au passe compose : ${sentence2}`, [answer2, ...wrong2], answer2, 'Choose the auxiliary and past participle form that matches the subject and the verb.', 'Choisissez l auxiliaire et le participe passe qui correspondent au sujet et au verbe.', variant)
  const rows = [
    ['Hier, j’___ un documentaire.', 'ai regardé', ['suis regardé', 'regardais', 'ai regarder']], ['Elle ___ au marché ce matin.', 'est allée', ['a allé', 'est allé', 'allait']],
    ['Nous ___ le rapport avant midi.', 'avons fini', ['sommes fini', 'avons finis', 'finissions']], ['Ils ___ très tard.', 'sont arrivés', ['ont arrivé', 'sont arrivé', 'arrivaient']],
    ['Tu ___ ce message ?', 'as reçu', ['es reçu', 'recevais', 'as recevoir']], ['Marie ___ à huit heures.', 's’est réveillée', ['a réveillé', 's’est réveillé', 'se réveillait']],
  ] as const
  const [sentence, answer, wrong] = pick(rows, variant)
  return mc(`Complete in the passé composé: ${sentence}`, `Complétez au passé composé : ${sentence}`, [answer, ...wrong], answer, 'Passé composé uses the correct auxiliary plus a past participle; with être, agreement may be required.', 'Le passé composé utilise le bon auxiliaire et un participe passé ; avec être, l’accord peut être nécessaire.', variant)
}

function passeComposeAvoir(variant: number): QData {
  const rows = [
    ['Nous', 'finir', 'avons fini', ['sommes finis', 'avons finis', 'avons finir']], ['Elle', 'prendre', 'a pris', ['est prise', 'a prendu', 'avait pris']],
    ['Vous', 'voir', 'avez vu', ['êtes vu', 'avez vus', 'avez voir']], ['Ils', 'écrire', 'ont écrit', ['sont écrits', 'ont écris', 'ont écrire']],
  ] as const
  const [subject, verb, answer, wrong] = pick(rows, variant)
  return mc(`Choose the passé composé of ${verb}: ${subject} ___.`, `Choisissez le passé composé de ${verb} : ${subject} ___.`, [answer, ...wrong], answer, `${verb} normally uses avoir in the passé composé.`, `${verb} utilise normalement avoir au passé composé.`, variant)
}

function passeComposeEtre(variant: number): QData {
  const rows = [
    ['Elle', 'aller', 'est allée', ['a allé', 'est allé', 'a allée']], ['Ils', 'arriver', 'sont arrivés', ['ont arrivé', 'sont arrivé', 'ont arrivés']],
    ['Marie', 'partir', 'est partie', ['a parti', 'est parti', 'a partie']], ['Elles', 'venir', 'sont venues', ['ont venu', 'sont venus', 'ont venues']],
  ] as const
  const [subject, verb, answer, wrong] = pick(rows, variant)
  return mc(`Complete: ${subject} ___ hier. (${verb})`, `Complétez : ${subject} ___ hier. (${verb})`, [answer, ...wrong], answer, `${verb} uses être; the past participle agrees with the subject.`, `${verb} utilise être ; le participe passé s’accorde avec le sujet.`, variant)
}

function imparfait(variant: number): QData {
  const expandedRows = [
    ['Quand j etais petite, j ___ souvent chez ma tante.', 'allais', ['suis allee', 'irai', 'vais']],
    ['Pendant que nous ___, le telephone a sonne.', 'dormions', ['avons dormi', 'dormirons', 'dormons']],
    ['Il ___ froid tous les matins en janvier.', 'faisait', ['a fait', 'fera', 'fait']],
    ['Vous ___ toujours le train de huit heures.', 'preniez', ['avez pris', 'prendrez', 'prenez']],
    ['Le bureau ___ tres calme avant l arrivee des clients.', 'etait', ['a ete', 'sera', 'est']],
    ['Quand nous habitions a Lyon, nous ___ pres du parc.', 'mangions', ['avons mange', 'mangerons', 'mangeons']],
    ['Ma grand-mere ___ du the chaque soir.', 'buvait', ['a bu', 'boira', 'boit']],
    ['Les enfants ___ parce qu ils avaient peur de l orage.', 'pleuraient', ['ont pleure', 'pleureront', 'pleurent']],
    ['Je ___ deja un peu le francais avant ce voyage.', 'connaissais', ['ai connu', 'connaitrai', 'connais']],
    ['Nous ___ rarement tard a cette epoque-la.', 'sortions', ['sommes sortis', 'sortirons', 'sortons']],
    ['Tu ___ toujours la verite quand tu etais petit.', 'disais', ['as dit', 'diras', 'dis']],
    ['Il ___ mal a la tete depuis le matin.', 'avait', ['a eu', 'a', 'aura']],
    ['Le soleil ___ et les touristes prenaient des photos.', 'brillait', ['a brille', 'brillera', 'brille']],
    ['Chaque dimanche, mes parents ___ le marche ensemble.', 'faisaient', ['ont fait', 'feront', 'font']],
    ['Je ne ___ pas pourquoi tout le monde riait.', 'comprenais', ['ai compris', 'comprendrai', 'comprends']],
    ['Avant, on ___ dans une maison plus petite.', 'vivait', ['a vecu', 'vivra', 'vit']],
    ['Vous ___ souvent fatigues apres le service du soir.', 'etiez', ['avez ete', 'serez', 'etes']],
    ['Pendant le film, elle ___ sans parler.', 'souriait', ['a souri', 'sourira', 'sourit']],
    ['Les rues ___ presque vides a minuit.', 'etaient', ['ont ete', 'seront', 'sont']],
    ['Je ___ mon temps entre les cours et mon travail.', 'partageais', ['ai partage', 'partagerai', 'partage']],
  ] as const
  const [sentence2, answer2, wrong2] = pick(expandedRows, variant)
  return mc(`Choose the correct imparfait form: ${sentence2}`, `Choisissez la bonne forme a l imparfait : ${sentence2}`, [answer2, ...wrong2], answer2, 'Use imparfait for description, habitual past actions, repeated situations, and background.', 'Utilisez l imparfait pour la description, l habitude passee, la repetition et le decor du recit.', variant)
  const rows = [
    ['Quand j’étais petite, je ___ souvent chez ma tante.', 'allais', ['suis allée', 'irai', 'vais']], ['Pendant que nous ___, le téléphone a sonné.', 'dormions', ['avons dormi', 'dormirons', 'dormons']],
    ['Il ___ froid tous les matins.', 'faisait', ['a fait', 'fera', 'fait']], ['Vous ___ toujours le train de huit heures.', 'preniez', ['avez pris', 'prendrez', 'prenez']],
  ] as const
  const [sentence, answer, wrong] = pick(rows, variant)
  return mc(`Choose the correct imparfait form: ${sentence}`, `Choisissez la bonne forme à l’imparfait : ${sentence}`, [answer, ...wrong], answer, 'Use the imparfait for background, repeated habits, or an action in progress in the past.', 'On utilise l’imparfait pour le décor, les habitudes ou une action en cours dans le passé.', variant)
}

function pcVsImparfait(variant: number): QData {
  const rows = [
    ['Il ___ quand je ___ de la maison.', 'pleuvait / suis sortie', ['a plu / sortais', 'pleut / suis sortie', 'pleuvait / sortais soudain']],
    ['Pendant que je ___, mon collègue m’___.', 'travaillais / a appelé', ['ai travaillé / appelait', 'travaillerai / appelle', 'travaille / a appelé']],
    ['Nous ___ le dîner quand la lumière s’___.', 'préparions / est éteinte', ['avons préparé / éteignait', 'préparons / est éteinte', 'préparerons / éteignait']],
  ] as const
  const [sentence, answer, wrong] = pick(rows, variant)
  return mc(`Complete with the best tense contrast: ${sentence}`, `Complétez avec le meilleur contraste de temps : ${sentence}`, [answer, ...wrong], answer, 'Use the imparfait for an ongoing background action and the passé composé for the completed event.', 'Utilisez l’imparfait pour l’action en cours et le passé composé pour l’événement terminé.', variant)
}

function recentPast(variant: number): QData {
  const verb = pick(['terminer', 'arriver', 'recevoir', 'manger', 'appeler', 'partir'], variant)
  return mc(`Complete: Je viens ___ ${verb}.`, `Complétez : Je viens ___ ${verb}.`, ['de', 'à', 'pour', 'en'], 'de', 'Recent past = venir de + infinitive.', 'Passé récent = venir de + infinitif.', variant)
}

function plusQueParfait(variant: number): QData {
  const rows = [
    ['Quand je suis arrivée, ils ___ déjà ___.', 'étaient / partis', ['ont / partis', 'avaient / partir', 'sont / partis']], ['Elle a compris qu’elle ___ son dossier.', 'avait oublié', ['a oublié', 'était oubliée', 'oubliait']],
    ['Nous avons découvert que vous ___ le message.', 'aviez reçu', ['avez reçu', 'étiez reçus', 'receviez']], ['Il était fatigué parce qu’il ___ toute la nuit.', 'avait travaillé', ['a travaillé', 'était travaillé', 'travaillait soudain']],
  ] as const
  const [sentence, answer, wrong] = pick(rows, variant)
  return mc(`Complete in the plus-que-parfait: ${sentence}`, `Complétez au plus-que-parfait : ${sentence}`, [answer, ...wrong], answer, 'Plus-que-parfait = imperfect of avoir or être + past participle.', 'Plus-que-parfait = imparfait de avoir ou être + participe passé.', variant)
}

function passeSimple(variant: number): QData {
  const rows = [['être', 'il fut'], ['avoir', 'il eut'], ['faire', 'il fit'], ['venir', 'il vint'], ['prendre', 'il prit'], ['voir', 'il vit']] as const
  const [verb, answer] = pick(rows, variant)
  return mc(`Choose the literary passé simple form of ${verb}.`, `Choisissez la forme littéraire au passé simple de ${verb}.`, [answer, answer.replace('il ', 'il a '), answer.replace('il ', 'il était '), answer.replace('il ', 'il va ')], answer, 'The passé simple is mainly used in written narration.', 'Le passé simple s’utilise surtout dans le récit écrit.', variant)
}

function objectPronouns(variant: number): QData {
  const rows = [
    ['Je regarde le film.', 'Je le regarde.', ['Je lui regarde.', 'J’y regarde.', 'J’en regarde.']], ['Je téléphone à Marie.', 'Je lui téléphone.', ['Je la téléphone.', 'Je le téléphone.', 'J’y téléphone.']],
    ['Nous attendons les invités.', 'Nous les attendons.', ['Nous leur attendons.', 'Nous en attendons.', 'Nous y attendons.']], ['Elle parle à ses collègues.', 'Elle leur parle.', ['Elle les parle.', 'Elle en parle à eux.', 'Elle y parle.']],
  ] as const
  const [source, answer, wrong] = pick(rows, variant)
  return mc(`Replace the highlighted complement: ${source}`, `Remplacez le complément : ${source}`, [answer, ...wrong], answer, 'Choose a direct or indirect object pronoun according to the verb construction.', 'Choisissez un pronom complément direct ou indirect selon la construction du verbe.', variant)
}

function pronounPlacement(variant: number): QData {
  const rows = [
    ['Je vais donner le document à Marie.', 'Je vais le lui donner.', ['Je le vais lui donner.', 'Je vais lui le donner.', 'Je vais donner le lui.']],
    ['Ne montre pas la photo à Paul.', 'Ne la lui montre pas.', ['Ne lui la montre pas.', 'La ne lui montre pas.', 'Ne montre-la-lui pas.']],
    ['J’ai acheté les billets.', 'Je les ai achetés.', ['J’ai les achetés.', 'Je ai les acheté.', 'Je leur ai achetés.']],
  ] as const
  const [source, answer, wrong] = pick(rows, variant)
  return mc(`Choose the correct pronoun placement: ${source}`, `Choisissez la bonne place des pronoms : ${source}`, [answer, ...wrong], answer, 'Object pronouns normally come before the conjugated verb or before the infinitive that governs them.', 'Les pronoms compléments se placent normalement avant le verbe conjugué ou devant l’infinitif dont ils dépendent.', variant)
}

function yEn(variant: number): QData {
  const rows = [
    ['Je vais au laboratoire.', 'J’y vais.', ['J’en vais.', 'Je le vais.', 'Je lui vais.']], ['Je parle de ce projet.', 'J’en parle.', ['J’y parle.', 'Je le parle.', 'Je lui parle.']],
    ['Je veux trois cafés.', 'J’en veux trois.', ['J’y veux trois.', 'Je les veux de trois.', 'Je veux en trois.']], ['Elle pense à son examen.', 'Elle y pense.', ['Elle en pense.', 'Elle le pense à.', 'Elle lui pense.']],
  ] as const
  const [source, answer, wrong] = pick(rows, variant)
  return mc(`Replace the complement with y or en: ${source}`, `Remplacez le complément par y ou en : ${source}`, [answer, ...wrong], answer, 'Y often replaces à + thing/place. En often replaces de + thing or a quantity.', 'Y remplace souvent à + chose/lieu. En remplace souvent de + chose ou une quantité.', variant)
}

function doublePronouns(variant: number): QData {
  const rows = [
    ['Je donne le livre à Marie.', 'Je le lui donne.', ['Je lui le donne.', 'Je le donne lui.', 'Je lui donne le.']], ['Nous envoyons les documents à nos collègues.', 'Nous les leur envoyons.', ['Nous leur les envoyons.', 'Nous les envoyons leur.', 'Nous en leur envoyons.']],
    ['Tu prêtes ta voiture à Paul.', 'Tu la lui prêtes.', ['Tu lui la prêtes.', 'Tu la prêtes lui.', 'Tu y lui prêtes.']], ['Elle apporte des gâteaux à ses amis.', 'Elle leur en apporte.', ['Elle en leur apporte.', 'Elle les leur apporte des.', 'Elle y en apporte.']],
  ] as const
  const [source, answer, wrong] = pick(rows, variant)
  return mc(`Replace both complements: ${source}`, `Remplacez les deux compléments : ${source}`, [answer, ...wrong], answer, 'French double pronouns follow a fixed order: me/te/se/nous/vous → le/la/les → lui/leur → y → en.', 'Les doubles pronoms suivent un ordre fixe : me/te/se/nous/vous → le/la/les → lui/leur → y → en.', variant)
}

function relativeSimple(variant: number): QData {
  const rows = [
    ['La femme ___ parle est ma collègue.', 'qui', ['que', 'où', 'dont']], ['Le rapport ___ j’ai lu est clair.', 'que', ['qui', 'où', 'dont']],
    ['La ville ___ j’habite est calme.', 'où', ['qui', 'que', 'dont']], ['Le projet ___ nous parlons est important.', 'dont', ['qui', 'que', 'où']],
  ] as const
  const [sentence, answer, wrong] = pick(rows, variant)
  return mc(`Complete with the correct relative pronoun: ${sentence}`, `Complétez avec le bon pronom relatif : ${sentence}`, [answer, ...wrong], answer, 'Use qui for a subject, que for a direct object, où for place/time, and dont for de.', 'Utilisez qui pour un sujet, que pour un COD, où pour le lieu/temps et dont pour de.', variant)
}

function relativeComplex(variant: number): QData {
  const rows = [
    ['La décision à ___ je pense est difficile.', 'laquelle', ['lequel', 'dont', 'que']], ['Les collègues avec ___ je travaille sont disponibles.', 'lesquels', ['lesquelles', 'dont', 'qui']],
    ['Le laboratoire près du ___ se trouve la gare est fermé.', 'quel', ['laquelle', 'dont', 'que']], ['Les raisons pour ___ elle refuse sont claires.', 'lesquelles', ['lesquels', 'dont', 'où']],
  ] as const
  const [sentence, answer, wrong] = pick(rows, variant)
  return mc(`Complete with a compound relative pronoun: ${sentence}`, `Complétez avec un pronom relatif composé : ${sentence}`, [answer, ...wrong], answer, 'Compound relative pronouns agree with the antecedent and follow a preposition.', 'Les pronoms relatifs composés s’accordent avec l’antécédent et suivent une préposition.', variant)
}

function demonstratives(variant: number): QData {
  const rows = [
    ['Which book do you prefer?', 'celui', 'masculine singular'], ['Which dress do you prefer?', 'celle', 'feminine singular'], ['Which documents do you need?', 'ceux', 'masculine plural'], ['Which keys are yours?', 'celles', 'feminine plural'],
  ] as const
  const [context, answer, form] = pick(rows, variant)
  return mc(`${context} Choose the ${form} demonstrative pronoun.`, `${context} Choisissez le pronom démonstratif ${form}.`, [answer, 'celui', 'celle', 'ceux', 'celles'], answer, `${answer} is the ${form} form.`, `${answer} est la forme ${form}.`, variant)
}

function indefinites(variant: number): QData {
  const rows = [
    ['___ peut participer à la réunion.', 'Tout le monde', ['Personne de', 'Chacun des monde', 'Quelques monde']], ['Je n’ai vu ___ dans le couloir.', 'personne', ['quelqu’un', 'chacun', 'plusieurs']],
    ['___ étudiants ont répondu.', 'Plusieurs', ['Chaque', 'Tout', 'Quelqu’un']], ['___ participant doit signer.', 'Chaque', ['Plusieurs', 'Tous', 'Quelqu’un']],
  ] as const
  const [sentence, answer, wrong] = pick(rows, variant)
  return mc(`Complete with the correct indefinite word: ${sentence}`, `Complétez avec le bon indéfini : ${sentence}`, [answer, ...wrong], answer, 'Choose the indefinite form that matches meaning and number.', 'Choisissez la forme indéfinie qui correspond au sens et au nombre.', variant)
}

function conditionalPoliteness(variant: number): QData {
  const rows = [
    ['Je ___ un café, s’il vous plaît.', 'voudrais', ['veux', 'voudrai', 'voulais']], ['___-vous m’aider, s’il vous plaît ?', 'Pourriez', ['Pouvez', 'Pourrez', 'Pouviez']],
    ['Nous ___ réserver une table.', 'aimerions', ['aimons', 'aimerons', 'aimions']], ['Ce ___ possible de déplacer le rendez-vous ?', 'serait', ['sera', 'est', 'était']],
  ] as const
  const [sentence, answer, wrong] = pick(rows, variant)
  return mc(`Choose the polite conditional form: ${sentence}`, `Choisissez la forme polie au conditionnel : ${sentence}`, [answer, ...wrong], answer, 'The conditional softens a request and sounds more polite.', 'Le conditionnel atténue une demande et la rend plus polie.', variant)
}

function futureSimple(variant: number): QData {
  const rows = [
    ['Demain, je ___ le rapport.', 'terminerai', ['termine', 'terminais', 'terminerais']], ['Vous ___ les résultats lundi.', 'recevrez', ['recevez', 'recevriez', 'receviez']],
    ['Nous ___ à Paris la semaine prochaine.', 'irons', ['allons', 'irions', 'allions']], ['Elle ___ répondre plus tard.', 'pourra', ['peut', 'pourrait', 'pouvait']],
  ] as const
  const [sentence, answer, wrong] = pick(rows, variant)
  return mc(`Complete in the future simple: ${sentence}`, `Complétez au futur simple : ${sentence}`, [answer, ...wrong], answer, 'The future simple uses the future stem plus the appropriate ending.', 'Le futur simple utilise le radical du futur et la terminaison adaptée.', variant)
}

function irregularFuture(variant: number): QData {
  const rows = [['être', 'ser-', 'je serai'], ['avoir', 'aur-', 'tu auras'], ['aller', 'ir-', 'nous irons'], ['faire', 'fer-', 'vous ferez'], ['venir', 'viendr-', 'ils viendront'], ['pouvoir', 'pourr-', 'elle pourra']] as const
  const [verb, stem, answer] = pick(rows, variant)
  const cleanStem = stem.replace(/-$/, '')
  const conditionalTrap = answer.replace(/ai$|as$|ons$|ez$|ont$|a$/, 'ais')
  const infinitiveTrap = answer.replace(cleanStem, verb)
  const missingLetterTrap = answer.replace(cleanStem, cleanStem.slice(0, -1))
  const extraLetterTrap = answer.replace(cleanStem, `${cleanStem}r`)
  return mc(`Choose the correct future form of ${verb} (stem ${stem}).`, `Choisissez la bonne forme au futur de ${verb} (radical ${stem}).`, [answer, conditionalTrap, infinitiveTrap, missingLetterTrap, extraLetterTrap], answer, `${verb} uses the irregular future stem ${stem}.`, `${verb} utilise le radical irrégulier ${stem}.`, variant)
}

function siPresentFuture(variant: number): QData {
  const rows = [
    ['Si tu ___ tôt, nous ___ le train.', 'pars / prendrons', ['partiras / prendrons', 'partais / prendrions', 'pars / prenions']], ['S’il ___ beau, nous ___ au parc.', 'fait / irons', ['fera / irons', 'faisait / irions', 'fait / allions']],
    ['Si vous ___ le dossier, je vous ___ demain.', 'envoyez / répondrai', ['enverrez / répondrai', 'envoyiez / répondrais', 'envoyez / répondais']],
  ] as const
  const [sentence, answer, wrong] = pick(rows, variant)
  return mc(`Complete the real condition: ${sentence}`, `Complétez la condition réelle : ${sentence}`, [answer, ...wrong], answer, 'For a likely future condition: si + present, then future simple.', 'Pour une condition future probable : si + présent, puis futur simple.', variant)
}

function siHypothesis(variant: number): QData {
  const rows = [
    ['Si j’___ plus de temps, je ___ davantage.', 'avais / lirais', ['aurais / lirais', 'ai / lirais', 'avais / lirai']], ['Si nous ___ près du bureau, nous ___ à pied.', 'habitions / irions', ['habiterions / irions', 'habitons / irions', 'habitions / irons']],
    ['Si elle ___ la réponse, elle nous la ___.', 'savait / dirait', ['saurait / dirait', 'sait / dirait', 'savait / dira']],
  ] as const
  const [sentence, answer, wrong] = pick(rows, variant)
  return mc(`Complete the hypothetical condition: ${sentence}`, `Complétez l’hypothèse : ${sentence}`, [answer, ...wrong], answer, 'For a present hypothesis: si + imparfait, then conditional present.', 'Pour une hypothèse présente : si + imparfait, puis conditionnel présent.', variant)
}

function subjunctiveObligation(variant: number): QData {
  const rows = [
    ['Il faut que tu ___ à l’heure.', 'sois', ['es', 'seras', 'étais']], ['Je veux que vous ___ ce document.', 'lisiez', ['lisez', 'lirez', 'lire']],
    ['Bien qu’elle ___ fatiguée, elle continue.', 'soit', ['est', 'sera', 'était']], ['Il est nécessaire que nous ___ rapidement.', 'répondions', ['répondons', 'répondrons', 'répondre']],
  ] as const
  const [sentence, answer, wrong] = pick(rows, variant)
  return mc(`Complete with the subjunctive: ${sentence}`, `Complétez au subjonctif : ${sentence}`, [answer, ...wrong], answer, 'Necessity, desire, and some conjunctions trigger the subjunctive.', 'La nécessité, la volonté et certaines conjonctions déclenchent le subjonctif.', variant)
}

function timeChronology(variant: number): QData {
  const rows = [
    ['___, je prends mon petit-déjeuner ; ensuite, je pars.', 'D’abord', ['Enfin', 'Pendant', 'Depuis']], ['Je travaille ici ___ trois ans.', 'depuis', ['pendant', 'il y a', 'dans']],
    ['Nous avons attendu ___ deux heures.', 'pendant', ['depuis', 'il y a', 'dans']], ['Elle est arrivée ___ dix minutes.', 'il y a', ['depuis', 'pendant', 'en']],
  ] as const
  const [sentence, answer, wrong] = pick(rows, variant)
  return mc(`Choose the correct time expression: ${sentence}`, `Choisissez la bonne expression temporelle : ${sentence}`, [answer, ...wrong], answer, 'Choose the expression according to sequence, duration, or distance from the present.', 'Choisissez l’expression selon l’ordre, la durée ou la distance par rapport au présent.', variant)
}

function timeExpressions(variant: number): QData {
  const rows = [
    ['Je travaille ici ___ 2024.', 'depuis', ['pendant', 'il y a', 'dans']], ['J’ai étudié ___ trois heures hier.', 'pendant', ['depuis', 'dans', 'il y a']],
    ['Le train partira ___ vingt minutes.', 'dans', ['depuis', 'pendant', 'il y a']], ['Nous nous sommes rencontrés ___ six mois.', 'il y a', ['dans', 'depuis', 'pendant']],
    ['___ que tu arrives, appelle-moi.', 'Dès', ['Pendant', 'Depuis', 'Il y a']],
  ] as const
  const [sentence, answer, wrong] = pick(rows, variant)
  return mc(`Complete with the best time expression: ${sentence}`, `Complétez avec la meilleure expression temporelle : ${sentence}`, [answer, ...wrong], answer, 'Time expressions distinguish duration, starting point, future delay, and elapsed time.', 'Les expressions temporelles distinguent la durée, le point de départ, le délai futur et le temps écoulé.', variant)
}

function prepositions(variant: number): QData {
  const rows = [
    ['Je vais ___ France.', 'en', ['au', 'aux', 'à la']], ['Il habite ___ Canada.', 'au', ['en', 'aux', 'à']], ['Nous revenons ___ États-Unis.', 'des', ['du', 'de', 'aux']],
    ['Elle va ___ Paris demain.', 'à', ['en', 'au', 'dans']], ['Le livre est ___ la table.', 'sur', ['à', 'en', 'chez']], ['Je travaille ___ Thierry.', 'avec', ['à', 'en', 'sur']],
  ] as const
  const [sentence, answer, wrong] = pick(rows, variant)
  return mc(`Complete with the correct preposition: ${sentence}`, `Complétez avec la bonne préposition : ${sentence}`, [answer, ...wrong], answer, 'The choice of preposition depends on the place, country gender/number, or relation expressed.', 'Le choix de la préposition dépend du lieu, du genre/nombre du pays ou de la relation exprimée.', variant)
}

function negation(variant: number): QData {
  const rows = [
    ['Je vois quelqu’un.', 'Je ne vois personne.', ['Je ne vois pas quelqu’un.', 'Je vois ne personne.', 'Je ne personne vois.']], ['Il mange toujours ici.', 'Il ne mange jamais ici.', ['Il mange ne jamais ici.', 'Il ne mange pas jamais ici.', 'Il ne jamais mange ici.']],
    ['Nous avons encore du pain.', 'Nous n’avons plus de pain.', ['Nous avons ne plus du pain.', 'Nous n’avons pas plus du pain.', 'Nous ne plus avons pain.']], ['Elle dit quelque chose.', 'Elle ne dit rien.', ['Elle ne dit pas rien.', 'Elle rien ne dit pas.', 'Elle ne rien dit.']],
  ] as const
  const [positive, answer, wrong] = pick(rows, variant)
  return mc(`Choose the correct negative transformation: “${positive}”`, `Choisissez la bonne transformation négative : « ${positive} »`, [answer, ...wrong], answer, 'Use the appropriate negative pair around the conjugated verb.', 'Utilisez la négation adaptée autour du verbe conjugué.', variant)
}

function adverbs(variant: number): QData {
  const rows = [
    ['Elle répond ___.', 'rapidement', ['rapide', 'rapidementement', 'rapidée']], ['Il parle ___ pendant les réunions.', 'clairement', ['clair', 'claire', 'clarté']],
    ['___, cette solution coûtera moins cher.', 'Probablement', ['Probable', 'Probabilité', 'Probablement de']], ['Elle est ___ disponible demain.', 'peut-être', ['peut être de', 'peut', 'être peut']],
  ] as const
  const [sentence, answer, wrong] = pick(rows, variant)
  return mc(`Complete with the correct adverb: ${sentence}`, `Complétez avec le bon adverbe : ${sentence}`, [answer, ...wrong], answer, 'Use an adverb to modify a verb or express the speaker’s degree of certainty.', 'Utilisez un adverbe pour modifier un verbe ou exprimer le degré de certitude.', variant)
}

function gerund(variant: number): QData {
  const rows = [
    ['Elle écoute un podcast ___ au travail.', 'en allant', ['en va', 'en aller', 'allant en']], ['Nous avons discuté ___ le déjeuner.', 'en prenant', ['en pris', 'prendre en', 'en prendre']],
    ['Il apprend le français ___ des articles.', 'en lisant', ['en lit', 'lisant de', 'en lire']], ['Elle s’est blessée ___ au badminton.', 'en jouant', ['en joue', 'jouer en', 'en joué']],
  ] as const
  const [sentence, answer, wrong] = pick(rows, variant)
  return mc(`Complete with a gérondif: ${sentence}`, `Complétez avec un gérondif : ${sentence}`, [answer, ...wrong], answer, 'Gérondif = en + present participle; it often expresses simultaneous actions or manner.', 'Gérondif = en + participe présent ; il exprime souvent la simultanéité ou la manière.', variant)
}

function reportedSpeech(variant: number): QData {
  const rows = [
    ['Marie dit : « Je suis fatiguée. »', 'Marie dit qu’elle est fatiguée.', ['Marie dit elle est fatiguée.', 'Marie dit que je suis fatiguée.', 'Marie dit d’être fatiguée.']],
    ['Le professeur dit : « Lisez le texte. »', 'Le professeur nous dit de lire le texte.', ['Le professeur nous dit que lire le texte.', 'Le professeur dit nous lisons le texte.', 'Le professeur nous dit lire le texte.']],
    ['Paul demande : « Est-ce que tu viens ? »', 'Paul demande si je viens.', ['Paul demande que je viens.', 'Paul demande est-ce que je viens.', 'Paul demande de je viens.']],
  ] as const
  const [direct, answer, wrong] = pick(rows, variant)
  return mc(`Choose the correct reported speech: ${direct}`, `Choisissez le bon discours rapporté : ${direct}`, [answer, ...wrong], answer, 'Reported statements use que, yes/no questions use si, and commands often use de + infinitive.', 'Le discours rapporté utilise que, les questions fermées utilisent si et les ordres utilisent souvent de + infinitif.', variant)
}

function comparative(variant: number): QData {
  const rows = [
    ['Ce train est ___ rapide que l’autre.', 'plus', ['le plus', 'aussi de', 'mieux']], ['Elle travaille ___ efficacement que moi.', 'plus', ['meilleur', 'le plus', 'plus de']],
    ['Cette option coûte ___ cher que la première.', 'moins', ['le moins', 'moins de', 'petit']], ['Il court ___ que son frère.', 'mieux', ['meilleur', 'plus bon', 'le mieux de']],
  ] as const
  const [sentence, answer, wrong] = pick(rows, variant)
  return mc(`Complete the comparison: ${sentence}`, `Complétez la comparaison : ${sentence}`, [answer, ...wrong], answer, 'Comparatives use plus, moins, or aussi + adjective/adverb + que. Bien becomes mieux.', 'Le comparatif utilise plus, moins ou aussi + adjectif/adverbe + que. Bien devient mieux.', variant)
}

function superlative(variant: number): QData {
  const rows = [
    ['C’est ___ meilleur restaurant du quartier.', 'le', ['la', 'un', 'plus']], ['Marie est ___ plus organisée de l’équipe.', 'la', ['le', 'une', 'les']],
    ['Ce sont ___ exercices les plus difficiles.', 'les', ['des', 'le', 'plus']], ['Elle répond ___ rapidement de tous.', 'le plus', ['la plus', 'plus que', 'le meilleur']],
  ] as const
  const [sentence, answer, wrong] = pick(rows, variant)
  return mc(`Complete the superlative: ${sentence}`, `Complétez le superlatif : ${sentence}`, [answer, ...wrong], answer, 'The superlative uses the definite article + plus/moins, with agreement when required.', 'Le superlatif utilise l’article défini + plus/moins, avec accord si nécessaire.', variant)
}

function connectors(variant: number): QData {
  const rows = [
    ['Je suis fatiguée ; ___, je vais me coucher tôt.', 'donc', ['cependant', 'car', 'd’abord']], ['La solution est pratique ; ___, elle coûte cher.', 'cependant', ['donc', 'parce que', 'ensuite']],
    ['Je suis restée chez moi ___ il pleuvait.', 'parce que', ['donc', 'malgré', 'en revanche']], ['___, je prépare le dossier ; ensuite, je l’envoie.', 'D’abord', ['Pourtant', 'Car', 'Ainsi que']],
  ] as const
  const [sentence, answer, wrong] = pick(rows, variant)
  return mc(`Choose the logical connector: ${sentence}`, `Choisissez le connecteur logique : ${sentence}`, [answer, ...wrong], answer, 'Choose the connector according to the logical relation: cause, consequence, contrast, or sequence.', 'Choisissez le connecteur selon la relation logique : cause, conséquence, opposition ou ordre.', variant)
}

function cause(variant: number): QData {
  const rows = [
    ['___ ton aide, j’ai terminé à temps.', 'Grâce à', ['À cause de', 'Malgré', 'Pendant']], ['Le train est en retard ___ une panne.', 'à cause d’', ['grâce à', 'malgré', 'pour']],
    ['Nous sommes rentrés tôt ___ il pleuvait.', 'parce qu’', ['donc', 'pourtant', 'grâce à']], ['___ la pluie, nous avons continué.', 'Malgré', ['Grâce à', 'Parce que', 'À cause']],
  ] as const
  const [sentence, answer, wrong] = pick(rows, variant)
  return mc(`Complete with the appropriate cause or concession expression: ${sentence}`, `Complétez avec l’expression de cause ou de concession adaptée : ${sentence}`, [answer, ...wrong], answer, 'Grâce à introduces a positive cause; à cause de a negative cause; malgré a concession.', 'Grâce à introduit une cause positive ; à cause de une cause négative ; malgré une concession.', variant)
}

function nominalisation(variant: number): QData {
  const rows = [
    ['décider', 'la décision', ['la décidation', 'le décidement', 'la décide']], ['développer', 'le développement', ['la développation', 'le développe', 'la développure']],
    ['réduire', 'la réduction', ['le réduisement', 'la réduition', 'le réduire']], ['améliorer', 'l’amélioration', ['le améliorage', 'l’améliorement', 'la amélioraison']],
  ] as const
  const [verb, answer, wrong] = pick(rows, variant)
  return mc(`Choose the correct nominalisation of “${verb}”.`, `Choisissez la nominalisation correcte de « ${verb} ».`, [answer, ...wrong], answer, 'Nominalisation replaces a verb with a noun, often used in formal writing.', 'La nominalisation remplace un verbe par un nom, souvent dans un style formel.', variant)
}

function passive(variant: number): QData {
  const rows = [
    ['Le technicien prépare les échantillons.', 'Les échantillons sont préparés par le technicien.', ['Les échantillons ont préparé le technicien.', 'Les échantillons sont préparer par le technicien.', 'Les échantillons prépare par le technicien.']],
    ['La direction annoncera la décision demain.', 'La décision sera annoncée demain par la direction.', ['La décision est annoncera demain.', 'La décision sera annoncer demain.', 'La décision aura annoncée demain.']],
    ['On a envoyé les lettres hier.', 'Les lettres ont été envoyées hier.', ['Les lettres sont été envoyées hier.', 'Les lettres ont envoyé hier.', 'Les lettres ont été envoyés hier.']],
  ] as const
  const [active, answer, wrong] = pick(rows, variant)
  return mc(`Choose the correct passive transformation: ${active}`, `Choisissez la bonne transformation au passif : ${active}`, [answer, ...wrong], answer, 'Passive voice = être in the required tense + past participle agreeing with the subject.', 'Voix passive = être au temps requis + participe passé accordé avec le sujet.', variant)
}

function register(variant: number): QData {
  const rows = [
    ['a formal email', 'Je vous remercie par avance pour votre réponse.', ['Salut, réponds vite.', 'Tu me files une réponse ?', 'Ça roule pour répondre ?']],
    ['a job interview', 'Je souhaiterais obtenir davantage d’informations.', ['Je veux plus d’infos, là.', 'Filez-moi les détails.', 'C’est quoi les infos ?']],
    ['a neutral workplace message', 'Pouvez-vous me transmettre le document ?', ['Tu me balances le doc ?', 'File-moi ça.', 'Envoie le truc, stp.']],
  ] as const
  const [context, answer, wrong] = pick(rows, variant)
  return mc(`Choose the sentence suitable for ${context}.`, `Choisissez la phrase adaptée à ${context}.`, [answer, ...wrong], answer, 'Register must match the situation and relationship between speakers.', 'Le registre doit correspondre à la situation et à la relation entre les interlocuteurs.', variant)
}

function truncation(variant: number): QData {
  const rows = [['restaurant', 'resto'], ['cinéma', 'ciné'], ['photographie', 'photo'], ['laboratoire', 'labo'], ['manifestation', 'manif'], ['professeur', 'prof']] as const
  const [full, answer] = pick(rows, variant)
  return mc(`Choose the common informal truncation of “${full}”.`, `Choisissez la troncation familière courante de « ${full} ».`, [answer, `${full.slice(0, 3)}x`, `${full.slice(0, 4)}eur`, `${full.slice(0, 2)}ou`, `${full.slice(0, 5)}ette`], answer, `${answer} is the common informal shortened form of ${full}.`, `${answer} est la forme familière abrégée courante de ${full}.`, variant)
}

function presentatives(variant: number): QData {
  const rows = [
    ['___ un problème dans le dossier.', 'Il y a', ['C’est', 'Il est', 'Voilà de']], ['___ mon collègue, Thierry.', 'Voici', ['Il y a de', 'C’est que', 'Il est']],
    ['___ une bonne idée !', 'C’est', ['Il est', 'Il y a de', 'Voici de']], ['___ les documents que vous avez demandés.', 'Voilà', ['Il est', 'C’est de', 'Il y a les']],
  ] as const
  const [sentence, answer, wrong] = pick(rows, variant)
  return mc(`Complete with the correct presentative: ${sentence}`, `Complétez avec le bon présentatif : ${sentence}`, [answer, ...wrong], answer, 'Use c’est, il y a, voici, or voilà according to whether you identify, state existence, or present something.', 'Utilisez c’est, il y a, voici ou voilà selon qu’on identifie, signale l’existence ou présente quelque chose.', variant)
}

function ilYA(variant: number): QData {
  const [promptEn, answer, wrong] = pick(ilYARows, variant)
  return mc(promptEn, promptEn, [answer, ...wrong], answer, 'Use il y a to express existence, and keep the fixed order in negatives and questions.', 'On utilise il y a pour exprimer l existence, et on garde l ordre fixe dans la nÃ©gation et dans la question.', variant)
}

function cEstIlEst(variant: number): QData {
  const rows = [
    ['___ médecin.', 'Il est', ['C’est', 'Il y a', 'Voici']], ['___ un médecin très compétent.', 'C’est', ['Il est', 'Il y a', 'Voilà de']],
    ['___ intéressant de lire cet article.', 'C’est', ['Il est un', 'Voici', 'Il y a']], ['___ disponible demain.', 'Elle est', ['C’est elle', 'Il y a elle', 'Voici elle']],
  ] as const
  const [sentence, answer, wrong] = pick(rows, variant)
  return mc(`Complete: ${sentence}`, `Complétez : ${sentence}`, [answer, ...wrong], answer, 'Use il/elle est before a profession without an article or an adjective; use c’est before a noun phrase.', 'Utilisez il/elle est devant une profession sans article ou un adjectif ; utilisez c’est devant un groupe nominal.', variant)
}

function cleft(variant: number): QData {
  const rows = [
    ['Marie a préparé le rapport.', 'C’est Marie qui a préparé le rapport.', ['C’est Marie que a préparé le rapport.', 'Marie c’est qui a préparé le rapport.', 'C’est qui Marie a préparé le rapport.']],
    ['J’ai choisi cette option.', 'C’est cette option que j’ai choisie.', ['C’est cette option qui j’ai choisie.', 'Cette option c’est que j’ai choisie.', 'C’est que cette option j’ai choisi.']],
    ['Nous travaillons le mieux le matin.', 'C’est le matin que nous travaillons le mieux.', ['C’est le matin qui nous travaillons le mieux.', 'Le matin c’est qui nous travaillons.', 'C’est que le matin nous travaillons.']],
  ] as const
  const [base, answer, wrong] = pick(rows, variant)
  return mc(`Choose the correct cleft sentence to emphasize one element: ${base}`, `Choisissez la phrase clivée correcte pour mettre un élément en relief : ${base}`, [answer, ...wrong], answer, 'Use c’est ... qui for a subject and c’est ... que for an object or complement.', 'Utilisez c’est ... qui pour un sujet et c’est ... que pour un objet ou complément.', variant)
}

const groupGenerators: Record<Group, (variant: number) => QData> = {
  subjectPronouns, tuVous, articlesGender, definiteArticles, indefiniteArticles, contractedArticles, pluralNouns,
  adjectiveAgreement, adjectivePosition, possessives, presentEr, allerFaire, regularIrRe, etreAvoir, questionForms,
  interrogativeAdverbs, answerSi, interrogativePronouns, presentContinuous, demonstrativeAdjectives, numbersTime,
  placePrepositions, simpleNegation, imperative, futureProche, passeCompose, passeComposeAvoir, passeComposeEtre,
  imparfait, pcVsImparfait, recentPast,
  plusQueParfait, passeSimple, objectPronouns, pronounPlacement, yEn, doublePronouns, relativeSimple, relativeComplex,
  demonstratives, indefinites, conditionalPoliteness, futureSimple, irregularFuture, siPresentFuture, siHypothesis,
  subjunctiveObligation, timeChronology, timeExpressions, prepositions, negation, adverbs, gerund, reportedSpeech,
  comparative, superlative, connectors, cause, nominalisation, passive, register, truncation, presentatives, ilYA,
  cEstIlEst, cleft,
  mixed: (variant) => pick([
    articlesGender, presentEr, passeCompose, pcVsImparfait, objectPronouns, relativeSimple, connectors, prepositions,
    comparative, negation, timeExpressions, questionForms,
  ], variant)(variant),
}

function buildQuestion(spec: TopicSpec, variant: number): Question {
  const data = addPrefix(groupGenerators[spec.group](variant), spec, variant)
  return { id: `gq-v2-${spec.id}-${String(variant + 1).padStart(3, '0')}`, topicId: spec.id, ...data }
}

function buildQuestionBank(targetSize: number): Question[] {
  const bank: Question[] = []
  let round = 0
  while (bank.length < targetSize) {
    for (const topic of topics) {
      if (bank.length >= targetSize) break
      bank.push(buildQuestion(topic, round))
    }
    round += 1
  }
  return bank
}

export const enrichedQuestions: Question[] = buildQuestionBank(5000)
