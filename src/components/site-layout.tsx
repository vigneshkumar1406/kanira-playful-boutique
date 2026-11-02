import type { ReactNode } from "react";
import { Leaf, MessageCircle, ShoppingBag, UserRound } from "lucide-react";

const whatsapp = "https://wa.me/919944177755";

export function SiteLayout({ children, active }: { children: ReactNode; active?: string }) {
  const links = [
    { href: "/shop", label: "Shop", key: "shop" },
    { href: "/about", label: "Our story", key: "about" },
    { href: "/difference", label: "The difference", key: "difference" },
    { href: "/fabric-care", label: "Fabric & care", key: "fabric" },
    { href: "/wholesale", label: "Wholesale", key: "wholesale" },
    { href: "/help", label: "Help", key: "help" },
  ];

  return (
    <div className="min-h-screen bg-[#fbf7f1] text-[#302a24]">
      <div className="announcement-bar"><span>✦</span> KANIRA · CURATED WITH LOVE <i /> RETAIL & WHOLESALE ENQUIRIES <span>✦</span></div>
      <header className="site-header">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-5 py-3 md:px-10">
          <a href="/" className="kanira-logo" aria-label="KANIRA home">
            <img src="/kanira-mascot.svg" alt="" className="logo-mascot" />
            <span>KANIRA</span><small>Tiny Outfits. Big Stories.</small>
          </a>
          <nav className="hidden items-center gap-7 text-sm md:flex">
            {links.map(link => <a key={link.key} href={link.href} className={active === link.key ? "font-semibold text-[#805037]" : ""}>{link.label}</a>)}
          </nav>
          <div className="header-actions flex items-center gap-2">
            <a href="/account" className="header-icon" aria-label="My account" title="My account"><UserRound size={21} strokeWidth={1.7} /></a>
            <a href="/cart" className="header-icon" aria-label="Shopping bag" title="Shopping bag"><ShoppingBag size={21} strokeWidth={1.7} /></a>
            <a href={whatsapp} target="_blank" rel="noreferrer" className="header-icon header-whatsapp" aria-label="Chat with KANIRA on WhatsApp" title="Chat with KANIRA"><MessageCircle size={21} strokeWidth={1.7} /></a>
          </div>
        </div>
      </header>
      {children}
      <footer className="site-footer">
        <div className="footer-main">
          <div>
            <a href="/" className="kanira-logo text-[#f8f4ed]"><span className="logo-mark"><Leaf size={20} /></span><span>KANIRA</span><small>Tiny Outfits. Big Stories.</small></a>
            <p className="mt-5 max-w-xs text-sm leading-6 text-white/65">Curated with love. Tiny outfits for big little stories.</p>
          </div>
          <div><h3>Explore</h3><a href="/shop">Shop collections</a><a href="/about">Our story</a><a href="/difference">The KANIRA difference</a><a href="/fabric-care">Fabric & care</a><a href="/wholesale">Wholesale</a><a href="/contact">Contact us</a></div>
          <div><h3>We're here to help</h3><a href="/help">FAQs & support</a><a href="/track-order">Track an order</a><a href="/returns">Returns & damaged items</a><a href={whatsapp} target="_blank" rel="noreferrer">WhatsApp enquiries</a><span>From Tiruppur, Tamil Nadu</span></div>
          <div><h3>Information</h3><a href="/privacy">Privacy policy</a><a href="/terms">Terms of use</a></div>
        </div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} KANIRA. All rights reserved.</span><span>CURATED WITH LOVE · TINY OUTFITS. BIG STORIES.</span></div>
      </footer>
    </div>
  );
}

export function PageIntro({ eyebrow, title, description }: { eyebrow: string; title: ReactNode; description: string }) {
  return <section className="page-intro"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{description}</p></section>;
}

export function PageSection({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`page-section ${className}`}>{children}</section>;
}

export const KANIRA_WHATSAPP = whatsapp;
