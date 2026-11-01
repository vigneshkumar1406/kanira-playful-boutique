import { createFileRoute, Link } from "@tanstack/react-router";
import { LockKeyhole, MessageCircle } from "lucide-react";
import { SiteLayout, PageIntro } from "../components/site-layout";

export const Route = createFileRoute("/account")({ component: AccountPage });

function AccountPage() {
  return <SiteLayout><main className="mx-auto max-w-4xl px-5 py-10 md:px-10">
    <PageIntro eyebrow="YOUR KANIRA ACCOUNT" title="Welcome, lovely." description="Sign in to manage your profile, saved addresses and orders. Secure authentication will activate after the KANIRA Supabase project is connected."/>
    <div className="mx-auto mt-8 max-w-lg rounded-2xl bg-white p-7 shadow-sm"><LockKeyhole className="text-[#a77a5b]" size={30}/><h2 className="mt-4 font-serif text-2xl">Account access</h2><p className="mt-2 text-sm leading-6 text-[#786c62]">The sign-in interface is reserved for the secure authentication integration. We will not collect or store passwords in this temporary page.</p><a href="https://wa.me/919944177755?text=Hello%20KANIRA%2C%20I%20need%20help%20with%20my%20account." className="primary-button mt-5 inline-flex"><MessageCircle size={16}/> Ask for help</a><div className="mt-5 text-sm"><Link to="/track-order" className="text-[#805037] underline">Track an order instead</Link></div></div>
  </main></SiteLayout>;
}
