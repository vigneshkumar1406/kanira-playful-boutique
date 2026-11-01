import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from "motion/react";
import { Heart, Flower2, MessageCircle, Store, Package, Sparkles, X } from "lucide-react";
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
  const [a, b] = [swatchFor(product.skus[0]), swatchFor(product.skus[1] ?? product.skus[0])];
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
      className="group overflow-hidden rounded-3xl border bg-card text-left shadow-soft focus-visible:outline-2 focus-visible:outline-ring"
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
    <section className="relative overflow-hidden bg-hero">
      <Floaters />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 pb-20 pt-10 md:grid-cols-2 md:pt-16">
        <div>
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-4 text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Kidswear · 0M – 5Y
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1, ease }} className="font-display text-5xl leading-[1.05] md:text-7xl">
            Little blooms,<br /><em className="text-accent-foreground/80">softly made.</em>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.8 }} className="mt-6 max-w-md text-muted-foreground">
            Muslin, hakoba and tiered frocks, sets and rompers across Girls, Boys, Lollipop and Limited Edition.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="mt-8 flex flex-wrap gap-3">
            <a href="#collections" className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90">Explore collections</a>
            <a href="#buy" className="rounded-full border border-primary px-6 py-3 text-sm font-medium transition hover:bg-primary hover:text-primary-foreground">Retail or wholesale?</a>
          </motion.div>
        </div>
        <div className="relative h-[420px]">
          {heroItems.map((p, i) => (
            <motion.div
              key={p.id}
              className="absolute w-[58%] overflow-hidden rounded-3xl border-4 border-card shadow-soft"
              style={{ left: `${i * 21}%`, top: `${[8, 0, 22][i]}%`, zIndex: i === 1 ? 3 : 1 }}
              initial={{ clipPath: "inset(100% 0 0 0)", rotate: 0 }}
              animate={{ clipPath: "inset(0% 0 0 0)", rotate: [-5, 2, 6][i] }}
              transition={{ duration: 1.1, delay: 0.3 + i * 0.2, ease }}
            >
              <Swatch product={p} className="aspect-[3/4]" />
              <div className="bg-card px-3 py-2 text-xs font-medium">{p.name}</div>
            </motion.div>
          ))}
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
          <button key={c.id} role="tab" aria-selected={tab === c.id} onClick={() => setTab(c.id)} className="relative rounded-full px-5 py-2.5 text-sm font-medium">
            {tab === c.id && <motion.span layoutId="tab" className="absolute inset-0 rounded-full bg-primary" transition={{ type: "spring", bounce: 0.25 }} />}
            <span className={`relative ${tab === c.id ? "text-primary-foreground" : ""}`}>{c.label}</span>
          </button>
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
          <motion.div key={c.title} initial={{ opacity: 0, x: i ? 40 : -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease }} className="rounded-3xl border bg-card p-8 shadow-soft">
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

function AnimationDemo() {
  const [key, setKey] = useState(0);
  const reduce = useReducedMotion();
  const demos = [
    { label: "Float", anim: reduce ? {} : { y: [0, -14, 0] }, Icon: Heart },
    { label: "Bloom", anim: reduce ? {} : { scale: [1, 1.25, 1], rotate: [0, 45, 0] }, Icon: Flower2 },
    { label: "Sparkle", anim: reduce ? {} : { opacity: [1, 0.3, 1], scale: [1, 0.8, 1] }, Icon: Sparkles },
  ];
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Motion kit</p>
          <h2 className="font-display text-4xl">Animation demo</h2>
        </div>
        <button onClick={() => setKey((k) => k + 1)} className="rounded-full border border-primary px-5 py-2 text-sm font-medium hover:bg-primary hover:text-primary-foreground">Replay reveal</button>
      </div>
      <div className="grid gap-6 md:grid-cols-4">
        {demos.map(({ label, anim, Icon }) => (
          <div key={label} className="flex aspect-square flex-col items-center justify-center gap-4 rounded-3xl border bg-card">
            <motion.div animate={anim} transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }} className="text-accent">
              <Icon size={48} fill="currentColor" strokeWidth={1} />
            </motion.div>
            <span className="text-sm text-muted-foreground">{label}</span>
          </div>
        ))}
        <div className="flex aspect-square flex-col items-center justify-center gap-4 rounded-3xl border bg-card p-6">
          <motion.div key={key} initial={{ clipPath: "inset(100% 0 0 0)" }} animate={{ clipPath: "inset(0% 0 0 0)" }} transition={{ duration: 1, ease }} className="w-2/3">
            <Swatch product={PRODUCTS[10]!} className="aspect-[3/4] rounded-2xl" />
          </motion.div>
          <span className="text-sm text-muted-foreground">Image reveal</span>
        </div>
      </div>
      {reduce && <p className="mt-4 text-sm text-muted-foreground">Reduced motion is on, so looping animations are paused.</p>}
    </section>
  );
}

function Index() {
  const [mode, setMode] = useState<Mode>("retail");
  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen font-sans">
        <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <span className="font-display text-2xl tracking-[0.2em]">KANIRA</span>
            <nav className="hidden gap-6 text-sm md:flex">
              <a href="#collections" className="hover:text-accent-foreground">Collections</a>
              <a href="#buy" className="hover:text-accent-foreground">Retail & Wholesale</a>
            </nav>
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-whatsapp px-4 py-2 text-xs font-medium text-whatsapp-foreground">
              <MessageCircle size={14} /> Wholesale
            </a>
          </div>
        </header>
        <Hero />
        <Collections mode={mode} setMode={setMode} />
        <BuySplit setMode={setMode} />
        <AnimationDemo />
        <footer className="border-t py-10 text-center text-sm text-muted-foreground">
          KANIRA kidswear · Prototype · Wholesale enquiries: +91 99441 77755
        </footer>
      </div>
    </MotionConfig>
  );
}
