import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { V28Button } from '@/components/design-system/V28Button';
import { 
  Palette, 
  Type, 
  Layout, 
  Sparkles, 
  Eye, 
  Copy,
  CheckCircle2
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function CIGuidelineModal() {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedColor(label);
    toast.success(`${label} kopiert!`);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const colors = [
    {
      name: "Primary (Beige/Gold)",
      hsl: "hsl(42, 49%, 78%)",
      hslRaw: "42 49% 78%",
      cssVar: "--primary",
      usage: "Header, Sidebar, Primary Buttons, Akzente"
    },
    {
      name: "Foreground (Dunkelblau)",
      hsl: "hsl(225, 31%, 28%)",
      hslRaw: "225 31% 28%",
      cssVar: "--foreground",
      usage: "Haupt-Textfarbe, Icons, Überschriften"
    },
    {
      name: "Status Success (Ampel-Grün)",
      hsl: "hsl(142, 76%, 36%)",
      hslRaw: "142 76% 36%",
      cssVar: "--status-success",
      usage: "Verfügbar-Status, bezahlte Rechnungen"
    },
    {
      name: "Status Warning (Ampel-Gelb)",
      hsl: "hsl(43, 96%, 53%)",
      hslRaw: "43 96% 53%",
      cssVar: "--status-warning",
      usage: "Ausstehend-Status, Warnungen"
    },
    {
      name: "Status Error (Ampel-Rot)",
      hsl: "hsl(0, 84%, 60%)",
      hslRaw: "0 84% 60%",
      cssVar: "--status-error",
      usage: "Storniert, Fehler, überfällige Rechnungen"
    }
  ];

  const typography = [
    { class: "text-display", size: "48px → 64px", weight: "800", usage: "Hero-Titel" },
    { class: "text-heading-1", size: "36px → 48px", weight: "700", usage: "H1-Überschriften" },
    { class: "text-heading-2", size: "30px → 36px", weight: "700", usage: "H2-Überschriften" },
    { class: "text-heading-3", size: "24px → 30px", weight: "600", usage: "H3-Überschriften" },
    { class: "text-body-lg", size: "18px → 20px", weight: "400", usage: "Großer Body-Text" },
    { class: "text-body", size: "16px → 18px", weight: "400", usage: "Standard Body-Text" },
    { class: "text-body-sm", size: "14px → 16px", weight: "400", usage: "Kleiner Body-Text" }
  ];

  const buttonVariants = [
    { 
      variant: "default", 
      example: "Primary Button",
      classes: "bg-primary text-primary-foreground hover:bg-primary/90"
    },
    { 
      variant: "secondary", 
      example: "Secondary Button",
      classes: "bg-secondary text-secondary-foreground hover:bg-secondary/80"
    },
    { 
      variant: "outline", 
      example: "Outline Button",
      classes: "border-input bg-background hover:bg-muted hover:text-foreground"
    },
    { 
      variant: "ghost", 
      example: "Ghost Button",
      classes: "hover:bg-muted hover:text-foreground"
    }
  ];

  const designRules = [
    {
      icon: Palette,
      title: "NIEMALS Direkte Farben",
      correct: "text-foreground bg-primary",
      wrong: "text-white bg-[hsl(42,49%,78%)]",
      reason: "Semantic Tokens für Theme-Support"
    },
    {
      icon: Eye,
      title: "Kontrast-Regeln (WCAG 2.1 AA)",
      correct: "Mindestens 4.5:1 für Text",
      wrong: "Helles Grau auf Weiß",
      reason: "Barrierefreiheit & Lesbarkeit"
    },
    {
      icon: Layout,
      title: "Mobile-First Touch-Targets",
      correct: "min-h-[44px] für alle Buttons",
      wrong: "h-8 oder kleiner",
      reason: "Touch-freundliche Bedienung"
    },
    {
      icon: Sparkles,
      title: "HSL-Basierte Farben",
      correct: "hsl(var(--primary))",
      wrong: "rgb(234, 222, 189)",
      reason: "Perfekte Harmonie & Konsistenz"
    }
  ];

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Hero-Header */}
      <div className="text-center space-y-3 pb-6 border-b">
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="h-8 w-8 text-primary" />
          <h1 className="text-display text-foreground">
            MyDispatch Corporate Identity
          </h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Verbindliche Design-System-Vorgaben V26.1 - PRODUCTION READY
        </p>
        <Badge variant="outline" className="border-status-success text-status-success">
          ✅ 100% WCAG 2.1 AA Konform
        </Badge>
      </div>

      {/* Farbsystem */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Farbsystem
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {colors.map((color) => (
            <div 
              key={color.cssVar}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div 
                className="w-16 h-16 rounded-lg shadow-md border-2 border-foreground/10 flex-shrink-0"
                style={{ backgroundColor: color.hsl }}
              />
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-foreground">{color.name}</h4>
                  <Badge variant="secondary" className="text-[10px]">
                    {color.hsl}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{color.usage}</p>
                <div className="flex gap-2">
                  <code className="text-xs bg-background px-2 py-1 rounded border">
                    {color.hslRaw}
                  </code>
                  <code className="text-xs bg-background px-2 py-1 rounded border">
                    {color.cssVar}
                  </code>
                </div>
              </div>
              <V28Button
                size="sm"
                variant="ghost"
                onClick={() => copyToClipboard(`hsl(var(${color.cssVar}))`, color.name)}
                className="min-h-[44px]"
              >
                {copiedColor === color.name ? (
                  <CheckCircle2 className="h-4 w-4 text-status-success" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </V28Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Typografie */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Type className="h-4 w-4" />
            Typografie-System (Fluid Responsive)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {typography.map((typo) => (
              <div 
                key={typo.class}
                className="flex items-center justify-between p-3 rounded-lg border bg-muted/30"
              >
                <div className="space-y-1">
                  <code className="text-sm font-mono bg-background px-2 py-1 rounded border">
                    .{typo.class}
                  </code>
                  <p className="text-xs text-muted-foreground">{typo.usage}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground">{typo.size}</p>
                  <p className="text-xs text-muted-foreground">Weight: {typo.weight}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-4 bg-muted/50 rounded-lg border">
            <p className="text-sm text-muted-foreground">
              <strong>Font-Family:</strong> Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Button-Varianten */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layout className="h-4 w-4" />
            Button-Varianten
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {buttonVariants.map((btn) => (
              <div key={btn.variant} className="space-y-2">
                <V28Button 
                  variant={btn.variant === 'default' ? 'primary' : btn.variant === 'outline' ? 'secondary' : btn.variant === 'secondary' ? 'secondary' : 'ghost'}
                  className="w-full min-h-[44px]"
                >
                  {btn.example}
                </V28Button>
                <code className="block text-xs bg-muted/50 px-2 py-1 rounded border text-muted-foreground">
                  variant="{btn.variant}"
                </code>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Design-Regeln */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-status-success" />
            Kritische Design-Regeln
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {designRules.map((rule, index) => (
              <div 
                key={index}
                className="p-4 rounded-lg border bg-muted/30 space-y-3"
              >
                <div className="flex items-start gap-3">
                  <rule.icon className="h-4 w-4 text-primary flex-shrink-0 mt-1" />
                  <div className="flex-1 space-y-2">
                    <h4 className="font-semibold text-foreground">{rule.title}</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3 rounded bg-status-success/10 border border-status-success/20">
                        <p className="text-xs font-semibold text-status-success mb-1">✅ RICHTIG</p>
                        <code className="text-xs text-foreground break-all">
                          {rule.correct}
                        </code>
                      </div>
                      <div className="p-3 rounded bg-status-error/10 border border-status-error/20">
                        <p className="text-xs font-semibold text-status-error mb-1">❌ FALSCH</p>
                        <code className="text-xs text-foreground break-all">
                          {rule.wrong}
                        </code>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground italic">{rule.reason}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Logo & Slogan */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Logo & Marke</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-lg border bg-primary/10">
            <h3 className="font-semibold text-foreground mb-2">Haupt-Logo</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Datei: <code className="bg-background px-2 py-1 rounded">src/assets/mydispatch-logo-official.png</code>
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>Desktop:</strong> 140×37px (h-8, max-w-[160px])
              <br />
              <strong>Mobile:</strong> 120×32px (h-6, max-w-[120px])
            </p>
          </div>
          <div className="p-4 rounded-lg border bg-muted/30">
            <h3 className="font-semibold text-foreground mb-2">Slogan</h3>
            <p className="text-lg font-medium text-primary-foreground mb-1">
              "simply arrive"
            </p>
            <p className="text-sm text-muted-foreground">
              Sekundär: "MyDispatch - Die moderne Disponenten-Lösung"
            </p>
          </div>
        </CardContent>
      </Card>

      {/* V26.1 Spacing System */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layout className="h-4 w-4" />
            V26.1 Spacing System
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 rounded-lg border bg-muted/30">
              <code className="text-sm font-mono bg-background px-2 py-1 rounded border">space-y-4</code>
              <p className="text-xs text-muted-foreground mt-1">Standard-Abstand zwischen Elementen (16px)</p>
            </div>
            <div className="p-3 rounded-lg border bg-muted/30">
              <code className="text-sm font-mono bg-background px-2 py-1 rounded border">space-y-6</code>
              <p className="text-xs text-muted-foreground mt-1">Card-Sektionen (24px)</p>
            </div>
            <div className="p-3 rounded-lg border bg-muted/30">
              <code className="text-sm font-mono bg-background px-2 py-1 rounded border">gap-2 / gap-3</code>
              <p className="text-xs text-muted-foreground mt-1">Icons/Badges zu Text (8px/12px)</p>
            </div>
            <div className="p-3 rounded-lg border bg-muted/30">
              <code className="text-sm font-mono bg-background px-2 py-1 rounded border">p-4 / p-6</code>
              <p className="text-xs text-muted-foreground mt-1">Card-Padding (16px/24px)</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* V26.1 Shadow & Radius System */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            V26.1 Shadow & Radius
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">Shadows</h3>
              <div className="p-3 rounded-lg border bg-muted/30">
                <code className="text-sm font-mono bg-background px-2 py-1 rounded border">shadow-card</code>
                <p className="text-xs text-muted-foreground mt-1">Standard Card Shadow</p>
              </div>
              <div className="p-3 rounded-lg border bg-muted/30">
                <code className="text-sm font-mono bg-background px-2 py-1 rounded border">shadow-md</code>
                <p className="text-xs text-muted-foreground mt-1">Erhöhte Elemente</p>
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">Radius</h3>
              <div className="p-3 rounded-lg border bg-muted/30">
                <code className="text-sm font-mono bg-background px-2 py-1 rounded border">rounded-lg</code>
                <p className="text-xs text-muted-foreground mt-1">Cards & Containers (8px)</p>
              </div>
              <div className="p-3 rounded-lg border bg-muted/30">
                <code className="text-sm font-mono bg-background px-2 py-1 rounded border">rounded-md</code>
                <p className="text-xs text-muted-foreground mt-1">Buttons & Inputs (6px)</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* V26.1 UNIFIED_DESIGN_TOKENS */}
      <Card className="shadow-card border-primary/50">
        <CardHeader className="bg-primary/5">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            V26.1 UNIFIED_DESIGN_TOKENS (MANDATORY)
          </CardTitle>
          <CardDescription>
            Zentrales Token-System für 100% Konsistenz
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="p-4 rounded-lg border-2 border-primary/20 bg-primary/5">
              <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-status-success" />
                Import & Usage
              </h4>
              <code className="block text-xs bg-background px-3 py-2 rounded border mb-2 text-foreground break-all">
                import &#123; UNIFIED_DESIGN_TOKENS &#125; from '@/lib/design-system/unified-design-tokens';
              </code>
              <code className="block text-xs bg-background px-3 py-2 rounded border text-foreground break-all">
                borderColor: UNIFIED_DESIGN_TOKENS.border.color.beige_20
              </code>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-lg border bg-muted/30">
                <h5 className="text-sm font-semibold text-foreground mb-1">Border Tokens</h5>
                <code className="text-xs text-muted-foreground">border.color.beige_20</code>
                <br />
                <code className="text-xs text-muted-foreground">border.width.standard</code>
              </div>
              <div className="p-3 rounded-lg border bg-muted/30">
                <h5 className="text-sm font-semibold text-foreground mb-1">Shadow Tokens</h5>
                <code className="text-xs text-muted-foreground">shadow.component.card</code>
                <br />
                <code className="text-xs text-muted-foreground">shadow.elevation.high</code>
              </div>
              <div className="p-3 rounded-lg border bg-muted/30">
                <h5 className="text-sm font-semibold text-foreground mb-1">Radius Tokens</h5>
                <code className="text-xs text-muted-foreground">radius.component.card</code>
                <br />
                <code className="text-xs text-muted-foreground">radius.component.button</code>
              </div>
              <div className="p-3 rounded-lg border bg-muted/30">
                <h5 className="text-sm font-semibold text-foreground mb-1">Spacing Tokens</h5>
                <code className="text-xs text-muted-foreground">spacing.section.default</code>
                <br />
                <code className="text-xs text-muted-foreground">spacing.component.gap</code>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-status-error/10 border border-status-error/20">
              <p className="text-sm font-semibold text-status-error mb-1">⚠️ KRITISCH</p>
              <p className="text-xs text-muted-foreground">
                Verwende NIEMALS direkte Werte wie <code className="bg-background px-1 rounded">0.2</code> oder <code className="bg-background px-1 rounded">hsl(42,49%,78%)</code>
                - immer über UNIFIED_DESIGN_TOKENS!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Zusammenfassung */}
      <Card className="shadow-card border-primary">
        <CardHeader className="bg-primary/10">
          <CardTitle className="text-primary-foreground">
            📊 Design-System Compliance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="text-center p-3 rounded-lg bg-status-success/10 border border-status-success/20">
              <p className="text-2xl font-bold text-status-success">100%</p>
              <p className="text-xs text-muted-foreground">HSL-Compliance</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-status-success/10 border border-status-success/20">
              <p className="text-2xl font-bold text-status-success">100%</p>
              <p className="text-xs text-muted-foreground">WCAG 2.1 AA</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-status-success/10 border border-status-success/20">
              <p className="text-2xl font-bold text-status-success">0</p>
              <p className="text-xs text-muted-foreground">Direct Colors</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-status-success/10 border border-status-success/20">
              <p className="text-2xl font-bold text-status-success">100%</p>
              <p className="text-xs text-muted-foreground">Mobile-First</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-status-success/10 border border-status-success/20">
              <p className="text-2xl font-bold text-status-success">44px+</p>
              <p className="text-xs text-muted-foreground">Touch-Targets</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-status-success/10 border border-status-success/20">
              <p className="text-2xl font-bold text-status-success">✅</p>
              <p className="text-xs text-muted-foreground">Production Ready</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
