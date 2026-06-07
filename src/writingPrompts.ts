import type { WritingPrompt } from './types'

export const totemWritingPrompts: WritingPrompt[] = [
  // A1 Prompts
  {
    id: 'totem-a1-writing-presenter',
    level: 'A1',
    title: 'Se présenter',
    task: 'Write 30-50 words. Introduce yourself to a new penpal: give your name, age, nationality, city of residence, and one hobby you like.',
    checklist: [
      'Give your name using Je m’appelle',
      'Give your age (e.g., J’ai 25 ans)',
      'State your nationality and city (e.g., Je suis canadien et j’habite à Montréal)',
      'Use the verb aimer to express an interest (e.g., J’aime le cinéma)'
    ],
    starter: "Bonjour ! Je m'appelle..."
  },
  {
    id: 'totem-a1-writing-logement',
    level: 'A1',
    title: 'Décrire son logement',
    task: 'Write 30-50 words. Describe your apartment or room to a friend. Mention how many rooms it has and at least one piece of furniture.',
    checklist: [
      'Use J’habite dans un(e)...',
      'Use Il y a... to list rooms (e.g., Il y a deux pièces)',
      'Name at least one piece of furniture (un lit, une table, une chaise...)',
      'Describe your space with a simple adjective (grand, calme, moderne...)'
    ],
    starter: "J'habite dans un..."
  },
  {
    id: 'totem-a1-writing-invitation',
    level: 'A1',
    title: 'Inviter un ami',
    task: 'Write 30-50 words. Invite a friend to your house for coffee or dinner. Specify the day and time.',
    checklist: [
      'Invite someone using Je t’invite... or Tu viens chez moi ?',
      'Specify the day of the week (e.g., samedi, vendredi...)',
      'Specify the time (e.g., à 19h, à midi...)',
      'Ask the friend to reply (e.g., Réponds-moi vite !)'
    ],
    starter: "Salut ! Est-ce que tu es libre..."
  },
  {
    id: 'totem-a1-writing-routine',
    level: 'A1',
    title: 'Ma routine du matin',
    task: 'Write 30-50 words. Describe your morning routine to a friend: when you wake up, what you eat for breakfast, and when you leave home.',
    checklist: [
      'Use at least one reflexive verb (e.g., se réveiller, se lever, se préparer)',
      'State the times of your actions (e.g., à 7h00)',
      'Mention a breakfast item (le café, le pain, le thé...)',
      'Use simple present tense conjugations'
    ],
    starter: "Le matin, je me réveille à..."
  },

  // A2 Prompts
  {
    id: 'totem-a2-writing-recit-passe',
    level: 'A2',
    title: 'Raconter ses vacances',
    task: 'Write 80-120 words. Describe your last weekend or vacation. Talk about where you went, who you were with, and what you did. Use passé composé for events and imparfait for description/weather.',
    checklist: [
      'Use at least three verbs in the passé composé (actions)',
      'Use at least two verbs in the imparfait (descriptions/weather)',
      'Describe the weather using Il faisait... or Il y avait...',
      'Link your sentences using d’abord, ensuite, and enfin'
    ],
    starter: "Le week-end dernier, je suis allé..."
  },
  {
    id: 'totem-a2-writing-plainte',
    level: 'A2',
    title: 'Lettre de réclamation',
    task: 'Write 80-120 words. Write a polite but firm complaint email to a customer service department about a broken or incorrect item you purchased online.',
    checklist: [
      'Start with a formal greeting (e.g., Madame, Monsieur,)',
      'Mention the order number and date of purchase',
      'Explain the exact problem (e.g., wrong size, damaged item)',
      'Request a solution clearly (refund or exchange)',
      'Close with a standard polite formula (e.g., Cordialement,)'
    ],
    starter: "Madame, Monsieur, je vous écris concernant ma commande..."
  },
  {
    id: 'totem-a2-writing-comparaison',
    level: 'A2',
    title: 'Comparer deux options',
    task: 'Write 80-120 words. Compare two cities or two restaurants you know. Talk about prices, atmosphere, and size, then say which one you prefer and why.',
    checklist: [
      'Use comparative terms (plus... que, moins... que, aussi... que)',
      'Use the pronoun y to avoid repeating place names',
      'Provide at least two clear points of comparison',
      'State your final preference with a reason'
    ],
    starter: "Je voudrais comparer..."
  },
  {
    id: 'totem-a2-writing-admiration',
    level: 'A2',
    title: 'Une personne que j’admire',
    task: 'Write 80-120 words. Describe a family member, friend, or famous person you admire. Describe their appearance, character, and why they inspire you.',
    checklist: [
      'Describe physical appearance (e.g., cheveux, yeux, taille)',
      'Describe personality traits (e.g., généreux, courageuse, drôle)',
      'Explain the link between you (e.g., C’est mon ami qui...)',
      'Use relative clauses with qui and que'
    ],
    starter: "La personne que j'admire le plus est..."
  },

  // B1 Prompts
  {
    id: 'totem-b1-writing-opinion',
    level: 'B1',
    title: 'Exprimer son opinion',
    task: 'Write 120-160 words. Give your opinion on the benefits and challenges of remote work (télétravail). Present arguments for and against, then state your final position.',
    checklist: [
      'Introduce your opinion using À mon avis or Selon moi',
      'Use cause and consequence connectors (car, puisque, donc, en effet)',
      'Present a counterargument using cependant, néanmoins, or en revanche',
      'Summarize your stance in a concluding sentence'
    ],
    starter: "De nos jours, le télétravail est devenu incontournable. À mon avis..."
  },
  {
    id: 'totem-b1-writing-lettre-motivation',
    level: 'B1',
    title: 'Lettre de motivation',
    task: 'Write 120-160 words. Write a formal letter applying for a job or internship in a francophone company. Highlight your education, professional experience, and motivation.',
    checklist: [
      'Include formal headings and object line (e.g., Objet : Candidature...)',
      'Describe your educational background and diplomas',
      'Detail your previous experiences using relative pronouns (dont, où)',
      'Show interest in the company and request an interview politely'
    ],
    starter: "Objet : Candidature au poste de... Madame, Monsieur..."
  },
  {
    id: 'totem-b1-writing-reaction-actus',
    level: 'B1',
    title: 'Réagir à l’actualité',
    task: 'Write 120-160 words. Summarize and react to a news story about an ecological decision (such as banning plastic bags or cars in the city center). Express your feelings and suggest a future action.',
    checklist: [
      'Summarize the news story in 2-3 sentences',
      'Express your opinion using the subjunctive mood (e.g., Je suis ravi que + subjonctif)',
      'Use a concession structure (e.g., bien que + subjonctif, même si...)',
      'Propose a practical action to protect the environment'
    ],
    starter: "Récemment, j'ai lu un article sur..."
  },
  {
    id: 'totem-b1-writing-experience-personnelle',
    level: 'B1',
    title: 'Une expérience marquante',
    task: 'Write 120-160 words. Talk about a major personal experience (e.g., moving, learning a language, a long trip) and explain how it changed you. Use compound tenses and a hypothetical si-clause in the past.',
    checklist: [
      'Use the plus-que-parfait tense to establish background events',
      'Use the conditionnel passé to describe what might have been',
      'Create a hypothetical sentence with si + plus-que-parfait → conditionnel passé',
      'Conclude by describing the impact on your current life'
    ],
    starter: "Il y a quelques années, j'ai pris la décision de..."
  }
]
