import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Droplets, Layers3, Shirt } from "lucide-react";
import { PageIntro, PageSection, SiteLayout, KANIRA_WHATSAPP } from "@/components/site-layout";

export const Route = createFileRoute("/fabric-care")({
  head: () => ({ meta: [{ title: "Fabric & Care | KANIRA" }, { name: "description", content: "Learn about muslin, double-layer fabric construction and how to care for your KANIRA garments." }] }),
  component: FabricCarePage,
});

function FabricCarePage() {
 return <SiteLayout active="fabric"><main>
  <PageIntro eyebrow="GET TO KNOW THE FABRIC" title={<>A closer look at<br/><em>double-layer muslin.</em></>} description="Fabric is part of how a garment looks, feels and is constructed. Here is a simple introduction to the signature muslin story behind KANIRA."/>
  <PageSection className="fabric-intro-grid"><div className="fabric-text"><p className="eyebrow">FABRIC EDUCATION</p><h2>What is muslin?</h2><p>Muslin is a lightweight woven fabric known for its simple, airy construction and softly textured appearance. It is used across many kinds of clothing and everyday textiles.</p><p>Double-layer muslin brings two woven layers together as one fabric. The layered construction gives it a different body and texture from a single layer.</p><p className="fabric-caveat">Fabric composition, weight and finish can vary. Please check the individual product details for the exact material information of each KANIRA style.</p></div><div className="fabric-layer-card"><Layers3 size={42}/><span>DOUBLE-LAYER</span><b>Two woven layers.<br/>One considered fabric.</b><small>Illustrative fabric-construction concept</small></div></PageSection>
  <PageSection><div className="section-heading"><p className="eyebrow">UNDERSTAND THE DETAILS</p><h2>Why fabric construction matters.</h2><p>Look beyond the colour and print. Notice how the fabric is made and finished.</p></div><div className="fabric-benefits"><article><Layers3/><h3>Layered construction</h3><p>Two layers are joined to create the fabric structure. This is the defining construction detail of double-layer muslin.</p></article><article><Shirt/><h3>How it feels</h3><p>Feel and comfort depend on fibre, weave, weight, finishing and garment design. We encourage parents to explore the fabric and product-specific details.</p></article><article><Droplets/><h3>Care matters</h3><p>Follow the care label on each garment. Washing and drying instructions may differ by fabric composition, dye and finish.</p></article></div></PageSection>
  <PageSection className="care-note"><div><p className="eyebrow">LOOK AFTER YOUR LITTLE FAVOURITES</p><h2>How should I wash muslin?</h2><p>There is no single care instruction that suits every muslin garment. Always follow the garment's sewn-in care label first. If the label is missing or unclear, contact our team before washing.</p></div><a href={KANIRA_WHATSAPP} target="_blank" rel="noreferrer" className="secondary-button">Ask us about fabric care <ArrowRight size={16}/></a></PageSection>
 </main></SiteLayout>;
}
