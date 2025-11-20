import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { V28Button } from "@/components/design-system/V28Button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Mail } from "lucide-react";
import officialLogo from "@/assets/mydispatch-logo-official.png";
import { SEOHead } from "@/components/shared/SEOHead";
import { useToast } from "@/hooks/use-toast";

export default function DriverVerifyEmail() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState(["", "", "", "", "", ""]);

  const handleCodeChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`code-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const verificationCode = code.join("");

    if (verificationCode.length !== 6) {
      toast({
        title: "Ungültiger Code",
        description: "Bitte geben Sie den vollständigen 6-stelligen Code ein",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // NOTE: Email-Verifikation via Supabase Auth geplant (V18.4+)
      // Aktueller Placeholder simuliert erfolgreiche Verifikation
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "E-Mail bestätigt",
        description: "Ihr Konto wurde erfolgreich verifiziert",
      });

      navigate("/driver/onboarding");
    } catch (error) {
      toast({
        title: "Verifizierung fehlgeschlagen",
        description: "Der eingegebene Code ist ungültig",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast({
        title: "Code erneut gesendet",
        description: "Bitte überprüfen Sie Ihr Postfach",
      });
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Code konnte nicht erneut gesendet werden",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <SEOHead
        title="E-Mail bestätigen - MyDispatch Fahrer-App"
        description="Bestätigen Sie Ihre E-Mail-Adresse"
      />
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        {/* Header */}
        <div className="p-6 flex items-center justify-between">
          <V28Button
            variant="secondary"
            size="sm"
            onClick={() => navigate("/driver/register")}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </V28Button>
          <img src={officialLogo} alt="MyDispatch Logo" className="h-10 w-auto object-contain" />
          <div className="w-10" />
        </div>

        {/* Content */}
        <div className="px-6 py-8">
          <div className="max-w-md mx-auto space-y-6">
            {/* Icon */}
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center">
                <Mail className="h-10 w-10 text-foreground" />
              </div>
            </div>

            {/* Title */}
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold text-foreground">E-Mail bestätigen</h1>
              <p className="text-muted-foreground">
                Wir haben Ihnen einen 6-stelligen Code an Ihre E-Mail-Adresse gesendet
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Code Input */}
              <div className="flex justify-center gap-3">
                {code.map((digit, index) => (
                  <Input
                    key={index}
                    id={`code-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-14 text-center text-2xl font-bold bg-background"
                  />
                ))}
              </div>

              <V28Button
                type="submit"
                disabled={isLoading}
                variant="primary"
                size="lg"
                className="w-full"
              >
                {isLoading ? "Wird bestätigt..." : "Bestätigen"}
              </V28Button>
            </form>

            {/* Resend Link */}
            <div className="text-center pt-4">
              <p className="text-muted-foreground text-sm mb-2">Code nicht erhalten?</p>
              <button
                onClick={handleResend}
                className="text-primary hover:text-primary/80 font-semibold"
              >
                Code erneut senden
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
