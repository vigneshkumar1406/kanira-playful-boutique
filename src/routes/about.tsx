import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Heart, Leaf, Sparkles } from "lucide-react";
import { PageIntro, PageSection, SiteLayout, KANIRA_WHATSAPP } from "@/components/site-layout";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [{ title: "Our Story | KANIRA" }, { name: "description", content: "Discover the thinking behind KANIRA: elevated kidswear, thoughtful fabric choices and careful garment finishing." }] }),
  component: AboutPage,
});

function AboutPage() {
 return <SiteLayout active="about"><main>
  <PageIntro eyebrow="A LITTLE ABOUT KANIRA" title={<>Little Ones.<br/><em>Elevated.</em></>} description="Beautifully designed. Thoughtfully made. A considered approach to style, fabric and garment construction for little wardrobes."/>
  <PageSection className="story-page-grid"><div className="story-page-art"><Leaf size={54}/><span>KANIRA</span><small>CURATED WITH LOVE · TIRUPPUR</small></div><div><p className="eyebrow">WHY KANIRA EXISTS</p><h2>More than just kidswear.</h2><p>We believe little ones deserve clothing that looks as beautiful as it feels. KANIRA was created around a simple idea: bring together elevated design, thoughtful fabric choices and careful garment finishing at an approachable premium.</p><p>From signature double-layer muslin to considered details and neat stitching, our focus is on the thought behind each garment. Product-specific fabric and construction details are shared on the relevant product pages as they are confirmed.</p><a className="text-link" href="/difference">Explore the KANIRA difference <ArrowRight size={16}/></a></div></PageSection>
  <PageSection className="values-grid"><article><Heart/><h3>Elevated style</h3><p>Considered colours, contemporary looks and distinctive details for little personalities.</p></article><article><Sparkles/><h3>Thoughtful construction</h3><p>Attention to fabric choices, stitching, seams and finishing — not only the outside appearance.</p></article><article><Leaf/><h3>From Tiruppur</h3><p>A kidswear label from Tiruppur, bringing a considered approach to little wardrobes.</p></article></PageSection>
  <div className="page-cta"><div><p className="eyebrow">LET'S CONNECT</p><h2>Have a question about KANIRA?</h2></div><a href={KANIRA_WHATSAPP} target="_blank" rel="noreferrer" className="light-button">Talk to our team <ArrowRight size={16}/></a></div>
 </main></SiteLayout>;
}
