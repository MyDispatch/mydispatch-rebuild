import { useNavigate } from 'react-router-dom';
import { V28Button } from '@/components/design-system/V28Button';
import { Car, CheckCircle, Euro, TrendingUp } from 'lucide-react';
import officialLogo from '@/assets/mydispatch-logo-official.png';
import { SEOHead } from '@/components/shared/SEOHead';

export default function DriverWelcome() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Car,
      title: 'Flexible Arbeitszeiten',
      description: 'Bestimmen Sie selbst, wann Sie fahren möchten'
    },
    {
      icon: Euro,
      title: 'Attraktive Vergütung',
      description: 'Faire Bezahlung für jeden Auftrag'
    },
    {
      icon: TrendingUp,
      title: 'Wachstumschancen',
      description: 'Entwickeln Sie Ihre Karriere mit uns'
    },
    {
      icon: CheckCircle,
      title: 'Einfache Verwaltung',
      description: 'Alle Aufträge und Dokumente an einem Ort'
    }
  ];

  return (
    <>
      <SEOHead
        title="Willkommen - MyDispatch Fahrer-App"
        description="Werden Sie Teil des MyDispatch Fahrer-Netzwerks"
      />
      <div className="min-h-screen bg-portal-fahrer flex flex-col">
        {/* Header */}
        <div className="p-6 flex justify-center">
          <img 
            src={officialLogo} 
            alt="MyDispatch Logo" 
            className="h-12 w-auto object-contain"
          />
        </div>

        {/* Hero Section */}
        <div className="flex-1 px-6 py-8 flex flex-col items-center">
          {/* Illustration */}
          <div className="relative mb-8">
            <div className="w-64 h-64 bg-gradient-to-br from-primary via-primary-glow to-primary/60 rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform duration-300">
              <svg 
                width="160" 
                height="160" 
                viewBox="0 0 160 160" 
                fill="none"
                className="text-foreground"
              >
                {/* Stylized Car Icon */}
                <rect x="40" y="70" width="80" height="40" rx="8" fill="currentColor" opacity="0.9" />
                <circle cx="60" cy="110" r="12" fill="currentColor" />
                <circle cx="100" cy="110" r="12" fill="currentColor" />
                <path d="M50 70 L70 50 L90 50 L110 70" fill="currentColor" opacity="0.7" />
                <rect x="75" y="55" width="10" height="15" fill="white" opacity="0.9" />
              </svg>
            </div>
            
            {/* Decorative Dots */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-primary rounded-full opacity-60" />
            <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-primary rounded-full opacity-60" />
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-foreground text-center mb-4">
            Willkommen bei MyDispatch
          </h1>
          <p className="text-lg text-muted-foreground text-center mb-8 max-w-md">
            Starten Sie Ihre Karriere als Fahrer und profitieren Sie von unseren Vorteilen
          </p>

          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-4 w-full max-w-lg mb-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-card/90 backdrop-blur-sm rounded-2xl p-4 shadow-md hover:shadow-lg transition-shadow border border-border/50"
              >
                <feature.icon className="h-8 w-8 text-foreground mb-2" />
                <h3 className="font-semibold text-foreground text-sm mb-1">
                  {feature.title}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="p-6 space-y-3 bg-card/50 backdrop-blur-sm border-t border-border">
          <V28Button
            onClick={() => navigate('/driver/register')}
            variant="primary"
            size="lg"
            className="w-full rounded-full shadow-lg"
          >
            Jetzt registrieren
          </V28Button>
          <V28Button
            onClick={() => navigate('/driver/login')}
            variant="secondary"
            size="lg"
            className="w-full rounded-full"
          >
            Bereits registriert? Anmelden
          </V28Button>
        </div>
      </div>
    </>
  );
}
