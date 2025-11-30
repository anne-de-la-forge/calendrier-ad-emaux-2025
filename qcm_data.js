// Fichier : qcm_data.js
// Contient les données des 24 jours : Question, Options, Réponse, Image

const qcmData = [
    {
        day: 1,
        title: "La Vague et le Mystère",
        question: "La collection BELHARRA est inspirée par une vague mythique du Pays Basque. Quelle caractéristique met en valeur cette collection ?",
        image: "Creation-murale-Belharra-emaux-dorfeve-sur-cuivre_3-Anne-de-La-Forge-copie.jpg",
        options: [
            { text: "A. Le calme et l'immobilité de l'océan", value: "A" },
            { text: "B. Les fonds marins profonds et silencieux", value: "B" },
            { text: "C. La puissance et le mouvement d'une vague", value: "C" }
        ],
        correctAnswer: "C"
    },
    {
        day: 2,
        title: "La Poudre et l'Art",
        question: "Comment dépose-t-on les fines couches de poudre d'émail pour les motifs complexes sur le cuivre ?",
        image: "ateliers-decouverte-emaux.jpg",
        options: [
            { text: "A. Par immersion dans un bain", value: "A" },
            { text: "B. Avec un pistolet à air comprimé", value: "B" },
            { text: "C. À la main, à l'aide d'une fine spatule ou tamis fin", value: "C" }
        ],
        correctAnswer: "C"
    },
    {
        day: 3,
        title: "Un Partenariat Textile",
        question: "Avec quel type d'artisan d'art, Anne de la Forge a-t-elle collaboré pour réaliser des co-créations dans le domaine du textile ?",
        image: "564629110_18556304542016266_5969967451891582940_nlow.webp",
        options: [
            { text: "A. Un Céramiste", value: "A" },
            { text: "B. Un Photographe", value: "B" },
            { text: "C. Un Passementier", value: "C" }
        ],
        correctAnswer: "C"
    },
    {
        day: 4,
        title: "Lumière et Émail",
        question: "En collaboration avec des designers, les créations d'Anne de la Forge se sont étendues aux luminaires. Quel format de luminaire est le plus souvent co-créé ?",
        image: "lampes3-luminaires.jpg",
        options: [
            { text: "A. Des lustres en cristal", value: "A" },
            { text: "B. Des lampadaires sur pied", value: "B" },
            { text: "C. Des appliques murales ou des îlots modulaires", value: "C" }
        ],
        correctAnswer: "C"
    },
    {
        day: 5,
        title: "Le Secret du Cloisonné",
        question: "Dans la technique du Cloisonné, à quoi servent les fines bandes de cuivre ou d'or fixées sur le support ?",
        image: "cloison.jpg",
        options: [
            { text: "A. Pour obtenir des motifs abstraits aléatoires", value: "A" },
            { text: "B. Pour obtenir des formes simples et fluides", value: "B" },
            { text: "C. Pour obtenir des détails fins et une grande précision du dessin", value: "C" }
        ],
        correctAnswer: "C"
    },
    {
        day: 6,
        title: "La Maîtrise du Feu",
        question: "Quel est le défi le plus important dans le processus de cuisson, où l'émail se révèle ?",
        image: "emaux-sur-cuivre-collection-TERRES-MESSAGERES-@ANNE-DE-LA-FORGE-1detail.jpg",
        options: [
            { text: "A. Le bruit du four", value: "A" },
            { text: "B. La fumée émise", value: "B" },
            { text: "C. Anticiper le changement de couleur et les réactions chimiques", value: "C" }
        ],
        correctAnswer: "C"
    },
    {
        day: 7,
        title: "Le Cœur du Cadeau",
        question: "Selon Anne de la Forge, quelle est la véritable valeur émotionnelle d'un cadeau fait main ?",
        image: "Sculpture-Breaking-Wave.jpg",
        options: [
            { text: "A. Son prix élevé", value: "A" },
            { text: "B. Le packaging luxueux", value: "B" },
            { text: "C. L'histoire que raconte l'artisanat derrière la pièce", value: "C" }
        ],
        correctAnswer: "C"
    },
    {
        day: 8,
        title: "Le Métal Privilégié",
        question: "Quel métal est presque toujours utilisé comme support par Anne de la Forge pour l'émaillage chaud ?",
        image: "SOSSUVLEI-Anne-de-La-Forge.jpg",
        options: [
            { text: "A. L'aluminium", value: "A" },
            { text: "B. Le titane", value: "B" },
            { text: "C. Le cuivre", value: "C" }
        ],
        correctAnswer: "C"
    },
    {
        day: 9,
        title: "Reconnaissance Professionnelle",
        question: "Anne de La Forge est membre d'Ateliers d'Art de France. Quelle est leur mission principale ?",
        image: "ateliers-dart-de-france-page-network.jpg",
        options: [
            { text: "A. Organiser des compétitions sportives", value: "A" },
            { text: "B. Vendre des produits industriels en série", value: "B" },
            { text: "C. Valoriser et soutenir les métiers d'art", value: "C" }
        ],
        correctAnswer: "C"
    },
    {
        day: 10,
        title: "Co-création de Mobilier",
        question: "Le concept de Duos et Dialogues permet de réunir son savoir-faire avec celui d'un autre artisan d'art. Dans quel domaine l'artiste a-t-elle récemment réalisé des guéridons ?",
        image: "gueridon.jpeg",
        options: [
            { text: "A. La Bijouterie", value: "A" },
            { text: "B. Le Design Culinaire", value: "B" },
            { text: "C. L'Ébénisterie (travail du bois)", value: "C" }
        ],
        correctAnswer: "C"
    },
    {
        day: 11,
        title: "Le Grand Format II",
        question: "La création murale BELHARRA a été présentée lors d'un événement par quelle experte en tendances ?",
        image: "sculpture.png",
        options: [
            { text: "A. Clotilde la Blogueuse Mode", value: "A" },
            { text: "B. Gaston le Critique Gastronomique", value: "B" },
            { text: "C. Elizabeth Leriche du Bureau de style", value: "C" }
        ],
        correctAnswer: "C"
    },
    {
        day: 12,
        title: "Les Hautes Températures",
        question: "À quelle température (nécessaire à la fusion du verre et du métal) environ se fait la fusion de l'émail sur le cuivre ?",
        image: "ARCHIPEL-3-Anne-de-La-FORGE.jpg",
        options: [
            { text: "A. 400°C", value: "A" },
            { text: "B. 800°C", value: "B" },
            { text: "C. 1200°C", value: "C" }
        ],
        correctAnswer: "B"
    },
    {
        day: 13,
        title: "L'Étape Essentielle",
        question: "Quelle est l'étape qui transforme le verre coloré en poudre en une couche d'émail solide, lisse et brillante ?",
        image: "image-jour-13-email-avant-apres.jpg",
        options: [
            { text: "A. Le bain dans l'eau glacée", value: "A" },
            { text: "B. Le polissage final", value: "B" },
            { text: "C. La cuisson qui révèle les couleurs et les motifs uniques", value: "C" }
        ],
        correctAnswer: "C"
    },
    {
        day: 14,
        title: "Composition",
        question: "En termes de composition, à quelle matière l'émail sur cuivre est-il le plus étroitement lié ?",
        image: "detail.jpg",
        options: [
            { text: "A. La céramique", value: "A" },
            { text: "B. Le verre", value: "B" },
            { text: "C. Le plastique", value: "C" }
        ],
        correctAnswer: "B"
    },
    {
        day: 15,
        title: "Le Secret de la Couleur",
        question: "De quoi est composée la poudre d'émail utilisée avant la cuisson ?",
        image: "pigments.jpg",
        options: [
            { text: "A. De l'eau boueuse séchée", value: "A" },
            { text: "B. Du métal trempé", value: "B" },
            { text: "C. De la poudre de verre très fine, pigmentée par des oxydes métalliques", value: "C" }
        ],
        correctAnswer: "C"
    },
    {
        day: 16,
        title: "L'International II (Voyage)",
        question: "Anne de la Forge a réalisé une œuvre pour un client de luxe à Genève, dans le secteur de :",
        image: "bleu.jpg",
        options: [
            { text: "A. La Maroquinerie", value: "A" },
            { text: "B. La Haute Joaillerie", value: "B" },
            { text: "C. L'Horlogerie", value: "C" }
        ],
        correctAnswer: "C"
    },
    {
        day: 17,
        title: "L'Inspiration Spatiale",
        question: "La Collection Terres Messagères, qui capture la beauté et la vulnérabilité de la Terre, est inspirée par les photographies de Tom Hegen et d'un célèbre...",
        image: "emaux-sur-cuivre.jpg",
        options: [
            { text: "A. Explorateur polaire", value: "A" },
            { text: "B. Biologiste marin", value: "B" },
            { text: "C. Astronaute", value: "C" }
        ],
        correctAnswer: "C"
    },
    {
        day: 18,
        title: "L'Outil le Plus Précis",
        question: "Quel outil est indispensable pour le travail de précision dans l'application des poudres d'émail ?",
        image: "ateliers-decouverte-emaux.jpg",
        options: [
            { text: "A. L'entonnoir à poudre", value: "A" },
            { text: "B. Le four", value: "B" },
            { text: "C. La spatule ou le tamis fin pour le travail délicat des poudres", value: "C" }
        ],
        correctAnswer: "C"
    },
    {
        day: 19,
        title: "La Fusion de l'Orfèvrerie",
        question: "Quel est l'objectif principal de la cuisson à haute température des poudres de verre sur le support métallique ?",
        image: "572398431_18560670844016266_109912061020564552_nthumb.webp",
        options: [
            { text: "A. Pour obtenir des surfaces très brillantes et lisses", value: "A" },
            { text: "B. Pour que la poudre de verre fusionne et devienne un émail solide et coloré", value: "B" },
            { text: "C. Pour réduire le poids de la pièce", value: "C" }
        ],
        correctAnswer: "B"
    },
    {
        day: 20,
        title: "Le Temps de Création",
        question: "Combien de temps faut-il pour créer une pièce d'émail unique et complexe ?",
        image: "ARCHIPEL-Anne-de-La-FORGE-1.jpg",
        options: [
            { text: "A. Quelques heures (grâce aux machines)", value: "A" },
            { text: "B. Quelques jours (pour les petites pièces)", value: "B" },
            { text: "C. Plusieurs semaines voire plusieurs mois", value: "C" }
        ],
        correctAnswer: "C"
    },
    {
        day: 21,
        title: "L'Inspiration Naturelle",
        question: "Quelles sont les principales sources d'inspiration des motifs et des couleurs des émaux d'Anne de la Forge ?",
        image: "ecume.jpg",
        options: [
            { text: "A. Les villes modernes et l'architecture", value: "A" },
            { text: "B. Le cosmos et les galaxies lointaines", value: "B" },
            { text: "C. Les éléments naturels (eau, roche, ciel)", value: "C" }
        ],
        correctAnswer: "C"
    },
    {
        day: 22,
        title: "Le Geste Unique",
        question: "Quelle est la signature qui rend chaque création absolument unique et sans équivalent ?",
        image: "573705153_18562573573016266_5788673195324190255_nthumb.webp",
        options: [
            { text: "A. Une machine automatique", value: "A" },
            { text: "B. L'impression 3D", value: "B" },
            { text: "C. Le travail manuel (chaque pièce est unique et irremplaçable)", value: "C" }
        ],
        correctAnswer: "C"
    },
    {
        day: 23,
        title: "Parcours d’Artiste",
        question: "Avant de se consacrer à l’émaillage d’art, quelle profession exerçait Anne de la Forge ?",
        image: "Ecumes-pieces-aimantees-Anne-de-La-FORGE-copie.jpg",
        options: [
            { text: "A. Restauratrice de meubles anciens", value: "A" },
            { text: "B. Juriste", value: "B" },
            { text: "C. Architecte d'intérieure", value: "C" }
        ],
        correctAnswer: "C"
    },
    {
        day: 24,
        title: "Le Secret d'AD Émaux",
        question: "Quel est l'ingrédient secret qui garantit la valeur et l'authenticité de chaque pièce d'émail ?",
        image: "Totems-bouleaux-Anne-de-La-Forge-.jpg",
        options: [
            { text: "A. La production en série", value: "A" },
            { text: "B. L'utilisation de la robotisation", value: "B" },
            { text: "C. Le temps et l'âme que l'artiste investit dans chaque pièce", value: "C" }
        ],
        correctAnswer: "C"
    },
    // 🎁 ENTRÉE POUR LE JOUR 25 🎁
    {
        day: 25,
        title: "Jour du Grand Tirage",
        question: "Joyeux Noël !",
        image: "chad-madden-SUTfFCAHV_A-unsplash.jpg", 
        options: [], 
        correctAnswer: null 
    }
];
