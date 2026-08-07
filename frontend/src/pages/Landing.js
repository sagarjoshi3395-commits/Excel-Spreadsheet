import { useLenis } from "@/hooks/useLenis";
import { BuyProvider } from "@/hooks/useBuy";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Ribbon from "@/components/landing/Ribbon";
import Problem from "@/components/landing/Problem";
import Showcase from "@/components/landing/Showcase";
import HowItWorks from "@/components/landing/HowItWorks";
import Testimonials from "@/components/landing/Testimonials";
import Pricing from "@/components/landing/Pricing";
import FAQ from "@/components/landing/FAQ";
import Footer from "@/components/landing/Footer";
import BuyModal from "@/components/landing/BuyModal";
import StickyBuy from "@/components/landing/StickyBuy";

export default function Landing() {
  useLenis();
  return (
    <BuyProvider>
      <div className="grain-overlay" />
      <div className="bg-[#f6f5f2] min-h-screen relative">
        <Navbar />
        <main>
          <Hero />
          <Ribbon />
          <Problem />
          <Showcase />
          <HowItWorks />
          <Testimonials />
          <Pricing />
          <FAQ />
        </main>
        <Footer />
        <BuyModal />
        <StickyBuy />
      </div>
    </BuyProvider>
  );
}
