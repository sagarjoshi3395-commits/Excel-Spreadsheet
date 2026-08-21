import { Reveal, Chapter } from "./Reveal";
import { CheckCircle2 } from "lucide-react";

const stats = [
  { n: "10", l: "Editable template views" },
  { n: "2", l: "Excel + Google Sheets formats" },
  { n: "1", l: "Digital product" },
  { n: "₹290", l: "One-time template access" },
];

const featured = {
  quote:
    "A clear place to organize business entries and review the included spreadsheet views before making your own copy.",
  name: "Business Toolkit",
  role: "LedgerKit digital template",
  init: "BT",
};

const reviews = [
  { quote: "The categories and editable fields make it simple to adapt the sheet to my workflow.", name: "Editable fields", role: "Product feature", init: "EF", rating: 5 },
  { quote: "I can open the same product in Excel or Google Sheets and review the layout before using it.", name: "Two compatible formats", role: "Product feature", init: "TF", rating: 5 },
  { quote: "The named tabs make it easy to find the view I need without learning new software.", name: "Clear navigation", role: "Product feature", init: "CN", rating: 5 },
  { quote: "The product is delivered digitally to the email used at checkout.", name: "Digital access", role: "Delivery detail", init: "DA", rating: 5 },
];

function FeatureMark() {
  return <CheckCircle2 className="w-5 h-5 text-[#0f0f0f] shrink-0" />;
}

export default function Testimonials() {
  return (
    <section id="reviews" className="px-5 sm:px-8 py-24 sm:py-32" data-testid="testimonials-section">
      <div className="max-w-[1400px] mx-auto">
        <Chapter number="04" label="What's Included" />

        {/* stats */}
        <Reveal className="grid grid-cols-2 md:grid-cols-4 border border-[#0f0f0f] mb-14 bg-white">
          {stats.map((s, i) => (
            <div key={s.l} className={`p-6 sm:p-8 ${i !== 0 ? "border-l border-[#0f0f0f]" : ""} ${i >= 2 ? "border-t md:border-t-0" : ""} ${i === 2 ? "border-l-0 md:border-l" : ""}`}>
              <p className="font-display font-black text-3xl sm:text-4xl">{s.n}</p>
              <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-[#595959] mt-2">{s.l}</p>
            </div>
          ))}
        </Reveal>

        <div className="grid lg:grid-cols-12 gap-6">
          {/* featured */}
          <Reveal className="lg:col-span-5">
            <div className="h-full bg-[#d4ff11] text-[#0f0f0f] border border-[#0f0f0f] hard-shadow p-8 sm:p-10 flex flex-col">
              <FeatureMark />
              <p className="font-display font-bold text-2xl sm:text-3xl leading-snug mt-4">
                {featured.quote}
              </p>
              <div className="mt-auto pt-8">
                <p className="font-semibold">{featured.name}</p>
                <p className="font-mono text-xs uppercase tracking-[0.1em] text-[#0f0f0f]/60">{featured.role}</p>
              </div>
            </div>
          </Reveal>

          {/* grid */}
          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-6">
            {reviews.map((r, i) => (
              <Reveal key={r.name} delay={i * 0.06}>
                <div className="h-full bg-white border border-[#0f0f0f] p-6 hover:hard-shadow-sm hover:-translate-y-1 transition-all duration-300" data-testid={`testimonial-${i}`}>
                  <FeatureMark />
                  <p className="text-[#0f0f0f] leading-relaxed mt-4">{r.quote}</p>
                  <div className="mt-6">
                    <p className="font-semibold text-sm">{r.name}</p>
                    <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-[#595959]">{r.role}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
