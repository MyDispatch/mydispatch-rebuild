import { useState, useEffect } from 'react';
import { AlertCircle, X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ServiceStatus {
  hereMaps: boolean;
  stripe: boolean;
}

export function ServiceStatusBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [serviceStatus, setServiceStatus] = useState<ServiceStatus>({
    hereMaps: false,
    stripe: false,
  });

  useEffect(() => {
    // Check service availability
    const status = {
      hereMaps: !!import.meta.env.VITE_HERE_API_KEY,
      stripe: !!import.meta.env.VITE_STRIPE_PUBLIC_KEY,
    };
    setServiceStatus(status);

    // Check if banner was dismissed
    const dismissed = localStorage.getItem('service-status-banner-dismissed');
    if (dismissed === 'true') {
      setIsVisible(false);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('service-status-banner-dismissed', 'true');
  };

  // Don't show if all services are configured
  const allServicesConfigured = serviceStatus.hereMaps && serviceStatus.stripe;

  // Don't show in production if all critical services are configured
  if (import.meta.env.PROD && (serviceStatus.hereMaps && serviceStatus.stripe)) {
    return null;
  }

  if (!isVisible || allServicesConfigured) {
    return null;
  }

  const missingServices = [];
  if (!serviceStatus.hereMaps) missingServices.push('HERE Maps (GPS/Geocoding im Demo-Modus)');
  if (!serviceStatus.stripe) missingServices.push('Stripe (Zahlungen im Test-Modus)');
  if (!serviceStatus.sentry) missingServices.push('Sentry (Error Monitoring deaktiviert)');

  return (
    <Alert className="fixed bottom-4 right-4 max-w-md z-50 border-warning-border bg-warning-light">
      <AlertCircle className="h-4 w-4 text-warning-text" />
      <AlertDescription className="pr-8">
        <div className="font-semibold text-warning-text mb-1">Demo-Modus aktiv</div>
        <div className="text-sm text-warning-text">
          {missingServices.length === 1 ? 'Service' : 'Services'} ohne API Keys:
        </div>
        <ul className="text-sm text-warning-text mt-1 space-y-1">
          {missingServices.map((service) => (
            <li key={service} className="ml-2">• {service}</li>
          ))}
        </ul>
      </AlertDescription>
      <button
        onClick={handleDismiss}
        className="absolute top-3 right-3 text-warning-text hover:text-warning-text/80 transition-colors"
        aria-label="Banner schließen"
      >
        <X className="h-4 w-4" />
      </button>
    </Alert>
  );
}
