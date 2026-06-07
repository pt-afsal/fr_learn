import type { SkillTopic } from './types'
import { applyGrammarGuides } from './grammarGuides'

type GrammarDetail = Pick<SkillTopic, 'explanationEn' | 'explanationFr' | 'examples'>

const grammarDetails: Record<string, GrammarDetail> = {
  'subject-pronouns-a1': {
    explanationEn:
      'Subject pronouns show who is doing the action, and the verb form changes to match them. Use je for yourself, tu for one familiar person, il/elle/on for one person or "one/we", nous for we, vous for formal you or plural you, and ils/elles for groups. In speech, on is very common for "we", but the verb still takes the il/elle form.',
    explanationFr:
      'Les pronoms sujets indiquent qui fait l’action, et la forme du verbe change avec eux. On utilise je pour soi-même, tu pour une personne familière, il/elle/on pour une personne ou "on/nous", nous pour nous, vous pour la politesse ou le pluriel, et ils/elles pour les groupes. À l’oral, on remplace très souvent nous, mais le verbe reste à la forme il/elle.',
    examples: ['Je parle français.', 'Tu écoutes la professeure.', 'On mange à midi.', 'Nous habitons près de la gare.'],
  },
  'tu-vous-a1': {
    explanationEn:
      'Tu and vous both mean "you", but they create different social distance. Use tu with friends, family, children, classmates, and people who invite informal speech. Use vous with strangers, older people, clients, teachers, officials, or any group of people.',
    explanationFr:
      'Tu et vous signifient tous les deux "you", mais ils marquent une distance sociale différente. On utilise tu avec les amis, la famille, les enfants, les camarades et les personnes qui proposent de se tutoyer. On utilise vous avec les inconnus, les personnes plus âgées, les clients, les professeurs, les employés officiels ou un groupe.',
    examples: ['Tu viens ce soir ?', 'Vous désirez un café ?', 'Vous êtes prêts ?', 'On peut se tutoyer ?'],
  },
  'articles-gender': {
    explanationEn:
      'Every French noun has a grammatical gender: masculine or feminine. The article before the noun must match that gender and number, so learning a noun with le, la, l’, un, or une is part of learning the noun itself. Plural nouns use les or des, regardless of gender.',
    explanationFr:
      'Chaque nom français a un genre grammatical : masculin ou féminin. L’article qui précède le nom doit s’accorder en genre et en nombre, donc apprendre un nom avec le, la, l’, un ou une fait partie de l’apprentissage du nom. Au pluriel, on utilise les ou des, quel que soit le genre.',
    examples: ['Le livre est sur la table.', 'La voiture est rouge.', "L'hôtel est complet.", 'Les amis arrivent bientôt.'],
  },
  'definite-articles-a1': {
    explanationEn:
      'Definite articles point to a specific thing or to a whole category. Use le with masculine singular nouns, la with feminine singular nouns, l’ before a vowel sound, and les for plural nouns. French often uses definite articles where English uses no article for general ideas.',
    explanationFr:
      'Les articles définis désignent une chose précise ou une catégorie générale. On utilise le avec un nom masculin singulier, la avec un nom féminin singulier, l’ devant un son voyelle, et les avec les noms pluriels. Le français emploie souvent l’article défini là où l’anglais n’utilise aucun article pour les idées générales.',
    examples: ['Le train part à huit heures.', 'La musique est importante.', "L'eau est froide.", 'Les enfants aiment les histoires.'],
  },
  'indefinite-articles-a1': {
    explanationEn:
      'Indefinite articles introduce something nonspecific or mentioned for the first time. Use un for masculine singular nouns, une for feminine singular nouns, and des for plural nouns. In negative sentences, un, une, and des usually become de or d’.',
    explanationFr:
      'Les articles indéfinis introduisent une chose non précise ou mentionnée pour la première fois. On utilise un avec un nom masculin singulier, une avec un nom féminin singulier, et des avec les noms pluriels. Dans les phrases négatives, un, une et des deviennent généralement de ou d’.',
    examples: ['J’ai un stylo dans mon sac.', 'Elle cherche une adresse.', 'Nous avons des questions.', "Je n'ai pas de voiture."],
  },
  'plural-nouns-a1': {
    explanationEn:
      'Most written French plurals add -s, but that final -s is usually silent. The article often tells you whether the noun is singular or plural. Some nouns already end in -s, -x, or -z and do not change in the plural; others have special forms such as travail to travaux.',
    explanationFr:
      'La plupart des pluriels français prennent un -s à l’écrit, mais ce -s final ne se prononce généralement pas. L’article indique souvent si le nom est singulier ou pluriel. Certains noms terminés par -s, -x ou -z ne changent pas au pluriel ; d’autres ont des formes particulières comme travail qui devient travaux.',
    examples: ['Un ami arrive. / Des amis arrivent.', 'La rue est calme. / Les rues sont calmes.', 'Un choix difficile. / Des choix difficiles.', 'Un travail important. / Des travaux importants.'],
  },
  'adjective-agreement-a1': {
    explanationEn:
      'French adjectives usually agree with the noun they describe in gender and number. A common pattern is masculine singular as the base, add -e for feminine, add -s for plural, and add -es for feminine plural. Some adjectives already end in -e or have irregular forms, so the noun and article help you choose the right ending.',
    explanationFr:
      'Les adjectifs français s’accordent généralement avec le nom qu’ils décrivent en genre et en nombre. Le modèle courant est le masculin singulier comme base, puis -e au féminin, -s au pluriel, et -es au féminin pluriel. Certains adjectifs se terminent déjà par -e ou ont des formes irrégulières, donc le nom et l’article aident à choisir la bonne terminaison.',
    examples: ['Un sac noir.', 'Une robe noire.', 'Des sacs noirs.', 'Des robes noires.'],
  },
  'adjective-position-a1': {
    explanationEn:
      'Most French adjectives come after the noun, especially colors, shapes, nationalities, and many descriptive qualities. A small group of frequent short adjectives often comes before the noun, such as petit, grand, bon, mauvais, beau, nouveau, vieux, and jeune. Some adjectives can change meaning depending on position.',
    explanationFr:
      'La plupart des adjectifs français se placent après le nom, surtout les couleurs, les formes, les nationalités et beaucoup de qualités descriptives. Un petit groupe d’adjectifs courts et fréquents se place souvent avant le nom, comme petit, grand, bon, mauvais, beau, nouveau, vieux et jeune. Certains adjectifs changent de sens selon leur position.',
    examples: ['Une voiture rouge.', 'Un étudiant français.', 'Un petit appartement.', 'Mon ancien professeur. / Un meuble ancien.'],
  },
  'etre-avoir': {
    explanationEn:
      'Être and avoir are essential because they express basic identity, description, possession, age, needs, and many fixed phrases. They are also auxiliaries: avoir forms most passé composé verbs, while être forms the passé composé of movement verbs and reflexive verbs. Mastering them early makes almost every later tense easier.',
    explanationFr:
      'Être et avoir sont essentiels parce qu’ils expriment l’identité, la description, la possession, l’âge, les besoins et beaucoup d’expressions figées. Ce sont aussi des auxiliaires : avoir forme la plupart des verbes au passé composé, tandis que être forme le passé composé des verbes de mouvement et des verbes pronominaux. Les maîtriser tôt rend presque tous les temps suivants plus faciles.',
    examples: ['Je suis étudiant.', 'Tu as raison.', 'Elle a vingt ans.', 'Nous sommes allés au marché.'],
  },
  'present-er': {
    explanationEn:
      'Regular -er verbs are the largest verb family in French. Remove -er from the infinitive, then add -e, -es, -e, -ons, -ez, -ent in the present. The endings for je, tu, il/elle, and ils/elles are often silent, so the subject pronoun is important in speech.',
    explanationFr:
      'Les verbes réguliers en -er forment la plus grande famille de verbes en français. On enlève -er à l’infinitif, puis on ajoute -e, -es, -e, -ons, -ez, -ent au présent. Les terminaisons de je, tu, il/elle et ils/elles sont souvent muettes, donc le pronom sujet est important à l’oral.',
    examples: ['Je parle lentement.', 'Tu écoutes la radio.', 'Nous travaillons ensemble.', 'Elles regardent un film.'],
  },
  'present-aller-faire-a1': {
    explanationEn:
      'Aller and faire are irregular but extremely common. Aller is used for movement and for the near future with an infinitive. Faire means to do or make, and it appears in many everyday expressions for weather, sports, chores, and activities.',
    explanationFr:
      'Aller et faire sont irréguliers mais extrêmement fréquents. Aller sert à parler du déplacement et du futur proche avec un infinitif. Faire signifie to do ou to make, et il apparaît dans beaucoup d’expressions quotidiennes pour la météo, le sport, les tâches et les activités.',
    examples: ['Je vais au travail.', 'Nous allons dîner ce soir.', 'Il fait froid aujourd’hui.', 'Elles font leurs devoirs.'],
  },
  'regular-ir-re-a1': {
    explanationEn:
      'Regular -ir verbs such as finir and choisir use the pattern -is, -is, -it, -issons, -issez, -issent. Regular -re verbs such as attendre and vendre drop the final -e, then add -s, -s, nothing, -ons, -ez, -ent. These patterns help you build many useful verbs once you know the stem.',
    explanationFr:
      'Les verbes réguliers en -ir comme finir et choisir suivent le modèle -is, -is, -it, -issons, -issez, -issent. Les verbes réguliers en -re comme attendre et vendre perdent le -e final, puis prennent -s, -s, rien, -ons, -ez, -ent. Ces modèles permettent de construire beaucoup de verbes utiles dès que l’on connaît le radical.',
    examples: ['Je choisis une option.', 'Nous finissons le travail.', 'Tu attends le bus.', 'Ils vendent leur maison.'],
  },
  'negation-ne-pas-a1': {
    explanationEn:
      'The basic French negative wraps around the conjugated verb: ne before the verb and pas after it. Before a vowel or silent h, ne becomes n’. In everyday speech, French speakers often drop ne, but learners should recognize and practice the full written pattern.',
    explanationFr:
      'La négation française de base entoure le verbe conjugué : ne avant le verbe et pas après. Devant une voyelle ou un h muet, ne devient n’. À l’oral quotidien, les francophones omettent souvent ne, mais les apprenants doivent reconnaître et pratiquer la forme complète à l’écrit.',
    examples: ['Je ne comprends pas.', "Elle n'aime pas le café.", 'Nous ne sommes pas prêts.', 'Il ne fait pas froid.'],
  },
  questions: {
    explanationEn:
      'French has three common ways to ask yes/no questions. Intonation keeps normal word order and raises the voice, est-ce que adds a question marker before the sentence, and inversion switches the verb and subject pronoun for a more formal style. Question words like où, quand, pourquoi, comment, and combien can combine with these patterns.',
    explanationFr:
      'Le français a trois façons courantes de poser une question fermée. L’intonation garde l’ordre normal et fait monter la voix, est-ce que ajoute une marque de question avant la phrase, et l’inversion inverse le verbe et le pronom sujet dans un style plus formel. Les mots interrogatifs comme où, quand, pourquoi, comment et combien peuvent se combiner avec ces modèles.',
    examples: ['Tu viens ?', 'Est-ce que tu viens ?', 'Viens-tu ?', 'Pourquoi est-ce que tu pars ?'],
  },
  'c-est-il-est-a1': {
    explanationEn:
      'Use c’est to identify, present, or define a person or thing, often before an article, name, or possessive. Use il est or elle est to describe a specific person or thing with an adjective, profession, nationality, or time expression. Professions after il/elle est usually appear without un or une.',
    explanationFr:
      'On utilise c’est pour identifier, présenter ou définir une personne ou une chose, souvent devant un article, un nom propre ou un possessif. On utilise il est ou elle est pour décrire une personne ou une chose précise avec un adjectif, une profession, une nationalité ou une expression de temps. Les professions après il/elle est se placent généralement sans un ou une.',
    examples: ['C’est mon voisin.', 'C’est une bonne idée.', 'Elle est médecin.', 'Il est très gentil.'],
  },
  'possessive-adjectives-a1': {
    explanationEn:
      'French possessive adjectives agree with the thing owned, not only the owner. Use mon, ma, mes for my; ton, ta, tes for your informal; son, sa, ses for his, her, or its. Before a feminine noun beginning with a vowel sound, use mon, ton, or son for smoother pronunciation.',
    explanationFr:
      'Les adjectifs possessifs français s’accordent avec la chose possédée, pas seulement avec le propriétaire. On utilise mon, ma, mes pour my ; ton, ta, tes pour your informel ; son, sa, ses pour his, her ou its. Devant un nom féminin qui commence par un son voyelle, on utilise mon, ton ou son pour faciliter la prononciation.',
    examples: ['Mon frère habite ici.', 'Ma sœur travaille demain.', 'Mes clés sont sur la table.', 'Son amie arrive bientôt.'],
  },
  'demonstrative-adjectives-a1': {
    explanationEn:
      'Demonstrative adjectives mean this, that, these, or those. Use ce before masculine singular nouns, cet before masculine singular nouns that begin with a vowel sound, cette before feminine singular nouns, and ces before all plural nouns. Context usually tells whether the meaning is this or that.',
    explanationFr:
      'Les adjectifs démonstratifs signifient this, that, these ou those. On utilise ce devant un nom masculin singulier, cet devant un nom masculin singulier qui commence par un son voyelle, cette devant un nom féminin singulier, et ces devant tous les noms pluriels. Le contexte indique généralement si le sens est this ou that.',
    examples: ['Ce restaurant est ouvert.', 'Cet appartement est petit.', 'Cette question est importante.', 'Ces livres sont utiles.'],
  },
  'numbers-time-a1': {
    explanationEn:
      'French time expressions combine numbers with fixed patterns. Clock time uses il est plus the hour, dates use le plus the number, and days can use nous sommes or on est. For appointments, use à before the time; for age, use avoir, not être.',
    explanationFr:
      'Les expressions de temps en français combinent les nombres avec des structures fixes. L’heure utilise il est plus l’heure, les dates utilisent le plus le nombre, et les jours peuvent utiliser nous sommes ou on est. Pour les rendez-vous, on utilise à avant l’heure ; pour l’âge, on utilise avoir, pas être.',
    examples: ['Il est huit heures et demie.', 'Le rendez-vous est à quinze heures.', 'Nous sommes lundi.', 'J’ai vingt ans.'],
  },
  'prepositions-place-a1': {
    explanationEn:
      'Prepositions of place tell where something or someone is located. Many are short words or phrases followed by an article and noun. Remember contractions with à: à + le becomes au, à + les becomes aux, and à + la stays à la.',
    explanationFr:
      'Les prépositions de lieu indiquent où se trouve une personne ou une chose. Beaucoup sont de petits mots ou groupes de mots suivis d’un article et d’un nom. Il faut retenir les contractions avec à : à + le devient au, à + les devient aux, et à + la reste à la.',
    examples: ['Le livre est sur la table.', 'La pharmacie est à côté de la banque.', 'Je vais au bureau.', 'Nous sommes devant la gare.'],
  },
  'futur-proche-a1': {
    explanationEn:
      'The futur proche expresses plans and near future events. Conjugate aller in the present, then add the infinitive of the main verb. The structure is useful because only aller changes; the second verb stays in the infinitive.',
    explanationFr:
      'Le futur proche exprime les projets et les événements proches. On conjugue aller au présent, puis on ajoute l’infinitif du verbe principal. La structure est utile parce que seul aller change ; le deuxième verbe reste à l’infinitif.',
    examples: ['Je vais appeler ma mère.', 'Tu vas prendre le train.', 'Nous allons étudier ce soir.', 'Elles vont visiter le musée.'],
  },
  'imperative-a1': {
    explanationEn:
      'The imperative gives commands, advice, invitations, and instructions without a subject pronoun. The main forms come from tu, nous, and vous in the present tense. With regular -er verbs, the tu form drops the final -s unless y or en follows.',
    explanationFr:
      'L’impératif sert à donner des ordres, des conseils, des invitations et des instructions sans pronom sujet. Les formes principales viennent de tu, nous et vous au présent. Avec les verbes réguliers en -er, la forme tu perd le -s final sauf si y ou en suit.',
    examples: ['Écoute la question.', 'Prenons le bus.', 'Attendez ici, s’il vous plaît.', 'Vas-y !'],
  },
  'il-y-a-a1': {
    explanationEn:
      'Il y a means there is or there are, and the form does not change for singular or plural nouns. In negative sentences, use il n’y a pas de before the noun. It is used to point out existence, availability, people in a place, or time expressions.',
    explanationFr:
      'Il y a signifie there is ou there are, et la forme ne change pas avec un nom singulier ou pluriel. Dans les phrases négatives, on utilise il n’y a pas de avant le nom. Cette structure sert à indiquer l’existence, la disponibilité, des personnes dans un lieu ou des expressions de temps.',
    examples: ['Il y a un problème.', 'Il y a trois chaises dans la salle.', "Il n'y a pas de train ce soir.", 'Il y a deux ans, j’habitais à Lyon.'],
  },
  'partitive-articles-a2': {
    explanationEn:
      'Partitive articles express an unspecified amount of something, especially food, drink, materials, and abstract nouns. Use du for masculine singular, de la for feminine singular, de l’ before a vowel sound, and des for plural. After a negative, these usually become de or d’.',
    explanationFr:
      'Les articles partitifs expriment une quantité non précisée, surtout avec la nourriture, les boissons, les matières et les noms abstraits. On utilise du au masculin singulier, de la au féminin singulier, de l’ devant un son voyelle, et des au pluriel. Après une négation, ils deviennent généralement de ou d’.',
    examples: ['Je bois de l’eau.', 'Elle achète du pain.', 'Nous mangeons de la soupe.', "Je ne veux pas de sucre."],
  },
  'quantities-a2': {
    explanationEn:
      'Many quantity expressions are followed by de or d’ instead of du, de la, or des. This includes beaucoup de, peu de, assez de, trop de, un kilo de, une bouteille de, and plusieurs expressions of measure. The noun after de can be singular or plural depending on meaning.',
    explanationFr:
      'Beaucoup d’expressions de quantité sont suivies de de ou d’ au lieu de du, de la ou des. C’est le cas de beaucoup de, peu de, assez de, trop de, un kilo de, une bouteille de et plusieurs expressions de mesure. Le nom après de peut être singulier ou pluriel selon le sens.',
    examples: ['Il y a beaucoup de monde.', 'Je voudrais un kilo de pommes.', 'Elle a assez d’argent.', 'Nous avons trop de travail.'],
  },
  'reflexive-verbs-a2': {
    explanationEn:
      'Reflexive verbs use a reflexive pronoun before the verb because the subject does the action to itself or for itself. The pronouns are me, te, se, nous, vous, se. Many daily routine verbs are reflexive, and in passé composé they use être.',
    explanationFr:
      'Les verbes pronominaux utilisent un pronom réfléchi avant le verbe parce que le sujet fait l’action sur lui-même ou pour lui-même. Les pronoms sont me, te, se, nous, vous, se. Beaucoup de verbes de routine sont pronominaux, et au passé composé ils utilisent être.',
    examples: ['Je me lève à sept heures.', 'Tu te couches tard.', 'Nous nous préparons vite.', 'Elle s’est réveillée tôt.'],
  },
  'passe-compose': {
    explanationEn:
      'The passé composé describes completed past events, actions with a clear result, and sequences of events. It uses an auxiliary, usually avoir but sometimes être, plus a past participle. Regular past participles end in -é for -er verbs, -i for many -ir verbs, and -u for many -re verbs.',
    explanationFr:
      'Le passé composé décrit des événements passés terminés, des actions avec un résultat clair et des suites d’événements. Il utilise un auxiliaire, généralement avoir mais parfois être, plus un participe passé. Les participes passés réguliers se terminent par -é pour les verbes en -er, -i pour beaucoup de verbes en -ir, et -u pour beaucoup de verbes en -re.',
    examples: ["J'ai parlé avec Paul.", 'Elle a fini son travail.', 'Nous avons attendu le bus.', 'Ils sont arrivés hier.'],
  },
  'passe-compose-avoir-a2': {
    explanationEn:
      'Most French verbs form the passé composé with avoir. Conjugate avoir in the present, then add the past participle of the main verb. At this level, focus on choosing the right auxiliary and participle; agreement with avoir is a later refinement when a direct object comes before the verb.',
    explanationFr:
      'La plupart des verbes français forment le passé composé avec avoir. On conjugue avoir au présent, puis on ajoute le participe passé du verbe principal. À ce niveau, il faut surtout choisir le bon auxiliaire et le bon participe ; l’accord avec avoir est un point plus avancé quand le COD précède le verbe.',
    examples: ["J'ai regardé un film.", 'Tu as choisi la salade.', 'Nous avons vendu la voiture.', 'Elles ont compris la question.'],
  },
  'passe-compose-etre-a2': {
    explanationEn:
      'A smaller group of verbs uses être in the passé composé, especially common movement and change-of-state verbs such as aller, venir, arriver, partir, entrer, sortir, monter, descendre, naître, and mourir. Reflexive verbs also use être. With être, the past participle usually agrees with the subject.',
    explanationFr:
      'Un plus petit groupe de verbes utilise être au passé composé, surtout des verbes courants de mouvement ou de changement d’état comme aller, venir, arriver, partir, entrer, sortir, monter, descendre, naître et mourir. Les verbes pronominaux utilisent aussi être. Avec être, le participe passé s’accorde généralement avec le sujet.',
    examples: ['Elle est arrivée en retard.', 'Ils sont partis ce matin.', 'Nous sommes montés au troisième étage.', 'Elles se sont levées tôt.'],
  },
  imparfait: {
    explanationEn:
      'The imparfait describes background, ongoing past situations, repeated habits, descriptions, time, weather, and emotional or physical states. It is formed from the nous present stem plus endings -ais, -ais, -ait, -ions, -iez, -aient. Use it when the past action is not presented as a single completed event.',
    explanationFr:
      'L’imparfait décrit le contexte, les situations en cours dans le passé, les habitudes répétées, les descriptions, l’heure, la météo et les états émotionnels ou physiques. Il se forme avec le radical de nous au présent plus les terminaisons -ais, -ais, -ait, -ions, -iez, -aient. On l’utilise quand l’action passée n’est pas présentée comme un événement unique et terminé.',
    examples: ['Quand j’étais petit, je lisais beaucoup.', 'Il pleuvait et il faisait froid.', 'Nous habitions près de la mer.', 'Elle était fatiguée.'],
  },
  'pc-imparfait-a2': {
    explanationEn:
      'Passé composé and imparfait often work together. The imparfait sets the scene or describes what was happening, while the passé composé moves the story forward with completed events. Time markers help, but meaning matters more than any single word.',
    explanationFr:
      'Le passé composé et l’imparfait fonctionnent souvent ensemble. L’imparfait plante le décor ou décrit ce qui était en train de se passer, tandis que le passé composé fait avancer l’histoire avec des événements terminés. Les marqueurs de temps aident, mais le sens est plus important qu’un seul mot.',
    examples: ['Il pleuvait quand je suis sorti.', 'J’étais fatigué, alors je suis rentré.', 'Tous les étés, nous allions à Nice.', 'Hier, nous sommes allés à Nice.'],
  },
  'past-participle-agreement-a2': {
    explanationEn:
      'With être in the passé composé, the past participle usually agrees with the subject in gender and number. Add -e for feminine, -s for plural, and -es for feminine plural. With avoir, beginners can first keep the participle unchanged, then learn agreement when a direct object comes before the verb.',
    explanationFr:
      'Avec être au passé composé, le participe passé s’accorde généralement avec le sujet en genre et en nombre. On ajoute -e au féminin, -s au pluriel, et -es au féminin pluriel. Avec avoir, les débutants peuvent d’abord garder le participe inchangé, puis apprendre l’accord quand un COD précède le verbe.',
    examples: ['Il est parti.', 'Elle est partie.', 'Ils sont partis.', 'Elles sont parties.'],
  },
  'object-pronouns': {
    explanationEn:
      'Object pronouns replace nouns so you do not repeat them. Direct object pronouns answer whom or what: me, te, le, la, nous, vous, les. Indirect object pronouns often replace à plus a person: me, te, lui, nous, vous, leur. They usually come before the conjugated verb.',
    explanationFr:
      'Les pronoms compléments remplacent des noms pour éviter les répétitions. Les pronoms COD répondent à qui ou quoi : me, te, le, la, nous, vous, les. Les pronoms COI remplacent souvent à plus une personne : me, te, lui, nous, vous, leur. Ils se placent généralement avant le verbe conjugué.',
    examples: ['Je vois Marie. / Je la vois.', 'Tu appelles tes parents. / Tu les appelles.', 'Elle parle à Paul. / Elle lui parle.', 'Nous écrivons aux clients. / Nous leur écrivons.'],
  },
  'pronoun-placement-a2': {
    explanationEn:
      'Object pronouns normally go before the conjugated verb. With a two-verb structure, they usually go before the infinitive because they belong to that action. In negative sentences, ne and pas surround the verb group that contains the object pronoun.',
    explanationFr:
      'Les pronoms compléments se placent normalement avant le verbe conjugué. Dans une structure à deux verbes, ils se placent souvent avant l’infinitif parce qu’ils appartiennent à cette action. Dans les phrases négatives, ne et pas entourent le groupe verbal qui contient le pronom complément.',
    examples: ['Je le vois.', 'Je vais le voir.', 'Elle ne lui parle pas.', 'Nous voulons les acheter.'],
  },
  'y-en-intro-a2': {
    explanationEn:
      'Y usually replaces a place or an à phrase, while en replaces a de phrase or an unspecified quantity. Both pronouns usually come before the conjugated verb. They are short, frequent, and powerful because they let you answer naturally without repeating long phrases.',
    explanationFr:
      'Y remplace généralement un lieu ou un groupe avec à, tandis que en remplace un groupe avec de ou une quantité non précisée. Les deux pronoms se placent généralement avant le verbe conjugué. Ils sont courts, fréquents et très utiles parce qu’ils permettent de répondre naturellement sans répéter de longues expressions.',
    examples: ['Je vais à Paris. / J’y vais.', 'Elle pense à son projet. / Elle y pense.', 'Tu veux du café ? / J’en veux.', 'Nous parlons de ce film. / Nous en parlons.'],
  },
  'comparative-a2': {
    explanationEn:
      'Comparatives compare two people, things, actions, or qualities. Use plus ... que for more than, moins ... que for less than, and aussi ... que for as ... as. Adjectives still agree with the noun they describe, and some common comparatives are irregular, such as meilleur for better.',
    explanationFr:
      'Les comparatifs comparent deux personnes, choses, actions ou qualités. On utilise plus ... que pour more than, moins ... que pour less than, et aussi ... que pour as ... as. Les adjectifs s’accordent toujours avec le nom qu’ils décrivent, et certains comparatifs courants sont irréguliers, comme meilleur pour better.',
    examples: ['Marie est plus grande que Paul.', 'Ce billet est moins cher que l’autre.', 'Il travaille aussi vite que toi.', 'Cette idée est meilleure.'],
  },
  'superlative-a2': {
    explanationEn:
      'Superlatives express the most or the least in a group. Use le plus, la plus, les plus, le moins, la moins, or les moins depending on the noun and adjective. With adjectives after the noun, the superlative article often appears before the adjective too.',
    explanationFr:
      'Les superlatifs expriment le plus ou le moins dans un groupe. On utilise le plus, la plus, les plus, le moins, la moins ou les moins selon le nom et l’adjectif. Avec les adjectifs placés après le nom, l’article du superlatif apparaît souvent aussi devant l’adjectif.',
    examples: ['C’est le plus grand musée de la ville.', 'Elle choisit la solution la moins chère.', 'Ce sont les meilleurs restaurants.', 'C’est l’exercice le plus difficile.'],
  },
  'adverbs-a2': {
    explanationEn:
      'Adverbs describe how, when, where, or how often something happens. Many adverbs are fixed words such as bien, mal, souvent, déjà, toujours, and bientôt. Many manner adverbs are formed from the feminine adjective plus -ment, but common irregular forms like vite and vraiment must be learned directly.',
    explanationFr:
      'Les adverbes décrivent comment, quand, où ou à quelle fréquence quelque chose se passe. Beaucoup d’adverbes sont des mots fixes comme bien, mal, souvent, déjà, toujours et bientôt. Beaucoup d’adverbes de manière se forment avec l’adjectif féminin plus -ment, mais des formes courantes irrégulières comme vite et vraiment doivent être apprises directement.',
    examples: ['Elle parle lentement.', 'Nous allons souvent au marché.', 'Il a déjà fini.', 'Tu comprends vraiment bien.'],
  },
  'time-expressions-a2': {
    explanationEn:
      'Depuis, pendant, and il y a all talk about time, but they answer different questions. Depuis marks an action or state that began in the past and continues now. Pendant gives the duration of an event, and il y a tells how long ago something happened.',
    explanationFr:
      'Depuis, pendant et il y a parlent tous du temps, mais ils répondent à des questions différentes. Depuis marque une action ou un état qui a commencé dans le passé et continue maintenant. Pendant indique la durée d’un événement, et il y a indique combien de temps s’est écoulé depuis un événement.',
    examples: ['J’habite ici depuis deux ans.', 'Nous avons travaillé pendant trois heures.', 'Elle est partie il y a dix minutes.', 'Il étudie le français depuis janvier.'],
  },
  'future-simple-intro-a2': {
    explanationEn:
      'The futur simple is used for future events, predictions, promises, and formal plans. For many verbs, use the infinitive as the stem and add -ai, -as, -a, -ons, -ez, -ont. For -re verbs, drop the final -e before adding the endings; common verbs such as être, avoir, aller, and faire have irregular stems.',
    explanationFr:
      'Le futur simple sert à parler d’événements futurs, de prédictions, de promesses et de projets plus formels. Pour beaucoup de verbes, on utilise l’infinitif comme radical et on ajoute -ai, -as, -a, -ons, -ez, -ont. Pour les verbes en -re, on enlève le -e final avant les terminaisons ; des verbes courants comme être, avoir, aller et faire ont des radicaux irréguliers.',
    examples: ['Je parlerai demain.', 'Tu prendras le train.', 'Nous serons à l’heure.', 'Elles feront attention.'],
  },
  'conditional-politeness-a2': {
    explanationEn:
      'The conditional is very useful for polite requests because it sounds softer than the present. At A2, focus on fixed polite forms such as je voudrais, j’aimerais, pourriez-vous, and ce serait possible. These forms help you ask for things, make appointments, and negotiate without sounding too direct.',
    explanationFr:
      'Le conditionnel est très utile pour les demandes polies parce qu’il est plus doux que le présent. Au niveau A2, il faut surtout maîtriser des formes polies fixes comme je voudrais, j’aimerais, pourriez-vous et ce serait possible. Ces formes aident à demander des choses, prendre rendez-vous et négocier sans paraître trop direct.',
    examples: ['Je voudrais un café, s’il vous plaît.', 'J’aimerais réserver une table.', 'Pourriez-vous répéter ?', 'Ce serait possible demain ?'],
  },
  'relative-qui-que-ou-a2': {
    explanationEn:
      'Basic relative pronouns connect two ideas and avoid repeating a noun. Qui is the subject of the second verb, que is the direct object, and où refers to a place or time. The noun before the relative pronoun is called the antecedent.',
    explanationFr:
      'Les pronoms relatifs de base relient deux idées et évitent de répéter un nom. Qui est le sujet du deuxième verbe, que est le complément d’objet direct, et où renvoie à un lieu ou à un moment. Le nom placé avant le pronom relatif s’appelle l’antécédent.',
    examples: ['La femme qui parle est ma voisine.', 'Le film que j’aime est français.', 'La ville où j’habite est calme.', 'Le jour où tu arrives est important.'],
  },
  'negation-varied-a2': {
    explanationEn:
      'French has several negative pairs that work like ne...pas. Ne...jamais means never, ne...plus means no longer or no more, ne...rien means nothing or not anything, and ne...personne means nobody or not anyone. In speech, ne may disappear, but the second negative word carries the meaning.',
    explanationFr:
      'Le français a plusieurs paires négatives qui fonctionnent comme ne...pas. Ne...jamais signifie never, ne...plus signifie no longer ou no more, ne...rien signifie nothing ou not anything, et ne...personne signifie nobody ou not anyone. À l’oral, ne peut disparaître, mais le deuxième mot négatif porte le sens.',
    examples: ['Je ne mange jamais de viande.', 'Elle ne travaille plus ici.', 'Nous ne comprenons rien.', 'Il ne voit personne.'],
  },
  'si-present-future-a2': {
    explanationEn:
      'For real conditions about the future, French uses si plus present in the condition clause and futur simple, futur proche, present, or imperative in the result clause. Do not use the future tense directly after si in this pattern. This structure is common for plans, warnings, promises, and practical instructions.',
    explanationFr:
      'Pour les conditions réelles portant sur le futur, le français utilise si plus présent dans la proposition de condition, puis le futur simple, le futur proche, le présent ou l’impératif dans la conséquence. On n’utilise pas le futur directement après si dans ce modèle. Cette structure est fréquente pour les projets, les avertissements, les promesses et les instructions pratiques.',
    examples: ['Si tu viens, je cuisinerai.', 'Si vous avez faim, mangez maintenant.', 'Si elle appelle, je réponds.', 'Si nous partons tôt, nous allons arriver à midi.'],
  },
  'reported-speech-a2': {
    explanationEn:
      'Reported speech lets you repeat someone’s words, thoughts, or beliefs without quoting directly. Use verbs such as dire que, penser que, croire que, expliquer que, and répondre que. At A2, the tense often stays the same when the reporting verb is in the present.',
    explanationFr:
      'Le discours rapporté permet de répéter les paroles, pensées ou croyances de quelqu’un sans citer directement. On utilise des verbes comme dire que, penser que, croire que, expliquer que et répondre que. Au niveau A2, le temps reste souvent le même quand le verbe introducteur est au présent.',
    examples: ['Elle dit qu’elle arrive.', 'Je pense que c’est vrai.', 'Il explique qu’il est malade.', 'Nous croyons que le train est en retard.'],
  },
  'gerondif-intro-a2': {
    explanationEn:
      'The gérondif uses en plus the present participle to mean while doing or by doing. It often shows two simultaneous actions or the means used to do something. The subject of both actions is usually the same person or thing.',
    explanationFr:
      'Le gérondif utilise en plus le participe présent pour exprimer while doing ou by doing. Il montre souvent deux actions simultanées ou le moyen utilisé pour faire quelque chose. Le sujet des deux actions est généralement la même personne ou la même chose.',
    examples: ['Je révise en écoutant de la musique.', 'Elle apprend en pratiquant.', 'Nous parlons en marchant.', 'Il a réussi en travaillant chaque jour.'],
  },
  'y-en': {
    explanationEn:
      'Y and en replace whole phrases, not just single nouns. Y usually replaces à plus a place or thing, while en replaces de plus a thing, source, topic, or quantity. They come before most conjugated verbs, and in short answers they make French sound much more natural.',
    explanationFr:
      'Y et en remplacent des groupes entiers, pas seulement des noms isolés. Y remplace généralement à plus un lieu ou une chose, tandis que en remplace de plus une chose, une origine, un sujet ou une quantité. Ils se placent avant la plupart des verbes conjugués, et dans les réponses courtes ils rendent le français beaucoup plus naturel.',
    examples: ['Tu vas à la bibliothèque ? Oui, j’y vais.', 'Il pense à son examen. Il y pense beaucoup.', 'Vous voulez du thé ? Oui, j’en veux.', 'Elle revient de Paris. Elle en revient demain.'],
  },
  'relative-pronouns': {
    explanationEn:
      'Relative pronouns connect clauses and identify which person, thing, place, or idea you mean. Qui is a subject, que is a direct object, où marks place or time, and dont replaces de plus a noun or verb phrase. Choosing the right pronoun depends on the role it plays inside the second clause.',
    explanationFr:
      'Les pronoms relatifs relient des propositions et précisent de quelle personne, chose, lieu ou idée on parle. Qui est sujet, que est complément d’objet direct, où marque le lieu ou le temps, et dont remplace de plus un nom ou un groupe verbal. Le choix du bon pronom dépend du rôle qu’il joue dans la deuxième proposition.',
    examples: ['La personne qui parle est belge.', 'Le livre que tu lis est intéressant.', 'La ville où je suis né est petite.', 'Le sujet dont nous parlons est compliqué.'],
  },
  conditional: {
    explanationEn:
      'The conditional expresses polite requests, wishes, advice, uncertainty, and hypothetical results. It uses the same stems as the futur simple plus imparfait endings: -ais, -ais, -ait, -ions, -iez, -aient. It is especially common with si plus imparfait to describe unreal or imagined situations.',
    explanationFr:
      'Le conditionnel exprime les demandes polies, les souhaits, les conseils, l’incertitude et les conséquences hypothétiques. Il utilise les mêmes radicaux que le futur simple plus les terminaisons de l’imparfait : -ais, -ais, -ait, -ions, -iez, -aient. Il est particulièrement fréquent avec si plus imparfait pour décrire des situations irréelles ou imaginées.',
    examples: ['Je voudrais plus de temps.', 'Tu devrais te reposer.', 'Nous irions en France si possible.', 'Ce serait une bonne solution.'],
  },
  subjunctive: {
    explanationEn:
      'The subjunctive is a mood used after many expressions of necessity, desire, emotion, doubt, possibility, and judgment. It often appears after que when there is a change of subject between the main clause and the dependent clause. Focus first on common triggers such as il faut que, je veux que, bien que, and pour que.',
    explanationFr:
      'Le subjonctif est un mode utilisé après beaucoup d’expressions de nécessité, volonté, émotion, doute, possibilité et jugement. Il apparaît souvent après que quand le sujet de la proposition principale et celui de la proposition dépendante sont différents. Il faut d’abord maîtriser des déclencheurs courants comme il faut que, je veux que, bien que et pour que.',
    examples: ['Il faut que tu sois à l’heure.', 'Je veux qu’elle vienne.', 'Bien qu’il soit fatigué, il continue.', 'Nous travaillons pour que tout soit prêt.'],
  },
  'si-clauses': {
    explanationEn:
      'Si clauses express real, possible, or hypothetical conditions. Present plus future describes a real future possibility, imparfait plus conditional describes an unreal present or unlikely situation, and plus-que-parfait plus past conditional describes an unreal past. French does not use the future or conditional directly after si in these standard patterns.',
    explanationFr:
      'Les phrases avec si expriment des conditions réelles, possibles ou hypothétiques. Présent plus futur décrit une possibilité future réelle, imparfait plus conditionnel décrit une situation présente irréelle ou peu probable, et plus-que-parfait plus conditionnel passé décrit un passé irréel. Le français n’utilise pas le futur ou le conditionnel directement après si dans ces modèles standards.',
    examples: ['Si tu viens, je serai content.', 'Si j’avais le temps, je voyagerais.', 'Si elle étudiait plus, elle réussirait.', 'Si nous avions su, nous serions venus.'],
  },
}

const defaultDifficulty: Record<SkillTopic['level'], number> = {
  A1: 1,
  A2: 2,
  B1: 4,
  B2: 5,
}

export function applyDetailedGrammarTopics(topics: SkillTopic[]) {
  topics.forEach((topic, index) => {
    const detail = grammarDetails[topic.id]
    if (detail) {
      topic.explanationEn = detail.explanationEn
      topic.explanationFr = detail.explanationFr
      topic.examples = detail.examples
    }
    topic.difficulty ??= defaultDifficulty[topic.level]
    topic.estimatedMinutes ??= topic.level === 'A1' ? 8 : topic.level === 'A2' ? 10 : topic.level === 'B1' ? 14 : 18
    topic.sequence ??= index + 1
  })
  applyGrammarGuides(topics)
}
