import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from "motion/react";
import { Heart, Flower2, MessageCircle, Store, Package, X } from "lucide-react";
import {
  CATEGORIES,
  PRODUCTS,
  priceFor,
  swatchFor,
  whatsappLink,
  type Category,
  type Mode,
  type Product,
} from "@/lib/catalogue";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "KANIRA Kidswear — Girls, Boys, Lollipop & Limited Edition" },
      { name: "description", content: "Animated prototype of KANIRA kidswear collections with retail MRP and wholesale enquiries." },
      { property: "og:title", content: "KANIRA Kidswear" },
      { property: "og:description", content: "Girls, Boys, Lollipop and Limited Edition kidswear by KANIRA." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

const ease = [0.22, 1, 0.36, 1] as const;

function Floaters() {
  const reduce = useReducedMotion();
  const items = [
    { Icon: Heart, x: "8%", y: "20%", d: 0, s: 22 },
    { Icon: Flower2, x: "88%", y: "14%", d: 1.2, s: 28 },
    { Icon: Heart, x: "78%", y: "72%", d: 0.6, s: 18 },
    { Icon: Flower2, x: "14%", y: "78%", d: 1.8, s: 24 },
    { Icon: Heart, x: "50%", y: "8%", d: 2.4, s: 14 },
  ];
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {items.map(({ Icon, x, y, d, s }, i) => (
        <motion.div
          key={i}
          className="absolute text-accent"
          style={{ left: x, top: y }}
          initial={{ opacity: 0 }}
          animate={reduce ? { opacity: 0.6 } : { opacity: [0.4, 0.8, 0.4], y: [0, -16, 0], rotate: [0, 8, 0] }}
          transition={{ duration: 6, delay: d, repeat: reduce ? 0 : Infinity, ease: "easeInOut" }}
        >
          <Icon size={s} fill="currentColor" strokeWidth={1} />
        </motion.div>
      ))}
    </div>
  );
}

function Swatch({ product, className = "" }: { product: Product; className?: string }) {
  const [a, b] = [swatchFor(product.skus[0]!), swatchFor(product.skus[1] ?? product.skus[0]!)];
  return (
    <div
      className={`relative flex items-end overflow-hidden ${className}`}
      style={{ background: `linear-gradient(135deg, ${a} 0%, ${a} 50%, ${b} 50%, ${b} 100%)` }}
    >
      <span className="m-3 rounded-full bg-card/85 px-3 py-1 text-[10px] uppercase tracking-widest text-muted-foreground">
        Catalogue photo
      </span>
    </div>
  );
}

function PriceTag({ product, mode }: { product: Product; mode: Mode }) {
  const price = priceFor(product, mode);
  if (!price)
    return <span className="text-sm font-medium text-muted-foreground">{mode === "retail" ? "Enquire / View details" : "Enquire"}</span>;
  return (
    <span className="flex items-baseline gap-1.5">
      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${price.label === "MRP" ? "bg-secondary text-secondary-foreground" : "bg-primary text-primary-foreground"}`}>
        {price.label}
      </span>
      <span className="font-display text-xl">₹{price.amount}</span>
    </span>
  );
}

function ProductCard({ product, mode, index, onOpen }: { product: Product; mode: Mode; index: number; onOpen: () => void }) {
  return (
    <motion.button
      layout
      onClick={onOpen}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.6, delay: (index % 4) * 0.08, ease }}
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.97 }}
      className="luxury-card group overflow-hidden rounded-3xl border bg-card text-left shadow-soft focus-visible:outline-2 focus-visible:outline-ring"
    >
      <div className="overflow-hidden">
        <Swatch product={product} className="aspect-[4/5] transition-transform duration-700 group-hover:scale-105" />
      </div>
      <div className="space-y-2 p-5">
        <h3 className="font-display text-lg leading-snug">{product.name}</h3>
        <p className="font-mono text-[11px] text-muted-foreground">{product.skus.join(" · ")}</p>
        <div className="flex flex-wrap gap-1">
          {product.sizes.map((s) => (
            <span key={s} className="rounded-full border px-2 py-0.5 text-[11px]">{s}</span>
          ))}
        </div>
        <div className="pt-2"><PriceTag product={product} mode={mode} /></div>
      </div>
    </motion.button>
  );
}

function DetailSheet({ product, mode, onClose }: { product: Product; mode: Mode; onClose: () => void }) {
  return (
    <motion.div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 p-4 sm:items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div
        role="dialog"
        aria-label={product.name}
        onClick={(e) => e.stopPropagation()}
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ duration: 0.45, ease }}
        className="grid w-full max-w-3xl overflow-hidden rounded-3xl bg-card sm:grid-cols-2"
      >
        <Swatch product={product} className="aspect-square sm:aspect-auto" />
        <div className="relative space-y-4 p-6">
          <button onClick={onClose} aria-label="Close" className="absolute right-4 top-4 rounded-full p-2 hover:bg-muted"><X size={18} /></button>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">{CATEGORIES.find((c) => c.id === product.category)?.label}</p>
          <h3 className="font-display text-2xl">{product.name}</h3>
          <dl className="space-y-2 text-sm">
            <div><dt className="text-muted-foreground">SKU</dt><dd className="font-mono">{product.skus.join(", ")}</dd></div>
            <div><dt className="text-muted-foreground">Sizes</dt><dd>{product.sizes.join(", ")}</dd></div>
            <div><dt className="text-muted-foreground">Price ({mode})</dt><dd><PriceTag product={product} mode={mode} /></dd></div>
          </dl>
          <a href={whatsappLink(product)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-whatsapp px-5 py-3 text-sm font-medium text-whatsapp-foreground transition hover:opacity-90">
            <MessageCircle size={16} /> Wholesale enquiry on WhatsApp
          </a>
          <p className="text-xs text-muted-foreground">Opens WhatsApp with a prefilled message. Nothing is sent until you press send.</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Hero() {
  const heroItems = [PRODUCTS[0]!, PRODUCTS[9]!, PRODUCTS[16]!];
  return (
    <section className="luxury-hero relative isolate overflow-hidden bg-hero">
      <Floaters />
      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 py-12 sm:px-8 md:grid-cols-[0.92fr_1.08fr] md:gap-14 md:px-10 md:py-20">
        <div className="relative z-10 max-w-xl">
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} className="mb-5 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground sm:text-xs">
            <span className="h-px w-8 bg-accent-foreground/60" /> KANIRA · Kidswear from Tiruppur
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.08, ease }} className="font-display text-[clamp(3.1rem,7vw,5.8rem)] leading-[0.98] tracking-[-0.045em]">
            Little blooms,<br /><em className="font-normal text-accent-foreground/80">beautifully</em><br />worn.
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32, duration: 0.65 }} className="mt-7 max-w-md text-sm leading-7 text-muted-foreground sm:text-base">
            Thoughtful little styles for everyday moments. Discover Girls, Boys, Lollipop and Limited Edition collections.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.48 }} className="mt-8 flex flex-wrap items-center gap-3">
            <a href="#collections" className="inline-flex min-h-12 items-center rounded-full bg-primary px-7 text-sm font-medium text-primary-foreground shadow-soft transition duration-300 hover:-translate-y-0.5 hover:opacity-90">Explore the collection <span className="ml-3">↗</span></a>
            <a href="#buy" className="inline-flex min-h-12 items-center rounded-full border border-primary/35 px-6 text-sm font-medium transition duration-300 hover:border-primary hover:bg-card/60">Retail & wholesale</a>
          </motion.div>
          <p className="mt-8 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Curated with love · Tiny Outfits. Big Stories.</p>
        </div>
        <div className="luxury-editorial relative mx-auto grid w-full max-w-2xl grid-cols-[1fr_0.82fr] items-center gap-3 sm:gap-5">
          <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.18, ease }} className="relative mt-10 overflow-hidden rounded-[48%_48%_1.5rem_1.5rem] border border-white/70 bg-card/75 p-2 shadow-soft sm:mt-16">
            <Swatch product={heroItems[0]} className="aspect-[4/5] rounded-[48%_48%_1rem_1rem]" />
            <div className="px-3 py-4 sm:px-5"><p className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground">The collection</p><p className="mt-1 font-display text-base sm:text-xl">{heroItems[0].name}</p></div>
          </motion.div>
          <div className="space-y-3 sm:space-y-5">
            <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.32, ease }} className="overflow-hidden rounded-[1.5rem] border border-white/70 bg-card/75 p-2 shadow-soft">
              <Swatch product={heroItems[1]} className="aspect-[5/4] rounded-[1.1rem]" />
              <p className="px-2 py-3 font-display text-sm sm:text-base">{heroItems[1].name}</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.46, ease }} className="overflow-hidden rounded-[1.5rem] border border-white/70 bg-card/75 p-2 shadow-soft">
              <Swatch product={heroItems[2]} className="aspect-[5/4] rounded-[1.1rem]" />
              <p className="px-2 py-3 font-display text-sm sm:text-base">{heroItems[2].name}</p>
            </motion.div>
          </div>
          <span className="pointer-events-none absolute -right-3 -top-5 font-display text-5xl text-accent/60 sm:-right-7 sm:top-0 sm:text-7xl">✳</span>
        </div>
      </div>
    </section>
  );
}

function Collections({ mode, setMode }: { mode: Mode; setMode: (m: Mode) => void }) {
  const [tab, setTab] = useState<Category>("girls");
  const [open, setOpen] = useState<Product | null>(null);
  const list = PRODUCTS.filter((p) => p.category === tab);
  return (
    <section id="collections" className="mx-auto max-w-6xl px-6 py-20">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease }} className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Collections</p>
          <h2 className="font-display text-4xl">Shop by little one</h2>
        </div>
        <ModeToggle mode={mode} setMode={setMode} />
      </motion.div>
      <div role="tablist" className="mb-10 flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <motion.button key={c.id} role="tab" aria-selected={tab === c.id} onClick={() => setTab(c.id)} whileTap={{ scale: 0.96 }} whileHover={{ y: -2 }} className="relative rounded-full px-5 py-2.5 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring">
            {tab === c.id && <motion.span layoutId="tab" className="absolute inset-0 rounded-full bg-primary" transition={{ type: "spring", bounce: 0.25 }} />}
            <span className={`relative ${tab === c.id ? "text-primary-foreground" : ""}`}>{c.label}</span>
          </motion.button>
        ))}
      </div>
      <p className="mb-6 text-sm text-muted-foreground">
        {CATEGORIES.find((c) => c.id === tab)?.note} · {list.length} styles · Viewing {mode} prices
      </p>
      <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {list.map((p, i) => <ProductCard key={p.id} product={p} mode={mode} index={i} onOpen={() => setOpen(p)} />)}
        </AnimatePresence>
      </motion.div>
      <AnimatePresence>{open && <DetailSheet product={open} mode={mode} onClose={() => setOpen(null)} />}</AnimatePresence>
    </section>
  );
}

function ModeToggle({ mode, setMode }: { mode: Mode; setMode: (m: Mode) => void }) {
  return (
    <div className="flex rounded-full border bg-card p-1" role="radiogroup" aria-label="Price view">
      {(["retail", "wholesale"] as Mode[]).map((m) => (
        <button key={m} role="radio" aria-checked={mode === m} onClick={() => setMode(m)} className="relative rounded-full px-4 py-2 text-sm font-medium capitalize">
          {mode === m && <motion.span layoutId="mode" className="absolute inset-0 rounded-full bg-secondary" />}
          <span className="relative">{m}</span>
        </button>
      ))}
    </div>
  );
}

function BuySplit({ setMode }: { setMode: (m: Mode) => void }) {
  const cards = [
    { Icon: Store, title: "Retail", body: "MRP shown only where the catalogue lists one (Limited Edition). Other styles show Enquire / View details.", cta: "View retail prices", mode: "retail" as Mode },
    { Icon: Package, title: "Wholesale", body: "Wholesale prices for Girls, Boys and Lollipop catalogues. Send an enquiry on WhatsApp to +91 99441 77755.", cta: "View wholesale prices", mode: "wholesale" as Mode },
  ];
  return (
    <section id="buy" className="bg-muted/60 py-20">
      <div className="mx-auto grid max-w-6xl gap-6 px-6 md:grid-cols-2">
        {cards.map((c, i) => (
          <motion.div key={c.title} initial={{ opacity: 0, x: i ? 40 : -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease }} className="luxury-panel rounded-3xl border bg-card p-8 shadow-soft">
            <c.Icon className="mb-4 text-accent-foreground" />
            <h3 className="font-display text-3xl">{c.title}</h3>
            <p className="mt-3 text-muted-foreground">{c.body}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#collections" onClick={() => setMode(c.mode)} className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground">{c.cta}</a>
              {c.mode === "wholesale" && (
                <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-whatsapp px-5 py-2.5 text-sm font-medium text-whatsapp-foreground">
                  <MessageCircle size={16} /> WhatsApp enquiry
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Index() {
  const [mode, setMode] = useState<Mode>("retail");
  const [scrolled, setScrolled] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen font-sans">
        <a href="#main-content" className="skip-link">Skip to content</a>
        <div className="bg-primary px-4 py-2 text-center text-[10px] font-medium tracking-[0.16em] text-primary-foreground sm:text-xs">KANIRA · CURATED WITH LOVE · RETAIL & WHOLESALE ENQUIRIES</div>
        <motion.header
          className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-xl"
          animate={{ boxShadow: scrolled ? "0 10px 30px -24px rgba(75, 48, 35, 0.55)" : "0 0 0 rgba(75, 48, 35, 0)" }}
          transition={{ duration: reduce ? 0 : 0.28, ease }}
        >
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <a href="#" aria-label="KANIRA home" className="group rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring">
              <motion.span whileHover={reduce ? undefined : { letterSpacing: "0.26em" }} transition={{ duration: 0.25 }} className="inline-block font-display text-2xl tracking-[0.2em]">KANIRA</motion.span>
            </a>
            <nav aria-label="Main navigation" className="hidden gap-5 text-xs sm:flex md:gap-7 md:text-sm">
              {[
                { href: "#collections", label: "Collections" },
                { href: "#buy", label: "Retail & Wholesale" },
                { href: "#story", label: "Our story" },
              ].map((item) => (
                <a key={item.href} href={item.href} className="nav-link group relative py-2 text-foreground/80 transition-colors hover:text-accent-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring">
                  {item.label}
                  <motion.span aria-hidden="true" className="absolute inset-x-0 -bottom-0.5 h-px origin-left bg-accent-foreground" initial={{ scaleX: 0 }} whileHover={{ scaleX: 1 }} transition={{ duration: 0.25 }} />
                </a>
              ))}
            </nav>
            <motion.a whileHover={reduce ? undefined : { y: -2 }} whileTap={reduce ? undefined : { scale: 0.97 }} href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-whatsapp px-4 py-2 text-xs font-medium text-whatsapp-foreground shadow-sm transition-shadow hover:shadow-soft focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring">
              <MessageCircle size={14} /> Wholesale
            </motion.a>
          </div>
        </motion.header>
        <main id="main-content">
          <Hero />
          <Collections mode={mode} setMode={setMode} />
          <BuySplit setMode={setMode} />
          <section id="story" className="relative overflow-hidden border-t border-border/70 bg-card/55">
            <div className="mx-auto grid max-w-7xl gap-8 px-6 py-16 sm:px-8 md:grid-cols-[0.8fr_1.2fr] md:items-center md:gap-16 md:py-24">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">A little about us</p>
                <h2 className="mt-4 font-display text-4xl leading-tight sm:text-5xl">Small details.<br /><em className="font-normal text-accent-foreground/80">Big little stories.</em></h2>
              </div>
              <div className="max-w-2xl">
                <p className="text-base leading-8 text-muted-foreground">KANIRA is a kidswear label from Tiruppur, bringing together thoughtfully curated styles for little wardrobes. Explore our collections for retail or connect with us directly for wholesale enquiries.</p>
                <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 border-b border-primary/50 pb-2 text-sm font-medium transition hover:border-primary">Talk to our team <span aria-hidden>↗</span></a>
              </div>
            </div>
          </section>
        </main>
        <footer className="bg-foreground text-background">
          <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 sm:px-8 md:grid-cols-[1fr_auto] md:items-end">
            <div><p className="font-display text-3xl tracking-[0.18em]">KANIRA</p><p className="mt-3 text-sm text-background/65">Curated with love. Tiny Outfits. Big Stories.</p></div>
            <div className="space-y-2 text-sm md:text-right"><a href="#collections" className="block text-background/80 hover:text-background">Explore collections</a><a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="block text-background/80 hover:text-background">Wholesale enquiries · +91 99441 77755</a></div>
          </div>
          <div className="border-t border-background/15 px-6 py-4 text-center text-[10px] tracking-wider text-background/55">© KANIRA. All rights reserved.</div>
        </footer>
      </div>
    </MotionConfig>
  );
}
