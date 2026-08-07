import { Reveal, Chapter } from "./Reveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  { q: "Do I need any special software?", a: "No. It's a single Excel file that also works in Google Sheets. If you can open a spreadsheet, you can use this." },
  { q: "Is it really fully editable?", a: "Yes. Change categories, colours, labels and formulas however you like. It's your file forever." },
  { q: "How do I receive the file after buying?", a: "After your Razorpay payment is verified, the Google Sheet and tutorial download links appear immediately in the checkout window." },
  { q: "Is this a one-time payment?", a: "Absolutely. Pay ₹290 once via Razorpay and it's yours for life. No subscriptions, no recurring charges." },
  { q: "Will my numbers calculate automatically?", a: "Yes. Just enter your income and expenses — profit & loss, taxes and every dashboard update themselves with graphs." },
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
