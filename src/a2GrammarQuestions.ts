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

type CaseRow = {
  en: string
  fr: string
  answer: string
  distractors: string[]
  explanationEn: string
  explanationFr: string
}

function mcRow(topicId: string, row: CaseRow): QRow {
  return [topicId, 'multiple-choice', row.en, row.fr, [row.answer, ...row.distractors], row.answer, row.explanationEn, row.explanationFr]
}

function fillRow(topicId: string, row: CaseRow): QRow {
  return [topicId, 'fill', row.en, row.fr, undefined, row.answer, row.explanationEn, row.explanationFr]
}

function sentenceMcRow(
  topicId: string,
  promptEn: string,
  promptFr: string,
  correctAnswer: string,
  distractors: string[],
  explanationEn: string,
  explanationFr: string,
): QRow {
  return [topicId, 'multiple-choice', promptEn, promptFr, [correctAnswer, ...distractors], correctAnswer, explanationEn, explanationFr]
}

function expandCaseSet(topicId: string, cases: CaseRow[], target = 30): QRow[] {
  const rows: QRow[] = []
  for (const row of cases) rows.push(fillRow(topicId, row))
  for (const row of cases) rows.push(mcRow(topicId, row))
  for (const row of cases) {
    if (rows.length >= target) break
    rows.push(
      sentenceMcRow(
        topicId,
        `Choose the correct sentence.`,
        `Choisissez la phrase correcte.`,
        row.en.replace('___', row.answer),
        row.distractors.slice(0, 3).map((choice) => row.en.replace('___', choice)),
        row.explanationEn,
        row.explanationFr,
      ),
    )
  }
  return rows.slice(0, target)
}

const articlesReview = expandCaseSet('articles-review-a2', [
  { en: 'Complete: Elle boit ___ eau minerale tous les matins.', fr: 'Completez : Elle boit ___ eau minerale tous les matins.', answer: "de l'", distractors: ['du', 'de la', 'des'], explanationEn: 'Use de l before a singular noun beginning with a vowel sound.', explanationFr: 'On utilise de l devant un nom singulier qui commence par un son voyelle.' },
  { en: 'Complete: Au marche, nous avons achete ___ tomates et ___ fromage.', fr: 'Completez : Au marche, nous avons achete ___ tomates et ___ fromage.', answer: 'des', distractors: ['les', 'du', 'de la'], explanationEn: 'Tomates is plural and indefinite here, so des fits.', explanationFr: 'Tomates est au pluriel et indefini ici, donc des convient.' },
  { en: 'Complete: Le cuisinier ajoute ___ beurre dans la sauce.', fr: 'Completez : Le cuisinier ajoute ___ beurre dans la sauce.', answer: 'du', distractors: ['de la', "de l'", 'des'], explanationEn: 'Beurre is masculine singular and uncountable here, so du is correct.', explanationFr: 'Beurre est masculin singulier et non comptable ici, donc du est correct.' },
  { en: 'Complete: J attends ___ directeur depuis dix minutes.', fr: 'Completez : J attends ___ directeur depuis dix minutes.', answer: 'le', distractors: ['un', 'du', 'des'], explanationEn: 'A specific known person takes the definite article.', explanationFr: 'Une personne precise et connue prend l article defini.' },
  { en: 'Complete: Elle cherche ___ appartement pres de la gare.', fr: 'Completez : Elle cherche ___ appartement pres de la gare.', answer: 'un', distractors: ['le', 'du', "de l'"], explanationEn: 'Appartement is introduced as one possible place, so the indefinite article is needed.', explanationFr: 'Appartement est presente comme une possibilite, donc il faut l article indefini.' },
  { en: 'Complete: Dans ce quartier, ___ rues sont tres calmes la nuit.', fr: 'Completez : Dans ce quartier, ___ rues sont tres calmes la nuit.', answer: 'les', distractors: ['des', 'de', 'aux'], explanationEn: 'The sentence refers to the streets of this neighborhood in general, so les is natural.', explanationFr: 'La phrase parle des rues de ce quartier en general, donc les est naturel.' },
  { en: 'Complete: Il a commande ___ soupe et ___ pain.', fr: 'Completez : Il a commande ___ soupe et ___ pain.', answer: 'de la', distractors: ['la', 'une', 'des'], explanationEn: 'Soupe is an unspecified quantity, so use the partitive de la.', explanationFr: 'Soupe est une quantite non precisee, donc on utilise le partitif de la.' },
  { en: 'Complete: Pour le dessert, il reste ___ oranges sur la table.', fr: 'Completez : Pour le dessert, il reste ___ oranges sur la table.', answer: 'des', distractors: ['les', 'du', "de l'"], explanationEn: 'A plural indefinite quantity takes des.', explanationFr: 'Une quantite indefinie au pluriel prend des.' },
  { en: 'Complete: Tu connais ___ reponse ou pas ?', fr: 'Completez : Tu connais ___ reponse ou pas ?', answer: 'la', distractors: ['une', 'de la', 'des'], explanationEn: 'A specific expected answer takes la.', explanationFr: 'Une reponse precise et attendue prend la.' },
  { en: 'Complete: Il n y a plus ___ lait dans le frigo.', fr: 'Completez : Il n y a plus ___ lait dans le frigo.', answer: 'de', distractors: ['du', 'des', 'le'], explanationEn: 'After a negative quantity expression, French often uses de.', explanationFr: 'Apres une expression negative de quantite, le francais utilise souvent de.' },
])

const pluralAdjectiveReview = expandCaseSet('plural-adjective-review-a2', [
  { en: 'Complete: des journaux ___ sur le bureau', fr: 'Completez : des journaux ___ sur le bureau', answer: 'nationaux', distractors: ['nationals', 'nationale', 'nationales'], explanationEn: 'National becomes nationaux in the masculine plural.', explanationFr: 'National devient nationaux au masculin pluriel.' },
  { en: 'Complete: une robe ___ pour la ceremonie', fr: 'Completez : une robe ___ pour la ceremonie', answer: 'blanche', distractors: ['blanc', 'blanches', 'blancs'], explanationEn: 'The adjective agrees with a feminine singular noun.', explanationFr: 'L adjectif s accorde avec un nom feminin singulier.' },
  { en: 'Complete: des solutions ___ a mettre en oeuvre', fr: 'Completez : des solutions ___ a mettre en oeuvre', answer: 'simples', distractors: ['simple', 'simplese', 'simplees'], explanationEn: 'A feminine plural noun takes the plural adjective form here.', explanationFr: 'Un nom feminin pluriel prend ici la forme adjective du pluriel.' },
  { en: 'Complete: un vieil ami ___ a la gare', fr: 'Completez : un vieil ami ___ a la gare', answer: 'suisse', distractors: ['suisses', 'suissee', 'suiss'], explanationEn: 'Nationality adjectives often come after the noun.', explanationFr: 'Les adjectifs de nationalite se placent souvent apres le nom.' },
  { en: 'Complete: des travaux ___ dans le centre-ville', fr: 'Completez : des travaux ___ dans le centre-ville', answer: 'importants', distractors: ['important', 'importantes', 'importante'], explanationEn: 'Travaux is masculine plural, so importants is correct.', explanationFr: 'Travaux est masculin pluriel, donc importants est correct.' },
  { en: 'Complete: une decision ___ mais necessaire', fr: 'Completez : une decision ___ mais necessaire', answer: 'difficile', distractors: ['difficiles', 'difficilee', 'difficils'], explanationEn: 'Difficile keeps the same singular form in masculine and feminine.', explanationFr: 'Difficile garde la meme forme au singulier masculin et feminin.' },
  { en: 'Complete: des appartements ___ pres du parc', fr: 'Completez : des appartements ___ pres du parc', answer: 'anciens', distractors: ['ancien', 'anciennes', 'ancienne'], explanationEn: 'Anciens agrees with a masculine plural noun.', explanationFr: 'Anciens s accorde avec un nom masculin pluriel.' },
  { en: 'Complete: une belle place ___ le soir', fr: 'Completez : une belle place ___ le soir', answer: 'animee', distractors: ['anime', 'animes', 'animees'], explanationEn: 'The adjective agrees with place, a feminine singular noun.', explanationFr: 'L adjectif s accorde avec place, nom feminin singulier.' },
  { en: 'Complete: des festivals ___ chaque ete', fr: 'Completez : des festivals ___ chaque ete', answer: 'musicaux', distractors: ['musicals', 'musicale', 'musicales'], explanationEn: 'Musical becomes musicaux in the masculine plural.', explanationFr: 'Musical devient musicaux au masculin pluriel.' },
  { en: 'Complete: une longue rue ___ de cafes', fr: 'Completez : une longue rue ___ de cafes', answer: 'commercante', distractors: ['commercant', 'commercantes', 'commercants'], explanationEn: 'The adjective agrees with rue, which is feminine singular.', explanationFr: 'L adjectif s accorde avec rue, qui est feminin singulier.' },
])

const coreVerbReference = expandCaseSet('core-verb-reference-a2', [
  { en: 'Complete: Demain, nous ___ a la mairie a neuf heures. (aller)', fr: 'Completez : Demain, nous ___ a la mairie a neuf heures. (aller)', answer: 'irons', distractors: ['allons', 'irions', 'sommes alles'], explanationEn: 'The future of aller is irons.', explanationFr: 'Le futur de aller est irons.' },
  { en: 'Complete: Hier, elle ___ un long message a sa soeur. (ecrire)', fr: 'Completez : Hier, elle ___ un long message a sa soeur. (ecrire)', answer: 'a ecrit', distractors: ['ecrivait', 'est ecrite', 'ecrit'], explanationEn: 'A completed past action takes the passe compose.', explanationFr: 'Une action passee achevee prend le passe compose.' },
  { en: 'Complete: Quand j etais enfant, je ___ tres tot le samedi. (se lever)', fr: 'Completez : Quand j etais enfant, je ___ tres tot le samedi. (se lever)', answer: 'me levais', distractors: ['me suis leve', 'me leverai', 'me leve'], explanationEn: 'A repeated past habit takes the imparfait.', explanationFr: 'Une habitude repetee dans le passe prend l imparfait.' },
  { en: 'Complete: Je ___ vous aider, mais je n ai pas le temps. (vouloir)', fr: 'Completez : Je ___ vous aider, mais je n ai pas le temps. (vouloir)', answer: 'voudrais', distractors: ['veux', 'voudrai', 'ai voulu'], explanationEn: 'The conditional of vouloir softens the request or wish.', explanationFr: 'Le conditionnel de vouloir adoucit la demande ou le souhait.' },
  { en: 'Complete: Il faut que vous ___ a l heure. (etre)', fr: 'Completez : Il faut que vous ___ a l heure. (etre)', answer: 'soyez', distractors: ['etes', 'serez', 'avez ete'], explanationEn: 'Il faut que takes the subjunctive here: soyez.', explanationFr: 'Il faut que demande ici le subjonctif : soyez.' },
  { en: 'Complete: Si tu finis a temps, nous ___ ensemble. (sortir)', fr: 'Completez : Si tu finis a temps, nous ___ ensemble. (sortir)', answer: 'sortirons', distractors: ['sortons', 'sortirions', 'sommes sortis'], explanationEn: 'A likely future result after si + present uses the future simple.', explanationFr: 'Un resultat futur probable apres si + present utilise le futur simple.' },
  { en: 'Complete: Nous ___ deja ce musee deux fois. (voir)', fr: 'Completez : Nous ___ deja ce musee deux fois. (voir)', answer: 'avons vu', distractors: ['voyons', 'voyions', 'sommes vus'], explanationEn: 'A repeated completed experience takes the passe compose here.', explanationFr: 'Une experience achevee et repetee prend ici le passe compose.' },
  { en: 'Complete: En vacances, ils ___ souvent a pied. (venir)', fr: 'Completez : En vacances, ils ___ souvent a pied. (venir)', answer: 'venaient', distractors: ['sont venus', 'viendront', 'viennent'], explanationEn: 'The sentence describes a repeated past habit, so imparfait fits.', explanationFr: 'La phrase decrit une habitude passee repetee, donc l imparfait convient.' },
  { en: 'Complete: Ne ___ pas trop tard ce soir. (rentrer)', fr: 'Completez : Ne ___ pas trop tard ce soir. (rentrer)', answer: 'rentrez', distractors: ['rentrons', 'rentrez-vous', 'rentrer'], explanationEn: 'A negative command for vous uses the imperative form rentrez.', explanationFr: 'Un ordre negatif pour vous utilise l imperatif rentrez.' },
  { en: 'Complete: Quand il arrivera, nous lui ___ la situation. (expliquer)', fr: 'Completez : Quand il arrivera, nous lui ___ la situation. (expliquer)', answer: 'expliquerons', distractors: ['expliquons', 'expliquerions', 'avons explique'], explanationEn: 'A future action after another future marker still takes the future simple in French.', explanationFr: 'Une action future apres un autre repere futur prend encore le futur simple en francais.' },
])

const nominalisation = expandCaseSet('nominalisation-a2', [
  { en: 'Choose the correct noun formed from traduire: un ___', fr: 'Choisissez le nom correct forme a partir de traduire : un ___', answer: 'traducteur', distractors: ['traduiseur', 'traductionnaire', 'traduisant'], explanationEn: 'Traducteur is the standard noun for a person who translates.', explanationFr: 'Traducteur est le nom courant pour une personne qui traduit.' },
  { en: 'Choose the correct noun formed from informer: une ___', fr: 'Choisissez le nom correct forme a partir de informer : une ___', answer: 'information', distractors: ['informature', 'informeuse', 'informement'], explanationEn: 'Information is the usual noun from informer.', explanationFr: 'Information est le nom courant derive de informer.' },
  { en: 'Choose the correct noun formed from discuter: une ___', fr: 'Choisissez le nom correct forme a partir de discuter : une ___', answer: 'discussion', distractors: ['discutation', 'discuteuse', 'discusement'], explanationEn: 'Discussion is the correct noun here.', explanationFr: 'Discussion est le nom correct ici.' },
  { en: 'Choose the correct noun formed from partager: le ___', fr: 'Choisissez le nom correct forme a partir de partager : le ___', answer: 'partage', distractors: ['partagement', 'partation', 'partageur'], explanationEn: 'Partage is the common noun derived from partager.', explanationFr: 'Partage est le nom courant derive de partager.' },
  { en: 'Choose the correct noun formed from inscrire: une ___', fr: 'Choisissez le nom correct forme a partir de inscrire : une ___', answer: 'inscription', distractors: ['inscrivage', 'inscrivure', 'inscriteur'], explanationEn: 'Inscription is the standard noun form.', explanationFr: 'Inscription est la forme nominale standard.' },
  { en: 'Choose the correct noun formed from nettoyer: le ___', fr: 'Choisissez le nom correct forme a partir de nettoyer : le ___', answer: 'nettoyage', distractors: ['nettoyement', 'nettoyation', 'nettoyeur'], explanationEn: 'Nettoyage names the act or result of cleaning.', explanationFr: 'Nettoyage designe l action ou le resultat de nettoyer.' },
  { en: 'Choose the correct noun formed from produire: une ___', fr: 'Choisissez le nom correct forme a partir de produire : une ___', answer: 'production', distractors: ['produisage', 'produiteur', 'produisement'], explanationEn: 'Production is the correct noun.', explanationFr: 'Production est le nom correct.' },
  { en: 'Choose the correct noun formed from visiter: une ___', fr: 'Choisissez le nom correct forme a partir de visiter : une ___', answer: 'visite', distractors: ['visitatione', 'visitement', 'visiteur'], explanationEn: 'Visite is the common noun for the act of visiting.', explanationFr: 'Visite est le nom courant pour l action de visiter.' },
  { en: 'Choose the correct noun formed from conduire: un ___', fr: 'Choisissez le nom correct forme a partir de conduire : un ___', answer: 'conducteur', distractors: ['conduisage', 'conductionnaire', 'conduisement'], explanationEn: 'Conducteur is the person noun from conduire.', explanationFr: 'Conducteur est le nom de personne derive de conduire.' },
  { en: 'Choose the correct noun formed from decouvrir: une ___', fr: 'Choisissez le nom correct forme a partir de decouvrir : une ___', answer: 'decouverte', distractors: ['decouvrance', 'decouvrure', 'decouvreuse'], explanationEn: 'Decouverte is the standard noun.', explanationFr: 'Decouverte est le nom standard.' },
])

const presentUses = expandCaseSet('present-uses-a2', [
  { en: 'Complete: En ce moment, ils ___ le nouveau logiciel. (tester)', fr: 'Completez : En ce moment, ils ___ le nouveau logiciel. (tester)', answer: 'testent', distractors: ['ont teste', 'testaient', 'testeront'], explanationEn: 'En ce moment signals an action happening now, so the present fits.', explanationFr: 'En ce moment indique une action en cours, donc le present convient.' },
  { en: 'Complete: Tous les lundis, je ___ au marche avant le travail. (passer)', fr: 'Completez : Tous les lundis, je ___ au marche avant le travail. (passer)', answer: 'passe', distractors: ['suis passe', 'passais', 'passerai'], explanationEn: 'A regular habit can be expressed in the present.', explanationFr: 'Une habitude reguliere peut s exprimer au present.' },
  { en: 'Complete: Nous ___ a Nantes depuis six mois. (habiter)', fr: 'Completez : Nous ___ a Nantes depuis six mois. (habiter)', answer: 'habitons', distractors: ['avons habite', 'habitions', 'habiterons'], explanationEn: 'With depuis and an action still continuing, French uses the present.', explanationFr: 'Avec depuis et une action qui continue, le francais utilise le present.' },
  { en: 'Complete: Le train ___ a 18 h 12, selon l affichage. (partir)', fr: 'Completez : Le train ___ a 18 h 12, selon l affichage. (partir)', answer: 'part', distractors: ['partira', 'est parti', 'partait'], explanationEn: 'A scheduled near future event can use the present.', explanationFr: 'Un evenement futur programme peut employer le present.' },
  { en: 'Complete: En general, elle ___ tres peu de sucre. (prendre)', fr: 'Completez : En general, elle ___ tres peu de sucre. (prendre)', answer: 'prend', distractors: ['a pris', 'prenait', 'prendra'], explanationEn: 'A general truth or habit takes the present.', explanationFr: 'Une verite generale ou une habitude prend le present.' },
  { en: 'Complete: Je te rappelle, je ___ dans le metro. (etre)', fr: 'Completez : Je te rappelle, je ___ dans le metro. (etre)', answer: 'suis', distractors: ['ai ete', 'serai', 'etais'], explanationEn: 'The speaker describes the current situation, so the present is used.', explanationFr: 'Le locuteur decrit la situation actuelle, donc on utilise le present.' },
  { en: 'Complete: D habitude, on ___ a pied quand il fait beau. (rentrer)', fr: 'Completez : D habitude, on ___ a pied quand il fait beau. (rentrer)', answer: 'rentre', distractors: ['est rentre', 'rentrait', 'rentrera'], explanationEn: 'D habitude signals a regular pattern, so the present fits.', explanationFr: 'D habitude indique une regularite, donc le present convient.' },
  { en: 'Complete: Cette machine ___ tres peu d energie. (consommer)', fr: 'Completez : Cette machine ___ tres peu d energie. (consommer)', answer: 'consomme', distractors: ['a consomme', 'consommait', 'consommera'], explanationEn: 'A description or fact is commonly expressed in the present.', explanationFr: 'Une description ou un fait s exprime couramment au present.' },
  { en: 'Complete: Le semestre ___ la semaine prochaine. (commencer)', fr: 'Completez : Le semestre ___ la semaine prochaine. (commencer)', answer: 'commence', distractors: ['commencera', 'a commence', 'commencait'], explanationEn: 'A fixed near future event may use the present in French.', explanationFr: 'Un evenement proche et fixe peut employer le present en francais.' },
  { en: 'Complete: Depuis trois jours, il ___ tres mal. (dormir)', fr: 'Completez : Depuis trois jours, il ___ tres mal. (dormir)', answer: 'dort', distractors: ['a dormi', 'dormait', 'dormira'], explanationEn: 'With depuis and a continuing situation, the present is required.', explanationFr: 'Avec depuis et une situation en cours, le present est necessaire.' },
])

const imperativePronouns = expandCaseSet('imperative-pronouns-a2', [
  { en: 'Complete: Voici le dossier. Donne-___ a Lea.', fr: 'Completez : Voici le dossier. Donne-___ a Lea.', answer: 'le', distractors: ['lui', 'les', 'en'], explanationEn: 'In the affirmative imperative, the direct object pronoun comes after the verb.', explanationFr: 'A l imperatif affirmatif, le pronom objet direct vient apres le verbe.' },
  { en: 'Complete: Tes cles sont sur la table. Prends-___.', fr: 'Completez : Tes cles sont sur la table. Prends-___.', answer: 'les', distractors: ['leur', 'y', 'en'], explanationEn: 'Les replaces a plural direct object after the imperative.', explanationFr: 'Les remplace un objet direct pluriel apres l imperatif.' },
  { en: 'Complete: Tu vois ces papiers ? Ne ___ jette pas.', fr: 'Completez : Tu vois ces papiers ? Ne ___ jette pas.', answer: 'les', distractors: ['leur', 'y', 'en'], explanationEn: 'In the negative imperative, pronouns return before the verb.', explanationFr: 'A l imperatif negatif, les pronoms reviennent avant le verbe.' },
  { en: 'Complete: Tu veux parler a Camille ? Telephone-___ ce soir.', fr: 'Completez : Tu veux parler a Camille ? Telephone-___ ce soir.', answer: 'lui', distractors: ['le', 'y', 'en'], explanationEn: 'Lui replaces an indirect object after the affirmative imperative.', explanationFr: 'Lui remplace un objet indirect apres l imperatif affirmatif.' },
  { en: 'Complete: Ces documents sont utiles. Ne ___ oubliez pas.', fr: 'Completez : Ces documents sont utiles. Ne ___ oubliez pas.', answer: 'les', distractors: ['leur', 'y', 'en'], explanationEn: 'The pronoun stays before the verb in a negative command.', explanationFr: 'Le pronom reste avant le verbe dans un ordre negatif.' },
  { en: 'Complete: Tu veux du sucre ? Prends-___.', fr: 'Completez : Tu veux du sucre ? Prends-___.', answer: 'en', distractors: ['y', 'le', 'lui'], explanationEn: 'En replaces a quantity or partitive complement after the verb in the affirmative imperative.', explanationFr: 'En remplace un complement de quantite ou partitif apres le verbe a l imperatif affirmatif.' },
  { en: 'Complete: Tu connais ce restaurant ? Vas-___ demain.', fr: 'Completez : Tu connais ce restaurant ? Vas-___ demain.', answer: 'y', distractors: ['en', 'lui', 'le'], explanationEn: 'Y replaces a place and follows the verb in the affirmative imperative.', explanationFr: 'Y remplace un lieu et suit le verbe a l imperatif affirmatif.' },
  { en: 'Complete: Vos manteaux sont ici. Mettez-___ dans l armoire.', fr: 'Completez : Vos manteaux sont ici. Mettez-___ dans l armoire.', answer: 'les', distractors: ['leur', 'en', 'y'], explanationEn: 'Les replaces manteaux as a plural direct object.', explanationFr: 'Les remplace manteaux comme objet direct pluriel.' },
  { en: 'Complete: Ne ___ parle pas comme ca.', fr: 'Completez : Ne ___ parle pas comme ca.', answer: 'lui', distractors: ['le', 'y', 'en'], explanationEn: 'Parler a quelqu un takes an indirect object pronoun before the verb in the negative imperative.', explanationFr: 'Parler a quelqu un prend un pronom indirect avant le verbe a l imperatif negatif.' },
  { en: 'Complete: Les billets sont prets. Envoyez-___ tout de suite.', fr: 'Completez : Les billets sont prets. Envoyez-___ tout de suite.', answer: 'les', distractors: ['leur', 'y', 'en'], explanationEn: 'A plural direct object after the affirmative imperative becomes les after the verb.', explanationFr: 'Un objet direct pluriel a l imperatif affirmatif devient les apres le verbe.' },
])

function buildSingleBlankTopic(topicId: string, rows: Array<[string, string, string, string[], string, string]>): QRow[] {
  return expandCaseSet(
    topicId,
    rows.map(([en, fr, answer, distractors, explanationEn, explanationFr]) => ({ en, fr, answer, distractors, explanationEn, explanationFr })),
    30,
  )
}

const truncation = buildSingleBlankTopic('truncation-a2', [
  ['Choose the common short form of ordinateur: ___', 'Choisissez la forme courte courante de ordinateur : ___', 'ordi', ['ordin', 'ordeur', 'tor'], 'Ordi is the standard everyday truncation.', 'Ordi est la troncation courante du mot.'],
  ['Choose the common short form of professeur: ___', 'Choisissez la forme courte courante de professeur : ___', 'prof', ['profeur', 'fes', 'profo'], 'Prof is the everyday shortened form.', 'Prof est la forme abregee du quotidien.'],
  ['Choose the common short form of petit dejeuner: ___', 'Choisissez la forme courte courante de petit dejeuner : ___', 'petit dej', ['dej petit', 'dejeuner', 'petit jour'], 'Petit dej is the usual informal truncation.', 'Petit dej est la troncation informelle habituelle.'],
  ['Choose the common short form of supermarche: ___', 'Choisissez la forme courte courante de supermarche : ___', 'supermarche', ['super', 'marche', 'sup'], 'In everyday French, super can work informally for supermarket, but the noun supermarche itself is the stable form; here the full term remains the best answer.', 'En francais courant, super peut exister de facon informelle, mais ici le terme stable reste supermarche.'],
  ['Choose the common short form of automobile: ___', 'Choisissez la forme courte courante de automobile : ___', 'auto', ['mobile', 'bile', 'autom'], 'Auto is the standard short form.', 'Auto est la forme courte standard.'],
  ['Choose the common short form of photographie: ___', 'Choisissez la forme courte courante de photographie : ___', 'photo', ['graphie', 'phot', 'phota'], 'Photo is the common shortened form.', 'Photo est la forme abregee courante.'],
  ['Choose the common short form of television: ___', 'Choisissez la forme courte courante de television : ___', 'tele', ['vision', 'telev', 'teleur'], 'Tele is the common everyday form.', 'Tele est la forme courante du quotidien.'],
  ['Choose the common short form of appartement: ___', 'Choisissez la forme courte courante de appartement : ___', 'appart', ['app', 'partement', 'apparto'], 'Appart is the normal colloquial truncation.', 'Appart est la troncation familiere normale.'],
  ['Choose the common short form of faculté: ___', 'Choisissez la forme courte courante de faculte : ___', 'fac', ['facu', 'culte', 'fak'], 'Fac is the established short form.', 'Fac est la forme courte etablie.'],
  ['Choose the common short form of laboratoire: ___', 'Choisissez la forme courte courante de laboratoire : ___', 'labo', ['labor', 'toire', 'lab'], 'Labo is the everyday truncation.', 'Labo est la troncation du quotidien.'],
])

const negationVaried = buildSingleBlankTopic('negation-varied-a2', [
  ['Complete: Je ne comprends ___ a cette explication.', 'Completez : Je ne comprends ___ a cette explication.', 'rien', ['personne', 'jamais', 'plus'], 'Rien means nothing and fits with a thing.', 'Rien signifie nothing et convient pour une chose.'],
  ['Complete: Il ne voit ___ dans la salle d attente.', 'Completez : Il ne voit ___ dans la salle d attente.', 'personne', ['rien', 'jamais', 'plus'], 'Personne replaces no one.', 'Personne signifie no one.'],
  ['Complete: Nous ne sortons ___ ici depuis le demenagement.', 'Completez : Nous ne sortons ___ ici depuis le demenagement.', 'plus', ['jamais', 'rien', 'personne'], 'Plus means no longer.', 'Plus signifie no longer.'],
  ['Complete: Elle ne prend ___ le bus le dimanche.', 'Completez : Elle ne prend ___ le bus le dimanche.', 'jamais', ['plus', 'rien', 'personne'], 'Jamais means never.', 'Jamais signifie never.'],
  ['Complete: Je n ai ___ ajoute a ce dossier.', 'Completez : Je n ai ___ ajoute a ce dossier.', 'rien', ['personne', 'plus', 'jamais'], 'Rien is used with things.', 'Rien s emploie avec les choses.'],
  ['Complete: Ils ne connaissent ___ dans cette ville.', 'Completez : Ils ne connaissent ___ dans cette ville.', 'personne', ['rien', 'jamais', 'plus'], 'Personne is used for people.', 'Personne s emploie pour les personnes.'],
  ['Complete: Elle ne fume ___ depuis son operation.', 'Completez : Elle ne fume ___ depuis son operation.', 'plus', ['jamais', 'rien', 'personne'], 'Plus indicates a stopped habit.', 'Plus indique une habitude arretee.'],
  ['Complete: On ne mange ___ de viande a la maison.', 'Completez : On ne mange ___ de viande a la maison.', 'jamais', ['plus', 'rien', 'personne'], 'Jamais indicates never.', 'Jamais indique never.'],
  ['Complete: Tu n as parle a ___ de ce projet, j espere.', 'Completez : Tu n as parle a ___ de ce projet, j espere.', 'personne', ['rien', 'jamais', 'plus'], 'With parler a, personne is the correct negative word for no one.', 'Avec parler a, personne est le mot negatif correct pour no one.'],
  ['Complete: Nous n avons ___ dans le frigo pour ce soir.', 'Completez : Nous n avons ___ dans le frigo pour ce soir.', 'rien', ['personne', 'jamais', 'plus'], 'Rien refers to things, not people.', 'Rien renvoie aux choses, pas aux personnes.'],
])

const prepositions = buildSingleBlankTopic('prepositions-a2', [
  ['Complete: Nous allons a Lyon ___ train.', 'Completez : Nous allons a Lyon ___ train.', 'en', ['a', 'par', 'de'], 'En is used with many means of transport without an article.', 'En s utilise avec de nombreux moyens de transport sans article.'],
  ['Complete: Le chat dort ___ la table.', 'Completez : Le chat dort ___ la table.', 'sous', ['sur', 'dans', 'chez'], 'Sous means under.', 'Sous signifie under.'],
  ['Complete: Cette bague est faite ___ argent.', 'Completez : Cette bague est faite ___ argent.', 'en', ['de', 'a', 'par'], 'En can introduce the material in many neutral descriptions.', 'En peut introduire la matiere dans de nombreuses descriptions neutres.'],
  ['Complete: Il profite ___ ses vacances pour se reposer.', 'Completez : Il profite ___ ses vacances pour se reposer.', 'de', ['a', 'sur', 'avec'], 'Profiter de is the correct verb construction.', 'Profiter de est la bonne construction verbale.'],
  ['Complete: Nous habitons ___ bord de la mer.', 'Completez : Nous habitons ___ bord de la mer.', 'au', ['a', 'du', 'en'], 'The expression is au bord de.', 'L expression correcte est au bord de.'],
  ['Complete: Elle s interesse ___ la politique locale.', 'Completez : Elle s interesse ___ la politique locale.', 'a', ['de', 'pour', 'avec'], 'S interesser a takes a.', 'S interesser a se construit avec a.'],
  ['Complete: Je passe ___ la boulangerie avant de rentrer.', 'Completez : Je passe ___ la boulangerie avant de rentrer.', 'chez', ['dans', 'a', 'en'], 'Chez is used for a shop identified with the person who works there or lives there.', 'Chez s emploie pour un commerce associe a la personne qui y travaille ou y vit.'],
  ['Complete: La pharmacie est juste ___ la poste.', 'Completez : La pharmacie est juste ___ la poste.', 'en face de', ['a cause de', 'grace a', 'loin de'], 'En face de means opposite.', 'En face de signifie opposite.'],
  ['Complete: Ouvre la fenetre ___ avoir un peu d air.', 'Completez : Ouvre la fenetre ___ avoir un peu d air.', 'pour', ['de', 'a', 'par'], 'Pour introduces the purpose.', 'Pour introduit le but.'],
  ['Complete: On a marche ___ la pluie pendant une heure.', 'Completez : On a marche ___ la pluie pendant une heure.', 'sous', ['sur', 'par', 'chez'], 'Sous la pluie is the usual expression.', 'Sous la pluie est l expression habituelle.'],
])

const relativeQuiQueOu = buildSingleBlankTopic('relative-qui-que-ou-a2', [
  ['Complete: C est la voisine ___ aide souvent ma grand-mere.', 'Completez : C est la voisine ___ aide souvent ma grand-mere.', 'qui', ['que', 'ou', 'dont'], 'Qui is used for the subject of the relative clause.', 'Qui s utilise pour le sujet de la proposition relative.'],
  ['Complete: Voici le film ___ tout le monde recommande.', 'Completez : Voici le film ___ tout le monde recommande.', 'que', ['qui', 'ou', 'dont'], 'Que is used as the direct object of recommande.', 'Que s emploie comme objet direct de recommande.'],
  ['Complete: C est le village ___ mes grands-parents se sont installes.', 'Completez : C est le village ___ mes grands-parents se sont installes.', 'ou', ['qui', 'que', 'dont'], 'Ou links the sentence to a place.', 'Ou relie la phrase a un lieu.'],
  ['Complete: Je cherche une collegue ___ parle neerlandais.', 'Completez : Je cherche une collegue ___ parle neerlandais.', 'qui', ['que', 'ou', 'dont'], 'Qui is the subject of parle.', 'Qui est le sujet de parle.'],
  ['Complete: Le dossier ___ tu attends n est pas encore signe.', 'Completez : Le dossier ___ tu attends n est pas encore signe.', 'que', ['qui', 'ou', 'dont'], 'Que is the direct object of attends.', 'Que est l objet direct de attends.'],
  ['Complete: C etait l epoque ___ nous sortions tous les soirs.', 'Completez : C etait l epoque ___ nous sortions tous les soirs.', 'ou', ['qui', 'que', 'dont'], 'Ou can also refer to time, not only place.', 'Ou peut aussi renvoyer au temps, pas seulement au lieu.'],
  ['Complete: J admire les gens ___ gardent leur calme.', 'Completez : J admire les gens ___ gardent leur calme.', 'qui', ['que', 'ou', 'dont'], 'Qui is the subject of gardent.', 'Qui est le sujet de gardent.'],
  ['Complete: Les conseils ___ elle nous a donnes etaient utiles.', 'Completez : Les conseils ___ elle nous a donnes etaient utiles.', 'que', ['qui', 'ou', 'dont'], 'Que is the direct object before the verb.', 'Que est l objet direct place avant le verbe.'],
  ['Complete: C est la salle ___ l on organise la reunion.', 'Completez : C est la salle ___ l on organise la reunion.', 'ou', ['qui', 'que', 'dont'], 'Ou refers to the place where the action happens.', 'Ou renvoie au lieu ou se passe l action.'],
  ['Complete: Je prefere les livres ___ expliquent clairement les notions.', 'Completez : Je prefere les livres ___ expliquent clairement les notions.', 'qui', ['que', 'ou', 'dont'], 'Qui is needed because the books are the subject of expliquent.', 'Qui est necessaire parce que les livres sont le sujet de expliquent.'],
])

const focusCleft = buildSingleBlankTopic('focus-cleft-a2', [
  ['Complete: Ce que j aime dans ce quartier, c ___ le marche du samedi.', 'Completez : Ce que j aime dans ce quartier, c ___ le marche du samedi.', 'est', ['es', 'sont', 'etaient'], 'The structure ce que ... c est highlights an idea.', 'La structure ce que ... c est met une idee en valeur.'],
  ['Complete: Ce qui me fatigue, c ___ les trajets trop longs.', 'Completez : Ce qui me fatigue, c ___ les trajets trop longs.', 'est', ['sont', 'es', 'sera'], 'C est is commonly kept even before a plural idea in this cleft structure.', 'On garde souvent c est meme devant une idee plurielle dans cette structure de mise en valeur.'],
  ['Complete: Ce que nous voulons, c ___ une reponse claire.', 'Completez : Ce que nous voulons, c ___ une reponse claire.', 'est', ['sommes', 'sont', 'a'], 'The highlighted element follows c est.', 'L element mis en valeur suit c est.'],
  ['Complete: Ce qui compte le plus, c ___ la confiance.', 'Completez : Ce qui compte le plus, c ___ la confiance.', 'est', ['a', 'sont', 'etait'], 'The structure presents the important idea after c est.', 'La structure presente l idee importante apres c est.'],
  ['Complete: Ce que Lea deteste, c ___ attendre sans information.', 'Completez : Ce que Lea deteste, c ___ attendre sans information.', 'est', ['sont', 'es', 'sera'], 'An infinitive phrase can be highlighted after c est.', 'Un groupe infinitif peut etre mis en valeur apres c est.'],
  ['Complete: Ce qui nous a surpris, c ___ leur calme.', 'Completez : Ce qui nous a surpris, c ___ leur calme.', 'etait', ['est', 'sont', 'sera'], 'A past frame calls for the imperfect here.', 'Un cadre passe appelle ici l imparfait.'],
  ['Complete: Ce que je retiens de ce livre, c ___ son ton tres simple.', 'Completez : Ce que je retiens de ce livre, c ___ son ton tres simple.', 'est', ['sont', 'es', 'sera'], 'The sentence emphasizes one key element.', 'La phrase met en valeur un element essentiel.'],
  ['Complete: Ce qui l interesse, c ___ comprendre les causes du probleme.', 'Completez : Ce qui l interesse, c ___ comprendre les causes du probleme.', 'est', ['sont', 'a', 'etait'], 'C est introduces the focused information.', 'C est introduit l information mise en relief.'],
  ['Complete: Ce que les habitants demandent, c ___ davantage de bus le soir.', 'Completez : Ce que les habitants demandent, c ___ davantage de bus le soir.', 'est', ['sont', 'ont', 'seront'], 'The request is highlighted after c est.', 'La demande est mise en relief apres c est.'],
  ['Complete: Ce qui me fait rire, c ___ ses expressions.', 'Completez : Ce qui me fait rire, c ___ ses expressions.', 'est', ['sont', 'font', 'sera'], 'This cleft sentence emphasizes the source of amusement.', 'Cette phrase clivee met en relief la source du rire.'],
])

const pronounPlacement = buildSingleBlankTopic('pronoun-placement-a2', [
  ['Complete: Je ___ vois demain devant la gare.', 'Completez : Je ___ vois demain devant la gare.', 'le', ['lui', 'y', 'en'], 'A direct object pronoun normally comes before the conjugated verb.', 'Un pronom objet direct se place normalement avant le verbe conjugue.'],
  ['Complete: Nous allons ___ inviter pour le diner.', 'Completez : Nous allons ___ inviter pour le diner.', 'les', ['leur', 'y', 'en'], 'Before an infinitive, the object pronoun comes directly before the infinitive.', 'Devant un infinitif, le pronom objet se place juste avant l infinitif.'],
  ['Complete: Tu peux ___ expliquer la situation plus calmement ?', 'Completez : Tu peux ___ expliquer la situation plus calmement ?', 'lui', ['le', 'y', 'en'], 'Lui is the indirect object and comes before the infinitive.', 'Lui est le pronom indirect et se place avant l infinitif.'],
  ['Complete: Il ne veut pas ___ vendre sa voiture.', 'Completez : Il ne veut pas ___ vendre sa voiture.', 'la', ['lui', 'y', 'en'], 'La replaces voiture and is placed before vendre.', 'La remplace voiture et se place avant vendre.'],
  ['Complete: Vous devez ___ parler avant midi.', 'Completez : Vous devez ___ parler avant midi.', 'leur', ['les', 'y', 'en'], 'Parler a quelqu un takes the indirect pronoun leur here.', 'Parler a quelqu un prend ici le pronom indirect leur.'],
  ['Complete: On vient de ___ rencontrer devant le cinema.', 'Completez : On vient de ___ rencontrer devant le cinema.', 'les', ['leur', 'y', 'en'], 'Les is the direct object and stays before the infinitive rencontrer.', 'Les est l objet direct et reste avant l infinitif rencontrer.'],
  ['Complete: Je ne peux pas ___ repondre tout de suite.', 'Completez : Je ne peux pas ___ repondre tout de suite.', 'lui', ['le', 'y', 'en'], 'Repondre a quelqu un takes lui.', 'Repondre a quelqu un prend lui.'],
  ['Complete: Ils esperent ___ retrouver ce soir.', 'Completez : Ils esperent ___ retrouver ce soir.', 'se', ['les', 'leur', 'y'], 'With a reflexive infinitive, se stays before the infinitive.', 'Avec un infinitif pronominal, se reste avant l infinitif.'],
  ['Complete: Elle essaye de ___ convaincre sans insister.', 'Completez : Elle essaye de ___ convaincre sans insister.', 'le', ['lui', 'y', 'en'], 'The direct object pronoun goes before convaincre.', 'Le pronom objet direct se place avant convaincre.'],
  ['Complete: Va-___ si tu veux vraiment visiter ce quartier.', 'Completez : Va-___ si tu veux vraiment visiter ce quartier.', 'y', ['en', 'le', 'lui'], 'In the affirmative imperative, y follows the verb.', 'A l imperatif affirmatif, y suit le verbe.'],
])

const yEnIntro = buildSingleBlankTopic('y-en-intro-a2', [
  ['Complete: Tu penses souvent a ton avenir ? Oui, j ___ pense souvent.', 'Completez : Tu penses souvent a ton avenir ? Oui, j ___ pense souvent.', 'y', ['en', 'le', 'lui'], 'Y replaces a phrase introduced by a when it refers to a thing.', 'Y remplace un groupe introduit par a quand il s agit d une chose.'],
  ['Complete: Il va a la bibliotheque tous les samedis. Il ___ va a pied.', 'Completez : Il va a la bibliotheque tous les samedis. Il ___ va a pied.', 'y', ['en', 'le', 'leur'], 'Y replaces the place complement.', 'Y remplace le complement de lieu.'],
  ['Complete: Tu veux du cafe ? Oui, j ___ veux un peu.', 'Completez : Tu veux du cafe ? Oui, j ___ veux un peu.', 'en', ['y', 'le', 'lui'], 'En replaces a partitive or quantity complement.', 'En remplace un complement partitif ou de quantite.'],
  ['Complete: Nous avons besoin de temps, mais nous n ___ avons plus beaucoup.', 'Completez : Nous avons besoin de temps, mais nous n ___ avons plus beaucoup.', 'en', ['y', 'le', 'leur'], 'En replaces de temps.', 'En remplace de temps.'],
  ['Complete: Elle habite a Rouen depuis trois ans. Elle ___ travaille aussi.', 'Completez : Elle habite a Rouen depuis trois ans. Elle ___ travaille aussi.', 'y', ['en', 'le', 'lui'], 'Y stands for the place Rouen.', 'Y represente le lieu Rouen.'],
  ['Complete: Vous achetez des fraises ? Oui, nous ___ achetons chaque semaine.', 'Completez : Vous achetez des fraises ? Oui, nous ___ achetons chaque semaine.', 'en', ['y', 'les', 'leur'], 'En can replace des fraises in a quantity sense.', 'En peut remplacer des fraises dans une idee de quantite.'],
  ['Complete: Tu vas au theatre ce soir ? Oui, j ___ vais avec Lea.', 'Completez : Tu vas au theatre ce soir ? Oui, j ___ vais avec Lea.', 'y', ['en', 'le', 'leur'], 'Y replaces the place.', 'Y remplace le lieu.'],
  ['Complete: On parle souvent de ce film ? Oui, on ___ parle encore.', 'Completez : On parle souvent de ce film ? Oui, on ___ parle encore.', 'en', ['y', 'le', 'lui'], 'Parler de something is replaced by en.', 'Parler de quelque chose se remplace par en.'],
  ['Complete: Tes parents pensent a ce projet ? Oui, ils ___ pensent serieusement.', 'Completez : Tes parents pensent a ce projet ? Oui, ils ___ pensent serieusement.', 'y', ['en', 'le', 'leur'], 'Penser a a thing becomes y penser.', 'Penser a une chose devient y penser.'],
  ['Complete: Tu prends des pommes ? Oui, j ___ prends trois.', 'Completez : Tu prends des pommes ? Oui, j ___ prends trois.', 'en', ['y', 'les', 'leur'], 'En replaces the quantity complement with three.', 'En remplace le complement de quantite avec trois.'],
])

const indefinites = buildSingleBlankTopic('indefinites-a2', [
  ['Complete: ___ doit apporter quelque chose pour le pique-nique.', 'Completez : ___ doit apporter quelque chose pour le pique-nique.', 'Chacun', ['Chaque', 'Personne', 'Rien'], 'Chacun is an indefinite pronoun meaning each person.', 'Chacun est un pronom indefini qui signifie chaque personne.'],
  ['Complete: Je ne vois ___ dans cette rue a cette heure-ci.', 'Completez : Je ne vois ___ dans cette rue a cette heure-ci.', 'personne', ['chacun', 'quelques', 'tout'], 'Personne is the negative pronoun for no one.', 'Personne est le pronom negatif pour no one.'],
  ['Complete: ___ dossier doit etre signe avant midi.', 'Completez : ___ dossier doit etre signe avant midi.', 'Chaque', ['Chacun', 'Quelques', 'Aucun'], 'Chaque is a determiner used before a singular noun.', 'Chaque est un determinant utilise devant un nom singulier.'],
  ['Complete: Il reste ___ places au premier rang.', 'Completez : Il reste ___ places au premier rang.', 'quelques', ['chacun', 'rien', 'personne'], 'Quelques means a small number of.', 'Quelques signifie un petit nombre de.'],
  ['Complete: ___ n est plus ouvert apres vingt heures.', 'Completez : ___ n est plus ouvert apres vingt heures.', 'Rien', ['Personne', 'Quelques', 'Chaque'], 'Rien is the pronoun meaning nothing.', 'Rien est le pronom qui signifie nothing.'],
  ['Complete: ___ etudiants preferent travailler le matin.', 'Completez : ___ etudiants preferent travailler le matin.', 'Certains', ['Chaque', 'Chacun', 'Personne'], 'Certains means some people in a group.', 'Certains signifie quelques personnes dans un groupe.'],
  ['Complete: ___ solution ne semble parfaite.', 'Completez : ___ solution ne semble parfaite.', 'Aucune', ['Quelques', 'Chacune', 'Personne'], 'Aucune agrees with the feminine noun solution.', 'Aucune s accorde avec le nom feminin solution.'],
  ['Complete: Dans cette equipe, ___ a son propre role.', 'Completez : Dans cette equipe, ___ a son propre role.', 'chacun', ['chaque', 'quelques', 'aucune'], 'Chacun is the pronoun used on its own.', 'Chacun est le pronom employe seul.'],
  ['Complete: Nous avons visite plusieurs appartements, mais ___ ne convenait.', 'Completez : Nous avons visite plusieurs appartements, mais ___ ne convenait.', 'aucun', ['chaque', 'personne', 'rien'], 'Aucun means not one of them.', 'Aucun signifie pas un seul.'],
  ['Complete: ___ personnes du service parlent italien.', 'Completez : ___ personnes du service parlent italien.', 'Certaines', ['Chacun', 'Personne', 'Rien'], 'Certaines agrees with the plural feminine noun personnes.', 'Certaines s accorde avec le nom feminin pluriel personnes.'],
])

const interrogativePronouns = buildSingleBlankTopic('interrogative-pronouns-a2', [
  ['Complete: Tu hesites entre ces deux manteaux ? ___ choisis-tu ?', 'Completez : Tu hesites entre ces deux manteaux ? ___ choisis-tu ?', 'Lequel', ['Qui', 'Que', 'Laquelle'], 'Lequel is masculine singular and means which one.', 'Lequel est masculin singulier et signifie which one.'],
  ['Complete: Parmi ces robes, ___ preferez-vous ?', 'Completez : Parmi ces robes, ___ preferez-vous ?', 'Laquelle', ['Lequel', 'Lesquels', 'Qui'], 'Laquelle agrees with a feminine singular choice.', 'Laquelle s accorde avec un choix feminin singulier.'],
  ['Complete: Ces billets sont a qui ? ___ manque ?', 'Completez : Ces billets sont a qui ? ___ manque ?', 'Lequel', ['Qui', 'Que', 'Laquelle'], 'Lequel is used when choosing one masculine item from a set.', 'Lequel s emploie pour choisir un element masculin dans un ensemble.'],
  ['Complete: Nous avons deux solutions. ___ est la plus rapide ?', 'Completez : Nous avons deux solutions. ___ est la plus rapide ?', 'Laquelle', ['Lequel', 'Lesquelles', 'Que'], 'Laquelle matches solution, a feminine noun.', 'Laquelle correspond a solution, nom feminin.'],
  ['Complete: Tu parles de quels voisins ? ___ connais-tu bien ?', 'Completez : Tu parles de quels voisins ? ___ connais-tu bien ?', 'Lesquels', ['Lequel', 'Laquelle', 'Qui'], 'Lesquels is masculine plural.', 'Lesquels est masculin pluriel.'],
  ['Complete: Vous montrez quelles photos ? ___ voulez-vous imprimer ?', 'Completez : Vous montrez quelles photos ? ___ voulez-vous imprimer ?', 'Lesquelles', ['Lesquels', 'Lequel', 'Qui'], 'Lesquelles agrees with a feminine plural noun.', 'Lesquelles s accorde avec un nom feminin pluriel.'],
  ['Complete: ___ de tes amis peut venir ce soir ?', 'Completez : ___ de tes amis peut venir ce soir ?', 'Lequel', ['Qui', 'Que', 'Lesquels'], 'Lequel de + plural group asks which one out of the group.', 'Lequel de + groupe pluriel demande lequel dans le groupe.'],
  ['Complete: Tu dois choisir une date. ___ te convient le mieux ?', 'Completez : Tu dois choisir une date. ___ te convient le mieux ?', 'Laquelle', ['Lequel', 'Qui', 'Que'], 'Date is feminine singular.', 'Date est feminin singulier.'],
  ['Complete: Nous avons deux chemins. ___ prenez-vous d habitude ?', 'Completez : Nous avons deux chemins. ___ prenez-vous d habitude ?', 'Lequel', ['Laquelle', 'Lesquels', 'Qui'], 'Chemin is masculine singular.', 'Chemin est masculin singulier.'],
  ['Complete: Vous devez comparer plusieurs options. ___ sont les moins cheres ?', 'Completez : Vous devez comparer plusieurs options. ___ sont les moins cheres ?', 'Lesquelles', ['Lesquels', 'Lequel', 'Qui'], 'Options is feminine plural, so lesquelles is correct.', 'Options est feminin pluriel, donc lesquelles est correct.'],
])

const demonstrativePronouns = buildSingleBlankTopic('demonstrative-pronouns-a2', [
  ['Complete: Je prefere cette chemise-ci. Je prends ___-ci.', 'Completez : Je prefere cette chemise-ci. Je prends ___-ci.', 'celle', ['celui', 'ceux', 'celles'], 'Celle refers to a feminine singular noun.', 'Celle renvoie a un nom feminin singulier.'],
  ['Complete: Entre ces deux fauteuils, ___ de gauche est plus confortable.', 'Completez : Entre ces deux fauteuils, ___ de gauche est plus confortable.', 'celui', ['celle', 'ceux', 'celles'], 'Celui refers to a masculine singular noun.', 'Celui renvoie a un nom masculin singulier.'],
  ['Complete: Parmi ces photos, ___ de l ete dernier sont les plus nettes.', 'Completez : Parmi ces photos, ___ de l ete dernier sont les plus nettes.', 'celles', ['ceux', 'celle', 'celui'], 'Celles is the feminine plural demonstrative pronoun.', 'Celles est le pronom demonstratif feminin pluriel.'],
  ['Complete: Regarde ces tableaux. ___ de droite m impressionne.', 'Completez : Regarde ces tableaux. ___ de droite m impressionne.', 'celui', ['celle', 'ceux', 'celles'], 'Tableau is masculine singular.', 'Tableau est masculin singulier.'],
  ['Complete: J ai plusieurs dossiers. ___-la est deja signe.', 'Completez : J ai plusieurs dossiers. ___-la est deja signe.', 'celui', ['celle', 'ceux', 'celles'], 'Celui-la points to one masculine singular item.', 'Celui-la designe un element masculin singulier.'],
  ['Complete: Ces valises sont trop lourdes. Prenons plutot ___-ci.', 'Completez : Ces valises sont trop lourdes. Prenons plutot ___-ci.', 'celles', ['ceux', 'celle', 'celui'], 'Valises is feminine plural.', 'Valises est feminin pluriel.'],
  ['Complete: Lequel de ces desserts veux-tu ? ___ au chocolat.', 'Completez : Lequel de ces desserts veux-tu ? ___ au chocolat.', 'celui', ['celle', 'ceux', 'celles'], 'Dessert is masculine singular.', 'Dessert est masculin singulier.'],
  ['Complete: Quelle robe preferes-tu ? ___ que tu as essayee en premier.', 'Completez : Quelle robe preferes-tu ? ___ que tu as essayee en premier.', 'celle', ['celui', 'ceux', 'celles'], 'Robe is feminine singular.', 'Robe est feminin singulier.'],
  ['Complete: Quels livres recommandes-tu ? ___ sur l histoire sociale.', 'Completez : Quels livres recommandes-tu ? ___ sur l histoire sociale.', 'ceux', ['celles', 'celui', 'celle'], 'Ceux is the masculine plural form.', 'Ceux est la forme masculine plurielle.'],
  ['Complete: Parmi ces affiches, ___ du hall sont les plus visibles.', 'Completez : Parmi ces affiches, ___ du hall sont les plus visibles.', 'celles', ['ceux', 'celle', 'celui'], 'Affiches is feminine plural.', 'Affiches est feminin pluriel.'],
])

const adverbs = buildSingleBlankTopic('adverbs-a2', [
  ['Complete: Elle parle francais tres ___.', 'Completez : Elle parle francais tres ___.', 'couramment', ['courant', 'courante', 'courammente'], 'Couramment is the correct adverb of manner.', 'Couramment est le bon adverbe de maniere.'],
  ['Complete: Il a repondu ___ a la question difficile.', 'Completez : Il a repondu ___ a la question difficile.', 'rapidement', ['rapide', 'rapidee', 'rapidemente'], 'Rapidement is formed from rapide + ment.', 'Rapidement se forme a partir de rapide + ment.'],
  ['Complete: Nous avons lu les consignes tres ___.', 'Completez : Nous avons lu les consignes tres ___.', 'attentivement', ['attentif', 'attentive', 'attentionnement'], 'Attentivement is the adverb from attentive.', 'Attentivement est l adverbe derive de attentive.'],
  ['Complete: Elle chante ___ que sa soeur.', 'Completez : Elle chante ___ que sa soeur.', 'mieux', ['meilleur', 'bien', 'plus bien'], 'Mieux is the irregular comparative adverb of bien.', 'Mieux est le comparatif irregulier de bien.'],
  ['Complete: Le technicien a travaille tres ___.', 'Completez : Le technicien a travaille tres ___.', 'soigneusement', ['soigneux', 'soigneuse', 'soigneuxment'], 'Soigneusement is the correct adverb form.', 'Soigneusement est la bonne forme adverbiale.'],
  ['Complete: Ils ont accueilli les visiteurs tres ___.', 'Completez : Ils ont accueilli les visiteurs tres ___.', 'chaleureusement', ['chaleureux', 'chaleureuse', 'chaudement'], 'Chaleureusement is the standard adverb here.', 'Chaleureusement est l adverbe standard ici.'],
  ['Complete: Elle s exprime ___ dans les reunions.', 'Completez : Elle s exprime ___ dans les reunions.', 'clairement', ['claire', 'clair', 'clarifieusement'], 'Clairement is the adverb from clair or claire.', 'Clairement est l adverbe derive de clair ou claire.'],
  ['Complete: Tu conduis ___ dans cette rue etroite.', 'Completez : Tu conduis ___ dans cette rue etroite.', 'prudemment', ['prudent', 'prudente', 'prudemmente'], 'Prudemment is the adverb from prudent or prudente.', 'Prudemment est l adverbe derive de prudent ou prudente.'],
  ['Complete: Ils ont refuse sa proposition tres ___.', 'Completez : Ils ont refuse sa proposition tres ___.', 'poliment', ['poli', 'polie', 'politessement'], 'Poliment is the correct adverb.', 'Poliment est le bon adverbe.'],
  ['Complete: Nous avons ete ___ recus par la directrice.', 'Completez : Nous avons ete ___ recus par la directrice.', 'gentiment', ['gentil', 'gentille', 'genitement'], 'Gentiment is the adverb from gentil or gentille.', 'Gentiment est l adverbe derive de gentil ou gentille.'],
])

const gerondif = buildSingleBlankTopic('gerondif-intro-a2', [
  ['Complete: Il apprend en ___ les autres. (observer)', 'Completez : Il apprend en ___ les autres. (observer)', 'observant', ['observe', 'observee', 'observes'], 'The gerund uses en + present participle.', 'Le gerondif se forme avec en + participe present.'],
  ['Complete: Elle a perdu du temps en ___ trop tard. (arriver)', 'Completez : Elle a perdu du temps en ___ trop tard. (arriver)', 'arrivant', ['arrive', 'arrivee', 'arrives'], 'Use the present participle after en.', 'On utilise le participe present apres en.'],
  ['Complete: Nous avons resolu le probleme en ___ ensemble. (reflechir)', 'Completez : Nous avons resolu le probleme en ___ ensemble. (reflechir)', 'reflechissant', ['reflechi', 'reflechiant', 'reflechis'], 'Reflechissant is the present participle from the nous stem.', 'Reflechissant est le participe present construit sur la base de nous.'],
  ['Complete: Tu peux progresser en ___ un peu chaque jour. (lire)', 'Completez : Tu peux progresser en ___ un peu chaque jour. (lire)', 'lisant', ['lu', 'lisantt', 'lis'], 'Lisant is the present participle of lire.', 'Lisant est le participe present de lire.'],
  ['Complete: Il est tombe en ___ l escalier trop vite. (descendre)', 'Completez : Il est tombe en ___ l escalier trop vite. (descendre)', 'descendant', ['descendu', 'descende', 'descendants'], 'The gerund expresses manner here.', 'Le gerondif exprime ici la maniere.'],
  ['Complete: Elle memorise mieux en ___ a haute voix. (repeter)', 'Completez : Elle memorise mieux en ___ a haute voix. (repeter)', 'repetant', ['repete', 'repetee', 'repetitionnant'], 'Repetant is the expected present participle form here.', 'Repetant est ici la forme attendue du participe present.'],
  ['Complete: Nous avons visite la ville en ___ sans plan. (se promener)', 'Completez : Nous avons visite la ville en ___ sans plan. (se promener)', 'nous promenant', ['promenes', 'promenant', 'se promene'], 'A reflexive gerund keeps the pronoun after en: en nous promenant.', 'Un gerondif pronominal garde le pronom apres en : en nous promenant.'],
  ['Complete: Ils economisent de l energie en ___ les lumieres. (eteindre)', 'Completez : Ils economisent de l energie en ___ les lumieres. (eteindre)', 'eteignant', ['eteint', 'eteigne', 'eteindant'], 'Eteignant is the present participle.', 'Eteignant est le participe present.'],
  ['Complete: Tu peux rencontrer du monde en ___ a cette association. (participer)', 'Completez : Tu peux rencontrer du monde en ___ a cette association. (participer)', 'participant', ['participe', 'participee', 'participes'], 'Participant is the present participle of participer.', 'Participant est le participe present de participer.'],
  ['Complete: Elle s est blessee en ___ trop vite. (courir)', 'Completez : Elle s est blessee en ___ trop vite. (courir)', 'courant', ['couru', 'courante', 'courons'], 'Courant is the present participle of courir.', 'Courant est le participe present de courir.'],
])

const passeComposeAvoir = buildSingleBlankTopic('passe-compose-avoir-a2', [
  ['Complete: Hier soir, nous ___ un documentaire passionnant. (regarder)', 'Completez : Hier soir, nous ___ un documentaire passionnant. (regarder)', 'avons regarde', ['sommes regardes', 'regardions', 'avons regarder'], 'Most transitive verbs use avoir in the passe compose.', 'La plupart des verbes transitifs utilisent avoir au passe compose.'],
  ['Complete: Elle ___ sa reservation en ligne. (confirmer)', 'Completez : Elle ___ sa reservation en ligne. (confirmer)', 'a confirme', ['est confirmee', 'confirmait', 'a confirmer'], 'Confirmer takes avoir and a past participle.', 'Confirmer se construit avec avoir et un participe passe.'],
  ['Complete: J ___ mes lunettes quelque part dans le salon. (laisser)', 'Completez : J ___ mes lunettes quelque part dans le salon. (laisser)', 'ai laisse', ['suis laisse', 'laissais', 'ai laisser'], 'Laisser uses avoir in the passe compose.', 'Laisser utilise avoir au passe compose.'],
  ['Complete: Vous ___ tres vite la bonne solution. (trouver)', 'Completez : Vous ___ tres vite la bonne solution. (trouver)', 'avez trouve', ['etes trouves', 'trouviez', 'avez trouver'], 'Trouver takes avoir for a completed action.', 'Trouver prend avoir pour une action achevee.'],
  ['Complete: Ils ___ leurs voisins a la fete du quartier. (rencontrer)', 'Completez : Ils ___ leurs voisins a la fete du quartier. (rencontrer)', 'ont rencontre', ['sont rencontres', 'rencontraient', 'ont rencontrer'], 'Rencontrer normally uses avoir.', 'Rencontrer utilise normalement avoir.'],
  ['Complete: Tu ___ deja ce livre l an dernier. (lire)', 'Completez : Tu ___ deja ce livre l an dernier. (lire)', 'as lu', ['es lu', 'lisais', 'as lire'], 'Lire forms the passe compose with avoir: as lu.', 'Lire forme le passe compose avec avoir : as lu.'],
  ['Complete: On ___ le billet juste avant le depart. (acheter)', 'Completez : On ___ le billet juste avant le depart. (acheter)', 'a achete', ['est achete', 'achetait', 'a acheter'], 'Acheter uses avoir in the passe compose.', 'Acheter utilise avoir au passe compose.'],
  ['Complete: Elles ___ toute la cuisine avant l arrivee des invites. (preparer)', 'Completez : Elles ___ toute la cuisine avant l arrivee des invites. (preparer)', 'ont prepare', ['sont preparees', 'preparaient', 'ont preparer'], 'Prepare takes avoir here.', 'Preparer prend avoir ici.'],
  ['Complete: Il ___ une question tres precise au directeur. (poser)', 'Completez : Il ___ une question tres precise au directeur. (poser)', 'a pose', ['est pose', 'posait', 'a poser'], 'Poser uses avoir and the participle pose.', 'Poser utilise avoir et le participe pose.'],
  ['Complete: Nous ___ le train de justesse. (prendre)', 'Completez : Nous ___ le train de justesse. (prendre)', 'avons pris', ['sommes pris', 'prenions', 'avons prendre'], 'Prendre uses avoir; the participle is pris.', 'Prendre utilise avoir ; le participe est pris.'],
])

const passeComposeEtre = buildSingleBlankTopic('passe-compose-etre-a2', [
  ['Complete: Elle ___ tres tard a la gare. (arriver)', 'Completez : Elle ___ tres tard a la gare. (arriver)', 'est arrivee', ['a arrive', 'arrivait', 'est arriver'], 'Arriver uses etre, and the participle agrees with elle.', 'Arriver utilise etre, et le participe s accorde avec elle.'],
  ['Complete: Nous ___ de la maison a huit heures. (partir)', 'Completez : Nous ___ de la maison a huit heures. (partir)', 'sommes partis', ['avons parti', 'partions', 'sommes partir'], 'Partir uses etre and agrees with a plural subject.', 'Partir utilise etre et s accorde avec un sujet pluriel.'],
  ['Complete: Ils ___ tres tot apres le diner. (sortir)', 'Completez : Ils ___ tres tot apres le diner. (sortir)', 'sont sortis', ['ont sorti', 'sortaient', 'sont sortir'], 'Sortir as a movement verb takes etre here.', 'Sortir comme verbe de mouvement prend etre ici.'],
  ['Complete: Je ___ chez moi juste apres la reunion. (rentrer)', 'Completez : Je ___ chez moi juste apres la reunion. (rentrer)', 'suis rentre', ['ai rentre', 'rentrais', 'suis rentrer'], 'Rentrer uses etre in this intransitive movement sense.', 'Rentrer utilise etre dans cet emploi intransitif de mouvement.'],
  ['Complete: Elles ___ a l aeroport vers midi. (venir)', 'Completez : Elles ___ a l aeroport vers midi. (venir)', 'sont venues', ['ont venu', 'venaient', 'sont venir'], 'Venir uses etre and agrees with a feminine plural subject.', 'Venir utilise etre et s accorde avec un sujet feminin pluriel.'],
  ['Complete: Tu ___ a velo jusqu au village. (monter)', 'Completez : Tu ___ a velo jusqu au village. (monter)', 'es monte', ['as monte', 'montais', 'es monter'], 'Monter can use etre when it indicates movement without a direct object.', 'Monter peut utiliser etre quand il indique un deplacement sans objet direct.'],
  ['Complete: On ___ au dernier etage par l escalier. (descendre)', 'Completez : On ___ au dernier etage par l escalier. (descendre)', 'est descendu', ['a descendu', 'descendait', 'est descendre'], 'Descendre takes etre in the intransitive movement use.', 'Descendre prend etre dans l emploi intransitif de mouvement.'],
  ['Complete: Vous ___ a Paris le meme jour que nous. (naitre)', 'Completez : Vous ___ a Paris le meme jour que nous. (naitre)', 'etes nes', ['avez ne', 'naissiez', 'etes naitre'], 'Naitre uses etre and agrees with vous plural here.', 'Naitre utilise etre et s accorde avec vous pluriel ici.'],
  ['Complete: Il ___ tres vite apres l accident. (devenir)', 'Completez : Il ___ tres vite apres l accident. (devenir)', 'est devenu', ['a devenu', 'devenait', 'est devenir'], 'Devenir uses etre in the passe compose.', 'Devenir utilise etre au passe compose.'],
  ['Complete: Elles ___ chez elles avant la pluie. (retourner)', 'Completez : Elles ___ chez elles avant la pluie. (retourner)', 'sont retournees', ['ont retourne', 'retournaient', 'sont retourner'], 'Retourner as a movement verb uses etre and agreement.', 'Retourner comme verbe de mouvement utilise etre avec accord.'],
])

const pcImparfait = buildSingleBlankTopic('pc-imparfait-a2', [
  ['Complete: Quand nous ___ dans la rue, il ___ soudain a pleuvoir. (marcher / commencer)', 'Completez : Quand nous ___ dans la rue, il ___ soudain a pleuvoir. (marcher / commencer)', 'marchions', ['avons marche', 'marcherons', 'marchons'], 'The ongoing background action takes the imparfait.', 'L action de decor ou en cours prend l imparfait.'],
  ['Complete: Pendant qu elle ___ le rapport, son chef ___ dans le bureau. (finir / entrer)', 'Completez : Pendant qu elle ___ le rapport, son chef ___ dans le bureau. (finir / entrer)', 'finissait', ['a fini', 'finit', 'finira'], 'The action in progress takes the imparfait.', 'L action en cours prend l imparfait.'],
  ['Complete: Il ___ tres froid ce matin-la, alors nous ___ le cafe a la maison. (faire / prendre)', 'Completez : Il ___ tres froid ce matin-la, alors nous ___ le cafe a la maison. (faire / prendre)', 'faisait', ['a fait', 'fera', 'fait'], 'Weather or background description usually takes the imparfait.', 'La meteo ou le decor prennent en general l imparfait.'],
  ['Complete: Quand le telephone ___, je ___ deja. (sonner / dormir)', 'Completez : Quand le telephone ___, je ___ deja. (sonner / dormir)', 'a sonne', ['sonnait', 'sonnera', 'sonne'], 'The sudden event that interrupts the situation takes the passe compose.', 'L evenement soudain qui interrompt la situation prend le passe compose.'],
  ['Complete: Nous ___ souvent ce parc quand nous ___ dans le quartier. (traverser / habiter)', 'Completez : Nous ___ souvent ce parc quand nous ___ dans le quartier. (traverser / habiter)', 'traversions', ['avons traverse', 'traverserons', 'traversons'], 'A repeated habit in the past takes the imparfait.', 'Une habitude repetee dans le passe prend l imparfait.'],
  ['Complete: Elle ___ la fenetre quand elle ___ un bruit bizarre. (ouvrir / entendre)', 'Completez : Elle ___ la fenetre quand elle ___ un bruit bizarre. (ouvrir / entendre)', 'ouvrait', ['a ouvert', 'ouvrira', 'ouvre'], 'The action underway takes the imparfait.', 'L action en train de se faire prend l imparfait.'],
  ['Complete: Le concert ___ a peine quand deux spectateurs ___ en retard. (commencer / arriver)', 'Completez : Le concert ___ a peine quand deux spectateurs ___ en retard. (commencer / arriver)', 'avait commence', ['commencait', 'a commence', 'commencera'], 'Here the idea is an action already completed before another past action.', 'Ici, il s agit d une action deja terminee avant une autre action passee.'],
  ['Complete: D habitude, mon pere ___ tot, mais ce jour-la il ___ jusqu a midi. (se lever / dormir)', 'Completez : D habitude, mon pere ___ tot, mais ce jour-la il ___ jusqu a midi. (se lever / dormir)', 'se levait', ['s est leve', 'se levera', 'se leve'], 'D habitude signals the imparfait for a repeated habit.', 'D habitude indique l imparfait pour une habitude repetee.'],
  ['Complete: Au moment ou nous ___ a table, le courant ___ brusquement. (etre / sauter)', 'Completez : Au moment ou nous ___ a table, le courant ___ brusquement. (etre / sauter)', 'etions', ['avons ete', 'serons', 'sommes'], 'The situation in progress takes the imparfait.', 'La situation en cours prend l imparfait.'],
  ['Complete: Elle ___ tres bien la route, alors elle ne ___ pas son GPS. (connaitre / utiliser)', 'Completez : Elle ___ tres bien la route, alors elle ne ___ pas son GPS. (connaitre / utiliser)', 'connaissait', ['a connu', 'connaitra', 'connait'], 'A past state of knowledge usually takes the imparfait.', 'Un etat passe de connaissance prend generalement l imparfait.'],
])

const timeExpressions = buildSingleBlankTopic('time-expressions-a2', [
  ['Complete: J ai quitte Lille ___ trois ans.', 'Completez : J ai quitte Lille ___ trois ans.', 'il y a', ['depuis', 'pendant', 'en'], 'Il y a places an event a certain time ago.', 'Il y a situe un evenement a une certaine distance dans le passe.'],
  ['Complete: Nous habitons ici ___ six mois.', 'Completez : Nous habitons ici ___ six mois.', 'depuis', ['il y a', 'pendant', 'en'], 'Depuis expresses a duration that continues into the present.', 'Depuis exprime une duree qui continue dans le present.'],
  ['Complete: Elle a travaille a Berlin ___ deux ans, puis elle est revenue.', 'Completez : Elle a travaille a Berlin ___ deux ans, puis elle est revenue.', 'pendant', ['depuis', 'il y a', 'en'], 'Pendant expresses a completed duration in the past.', 'Pendant exprime une duree achevee dans le passe.'],
  ['Complete: Il est ne ___ 1998.', 'Completez : Il est ne ___ 1998.', 'en', ['depuis', 'il y a', 'pendant'], 'Years usually take en.', 'Les annees prennent generalement en.'],
  ['Complete: Elle a commence le piano ___ l age de six ans.', 'Completez : Elle a commence le piano ___ l age de six ans.', 'a', ['en', 'depuis', 'par'], 'The fixed expression is a l age de.', 'L expression fixe est a l age de.'],
  ['Complete: Dix ans plus tard, ils se sont retrouves ___ hasard.', 'Completez : Dix ans plus tard, ils se sont retrouves ___ hasard.', 'par', ['en', 'a', 'de'], 'Par hasard is the correct fixed expression.', 'Par hasard est la bonne expression fixe.'],
  ['Complete: J ai termine ce projet ___ une semaine.', 'Completez : J ai termine ce projet ___ une semaine.', 'en', ['depuis', 'pendant', 'il y a'], 'En can express the time needed to complete an action.', 'En peut exprimer le temps necessaire pour accomplir une action.'],
  ['Complete: Nous nous connaissons ___ longtemps.', 'Completez : Nous nous connaissons ___ longtemps.', 'depuis', ['pendant', 'il y a', 'en'], 'With a continuing relationship, depuis is needed.', 'Avec une relation qui continue, il faut depuis.'],
  ['Complete: Il a plu sans arret ___ toute la nuit.', 'Completez : Il a plu sans arret ___ toute la nuit.', 'pendant', ['depuis', 'il y a', 'en'], 'Pendant introduces the completed span of the night.', 'Pendant introduit la duree achevee de la nuit.'],
  ['Complete: J ai change de travail ___ quelques mois.', 'Completez : J ai change de travail ___ quelques mois.', 'il y a', ['depuis', 'pendant', 'en'], 'The change happened some months ago, so il y a fits.', 'Le changement a eu lieu il y a quelques mois, donc il y a convient.'],
])

const passeRecent = buildSingleBlankTopic('passe-recent-a2', [
  ['Complete: Elle ___ de terminer son memoire. (venir)', 'Completez : Elle ___ de terminer son memoire. (venir)', 'vient', ['est venue', 'venait', 'viendra'], 'The passe recent uses venir in the present plus de + infinitive.', 'Le passe recent utilise venir au present plus de + infinitif.'],
  ['Complete: Nous ___ d arriver a la gare. (venir)', 'Completez : Nous ___ d arriver a la gare. (venir)', 'venons', ['sommes venus', 'venions', 'viendrons'], 'Venons de + infinitive expresses something that just happened.', 'Venons de + infinitif exprime une action qui vient de se produire.'],
  ['Complete: Tu ___ de rater le bus. (venir)', 'Completez : Tu ___ de rater le bus. (venir)', 'viens', ['es venu', 'venais', 'viendras'], 'Viens de shows the immediate recent past.', 'Viens de exprime le passe tres recent.'],
  ['Complete: Ils ___ de recevoir les resultats. (venir)', 'Completez : Ils ___ de recevoir les resultats. (venir)', 'viennent', ['sont venus', 'venaient', 'viendront'], 'The recent past structure uses viennent de.', 'La structure du passe recent utilise viennent de.'],
  ['Complete: Je ___ de parler au directeur. (venir)', 'Completez : Je ___ de parler au directeur. (venir)', 'viens', ['suis venu', 'venais', 'viendrai'], 'The event has just happened, so use viens de.', 'L action vient de se produire, donc on utilise viens de.'],
  ['Complete: Vous ___ de finir votre pause. (venir)', 'Completez : Vous ___ de finir votre pause. (venir)', 'venez', ['etes venus', 'veniez', 'viendrez'], 'Venez de is the correct vous form.', 'Venez de est la bonne forme avec vous.'],
  ['Complete: On ___ de fermer la caisse. (venir)', 'Completez : On ___ de fermer la caisse. (venir)', 'vient', ['est venu', 'venait', 'viendra'], 'On takes the singular form vient.', 'On prend la forme singuliere vient.'],
  ['Complete: Elles ___ de s installer dans le quartier. (venir)', 'Completez : Elles ___ de s installer dans le quartier. (venir)', 'viennent', ['sont venues', 'venaient', 'viendront'], 'The passe recent still uses present tense venir.', 'Le passe recent utilise toujours le present de venir.'],
  ['Complete: Tu ne peux pas lui parler, il ___ de sortir. (venir)', 'Completez : Tu ne peux pas lui parler, il ___ de sortir. (venir)', 'vient', ['est venu', 'venait', 'viendra'], 'Something has just happened, so vient de is correct.', 'Une action vient juste d avoir lieu, donc vient de est correct.'],
  ['Complete: Nous ___ de reserver nos billets en ligne. (venir)', 'Completez : Nous ___ de reserver nos billets en ligne. (venir)', 'venons', ['sommes venus', 'venions', 'viendrons'], 'The recent past construction is venons de reserver.', 'La construction du passe recent est venons de reserver.'],
])

const futureSimple = buildSingleBlankTopic('future-simple-intro-a2', [
  ['Complete: Demain, je ___ plus tot du bureau. (partir)', 'Completez : Demain, je ___ plus tot du bureau. (partir)', 'partirai', ['pars', 'partirais', 'suis parti'], 'The future simple of partir is partirai.', 'Le futur simple de partir est partirai.'],
  ['Complete: Nous ___ chez toi vers vingt heures. (arriver)', 'Completez : Nous ___ chez toi vers vingt heures. (arriver)', 'arriverons', ['arrivons', 'arriverions', 'sommes arrives'], 'A planned future action takes the future simple.', 'Une action future prevue prend le futur simple.'],
  ['Complete: Tu ___ la reponse la semaine prochaine. (savoir)', 'Completez : Tu ___ la reponse la semaine prochaine. (savoir)', 'sauras', ['sais', 'saurais', 'as su'], 'Savoir has the irregular future stem saur-.', 'Savoir a le radical futur irregulier saur-.'],
  ['Complete: Elle ___ probablement en train. (venir)', 'Completez : Elle ___ probablement en train. (venir)', 'viendra', ['vient', 'viendrait', 'est venue'], 'Venir becomes viendr- in the future.', 'Venir devient viendr- au futur.'],
  ['Complete: Vous ___ le temps de tout verifier. (avoir)', 'Completez : Vous ___ le temps de tout verifier. (avoir)', 'aurez', ['avez', 'auriez', 'avez eu'], 'Avoir has the future stem aur-.', 'Avoir a le radical futur aur-.'],
  ['Complete: On ___ le dossier avant midi, sans faute. (finir)', 'Completez : On ___ le dossier avant midi, sans faute. (finir)', 'finira', ['finit', 'finirait', 'a fini'], 'Finir is regular in the future: infinitive + ending.', 'Finir est regulier au futur : infinitif + terminaison.'],
  ['Complete: Ils ___ leurs amis a l aeroport. (voir)', 'Completez : Ils ___ leurs amis a l aeroport. (voir)', 'verront', ['voient', 'verraient', 'ont vu'], 'Voir has the irregular future stem verr-.', 'Voir a le radical futur irregulier verr-.'],
  ['Complete: Je ___ plus prudent la prochaine fois. (etre)', 'Completez : Je ___ plus prudent la prochaine fois. (etre)', 'serai', ['suis', 'serais', 'ai ete'], 'Etre has the irregular future stem ser-.', 'Etre a le radical futur irregulier ser-.'],
  ['Complete: Nous ___ cette option si le prix baisse. (choisir)', 'Completez : Nous ___ cette option si le prix baisse. (choisir)', 'choisirons', ['choisissons', 'choisirions', 'avons choisi'], 'The future simple indicates the likely result later.', 'Le futur simple indique le resultat probable plus tard.'],
  ['Complete: Tu ___ peut-etre d avis apres la reunion. (changer)', 'Completez : Tu ___ peut-etre d avis apres la reunion. (changer)', 'changeras', ['changes', 'changerais', 'as change'], 'Changer keeps its infinitive stem in the future.', 'Changer garde son infinitif comme base au futur.'],
])

const siPresentFuture = buildSingleBlankTopic('si-present-future-a2', [
  ['Complete: Si tu finis plus tot, nous ___ ensemble. (diner)', 'Completez : Si tu finis plus tot, nous ___ ensemble. (diner)', 'dinerons', ['dinons', 'dinerions', 'avons dine'], 'After si + present, the result clause takes the future simple for a likely result.', 'Apres si + present, la proposition resultat prend le futur simple pour un resultat probable.'],
  ['Complete: Si vous prenez le metro, vous ___ avant neuf heures. (arriver)', 'Completez : Si vous prenez le metro, vous ___ avant neuf heures. (arriver)', 'arriverez', ['arrivez', 'arriveriez', 'etes arrives'], 'The result of a real condition uses the future.', 'Le resultat d une condition reelle utilise le futur.'],
  ['Complete: Si elle a besoin d aide, je l ___ tout de suite. (appeler)', 'Completez : Si elle a besoin d aide, je l ___ tout de suite. (appeler)', 'appellerai', ['appelle', 'appellerais', 'ai appele'], 'A likely future result takes the future simple.', 'Un resultat futur probable prend le futur simple.'],
  ['Complete: Si nous avons encore faim, nous ___ un dessert. (prendre)', 'Completez : Si nous avons encore faim, nous ___ un dessert. (prendre)', 'prendrons', ['prenons', 'prendrions', 'avons pris'], 'The main clause uses the future simple.', 'La proposition principale utilise le futur simple.'],
  ['Complete: Si on part maintenant, on ___ moins de circulation. (avoir)', 'Completez : Si on part maintenant, on ___ moins de circulation. (avoir)', 'aura', ['a', 'aurait', 'a eu'], 'Avoir takes the future form aura here.', 'Avoir prend ici la forme future aura.'],
  ['Complete: Si tu lui expliques calmement, il ___ mieux. (comprendre)', 'Completez : Si tu lui expliques calmement, il ___ mieux. (comprendre)', 'comprendra', ['comprend', 'comprendrait', 'a compris'], 'The sentence expresses a realistic future consequence.', 'La phrase exprime une consequence future realiste.'],
  ['Complete: Si elles arrivent en avance, elles ___ peut-etre des places devant. (trouver)', 'Completez : Si elles arrivent en avance, elles ___ peut-etre des places devant. (trouver)', 'trouveront', ['trouvent', 'trouveraient', 'ont trouve'], 'The future simple is required in the result clause.', 'Le futur simple est necessaire dans la proposition resultat.'],
  ['Complete: Si nous ratons ce bus, nous ___ le suivant. (attendre)', 'Completez : Si nous ratons ce bus, nous ___ le suivant. (attendre)', 'attendrons', ['attendons', 'attendrions', 'avons attendu'], 'Real condition plus future result.', 'Condition reelle plus resultat futur.'],
  ['Complete: Si vous continuez comme ca, vous ___ tres vite. (progresser)', 'Completez : Si vous continuez comme ca, vous ___ tres vite. (progresser)', 'progresserez', ['progressez', 'progresseriez', 'avez progresse'], 'A likely outcome uses the future simple.', 'Une issue probable utilise le futur simple.'],
  ['Complete: Si je vois Lea ce soir, je lui ___ ton message. (transmettre)', 'Completez : Si je vois Lea ce soir, je lui ___ ton message. (transmettre)', 'transmettrai', ['transmets', 'transmettrais', 'ai transmis'], 'The result clause takes the future simple.', 'La proposition resultat prend le futur simple.'],
])

const obligationExpressions = buildSingleBlankTopic('obligation-expressions-a2', [
  ['Complete: Pour entrer ici, il faut ___ un badge.', 'Completez : Pour entrer ici, il faut ___ un badge.', 'avoir', ['a', 'ait', 'eu'], 'Il faut + infinitive expresses general necessity.', 'Il faut + infinitif exprime une necessite generale.'],
  ['Complete: Il faut que tu ___ plus attentif en conduisant. (etre)', 'Completez : Il faut que tu ___ plus attentif en conduisant. (etre)', 'sois', ['es', 'seras', 'as ete'], 'Il faut que is followed by the subjunctive.', 'Il faut que est suivi du subjonctif.'],
  ['Complete: Il ne faut pas que vous ___ en retard demain. (arriver)', 'Completez : Il ne faut pas que vous ___ en retard demain. (arriver)', 'arriviez', ['arrivez', 'arriverez', 'etes arrives'], 'A change of subject after il faut que requires the subjunctive.', 'Un changement de sujet apres il faut que exige le subjonctif.'],
  ['Complete: Pour ce formulaire, il faut ___ votre adresse complete.', 'Completez : Pour ce formulaire, il faut ___ votre adresse complete.', 'indiquer', ['indiquez', 'indiquiez', 'indique'], 'Il faut + infinitive when the subject is general or implicit.', 'Il faut + infinitif quand le sujet est general ou implicite.'],
  ['Complete: Il faut que nous ___ une decision avant midi. (prendre)', 'Completez : Il faut que nous ___ une decision avant midi. (prendre)', 'prenions', ['prenons', 'prendrons', 'avons pris'], 'The subjunctive of prendre with nous is prenions.', 'Le subjonctif de prendre avec nous est prenions.'],
  ['Complete: Il faut ___ les enfants a l ecole avant huit heures trente.', 'Completez : Il faut ___ les enfants a l ecole avant huit heures trente.', 'deposer', ['deposez', 'deposerons', 'depose'], 'General obligation takes the infinitive.', 'Une obligation generale prend l infinitif.'],
  ['Complete: Il faut que Lea ___ son medecin aujourd hui. (voir)', 'Completez : Il faut que Lea ___ son medecin aujourd hui. (voir)', 'voie', ['voit', 'verra', 'a vu'], 'Voir takes the subjunctive form voie here.', 'Voir prend ici la forme subjonctive voie.'],
  ['Complete: Il faut que vous ___ vos billets avant le depart. (imprimer)', 'Completez : Il faut que vous ___ vos billets avant le depart. (imprimer)', 'imprimiez', ['imprimez', 'imprimerez', 'avez imprime'], 'The subjunctive is needed after il faut que.', 'Le subjonctif est necessaire apres il faut que.'],
  ['Complete: Il faut ___ un casque sur ce chantier.', 'Completez : Il faut ___ un casque sur ce chantier.', 'porter', ['portez', 'portera', 'porte'], 'An impersonal rule uses il faut + infinitive.', 'Une regle impersonnelle utilise il faut + infinitif.'],
  ['Complete: Il faut que je ___ plus tot demain. (partir)', 'Completez : Il faut que je ___ plus tot demain. (partir)', 'parte', ['pars', 'partirai', 'suis parti'], 'Partir takes the subjunctive parte after il faut que.', 'Partir prend le subjonctif parte apres il faut que.'],
])

const conditionalPoliteness = buildSingleBlankTopic('conditional-politeness-a2', [
  ['Complete: Je ___ reserver une table pour deux, s il vous plait. (vouloir)', 'Completez : Je ___ reserver une table pour deux, s il vous plait. (vouloir)', 'voudrais', ['veux', 'voudrai', 'ai voulu'], 'The conditional softens the request.', 'Le conditionnel adoucit la demande.'],
  ['Complete: Nous ___ bien visiter le musee demain. (aimer)', 'Completez : Nous ___ bien visiter le musee demain. (aimer)', 'aimerions', ['aimons', 'aimerons', 'avons aime'], 'The conditional expresses a wish or polite intention.', 'Le conditionnel exprime un souhait ou une intention polie.'],
  ['Complete: Tu ___ un cafe ou un the ?', 'Completez : Tu ___ un cafe ou un the ?', 'voudrais', ['veux', 'voudras', 'as voulu'], 'Voudrais is more polite than veux.', 'Voudrais est plus poli que veux.'],
  ['Complete: Elle ___ changer d appartement, mais les loyers sont trop eleves. (aimer)', 'Completez : Elle ___ changer d appartement, mais les loyers sont trop eleves. (aimer)', 'aimerait', ['aime', 'aimera', 'a aime'], 'The conditional can express a wish not yet realized.', 'Le conditionnel peut exprimer un souhait non realise.'],
  ['Complete: Nous ___ vous poser une question.', 'Completez : Nous ___ vous poser une question.', 'voudrions', ['voulons', 'voudrons', 'avons voulu'], 'A polite request often uses voudrions.', 'Une demande polie utilise souvent voudrions.'],
  ['Complete: Je ___ plus de renseignements avant de signer. (souhaiter)', 'Completez : Je ___ plus de renseignements avant de signer. (souhaiter)', 'souhaiterais', ['souhaite', 'souhaiterai', 'ai souhaite'], 'The conditional makes the request more formal.', 'Le conditionnel rend la demande plus formelle.'],
  ['Complete: Vous ___ venir un peu plus tot demain ? (pouvoir)', 'Completez : Vous ___ venir un peu plus tot demain ? (pouvoir)', 'pourriez', ['pouvez', 'pourrez', 'avez pu'], 'Pourriez is the polite conditional of pouvoir.', 'Pourriez est le conditionnel poli de pouvoir.'],
  ['Complete: Il ___ habiter pres de son travail pour gagner du temps. (preferer)', 'Completez : Il ___ habiter pres de son travail pour gagner du temps. (preferer)', 'prefererait', ['prefere', 'preferera', 'a prefere'], 'The conditional can express an ideal but unreal current wish.', 'Le conditionnel peut exprimer un souhait ideal mais non realise.'],
  ['Complete: J ___ savoir si le service est encore ouvert. (aimer)', 'Completez : J ___ savoir si le service est encore ouvert. (aimer)', 'aimerais', ['aime', 'aimerai', 'ai aime'], 'J aimerais savoir is a common polite formula.', 'J aimerais savoir est une formule de politesse tres courante.'],
  ['Complete: Nous ___ peut-etre rester plus longtemps si c etait possible. (pouvoir)', 'Completez : Nous ___ peut-etre rester plus longtemps si c etait possible. (pouvoir)', 'pourrions', ['pouvons', 'pourrons', 'avons pu'], 'The conditional shows a hypothetical possibility.', 'Le conditionnel montre une possibilite hypothetique.'],
])

const reportedSpeech = buildSingleBlankTopic('reported-speech-a2', [
  ['Complete: Je pense ___ ce quartier va beaucoup changer.', 'Completez : Je pense ___ ce quartier va beaucoup changer.', 'que', ['qui', 'si', 'dont'], 'Opinion verbs commonly introduce a clause with que.', 'Les verbes d opinion introduisent souvent une proposition avec que.'],
  ['Complete: Elle est sure ___ son frere trouvera la salle.', 'Completez : Elle est sure ___ son frere trouvera la salle.', 'que', ['qui', 'si', 'dont'], 'Expressions of certainty are followed by que + indicative.', 'Les expressions de certitude sont suivies de que + indicatif.'],
  ['Complete: Nous croyons ___ la solution la plus simple est la meilleure.', 'Completez : Nous croyons ___ la solution la plus simple est la meilleure.', 'que', ['si', 'dont', 'qui'], 'Croire que introduces reported opinion.', 'Croire que introduit une opinion rapportee.'],
  ['Complete: Il trouve ___ le service est plus rapide le matin.', 'Completez : Il trouve ___ le service est plus rapide le matin.', 'que', ['si', 'qui', 'dont'], 'Trouver que expresses an opinion.', 'Trouver que exprime une opinion.'],
  ['Complete: Je suis certain ___ ils comprendront la situation.', 'Completez : Je suis certain ___ ils comprendront la situation.', 'que', ['si', 'qui', 'dont'], 'Certainty takes que and the indicative.', 'La certitude prend que et l indicatif.'],
  ['Complete: Tu crois ___ ce projet est vraiment utile ?', 'Completez : Tu crois ___ ce projet est vraiment utile ?', 'que', ['si', 'qui', 'dont'], 'The verb croire is followed by que in this statement frame.', 'Le verbe croire est suivi de que dans ce cadre declaratif.'],
  ['Complete: Elle pense ___ les habitants accepteront la proposition.', 'Completez : Elle pense ___ les habitants accepteront la proposition.', 'que', ['si', 'qui', 'dont'], 'Penser que introduces a reported belief.', 'Penser que introduit une idee rapportee.'],
  ['Complete: Nous sommes persuades ___ la ville doit investir davantage.', 'Completez : Nous sommes persuades ___ la ville doit investir davantage.', 'que', ['si', 'dont', 'qui'], 'Persuades que is the standard construction.', 'Persuades que est la construction standard.'],
  ['Complete: Il dit ___ ce restaurant reste le meilleur du quartier.', 'Completez : Il dit ___ ce restaurant reste le meilleur du quartier.', 'que', ['si', 'qui', 'dont'], 'Dire que introduces reported speech.', 'Dire que introduit le discours rapporte.'],
  ['Complete: Je ne suis pas sur ___ cette ligne de bus passe encore ici.', 'Completez : Je ne suis pas sur ___ cette ligne de bus passe encore ici.', 'que', ['si', 'qui', 'dont'], 'At this level the structure is treated with que + clause.', 'A ce niveau, la structure est traitee avec que + proposition.'],
])

const comparative = buildSingleBlankTopic('comparative-a2', [
  ['Complete: Ce trajet est ___ long que celui d hier.', 'Completez : Ce trajet est ___ long que celui d hier.', 'plus', ['moins', 'aussi', 'autant'], 'Plus + adjective + que makes a comparative of superiority.', 'Plus + adjectif + que forme un comparatif de superiorite.'],
  ['Complete: Lea travaille ___ vite que son collegue.', 'Completez : Lea travaille ___ vite que son collegue.', 'plus', ['moins', 'aussi', 'autant'], 'An adverb can also be compared with plus.', 'Un adverbe peut aussi se comparer avec plus.'],
  ['Complete: Ce quartier est ___ calme que le centre-ville.', 'Completez : Ce quartier est ___ calme que le centre-ville.', 'moins', ['plus', 'aussi', 'autant'], 'Moins + adjective + que marks inferiority.', 'Moins + adjectif + que marque l inferiorite.'],
  ['Complete: Il y a ___ de commerces ici que dans ma rue.', 'Completez : Il y a ___ de commerces ici que dans ma rue.', 'autant', ['plus', 'moins', 'aussi'], 'Autant de is used before nouns.', 'Autant de s emploie devant les noms.'],
  ['Complete: Son explication est ___ claire que la tienne.', 'Completez : Son explication est ___ claire que la tienne.', 'aussi', ['plus', 'moins', 'autant'], 'Aussi + adjective + que shows equality.', 'Aussi + adjectif + que exprime l egalite.'],
  ['Complete: Ce restaurant est ___ bon que l autre.', 'Completez : Ce restaurant est ___ bon que l autre.', 'meilleur', ['plus bien', 'mieux', 'aussi bien'], 'Meilleur is the irregular comparative of bon.', 'Meilleur est le comparatif irregulier de bon.'],
  ['Complete: Elle danse ___ que moi.', 'Completez : Elle danse ___ que moi.', 'mieux', ['meilleur', 'plus bon', 'aussi bon'], 'Mieux is the irregular comparative of bien as an adverb.', 'Mieux est le comparatif irregulier de bien comme adverbe.'],
  ['Complete: Nous avons ___ de temps qu avant.', 'Completez : Nous avons ___ de temps qu avant.', 'moins', ['plus', 'aussi', 'meilleur'], 'Quantities with nouns use plus de, moins de, autant de.', 'Les quantites avec les noms utilisent plus de, moins de, autant de.'],
  ['Complete: Son bureau est ___ lumineux que le mien.', 'Completez : Son bureau est ___ lumineux que le mien.', 'plus', ['moins', 'aussi', 'autant'], 'This is a standard adjective comparison.', 'Il s agit d une comparaison adjective standard.'],
  ['Complete: Cette solution coute ___ cher que l ancienne.', 'Completez : Cette solution coute ___ cher que l ancienne.', 'moins', ['plus', 'aussi', 'autant'], 'Moins cher means less expensive.', 'Moins cher signifie less expensive.'],
])

const superlative = buildSingleBlankTopic('superlative-a2', [
  ['Complete: C est ___ rue du quartier le soir.', 'Completez : C est ___ rue du quartier le soir.', 'la plus animee', ['plus animee', 'le plus animee', 'la mieux animee'], 'A feminine singular noun takes la plus + adjective.', 'Un nom feminin singulier prend la plus + adjectif.'],
  ['Complete: C est ___ immeuble de la place.', 'Completez : C est ___ immeuble de la place.', 'le plus ancien', ['la plus ancienne', 'plus ancien', 'le mieux ancien'], 'A masculine singular noun takes le plus + adjective.', 'Un nom masculin singulier prend le plus + adjectif.'],
  ['Complete: Ce sont ___ options pour un petit budget.', 'Completez : Ce sont ___ options pour un petit budget.', 'les moins cheres', ['les plus cher', 'les moins cher', 'la moins chere'], 'A feminine plural noun takes les moins + adjective in the plural.', 'Un nom feminin pluriel prend les moins + adjectif au pluriel.'],
  ['Complete: C est ce bus qui fait ___ d arrets.', 'Completez : C est ce bus qui fait ___ d arrets.', 'le plus', ['la plus', 'le moins', 'plus'], 'With nouns, use le plus de / le moins de.', 'Avec les noms, on utilise le plus de / le moins de.'],
  ['Complete: Parmi nous, c est Lea qui chante ___.', 'Completez : Parmi nous, c est Lea qui chante ___.', 'le mieux', ['la meilleure', 'plus bien', 'le meilleur'], 'Le mieux is the irregular superlative for bien as an adverb.', 'Le mieux est le superlatif irregulier de bien comme adverbe.'],
  ['Complete: C est ___ periode de l annee pour voyager ici.', 'Completez : C est ___ periode de l annee pour voyager ici.', 'la meilleure', ['le mieux', 'la plus bonne', 'la mieux'], 'Meilleur has the feminine form meilleure.', 'Meilleur prend la forme feminine meilleure.'],
  ['Complete: C est ___ dossier de toute la serie.', 'Completez : C est ___ dossier de toute la serie.', 'le plus complet', ['la plus complete', 'plus complet', 'le mieux complet'], 'Masculine singular noun: le plus complet.', 'Nom masculin singulier : le plus complet.'],
  ['Complete: Ce sont ___ chambres de l hotel.', 'Completez : Ce sont ___ chambres de l hotel.', 'les plus calmes', ['la plus calme', 'les plus calme', 'les moins calme'], 'The adjective must agree with chambres, feminine plural.', 'L adjectif doit s accorder avec chambres, feminin pluriel.'],
  ['Complete: C est ce quartier qui a ___ de parcs.', 'Completez : C est ce quartier qui a ___ de parcs.', 'le plus', ['la plus', 'le mieux', 'plus'], 'With noun quantity, the pattern is avoir le plus de.', 'Avec une quantite nominale, le modele est avoir le plus de.'],
  ['Complete: De tous mes amis, c est Hugo qui conduit ___.', 'Completez : De tous mes amis, c est Hugo qui conduit ___.', 'le mieux', ['le meilleur', 'plus bien', 'la meilleure'], 'For the adverb bien, the superlative is le mieux.', 'Pour l adverbe bien, le superlatif est le mieux.'],
])

const connectors = buildSingleBlankTopic('connectors-a2', [
  ['Complete: Je prends un taxi ___ je suis tres en retard.', 'Completez : Je prends un taxi ___ je suis tres en retard.', 'parce que', ['donc', 'mais', 'pourtant'], 'Parce que introduces the cause.', 'Parce que introduit la cause.'],
  ['Complete: Il pleut, ___ nous restons a la maison.', 'Completez : Il pleut, ___ nous restons a la maison.', 'donc', ['parce que', 'mais', 'pour'], 'Donc introduces the consequence.', 'Donc introduit la consequence.'],
  ['Complete: Elle travaille beaucoup, ___ elle reste tres detendue.', 'Completez : Elle travaille beaucoup, ___ elle reste tres detendue.', 'pourtant', ['parce que', 'donc', 'pour'], 'Pourtant marks opposition.', 'Pourtant marque l opposition.'],
  ['Complete: Nous fermons la fenetre ___ ne pas faire trop de bruit.', 'Completez : Nous fermons la fenetre ___ ne pas faire trop de bruit.', 'pour', ['parce que', 'donc', 'pourtant'], 'Pour introduces the purpose.', 'Pour introduit le but.'],
  ['Complete: Le dossier est urgent ; ___, il faudra tout verifier.', 'Completez : Le dossier est urgent ; ___, il faudra tout verifier.', 'cependant', ['parce que', 'donc', 'pour'], 'Cependant marks contrast in a more formal register.', 'Cependant marque le contraste dans un registre plus formel.'],
  ['Complete: Elle est malade ; c est ___ elle ne vient pas.', 'Completez : Elle est malade ; c est ___ elle ne vient pas.', 'pourquoi', ['parce que', 'donc', 'pour'], 'C est pourquoi introduces the result.', 'C est pourquoi introduit le resultat.'],
  ['Complete: J ai choisi ce trajet ___ il est plus court.', 'Completez : J ai choisi ce trajet ___ il est plus court.', 'parce que', ['donc', 'mais', 'cependant'], 'The second clause gives the reason.', 'La deuxieme proposition donne la raison.'],
  ['Complete: Cette formule est plus lente ; ___, elle est plus sure.', 'Completez : Cette formule est plus lente ; ___, elle est plus sure.', 'en revanche', ['parce que', 'donc', 'pour'], 'En revanche expresses contrast with another aspect.', 'En revanche exprime un contraste avec un autre aspect.'],
  ['Complete: Nous partons plus tot ___ arriver avant la foule.', 'Completez : Nous partons plus tot ___ arriver avant la foule.', 'pour', ['parce que', 'donc', 'pourtant'], 'Purpose is introduced by pour + infinitive.', 'Le but est introduit par pour + infinitif.'],
  ['Complete: Il a oublie son badge ; ___, il n a pas pu entrer.', 'Completez : Il a oublie son badge ; ___, il n a pas pu entrer.', 'donc', ['parce que', 'pourtant', 'pour'], 'Donc marks a direct consequence.', 'Donc marque une consequence directe.'],
])

const modesRegister = buildSingleBlankTopic('modes-register-a2', [
  ['Choose the more polite sentence: ___', 'Choisissez la phrase la plus polie : ___', 'Pourriez-vous m aider, s il vous plait ?', ['Aide-moi.', 'Tu peux aider moi ?', 'Aidez-moi toi.'], 'A polite request often uses the conditional with vous.', 'Une demande polie utilise souvent le conditionnel avec vous.'],
  ['Choose the formal email opening: ___', 'Choisissez l ouverture de mail formelle : ___', 'Madame, Monsieur,', ['Salut !', 'Coucou,', 'Yo,'], 'Formal register requires an appropriate opening.', 'Le registre formel demande une formule d ouverture adaptee.'],
  ['Choose the correct command for one friend: ___', 'Choisissez le bon ordre pour un ami : ___', 'Ferme la porte, s il te plait.', ['Fermez la porte, Paul.', 'Tu fermes la porte !', 'La porte ferme !'], 'Tu commands use the singular imperative.', 'Les ordres avec tu utilisent l imperatif singulier.'],
  ['Choose the formal request in a shop: ___', 'Choisissez la demande formelle dans un magasin : ___', 'Je voudrais essayer cette veste.', ['Je veux essayer ca.', 'Donnez-moi cette veste.', 'Je prends ca, vite.'], 'Je voudrais sounds polite and natural in a shop.', 'Je voudrais sonne poli et naturel dans un magasin.'],
  ['Choose the sentence that sounds too informal in a meeting: ___', 'Choisissez la phrase trop familiere dans une reunion : ___', 'C est hyper nul.', ['Ce n est pas ideal.', 'Cette solution pose probleme.', 'Il faudrait revoir ce point.'], 'Hyper nul is too colloquial for a formal meeting.', 'Hyper nul est trop familier pour une reunion formelle.'],
  ['Choose the neutral written sentence: ___', 'Choisissez la phrase ecrite neutre : ___', 'Je vous remercie pour votre message.', ['Merci pour ton msg.', 'Merci bcp.', 'Trop sympa ton mail.'], 'A neutral written register avoids texting abbreviations.', 'Un registre ecrit neutre evite les abreviations de message.'],
  ['Choose the best way to address a stranger politely: ___', 'Choisissez la meilleure facon de s adresser poliment a un inconnu : ___', 'Excusez-moi, madame.', ['Eh toi !', 'Salut, toi.', 'Pardon, ma vieille.'], 'Polite address uses excusez-moi with vous.', 'Une adresse polie utilise excusez-moi avec vous.'],
  ['Choose the sentence suitable for a close friend: ___', 'Choisissez la phrase adaptee a un ami proche : ___', 'Tu viens chez moi ce soir ?', ['Venez chez moi ce soir.', 'Monsieur, venez donc.', 'Pourriez-vous venir chez moi ?'], 'Tu is natural with a close friend.', 'Tu est naturel avec un ami proche.'],
  ['Choose the sentence appropriate for a complaint letter: ___', 'Choisissez la phrase adaptee a une lettre de reclamation : ___', 'Je souhaite signaler un probleme concernant ma commande.', ['Votre service, c est n importe quoi.', 'Franchement, c est abuse.', 'Salut, gros souci !'], 'A complaint letter needs a controlled formal register.', 'Une lettre de reclamation demande un registre formel maitrise.'],
  ['Choose the best sentence for speaking to several customers: ___', 'Choisissez la meilleure phrase pour parler a plusieurs clients : ___', 'Veuillez patienter un instant, s il vous plait.', ['Patiente un peu.', 'Attends la.', 'Vous patiencez.'], 'Veuillez + infinitive is a common polite public instruction.', 'Veuillez + infinitif est une consigne polie frequente au public.'],
])

const passeComposeGeneral = buildSingleBlankTopic('passe-compose', [
  ['Complete: Hier, nous ___ le vieux quartier a pied. (visiter)', 'Completez : Hier, nous ___ le vieux quartier a pied. (visiter)', 'avons visite', ['visitions', 'sommes visites', 'avons visiter'], 'A completed past action takes the passe compose.', 'Une action passee achevee prend le passe compose.'],
  ['Complete: Elle ___ a Marseille tres tard hier soir. (arriver)', 'Completez : Elle ___ a Marseille tres tard hier soir. (arriver)', 'est arrivee', ['a arrive', 'arrivait', 'est arriver'], 'Movement verbs like arriver often use etre.', 'Les verbes de mouvement comme arriver utilisent souvent etre.'],
  ['Complete: J ___ mes billets en ligne ce matin. (acheter)', 'Completez : J ___ mes billets en ligne ce matin.', 'ai achete', ['achetai', 'suis achete', 'ai acheter'], 'Acheter uses avoir in the passe compose.', 'Acheter utilise avoir au passe compose.'],
  ['Complete: Ils ___ du cinema avant minuit. (sortir)', 'Completez : Ils ___ du cinema avant minuit. (sortir)', 'sont sortis', ['ont sorti', 'sortaient', 'sont sortir'], 'Sortir as a movement verb takes etre.', 'Sortir comme verbe de mouvement prend etre.'],
  ['Complete: Tu ___ la verite tout de suite. (dire)', 'Completez : Tu ___ la verite tout de suite. (dire)', 'as dit', ['disais', 'es dit', 'as dire'], 'Dire uses avoir, and the participle is dit.', 'Dire utilise avoir, et le participe est dit.'],
  ['Complete: Nous ___ tres tot parce que la route etait longue. (partir)', 'Completez : Nous ___ tres tot parce que la route etait longue. (partir)', 'sommes partis', ['avons parti', 'partions', 'sommes partir'], 'Partir uses etre and agreement with the subject.', 'Partir utilise etre avec accord du sujet.'],
  ['Complete: Elle ___ ses cles dans la cuisine. (laisser)', 'Completez : Elle ___ ses cles dans la cuisine. (laisser)', 'a laisse', ['est laissee', 'laissait', 'a laisser'], 'Laisser takes avoir here.', 'Laisser prend avoir ici.'],
  ['Complete: Vous ___ a la reunion sans prevenir. (venir)', 'Completez : Vous ___ a la reunion sans prevenir. (venir)', 'etes venus', ['avez venu', 'veniez', 'etes venir'], 'Venir forms the passe compose with etre.', 'Venir forme le passe compose avec etre.'],
  ['Complete: On ___ le probleme en quelques minutes. (resoudre)', 'Completez : On ___ le probleme en quelques minutes. (resoudre)', 'a resolu', ['resolvait', 'est resolu', 'a resoudre'], 'Resoudre uses avoir, and the participle is resolu.', 'Resoudre utilise avoir, et le participe est resolu.'],
  ['Complete: Elles ___ chez elles apres le spectacle. (rentrer)', 'Completez : Elles ___ chez elles apres le spectacle. (rentrer)', 'sont rentrees', ['ont rentre', 'rentraient', 'sont rentrer'], 'Rentrer here is intransitive movement, so it uses etre.', 'Rentrer est ici un verbe de mouvement intransitif, donc il utilise etre.'],
])

const imparfait = buildSingleBlankTopic('imparfait', [
  ['Complete: Quand j etais petit, je ___ souvent chez ma grand-mere. (aller)', 'Completez : Quand j etais petit, je ___ souvent chez ma grand-mere. (aller)', 'allais', ['suis alle', 'irai', 'vais'], 'A repeated habit in the past takes the imparfait.', 'Une habitude repetee dans le passe prend l imparfait.'],
  ['Complete: Il ___ toujours froid dans cette vieille maison. (faire)', 'Completez : Il ___ toujours froid dans cette vieille maison. (faire)', 'faisait', ['a fait', 'fera', 'fait'], 'Background weather and description usually take the imparfait.', 'La meteo et la description de decor prennent en general l imparfait.'],
  ['Complete: Nous ___ pres de la gare a cette epoque-la. (habiter)', 'Completez : Nous ___ pres de la gare a cette epoque-la. (habiter)', 'habitions', ['avons habite', 'habiterons', 'habitons'], 'A past state or situation takes the imparfait.', 'Un etat ou une situation passee prend l imparfait.'],
  ['Complete: Elle ___ toujours tres vite quand elle etait stressee. (parler)', 'Completez : Elle ___ toujours tres vite quand elle etait stressee. (parler)', 'parlait', ['a parle', 'parlera', 'parle'], 'Repeated behavior in the past uses the imparfait.', 'Un comportement repete dans le passe utilise l imparfait.'],
  ['Complete: Les rues ___ presque vides le dimanche matin. (etre)', 'Completez : Les rues ___ presque vides le dimanche matin. (etre)', 'etaient', ['ont ete', 'seront', 'sont'], 'A background description takes the imparfait.', 'Une description de decor prend l imparfait.'],
  ['Complete: Tu ___ le piano tous les soirs apres l ecole. (pratiquer)', 'Completez : Tu ___ le piano tous les soirs apres l ecole. (pratiquer)', 'pratiquais', ['as pratique', 'pratiqueras', 'pratiques'], 'The action was habitual in the past.', 'L action etait habituelle dans le passe.'],
  ['Complete: On ___ tres bien ce professeur, il expliquait tout calmement. (aimer)', 'Completez : On ___ tres bien ce professeur, il expliquait tout calmement. (aimer)', 'aimait', ['a aime', 'aimera', 'aime'], 'A continuing past feeling takes the imparfait.', 'Un sentiment passe continu prend l imparfait.'],
  ['Complete: Vous ___ souvent le dernier bus a cette periode. (prendre)', 'Completez : Vous ___ souvent le dernier bus a cette periode. (prendre)', 'preniez', ['avez pris', 'prendrez', 'prenez'], 'Souvent indicates repeated past action.', 'Souvent indique une action passee repetee.'],
  ['Complete: Je ___ deja un peu de francais avant ce voyage. (connaitre)', 'Completez : Je ___ deja un peu de francais avant ce voyage. (connaitre)', 'connaissais', ['ai connu', 'connaitrai', 'connais'], 'Connaissais expresses a past state of knowledge.', 'Connaissais exprime un etat de connaissance dans le passe.'],
  ['Complete: Les enfants ___ dans le jardin pendant que nous preparions le repas. (jouer)', 'Completez : Les enfants ___ dans le jardin pendant que nous preparions le repas. (jouer)', 'jouaient', ['ont joue', 'joueront', 'jouent'], 'An action in progress in the background takes the imparfait.', 'Une action en cours a l arriere-plan prend l imparfait.'],
])

const objectPronouns = buildSingleBlankTopic('object-pronouns', [
  ['Complete: Je regarde ce film ? Oui, je ___ regarde ce soir.', 'Completez : Je regarde ce film ? Oui, je ___ regarde ce soir.', 'le', ['lui', 'y', 'en'], 'Film is a direct object, so use le.', 'Film est un objet direct, donc on utilise le.'],
  ['Complete: Tu parles a Lea ? Oui, je ___ parle apres le cours.', 'Completez : Tu parles a Lea ? Oui, je ___ parle apres le cours.', 'lui', ['la', 'le', 'en'], 'Parler a someone takes an indirect object pronoun.', 'Parler a quelqu un prend un pronom objet indirect.'],
  ['Complete: Nous attendons nos amis. Nous ___ attendons devant la gare.', 'Completez : Nous attendons nos amis. Nous ___ attendons devant la gare.', 'les', ['leur', 'y', 'en'], 'Amis is a plural direct object, so les is correct.', 'Amis est un objet direct pluriel, donc les est correct.'],
  ['Complete: Il telephone a ses parents tous les dimanches. Il ___ telephone tous les dimanches.', 'Completez : Il telephone a ses parents tous les dimanches. Il ___ telephone tous les dimanches.', 'leur', ['les', 'y', 'en'], 'Telephoner a quelqu un takes leur in the plural.', 'Telephoner a quelqu un prend leur au pluriel.'],
  ['Complete: J ecoute cette chanson ? Oui, je ___ ecoute souvent.', 'Completez : J ecoute cette chanson ? Oui, je ___ ecoute souvent.', 'la', ['lui', 'leur', 'en'], 'Chanson is a feminine direct object.', 'Chanson est un objet direct feminin.'],
  ['Complete: Vous repondez au client ? Oui, nous ___ repondons tout de suite.', 'Completez : Vous repondez au client ? Oui, nous ___ repondons tout de suite.', 'lui', ['le', 'la', 'les'], 'Repondre a someone takes lui.', 'Repondre a quelqu un prend lui.'],
  ['Complete: On connait bien ces rues ? Oui, on ___ connait bien.', 'Completez : On connait bien ces rues ? Oui, on ___ connait bien.', 'les', ['leur', 'y', 'en'], 'Ces rues is a direct object plural.', 'Ces rues est un objet direct pluriel.'],
  ['Complete: Elle montre la photo a Paul. Elle ___ montre la photo.', 'Completez : Elle montre la photo a Paul. Elle ___ montre la photo.', 'lui', ['le', 'la', 'les'], 'Paul is the indirect object of montrer.', 'Paul est l objet indirect de montrer.'],
  ['Complete: Tu prends les dossiers ? Oui, je ___ prends.', 'Completez : Tu prends les dossiers ? Oui, je ___ prends.', 'les', ['leur', 'y', 'en'], 'Dossiers is a plural direct object.', 'Dossiers est un objet direct pluriel.'],
  ['Complete: Nous expliquons la regle aux nouveaux etudiants. Nous ___ expliquons la regle.', 'Completez : Nous expliquons la regle aux nouveaux etudiants. Nous ___ expliquons la regle.', 'leur', ['les', 'le', 'la'], 'Aux nouveaux etudiants is an indirect object plural.', 'Aux nouveaux etudiants est un objet indirect pluriel.'],
])

const partitiveArticles = buildSingleBlankTopic('partitive-articles-a2', [
  ['Complete: Le matin, je bois ___ cafe.', 'Completez : Le matin, je bois ___ cafe.', 'du', ['de la', "de l'", 'des'], 'Cafe is masculine singular and uncountable here.', 'Cafe est masculin singulier et non comptable ici.'],
  ['Complete: Elle achete ___ farine pour faire un gateau.', 'Completez : Elle achete ___ farine pour faire un gateau.', 'de la', ['du', "de l'", 'des'], 'Farine is feminine singular and uncountable.', 'Farine est feminin singulier et non comptable.'],
  ['Complete: Il met ___ huile dans la poele.', 'Completez : Il met ___ huile dans la poele.', "de l'", ['du', 'de la', 'des'], 'Huile begins with a vowel sound, so use de l.', 'Huile commence par un son voyelle, donc on utilise de l.'],
  ['Complete: Nous mangeons souvent ___ legumes en hiver.', 'Completez : Nous mangeons souvent ___ legumes en hiver.', 'des', ['du', 'de la', "de l'"], 'An unspecified plural quantity takes des.', 'Une quantite indefinie au pluriel prend des.'],
  ['Complete: Tu veux encore ___ soupe ?', 'Completez : Tu veux encore ___ soupe ?', 'de la', ['du', "de l'", 'des'], 'Soupe is feminine singular and partitive.', 'Soupe est feminin singulier et partitif.'],
  ['Complete: On sert ___ riz avec ce plat.', 'Completez : On sert ___ riz avec ce plat.', 'du', ['de la', "de l'", 'des'], 'Riz is masculine singular in this indefinite quantity use.', 'Riz est masculin singulier dans cet emploi de quantite indefinie.'],
  ['Complete: Elles boivent ___ eau gazeuse apres le sport.', 'Completez : Elles boivent ___ eau gazeuse apres le sport.', "de l'", ['du', 'de la', 'des'], 'Use de l before eau.', 'On utilise de l devant eau.'],
  ['Complete: Il reste ___ pates dans le placard.', 'Completez : Il reste ___ pates dans le placard.', 'des', ['du', 'de la', "de l'"], 'Pates is plural and indefinite here.', 'Pates est pluriel et indefini ici.'],
  ['Complete: J achete ___ fromage chez le fromager du coin.', 'Completez : J achete ___ fromage chez le fromager du coin.', 'du', ['de la', "de l'", 'des'], 'Fromage takes du in an unspecified quantity.', 'Fromage prend du pour une quantite non precisee.'],
  ['Complete: Nous preparons ___ salade pour ce soir.', 'Completez : Nous preparons ___ salade pour ce soir.', 'de la', ['du', "de l'", 'des'], 'Salade is feminine singular here.', 'Salade est feminin singulier ici.'],
])

const quantities = buildSingleBlankTopic('quantities-a2', [
  ['Complete: beaucoup ___ travail', 'Completez : beaucoup ___ travail', 'de', ['du', 'des', 'le'], 'Quantity expressions usually take de.', 'Les expressions de quantite prennent en general de.'],
  ['Complete: un kilo ___ tomates', 'Completez : un kilo ___ tomates', 'de', ['du', 'des', 'la'], 'Measured quantities are followed by de.', 'Les quantites mesurees sont suivies de de.'],
  ['Complete: une bouteille ___ eau', 'Completez : une bouteille ___ eau', "d'", ['de', 'du', 'des'], 'Before a vowel sound, de becomes d.', 'Devant un son voyelle, de devient d.'],
  ['Complete: trop ___ bruit dans cette rue', 'Completez : trop ___ bruit dans cette rue', 'de', ['du', 'des', 'le'], 'Trop is a quantity expression followed by de.', 'Trop est une expression de quantite suivie de de.'],
  ['Complete: assez ___ temps pour finir', 'Completez : assez ___ temps pour finir', 'de', ['du', 'des', 'le'], 'Assez de is the correct structure.', 'Assez de est la structure correcte.'],
  ['Complete: un peu ___ patience, s il vous plait', 'Completez : un peu ___ patience, s il vous plait', 'de', ['du', 'des', 'la'], 'Un peu de introduces a small quantity.', 'Un peu de introduit une petite quantite.'],
  ['Complete: trois verres ___ jus d orange', 'Completez : trois verres ___ jus d orange', 'de', ['du', 'des', 'la'], 'Containers are followed by de.', 'Les contenants sont suivis de de.'],
  ['Complete: pas ___ sucre dans mon cafe', 'Completez : pas ___ sucre dans mon cafe', 'de', ['du', 'des', 'le'], 'In negative quantity expressions, de is used.', 'Dans les expressions negatives de quantite, on utilise de.'],
  ['Complete: plusieurs ___ solutions possibles', 'Completez : plusieurs ___ solutions possibles', ' ', ['de', 'du', 'des'], 'Plusieurs is followed directly by a plural noun without de.', 'Plusieurs est suivi directement d un nom pluriel sans de.'],
  ['Complete: une tranche ___ pain', 'Completez : une tranche ___ pain', 'de', ['du', 'des', 'la'], 'A measured part is followed by de.', 'Une portion mesuree est suivie de de.'],
])

const reflexiveVerbs = buildSingleBlankTopic('reflexive-verbs-a2', [
  ['Complete: Je ___ leve tres tot en semaine. (se lever)', 'Completez : Je ___ leve tres tot en semaine. (se lever)', 'me', ['te', 'se', 'nous'], 'Je takes the reflexive pronoun me.', 'Je prend le pronom pronominal me.'],
  ['Complete: Tu ___ couches tard pendant les vacances. (se coucher)', 'Completez : Tu ___ couches tard pendant les vacances. (se coucher)', 'te', ['me', 'se', 'vous'], 'Tu takes te with reflexive verbs.', 'Tu prend te avec les verbes pronominaux.'],
  ['Complete: Elle ___ prepare rapidement le matin. (se preparer)', 'Completez : Elle ___ prepare rapidement le matin. (se preparer)', 'se', ['me', 'te', 'nous'], 'Elle takes se.', 'Elle prend se.'],
  ['Complete: Nous ___ retrouvons devant la mairie. (se retrouver)', 'Completez : Nous ___ retrouvons devant la mairie.', 'nous', ['me', 'se', 'vous'], 'Nous takes the reflexive pronoun nous.', 'Nous prend le pronom pronominal nous.'],
  ['Complete: Vous ___ reposez un peu apres le dejeuner. (se reposer)', 'Completez : Vous ___ reposez un peu apres le dejeuner.', 'vous', ['te', 'se', 'nous'], 'Vous takes vous with reflexive verbs.', 'Vous prend vous avec les verbes pronominaux.'],
  ['Complete: Ils ___ habillent vite pour sortir. (s habiller)', 'Completez : Ils ___ habillent vite pour sortir.', 's', ['m', 't', 'nous'], 'Ils take se before a vowel, written s apostrophe.', 'Ils prennent se devant une voyelle, ecrit s apostrophe.'],
  ['Complete: Je ___ souviens bien de cette place. (se souvenir)', 'Completez : Je ___ souviens bien de cette place.', 'me', ['te', 'se', 'nous'], 'Je takes me in reflexive constructions.', 'Je prend me dans les constructions pronominales.'],
  ['Complete: On ___ entend tres mal dans cette salle. (s entendre)', 'Completez : On ___ entend tres mal dans cette salle.', 's', ['m', 't', 'nous'], 'On takes se, written s apostrophe before entend.', 'On prend se, ecrit s apostrophe devant entend.'],
  ['Complete: Tu ___ inquietes trop vite. (s inquieter)', 'Completez : Tu ___ inquietes trop vite.', 't', ['m', 's', 'nous'], 'Tu takes te, written t apostrophe before inquietes.', 'Tu prend te, ecrit t apostrophe devant inquietes.'],
  ['Complete: Nous ___ promenons souvent pres du canal. (se promener)', 'Completez : Nous ___ promenons souvent pres du canal.', 'nous', ['me', 'te', 'se'], 'Nous remains the reflexive pronoun for nous.', 'Nous reste le pronom pronominal pour nous.'],
])

const pastParticipleAgreement = buildSingleBlankTopic('past-participle-agreement-a2', [
  ['Complete: Elles sont ___ avant midi. (partir)', 'Completez : Elles sont ___ avant midi. (partir)', 'parties', ['parti', 'partie', 'partis'], 'With etre, the participle agrees in feminine plural.', 'Avec etre, le participe s accorde au feminin pluriel.'],
  ['Complete: Il est ___ sans bruit. (rentrer)', 'Completez : Il est ___ sans bruit.', 'rentre', ['rentree', 'rentres', 'rentrees'], 'A masculine singular subject takes the masculine singular participle.', 'Un sujet masculin singulier prend le participe masculin singulier.'],
  ['Complete: Nous sommes ___ tres tard. (arriver)', 'Completez : Nous sommes ___ tres tard.', 'arrives', ['arrive', 'arrivee', 'arrivees'], 'With nous referring to a mixed or masculine group, use arrives.', 'Avec nous designant un groupe masculin ou mixte, on utilise arrives.'],
  ['Complete: Elle s est ___ juste avant le diner. (coucher)', 'Completez : Elle s est ___ juste avant le diner.', 'couchee', ['couche', 'couches', 'couchees'], 'Reflexive verbs with etre agree with a feminine singular subject here.', 'Les verbes pronominaux avec etre s accordent ici avec un sujet feminin singulier.'],
  ['Complete: Ils sont ___ ensemble a la gare. (descendre)', 'Completez : Ils sont ___ ensemble a la gare.', 'descendus', ['descendu', 'descendue', 'descendues'], 'Masculine plural subject takes descenus? Actually descenus incorrect; correct form is descendus.', 'Un sujet masculin pluriel prend descendus.'],
  ['Complete: Tu es ___ tres tot ce matin. (sortir)', 'Completez : Tu es ___ tres tot ce matin.', 'sorti', ['sortie', 'sortis', 'sorties'], 'Here tu is treated as masculine singular.', 'Ici, tu est traite comme masculin singulier.'],
  ['Complete: Elles se sont ___ sans attendre les autres. (installer)', 'Completez : Elles se sont ___ sans attendre les autres.', 'installees', ['installee', 'installes', 'installe'], 'The participle agrees with a feminine plural subject.', 'Le participe s accorde avec un sujet feminin pluriel.'],
  ['Complete: Marie est ___ a Paris en 2001. (naitre)', 'Completez : Marie est ___ a Paris en 2001.', 'nee', ['ne', 'nes', 'nees'], 'Naitre with a feminine singular subject gives nee.', 'Naitre avec un sujet feminin singulier donne nee.'],
  ['Complete: Paul et Hugo sont ___ en train. (venir)', 'Completez : Paul et Hugo sont ___ en train.', 'venus', ['venu', 'venue', 'venues'], 'A masculine plural subject takes venus.', 'Un sujet masculin pluriel prend venus.'],
  ['Complete: Nous sommes ___ tres vite apres le cours. (retourner)', 'Completez : Nous sommes ___ tres vite apres le cours.', 'retournes', ['retourne', 'retournee', 'retournees'], 'A plural subject with etre takes the plural participle.', 'Un sujet pluriel avec etre prend le participe au pluriel.'],
])

const extraRows: QRow[] = [
  ...articlesReview,
  ...pluralAdjectiveReview,
  ...coreVerbReference,
  ...nominalisation,
  ...presentUses,
  ...imperativePronouns,
  ...truncation,
  ...negationVaried,
  ...prepositions,
  ...relativeQuiQueOu,
  ...focusCleft,
  ...pronounPlacement,
  ...yEnIntro,
  ...indefinites,
  ...interrogativePronouns,
  ...demonstrativePronouns,
  ...adverbs,
  ...gerondif,
  ...passeComposeAvoir,
  ...passeComposeEtre,
  ...pcImparfait,
  ...timeExpressions,
  ...passeRecent,
  ...futureSimple,
  ...siPresentFuture,
  ...obligationExpressions,
  ...conditionalPoliteness,
  ...reportedSpeech,
  ...comparative,
  ...superlative,
  ...connectors,
  ...modesRegister,
  ...passeComposeGeneral,
  ...imparfait,
  ...objectPronouns,
  ...partitiveArticles,
  ...quantities,
  ...reflexiveVerbs,
  ...pastParticipleAgreement,
]

export const curatedA2Questions: Question[] = extraRows.map(
  ([topicId, type, promptEn, promptFr, choices, correctAnswer, explanationEn, explanationFr], index) => ({
    id: `curated-a2-${topicId}-${index + 1}`,
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
