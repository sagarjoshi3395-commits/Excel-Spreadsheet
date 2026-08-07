import { Reveal, Chapter } from "./Reveal";
import { Star, Quote } from "lucide-react";

const stats = [
  { n: "2,400+", l: "Businesses running on it" },
  { n: "4.9/5", l: "Average owner rating" },
  { n: "10", l: "Auto dashboards inside" },
  { n: "₹290", l: "One-time · no subscription" },
];

const featured = {
  quote:
    "I cancelled my ₹1,500/month accounting app the same day. This one sheet shows my profit, expenses and taxes better than any software I've paid for.",
  name: "Rohan Mehta",
  role: "Founder, Urban Threads",
  init: "RM",
};

const reviews = [
  { quote: "I finally understand where my money goes. The graphs update on their own — I just type the numbers.", name: "Priya Nair", role: "Bakery owner, Kochi", init: "PN", rating: 5 },
  { quote: "Set it up in 5 minutes. The monthly and annual dashboards are genuinely beautiful.", name: "Arjun Verma", role: "Freelance consultant", init: "AV", rating: 5 },
  { quote: "No software, no logins, works in Google Sheets on my phone. Worth way more than ₹290.", name: "Sneha Kulkarni", role: "Boutique, Pune", init: "SK", rating: 5 },
  { quote: "The tax tracker alone saved me hours before filing. Everything is calculated automatically.", name: "Imran Shaikh", role: "Café owner, Hyderabad", init: "IS", rating: 5 },
  { quote: "Compared three years of my shop's growth in seconds. My CA was impressed.", name: "Divya Rao", role: "Retail store, Bengaluru", init: "DR", rating: 5 },
  { quote: "Clean, fast and fully editable. I changed the categories to match my business easily.", name: "Karan Singh", role: "D2C brand", init: "KS", rating: 5 },
];

function Stars() {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className="w-3.5 h-3.5 fill-[#0f0f0f] text-[#0f0f0f]" />
      ))}
    </div>
  );
}

function Avatar({ init, dark }) {
  return (
    <span className={`grid place-items-center w-11 h-11 border border-[#0f0f0f] font-mono text-sm font-semibold shrink-0 ${dark ? "bg-[#d4ff11] text-[#0f0f0f]" : "bg-[#0f0f0f] text-[#f6f5f2]"}`}>
      {init}
    </span>
  );
}

export default function Testimonials() {
  return (
    <section id="reviews" className="px-5 sm:px-8 py-24 sm:py-32" data-testid="testimonials-section">
      <div className="max-w-[1400px] mx-auto">
        <Chapter number="04" label="The Proof" />

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
            <div className="h-full bg-[#0f0f0f] text-[#f6f5f2] border border-[#0f0f0f] p-8 sm:p-10 flex flex-col">
              <Quote className="w-10 h-10 text-[#d4ff11]" />
              <Stars2 />
              <p className="font-display font-bold text-2xl sm:text-3xl leading-snug mt-4">
                “{featured.quote}”
              </p>
              <div className="flex items-center gap-4 mt-auto pt-8">
                <Avatar init={featured.init} dark />
                <div>
                  <p className="font-semibold">{featured.name}</p>
                  <p className="font-mono text-xs uppercase tracking-[0.1em] text-[#f6f5f2]/60">{featured.role}</p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* grid */}
          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-6">
            {reviews.map((r, i) => (
              <Reveal key={r.name} delay={i * 0.06}>
                <div className="h-full bg-white border border-[#0f0f0f] p-6 hover:hard-shadow-sm hover:-translate-y-1 transition-all duration-300" data-testid={`testimonial-${i}`}>
                  <Stars />
                  <p className="text-[#0f0f0f] leading-relaxed mt-4">“{r.quote}”</p>
                  <div className="flex items-center gap-3 mt-6">
                    <Avatar init={r.init} />
                    <div>
                      <p className="font-semibold text-sm">{r.name}</p>
                      <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-[#595959]">{r.role}</p>
                    </div>
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

function Stars2() {
  return (
    <div className="flex gap-0.5 mt-5">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className="w-4 h-4 fill-[#d4ff11] text-[#d4ff11]" />
      ))}
    </div>
  );
}
