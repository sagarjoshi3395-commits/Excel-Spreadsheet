import { Reveal, Chapter } from "./Reveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  { q: "Is this an Excel file or Google Sheets template?", a: "Both. LedgerKit is a digital template that can be opened and edited in Excel or Google Sheets." },
  { q: "Can I edit the template?", a: "Yes. The fields, categories, labels, formulas, and available views are editable for your own workflow." },
  { q: "Can I customize the categories?", a: "Yes. You can adapt categories and recurring-entry fields to match how you organize your own business records." },
  { q: "How do I receive the template?", a: "After your Razorpay payment is verified, the Google Sheet access link appears on screen and is sent to the email used during checkout." },
  { q: "Is this a one-time purchase?", a: "Yes. Pay ₹290 once for the digital Business Toolkit. There is no subscription or recurring charge." },
  { q: "Do I need special software?", a: "No. You only need Excel or Google Sheets to open and customize the template." },
  { q: "What is included in the template?", a: "The product includes 10 editable spreadsheet views, ready-made charts, customizable fields, and Excel + Google Sheets compatibility." },
  { q: "Do I receive financial or tax advice?", a: "No. LedgerKit is a digital spreadsheet template for organizing information. It does not provide financial, investment, tax, accounting, or other professional advice." },
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
