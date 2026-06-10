import type { Question } from './types'

type QRow = [
  topicId: string,
  type: Question['type'],
  promptEn: string,
  promptFr: string,
  choices: string[] | undefined,
  correctAnswer: string,
  explanationEn: string,
  explanationFr: string,
]

const rows: QRow[] = [
  ['articles-gender', 'multiple-choice', 'Choose the correct article: ___ table est petite.', 'Choisissez le bon article : ___ table est petite.', ['Le', 'La', 'Les', 'Un'], 'La', 'Table is feminine singular, so it takes la.', 'Table est féminin singulier, donc on utilise la.'],
  ['articles-gender', 'multiple-choice', 'Choose the correct article: ___ amis arrivent.', 'Choisissez le bon article : ___ amis arrivent.', ['Le', 'La', 'Les', 'Un'], 'Les', 'Amis is plural here, so the definite article is les.', 'Amis est au pluriel ici, donc l’article défini est les.'],

  ['present-er', 'fill', 'Complete: Vous ___ à Paris. (habiter)', 'Complétez : Vous ___ à Paris. (habiter)', undefined, 'habitez', 'Vous takes the -ez ending with regular -er verbs.', 'Avec vous, les verbes réguliers en -er prennent la terminaison -ez.'],
  ['present-er', 'multiple-choice', 'Choose the correct form: Nous ___ français.', 'Choisissez la bonne forme : Nous ___ français.', ['parlons', 'parlez', 'parlent', 'parle'], 'parlons', 'Nous parlons is the correct present form.', 'Nous parlons est la bonne forme au présent.'],

  ['etre-avoir', 'multiple-choice', 'Choose the correct form: Tu ___ en retard.', 'Choisissez la bonne forme : Tu ___ en retard.', ['es', 'as', 'est', 'avons'], 'es', 'Tu es is the correct form of être.', 'Tu es est la bonne forme du verbe être.'],
  ['etre-avoir', 'multiple-choice', 'Choose the correct form: Ils ___ un examen demain.', 'Choisissez la bonne forme : Ils ___ un examen demain.', ['ont', 'sont', 'avez', 'a'], 'ont', 'Ils ont is the correct plural form of avoir.', 'Ils ont est la bonne forme plurielle de avoir.'],

  ['questions', 'multiple-choice', 'Which question is formed correctly with est-ce que?', 'Quelle question est correctement formée avec est-ce que ?', ['Est-ce que tu habites ici ?', 'Est-ce tu habites ici ?', 'Tu habites est-ce que ici ?', 'Habites-tu est-ce que ?'], 'Est-ce que tu habites ici ?', 'Est-ce que comes before the normal subject + verb order.', 'Est-ce que se place avant l’ordre normal sujet + verbe.'],
  ['questions', 'multiple-choice', 'Choose the correct inverted question.', 'Choisissez la bonne question avec inversion.', ['Aime-tu le café ?', 'Tu aimes le café ?', 'Aimes-tu le café ?', 'Est-ce tu aimes le café ?'], 'Aimes-tu le café ?', 'With inversion, the verb comes before the subject and takes a hyphen.', 'Avec l’inversion, le verbe passe avant le sujet avec un trait d’union.'],

  ['subject-pronouns-a1', 'multiple-choice', 'Choose the pronoun: ___ sommes étudiants.', 'Choisissez le pronom : ___ sommes étudiants.', ['Je', 'Tu', 'Nous', 'Ils'], 'Nous', 'Sommes matches nous.', 'Sommes va avec nous.'],
  ['subject-pronouns-a1', 'multiple-choice', 'Choose the pronoun: ___ habite à Lyon.', 'Choisissez le pronom : ___ habite à Lyon.', ['Nous', 'Ils', 'Elle', 'Vous'], 'Elle', 'Habite is singular here, and elle is the suitable subject pronoun.', 'Habite est au singulier ici, et elle est le bon pronom sujet.'],

  ['tu-vous-a1', 'multiple-choice', 'Which form is polite when speaking to one person you do not know well?', 'Quelle forme est polie quand on parle à une seule personne que l’on ne connaît pas bien ?', ['tu', 'vous', 'on', 'ils'], 'vous', 'Vous is used for formal singular and for the plural.', 'Vous s’utilise pour le singulier formel et pour le pluriel.'],
  ['tu-vous-a1', 'multiple-choice', 'Choose the best sentence for a friend.', 'Choisissez la meilleure phrase pour un ami.', ['Vous allez bien, Paul ?', 'Tu vas bien, Paul ?', 'Ils vont bien, Paul ?', 'On va bien, Paul ?'], 'Tu vas bien, Paul ?', 'Tu is the normal informal form with a friend.', 'Tu est la forme informelle normale avec un ami.'],

  ['definite-articles-a1', 'multiple-choice', 'Choose: ___ enfants jouent dans le jardin.', 'Choisissez : ___ enfants jouent dans le jardin.', ['Le', 'La', 'Les', 'Une'], 'Les', 'Plural definite nouns take les.', 'Les noms définis au pluriel prennent les.'],
  ['definite-articles-a1', 'multiple-choice', 'Choose the correct phrase.', 'Choisissez le bon groupe nominal.', ['le voiture', 'la voiture', 'les voiture', 'un voiture'], 'la voiture', 'Voiture is feminine singular, so the definite article is la.', 'Voiture est féminin singulier, donc l’article défini est la.'],

  ['indefinite-articles-a1', 'multiple-choice', 'Choose: Je cherche ___ appartement.', 'Choisissez : Je cherche ___ appartement.', ['un', 'une', 'des', 'le'], 'un', 'Appartement is masculine singular, so use un.', 'Appartement est masculin singulier, donc on utilise un.'],
  ['indefinite-articles-a1', 'multiple-choice', 'Choose: Elle a ___ idées intéressantes.', 'Choisissez : Elle a ___ idées intéressantes.', ['un', 'une', 'des', 'les'], 'des', 'Idées is plural and indefinite here, so use des.', 'Idées est au pluriel et indéfini ici, donc on utilise des.'],

  ['plural-nouns-a1', 'multiple-choice', 'Choose the correct plural of un ami.', 'Choisissez le bon pluriel de un ami.', ['des amis', 'des ami', 'les amises', 'un amis'], 'des amis', 'Most nouns add -s in writing in the plural.', 'La plupart des noms prennent -s à l’écrit au pluriel.'],
  ['plural-nouns-a1', 'multiple-choice', 'Choose the correct plural form.', 'Choisissez la bonne forme au pluriel.', ['des ponts', 'des pont', 'des pontes', 'des pons'], 'des ponts', 'Pont becomes ponts in the plural.', 'Pont devient ponts au pluriel.'],

  ['adjective-agreement-a1', 'multiple-choice', 'Choose: une robe ___.', 'Choisissez : une robe ___.', ['noir', 'noire', 'noirs', 'noires'], 'noire', 'The adjective agrees with a feminine singular noun.', 'L’adjectif s’accorde avec un nom féminin singulier.'],
  ['adjective-agreement-a1', 'multiple-choice', 'Choose: des sacs ___.', 'Choisissez : des sacs ___.', ['noir', 'noire', 'noirs', 'noires'], 'noirs', 'The adjective agrees with a masculine plural noun.', 'L’adjectif s’accorde avec un nom masculin pluriel.'],

  ['adjective-position-a1', 'multiple-choice', 'Which phrase is natural?', 'Quelle expression est naturelle ?', ['une rouge voiture', 'une voiture rouge', 'une rouges voiture', 'rouge une voiture'], 'une voiture rouge', 'Most color adjectives come after the noun.', 'La plupart des adjectifs de couleur suivent le nom.'],
  ['adjective-position-a1', 'multiple-choice', 'Which phrase is natural with a short common adjective?', 'Quelle expression est naturelle avec un adjectif court fréquent ?', ['une femme belle', 'une belle femme', 'une femme belles', 'belle une femme'], 'une belle femme', 'Common adjectives like beau / belle often come before the noun.', 'Les adjectifs fréquents comme beau / belle se placent souvent avant le nom.'],

  ['present-aller-faire-a1', 'fill', 'Complete: Nous ___ du sport le samedi. (faire)', 'Complétez : Nous ___ du sport le samedi. (faire)', undefined, 'faisons', 'Nous faisons is the correct present form of faire.', 'Nous faisons est la bonne forme au présent de faire.'],
  ['present-aller-faire-a1', 'multiple-choice', 'Choose the correct sentence.', 'Choisissez la bonne phrase.', ['Je vais au marché.', 'Je va au marché.', 'Je vont au marché.', 'Je aller au marché.'], 'Je vais au marché.', 'Je vais is the correct form of aller.', 'Je vais est la bonne forme du verbe aller.'],

  ['regular-ir-re-a1', 'fill', 'Complete: Tu ___ le bus. (attendre)', 'Complétez : Tu ___ le bus. (attendre)', undefined, 'attends', 'Tu attends is the correct present form.', 'Tu attends est la bonne forme au présent.'],
  ['regular-ir-re-a1', 'fill', 'Complete: Nous ___ le dessert. (finir)', 'Complétez : Nous ___ le dessert. (finir)', undefined, 'finissons', 'Nous finissons uses the regular -ir pattern.', 'Nous finissons suit le modèle régulier des verbes en -ir.'],

  ['negation-ne-pas-a1', 'multiple-choice', 'Choose the correct negative sentence.', 'Choisissez la phrase négative correcte.', ['Je pas comprends.', 'Je ne comprends pas.', 'Ne je comprends pas.', 'Je comprends ne pas.'], 'Je ne comprends pas.', 'Ne and pas surround the conjugated verb.', 'Ne et pas entourent le verbe conjugué.'],
  ['negation-ne-pas-a1', 'multiple-choice', 'Choose the correct negative sentence with a vowel.', 'Choisissez la bonne phrase négative avec une voyelle.', ['Je ne aime pas le café.', 'Je n’aime pas le café.', 'Je pas aime le café.', 'Je n’aime le café pas.'], 'Je n’aime pas le café.', 'Before a vowel sound, ne becomes n’.', 'Devant un son voyelle, ne devient n’.'],

  ['c-est-il-est-a1', 'multiple-choice', 'Choose: ___ mon professeur.', 'Choisissez : ___ mon professeur.', ['Il est', 'C’est', 'Elle est', 'Ils sont'], 'C’est', 'C’est is used to identify a person or thing.', 'C’est s’utilise pour identifier une personne ou une chose.'],
  ['c-est-il-est-a1', 'multiple-choice', 'Choose the correct sentence.', 'Choisissez la phrase correcte.', ['Elle est médecin.', 'C’est médecin.', 'Elle est une médecin est.', 'C’est elle médecin.'], 'Elle est médecin.', 'Il / elle est is used directly with many professions.', 'Il / elle est s’emploie directement avec beaucoup de professions.'],

  ['possessive-adjectives-a1', 'multiple-choice', 'Choose: ___ sœur habite à Nice.', 'Choisissez : ___ sœur habite à Nice.', ['mon', 'ma', 'mes', 'son'], 'ma', 'Sœur is feminine singular, so ma is correct.', 'Sœur est féminin singulier, donc ma est correct.'],
  ['possessive-adjectives-a1', 'multiple-choice', 'Choose: ___ amis arrivent ce soir.', 'Choisissez : ___ amis arrivent ce soir.', ['mon', 'ma', 'mes', 'ton'], 'mes', 'Amis is plural, so use mes.', 'Amis est au pluriel, donc on utilise mes.'],

  ['demonstrative-adjectives-a1', 'multiple-choice', 'Choose: ___ homme est très gentil.', 'Choisissez : ___ homme est très gentil.', ['ce', 'cet', 'cette', 'ces'], 'cet', 'Cet is used before masculine singular nouns that begin with a vowel sound.', 'Cet s’emploie devant un nom masculin singulier qui commence par un son voyelle.'],
  ['demonstrative-adjectives-a1', 'multiple-choice', 'Choose: ___ valises sont lourdes.', 'Choisissez : ___ valises sont lourdes.', ['ce', 'cet', 'cette', 'ces'], 'ces', 'Ces is the plural demonstrative form.', 'Ces est la forme démonstrative du pluriel.'],

  ['numbers-time-a1', 'multiple-choice', 'Choose the correct sentence for 8:00.', 'Choisissez la phrase correcte pour 8 h.', ['Il est huit heures.', 'Il a huit heures.', 'Il est huit ans.', 'Nous sommes huit heures.'], 'Il est huit heures.', 'Clock time uses il est plus heure(s).', 'Pour l’heure, on utilise il est plus heure(s).'],
  ['numbers-time-a1', 'multiple-choice', 'Choose the correct date expression.', 'Choisissez la bonne expression de date.', ['le quinze juin', 'la quinze juin', 'les quinze juin', 'un quinze juin'], 'le quinze juin', 'Dates are said with the definite article le.', 'Les dates se disent avec l’article défini le.'],

  ['prepositions-place-a1', 'multiple-choice', 'Choose: Le livre est ___ la table.', 'Choisissez : Le livre est ___ la table.', ['sur', 'sous', 'devant', 'avec'], 'sur', 'Sur means on.', 'Sur signifie on.'],
  ['prepositions-place-a1', 'multiple-choice', 'Choose the correct sentence.', 'Choisissez la bonne phrase.', ['La chaise est à côté de la porte.', 'La chaise est côté à la porte.', 'La chaise est de côté la porte.', 'La chaise est avec la porte.'], 'La chaise est à côté de la porte.', 'À côté de means next to.', 'À côté de signifie next to.'],

  ['futur-proche-a1', 'fill', 'Complete: Je ___ étudier ce soir. (aller)', 'Complétez : Je ___ étudier ce soir. (aller)', undefined, 'vais', 'The futur proche uses aller in the present plus an infinitive.', 'Le futur proche utilise aller au présent plus un infinitif.'],
  ['futur-proche-a1', 'multiple-choice', 'Choose the correct near-future sentence.', 'Choisissez la phrase correcte au futur proche.', ['Nous allons manger au restaurant.', 'Nous allons mangeons au restaurant.', 'Nous allons mangé au restaurant.', 'Nous mangeons aller au restaurant.'], 'Nous allons manger au restaurant.', 'Aller stays conjugated and the second verb remains in the infinitive.', 'Aller reste conjugué et le deuxième verbe reste à l’infinitif.'],

  ['imperative-a1', 'multiple-choice', 'Which command is correct?', 'Quel ordre est correct ?', ['Écoutes !', 'Écoute !', 'Tu écoute !', 'Écoutes !'], 'Écoute !', 'The tu imperative of regular -er verbs usually drops the final -s.', 'À l’impératif tu des verbes en -er, on supprime généralement le -s final.'],
  ['imperative-a1', 'multiple-choice', 'Choose the correct command with vous.', 'Choisissez l’ordre correct avec vous.', ['Fermez la porte.', 'Fermer la porte.', 'Vous fermez la porte.', 'Fermes la porte.'], 'Fermez la porte.', 'The vous imperative keeps the present-tense form without the subject pronoun.', 'L’impératif avec vous reprend la forme du présent sans pronom sujet.'],

  ['il-y-a-a1', 'multiple-choice', 'Choose: There are two chairs in the room.', 'Choisissez : Il y a deux chaises dans la pièce.', ['Il est deux chaises dans la pièce.', 'Il y a deux chaises dans la pièce.', 'Il a deux chaises dans la pièce.', 'Y a il deux chaises dans la pièce.'], 'Il y a deux chaises dans la pièce.', 'Il y a means there is / there are.', 'Il y a signifie there is / there are.'],
  ['il-y-a-a1', 'multiple-choice', 'Choose the negative sentence.', 'Choisissez la phrase négative.', ['Il n’y a pas de bus aujourd’hui.', 'Il y n’a pas de bus aujourd’hui.', 'Il ne y a pas bus aujourd’hui.', 'Il n’a y pas de bus aujourd’hui.'], 'Il n’y a pas de bus aujourd’hui.', 'The negative form is il n’y a pas de ...', 'La forme négative est il n’y a pas de ...'],
]

export const curatedA1Questions: Question[] = rows.map(
  ([topicId, type, promptEn, promptFr, choices, correctAnswer, explanationEn, explanationFr], index) => ({
    id: `a1-curated-${topicId}-${index + 1}`,
    topicId,
    type,
    promptEn,
    promptFr,
    choices,
    correctAnswer,
    explanationEn,
    explanationFr,
  }),
)
