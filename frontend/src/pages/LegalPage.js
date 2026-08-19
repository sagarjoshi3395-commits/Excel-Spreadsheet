import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

const content = {
  terms: {
    label: "Terms of Use",
    title: "Simple, clear terms for a digital template",
    paragraphs: [
      "LedgerKit provides downloadable and online-access digital spreadsheet templates for business organization. The Business Toolkit is a template product, not a managed service.",
      "You may use the templates for your own business or projects. You may edit the sheets for your own use, but you may not resell, redistribute, or publicly share the original templates or access links.",
      "The templates are provided as-is for organizational and educational use. LedgerKit does not provide accounting, tax, legal, investment, lending, or financial advice. Check important decisions with a qualified professional.",
    ],
  },
  privacy: {
    label: "Privacy Policy",
    title: "Your details are used to deliver your order",
    paragraphs: [
      "LedgerKit collects the email address you enter at checkout to process your Razorpay payment, send your Business Toolkit access link, and respond to support requests.",
      "Payment details are handled by Razorpay. LedgerKit does not receive or store your card, UPI, or banking credentials. We do not sell customer email addresses.",
      "For questions about your information or an access email, contact ledgerkitsupport@gmail.com. We may retain order and support records when needed for delivery, fraud prevention, accounting records, or legal obligations.",
    ],
  },
  refunds: {
    label: "Refund Policy",
    title: "Digital delivery refund policy",
    paragraphs: [
      "The Business Toolkit is a digital product. Because access is delivered electronically, we generally cannot accept returns or provide refunds after the product link has been delivered.",
      "We will review support requests when the product was not received after a successful payment or when the same payment was charged twice. Contact ledgerkitsupport@gmail.com with your payment email and Razorpay payment ID so we can investigate.",
      "Please contact us before filing a payment dispute. We will respond to delivery issues as quickly as possible.",
    ],
  },
  support: {
    label: "Support",
    title: "Need help with your Business Toolkit?",
    paragraphs: [
      "For delivery questions, duplicate payments, broken access links, or general product queries, email ledgerkitsupport@gmail.com.",
      "Please include the email used at checkout and your Razorpay payment ID when available. We will use those details to locate the order and help you access the correct template.",
      "LedgerKit is the website and Business Toolkit is one digital product available from LedgerKit.",
    ],
  },
};

export default function LegalPage({ type }) {
  const { label, title, paragraphs } = content[type] || content.support;

  return (
    <main className="min-h-screen bg-[#f6f5f2] text-[#0f0f0f] px-5 sm:px-8 py-8 sm:py-14">
      <div className="max-w-[900px] mx-auto">
        <Link to="/" className="inline-flex items-center gap-1 font-mono text-xs uppercase tracking-[0.12em] hover:text-[#595959] transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back to LedgerKit
        </Link>
        <div className="mt-20 border border-[#0f0f0f] bg-white hard-shadow p-6 sm:p-12">
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#595959]">LedgerKit · {label}</p>
          <h1 className="font-display font-black text-4xl sm:text-6xl leading-[0.95] tracking-tighter mt-5">{title}</h1>
          <div className="mt-10 space-y-5 text-[#595959] leading-relaxed max-w-2xl">
            {paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
          <p className="mt-10 pt-5 border-t border-[#0f0f0f]/15 font-mono text-[11px] uppercase tracking-[0.1em] text-[#595959]">
            Questions? <a className="underline underline-offset-2 text-[#0f0f0f]" href="mailto:ledgerkitsupport@gmail.com">ledgerkitsupport@gmail.com</a>
          </p>
        </div>
      </div>
    </main>
  );
}
