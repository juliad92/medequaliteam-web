export type FormTranslations = ReturnType<typeof getVolunteerApplicationFormTranslations>

export function getVolunteerApplicationFormTranslations(locale: string) {
  const fr = locale === 'fr'
  return {
    eyebrow: fr ? 'Candidature' : 'Application',
    title: fr ? 'Formulaire de recrutement' : 'Volunteer application form',
    body: fr
      ? 'Remplissez ce formulaire et nous reviendrons vers vous dès que possible.'
      : 'Fill in this form and we will get back to you as soon as possible.',
    estimatedTime: fr ? 'Durée estimée : 8 minutes' : 'Estimated time: 8 minutes',
    sections: {
      personal: fr ? 'Informations personnelles' : 'Personal information',
      roles: fr ? 'Rôles souhaités' : 'Preferred roles',
      rolesHint: fr
        ? 'Sélectionnez un ou plusieurs rôles pour lesquels vous souhaitez postuler.'
        : 'Select one or more roles you would like to apply for.',
      experience: fr ? 'Expérience' : 'Experience',
      experienceHint: fr
        ? 'Décrivez votre expérience ci-dessous, ou téléchargez votre CV à la place.'
        : 'Describe your experience below, or upload your CV instead.',
      availability: fr ? 'Disponibilités' : 'Availability',
      workEnv: fr ? 'Environnement de travail' : 'Work environment',
      qualities: fr ? 'Qualités personnelles' : 'Personal qualities',
      languages: fr ? 'Langues parlées' : 'Languages spoken',
      driving: fr ? 'Permis de conduire' : 'Driving licence',
      referral: fr ? 'Comment nous avez-vous connu ?' : 'How did you hear about us?',
    },
    stepLabels: fr
      ? ['Profil', 'Expérience', 'Disponibilités', 'Finalisation']
      : ['Profile', 'Experience', 'Availability', 'Final details'],
    nav: {
      previous: fr ? 'Précédent' : 'Previous',
      next: fr ? 'Suivant' : 'Next',
    },
    fields: {
      firstName: fr ? 'Prénom' : 'First name',
      lastName: fr ? 'Nom' : 'Last name',
      age: fr ? 'Âge' : 'Age',
      email: 'Email',
      countryOfResidence: fr ? 'Pays de domiciliation' : 'Country of residence',
      nationality: fr ? 'Nationalité' : 'Nationality',
      phoneCountryCode: fr ? 'Indicatif téléphonique' : 'Phone country code',
      phone: fr ? 'Numéro de téléphone' : 'Phone number',
      relevantWorkAcademicExperience: fr
        ? 'Expérience professionnelle et académique pertinente, Expérience bénévole, Expérience avec les réfugié·e·s, Expérience à l’étranger, Autre expérience'
        : 'Relevant work and academic experience, Volunteer experience, Experience working with refugees, Experience working abroad, Other experience',
      cv: fr ? 'Téléchargez votre CV' : 'Upload your CV',
      cvOr: fr ? 'ou' : 'or',
      cvHint: fr ? 'PDF, DOC ou DOCX, 4 Mo maximum.' : 'PDF, DOC or DOCX, 4 MB maximum.',
      cvInvalid: fr
        ? 'Fichier invalide. Utilise un PDF, DOC ou DOCX de 4 Mo maximum.'
        : 'Invalid file. Please use a PDF, DOC or DOCX of 4 MB or less.',
      cvRemove: fr ? 'Retirer le fichier' : 'Remove file',
      medicalGraduationDate: fr
        ? 'Date de diplôme (personnel médical)'
        : 'Graduation date (medical staff)',
      preferredStartDate: fr ? 'Date de début souhaitée' : 'Preferred start date',
      preferredEndDate: fr ? 'Date de fin souhaitée' : 'Preferred end date',
      datesFlexible: fr ? 'Vos dates sont-elles flexibles ?' : 'Are your dates flexible?',
      flexibleFromDate: fr ? 'Du' : 'From',
      flexibleToDate: fr ? 'Au' : 'Until',
      motivation: fr ? 'Motivation' : 'Motivation',
      happyStressfulEnvironment: fr
        ? 'Je suis à l’aise dans un environnement stressant, chaotique et émotionnellement exigeant'
        : 'I am happy working in a stressful, chaotic and emotionally demanding environment',
      goodEnglishLevel: fr
        ? 'J’ai un bon niveau d’anglais oral'
        : 'I have a good level of spoken English',
      euSchengenResident: fr ? 'Résident·e UE / Schengen' : 'Are you an EU / Schengen resident',
      greeceVisa: fr
        ? 'Possédez-vous un visa vous permettant de faire du bénévolat en Grèce ?'
        : 'Do you possess a visa allowing you to volunteer in Greece?',
      greeceVisaComments: fr ? 'Commentaires (visa)' : 'Visa comments',
      visaExpiryDate: fr ? 'Date d’expiration du visa' : 'Visa expiry date',
      languageLevel: fr
        ? 'Niveau (base / intermédiaire / fluent)'
        : 'Level (basic / intermediate / fluent)',
      greek: 'Greek',
      arabic: 'Arabic',
      farsi: 'Farsi',
      drivingLicence: fr ? 'Permis de conduire catégorie B' : 'Do you hold a B-Driving licence?',
      drivingOther: fr ? 'Précise (autre)' : 'Please specify (other)',
      comfortableDriving9SeatVan: fr
        ? 'Etes-vous à l’aise pour conduire un van 9 places ?'
        : 'Do you feel comfortable driving a 9 seat van?',
      howDidYouHearAboutUs: fr ? 'Comment nous avez-vous connu ?' : 'How did you hear about us?',
      drivingYes: fr ? 'Oui' : 'Yes',
      drivingNo: fr ? 'Non' : 'No',
      drivingOtherOption: fr ? 'Autre' : 'Other',
    },
    submit: fr ? 'Envoyer ma candidature' : 'Submit application',
    sending: fr ? 'Envoi…' : 'Sending…',
    successTitle: fr ? 'Candidature envoyée' : 'Application submitted',
    successBody: fr
      ? 'Merci ! Nous avons bien reçu votre candidature. Si vous avez des questions, écrivez à volunteer@medequali.team.'
      : 'Thank you! We received your application. If you have questions, email volunteer@medequali.team.',
    error: fr
      ? 'Une erreur est survenue. Vérifiez les champs et réessaiez.'
      : 'Something went wrong. Please check the fields and try again.',
    selectRole: fr ? 'Sélectionnez au moins un rôle.' : 'Please select at least one role.',
    requiredLegend: fr ? '* Champs obligatoires' : '* Required fields',
    fieldErrors: {
      required: fr ? 'Ce champ est obligatoire.' : 'This field is required.',
      invalidEmail: fr ? 'Adresse e-mail invalide.' : 'Invalid email address.',
      invalidAge: fr
        ? 'Indiquez un âge entre 16 et 99 ans.'
        : 'Please enter an age between 16 and 99.',
    },
  }
}
