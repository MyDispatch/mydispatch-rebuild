/**
 * ==================================================================================
 * MASTER DASHBOARD CONTENT V40.12 - Zentrale Deutsche Texte
 * ==================================================================================
 * ZWECK: Single Source of Truth für alle Texte im Master-Dashboard
 * - Vollständige deutsche Lokalisierung
 * - DIN 5008-konforme Formatierung
 * - Zentrale Verwaltung aller UI-Texte
 * ==================================================================================
 */

export const masterDashboardContent = {
  header: {
    title: "Master System Dashboard",
    subtitle: "Zentrale System-Kontrolle & Quality Assurance",
    lastUpdate: "Letzte Aktualisierung",
  },

  systemHealth: {
    uptime: "System-Verfügbarkeit",
    errorRate: "Fehlerquote",
    activeUsers: "Aktive Nutzer",
    dbResponse: "Datenbank-Antwortzeit",
    trends: {
      vsLastWeek: "vs. letzte Woche",
      today: "heute",
      yesterday: "vs. gestern",
    },
  },

  tabs: {
    companies: "Firmen",
    quality: "Code-Qualität",
    system: "System-Status",
    agent: "KI-Agent",
    roadmap: "Roadmap",
    ci: "CI-Richtlinien",
  },

  companiesTab: {
    title: "Registrierte Firmen",
    tableHeaders: {
      name: "Name",
      status: "Status",
      bookings: "Aufträge",
      drivers: "Fahrer",
      created: "Erstellt",
      actions: "Aktionen",
    },
    loading: "Firmen werden geladen...",
    noCompanies: "Keine Firmen gefunden",
    detailsFor: "Details für",
    detailDialog: {
      companyId: "Firmen-ID",
      status: "Status",
      email: "E-Mail",
      bookings: "Aufträge",
      drivers: "Fahrer",
      vehicles: "Fahrzeuge",
      downloadReport: "Bericht herunterladen",
      sendEmail: "E-Mail senden",
      edit: "Bearbeiten",
      archive: "Archivieren",
    },
  },

  qualityTab: {
    testCoverage: "Test-Abdeckung",
    codeQuality: "Code-Qualität Score",
    technicalDebt: "Technische Schulden",
    estimatedRefactor: "Geschätzte Refaktor-Zeit",
    sonarQubeRating: "SonarQube Bewertung",
    vsLastWeek: "vs. letzte Woche",
  },

  quickActions: {
    title: "Schnellaktionen",
    context: "Kontext",
    tooltips: {
      addCompany: "Erstellt eine neue Firma im System",
      csvImport: "Importiert Firmen aus CSV-Datei",
      exportList: "Exportiert Firmenliste als PDF",
      startCheck: "Startet vollständige Code-Qualitätsprüfung",
      qualityReport: "Generiert detaillierten Qualitätsbericht",
      refreshData: "Aktualisiert alle Dashboard-Daten",
      systemMonitor: "Öffnet Echtzeit-System-Monitor",
      systemLogs: "Zeigt aktuelle System-Logs an",
      dbBackup: "Startet manuelles Datenbank-Backup",
      clearCache: "Leert Browser- und CDN-Cache",
      analytics: "Zeigt detaillierte Analytics",
      systemSettings: "Öffnet System-Einstellungen",
      refreshHealth: "Aktualisiert System-Health-Metriken",
      securityScan: "Führt vollständigen Sicherheitsscan durch",
      accessControl: "Verwaltet Zugriffskontrolle und Berechtigungen",
      vulnerabilityCheck: "Prüft System auf Schwachstellen",
      deployProduction: "Deployed aktuelle Version nach Production",
      deploymentStatus: "Zeigt Status aller Deployments",
      createBranch: "Erstellt neuen Git-Branch",
      exportRoadmap: "Exportiert Roadmap als PDF",
      runCiCheck: "Führt CI/CD Pipeline aus",
      downloadGuidelines: "Lädt CI/CD Richtlinien herunter",
      ciSettings: "Öffnet CI/CD Konfiguration",
    },
    categories: {
      primary: "Primär",
      secondary: "Weitere",
      systemCategory: "System",
      companies: {
        addCompany: "Firma hinzufügen",
        csvImport: "CSV-Import",
        exportList: "Firmenliste exportieren",
      },
      quality: {
        startCheck: "Code-Prüfung starten",
        qualityReport: "Qualitätsbericht",
        refreshData: "Daten aktualisieren",
      },
      system: {
        systemMonitor: "System-Monitor",
        systemLogs: "System-Logs",
        dbBackup: "DB Backup",
        clearCache: "Cache leeren",
        analytics: "Analytics",
        systemSettings: "System-Einstellungen",
        refreshHealth: "Health-Check aktualisieren",
      },
      agent: {
        securityScan: "Sicherheitsscan",
        accessControl: "Zugriffskontrolle",
        vulnerabilityCheck: "Schwachstellen-Prüfung",
      },
      roadmap: {
        deployProduction: "In Produktion deployen",
        deploymentStatus: "Deployment-Status",
        createBranch: "Branch erstellen",
        exportRoadmap: "Roadmap exportieren",
      },
      ci: {
        runCiCheck: "CI-Check ausführen",
        downloadGuidelines: "Richtlinien herunterladen",
        ciSettings: "CI-Einstellungen",
      },
    },
  },

  recentActivity: {
    title: "Letzte Aktivitäten",
    deploymentSuccessful: "Deployment erfolgreich",
    highCpuUsage: "Hohe CPU-Auslastung erkannt",
    backupCompleted: "Backup abgeschlossen",
    timeAgo: {
      hours: (count: number) => (count === 1 ? "vor 1 Stunde" : `vor ${count} Stunden`),
      day: "vor 1 Tag",
      days: (count: number) => `vor ${count} Tagen`,
    },
  },

  systemStatus: {
    title: "System-Status",
    services: {
      api: "API",
      database: "Datenbank",
      storage: "Speicher",
      cdn: "CDN",
    },
    status: {
      online: "Online",
      offline: "Offline",
      degraded: "Eingeschränkt",
    },
  },

  ciGuidelines: {
    title: "CI/CD-Richtlinien & Best Practices",
    componentCreation: "Standards für Component-Erstellung",
    componentRules: [
      "IMMER V28.1 Design-System nutzen (V28IconBox, V28Button, V28MarketingCard)",
      "KEINE Duplikate erstellen - existierende Components wiederverwenden",
      "IMMER COMPONENT_REGISTRY.md vor Erstellung prüfen",
    ],
    codeQuality: "Code-Qualitätsprüfungen",
    qualityRules: [
      "ESLint: 0 Fehler, 0 Warnungen (Strict Mode)",
      "TypeScript: Strict Mode aktiviert",
      "Test-Abdeckung: Mindestens 80 %",
    ],
    deployment: "Deployment-Prozess",
    deploymentRules: [
      "Feature Branch → Pull Request → Code Review → Main",
      "Automatische Tests müssen grün sein",
      "Lighthouse Score: 90+ (Performance, Barrierefreiheit, SEO)",
    ],
  },

  toasts: {
    newCompany: "Neue Firma erstellen",
    csvImport: "CSV-Import starten",
    exportPdf: "PDF-Export",
    codeCheck: "Code-Qualitätsprüfung läuft...",
    reportGenerating: "Bericht wird generiert",
    dataRefreshing: "Daten werden aktualisiert",
    systemMonitor: "System-Monitor geöffnet",
    logsLoading: "Logs werden geladen...",
    logsLoaded: "Logs erfolgreich geladen",
    logsError: "Fehler beim Laden der Logs",
    backupStarted: "Backup gestartet",
    backupSuccess: "Backup erfolgreich abgeschlossen",
    backupError: "Fehler beim Backup",
    cacheClearing: "Cache wird geleert...",
    cacheCleared: "Cache erfolgreich geleert",
    cacheError: "Fehler beim Cache leeren",
    analyticsLoading: "Analytics werden geladen...",
    analyticsLoaded: "Analytics erfolgreich geladen",
    analyticsError: "Fehler beim Laden der Analytics",
    settingsOpened: "Einstellungen geöffnet",
    healthCheck: "Health-Check läuft",
    securityScan: "Sicherheitsscan gestartet",
    securityScanComplete: "Sicherheitsscan abgeschlossen",
    securityScanError: "Fehler beim Sicherheitsscan",
    accessControl: "Zugriffskontrolle öffnen",
    vulnerabilityCheck: "Schwachstellen-Prüfung läuft",
    deploymentStarted: "Deployment gestartet",
    deploymentStatusLoading: "Deployment-Status wird geladen...",
    deploymentStatusLoaded: "Deployment-Status erfolgreich geladen",
    deploymentStatusError: "Fehler beim Laden des Deployment-Status",
    branchCreated: "Branch erstellt",
    roadmapExport: "Export läuft",
    ciCheck: "CI-Check läuft",
    guidelinesDownload: "Richtlinien werden heruntergeladen",
    ciSettings: "CI-Einstellungen geöffnet",
    reportDownload: "Bericht wird heruntergeladen...",
    emailDialog: "E-Mail-Dialog geöffnet",
    editMode: "Bearbeitungsmodus aktiviert",
    companyArchived: "Firma archiviert",
    companiesFetchError: "Firmen konnten nicht geladen werden",
    error: "Ein Fehler ist aufgetreten",
  },

  dialogs: {
    logs: {
      title: "System-Logs",
      description: "Aktuelle System-Logs und Fehlerberichte",
    },
    security: {
      title: "Sicherheitsscan Ergebnis",
      description: "Gefundene Sicherheitsprobleme und Empfehlungen",
    },
    deployment: {
      title: "Deployment-Status",
      description: "Status aller durchgeführten Deployments",
    },
    analytics: {
      title: "System-Analytics",
      description: "Detaillierte Nutzungsstatistiken",
    },
  },

  aria: {
    companiesTab: "Firmen-Übersicht anzeigen",
    qualityTab: "Qualitäts-Metriken anzeigen",
    systemTab: "System-Status anzeigen",
    agentTab: "KI-Agent Konfiguration",
    roadmapTab: "Roadmap anzeigen",
    ciTab: "Corporate Identity Einstellungen",
    quickActionsOpen: "Schnellaktionen öffnen",
    executeAction: "ausführen",
    apiStatus: "API Status",
    databaseStatus: "Datenbank Status",
    storageStatus: "Speicher Status",
    cdnStatus: "CDN Status",
  },

  errors: {
    systemLogsError: "System-Logs konnten nicht geladen werden",
    backupError: "Backup fehlgeschlagen",
    cacheError: "Cache konnte nicht geleert werden",
    securityScanError: "Security-Scan fehlgeschlagen",
    deploymentError: "Deployment-Status nicht verfügbar",
    genericError: "Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.",
  },
} as const;
