import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Heart, Leaf, Sparkles } from "lucide-react";
import { PageIntro, PageSection, SiteLayout, KANIRA_WHATSAPP } from "@/components/site-layout";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [{ title: "Our Story | KANIRA" }, { name: "description", content: "Discover KANIRA, a kidswear label from Tiruppur, curated with love." }] }),
  component: AboutPage,
});

function AboutPage() {
 return <SiteLayout active="about"><main>
  <PageIntro eyebrow="A LITTLE ABOUT KANIRA" title={<>Little outfits.<br/><em>Big stories.</em></>} description="A kidswear label from Tiruppur, thoughtfully bringing together styles for little wardrobes."/>
  <PageSection className="story-page-grid"><div className="story-page-art"><Leaf size={54}/><span>KANIRA</span><small>CURATED WITH LOVE · TIRUPPUR</small></div><div><p className="eyebrow">OUR POINT OF VIEW</p><h2>Childhood is made of little moments.</h2><p>Getting ready for a family day, celebrating a birthday, or simply playing at home — every day has its own little story. KANIRA brings together kidswear collections for those moments.</p><p>Rooted in Tiruppur, our catalogue brings together Girls, Boys, Lollipop and Limited Edition selections.</p><a className="text-link" href="/shop">Explore the collections <ArrowRight size={16}/></a></div></PageSection>
  <PageSection className="values-grid"><article><Heart/><h3>Curated with love</h3><p>We present our collections with care and a focus on the details.</p></article><article><Sparkles/><h3>Little individuality</h3><p>Different collections give families and retailers room to discover their favourites.</p></article><article><Leaf/><h3>From Tiruppur</h3><p>A kidswear label connected to one of India's recognised textile and garment hubs.</p></article></PageSection>
  <div className="page-cta"><div><p className="eyebrow">LET'S CONNECT</p><h2>Have a question about KANIRA?</h2></div><a href={KANIRA_WHATSAPP} target="_blank" rel="noreferrer" className="light-button">Talk to our team <ArrowRight size={16}/></a></div>
 </main></SiteLayout>;
}
