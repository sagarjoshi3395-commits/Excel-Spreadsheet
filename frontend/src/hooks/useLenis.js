import { useEffect } from "react";
import Lenis from "lenis";

export function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // anchor links
    const handler = (e) => {
      const a = e.target.closest("a[href^='#']");
      if (!a) return;
      const id = a.getAttribute("href");
      if (id.length > 1) {
        e.preventDefault();
        const el = document.querySelector(id);
        if (el) lenis.scrollTo(el, { offset: -80 });
      }
    };
    document.addEventListener("click", handler);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("click", handler);
      lenis.destroy();
    };
  }, []);
}
