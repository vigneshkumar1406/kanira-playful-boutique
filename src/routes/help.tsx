import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown, MessageCircle, Mail, MapPin } from "lucide-react";
import { KANIRA_WHATSAPP, PageIntro, PageSection, SiteLayout } from "@/components/site-layout";

export const Route = createFileRoute("/help")({
 head:()=>({meta:[{title:"Help & Contact | KANIRA"},{name:"description",content:"Contact KANIRA for product, retail and wholesale enquiries."}]}),
 component:HelpPage,
});
const questions=[
 {q:"How can I enquire about a product?",a:"Open the product enquiry on WhatsApp and send our team the style name or SKU. We will confirm current availability and details."},
 {q:"Are the prices shown for retail or wholesale?",a:"The catalogue distinguishes retail MRP from wholesale prices. If a retail price is not available, please enquire rather than treating a wholesale price as retail."},
 {q:"How do I place a wholesale order?",a:"Browse the wholesale catalogue and contact our team. MOQ, size-pack rules, stock, payment and dispatch terms must be confirmed for your selected styles."},
 {q:"Do you accept returns or exchanges?",a:"Please contact our team before ordering to confirm the current return and exchange terms for your order. We are not publishing an unverified return window here."},
 {q:"How much is shipping and how long does delivery take?",a:"Shipping charges, serviceability and delivery estimates depend on the destination and order. Our team will confirm these details before you place the order."},
];
function HelpPage(){
 const [open,setOpen]=useState<number|null>(0);
 return <SiteLayout active="help"><main>
  <PageIntro eyebrow="HERE WHEN YOU NEED US" title={<>A little help.<br/><em>A friendly hello.</em></>} description="Questions about a style, an order enquiry or wholesale? Reach out to the KANIRA team."/>
  <PageSection className="help-layout"><div><p className="eyebrow">FREQUENTLY ASKED</p><h2 className="mb-6 font-display text-3xl">Good to know</h2><div className="faq-list">{questions.map((item,i)=><article key={item.q} className="faq-item"><button onClick={()=>setOpen(open===i?null:i)} aria-expanded={open===i}><span>{item.q}</span><ChevronDown className={open===i?"rotate-180":""} size={18}/></button>{open===i&&<p>{item.a}</p>}</article>)}</div></div>
  <aside className="contact-card"><p className="eyebrow">CONTACT KANIRA</p><h2>Let's talk.</h2><p>For product availability, catalogue details and order enquiries, WhatsApp is the quickest way to reach us.</p><a href={KANIRA_WHATSAPP} target="_blank" rel="noreferrer" className="primary-button"><MessageCircle size={16}/> WhatsApp us</a><div className="contact-detail"><MapPin size={17}/><span>From Tiruppur, Tamil Nadu</span></div><div className="contact-detail"><Mail size={17}/><span>Email support details to be added</span></div></aside>
  </PageSection>
 </main></SiteLayout>;
}
