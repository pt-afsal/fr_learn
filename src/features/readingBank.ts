import type { LearningLevel, ReadingExercise } from '../types'

interface Scenario {
  theme: string
  title: string
  place: string
  activity: string
  detail: string
  reason: string
}

const a1Scenarios: Scenario[] = [
  { theme: 'Daily life', title: 'Le matin de Camille', place: 'à Lyon', activity: 'prend le bus à huit heures', detail: 'Elle boit un café et mange du pain', reason: 'aller au travail' },
  { theme: 'Shopping', title: 'Au marché', place: 'au marché de Nantes', activity: 'achète des tomates et du fromage', detail: 'Le fromage coûte cinq euros', reason: 'préparer le dîner' },
  { theme: 'Housing', title: 'Mon appartement', place: 'près de Lille', activity: 'habite dans un petit appartement', detail: 'Il y a une chambre, une cuisine et un balcon', reason: 'être près de son école' },
  { theme: 'Transport', title: 'Le trajet de Sami', place: 'à Strasbourg', activity: 'va à la gare à vélo', detail: 'Son train part à neuf heures quinze', reason: 'visiter sa sœur' },
  { theme: 'Food', title: 'Un déjeuner simple', place: 'dans un café à Toulouse', activity: 'commande une salade et une eau gazeuse', detail: 'Le serveur apporte aussi du pain', reason: 'déjeuner avec une amie' },
  { theme: 'Hobbies', title: 'Le samedi de Zoé', place: 'au parc de Dijon', activity: 'joue au badminton', detail: 'Elle retrouve deux amis à quatorze heures', reason: 'faire du sport' },
  { theme: 'Family', title: 'La famille de Hugo', place: 'à Rennes', activity: 'rend visite à ses parents', detail: 'Sa mère prépare un gâteau au chocolat', reason: 'fêter un anniversaire' },
  { theme: 'Weather', title: 'Une journée de pluie', place: 'à Brest', activity: 'reste à la maison', detail: 'Il lit un livre et écoute de la musique', reason: 'éviter la pluie' },
  { theme: 'Appointments', title: 'Chez le médecin', place: 'dans un cabinet à Paris', activity: 'arrive à dix heures', detail: 'La secrétaire demande son nom', reason: 'parler de son rhume' },
  { theme: 'Travel', title: 'Un week-end à Nice', place: 'près de la mer', activity: 'se promène sur la plage', detail: 'Elle prend beaucoup de photos', reason: 'profiter du soleil' },
]

const a2Scenarios: Scenario[] = [
  { theme: 'Daily life', title: 'Une nouvelle routine', place: 'à Grenoble', activity: 'a commencé un nouveau travail', detail: 'Chaque matin, elle prend le tramway et répond à ses messages pendant le trajet', reason: 'mieux organiser sa journée' },
  { theme: 'Travel', title: 'Un train annulé', place: 'à la gare de Bordeaux', activity: 'a attendu un train pour Marseille', detail: 'Le train a été annulé à cause d’un problème technique', reason: 'trouver une autre solution' },
  { theme: 'Health', title: 'Prendre rendez-vous', place: 'dans un centre médical à Orsay', activity: 'a téléphoné pour obtenir un rendez-vous', detail: 'La secrétaire lui a proposé jeudi matin ou vendredi après-midi', reason: 'consulter rapidement un médecin' },
  { theme: 'Shopping', title: 'Un colis incorrect', place: 'chez elle à Montpellier', activity: 'a reçu une paire de chaussures', detail: 'La boîte contenait la mauvaise taille et une couleur différente', reason: 'demander un échange' },
  { theme: 'Housing', title: 'Chercher un studio', place: 'près de l’université de Caen', activity: 'a visité trois appartements', detail: 'Le deuxième était plus lumineux mais aussi plus cher', reason: 'choisir un logement pratique' },
  { theme: 'Food', title: 'Un dîner entre amis', place: 'dans un restaurant à Annecy', activity: 'a réservé une table pour quatre personnes', detail: 'Le groupe a partagé des spécialités régionales avant de commander un dessert', reason: 'célébrer une bonne nouvelle' },
  { theme: 'Work', title: 'Une semaine chargée', place: 'dans une petite entreprise à Rouen', activity: 'a préparé une présentation importante', detail: 'Elle travaillait sur les dernières diapositives quand son collègue lui a proposé son aide', reason: 'terminer avant la réunion' },
  { theme: 'Culture', title: 'Une visite au musée', place: 'au musée d’Orsay', activity: 'a découvert une exposition de peinture', detail: 'Il y avait beaucoup de visiteurs, mais l’ambiance restait agréable', reason: 'mieux connaître l’art français' },
  { theme: 'Environment', title: 'Aller au travail autrement', place: 'dans le centre de Tours', activity: 'a remplacé sa voiture par un vélo électrique', detail: 'Au début, le trajet semblait long, mais il est devenu plus facile après quelques semaines', reason: 'réduire ses dépenses et moins polluer' },
  { theme: 'Hobbies', title: 'Reprendre le sport', place: 'dans une salle près de Versailles', activity: 's’est inscrite à un cours collectif', detail: 'Elle avait arrêté le sport pendant plusieurs mois et voulait reprendre progressivement', reason: 'retrouver de l’énergie' },
]

const b1Scenarios: Scenario[] = [
  { theme: 'Work', title: 'Le télétravail au quotidien', place: 'dans une entreprise de conseil à Paris', activity: 'a adopté deux jours de télétravail par semaine', detail: 'Les salariés apprécient le temps gagné dans les transports, même si certains regrettent les échanges spontanés au bureau', reason: 'trouver un meilleur équilibre' },
  { theme: 'Environment', title: 'Une rue sans voitures', place: 'dans le centre de Nantes', activity: 'a transformé une rue commerçante en zone piétonne', detail: 'Les commerçants étaient d’abord inquiets, mais la fréquentation a progressivement augmenté', reason: 'améliorer la qualité de l’air' },
  { theme: 'Education', title: 'Apprendre une langue en ligne', place: 'dans une association de Lille', activity: 'a lancé des ateliers hybrides de français', detail: 'Les participants peuvent réviser à distance puis pratiquer la conversation en petit groupe', reason: 'rendre les cours plus accessibles' },
  { theme: 'Housing', title: 'Partager un logement', place: 'près de l’université de Rennes', activity: 'a choisi la colocation intergénérationnelle', detail: 'Elle paie un loyer réduit et aide une personne âgée pour quelques tâches simples', reason: 'créer un échange utile pour chacun' },
  { theme: 'Culture', title: 'Un festival local', place: 'dans une petite ville de Provence', activity: 'a organisé un festival de cinéma en plein air', detail: 'Les habitants ont participé à la programmation et plusieurs réalisateurs sont venus discuter avec le public', reason: 'faire vivre la culture locale' },
  { theme: 'Transport', title: 'Le vélo pour les trajets courts', place: 'dans la métropole de Strasbourg', activity: 'a créé de nouvelles pistes cyclables', detail: 'La circulation reste parfois difficile aux heures de pointe, mais davantage d’habitants utilisent désormais le vélo', reason: 'proposer une alternative à la voiture' },
  { theme: 'Health', title: 'Mieux dormir', place: 'dans un centre de santé à Bordeaux', activity: 'a proposé un atelier sur le sommeil', detail: 'Les participants apprennent à limiter les écrans le soir et à conserver des horaires réguliers', reason: 'prévenir la fatigue chronique' },
  { theme: 'Technology', title: 'Une application solidaire', place: 'dans une start-up à Lyon', activity: 'a développé une application contre le gaspillage alimentaire', detail: 'Les magasins publient leurs invendus et les utilisateurs réservent des paniers à prix réduit', reason: 'éviter de jeter des produits encore consommables' },
  { theme: 'Travel', title: 'Voyager plus lentement', place: 'sur une ligne ferroviaire européenne', activity: 'a préféré le train à l’avion pour ses vacances', detail: 'Le trajet était plus long, mais il a découvert plusieurs villes en chemin et réduit son empreinte carbone', reason: 'adopter une autre manière de voyager' },
  { theme: 'Community', title: 'Un jardin partagé', place: 'dans un quartier de Toulouse', activity: 'a ouvert un jardin collectif', detail: 'Les habitants cultivent des légumes, organisent des ateliers et apprennent à mieux se connaître', reason: 'renforcer les liens entre voisins' },
]

const names = ['Camille', 'Nora', 'Sami', 'Élodie', 'Hugo', 'Maya', 'Thomas', 'Inès', 'Lucas', 'Sara']
const weekdays = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche']

function createExercise(level: LearningLevel, scenario: Scenario, index: number): ReadingExercise {
  const person = names[index % names.length]
  const day = weekdays[(index * 3) % weekdays.length]
  const id = `offline-${level.toLowerCase()}-${String(index + 1).padStart(2, '0')}`
  if (level === 'A1') {
    return {
      id,
      level,
      title: `${scenario.title} · ${person}`,
      theme: scenario.theme,
      text: `${person} habite ${scenario.place}. Le ${day}, ${person} ${scenario.activity}. ${scenario.detail}. Cette activité est importante pour ${scenario.reason}. Après, ${person} rentre tranquillement à la maison.`,
      questions: [
        { id: `${id}-q1`, prompt: `Où est ${person} ?`, choices: [scenario.place, 'à Marseille', 'dans un avion', 'à la montagne'], correctAnswer: scenario.place, explanation: `Le texte indique : « ${scenario.place} ».` },
        { id: `${id}-q2`, prompt: `Que fait ${person} ?`, choices: [scenario.activity, 'regarde la télévision toute la journée', 'prend un avion', 'ne fait rien'], correctAnswer: scenario.activity, explanation: `Le texte précise que ${person} ${scenario.activity}.` },
        { id: `${id}-q3`, prompt: `Pourquoi cette activité est-elle importante ?`, choices: [scenario.reason, 'acheter une voiture', 'changer de pays', 'dormir au bureau'], correctAnswer: scenario.reason, explanation: `Le texte donne la raison : ${scenario.reason}.` },
      ],
      grammarTags: ['présent', 'vocabulaire quotidien'],
      estimatedMinutes: 12,
    }
  }
  if (level === 'A2') {
    return {
      id,
      level,
      title: `${scenario.title} · expérience de ${person}`,
      theme: scenario.theme,
      text: `Le ${day}, ${person} ${scenario.activity} ${scenario.place}. ${scenario.detail}. Comme ${person} voulait ${scenario.reason}, il fallait prendre une décision rapidement. Finalement, la situation s’est bien terminée et ${person} a retenu une leçon utile pour la prochaine fois.`,
      questions: [
        { id: `${id}-q1`, prompt: `Quel est le sujet principal du texte ?`, choices: [scenario.activity, 'une recette compliquée', 'une compétition sportive internationale', 'un cours de musique'], correctAnswer: scenario.activity, explanation: `Le début du texte présente l’action principale.` },
        { id: `${id}-q2`, prompt: `Quel détail est mentionné ?`, choices: [scenario.detail, 'Le lieu était complètement fermé', 'Personne ne voulait aider', 'Le voyage a duré trois semaines'], correctAnswer: scenario.detail, explanation: `Ce détail est explicitement donné dans le texte.` },
        { id: `${id}-q3`, prompt: `Quel était l’objectif de ${person} ?`, choices: [scenario.reason, 'éviter ses amis', 'annuler toutes ses activités', 'acheter un ordinateur'], correctAnswer: scenario.reason, explanation: `Le texte explique que ${person} voulait ${scenario.reason}.` },
        { id: `${id}-q4`, prompt: `Comment la situation se termine-t-elle ?`, choices: ['Plutôt bien', 'Très mal', 'Le texte ne donne aucune indication', 'Par une dispute'], correctAnswer: 'Plutôt bien', explanation: 'Le texte dit que la situation s’est bien terminée.' },
      ],
      grammarTags: ['passé composé', 'imparfait', 'connecteurs simples'],
      estimatedMinutes: 18,
    }
  }
  return {
    id,
    level,
    title: `${scenario.title} · réflexion de ${person}`,
    theme: scenario.theme,
    text: `Depuis plusieurs mois, ${person} observe une évolution intéressante ${scenario.place}. L’organisation locale ${scenario.activity}. ${scenario.detail}. Cette initiative n’est pas parfaite : elle demande du temps, des moyens et parfois un changement d’habitudes. Néanmoins, ${person} considère qu’elle mérite d’être poursuivie afin de ${scenario.reason}. Selon ${person}, les solutions durables fonctionnent mieux lorsque les habitants comprennent leur utilité et participent progressivement à leur mise en place.`,
    questions: [
      { id: `${id}-q1`, prompt: 'Quelle initiative est présentée ?', choices: [scenario.activity, 'La fermeture définitive de toutes les écoles', 'Une campagne publicitaire nationale', 'Un concours de cuisine'], correctAnswer: scenario.activity, explanation: 'L’initiative apparaît au début du texte.' },
      { id: `${id}-q2`, prompt: 'Quelle nuance l’auteur apporte-t-il ?', choices: ['L’initiative nécessite des efforts et des changements d’habitudes', 'L’initiative ne coûte rien', 'Tout le monde est immédiatement d’accord', 'Aucune difficulté n’est mentionnée'], correctAnswer: 'L’initiative nécessite des efforts et des changements d’habitudes', explanation: 'Le texte insiste sur les contraintes avant de défendre le projet.' },
      { id: `${id}-q3`, prompt: 'Quel objectif est recherché ?', choices: [scenario.reason, 'augmenter le trafic routier', 'éviter toute participation locale', 'réduire le nombre de voisins'], correctAnswer: scenario.reason, explanation: 'L’objectif est introduit par « afin de ».' },
      { id: `${id}-q4`, prompt: 'Selon le texte, qu’est-ce qui facilite une solution durable ?', choices: ['La compréhension et la participation progressive des habitants', 'Une décision prise sans explication', 'L’absence totale de débat', 'Un changement imposé en une journée'], correctAnswer: 'La compréhension et la participation progressive des habitants', explanation: 'La dernière phrase formule clairement cette idée.' },
    ],
    grammarTags: ['opinion', 'concession', 'cause et conséquence'],
    estimatedMinutes: 24,
  }
}

function generateLevel(level: LearningLevel, count: number, scenarios: Scenario[]) {
  return Array.from({ length: count }, (_, index) => createExercise(level, scenarios[index % scenarios.length], index))
}

/**
 * A deterministic, offline-first bank: 30 A1 + 35 A2 + 35 B1 exercises.
 * It gives the app useful material even when Ollama is disabled.
 */
export const offlineReadingBank: ReadingExercise[] = [
  ...generateLevel('A1', 30, a1Scenarios),
  ...generateLevel('A2', 35, a2Scenarios),
  ...generateLevel('B1', 35, b1Scenarios),
]
