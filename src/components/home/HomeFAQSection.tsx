/* ==================================================================================
   HOME FAQ SECTION V28.1
   ================================================================================== */

import { Accordion } from "@/components/ui/accordion";
import { V28MarketingSection } from "@/components/design-system/V28MarketingSection";
import { V28MarketingCard } from "@/components/design-system/V28MarketingCard";
import { V28AccordionItem } from "@/components/pricing";
import { FAQ_DATA } from "@/data/faq-data";

export const HomeFAQSection = () => {
  return (
    <V28MarketingSection
      background="canvas"
      title="Häufig gestellte Fragen"
      description="Antworten auf die wichtigsten Fragen zu Tarifen, Verträgen und Zahlungsmodalitäten."
    >
      <div className="max-w-4xl mx-auto relative">
        {/* Decorative Elements */}
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-slate-100 rounded-full blur-3xl opacity-30 pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-slate-200 rounded-full blur-3xl opacity-20 pointer-events-none" />

        <V28MarketingCard contentClassName="p-0">
          <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
            {FAQ_DATA.map((faq, index, arr) => (
              <V28AccordionItem
                key={`faq-${index}`}
                value={`item-${index}`}
                question={faq.question}
                answer={faq.answer}
                isLast={index === arr.length - 1}
              />
            ))}
          </Accordion>
        </V28MarketingCard>
      </div>
    </V28MarketingSection>
  );
};

export default HomeFAQSection;
