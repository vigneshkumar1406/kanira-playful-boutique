import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, MessageCircle, ShieldCheck } from "lucide-react";
import { PRODUCTS, priceFor, swatchFor, whatsappLink } from "../lib/catalogue";
import { SiteLayout } from "../components/site-layout";

export const Route = createFileRoute("/product/$productId")({
  component: ProductPage,
  loader: ({ params }) => {
    const product = PRODUCTS.find((item) => item.id === params.productId);
    if (!product) throw notFound();
    return { product };
  },
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const retail = priceFor(product, "retail");
  const wholesale = priceFor(product, "wholesale");
  return <SiteLayout>
    <main className="mx-auto max-w-6xl px-5 py-10 md:px-10">
      <Link to="/shop" className="inline-flex items-center gap-2 text-sm text-[#805037]"><ArrowLeft size={16}/> Back to collections</Link>
      <div className="mt-8 grid gap-10 md:grid-cols-2">
        <div className="product-placeholder flex min-h-[420px] items-center justify-center rounded-2xl" aria-label="Product photography placeholder">
          <div className="text-center"><div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full border border-[#b58a67]/30 text-3xl" style={{background: swatchFor(product.skus[0])}}>✦</div><p className="text-sm">Product photography coming soon</p></div>
        </div>
        <section className="py-2">
          <p className="eyebrow">{product.category} collection</p>
          <h1 className="mt-3 font-serif text-4xl leading-tight">{product.name}</h1>
          <p className="mt-4 text-sm leading-7 text-[#74685e]">A KANIRA catalogue style. Please confirm current availability, colour and size before placing an order.</p>
          <div className="my-7 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-white p-4"><p className="text-xs uppercase tracking-widest text-[#8c7d70]">Retail</p><p className="mt-2 text-xl font-semibold">{retail ? `₹${retail.amount}` : "Enquire"}</p><p className="text-xs text-[#8c7d70]">{retail?.label ?? "Retail price not listed"}</p></div>
            <div className="rounded-xl bg-white p-4"><p className="text-xs uppercase tracking-widest text-[#8c7d70]">Wholesale</p><p className="mt-2 text-xl font-semibold">{wholesale ? `₹${wholesale.amount}` : "Enquire"}</p><p className="text-xs text-[#8c7d70]">{wholesale?.label ?? "Wholesale price not listed"}</p></div>
          </div>
          <h2 className="font-semibold">Available catalogue sizes</h2><div className="mt-3 flex flex-wrap gap-2">{product.sizes.map(size=><span key={size} className="rounded-full border border-[#d8c9bb] px-4 py-2 text-sm">{size}</span>)}</div>{product.fabric && <div className="mt-6"><h2 className="font-semibold">Fabric</h2><p className="mt-2 text-sm text-[#74685e]">{product.fabric}</p></div>}{product.details && <div className="mt-5"><h2 className="font-semibold">Product details</h2><ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-[#74685e]">{product.details.map(detail=><li key={detail}>{detail}</li>)}</ul></div>}
          <p className="mt-6 text-xs text-[#8c7d70]">Catalogue references: {product.skus.join(" · ")}</p>
          <a className="primary-button mt-7 inline-flex" href={whatsappLink(product)} target="_blank" rel="noreferrer"><MessageCircle size={17}/> Enquire on WhatsApp</a>
          <p className="mt-5 flex items-center gap-2 text-xs text-[#8c7d70]"><ShieldCheck size={15}/> Prices and stock are confirmed by KANIRA before order acceptance.</p>
        </section>
      </div>
    </main>
  </SiteLayout>;
}
