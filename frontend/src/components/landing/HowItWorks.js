import { Reveal, Chapter } from "./Reveal";
import { useBuy } from "@/hooks/useBuy";
import { VoltButton } from "./VoltButton";
import { CreditCard, Mail, Download } from "lucide-react";
import { PRICE } from "@/lib/landingData";

const steps = [
  { icon: CreditCard, n: "01", t: "Choose the template", d: "Purchase the Business Toolkit as a one-time digital product through Razorpay." },
  { icon: Mail, n: "02", t: "Get the access link", d: "Your editable Google Sheet link is sent to the email used at checkout." },
  { icon: Download, n: "03", t: "Customize your copy", d: "Open it in Excel or Google Sheets and adapt the categories for your own records." },
];

export default function HowItWorks() {
  const { setOpen } = useBuy();
  return (
    <section id="how" className="px-5 sm:px-8 py-24 sm:py-32" data-testid="how-section">
      <div className="max-w-[1400px] mx-auto">
        <Chapter number="03" label="How It Works" />
        <Reveal className="mb-14 max-w-2xl">
          <h2 className="font-display font-black text-4xl sm:text-6xl leading-[0.95] tracking-tighter">
            Organize your records in under a minute.
          </h2>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-5">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.1}>
              <div className="h-full bg-white border border-[#0f0f0f] p-7 hard-shadow-sm transition-transform duration-300 hover:-translate-y-1" data-testid={`step-${s.n}`}>
                <div className="flex items-center justify-between mb-10">
                  <s.icon className="w-7 h-7" />
                  <span className="font-mono text-sm text-[#595959]">{s.n}</span>
                </div>
                <p className="font-display font-extrabold text-2xl leading-tight">{s.t}</p>
                <p className="text-[#595959] mt-3 leading-relaxed">{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2} className="mt-12">
          <VoltButton testid="how-cta-buy" onClick={() => setOpen(true)}>
            Start now · ₹{PRICE}
          </VoltButton>
        </Reveal>
      </div>
    </section>
  );
}
