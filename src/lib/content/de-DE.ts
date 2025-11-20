/* ==================================================================================
   CONTENT MANAGEMENT - DEUTSCHE TEXTE ZENTRAL
   ==================================================================================
   ✅ Alle Texte professionell & zentral verwaltet
   ✅ TypeScript-Autocomplete
   ✅ Keine hardcodeten Texte mehr
   ==================================================================================
   KRITISCH: NIEMALS Texte hardcoden - IMMER useContent() Hook nutzen!
   ================================================================================== */

export const content = {
  // ==================================================================================
  // NAVIGATION
  // ==================================================================================
  nav: {
    dashboard: 'Dashboard',
    auftraege: 'Aufträge',
    angebote: 'Angebote',
    kunden: 'Kunden',
    fahrer: 'Fahrer',
    fahrzeuge: 'Fahrzeuge',
    schichtzettel: 'Schichten & Zeiten',
    rechnungen: 'Rechnungen',
    kostenstellen: 'Kostenstellen',
    dokumente: 'Dokumente',
    partner: 'Partner-Netzwerk',
    statistiken: 'Statistiken',
    einstellungen: 'Einstellungen',
    landingpage: 'Landingpage-Editor',
  },

  // ==================================================================================
  // STATUS-LABELS
  // ==================================================================================
  status: {
    active: 'Aktiv',
    inactive: 'Inaktiv',
    pending: 'Ausstehend',
    confirmed: 'Bestätigt',
    completed: 'Abgeschlossen',
    cancelled: 'Storniert',
    draft: 'Entwurf',
    paid: 'Bezahlt',
    unpaid: 'Offen',
    overdue: 'Überfällig',
    expired: 'Abgelaufen',
    valid: 'Gültig',
    available: 'Verfügbar',
    busy: 'Im Einsatz',
    offline: 'Offline',
  },

  // ==================================================================================
  // METRIKEN
  // ==================================================================================
  metrics: {
    total: 'Gesamt',
    today: 'Heute',
    thisWeek: 'Diese Woche',
    thisMonth: 'Dieser Monat',
    thisYear: 'Dieses Jahr',
    yesterday: 'Gestern',
    lastWeek: 'Letzte Woche',
    lastMonth: 'Letzter Monat',
    lastYear: 'Letztes Jahr',
    revenue: 'Umsatz',
    bookings: 'Aufträge',
    customers: 'Kunden',
    drivers: 'Fahrer',
    vehicles: 'Fahrzeuge',
    invoices: 'Rechnungen',
    average: 'Durchschnitt',
    trend: 'Trend',
  },

  // ==================================================================================
  // BUTTONS
  // ==================================================================================
  buttons: {
    save: 'Speichern',
    cancel: 'Abbrechen',
    delete: 'Löschen',
    edit: 'Bearbeiten',
    add: 'Hinzufügen',
    create: 'Erstellen',
    search: 'Suchen',
    filter: 'Filtern',
    export: 'Exportieren',
    import: 'Importieren',
    upload: 'Hochladen',
    download: 'Herunterladen',
    send: 'Senden',
    close: 'Schließen',
    confirm: 'Bestätigen',
    retry: 'Erneut versuchen',
    refresh: 'Aktualisieren',
    reset: 'Zurücksetzen',
    submit: 'Absenden',
    next: 'Weiter',
    previous: 'Zurück',
    finish: 'Fertigstellen',
  },

  // ==================================================================================
  // FORMULAR-LABELS
  // ==================================================================================
  form: {
    firstName: 'Vorname',
    lastName: 'Nachname',
    email: 'E-Mail-Adresse',
    phone: 'Telefonnummer',
    mobile: 'Mobilnummer',
    street: 'Straße',
    streetNumber: 'Hausnummer',
    postalCode: 'Postleitzahl',
    city: 'Stadt',
    country: 'Land',
    company: 'Unternehmen',
    taxNumber: 'Steuernummer',
    vatId: 'USt-ID',
    iban: 'IBAN',
    bic: 'BIC',
    notes: 'Notizen',
    description: 'Beschreibung',
    date: 'Datum',
    time: 'Uhrzeit',
    from: 'Von',
    to: 'Bis',
    price: 'Preis',
    quantity: 'Anzahl',
    total: 'Gesamt',
    status: 'Status',
    category: 'Kategorie',
    type: 'Typ',
    priority: 'Priorität',
    required: 'Pflichtfeld',
  },

  // ==================================================================================
  // ERROR-MESSAGES
  // ==================================================================================
  errors: {
    loadFailed: 'Daten konnten nicht geladen werden.',
    saveFailed: 'Speichern fehlgeschlagen.',
    deleteFailed: 'Löschen fehlgeschlagen.',
    networkError: 'Netzwerkfehler. Bitte prüfen Sie Ihre Internetverbindung.',
    unauthorized: 'Sie sind nicht berechtigt, diese Aktion auszuführen.',
    notFound: 'Die angeforderte Ressource wurde nicht gefunden.',
    validation: 'Bitte überprüfen Sie Ihre Eingaben.',
    required: 'Dieses Feld ist erforderlich.',
    invalidEmail: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.',
    invalidPhone: 'Bitte geben Sie eine gültige Telefonnummer ein.',
    invalidDate: 'Bitte geben Sie ein gültiges Datum ein.',
    generic: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.',
  },

  // ==================================================================================
  // SUCCESS-MESSAGES
  // ==================================================================================
  success: {
    saved: 'Erfolgreich gespeichert.',
    created: 'Erfolgreich erstellt.',
    updated: 'Erfolgreich aktualisiert.',
    deleted: 'Erfolgreich gelöscht.',
    sent: 'Erfolgreich gesendet.',
    uploaded: 'Erfolgreich hochgeladen.',
    copied: 'In die Zwischenablage kopiert.',
    exported: 'Erfolgreich exportiert.',
    imported: 'Erfolgreich importiert.',
  },

  // ==================================================================================
  // EMPTY-STATES
  // ==================================================================================
  emptyStates: {
    noBookings: {
      title: 'Keine Aufträge vorhanden',
      description: 'Erstellen Sie Ihren ersten Auftrag, um loszulegen.',
      action: 'Auftrag erstellen',
    },
    noCustomers: {
      title: 'Keine Kunden vorhanden',
      description: 'Fügen Sie Ihren ersten Kunden hinzu.',
      action: 'Kunde hinzufügen',
    },
    noDrivers: {
      title: 'Keine Fahrer vorhanden',
      description: 'Legen Sie Ihren ersten Fahrer an.',
      action: 'Fahrer hinzufügen',
    },
    noVehicles: {
      title: 'Keine Fahrzeuge vorhanden',
      description: 'Registrieren Sie Ihr erstes Fahrzeug.',
      action: 'Fahrzeug hinzufügen',
    },
    noInvoices: {
      title: 'Keine Rechnungen vorhanden',
      description: 'Erstellen Sie Ihre erste Rechnung.',
      action: 'Rechnung erstellen',
    },
    noResults: {
      title: 'Keine Ergebnisse',
      description: 'Ihre Suche lieferte keine Treffer.',
      action: 'Filter zurücksetzen',
    },
    noData: {
      title: 'Keine Daten verfügbar',
      description: 'Es sind noch keine Daten vorhanden.',
    },
  },

  // ==================================================================================
  // ZEITANGABEN
  // ==================================================================================
  time: {
    now: 'Jetzt',
    today: 'Heute',
    yesterday: 'Gestern',
    tomorrow: 'Morgen',
    thisWeek: 'Diese Woche',
    nextWeek: 'Nächste Woche',
    thisMonth: 'Dieser Monat',
    nextMonth: 'Nächster Monat',
    thisYear: 'Dieses Jahr',
    ago: 'vor',
    in: 'in',
    minutes: 'Minuten',
    hours: 'Stunden',
    days: 'Tagen',
    weeks: 'Wochen',
    months: 'Monaten',
    years: 'Jahren',
  },

  // ==================================================================================
  // COMMON PHRASES
  // ==================================================================================
  common: {
    loading: 'Wird geladen...',
    saving: 'Wird gespeichert...',
    deleting: 'Wird gelöscht...',
    processing: 'Wird verarbeitet...',
    pleaseWait: 'Bitte warten...',
    areYouSure: 'Sind Sie sicher?',
    confirmDelete: 'Möchten Sie diesen Eintrag wirklich löschen?',
    cannotBeUndone: 'Diese Aktion kann nicht rückgängig gemacht werden.',
    selectAll: 'Alle auswählen',
    deselectAll: 'Alle abwählen',
    showMore: 'Mehr anzeigen',
    showLess: 'Weniger anzeigen',
    readMore: 'Weiterlesen',
    collapse: 'Einklappen',
    expand: 'Ausklappen',
    optional: 'Optional',
    required: 'Erforderlich',
    na: 'N/A',
    none: 'Keine',
    all: 'Alle',
    or: 'oder',
    and: 'und',
    of: 'von',
    per: 'pro',
  },

  // ==================================================================================
  // DASHBOARD
  // ==================================================================================
  dashboard: {
    title: 'Dashboard',
    overview: 'Übersicht',
    recentActivity: 'Letzte Aktivitäten',
    quickActions: 'Schnellaktionen',
    urgentActions: 'Dringende Aktionen',
    liveMap: 'Live-Karte',
    weather: 'Wetter',
    traffic: 'Verkehrslage',
    statistics: 'Statistiken',
  },

  // ==================================================================================
  // COMING SOON (Neue Services)
  // ==================================================================================
  comingSoon: {
    title: 'Neue Features kommen bald',
    subtitle: 'Wir arbeiten an spannenden neuen Funktionen für MyDispatch',
    firstRelease: 'Erste Veröffentlichung',
    stayTuned: 'Bleiben Sie dran!',
    notifyMe: 'Benachrichtigen Sie mich',
    comingSoonText: 'Diese Funktion wird in Kürze verfügbar sein.',
  },
} as const;

export default content;
