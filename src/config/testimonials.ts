/* ==================================================================================
   TESTIMONIALS CONFIGURATION - SINGLE SOURCE OF TRUTH
   ==================================================================================
   ✅ Zentrale Testimonials-Definitionen
   ✅ Rating, Quotes, Company Info
   ✅ Priorität für Homepage
   ================================================================================== */

export const TESTIMONIALS = [
  {
    id: 1,
    name: 'Michael Schmidt',
    company: 'Taxi München GmbH',
    role: 'Geschäftsführer',
    quote: 'MyDispatch hat unsere Prozesse revolutioniert. Die GPS-Ortung in Echtzeit und die automatische Abrechnung sparen uns täglich mehrere Stunden.',
    rating: 5,
    image: '/testimonials/michael-schmidt.jpg',
    priority: 1,
  },
  {
    id: 2,
    name: 'Sandra Weber',
    company: 'Premium Limousinenservice',
    role: 'Inhaberin',
    quote: 'Besonders das VIP-Kundenmanagement und die White-Label-Lösung haben unseren Service auf ein neues Level gehoben.',
    rating: 5,
    image: '/testimonials/sandra-weber.jpg',
    priority: 2,
  },
  {
    id: 3,
    name: 'Thomas Müller',
    company: 'City Mietwagen Berlin',
    role: 'Operations Manager',
    quote: 'Die Integration war reibungslos und der Support ist erstklassig. Wir können MyDispatch jedem Mietwagenunternehmen empfehlen.',
    rating: 5,
    image: '/testimonials/thomas-mueller.jpg',
    priority: 3,
  },
] as const;

export type Testimonial = typeof TESTIMONIALS[number];
export type TestimonialId = Testimonial['id'];

export function getTestimonialById(id: TestimonialId): Testimonial | undefined {
  return TESTIMONIALS.find(t => t.id === id);
}

export function getTopTestimonials(limit: number = 3): Testimonial[] {
  return [...TESTIMONIALS].sort((a, b) => a.priority - b.priority).slice(0, limit);
}
