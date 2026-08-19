import { Reveal, Chapter } from "./Reveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  { q: "Do I need any special software?", a: "No. Business Toolkit is an editable Excel and Google Sheets template. If you can open either format, you can use it." },
  { q: "Is it really fully editable?", a: "Yes. Change categories, colours, labels and formulas however you like. It's your file forever." },
  { q: "What exactly am I buying?", a: "A digital, editable Excel and Google Sheets Business Toolkit with record-keeping tabs, summary dashboards, categories, formulas, and charts. It is not a financial product or professional advice service." },
  { q: "How do I receive the file after buying?", a: "After your Razorpay payment is verified, the editable Google Sheet link appears immediately and is also sent to your registered email address." },
  { q: "Is this a one-time payment?", a: "Yes. Pay ₹290 once for the digital Business Toolkit. There is no subscription or recurring charge." },
  { q: "Will my numbers update automatically?", a: "The template includes formulas and summaries that update as you enter your own records. It is an organizational spreadsheet, not accounting, tax, investment, or financial advice." },
];

export default function FAQ() {
  return (
    <section id="faq" className="px-5 sm:px-8 py-24 sm:py-32 bg-[#ebeae6] border-y border-[#0f0f0f]" data-testid="faq-section">
      <div className="max-w-[1000px] mx-auto">
        <Chapter number="05" label="Questions" />
        <Reveal className="mb-12">
          <h2 className="font-display font-black text-4xl sm:text-6xl leading-[0.95] tracking-tighter">
            Everything you might ask.
          </h2>
        </Reveal>
        <Accordion type="single" collapsible className="w-full" data-testid="faq-accordion">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-b border-[#0f0f0f]/30">
              <AccordionTrigger
                data-testid={`faq-trigger-${i}`}
                className="font-display font-bold text-lg sm:text-2xl text-left py-6 hover:no-underline hover:text-[#595959] transition-colors"
              >
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-[#595959] text-base leading-relaxed pb-6 max-w-2xl">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
