/* ==========================================================================
   CONTENU DU PORTFOLIO — c'est le seul fichier à modifier pour ajouter un projet.
   Les textes entre [crochets] sont des espaces réservés à remplacer.
   ========================================================================== */
window.PORTFOLIO = {

  identite: {
    nom: "Gabriel Lecerf",
    naissance: "2005-06-12", // l'âge affiché se met à jour tout seul
    accroche: "IA · 3D · Animation · Jeu vidéo · Automatisation",
    // phrase d'accroche affichée juste sous le nom
    intro: "Grâce à l'IA, j'ai concrétisé ce que j'ai appris pendant mes études, et j'ai développé en quelques mois des compétences que je ne maîtrisais pas du tout avant.",
    email: "gabriel.lecerf1206@gmail.com",
    liens: [ { label: "ArtStation", url: "https://www.artstation.com/gabriel_lecerf" } ]
  },

  /* ----- 1. MODÈLES 3D ---------------------------------------------------
     type "modele3d" : vrai modèle 3D (GLB) qui tourne avec le défilement ; "etapes" = textes qui passent à côté
     type "objet"    : galerie d'images + bloc « à venir »                                                     */
  modeles3d: [
    {
      id: "maison",
      type: "modele3d",
      glb: "media/maisons/3d/maison.glb", echelle: 1.45,
      titre: "Maison aux volets bleus",
      sousTitre: "Maison et jardin · Blender · Cycles",
      motFond: "PIERRE",
      etapes: [
        ["Fidèle au réel", "Pour coller au plus près de ce qu'attendait le client, la maison est reconstruite d'après des photos et des mesures précises."],
        ["Blender + IA", "J'ai connecté l'IA à Blender : elle modifie le modèle directement dans le logiciel, et je la dirige avec mes compétences en 3D."],
        ["Tout se modifie", "Le jardin, l'environnement, une couleur de volet, un détail de façade : chaque élément se change facilement, à la demande du client."]
      ],
      description: [
        "Une maison bretonne en pierre et son jardin, reconstitués à taille réelle. Pour ressembler le plus possible à ce qu'attendait le client, je me suis appuyé sur des photos et des vues précises de la vraie maison.",
        "Grâce à mes compétences sur Blender et à l'IA, j'ai relié les deux : l'IA agit directement dans le logiciel pour modifier le modèle, et je la guide jusqu'au résultat voulu.",
        "J'ai fait évoluer la maison au fil des demandes du client. Tout reste modifiable : l'environnement, la saison, les couleurs ou n'importe quelle partie de la maison."
      ],
      chiffres: [["14,82 m", "de façade"], ["Maison", "+ jardin"], ["7", "points de vue calés sur photo"], ["100 %", "modifiable"]],
      tags: ["Blender", "IA connectée à Blender", "Cycles", "three.js"],
      coulisses: [
        { src: "media/maisons/blender/maison_solide.jpg", legende: "La scène complète dans Blender" },
        { src: "media/maisons/blender/maison_materiaux.jpg", legende: "Aperçu des matériaux" }
      ],
      video: null
    },
    {
      id: "longere",
      type: "modele3d",
      glb: "media/maisons/3d/longere.glb", echelle: 1.45,
      titre: "Maison aux volets rouges",
      sousTitre: "Maison, jardin et dépendances · Blender · Cycles",
      motFond: "LONGÈRE",
      etapes: [
        ["20 photos", "Une longère de 18,6 m reconstruite d'après 20 photos et une vue aérienne, pour coller exactement à la vraie maison."],
        ["Une scène entière", "La maison, les carports, l'appentis, le fournil, les murets et le jardin, ajustés au fil des demandes du client."],
        ["L'environnement change", "« Novembre pluvieux » ou « printemps ensoleillé » : l'ambiance, comme chaque endroit de la maison, se change très facilement."]
      ],
      description: [
        "La longère avec ses carports, son appentis, le fournil, les murets et le jardin. Pour ressembler au plus près à ce qu'attendait le client, la scène s'appuie sur 20 photos de référence et une vue aérienne.",
        "J'ai connecté l'IA à Blender : elle applique les modifications directement sur le modèle, et je vérifie chaque rendu. Une cuisine a ainsi été ajoutée derrière la porte, à la demande du client.",
        "L'environnement, la saison ou n'importe quelle partie de la maison peuvent être changés sur demande, sans tout refaire."
      ],
      chiffres: [["18,6 m", "de longère"], ["20", "photos de référence"], ["2", "ambiances au choix"], ["40 s", "de vidéo (accélérée ×2)"]],
      tags: ["Blender", "IA connectée à Blender", "Cycles", "three.js"],
      coulisses: [
        { src: "media/maisons/blender/longere_solide.jpg", legende: "La scène dans Blender" },
        { src: "media/maisons/blender/longere_materiaux.jpg", legende: "Aperçu des matériaux" }
      ],
      // vidéo déjà accélérée ×2 au montage (80 s -> 40 s), lue en boucle sans clic
      video: { src: "media/maisons/longere_presentation.mp4", mobile: "media/maisons/longere_presentation_m.mp4", poster: "media/maisons/longere_presentation.jpg",
               titre: "Vidéo de présentation" }
    },
    {
      id: "4l",
      type: "modele3d",
      // vue éclatée : 120 images rendues dans Blender (outils/eclate_4l.py), le défilement monte la voiture
      sequence: { dossier: "media/4l/eclate/", nb: 120 },
      motFond: "4L · 1968",
      etapes: [
        ["Les roues", "On a commencé par les roues : jantes, pneus et enjoliveurs, la base sur laquelle tout le reste vient se poser."],
        ["La carrosserie", "Ensuite la carrosserie, d'un seul tenant, posée sur les roues."],
        ["Les détails", "La voiture a été construite dans cet ordre : les roues, la carrosserie, les détails, puis la couleur. Ici, vitres, chromes, phares et pare-chocs prennent leur place."],
        ["La couleur", "Dernière étape : l'argile grise laisse place aux vraies couleurs, rouge 4L, chromes et vitres."]
      ],
      titre: "Renault 4L 1968 imprimable",
      sousTitre: "Maquette 1:24 · impression 3D",
      description: [
        "Une Renault 4L de 1968 modélisée pour être imprimée en maquette au 1:24, en un seul bloc ou en kit (carrosserie + 4 roues) avec un socle gravé.",
        "Je me suis adapté à l'imprimante 3D dont je disposais : pièces découpées pour tenir sur le plateau, parties fines renforcées pour résister à l'impression.",
        "Comme pour les maisons, j'ai relié l'IA à Blender pour faire évoluer le modèle, et chaque élément (couleur, détails, socle) peut être modifié facilement."
      ],
      chiffres: [["1:24", "échelle"], ["kit", "carrosserie + roues + socle"], ["100 %", "adapté à mon imprimante"]],
      tags: ["Blender", "IA connectée à Blender", "Impression 3D", "OrcaSlicer"],
      galerie: [
        { src: "media/4l/4L_1968_photo.jpg", legende: "Rendu studio" },
        { src: "media/4l/4L_1968_trois_quarts_arriere.jpg", legende: "Trois-quarts arrière" },
        { src: "media/4l/4L_1968_calandre.jpg", legende: "Détail de la calandre" },
        { src: "media/4l/4L_1968_FILAMENT_KIT_eclate.jpg", legende: "Kit éclaté pour l'impression filament" },
        { src: "media/4l/4L_1968_FILAMENT_sur_socle.jpg", legende: "Sur son socle" },
        { src: "media/4l/4L_1968_avant_apres_renforts.jpg", legende: "Avant / après renforts" }
      ],
      aVenir: "Photos de la maquette imprimée : bientôt"
    }
  ],

  /* ----- 2. FILMS 3D : un seul épisode + la méthode ------------------------ */
  films: {
    titre: "Séries d'animation foot",
    intro: "Des séries verticales pour TikTok et YouTube Shorts, entièrement faites dans Blender. Je donne un scénario bref, et l'IA en tire une vraie histoire, découpée en épisodes de 30 à 55 secondes qui finissent sur un choix. Chaque épisode a réuni entre 1 000 et 3 000 vues sur YouTube Shorts.",
    // lue en boucle, son coupé par défaut (bouton pour l'activer, coupé dès que la vidéo sort de l'écran)
    episode: { src: "media/foot/la_remontada_ep01.mp4", mobile: "media/foot/la_remontada_ep01_m.mp4", poster: "media/foot/la_remontada_ep01.jpg",
               titre: "La Remontada · Épisode 01", son: true },
    methode: [
      ["Je donne le scénario", "Une trame courte : les personnages, l'enjeu et le choix de fin d'épisode."],
      ["L'IA construit l'histoire", "À partir de cette trame, elle écrit l'histoire complète et la découpe en plans, une idée par plan, de 30 à 55 secondes."],
      ["Elle fabrique les images", "Connectée à Blender, elle crée le stade, les joueurs, les animations et les caméras."],
      ["Son et texte", "Voix de synthèse, sous-titres mot à mot, bruitages et musique sont calés à l'image près."],
      ["Je relis et je corrige", "Je regarde chaque rendu, je note ce qui ne va pas (timing, placement, lisibilité), et Claude corrige jusqu'à ce que ce soit bon."]
    ],
    tags: ["Claude Code", "Blender", "Python", "Voix de synthèse", "Format 9:16"]
  },

  /* ----- 3. JEU VIDÉO ---------------------------------------------------- */
  jeu: {
    titre: "The Last Fight",
    ancienNom: "33Fight",
    accroche: "8,2 milliards d'humains. Un tournoi. Un seul survivant.",
    // mis en avant juste sous l'accroche
    pointFort: { titre: "Mode en ligne", texte: "Affronte un ami à distance en 1 contre 1, ou à deux sur le même écran en local." },
    description: [
      "Un projet que j'avais en tête depuis plusieurs mois. Grâce à l'IA, j'ai pu le créer en très peu de temps.",
      "Un jeu de boxe satirique à la première personne, développé sous Unity 6 : tu affrontes 33 adversaires générés au hasard, du bébé au boss, jusqu'à être le dernier humain debout.",
      "Le jeu intègre un système de personnalisation du personnage, et il est en voie de commercialisation."
    ],
    fonctions: [
      "Personnalisation du personnage",
      "Parade, esquive, riposte, uppercut",
      "33 adversaires générés",
      "6 arènes",
      "Cartes de bonus entre les combats",
      "Mode en ligne et 2 joueurs en local",
      "Français et anglais"
    ],
    chiffres: [["33", "combats"], ["6", "arènes"], ["180+", "tests automatisés"], ["En ligne", "1 contre 1"]],
    tags: ["Unity 6.3", "C#", "URP", "Réseau"],
    trailer: { src: "media/33fight/trailer.mp4", mobile: "media/33fight/trailer_m.mp4", poster: "media/33fight/combat.jpg", son: true },
    captures: [
      { src: "media/33fight/combat.jpg", legende: "Combat dans le parc" },
      { src: "media/33fight/versus.jpg", legende: "Fiche VS avant chaque combat" },
      { src: "media/33fight/fin_8_terre_proche.jpg", legende: "Cinématique de fin" }
    ]
  },

  /* ----- 4. AUTOMATISATION ---------------------------------------------- */
  automatisation: {
    titre: "Barça Debrief",
    accroche: "Le coup de sifflet final, et moins de 8 minutes plus tard, la publication est prête.",
    description: [
      "J'ai voulu créer un système autonome qui, au plus tard 8 minutes après le coup de sifflet final, prépare une publication avec les statistiques les plus croustillantes de l'équipe et des phrases qui font réagir, pour aller chercher un maximum de visibilité.",
      "Tout s'enchaîne seul : détection de la fin du match, récupération des stats, rédaction par l'IA, montage de la vidéo. Mais rien ne part sans validation humaine : chaque publication m'est d'abord envoyée sur Discord (👍 publier, 👎 refuser, 🔁 refaire), puis part sur X et TikTok."
    ],
    etapes: [
      ["Détection", "n8n interroge le moteur toutes les 2 min ; le quota d'API est préservé"],
      ["Données", "API-Football : score, événements, stats, xG, notes"],
      ["Rédaction IA", "Claude écrit titres, légendes et question débat en JSON strict"],
      ["Rendu", "Puppeteer capture l'animation HTML image par image, ffmpeg assemble le MP4"],
      ["Validation", "Bot Discord : 👍 publier, 👎 refuser, 🔁 régénérer"],
      ["Publication", "X (API v2) et TikTok (Content Posting API) en parallèle"]
    ],
    chiffres: [["31", "nœuds n8n"], ["3", "services Docker"], ["8 min max", "du sifflet à la publication prête"], ["≈ 20 s", "de vidéo"]],
    tags: ["n8n", "Node.js", "Puppeteer", "ffmpeg", "Docker", "API Claude", "Discord bot", "API X / TikTok"],
    boucle: { src: "media/barca/debrief_boucle.mp4", poster: "media/barca/debrief_boucle.jpg" }
  },

  /* ----- 5. QUI JE SUIS -------------------------------------------------- */
  moi: {
    photo: "media/moi/photo.jpg",
    texte: [
      "J'ai {age} ans et je suis en dernière année de licence Information-Communication, spécialité jeux vidéo et médias interactifs, à l'UCO de Laval.",
      "Ce qui me passionne, ce sont les nouvelles technologies, et l'IA en particulier. Tous les projets de ce portfolio ont été réalisés en dirigeant une IA (Claude Code) comme une équipe de production. Je définis l'objectif, je découpe le travail, je vérifie chaque étape et je corrige jusqu'au résultat. L'IA écrit le code, et je décide de ce qui est bon.",
      "Je cherche un emploi dans l'IA. Je montre aussi à mes clients, preuves à l'appui, ce que je sais faire avec elle : de la 3D réaliste au jeu vidéo complet, en passant par des automatisations qui publient toutes seules.",
      "En dehors des écrans, je suis passionné de sport : football et MMA.",
      "Si je me suis lancé dans l'IA, c'est parce que les débouchés de mon domaine d'études risquaient de se refermer pour ceux qui ne s'y mettraient pas. J'ai voulu être parmi les premiers à l'utiliser et à m'appuyer sur elle pour mener mes projets."
    ],
    methode: [
      ["Cadrer", "Je transforme une idée floue en objectif précis, avec des références et des critères de réussite."],
      ["Découper", "Je fais avancer le projet par étapes courtes, chacune validée avant la suivante."],
      ["Vérifier", "Rendus, tests automatisés, captures : rien n'est livré sans être contrôlé."],
      ["Livrer", "Fichiers propres, documentés, qui se reconstruisent et se mettent à jour."]
    ],
    etudes: [
      { periode: "2023 – 2026", titre: "Licence Information-Communication, spécialité jeux vidéo et médias interactifs", lieu: "UCO Laval", detail: "Dernière année en cours" },
      { periode: "2023", titre: "Baccalauréat STI2D", lieu: "Saint-Malo", detail: "Sciences et technologies de l'industrie et du développement durable" }
    ],
    experiences: [
      { periode: "Juin 2026 · 5 semaines", titre: "Stage : modélisation 3D et textures", lieu: "Grottes de Saulges (Mayenne)", detail: "Modélisation d'objets en 3D et création de leurs textures" },
      { periode: "2024 – 2026 · 10 mois", titre: "Agent d'inspection sanitaire en abattoir (contractuel catégorie B)", lieu: "DDPP 35, service vétérinaire", detail: "Contrôle sanitaire des viandes sur chaîne, protocoles d'hygiène et de sécurité alimentaire, travail en équipe multilingue" },
      { periode: "Juillet – août 2023", titre: "Assistant administratif", lieu: "Eguimos, cabinet de géomètres (Combourg)", detail: "Classement et archivage, saisie des archives dans le logiciel du cabinet" },
      { periode: "Juillet – août 2022", titre: "Agent hôtelier", lieu: "EHPAD Les Chênes (Plélan-le-Petit)", detail: "Service des repas selon les régimes des résidents, hygiène, accompagnement au quotidien" }
    ],
    competences: ["Claude Code / IA", "Blender", "Python", "Unity / C#", "n8n", "Node.js", "3ds Max", "Substance Painter", "Photoshop", "Impression 3D"],
    langues: ["Français (langue maternelle)", "Anglais (B2)", "Espagnol (A2)"],
    passions: ["IA et nouvelles technologies", "Football", "MMA"],
    cv: "media/moi/CV.pdf" // version SANS téléphone, générée par Desktop/cv_boulot/CV 2026/source/generer.js
  }
};
