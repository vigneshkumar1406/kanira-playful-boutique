import { createFileRoute } from "@tanstack/react-router";
import { PackageSearch } from "lucide-react";
import { SiteLayout, PageIntro } from "../components/site-layout";

export const Route = createFileRoute("/track-order")({ component: TrackOrderPage });

function TrackOrderPage() {
  return <SiteLayout><main className="mx-auto max-w-4xl px-5 py-10 md:px-10">
    <PageIntro eyebrow="ORDER CARE" title="Where is your parcel?" description="Track a KANIRA order securely. Live tracking will be enabled when order and courier services are connected."/>
    <div className="mx-auto mt-8 max-w-lg rounded-2xl bg-white p-7 shadow-sm"><PackageSearch className="text-[#a77a5b]" size={30}/><h2 className="mt-4 font-serif text-2xl">Order tracking</h2><p className="mt-2 text-sm leading-6 text-[#786c62]">For privacy, an order number alone will not reveal order details. Secure account or one-time verification will be required.</p><p className="mt-5 text-sm">Need an update now? Contact our team with your order confirmation.</p><a className="primary-button mt-5 inline-flex" href="https://wa.me/919944177755?text=Hello%20KANIRA%2C%20I%20would%20like%20an%20order%20update.">Contact KANIRA</a></div>
  </main></SiteLayout>;
}
