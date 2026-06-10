export type BookHighlightColor = 'blue' | 'pink' | 'green' | 'orange'

export interface BookGrammarPaletteItem {
  color: BookHighlightColor
  label: string
}

export interface BookGrammarContent {
  book: string
  pages: number[]
  images: string[]
  notes?: string[]
  palette?: BookGrammarPaletteItem[]
  sourceBlocks?: Array<{
    label?: string
    lines: string[]
  }>
  sourceBlocksByTopic?: Record<string, Array<{
    label?: string
    lines: string[]
  }>>
}

const page = (folder: string, file: string) => new URL(`../${folder}/${file}`, import.meta.url).href

const commonPalette: BookGrammarPaletteItem[] = [
  { color: 'blue', label: 'core form / masculine / main pattern' },
  { color: 'pink', label: 'feminine form / agreement change' },
  { color: 'green', label: 'plural form / result form / frequent ending' },
  { color: 'orange', label: 'structure cue / warning / contrast point' },
]

const a1_98 = [page('book_page_screenshots_fixed', 'book-29-page-098.png')]
const a1_99 = [page('book_page_screenshots_fixed', 'book-29-page-099.png')]
const a1_100_101 = [
  page('book_page_screenshots_fixed', 'book-29-page-100.png'),
  page('book_page_screenshots_fixed', 'book-29-page-101.png'),
]
const a1_102 = [page('book_page_screenshots_fixed', 'book-29-page-102.png')]
const a1_103 = [page('book_page_screenshots_fixed', 'book-29-page-103.png')]
const a1_104 = [page('book_page_screenshots_fixed', 'book-29-page-104.png')]
const a1_105_106 = [
  page('book_page_screenshots_fixed', 'book-29-page-105.png'),
  page('book_page_screenshots_fixed', 'book-29-page-106.png'),
]
const a1_107 = [page('book_page_screenshots_fixed', 'book-29-page-107.png')]

const a2_122 = [page('book31_page_screenshots_fixed', 'book-31-page-122.png')]
const a2_123 = [page('book31_page_screenshots_fixed', 'book-31-page-123.png')]
const a2_124 = [page('book31_page_screenshots_fixed', 'book-31-page-124.png')]
const a2_124_125 = [
  page('book31_page_screenshots_fixed', 'book-31-page-124.png'),
  page('book31_page_screenshots_fixed', 'book-31-page-125.png'),
]
const a2_126 = [page('book31_page_screenshots_fixed', 'book-31-page-126.png')]
const a2_127 = [page('book31_page_screenshots_fixed', 'book-31-page-127.png')]
const a2_128 = [page('book31_page_screenshots_fixed', 'book-31-page-128.png')]
const a2_129 = [page('book31_page_screenshots_fixed', 'book-31-page-129.png')]
const a2_130 = [page('book31_page_screenshots_fixed', 'book-31-page-130.png')]
const a2_131 = [page('book31_page_screenshots_fixed', 'book-31-page-131.png')]
const a2_132 = [page('book31_page_screenshots_fixed', 'book-31-page-132.png')]

const b1_156 = [page('book37_page_screenshots_fixed', 'book-37-page-156.png')]
const b1_157 = [page('book37_page_screenshots_fixed', 'book-37-page-157.png')]
const b1_158 = [page('book37_page_screenshots_fixed', 'book-37-page-158.png')]
const b1_159 = [page('book37_page_screenshots_fixed', 'book-37-page-159.png')]
const b1_160 = [page('book37_page_screenshots_fixed', 'book-37-page-160.png')]
const b1_161 = [page('book37_page_screenshots_fixed', 'book-37-page-161.png')]
const b1_162_163 = [
  page('book37_page_screenshots_fixed', 'book-37-page-162.png'),
  page('book37_page_screenshots_fixed', 'book-37-page-163.png'),
]
const b1_164 = [page('book37_page_screenshots_fixed', 'book-37-page-164.png')]
const b1_165 = [page('book37_page_screenshots_fixed', 'book-37-page-165.png')]
const b1_166 = [page('book37_page_screenshots_fixed', 'book-37-page-166.png')]
const b1_167_168 = [
  page('book37_page_screenshots_fixed', 'book-37-page-167.png'),
  page('book37_page_screenshots_fixed', 'book-37-page-168.png'),
]
const b1_169_170 = [
  page('book37_page_screenshots_fixed', 'book-37-page-169.png'),
  page('book37_page_screenshots_fixed', 'book-37-page-170.png'),
]
const b1_171 = [page('book37_page_screenshots_fixed', 'book-37-page-171.png')]
const b1_172_176 = [
  page('book37_page_screenshots_fixed', 'book-37-page-172.png'),
  page('book37_page_screenshots_fixed', 'book-37-page-173.png'),
  page('book37_page_screenshots_fixed', 'book-37-page-174.png'),
  page('book37_page_screenshots_fixed', 'book-37-page-175.png'),
  page('book37_page_screenshots_fixed', 'book-37-page-176.png'),
]

const contentByTopic: Record<string, BookGrammarContent> = {}

function assign(ids: string[], content: BookGrammarContent) {
  ids.forEach((id) => {
    contentByTopic[id] = content
  })
}

assign(['subject-pronouns-a1', 'tu-vous-a1', 'negation-ne-pas-a1'], {
  book: 'Totem 1 · Precis de grammaire',
  pages: [98],
  images: a1_98,
  palette: commonPalette,
  sourceBlocksByTopic: {
    'subject-pronouns-a1': [
      {
        label: 'Pronoms sujets',
        lines: [
          '[[blue|je]] parle, [[blue|tu]] parles, [[blue|il / elle / on]] parle',
          '[[green|nous]] parlons, [[green|vous]] parlez, [[green|ils / elles]] parlent',
        ],
      },
    ],
    'tu-vous-a1': [
      {
        label: 'Tu ou vous',
        lines: [
          '[[blue|tu]] = une personne, situation familiere',
          '[[green|vous]] = plusieurs personnes ou situation formelle',
        ],
      },
    ],
    'negation-ne-pas-a1': [
      {
        label: 'Negation',
        lines: [
          '[[orange|ne]] + verbe + [[orange|pas]]',
          'Je [[orange|ne]] parle [[orange|pas]].',
        ],
      },
    ],
  },
  notes: [
    'This page sets up the very first sentence tools: [[blue|subject pronouns]] before the verb, the use of [[orange|on]], and the basic negative frame [[orange|ne ... pas]].',
    'Use it as your grounding page for everyday identity sentences and polite address before moving into more specific A1 structures.',
  ],
})

assign(['articles-gender', 'definite-articles-a1', 'indefinite-articles-a1', 'plural-nouns-a1', 'c-est-il-est-a1', 'il-y-a-a1'], {
  book: 'Totem 1 · Precis de grammaire',
  pages: [99],
  images: a1_99,
  palette: commonPalette,
  sourceBlocksByTopic: {
    'articles-gender': [{ label: 'Genre', lines: ['[[blue|un]] ami / [[pink|une]] amie', 'masculin et feminin'] }],
    'definite-articles-a1': [{ label: 'Articles definis', lines: ['[[blue|le]] / [[pink|la]] / [[green|les]]'] }],
    'indefinite-articles-a1': [{ label: 'Articles indefinis', lines: ['[[blue|un]] / [[pink|une]] / [[green|des]]'] }],
    'plural-nouns-a1': [{ label: 'Pluriel', lines: ['un sac noir / des sacs noirs', 'une robe noire / des robes noires'] }],
    'c-est-il-est-a1': [{ label: 'Presentatifs', lines: ['[[blue|C\'est]] + nom', '[[blue|Il est]] + adjectif'] }],
    'il-y-a-a1': [{ label: 'Il y a', lines: ['[[blue|Il y a]] + nom'] }],
  },
  notes: [
    'This page covers the heart of early A1 description: [[blue|il y a]], [[blue|c est]], [[blue|le / un]], [[pink|la / une]], and [[green|les / des]].',
    'Read the page as a system: first you [[orange|present]] something, then you choose whether it is [[orange|already known]] or [[orange|new]], and finally you track [[pink|gender]] and [[green|plural]].',
  ],
})

assign(['possessive-adjectives-a1', 'demonstrative-adjectives-a1', 'adjective-agreement-a1', 'adjective-position-a1'], {
  book: 'Totem 1 · Precis de grammaire',
  pages: [100, 101],
  images: a1_100_101,
  palette: commonPalette,
  sourceBlocksByTopic: {
    'possessive-adjectives-a1': [{ label: 'Adjectifs possessifs', lines: ['[[blue|mon / ton / son]]', '[[pink|ma / ta / sa]]', '[[green|mes / tes / ses]]'] }],
    'demonstrative-adjectives-a1': [{ label: 'Adjectifs demonstratifs', lines: ['[[blue|ce]] livre, [[blue|cet]] ami', '[[pink|cette]] valise', '[[green|ces]] livres'] }],
    'adjective-agreement-a1': [{ label: 'Accord', lines: ['petit / [[pink|petite]] / [[green|petits, petites]]'] }],
    'adjective-position-a1': [{ label: 'Place de l\'adjectif', lines: ['un [[blue|petit]] appartement', 'une robe [[blue|bleue]]'] }],
  },
  notes: [
    'These pages show how French description becomes more precise: [[blue|mon / ton / son]], [[blue|ce / cet]], [[pink|cette]], [[green|ces]], and adjective agreement with the noun.',
    'Pay attention to the color logic in the page: [[blue|masculine]], [[pink|feminine]], and [[green|plural]] forms visually track the agreement pattern for you.',
  ],
})

assign(['questions', 'imperative-a1'], {
  book: 'Totem 1 · Precis de grammaire',
  pages: [102],
  images: a1_102,
  palette: commonPalette,
  sourceBlocksByTopic: {
    'questions': [
      { label: 'Questions', lines: ['[[orange|Est-ce que]] vous parlez francais ?', 'Ou habites-tu ? / Quand partez-vous ? / Pourquoi ? / Comment ?'] },
      { label: 'Question negative', lines: ['- Tu n\'as pas faim ?', '- [[pink|Si]], j\'ai faim.'] },
    ],
    'imperative-a1': [
      { label: 'Imperatif', lines: ['[[blue|Parle]] ! / [[green|Parlons]] ! / [[green|Parlez]] !'] },
    ],
  },
  notes: [
    'This page organizes several A1 question patterns together: [[orange|question adjectives]], [[orange|question adverbs]], rising intonation, inversion, and how to answer a negative question with [[pink|si]].',
    'At the bottom, the page also gives the A1 [[orange|imperative]] pattern, which is useful for short instructions and classroom commands.',
  ],
})

assign(['prepositions-place-a1'], {
  book: 'Totem 1 · Precis de grammaire',
  pages: [101],
  images: a1_100_101,
  palette: commonPalette,
  sourceBlocks: [
    {
      label: 'Ville et pays',
      lines: [
        '[[blue|a]] Paris',
        '[[green|en]] France',
        '[[blue|au]] Japon',
        '[[green|aux]] Etats-Unis',
      ],
    },
    {
      label: 'Position',
      lines: [
        'sur, sous, devant, derriere, entre, a cote de',
      ],
    },
  ],
  notes: [
    'Use this source page to anchor city and country expressions such as [[blue|a + city]], [[green|en + feminine country]], [[blue|au + masculine country]], and [[green|aux + plural country]].',
    'The picture row also gives you spatial expressions you can reuse immediately when describing location.',
  ],
})

assign(['present-er'], {
  book: 'Totem 1 · Precis de grammaire',
  pages: [103],
  images: a1_103,
  palette: commonPalette,
  sourceBlocks: [
    {
      label: 'Present des verbes en -er',
      lines: [
        'je parle / tu parles / il parle',
        'nous parlons / vous parlez / ils parlent',
      ],
    },
  ],
  notes: [
    'This page gives the clean A1 present-tense pattern for [[green|-er]] verbs and shows the spoken rhythm of the endings.',
    'It also reminds you that reflexive verbs add a second pronoun before the verb, which helps you build routine sentences naturally.',
  ],
})

assign(['present-aller-faire-a1', 'regular-ir-re-a1', 'futur-proche-a1'], {
  book: 'Totem 1 · Precis de grammaire',
  pages: [104],
  images: a1_104,
  palette: commonPalette,
  sourceBlocksByTopic: {
    'present-aller-faire-a1': [{ label: 'Verbes frequents', lines: ['[[blue|aller]]: je vais, tu vas, il va, nous allons, vous allez, ils vont', '[[blue|faire]]: je fais, tu fais, il fait, nous faisons, vous faites, ils font'] }],
    'regular-ir-re-a1': [{ label: 'Autres modeles', lines: ['finir -> je finis, nous finissons', 'prendre -> je prends, nous prenons'] }],
    'futur-proche-a1': [{ label: 'Futur proche', lines: ['[[green|aller + infinitif]]', 'Je [[green|vais visiter]] Lyon.'] }],
  },
  notes: [
    'This page continues the present system with common [[blue|-ir]] and mixed verb patterns, then moves into [[green|futur proche]] with [[blue|aller + infinitive]].',
    'Read it as a transition page: present-tense control first, then the simplest future structure built from [[blue|aller]].',
  ],
})

assign(['etre-avoir'], {
  book: 'Totem 1 · Precis de grammaire',
  pages: [105, 106],
  images: a1_105_106,
  palette: commonPalette,
  sourceBlocks: [
    {
      label: 'Etre',
      lines: [
        'je suis / tu es / il est / nous sommes / vous etes / ils sont',
      ],
    },
    {
      label: 'Avoir',
      lines: [
        'j\'ai / tu as / il a / nous avons / vous avez / ils ont',
      ],
    },
    {
      label: 'Auxiliaires',
      lines: [
        '[[blue|avoir]] ou [[green|etre]] + participe passe',
        'J\'ai parle. / Je suis arrive(e).',
      ],
    },
  ],
  notes: [
    'These pages show why [[blue|etre]] and [[green|avoir]] matter so much: they are the auxiliaries that build the [[orange|passe compose]].',
    'Even if your topic title is “Etre and Avoir”, the screenshot source is useful because it shows their real job inside complete past-tense structures.',
  ],
})

assign(['numbers-time-a1'], {
  book: 'Totem 1 · Precis de grammaire',
  pages: [107],
  images: a1_107,
  palette: commonPalette,
  sourceBlocks: [
    {
      label: 'Temps et chronologie',
      lines: [
        '[[blue|avant]] / [[orange|apres]] / [[green|pendant]]',
        '[[blue|en]] 2026 / le lundi / a 8 heures',
      ],
    },
    {
      label: 'Frequence',
      lines: [
        'toujours, souvent, parfois, jamais',
      ],
    },
  ],
  notes: [
    'This time page is the A1 bridge from isolated date expressions to full chronology: [[blue|en]], [[orange|apres]], [[orange|avant]], [[green|pendant]], frequency, and sequence markers.',
    'Use it to build short narratives and study plans, not just isolated vocabulary lists for time.',
  ],
})

assign(['partitive-articles-a2', 'quantities-a2', 'reflexive-verbs-a2'], {
  book: 'Totem 1 · Precis de grammaire',
  pages: [103],
  images: a1_103,
  palette: commonPalette,
  sourceBlocksByTopic: {
    'partitive-articles-a2': [{ label: 'Les articles partitifs', lines: ['On ne connaît pas la quantité.', 'Masculin : [[blue|du]] potiron, [[blue|de l\']]argent.', 'Féminin : [[pink|de la]] salade, [[pink|de l\']]eau.', 'Pluriel : [[green|des]] tomates, [[green|des]] oranges.'] }],
    'quantities-a2': [{ label: 'Les quantificateurs', lines: ['On connaît la quantité.', '[[orange|1, 2, 3...]] + ingrédient : cinq tomates.', '[[orange|200 grammes / 1 kilo]] + [[pink|de / d\']] + ingrédient : 700 g de veau.', '[[orange|une cuillère / un verre / une bouteille / un morceau]] + [[pink|de / d\']] + ingrédient : 2 cuillères d\'herbes.', '[[orange|un peu / beaucoup]] + [[pink|de / d\']] + ingrédient : un peu de sel.', 'Quantité 0 : [[blue|pas]] + [[pink|de / d\']] + produit : pas de sel.'] }],
    'reflexive-verbs-a2': [{ label: 'Les verbes pronominaux au présent', lines: ['Pour les verbes pronominaux, on utilise un deuxième pronom.', 'se coucher : je [[pink|me]] couche ; tu [[pink|te]] couches ; il/elle/on [[pink|se]] couche.', 'nous [[pink|nous]] couchons ; vous [[pink|vous]] couchez ; ils/elles [[pink|se]] couchent.'] }],
  },
  notes: [
    'This source page is still valuable at A2 because it shows [[blue|du / de la / des]] with quantity logic and reminds you how pronominal verb forms are assembled.',
    'Treat it as review material: the structure is simple, but these patterns keep returning in more advanced A2 sentences.',
  ],
})

assign(['object-pronouns'], {
  book: 'Totem 1 · Précis de grammaire',
  pages: [100],
  images: [page('book_page_screenshots_fixed', 'book-29-page-100.png')],
  sourceBlocks: [
    { label: 'Les pronoms compléments directs (COD)', lines: ['Les pronoms COD permettent d\'éviter une répétition : ils remplacent un nom déjà cité.', 'Masculin : [[blue|le]] / [[blue|l\']] + voyelle ; féminin : [[pink|la]] / [[pink|l\']] + voyelle ; pluriel : [[green|les]].', 'Les pronoms COD se placent avant le verbe.', 'Je connais cette étudiante. → Je [[pink|la]] connais.', 'J\'aime cette étudiante. → Je [[pink|l\']]aime.', 'Je connais ce chanteur. → Je [[blue|le]] connais.', 'J\'aime ce chanteur. → Je [[blue|l\']]aime.', 'Je connais ces films. → Je [[green|les]] connais. / J\'aime ces films. → Je [[green|les]] aime.', 'Avec il faut / il ne faut pas et le verbe devoir, les pronoms COD se placent avant l\'infinitif : Il faut [[blue|le]] signer ; Vous devez [[pink|l\']]envoyer ; Il ne faut pas [[pink|la]] noter.'] },
  ],
})

assign(['conditionnel-politesse-a1'], {
  book: 'Totem 1 · Précis de grammaire',
  pages: [103],
  images: a1_103,
  sourceBlocks: [
    { label: 'Le conditionnel de politesse du verbe vouloir', lines: ['[[green|Je voudrais]] + nom.', '[[green|Je voudrais]] un jus de fruit.'] },
  ],
})

assign(['present-continuous-a1'], {
  book: 'Totem 1 · Précis de grammaire',
  pages: [104],
  images: a1_104,
  sourceBlocks: [
    { label: 'Le présent continu', lines: ['On utilise le présent continu pour décrire une action que l\'on fait au moment où l\'on parle.', '[[blue|être en train de]] + infinitif.', 'je suis / tu es / il-elle-on est / nous sommes / vous êtes / ils-elles sont [[blue|en train de]] regarder un film.'] },
  ],
})

assign(['subject-pronouns-a1', 'tu-vous-a1', 'negation-ne-pas-a1'], {
  book: 'Totem 1 · Précis de grammaire',
  pages: [98],
  images: a1_98,
  sourceBlocksByTopic: {
    'subject-pronouns-a1': [
      { label: 'Les pronoms personnels sujets', lines: ['Le sujet est obligatoire avant le verbe.', 'Singulier : [[blue|je]], [[blue|tu]], [[blue|il / elle / on]]', 'Pluriel : [[green|nous]], [[green|vous]], [[green|ils / elles]]', 'appeler : j\'appelle, tu appelles, il/elle/on appelle, nous appelons, vous appelez, ils/elles appellent'] },
      { label: 'Le pronom "on"', lines: ['[[orange|on]] remplace [[green|nous]], [[green|ils]] ou [[green|elles]].', 'Avec [[orange|on]], le verbe se conjugue à la 3e personne du singulier.', 'On fait la fête. = Nous faisons la fête. / Les Parisiens font la fête.'] },
      { label: 'Le verbe s\'appeler', lines: ['s\'appeler ≠ appeler', 'je [[green|m\']]appelle / tu [[green|t\']]appelles / il-elle [[green|s\']]appelle', 'nous [[blue|nous]] appelons / vous [[blue|vous]] appelez / ils-elles [[green|s\']]appellent'] },
      { label: 'Les pronoms toniques', lines: ['Pour insister, après [[orange|c\'est]], ou après une préposition.', 'Singulier : [[blue|moi]], [[blue|toi]], [[blue|lui / elle]]', 'Pluriel : [[green|nous]], [[green|vous]], [[green|eux / elles]]', 'Moi, je m\'appelle Juliette. / Hugo, c\'est lui. / Je travaille avec toi.'] },
    ],
    'tu-vous-a1': [
      { label: 'Les personnes', lines: ['2e personne singulier : [[blue|tu]]', '2e personne pluriel : [[green|vous]]', 'tu appelles / vous appelez'] },
    ],
    'negation-ne-pas-a1': [
      { label: 'La négation', lines: ['sujet + [[orange|ne]] / [[orange|n\']] + verbe + [[orange|pas]]', 'Je [[orange|ne]] connais [[orange|pas]].', 'Je [[orange|n\']]aime [[orange|pas]].'] },
    ],
  },
  notes: [
    'Page 98 is the presentation page: subject pronouns, on, s\'appeler, ne ... pas, and tonic pronouns.',
    'Subject pronouns control verb agreement; tonic pronouns are used for emphasis, after c\'est, or after a preposition.',
  ],
})

assign(['articles-gender', 'definite-articles-a1', 'indefinite-articles-a1', 'plural-nouns-a1', 'c-est-il-est-a1', 'il-y-a-a1'], {
  book: 'Totem 1 · Précis de grammaire',
  pages: [99],
  images: a1_99,
  sourceBlocksByTopic: {
    'il-y-a-a1': [
      { label: 'Les présentatifs : il y a', lines: ['[[blue|il y a]] + article + nom', 'À Paris, [[blue|il y a]] le fleuve, les quais...'] },
    ],
    'c-est-il-est-a1': [
      { label: 'Les présentatifs : c\'est / voilà / ça', lines: ['[[blue|C\'est]] à moi ! / [[blue|Voilà]] des pommes. / Et avec [[blue|ça]] ?', '[[blue|il / elle est]] + adjectif ou profession : Il est grand ; elle est actrice ; elle est intelligente.', '[[blue|c\'est]] un / une + nom + adjectif : C\'est une femme élégante ; c\'est un acteur sérieux.', 'On peut ajouter des adjectifs : Il est grand, jeune et sympathique.'] },
    ],
    'indefinite-articles-a1': [
      { label: 'L\'article indéfini', lines: ['Pour parler d\'une chose pour la première fois.', 'Masculin : [[blue|un]] café', 'Féminin : [[pink|une]] baguette', 'Pluriel : [[green|des]] cafés, [[green|des]] baguettes'] },
    ],
    'definite-articles-a1': [
      { label: 'L\'article défini', lines: ['Pour parler d\'une chose pour la deuxième fois ou pour donner une précision.', 'Masculin : [[blue|le]] menu, [[blue|l\']]été', 'Féminin : [[pink|la]] salade, [[pink|l\']]addition', 'Pluriel : [[green|les]] desserts, [[green|les]] additions'] },
    ],
    'articles-gender': [
      { label: 'Les marques du genre', lines: ['À l\'écrit, le féminin finit souvent par [[pink|e]] : boulangerie, pharmacie.', 'Certains noms sont masculins : métro, restaurant.', 'À l\'oral, les mots féminins finissent souvent par une consonne prononcée : une baguette.', 'Les mots masculins finissent souvent par une voyelle prononcée : un café.'] },
    ],
    'plural-nouns-a1': [
      { label: 'Le pluriel des noms', lines: ['On ajoute généralement [[green|s]] à la fin du nom.', 'le quai → les quais ; un pont → des ponts', 'On ne prononce pas le [[green|s]].', 'Attention : un bateau → des bateaux.'] },
    ],
  },
  notes: [
    'Page 99 moves from presenting things to characterising them: il y a, c\'est/il est, articles, gender, and plural marks.',
    'The page separates written gender/plural marks from spoken clues, which is important because many final letters are silent.',
  ],
})

assign(['possessive-adjectives-a1', 'demonstrative-adjectives-a1', 'adjective-agreement-a1', 'adjective-position-a1'], {
  book: 'Totem 1 · Précis de grammaire',
  pages: [100, 101],
  images: a1_100_101,
  sourceBlocksByTopic: {
    'possessive-adjectives-a1': [
      { label: 'Les adjectifs possessifs', lines: ['Adjectif possessif + nom : ils marquent la possession.', 'Singulier masculin : [[blue|mon, ton, son]] ; [[green|notre, votre, leur]]', 'Singulier féminin : [[pink|ma, ta, sa]] ; [[green|notre, votre, leur]]', 'Devant un mot féminin qui commence par une voyelle : [[blue|mon]], [[blue|ton]], [[blue|son]] adresse.', 'Pluriel : [[green|mes, tes, ses, nos, vos, leurs]]', 'mes personnalités préférées, tes films, ses photos ; nos amis, vos personnalités préférées, leurs enfants'] },
    ],
    'demonstrative-adjectives-a1': [
      { label: 'Les adjectifs démonstratifs', lines: ['Adjectif démonstratif + nom : ils permettent de montrer un objet.', 'Masculin : [[blue|ce]] / [[blue|cet]] + voyelle', 'Féminin : [[pink|cette]]', 'Pluriel : [[green|ces]]', 'Ce style, ça vous va ? / Cette veste est un peu grande. / Ces chaussures sont belles. / Cet été.'] },
    ],
    'adjective-position-a1': [
      { label: 'Place de l\'adjectif', lines: ['L\'adjectif qualificatif se place généralement après le nom.', 'nom + adjectif : C\'est un homme élégant.', '[[orange|jeune]], [[orange|bon]] et [[orange|beau]] se placent avant le nom : une belle femme, un bon acteur.'] },
    ],
    'adjective-agreement-a1': [
      { label: 'Accord de l\'adjectif', lines: ['Au féminin, on ajoute souvent [[pink|e]] : Il est grand → Elle est grande.', 'On ne prononce pas le [[pink|e]], mais on prononce la consonne avant le e.', 'Si le masculin finit déjà par [[pink|e]], l\'adjectif ne change pas : Il est jeune → Elle est jeune.', 'Bon → bonne ; beau → belle ; courageux → courageuse.', 'Au pluriel, on ajoute [[green|s]] : Ils sont élégants ; elles sont élégantes. On ne prononce pas le s.'] },
      { label: 'L\'intensité', lines: ['[[orange|un peu]] / [[orange|très]] / [[orange|trop]] + adjectif', 'un peu grande + ; très grande ++ ; trop grande +++'] },
    ],
  },
  notes: [
    'Pages 100-101 separate possession, demonstration, adjective position, adjective agreement, and intensity.',
    'For adjectives, keep two questions separate: where does it go, and how does it agree?',
  ],
})

assign(['prepositions-place-a1'], {
  book: 'Totem 1 · Précis de grammaire',
  pages: [101],
  images: a1_100_101,
  sourceBlocks: [
    { label: 'Situer dans l\'espace : pays et villes', lines: ['venir [[green|de / d\']] + ville : Elle vient de Berlin, d\'Amsterdam.', 'habiter [[blue|à]] + ville : Il habite à Guadalajara.', 'habiter [[green|en]] + pays féminin ou commençant par une voyelle : Il habite en France, en Espagne.', '[[blue|au]] + pays masculin : Il habite au Japon.', '[[pink|aux]] + pays pluriel : Elles habitent aux États-Unis.'] },
    { label: 'Indiquer un lieu', lines: ['à droite / à gauche / à côté / près / loin'] },
  ],
  notes: [
    'Page 101 gives both country/city prepositions and the basic position words for describing where something is.',
  ],
})

assign(['questions', 'imperative-a1'], {
  book: 'Totem 1 · Précis de grammaire',
  pages: [101, 102],
  images: [page('book_page_screenshots_fixed', 'book-29-page-101.png'), ...a1_102],
  sourceBlocksByTopic: {
    'questions': [
      { label: 'Est-ce que ? / Qu\'est-ce que ?', lines: ['À une question avec [[orange|est-ce que ?]], on répond [[blue|oui]] ou [[blue|non]] : Est-ce que vous prenez un apéritif ? Oui / Non.', 'À une question avec [[orange|qu\'est-ce que ?]], on répond avec un nom ou une phrase : Qu\'est-ce que tu prends ? Le poulet. / Qu\'est-ce que tu fais ? Je lis un livre.'] },
      { label: 'L\'adjectif interrogatif quel', lines: ['[[orange|quel]] + nom ; [[orange|quel]] + verbe être', 'Masculin singulier : [[blue|quel]] ; féminin singulier : [[pink|quelle]]', 'Masculin pluriel : [[green|quels]] ; féminin pluriel : [[green|quelles]]', 'Quel genre de veste ? / Quelle est votre taille ? / Quels sont vos styles préférés ? / Quelles couleurs ?'] },
      { label: 'Les adverbes interrogatifs', lines: ['[[orange|Où ?]] Pour poser une question sur le lieu : Tu habites où ?', '[[orange|Quand ?]] Pour poser une question sur le temps : Elle arrive quand ?', '[[orange|Qui ?]] Pour poser une question sur une personne : C\'est qui ?', '[[orange|Combien ?]] Pour poser une question sur la quantité : Combien ça coûte ?'] },
      { label: 'Intonation et inversion', lines: ['À l\'oral, on peut utiliser l\'intonation : la voix monte. Vous voulez essayer cette veste ?', 'En registre soutenu et à l\'écrit : [[green|verbe + sujet]]. On ajoute un tiret. Voulez-vous l\'essayer ?'] },
      { label: 'Réponse à une question négative', lines: ['On ne peut pas répondre [[blue|oui]] à une question négative.', 'Tu n\'aimes pas les films d\'action ? — [[pink|Si]], j\'aime. / — Non, je n\'aime pas.'] },
    ],
    'imperative-a1': [
      { label: 'L\'impératif', lines: ['On utilise l\'impératif pour dire à quelqu\'un de faire quelque chose.', 'Il se conjugue aux 2es personnes du singulier et du pluriel ; il a la même forme que le présent.', 'On n\'utilise pas de pronom personnel sujet.', 'On supprime souvent le [[green|s]] à la 2e personne du singulier.', 'tu verses → verse ; vous versez → versez ; tu ouvres → ouvre ; vous ouvrez → ouvrez ; tu fais → fais ; vous faites → faites ; tu finis → finis ; vous finissez → finissez', 'Exceptions : être → sois, soyez ; avoir → aie, ayez.'] },
    ],
  },
  notes: [
    'Pages 101-102 gather the A1 question system: est-ce que, qu\'est-ce que, quel, question adverbs, intonation, inversion, and si after a negative question.',
    'The imperative section belongs separately because it is an instruction form, not a question form.',
  ],
})

assign(['present-er'], {
  book: 'Totem 1 · Précis de grammaire',
  pages: [103],
  images: a1_103,
  sourceBlocks: [
    { label: 'Le présent : verbes à une base', lines: ['Pour les verbes en [[green|-er]], on supprime -er et on ajoute [[green|e, es, e, ons, ez, ent]].', 'parler : je parle, tu parles, il/elle parle, ils/elles parlent ; nous parlons ; vous parlez.', 'À l\'oral, je parle / tu parles / il parle / ils parlent se prononcent souvent de la même façon.'] },
  ],
  notes: [
    'Page 103 gives the regular -er present pattern as its own section.',
  ],
})

assign(['present-aller-faire-a1', 'regular-ir-re-a1', 'futur-proche-a1'], {
  book: 'Totem 1 · Précis de grammaire',
  pages: [104, 105],
  images: [page('book_page_screenshots_fixed', 'book-29-page-104.png'), page('book_page_screenshots_fixed', 'book-29-page-105.png')],
  sourceBlocksByTopic: {
    'present-aller-faire-a1': [
      { label: 'Le présent continu', lines: ['Pour décrire une action faite au moment où l\'on parle.', '[[blue|être en train de]] + infinitif : je suis / tu es / il est / nous sommes / vous êtes / ils sont en train de regarder un film.'] },
    ],
    'regular-ir-re-a1': [
      { label: 'Verbes en -ir à une base', lines: ['Pour offrir, ouvrir... on supprime -ir et on ajoute [[blue|e, es, e, ons, ez, ent]].', 'offrir : j\'offre, tu offres, il offre, ils offrent, nous offrons, vous offrez.'] },
      { label: 'Verbes en -ir à deux bases', lines: ['Pour finir, choisir, réfléchir... on supprime -ir et on ajoute [[blue|is, is, it, issons, issez, issent]].', 'finir : je finis, tu finis, il finit, nous finissons, vous finissez, ils finissent.'] },
      { label: 'Autres verbes', lines: ['Terminaisons fréquentes : [[blue|s, s, d/t, ons, ez, ent]].', 'je sors, tu dors, il prend, elle vient, nous buvons, vous comprenez, ils viennent, elles partent.'] },
    ],
    'futur-proche-a1': [
      { label: 'Le futur proche', lines: ['Pour parler d\'une action dans le futur : [[blue|aller]] au présent + [[green|infinitif]].', 'je vais appeler ; tu vas sortir ; il/elle/on va aller ; nous allons dîner ; vous allez danser ; ils/elles vont partir.'] },
      { label: 'Futur proche des verbes pronominaux', lines: ['je vais [[pink|me]] coucher ; tu vas [[pink|te]] coucher ; il va [[pink|se]] coucher ; nous allons [[pink|nous]] coucher ; vous allez [[pink|vous]] coucher ; ils vont [[pink|se]] coucher.'] },
      { label: 'Négation au futur proche', lines: ['[[orange|ne]] + aller + [[orange|pas]] + infinitif', 'Je [[orange|ne]] vais [[orange|pas]] sortir.'] },
    ],
  },
  notes: [
    'Pages 104-105 complete the present system and introduce the futur proche, including pronominal verbs and negation.',
  ],
})

assign(['etre-avoir'], {
  book: 'Totem 1 · Précis de grammaire',
  pages: [105, 106],
  images: a1_105_106,
  sourceBlocks: [
    { label: 'Auxiliaires du passé composé', lines: ['Pour conjuguer au passé composé : auxiliaire [[green|être]] ou [[green|avoir]] au présent + participe passé.', 'être : je suis, tu es, il est, nous sommes, vous êtes, ils sont.', 'avoir : j\'ai, tu as, il a, nous avons, vous avez, ils ont.'] },
    { label: 'Formation des participes passés', lines: ['Verbes en -er → [[green|é]] : aimer → aimé.', 'Autres formes : finir → fini ; prendre → pris ; venir → venu.', 'être → été ; avoir → eu ; faire → fait.'] },
    { label: 'Avec être', lines: ['Les verbes pronominaux utilisent [[green|être]] : se lever, se coucher, se laver, se promener, se préparer, s\'appeler, se souvenir.', 'Les verbes de déplacement ou de changement d\'état utilisent souvent [[green|être]] : aller, venir, devenir, revenir, arriver, partir, entrer, sortir, monter, descendre, passer, retourner, tomber, rester, naître, mourir.', 'Exemples : je suis allé(e), elle est arrivée, ils sont partis, nous nous sommes levés.', 'Avec être, le participe s\'accorde avec le sujet : [[pink|e]] au féminin, [[green|s]] au pluriel.'] },
    { label: 'Avec avoir et négation', lines: ['Avec tous les autres verbes : j\'ai parlé, tu as parlé, il a parlé, nous avons parlé, vous avez parlé, ils ont parlé.', 'Négation : sujet + [[orange|ne]] + auxiliaire + [[orange|pas]] + participe passé.', 'Je n\'ai pas travaillé. / Je ne suis pas allée en course. / Je ne me suis pas promené.'] },
    { label: 'L\'imparfait et le contraste des temps', lines: ['Imparfait : souvenir, situation, habitude.', 'Formation : base de [[green|nous]] au présent + [[pink|ais, ais, ait, ions, iez, aient]].', 'Exception : être → j\'étais, tu étais, il était, nous étions, vous étiez, ils étaient.', 'Imparfait = situation ou sentiment ; passé composé = événements chronologiques ou changement.'] },
  ],
  notes: [
    'Pages 105-106 are the book\'s first full past-tense unit: passé composé, auxiliary choice, agreement, negation, imparfait, and passé composé versus imparfait.',
  ],
})

assign(['numbers-time-a1'], {
  book: 'Totem 1 · Précis de grammaire',
  pages: [107],
  images: a1_107,
  sourceBlocks: [
    { label: 'Indiquer un moment', lines: ['[[blue|En]] + année : en 1980.', '[[blue|En]] + mois + année : en août 95.', '[[orange|X ans / mois / semaines / jours après]] : Deux ans après...', '[[orange|À la fin de]] + déterminant + nom : à la fin de ses études, à la fin du film, à la fin des vacances.', '[[orange|Hier]] : Hier, je suis allée au secrétariat.', '[[orange|Il y a longtemps]] ; [[orange|il y a]] + passé composé : Je suis arrivée en France il y a 10 ans.'] },
    { label: 'Indiquer la chronologie', lines: ['[[orange|D\'abord]] / [[orange|puis]] / [[orange|enfin]]', 'Il est d\'abord parti en Afrique, puis en Asie. Enfin, il est rentré en France.'] },
    { label: 'Exprimer la durée', lines: ['[[orange|Pendant]] + saison / X ans / X jours / X mois / longtemps : Je vais réviser pendant les vacances.', '[[orange|Pendant]] + passé composé exprime une durée terminée : J\'ai travaillé dans un cabinet d\'avocat pendant 10 ans.'] },
    { label: 'Antériorité, postériorité, fréquence', lines: ['[[orange|après]] + article + nom ≠ [[orange|avant]] + article + nom', 'après la baignade, nous déjeunions ; avant le déjeuner, nous nous baignions.', '[[orange|X fois par]] + jour / semaine / mois / an : Deux fois par jour.'] },
  ],
  notes: [
    'Page 107 gathers the time markers learners need for dating events, sequencing a story, expressing duration, comparing before/after, and saying frequency.',
  ],
})

assign(['negation-varied-a2'], {
  book: 'Totem 2 · Precis de grammaire',
  pages: [123],
  images: a2_123,
  palette: commonPalette,
  sourceBlocks: [
    {
      label: 'Negations variees',
      lines: [
        'ne ... [[orange|plus]] / ne ... [[orange|jamais]]',
        'ne ... [[orange|rien]] / ne ... [[orange|personne]]',
      ],
    },
    {
      label: 'Exemples',
      lines: [
        'Je ne voyage plus.',
        'Il ne voit personne.',
      ],
    },
  ],
  notes: [
    'This page expands basic negation into the more useful A2 patterns: [[orange|ne ... rien]], [[orange|ne ... personne]], [[orange|ne ... jamais]], and [[orange|ne ... plus]].',
    'The blue tables matter here because they show [[orange|position]] just as much as meaning: the negative pieces wrap around the verb or auxiliary in a stable order.',
  ],
})

assign(['relative-qui-que-ou-a2'], {
  book: 'Totem 2 · Precis de grammaire',
  pages: [124],
  images: a2_124,
  palette: commonPalette,
  sourceBlocks: [
    {
      label: 'Pronoms relatifs',
      lines: [
        '[[pink|qui]] = sujet',
        '[[blue|que]] = COD',
        '[[green|ou]] = lieu ou temps',
      ],
    },
    {
      label: 'Exemples',
      lines: [
        'La femme [[pink|qui]] parle est ma soeur.',
        'Le livre [[blue|que]] je lis est interessant.',
      ],
    },
  ],
  notes: [
    'Use this page to separate the three core relative jobs clearly: [[pink|qui]] for the subject, [[blue|que]] for the direct object, and [[green|ou]] for place or time.',
    'It also introduces the logic of linking two clauses without repeating the same noun again.',
  ],
})

assign(['object-pronouns', 'pronoun-placement-a2', 'y-en-intro-a2'], {
  book: 'Totem 2 · Precis de grammaire',
  pages: [124, 125],
  images: a2_124_125,
  palette: commonPalette,
  sourceBlocksByTopic: {
    'object-pronouns': [{ label: 'Pronoms objets', lines: ['[[blue|me / te / le / la / nous / vous / les]]', '[[orange|lui / leur]]'] }],
    'pronoun-placement-a2': [{ label: 'Place du pronom', lines: ['Je [[orange|le]] vois.', 'Je vais [[orange|le]] voir.', 'Regarde-[[orange|le]] !'] }],
    'y-en-intro-a2': [{ label: 'Y et en', lines: ['[[blue|y]] = lieu / a + chose', '[[green|en]] = de + chose / quantite'] }],
  },
  notes: [
    'These pages are the real backbone for object pronouns: the chart gives [[blue|COD]], [[orange|COI]], and tonic forms, then the next page shows where pronouns sit [[orange|before the verb]], [[orange|before the infinitive]], or [[orange|after the imperative]].',
    'The second page adds [[blue|y]] and [[green|en]], so the whole pronoun system becomes visible in one place instead of as isolated rules.',
  ],
})

assign(['adverbs-a2', 'gerondif-intro-a2'], {
  book: 'Totem 2 · Precis de grammaire',
  pages: [126],
  images: a2_126,
  palette: commonPalette,
  sourceBlocksByTopic: {
    'adverbs-a2': [{ label: 'Adverbes en -ment', lines: ['heureux -> heureusement', 'rapide -> rapidement'] }],
    'gerondif-intro-a2': [{ label: 'Gerondif', lines: ['[[green|en + participe present]]', 'Il apprend le francais [[green|en regardant]] des videos.'] }],
  },
  notes: [
    'This page explains how many manner adverbs are built from the feminine adjective plus [[orange|-ment]], and then moves directly into the [[green|gerondif]] as a way to express manner.',
    'It is a good page to read slowly because both sections are about [[orange|how]] something happens, not just what happens.',
  ],
})

assign(['passe-compose', 'passe-compose-avoir-a2', 'passe-compose-etre-a2', 'imparfait', 'pc-imparfait-a2', 'past-participle-agreement-a2'], {
  book: 'Totem 2 · Precis de grammaire',
  pages: [127],
  images: a2_127,
  palette: commonPalette,
  sourceBlocksByTopic: {
    'passe-compose': [{ label: 'Le passé composé', lines: ['On utilise le passé composé pour décrire des événements passés dans un ordre chronologique et pour exprimer un changement.', 'Formation : auxiliaire [[green|être]] ou [[green|avoir]] au présent + participe passé.', 'Participes passés : verbes en -er → [[green|é]] : aimer → aimé.', 'Autres verbes → [[blue|i, is, u]] : finir → fini ; prendre → pris ; venir → venu.', 'Formes fréquentes : être → été ; avoir → eu ; faire → fait.', 'Avec [[green|être]] : verbes pronominaux et verbes de déplacement ou de changement d\'état.', 'Avec [[green|avoir]] : tous les autres verbes.'] }],
    'passe-compose-avoir-a2': [{ label: 'Passé composé avec avoir', lines: ['On utilise l\'auxiliaire [[green|avoir]] avec tous les autres verbes.', 'parler : j\'ai parlé ; tu as parlé ; il/elle/on a parlé ; nous avons parlé ; vous avez parlé ; ils/elles ont parlé.', 'Négation : sujet + [[orange|ne]] + auxiliaire + [[orange|pas]] + participe passé.', 'J\'ai travaillé. → Je [[orange|n\']]ai [[orange|pas]] travaillé.'] }],
    'passe-compose-etre-a2': [{ label: 'Passé composé avec être', lines: ['On utilise l\'auxiliaire [[green|être]] avec les verbes pronominaux et avec ces verbes : naître/mourir ; aller/venir/devenir ; arriver/rester/partir ; entrer/sortir ; monter/descendre ; passer ; retourner ; tomber.', 'sortir : je suis sorti(e) ; tu es sorti(e) ; il/elle/on est sorti(e) ; nous sommes sorti(e)s ; vous êtes sorti(e)s ; ils/elles sont sorti(e)s.', 'se lever : je me suis levé(e) ; tu t\'es levé(e) ; il/elle/on s\'est levé(e) ; nous nous sommes levé(e)s ; vous vous êtes levé(e)s ; ils/elles se sont levé(e)s.', 'Négation avec un verbe pronominal : Je me suis promené. → Je [[orange|ne]] me suis [[orange|pas]] promené.'] }],
    'imparfait': [{ label: 'L\'imparfait', lines: ['On utilise l\'imparfait pour raconter un souvenir, décrire une situation, exprimer une habitude.', 'Quand j\'étais petit. / J\'étais un enfant.', 'On achetait un chichi. Nous déjeunions sur la terrasse. On ne s\'ennuyait pas. C\'était bien !', 'Formation : 1re personne du pluriel au présent + [[pink|ais, ait, aient, ions, iez]].', 'Présent : nous allons → base de l\'imparfait : all-.', 'j\'allais ; tu allais ; il/elle/on allait ; ils/elles allaient ; nous allions ; vous alliez.', 'Une seule exception : être → j\'étais ; tu étais ; il/elle/on était ; ils/elles étaient ; nous étions ; vous étiez.'] }],
    'pc-imparfait-a2': [{ label: 'Le passé composé et l\'imparfait', lines: ['L\'imparfait décrit une situation, un sentiment passés.', 'Le passé composé décrit des événements passés dans un ordre chronologique, il exprime un changement.', 'J\'ai vécu à New York pendant 3 ans. J\'étais hôtesse d\'accueil. Ce travail ne me plaisait pas. J\'ai décidé de changer de carrière. Je suis partie au Japon.'] }],
    'past-participle-agreement-a2': [{ label: 'Accord du participe passé', lines: ['Avec l\'auxiliaire [[green|être]], le participe s\'accorde avec le sujet : [[pink|e]] pour le féminin, [[green|s]] pour le pluriel.', 'Je suis venu[[pink|e]]. (je = une femme)', 'Je suis sorti. (je = un homme)', 'Elle s\'est promené[[pink|e]].', 'Ils se sont retrouvé[[green|s]].', 'Elles sont parti[[pink|e]][[green|s]].'] }],
  },
  notes: [
    'This page organizes the A2 past system into one readable block: [[blue|etre]] verbs, [[green|avoir]] verbs, [[pink|agreement]], [[orange|imparfait]], and the contrast between background and events.',
    'Use it as your main narrative page: description and habits lean toward [[orange|imparfait]], while completed events that move the story forward lean toward [[green|passe compose]].',
  ],
})

assign(['time-expressions-a2', 'future-simple-intro-a2', 'si-present-future-a2'], {
  book: 'Totem 2 · Precis de grammaire',
  pages: [128],
  images: a2_128,
  palette: commonPalette,
  sourceBlocksByTopic: {
    'time-expressions-a2': [{ label: 'Temps', lines: ['il y a / depuis / pendant'] }],
    'future-simple-intro-a2': [{ label: 'Futur', lines: ['[[green|futur proche]]: je vais partir', '[[blue|futur simple]]: je partirai'] }],
    'si-present-future-a2': [{ label: 'Condition reelle', lines: ['[[pink|Si]] tu viens, nous sortirons.'] }],
  },
  notes: [
    'This page moves from time markers into future reference: [[orange|il y a]], [[orange|depuis]], [[orange|pendant]], then [[green|futur proche]], [[blue|futur simple]], and [[pink|si + present + future]].',
    'It is especially useful if you want to hear the difference between a near plan, a future project, and a conditional sequence.',
  ],
})

assign(['conditional-politeness-a2', 'reported-speech-a2'], {
  book: 'Totem 2 · Precis de grammaire',
  pages: [129],
  images: a2_129,
  palette: commonPalette,
  sourceBlocksByTopic: {
    'conditional-politeness-a2': [{ label: 'Conditionnel de politesse', lines: ['Je [[blue|voudrais]] un cafe.', 'Nous [[blue|aimerions]] reserver.'] }],
    'reported-speech-a2': [{ label: 'Paroles rapportees', lines: ['Il dit [[orange|que]] le cours commence.', 'Elle pense [[orange|que]] c\'est utile.'] }],
  },
  notes: [
    'This page groups together opinion, certainty, wish, and the first polite conditional forms such as [[blue|je voudrais]].',
    'Even if your app topic says “reported speech”, the source page is still relevant because it shows how French frames a thought or reported position through [[orange|que-clauses]] and mood choice.',
  ],
})

assign(['comparative-a2', 'superlative-a2'], {
  book: 'Totem 2 · Precis de grammaire',
  pages: [130],
  images: a2_130,
  palette: commonPalette,
  sourceBlocksByTopic: {
    'comparative-a2': [{ label: 'Comparatif', lines: ['[[green|plus]] ... que / [[blue|moins]] ... que / [[orange|aussi]] ... que'] }],
    'superlative-a2': [{ label: 'Superlatif', lines: ['[[pink|le plus]] / [[pink|la plus]] / [[pink|les plus]]'] }],
  },
  notes: [
    'This comparison table is one of the clearest screenshot sources: it separates [[green|superiority]], [[blue|inferiority]], [[orange|equality]], and the [[pink|superlative]] in one place.',
    'Because the layout is tabular, it is worth matching the pattern visually before trying to memorize the full sentences.',
  ],
})

assign(['articles-review-a2', 'plural-adjective-review-a2', 'nominalisation-a2'], {
  book: 'Totem 2 · Précis de grammaire',
  pages: [122],
  images: a2_122,
  sourceBlocksByTopic: {
    'articles-review-a2': [
      { label: 'Les articles', lines: ['L\'article défini introduit un nom « connu » : [[pink|La]] compagnie de théâtre le Royal de Luxe.', 'L\'article indéfini introduit un nom qui n\'est pas encore « connu » : [[pink|Une]] lettre est arrivée.', 'L\'article partitif introduit un nom qui n\'est pas « comptable » : Voulez-vous [[blue|du]] thé ?', 'Définis : masculin [[blue|le / l\']], féminin [[pink|la / l\']], pluriel [[green|les]].', 'Indéfinis : masculin [[blue|un]], féminin [[pink|une]], pluriel [[green|des]].', 'Partitifs : masculin [[blue|du / de l\']], féminin [[pink|de la / de l\']], pluriel [[green|des]].'] },
    ],
    'plural-adjective-review-a2': [
      { label: 'Le pluriel des noms', lines: ['On ajoute un [[green|-s]] à la fin du nom : un théâtre → des théâtres.', 'Attention : un bateau → des bateaux.', 'Pour les noms qui finissent par [[orange|-al]], le pluriel devient [[green|-aux]] : un animal → des animaux.'] },
      { label: 'La place et l\'accord de l\'adjectif', lines: ['L\'adjectif qualifie le nom. Il se place après le nom : C\'est une ville intéressante.', 'Les adjectifs [[orange|jeune]], [[orange|bon]], [[orange|beau]], [[orange|grand]], [[orange|petit]] se placent avant le nom : C\'est une belle ville.', 'On utilise [[orange|bel]] pour les noms masculins qui commencent par une voyelle : Un bel objet.', 'Au féminin, on ajoute un [[pink|-e]] : Le tapis est rond. → La table est ronde.', 'Au pluriel, on ajoute un [[green|-s]] : Les robots ménagers sont chers. Les photos artistiques sont chères.', 'Les adjectifs qui finissent par [[orange|-al]] ont un pluriel en [[green|-aux]] : un parc national → des parcs nationaux.'] },
    ],
    'nominalisation-a2': [
      { label: 'La nominalisation', lines: ['À partir d\'un verbe, on peut former un nom.', 'Suffixes de personne ou objet qui fait l\'action : [[blue|-teur / -trice]] : traduire → un traducteur / une traductrice.', 'Suffixes d\'action : [[green|-age]], [[green|-ment]], [[green|-tion]] : partager → le partage ; classer → un classement ; s\'inscrire → une inscription.', 'En général, les noms qui finissent par [[blue|-teur]], [[green|-age]], [[green|-ment]] sont masculins.', 'Les noms qui finissent par [[pink|-trice]], [[pink|-tion]] sont féminins.'] },
    ],
  },
})

assign(['truncation-a2', 'present-uses-a2', 'negation-varied-a2'], {
  book: 'Totem 2 · Précis de grammaire',
  pages: [123],
  images: a2_123,
  sourceBlocksByTopic: {
    'truncation-a2': [
      { label: 'La troncation', lines: ['On appelle troncation le fait de supprimer une ou plusieurs syllabes d\'un mot pour en créer un nouveau plus court.', 'un ordinateur → un [[blue|ordi]]', 'le cinématographe → le [[blue|cinéma]] → le [[blue|ciné]]', 'un professeur → un [[blue|prof]]', 'un autocar → un [[blue|car]]', 'On peut faire la même chose avec certains prénoms : Hippolyte → [[blue|Hippo]].'] },
    ],
    'present-uses-a2': [
      { label: 'Le présent', lines: ['On utilise le présent pour décrire une action en train de se passer : Je regarde un film.', 'Exprimer une idée : L\'art moderne, c\'est beau.', 'Décrire une habitude : Je fais du jogging.', 'Décrire un état : Je suis étudiante.', 'Parler du futur : Je vais à Paris à Noël.', 'Décrire une action qui a commencé dans le passé mais qui continue : Nous habitons à Nantes depuis six mois.'] },
    ],
    'negation-varied-a2': [
      { label: 'La place de la négation', lines: ['Avec un temps simple : sujet + [[orange|ne]] + verbe conjugué + [[orange|pas]] → Je ne comprends pas.', 'Avec un temps composé : sujet + [[orange|ne]] + auxiliaire + [[orange|pas]] + participe passé → Je ne suis pas sortie.', 'Avec le mode impératif : [[orange|ne]] + verbe conjugué + [[orange|pas]] → Ne lisez pas.'] },
      { label: 'Les différentes formes de négation', lines: ['La négation porte sur une chose : [[orange|ne / n\'... pas / rien]] → Il n\'aime rien.', 'La négation porte sur une personne : [[orange|ne / n\'... personne]] → On ne connaît personne.', 'La négation porte sur la fréquence : [[orange|ne / n\'... jamais / plus]] → Il ne va jamais au musée. / Il n\'aime plus la fac.'] },
    ],
  },
})

assign(['prepositions-a2', 'relative-qui-que-ou-a2', 'focus-cleft-a2', 'object-pronouns', 'pronoun-placement-a2', 'y-en-intro-a2', 'indefinites-a2'], {
  book: 'Totem 2 · Précis de grammaire',
  pages: [124, 125],
  images: a2_124_125,
  sourceBlocksByTopic: {
    'prepositions-a2': [
      { label: 'Les prépositions : localisation', lines: ['[[blue|à l\'extrémité de]] : à l\'extrémité du port.', '[[blue|face à]] : face à la Méditerranée.', '[[blue|au bord de]] : au bord de la Seine.', '[[blue|sur]] : sur la ville.'] },
      { label: 'Les prépositions : moyen, matière, verbe', lines: ['De moyen : [[green|en]] navette ; [[green|à]] vélo ; [[green|par]] la mer.', 'De matière : [[green|en]] métal.', 'Construction du verbe : [[orange|profiter de]] → On profite du week-end ; [[orange|ouvrir à]] → Le MuCEM a ouvert au public cet été.'] },
    ],
    'relative-qui-que-ou-a2': [
      { label: 'Les pronoms relatifs', lines: ['Ils permettent de relier deux phrases en évitant de répéter un nom ou un pronom.', 'Pour remplacer un sujet : [[pink|qui]] ; il est toujours suivi d\'un verbe. J\'ai une amie qui fait des études de sociologie.', 'Pour remplacer un COD : [[blue|que / qu\']] ; il est suivi d\'un sujet. Je vais voir un film que Juliette m\'a conseillé.', 'Pour remplacer un complément de lieu : [[green|où]]. C\'est la ville où j\'habite.'] },
    ],
    'focus-cleft-a2': [
      { label: 'La mise en valeur', lines: ['Pour insister et mettre en valeur un mot ou un groupe de mots, on utilise : [[orange|ce que / ce qui... c\'est]].', 'Ce que j\'aime, c\'est le cinéma.', 'Ce qui me plaît, c\'est le cinéma.'] },
    ],
    'object-pronouns': [
      { label: 'Les pronoms personnels', lines: ['Compléments d\'objet direct : [[blue|me / m\']], [[blue|te / t\']], [[blue|le / l\']], [[pink|la / l\']], [[green|nous]], [[green|vous]], [[green|les]].', 'Compléments d\'objet indirect : [[blue|me / m\']], [[blue|te / t\']], [[orange|lui]], [[green|nous]], [[green|vous]], [[orange|leur]].', 'Toniques : moi, toi, lui / elle, nous, vous, eux / elles.'] },
      { label: 'COD et COI', lines: ['Les pronoms COD s\'utilisent avec des verbes sans préposition. Ils remplacent des choses ou des personnes : Je vois Hugo tous les jours. → Je le vois tous les jours.', 'Les pronoms COI remplacent des noms précédés de la préposition [[orange|à]]. Ils remplacent souvent des personnes : Je téléphone à Charlotte. → Je lui téléphone.'] },
    ],
    'pronoun-placement-a2': [
      { label: 'La place des pronoms', lines: ['Avant le verbe : Je le vois demain.', 'Avant l\'infinitif : Impossible de le voir.', 'Entre le verbe et l\'infinitif : Je peux le faire.', 'Avec l\'impératif affirmatif, le pronom se met après le verbe ; [[pink|me]] et [[pink|te]] deviennent [[pink|moi]] et [[pink|toi]] : Décide-toi !'] },
    ],
    'y-en-intro-a2': [
      { label: 'Le pronom y', lines: ['Le pronom [[blue|y]] permet de remplacer un complément de lieu.', 'Il se place avant le verbe.', 'J\'aime bien aller à Marseille. → J\'[[blue|y]] vais l\'été.'] },
      { label: 'Le pronom en', lines: ['Le pronom [[green|en]] remplace un nom précédé de un(e), du, de la, de(s).', 'Il se place avant le verbe : Je vais en faire.', 'En peut remplacer : du sport, de la danse, des exercices ; un travail, un appartement.', 'Il s\'utilise avec des verbes qui se construisent avec [[orange|de]] : penser / parler de. Qu\'est-ce que tu en penses ?'] },
    ],
    'indefinites-a2': [
      { label: 'Les indéfinis', lines: ['Ils servent à désigner des personnes ou des choses de manière plus ou moins précise. Ils peuvent être sujet ou COD.', 'Sens positif, unité : [[blue|chacun(e)]], [[blue|chaque]], [[blue|tout(e)]].', 'Sens positif, pluralité : [[green|tous / toutes]], [[green|quelques]].', 'Sens négatif : [[orange|personne]], [[orange|rien]].', 'Tout être humain a droit à la liberté d\'expression. / Tous les hommes naissent libres et égaux.', 'Chacun est libre d\'aller où il veut. / Quelques droits ne sont pas respectés.', 'J\'aime tous les tableaux de Matisse. / Je ne connais personne. / Je ne veux rien.'] },
    ],
  },
})

assign(['interrogative-pronouns-a2', 'demonstrative-pronouns-a2', 'adverbs-a2', 'gerondif-intro-a2'], {
  book: 'Totem 2 · Précis de grammaire',
  pages: [126],
  images: a2_126,
  sourceBlocksByTopic: {
    'interrogative-pronouns-a2': [{ label: 'Les pronoms interrogatifs', lines: ['Ils peuvent être simples : [[blue|qui]], ou composés : [[blue|lequel]], [[pink|laquelle]], [[green|lesquels]], [[green|lesquelles]].', 'Les pronoms interrogatifs composés s\'accordent en genre et en nombre.', 'Ils permettent d\'interroger sur un ou plusieurs objets extraits d\'un ensemble.', 'Masculin singulier : lequel ; féminin singulier : laquelle ; masculin pluriel : lesquels ; féminin pluriel : lesquelles.', 'Lequel de ces tableaux te plaît ? / Tu as trois vestes. Laquelle vas-tu mettre ?'] }],
    'demonstrative-pronouns-a2': [{ label: 'Les pronoms démonstratifs', lines: ['Ils remplacent un nom que l\'on veut montrer ou situer.', 'Si on a deux choix, on dit « ci » puis « là ». Si on a un seul choix, on emploie l\'un ou l\'autre.', 'Masculin singulier : [[blue|celui-ci / celui-là]] ; féminin singulier : [[pink|celle-ci / celle-là]].', 'Masculin pluriel : [[green|ceux-ci / ceux-là]] ; féminin pluriel : [[green|celles-ci / celles-là]].', 'Lequel ? Celui-là. / Ces œuvres sont intéressantes mais celle-ci est vraiment belle.'] }],
    'adverbs-a2': [{ label: 'Les adverbes de manière', lines: ['Ils s\'utilisent pour caractériser la manière de faire quelque chose.', 'La plupart se forment avec l\'adjectif au féminin + [[green|-ment]].', 'attentif → attentive → attentivement ; parfait → parfaite → parfaitement.', 'Certains adverbes sont irréguliers : courant → couramment ; intelligent → intelligemment.'] }],
    'gerondif-intro-a2': [{ label: 'Le gérondif', lines: ['On utilise le gérondif pour exprimer la manière.', 'Le sujet du verbe au gérondif est le même que celui de la principale.', 'Formation : [[pink|en]] + base du verbe à la 1re personne du pluriel du présent + [[blue|-ant]].', 'finir : nous finissons → finissant → en finissant ; prendre : nous prenons → prenant → en prenant ; vivre : nous vivons → vivant → en vivant.', 'Je lis le journal en prenant mon petit déjeuner.', 'Les pronoms compléments se placent avant le participe présent : Elle lui parle en le regardant dans les yeux.'] }],
  },
})

assign(['passe-compose', 'passe-compose-avoir-a2', 'passe-compose-etre-a2', 'imparfait', 'pc-imparfait-a2', 'time-expressions-a2'], {
  book: 'Totem 2 · Précis de grammaire',
  pages: [127, 128],
  images: [page('book31_page_screenshots_fixed', 'book-31-page-127.png'), page('book31_page_screenshots_fixed', 'book-31-page-128.png')],
  sourceBlocksByTopic: {
    'passe-compose': [{ label: 'Le passé composé', lines: ['On utilise le passé composé pour raconter un événement passé, terminé et limité dans le temps.', 'Les événements sont présentés dans un ordre chronologique.', 'Avec [[green|être]] : verbes pronominaux et verbes de déplacement / changement. Avec [[green|avoir]] : tous les autres verbes.'] }],
    'passe-compose-etre-a2': [{ label: 'Avec l\'auxiliaire être', lines: ['On utilise [[green|être]] avec les verbes pronominaux : Elle s\'est inscrite à la fac.', 'Verbes fréquents avec être : naître / mourir ; aller / venir / devenir ; arriver / rester / partir ; entrer / sortir ; monter / descendre ; passer ; retourner ; tomber.', 'Elle est née en Espagne.', 'Avec être, le participe passé s\'accorde avec le sujet : Elle s\'est levée tôt. Ils sont devenus amis.'] }],
    'passe-compose-avoir-a2': [{ label: 'Avec l\'auxiliaire avoir', lines: ['Pour tous les autres verbes, on utilise [[green|avoir]].', 'Avec avoir, le participe passé ne s\'accorde pas avec le sujet.', 'Elle a travaillé au Japon. / Hugo a invité Juliette.'] }],
    'imparfait': [{ label: 'L\'imparfait', lines: ['On utilise l\'imparfait pour exprimer une situation, faire une description (personnes, états), décrire une habitude.', 'Formation : base de la 1re personne du pluriel au présent + [[pink|-ais, -ais, -ait, -ions, -iez, -aient]].', 'Je passais mes vacances au bord de la mer.', 'Exception : être → j\'étais, tu étais...'] }],
    'pc-imparfait-a2': [{ label: 'Le récit au passé', lines: ['Pour raconter au passé, on donne deux types d\'informations.', 'Les circonstances, les personnes, les états → [[pink|imparfait]].', 'Les événements, les changements, ce qui s\'est passé → [[green|passé composé]].', 'Il y avait beaucoup de monde, la musique était super. Nous avons rencontré Juliette et ses copains. Nous nous sommes assis avec eux.', 'Ce sont les verbes au passé composé qui font « avancer » le récit.'] }],
    'time-expressions-a2': [{ label: 'Les indicateurs temporels', lines: ['Chronologie : [[orange|d\'abord]], [[orange|ensuite / puis]], [[orange|enfin]].', 'D\'abord, nous sommes partis à la mer. Ensuite, nous avons visité Toulouse. Enfin, nous avons fait de la marche dans les Pyrénées.', 'Antériorité / postériorité : [[orange|avant de]] + infinitif ; [[orange|après]] + nom.', 'Pour situer un événement dans le passé : [[orange|il y a]], [[orange|en]], [[orange|à l\'âge de]], [[orange|X ans plus tard]], [[orange|X ans après]].', 'Durée terminée : [[orange|pendant]] cinq ans. Action commencée dans le passé et qui continue : [[orange|depuis]] + verbe au présent.'] }],
  },
})

assign(['passe-recent-a2', 'future-simple-intro-a2', 'si-present-future-a2', 'imperative-pronouns-a2'], {
  book: 'Totem 2 · Précis de grammaire',
  pages: [128],
  images: a2_128,
  sourceBlocksByTopic: {
    'passe-recent-a2': [{ label: 'Le passé récent', lines: ['Il permet de rapporter une action qui s\'est passée juste avant le moment où on parle.', 'Formation : [[green|venir]] au présent + [[pink|de]] + infinitif.', 'Il vient de rentrer.'] }],
    'future-simple-intro-a2': [{ label: 'Le futur simple', lines: ['Il s\'utilise pour parler d\'une action à venir, faire des projets, prendre des résolutions.', 'Formation : infinitif + [[green|-ai, -as, -a, -ons, -ez, -ont]].', 'L\'année prochaine, je partirai en voyage.'] }],
    'si-present-future-a2': [{ label: 'Faire une hypothèse', lines: ['Pour exprimer un projet sous condition, on utilise : [[pink|si]] + [[blue|présent]] + [[green|futur simple]].', 'La condition est au présent et le résultat est au futur.', 'Si nous avons le temps, nous irons au cinéma. / Nous irons au cinéma, si nous avons le temps.'] }],
    'imperative-pronouns-a2': [{ label: 'L\'impératif', lines: ['On utilise l\'impératif pour dire à quelqu\'un de faire quelque chose.', 'Il se conjugue à la 2e personne du singulier et aux 1re et 2e personnes du pluriel : Sors ! Sortons ! Sortez !', 'Forme négative : [[orange|ne / n\']] + impératif + [[orange|pas]] : Ne buvez pas d\'alcool.', 'Impératif des verbes pronominaux : [[pink|me]] et [[pink|te]] deviennent [[pink|moi]] et [[pink|toi]] : Installe-toi. Promenons-nous.'] }],
  },
})

assign(['imperative-pronouns-a2', 'obligation-expressions-a2', 'reported-speech-a2', 'conditional-politeness-a2'], {
  book: 'Totem 2 · Précis de grammaire',
  pages: [128, 129],
  images: [page('book31_page_screenshots_fixed', 'book-31-page-128.png'), page('book31_page_screenshots_fixed', 'book-31-page-129.png')],
  sourceBlocksByTopic: {
    'imperative-pronouns-a2': [
      { label: 'L\'impératif', lines: ['On utilise l\'impératif pour dire à quelqu\'un de faire quelque chose.', 'Il se conjugue à la 2e personne du singulier et aux 1re et 2e personnes du pluriel : Sors ! Sortons ! Sortez !', 'Forme négative : [[orange|ne / n\']] + impératif + [[orange|pas]] : Ne buvez pas d\'alcool.', 'Impératif des verbes pronominaux : [[pink|me]] et [[pink|te]] deviennent [[pink|moi]] et [[pink|toi]] : Installe-toi. Promenons-nous.'] },
      { label: 'L\'impératif et les pronoms compléments', lines: ['Le pronom complément COD ou COI se place après le verbe à l\'impératif affirmatif.', 'Demandez-lui. / Donne-le.', 'On utilise [[pink|moi]], [[pink|toi]], [[green|nous]], [[green|vous]] pour les 1res et 2es personnes : Levez-vous.'] },
    ],
    'obligation-expressions-a2': [{ label: 'Le subjonctif', lines: ['On utilise le subjonctif après [[orange|il faut que]] / [[orange|il ne faut pas que]].', 'Il faut que vous soyez à l\'heure. / Il ne faut pas que vous parliez trop fort.', 'Pour je, tu, il/elle/on, ils/elles : base de la 3e personne du pluriel au présent + terminaisons [[pink|-e, -es, -e, -ent]].', 'ils viennent → base vienn- : que je vienne, que tu viennes, qu\'il vienne, qu\'ils viennent.', 'Pour nous, vous : base de la 1re personne du pluriel au présent + terminaisons de l\'imparfait [[pink|-ions, -iez]] : nous venons → que nous venions, que vous veniez.', 'Verbes irréguliers : être, avoir, aller, faire, pouvoir, savoir, vouloir.'] }],
    'reported-speech-a2': [{ label: 'L\'opinion et la certitude', lines: ['Opinion : [[blue|penser / trouver / croire que]] + indicatif.', 'Nous pensons que l\'écologie est nécessaire. / Nous trouvons que l\'art moderne est joyeux. / Je crois que la culture pour tous, c\'est bien.', 'Certitude : [[green|être sûr(e) / être certain(e) que]] + indicatif.', 'Je suis sûr qu\'elle trouvera un travail. / Nous sommes certains qu\'il réussira ses études.'] }],
    'conditional-politeness-a2': [{ label: 'Exprimer un souhait', lines: ['Pour exprimer un souhait : le subjonctif avec le verbe souhaiter ; le conditionnel avec le verbe vouloir ou être + infinitif.', 'Le subjonctif suppose deux sujets différents : Je souhaite qu\'elle réussisse. / Il souhaite que vous veniez à sa fête.', 'Conditionnel avec vouloir : Je voudrais partir en vacances.', 'Formation du conditionnel présent : base du futur simple + terminaisons de l\'imparfait. Futur : j\'aimerai → conditionnel : j\'aimerais voyager.'] }],
  },
})

assign(['comparative-a2', 'superlative-a2', 'connectors-a2'], {
  book: 'Totem 2 · Précis de grammaire',
  pages: [130],
  images: a2_130,
  sourceBlocksByTopic: {
    'comparative-a2': [{ label: 'Comparer', lines: ['Supériorité : [[green|plus]] + adjectif / adverbe + [[green|que]] : Il est plus grand que son frère.', 'Sur un nom : [[green|plus de / d\']] + nom + [[green|que]] : Il a plus de livres que son copain.', 'Infériorité : [[blue|moins]] + adjectif / adverbe + [[blue|que]] ; [[blue|moins de]] + nom + [[blue|que]].', 'Égalité : [[orange|aussi]] + adjectif / adverbe + [[orange|que]] ; [[orange|autant de]] + nom + [[orange|que]].', 'Comparatifs irréguliers : bon(ne) → meilleur(e), bien → mieux. Le chocolat est meilleur que le café. Il joue mieux qu\'elle.'] }],
    'superlative-a2': [{ label: 'Le superlatif', lines: ['[[pink|le / la / les plus / moins]] + adjectif / adverbe : C\'est le plus bel appartement !', 'Formes irrégulières : C\'est la meilleure ! / C\'est le mieux.', '[[pink|le plus de / d\']] / [[pink|le moins de / d\']] + nom : C\'est la rue qui a le moins de magasins.'] }],
    'connectors-a2': [{ label: 'Organiser ses idées', lines: ['But : [[orange|pour]] + infinitif. Je suis allée en Allemagne pour donner des cours de français.', 'Cause : [[orange|parce que]] + phrase ; [[orange|à cause de]] + nom / pronom ; [[orange|grâce à]] + nom / pronom.', 'J\'apprends le français parce que je voudrais travailler en France. / À cause de la neige, je n\'ai pas pu quitter Paris. / Grâce à des amis, j\'ai trouvé un appartement.', 'Conséquence : [[orange|c\'est pour ça que]], [[orange|donc]], [[orange|alors]] + phrase.', 'Opposition / concession : [[orange|mais]] rapproche deux faits de même nature en mettant en évidence une différence ou un paradoxe : Je viendrai mais je n\'ai pas le temps.'] }],
  },
})

assign(['modes-register-a2'], {
  book: 'Totem 2 · Précis de grammaire',
  pages: [131],
  images: a2_131,
  sourceBlocks: [
    { label: 'Les modes', lines: ['L\'indicatif : mode du réel. Il comporte le présent, le futur simple, le futur proche, le passé composé, l\'imparfait.', 'Le subjonctif : mode de ce qui n\'est pas encore réalisé, des sentiments, de la nécessité, du souhait. Il comporte le présent.', 'Le conditionnel : mode de ce qui est imaginé, éventuel. C\'est aussi le mode de la politesse. Il comporte le présent.'] },
    { label: 'La phrase', lines: ['Phrase simple : sujet + verbe + complément. Nous souhaitons la préservation des loups.', 'Phrase complexe : sujet + verbe + [[pink|que]] + sujet + [[pink|verbe au subjonctif]] : Nous souhaitons qu\'il y ait plus de jardins.', 'Sujet + verbe + [[green|parce que]] + sujet + verbe à l\'indicatif : Nous manifesterons parce que nous réclamons plus d\'espaces verts.', 'Infinitif : on peut + venir + infinitif. On peut venir protester.'] },
    { label: 'Les niveaux de langue', lines: ['Niveau courant : utilisé à l\'écrit comme à l\'oral dans le milieu scolaire, professionnel, les relations sociales.', 'Niveau courant : vocabulaire simple, règles de grammaire et de construction respectées. Ce n\'est pas beau et ça coûte beaucoup d\'argent. / Ça ne me plaît pas.', 'Niveau familier : utilisé entre amis et à l\'oral ; mots familiers ; règles de grammaire pas toujours respectées ; suppression du ne/n\' de la négation ; on utilise généralement on à la place de nous.', 'C\'est nul ce truc et ça coûte un fric fou ! / Ça me plaît pas !'] },
  ],
})

assign(['core-verb-reference-a2', 'future-simple-intro-a2', 'conditional-politeness-a2', 'obligation-expressions-a2'], {
  book: 'Totem 2 · Précis de conjugaison',
  pages: [128, 129, 132],
  images: [page('book31_page_screenshots_fixed', 'book-31-page-128.png'), page('book31_page_screenshots_fixed', 'book-31-page-129.png'), ...a2_132],
  sourceBlocksByTopic: {
    'core-verb-reference-a2': [
      { label: 'Être et avoir : formes utiles', lines: ['Présent être : je suis, tu es, il/elle/on est, nous sommes, vous êtes, ils/elles sont.', 'Présent avoir : j\'ai, tu as, il/elle/on a, nous avons, vous avez, ils/elles ont.', 'Passé composé : j\'ai été / j\'ai eu ; tu as été / tu as eu ; il a été / il a eu ; nous avons été / nous avons eu ; vous avez été / vous avez eu ; ils ont été / ils ont eu.', 'Imparfait : j\'étais / j\'avais ; tu étais / tu avais ; il était / il avait ; nous étions / nous avions ; vous étiez / vous aviez ; ils étaient / ils avaient.'] },
      { label: 'Aller, faire, vivre : présent et impératif', lines: ['Aller présent : je vais, tu vas, il va, nous allons, vous allez, ils vont. Impératif : va, allons, allez.', 'Faire présent : je fais, tu fais, il fait, nous faisons, vous faites, ils font. Impératif : fais, faisons, faites.', 'Vivre présent : je vis, tu vis, il vit, nous vivons, vous vivez, ils vivent. Impératif : vis, vivons, vivez.'] },
    ],
    'future-simple-intro-a2': [
      { label: 'Le futur simple', lines: ['Il s\'utilise pour parler d\'une action à venir, faire des projets, prendre des résolutions.', 'Formation : infinitif + [[green|-ai, -as, -a, -ons, -ez, -ont]].', 'L\'année prochaine, je partirai en voyage.'] },
      { label: 'Futur simple : verbes fréquents', lines: ['Être : je serai, tu seras, il sera, nous serons, vous serez, ils seront.', 'Avoir : j\'aurai, tu auras, il aura, nous aurons, vous aurez, ils auront.', 'Aller : j\'irai, tu iras, il ira, nous irons, vous irez, ils iront.', 'Faire : je ferai, tu feras, il fera, nous ferons, vous ferez, ils feront.', 'Vivre : je vivrai, tu vivras, il vivra, nous vivrons, vous vivrez, ils vivront.'] },
    ],
    'conditional-politeness-a2': [
      { label: 'Exprimer un souhait', lines: ['Pour exprimer un souhait : le subjonctif avec le verbe souhaiter ; le conditionnel avec le verbe vouloir ou être + infinitif.', 'Le subjonctif suppose deux sujets différents : Je souhaite qu\'elle réussisse. / Il souhaite que vous veniez à sa fête.', 'Conditionnel avec vouloir : Je voudrais partir en vacances.', 'Formation du conditionnel présent : base du futur simple + terminaisons de l\'imparfait. Futur : j\'aimerai → conditionnel : j\'aimerais voyager.'] },
      { label: 'Conditionnel présent : verbes fréquents', lines: ['Être : je serais, tu serais, il serait, nous serions, vous seriez, ils seraient.', 'Avoir : j\'aurais, tu aurais, il aurait, nous aurions, vous auriez, ils auraient.', 'Aller : j\'irais, tu irais, il irait, nous irions, vous iriez, ils iraient.', 'Faire : je ferais, tu ferais, il ferait, nous ferions, vous feriez, ils feraient.', 'Vivre : je vivrais, tu vivrais, il vivrait, nous vivrions, vous vivriez, ils vivraient.'] },
    ],
    'obligation-expressions-a2': [
      { label: 'Le subjonctif', lines: ['On utilise le subjonctif après [[orange|il faut que]] / [[orange|il ne faut pas que]].', 'Il faut que vous soyez à l\'heure. / Il ne faut pas que vous parliez trop fort.', 'Pour je, tu, il/elle/on, ils/elles : base de la 3e personne du pluriel au présent + terminaisons [[pink|-e, -es, -e, -ent]].', 'Pour nous, vous : base de la 1re personne du pluriel au présent + terminaisons de l\'imparfait [[pink|-ions, -iez]].', 'Verbes irréguliers : être, avoir, aller, faire, pouvoir, savoir, vouloir.'] },
      { label: 'Subjonctif présent : verbes fréquents', lines: ['Être : que je sois, que tu sois, qu\'il soit, que nous soyons, que vous soyez, qu\'ils soient.', 'Avoir : que j\'aie, que tu aies, qu\'il ait, que nous ayons, que vous ayez, qu\'ils aient.', 'Aller : que j\'aille, que tu ailles, qu\'il aille, que nous allions, que vous alliez, qu\'ils aillent.', 'Faire : que je fasse, que tu fasses, qu\'il fasse, que nous fassions, que vous fassiez, qu\'ils fassent.', 'Vivre : que je vive, que tu vives, qu\'il vive, que nous vivions, que vous viviez, qu\'ils vivent.'] },
    ],
  },
})

assign(['advanced-negation-b1'], {
  book: 'Totem 3 · Precis de grammaire',
  pages: [157],
  images: b1_157,
  palette: commonPalette,
  sourceBlocks: [
    {
      label: 'Negation et valeurs du present',
      lines: [
        'ne ... guere / ne ... nullement / ne ... aucun',
        'Le present exprime l\'habitude, le fait general, l\'actualite.',
      ],
    },
  ],
  notes: [
    'This B1 source reuses negation, but in a denser and more adult grammar context. It is useful precisely because the pattern is repeated with broader sentence control.',
    'The same page also reminds you how the present can express current action, general truth, habit, state, future, and continuity from the past.',
  ],
})

assign(['relative-pronouns'], {
  book: 'Totem 3 · Precis de grammaire',
  pages: [158],
  images: b1_158,
  palette: commonPalette,
  sourceBlocks: [
    {
      label: 'Pronoms relatifs complexes',
      lines: [
        '[[orange|dont]] / [[blue|lequel]] / [[pink|laquelle]] / [[green|lesquels]]',
      ],
    },
    {
      label: 'Exemple',
      lines: [
        'Le projet [[orange|dont]] je parle avance bien.',
      ],
    },
  ],
  notes: [
    'This page upgrades relative clauses at B1 by adding [[orange|dont]] and the first systematic look at compound forms such as [[blue|lequel]] and [[pink|laquelle]].',
    'Use it when you want more precise clause linking, especially after prepositions.',
  ],
})

assign(['dont-ce-qui-ce-que-b1', 'y-en'], {
  book: 'Totem 3 · Precis de grammaire',
  pages: [159],
  images: b1_159,
  palette: commonPalette,
  sourceBlocksByTopic: {
    'dont-ce-qui-ce-que-b1': [{ label: 'Tours avec ce', lines: ['[[orange|ce qui]] / [[orange|ce que]] / [[orange|ce dont]] / [[orange|ce a quoi]]'] }],
    'y-en': [{ label: 'Y et en', lines: ['J\'[[blue|y]] pense. / J\'[[green|en]] parle.'] }],
  },
  notes: [
    'The top of this page gives the [[orange|ce qui / ce que / ce dont / ce a quoi]] focus patterns; the lower part revisits pronoun placement and the B1 use of [[blue|y]] and [[green|en]].',
    'This is a good page for learning how French avoids repetition while still sounding explicit and structured.',
  ],
})

assign(['double-pronouns-b1'], {
  book: 'Totem 3 · Precis de grammaire',
  pages: [160],
  images: b1_160,
  palette: commonPalette,
  sourceBlocks: [
    {
      label: 'Ordre des doubles pronoms',
      lines: [
        '[[blue|me / te / se / nous / vous]] + [[orange|le / la / les]] + [[green|lui / leur]] + [[blue|y]] + [[green|en]]',
      ],
    },
    {
      label: 'Exemple',
      lines: [
        'Je [[orange|le lui]] donne.',
      ],
    },
  ],
  notes: [
    'This screenshot is worth studying visually because the double-pronoun order is shown as a table instead of a paragraph, which makes the sequence much easier to retain.',
    'It also connects the order rule to [[blue|y]], [[green|en]], interrogatives, and demonstratives on the same page.',
  ],
})

assign(['plus-que-parfait-b1'], {
  book: 'Totem 3 · Precis de grammaire',
  pages: [162, 163],
  images: b1_162_163,
  palette: commonPalette,
  sourceBlocks: [
    {
      label: 'Plus-que-parfait',
      lines: [
        '[[blue|imparfait de l\'auxiliaire + participe passe]]',
        'J\'avais compris. / Elle etait partie.',
      ],
    },
    {
      label: 'Valeur',
      lines: [
        'action anterieure a une autre action passee',
      ],
    },
  ],
  notes: [
    'These two pages build the B1 narrative past in layers: [[orange|passe recent]], [[green|passe compose]], [[pink|imparfait]], and especially [[blue|plus-que-parfait]] for anteriority.',
    'The next page then shows how these tenses interact inside a narrative and introduces [[orange|passe simple]] as a reading tense.',
  ],
})

assign(['reported-speech-past-b1', 'futur-simple-irregular-b1'], {
  book: 'Totem 3 · Precis de grammaire',
  pages: [165],
  images: b1_165,
  palette: commonPalette,
  sourceBlocksByTopic: {
    'reported-speech-past-b1': [{ label: 'Discours rapporte au passe', lines: ['Il a dit [[orange|qu\'il viendrait]].'] }],
    'futur-simple-irregular-b1': [{ label: 'Futur simple', lines: ['je serai / j\'aurai / je ferai / je viendrai'] }],
  },
  notes: [
    'This page is the natural home for both topics: the top half shows [[orange|reported speech in the past]] with sequence of tenses, and the bottom half gives the full B1 future system with irregular stems.',
    'Watch the colored future stems carefully: they are the part learners usually need to recognize fastest when reading.',
  ],
})

assign(['si-imparfait-conditional-b1', 'conditional'], {
  book: 'Totem 3 · Precis de grammaire',
  pages: [166],
  images: b1_166,
  palette: commonPalette,
  sourceBlocksByTopic: {
    'si-imparfait-conditional-b1': [{ label: 'Hypothese', lines: ['[[pink|Si + imparfait]], [[blue|conditionnel present]]', 'Si j\'avais le temps, je voyagerais plus.'] }],
    'conditional': [{ label: 'Conditionnel', lines: ['souhait, politesse, information non confirmee'] }],
  },
  notes: [
    'This page handles B1 hypothesis in the form learners need most: [[pink|si + imparfait + conditionnel present]].',
    'Right below it, the conditional gets its broader meanings: hypothesis, polite request, and unverified information.',
  ],
})

assign(['subjunctive-basic-b1', 'opinion-argument-b1'], {
  book: 'Totem 3 · Precis de grammaire',
  pages: [167, 168],
  images: b1_167_168,
  palette: commonPalette,
  sourceBlocksByTopic: {
    'subjunctive-basic-b1': [{ label: 'Subjonctif', lines: ['Il faut que tu [[pink|fasses]] attention.', 'Je veux qu\'elle [[pink|vienne]].'] }],
    'opinion-argument-b1': [{ label: 'Opinion et argumentation', lines: ['Je pense que... / Je doute que... / A mon avis...'] }],
  },
  notes: [
    'These pages connect [[orange|obligation]] and the [[pink|subjunctive]] with the more discursive side of B1: giving an opinion, expressing certainty, expressing a wish, and comparing ideas.',
    'Use them together, because the point is not only verb form but also stance: what you believe, doubt, want, or compare.',
  ],
})

assign(['connectors-cause-consequence-b1'], {
  book: 'Totem 3 · Precis de grammaire',
  pages: [169, 170],
  images: b1_169_170,
  palette: commonPalette,
  sourceBlocks: [
    {
      label: 'Cause, but, consequence, concession',
      lines: [
        '[[orange|parce que]], [[orange|puisque]], [[blue|pour que]], [[green|donc]], [[green|c\'est pourquoi]], [[pink|bien que]]',
      ],
    },
    {
      label: 'Organisation du discours',
      lines: [
        'd\'abord, ensuite, pourtant, cependant, en revanche',
      ],
    },
  ],
  notes: [
    'These pages are the B1 argument toolkit: organizing ideas, [[blue|goal]], [[orange|cause]], [[green|consequence]], [[pink|concession]], and opposition.',
    'They are especially useful for writing and speaking tasks because they show how one idea is linked to the next instead of leaving everything as short separate sentences.',
  ],
})

assign(['articles-adjectives-b1'], {
  book: 'Totem 3 · Précis de grammaire',
  pages: [156],
  images: b1_156,
  sourceBlocks: [
    { label: 'Les articles', lines: ['L\'article défini introduit un nom « connu » : La compagnie de théâtre le Royal de Luxe.', 'L\'article indéfini introduit un nom qui n\'est pas encore « connu » : Une lettre est arrivée.', 'L\'article partitif introduit un nom qui n\'est pas « comptable » : Voulez-vous du thé ?', 'Définis : le / l\', la / l\', les. Indéfinis : un, une, des. Partitifs : du / de l\', de la / de l\', des.'] },
    { label: 'Le pluriel des noms', lines: ['On ajoute un [[green|-s]] à la fin du nom : une image → des images.', 'Attention : un tableau → des tableaux.', 'Pour les noms qui finissent par [[orange|-al]], le pluriel devient [[green|-aux]] : un cheval → des chevaux.'] },
    { label: 'La place et l\'accord de l\'adjectif', lines: ['En général, l\'adjectif se place après le nom : Une expérience client unique et ludique.', 'Certains adjectifs se placent avant le nom : bon, mauvais, beau, joli, petit, grand, large, jeune, vieux, nouveau, ancien.', 'On utilise bel à la place de beau pour les noms masculins qui commencent par une voyelle : Un bel objet.', 'L\'adjectif peut changer de sens selon sa place : un grand designer / un homme grand.', 'Au féminin, on ajoute en général [[pink|-e]] ; au pluriel, [[green|-s]].', 'Les adjectifs en [[orange|-al]] ont un pluriel en [[green|-aux]] : un événement mondial → des événements mondiaux.'] },
  ],
})

assign(['nominalisation-b1', 'truncation-b1', 'negation-b1'], {
  book: 'Totem 3 · Précis de grammaire',
  pages: [157, 158],
  images: [page('book37_page_screenshots_fixed', 'book-37-page-157.png'), page('book37_page_screenshots_fixed', 'book-37-page-158.png')],
  sourceBlocksByTopic: {
    'nominalisation-b1': [{ label: 'La nominalisation', lines: ['Pour condenser et mettre en valeur une information, on utilise souvent des phrases nominales.', 'À partir d\'un verbe : Les Français doutent de l\'existence de Dieu. → Doute sur l\'existence de Dieu.', 'Noms formés à partir d\'un verbe : [[green|-age]], [[green|-ation]], [[green|-ment]], [[green|-sion]], [[green|-tion]], [[green|-uction]], [[green|-ure]].', 'Les noms en -tion et -ure sont féminins : une contradiction.', 'Les noms en -age et -ment sont masculins : un sondage.', 'À partir d\'un adjectif : Les Français sont de plus en plus sceptiques. → Un scepticisme croissant.', 'Noms formés à partir d\'un adjectif : [[pink|-ance]], [[pink|-ence]], [[pink|-esse]], [[pink|-ie]], [[pink|-ise]], [[pink|-té]].'] }],
    'truncation-b1': [{ label: 'La troncation', lines: ['On appelle troncation le fait de supprimer une ou plusieurs syllabes d\'un mot pour en créer un nouveau plus court.', 'un ordinateur → un ordi ; le cinématographe → le cinéma → le ciné ; un professeur → un prof ; un autocar → un car.', 'On peut faire la même chose avec certains prénoms : Caroline → Caro.'] }],
    'negation-b1': [{ label: 'La négation', lines: ['Temps simple : sujet + [[orange|ne]] + verbe conjugué + [[orange|pas]] → Je ne comprends pas.', 'Temps composé : sujet + [[orange|ne]] + auxiliaire + [[orange|pas]] + participe passé → Je ne suis pas sortie.', 'Impératif : [[orange|ne]] + verbe conjugué + [[orange|pas]] → Ne lisez pas.', 'Négation sur une chose : ne... pas / rien → Il n\'aime rien.', 'Négation sur une personne : ne... personne → On ne connaît personne.', 'Négation sur la fréquence : ne... jamais / plus → Il ne va jamais au musée. / Il n\'aime plus la fac.'] }],
  },
})

assign(['present-uses-b1'], {
  book: 'Totem 3 · Précis de grammaire',
  pages: [157],
  images: b1_157,
  sourceBlocks: [
    {
      label: 'Le présent',
      lines: [
        'Le présent peut exprimer une action qui se passe maintenant : Je lis le journal.',
        'Il peut exprimer une vérité générale : La Terre tourne autour du Soleil.',
        'Il peut exprimer une habitude : Tous les matins, je prends un café.',
        'Il peut exprimer un état ou une situation actuelle : J habite à Lyon.',
        'Il peut exprimer un futur proche ou prévu avec un indicateur de temps : Demain, je pars.',
        'Il peut exprimer une action commencée dans le passé et qui continue : J habite ici depuis trois ans.',
      ],
    },
  ],
  notes: [
    'This page is not only about word formation and negation; it also gives a B1 review of the main values of the [[blue|present tense]].',
    'The important point is that the present tense is not limited to "right now"; context and time markers decide the value.',
  ],
})

assign(['prepositions-b1', 'relative-simple-b1', 'relative-complex-b1'], {
  book: 'Totem 3 · Précis de grammaire',
  pages: [158, 159],
  images: [page('book37_page_screenshots_fixed', 'book-37-page-158.png'), page('book37_page_screenshots_fixed', 'book-37-page-159.png')],
  sourceBlocksByTopic: {
    'prepositions-b1': [{ label: 'Les prépositions', lines: ['Localisation : à l\'extrémité de, face à, au bord de, sur.', 'Moyen : en navette, à vélo, par la mer.', 'Matière : en métal.', 'Construction du verbe : avec [[orange|de]] → profiter du week-end ; avec [[orange|à]] → ouvrir au public.'] }],
    'relative-simple-b1': [{ label: 'Les pronoms relatifs simples', lines: ['Ils servent à caractériser, définir, et remplacent un mot ou un groupe de mots.', '[[pink|Qui]] remplace un sujet : La carrière qui continue à être importante...', '[[blue|Que / qu\']] remplace un COD : Les salariés qu\'on paye le plus...', '[[green|Où]] remplace un complément de lieu ou de temps : les pays d\'Europe de l\'Est où manquent les personnels qualifiés.', '[[orange|Dont]] remplace un complément introduit par [[orange|de]] : Un autre fait dont parlent les auteurs.'] }],
    'relative-complex-b1': [{ label: 'Les pronoms relatifs composés', lines: ['Ils se construisent avec une préposition : dans, sur, sous, avec, chez, grâce à, à l\'aide de, à côté de...', 'Masculin : lequel / lesquels ; féminin : laquelle / lesquelles.', 'Le collier sur lequel est intégré le GPS. / La montre avec laquelle vous pouvez lire vos SMS.', 'Avec [[orange|à]] : auquel, auxquels, à laquelle, auxquelles.', 'Avec [[orange|de]] : duquel, desquels, de laquelle, desquelles.', 'Des capteurs grâce auxquels les mouvements sont analysés. / Un thermostat à l\'aide duquel vous pouvez modifier la température.'] }],
  },
})

assign(['focus-cleft-b1', 'object-pronouns-b1', 'y-en-b1'], {
  book: 'Totem 3 · Précis de grammaire',
  pages: [159],
  images: b1_159,
  sourceBlocksByTopic: {
    'focus-cleft-b1': [{ label: 'La mise en relief d\'une idée', lines: ['Idée + [[orange|c\'est ce qui / c\'est ce que / c\'est ce dont / c\'est ce à quoi]] + phrase.', 'Le charme, c\'est ce à quoi je pense pour représenter la France.', 'Structure inverse : [[orange|ce qui / ce que / ce dont / ce à quoi]] + phrase, [[orange|c\'est]] + idée.', 'Ce à quoi je pense pour représenter la France, c\'est le charme.', 'ce qui = sujet ; ce que = COD ; ce à quoi = complément introduit par à ; ce dont = complément introduit par de.'] }],
    'object-pronouns-b1': [{ label: 'Les pronoms personnels', lines: ['COD : me/m\', te/t\', le/l\', la/l\', nous, vous, les.', 'COI : me/m\', te/t\', lui, nous, vous, leur.', 'Toniques : moi, toi, lui/elle, nous, vous, eux/elles.', 'Ils se placent avant le verbe, avant l\'infinitif, ou entre le verbe et l\'infinitif : Je le vois demain. Impossible de le voir. Je peux le faire.', 'Avec l\'impératif, le pronom se met après le verbe ; me et te deviennent moi et toi : Décide-toi !', 'COD sans préposition : Je vois Hugo → Je le vois. COI avec à : Je téléphone à Charlotte → Je lui téléphone.'] }],
    'y-en-b1': [{ label: 'Les pronoms compléments y et en', lines: ['[[blue|Y]] remplace un lieu, un nom ou un verbe introduit par la préposition [[blue|à]].', 'Tu connais cette boutique ? Oui, j\'y suis déjà allé. / Si je pense à acheter un bracelet connecté ? Oui, j\'y pense parfois.', '[[green|En]] remplace un nom précédé d\'une quantité : Des objets connectés ? On en prévoit 80 milliards.', '[[green|En]] remplace un nom introduit par [[green|de]] : On en parle comme d\'une révolution.', 'Y et en se placent avant le verbe.'] }],
  },
})

assign(['double-pronouns-b1', 'indefinites-b1', 'interrogative-pronouns-b1', 'demonstrative-pronouns-b1'], {
  book: 'Totem 3 · Précis de grammaire',
  pages: [160, 161],
  images: [page('book37_page_screenshots_fixed', 'book-37-page-160.png'), page('book37_page_screenshots_fixed', 'book-37-page-161.png')],
  sourceBlocksByTopic: {
    'double-pronouns-b1': [{ label: 'La place des doubles pronoms', lines: ['Ordre avec COI avant COD : sujet + me / te / se / nous / vous + le / la / les + verbe.', 'Ordre avec COD avant COI : sujet + le / la / les + lui / leur + verbe.', 'Les pronoms [[blue|y]] et [[green|en]] sont toujours placés en deuxième position : Vous vous y intéressez ? Vous pouvez m\'en dire plus ?', 'À l\'impératif affirmatif, les pronoms se placent après le verbe. L\'ordre est COD + COI : Montrez-la-moi, s\'il vous plaît.'] }],
    'indefinites-b1': [{ label: 'Les indéfinis', lines: ['Pour donner une information générale, sans précision, on utilise des indéfinis.', 'Personnes et/ou objets : certain(s), certain(e)s, d\'autres, chacun/chacune, chaque, aucun(s), quelques.', 'Seulement pour des personnes : quelqu\'un, personne.', 'Seulement pour des objets : rien, quelque chose.', 'Lieux : partout, ailleurs, quelque part, n\'importe où.', 'Certains peuvent « porter bonheur », d\'autres « porter malheur ». / Comme partout dans le monde...'] }],
    'interrogative-pronouns-b1': [{ label: 'Les pronoms interrogatifs', lines: ['Ils peuvent être simples : [[blue|qui]], ou composés : lequel, laquelle...', 'Les pronoms interrogatifs composés s\'accordent en genre et en nombre.', 'Ils interrogent sur un ou plusieurs objets extraits d\'un ensemble.', 'Masculin singulier : lequel ; féminin singulier : laquelle ; masculin pluriel : lesquels ; féminin pluriel : lesquelles.', 'Lequel de ces tableaux te plaît ? / Tu as trois vestes. Laquelle vas-tu mettre ?'] }],
    'demonstrative-pronouns-b1': [{ label: 'Les pronoms démonstratifs', lines: ['Composés : celui-ci / celui-là ; celle-ci / celle-là ; ceux-ci / ceux-là ; celles-ci / celles-là.', 'Ils remplacent un nom que l\'on veut montrer ou situer. Si on a deux choix, on dit « ci » puis « là ».', 'Avec des pronoms relatifs simples : celui, celle, ceux, celles + qui / que / dont.', 'Cette association permet de distinguer un élément d\'un groupe et de le décrire.', 'Celle qui bouquine. / Celui qui ronfle. / Pour ceux qui ne sont jamais chez eux.'] }],
  },
})

assign(['adverbs-modalization-b1', 'gerund-b1'], {
  book: 'Totem 3 · Précis de grammaire',
  pages: [161, 162],
  images: [page('book37_page_screenshots_fixed', 'book-37-page-161.png'), page('book37_page_screenshots_fixed', 'book-37-page-162.png')],
  sourceBlocksByTopic: {
    'adverbs-modalization-b1': [
      { label: 'Les adverbes', lines: ['On utilise les adverbes pour nuancer le sens d\'un verbe, d\'un adjectif ou d\'un autre adverbe.', 'Lieu : dehors, dedans, partout. Temps et fréquence : aujourd\'hui, autrefois, souvent, fréquemment, toujours.', 'Manière et quantité : absolument, franchement, vachement, totalement, vraiment, incontestablement, plutôt, bien, trop, notamment, évidemment, élégamment.', 'Place : après le verbe, entre l\'auxiliaire et le participe passé, ou avant l\'adjectif : j\'aime bien ; elle a souvent dit ; toujours fidèle.', 'Formation : adjectif féminin + -ment : franchement ; masculin en -i, -u, -é + -ment : vraiment, absolument, aisément ; -ent → -emment ; -ant → -amment.'] },
      { label: 'La modalisation', lines: ['Pour apporter un jugement ou un sentiment, on utilise des modalisateurs.', 'Ils traduisent certitude, incertitude, appréciation positive ou négative, ou atténuation.', 'Adjectifs : nul, certain, super, formidable, génial.', 'Adverbes : peut-être, plutôt, assez, certainement, vraiment, franchement, réellement, très, trop.', 'Financièrement, c\'est plutôt / assez / très / vraiment intéressant.'] },
    ],
    'gerund-b1': [{ label: 'Le gérondif', lines: ['Le gérondif exprime la manière : il répond à « Comment ? ».', 'Le sujet du gérondif est le même que celui de la principale.', 'Formation : [[pink|en]] + base du verbe à la 1re personne du pluriel du présent + [[green|-ant]].', 'Il peut aussi exprimer la simultanéité : Il s\'est endormi en regardant la télé.', 'Verbes irréguliers : avoir → ayant ; être → étant ; savoir → sachant.', 'Les pronoms compléments se placent avant le participe présent : Elle lui parle en le regardant dans les yeux.'] }],
  },
})

assign(['past-tenses-review-b1'], {
  book: 'Totem 3 · Précis de grammaire',
  pages: [162],
  images: b1_162_163,
  sourceBlocks: [
    {
      label: 'Le passé récent',
      lines: [
        'Le passé récent exprime une action qui vient de se produire.',
        'Formation : [[green|venir de]] au présent + infinitif.',
        'Je viens de sortir. / Nous venons de terminer.',
      ],
    },
    {
      label: 'Le passé composé',
      lines: [
        'Le passé composé exprime une action terminée dans le passé.',
        'Formation : auxiliaire [[green|avoir]] ou [[green|être]] au présent + participe passé.',
        'Avec être, le participe passé s accorde avec le sujet.',
        'Il a parlé. / Elle est partie.',
      ],
    },
    {
      label: 'L imparfait',
      lines: [
        'L imparfait décrit une situation, une habitude, une description ou une action en cours dans le passé.',
        'Formation : base de nous au présent + terminaisons [[pink|-ais, -ais, -ait, -ions, -iez, -aient]].',
        'Quand j étais petit, je lisais beaucoup.',
      ],
    },
  ],
  notes: [
    'Page 162 prepares the plus-que-parfait by reviewing the B1 past-tense system: [[orange|passé récent]], [[green|passé composé]], and [[pink|imparfait]].',
    'Use these three before deciding whether you need the plus-que-parfait for an earlier past action.',
  ],
})

assign(['plus-que-parfait-b1', 'passe-simple-b1', 'passive-b1', 'time-connectors-b1'], {
  book: 'Totem 3 · Précis de grammaire',
  pages: [162, 163, 164, 165],
  images: [page('book37_page_screenshots_fixed', 'book-37-page-162.png'), page('book37_page_screenshots_fixed', 'book-37-page-163.png'), page('book37_page_screenshots_fixed', 'book-37-page-164.png'), page('book37_page_screenshots_fixed', 'book-37-page-165.png')],
  sourceBlocksByTopic: {
    'plus-que-parfait-b1': [{ label: 'Le plus-que-parfait', lines: ['Il exprime qu\'une action précède une autre action dans le passé.', 'Il exprime l\'antériorité d\'un événement qui apparaît donc avant un passé composé ou un imparfait.', 'Formation : auxiliaire [[green|être]] ou [[green|avoir]] à l\'imparfait + participe passé.', 'j\'avais passé ; tu avais passé ; il/elle/on avait passé ; nous avions passé ; vous aviez passé ; ils/elles avaient passé.', 'Il y avait passé une année avec son père et il est revenu à Paris à l\'âge de 24 ans.'] }],
    'passe-simple-b1': [{ label: 'Le passé simple', lines: ['Il est utilisé dans les romans, les contes, les biographies ou les textes historiques.', 'Il se forme en général à partir du radical du verbe.', 'Terminaisons des verbes en -er : [[green|-ai, -as, -a, -âmes, -âtes, -èrent]].', 'On l\'utilise essentiellement à la 3e personne : il/elle/on et ils/elles.', 'En 1953, Contrex quitta le milieu pharmaceutique.', 'Pour raconter des événements passés accomplis et chronologiques, on peut utiliser le passé simple ; rarement employé, il a souvent la même valeur que le passé composé.'] }],
    'passive-b1': [{ label: 'La forme passive', lines: ['Le sujet du verbe actif devient complément d\'agent, généralement introduit par [[orange|par]].', 'Le COD devient le sujet du verbe passif.', 'Forme active : Alice a brûlé des calories. Forme passive : Des calories ont été brûlées par Alice.', 'Formation : sujet passif + [[green|être]] conjugué + participe passé (+ par + complément d\'agent).', 'Le participe passé s\'accorde avec le sujet passif : Toutes ces informations sont partagées par tous.', 'Structure sans être : sujet passif + participe passé (+ par + complément d\'agent). Le podomètre enregistre le nombre de pas faits par Alice.', 'Avec être, le participe s\'accorde avec le sujet du verbe. Avec avoir, il s\'accorde avec le COD placé avant le verbe.'] }],
    'time-connectors-b1': [{ label: 'Les indicateurs temporels', lines: ['Chronologie : [[orange|d\'abord]], [[orange|ensuite / puis]], [[orange|enfin]].', 'Avant / après : [[orange|avant de]] + infinitif ; [[orange|après]] + nom.', 'Situer un événement dans le temps : en, à l\'âge de, X ans plus tard, X ans après, dans les années vingt, le 23 juin 1946, en 1946, cette année-là.', 'Origine d\'un événement : depuis, à partir de, dès, il y a.', 'Limites d\'un événement : de... à..., jusqu\'à / en...', 'Durée : en dix ans ; cela fait... que ; entre + année et + année ; peu à peu ; pendant.', 'Futur sans indications précises : dans un avenir proche, un jour, demain, la semaine prochaine, dans les prochaines années, à l\'horizon + année.'] }],
  },
})

assign(['imperative-b1'], {
  book: 'Totem 3 · Précis de grammaire',
  pages: [166],
  images: b1_166,
  sourceBlocks: [
    {
      label: 'L impératif',
      lines: [
        'L impératif sert à donner un ordre, un conseil ou une consigne.',
        'Il existe seulement à trois personnes : [[blue|tu]], [[blue|nous]], [[blue|vous]].',
        'On n utilise pas le pronom sujet : Écoute. / Allons-y. / Prenez votre temps.',
        'À la forme négative : [[orange|ne]] + verbe + [[orange|pas]].',
        'Ne partez pas. / N oublie pas.',
      ],
    },
  ],
  notes: [
    'Page 166 includes the imperative as its own reminder between the future/conditional system and the obligation/subjunctive material.',
    'The key B1 point is practical use: giving instructions, advice, and prohibitions.',
  ],
})

assign(['reported-speech-past-b1', 'future-conditional-b1'], {
  book: 'Totem 3 · Précis de grammaire',
  pages: [165, 166],
  images: [page('book37_page_screenshots_fixed', 'book-37-page-165.png'), page('book37_page_screenshots_fixed', 'book-37-page-166.png')],
  sourceBlocksByTopic: {
    'reported-speech-past-b1': [{ label: 'Le discours rapporté au passé', lines: ['Pour rapporter les paroles de quelqu\'un, on utilise un verbe introducteur au passé : dire que, répondre que, ajouter que, expliquer que...', 'Discours direct : C\'est plutôt l\'anglais qui est pour beaucoup emprunteur de la langue française.', 'Discours indirect : Elle a dit que c\'était plutôt l\'anglais qui était pour beaucoup emprunteur de la langue française.', 'Au discours indirect, le futur devient conditionnel présent : Je lirai le livre. → Charlotte a dit qu\'elle lirait le livre.'] }],
    'future-conditional-b1': [
      { label: 'Le présent et le futur dans le récit', lines: ['Le présent peut raconter la vie de quelqu\'un : présent historique ou de narration. Il peut remplacer un passé composé.', 'Le futur peut aussi remplacer le passé composé et rendre le récit plus vivant.'] },
      { label: 'L\'expression du futur', lines: ['Futur proche : [[green|aller]] + infinitif. Il situe une action dans un avenir assez proche ou quand on est sûr de sa réalisation.', 'Futur simple : infinitif + [[green|-ai, -as, -a, -ons, -ez, -ont]]. Il exprime une prévision ou un projet.', 'Pour les verbes en -re, on supprime le e : prendre → je prendrai.', 'Futurs irréguliers : aller → j\'irai ; avoir → j\'aurai ; être → je serai ; faire → je ferai ; pouvoir → je pourrai ; savoir → je saurai ; venir → je viendrai ; voir → je verrai.'] },
      { label: 'Le futur antérieur', lines: ['Quand deux actions se suivent dans le futur, on utilise le futur antérieur pour la première action et le futur simple pour la deuxième.', 'Formation : [[green|être]] ou [[green|avoir]] au futur + participe passé.', 'Les constructeurs qui n\'auront pas suivi le progrès disparaîtront.'] },
      { label: 'Le conditionnel présent et passé', lines: ['Conditionnel présent : mode de l\'irréel. Il exprime une hypothèse, une demande polie ou une information non vérifiée.', 'Formation : radical du futur + terminaisons de l\'imparfait [[pink|-ais, -ais, -ait, -ions, -iez, -aient]].', 'Conditionnel passé : exprime le regret ou le reproche.', 'Formation : être ou avoir au conditionnel présent + participe passé. Je ne sais pas où on aurait dû construire un centre culturel.'] },
    ],
  },
})

assign(['hypothesis-obligation-b1', 'subjunctive-basic-b1', 'opinion-argument-b1'], {
  book: 'Totem 3 · Précis de grammaire',
  pages: [166, 167, 168],
  images: [page('book37_page_screenshots_fixed', 'book-37-page-166.png'), page('book37_page_screenshots_fixed', 'book-37-page-167.png'), page('book37_page_screenshots_fixed', 'book-37-page-168.png')],
  sourceBlocksByTopic: {
    'hypothesis-obligation-b1': [
      { label: 'L\'expression de l\'hypothèse', lines: ['Projet sous condition : [[pink|si]] + [[blue|présent]] + [[green|futur simple]]. Si nous avons le temps, nous irons au cinéma.', 'Hypothèse difficilement réalisable, imaginaire ou contraire à la réalité : [[pink|si]] + [[blue|imparfait]] + [[green|conditionnel présent]].', 'Si j\'avais assez d\'argent, je partirais très loin.'] },
      { label: 'L\'expression de l\'obligation', lines: ['[[orange|Devoir]] + infinitif : L\'éditorialiste doit fonder ses opinions sur des faits.', '[[orange|L\'obligation de]] + nom : l\'obligation de respect de la vie.', '[[orange|S\'obliger à]] + infinitif : S\'obliger à respecter la vie privée des personnes.'] },
    ],
    'subjunctive-basic-b1': [{ label: 'Le subjonctif', lines: ['On l\'utilise pour exprimer conseil ou obligation : il faut que, il ne faut pas que, il est nécessaire que, il est fondamental que, il est indispensable que.', 'Il faut qu\'ils combattent la censure.', 'On l\'utilise aussi pour le doute, la peur : Je ne suis pas sûre qu\'une famille plus traditionnelle soit plus heureuse que nous.', 'Formation je/tu/il/ils : base de la 3e personne du présent + terminaisons du présent des verbes en -er.', 'Formation nous/vous : base de la 1re personne du pluriel au présent + terminaisons de l\'imparfait -ions, -iez.', 'Verbes irréguliers : aller, avoir, être, faire, pouvoir, savoir, vouloir.', 'Si le conseil ou l\'obligation n\'est pas destiné à quelqu\'un en particulier, on peut utiliser l\'infinitif : Il faut combattre la censure.'] }],
    'opinion-argument-b1': [{ label: 'Donner son point de vue', lines: ['Opinion : pour, selon moi, à mon avis ; avoir l\'impression que + indicatif ; penser / trouver / croire que + indicatif.', 'Selon moi, la famille, c\'est la base de notre société. / À mon avis, la famille d\'aujourd\'hui est plus cool.', 'Je pense que les gens n\'adhèrent plus à ce modèle.', 'Certitude : être sûr(e) / être certain(e) que + indicatif. Je suis sûr qu\'elle trouvera un travail.', 'Souhait : subjonctif avec souhaiter, vouloir ; conditionnel avec vouloir, souhaiter ou être + infinitif.', 'Je souhaite qu\'elle réussisse. / Je voudrais partir en vacances. / Ce serait bien d\'aller faire du bateau.', 'Comparer : plus / moins / aussi + adjectif ou adverbe + que ; plus de / moins de / autant de + nom + que ; verbe + plus / moins / autant + que.', 'Superlatif : le/la/les plus ou moins + adjectif/adverbe ; le plus de / le moins de + nom.'] }],
  },
})

assign(['connectors-cause-consequence-b1', 'modes-register-b1'], {
  book: 'Totem 3 · Précis de grammaire',
  pages: [169, 170, 171],
  images: [page('book37_page_screenshots_fixed', 'book-37-page-169.png'), page('book37_page_screenshots_fixed', 'book-37-page-170.png'), page('book37_page_screenshots_fixed', 'book-37-page-171.png')],
  sourceBlocksByTopic: {
    'connectors-cause-consequence-b1': [
      { label: 'L\'organisation des idées', lines: ['Les articulateurs organisent et relient les idées, les explications et les faits de manière logique.', 'D\'abord introduit la première idée ; De plus renforce la précédente ; En fait apporte une précision ; Bref résume ; Donc exprime la conséquence et conclut.'] },
      { label: 'But, cause, conséquence', lines: ['But : se donner / avoir pour but de + infinitif ; afin de / pour + infinitif ; afin que / pour que + subjonctif.', 'Cause : parce que et car répondent à Pourquoi ; comme et puisque présentent la cause sans répondre directement à Pourquoi.', 'À cause de + nom/pronom si le résultat est négatif ; grâce à + nom/pronom si le résultat est positif.', 'Conséquence : donc, alors, c\'est pourquoi, si bien que.', 'Intensité de la conséquence : si + adjectif + que ; tellement + adjectif + que.', 'Conséquence avec verbes : entraîner, provoquer.'] },
      { label: 'Opposition, concession, proportions', lines: ['Concession : pourtant, cependant ; alors que + indicatif ; même si, quand même ; malgré + nom ; bien que + subjonctif.', 'Opposition : au lieu de, en revanche, par contre.', 'Proportions : X % de / X pour cent de ; la plupart de ; la majorité de / une minorité de ; un tiers, deux tiers ; un quart, la moitié, trois quarts.'] },
    ],
    'modes-register-b1': [{ label: 'Les modes, la phrase, les niveaux de langue', lines: ['Indicatif : mode du réel, de l\'opinion. Il comprend présent, futur simple, futur proche, futur antérieur, passé récent, passé composé, imparfait, plus-que-parfait, passé simple.', 'Subjonctif : mode de ce qui n\'est pas encore réalisé, des sentiments, de la nécessité, du souhait, du conseil, du doute.', 'Conditionnel : mode de l\'imaginé, éventuel ; politesse, hypothèse, regret et reproche.', 'Impératif : mode du dire de faire, de l\'ordre, de la consigne.', 'Phrase simple : sujet + verbe + complément. Phrase complexe : que + subjonctif ; parce que + indicatif ; infinitif.', 'Niveau courant : règles respectées. Niveau familier : mots familiers, suppression de ne, on à la place de nous, tu au lieu de il.'] }],
  },
})

assign(['core-conjugation-b1'], {
  book: 'Totem 3 · Précis de conjugaison',
  pages: [172, 173, 174, 175, 176],
  images: b1_172_176,
  sourceBlocks: [
    { label: 'Verbes et temps couverts', lines: ['Pages 172-176 donnent les conjugaisons de : être, avoir, aller, faire, vivre, payer, s\'installer, choisir, voir, vouloir, s\'inscrire, savoir, connaître, dire, comprendre, attendre, pouvoir, courir, peindre, venir.', 'Temps couverts : présent, passé composé, imparfait, plus-que-parfait, passé simple, futur, conditionnel présent, conditionnel passé, subjonctif présent.'] },
    { label: 'Repères utiles', lines: ['Auxiliaires : être / avoir servent à construire les temps composés.', 'Verbes de mouvement ou pronominaux : plusieurs formes composées utilisent être, avec accord possible du participe.', 'Futur et conditionnel : mêmes bases fréquentes, terminaisons différentes.', 'Subjonctif présent : retenir surtout les formes irrégulières être, avoir, aller, faire, savoir, vouloir, pouvoir, venir.'] },
    { label: 'Exemples de formes à reconnaître', lines: ['être : je suis, j\'ai été, j\'étais, j\'avais été, je fus, je serai, je serais, j\'aurais été, que je sois.', 'aller : je vais, je suis allé(e), j\'allais, j\'étais allé(e), j\'allai, j\'irai, j\'irais, je serais allé(e), que j\'aille.', 'vouloir : je veux, j\'ai voulu, je voulais, j\'avais voulu, je voulus, je voudrai, je voudrais, j\'aurais voulu, que je veuille.', 'venir : je viens, je suis venu(e), je venais, j\'étais venu(e), je vins, je viendrai, je viendrais, je serais venu(e), que je vienne.'] },
  ],
})

export function getBookGrammarContent(topicId: string) {
  return contentByTopic[topicId]
}
