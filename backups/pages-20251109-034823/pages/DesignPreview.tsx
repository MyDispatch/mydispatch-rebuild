/* ==================================================================================
   DESIGN-PREVIEW V19.0 - TEST-SEITE FÜR NEUES HOME-DESIGN
   ==================================================================================
   TEMPORÄR: Diese Seite wird nach Freigabe wieder gelöscht!
   
   ZWECK: Visualisierung des neuen Home-Page-Designs nach Konzept:
   - Fixed Header/Footer (Beige #EADEBD)
   - Hero mit aktuellem Bild
   - Feature-Grid mit Screenshots
   - CI-konforme Farben (Beige, Dunkelblau, Weiß)
   - Proaktiver Chatbot-Mockup
   - 12-Column Grid-System
   ================================================================================== */

import { V28Button } from '@/components/design-system/V28Button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Car, Users, FileText, BarChart, Map, Smartphone, 
  Code, Shield, Zap, ArrowRight, Check, MessageCircle
} from 'lucide-react';
import { useState, useEffect } from 'react';

export default function DesignPreview() {
  const [showChatbot, setShowChatbot] = useState(false);

  // Chatbot proaktiv nach 3 Sekunden
  useEffect(() => {
    const timer = setTimeout(() => setShowChatbot(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* ==================== FIXED HEADER (BEIGE) ==================== */}
      <header className="sticky top-0 z-50 w-full bg-primary border-b border-primary/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <Car className="h-6 w-6 text-foreground" />
              <span className="text-xl font-bold text-foreground">MyDispatch</span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-sm font-medium text-foreground hover:text-foreground/80 transition-colors">
                Funktionen
              </a>
              <a href="#pricing" className="text-sm font-medium text-foreground hover:text-foreground/80 transition-colors">
                Preise
              </a>
              <a href="#about" className="text-sm font-medium text-foreground hover:text-foreground/80 transition-colors">
                Über uns
              </a>
            </nav>
            <div className="flex items-center gap-3">
              <V28Button 
                variant="secondary" 
                size="sm"
                className="border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground"
              >
                Login
              </V28Button>
              <V28Button 
                size="sm"
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
                variant="primary"
              >
                Anmelden
              </V28Button>
            </div>
          </div>
        </div>
      </header>

      {/* ==================== HERO-SECTION ==================== */}
      <section className="relative w-full bg-gradient-to-br from-primary via-primary/90 to-primary/70">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-32">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Text-Content (7 Columns) */}
            <div className="lg:col-span-7 space-y-6">
              <Badge className="bg-secondary text-secondary-foreground">
                Die Zukunft der Taxi-Disposition
              </Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Ihre Flotte. <br />
                Intelligent gesteuert.
              </h1>
              <p className="text-lg text-foreground/80 max-w-2xl">
                MyDispatch revolutioniert die Taxi- und Mietwagendisposition mit KI-gestützter Routenoptimierung, 
                Echtzeit-Tracking und automatisierter Auftragsvergabe. Sparen Sie Zeit, Kosten und steigern Sie die Kundenzufriedenheit.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <V28Button 
                  size="lg" 
                  className="bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-lg"
                  variant="primary"
                >
                  Jetzt starten
                  <ArrowRight className="ml-2 h-5 w-5" />
                </V28Button>
                <V28Button 
                  size="lg" 
                  variant="secondary"
                  className="border-foreground text-foreground hover:bg-foreground/10"
                >
                  Demo ansehen
                </V28Button>
              </div>
              <div className="flex items-center gap-8 pt-4">
                <div>
                  <div className="text-3xl font-bold text-foreground">500+</div>
                  <div className="text-sm text-foreground/70">Aktive Unternehmen</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-foreground">15.000+</div>
                  <div className="text-sm text-foreground/70">Tägliche Fahrten</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-foreground">98%</div>
                  <div className="text-sm text-foreground/70">Zufriedenheit</div>
                </div>
              </div>
            </div>

            {/* Hero-Image (5 Columns) */}
            <div className="lg:col-span-5">
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-4 border-background">
                <img 
                  src="/lovable-uploads/01b7e30a-fe5a-4b7d-b3db-2e60afb4bedc.png"
                  alt="Frau steigt in Taxi"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-secondary/20 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== PROBLEM-STATEMENT ==================== */}
      <section className="py-16 sm:py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Kennen Sie diese Herausforderungen?
            </h2>
            <div className="grid sm:grid-cols-3 gap-6 pt-8">
              <Card className="border-destructive/20">
                <CardContent className="pt-6 space-y-2 text-center">
                  <div className="text-4xl">😓</div>
                  <h3 className="font-semibold text-foreground">Chaotische Disposition</h3>
                  <p className="text-sm text-muted-foreground">
                    Manuelle Auftragsvergabe kostet Zeit und führt zu Fehlern
                  </p>
                </CardContent>
              </Card>
              <Card className="border-destructive/20">
                <CardContent className="pt-6 space-y-2 text-center">
                  <div className="text-4xl">📞</div>
                  <h3 className="font-semibold text-foreground">Ständige Anrufe</h3>
                  <p className="text-sm text-muted-foreground">
                    Fahrer rufen an, Kunden warten – Stress für alle
                  </p>
                </CardContent>
              </Card>
              <Card className="border-destructive/20">
                <CardContent className="pt-6 space-y-2 text-center">
                  <div className="text-4xl">💸</div>
                  <h3 className="font-semibold text-foreground">Leerfahrten</h3>
                  <p className="text-sm text-muted-foreground">
                    Ineffiziente Routen verursachen unnötige Kosten
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== SOLUTION-OVERVIEW (3-COLUMN GRID) ==================== */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Die Lösung: MyDispatch
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Eine zentrale Plattform, die alle Bereiche Ihrer Disposition automatisiert und optimiert
            </p>
          </div>

          {/* 12-Column Grid System */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Zap,
                title: 'Echtzeit-Disposition',
                description: 'Automatische Auftragsvergabe an den nächsten verfügbaren Fahrer mit KI-Optimierung'
              },
              {
                icon: Map,
                title: 'Live-Tracking',
                description: 'Verfolgen Sie Ihre gesamte Flotte in Echtzeit auf einer interaktiven Karte'
              },
              {
                icon: Smartphone,
                title: 'Fahrer-App',
                description: 'Native iOS/Android App für Fahrer mit Offline-Funktionalität'
              },
              {
                icon: BarChart,
                title: 'Business Intelligence',
                description: 'Detaillierte Auswertungen, KPIs und Forecasting für bessere Entscheidungen'
              },
              {
                icon: Shield,
                title: 'DSGVO-konform',
                description: 'Höchste Sicherheitsstandards und vollständige Compliance mit deutschem Recht'
              },
              {
                icon: Code,
                title: 'API-Integration',
                description: 'Offene Schnittstellen für nahtlose Integration in Ihre Systeme'
              }
            ].map((feature, idx) => (
              <Card key={idx} className="hover:shadow-lg transition-shadow border-primary/10">
                <CardContent className="pt-6 space-y-3">
                  <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-secondary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== FEATURE DEEP-DIVE (TEXT + SCREENSHOT) ==================== */}
      <section className="py-16 sm:py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Screenshot (6 Columns) */}
            <div className="lg:col-span-6 order-2 lg:order-1">
              <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-2xl border-2 border-primary/20">
                {/* Placeholder für Dashboard-Screenshot */}
                <div className="w-full h-full bg-gradient-to-br from-secondary/10 to-primary/10 flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <BarChart className="h-16 w-16 text-muted-foreground mx-auto" />
                    <p className="text-sm text-muted-foreground">Dashboard-Screenshot</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Text-Content (6 Columns) */}
            <div className="lg:col-span-6 order-1 lg:order-2 space-y-6">
              <Badge className="bg-secondary text-secondary-foreground">Auftragsverwaltung</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                Aufträge im Blick – zu jeder Zeit
              </h2>
              <p className="text-lg text-muted-foreground">
                Das Dashboard zeigt alle offenen, laufenden und abgeschlossenen Aufträge in Echtzeit. 
                Filtern Sie nach Status, Fahrer oder Zeitraum und behalten Sie stets die volle Kontrolle.
              </p>
              <ul className="space-y-3">
                {[
                  'Automatische Auftragsvergabe basierend auf Standort und Verfügbarkeit',
                  'Live-Status-Updates von Fahrern direkt im Dashboard',
                  'Detaillierte Auftragshistorie mit GPS-Tracking und Zeitstempeln'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-status-success mt-0.5 shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
              <V28Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90" variant="primary">
                Mehr erfahren
                <ArrowRight className="ml-2 h-4 w-4" />
              </V28Button>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== PRICING ==================== */}
      <section id="pricing" className="py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Transparente Preise
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Wählen Sie das passende Paket für Ihr Unternehmen – ohne versteckte Kosten
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                name: 'Starter',
                price: '49€',
                period: '/Monat',
                features: ['Bis 5 Fahrer', 'Basis-Features', 'Email-Support'],
                highlight: false
              },
              {
                name: 'Business',
                price: '149€',
                period: '/Monat',
                features: ['Bis 20 Fahrer', 'Alle Features', 'Priority Support', 'API-Zugang'],
                highlight: true
              },
              {
                name: 'Enterprise',
                price: 'Individuell',
                period: '',
                features: ['Keine Limit bei Fahrern', 'Custom Features', '24/7 Support', 'Dedicated Manager'],
                highlight: false
              }
            ].map((plan, idx) => (
              <Card 
                key={idx} 
                className={plan.highlight ? 'border-secondary shadow-xl scale-105' : 'border-primary/10'}
              >
                <CardContent className="pt-6 space-y-6">
                  {plan.highlight && (
                    <Badge className="bg-secondary text-secondary-foreground">Beliebteste Wahl</Badge>
                  )}
                  <div>
                    <h3 className="text-2xl font-bold text-foreground">{plan.name}</h3>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                      <span className="text-muted-foreground">{plan.period}</span>
                    </div>
                  </div>
                  <ul className="space-y-3">
                    {plan.features.map((feature, fidx) => (
                      <li key={fidx} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-status-success" />
                        <span className="text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <V28Button 
                    className={
                      plan.highlight 
                        ? 'w-full bg-secondary text-secondary-foreground hover:bg-secondary/90' 
                        : 'w-full bg-primary text-foreground hover:bg-primary/90'
                    }
                    variant="primary"
                  >
                    {plan.name === 'Enterprise' ? 'Kontakt aufnehmen' : 'Jetzt starten'}
                  </V28Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== CTA ==================== */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-primary via-primary/90 to-primary/70">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Bereit für die Zukunft der Disposition?
            </h2>
            <p className="text-lg text-foreground/80">
              Starten Sie jetzt mit MyDispatch – monatlich kündbar, ohne Setup-Gebühr.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <V28Button 
                size="lg"
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-lg"
                variant="primary"
              >
                Jetzt registrieren
                <ArrowRight className="ml-2 h-5 w-5" />
              </V28Button>
              <V28Button 
                size="lg"
                variant="secondary"
                className="border-foreground text-foreground hover:bg-foreground/10"
              >
                Persönliche Demo buchen
              </V28Button>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FIXED FOOTER (BEIGE) ==================== */}
      <footer className="bg-primary border-t border-primary/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Car className="h-6 w-6 text-foreground" />
                <span className="text-xl font-bold text-foreground">MyDispatch</span>
              </div>
              <p className="text-sm text-foreground/70">
                Die intelligente Lösung für Taxi- und Mietwagendisposition
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Produkt</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-foreground/70 hover:text-foreground">Funktionen</a></li>
                <li><a href="#" className="text-foreground/70 hover:text-foreground">Preise</a></li>
                <li><a href="#" className="text-foreground/70 hover:text-foreground">Demo</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Unternehmen</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-foreground/70 hover:text-foreground">Über uns</a></li>
                <li><a href="#" className="text-foreground/70 hover:text-foreground">Karriere</a></li>
                <li><a href="#" className="text-foreground/70 hover:text-foreground">Kontakt</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Rechtliches</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-foreground/70 hover:text-foreground">Impressum</a></li>
                <li><a href="#" className="text-foreground/70 hover:text-foreground">Datenschutz</a></li>
                <li><a href="#" className="text-foreground/70 hover:text-foreground">AGB</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-foreground/10 text-center text-sm text-foreground/70">
            © 2025 MyDispatch. Alle Rechte vorbehalten.
          </div>
        </div>
      </footer>

      {/* ==================== PROAKTIVER CHATBOT (BOTTOM-RIGHT) ==================== */}
      {showChatbot && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
          {/* Speech Bubble */}
          <div className="mb-3 bg-background border border-primary/20 rounded-lg shadow-xl p-4 max-w-xs">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                <MessageCircle className="h-5 w-5 text-secondary-foreground" />
              </div>
              <div className="space-y-2 flex-1">
                <p className="text-sm text-foreground font-medium">
                  👋 Hallo! Ich bin Max, Ihr MyDispatch-Assistent.
                </p>
                <p className="text-xs text-muted-foreground">
                  Haben Sie Fragen zu MyDispatch? Ich helfe gerne!
                </p>
                <div className="flex gap-2">
                  <V28Button 
                    size="sm" 
                    className="bg-secondary text-secondary-foreground hover:bg-secondary/90 text-xs h-7"
                    variant="primary"
                  >
                    Chat starten
                  </V28Button>
                  <V28Button 
                    size="sm" 
                    variant="ghost" 
                    className="text-xs h-7"
                    onClick={() => setShowChatbot(false)}
                  >
                    Später
                  </V28Button>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Button (Alternative) */}
          <button 
            className="w-14 h-14 rounded-full bg-secondary text-secondary-foreground shadow-xl hover:scale-110 transition-transform flex items-center justify-center"
            onClick={() => setShowChatbot(!showChatbot)}
          >
            <MessageCircle className="h-6 w-6" />
          </button>
        </div>
      )}
    </div>
  );
}
