export const translations = {
  en: {
    // Nav
    nav: {
      about: 'About',
      aboutWhy: 'Why we exist',
      aboutOrg: 'The organisation',
      aboutTeam: 'Meet the team',
      projects: 'Projects',
      projectsActive: 'Northern Greece',
      projectsPast: 'Past projects',
      volunteer: 'Volunteer',
      volunteerGreece: 'Volunteer in Greece',
      volunteerStories: 'Volunteer stories',
      news: 'News',
      donate: 'Donate',
    },

    // Hero
    hero: {
      eyebrow: 'Medical NGO · Since 2018',
      title: "Med'EqualiTeam",
      tagline: 'Caring for people on the move',
      donateCta: 'Donate now',
      volunteerCta: 'Volunteer with us',
      latestProject: 'Latest project',
      learnMore: 'Learn more',
      scroll: 'Scroll',
    },

    // Impact bar
    impact: {
      patients: 'Patients treated',
      years: 'Years of action',
      countries: 'Countries',
      care: 'Free care',
    },

    // Mission
    mission: {
      eyebrow: 'Our mission',
      title: 'Free healthcare for those who need it most',
      body: 'We are a medical NGO providing free primary health care for refugees and displaced populations who face financial, social, and logistical obstacles in accessing healthcare.',
      pillar1Title: 'Providing free health care',
      pillar1Desc:
        'Med’EqualiTeam aims to provide primary healthcare for refugees, to provide relief for local medical services',
      pillar2Title: 'Multilingual approach',
      pillar2Desc: 'Local translators are embedded in every team to remove language barriers.',
      pillar3Title: 'Volunteer-powered',
      pillar3Desc:
        '100% dependent on crowdfunding and the commitment of medical volunteers worldwide.',
      quote: 'We provide care with respect, dignity and confidentiality.',
      years: 'Years',
      photoCaption: 'Field photo — add via Payload Media',
    },

    // Projects
    projects: {
      eyebrow: 'Our work',
      title: 'Projects on the ground',
      viewAll: 'View all projects',
      active: 'Active',
      past: 'Past',
      learnMore: 'Learn more',
    },

    // Volunteer CTA
    volunteerCta: {
      eyebrow: 'Join the team',
      title: 'We need doctors, nurses, and coordinators',
      body: 'Our teams are small, dedicated, and international. If you have medical or organisational skills and want to make a direct impact, we want to hear from you.',
      primary: 'Volunteer in Greece',
      secondary: 'Read volunteer stories',
    },

    // News
    news: {
      eyebrow: 'Latest updates',
      title: 'News from the field',
      viewAll: 'All news',
    },

    // Footer
    footer: {
      tagline:
        'A medical NGO providing free primary health care for refugees and displaced populations.',
      charity: 'Charity No.',
      complaints: 'Complaints',
      dataProtection: 'Data protection',
      rights: 'All rights reserved.',
    },
  },

  fr: {
    // Nav
    nav: {
      about: 'À propos',
      aboutWhy: 'Pourquoi nous existons',
      aboutOrg: "L'organisation",
      aboutTeam: "L'équipe",
      projects: 'Projets',
      projectsActive: 'Grèce du Nord',
      projectsPast: 'Projets passés',
      volunteer: 'Bénévolat',
      volunteerGreece: 'Bénévolat en Grèce',
      volunteerStories: 'Témoignages',
      news: 'Actualités',
      donate: 'Faire un don',
    },

    // Hero
    hero: {
      eyebrow: 'ONG médicale · Depuis 2018',
      title: "Med'EqualiTeam",
      tagline: 'Prendre soin des personnes en mouvement',
      donateCta: 'Faire un don',
      volunteerCta: 'Devenir bénévole',
      latestProject: 'Dernier projet',
      learnMore: 'En savoir plus',
      scroll: 'Défiler',
    },

    // Impact bar
    impact: {
      patients: 'Patients traités',
      years: "Années d'action",
      countries: 'Pays',
      care: 'Soins gratuits',
    },

    // Mission
    mission: {
      eyebrow: 'Notre mission',
      title: 'Des soins gratuits pour ceux qui en ont le plus besoin',
      body: 'Nous sommes une ONG médicale qui fournit des soins de santé primaires gratuits aux réfugiés et aux personnes déplacées qui font face à des obstacles financiers, sociaux et logistiques pour accéder aux soins.',
      pillar1Title: 'Soins aux réfugiés',
      pillar1Desc:
        "Nous fournissons des soins de santé primaires aux réfugié.e.s. Nous fournissons les mêmes services aux personnes locales, lorsque leur propre de système de santé n'est pas accessible, par manque de disponibilité ou de finances.",
      pillar2Title: 'Approche multilingue',
      pillar2Desc:
        'Des traducteurs locaux sont intégrés à chaque équipe pour supprimer les barrières linguistiques.',
      pillar3Title: 'Porté par les bénévoles',
      pillar3Desc:
        "100 % dépendant du financement participatif et de l'engagement de bénévoles médicaux du monde entier.",
      quote: 'Nous prodiguons des soins dans le respect, la dignité et la confidentialité.',
      years: 'Ans',
      photoCaption: 'Photo de terrain — à ajouter via Payload Media',
    },

    // Projects
    projects: {
      eyebrow: 'Notre travail',
      title: 'Projets sur le terrain',
      viewAll: 'Voir tous les projets',
      active: 'Actif',
      past: 'Passé',
      learnMore: 'En savoir plus',
    },

    // Volunteer CTA
    volunteerCta: {
      eyebrow: "Rejoindre l'équipe",
      title: 'Nous avons besoin de médecins, infirmiers et coordinateurs',
      body: 'Nos équipes sont petites, dévouées et internationales. Si vous avez des compétences médicales ou organisationnelles et souhaitez avoir un impact direct, contactez-nous.',
      primary: 'Bénévolat en Grèce',
      secondary: 'Lire les témoignages',
    },

    // News
    news: {
      eyebrow: 'Dernières nouvelles',
      title: 'Actualités du terrain',
      viewAll: 'Toutes les actualités',
    },

    // Footer
    footer: {
      tagline:
        'Une ONG médicale fournissant des soins de santé primaires gratuits aux réfugiés et personnes déplacées.',
      charity: 'N° association',
      complaints: 'Réclamations',
      dataProtection: 'Protection des données',
      rights: 'Tous droits réservés.',
    },
  },
} as const

export type Locale = keyof typeof translations
export type Translations = (typeof translations)[Locale]

export function getT(locale: string): Translations {
  return translations[locale as Locale] ?? translations.en
}
