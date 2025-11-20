/* ==================================================================================
   CONTACT PAGE - V28.1 PROFESSIONAL MINIMALISM
   ==================================================================================
   ✅ V28.1 Design System konform
   ✅ V28 Components (Hero, Section, Card, Button, IconBox)
   ✅ Layout konsistent mit Home/Pricing/Docs/FAQ
   🔄 Build Cache Clear Trigger - 2025-01-30
   ================================================================================== */

import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Phone, MapPin, Clock, Mail, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MarketingLayout } from "@/components/layout/MarketingLayout";
import { SEOHead } from "@/components/shared/SEOHead";
import { contactPageSchema } from "@/lib/schema-org";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { OpeningHours } from "@/components/office/OpeningHours";
import { V28HeroPremium } from "@/components/hero";
import { PremiumDashboardContent } from "@/components/dashboard/PremiumDashboardContent";
import { V28MarketingSection } from "@/components/design-system/V28MarketingSection";
import { V28MarketingCard } from "@/components/design-system/V28MarketingCard";
import { V28IconBox } from "@/components/design-system/V28IconBox";
import { V28Button } from "@/components/design-system/V28Button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
const contactSchema = z.object({
  salutation: z.string().min(1, "Anrede ist erforderlich"),
  title: z.string().optional(),
  name: z.string().trim().min(2, "Name muss mindestens 2 Zeichen lang sein").max(100),
  email: z.string().trim().email("Ungültige E-Mail-Adresse").max(255),
  phone: z.string().trim().max(30).optional(),
  company: z.string().trim().max(200).optional(),
  subject: z.string().min(1, "Betreff ist erforderlich"),
  message: z.string().trim().min(10, "Nachricht muss mindestens 10 Zeichen lang sein").max(5000),
  dataProtection: z
    .boolean()
    .refine((val) => val === true, "Datenschutzerklärung muss akzeptiert werden"),
});

type ContactFormData = z.infer<typeof contactSchema>;
const Contact = () => {
  const { toast } = useToast();

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      salutation: "",
      title: "",
      name: "",
      email: "",
      phone: "",
      company: "",
      subject: "",
      message: "",
      dataProtection: false,
    },
  });

  const handleSubmit = async (data: ContactFormData) => {
    try {
      const { error } = await supabase.functions.invoke("send-contact-email", {
        body: data,
      });

      if (error) throw new Error(error.message || "E-Mail konnte nicht gesendet werden");

      toast({
        title: "Nachricht gesendet!",
        description: "Wir melden uns schnellstmöglich bei Ihnen.",
      });

      form.reset();
    } catch (error: any) {
      toast({
        title: "Fehler",
        description: error.message || "Nachricht konnte nicht gesendet werden.",
        variant: "destructive",
      });
    }
  };
  return (
    <MarketingLayout currentPage="contact">
      <SEOHead
        title="Kontakt"
        description="Kontaktieren Sie MyDispatch. Telefon: +49 170 8004423, E-Mail: info@my-dispatch.de. Wir helfen Ihnen gerne weiter."
        canonical="/contact"
        schema={contactPageSchema}
        keywords={[
          "MyDispatch Kontakt",
          "Taxi Software Support",
          "MyDispatch Telefon",
          "Dispositionssoftware Ansprechpartner",
          "MyDispatch E-Mail",
        ]}
      />

      {/* Hero Section - V32.0 PREMIUM DASHBOARD */}
      <V28HeroPremium
        variant="demo"
        backgroundVariant="3d-premium"
        badge={{ text: "Support & Hilfe", icon: MessageSquare }}
        title="Persönlicher Support, wenn Sie ihn brauchen"
        subtitle="Unser deutschsprachiges Team beantwortet Ihre Fragen in der Regel innerhalb von 24 Stunden"
        description="Keine Callcenter, keine Warteschleifen - echte Taxi-Experten helfen Ihnen weiter."
        primaryCTA={{
          label: "Nachricht senden",
          onClick: () => {
            const contactForm = document.getElementById("contact-form");
            contactForm?.scrollIntoView({ behavior: "smooth" });
          },
        }}
        secondaryCTA={{
          label: "Anrufen",
          onClick: () => (window.location.href = "tel:+491708004423"),
        }}
        visual={<PremiumDashboardContent pageType="contact" />}
        businessMetrics={[
          { label: "Antwortzeit", value: "<2h", sublabel: "werktags" },
          { label: "Zufriedenheit", value: "98%", sublabel: "Kundenbewertung" },
          { label: "Unternehmen", value: "450+", sublabel: "vertrauen uns" },
        ]}
        trustElements={true}
      />

      {/* Contact Info Cards Section */}
      <V28MarketingSection
        background="canvas"
        title="Kontaktmöglichkeiten"
        description="Wählen Sie Ihren bevorzugten Kontaktweg"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* E-Mail Card */}
          <V28MarketingCard className="text-center transition-all duration-300 hover:shadow-2xl hover:scale-[1.01]">
            <div className="flex flex-col items-center gap-4">
              <V28IconBox icon={Mail} variant="slate" />
              <div className="text-center">
                <h3 className="font-sans text-lg font-semibold text-slate-900 mb-2">E-Mail</h3>
                <p className="font-sans text-sm text-slate-600 mb-3 text-center">
                  Schreiben Sie uns
                </p>
                <a
                  href="mailto:info@my-dispatch.de"
                  className="font-sans text-base text-slate-700 hover:text-slate-900 hover:underline min-h-[44px] inline-flex items-center justify-center transition-colors"
                >
                  info@my-dispatch.de
                </a>
              </div>
            </div>
          </V28MarketingCard>

          {/* Phone Card */}
          <V28MarketingCard className="text-center transition-all duration-300 hover:shadow-2xl hover:scale-[1.01]">
            <div className="flex flex-col items-center gap-4">
              <V28IconBox icon={Phone} variant="slate" />
              <div className="text-center">
                <h3 className="font-sans text-lg font-semibold text-slate-900 mb-2">Telefon</h3>
                <p className="font-sans text-sm text-slate-600 mb-3 text-center">
                  Rufen Sie uns an
                </p>
                <a
                  href="tel:+491708004423"
                  className="font-sans text-base text-slate-700 hover:text-slate-900 hover:underline min-h-[44px] inline-flex items-center justify-center transition-colors"
                >
                  +49 170 8004423
                </a>
              </div>
            </div>
          </V28MarketingCard>

          {/* Opening Hours Card */}
          <V28MarketingCard className="text-center transition-all duration-300 hover:shadow-2xl hover:scale-[1.01]">
            <div className="flex flex-col items-center gap-4">
              <V28IconBox icon={Clock} variant="slate" />
              <div className="text-center w-full">
                <h3 className="font-sans text-lg font-semibold text-slate-900 mb-2">
                  Öffnungszeiten
                </h3>
                <OpeningHours compact={false} showIcon={false} />
              </div>
            </div>
          </V28MarketingCard>
        </div>

        {/* Contact Form & Additional Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div id="contact-form">
            <V28MarketingCard className="ring-2 ring-slate-300 shadow-2xl">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 mb-4">
                  <Mail className="w-8 h-8 text-slate-700" />
                </div>
                <h2 className="font-sans text-2xl font-semibold text-slate-900 mb-2">
                  Nachricht senden
                </h2>
                <p className="font-sans text-sm text-slate-600">
                  Füllen Sie das Formular aus und wir melden uns schnellstmöglich
                </p>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                  {/* Row 1: Anrede & Titel */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="salutation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-sans text-sm font-medium text-slate-700">
                            Anrede <span className="text-red-600">*</span>
                          </FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="border-slate-300 focus:border-slate-500 focus:ring-slate-500">
                                <SelectValue placeholder="Auswählen..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-background z-50">
                              <SelectItem value="Herr">Herr</SelectItem>
                              <SelectItem value="Frau">Frau</SelectItem>
                              <SelectItem value="Divers">Divers</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-sans text-sm font-medium text-slate-700">
                            Titel
                          </FormLabel>
                          <Select onValueChange={field.onChange} value={field.value || undefined}>
                            <FormControl>
                              <SelectTrigger className="border-slate-300 focus:border-slate-500 focus:ring-slate-500">
                                <SelectValue placeholder="Kein Titel" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-background z-50">
                              <SelectItem value="Dr.">Dr.</SelectItem>
                              <SelectItem value="Prof.">Prof.</SelectItem>
                              <SelectItem value="Prof. Dr.">Prof. Dr.</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Row 2: Name & E-Mail */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-sans text-sm font-medium text-slate-700">
                            Name <span className="text-red-600">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Max Mustermann"
                              className="border-slate-300 focus:border-slate-500 focus:ring-slate-500"
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-sans text-sm font-medium text-slate-700">
                            E-Mail <span className="text-red-600">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="email"
                              placeholder="max@example.com"
                              className="border-slate-300 focus:border-slate-500 focus:ring-slate-500"
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Row 3: Telefon & Unternehmen */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-sans text-sm font-medium text-slate-700">
                            Telefon
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="tel"
                              placeholder="+49 123 456789"
                              className="border-slate-300 focus:border-slate-500 focus:ring-slate-500"
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="company"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-sans text-sm font-medium text-slate-700">
                            Unternehmen
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Musterfirma GmbH"
                              className="border-slate-300 focus:border-slate-500 focus:ring-slate-500"
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Row 4: Betreff */}
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-sans text-sm font-medium text-slate-700">
                          Betreff <span className="text-red-600">*</span>
                        </FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="border-slate-300 focus:border-slate-500 focus:ring-slate-500">
                              <SelectValue placeholder="Auswählen..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-background z-50">
                            <SelectItem value="sales">Vertrieb / Tarif-Anfrage</SelectItem>
                            <SelectItem value="support">Technischer Support</SelectItem>
                            <SelectItem value="billing">Abrechnung</SelectItem>
                            <SelectItem value="feedback">Feedback</SelectItem>
                            <SelectItem value="other">Sonstiges</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  {/* Row 5: Nachricht */}
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-sans text-sm font-medium text-slate-700">
                          Nachricht <span className="text-red-600">*</span>
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Ihre Nachricht..."
                            rows={5}
                            className="border-slate-300 focus:border-slate-500 focus:ring-slate-500 resize-none"
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  {/* Row 6: Datenschutz */}
                  <FormField
                    control={form.control}
                    name="dataProtection"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="mt-1 border-slate-300 data-[state=checked]:bg-slate-700 data-[state=checked]:border-slate-700"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="font-sans text-sm text-slate-700">
                            Datenschutz akzeptieren <span className="text-red-600">*</span>
                          </FormLabel>
                          <p className="font-sans text-xs text-slate-600">
                            Ich stimme der{" "}
                            <Link to="/datenschutz" className="underline hover:text-slate-900">
                              Datenschutzerklärung
                            </Link>{" "}
                            zu.
                          </p>
                          <FormMessage className="text-xs" />
                        </div>
                      </FormItem>
                    )}
                  />

                  {/* Submit Button */}
                  <div className="pt-4">
                    <V28Button
                      type="submit"
                      disabled={form.formState.isSubmitting}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-sans font-semibold h-12 rounded-lg shadow-lg hover:shadow-xl transition-all"
                      variant="primary"
                    >
                      {form.formState.isSubmitting ? "Wird gesendet..." : "Nachricht senden"}
                    </V28Button>
                  </div>
                </form>
              </Form>
            </V28MarketingCard>
          </div>

          {/* Additional Info */}
          <div className="space-y-6">
            <V28MarketingCard>
              <div className="flex items-start gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <V28IconBox icon={MapPin} variant="slate" />
                    <h3 className="font-sans text-lg font-semibold text-slate-900">
                      Unsere Adresse
                    </h3>
                  </div>
                  <p className="font-sans text-sm text-slate-600 leading-relaxed text-left">
                    RideHub Solutions
                    <br />
                    Ibrahim SIMSEK
                    <br />
                    Ensbachmühle 4<br />
                    D-94571 Schaufling
                    <br />
                    Deutschland
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <div className="relative w-24 h-24">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 opacity-50"></div>
                    <div className="absolute inset-2 rounded-xl bg-background shadow-lg flex items-center justify-center">
                      <MapPin className="w-12 h-12 text-slate-700" strokeWidth={1.5} />
                    </div>
                  </div>
                </div>
              </div>
            </V28MarketingCard>

            <V28MarketingCard>
              <div className="flex items-start gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <V28IconBox icon={Mail} variant="slate" />
                    <h3 className="font-sans text-lg font-semibold text-slate-900">
                      Häufige Anfragen
                    </h3>
                  </div>
                  <ul className="space-y-2">
                    <li>
                      <Link
                        to="/pricing"
                        className="font-sans text-sm text-slate-700 hover:text-slate-900 hover:underline min-h-[44px] inline-flex items-center transition-colors"
                      >
                        → Welcher Tarif passt zu mir?
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/faq"
                        className="font-sans text-sm text-slate-700 hover:text-slate-900 hover:underline min-h-[44px] inline-flex items-center transition-colors"
                      >
                        → Häufig gestellte Fragen
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/docs"
                        className="font-sans text-sm text-slate-700 hover:text-slate-900 hover:underline min-h-[44px] inline-flex items-center transition-colors"
                      >
                        → Dokumentation & Anleitungen
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/"
                        className="font-sans text-sm text-slate-700 hover:text-slate-900 hover:underline min-h-[44px] inline-flex items-center transition-colors"
                      >
                        → Funktionen & Features
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/datenschutz"
                        className="font-sans text-sm text-slate-700 hover:text-slate-900 hover:underline min-h-[44px] inline-flex items-center transition-colors"
                      >
                        → Datenschutzerklärung
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/impressum"
                        className="font-sans text-sm text-slate-700 hover:text-slate-900 hover:underline min-h-[44px] inline-flex items-center transition-colors"
                      >
                        → Impressum
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className="flex-shrink-0">
                  <div className="relative w-24 h-24">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 opacity-50"></div>
                    <div className="absolute inset-2 rounded-xl bg-background shadow-lg flex items-center justify-center">
                      <Mail className="w-12 h-12 text-slate-700" strokeWidth={1.5} />
                    </div>
                  </div>
                </div>
              </div>
            </V28MarketingCard>
          </div>
        </div>
      </V28MarketingSection>
    </MarketingLayout>
  );
};

export default Contact;
