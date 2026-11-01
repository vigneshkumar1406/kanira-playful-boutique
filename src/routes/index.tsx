import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { ArrowRight, Heart, Menu, MessageCircle, Search, ShoppingBag, X, Leaf, Truck, ShieldCheck, Sparkles } from "lucide-react";
import { CATEGORIES, PRODUCTS, priceFor, swatchFor, whatsappLink, type Category, type Mode, type Product } from "@/lib/catalogue";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "KANIRA — Little Ones. Elevated." },
      { name: "description", content: "Elevated kidswear with thoughtful fabric choices, careful stitching and considered design. Discover KANIRA." },
      { property: "og:title", content: "KANIRA — Little Ones. Elevated" },
      { property: "og:description", content: "Beautifully designed. Thoughtfully made. Curated with love." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: HomePage,
});

const fadeUp = { initial: { opacity: 0, y: 22 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-50px" }, transition: { duration: 0.65 } };

function Logo({ light = false }: { light?: boolean }) {
  return <a href="#" aria-label="KANIRA home" className={`kanira-logo ${light ? "text-[#f8f4ed]" : "text-[#302a24]"}`}><span className="logo-mark"><Leaf size={20} /></span><span>KANIRA</span><small>Tiny Outfits. Big Stories.</small></a>;
}

function ProductVisual({ product, className = "" }: { product: Product; className?: string }) {
  const first = swatchFor(product.skus[0]!);
  const second = swatchFor(product.skus[1] ?? product.skus[0]!);
  return <div className={`product-visual ${className}`} style={{ background: `linear-gradient(140deg, ${first} 0%, ${first} 54%, ${second} 54%, ${second} 100%)` }}><span>Product photo coming soon</span></div>;
}

function ProductPrice({ product, mode }: { product: Product; mode: Mode }) {
  const price = priceFor(product, mode);
  if (!price) return <span className="text-sm text-[#8b8178]">Enquire / View details</span>;
  return <span className="flex items-center gap-2"><small className="price-label">{price.label}</small><strong>₹{price.amount.toLocaleString("en-IN")}</strong></span>;
}

function ProductCard({ product, mode, onOpen }: { product: Product; mode: Mode; onOpen: () => void }) {
  return <motion.button {...fadeUp} whileHover={{ y: -5 }} whileTap={{ scale: 0.985 }} onClick={onOpen} className="product-card text-left">
    <div className="relative"><ProductVisual product={product} className="aspect-[4/4.6]" /><span className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-[#4b4038]"><Heart size={16} /></span></div>
    <div className="space-y-2 p-4"><h3 className="font-display text-lg leading-snug">{product.name}</h3><p className="text-[10px] tracking-wide text-[#93877d]">{product.skus.join(" · ")}</p><div className="flex flex-wrap gap-1">{product.sizes.map(size => <span key={size} className="size-chip">{size}</span>)}</div><div className="pt-1"><ProductPrice product={product} mode={mode} /></div></div>
  </motion.button>;
}

function ProductDialog({ product, mode, onClose }: { product: Product; mode: Mode; onClose: () => void }) {
  return <motion.div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/40 p-3 sm:items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
    <motion.div role="dialog" aria-modal="true" aria-label={product.name} onClick={event => event.stopPropagation()} initial={{ y: 35, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 25, opacity: 0 }} className="grid w-full max-w-2xl overflow-hidden rounded-[28px] bg-[#fffdf9] sm:grid-cols-2">
      <ProductVisual product={product} className="min-h-64 aspect-square" />
      <div className="relative space-y-4 p-6"><button onClick={onClose} aria-label="Close details" className="absolute right-4 top-4 rounded-full p-2 hover:bg-[#f4eee7]"><X size={18}/></button><p className="text-xs uppercase tracking-[.2em] text-[#9a7964]">{CATEGORIES.find(c => c.id === product.category)?.label}</p><h2 className="font-display text-3xl">{product.name}</h2><div><p className="text-xs text-[#8b8178]">SKU</p><p className="text-sm">{product.skus.join(", ")}</p></div><div><p className="text-xs text-[#8b8178]">Available catalogue sizes</p><p className="text-sm">{product.sizes.join(", ")}</p></div><ProductPrice product={product} mode={mode}/><a href={whatsappLink(product)} target="_blank" rel="noreferrer" className="primary-button w-full"><MessageCircle size={16}/> Ask about this style</a><p className="text-xs leading-5 text-[#8b8178]">WhatsApp opens with a draft enquiry. Review and send it yourself.</p></div>
    </motion.div>
  </motion.div>;
}

function HomePage() {
  const [mode, setMode] = useState<Mode>("retail");
  const [category, setCategory] = useState<Category>("girls");
  const [selected, setSelected] = useState<Product | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  const visibleProducts = PRODUCTS.filter(p => p.category === category && (search.trim() === "" || [p.name, ...p.skus, ...p.sizes].join(" ").toLowerCase().includes(search.toLowerCase())));

  return <MotionConfig reducedMotion="user"><div className="min-h-screen bg-[#fbf7f1] text-[#302a24]">
    <a href="#main-content" className="skip-link">Skip to content</a>
    <div className="announcement-bar"><span>✦</span> KANIRA · CURATED WITH LOVE <i/> RETAIL & WHOLESALE ENQUIRIES <span>✦</span></div>
    <header className="site-header">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-3 md:px-10">
        <button className="rounded-full p-2 md:hidden" aria-label="Open menu" onClick={() => setMobileOpen(!mobileOpen)}>{mobileOpen ? <X/> : <Menu/>}</button>
        <Logo/>
        <nav className="hidden items-center gap-8 text-sm md:flex"><a href="/shop">Shop</a><a href="#collections">Collections</a><a href="/about">Our story</a><a href="/wholesale">Wholesale</a><a href="/help">Help</a></nav>
        <div className="flex items-center gap-1"><button aria-label="Search products" onClick={() => setSearchOpen(!searchOpen)} className="header-icon"><Search size={19}/></button><a href="#collections" aria-label="Browse collections" className="header-icon"><Heart size={19}/></a><a href="/wholesale" aria-label="Wholesale enquiries" className="header-icon"><ShoppingBag size={19}/></a></div>
      </div>
      <AnimatePresence>{mobileOpen && <motion.nav initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mobile-nav md:hidden"><a href="/shop" onClick={() => setMobileOpen(false)}>Shop</a><a href="#collections" onClick={() => setMobileOpen(false)}>Collections</a><a href="/about" onClick={() => setMobileOpen(false)}>Our story</a><a href="/wholesale" onClick={() => setMobileOpen(false)}>Wholesale</a><a href="/help" onClick={() => setMobileOpen(false)}>Help</a></motion.nav>}</AnimatePresence>
      <AnimatePresence>{searchOpen && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="border-t border-[#eee4d9] px-5 py-3"><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search product name, SKU or size…" className="search-input mx-auto block max-w-3xl"/></motion.div>}</AnimatePresence>
    </header>

    <main id="main-content">
      <section className="hero-section">
        <div className="hero-copy"><p className="eyebrow">A THOUGHTFUL APPROACH TO LITTLE WARDROBES</p><h1>Little Ones.<br/><em>Elevated.</em></h1><p className="hero-description">Beautifully designed. Thoughtfully made. Kidswear that brings together elevated style, considered comfort and careful construction.</p><div className="mt-7 flex flex-wrap gap-3"><a href="/shop" className="primary-button">Discover the collection <ArrowRight size={16}/></a><a href="/difference" className="secondary-button">The KANIRA difference</a></div><p className="hero-note">BEAUTIFULLY DESIGNED · THOUGHTFULLY MADE</p></div>
        <div className="hero-image" role="img" aria-label="Editorial kidswear campaign image placeholder"><div className="hero-image-overlay"><span>THE KANIRA APPROACH</span><strong>A little more thought in every thread</strong></div><div className="hero-image-placeholder">Campaign photography to be added</div></div>
      </section>

      <section className="trust-strip" aria-label="Store information"><div><Leaf/><span><b>Thoughtful styles</b><small>Curated with love</small></span></div><div><Sparkles/><span><b>Little details</b><small>Made for everyday moments</small></span></div><div><Truck/><span><b>Retail & wholesale</b><small>Enquire with our team</small></span></div><div><ShieldCheck/><span><b>Personal support</b><small>Talk to KANIRA directly</small></span></div></section>

      <section className="difference-intro"><div className="difference-intro-copy"><p className="eyebrow">MORE THAN JUST KIDSWEAR</p><h2>A little more thought<br/><em>in every thread.</em></h2><p>At KANIRA, we believe little ones deserve clothing that looks as beautiful as it feels. From thoughtfully selected double-layer muslin to careful stitching and considered design, every detail has a purpose.</p><a className="text-link" href="/difference">Discover the KANIRA difference <ArrowRight size={16}/></a></div><div className="difference-pillars"><article><span>01</span><b>Elevated aesthetics</b><small>Contemporary styles and considered details.</small></article><article><span>02</span><b>Signature muslin</b><small>Thoughtful double-layer fabric construction.</small></article><article><span>03</span><b>Careful craftsmanship</b><small>Neat stitching and considered finishing.</small></article><article><span>04</span><b>Everyday comfort</b><small>Comfort-conscious choices for little movers.</small></article></div></section><section id="collections" className="section-wrap"><div className="section-heading centered"><p className="eyebrow">THOUGHTFULLY CURATED</p><h2>Discover the collection</h2><p>Find a considered style for your little one.</p></div><div className="category-grid">{CATEGORIES.map((item, index) => <button key={item.id} onClick={() => {setCategory(item.id); document.getElementById("shop")?.scrollIntoView({behavior:"smooth"});}} className="category-tile"><span className={`category-art category-art-${index}`}>{item.label === "Girls" ? "✿" : item.label === "Boys" ? "✦" : item.label === "Lollipop" ? "♡" : "✧"}</span><b>{item.label}</b><small>{item.note}</small></button>)}</div></section>

      <section id="shop" className="section-wrap shop-section"><div className="section-heading-row"><div><p className="eyebrow">LITTLE STYLES, CONSIDERED DETAILS</p><h2>Find their next favourite</h2><p>Explore the KANIRA catalogue by collection.</p></div><div className="mode-switch" aria-label="Price view"><button className={mode === "retail" ? "active" : ""} onClick={() => setMode("retail")}>Retail</button><button className={mode === "wholesale" ? "active" : ""} onClick={() => setMode("wholesale")}>Wholesale</button></div></div><div className="category-tabs" role="tablist">{CATEGORIES.map(item => <button key={item.id} role="tab" aria-selected={category === item.id} className={category === item.id ? "active" : ""} onClick={() => setCategory(item.id)}>{item.label}</button>)}</div><p className="mb-5 text-xs text-[#8b8178]">{CATEGORIES.find(c => c.id === category)?.note} · {visibleProducts.length} styles</p><div className="product-grid">{visibleProducts.map(product => <ProductCard key={product.id} product={product} mode={mode} onOpen={() => setSelected(product)}/>)}</div>{visibleProducts.length === 0 && <p className="py-12 text-center text-sm text-[#8b8178]">No matching styles. Try another search or collection.</p>}</section>

      <section className="feature-banners"><div className="feature-banner feature-banner-sage"><p className="eyebrow">CURATED WITH LOVE</p><h3>Everyday little<br/>favourites</h3><a href="#shop">Explore styles <ArrowRight size={15}/></a></div><div className="feature-banner feature-banner-blush"><p className="eyebrow">A LITTLE SOMETHING SPECIAL</p><h3>Find their next<br/>favourite</h3><a href="#collections">Browse collections <ArrowRight size={15}/></a></div></section>

      <section id="story" className="story-section"><div className="story-art"><Leaf size={44}/><span>KANIRA</span><small>FROM TIRUPPUR</small></div><div><p className="eyebrow">OUR PHILOSOPHY</p><h2>Beyond cute.<br/><em>Beautifully crafted.</em></h2><p>KANIRA was created around a simple idea: bring together elevated design, thoughtful fabric choices and careful garment finishing at an approachable premium. Because children’s clothing is about more than how it looks — it is also about how it is made and how little ones feel wearing it.</p><a href="/about" target="_blank" rel="noreferrer" className="text-link">Discover our story <ArrowRight size={16}/></a></div></section>

      <section id="wholesale" className="wholesale-section"><div><p className="eyebrow">FOR OUR TRADE PARTNERS</p><h2>Wholesale, with a personal touch.</h2><p>Explore KANIRA wholesale collections and contact our team for catalogue details, availability and order enquiries.</p><a href={whatsappLink()} target="_blank" rel="noreferrer" className="light-button"><MessageCircle size={16}/> Enquire on WhatsApp</a></div><div className="wholesale-mark"><span>✳</span><b>KANIRA</b><small>WHOLESALE ENQUIRIES</small></div></section>
    </main>

    <footer className="site-footer"><div className="footer-main"><div><Logo light/><p className="mt-5 max-w-xs text-sm leading-6 text-white/65">Curated with love. Tiny outfits for big little stories.</p></div><div><h3>Explore</h3><a href="/shop">Shop collections</a><a href="/difference">The KANIRA difference</a><a href="/fabric-care">Fabric & care</a><a href="/about">Our story</a><a href="/wholesale">Wholesale</a></div><div><h3>Get in touch</h3><a href={whatsappLink()} target="_blank" rel="noreferrer">WhatsApp enquiries</a><a href="/about">About KANIRA</a><a href="/help">FAQs & support</a><span>From Tiruppur, Tamil Nadu</span></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} KANIRA. All rights reserved.</span><span>CURATED WITH LOVE · TINY OUTFITS. BIG STORIES.</span></div></footer>
    <AnimatePresence>{selected && <ProductDialog product={selected} mode={mode} onClose={() => setSelected(null)}/>}</AnimatePresence>
  </div></MotionConfig>;
}
