import type { ReadingExercise } from './types'

export const totemReadingExercises: ReadingExercise[] = [
  // A1 Exercises
  {
    id: 'totem-a1-reading-se-presenter',
    level: 'A1',
    title: 'Faisons connaissance',
    theme: 'Greetings & Identity',
    text: "Bonjour ! Je m'appelle Thomas. J'ai 25 ans et je suis canadien. J'habite à Montréal, mais j'étudie à Paris cette année. J'aime beaucoup la cuisine française et le cinéma. Dans ma classe de français, il y a dix étudiants de différentes nationalités. Notre professeur s'appelle Marie. Elle est très sympathique !",
    questions: [
      {
        id: 'a1-presenter-residence',
        prompt: 'Où habite Thomas cette année ?',
        choices: ['À Montréal', 'À Paris', 'À New York', 'À Ottawa'],
        correctAnswer: 'À Paris',
        explanation: "Le texte dit : \"J'habite à Montréal, mais j'étudie à Paris cette année.\""
      },
      {
        id: 'a1-presenter-nationalite',
        prompt: 'Quelle est la nationalité de Thomas ?',
        choices: ['Français', 'Américain', 'Canadien', 'Anglais'],
        correctAnswer: 'Canadien',
        explanation: "Thomas se présente : \"Je suis canadien.\""
      },
      {
        id: 'a1-presenter-professeur',
        prompt: 'Qui est Marie ?',
        choices: ['Une étudiante', 'La sœur de Thomas', 'La directrice', 'La professeur de français'],
        correctAnswer: 'La professeur de français',
        explanation: "Le texte indique : \"Notre professeur s'appelle Marie.\""
      }
    ]
  },
  {
    id: 'totem-a1-reading-vacances',
    level: 'A1',
    title: 'Une carte postale de Nice',
    theme: 'Travel & Leisure',
    text: "Salut Lucas ! Je t'écris de Nice. Il fait très beau et chaud. Je vais à la plage tous les matins. L'après-midi, je visite la ville et je mange des glaces délicieuses. Hier, je suis allé dans un petit restaurant près du port. J'adore les vacances ! À bientôt, Sophie.",
    questions: [
      {
        id: 'a1-vacances-meteo',
        prompt: 'Quel temps fait-il à Nice ?',
        choices: ['Il pleut', 'Il fait froid', 'Il fait très beau et chaud', 'Il y a du vent'],
        correctAnswer: 'Il fait très beau et chaud',
        explanation: "Sophie écrit : \"Il fait très beau et chaud.\""
      },
      {
        id: 'a1-vacances-matin',
        prompt: 'Que fait Sophie le matin ?',
        choices: ['Elle visite la ville', 'Elle va à la plage', 'Elle dort', 'Elle va au restaurant'],
        correctAnswer: 'Elle va à la plage',
        explanation: "Le texte précise : \"Je vais à la plage tous les matins.\""
      },
      {
        id: 'a1-vacances-destinataire',
        prompt: 'À qui Sophie écrit-elle ?',
        choices: ['À Lucas', 'À Thomas', 'À Marie', 'À son père'],
        correctAnswer: 'À Lucas',
        explanation: "La carte postale commence par : \"Salut Lucas !\""
      }
    ]
  },
  {
    id: 'totem-a1-reading-restaurant',
    level: 'A1',
    title: 'Au café de la Gare',
    theme: 'Food & Politeness',
    text: "Au café de la Gare, nous proposons des formules pour le déjeuner. La formule midi coûte 15 euros. Elle comprend un plat principal et une boisson ou un dessert. Aujourd'hui, comme plat, il y a du poulet rôti ou un poisson avec des légumes. Pour le dessert, vous pouvez choisir entre une tarte aux pommes et un café gourmand. Bon appétit !",
    questions: [
      {
        id: 'a1-resto-prix',
        prompt: 'Combien coûte la formule midi ?',
        choices: ['10 euros', '12 euros', '15 euros', '20 euros'],
        correctAnswer: '15 euros',
        explanation: "Le texte indique : \"La formule midi coûte 15 euros.\""
      },
      {
        id: 'a1-resto-plats',
        prompt: 'Quels sont les plats proposés aujourd’hui ?',
        choices: ['Du bœuf ou de la soupe', 'Une salade ou des pâtes', 'Du poulet rôti ou du poisson', 'Une pizza ou un burger'],
        correctAnswer: 'Du poulet rôti ou du poisson',
        explanation: "Le texte dit : \"il y a du poulet rôti ou un poisson avec des légumes.\""
      },
      {
        id: 'a1-resto-formule',
        prompt: 'Que comprend la formule midi en plus du plat ?',
        choices: ['Une entrée seulement', 'Une boisson et un dessert', 'Une boisson ou un dessert', 'Un café et un thé'],
        correctAnswer: 'Une boisson ou un dessert',
        explanation: "Le texte dit : \"Elle comprend un plat principal et une boisson ou un dessert.\""
      }
    ]
  },
  {
    id: 'totem-a1-reading-invitation',
    level: 'A1',
    title: 'Fête d’anniversaire',
    theme: 'Social Life',
    text: "Chers amis, je vous invite à fêter mon anniversaire le samedi 14 juin. La fête commence à 19h dans mon nouvel appartement, au 12 rue des Fleurs. Apportez votre bonne humeur ! Merci de confirmer votre présence avant le 10 juin. À très vite, Nicolas. PS : Le code de la porte d'entrée est le 24A8.",
    questions: [
      {
        id: 'a1-invit-date',
        prompt: 'Quand aura lieu la fête d’anniversaire ?',
        choices: ['Le samedi 10 juin', 'Le samedi 14 juin', 'Le dimanche 15 juin', 'Le vendredi 12 juin'],
        correctAnswer: 'Le samedi 14 juin',
        explanation: "Nicolas écrit : \"je vous invite à fêter mon anniversaire le samedi 14 juin.\""
      },
      {
        id: 'a1-invit-lieu',
        prompt: 'Où se déroule la fête ?',
        choices: ['Dans un restaurant', 'Dans un parc', 'Dans le nouvel appartement de Nicolas', 'Dans un café de la rue des Fleurs'],
        correctAnswer: 'Dans le nouvel appartement de Nicolas',
        explanation: "La fête se passe \"dans mon nouvel appartement, au 12 rue des Fleurs.\""
      },
      {
        id: 'a1-invit-confirmation',
        prompt: 'Quelle est la date limite pour confirmer ?',
        choices: ['Le 14 juin', 'Le 12 juin', 'Le 10 juin', 'Le 19 juin'],
        correctAnswer: 'Le 10 juin',
        explanation: "Le texte indique : \"Merci de confirmer votre présence avant le 10 juin.\""
      }
    ]
  },
  {
    id: 'totem-a1-reading-logement',
    level: 'A1',
    title: 'Appartement à louer',
    theme: 'Housing',
    text: "À louer : beau studio de 25 mètres carrés, situé dans le 5ème arrondissement de Paris, près du Panthéon. Il comprend une pièce principale lumineuse avec un lit simple et un bureau, une petite cuisine équipée, et une salle de bains moderne. Loyer : 750 euros par mois, charges comprises. Libre immédiatement. Idéal pour étudiant.",
    questions: [
      {
        id: 'a1-logement-taille',
        prompt: 'Quelle est la surface du logement ?',
        choices: ['15 m²', '20 m²', '25 m²', '35 m²'],
        correctAnswer: '25 m²',
        explanation: "L'annonce indique : \"beau studio de 25 mètres carrés\"."
      },
      {
        id: 'a1-logement-loyer',
        prompt: 'Quel est le prix du loyer par mois ?',
        choices: ['500 euros', '750 euros', '850 euros', '900 euros'],
        correctAnswer: '750 euros',
        explanation: "L'annonce mentionne : \"Loyer : 750 euros par mois\"."
      },
      {
        id: 'a1-logement-cible',
        prompt: 'Pour qui ce logement est-il particulièrement recommandé ?',
        choices: ['Une grande famille', 'Un étudiant', 'Un touriste de passage', 'Un couple avec enfants'],
        correctAnswer: 'Un étudiant',
        explanation: "L'annonce conclut par : \"Idéal pour étudiant.\""
      }
    ]
  },

  // A2 Exercises
  {
    id: 'totem-a2-reading-routine',
    level: 'A2',
    title: 'Ma vie quotidienne à Lyon',
    theme: 'Daily Routine',
    text: "Bienvenue sur mon blog ! Aujourd'hui, je vous parle de ma routine quotidienne. D'habitude, je me réveille à 6h30, mais je me lève à 7h. Je prends un café rapide en lisant les nouvelles. Ensuite, je me prépare et je pars au travail à 8h. Comme j'habite loin du bureau, je prends le métro puis le bus. Le soir, je rentre vers 19h. Je fais un peu de sport pour me détendre avant de préparer le dîner.",
    questions: [
      {
        id: 'a2-routine-lever',
        prompt: 'À quelle heure l’auteur se lève-t-il ?',
        choices: ['À 6h30', 'À 7h', 'À 8h', 'À 19h'],
        correctAnswer: 'À 7h',
        explanation: "Le texte dit : \"je me réveille à 6h30, mais je me lève à 7h.\""
      },
      {
        id: 'a2-routine-transport',
        prompt: 'Quels transports en commun utilise-t-il ?',
        choices: ['Le tramway et le bus', 'Le train et le taxi', 'Le métro et le bus', 'Le vélo et la voiture'],
        correctAnswer: 'Le métro et le bus',
        explanation: "L'auteur précise : \"je prends le métro puis le bus.\""
      },
      {
        id: 'a2-routine-sport',
        prompt: 'Pourquoi fait-il du sport le soir ?',
        choices: ['Pour perdre du poids', 'Pour s’entraîner pour un marathon', 'Pour se détendre', 'Pour passer le temps'],
        correctAnswer: 'Pour se détendre',
        explanation: "Le texte indique : \"Je fais un peu de sport pour me détendre avant de préparer le dîner.\""
      }
    ]
  },
  {
    id: 'totem-a2-reading-plainte',
    level: 'A2',
    title: 'Réclamation concernant un achat',
    theme: 'Shopping & Consumer Life',
    text: "Monsieur le Directeur, je vous écris pour signaler un problème avec ma commande numéro 8493. Le 5 mai, j'ai acheté un manteau bleu sur votre site internet. J'ai reçu le colis hier, mais l'article livré est un manteau noir en taille XL, alors que j'avais commandé une taille M. De plus, la fermeture éclair est cassée. Je souhaite retourner ce produit et obtenir un remboursement rapidement. Dans l'attente de votre réponse, veuillez agréer mes salutations distinguées. - Clara Dupont.",
    questions: [
      {
        id: 'a2-plainte-erreur',
        prompt: 'Quelle est la principale erreur de la livraison ?',
        choices: ['Le colis n’est pas arrivé.', 'Le prix était trop élevé.', 'L’article livré n’a pas la bonne couleur ni la bonne taille.', 'Le modèle est totalement différent.'],
        correctAnswer: 'L’article livré n’a pas la bonne couleur ni la bonne taille.',
        explanation: "Clara explique : \"l'article livré est un manteau noir en taille XL, alors que j'avais commandé une taille M.\""
      },
      {
        id: 'a2-plainte-defaut',
        prompt: 'Quel défaut physique présente le vêtement reçu ?',
        choices: ['Il a un trou.', 'Il manque un bouton.', 'La fermeture éclair est cassée.', 'Le tissu est déchiré.'],
        correctAnswer: 'La fermeture éclair est cassée.',
        explanation: "Le texte mentionne : \"De plus, la fermeture éclair est cassée.\""
      },
      {
        id: 'a2-plainte-solution',
        prompt: 'Que demande Clara Dupont ?',
        choices: ['Un échange standard', 'Un bon d’achat', 'Un remboursement et le retour du produit', 'Un cadeau de compensation'],
        correctAnswer: 'Un remboursement et le retour du produit',
        explanation: "Elle écrit : \"Je souhaite retourner ce produit et obtenir un remboursement rapidement.\""
      }
    ]
  },
  {
    id: 'totem-a2-reading-voyage',
    level: 'A2',
    title: 'Un voyage mouvementé',
    theme: 'Travel',
    text: "Le week-end dernier, Paul a décidé de rendre visite à sa sœur à Marseille. Malheureusement, son voyage a mal commencé. D'abord, il a raté son train de 8h à cause d'une panne de réveil. Il a dû acheter un autre billet pour le train suivant. Pendant le trajet, le train s'est arrêté pendant une heure au milieu de nulle part en raison d'un problème technique. Paul est arrivé à destination avec trois heures de retard, fatigué mais content d'être enfin là.",
    questions: [
      {
        id: 'a2-voyage-depart',
        prompt: 'Pourquoi Paul a-t-il raté son premier train ?',
        choices: ['Il y avait des embouteillages.', 'Son réveil n’a pas sonné.', 'Le métro était en grève.', 'Il s’est trompé de gare.'],
        correctAnswer: 'Son réveil n’a pas sonné.',
        explanation: "Le texte précise que c'est \"à cause d'une panne de réveil\"."
      },
      {
        id: 'a2-voyage-panne',
        prompt: 'Que s’est-il passé pendant le trajet ?',
        choices: ['Paul a perdu sa valise.', 'Le train a eu un problème technique.', 'Le contrôleur a confisqué son billet.', 'Il y a eu une tempête.'],
        correctAnswer: 'Le train a eu un problème technique.',
        explanation: "Le texte dit : \"le train s'est arrêté... en raison d'un problème technique.\""
      },
      {
        id: 'a2-voyage-retard',
        prompt: 'Avec combien de retard Paul est-il arrivé ?',
        choices: ['Une heure', 'Deux heures', 'Trois heures', 'Quatre heures'],
        correctAnswer: 'Trois heures',
        explanation: "Le texte indique : \"Paul est arrivé à destination avec trois heures de retard\"."
      }
    ]
  },
  {
    id: 'totem-a2-reading-evenement',
    level: 'A2',
    title: 'La Fête de la Musique à Strasbourg',
    theme: 'Culture & Entertainment',
    text: "La semaine dernière, Strasbourg a célébré la Fête de la Musique. Malgré le ciel nuageux, des milliers d'habitants et de touristes ont envahi les rues et les places du centre-ville. De nombreux groupes de musiciens amateurs et professionnels ont joué des styles variés : du jazz, du rock et de la musique classique. Les concerts étaient entièrement gratuits. L'événement s'est terminé vers minuit dans une ambiance très festive et chaleureuse.",
    questions: [
      {
        id: 'a2-even-meteo',
        prompt: 'Quel temps faisait-il ce jour-là ?',
        choices: ['Il pleuvait fort.', 'Il faisait un grand soleil.', 'Le ciel était nuageux.', 'Il neigeait.'],
        correctAnswer: 'Le ciel était nuageux.',
        explanation: "Le texte mentionne : \"Malgré le ciel nuageux\"."
      },
      {
        id: 'a2-even-prix',
        prompt: 'Quel était le prix d’entrée pour les concerts ?',
        choices: ['10 euros', 'C’était gratuit.', 'Le prix variait selon les groupes.', '5 euros par place.'],
        correctAnswer: 'C’était gratuit.',
        explanation: "Le texte dit explicitement : \"Les concerts étaient entièrement gratuits.\""
      },
      {
        id: 'a2-even-heure',
        prompt: 'À quelle heure l’événement s’est-il terminé ?',
        choices: ['À 22h', 'À minuit', 'À 2h du matin', 'À l’aube'],
        correctAnswer: 'À minuit',
        explanation: "Le texte précise : \"L'événement s'est terminé vers minuit\"."
      }
    ]
  },
  {
    id: 'totem-a2-reading-email-amis',
    level: 'A2',
    title: 'Invitation à dîner',
    theme: 'Social Interaction',
    text: "Salut Marc, j'espère que tu vas bien. Est-ce que tu es libre vendredi soir prochain ? J'organise un petit dîner chez moi pour fêter mon nouveau travail. Nous serons six ou sept personnes. Je vais préparer un plat italien. Si tu as des restrictions alimentaires (végétarien, allergies...), dis-le-moi. N'hésite pas à apporter une bouteille de vin ou un dessert si tu veux. Confirme-moi si tu peux venir avant mercredi. À bientôt, Léo.",
    questions: [
      {
        id: 'a2-email-occasion',
        prompt: 'Quelle est l’occasion de ce dîner ?',
        choices: ['Un anniversaire', 'Le départ d’un collègue', 'L’obtention d’un nouveau travail', 'Une pendaison de crémaillère'],
        correctAnswer: 'L’obtention d’un nouveau travail',
        explanation: "Léo écrit : \"J'organise un petit dîner chez moi pour fêter mon nouveau travail.\""
      },
      {
        id: 'a2-email-plat',
        prompt: 'Quel type de cuisine Léo va-t-il préparer ?',
        choices: ['Française', 'Italienne', 'Espagnole', 'Japonaise'],
        correctAnswer: 'Italienne',
        explanation: "Léo mentionne : \"Je vais préparer un plat italien.\""
      },
      {
        id: 'a2-email-reponse',
        prompt: 'Avant quel jour Marc doit-il répondre ?',
        choices: ['Vendredi', 'Mercredi', 'Lundi', 'Samedi'],
        correctAnswer: 'Mercredi',
        explanation: "Le texte dit : \"Confirme-moi si tu peux venir avant mercredi.\""
      }
    ]
  },

  // B1 Exercises
  {
    id: 'totem-b1-reading-reseaux',
    level: 'B1',
    title: 'L’impact des réseaux sociaux',
    theme: 'Technology & Society',
    text: "L'utilisation des réseaux sociaux a profondément modifié nos relations humaines. Bien que ces plateformes permettent de garder facilement contact avec des amis éloignés, elles favorisent parfois l'isolement social et la comparaison constante avec les autres. Plusieurs études montrent que passer trop de temps en ligne nuit à la santé mentale des jeunes. À mon avis, il est nécessaire d'apprendre à déconnecter régulièrement afin de préserver des interactions réelles, chaleureuses et authentiques.",
    questions: [
      {
        id: 'b1-reseaux-probleme',
        prompt: 'Quel est l’un des effets négatifs des réseaux sociaux signalés dans le texte ?',
        choices: ['Le coût élevé d’accès', 'La perte d’anciens contacts', 'L’isolement social et la comparaison constante', 'La réduction de l’utilisation du téléphone'],
        correctAnswer: 'L’isolement social et la comparaison constante',
        explanation: "Le texte dit qu'elles \"favorisent parfois l'isolement social et la comparaison constante avec les autres.\""
      },
      {
        id: 'b1-reseaux-conseil',
        prompt: 'Quel conseil l’auteur formule-t-il à la fin ?',
        choices: ['Supprimer tous ses comptes sociaux', 'Déconnecter régulièrement', 'Écrire des lettres papier', 'Limiter son accès uniquement le week-end'],
        correctAnswer: 'Déconnecter régulièrement',
        explanation: "L'auteur écrit : \"il est nécessaire d'apprendre à déconnecter régulièrement\"."
      },
      {
        id: 'b1-reseaux-connecteur',
        prompt: 'Quel rapport logique exprime le connecteur “Bien que” dans le texte ?',
        choices: ['Une cause', 'Une conséquence', 'Une concession ou opposition', 'Une condition'],
        correctAnswer: 'Une concession ou opposition',
        explanation: "\"Bien que\" introduit une idée opposée ou une concession par rapport à la proposition principale."
      }
    ]
  },
  {
    id: 'totem-b1-reading-travail',
    level: 'B1',
    title: 'Candidature pour un poste',
    theme: 'Work & Career',
    text: "Objet : Candidature au poste de chef de projet. Madame, Monsieur, je me permets de vous adresser ma candidature pour le poste mentionné. Diplômé d'un Master en commerce international, j'ai acquis une expérience de trois ans dans le domaine du marketing numérique. Votre entreprise, réputée pour ses projets innovants, correspond parfaitement à mes aspirations professionnelles. Rigoureux et doté d'un bon esprit d'équipe, je serais ravi de mettre mes compétences à votre service. Je reste à votre entière disposition pour un entretien.",
    questions: [
      {
        id: 'b1-travail-poste',
        prompt: 'Pour quel poste le candidat postule-t-il ?',
        choices: ['Directeur commercial', 'Chef de projet', 'Responsable ressources humaines', 'Développeur web'],
        correctAnswer: 'Chef de projet',
        explanation: "L'objet de la lettre est : \"Candidature au poste de chef de projet.\""
      },
      {
        id: 'b1-travail-diplome',
        prompt: 'Quel est le diplôme du candidat ?',
        choices: ['Un Master en marketing', 'Une Licence de langues', 'Un Master en commerce international', 'Un Doctorat en informatique'],
        correctAnswer: 'Un Master en commerce international',
        explanation: "Le candidat écrit : \"Diplômé d'un Master en commerce international\"."
      },
      {
        id: 'b1-travail-qualites',
        prompt: 'Quelles qualités le candidat s’attribue-t-il ?',
        choices: ['Créatif et autonome', 'Rigoureux et travailleur en équipe', 'Patient et calme', 'Flexible et bilingue'],
        correctAnswer: 'Rigoureux et travailleur en équipe',
        explanation: "Il s'auto-décrit comme : \"Rigoureux et doté d'un bon esprit d'équipe\"."
      }
    ]
  },
  {
    id: 'totem-b1-reading-environnement',
    level: 'B1',
    title: 'Le tourisme durable : une nécessité',
    theme: 'Travel & Ethics',
    text: "Le tourisme est une source économique importante pour de nombreux pays, mais son impact environnemental inquiète de plus en plus. Le transport aérien et la construction d'hôtels massifs dégradent les écosystèmes locaux. Face à cette situation, le concept de tourisme durable se développe. Il encourage les voyageurs à réduire leur empreinte carbone, à respecter la culture locale et à soutenir l'économie de proximité. Ainsi, voyager devient une expérience éthique et enrichissante.",
    questions: [
      {
        id: 'b1-enviro-inquietude',
        prompt: 'Pourquoi le tourisme traditionnel suscite-t-il des inquiétudes ?',
        choices: ['Parce qu’il coûte trop cher.', 'Parce qu’il dégrade l’environnement local.', 'Parce que les transports sont lents.', 'Parce que les touristes ne dépensent pas assez.'],
        correctAnswer: 'Parce qu’il dégrade l’environnement local.',
        explanation: "Le texte mentionne : \"Le transport aérien et la construction d'hôtels massifs dégradent les écosystèmes locaux.\""
      },
      {
        id: 'b1-enviro-but',
        prompt: 'Qu’encourage le tourisme durable chez les voyageurs ?',
        choices: ['Voyager uniquement en train', 'Acheter des souvenirs industriels', 'Réduire leur empreinte carbone et soutenir l’économie de proximité', 'Rester moins longtemps sur place'],
        correctAnswer: 'Réduire leur empreinte carbone et soutenir l’économie de proximité',
        explanation: "Le texte indique qu'il encourage à \"réduire leur empreinte carbone, à respecter la culture locale et à soutenir l'économie de proximité\"."
      },
      {
        id: 'b1-enviro-conclusion',
        prompt: 'Selon l’auteur, que devient le voyage grâce au tourisme durable ?',
        choices: ['Une corvée', 'Une expérience de luxe', 'Une aventure dangereuse', 'Une expérience éthique et enrichissante'],
        correctAnswer: 'Une expérience éthique et enrichissante',
        explanation: "La dernière phrase conclut : \"Ainsi, voyager devient une expérience éthique et enrichissante.\""
      }
    ]
  },
  {
    id: 'totem-b1-reading-culture',
    level: 'B1',
    title: 'Critique de film : Un destin extraordinaire',
    theme: 'Culture & Arts',
    text: "Le dernier long-métrage du réalisateur français Antoine Laurent est un chef-d'œuvre. Ce film raconte l'histoire vraie d'un jeune pianiste aveugle qui surmonte tous les obstacles pour jouer dans les plus grandes salles du monde. Les acteurs principaux sont incroyablement talentueux, et la musique originale est bouleversante. Bien que le scénario soit parfois prévisible, l'émotion reste intense jusqu'à la dernière scène. C'est sans doute l'un des meilleurs films de l'année, à ne pas rater.",
    questions: [
      {
        id: 'b1-critique-sujet',
        prompt: 'De quoi traite le scénario de ce film ?',
        choices: ['De l’histoire d’un compositeur de jazz à New York', 'D’un pianiste aveugle qui réussit malgré les obstacles', 'D’un drame familial à Paris', 'D’un mystère policier au conservatoire'],
        correctAnswer: 'D’un pianiste aveugle qui réussit malgré les obstacles',
        explanation: "Le texte explique que le film raconte \"l'histoire vraie d'un jeune pianiste aveugle qui surmonte tous les obstacles\"."
      },
      {
        id: 'b1-critique-defaut',
        prompt: 'Quel reproche l’auteur fait-il parfois au scénario ?',
        choices: ['Il est ennuyeux.', 'Il est trop violent.', 'Il est prévisible par moments.', 'Il est trop complexe.'],
        correctAnswer: 'Il est prévisible par moments.',
        explanation: "La critique relève : \"Bien que le scénario soit parfois prévisible\"."
      },
      {
        id: 'b1-critique-verdict',
        prompt: 'Quelle est l’opinion globale de la critique sur le film ?',
        choices: ['C’est un échec artistique.', 'C’est un chef-d’œuvre à ne pas manquer.', 'C’est un film moyen destiné au jeune public.', 'C’est une musique sans intérêt.'],
        correctAnswer: 'C’est un chef-d’œuvre à ne pas manquer.',
        explanation: "L'auteur qualifie le film de \"chef-d'œuvre\" et conclut qu'il s'agit de \"l'un des meilleurs films de l'année, à ne pas rater.\""
      }
    ]
  },
  {
    id: 'totem-b1-reading-science',
    level: 'B1',
    title: 'L’intelligence artificielle au service de la médecine',
    theme: 'Technology & Wellness',
    text: "Des chercheurs européens ont mis au point un algorithme d'intelligence artificielle capable de détecter des maladies graves avec une précision inédite. Grâce à l'analyse rapide de milliers d'images médicales, cet outil aide les médecins à poser un diagnostic plus précoce et précis. Cependant, les experts rappellent que la technologie ne remplacera pas le jugement clinique humain. L'objectif est de collaborer : l'algorithme propose une analyse objective, et le médecin prend la décision thérapeutique finale.",
    questions: [
      {
        id: 'b1-science-fonction',
        prompt: 'En quoi consiste l’outil développé par les chercheurs ?',
        choices: ['En un robot chirurgien autonome', 'En un algorithme d’IA pour analyser les images médicales', 'En un nouveau médicament électronique', 'En une application de prise de rendez-vous'],
        correctAnswer: 'En un algorithme d’IA pour analyser les images médicales',
        explanation: "Le texte présente \"un algorithme d'intelligence artificielle capable de détecter des maladies... Grâce à l'analyse rapide de milliers d'images médicales\"."
      },
      {
        id: 'b1-science-limite',
        prompt: 'D’après les experts, quelle est la limite de cet outil ?',
        choices: ['Il fait trop d’erreurs de diagnostic.', 'Il coûte trop cher pour les hôpitaux.', 'Il ne remplace pas le jugement clinique humain.', 'Il est réservé uniquement à la recherche.'],
        correctAnswer: 'Il ne remplace pas le jugement clinique humain.',
        explanation: "Le texte affirme que \"les experts rappellent que la technologie ne remplacera pas le jugement clinique humain.\""
      },
      {
        id: 'b1-science-relation',
        prompt: 'Quel type de relation est envisagé entre le médecin et l’IA ?',
        choices: ['Une concurrence directe', 'Une indépendance absolue', 'Une collaboration stratégique', 'Une soumission du médecin'],
        correctAnswer: 'Une collaboration stratégique',
        explanation: "Le texte dit : \"L'objectif est de collaborer : l'algorithme propose une analyse objective, et le médecin prend la décision thérapeutique finale.\""
      }
    ]
  }
]
