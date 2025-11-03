# 📚 QUICK REFERENCE V18.5.1

**Schnellzugriff für häufigste Patterns**

---

## 🎨 SPACING

```tsx
// Header-Content
className="pt-14 sm:pt-16 pb-16 sm:pb-20"

// Modal
className="mt-14 sm:mt-16 max-h-[calc(90vh-4rem)]"

// Card
className="p-4 sm:p-6 md:p-8 gap-4 sm:gap-6"

// Section
className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8"
```

---

## 📝 TYPOGRAPHY

```tsx
// Headline (kein Umbruch)
<h1 className="hyphens-none break-words line-clamp-2">
  Titel
</h1>

// Body Text (Deutsch)
<p lang="de" className="hyphens-auto break-words leading-relaxed">
  Fließtext mit Silbentrennung
</p>

// Table Cell
<TableCell className="truncate max-w-[200px]" title={fullText}>
  {text}
</TableCell>

// Button
<Button className="whitespace-nowrap px-4 sm:px-6">
  CTA Text
</Button>

// Badge
<Badge className="whitespace-nowrap">Label</Badge>
```

---

## 🚫 OVERFLOW PREVENTION

```tsx
// Single Line
className="truncate max-w-[200px]"

// Multi Line
className="line-clamp-3 break-words"

// Scrollable Container
className="overflow-y-auto max-h-[calc(100vh-14rem)]"

// Badge Positioning
<Label className="relative pt-6 overflow-visible">
  <Badge className="absolute -top-3 z-10">Tag</Badge>
</Label>
```

---

## 📱 RESPONSIVE

```tsx
// Mobile-First Gaps
className="gap-3 sm:gap-4 md:gap-6"

// Mobile-First Padding
className="p-4 sm:p-6 md:p-8"

// Touch Targets
className="min-h-[44px] min-w-[44px]"

// Logo Sizing
className="h-7 sm:h-8 max-w-[120px] sm:max-w-[160px] md:max-w-[180px] object-contain"
```

---

## 🎯 SEMANTIC TOKENS

```tsx
// ✅ RICHTIG
className="text-foreground bg-background"
className="text-primary-foreground bg-primary"
className="text-muted-foreground"

// ❌ FALSCH
className="text-white bg-black"
className="text-[#323D5E]"
```

---

## ✅ QUALITY CHECKLIST

```
[ ] Spacing: Mobile-First (gap-3 sm:gap-4)
[ ] Typography: hyphens-auto (Deutsch)
[ ] Overflow: truncate + max-w OR line-clamp
[ ] Responsive: Touch-Targets min-h-[44px]
[ ] Colors: Semantic Tokens only
[ ] Modal: mt-14 sm:mt-16
```

---

**Version:** V18.5.1  
**Siehe auch:**
- SPACING_SYSTEM_V18.5.1.md
- TYPOGRAPHY_LINE_BREAK_SYSTEM_V18.5.1.md
- DESIGN_SYSTEM_V18_5_0.md
