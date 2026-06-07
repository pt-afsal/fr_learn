import type { CefrLevel } from './types'

export interface ClozeExercise {
  id: string
  level: CefrLevel
  title: string
  theme: string
  // The text of the passage with placeholders like {0}, {1}, etc.
  text: string
  blanks: Array<{
    id: string
    label: string // e.g. "(aller) au présent" or simply "blank description"
    correctAnswer: string
    choices: string[]
    explanation: string
  }>
}

export const clozeExercises: ClozeExercise[] = [
  {
    id: 'cloze-a1-routine',
    level: 'A1',
    title: 'Le matin de Lucas',
    theme: 'Daily Routine',
    text: "Tous les matins, Lucas {0} réveille à sept heures. Il {1} un grand café et mange un croissant. Ensuite, il dit au revoir à {2} femme et part travailler à la gare.",
    blanks: [
      {
        id: 'c1-se',
        label: 'pronom réfléchi',
        correctAnswer: 'se',
        choices: ['me', 'te', 'se', 'nous'],
        explanation: "Avec 'Lucas' (il), on utilise le pronom réfléchi 'se'."
      },
      {
        id: 'c1-prend',
        label: 'verbe prendre au présent',
        correctAnswer: 'prend',
        choices: ['prends', 'prend', 'prenons', 'prennent'],
        explanation: "Le sujet est 'Il', donc la conjugaison de 'prendre' est 'prend'."
      },
      {
        id: 'c1-sa',
        label: 'adjectif possessif',
        correctAnswer: 'sa',
        choices: ['son', 'sa', 'ses', 'ma'],
        explanation: "'Femme' est un nom féminin singulier, et c'est la femme de Lucas, donc 'sa'."
      }
    ]
  },
  {
    id: 'cloze-a1-achat',
    level: 'A1',
    title: 'Faire les courses',
    theme: 'Shopping',
    text: "Aujourd'hui, je vais {0} supermarché. Je dois acheter {1} lait et des pommes. J'aime beaucoup {2} fruits frais !",
    blanks: [
      {
        id: 'c2-au',
        label: 'article contracté',
        correctAnswer: 'au',
        choices: ['à la', 'au', 'aux', 'de'],
        explanation: "Aller + le supermarché (masculin) donne la contraction 'au'."
      },
      {
        id: 'c2-du',
        label: 'article partitif',
        correctAnswer: 'du',
        choices: ['du', 'de la', 'un', 'des'],
        explanation: "Lait est un nom masculin singulier non comptable, on utilise 'du'."
      },
      {
        id: 'c2-les',
        label: 'article défini pluriel',
        correctAnswer: 'les',
        choices: ['les', 'des', 'mes', 'ses'],
        explanation: "Après le verbe aimer, on utilise un article défini, ici 'les' pour le pluriel."
      }
    ]
  },
  {
    id: 'cloze-a2-vacances',
    level: 'A2',
    title: 'Mes vacances en Bretagne',
    theme: 'Travel',
    text: "L'année dernière, je {0} allé en Bretagne avec des amis. Il {1} très beau pendant tout le séjour. Nous {2} fait beaucoup de randonnées au bord de la mer.",
    blanks: [
      {
        id: 'c3-suis',
        label: 'auxiliaire passé composé',
        correctAnswer: 'suis',
        choices: ['ai', 'suis', 'es', 'sommes'],
        explanation: "Le verbe 'aller' se conjugue avec l'auxiliaire 'être' au passé composé."
      },
      {
        id: 'c3-faisait',
        label: 'météo à l’imparfait',
        correctAnswer: 'faisait',
        choices: ['fait', 'a fait', 'faisait', 'fera'],
        explanation: "Pour décrire la météo dans le passé, on emploie l'imparfait du verbe faire : 'il faisait'."
      },
      {
        id: 'c3-avons',
        label: 'auxiliaire verbe faire',
        correctAnswer: 'avons',
        choices: ['sommes', 'avons', 'ont', 'avez'],
        explanation: "Le verbe 'faire' se conjugue avec l'auxiliaire 'avoir' au passé composé."
      }
    ]
  },
  {
    id: 'cloze-a2-ville',
    level: 'A2',
    title: 'Habiter en ville',
    theme: 'Housing',
    text: "J'aime mon quartier parce qu'il {0} très calme. Mon appartement se trouve {1} deuxième étage. J'y habite depuis six mois et je ne le regrette {2}.",
    blanks: [
      {
        id: 'c4-est',
        label: 'verbe être au présent',
        correctAnswer: 'est',
        choices: ['est', 'es', 'suis', 'sont'],
        explanation: "Le sujet est 'il', la forme correcte de être est 'est'."
      },
      {
        id: 'c4-au',
        label: 'préposition + étage',
        correctAnswer: 'au',
        choices: ['au', 'en', 'dans', 'à la'],
        explanation: "On dit 'au' (à + le) deuxième étage."
      },
      {
        id: 'c4-jamais',
        label: 'négation',
        correctAnswer: 'pas',
        choices: ['pas', 'plus', 'jamais', 'rien'],
        explanation: "La négation standard 'ne ... pas' exprime la négation neutre : 'je ne le regrette pas'."
      }
    ]
  },
  {
    id: 'cloze-b1-emploi',
    level: 'B1',
    title: 'Une nouvelle opportunité',
    theme: 'Work & Career',
    text: "Je vous écris pour vous informer que j'ai {0} accepté le poste. Bien que le salaire {1} légèrement inférieur à mes attentes, je pense que c'est une excellente opportunité. Si j'avais refusé, je le {2} regretté plus tard.",
    blanks: [
      {
        id: 'c5-ete',
        label: 'participe passé passif',
        correctAnswer: 'été',
        choices: ['été', 'eu', 'suis', 'fait'],
        explanation: "Pour la voix passive au passé composé, on utilise 'ai été' + participe passé."
      },
      {
        id: 'c5-soit',
        label: 'subjonctif après bien que',
        correctAnswer: 'soit',
        choices: ['est', 'soit', 'sera', 'était'],
        explanation: "'Bien que' est toujours suivi du subjonctif. Le subjonctif de être est 'soit'."
      },
      {
        id: 'c5-aurais',
        label: 'conditionnel passé',
        correctAnswer: 'aurais',
        choices: ['avais', 'aurais', 'aurai', 'serais'],
        explanation: "La structure 'si + plus-que-parfait' est suivie du conditionnel passé : 'je l’aurais regretté'."
      }
    ]
  },
  {
    id: 'cloze-b1-environnement',
    level: 'B1',
    title: 'Protéger la nature',
    theme: 'Environment',
    text: "Il est important que nous {0} attention à notre planète. De nombreuses espèces disparaitront à moins que nous ne {1} notre consommation. C'est grâce {2} nos efforts quotidiens que nous réussirons.",
    blanks: [
      {
        id: 'c6-fassions',
        label: 'subjonctif après il est important que',
        correctAnswer: 'fassions',
        choices: ['faisons', 'fassions', 'ferons', 'faisiez'],
        explanation: "'Il est important que' nécessite le subjonctif présent : 'nous fassions'."
      },
      {
        id: 'c6-reduisions',
        label: 'subjonctif après à moins que',
        correctAnswer: 'réduisions',
        choices: ['réduisons', 'réduisions', 'réduirons', 'réduisions'],
        explanation: "'À moins que' est suivi du subjonctif présent : 'nous réduisions' (avec le ne explétif)."
      },
      {
        id: 'c6-a',
        label: 'préposition après grâce',
        correctAnswer: 'à',
        choices: ['de', 'à', 'pour', 'avec'],
        explanation: "L'expression de cause positive est 'grâce à'."
      }
    ]
  }
]
