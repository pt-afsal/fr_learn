import type { CefrLevel } from './types'

export interface DialogueLine {
  speaker: string
  text: string
  blankIndex?: number // If set, refers to the index of the blank in this speaker's line
}

export interface DialogueExercise {
  id: string
  level: CefrLevel
  title: string
  theme: string
  lines: DialogueLine[]
  blanks: Array<{
    id: string
    correctAnswer: string
    choices: string[]
    explanation: string
  }>
}

export const dialogueExercises: DialogueExercise[] = [
  {
    id: 'dial-a1-cafe',
    level: 'A1',
    title: 'Au café de Paris',
    theme: 'Ordering food',
    lines: [
      { speaker: 'Garçon', text: "Bonjour madame, vous désirez ?" },
      { speaker: 'Client', text: "Bonjour, je {0} un café et un croissant, s'il vous plaît.", blankIndex: 0 },
      { speaker: 'Garçon', text: "Très bien. Et avec ceci ?" },
      { speaker: 'Client', text: "C'est {1}, merci. Combien ça coûte ?", blankIndex: 1 },
      { speaker: 'Garçon', text: "Ça fait quatre euros cinquante. Voici votre commande." },
      { speaker: 'Client', text: "{2} beaucoup, monsieur !", blankIndex: 2 }
    ],
    blanks: [
      {
        id: 'd1-b0',
        correctAnswer: 'voudrais',
        choices: ['veux', 'voudrais', 'peux', 'suis'],
        explanation: "'Je voudrais' est la formule de politesse standard pour commander."
      },
      {
        id: 'd1-b1',
        correctAnswer: 'tout',
        choices: ['tout', 'rien', 'quelque', 'bon'],
        explanation: "'C'est tout' signifie 'that is all'."
      },
      {
        id: 'd1-b2',
        correctAnswer: 'Merci',
        choices: ['S’il vous plaît', 'Merci', 'De rien', 'Bonjour'],
        explanation: "'Merci beaucoup' sert à exprimer la gratitude."
      }
    ]
  },
  {
    id: 'dial-a2-hotel',
    level: 'A2',
    title: 'Réserver une chambre',
    theme: 'Hotel interaction',
    lines: [
      { speaker: 'Réceptionniste', text: "Hôtel Belle Vue, bonjour. En quoi puis-je vous aider ?" },
      { speaker: 'Client', text: "Bonjour, je voudrais {0} une chambre double pour deux nuits, du 10 au 12 juillet.", blankIndex: 0 },
      { speaker: 'Réceptionniste', text: "Bien sûr. Nous avons une chambre disponible au tarif de 90 euros par nuit." },
      { speaker: 'Client', text: "Est-ce que le petit-déjeuner est {1} dans le prix ?", blankIndex: 1 },
      { speaker: 'Réceptionniste', text: "Oui, tout à fait. Il est servi au buffet de 7h à 10h." },
      { speaker: 'Client', text: "Parfait. Je la prends. Est-ce que je peux {2} par carte de crédit ?", blankIndex: 2 },
      { speaker: 'Réceptionniste', text: "Oui, bien sûr. Je vais prendre vos coordonnées." }
    ],
    blanks: [
      {
        id: 'd2-b0',
        correctAnswer: 'réserver',
        choices: ['acheter', 'vendre', 'réserver', 'louer'],
        explanation: "Pour une chambre d'hôtel, on utilise le verbe 'réserver'."
      },
      {
        id: 'd2-b1',
        correctAnswer: 'inclus',
        choices: ['compris', 'inclus', 'exclu', 'offert'],
        explanation: "On demande si le petit-déjeuner est 'compris' ou 'inclus' dans le prix total."
      },
      {
        id: 'd2-b2',
        correctAnswer: 'payer',
        choices: ['payer', 'donner', 'rendre', 'acheter'],
        explanation: "'Payer par carte de crédit' est la structure standard."
      }
    ]
  },
  {
    id: 'dial-b1-entrevue',
    level: 'B1',
    title: 'Entretien d’embauche',
    theme: 'Job interview',
    lines: [
      { speaker: 'Recruteur', text: "Bonjour. Pouvez-vous me dire pourquoi vous postulez dans notre entreprise ?" },
      { speaker: 'Candidat', text: "Bonjour. Je souhaite rejoindre votre équipe parce que vos projets innovants correspondent à {0} aspirations professionnelles.", blankIndex: 0 },
      { speaker: 'Recruteur', text: "Je vois. Quelle est votre plus grande force dans le travail ?" },
      { speaker: 'Candidat', text: "Je suis très rigoureux et j'ai un excellent {1} d'équipe. Lors de mes anciennes expériences, j'ai souvent collaboré avec différents services.", blankIndex: 1 },
      { speaker: 'Recruteur', text: "Très bien. Avez-vous des questions sur les conditions de travail ?" },
      { speaker: 'Candidat', text: "Oui, je voudrais savoir s'il est possible de faire {2} télétravail.", blankIndex: 2 },
      { speaker: 'Recruteur', text: "Oui, nous proposons une formule hybride avec deux jours à distance par semaine." }
    ],
    blanks: [
      {
        id: 'd3-b0',
        correctAnswer: 'mes',
        choices: ['mes', 'ses', 'nos', 'leurs'],
        explanation: "Le candidat parle de ses propres aspirations : 'mes aspirations'."
      },
      {
        id: 'd3-b1',
        correctAnswer: 'esprit',
        choices: ['goût', 'esprit', 'sens', 'amour'],
        explanation: "'Esprit d'équipe' est l'expression consacrée pour 'team spirit'."
      },
      {
        id: 'd3-b2',
        correctAnswer: 'du',
        choices: ['du', 'de la', 'le', 'un'],
        explanation: "Faire + du télétravail (faire de + le télétravail)."
      }
    ]
  }
]
