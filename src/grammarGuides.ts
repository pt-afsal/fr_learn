import type { GrammarLessonGuide, GrammarMistake, SkillTopic } from './types'

type GuideSeed = {
  goals: string[]
  rules: string[]
  mistakes: GrammarMistake[]
  tip: string
  reference?: Array<{ label: string; value: string }>
}

const m = (incorrect: string, correct: string, explanation: string): GrammarMistake => ({ incorrect, correct, explanation })
const g = (goals: string[], rules: string[], mistakes: GrammarMistake[], tip: string, reference?: GuideSeed['reference']): GuideSeed => ({ goals, rules, mistakes, tip, reference })

const guides: Record<string, GuideSeed> = {
  'articles-gender': g(
    ['Learn nouns together with their article.', 'Choose an article that matches gender and number.', 'Use elision before vowel sounds.'],
    ['Every French noun is masculine or feminine: learn le problème and la solution as complete units.', 'Use le or la for a specific singular noun, l’ before a vowel sound, and les for plural nouns.', 'Gender is grammatical: it does not always follow meaning, so memorisation is important.'],
    [m('le voiture', 'la voiture', 'Voiture is feminine.'), m('le eau', 'l’eau', 'Use l’ before a vowel sound.')],
    'When adding vocabulary, always write the article before the noun.',
    [{ label: 'Masculine', value: 'le / un' }, { label: 'Feminine', value: 'la / une' }, { label: 'Before vowel sound', value: 'l’' }, { label: 'Plural', value: 'les / des' }],
  ),
  'subject-pronouns-a1': g(
    ['Identify who performs an action.', 'Match the verb to the subject pronoun.', 'Use on naturally in spoken French.'],
    ['Use je, tu, il, elle, on, nous, vous, ils, and elles before a conjugated verb.', 'On usually means “we” in everyday speech, but it takes the il/elle verb form.', 'Use elles only for an entirely feminine group; use ils for mixed groups.'],
    [m('On allons au cinéma.', 'On va au cinéma.', 'On takes the third-person singular form.'), m('Marie et Paul, elles arrivent.', 'Marie et Paul, ils arrivent.', 'A mixed group uses ils.')],
    'Say the pronoun aloud before conjugating the verb.',
  ),
  'tu-vous-a1': g(
    ['Choose an appropriate form of “you”.', 'Distinguish a formal singular vous from plural vous.', 'Recognise when someone invites tutoiement.'],
    ['Use tu with friends, family, children, and people who agree to informal speech.', 'Use vous with strangers, clients, teachers, officials, or more than one person.', 'When unsure in a new situation, begin with vous.'],
    [m('Tu désirez un café ?', 'Vous désirez un café ?', 'Use vous and its matching verb ending in a formal exchange.'), m('Vous es prêts ?', 'Vous êtes prêts ?', 'The verb must agree with vous.')],
    'Start formal; switch to tu only when the relationship makes it natural.',
  ),
  'definite-articles-a1': g(
    ['Use le, la, l’, and les.', 'Talk about a specific item or an entire category.', 'Recognise general statements in French.'],
    ['Use le for masculine singular, la for feminine singular, l’ before a vowel sound, and les for plural.', 'French uses the definite article for general likes and categories: J’aime le chocolat.', 'Use the article again even when English omits it.'],
    [m('J’aime chocolat.', 'J’aime le chocolat.', 'General likes use a definite article.'), m('la hôtel', 'l’hôtel', 'Use l’ before a vowel sound.')],
    'Ask: am I talking about a known item or a category? If yes, think le, la, l’, or les.',
  ),
  'indefinite-articles-a1': g(
    ['Introduce a nonspecific item.', 'Use un, une, and des correctly.', 'Change the article after a negative expression.'],
    ['Use un with masculine singular nouns, une with feminine singular nouns, and des with plural nouns.', 'These articles often introduce something for the first time: Il y a un balcon.', 'After most negations, un, une, and des become de or d’.'],
    [m('Je n’ai pas une voiture.', 'Je n’ai pas de voiture.', 'After negation, use de in this pattern.'), m('un adresse', 'une adresse', 'Adresse is feminine.')],
    'For new nouns, learn both the indefinite and definite forms: un livre / le livre.',
  ),
  'plural-nouns-a1': g(
    ['Form regular plurals.', 'Recognise frequent -al and -eau patterns.', 'Notice nouns whose written form does not change.'],
    ['Most nouns add -s in writing: un livre → des livres.', 'Many nouns ending in -al become -aux: journal → journaux.', 'Many nouns ending in -eau add -x: château → châteaux. Words already ending in -s, -x, or -z often stay unchanged.'],
    [m('des journals', 'des journaux', 'Journal follows the frequent -al → -aux pattern.'), m('des châteaus', 'des châteaux', 'Words ending in -eau often add -x.')],
    'Read plurals in full sentences: the article is often the clearest audible signal.',
  ),
  'adjective-agreement-a1': g(
    ['Match adjectives to gender and number.', 'Recognise regular endings.', 'Learn frequent irregular feminine forms.'],
    ['A regular feminine adjective often adds -e: petit → petite.', 'A plural adjective usually adds -s: petits, petites.', 'Some common adjectives change more strongly: beau → belle, nouveau → nouvelle, bon → bonne.'],
    [m('une maison blanc', 'une maison blanche', 'The adjective must agree with a feminine noun.'), m('des filles content', 'des filles contentes', 'Use the feminine plural form.')],
    'Check the noun first, then make the adjective agree with it.',
  ),
  'adjective-position-a1': g(
    ['Place common adjectives naturally.', 'Recognise adjectives that usually follow nouns.', 'Notice meaning changes caused by position.'],
    ['Most descriptive adjectives follow the noun: une voiture rouge.', 'Frequent short adjectives linked to beauty, age, goodness, and size often come before the noun: un petit appartement.', 'Some adjectives change meaning with position: un ancien collègue is a former colleague.'],
    [m('une rouge voiture', 'une voiture rouge', 'Colours normally follow the noun.'), m('un appartement petit', 'un petit appartement', 'Petit commonly comes before the noun.')],
    'Use BAGS as a memory aid: beauty, age, goodness, size often come before the noun.',
  ),
  'present-er': g(
    ['Conjugate regular -er verbs in the present.', 'Remove the infinitive ending before adding a new ending.', 'Pronounce silent endings naturally.'],
    ['Remove -er and add -e, -es, -e, -ons, -ez, -ent.', 'The written forms je parle, tu parles, il parle, and ils parlent often sound alike.', 'Use the present for current actions, habits, and general facts.'],
    [m('nous parle', 'nous parlons', 'Nous requires -ons.'), m('ils parlez', 'ils parlent', 'Ils requires -ent.')],
    'Memorise the full ending line: e, es, e, ons, ez, ent.',
    [{ label: 'je', value: '-e' }, { label: 'tu', value: '-es' }, { label: 'il / elle / on', value: '-e' }, { label: 'nous', value: '-ons' }, { label: 'vous', value: '-ez' }, { label: 'ils / elles', value: '-ent' }],
  ),
  'etre-avoir': g(
    ['Conjugate être and avoir in the present.', 'Use them to describe identity, state, age, and possession.', 'Recognise them as auxiliaries in past tenses.'],
    ['Être: je suis, tu es, il est, nous sommes, vous êtes, ils sont.', 'Avoir: j’ai, tu as, il a, nous avons, vous avez, ils ont.', 'French uses avoir for age: J’ai vingt ans.'],
    [m('Je suis vingt ans.', 'J’ai vingt ans.', 'French expresses age with avoir.'), m('Ils est prêts.', 'Ils sont prêts.', 'Ils requires sont.')],
    'These two verbs are foundational: practise them until the forms are automatic.',
  ),
  'present-aller-faire-a1': g(
    ['Conjugate aller and faire.', 'Use aller for movement and the near future.', 'Use common expressions with faire.'],
    ['Aller: je vais, tu vas, il va, nous allons, vous allez, ils vont.', 'Faire: je fais, tu fais, il fait, nous faisons, vous faites, ils font.', 'Faire appears in weather and activities: Il fait froid; faire du sport.'],
    [m('nous faisons du cinéma', 'nous allons au cinéma', 'Use aller for going somewhere.'), m('vous faisez', 'vous faites', 'The vous form is irregular.')],
    'Practise aller and faire as complete chunks inside useful daily sentences.',
  ),
  'regular-ir-re-a1': g(
    ['Recognise regular -ir and -re patterns.', 'Conjugate common verbs such as finir and attendre.', 'Distinguish regular -ir verbs from irregular ones.'],
    ['For finir-type -ir verbs, use -is, -is, -it, -issons, -issez, -issent.', 'For regular -re verbs such as attendre, use -s, -s, nothing, -ons, -ez, -ent.', 'Not every verb ending in -ir is regular: partir and venir need separate learning.'],
    [m('nous finons', 'nous finissons', 'Finir uses the -issons nous form.'), m('il attends', 'il attend', 'The il form of attendre has no written ending.')],
    'Check the verb family before applying a regular ending pattern.',
  ),
  'questions': g(
    ['Ask yes/no questions in three common ways.', 'Use question words naturally.', 'Choose a form appropriate for speech or writing.'],
    ['In everyday speech, use intonation: Tu viens ?', 'Use est-ce que before normal word order: Est-ce que tu viens ?', 'Use inversion more often in formal contexts: Venez-vous ? Add a hyphen.'],
    [m('Est-ce tu viens ?', 'Est-ce que tu viens ?', 'The full expression is est-ce que.'), m('Viens tu ?', 'Viens-tu ?', 'Inversion uses a hyphen.')],
    'Master est-ce que first: it works reliably with almost every subject.',
  ),
  'negation-ne-pas-a1': g(
    ['Build a basic negative sentence.', 'Place ne and pas around the conjugated verb.', 'Recognise informal spoken French.'],
    ['Place ne before the conjugated verb and pas after it: Je ne comprends pas.', 'Before a vowel sound, ne becomes n’: Il n’aime pas.', 'Spoken French often drops ne, but careful writing keeps it.'],
    [m('Je pas comprends.', 'Je ne comprends pas.', 'The verb stays between ne and pas.'), m('Il ne aime pas.', 'Il n’aime pas.', 'Use n’ before a vowel sound.')],
    'Imagine ne and pas as two brackets around the conjugated verb.',
  ),
  'c-est-il-est-a1': g(
    ['Choose between c’est and il/elle est.', 'Introduce a noun with c’est.', 'Describe a person or thing with il/elle est.'],
    ['Use c’est before a noun or stressed pronoun: C’est un professeur; c’est moi.', 'Use il est or elle est before an adjective or profession without article: Elle est médecin.', 'Use ce sont for a plural identification: Ce sont mes amis.'],
    [m('Il est un médecin.', 'C’est un médecin.', 'Use c’est before a noun with an article.'), m('C’est gentille.', 'Elle est gentille.', 'Use elle est before an adjective when the subject is known.')],
    'Noun with article? Think c’est. Adjective describing a known subject? Think il/elle est.',
  ),
  'possessive-adjectives-a1': g(
    ['Show possession with mon, ma, mes and related forms.', 'Match the adjective to the possessed noun.', 'Use mon before a feminine vowel sound.'],
    ['Possessive adjectives agree with the thing possessed, not the owner: sa voiture can belong to him or her.', 'Use mon, ton, or son before a feminine noun beginning with a vowel sound: mon amie.', 'Plural possessed nouns use mes, tes, ses, nos, vos, or leurs.'],
    [m('ma amie', 'mon amie', 'Use mon before a feminine vowel sound.'), m('Marie aime son parents.', 'Marie aime ses parents.', 'Parents is plural.')],
    'Look at the noun after the possessive adjective; that noun controls the form.',
  ),
  'demonstrative-adjectives-a1': g(
    ['Use ce, cet, cette, and ces.', 'Point to a specific person or object.', 'Select cet before a masculine vowel sound.'],
    ['Use ce before masculine consonant sounds, cet before masculine vowel sounds, cette for feminine singular, and ces for plural.', 'Add -ci or -là for emphasis when useful: ce livre-ci, cette table-là.', 'The demonstrative adjective must agree with the following noun.'],
    [m('ce hôtel', 'cet hôtel', 'Use cet before a masculine vowel sound.'), m('cette livres', 'ces livres', 'Use ces for all plural nouns.')],
    'Listen to the first sound of the noun before choosing ce or cet.',
  ),
  'numbers-time-a1': g(
    ['Tell the time.', 'Use common time expressions.', 'Distinguish formal and everyday time formats.'],
    ['Use Il est + hour: Il est huit heures.', 'Use et quart, et demie, and moins le quart in everyday speech.', 'Use à before the time of an event: Le cours commence à neuf heures.'],
    [m('Il a huit heures.', 'Il est huit heures.', 'Clock time uses être.'), m('Le cours commence en neuf heures.', 'Le cours commence à neuf heures.', 'Use à for a specific clock time.')],
    'Practise by saying the current time aloud several times each day.',
  ),
  'prepositions-place-a1': g(
    ['Describe where objects and places are.', 'Use à, dans, sur, sous, devant, and derrière.', 'Choose common city and country prepositions.'],
    ['Use dans for inside, sur for on top of, sous for under, devant for in front of, and derrière for behind.', 'Use à with cities: à Paris.', 'Use en with many feminine countries, au with many masculine countries, and aux with plural countries.'],
    [m('Je vais en Paris.', 'Je vais à Paris.', 'Cities normally use à.'), m('Le livre est dans la table.', 'Le livre est sur la table.', 'Use sur for on top of a surface.')],
    'Draw a small room and describe the location of five objects aloud.',
  ),
  'futur-proche-a1': g(
    ['Talk about a near or planned future.', 'Conjugate aller before an infinitive.', 'Distinguish the two verbs in the structure.'],
    ['Use a present form of aller followed by an infinitive: Je vais partir.', 'Only aller changes with the subject; the main action stays in the infinitive.', 'Use futur proche for intentions, plans, and events expected soon.'],
    [m('Je vais pars.', 'Je vais partir.', 'The second verb remains in the infinitive.'), m('Nous va manger.', 'Nous allons manger.', 'Aller must agree with nous.')],
    'Think: “going to” = aller + infinitive.',
  ),
  'imperative-a1': g(
    ['Give simple instructions and suggestions.', 'Use tu, nous, and vous forms without subject pronouns.', 'Place object pronouns correctly in common commands.'],
    ['Use only tu, nous, and vous forms, and remove the written subject: Écoutez !', 'For regular -er verbs, the affirmative tu form usually drops final -s: Parle !', 'Use allons-y and vas-y as frequent fixed expressions.'],
    [m('Tu écoutez !', 'Écoutez !', 'Remove the subject and use the vous form.'), m('Parles plus lentement !', 'Parle plus lentement !', 'Regular -er tu imperatives usually drop -s.')],
    'Imagine giving directions to a friend and to a group; switch between tu and vous.',
  ),
  'il-y-a-a1': g(
    ['Say that something exists.', 'Ask whether something is present.', 'Use il y a in present and past contexts.'],
    ['Use il y a before a noun: Il y a une pharmacie près d’ici.', 'For a question, use Est-ce qu’il y a… ?', 'For the past, use il y avait for a background situation or il y a eu for an event.'],
    [m('Il est une boulangerie.', 'Il y a une boulangerie.', 'Use il y a to express existence.'), m('Est-ce que il y a ?', 'Est-ce qu’il y a ?', 'Use elision before il.')],
    'Use il y a when you could say “there is” or “there are”.',
  ),
  'partitive-articles-a2': g(
    ['Talk about an unspecified amount.', 'Use du, de la, de l’, and des.', 'Change the form after negation and quantities.'],
    ['Use du with masculine mass nouns, de la with feminine mass nouns, de l’ before vowel sounds, and des with plural items.', 'After most negations, use de or d’: Je ne bois pas de café.', 'After a quantity, use de: beaucoup de pain.'],
    [m('Je bois le café.', 'Je bois du café.', 'Use a partitive article for an unspecified amount.'), m('beaucoup du pain', 'beaucoup de pain', 'A quantity expression takes de.')],
    'Ask whether you mean “some” rather than a complete specific item.',
  ),
  'quantities-a2': g(
    ['Express amounts precisely.', 'Use quantity + de.', 'Distinguish enough, too much, and a little.'],
    ['Quantity expressions are followed by de or d’: un kilo de pommes, beaucoup d’eau.', 'Use assez de for enough, trop de for too much or too many, and peu de for little or few.', 'The noun may be singular or plural depending on meaning, but de stays unchanged.'],
    [m('un kilo des pommes', 'un kilo de pommes', 'Quantity expressions use de.'), m('trop beaucoup de sucre', 'trop de sucre', 'Use one quantity expression at a time.')],
    'Practise using food quantities from a shopping list.',
  ),
  'reflexive-verbs-a2': g(
    ['Conjugate daily-routine verbs.', 'Match the reflexive pronoun to the subject.', 'Form negative and past-tense versions.'],
    ['Use me, te, se, nous, vous, se before the conjugated verb: Je me lève.', 'In the negative, place ne before the reflexive pronoun: Je ne me lève pas tôt.', 'In passé composé, reflexive verbs use être: Elle s’est levée.'],
    [m('Je se lève.', 'Je me lève.', 'The reflexive pronoun must match je.'), m('Elle a se levé.', 'Elle s’est levée.', 'Reflexive verbs use être in passé composé.')],
    'Describe your morning routine with five reflexive verbs.',
  ),
  'passe-compose': g(
    ['Describe completed past events.', 'Choose avoir or être.', 'Form common past participles.'],
    ['Build the tense with an auxiliary in the present plus a past participle: J’ai parlé.', 'Most verbs use avoir; a smaller group of movement verbs and reflexive verbs use être.', 'Regular participles: -er → -é, -ir → -i, -re → -u.'],
    [m('J’ai parler.', 'J’ai parlé.', 'Use a past participle after the auxiliary.'), m('Elle a allée.', 'Elle est allée.', 'Aller uses être.')],
    'First choose the auxiliary, then form the participle, then check agreement if être is used.',
  ),
  'passe-compose-avoir-a2': g(
    ['Use avoir with most verbs.', 'Form regular and irregular participles.', 'Place negation around the auxiliary.'],
    ['Most French verbs form passé composé with avoir: Nous avons fini.', 'The past participle normally stays unchanged when avoir is used, except in more advanced object-before-verb situations.', 'Put ne and pas around the auxiliary: Je n’ai pas compris.'],
    [m('Nous avons finir.', 'Nous avons fini.', 'Use the past participle.'), m('Je ai parlé.', 'J’ai parlé.', 'Use elision before ai.')],
    'Learn frequent irregular participles as vocabulary: eu, fait, pris, vu, lu, écrit.',
  ),
  'passe-compose-etre-a2': g(
    ['Use être with movement and reflexive verbs.', 'Make the participle agree with the subject.', 'Recognise frequent être verbs.'],
    ['Common être verbs include aller, venir, arriver, partir, entrer, sortir, naître, and mourir.', 'The past participle agrees with the subject: elle est arrivée; ils sont partis.', 'Reflexive verbs also use être: nous nous sommes levés.'],
    [m('Elle est arrivé.', 'Elle est arrivée.', 'Add -e for a feminine singular subject.'), m('Ils ont partis.', 'Ils sont partis.', 'Partir uses être.')],
    'Visualise movement from one place or state to another, then check agreement.',
  ),
  'imparfait': g(
    ['Describe background and repeated past actions.', 'Build the imparfait stem from the nous form.', 'Contrast it with completed events.'],
    ['Take the present nous form, remove -ons, and add -ais, -ais, -ait, -ions, -iez, -aient.', 'Use the imparfait for habits, descriptions, ongoing situations, and background.', 'Être is irregular: j’étais, tu étais, il était, nous étions, vous étiez, ils étaient.'],
    [m('Quand j’étais enfant, je suis allé souvent au parc.', 'Quand j’étais enfant, j’allais souvent au parc.', 'Use imparfait for a repeated past habit.'), m('nous mangionsions', 'nous mangions', 'Use the stem mange- plus -ions.')],
    'Ask whether the action is background or repeated; if yes, consider the imparfait.',
  ),
  'pc-imparfait-a2': g(
    ['Choose between passé composé and imparfait.', 'Narrate a past situation clearly.', 'Combine background and events.'],
    ['Use imparfait for the scene, ongoing context, habits, and descriptions.', 'Use passé composé for completed events that move the story forward.', 'The two tenses often work together: Il pleuvait quand le bus est arrivé.'],
    [m('Il a plu quand je marchais tous les jours.', 'Il pleuvait quand je marchais tous les jours.', 'Repeated or background actions usually need imparfait.'), m('Je dormais soudain.', 'Soudain, je me suis réveillé.', 'A sudden completed event normally uses passé composé.')],
    'Think of imparfait as the background camera and passé composé as the sequence of events.',
  ),
  'past-participle-agreement-a2': g(
    ['Apply agreement with être.', 'Recognise basic agreement with reflexive verbs.', 'Avoid adding agreement automatically with avoir.'],
    ['With être, the participle normally agrees with the subject: elles sont arrivées.', 'With avoir, the participle normally stays unchanged at A2: elles ont mangé.', 'Reflexive verbs often show subject agreement: elle s’est levée.'],
    [m('Elles sont arrivé.', 'Elles sont arrivées.', 'Use feminine plural agreement with être.'), m('Elles ont mangées.', 'Elles ont mangé.', 'Do not add agreement automatically with avoir.')],
    'Underline the auxiliary first: être is the signal to check subject agreement.',
  ),
  'object-pronouns': g(
    ['Replace repeated objects.', 'Choose a direct or indirect pronoun.', 'Place the pronoun before the conjugated verb.'],
    ['Use le, la, or les for direct objects: Je vois Marie → Je la vois.', 'Use lui or leur for people introduced by à: Je parle à Paul → Je lui parle.', 'Place the pronoun before the conjugated verb, including before the auxiliary in passé composé.'],
    [m('Je vois la.', 'Je la vois.', 'Object pronouns normally come before the verb.'), m('Je lui regarde.', 'Je le regarde.', 'Regarder takes a direct object.')],
    'Ask whether the original expression uses à before choosing lui or leur.',
  ),
  'pronoun-placement-a2': g(
    ['Place object pronouns in different verb structures.', 'Use pronouns with an infinitive.', 'Handle negation correctly.'],
    ['With one conjugated verb, place the pronoun before it: Je le connais.', 'With a conjugated verb plus infinitive, place the pronoun before the infinitive when it belongs to that action: Je vais le voir.', 'In a negative sentence, the pronoun remains close to its verb: Je ne le vois pas.'],
    [m('Je vais voir le.', 'Je vais le voir.', 'Place the pronoun before the infinitive.'), m('Je ne vois le pas.', 'Je ne le vois pas.', 'The pronoun comes before the conjugated verb.')],
    'Keep each pronoun immediately before the verb whose object it replaces.',
  ),
  'y-en-intro-a2': g(
    ['Replace à and de phrases.', 'Use y for places and things introduced by à.', 'Use en for de phrases and quantities.'],
    ['Y often replaces à + place or thing: Tu vas à Paris ? J’y vais.', 'En often replaces de + noun: Tu veux du pain ? J’en veux.', 'Keep a stated quantity after en: J’en veux deux.'],
    [m('Je vais à y.', 'J’y vais.', 'Y replaces the full à phrase.'), m('J’en veux du pain.', 'J’en veux.', 'Do not repeat the replaced phrase unless clarification is needed.')],
    'Y often answers “where?”; en often answers “of it?”, “from there?”, or “how many?”.',
  ),
  'y-en': g(
    ['Use y and en confidently in longer sentences.', 'Replace whole prepositional phrases.', 'Combine them with common verbs.'],
    ['Use y for à + thing or a place: penser à quelque chose → y penser.', 'Use en for de + thing, origin, or quantity: parler de quelque chose → en parler.', 'Both usually come before the conjugated verb: J’en ai besoin; j’y suis allé.'],
    [m('Je pense de mon examen, j’y pense.', 'Je pense à mon examen, j’y pense.', 'Y replaces a phrase introduced by à.'), m('J’en vais.', 'J’y vais.', 'A destination is replaced by y, not en.')],
    'Learn the preposition used by each verb: penser à → y; parler de → en.',
  ),
  'comparative-a2': g(
    ['Compare people, objects, and situations.', 'Use plus, moins, and aussi correctly.', 'Compare nouns, adjectives, and verbs.'],
    ['For adjectives and adverbs: plus / moins / aussi + adjective + que.', 'For nouns: plus de / moins de / autant de + noun + que.', 'For verbs: verb + plus / moins / autant que.'],
    [m('Paris est plus grand de Lyon.', 'Paris est plus grand que Lyon.', 'Use que after an adjective comparison.'), m('J’ai plus livres que toi.', 'J’ai plus de livres que toi.', 'Use de before a compared noun.')],
    'Decide whether you are comparing an adjective, a noun, or a verb before selecting the pattern.',
  ),
  'superlative-a2': g(
    ['Express the highest or lowest degree.', 'Match the article to the noun.', 'Place the adjective naturally.'],
    ['Use le, la, or les plus / moins before an adjective: la plus grande ville.', 'The article agrees with the noun being described.', 'Some frequent adjectives have special forms, such as le meilleur and la meilleure.'],
    [m('le plus grande ville', 'la plus grande ville', 'Ville is feminine.'), m('le plus bon restaurant', 'le meilleur restaurant', 'Use meilleur for “best”.')],
    'Build the phrase in layers: article + plus/moins + adjective + noun.',
  ),
  'adverbs-a2': g(
    ['Describe how an action happens.', 'Form many adverbs with -ment.', 'Place common adverbs correctly.'],
    ['Many adverbs come from the feminine adjective plus -ment: lente → lentement.', 'Short common adverbs often follow the conjugated verb: Il parle bien.', 'With passé composé, short adverbs often go between the auxiliary and participle: J’ai bien compris.'],
    [m('Il parle lent.', 'Il parle lentement.', 'Use an adverb to modify a verb.'), m('J’ai compris bien.', 'J’ai bien compris.', 'Short adverbs commonly go between auxiliary and participle.')],
    'Ask: am I describing a noun or an action? Actions normally need an adverb.',
  ),
  'time-expressions-a2': g(
    ['Locate actions in time.', 'Distinguish depuis, pendant, il y a, and dans.', 'Use time expressions with the correct tense.'],
    ['Depuis expresses an action continuing from the past into the present: J’habite ici depuis 2022.', 'Pendant expresses a completed duration: J’ai étudié pendant deux heures.', 'Il y a means ago; dans means in a future amount of time.'],
    [m('Je suis ici pendant trois ans.', 'Je suis ici depuis trois ans.', 'Use depuis for a situation still continuing.'), m('Je pars il y a deux heures.', 'Je pars dans deux heures.', 'Use dans for future time.')],
    'Draw a timeline: continuing, completed duration, past distance, or future distance.',
  ),
  'future-simple-intro-a2': g(
    ['Form the regular futur simple.', 'Use future endings consistently.', 'Contrast planned and more neutral future statements.'],
    ['For many verbs, add -ai, -as, -a, -ons, -ez, -ont to the infinitive.', 'For -re verbs, remove the final -e before adding the ending: attendre → j’attendrai.', 'Use futur simple for predictions, promises, and future facts.'],
    [m('Je parlerais demain.', 'Je parlerai demain.', 'Use -ai for future, not conditional -ais.'), m('Nous attendreons.', 'Nous attendrons.', 'Remove the final -e of -re verbs.')],
    'Keep the future ending line visible: ai, as, a, ons, ez, ont.',
  ),
  'conditional-politeness-a2': g(
    ['Make requests politely.', 'Use frequent conditional expressions.', 'Avoid overly direct commands.'],
    ['Use je voudrais and j’aimerais for polite requests.', 'Use pourriez-vous + infinitive for a polite question.', 'Use ce serait possible de… ? when proposing an option.'],
    [m('Je veux un café.', 'Je voudrais un café.', 'The conditional sounds more polite in a service situation.'), m('Pouvez-vous de répéter ?', 'Pourriez-vous répéter ?', 'Use the infinitive directly after pourriez-vous.')],
    'Memorise polite chunks as ready-made phrases for appointments, shops, and emails.',
  ),
  'relative-qui-que-ou-a2': g(
    ['Link two sentences without repetition.', 'Choose qui, que, or où.', 'Identify the role of the missing element.'],
    ['Use qui when the relative pronoun is the subject of the next verb.', 'Use que when it is the direct object of the next verb.', 'Use où for a place or time.'],
    [m('La femme que parle est ma voisine.', 'La femme qui parle est ma voisine.', 'The woman performs the action, so use qui.'), m('Le film qui j’aime', 'Le film que j’aime', 'The film is the object of aimer, so use que.')],
    'Look immediately after the blank: if a verb lacks a subject, use qui; if a subject is already present, consider que.',
  ),
  'relative-pronouns': g(
    ['Use qui, que, où, and dont.', 'Connect ideas more precisely.', 'Choose dont for phrases introduced by de.'],
    ['Qui replaces a subject; que replaces a direct object; où replaces a place or time.', 'Dont replaces de + noun: le sujet dont je parle.', 'Choose the pronoun by reconstructing the second sentence before combining it.'],
    [m('Le livre dont je lis.', 'Le livre que je lis.', 'Lire takes a direct object, so use que.'), m('La personne que parle.', 'La personne qui parle.', 'The pronoun is the subject of parle.')],
    'Rebuild the original two sentences to reveal the missing preposition or grammatical role.',
  ),
  'negation-varied-a2': g(
    ['Use several negative expressions.', 'Place the second negative word correctly.', 'Understand common spoken forms.'],
    ['Use ne…jamais for never, ne…plus for no longer, ne…rien for nothing, and ne…personne for nobody.', 'Place rien after a simple verb but before an infinitive: Je ne vois rien; je ne veux rien acheter.', 'Personne often follows the verb: Je ne connais personne.'],
    [m('Je ne jamais mange.', 'Je ne mange jamais.', 'Jamais normally follows the conjugated verb.'), m('Je ne connais rien.', 'Je ne connais personne.', 'Use personne for people.')],
    'Choose the negative meaning first, then place the corresponding word around or after the verb.',
  ),
  'si-present-future-a2': g(
    ['Express a realistic future condition.', 'Use present after si.', 'Choose a suitable result tense.'],
    ['For a real future possibility, use si + present, then futur simple, futur proche, present, or imperative.', 'Do not place futur simple directly after si in this pattern.', 'Use this structure for plans, warnings, promises, and instructions.'],
    [m('Si tu viendras, je cuisinerai.', 'Si tu viens, je cuisinerai.', 'Use present after si.'), m('Si vous aurez faim, mangez.', 'Si vous avez faim, mangez.', 'The si clause stays in the present.')],
    'After si, stop and check: is the verb present rather than future?',
  ),
  'reported-speech-a2': g(
    ['Report words and ideas indirectly.', 'Use verbs followed by que.', 'Keep a clear clause structure.'],
    ['Use dire que, penser que, croire que, expliquer que, and répondre que.', 'At A2, when the reporting verb is present, the second clause often keeps its original tense.', 'Use qu’ before a vowel sound: Il dit qu’il arrive.'],
    [m('Elle dit elle arrive.', 'Elle dit qu’elle arrive.', 'Use que to introduce the reported clause.'), m('Je pense de c’est vrai.', 'Je pense que c’est vrai.', 'Penser takes que before a clause.')],
    'Build the sentence in two blocks: reporting verb + que + complete idea.',
  ),
  'gerondif-intro-a2': g(
    ['Express simultaneous actions.', 'Show the means used to achieve something.', 'Form en + present participle.'],
    ['Form the present participle from the nous form minus -ons plus -ant: nous parlons → parlant.', 'Place en before it: en parlant.', 'The subject of both actions is normally the same.'],
    [m('Je marche en parle.', 'Je marche en parlant.', 'Use the present participle ending -ant.'), m('En je travaille, j’écoute.', 'En travaillant, j’écoute.', 'Use en directly before the participle.')],
    'Think “while doing” or “by doing”: en + -ant.',
  ),
  'futur-simple-irregular-b1': g(
    ['Use frequent irregular future stems.', 'Keep regular future endings.', 'Apply the same stems in the conditional.'],
    ['Common stems include ser-, aur-, ir-, fer-, viendr-, pourr-, voudr-, devr-, saur-, and verr-.', 'Attach the normal future endings: -ai, -as, -a, -ons, -ez, -ont.', 'The conditional uses the same stems with imparfait endings.'],
    [m('Je seraiS demain.', 'Je serai demain.', 'Future je uses -ai; conditional uses -ais.'), m('Nous venirons.', 'Nous viendrons.', 'Venir uses viendr-.')],
    'Learn irregular stems in small families and reuse them for both future and conditional.',
  ),
  'plus-que-parfait-b1': g(
    ['Describe an earlier past action.', 'Combine an imparfait auxiliary with a participle.', 'Clarify the order of past events.'],
    ['Use avoir or être in the imparfait plus the past participle: j’avais mangé; elle était partie.', 'Use it for an action completed before another past event.', 'Agreement follows the same basic logic as passé composé when être is used.'],
    [m('Quand il est arrivé, j’ai déjà mangé.', 'Quand il est arrivé, j’avais déjà mangé.', 'The meal occurred before the arrival.'), m('Elle avait partie.', 'Elle était partie.', 'Partir uses être.')],
    'On a timeline, place plus-que-parfait one step before the main past event.',
  ),
  'si-imparfait-conditional-b1': g(
    ['Express an unreal or unlikely condition.', 'Pair imparfait with conditional.', 'Avoid conditional after si.'],
    ['Use si + imparfait for the condition and conditional present for the imagined result.', 'The order of clauses can change without changing the tense pairing.', 'Never use conditional directly after si in this standard structure.'],
    [m('Si j’aurais le temps, je voyagerais.', 'Si j’avais le temps, je voyagerais.', 'Use imparfait after si.'), m('Si tu viendrais, nous sortirions.', 'Si tu venais, nous sortirions.', 'The condition uses imparfait.')],
    'Memorise the pair as a fixed rhythm: si + imparfait → conditionnel.',
  ),
  'subjunctive-basic-b1': g(
    ['Recognise frequent subjunctive triggers.', 'Form common present subjunctive verbs.', 'Use the mood after que when appropriate.'],
    ['Frequent triggers express necessity, desire, emotion, doubt, or purpose: il faut que, je veux que, bien que, pour que.', 'For many verbs, use the ils present stem minus -ent plus -e, -es, -e, -ions, -iez, -ent.', 'Learn frequent irregular forms first: sois, aie, fasse, puisse, sache, vienne.'],
    [m('Il faut que tu viens.', 'Il faut que tu viennes.', 'Il faut que triggers the subjunctive.'), m('Je veux que vous faites attention.', 'Je veux que vous fassiez attention.', 'Faire has the irregular subjunctive fass-.')],
    'Underline the trigger phrase before conjugating the second verb.',
  ),
  'double-pronouns-b1': g(
    ['Use two object pronouns together.', 'Follow the fixed pronoun order.', 'Place pronouns correctly in negative sentences.'],
    ['A useful order is: me/te/se/nous/vous → le/la/les → lui/leur → y → en.', 'Place both pronouns before the conjugated verb: Je le lui donne.', 'In negative sentences, keep the pronoun group before the verb: Je ne le lui donne pas.'],
    [m('Je lui le donne.', 'Je le lui donne.', 'Le/la/les come before lui/leur.'), m('Je donne le lui.', 'Je le lui donne.', 'Pronouns precede the conjugated verb.')],
    'Write the pronoun-order line on a card and refer to it while practising.',
  ),
  'dont-ce-qui-ce-que-b1': g(
    ['Use dont for de phrases.', 'Use ce qui and ce que without an antecedent.', 'Choose the form by grammatical role.'],
    ['Use dont when the original expression contains de: avoir besoin de → ce dont j’ai besoin.', 'Use ce qui when “what” is the subject of the next verb.', 'Use ce que when “what” is the direct object of the next verb.'],
    [m('Ce que me plaît', 'Ce qui me plaît', 'The missing element is the subject of plaît.'), m('Le sujet que je parle', 'Le sujet dont je parle', 'Parler de requires dont.')],
    'Reconstruct the verb phrase: de phrase → dont; missing subject → ce qui; missing object → ce que.',
  ),
  'advanced-negation-b1': g(
    ['Combine richer negative expressions.', 'Use ne…que for restriction.', 'Handle ni…ni and aucun correctly.'],
    ['Ne…que means only, not a full negative: Elle ne boit que de l’eau.', 'Use ni…ni to reject two alternatives: Il ne mange ni viande ni poisson.', 'Use aucun or aucune with a matching noun: Je n’ai aucune idée.'],
    [m('Je bois seulement que de l’eau.', 'Je ne bois que de l’eau.', 'Use ne…que for restriction.'), m('Je n’ai pas aucune idée.', 'Je n’ai aucune idée.', 'Avoid stacking pas with aucun in standard French.')],
    'Separate full negation from restriction: ne…que means “only”.',
  ),
  'connectors-cause-consequence-b1': g(
    ['Link ideas logically.', 'Distinguish cause, consequence, and contrast.', 'Improve writing coherence.'],
    ['Use parce que or puisque for a reason.', 'Use donc or c’est pourquoi for a result.', 'Use cependant, pourtant, or en revanche for contrast.'],
    [m('Il pleut cependant je prends un parapluie.', 'Il pleut, donc je prends un parapluie.', 'The second idea is a consequence.'), m('C’est pratique parce que c’est cher.', 'C’est pratique, mais c’est cher.', 'Use contrast when the ideas oppose each other.')],
    'Before choosing a connector, label the relationship: reason, result, or contrast.',
  ),
  'reported-speech-past-b1': g(
    ['Report past statements clearly.', 'Use basic tense shifts.', 'Distinguish direct and indirect speech.'],
    ['After a past reporting verb, a present idea often shifts to imparfait: Elle a dit qu’elle était malade.', 'A completed past event can shift to plus-que-parfait: Il a expliqué qu’il avait perdu son billet.', 'A future idea can shift to conditional: Elle a dit qu’elle viendrait.'],
    [m('Elle a dit qu’elle est malade hier.', 'Elle a dit qu’elle était malade.', 'Shift present to imparfait after a past report.'), m('Il a dit qu’il viendra.', 'Il a dit qu’il viendrait.', 'Shift future to conditional in a past report.')],
    'Move one step back in time when the reporting verb is in the past.',
  ),
  'opinion-argument-b1': g(
    ['State an opinion clearly.', 'Support it with reasons and examples.', 'Organise a short argument.'],
    ['Introduce your view with à mon avis, selon moi, or je pense que.', 'Develop reasons with parce que, puisque, d’une part, and d’autre part.', 'Add nuance or contrast with cependant and en revanche, then conclude clearly.'],
    [m('Selon moi que les transports sont utiles.', 'Selon moi, les transports sont utiles.', 'Selon moi introduces a complete sentence without que.'), m('Je suis d’accord à cette idée.', 'Je suis d’accord avec cette idée.', 'Être d’accord takes avec.')],
    'Use a four-step outline: opinion, reason, example, conclusion.',
  ),
  'conditional': g(
    ['Use the conditional beyond polite requests.', 'Form regular and irregular stems.', 'Express advice, wishes, and hypotheses.'],
    ['Use the future stem plus imparfait endings: -ais, -ais, -ait, -ions, -iez, -aient.', 'Use it for politeness, advice, wishes, uncertainty, and hypothetical results.', 'Pair it with si + imparfait for an unreal situation.'],
    [m('Je voudrai un café.', 'Je voudrais un café.', 'A polite request uses conditional -ais.'), m('Si j’aurais le temps, je partirais.', 'Si j’avais le temps, je partirais.', 'Use imparfait after si.')],
    'Future stem plus imparfait ending is the core formula.',
  ),
  'subjunctive': g(
    ['Recognise common subjunctive contexts.', 'Use high-frequency forms.', 'Distinguish fact from attitude or necessity.'],
    ['The subjunctive often follows que after necessity, desire, emotion, doubt, purpose, or judgment.', 'A change of subject commonly appears between the two clauses.', 'Focus first on frequent chunks: il faut que, je veux que, bien que, pour que.'],
    [m('Il faut que tu es prêt.', 'Il faut que tu sois prêt.', 'Être becomes sois in the subjunctive.'), m('Je veux que vous venez.', 'Je veux que vous veniez.', 'Vouloir que triggers the subjunctive.')],
    'Learn trigger phrase and verb form together as a chunk.',
  ),
  'si-clauses': g(
    ['Distinguish real, hypothetical, and unreal-past conditions.', 'Pair tenses correctly.', 'Avoid future or conditional immediately after si.'],
    ['Use si + present → future for realistic future possibilities.', 'Use si + imparfait → conditional for unreal present or unlikely future situations.', 'Use si + plus-que-parfait → past conditional for unreal past situations.'],
    [m('Si tu viendras, je serai content.', 'Si tu viens, je serai content.', 'Use present after si for a real condition.'), m('Si j’aurais su, je serais venu.', 'Si j’avais su, je serais venu.', 'Use plus-que-parfait after si for an unreal past.')],
    'Never place future or conditional directly after si in the standard patterns.',
  ),
}

function fallbackGuide(topic: SkillTopic): GrammarLessonGuide {
  return {
    goals: [
      `Recognise when to use ${topic.titleEn}.`,
      `Apply the pattern accurately in a complete sentence.`,
      'Review the examples and create one personal example.',
    ],
    rules: [
      topic.explanationEn,
      `Use the examples as models: ${topic.examples.slice(0, 2).join(' · ')}`,
      'Check word order, agreement, and verb form before validating an answer.',
    ],
    commonMistakes: [
      m('Applying the rule without checking the full sentence.', 'Read the sentence once for meaning and once for grammar.', 'A second pass catches agreement and placement errors.'),
    ],
    memoryTip: `Say one example of ${topic.titleEn} aloud and adapt it to your own daily life.`,
  }
}

export function getGrammarGuide(topic: SkillTopic): GrammarLessonGuide {
  const specific = guides[topic.id]
  if (!specific) return fallbackGuide(topic)
  return {
    goals: specific.goals,
    rules: specific.rules,
    commonMistakes: specific.mistakes,
    memoryTip: specific.tip,
    quickReference: specific.reference,
  }
}

export function applyGrammarGuides(topics: SkillTopic[]) {
  topics.forEach((topic) => { topic.lessonGuide = getGrammarGuide(topic) })
}
