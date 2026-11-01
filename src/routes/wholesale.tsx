import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, MessageCircle, PackageCheck, Store, ClipboardList } from "lucide-react";
import { PageIntro, PageSection, SiteLayout, KANIRA_WHATSAPP } from "@/components/site-layout";

export const Route = createFileRoute("/wholesale")({
 head:()=>({meta:[{title:"Wholesale Enquiries | KANIRA"},{name:"description",content:"Explore KANIRA wholesale collections and contact our Tiruppur team."}]}),
 component:WholesalePage,
});
function WholesalePage(){
 const catalogue="https://wa.me/c/919944177755";
 return <SiteLayout active="wholesale"><main>
  <PageIntro eyebrow="FOR BOUTIQUES & RETAIL PARTNERS" title={<>A thoughtful range.<br/><em>A personal partnership.</em></>} description="Discover KANIRA wholesale collections and connect with our team for catalogue details and availability."/>
  <PageSection className="wholesale-page-hero"><div><p className="eyebrow">KANIRA TRADE ENQUIRIES</p><h2>Let's grow something lovely together.</h2><p>Browse our wholesale catalogue, then contact the team to confirm current styles, prices, sizes, stock and order terms before placing an order.</p><a href={catalogue} target="_blank" rel="noreferrer" className="primary-button">View WhatsApp catalogue <ArrowRight size={16}/></a></div><div className="wholesale-page-mark"><Store size={42}/><b>KANIRA</b><small>WHOLESALE · TIRUPPUR</small></div></PageSection>
  <PageSection className="values-grid"><article><ClipboardList/><h3>Browse the catalogue</h3><p>Explore the available collection PDFs and product selections through WhatsApp catalogue.</p></article><article><MessageCircle/><h3>Speak with our team</h3><p>Ask about availability, current wholesale pricing and order requirements.</p></article><article><PackageCheck/><h3>Confirm before ordering</h3><p>Our team will confirm MOQ, pack details, payment and dispatch terms for the selected styles.</p></article></PageSection>
  <div className="page-cta"><div><p className="eyebrow">WHOLESALE SUPPORT</p><h2>Ready to enquire?</h2><p>Message KANIRA directly. Our team will help with the next steps.</p></div><a href={KANIRA_WHATSAPP} target="_blank" rel="noreferrer" className="light-button"><MessageCircle size={16}/> Chat on WhatsApp</a></div>
 </main></SiteLayout>;
}
