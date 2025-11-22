/**
 * ==========================================
 * KI-Assistent Page
 * ==========================================
 * Intelligenter KI-gestützter Support und Automatisierung
 * für MyDispatch Unternehmen
 */

import { useState } from 'react';
import { V28Card } from '@/components/design-system/V28Card';
import { V28Button } from '@/components/design-system/V28Button';
import { Zap, MessageSquare, FileText, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { Helmet } from 'react-helmet-async';

const KIAssistent = () => {
  const { company } = useAuth();
  const [activeTab, setActiveTab] = useState<'chat' | 'automation' | 'insights'>('chat');

  return (
    <>
      <Helmet>
        <title>KI-Assistent | MyDispatch</title>
        <meta
          name="description"
          content="Intelligenter KI-gestützter Support und Automatisierung für Ihre Taxi- und Mietwagenflotte"
        />
      </Helmet>

      <div className="space-y-6 sm:space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">KI-Assistent</h1>
          <p className="text-muted-foreground">
            Ihr intelligenter Partner für Automatisierung und Optimierung
          </p>
        </div>

        {/* Feature Status Banner */}
        <V28Card className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border-primary/20">
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-primary/20 p-3">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground mb-1">
                KI-Features in Entwicklung
              </h3>
              <p className="text-muted-foreground text-sm mb-3">
                Dieser Bereich befindet sich in aktiver Entwicklung. Folgende KI-Features werden in Kürze verfügbar sein:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="text-foreground">Intelligenter Chat-Support</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <AlertCircle className="h-4 w-4 text-warning" />
                  <span className="text-foreground">Automatische Routenoptimierung</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <AlertCircle className="h-4 w-4 text-warning" />
                  <span className="text-foreground">Prädiktive Nachfrageanalyse</span>
                </div>
              </div>
            </div>
          </div>
        </V28Card>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-border">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'chat'
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <MessageSquare className="h-4 w-4 inline mr-2" />
            KI-Chat
          </button>
          <button
            onClick={() => setActiveTab('automation')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'automation'
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Zap className="h-4 w-4 inline mr-2" />
            Automatisierung
          </button>
          <button
            onClick={() => setActiveTab('insights')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'insights'
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <TrendingUp className="h-4 w-4 inline mr-2" />
            Insights
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'chat' && (
          <V28Card>
            <div className="text-center py-12">
              <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                KI-Chat Support
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                Stellen Sie Fragen zu Ihrem Dashboard, erhalten Sie sofortige Antworten und lassen Sie sich bei der täglichen Arbeit unterstützen.
              </p>
              <V28Button variant="default" disabled>
                <MessageSquare className="h-4 w-4 mr-2" />
                Chat starten (Coming Soon)
              </V28Button>
            </div>
          </V28Card>
        )}

        {activeTab === 'automation' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <V28Card>
              <div className="p-6">
                <div className="rounded-full bg-primary/10 p-3 w-fit mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Intelligente Fahrerzuweisung
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Automatische Zuweisung von Aufträgen basierend auf Standort, Verfügbarkeit und Fahrzeugtyp.
                </p>
                <V28Button variant="outline" size="sm" disabled>
                  Konfigurieren (Coming Soon)
                </V28Button>
              </div>
            </V28Card>

            <V28Card>
              <div className="p-6">
                <div className="rounded-full bg-accent/10 p-3 w-fit mb-4">
                  <TrendingUp className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Routenoptimierung
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  KI-gestützte Routenplanung für maximale Effizienz und minimale Leerfahrten.
                </p>
                <V28Button variant="outline" size="sm" disabled>
                  Aktivieren (Coming Soon)
                </V28Button>
              </div>
            </V28Card>

            <V28Card>
              <div className="p-6">
                <div className="rounded-full bg-success/10 p-3 w-fit mb-4">
                  <FileText className="h-6 w-6 text-success" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Automatische Dokumentation
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Automatische Erstellung von Berichten, Statistiken und Compliance-Dokumenten.
                </p>
                <V28Button variant="outline" size="sm" disabled>
                  Einrichten (Coming Soon)
                </V28Button>
              </div>
            </V28Card>

            <V28Card>
              <div className="p-6">
                <div className="rounded-full bg-warning/10 p-3 w-fit mb-4">
                  <AlertCircle className="h-6 w-6 text-warning" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Wartungserinnerungen
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Intelligente Vorhersage von Wartungsbedarf und automatische Benachrichtigungen.
                </p>
                <V28Button variant="outline" size="sm" disabled>
                  Aktivieren (Coming Soon)
                </V28Button>
              </div>
            </V28Card>
          </div>
        )}

        {activeTab === 'insights' && (
          <V28Card>
            <div className="text-center py-12">
              <TrendingUp className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                KI-gestützte Insights
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                Erhalten Sie datengetriebene Empfehlungen zur Optimierung Ihres Geschäfts, Identifikation von Trends und Verbesserung der Rentabilität.
              </p>
              <V28Button variant="default" disabled>
                <TrendingUp className="h-4 w-4 mr-2" />
                Insights generieren (Coming Soon)
              </V28Button>
            </div>
          </V28Card>
        )}

        {/* Roadmap */}
        <V28Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Roadmap</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-success"></div>
                <span className="text-sm text-muted-foreground">
                  Q1 2025: KI-Chat Support (Beta)
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-warning"></div>
                <span className="text-sm text-muted-foreground">
                  Q2 2025: Automatische Fahrerzuweisung
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-muted-foreground/30"></div>
                <span className="text-sm text-muted-foreground">
                  Q3 2025: Prädiktive Nachfrageanalyse
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-muted-foreground/30"></div>
                <span className="text-sm text-muted-foreground">
                  Q4 2025: Vollautomatische Disposition
                </span>
              </div>
            </div>
          </div>
        </V28Card>
      </div>
    </>
  );
};

export default KIAssistent;
