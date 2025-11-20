/* ==================================================================================
   SEO-DATEN - Keywords & Städte für Lokales SEO
   ==================================================================================
   Zentrale Datei für alle SEO-relevanten Daten
   ================================================================================== */

export const cityKeywords = [
  // Top 50 Städte Deutschland
  'München', 'Berlin', 'Hamburg', 'Frankfurt', 'Köln', 'Stuttgart', 'Düsseldorf',
  'Dortmund', 'Essen', 'Leipzig', 'Bremen', 'Dresden', 'Hannover', 'Nürnberg',
  'Duisburg', 'Bochum', 'Wuppertal', 'Bielefeld', 'Bonn', 'Münster', 'Karlsruhe',
  'Mannheim', 'Augsburg', 'Wiesbaden', 'Gelsenkirchen', 'Mönchengladbach', 'Braunschweig',
  'Chemnitz', 'Kiel', 'Aachen', 'Halle', 'Magdeburg', 'Freiburg', 'Krefeld',
  'Lübeck', 'Oberhausen', 'Erfurt', 'Mainz', 'Rostock', 'Kassel', 'Hagen',
  'Hamm', 'Saarbrücken', 'Mülheim', 'Potsdam', 'Ludwigshafen', 'Oldenburg',
  'Leverkusen', 'Osnabrück', 'Solingen', 'Heidelberg'
];

export const serviceKeywords = [
  // Haupt-Keywords
  'MyDispatch',
  'Taxi Software',
  'Taxiunternehmen Software',
  'Mietwagenunternehmen Software',
  'Limousinen-Service Software',
  'Limousinen-Service Verwaltung',
  
  // Funktions-Keywords
  'Dispositionssoftware',
  'Taxidisposition',
  'Flottenverwaltung',
  'Fuhrparkverwaltung',
  'Fahrzeugverwaltung',
  'Fahrermanagement',
  'Schichtplanung Taxi',
  'Auftragsmanagement',
  
  // Features
  'Live-Tracking',
  'GPS-Tracking Taxi',
  'Echtzeit-Disposition',
  'Partner-Netzwerk',
  'Rechnungsstellung Taxi',
  'Automatische Abrechnung',
  
  // Compliance
  'DSGVO-konform',
  'PBefG-konform',
  'Made in Germany',
  'Datenschutz Taxi Software',
  
  // Zielgruppen
  'Taxi Software Deutschland',
  'Mietwagen Verwaltungssoftware',
  'Limousinen Disposition',
  'Chauffeur Service Software'
];

export const serviceAreas = cityKeywords.flatMap(city => [
  `Taxi Software ${city}`,
  `Mietwagen Software ${city}`,
  `Limousinen-Service ${city}`,
  `Taxidisposition ${city}`,
  `Flottenverwaltung ${city}`
]);

export const longTailKeywords = [
  'beste Taxi Software Deutschland',
  'Dispositionssoftware für Taxiunternehmen',
  'Taxi Verwaltungssoftware DSGVO-konform',
  'Mietwagen Flottenverwaltung online',
  'Limousinen-Service Buchungssystem',
  'Taxi Partner-Netzwerk Software',
  'Schichtplanung Taxi digital',
  'GPS-Tracking Taxiunternehmen',
  'Taxidisposition Echtzeit',
  'Taxi Rechnungssoftware automatisch'
];
