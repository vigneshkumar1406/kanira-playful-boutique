import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from "motion/react";
import {
  ArrowDown, ArrowRight, Check, Flower2, Heart, Menu, MessageCircle,
  Package, Search, ShieldCheck, Sparkles, Store, Truck, X,
} from "lucide-react";
import {
  CATEGORIES, PRODUCTS, priceFor, swatchFor, whatsappLink,
  type Category, type Mode, type Product,
} from "@/lib/catalogue";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "KANIRA — Tiny Outfits. Big Stories." },
      { name: "description", content: "Discover thoughtfully curated kidswear from KANIRA. Explore Girls, Boys, Lollipop and Limited Edition collections." },
      { property: "og:title", content: "KANIRA — Tiny Outfits. Big Stories." },
      { property: "og:description", content: "Curated with love. Made for little moments." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Index,
});

const ease = [0.22, 1, 0.36, 1] as const;

function TextileArtwork({ product, className = "" }: { product: Product; className?: string }) {
  const first = swatchFor(product.skus[0]!);
  const second = swatchFor(product.skus[1] ?? product.skus[0]!);
  return (
    <div
      className={`kanira-artwork relative isolate overflow-hidden ${className}`}
      style={{ background: `linear-gradient(135deg, ${first}, ${second})` }}
      aria-label={`Colour preview for ${product.name}`}
    >
      <div className="kanira-artwork__orb" />
      <div className="kanira-artwork__grain" />
      <span className="absolute bottom-3 left-3 rounded-full border border-white/50 bg-white/75 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-stone-700 backdrop-blur">
        Colour preview · catalogue image pending
      </span>
    </div>
  );
}

function Price({ product, mode }: { product: Product; mode: Mode }) {
  const value = priceFor(product, mode);
  if (!value) return <span className="text-xs font-medium text-stone-500">{mode === "retail" ? "Enquire for price" : "Wholesale enquiry"}</span>;
  return (
    <span className="inline-flex items-baseline gap-2">
      <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-stone-500">{value.label}</span>
      <span className="font-display text-xl text-stone-900">₹{value.amount.toLocaleString("en-IN")}</span>
    </span>
  );
}

function ProductCard({ product, mode, onOpen, index }: { product: Product; mode: Mode; onOpen: () => void; index: number }) {
  return (
    <motion.button
      layout
      onClick={onOpen}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.985 }}
      transition={{ duration: 0.55, delay: (index % 4) * 0.045, ease }}
      className="group text-left"
    >
      <div className="relative overflow-hidden rounded-[1.4rem] bg-[#eee8df]">
        <TextileArtwork product={product} className="aspect-[4/5] transition-transform duration-700 group-hover:scale-[1.035]" />
        <span className="absolute right-3 top-3 rounded-full bg-white/85 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-stone-600 backdrop-blur">
          {CATEGORIES.find((c) => c.id === product.category)?.label}
        </span>
        <span className="absolute bottom-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-white text-stone-800 shadow-sm transition group-hover:bg-stone-900 group-hover:text-white">
          <ArrowRight size={15} />
        </span>
      </div>
      <div className="px-1 pt-4">
        <h3 className="font-display text-[1.08rem] leading-snug text-stone-900">{product.name}</h3>
        <p className="mt-1.5 font-mono text-[9px] tracking-wide text-stone-400">{product.skus.join(" · ")}</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {product.sizes.slice(0, 5).map((size) => <span key={size} className="rounded-full border border-stone-200 px-2 py-0.5 text-[9px] text-stone-500">{size}</span>)}
          {product.sizes.length > 5 && <span className="px-1 py-0.5 text-[9px] text-stone-400">+{product.sizes.length - 5}</span>}
        </div>
        <div className="mt-3"><Price product={product} mode={mode} /></div>
      </div>
    </motion.button>
  );
}

function ProductDialog({ product, mode, onClose }: { product: Product; mode: Mode; onClose: () => void }) {
  return (
    <motion.div className="fixed inset-0 z-[80] flex items-end justify-center bg-stone-950/45 p-0 backdrop-blur-sm sm:items-center sm:p-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div role="dialog" aria-modal="true" aria-label={product.name} onClick={(event) => event.stopPropagation()} initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }} transition={{ duration: 0.35, ease }} className="grid max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-[1.8rem] bg-[#fffdf9] sm:grid-cols-2 sm:rounded-[1.8rem]">
        <TextileArtwork product={product} className="aspect-[5/4] sm:aspect-auto sm:min-h-[420px]" />
        <div className="relative p-6 sm:p-9">
          <button onClick={onClose} aria-label="Close product details" className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full border border-stone-200"><X size={16} /></button>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#a77b69]">{CATEGORIES.find((c) => c.id === product.category)?.label}</p>
          <h2 className="mt-3 pr-7 font-display text-3xl leading-tight text-stone-900">{product.name}</h2>
          <div className="mt-6 border-y border-stone-200 py-5">
            <div className="mb-4"><Price product={product} mode={mode} /></div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-stone-400">Available catalogue sizes</p>
            <div className="mt-2 flex flex-wrap gap-2">{product.sizes.map((size) => <span key={size} className="rounded-full border border-stone-200 px-3 py-1.5 text-xs text-stone-700">{size}</span>)}</div>
            <p className="mt-4 text-[10px] text-stone-400">SKU: {product.skus.join(", ")}</p>
          </div>
          <a href={whatsappLink(product)} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#6d7560] px-5 py-3.5 text-xs font-bold uppercase tracking-[0.12em] text-white transition hover:bg-[#525b47]">
            <MessageCircle size={15} /> Enquire on WhatsApp
          </a>
          <p className="mt-3 text-center text-[10px] leading-relaxed text-stone-400">WhatsApp opens with a prepared enquiry. Your message is only sent when you choose to send it.</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Hero() {
  const reduce = useReducedMotion();
  const featured = [PRODUCTS[8]!, PRODUCTS[0]!, PRODUCTS[16]!];
  return (
    <section className="relative overflow-hidden bg-[#e9e0d4]">
      <div className="kanira-hero-wash absolute inset-0" />
      <div className="relative mx-auto grid max-w-[1380px] items-center gap-8 px-5 pb-16 pt-12 sm:px-8 md:min-h-[660px] md:grid-cols-[1.02fr_.98fr] md:px-12 md:py-16">
        <div className="relative z-10 max-w-[610px]">
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.28em] text-[#806c5d]">
            <span className="h-px w-8 bg-[#a77b69]" /> Curated with love · Tiruppur, India
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, ease }} className="font-display text-[3.6rem] leading-[.96] tracking-[-0.045em] text-[#39352f] sm:text-7xl lg:text-[6.2rem]">
            Tiny outfits.<br /><em className="font-normal text-[#9b7667]">Big stories.</em>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18, duration: 0.7 }} className="mt-6 max-w-[420px] text-sm leading-7 text-[#6f665d] sm:text-base">
            Little pieces for the moments that become lifelong memories. Explore thoughtfully curated styles for little ones.
          </motion.p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href="#collections" className="inline-flex items-center gap-3 rounded-full bg-[#3e4438] px-6 py-3.5 text-[10px] font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[#59604f]">Explore collection <ArrowRight size={14} /></a>
            <a href="#shop-your-way" className="inline-flex items-center gap-2 px-3 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-[#5c554d]">Shop your way <ArrowDown size={13} /></a>
          </div>
          <div className="mt-12 flex items-center gap-5 border-t border-[#c9bcae] pt-5">
            <div><p className="font-display text-2xl text-[#39352f]">04</p><p className="mt-1 text-[8px] font-bold uppercase tracking-[0.16em] text-[#85776a]">Collections</p></div>
            <span className="h-9 w-px bg-[#c9bcae]" />
            <div><p className="font-display text-2xl text-[#39352f]">28</p><p className="mt-1 text-[8px] font-bold uppercase tracking-[0.16em] text-[#85776a]">Catalogue styles</p></div>
            <span className="h-9 w-px bg-[#c9bcae]" />
            <div><p className="font-display text-2xl text-[#39352f]">∞</p><p className="mt-1 text-[8px] font-bold uppercase tracking-[0.16em] text-[#85776a]">Little stories</p></div>
          </div>
        </div>
        <div className="relative mx-auto h-[390px] w-full max-w-[570px] sm:h-[480px] md:h-[540px]">
          <div className="absolute left-[13%] top-[5%] h-[78%] w-[66%] rotate-[-7deg] rounded-[48%_48%_1.5rem_1.5rem] border-[7px] border-[#f8f4ec] bg-[#d9c4b2] shadow-[0_24px_65px_-30px_rgba(55,43,33,.45)]" />
          {featured.map((product, index) => (
            <motion.div key={product.id} initial={reduce ? false : { opacity: 0, y: 24, rotate: 0 }} animate={{ opacity: 1, y: 0, rotate: [-8, 4, 10][index] }} transition={{ duration: 0.8, delay: 0.12 + index * 0.14, ease }} className="absolute w-[43%] overflow-hidden rounded-[1.2rem] border-[5px] border-[#fffaf2] bg-[#fffaf2] shadow-[0_22px_50px_-24px_rgba(55,43,33,.5)]" style={{ left: `${[2, 30, 55][index]}%`, top: `${[20, 5, 29][index]}%`, zIndex: index + 1 }}>
              <TextileArtwork product={product} className="aspect-[4/5]" />
              <div className="px-3 py-2.5"><p className="line-clamp-1 font-display text-sm text-stone-800">{product.name}</p><p className="mt-1 text-[8px] uppercase tracking-widest text-stone-400">{CATEGORIES.find((c) => c.id === product.category)?.label}</p></div>
            </motion.div>
          ))}
          <div className="absolute bottom-[4%] right-[3%] grid h-20 w-20 place-items-center rounded-full border border-[#aa8c79] bg-[#f4ece2]/90 text-center text-[#816c5d] shadow-sm sm:h-24 sm:w-24">
            <div><Heart size={15} className="mx-auto mb-1" /><p className="font-display text-xs italic">Made with</p><p className="font-display text-xs italic">love</p></div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CollectionSection({ mode, setMode }: { mode: Mode; setMode: (mode: Mode) => void }) {
  const [category, setCategory] = useState<Category>("girls");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("featured");
  const [selected, setSelected] = useState<Product | null>(null);
  const products = useMemo(() => {
    let result = PRODUCTS.filter((product) => product.category === category);
    const term = search.trim().toLowerCase();
    if (term) result = result.filter((product) => [product.name, ...product.skus, ...product.sizes].join(" ").toLowerCase().includes(term));
    if (sort === "name") result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "price-low") result = [...result].sort((a, b) => a.price.amount - b.price.amount);
    if (sort === "price-high") result = [...result].sort((a, b) => b.price.amount - a.price.amount);
    return result;
  }, [category, search, sort]);

  return (
    <section id="collections" className="mx-auto max-w-[1380px] px-5 py-16 sm:px-8 md:px-12 md:py-24">
      <div className="mb-9 flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div><p className="mb-3 text-[9px] font-bold uppercase tracking-[0.28em] text-[#9b7667]">The KANIRA edit</p><h2 className="font-display text-4xl tracking-tight text-[#39352f] sm:text-5xl">A little something <em className="font-normal text-[#9b7667]">lovely.</em></h2><p className="mt-3 max-w-md text-sm leading-6 text-stone-500">Browse the collections and find a favourite for every little occasion.</p></div>
        <div className="inline-flex w-fit rounded-full border border-stone-200 bg-[#faf7f1] p-1">
          {(["retail", "wholesale"] as Mode[]).map((item) => <button key={item} onClick={() => setMode(item)} className={`rounded-full px-4 py-2 text-[9px] font-bold uppercase tracking-[0.12em] transition ${mode === item ? "bg-[#3e4438] text-white shadow-sm" : "text-stone-500"}`}>{item}</button>)}
        </div>
      </div>
      <div className="mb-7 flex gap-2 overflow-x-auto pb-2">
        {CATEGORIES.map((item) => <button key={item.id} onClick={() => setCategory(item.id)} className={`shrink-0 rounded-full border px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.13em] transition ${category === item.id ? "border-[#3e4438] bg-[#3e4438] text-white" : "border-stone-200 bg-white text-stone-500 hover:border-stone-400"}`}>{item.label}</button>)}
      </div>
      <div className="mb-7 flex flex-col gap-3 border-y border-stone-200 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[10px] text-stone-500">{CATEGORIES.find((item) => item.id === category)?.note} <span className="mx-2 text-stone-300">/</span>{products.length} styles <span className="mx-2 text-stone-300">/</span>{mode} view</p>
        <div className="flex flex-wrap gap-2">
          <label className="flex items-center gap-2 rounded-full border border-stone-200 px-3 py-2"><Search size={13} className="text-stone-400" /><input aria-label="Search this collection" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Find a style or SKU" className="w-36 bg-transparent text-[10px] outline-none placeholder:text-stone-400 sm:w-44" /></label>
          <select aria-label="Sort products" value={sort} onChange={(event) => setSort(event.target.value)} className="rounded-full border border-stone-200 bg-white px-3 py-2 text-[10px] text-stone-600 outline-none"><option value="featured">Featured</option><option value="name">Name A–Z</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option></select>
        </div>
      </div>
      {products.length ? <motion.div layout className="grid grid-cols-2 gap-x-4 gap-y-9 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 lg:gap-y-12"><AnimatePresence mode="popLayout">{products.map((product, index) => <ProductCard key={product.id} product={product} mode={mode} index={index} onOpen={() => setSelected(product)} />)}</AnimatePresence></motion.div> : <div className="rounded-2xl bg-[#f5f0e8] px-5 py-16 text-center"><p className="font-display text-2xl text-stone-700">No styles found</p><p className="mt-2 text-xs text-stone-500">Try another name, SKU or size.</p></div>}
      <AnimatePresence>{selected && <ProductDialog product={selected} mode={mode} onClose={() => setSelected(null)} />}</AnimatePresence>
    </section>
  );
}

function ShopYourWay({ setMode }: { setMode: (mode: Mode) => void }) {
  return (
    <section id="shop-your-way" className="bg-[#eae5dc] py-16 md:py-20">
      <div className="mx-auto max-w-[1180px] px-5 sm:px-8 md:px-12">
        <div className="mx-auto mb-10 max-w-xl text-center"><p className="mb-3 text-[9px] font-bold uppercase tracking-[0.28em] text-[#9b7667]">Two ways to shop</p><h2 className="font-display text-4xl text-[#39352f] sm:text-5xl">Made for your <em className="font-normal text-[#9b7667]">kind of day.</em></h2><p className="mt-3 text-sm leading-6 text-stone-500">Shopping for a little one, or sourcing for your store? Find your path.</p></div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-[1.6rem] bg-[#faf7f1] p-7 sm:p-10"><span className="grid h-11 w-11 place-items-center rounded-full bg-[#e9dfd3] text-[#806c5d]"><Store size={19} /></span><p className="mt-7 text-[9px] font-bold uppercase tracking-[0.2em] text-[#9b7667]">For families</p><h3 className="mt-2 font-display text-3xl text-stone-800">Retail</h3><p className="mt-3 max-w-sm text-sm leading-6 text-stone-500">Explore our curated pieces. Retail MRP is shown only where it is available in the catalogue; otherwise, ask us for details.</p><button onClick={() => { setMode("retail"); document.getElementById("collections")?.scrollIntoView({ behavior: "smooth" }); }} className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#3e4438] px-5 py-3 text-[9px] font-bold uppercase tracking-[0.14em] text-white">Explore retail <ArrowRight size={13} /></button></div>
          <div className="rounded-[1.6rem] bg-[#d9dfd1] p-7 sm:p-10"><span className="grid h-11 w-11 place-items-center rounded-full bg-white/65 text-[#58624e]"><Package size={19} /></span><p className="mt-7 text-[9px] font-bold uppercase tracking-[0.2em] text-[#66715d]">For boutiques & retailers</p><h3 className="mt-2 font-display text-3xl text-stone-800">Wholesale</h3><p className="mt-3 max-w-sm text-sm leading-6 text-stone-600">Discover our wholesale collections and contact our team for MOQ, availability and order details.</p><div className="mt-7 flex flex-wrap gap-2"><button onClick={() => { setMode("wholesale"); document.getElementById("collections")?.scrollIntoView({ behavior: "smooth" }); }} className="inline-flex items-center gap-2 rounded-full bg-[#3e4438] px-5 py-3 text-[9px] font-bold uppercase tracking-[0.14em] text-white">Wholesale catalogue <ArrowRight size={13} /></button><a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-[#8b967e] px-5 py-3 text-[9px] font-bold uppercase tracking-[0.14em] text-[#46513d]"><MessageCircle size={13} /> WhatsApp</a></div></div>
        </div>
      </div>
    </section>
  );
}

function BrandStory() {
  return (
    <section className="mx-auto grid max-w-[1380px] items-center gap-10 px-5 py-16 sm:px-8 md:grid-cols-2 md:px-12 md:py-24">
      <div className="relative min-h-[300px] overflow-hidden rounded-[1.7rem] bg-[#d7c7b7] sm:min-h-[420px]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_25%_25%,rgba(255,255,255,.55),transparent_38%),radial-gradient(ellipse_at_80%_75%,rgba(111,125,97,.35),transparent_45%),linear-gradient(135deg,#e5d7c8,#b9aa98)]" />
        <div className="absolute left-[13%] top-[15%] h-[68%] w-[74%] rounded-[48%_48%_1.2rem_1.2rem] border-[9px] border-[#f8f3eb]/80 bg-[#e8dfd2]/45 shadow-[0_25px_60px_-25px_rgba(50,40,30,.35)]" />
        <div className="absolute bottom-7 left-7 text-[#61584e]"><p className="font-display text-4xl italic">Curated</p><p className="font-display text-4xl italic">with love.</p></div>
        <Flower2 className="absolute right-8 top-8 text-white/75" size={42} strokeWidth={1} />
      </div>
      <div className="max-w-lg"><p className="mb-3 text-[9px] font-bold uppercase tracking-[0.28em] text-[#9b7667]">A little note from KANIRA</p><h2 className="font-display text-4xl leading-tight text-[#39352f] sm:text-5xl">For the little days that become <em className="font-normal text-[#9b7667]">big memories.</em></h2><p className="mt-5 text-sm leading-7 text-stone-500">We believe childhood deserves clothes that feel as special as the moments inside them. KANIRA brings together thoughtfully selected kidswear styles across our Girls, Boys, Lollipop and Limited Edition collections.</p><p className="mt-4 text-sm leading-7 text-stone-500">Tiny details. Lovely colours. Stories waiting to happen.</p><div className="mt-7 inline-flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.18em] text-[#6b755f]"><Sparkles size={14} /> Tiny Outfits. Big Stories.</div></div>
    </section>
  );
}

function TrustStrip() {
  const items = [[Truck, "Shipping details at checkout"], [ShieldCheck, "Secure shopping experience"], [Heart, "Curated with care"], [MessageCircle, "Personal WhatsApp support"]] as const;
  return <section className="border-y border-stone-200 bg-[#faf8f3]"><div className="mx-auto grid max-w-[1380px] grid-cols-2 gap-5 px-5 py-7 sm:px-8 md:grid-cols-4 md:px-12">{items.map(([Icon, label]) => <div key={label} className="flex items-center gap-3 text-[9px] font-semibold uppercase tracking-[0.1em] text-stone-500"><Icon size={17} className="shrink-0 text-[#8d9a7d]" />{label}</div>)}</div></section>;
}

function Index() {
  const [mode, setMode] = useState<Mode>("retail");
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-[#fffdf9] font-sans text-stone-800">
        <div className="bg-[#3e4438] px-4 py-2 text-center text-[8px] font-semibold uppercase tracking-[0.2em] text-white sm:text-[9px]">KANIRA · Tiny Outfits. Big Stories. · Curated with love</div>
        <header className="sticky top-0 z-50 border-b border-stone-200/80 bg-[#fffdf9]/95 backdrop-blur-xl">
          <div className="mx-auto flex max-w-[1380px] items-center justify-between px-5 py-4 sm:px-8 md:px-12">
            <a href="#" className="group flex flex-col leading-none"><span className="font-display text-[1.65rem] tracking-[0.19em] text-[#39352f]">KANIRA</span><span className="mt-1 text-[7px] font-semibold uppercase tracking-[0.28em] text-[#a18b79]">Curated with love</span></a>
            <nav className="hidden items-center gap-8 md:flex"><a href="#collections" className="text-[9px] font-bold uppercase tracking-[0.16em] text-stone-500 transition hover:text-[#8c6c5c]">Collections</a><a href="#shop-your-way" className="text-[9px] font-bold uppercase tracking-[0.16em] text-stone-500 transition hover:text-[#8c6c5c]">Retail & Wholesale</a><a href="#story" className="text-[9px] font-bold uppercase tracking-[0.16em] text-stone-500 transition hover:text-[#8c6c5c]">Our story</a></nav>
            <div className="flex items-center gap-2"><a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="hidden items-center gap-2 rounded-full bg-[#3e4438] px-4 py-2.5 text-[9px] font-bold uppercase tracking-[0.12em] text-white transition hover:bg-[#59604f] sm:inline-flex"><MessageCircle size={13} /> Wholesale enquiry</a><button aria-label="Toggle navigation" onClick={() => setMenuOpen((value) => !value)} className="grid h-10 w-10 place-items-center rounded-full border border-stone-200 text-stone-700 md:hidden">{menuOpen ? <X size={17} /> : <Menu size={17} />}</button></div>
          </div>
          <AnimatePresence>{menuOpen && <motion.nav initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-stone-100 bg-[#fffdf9] px-5 md:hidden"><div className="flex flex-col gap-4 py-5 text-[10px] font-bold uppercase tracking-[0.15em]"><a onClick={() => setMenuOpen(false)} href="#collections">Collections</a><a onClick={() => setMenuOpen(false)} href="#shop-your-way">Retail & Wholesale</a><a onClick={() => setMenuOpen(false)} href="#story">Our story</a><a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="text-[#6b755f]">WhatsApp enquiry</a></div></motion.nav>}</AnimatePresence>
        </header>
        <main><Hero /><CollectionSection mode={mode} setMode={setMode} /><ShopYourWay setMode={setMode} /><div id="story"><BrandStory /></div><TrustStrip /></main>
        <footer className="bg-[#393d33] text-[#f8f4ec]"><div className="mx-auto grid max-w-[1380px] gap-10 px-5 py-12 sm:px-8 md:grid-cols-[1.3fr_.7fr_.8fr] md:px-12 md:py-16"><div><p className="font-display text-3xl tracking-[0.18em]">KANIRA</p><p className="mt-2 text-[8px] font-semibold uppercase tracking-[0.24em] text-[#c7b9a7]">Curated with love</p><p className="mt-5 max-w-xs text-xs leading-6 text-[#d1c9bd]">Tiny Outfits. Big Stories. Thoughtfully curated kidswear for little moments.</p></div><div><p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#c7b9a7]">Explore</p><div className="mt-4 flex flex-col gap-3 text-xs text-[#f1e9de]"><a href="#collections">Collections</a><a href="#shop-your-way">Retail & Wholesale</a><a href="#story">Our story</a></div></div><div><p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#c7b9a7]">Connect</p><a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 text-xs text-[#f1e9de]"><MessageCircle size={14} /> WhatsApp: +91 99441 77755</a><p className="mt-5 text-[10px] text-[#bcb5a9]">© {new Date().getFullYear()} KANIRA. All rights reserved.</p></div></div></footer>
      </div>
    </MotionConfig>
  );
}
