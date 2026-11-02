import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, MessageCircle, ShieldCheck, Heart, Sparkles } from "lucide-react";
import { PRODUCTS, priceFor, swatchFor, whatsappLink } from "@/lib/catalogue";
import { SiteLayout } from "@/components/site-layout";
import { CurrencySelector, useCurrencyDisplay } from "@/lib/currency-display";

export const Route = createFileRoute("/product/$productId")({
  component: ProductPage,
  loader: ({ params }) => {
    const product = PRODUCTS.find(item => item.id === params.productId);
    if (!product) throw notFound();
    return { product };
  },
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const display = useCurrencyDisplay();
  const retail = priceFor(product, "retail");
  const wholesale = priceFor(product, "wholesale");
  const firstColour = swatchFor(product.skus[0]!);
  const secondColour = swatchFor(product.skus[1] ?? product.skus[0]!);

  return (
    <SiteLayout active="shop">
      <main className="mx-auto max-w-6xl px-5 py-8 md:px-10 md:py-12">
        <Link to="/shop" className="inline-flex items-center gap-2 text-sm text-[#805037]"><ArrowLeft size={16} /> Back to collections</Link>
        <div className="mt-7 grid gap-8 md:grid-cols-[1.05fr_.95fr] md:gap-12">
          <div>
            <div className="product-detail-art relative flex min-h-[390px] items-center justify-center overflow-hidden rounded-[28px] p-8" style={{ background: `linear-gradient(135deg, ${firstColour} 0%, #f8e8dc 52%, ${secondColour} 100%)` }}>
              <div className="absolute inset-4 rounded-[22px] border border-white/55" />
              <div className="relative max-w-xs rounded-2xl bg-[#fffaf2]/90 p-8 text-center shadow-sm backdrop-blur-sm">
                <span className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-white text-2xl text-[#9c6d58]"><Heart /></span>
                <p className="font-display text-2xl text-[#49372d]">A little KANIRA love</p>
                <p className="mt-2 text-xs leading-5 text-[#75695f]">Product photographs and close-up details will appear here when the approved product images are added.</p>
              </div>
              <span className="absolute bottom-7 left-7 rounded-full bg-white/85 px-3 py-2 text-[10px] uppercase tracking-[.16em] text-[#6d594b]">Catalogue style</span>
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs text-[#88796d]"><Sparkles size={14} /> Product photography is being prepared for this style.</div>
          </div>
          <section className="py-2">
            <p className="eyebrow">{product.category} collection · KANIRA</p>
            <div className="mt-3"><CurrencySelector currency={display.currency} options={display.options} onChange={display.setCurrency}/></div>
            <h1 className="mt-3 font-display text-4xl leading-tight md:text-5xl">{product.name}</h1>
            <p className="mt-4 text-sm leading-7 text-[#74685e]">A considered little style from the KANIRA catalogue. Please confirm current availability, colour and size with our team before ordering.</p>
            <div className="my-7 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-[#eadfd4] bg-[#fffdf9] p-4">
                <p className="text-[10px] uppercase tracking-[.16em] text-[#8c7d70]">Retail price</p>
                <p className="mt-2 text-2xl font-semibold">{retail ? display.formatInrAmount(retail.amount) : "Enquire"}</p>
                <p className="mt-1 text-xs text-[#8c7d70]">{retail?.label ?? "Retail price not listed"}</p>
              </div>
              <div className="rounded-2xl border border-[#eadfd4] bg-[#fffdf9] p-4">
                <p className="text-[10px] uppercase tracking-[.16em] text-[#8c7d70]">Wholesale price</p>
                <p className="mt-2 text-2xl font-semibold">{wholesale ? display.formatInrAmount(wholesale.amount) : "Enquire"}</p>
                <p className="mt-1 text-xs text-[#8c7d70]">{wholesale?.label ?? "Wholesale price not listed"}</p>
              </div>
            </div>
            <div className="rounded-2xl bg-[#f3ece3] p-5">
              <h2 className="text-sm font-semibold">Available catalogue sizes</h2>
              <div className="mt-3 flex flex-wrap gap-2">{product.sizes.map(size => <span key={size} className="rounded-full border border-[#d8c9bb] bg-[#fffdf9] px-3 py-2 text-xs">{size}</span>)}</div>
            </div>
            {product.fabric && <div className="mt-5"><h2 className="text-sm font-semibold">Fabric</h2><p className="mt-2 text-sm text-[#74685e]">{product.fabric}</p></div>}
            {product.details && <div className="mt-5"><h2 className="text-sm font-semibold">Product details</h2><ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-[#74685e]">{product.details.map(detail => <li key={detail}>{detail}</li>)}</ul></div>}
            <div className="mt-6"><p className="text-[10px] uppercase tracking-[.16em] text-[#8c7d70]">Catalogue SKU</p><p className="mt-1 text-sm">{product.skus.join(" · ")}</p></div>
            <a className="primary-button mt-7 inline-flex w-full md:w-auto" href={whatsappLink(product)} target="_blank" rel="noreferrer"><MessageCircle size={17} /> Enquire on WhatsApp</a>
            <p className="mt-4 flex items-center gap-2 text-xs leading-5 text-[#8c7d70]"><ShieldCheck size={15} /> Converted display prices are indicative; KANIRA confirms the final invoice, shipping, taxes and payment currency before accepting an international order.</p>
          </section>
        </div>
      </main>
    </SiteLayout>
  );
}
