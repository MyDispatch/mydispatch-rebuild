/* ==================================================================================
   TESTIMONIALS - 30+ Bewertungen für Home-Page
   ==================================================================================
   WICHTIG: Keine "Zentrale" in Bewertungen, nur Unternehmen/Service!
   Verteilung: 10x Mietwagenunternehmen, 10x Limousinen-Service, 10x Taxiunternehmen
   ================================================================================== */

export interface Testimonial {
  quote: string;
  company: string;
  rating: number;
}

export const testimonials: Testimonial[] = [
  // MIETWAGENUNTERNEHMEN (10)
  {
    quote:
      "MyDispatch hat unsere Disposition revolutioniert. Die Bedienung ist intuitiv und wir haben unsere Effizienz um 40% gesteigert.",
    company: "Mietwagenunternehmen Hamburg",
    rating: 5,
  },
  {
    quote:
      "Die Partner-Funktionen haben uns die Zusammenarbeit mit anderen Unternehmen enorm erleichtert.",
    company: "Mietwagenunternehmen München",
    rating: 5,
  },
  {
    quote:
      "Perfekte Lösung für unser Premium-Mietwagengeschäft. Live-Tracking und Verkehrsdaten sind Gold wert.",
    company: "Mietwagenunternehmen Frankfurt",
    rating: 5,
  },
  {
    quote:
      "Endlich eine Software, die alle unsere Anforderungen erfüllt. Rechnungsstellung in Sekunden!",
    company: "Mietwagenunternehmen Köln",
    rating: 5,
  },
  {
    quote: "Die Schichtplanung spart uns jede Woche mehrere Stunden Arbeit. Unbezahlbar!",
    company: "Mietwagenunternehmen Stuttgart",
    rating: 5,
  },
  {
    quote: "DSGVO-konform und Made in Germany – genau das, worauf wir gewartet haben.",
    company: "Mietwagenunternehmen Düsseldorf",
    rating: 5,
  },
  {
    quote:
      "Die Integration mit unserem Kunden-Portal war kinderleicht. Unsere Kunden lieben die Online-Buchung.",
    company: "Mietwagenunternehmen Dortmund",
    rating: 5,
  },
  {
    quote: "Support ist erstklassig. Antworten innerhalb von Stunden, nicht Tagen!",
    company: "Mietwagenunternehmen Essen",
    rating: 5,
  },
  {
    quote: "Die Kostenstellen-Verwaltung hat unsere Buchhaltung massiv vereinfacht.",
    company: "Mietwagenunternehmen Leipzig",
    rating: 5,
  },
  {
    quote: "Wir haben zu MyDispatch gewechselt und bereuen keine Sekunde. Alles läuft reibungslos.",
    company: "Mietwagenunternehmen Dresden",
    rating: 5,
  },

  // LIMOUSINEN-SERVICE (10)
  {
    quote:
      "Für unseren Limousinen-Service ist MyDispatch die perfekte Lösung. Premium-Features für Premium-Kunden.",
    company: "Limousinen-Service München",
    rating: 5,
  },
  {
    quote: "Die First Class Fahrzeugkategorien passen perfekt zu unserem Geschäftsmodell.",
    company: "Limousinen-Service Berlin",
    rating: 5,
  },
  {
    quote:
      "Angebotserstellung und Kundenkommunikation auf höchstem Niveau. Genau das, was wir brauchen.",
    company: "Limousinen-Service Hamburg",
    rating: 5,
  },
  {
    quote: "Live-Tracking gibt unseren VIP-Kunden absolute Sicherheit. Das zahlt sich aus!",
    company: "Limousinen-Service Frankfurt",
    rating: 5,
  },
  {
    quote: "Die Fahrzeugklassen-Auswahl ist exakt auf unsere Bedürfnisse zugeschnitten.",
    company: "Limousinen-Service Düsseldorf",
    rating: 5,
  },
  {
    quote:
      "Wir können unseren Service jetzt professionell skalieren. MyDispatch wächst mit uns mit.",
    company: "Limousinen-Service Stuttgart",
    rating: 5,
  },
  {
    quote: "Die Rechnungsstellung läuft automatisch. Wir sparen Stunden pro Woche!",
    company: "Limousinen-Service Köln",
    rating: 5,
  },
  {
    quote: "Unsere Kunden schätzen die professionelle Kommunikation über das Portal.",
    company: "Limousinen-Service Nürnberg",
    rating: 5,
  },
  {
    quote: "Die Dokumentenverwaltung hält uns gesetzeskonform ohne Aufwand.",
    company: "Limousinen-Service Hannover",
    rating: 5,
  },
  {
    quote: "MyDispatch ist die Investition wert. ROI in unter 3 Monaten erreicht!",
    company: "Limousinen-Service Bremen",
    rating: 5,
  },

  // TAXIUNTERNEHMEN (10)
  {
    quote:
      "DSGVO-konform, Made in Germany – das war uns wichtig. MyDispatch erfüllt alle Anforderungen perfekt.",
    company: "Taxiunternehmen Berlin",
    rating: 5,
  },
  {
    quote: "Der Support ist erstklassig. Probleme werden innerhalb von Stunden gelöst.",
    company: "Taxiunternehmen Köln",
    rating: 5,
  },
  {
    quote: "Die Schichtzettel-Funktion ist Gold wert. Keine Zettelwirtschaft mehr!",
    company: "Taxiunternehmen Hamburg",
    rating: 5,
  },
  {
    quote: "Unsere Fahrer lieben das System. Einfach und schnell zu bedienen.",
    company: "Taxiunternehmen München",
    rating: 5,
  },
  {
    quote: "Live-Verkehrsdaten helfen uns, immer die beste Route zu finden.",
    company: "Taxiunternehmen Stuttgart",
    rating: 5,
  },
  {
    quote: "Die Abrechnung ist jetzt ein Kinderspiel. Alles automatisch und fehlerfrei.",
    company: "Taxiunternehmen Frankfurt",
    rating: 5,
  },
  {
    quote: "Wir haben unseren Umsatz um 25% gesteigert seit wir MyDispatch nutzen.",
    company: "Taxiunternehmen Düsseldorf",
    rating: 5,
  },
  {
    quote: "Die mobile Ansicht ist perfekt. Disponieren von unterwegs funktioniert einwandfrei.",
    company: "Taxiunternehmen Dortmund",
    rating: 5,
  },
  {
    quote: "Partner-Netzwerk war ein Game-Changer für uns. Mehr Aufträge, weniger Leerlauf.",
    company: "Taxiunternehmen Leipzig",
    rating: 5,
  },
  {
    quote: "MyDispatch ist einfach die beste Taxi-Software auf dem Markt. Punkt.",
    company: "Taxiunternehmen Bremen",
    rating: 5,
  },

  // ZUSÄTZLICHE BEWERTUNGEN FÜR VIELFALT (6)
  {
    quote: "Die GPS-Tracking-Funktion gibt uns volle Kontrolle über unsere Flotte.",
    company: "Limousinen-Service Bonn",
    rating: 5,
  },
  {
    quote: "Wetterdaten-Integration ist genial. Wir können proaktiv disponieren.",
    company: "Taxiunternehmen Mannheim",
    rating: 5,
  },
  {
    quote: "Die Fahrzeugverwaltung mit Versicherungen und Wartungen ist durchdacht.",
    company: "Mietwagenunternehmen Karlsruhe",
    rating: 5,
  },
  {
    quote: "Kundenverwaltung mit Portal-Zugang – unsere Kunden sind begeistert!",
    company: "Limousinen-Service Wiesbaden",
    rating: 5,
  },
  {
    quote: "Die Statistiken geben uns endlich echte Einblicke in unser Geschäft.",
    company: "Taxiunternehmen Augsburg",
    rating: 5,
  },
  {
    quote: "MyDispatch ist mehr als Software – es ist ein Wettbewerbsvorteil.",
    company: "Mietwagenunternehmen Aachen",
    rating: 5,
  },
];
