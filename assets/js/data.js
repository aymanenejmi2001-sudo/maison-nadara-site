/* ============================================================
   MAISON NADARA — Catalogue
   Pour passer en dirhams : remplacer la ligne `fmt` ci-dessous par
   fmt: n => n + " MAD"   (et ajuster les prix).
   ============================================================ */
window.MN = {
  // Deux devises. Les prix en dirhams sont fixés à la main, produit par produit
  // (champ `priceMAD`) : aucun taux de change n'est appliqué automatiquement.
  devises: {
    EUR: { code: "EUR", label: "EUR", champ: "price",    suffixe: " €",   franco: 90 },
    MAD: { code: "MAD", label: "MAD", champ: "priceMAD", suffixe: " MAD", franco: 900 }
  },
  fmt: n => n.toLocaleString("fr-FR") + " €",

  products: [
    {
      id: "soleil-de-petra",
      name: "Soleil <em>de Petra</em>",
      plain: "Soleil de Petra",
      sub: "Musc blanc",
      family: "Musqué minéral",
      volume: "250 ml",
      price: 46,
      priceMAD: 495,
      badge: "",
      accent: "#B9AE99",
      wash: "#EBE5D9",
      tint: "#D2C8B4",
      images: {
        front: "assets/img/petra-front.webp",
        alt: "assets/img/petra-macro.webp",
        gallery: [
          "assets/img/petra-front.webp",
          "assets/img/petra-angle.webp",
          "assets/img/petra-macro.webp",
          "assets/img/petra-lay.webp"
        ],
        shot: "assets/img/shot-petra-lay.webp"
      },
      claim: "Le grès rose à l'heure où l'ombre se retire.",
      story: "Un musc blanc lavé de lumière, poudré comme la pierre chaude sous la paume. " +
             "Presque rien — et pourtant la pièce entière change de température.",
      notes: ["Musc blanc", "Iris", "Cèdre"],
      pyramid: {
        "Tête": ["Bergamote de Calabre", "Poivre rose", "Feuille de figuier"],
        "Cœur": ["Musc blanc", "Iris pâle", "Amande douce"],
        "Fond": ["Ambre gris", "Cèdre blanc", "Pierre chaude"]
      },
      sillage: { "Intensité": 45, "Tenue": 70, "Chaleur": 35 },
      usage: "Sur les rideaux, le lin des chambres, l'intérieur des armoires. Vaporiser à 30 cm.",
      compo: "Alcohol denat., Aqua, Parfum, Limonene, Linalool. Sans colorant. Fabriqué au Maroc."
    },
    {
      id: "soleil-d-alhambra",
      name: "Soleil <em>d'Alhambra</em>",
      plain: "Soleil d'Alhambra",
      sub: "Rose néroli · Fleur d'oranger",
      family: "Floral solaire",
      volume: "250 ml",
      price: 46,
      priceMAD: 495,
      badge: "",
      accent: "#E3B77F",
      wash: "#F2E1C6",
      tint: "#E3B77F",
      images: {
        front: "assets/img/alhambra-front.webp",
        alt: "assets/img/alhambra-macro.webp",
        gallery: [
          "assets/img/alhambra-front.webp",
          "assets/img/alhambra-lay.webp",
          "assets/img/alhambra-macro.webp"
        ],
        shot: "assets/img/shot-alhambra-lay.webp"
      },
      claim: "Les patios de Grenade au premier soir.",
      story: "Néroli en éclats, rose de mai encore fraîche, et l'eau qui court sous les arcades. " +
             "Un floral qui reste ouvert, comme une fenêtre qu'on oublie de fermer.",
      notes: ["Néroli", "Rose de mai", "Fleur d'oranger"],
      pyramid: {
        "Tête": ["Néroli", "Petit-grain", "Mandarine verte"],
        "Cœur": ["Rose de mai", "Fleur d'oranger", "Jasmin blanc"],
        "Fond": ["Miel blond", "Bois blancs", "Benjoin"]
      },
      sillage: { "Intensité": 62, "Tenue": 58, "Chaleur": 55 },
      usage: "Dans l'entrée, sur les tapis de laine, les coussins de salon. Vaporiser à 30 cm.",
      compo: "Alcohol denat., Aqua, Parfum, Limonene, Linalool, Citral. Sans colorant. Fabriqué au Maroc."
    },
    {
      id: "soleil-de-casablanca",
      name: "Soleil <em>de Casablanca</em>",
      plain: "Soleil de Casablanca",
      sub: "Jasmin · Miel · Vanille",
      family: "Floral ambré",
      volume: "250 ml",
      price: 52,
      priceMAD: 560,
      badge: "Signature",
      accent: "#C4643F",
      wash: "#EDD5C7",
      tint: "#C4643F",
      images: {
        front: "assets/img/casa-front.webp",
        alt: "assets/img/casa-macro.webp",
        gallery: [
          "assets/img/casa-front.webp",
          "assets/img/casa-angle.webp",
          "assets/img/casa-macro.webp",
          "assets/img/casa-lay.webp"
        ],
        shot: "assets/img/shot-casa-lay.webp"
      },
      claim: "L'air salé du soir sur les terrasses blanches.",
      story: "Jasmin sambac cueilli de nuit, miel ambré, vanille fumée. " +
             "Le parfum d'une ville qui ne dort pas tout à fait — dense, tenace, hospitalier.",
      notes: ["Jasmin sambac", "Miel", "Vanille"],
      pyramid: {
        "Tête": ["Bergamote", "Cardamome verte", "Néroli"],
        "Cœur": ["Jasmin sambac", "Tubéreuse", "Ylang-ylang"],
        "Fond": ["Miel ambré", "Vanille bourbon", "Santal", "Benjoin"]
      },
      sillage: { "Intensité": 88, "Tenue": 84, "Chaleur": 92 },
      usage: "Le soir, sur les textiles épais et les rideaux du salon. Vaporiser à 40 cm.",
      compo: "Alcohol denat., Aqua, Parfum, Benzyl Benzoate, Coumarin, Linalool. Sans colorant. Fabriqué au Maroc."
    },
    {
      id: "coffret-trois-soleils",
      name: "Les Trois <em>Soleils</em>",
      plain: "Coffret Les Trois Soleils",
      sub: "Coffret découverte · 3 × 250 ml",
      family: "Coffret",
      volume: "3 × 250 ml",
      price: 128,
      priceMAD: 1380,
      badge: "Coffret",
      accent: "#8A6A46",
      wash: "#E9DECB",
      tint: "#D9B98C",
      images: {
        front: "assets/img/trio.webp",
        alt: "assets/img/casa-macro.webp",
        gallery: [
          "assets/img/trio.webp",
          "assets/img/petra-front.webp",
          "assets/img/alhambra-front.webp",
          "assets/img/casa-front.webp"
        ],
        shot: "assets/img/shot-casa-angle.webp"
      },
      claim: "Trois villes, trois heures du jour.",
      story: "La collection complète dans son étui de lin brut, cousu à Salé. " +
             "Petra pour le matin, Alhambra pour l'après-midi, Casablanca pour la nuit.",
      notes: ["Petra", "Alhambra", "Casablanca"],
      pyramid: {
        "Matin": ["Soleil de Petra — musc blanc"],
        "Après-midi": ["Soleil d'Alhambra — néroli"],
        "Nuit": ["Soleil de Casablanca — jasmin miel"]
      },
      sillage: { "Intensité": 70, "Tenue": 72, "Chaleur": 65 },
      usage: "Trois flacons de 250 ml dans un étui de lin, avec le carnet des notes.",
      compo: "Voir la composition de chaque flacon sur sa fiche dédiée."
    }
  ],

  journal: [
    {
      t: "Ce que la pierre garde de la lumière",
      d: "12 juin 2026", c: "Matière",
      img: "assets/img/jour-1.webp",
      x: "Pourquoi un musc blanc se comporte différemment sur le lin et sur la laine."
    },
    {
      t: "Néroli : la fleur qui se cueille avant le jour",
      d: "28 mai 2026", c: "Récolte",
      img: "assets/img/jour-2.webp",
      x: "Trois heures de cueillette dans la vallée du Souss, du chapeau au flacon."
    },
    {
      t: "Parfumer une maison sans l'encombrer",
      d: "04 mai 2026", c: "Rituel",
      img: "assets/img/jour-3.webp",
      x: "Le geste, la distance, la fréquence. Un protocole en trois temps."
    }
  ]
};
