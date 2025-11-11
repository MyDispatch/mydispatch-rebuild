"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function V28HeroPremium() {
  return (
    <section
      data-testid="hero-section"
      data-background-variant="3d-premium"
      aria-label="Hero – MyDispatch Vorteile"
      className="relative v28-grid-bg overflow-hidden rounded-xl border"
    >
      {/* Subtle map pins to match design */}
      <div className="v28-grid-pin" style={{ top: "20%", left: "6%" }} />
      <div className="v28-grid-pin" style={{ top: "65%", left: "14%" }} />
      <div className="v28-grid-pin" style={{ top: "30%", left: "82%" }} />
      <div className="v28-grid-pin" style={{ top: "70%", left: "68%" }} />

      <div className="relative z-10 px-6 py-12 md:px-10 md:py-16">
        <div className="grid lg:grid-cols-2 gap-10 items-center max-w-7xl mx-auto">
          {/* Left: Text + Metrics + CTA */}
          <div className="space-y-6">
            {/* Meta-Line wie Vorlage */}
            <div className="text-[11px] text-slate-500">
              <span>Made in Germany</span>
              <span className="mx-2">•</span>
              <span>PbEfG-konform</span>
              <span className="mx-2">•</span>
              <span>DSGVO-sicher</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-slate-900">
              Disposition, die Zeit spart
              <br className="hidden md:block" />
              und Geld verdient
            </h1>

            {/* Subheadline */}
            <p className="text-slate-600 max-w-prose">
              Für Taxi-, Mietwagen- und Limousinen-Services – Made in Germany
            </p>
            <p className="text-slate-600 max-w-prose">
              Rechtssichere Disposition ohne Papierkram, PbEfG-konforme Dokumentation, automatische Rechnungen und einfache Tagesabläufe.
            </p>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-xl bg-white border p-4 shadow-[var(--shadow-card)]">
                <div className="text-2xl font-semibold text-slate-900">450+</div>
                <div className="text-xs text-slate-500">Unternehmen</div>
              </div>
              <div className="rounded-xl bg-white border p-4 shadow-[var(--shadow-card)]">
                <div className="text-2xl font-semibold text-slate-900">12.000+</div>
                <div className="text-xs text-slate-500">tägliche Fahrten</div>
              </div>
              <div className="rounded-xl bg-white border p-4 shadow-[var(--shadow-card)]">
                <div className="text-2xl font-semibold text-slate-900">+35%</div>
                <div className="text-xs text-slate-500">Produktivität</div>
              </div>
            </div>

            {/* CTA */}
            <div className="flex items-center gap-3">
              <Button asChild className="h-10 px-5 rounded-lg">
                <Link href="/dashboard">Jetzt starten</Link>
              </Button>
              <Link href="/impressum" className="text-sm text-slate-500 hover:text-slate-700 underline-offset-4 hover:underline">
                Made in Germany
              </Link>
            </div>
          </div>

          {/* Right: Dashboard Preview mit Browser-Topbar */}
          <div className="relative">
            <div className="mx-auto w-full max-w-md md:max-w-lg lg:max-w-xl">
              <div className="rounded-t-2xl border bg-white shadow-[var(--shadow-xl)]">
                {/* Browser Top Bar */}
                <div className="flex items-center gap-3 px-3 py-2 border-b">
                  <div className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full bg-red-400/80" />
                    <span className="w-3 h-3 rounded-full bg-yellow-400/80" />
                    <span className="w-3 h-3 rounded-full bg-green-400/80" />
                  </div>
                  <div className="mx-auto text-[11px] text-slate-500">my-dispatch.de/dashboard</div>
                  <span className="text-[10px] rounded-full border px-2 py-0.5 text-slate-600">Lite</span>
                </div>
                {/* Card Content */}
                <div className="p-4">
                  <div className="text-sm font-medium text-slate-700 mb-3">Dashboard-Übersicht</div>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { k: "Aktive Aufträge", v: "142" },
                      { k: "Umsatz (Monat)", v: "€12.5k" },
                      { k: "Aktive Fahrer", v: "28" },
                      { k: "Fahrzeuge", v: "35" },
                    ].map((m) => (
                      <div key={m.k} className="rounded-xl bg-white border p-4 shadow-[var(--shadow-card)]">
                        <div className="text-xs text-slate-500">{m.k}</div>
                        <div className="mt-1 text-xl font-semibold text-slate-900">{m.v}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <div className="text-xs font-medium text-slate-700 mb-2">Letzte Aktivitäten</div>
                    <div className="space-y-2">
                      {[
                        "Auftrag Nr. 8247 abgeschlossen",
                        "Neuer Auftrag #8251 im Einsatz",
                        "Vorprüfung: Buchung #8249",
                      ].map((t, i) => (
                        <div key={i} className="flex items-center justify-between rounded-lg border bg-white p-3">
                          <span className="text-xs text-slate-600">{t}</span>
                          <span className="text-[10px] text-slate-400">vor {i + 1} Min</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default V28HeroPremium;
