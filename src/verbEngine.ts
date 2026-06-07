import type { VerbEntry } from './types'

// Helper to determine if text starts with a vowel or mute H
function startsWithVowel(text: string): boolean {
  return /^[aeiouyéèêëàâîïôûùœh]/i.test(text)
}

// Prefix reflexive pronouns for present, imparfait, future, subjunctive
function makeReflexive(forms: string[]): string[] {
  const pronouns = ['me', 'te', 'se', 'nous', 'vous', 'se']
  const elided = ['m’', 't’', 's’', 'nous', 'vous', 's’']
  return forms.map((form, idx) => {
    const isElided = elided[idx].endsWith('’') && startsWithVowel(form)
    const pron = isElided ? elided[idx] : pronouns[idx]
    const space = isElided ? '' : ' '
    return `${pron}${space}${form}`
  })
}

// Helpers for derivation
function deriveConditionalFromFuture(future: string[]): string[] {
  const futureEndings = ['ai', 'as', 'a', 'ons', 'ez', 'ont']
  const condEndings = ['ais', 'ais', 'ait', 'ions', 'iez', 'aient']
  return future.map((form, index) => {
    const ending = futureEndings[index]
    if (form.endsWith(ending)) {
      const stem = form.slice(0, -ending.length)
      return `${stem}${condEndings[index]}`
    }
    return form
  })
}

function deriveImperativeFromPresent(infinitive: string, present: string[]): string[] {
  let tuForm = present[1]
  const nousForm = present[3]
  const vousForm = present[4]
  
  if (infinitive.endsWith('er') || infinitive === 'aller' || infinitive.endsWith('ouvrir') || infinitive.endsWith('offrir')) {
    if (tuForm.endsWith('s')) {
      tuForm = tuForm.slice(0, -1)
    }
  }
  
  if (infinitive === 'avoir') {
    return ['', 'aie', '', 'ayons', 'ayez', '']
  }
  if (infinitive === 'être') {
    return ['', 'sois', '', 'soyons', 'soyez', '']
  }
  if (infinitive === 'savoir') {
    return ['', 'sache', '', 'sachons', 'sachiez', '']
  }
  if (infinitive === 'vouloir') {
    return ['', 'veuille', '', 'voulons', 'veuillez', '']
  }

  return ['', tuForm, '', nousForm, vousForm, '']
}

function conditionnelPasseForms(auxiliary: 'avoir' | 'etre', participle: string) {
  if (auxiliary === 'avoir') {
    return ['aurais', 'aurais', 'aurait', 'aurions', 'auriez', 'auraient'].map((aux) => `${aux} ${participle}`)
  } else {
    return [
      `serais ${participle}(e)`,
      `serais ${participle}(e)`,
      `serait ${participle}(e)`,
      `serions ${participle}(e)s`,
      `seriez ${participle}(e)(s)`,
      `seraient ${participle}(e)s`,
    ]
  }
}

function conditionnelPasseReflexive(participle: string) {
  return [
    `me serais ${participle}(e)`,
    `te serais ${participle}(e)`,
    `se serait ${participle}(e)`,
    `nous serions ${participle}(e)s`,
    `vous seriez ${participle}(e)(s)`,
    `se seraient ${participle}(e)s`,
  ]
}

function futurAnterieurForms(auxiliary: 'avoir' | 'etre', participle: string) {
  if (auxiliary === 'avoir') {
    return ['aurai', 'auras', 'aura', 'aurons', 'aurez', 'auront'].map((aux) => `${aux} ${participle}`)
  } else {
    return [
      `serai ${participle}(e)`,
      `seras ${participle}(e)`,
      `sera ${participle}(e)`,
      `serons ${participle}(e)s`,
      `serez ${participle}(e)(s)`,
      `seront ${participle}(e)s`,
    ]
  }
}

function futurAnterieurReflexive(participle: string) {
  return [
    `me serai ${participle}(e)`,
    `te seras ${participle}(e)`,
    `se sera ${participle}(e)`,
    `nous serons ${participle}(e)s`,
    `vous serez ${participle}(e)(s)`,
    `se seront ${participle}(e)s`,
  ]
}

function subjonctifPasseForms(auxiliary: 'avoir' | 'etre', participle: string) {
  if (auxiliary === 'avoir') {
    return ['aie', 'aies', 'ait', 'ayons', 'ayez', 'aient'].map((aux) => `${aux} ${participle}`)
  } else {
    return [
      `sois ${participle}(e)`,
      `sois ${participle}(e)`,
      `soit ${participle}(e)`,
      `soyons ${participle}(e)s`,
      `soyez ${participle}(e)(s)`,
      `soient ${participle}(e)s`,
    ]
  }
}

function subjonctifPasseReflexive(participle: string) {
  return [
    `me sois ${participle}(e)`,
    `te sois ${participle}(e)`,
    `se soit ${participle}(e)`,
    `nous soyons ${participle}(e)s`,
    `vous soyez ${participle}(e)(s)`,
    `se soient ${participle}(e)s`,
  ]
}

// Root generator similar to seed.ts
function makeVerbEntry(
  id: string,
  infinitive: string,
  meaning: string,
  level: VerbEntry['level'],
  group: VerbEntry['group'],
  auxiliary: VerbEntry['auxiliary'],
  reflexive: boolean,
  forms: Record<string, string[]>,
): VerbEntry {
  const derived: Record<string, string[]> = { ...forms }

  if (!derived.conditionnelPresent && derived.futurSimple) {
    derived.conditionnelPresent = deriveConditionalFromFuture(derived.futurSimple)
  }

  if (!derived.imperative && derived.present) {
    derived.imperative = deriveImperativeFromPresent(infinitive, derived.present)
  }

  if ((level === 'B1' || level === 'B2') && derived.passeCompose) {
    const parts = derived.passeCompose[0].split(' ')
    const participle = parts[parts.length - 1]
    
    if (!derived.conditionnelPasse) {
      derived.conditionnelPasse = reflexive 
        ? conditionnelPasseReflexive(participle)
        : conditionnelPasseForms(auxiliary, participle)
    }
    if (!derived.futurAnterieur) {
      derived.futurAnterieur = reflexive
        ? futurAnterieurReflexive(participle)
        : futurAnterieurForms(auxiliary, participle)
    }
    if (!derived.subjonctifPasse) {
      derived.subjonctifPasse = reflexive
        ? subjonctifPasseReflexive(participle)
        : subjonctifPasseForms(auxiliary, participle)
    }
  }

  const persons = ['je', 'tu', 'il/elle', 'nous', 'vous', 'ils/elles']
  const conjugations = Object.fromEntries(
    Object.entries(derived).map(([tense, values]) => [
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
    mastery: Object.fromEntries(Object.keys(derived).map((tense, index) => [tense, 35 + index * 8])),
  }
}

// ----------------------------------------------------
// Compact raw verb list
// Format: [infinitive, meaning, level, pattern, auxiliary, reflexive]
// patterns:
//   'er' (regular -er)
//   'ir' (regular -ir)
//   're' (regular -re)
//   'ger' (manger, changer...)
//   'cer' (commencer, avancer...)
//   'eler' (appeler...)
//   'eter' (jeter...)
//   'acheter' (acheter, lever...)
//   'preferer' (préférer, espérer...)
//   'yer' (payer, employer...)
//   'prendre' (prendre, comprendre...)
//   'venir' (venir, tenir, devenir...)
//   'conduire' (conduire, traduire...)
//   'craindre' (craindre, plaindre...)
//   'mettre' (mettre, promettre...)
//   'ecrire' (écrire, décrire...)
//   'ouvrir' (ouvrir, offrir...)
//   'sentir' (sentir, partir, sortir...)
//   'lire' (lire...)
//   'battre' (battre...)
//   'vivre' (vivre...)
//   'unique' (unique irregulars)
// ----------------------------------------------------

const rawVerbsList: [string, string, VerbEntry['level'], string, VerbEntry['auxiliary'], boolean][] = [
  // A1 Verbs
  ['parler', 'to speak', 'A1', 'er', 'avoir', false],
  ['aimer', 'to like / love', 'A1', 'er', 'avoir', false],
  ['adorer', 'to adore', 'A1', 'er', 'avoir', false],
  ['détester', 'to hate', 'A1', 'er', 'avoir', false],
  ['habiter', 'to live', 'A1', 'er', 'avoir', false],
  ['travailler', 'to work', 'A1', 'er', 'avoir', false],
  ['étudier', 'to study', 'A1', 'er', 'avoir', false],
  ['écouter', 'to listen', 'A1', 'er', 'avoir', false],
  ['regarder', 'to watch', 'A1', 'er', 'avoir', false],
  ['chercher', 'to search for', 'A1', 'er', 'avoir', false],
  ['trouver', 'to find', 'A1', 'er', 'avoir', false],
  ['donner', 'to give', 'A1', 'er', 'avoir', false],
  ['demander', 'to ask', 'A1', 'er', 'avoir', false],
  ['penser', 'to think', 'A1', 'er', 'avoir', false],
  ['arriver', 'to arrive', 'A1', 'er', 'etre', false],
  ['rester', 'to stay', 'A1', 'er', 'etre', false],
  ['entrer', 'to enter', 'A1', 'er', 'etre', false],
  ['monter', 'to climb / go up', 'A1', 'er', 'etre', false],
  ['tomber', 'to fall', 'A1', 'er', 'etre', false],
  ['porter', 'to carry / wear', 'A1', 'er', 'avoir', false],
  ['visiter', 'to visit (a place)', 'A1', 'er', 'avoir', false],
  ['jouer', 'to play', 'A1', 'er', 'avoir', false],
  ['chanter', 'to sing', 'A1', 'er', 'avoir', false],
  ['danser', 'to dance', 'A1', 'er', 'avoir', false],
  ['manger', 'to eat', 'A1', 'ger', 'avoir', false],
  ['voyager', 'to travel', 'A1', 'ger', 'avoir', false],
  ['partager', 'to share', 'A1', 'ger', 'avoir', false],
  ['commencer', 'to begin', 'A1', 'cer', 'avoir', false],
  ['acheter', 'to buy', 'A1', 'acheter', 'avoir', false],
  ['préférer', 'to prefer', 'A1', 'preferer', 'avoir', false],
  ['espérer', 'to hope', 'A1', 'preferer', 'avoir', false],
  ['s’appeler', 'to be named', 'A1', 'eler', 'etre', true],
  ['finir', 'to finish', 'A1', 'ir', 'avoir', false],
  ['choisir', 'to choose', 'A1', 'ir', 'avoir', false],
  ['réussir', 'to succeed', 'A1', 'ir', 'avoir', false],
  ['vendre', 'to sell', 'A1', 're', 'avoir', false],
  ['attendre', 'to wait for', 'A1', 're', 'avoir', false],
  ['perdre', 'to lose', 'A1', 're', 'avoir', false],
  ['entendre', 'to hear', 'A1', 're', 'avoir', false],
  ['descendre', 'to go down', 'A1', 're', 'etre', false],
  ['répondre', 'to answer', 'A1', 're', 'avoir', false],
  ['rendre', 'to return / give back', 'A1', 're', 'avoir', false],

  // A2 Verbs
  ['fermer', 'to close', 'A2', 'er', 'avoir', false],
  ['ouvrir', 'to open', 'A2', 'ouvrir', 'avoir', false],
  ['offrir', 'to offer / give', 'A2', 'ouvrir', 'avoir', false],
  ['souffrir', 'to suffer', 'A2', 'ouvrir', 'avoir', false],
  ['couvrir', 'to cover', 'A2', 'ouvrir', 'avoir', false],
  ['sortir', 'to go out', 'A2', 'sentir', 'etre', false],
  ['partir', 'to leave', 'A2', 'sentir', 'etre', false],
  ['dormir', 'to sleep', 'A2', 'sentir', 'avoir', false],
  ['servir', 'to serve', 'A2', 'sentir', 'avoir', false],
  ['sentir', 'to feel / smell', 'A2', 'sentir', 'avoir', false],
  ['mentir', 'to lie', 'A2', 'sentir', 'avoir', false],
  ['se lever', 'to get up', 'A2', 'acheter', 'etre', true],
  ['se coucher', 'to go to bed', 'A2', 'er', 'etre', true],
  ['se préparer', 'to get ready', 'A2', 'er', 'etre', true],
  ['se laver', 'to wash oneself', 'A2', 'er', 'etre', true],
  ['se promener', 'to take a walk', 'A2', 'acheter', 'etre', true],
  ['se sentir', 'to feel (healthy/emotion)', 'A2', 'sentir', 'etre', true],
  ['inviter', 'to invite', 'A2', 'er', 'avoir', false],
  ['visiter', 'to visit a place', 'A2', 'er', 'avoir', false],
  ['rencontrer', 'to meet', 'A2', 'er', 'avoir', false],
  ['accompagner', 'to accompany', 'A2', 'er', 'avoir', false],
  ['apporter', 'to bring (thing)', 'A2', 'er', 'avoir', false],
  ['emmener', 'to take (person)', 'A2', 'acheter', 'avoir', false],
  ['amener', 'to bring (person)', 'A2', 'acheter', 'avoir', false],
  ['emporter', 'to take (thing)', 'A2', 'er', 'avoir', false],
  ['laisser', 'to leave / let', 'A2', 'er', 'avoir', false],
  ['oublier', 'to forget', 'A2', 'er', 'avoir', false],
  ['garder', 'to keep', 'A2', 'er', 'avoir', false],
  ['ranger', 'to tidy up', 'A2', 'ger', 'avoir', false],
  ['changer', 'to change', 'A2', 'ger', 'avoir', false],
  ['bouger', 'to move', 'A2', 'ger', 'avoir', false],
  ['nager', 'to swim', 'A2', 'ger', 'avoir', false],
  ['déranger', 'to disturb', 'A2', 'ger', 'avoir', false],
  ['commencer', 'to start', 'A2', 'cer', 'avoir', false],
  ['placer', 'to place', 'A2', 'cer', 'avoir', false],
  ['remplacer', 'to replace', 'A2', 'cer', 'avoir', false],
  ['payer', 'to pay', 'A2', 'yer', 'avoir', false],
  ['essayer', 'to try', 'A2', 'yer', 'avoir', false],
  ['envoyer', 'to send', 'A2', 'unique', 'avoir', false],
  ['courir', 'to run', 'A2', 'unique', 'avoir', false],
  ['mourir', 'to die', 'A2', 'unique', 'etre', false],
  ['naître', 'to be born', 'A2', 'unique', 'etre', false],
  ['conduire', 'to drive', 'A2', 'conduire', 'avoir', false],
  ['construire', 'to build', 'A2', 'conduire', 'avoir', false],
  ['traduire', 'to translate', 'A2', 'conduire', 'avoir', false],
  ['produire', 'to produce', 'A2', 'conduire', 'avoir', false],
  ['détruire', 'to destroy', 'A2', 'conduire', 'avoir', false],
  ['lire', 'to read', 'A2', 'unique', 'avoir', false],
  ['écrire', 'to write', 'A2', 'ecrire', 'avoir', false],
  ['décrire', 'to describe', 'A2', 'ecrire', 'avoir', false],
  ['boire', 'to drink', 'A2', 'unique', 'avoir', false],
  ['croire', 'to believe', 'A2', 'unique', 'avoir', false],
  ['craindre', 'to fear', 'A2', 'craindre', 'avoir', false],
  ['plaindre', 'to pity / complain', 'A2', 'craindre', 'avoir', false],
  ['se plaindre', 'to complain', 'A2', 'craindre', 'etre', true],
  ['recevoir', 'to receive', 'A2', 'unique', 'avoir', false],
  ['apercevoir', 'to perceive / notice', 'A2', 'unique', 'avoir', false],
  ['plaire', 'to please', 'A2', 'unique', 'avoir', false],
  ['rire', 'to laugh', 'A2', 'unique', 'avoir', false],
  ['sourire', 'to smile', 'A2', 'unique', 'avoir', false],
  ['suivre', 'to follow', 'A2', 'unique', 'avoir', false],
  ['vivre', 'to live', 'A2', 'vivre', 'avoir', false],
  ['battre', 'to beat', 'A2', 'battre', 'avoir', false],
  ['remplir', 'to fill', 'A2', 'ir', 'avoir', false],
  ['grandir', 'to grow', 'A2', 'ir', 'avoir', false],
  ['obéir', 'to obey', 'A2', 'ir', 'avoir', false],
  ['punir', 'to punish', 'A2', 'ir', 'avoir', false],
  ['réfléchir', 'to reflect / think', 'A2', 'ir', 'avoir', false],
  ['agir', 'to act', 'A2', 'ir', 'avoir', false],
  ['bâtir', 'to build', 'A2', 'ir', 'avoir', false],
  ['défendre', 'to defend', 'A2', 're', 'avoir', false],
  ['prétendre', 'to claim', 'A2', 're', 'avoir', false],
  ['confondre', 'to confuse', 'A2', 're', 'avoir', false],
  ['perdre', 'to lose', 'A2', 're', 'avoir', false],

  // B1 Verbs
  ['appartenir', 'to belong', 'B1', 'venir', 'avoir', false],
  ['obtenir', 'to obtain', 'B1', 'venir', 'avoir', false],
  ['convenir', 'to suit / agree', 'B1', 'venir', 'avoir', false],
  ['prévenir', 'to warn', 'B1', 'venir', 'avoir', false],
  ['devenir', 'to become', 'B1', 'venir', 'etre', false],
  ['revenir', 'to return', 'B1', 'venir', 'etre', false],
  ['se souvenir', 'to remember', 'B1', 'venir', 'etre', true],
  ['retenir', 'to retain', 'B1', 'venir', 'avoir', false],
  ['soutenir', 'to support', 'B1', 'venir', 'avoir', false],
  ['maintenir', 'to maintain', 'B1', 'venir', 'avoir', false],
  ['contenir', 'to contain', 'B1', 'venir', 'avoir', false],
  ['apprendre', 'to learn', 'B1', 'prendre', 'avoir', false],
  ['comprendre', 'to understand', 'B1', 'prendre', 'avoir', false],
  ['surprendre', 'to surprise', 'B1', 'prendre', 'avoir', false],
  ['reprendre', 'to resume / take back', 'B1', 'prendre', 'avoir', false],
  ['entreprendre', 'to undertake', 'B1', 'prendre', 'avoir', false],
  ['permettre', 'to permit / allow', 'B1', 'mettre', 'avoir', false],
  ['promettre', 'to promise', 'B1', 'mettre', 'avoir', false],
  ['admettre', 'to admit', 'B1', 'mettre', 'avoir', false],
  ['soumettre', 'to submit', 'B1', 'mettre', 'avoir', false],
  ['transmettre', 'to transmit', 'B1', 'mettre', 'avoir', false],
  ['commettre', 'to commit', 'B1', 'mettre', 'avoir', false],
  ['omettre', 'to omit', 'B1', 'mettre', 'avoir', false],
  ['découvrir', 'to discover', 'B1', 'ouvrir', 'avoir', false],
  ['éteindre', 'to switch off', 'B1', 'craindre', 'avoir', false],
  ['atteindre', 'to reach', 'B1', 'craindre', 'avoir', false],
  ['joindre', 'to join', 'B1', 'craindre', 'avoir', false],
  ['résoudre', 'to solve', 'B1', 'unique', 'avoir', false],
  ['interdire', 'to forbid', 'B1', 'unique', 'avoir', false],
  ['se réjouir', 'to rejoice', 'B1', 'ir', 'etre', true],
  ['nourrir', 'to feed', 'B1', 'ir', 'avoir', false],
  ['subir', 'to undergo / suffer', 'B1', 'ir', 'avoir', false],
  ['définir', 'to define', 'B1', 'ir', 'avoir', false],
  ['réagir', 'to react', 'B1', 'ir', 'avoir', false],
  ['garantir', 'to guarantee', 'B1', 'ir', 'avoir', false],
  ['avertir', 'to warn', 'B1', 'ir', 'avoir', false],
  ['établir', 'to establish', 'B1', 'ir', 'avoir', false],
  ['réunir', 'to gather', 'B1', 'ir', 'avoir', false],
  ['ralentir', 'to slow down', 'B1', 'ir', 'avoir', false],
  ['décevoir', 'to disappoint', 'B1', 'unique', 'avoir', false],
  ['valoir', 'to be worth', 'B1', 'unique', 'avoir', false],
  ['se dépêcher', 'to hurry', 'B1', 'er', 'etre', true],
  ['se tromper', 'to make a mistake', 'B1', 'er', 'etre', true],
  ['s’occuper', 'to take care of', 'B1', 'er', 'etre', true],
  ['se disputer', 'to argue', 'B1', 'er', 'etre', true],
  ['se marier', 'to get married', 'B1', 'er', 'etre', true],
  ['s’intéresser', 'to be interested', 'B1', 'er', 'etre', true],
  ['se débrouiller', 'to manage / get by', 'B1', 'er', 'etre', true],
  ['se rendre', 'to go / surrender', 'B1', 're', 'etre', true],

  // B2 Verbs & Extra common verbs to reach 500
  // (We'll generate the rest of the list systematically by pushing standard verbs)
]

// Add extra verbs dynamically to reach 500
// Regular ER verbs:
const extraErVerbs: [string, string, VerbEntry['level']][] = [
  ['accepter', 'to accept', 'A2'],
  ['accuser', 'to accuse', 'B1'],
  ['acheter', 'to buy', 'A1'],
  ['achever', 'to complete', 'B1'],
  ['adapter', 'to adapt', 'B1'],
  ['admirer', 'to admire', 'A2'],
  ['adresser', 'to address', 'B1'],
  ['afficher', 'to display', 'B1'],
  ['affirmer', 'to assert', 'B2'],
  ['aider', 'to help', 'A1'],
  ['ajouter', 'to add', 'A2'],
  ['alerter', 'to alert', 'B1'],
  ['allumer', 'to light', 'A2'],
  ['analyser', 'to analyze', 'B1'],
  ['annoncer', 'to announce', 'A2'],
  ['annuler', 'to cancel', 'A2'],
  ['anticiper', 'to anticipate', 'B2'],
  ['apercevoir', 'to spot', 'B1'],
  ['apparaître', 'to appear', 'B1'],
  ['appeler', 'to call', 'A1'],
  ['appliquer', 'to apply', 'B1'],
  ['apporter', 'to bring', 'A2'],
  ['apprécier', 'to appreciate', 'B1'],
  ['approuver', 'to approve', 'B2'],
  ['appuyer', 'to support', 'B1'],
  ['arrêter', 'to stop', 'A2'],
  ['arroser', 'to water', 'A2'],
  ['aspirer', 'to vacuum / inhale', 'B1'],
  ['associer', 'to associate', 'B1'],
  ['assumer', 'to assume', 'B2'],
  ['assurer', 'to ensure', 'B1'],
  ['attacher', 'to attach', 'A2'],
  ['attaquer', 'to attack', 'B1'],
  ['attirer', 'to attract', 'B1'],
  ['attraper', 'to catch', 'A2'],
  ['augmenter', 'to increase', 'B1'],
  ['autoriser', 'to authorize', 'B1'],
  ['avancer', 'to advance', 'A2'],
  ['avouer', 'to confess', 'B1'],
  ['baisser', 'to lower', 'A2'],
  ['balayer', 'to sweep', 'A2'],
  ['bâtir', 'to build', 'A2'],
  ['bavarder', 'to chat', 'A2'],
  ['blesser', 'to hurt', 'B1'],
  ['bloquer', 'to block', 'B1'],
  ['briller', 'to shine', 'A2'],
  ['brûler', 'to burn', 'A2'],
  ['cacher', 'to hide', 'A2'],
  ['calculer', 'to calculate', 'B1'],
  ['calmer', 'to calm', 'A2'],
  ['capter', 'to capture / grab', 'B2'],
  ['casser', 'to break', 'A2'],
  ['causer', 'to cause / chat', 'B1'],
  ['célébrer', 'to celebrate', 'A2'],
  ['cesser', 'to cease', 'B1'],
  ['chauffer', 'to heat', 'A2'],
  ['chuchoter', 'to whisper', 'B1'],
  ['citer', 'to quote', 'B1'],
  ['claquer', 'to slam', 'B2'],
  ['classer', 'to classify', 'B1'],
  ['coller', 'to glue', 'A2'],
  ['collectionner', 'to collect', 'A2'],
  ['commander', 'to order', 'A2'],
  ['commencer', 'to start', 'A1'],
  ['commenter', 'to comment', 'B1'],
  ['comparer', 'to compare', 'A2'],
  ['compléter', 'to complete', 'A2'],
  ['composer', 'to compose', 'B1'],
  ['compter', 'to count', 'A2'],
  ['concentrer', 'to concentrate', 'B1'],
  ['concerner', 'to concern', 'B1'],
  ['condamner', 'to condemn', 'B2'],
  ['confirmer', 'to confirm', 'A2'],
  ['confier', 'to entrust', 'B1'],
  ['conseiller', 'to advise', 'B1'],
  ['considérer', 'to consider', 'B1'],
  ['consommer', 'to consume', 'B1'],
  ['constater', 'to note / record', 'B2'],
  ['consulter', 'to consult', 'B1'],
  ['contacter', 'to contact', 'A2'],
  ['continuer', 'to continue', 'A1'],
  ['contrôler', 'to control', 'B1'],
  ['copier', 'to copy', 'A1'],
  ['corriger', 'to correct', 'A2'],
  ['coucher', 'to lay down', 'A2'],
  ['couper', 'to cut', 'A2'],
  ['coûter', 'to cost', 'A1'],
  ['cracher', 'to spit', 'B2'],
  ['créer', 'to create', 'B1'],
  ['crier', 'to shout', 'A2'],
  ['cultiver', 'to cultivate', 'B1'],
  ['débarrasser', 'to clear', 'B1'],
  ['décider', 'to decide', 'A2'],
  ['déclarer', 'to declare', 'B1'],
  ['décoller', 'to take off', 'A2'],
  ['décorer', 'to decorate', 'A2'],
  ['décourager', 'to discourage', 'B1'],
  ['dédier', 'to dedicate', 'B2'],
  ['défendre', 'to forbid / defend', 'B1'],
  ['défiler', 'to march / scroll', 'B1'],
  ['déjeuner', 'to have lunch', 'A1'],
  ['délivrer', 'to deliver / free', 'B2'],
  ['demander', 'to ask', 'A1'],
  ['déménager', 'to move house', 'A2'],
  ['demeurer', 'to remain', 'B2'],
  ['démontrer', 'to demonstrate', 'B2'],
  ['dénoncer', 'to denounce', 'B2'],
  ['dépasser', 'to exceed', 'B1'],
  ['dépenser', 'to spend (money)', 'A2'],
  ['déplacer', 'to move', 'A2'],
  ['déposer', 'to deposit / drop off', 'B1'],
  ['déprimer', 'to depress', 'B1'],
  ['déranger', 'to disturb', 'A2'],
  ['dérouler', 'to unfold / take place', 'B1'],
  ['dessiner', 'to draw', 'A1'],
  ['détester', 'to hate', 'A1'],
  ['diffuser', 'to broadcast', 'B1'],
  ['diminuer', 'to decrease', 'B1'],
  ['dîner', 'to have dinner', 'A1'],
  ['diriger', 'to direct', 'B1'],
  ['discuter', 'to discuss', 'A2'],
  ['différer', 'to differ', 'B2'],
  ['diviser', 'to divide', 'B1'],
  ['dominer', 'to dominate', 'B2'],
  ['donner', 'to give', 'A1'],
  ['doubler', 'to double / overtake', 'B1'],
  ['douter', 'to doubt', 'B1'],
  ['durera', 'to last', 'A2'],
  ['échapper', 'to escape', 'B1'],
  ['échouer', 'to fail', 'B1'],
  ['éclairer', 'to light up', 'B1'],
  ['éclater', 'to burst / explode', 'B2'],
  ['économiser', 'to save', 'A2'],
  ['écouter', 'to listen', 'A1'],
  ['écraser', 'to crush / run over', 'B1'],
  ['effacer', 'to erase', 'A2'],
  ['effectuer', 'to carry out', 'B2'],
  ['égaler', 'to equal', 'B2'],
  ['éviter', 'to avoid', 'B1'],
  ['élever', 'to raise', 'B1'],
  ['éliminer', 'to eliminate', 'B2'],
  ['embrasser', 'to kiss / embrace', 'A2'],
  ['emmener', 'to take along', 'A2'],
  ['empecher', 'to prevent', 'B1'],
  ['employer', 'to employ', 'B1'],
  ['emporter', 'to take away', 'A2'],
  ['emprunter', 'to borrow', 'A2'],
  ['encourager', 'to encourage', 'B1'],
  ['enlever', 'to remove', 'A2'],
  ['enregistrer', 'to record / check in', 'B1'],
  ['enseigner', 'to teach', 'A2'],
  ['entendre', 'to hear', 'A2'],
  ['enterrer', 'to bury', 'B2'],
  ['entraîner', 'to train / lead to', 'B1'],
  ['entrer', 'to enter', 'A1'],
  ['envisager', 'to envisage / consider', 'B2'],
  ['épouser', 'to marry', 'B1'],
  ['éprouver', 'to feel / experience', 'B2'],
  ['espérer', 'to hope', 'A2'],
  ['essayer', 'to try', 'A2'],
  ['essuyer', 'to wipe', 'A2'],
  ['estimer', 'to estimate', 'B1'],
  ['établir', 'to establish', 'B1'],
  ['étaler', 'to spread out', 'B1'],
  ['éteindre', 'to turn off', 'A2'],
  ['étudier', 'to study', 'A1'],
  ['évaluer', 'to evaluate', 'B2'],
  ['éveiller', 'to awaken', 'B2'],
  ['éviter', 'to avoid', 'B1'],
  ['évoluer', 'to evolve', 'B1'],
  ['exagérer', 'to exaggerate', 'B1'],
  ['examiner', 'to examine', 'B1'],
  ['exclure', 'to exclude', 'B2'],
  ['excuser', 'to excuse', 'A1'],
  ['exécuter', 'to execute', 'B2'],
  ['exercer', 'to exercise', 'B1'],
  ['exiger', 'to demand', 'B2'],
  ['exister', 'to exist', 'B1'],
  ['expédier', 'to dispatch / send', 'B2'],
  ['expliquer', 'to explain', 'A2'],
  ['explorer', 'to explore', 'B1'],
  ['exprimer', 'to express', 'B1'],
  ['fabriquer', 'to manufacture', 'B1'],
  ['faciliter', 'to facilitate', 'B2'],
  ['fêter', 'to celebrate / party', 'A2'],
  ['figurer', 'to figure / appear', 'B2'],
  ['fixer', 'to fix / stare', 'B1'],
  ['flotter', 'to float', 'B2'],
  ['former', 'to form / train', 'B1'],
  ['formuler', 'to formulate', 'B2'],
  ['frapper', 'to knock / hit', 'A2'],
  ['fréquenter', 'to frequent / visit', 'B1'],
  ['fumer', 'to smoke', 'A1'],
  ['gagner', 'to win / earn', 'A1'],
  ['garder', 'to keep', 'A2'],
  ['gaspiller', 'to waste', 'B1'],
  ['gâter', 'to spoil', 'B1'],
  ['geler', 'to freeze', 'B1'],
  ['gêner', 'to bother / embarrass', 'B1'],
  ['gérer', 'to manage', 'B1'],
  ['glisser', 'to slide / slip', 'B1'],
  ['goûter', 'to taste', 'A2'],
  ['gratter', 'to scratch', 'B1'],
  ['grimper', 'to climb', 'A2'],
  ['gronder', 'to scold', 'A2'],
  ['guider', 'to guide', 'B1'],
  ['habiter', 'to live / dwell', 'A1'],
  ['habiller', 'to dress', 'A2'],
  ['hésiter', 'to hesitate', 'B1'],
  ['heurter', 'to bump into', 'B2'],
  ['honorer', 'to honor', 'B2'],
  ['ignorer', 'to ignore / not know', 'B1'],
  ['illustrer', 'to illustrate', 'B1'],
  ['imaginer', 'to imagine', 'A2'],
  ['imiter', 'to imitate', 'B1'],
  ['importer', 'to import', 'B1'],
  ['imposer', 'to impose', 'B2'],
  ['imprimer', 'to print', 'A2'],
  ['inaugurer', 'to inaugurate', 'B2'],
  ['inciter', 'to incite / prompt', 'B2'],
  ['indiquer', 'to indicate', 'A2'],
  ['influencer', 'to influence', 'B1'],
  ['informer', 'to inform', 'A2'],
  ['initier', 'to initiate', 'B2'],
  ['inquiéter', 'to worry', 'A2'],
  ['insister', 'to insist', 'B1'],
  ['inspirer', 'to inspire', 'B1'],
  ['installer', 'to install', 'A2'],
  ['intégrer', 'to integrate', 'B2'],
  ['interroger', 'to question', 'A2'],
  ['inventer', 'to invent', 'B1'],
  ['inviter', 'to invite', 'A1'],
  ['isoler', 'to isolate', 'B2'],
  ['jeter', 'to throw', 'A2'],
  ['jouer', 'to play', 'A1'],
  ['juger', 'to judge', 'B1'],
  ['jurer', 'to swear', 'B1'],
  ['justifier', 'to justify', 'B2'],
  ['laisser', 'to leave', 'A2'],
  ['lancer', 'to throw / launch', 'A2'],
  ['laver', 'to wash', 'A2'],
  ['lever', 'to raise / lift', 'A2'],
  ['libérer', 'to free', 'B1'],
  ['limiter', 'to limit', 'B1'],
  ['livrer', 'to deliver', 'B1'],
  ['loger', 'to lodge / house', 'B1'],
  ['louer', 'to rent / praise', 'A2'],
  ['lutter', 'to struggle / fight', 'B2'],
  ['mâcher', 'to chew', 'B1'],
  ['manquer', 'to miss / lack', 'A2'],
  ['manifester', 'to protest / manifest', 'B1'],
  ['manipuler', 'to manipulate', 'B2'],
  ['marcher', 'to walk / function', 'A1'],
  ['marquer', 'to mark / score', 'A2'],
  ['masquer', 'to mask / hide', 'B1'],
  ['mélanger', 'to mix', 'A2'],
  ['menacer', 'to threaten', 'B1'],
  ['mener', 'to lead', 'B1'],
  ['mentionner', 'to mention', 'B1'],
  ['mériter', 'to deserve', 'B1'],
  ['mesurer', 'to measure', 'B1'],
  ['monter', 'to climb', 'A2'],
  ['montrer', 'to show', 'A2'],
  ['moquer', 'to mock', 'B1'],
  ['motiver', 'to motivate', 'B1'],
  ['mouiller', 'to wet', 'B1'],
  ['murmurer', 'to murmur', 'B1'],
  ['nager', 'to swim', 'A1'],
  ['naviguer', 'to navigate', 'A2'],
  ['négliger', 'to neglect', 'B2'],
  ['négocier', 'to negotiate', 'B2'],
  ['nettoyer', 'to clean', 'A2'],
  ['nommer', 'to name', 'B1'],
  ['noter', 'to note / write down', 'A2'],
  ['nouer', 'to tie', 'B2'],
  ['nourrir', 'to feed', 'B1'],
  ['noyer', 'to drown', 'B2'],
  ['obéir', 'to obey', 'A2'],
  ['obliger', 'to oblige', 'B1'],
  ['observer', 'to observe', 'B1'],
  ['occuper', 'to occupy', 'A2'],
  ['offenser', 'to offend', 'B2'],
  ['opérer', 'to operate', 'B2'],
  ['opposer', 'to oppose', 'B2'],
  ['ordonner', 'to order', 'B1'],
  ['organiser', 'to organize', 'A2'],
  ['orienter', 'to orient', 'B2'],
  ['oser', 'to dare', 'B1'],
  ['oublier', 'to forget', 'A1'],
  ['payer', 'to pay', 'A1'],
  ['pénétrer', 'to penetrate', 'B2'],
  ['penser', 'to think', 'A1'],
  ['percer', 'to pierce', 'B2'],
  ['peser', 'to weigh', 'A2'],
  ['pincer', 'to pinch', 'B1'],
  ['piquer', 'to sting / poke', 'B1'],
  ['placer', 'to place', 'A2'],
  ['plaisanter', 'to joke', 'A2'],
  ['planifier', 'to plan', 'A2'],
  ['planter', 'to plant', 'A2'],
  ['pleurer', 'to cry', 'A2'],
  ['plier', 'to fold', 'B1'],
  ['plonger', 'to dive', 'B1'],
  ['porter', 'to wear', 'A1'],
  ['poser', 'to put down / ask (question)', 'A2'],
  ['posséder', 'to possess', 'B1'],
  ['pousser', 'to push / grow', 'A2'],
  ['pratiquer', 'to practice', 'A2'],
  ['préciser', 'to specify', 'B1'],
  ['prédire', 'to predict', 'B1'],
  ['préférer', 'to prefer', 'A1'],
  ['préparer', 'to prepare', 'A2'],
  ['présenter', 'to present', 'A2'],
  ['préserver', 'to preserve', 'B1'],
  ['presser', 'to squeeze / press', 'B1'],
  ['prêter', 'to lend', 'A2'],
  ['priver', 'to deprive', 'B2'],
  ['privilégier', 'to privilege', 'B2'],
  ['procéder', 'to proceed', 'B2'],
  ['procurer', 'to procure', 'B2'],
  ['profiter', 'to benefit / take advantage', 'B1'],
  ['programmer', 'to program', 'A2'],
  ['progresser', 'to progress', 'B1'],
  ['projeter', 'to project / plan', 'B2'],
  ['prolonger', 'to prolong', 'B2'],
  ['promener', 'to walk', 'A2'],
  ['prononcer', 'to pronounce', 'A2'],
  ['proposer', 'to propose', 'A2'],
  ['protéger', 'to protect', 'B1'],
  ['prouver', 'to prove', 'B1'],
  ['publier', 'to publish', 'B1'],
  ['qualifier', 'to qualify', 'B2'],
  ['quitter', 'to leave', 'A2'],
  ['raconter', 'to tell (a story)', 'A2'],
  ['ralentir', 'to slow down', 'B1'],
  ['ramasser', 'to pick up', 'A2'],
  ['ramener', 'to bring back', 'B1'],
  ['ranger', 'to tidy', 'A1'],
  ['rappeler', 'to recall / call back', 'A2'],
  ['rapporter', 'to bring back / report', 'B1'],
  ['rapprocher', 'to bring closer', 'B2'],
  ['raser', 'to shave', 'A2'],
  ['rassurer', 'to reassure', 'B1'],
  ['rater', 'to miss / fail', 'A2'],
  ['réaliser', 'to realize / achieve', 'B1'],
  ['rechercher', 'to search for', 'B1'],
  ['réclamer', 'to claim / demand', 'B2'],
  ['recommander', 'to recommend', 'B1'],
  ['recommencer', 'to start again', 'A2'],
  ['récolter', 'to harvest', 'B1'],
  ['recruter', 'to recruit', 'B2'],
  ['reculer', 'to back up', 'B1'],
  ['rédiger', 'to draft / write', 'B1'],
  ['réduire', 'to reduce', 'B1'],
  ['réfléchir', 'to think', 'A2'],
  ['refuser', 'to refuse', 'A2'],
  ['regarder', 'to look at', 'A1'],
  ['regretter', 'to regret', 'A2'],
  ['rejeter', 'to reject', 'B2'],
  ['relâcher', 'to release', 'B2'],
  ['relever', 'to raise / note', 'B1'],
  ['remarquer', 'to notice', 'A2'],
  ['rembourser', 'to refund', 'B1'],
  ['remédier', 'to remedy', 'B2'],
  ['remercier', 'to thank', 'A2'],
  ['remettre', 'to hand in / put back', 'B1'],
  ['remplacer', 'to replace', 'A2'],
  ['remporter', 'to win', 'B2'],
  ['renforcer', 'to reinforce', 'B2'],
  ['renoncer', 'to renounce', 'B2'],
  ['renouveler', 'to renew', 'B2'],
  ['renseigner', 'to provide info', 'B1'],
  ['rentrer', 'to return home', 'A1'],
  ['renverser', 'to spill / run over', 'B1'],
  ['renvoyer', 'to send back / dismiss', 'B1'],
  ['répandre', 'to spread', 'B2'],
  ['répéter', 'to repeat', 'A2'],
  ['représenter', 'to represent', 'B1'],
  ['reprocher', 'to reproach', 'B2'],
  ['réserver', 'to reserve', 'A2'],
  ['résigner', 'to resign', 'B2'],
  ['résister', 'to resist', 'B1'],
  ['respecter', 'to respect', 'B1'],
  ['respirer', 'to breathe', 'A2'],
  ['ressembler', 'to look like', 'B1'],
  ['rester', 'to remain', 'A1'],
  ['restaurer', 'to restore', 'B2'],
  ['retarder', 'to delay', 'B1'],
  ['retirer', 'to withdraw / take off', 'B1'],
  ['retourner', 'to return / turn back', 'A1'],
  ['réunir', 'to gather', 'B1'],
  ['réussir', 'to succeed', 'A1'],
  ['révéler', 'to reveal', 'B2'],
  ['rêver', 'to dream', 'A2'],
  ['réviser', 'to revise', 'A2'],
  ['risquer', 'to risk', 'B1'],
  ['rouler', 'to roll / drive', 'A2'],
  ['ruiner', 'to ruin', 'B2'],
  ['sauter', 'to jump', 'A2'],
  ['sauver', 'to save', 'A2'],
  ['secouer', 'to shake', 'B1'],
  ['sélectionner', 'to select', 'A2'],
  ['sembler', 'to seem', 'A2'],
  ['séparer', 'to separate', 'B1'],
  ['serrer', 'to squeeze / shake hands', 'B1'],
  ['siffler', 'to whistle', 'B1'],
  ['signaler', 'to report', 'B1'],
  ['signer', 'to sign', 'A2'],
  ['simplifier', 'to simplify', 'B1'],
  ['situer', 'to situate', 'A2'],
  ['soigner', 'to treat / care for', 'B1'],
  ['solliciter', 'to solicit / request', 'B2'],
  ['songer', 'to ponder / dream', 'B2'],
  ['sonner', 'to ring', 'A2'],
  ['souffler', 'to blow', 'A2'],
  ['souhaiter', 'to wish', 'A2'],
  ['soupçonner', 'to suspect', 'B2'],
  ['stabiliser', 'to stabilize', 'B2'],
  ['stocker', 'to stock / store', 'B1'],
  ['stresser', 'to stress', 'B1'],
  ['subir', 'to undergo', 'B1'],
  ['suggérer', 'to suggest', 'B1'],
  ['supporter', 'to tolerate / support', 'B1'],
  ['supprimer', 'to delete', 'B1'],
  ['surchauffer', 'to overheat', 'B2'],
  ['surveiller', 'to watch over', 'B1'],
  ['taper', 'to type / hit', 'A2'],
  ['tarder', 'to be late', 'B2'],
  ['tâcher', 'to stain / try', 'B2'],
  ['télécharger', 'to download', 'A2'],
  ['téléphoner', 'to telephone', 'A1'],
  ['tenter', 'to try / tempt', 'B1'],
  ['terminer', 'to end / finish', 'A2'],
  ['tirer', 'to pull / shoot', 'A2'],
  ['tolérer', 'to tolerate', 'B1'],
  ['tomber', 'to fall', 'A1'],
  ['toucher', 'to touch', 'A2'],
  ['tourner', 'to turn', 'A1'],
  ['tousser', 'to cough', 'A2'],
  ['traiter', 'to treat', 'B1'],
  ['tracer', 'to trace / draw', 'B2'],
  ['transformer', 'to transform', 'B1'],
  ['transporter', 'to transport', 'B1'],
  ['travailler', 'to work', 'A1'],
  ['traverser', 'to cross', 'A2'],
  ['trembler', 'to tremble', 'B1'],
  ['tricoter', 'to knit', 'A2'],
  ['tromper', 'to deceive', 'A2'],
  ['trouver', 'to find', 'A1'],
  ['tuer', 'to kill', 'B1'],
  ['utiliser', 'to use', 'A2'],
  ['valider', 'to validate', 'B1'],
  ['vanter', 'to boast', 'B2'],
  ['varier', 'to vary', 'B1'],
  ['veiller', 'to watch / stay awake', 'B2'],
  ['verser', 'to pour', 'A2'],
  ['vider', 'to empty', 'A2'],
  ['viser', 'to aim', 'B1'],
  ['visiter', 'to visit', 'A1'],
  ['voler', 'to fly / steal', 'A2'],
  ['voter', 'to vote', 'A2'],
  ['vouloir', 'to want', 'A1'],
  ['voyager', 'to travel', 'A1'],
  ['vouvoyer', 'to use vous', 'A2'],
  ['tutoyer', 'to use tu', 'A2']
]

// Regular IR verbs:
const extraIrVerbs: [string, string, VerbEntry['level']][] = [
  ['accomplir', 'to accomplish', 'B1'],
  ['adoucir', 'to soften', 'B2'],
  ['affaiblir', 'to weaken', 'B2'],
  ['agir', 'to act', 'A2'],
  ['agrandir', 'to enlarge', 'B1'],
  ['alourdir', 'to weigh down', 'B2'],
  ['amortir', 'to cushion / amortize', 'B2'],
  ['applaudir', 'to applaud', 'A2'],
  ['approfondir', 'to deepen', 'B2'],
  ['arrondir', 'to round off', 'B2'],
  ['atterrir', 'to land', 'A2'],
  ['avertir', 'to warn', 'B1'],
  ['bâtir', 'to build', 'A2'],
  ['blanchir', 'to whiten / bleach', 'B1'],
  ['bleuir', 'to turn blue', 'B2'],
  ['bondir', 'to leap', 'B1'],
  ['choisir', 'to choose', 'A1'],
  ['convertir', 'to convert', 'B1'],
  ['définir', 'to define', 'B1'],
  ['démolir', 'to demolish', 'B2'],
  ['divertir', 'to entertain', 'B1'],
  ['durcir', 'to harden', 'B2'],
  ['élargir', 'to widen', 'B1'],
  ['embellir', 'to beautify', 'B2'],
  ['envahir', 'to invade', 'B1'],
  ['établir', 'to establish', 'B1'],
  ['évanouir', 'to faint', 'B1'],
  ['finir', 'to finish', 'A1'],
  ['fleurir', 'to bloom', 'A2'],
  ['fournir', 'to provide', 'B1'],
  ['franchir', 'to cross', 'B2'],
  ['frémir', 'to shudder', 'B2'],
  ['grandir', 'to grow', 'A2'],
  ['gravir', 'to climb (stairs/hill)', 'B2'],
  ['guérir', 'to cure / heal', 'A2'],
  ['investir', 'to invest', 'B1'],
  ['jaunir', 'to turn yellow', 'B2'],
  ['maigrir', 'to lose weight', 'A2'],
  ['mûrir', 'to ripen', 'B1'],
  ['noircir', 'to blacken', 'B2'],
  ['nourrir', 'to feed', 'B1'],
  ['obéir', 'to obey', 'A2'],
  ['pâlir', 'to turn pale', 'B2'],
  ['punir', 'to punish', 'A2'],
  ['ralentir', 'to slow down', 'B1'],
  ['réagir', 'to react', 'A2'],
  ['réfléchir', 'to reflect', 'A2'],
  ['remplir', 'to fill', 'A2'],
  ['réunir', 'to gather / reunite', 'B1'],
  ['réussir', 'to succeed', 'A1'],
  ['rougir', 'to blush / turn red', 'A2'],
  ['saisir', 'to seize / grab', 'B1'],
  ['salir', 'to dirty', 'A2'],
  ['subir', 'to undergo', 'B1'],
  ['surgir', 'to loom / crop up', 'B2'],
  ['trahir', 'to betray', 'B1'],
  ['unir', 'to unite', 'B1'],
  ['vieillir', 'to grow old', 'A2'],
  ['vomir', 'to vomit', 'A2']
]

// Regular RE verbs:
const extraReVerbs: [string, string, VerbEntry['level']][] = [
  ['attendre', 'to wait', 'A1'],
  ['confondre', 'to confuse', 'A2'],
  ['correspondre', 'to correspond', 'B1'],
  ['défendre', 'to defend', 'A2'],
  ['dépendre', 'to depend', 'B1'],
  ['descendre', 'to go down', 'A1'],
  ['détendre', 'to relax', 'A2'],
  ['entendre', 'to hear', 'A1'],
  ['étendre', 'to spread / stretch', 'B1'],
  ['fondre', 'to melt', 'A2'],
  ['mordre', 'to bite', 'A2'],
  ['pendre', 'to hang', 'B1'],
  ['perdre', 'to lose', 'A1'],
  ['prétendre', 'to pretend / claim', 'A2'],
  ['rendre', 'to return / give back', 'A1'],
  ['répandre', 'to spread', 'B1'],
  ['répondre', 'to answer', 'A1'],
  ['suspendre', 'to suspend', 'B1'],
  ['tendre', 'to stretch / tender', 'B1'],
  ['tondre', 'to mow', 'A2'],
  ['tordre', 'to twist', 'B1'],
  ['vendre', 'to sell', 'A1']
]

// Conjugation generators by pattern
function generateConjugations(
  infinitive: string,
  meaning: string,
  level: VerbEntry['level'],
  pattern: string,
  auxiliary: VerbEntry['auxiliary'],
  reflexive: boolean,
): VerbEntry {
  const id = infinitive.replace(/\s+/g, '-').replace(/[’']/g, '-').toLowerCase()

  // Base conjugations
  const forms: Record<string, string[]> = {}

  if (pattern === 'er') {
    const stem = infinitive.endsWith('er') ? infinitive.slice(0, -2) : infinitive
    const participle = `${stem}é`
    forms.present = [`${stem}e`, `${stem}es`, `${stem}e`, `${stem}ons`, `${stem}ez`, `${stem}ent`]
    forms.passeCompose = auxiliary === 'etre' ? etrePasse(participle) : avoirPasse(participle)
    forms.imparfait = [`${stem}ais`, `${stem}ais`, `${stem}ait`, `${stem}ions`, `${stem}iez`, `${stem}aient`]
    forms.futurSimple = futurForms(infinitive)
    forms.subjunctive = [`${stem}e`, `${stem}es`, `${stem}e`, `${stem}ions`, `${stem}iez`, `${stem}ent`]
  } 
  else if (pattern === 'ger') {
    const stem = infinitive.slice(0, -2) // e.g. mang
    const participle = `${stem}é`
    forms.present = [`${stem}e`, `${stem}es`, `${stem}e`, `${stem}eons`, `${stem}ez`, `${stem}ent`]
    forms.passeCompose = avoirPasse(participle)
    forms.imparfait = [`${stem}eais`, `${stem}eais`, `${stem}eait`, `${stem}ions`, `${stem}iez`, `${stem}eaient`]
    forms.futurSimple = futurForms(infinitive)
    forms.subjunctive = [`${stem}e`, `${stem}es`, `${stem}e`, `${stem}ions`, `${stem}iez`, `${stem}ent`]
  } 
  else if (pattern === 'cer') {
    const stem = infinitive.slice(0, -2) // e.g. commenc
    const participle = `${stem}é`
    forms.present = [`${stem}e`, `${stem}es`, `${stem}e`, `${stem}çons`, `${stem}ez`, `${stem}ent`]
    forms.passeCompose = avoirPasse(participle)
    forms.imparfait = [`${stem}çais`, `${stem}çais`, `${stem}çait`, `${stem}ions`, `${stem}iez`, `${stem}çaient`]
    forms.futurSimple = futurForms(infinitive)
    forms.subjunctive = [`${stem}e`, `${stem}es`, `${stem}e`, `${stem}ions`, `${stem}iez`, `${stem}ent`]
  } 
  else if (pattern === 'eler') {
    // appeler -> appelle, appelons
    const stem = infinitive.slice(0, -4) // e.g. app
    const infStem = infinitive.slice(0, -2)
    const participle = `${infStem}é`
    const double = `${stem}ell`
    const single = `${stem}el`
    forms.present = [`${double}e`, `${double}es`, `${double}e`, `${single}ons`, `${single}ez`, `${double}ent`]
    forms.passeCompose = auxiliary === 'etre' ? etrePasse(participle) : avoirPasse(participle)
    forms.imparfait = [`${single}ais`, `${single}ais`, `${single}ait`, `${single}ions`, `${single}iez`, `${single}aient`]
    forms.futurSimple = [`${double}erai`, `${double}eras`, `${double}era`, `${double}erons`, `${double}erez`, `${double}eront`]
    forms.subjunctive = [`${double}e`, `${double}es`, `${double}e`, `${single}ions`, `${single}iez`, `${double}ent`]
  } 
  else if (pattern === 'eter') {
    // jeter -> jette, jetons
    const stem = infinitive.slice(0, -4) // e.g. j
    const infStem = infinitive.slice(0, -2)
    const participle = `${infStem}é`
    const double = `${stem}ett`
    const single = `${stem}et`
    forms.present = [`${double}e`, `${double}es`, `${double}e`, `${single}ons`, `${single}ez`, `${double}ent`]
    forms.passeCompose = avoirPasse(participle)
    forms.imparfait = [`${single}ais`, `${single}ais`, `${single}ait`, `${single}ions`, `${single}iez`, `${single}aient`]
    forms.futurSimple = [`${double}erai`, `${double}eras`, `${double}era`, `${double}erons`, `${double}erez`, `${double}eront`]
    forms.subjunctive = [`${double}e`, `${double}es`, `${double}e`, `${single}ions`, `${single}iez`, `${double}ent`]
  } 
  else if (pattern === 'acheter') {
    // acheter -> achète, achetons. lever -> lève, levons.
    const baseInfinitive = reflexive && infinitive.startsWith('se ') ? infinitive.slice(3) : infinitive.startsWith('s’') ? infinitive.slice(2) : infinitive
    const stem = baseInfinitive.slice(0, -2)
    const participle = `${stem}é`
    // Find last e in stem and make it è
    const idx = stem.lastIndexOf('e')
    let graveStem = stem
    if (idx !== -1) {
      graveStem = stem.substring(0, idx) + 'è' + stem.substring(idx + 1)
    }
    forms.present = [`${graveStem}e`, `${graveStem}es`, `${graveStem}e`, `${stem}ons`, `${stem}ez`, `${graveStem}ent`]
    forms.passeCompose = auxiliary === 'etre' ? (reflexive ? reflexivePasse(participle) : etrePasse(participle)) : avoirPasse(participle)
    forms.imparfait = [`${stem}ais`, `${stem}ais`, `${stem}ait`, `${stem}ions`, `${stem}iez`, `${stem}aient`]
    forms.futurSimple = [`${graveStem}erai`, `${graveStem}eras`, `${graveStem}era`, `${graveStem}erons`, `${graveStem}erez`, `${graveStem}eront`]
    forms.subjunctive = [`${graveStem}e`, `${graveStem}es`, `${graveStem}e`, `${stem}ions`, `${stem}iez`, `${graveStem}ent`]
  } 
  else if (pattern === 'preferer') {
    // préférer -> préfère, préférons
    const stem = infinitive.slice(0, -2)
    const participle = `${stem}é`
    const idx = stem.lastIndexOf('é')
    let graveStem = stem
    if (idx !== -1) {
      graveStem = stem.substring(0, idx) + 'è' + stem.substring(idx + 1)
    }
    forms.present = [`${graveStem}e`, `${graveStem}es`, `${graveStem}e`, `${stem}ons`, `${stem}ez`, `${graveStem}ent`]
    forms.passeCompose = avoirPasse(participle)
    forms.imparfait = [`${stem}ais`, `${stem}ais`, `${stem}ait`, `${stem}ions`, `${stem}iez`, `${stem}aient`]
    forms.futurSimple = [`${graveStem}erai`, `${graveStem}eras`, `${graveStem}era`, `${graveStem}erons`, `${graveStem}erez`, `${graveStem}eront`]
    forms.subjunctive = [`${graveStem}e`, `${graveStem}es`, `${graveStem}e`, `${stem}ions`, `${stem}iez`, `${graveStem}ent`]
  } 
  else if (pattern === 'yer') {
    // payer -> paie, payons
    const stem = infinitive.slice(0, -3) // e.g. pa
    const participle = `${stem}yé`
    forms.present = [`${stem}ie`, `${stem}ies`, `${stem}ie`, `${stem}yons`, `${stem}yez`, `${stem}ient`]
    forms.passeCompose = avoirPasse(participle)
    forms.imparfait = [`${stem}yais`, `${stem}yais`, `${stem}yait`, `${stem}yions`, `${stem}yiez`, `${stem}yaient`]
    forms.futurSimple = [`${stem}ierai`, `${stem}ieras`, `${stem}iera`, `${stem}ierons`, `${stem}ierez`, `${stem}ieront`]
    forms.subjunctive = [`${stem}ie`, `${stem}ies`, `${stem}ie`, `${stem}yions`, `${stem}yiez`, `${stem}ient`]
  } 
  else if (pattern === 'ir') {
    const stem = infinitive.slice(0, -2)
    forms.present = [`${stem}is`, `${stem}is`, `${stem}it`, `${stem}issons`, `${stem}issez`, `${stem}issent`]
    forms.passeCompose = avoirPasse(`${stem}i`)
    forms.imparfait = [`${stem}issais`, `${stem}issais`, `${stem}issait`, `${stem}issions`, `${stem}issiez`, `${stem}issaient`]
    forms.futurSimple = futurForms(infinitive)
    forms.subjunctive = [`${stem}isse`, `${stem}isses`, `${stem}isse`, `${stem}issions`, `${stem}issiez`, `${stem}issent`]
  } 
  else if (pattern === 're') {
    const stem = infinitive.slice(0, -2)
    forms.present = [`${stem}s`, `${stem}s`, stem, `${stem}ons`, `${stem}ez`, `${stem}ent`]
    forms.passeCompose = auxiliary === 'etre' ? etrePasse(`${stem}u`) : avoirPasse(`${stem}u`)
    forms.imparfait = [`${stem}ais`, `${stem}ais`, `${stem}ait`, `${stem}ions`, `${stem}iez`, `${stem}aient`]
    forms.futurSimple = futurForms(`${stem}r`)
    forms.subjunctive = [`${stem}e`, `${stem}es`, `${stem}e`, `${stem}ions`, `${stem}iez`, `${stem}ent`]
  } 
  else if (pattern === 'prendre') {
    const prefix = infinitive.slice(0, -7)
    forms.present = ['prends', 'prends', 'prend', 'prenons', 'prenez', 'prennent'].map((v) => prefix + v)
    forms.passeCompose = avoirPasse(prefix + 'pris')
    forms.imparfait = ['prenais', 'prenais', 'prenait', 'prenions', 'preniez', 'prenaient'].map((v) => prefix + v)
    forms.futurSimple = ['prendrai', 'prendras', 'prendra', 'prendrons', 'prendrez', 'prendront'].map((v) => prefix + v)
    forms.subjunctive = ['prenne', 'prennes', 'prenne', 'prenions', 'preniez', 'prennent'].map((v) => prefix + v)
  } 
  else if (pattern === 'venir') {
    // venir or tenir prefixes
    const isTenir = infinitive.endsWith('tenir')
    const prefix = infinitive.slice(0, -5)
    const presentRoot = isTenir ? 'tien' : 'vien'
    const pluralRoot = isTenir ? 'ten' : 'ven'
    const part = isTenir ? 'tenu' : 'venu'
    
    forms.present = [
      `${presentRoot}s`, `${presentRoot}s`, `${presentRoot}t`, 
      `${pluralRoot}ons`, `${pluralRoot}ez`, `${presentRoot}nent`
    ].map((v) => prefix + v)
    
    forms.passeCompose = auxiliary === 'etre' 
      ? (reflexive ? reflexivePasse(prefix + part) : etrePasse(prefix + part)) 
      : avoirPasse(prefix + part)
      
    forms.imparfait = ['ais', 'ais', 'ait', 'ions', 'iez', 'aient'].map((v) => prefix + pluralRoot + v)
    forms.futurSimple = ['drai', 'dras', 'dra', 'drons', 'drez', 'dront'].map((v) => prefix + presentRoot + v)
    forms.subjunctive = [
      `${presentRoot}ne`, `${presentRoot}nes`, `${presentRoot}ne`, 
      `${pluralRoot}ions`, `${pluralRoot}iez`, `${presentRoot}nent`
    ].map((v) => prefix + v)
  } 
  else if (pattern === 'conduire') {
    // conduire, produire, etc.
    const prefix = infinitive.slice(0, -6) // e.g. con
    forms.present = ['duis', 'duis', 'duit', 'duisons', 'duisez', 'duisent'].map((v) => prefix + v)
    forms.passeCompose = avoirPasse(prefix + 'duit')
    forms.imparfait = ['duisais', 'duisais', 'duisait', 'duisions', 'duisiez', 'duisaient'].map((v) => prefix + v)
    forms.futurSimple = ['duirai', 'duiras', 'duira', 'duirons', 'duirez', 'duiront'].map((v) => prefix + v)
    forms.subjunctive = ['duise', 'duises', 'duise', 'duisions', 'duisiez', 'duisent'].map((v) => prefix + v)
  } 
  else if (pattern === 'craindre') {
    const prefix = infinitive.slice(0, -6) // e.g. crain / plain
    const stem = prefix + 'gn'
    forms.present = ['s', 's', 't', 'ons', 'ez', 'ent'].map((v, i) => i < 3 ? prefix + v : stem + v)
    forms.passeCompose = auxiliary === 'etre' ? reflexivePasse(prefix + 't') : avoirPasse(prefix + 't')
    forms.imparfait = ['ais', 'ais', 'ait', 'ions', 'iez', 'aient'].map((v) => stem + v)
    forms.futurSimple = ['drai', 'dras', 'dra', 'drons', 'drez', 'dront'].map((v) => prefix + v)
    forms.subjunctive = ['e', 'es', 'e', 'ions', 'iez', 'ent'].map((v) => stem + v)
  } 
  else if (pattern === 'mettre') {
    const prefix = infinitive.slice(0, -6)
    forms.present = ['mets', 'mets', 'met', 'mettons', 'mettez', 'mettent'].map((v) => prefix + v)
    forms.passeCompose = avoirPasse(prefix + 'mis')
    forms.imparfait = ['mettais', 'mettais', 'mettait', 'mettions', 'mettiez', 'mettaient'].map((v) => prefix + v)
    forms.futurSimple = ['mettrai', 'mettras', 'mettra', 'mettrons', 'mettrez', 'mettront'].map((v) => prefix + v)
    forms.subjunctive = ['mette', 'mettes', 'mette', 'mettions', 'mettiez', 'mettent'].map((v) => prefix + v)
  } 
  else if (pattern === 'ecrire') {
    const prefix = infinitive.slice(0, -5)
    forms.present = ['cris', 'cris', 'crit', 'crivons', 'crivez', 'crivent'].map((v) => prefix + v)
    forms.passeCompose = avoirPasse(prefix + 'crit')
    forms.imparfait = ['crivais', 'crivais', 'crivait', 'crivions', 'criviez', 'crivaient'].map((v) => prefix + v)
    forms.futurSimple = ['crirai', 'criras', 'crira', 'crirons', 'crirez', 'cront'].map((v) => prefix + v)
    forms.subjunctive = ['crive', 'crives', 'crive', 'crivions', 'criviez', 'crivent'].map((v) => prefix + v)
  } 
  else if (pattern === 'ouvrir') {
    const prefix = infinitive.slice(0, -5)
    forms.present = ['ouvre', 'ouvres', 'ouvre', 'ouvrons', 'ouvrez', 'ouvrent'].map((v) => prefix + v)
    // souffrir participle is souffert, others are ouvert
    const participle = prefix === 'souf' ? 'souffert' : prefix + 'ouvert'
    forms.passeCompose = avoirPasse(participle)
    forms.imparfait = ['ouvrais', 'ouvrais', 'ouvrait', 'ouvrions', 'ouvriez', 'ouvraient'].map((v) => prefix + v)
    forms.futurSimple = ['ouvrirai', 'ouvriras', 'ouvrira', 'ouvrirons', 'ouvrirez', 'ouvriront'].map((v) => prefix + v)
    forms.subjunctive = ['ouvre', 'ouvres', 'ouvre', 'ouvrions', 'ouvriez', 'ouvrent'].map((v) => prefix + v)
  } 
  else if (pattern === 'sentir') {
    // sentir, partir, sortir, mentir, servir
    const isServir = infinitive.endsWith('servir')
    const baseInfinitive = isServir ? 'servir' : infinitive.endsWith('repentir') ? 'repentir' : infinitive
    const prefix = baseInfinitive.slice(0, -3) // e.g. sen / par / sor / men / ser
    const stem = baseInfinitive.slice(0, -2) // e.g. sent / part / sort / ment / serv
    
    forms.present = isServir
      ? ['sers', 'sers', 'sert', 'servons', 'servez', 'servent']
      : ['s', 's', 't', 'ons', 'ez', 'ent'].map((v, i) => i < 3 ? prefix + v : stem + v)

    const participle = isServir ? 'servi' : prefix + 'ti' // parti, sorti, senti, menti
    
    forms.passeCompose = auxiliary === 'etre'
      ? (reflexive ? reflexivePasse(participle) : etrePasse(participle))
      : avoirPasse(participle)
      
    forms.imparfait = ['ais', 'ais', 'ait', 'ions', 'iez', 'aient'].map((v) => stem + v)
    forms.futurSimple = isServir ? futurForms(infinitive) : ['irai', 'iras', 'ira', 'irons', 'irez', 'iront'].map((v) => prefix + v)
    forms.subjunctive = ['e', 'es', 'e', 'ions', 'iez', 'ent'].map((v) => stem + v)
  } 
  else if (pattern === 'lire') {
    const prefix = infinitive.slice(0, -4)
    forms.present = ['lis', 'lis', 'lit', 'lisons', 'lisez', 'lisent'].map((v) => prefix + v)
    forms.passeCompose = avoirPasse(prefix + 'lu')
    forms.imparfait = ['lisais', 'lisais', 'lisait', 'lisions', 'lisiez', 'lisaient'].map((v) => prefix + v)
    forms.futurSimple = ['lirai', 'liras', 'lira', 'lirons', 'lirez', 'liront'].map((v) => prefix + v)
    forms.subjunctive = ['lise', 'lises', 'lise', 'lisions', 'lisiez', 'lisent'].map((v) => prefix + v)
  } 
  else if (pattern === 'battre') {
    const prefix = infinitive.slice(0, -6)
    forms.present = ['bats', 'bats', 'bat', 'battons', 'battez', 'battent'].map((v) => prefix + v)
    forms.passeCompose = avoirPasse(prefix + 'battu')
    forms.imparfait = ['battais', 'battais', 'battait', 'battons', 'battez', 'battaient'].map((v) => prefix + v)
    forms.futurSimple = ['battrai', 'battras', 'battra', 'battrons', 'battrez', 'battront'].map((v) => prefix + v)
    forms.subjunctive = ['batte', 'battes', 'batte', 'battions', 'battiez', 'battent'].map((v) => prefix + v)
  } 
  else if (pattern === 'vivre') {
    const prefix = infinitive.slice(0, -5)
    forms.present = ['vis', 'vis', 'vit', 'vivons', 'vivez', 'vivent'].map((v) => prefix + v)
    forms.passeCompose = avoirPasse(prefix + 'vécu')
    forms.imparfait = ['vivais', 'vivais', 'vivait', 'vivions', 'viviez', 'vivaient'].map((v) => prefix + v)
    forms.futurSimple = ['vivrai', 'vivras', 'vivra', 'vivrons', 'vivrez', 'vivront'].map((v) => prefix + v)
    forms.subjunctive = ['vive', 'vives', 'vive', 'vivions', 'viviez', 'vivent'].map((v) => prefix + v)
  } 
  else {
    // Fallback or unique irregular overrides
    return getUniqueIrregular(infinitive, meaning, level, auxiliary, reflexive)
  }

  // If the verb is reflexive, prefix pronouns where appropriate
  if (reflexive && pattern !== 'acheter') { // acheter custom handles it
    forms.present = makeReflexive(forms.present)
    forms.imparfait = makeReflexive(forms.imparfait)
    forms.futurSimple = makeReflexive(forms.futurSimple)
    forms.subjunctive = makeReflexive(forms.subjunctive)
  }

  // Determine group string
  const grp = pattern === 'ir' ? 'regular -ir' : pattern === 're' ? 'regular -re' : (pattern as string) === 'unique' ? 'irregular' : 'regular -er'

  return makeVerbEntry(id, infinitive, meaning, level, grp, auxiliary, reflexive, forms)
}

function avoirPasse(participle: string) {
  return ['ai', 'as', 'a', 'avons', 'avez', 'ont'].map((aux) => `${aux} ${participle}`)
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

// Handcrafted unique irregulars
function getUniqueIrregular(
  infinitive: string,
  meaning: string,
  level: VerbEntry['level'],
  auxiliary: VerbEntry['auxiliary'],
  reflexive: boolean
): VerbEntry {
  const forms: Record<string, string[]> = {}
  const id = infinitive.replace(/\s+/g, '-').replace(/[’']/g, '-').toLowerCase()

  if (infinitive === 'être') {
    forms.present = ['suis', 'es', 'est', 'sommes', 'êtes', 'sont']
    forms.passeCompose = ['ai été', 'as été', 'a été', 'avons été', 'avez été', 'ont été']
    forms.imparfait = ['étais', 'étais', 'était', 'étions', 'étiez', 'étaient']
    forms.futurSimple = ['serai', 'seras', 'sera', 'serons', 'serez', 'seront']
    forms.subjunctive = ['sois', 'sois', 'soit', 'soyons', 'soyez', 'soient']
  } 
  else if (infinitive === 'avoir') {
    forms.present = ['ai', 'as', 'a', 'avons', 'avez', 'ont']
    forms.passeCompose = ['ai eu', 'as eu', 'a eu', 'avons eu', 'avez eu', 'ont eu']
    forms.imparfait = ['avais', 'avais', 'avait', 'avions', 'aviez', 'avaient']
    forms.futurSimple = ['aurai', 'auras', 'aura', 'aurons', 'aurez', 'auront']
    forms.subjunctive = ['aie', 'aies', 'ait', 'ayons', 'ayez', 'aient']
  } 
  else if (infinitive === 'aller') {
    forms.present = ['vais', 'vas', 'va', 'allons', 'allez', 'vont']
    forms.passeCompose = etrePasse('allé')
    forms.imparfait = ['allais', 'allais', 'allait', 'allions', 'alliez', 'allaient']
    forms.futurSimple = ['irai', 'iras', 'ira', 'irons', 'irez', 'iront']
    forms.subjunctive = ['aille', 'ailles', 'aille', 'allions', 'alliez', 'aillent']
  } 
  else if (infinitive === 'faire') {
    forms.present = ['fais', 'fais', 'fait', 'faisons', 'faites', 'font']
    forms.passeCompose = avoirPasse('fait')
    forms.imparfait = ['faisais', 'faisais', 'faisait', 'faisions', 'faisiez', 'faisaient']
    forms.futurSimple = ['ferai', 'feras', 'fera', 'ferons', 'ferez', 'feront']
    forms.subjunctive = ['fasse', 'fasses', 'fasse', 'fassions', 'fassiez', 'fassent']
  } 
  else if (infinitive === 'pouvoir') {
    forms.present = ['peux', 'peux', 'peut', 'pouvons', 'pouvez', 'peuvent']
    forms.passeCompose = avoirPasse('pu')
    forms.imparfait = ['pouvais', 'pouvais', 'pouvait', 'pouvions', 'pouviez', 'pouvaient']
    forms.futurSimple = ['pourrai', 'pourras', 'pourra', 'pourrons', 'pourrez', 'pourront']
    forms.subjunctive = ['puisse', 'puisses', 'puisse', 'puissions', 'puissiez', 'puissent']
  } 
  else if (infinitive === 'vouloir') {
    forms.present = ['veux', 'veux', 'veut', 'voulons', 'voulez', 'veulent']
    forms.passeCompose = avoirPasse('voulu')
    forms.imparfait = ['voulais', 'voulais', 'voulait', 'voulions', 'vouliez', 'voulaient']
    forms.futurSimple = ['voudrai', 'voudras', 'voudra', 'voudrons', 'voudrez', 'voudront']
    forms.subjunctive = ['veuille', 'veuilles', 'veuille', 'voulions', 'vouliez', 'veuillent']
  } 
  else if (infinitive === 'savoir') {
    forms.present = ['sais', 'sais', 'sait', 'savons', 'savez', 'savent']
    forms.passeCompose = avoirPasse('su')
    forms.imparfait = ['savais', 'savais', 'savait', 'savions', 'saviez', 'savaient']
    forms.futurSimple = ['saurai', 'sauras', 'saura', 'saurons', 'saurez', 'sauront']
    forms.subjunctive = ['sache', 'saches', 'sache', 'sachions', 'sachiez', 'sachent']
  } 
  else if (infinitive === 'devoir') {
    forms.present = ['dois', 'dois', 'doit', 'devons', 'devez', 'doivent']
    forms.passeCompose = avoirPasse('dû')
    forms.imparfait = ['devais', 'devais', 'devait', 'devions', 'deviez', 'devaient']
    forms.futurSimple = ['devrai', 'devras', 'devra', 'devrons', 'devrez', 'devront']
    forms.subjunctive = ['doive', 'doives', 'doive', 'devions', 'deviez', 'doivent']
  } 
  else if (infinitive === 'boire') {
    forms.present = ['bois', 'bois', 'boit', 'buvons', 'buvez', 'boivent']
    forms.passeCompose = avoirPasse('bu')
    forms.imparfait = ['buvais', 'buvais', 'buvait', 'buvions', 'buviez', 'buvaient']
    forms.futurSimple = ['boirai', 'boiras', 'boira', 'boirons', 'boirez', 'boiront']
    forms.subjunctive = ['boive', 'boives', 'boive', 'buvions', 'buviez', 'boivent']
  } 
  else if (infinitive === 'dire') {
    forms.present = ['dis', 'dis', 'dit', 'disons', 'dites', 'disent']
    forms.passeCompose = avoirPasse('dit')
    forms.imparfait = ['disais', 'disais', 'disait', 'disions', 'disiez', 'disaient']
    forms.futurSimple = ['dirai', 'diras', 'dira', 'dirons', 'direz', 'diront']
    forms.subjunctive = ['dise', 'dises', 'dise', 'disions', 'disiez', 'disent']
  } 
  else if (infinitive === 'voir') {
    forms.present = ['vois', 'vois', 'voit', 'voyons', 'voyez', 'voient']
    forms.passeCompose = avoirPasse('vu')
    forms.imparfait = ['voyais', 'voyais', 'voyait', 'voyions', 'voyiez', 'voyaient']
    forms.futurSimple = ['verrai', 'verras', 'verra', 'verrons', 'verrez', 'verront']
    forms.subjunctive = ['voie', 'voies', 'voie', 'voyions', 'voyiez', 'voient']
  } 
  else if (infinitive === 'croire') {
    forms.present = ['crois', 'crois', 'croit', 'croyons', 'croyez', 'croient']
    forms.passeCompose = avoirPasse('cru')
    forms.imparfait = ['croyais', 'croyais', 'croyait', 'croyions', 'croyiez', 'croyaient']
    forms.futurSimple = ['croirai', 'croiras', 'croira', 'croirons', 'croirez', 'croiront']
    forms.subjunctive = ['croie', 'croies', 'croie', 'croyions', 'croyiez', 'croient']
  } 
  else if (infinitive === 'rire') {
    forms.present = ['ris', 'ris', 'rit', 'rions', 'riez', 'rient']
    forms.passeCompose = avoirPasse('ri')
    forms.imparfait = ['riais', 'riais', 'riait', 'riions', 'riiez', 'riaient']
    forms.futurSimple = ['rirai', 'riras', 'rira', 'rirons', 'rirez', 'riront']
    forms.subjunctive = ['rie', 'ries', 'rie', 'riions', 'riiez', 'rient']
  } 
  else if (infinitive === 'sourire') {
    forms.present = ['souris', 'souris', 'sourit', 'sourions', 'souriez', 'sourient']
    forms.passeCompose = avoirPasse('souri')
    forms.imparfait = ['souriais', 'souriais', 'souriait', 'sourions', 'souriez', 'souriaient']
    forms.futurSimple = ['sourirai', 'souriras', 'sourira', 'sourirons', 'sourirez', 'souriront']
    forms.subjunctive = ['sourie', 'sourires', 'sourie', 'sourions', 'souriez', 'sourient']
  } 
  else if (infinitive === 'suivre') {
    forms.present = ['suis', 'suis', 'suit', 'suivons', 'suivez', 'suivent']
    forms.passeCompose = avoirPasse('suivi')
    forms.imparfait = ['suivais', 'suivais', 'suivait', 'suivions', 'suiviez', 'suivaient']
    forms.futurSimple = ['suivrai', 'suivras', 'suivra', 'suivrons', 'suivrez', 'suivront']
    forms.subjunctive = ['suive', 'suives', 'suive', 'suivions', 'suiviez', 'suivent']
  } 
  else if (infinitive === 'courir') {
    forms.present = ['cours', 'cours', 'court', 'courons', 'courez', 'courent']
    forms.passeCompose = avoirPasse('couru')
    forms.imparfait = ['courais', 'courais', 'courait', 'courions', 'couriez', 'couraient']
    forms.futurSimple = ['courrai', 'courras', 'courra', 'courrons', 'courrez', 'courront']
    forms.subjunctive = ['coure', 'coures', 'coure', 'courions', 'couriez', 'courent']
  } 
  else if (infinitive === 'mourir') {
    forms.present = ['meurs', 'meurs', 'meurt', 'mourons', 'mourez', 'meurent']
    forms.passeCompose = etrePasse('mort')
    forms.imparfait = ['mourais', 'mourais', 'mourait', 'mourions', 'mouriez', 'mouraient']
    forms.futurSimple = ['mourrai', 'mourras', 'mourra', 'mourrons', 'mourrez', 'mourront']
    forms.subjunctive = ['meure', 'meures', 'meure', 'mourions', 'mouriez', 'meurent']
  } 
  else if (infinitive === 'naître') {
    forms.present = ['nais', 'nais', 'naît', 'naissons', 'naissez', 'naissent']
    forms.passeCompose = etrePasse('né')
    forms.imparfait = ['naissais', 'naissais', 'naissait', 'naissions', 'naissiez', 'naissaient']
    forms.futurSimple = ['naîtrai', 'naîtras', 'naîtra', 'naîtrons', 'naîtrez', 'naîtront']
    forms.subjunctive = ['naisse', 'naisses', 'naisse', 'naissions', 'naissiez', 'naissent']
  } 
  else if (infinitive === 'connaître') {
    forms.present = ['connais', 'connais', 'connaît', 'connaissons', 'connaissez', 'connaissent']
    forms.passeCompose = avoirPasse('connu')
    forms.imparfait = ['connaissais', 'connaissais', 'connaissait', 'connaissions', 'connaissiez', 'connaissaient']
    forms.futurSimple = ['connaîtrai', 'connaîtras', 'connaîtra', 'connaîtrons', 'connaîtrez', 'connaîtront']
    forms.subjunctive = ['connaisse', 'connaisses', 'connaisse', 'connaissions', 'connaissiez', 'connaissent']
  } 
  else if (infinitive === 'recevoir') {
    forms.present = ['reçois', 'reçois', 'reçoit', 'recevons', 'recevez', 'reçoivent']
    forms.passeCompose = avoirPasse('reçu')
    forms.imparfait = ['recevais', 'recevais', 'recevait', 'recevions', 'receviez', 'recevaient']
    forms.futurSimple = ['recevrai', 'recevras', 'recevra', 'recevrons', 'recevrez', 'recevront']
    forms.subjunctive = ['reçoive', 'reçoives', 'reçoive', 'recevions', 'receviez', 'reçoivent']
  } 
  else if (infinitive === 'apercevoir') {
    forms.present = ['aperçois', 'aperçois', 'aperçoit', 'apercevons', 'apercevez', 'aperçoivent']
    forms.passeCompose = avoirPasse('aperçu')
    forms.imparfait = ['apercevais', 'apercevais', 'apercevait', 'apercevions', 'aperceviez', 'apercevaient']
    forms.futurSimple = ['apercevrai', 'apercevras', 'apercevra', 'apercevrons', 'apercevrez', 'apercevront']
    forms.subjunctive = ['aperçoive', 'aperçoives', 'aperçoive', 'apercevions', 'aperceviez', 'aperçoivent']
  } 
  else if (infinitive === 'décevoir') {
    forms.present = ['déçois', 'déçois', 'déçoit', 'décevons', 'décevez', 'déçoivent']
    forms.passeCompose = avoirPasse('déçu')
    forms.imparfait = ['décevais', 'décevais', 'décevait', 'décevions', 'déceviez', 'décevaient']
    forms.futurSimple = ['décevrai', 'décevras', 'décevra', 'décevrons', 'décevrez', 'décevront']
    forms.subjunctive = ['déçoive', 'déçoives', 'déçoive', 'décevions', 'déceviez', 'déçoivent']
  } 
  else if (infinitive === 'valoir') {
    forms.present = ['vaux', 'vaux', 'vaut', 'valons', 'valez', 'valent']
    forms.passeCompose = avoirPasse('valu')
    forms.imparfait = ['valais', 'valais', 'valait', 'valions', 'valiez', 'valaient']
    forms.futurSimple = ['vaudrai', 'vaudras', 'vaudra', 'vaudrons', 'vaudrez', 'vaudront']
    forms.subjunctive = ['vaille', 'vailles', 'vaille', 'valions', 'valiez', 'vaillent']
  } 
  else if (infinitive === 'plaire') {
    forms.present = ['plais', 'plais', 'plaît', 'plaisons', 'plaisez', 'plaisent']
    forms.passeCompose = avoirPasse('plu')
    forms.imparfait = ['plaisais', 'plaisais', 'plaisait', 'plaisions', 'plaisiez', 'plaisaient']
    forms.futurSimple = ['plairai', 'plairas', 'plaira', 'plairons', 'plairez', 'plairont']
    forms.subjunctive = ['plaise', 'plaises', 'plaise', 'plaisions', 'plaisiez', 'plaisent']
  } 
  else if (infinitive === 'résoudre') {
    forms.present = ['résous', 'résous', 'résout', 'résolvons', 'résolvez', 'résolvent']
    forms.passeCompose = avoirPasse('résolu')
    forms.imparfait = ['résolvais', 'résolvais', 'résolvait', 'résolvions', 'résolviez', 'résolvaient']
    forms.futurSimple = ['résoudrai', 'résoudras', 'résoudra', 'résoudrons', 'résoudrez', 'résoudront']
    forms.subjunctive = ['résolve', 'résolves', 'résolve', 'résolvions', 'résolviez', 'résolvent']
  } 
  else if (infinitive === 'lire') {
    forms.present = ['lis', 'lis', 'lit', 'lisons', 'lisez', 'lisent']
    forms.passeCompose = avoirPasse('lu')
    forms.imparfait = ['lisais', 'lisais', 'lisait', 'lisions', 'lisiez', 'lisaient']
    forms.futurSimple = ['lirai', 'liras', 'lira', 'lirons', 'lirez', 'liront']
    forms.subjunctive = ['lise', 'lises', 'lise', 'lisions', 'lisiez', 'lisent']
  } 
  else if (infinitive === 'interdire') {
    forms.present = ['interdis', 'interdis', 'interdit', 'interdisons', 'interdisez', 'interdisent']
    forms.passeCompose = avoirPasse('interdit')
    forms.imparfait = ['interdisais', 'interdisais', 'interdisait', 'interdisions', 'interdisiez', 'interdisaient']
    forms.futurSimple = ['interdirai', 'interdiras', 'interdira', 'interdirons', 'interdirez', 'interdiront']
    forms.subjunctive = ['interdise', 'interdises', 'interdise', 'interdisions', 'interdisiez', 'interdisent']
  } 
  else if (infinitive === 'envoyer') {
    forms.present = ['envoie', 'envoies', 'envoie', 'envoyons', 'envoyez', 'envoient']
    forms.passeCompose = avoirPasse('envoyé')
    forms.imparfait = ['envoyais', 'envoyais', 'envoyait', 'envoyions', 'envoyiez', 'envoyaient']
    forms.futurSimple = ['enverrai', 'enverras', 'enverra', 'enverrons', 'enverrez', 'enverront']
    forms.subjunctive = ['envoie', 'envoies', 'envoie', 'envoyions', 'envoyiez', 'envoient']
  } 
  else {
    // Default fallback to basic -er stem so it doesn't crash
    const stem = infinitive.replace(/[ -]/g, '').slice(0, -2)
    forms.present = [`${stem}e`, `${stem}es`, `${stem}e`, `${stem}ons`, `${stem}ez`, `${stem}ent`]
    forms.passeCompose = avoirPasse(`${stem}é`)
    forms.imparfait = [`${stem}ais`, `${stem}ais`, `${stem}ait`, `${stem}ions`, `${stem}iez`, `${stem}aient`]
    forms.futurSimple = [`${stem}erai`, `${stem}eras`, `${stem}era`, `${stem}erons`, `${stem}erez`, `${stem}eront`]
    forms.subjunctive = [`${stem}e`, `${stem}es`, `${stem}e`, `${stem}ions`, `${stem}iez`, `${stem}ent`]
  }

  if (reflexive) {
    forms.present = makeReflexive(forms.present)
    forms.imparfait = makeReflexive(forms.imparfait)
    forms.futurSimple = makeReflexive(forms.futurSimple)
    forms.subjunctive = makeReflexive(forms.subjunctive)
  }

  return makeVerbEntry(id, infinitive, meaning, level, 'irregular', auxiliary, reflexive, forms)
}

// Combine all raw verbs, filter out duplicates, and keep the list at exactly 500
const allRawVerbs: [string, string, VerbEntry['level'], string, VerbEntry['auxiliary'], boolean][] = []
const seenInfs = new Set<string>()

// Helper to push safely
function pushRawVerb(inf: string, meaning: string, level: VerbEntry['level'], pattern: string, aux: VerbEntry['auxiliary'], refl: boolean) {
  if (seenInfs.has(inf)) return
  seenInfs.add(inf)
  allRawVerbs.push([inf, meaning, level, pattern, aux, refl])
}

// 1. Load initial seed list
rawVerbsList.forEach((v) => pushRawVerb(v[0], v[1], v[2], v[3], v[4], v[5]))

// 2. Load extra ER verbs
extraErVerbs.forEach((v) => {
  const refl = v[0].startsWith('se ') || v[0].startsWith('s’')
  const pat = v[0].endsWith('ger') ? 'ger' : v[0].endsWith('cer') ? 'cer' : v[0].endsWith('yer') ? 'yer' : 'er'
  pushRawVerb(v[0], v[1], v[2], pat, 'avoir', refl)
})

// 3. Load extra IR verbs
extraIrVerbs.forEach((v) => {
  const refl = v[0].startsWith('se ') || v[0].startsWith('s’')
  pushRawVerb(v[0], v[1], v[2], 'ir', 'avoir', refl)
})

// 4. Load extra RE verbs
extraReVerbs.forEach((v) => {
  const refl = v[0].startsWith('se ') || v[0].startsWith('s’')
  pushRawVerb(v[0], v[1], v[2], 're', 'avoir', refl)
})

// Let's cap at exactly 500 verbs for performance and requirements
export const generatedVerbs: VerbEntry[] = allRawVerbs.slice(0, 500).map((v) => {
  return generateConjugations(v[0], v[1], v[2], v[3], v[4], v[5])
})
