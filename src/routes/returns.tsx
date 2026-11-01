import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout, PageIntro } from "../components/site-layout";

export const Route = createFileRoute("/returns")({ component: ReturnsPage });

function ReturnsPage() {
  return <SiteLayout><main className="mx-auto max-w-4xl px-5 py-10 md:px-10">
    <PageIntro eyebrow="AFTER YOU ORDER" title="We're here to help." description="A clear, caring process for questions about an order or an item."/>
    <section className="mt-8 rounded-2xl bg-white p-7"><h2 className="font-serif text-2xl">Returns & damaged items</h2><p className="mt-3 text-sm leading-7 text-[#786c62]">KANIRA's final return window, eligibility, pickup and refund rules must be confirmed by the store before publication. We will not promise a return period or refund method that has not been approved. If an item arrives damaged, please keep the packaging and contact us with your order reference and clear photos.</p><a className="primary-button mt-5 inline-flex" href="https://wa.me/919944177755?text=Hello%20KANIRA%2C%20I%20need%20help%20with%20a%20return%20or%20damaged%20item.">Contact support</a><p className="mt-5 text-sm"><Link to="/help" className="underline">Read help & FAQs</Link></p></section>
  </main></SiteLayout>;
}
