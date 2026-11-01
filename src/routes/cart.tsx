import { createFileRoute, Link } from "@tanstack/react-router";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { SiteLayout, PageIntro } from "../components/site-layout";

export const Route = createFileRoute("/cart")({ component: CartPage });

function CartPage() {
  return <SiteLayout><main className="mx-auto min-h-[55vh] max-w-5xl px-5 py-10 md:px-10">
    <PageIntro eyebrow="YOUR BAG" title="A little room for lovely things." description="Your shopping bag will appear here once the live catalogue and cart service are connected."/>
    <div className="mx-auto mt-8 max-w-xl rounded-2xl bg-white p-8 text-center shadow-sm"><ShoppingBag className="mx-auto text-[#a77a5b]" size={34}/><h2 className="mt-4 font-serif text-2xl">Your bag is waiting</h2><p className="mt-2 text-sm text-[#786c62]">Browse the collection and enquire about availability. Online checkout will be enabled after the store backend is connected.</p><Link to="/shop" className="primary-button mt-6 inline-flex">Explore the shop <ArrowRight size={16}/></Link></div>
  </main></SiteLayout>;
}
