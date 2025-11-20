# 🎨 V28.1 SYSTEMWEITES DESIGN-TEMPLATE

**Version:** 1.0.0  
**Stand:** 2025-01-30  
**Status:** ✅ PRODUCTION-READY

---

## 🎯 MISSION

Alle Pre-Login-Seiten (Home, Features, FAQ, Impressum, Datenschutz, AGB, etc.) folgen **EXAKT** der gleichen Design-Sprache:

- ✅ Gleiche Section-Struktur
- ✅ Gleiche Component-Auswahl
- ✅ Gleiche Hover-Effects
- ✅ Gleiche Spacing-System
- ✅ Gleiche Animations
- ✅ Gleiche Typografie-Pattern

**Ziel:** Systemweite Konsistenz + Premium-Feeling + Wiederverwendbares Template für neue Seiten

---

## 📦 MANDATORY COMPONENTS (IMMER VERWENDEN!)

### 1. Hero-Section

**Template:**
```tsx
<V28HeroPremium
  variant="page-type" // 'features' | 'demo' | 'faq' | 'legal' | 'docs'
  backgroundVariant="3d-premium" // oder '3d-clean'
  badge={{ text: "Badge Text", icon: Icon }}
  title="Headline"
  subtitle="Subheadline"
  description="Optional description text"
  primaryCTA={{
    label: 'CTA Button',
    onClick: () => navigate('/path'),
    icon: Icon
  }}
  visual={<V28DashboardPreview animationDelay="0.4s" />}
  trustElements={true}
/>
```

**Verwendung:**
- ✅ **Alle Pre-Login-Seiten** nutzen `V28HeroPremium`
- ✅ **Immer** `visual={<V28DashboardPreview animationDelay="0.4s" />}` für Browser-Mockup
- ✅ Badge mit passendem Icon
- ❌ **Niemals** `V28PricingHero` außerhalb der Pricing-Seite nutzen

---

### 2. Features-Grid (mit Hover-Glow)

**Template:**
```tsx
<V28MarketingSection
  background="canvas"
  title="Section Title"
  description="Section Description"
>
  <div className="max-w-7xl mx-auto relative">
    {/* Decorative Floating Orbs */}
    <div className="absolute -top-10 -right-10 w-32 h-32 bg-slate-100 rounded-full blur-3xl opacity-30 pointer-events-none" />
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item, idx) => (
        <Link key={idx} to={item.link} className="group">
          <V28MarketingCard className="relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] cursor-pointer">
            {/* Hover-Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-slate-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
            
            {/* Content */}
            <div className="relative z-10">
              <V28IconBox 
                icon={item.icon} 
                variant="slate" 
                className="group-hover:scale-110 transition-transform duration-300" 
              />
              <h3 className="font-sans text-lg font-semibold mb-2 mt-4 text-slate-900">
                {item.title}
              </h3>
              <p className="font-sans text-sm leading-relaxed text-slate-600 mb-4">
                {item.description}
              </p>
              <div className="flex items-center gap-2 text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
                <span>Mehr erfahren</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </V28MarketingCard>
        </Link>
      ))}
    </div>
  </div>
</V28MarketingSection>
```

**Wichtige Merkmale:**
- ✅ Hover-Glow mit `bg-gradient-to-br from-slate-100`
- ✅ IconBox skaliert auf Hover (`group-hover:scale-110`)
- ✅ Relative Positioning mit `z-10` für Content
- ✅ Staggered Animations via `animationDelay`

---

### 3. Testimonials-Section (mit Slider)

**Template:**
```tsx
<V28MarketingSection
  background="white"
  title="Was unsere Kunden sagen"
  description="Professionelle Unternehmen vertrauen auf MyDispatch"
>
  <div className="max-w-6xl mx-auto">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {testimonials.slice(start, end).map((item, idx) => (
        <V28MarketingCard
          key={idx}
          className="transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] relative overflow-hidden group"
        >
          {/* Hover-Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Content */}
          <div className="relative z-10">
            {/* Star Rating */}
            <div className="flex gap-0.5 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className="w-4 h-4" 
                  fill={i < item.rating ? "#475569" : "none"}
                  stroke="#475569"
                />
              ))}
            </div>
            <p className="text-slate-700 italic mb-4">{item.quote}</p>
            <div className="text-sm text-slate-600">
              <strong className="text-slate-900">{item.company}</strong>
            </div>
          </div>
        </V28MarketingCard>
      ))}
    </div>
    
    <V28SliderControls {...sliderProps} />
  </div>
</V28MarketingSection>
```

---

### 4. FAQ-Section (Accordion in Card)

**Template:**
```tsx
<V28MarketingSection
  background="canvas"
  title="Häufige Fragen"
  description="Alles, was Sie wissen müssen"
>
  <V28MarketingCard className="max-w-3xl mx-auto">
    <Accordion type="single" collapsible className="space-y-0">
      {faqItems.map((item, idx) => (
        <V28AccordionItem
          key={idx}
          value={`faq-${idx}`}
          question={item.question}
          answer={item.answer}
        />
      ))}
    </Accordion>
  </V28MarketingCard>
</V28MarketingSection>
```

**Wichtig:**
- ✅ Immer `V28AccordionItem` statt `AccordionItem`
- ✅ `V28MarketingCard` als Wrapper
- ✅ `max-w-3xl mx-auto` für zentrierte Content-Breite

---

### 5. Cities-Section

**Template:**
```tsx
<CitiesPremiumSection cities={cityKeywords} maxVisible={30} />
```

**Wichtig:**
- ✅ Component nutzt intern `V28MarketingSection`
- ✅ Keine inline styles
- ✅ Responsive Grid (2-3-4-5 Columns)

---

### 6. Final-CTA-Section (mit Trust-Stats)

**Template:**
```tsx
<V28MarketingSection
  background="white"
  className="relative overflow-hidden"
>
  {/* Floating Orbs */}
  <div className="absolute top-[10%] right-[5%] w-[500px] h-[500px] bg-slate-200 rounded-full blur-3xl opacity-25 animate-float-slow pointer-events-none" />
  <div className="absolute bottom-[15%] left-[5%] w-[400px] h-[400px] bg-slate-300 rounded-full blur-3xl opacity-20 animate-float-slow pointer-events-none" style={{ animationDelay: '3s' }} />
  
  <div className="relative z-10 max-w-4xl mx-auto text-center">
    <h2 className="font-sans text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-6 text-slate-900">
      Bereit für die Zukunft?
    </h2>
    
    {/* Trust-Stats Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-12">
      {stats.map((stat, idx) => (
        <V28MarketingCard 
          key={idx} 
          className="p-4 shadow-sm hover:shadow-md transition-shadow animate-fade-in"
          style={{ animationDelay: `${0.1 + (idx * 0.1)}s` }}
        >
          <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-2">
            {stat.value}
          </div>
          <div className="text-xs md:text-sm text-slate-600">
            {stat.label}
          </div>
        </V28MarketingCard>
      ))}
    </div>
    
    {/* CTA Buttons */}
    <div className="flex flex-col sm:flex-row justify-center gap-4">
      <V28Button
        variant="primary"
        size="lg"
        onClick={() => navigate('/auth?mode=signup')}
      >
        Jetzt starten
      </V28Button>
      <V28Button
        variant="secondary"
        size="lg"
        onClick={() => navigate('/demo')}
      >
        Demo ansehen
      </V28Button>
    </div>
  </div>
</V28MarketingSection>
```

---

## 🎨 DESIGN-PRINZIPIEN (MANDATORY!)

### Colors (SEMANTIC ONLY!)

**Erlaubt:**
- ✅ `bg-slate-50` / `bg-white` (Background)
- ✅ `text-slate-900` (Headlines)
- ✅ `text-slate-700` (Subheadlines)
- ✅ `text-slate-600` (Body Text)
- ✅ `text-slate-500` (Secondary Text)
- ✅ `border-slate-200` (Borders)
- ✅ `border-slate-300` (Hover Borders)

**Verboten:**
- ❌ Hex-Codes (`#EADEBD`, `#475569`)
- ❌ Custom Colors außerhalb Slate-Palette
- ❌ `designTokens.colors.primary.DEFAULT`

---

### Spacing (CONSISTENT!)

**Section Padding:**
```tsx
py-16 md:py-20 lg:py-24  // Standard Section
```

**Container:**
```tsx
px-4 sm:px-6 lg:px-8  // Standard Container
```

**Grid Gaps:**
```tsx
gap-6         // Standard Feature-Grid
gap-4         // Dense Grid (Cities, Stats)
gap-3         // Very Dense (City-Items)
```

**Card Padding:**
```tsx
p-8   // Standard V28MarketingCard
p-4   // Compact Stats-Cards
```

---

### Typography (RESPONSIVE!)

**Headlines:**
```tsx
text-3xl sm:text-4xl md:text-5xl  // Main H1
text-2xl sm:text-3xl md:text-4xl  // H2
text-xl sm:text-2xl md:text-3xl   // H3
```

**Body Text:**
```tsx
text-base sm:text-lg              // Standard Body
text-sm                           // Secondary Text
text-xs                           // Tiny Text (Labels)
```

**Font Classes:**
```tsx
font-sans          // Immer verwenden
font-bold          // Headlines
font-semibold      // Subheadlines
font-medium        // Button Text, City Names
```

---

### Hover-Effects (PREMIUM!)

**Feature-Cards Hover-Glow:**
```tsx
className="relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] cursor-pointer"

{/* Hover-Glow Layer */}
<div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-slate-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
```

**IconBox Hover-Scale:**
```tsx
<V28IconBox 
  icon={Icon} 
  variant="slate" 
  className="group-hover:scale-110 transition-transform duration-300" 
/>
```

**Button Hover:**
```tsx
hover:shadow-2xl  // Buttons
hover:shadow-md   // Cards
```

---

### Animations (STAGGERED!)

**Fade-In Animation:**
```tsx
className="animate-fade-in"
style={{ animationDelay: `${idx * 100}ms` }}  // Staggered
```

**Floating Orbs:**
```tsx
className="animate-float-slow"
style={{ animationDelay: '2s' }}  // Second Orb
```

---

## ❌ ANTI-PATTERNS (NIEMALS!)

### 1. Inline Styles
```tsx
// ❌ FALSCH:
<h2 style={{ fontSize: "clamp(1.75rem, 2.5vw + 0.5rem, 2.75rem)" }}>

// ✅ RICHTIG:
<h2 className="text-3xl sm:text-4xl md:text-5xl">
```

### 2. Direktes Section-Tag
```tsx
// ❌ FALSCH:
<section className="py-24 bg-slate-50">

// ✅ RICHTIG:
<V28MarketingSection background="canvas">
```

### 3. Plain DIV statt Card
```tsx
// ❌ FALSCH:
<div className="p-8 rounded-2xl bg-white">

// ✅ RICHTIG:
<V28MarketingCard>
```

### 4. Direct Icon Import
```tsx
// ❌ FALSCH:
<MapPin className="w-6 h-6 text-slate-700" />

// ✅ RICHTIG (für Feature-Grid):
<V28IconBox icon={MapPin} variant="slate" />
```

### 5. Inkonsistente Link-Styles
```tsx
// ❌ FALSCH:
<Link to="/contact" className="text-blue-500 underline">

// ✅ RICHTIG:
<Link to="/contact" className="underline hover:text-slate-900 transition-colors font-semibold">
```

### 6. Verschiedene Hover-Effects
```tsx
// ❌ FALSCH: Jede Seite anders
hover:bg-slate-100  // Home
hover:bg-gray-200   // Features
hover:scale-105     // FAQ

// ✅ RICHTIG: Einheitlich
hover:shadow-2xl hover:scale-[1.02]  // Überall
```

---

## ✅ DEPLOYMENT-CHECKLIST PRO SEITE

### Hero-Section:
- [ ] Nutzt `V28HeroPremium` (nicht `V28PricingHero`)
- [ ] Visual: `<V28DashboardPreview animationDelay="0.4s" />`
- [ ] Badge mit passendem Icon
- [ ] Responsive Title (text-3xl sm:text-4xl md:text-5xl)

### Content-Sections:
- [ ] Alle Sections nutzen `V28MarketingSection`
- [ ] Alle Cards nutzen `V28MarketingCard`
- [ ] Alle Icons nutzen `V28IconBox` (außer inline lucide-react)
- [ ] Hover-Glow-Effects implementiert

### Design-Tokens:
- [ ] Keine inline styles (`style={{}}`)
- [ ] Semantic Colors (slate-Palette)
- [ ] Responsive Typography (sm:, md:, lg:)
- [ ] Consistent Spacing (gap-6, py-16 md:py-20)

### Animations:
- [ ] Staggered Animations vorhanden
- [ ] Floating Orbs in Premium-Sections
- [ ] Hover-Scale auf IconBox

### Trust-Elements:
- [ ] Trust-Line vorhanden (Footer, Cities-Section)
- [ ] Final-CTA-Section mit Stats-Grid
- [ ] Contact-Link stilvoll gestylt

---

## 📝 CHANGELOG

### v1.0.0 (2025-01-30)
- ✅ Initial Release
- ✅ Component-Templates definiert
- ✅ Design-Prinzipien dokumentiert
- ✅ Anti-Patterns aufgelistet
- ✅ Deployment-Checklist erstellt

---

## 🔗 RELATED DOCS

- `docs/V28_HOME_PRICING_FINAL_ALIGNMENT.md` - Home & Pricing Alignment
- `docs/V28_HOME_FINAL_FIXES.md` - Home FAQ/Feature-Card Patterns
- `docs/PRE_LOGIN_COMPLETE_V6.0.8.md` - Pre-Login Pages Migration
- `docs/02-ARCHITECTURE/Design-System.md` - Design System Overview
- `docs/V26.1_DESIGN_SYNC_DOCUMENTATION.md` - V26.1 Color Tokens

---

**STATUS:** ✅ PRODUCTION-READY  
**USAGE:** Dieses Template ist MANDATORY für ALLE neuen Pre-Login-Seiten!
