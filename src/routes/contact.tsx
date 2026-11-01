import { createFileRoute } from "@tanstack/react-router";
import { MapPin, MessageCircle } from "lucide-react";
import { SiteLayout, PageIntro } from "../components/site-layout";

export const Route = createFileRoute("/contact")({ component: ContactPage });

function ContactPage() {
  return <SiteLayout><main className="mx-auto max-w-5xl px-5 py-10 md:px-10">
    <PageIntro eyebrow="SAY HELLO" title="Let's talk little things." description="Questions about a collection, wholesale availability or an existing order? Our team is happy to help."/>
    <div className="mt-8 grid gap-5 md:grid-cols-2"><section className="rounded-2xl bg-white p-7"><MessageCircle className="text-[#a77a5b]" size={30}/><h2 className="mt-4 font-serif text-2xl">WhatsApp</h2><p className="mt-2 text-sm text-[#786c62]">For product, wholesale and order enquiries.</p><a href="https://wa.me/919944177755" className="primary-button mt-5 inline-flex">Message KANIRA</a></section><section className="rounded-2xl bg-white p-7"><MapPin className="text-[#a77a5b]" size={30}/><h2 className="mt-4 font-serif text-2xl">Made with care in Tiruppur</h2><p className="mt-2 text-sm leading-7 text-[#786c62]">Tiruppur, Tamil Nadu, India. A full postal address and customer support email will be added after confirmation.</p></section></div>
  </main></SiteLayout>;
}
