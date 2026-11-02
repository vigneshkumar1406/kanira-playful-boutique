import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Heart, Scissors, Sparkles } from "lucide-react";
import { PageIntro, PageSection, SiteLayout, KANIRA_WHATSAPP } from "@/components/site-layout";

export const Route = createFileRoute("/difference")({
  head: () => ({ meta: [{ title: "The KANIRA Difference | KANIRA" }, { name: "description", content: "Discover the KANIRA approach to elevated kidswear, thoughtful fabric choices and careful garment finishing." }] }),
  component: DifferencePage,
});

const pillars = [
  { n: "01", title: "Elevated style", text: "Contemporary silhouettes, considered colours and distinctive little details — designed to make everyday outfits feel special.", icon: Sparkles },
  { n: "02", title: "Thoughtful fabric", text: "Double-layer muslin is a signature fabric choice in our range. Explore the construction and feel, and check each product page for its confirmed fabric details.", icon: Heart },
  { n: "03", title: "Careful stitching", text: "We believe the inside matters too. Seams, hems and finishing deserve attention, not just the first impression.", icon: Scissors },
  { n: "04", title: "Comfort-conscious design", text: "Children move, play, sit and explore. We want style and comfort to be considered together when creating little wardrobes.", icon: CheckCircle2 },
];

function DifferencePage() {
  return <SiteLayout active="difference"><main>
    <PageIntro eyebrow="MORE THAN JUST KIDSWEAR" title={<>A little more thought<br/><em>in every thread.</em></>} description="KANIRA brings together elevated style, thoughtful fabric choices and careful garment finishing for little wardrobes." />
    <PageSection className="difference-page-lead difference-page-lead-single"><div><p className="eyebrow">THE KANIRA PROMISE</p><h2>Beautifully designed.<br/><em>Thoughtfully made.</em></h2><p>We believe little ones deserve clothing that looks as beautiful as it feels. Our approach is about more than a pretty outfit: it is about the fabric, the construction, the finishing and the details parents can see and appreciate.</p><div className="difference-lead-values"><span><Sparkles size={16}/> Elevated style</span><span><Heart size={16}/> Thoughtful fabric</span><span><Scissors size={16}/> Careful finishing</span></div></div></PageSection>
    <PageSection><div className="section-heading"><p className="eyebrow">WHAT MAKES KANIRA DIFFERENT</p><h2>The details behind the look.</h2><p>Four parts of our approach to little wardrobes.</p></div><div className="difference-detail-grid">{pillars.map(({n,title,text,icon:Icon})=><article key={n}><span>{n}</span><Icon/><h3>{title}</h3><p>{text}</p></article>)}</div></PageSection>
    <PageSection className="difference-proof"><div><p className="eyebrow">SHOW, DON'T JUST TELL</p><h2>See the care<br/>behind the clothes.</h2><p>We want parents to see the details for themselves. Our product and behind-the-scenes content will show fabric texture, inside seams, hems, stitching checks and how garments move during everyday play.</p></div><ul><li>Fabric close-ups and layer demonstrations</li><li>Inside seams, hems and finishing details</li><li>Movement and fit in real-life moments</li><li>Quality checks before garments are packed</li></ul></PageSection>
    <div className="page-cta"><div><p className="eyebrow">HAVE A QUESTION?</p><h2>Want to know more about a fabric, fit or finish?</h2><p>Our team can help with product-specific details.</p></div><a href={KANIRA_WHATSAPP} target="_blank" rel="noreferrer" className="light-button">Ask KANIRA <ArrowRight size={16}/></a></div>
  </main></SiteLayout>;
}
