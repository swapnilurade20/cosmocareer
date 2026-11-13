import type {Metadata} from "next";
import "./globals.css";
import WebMCPRegistration from "@/components/webmcp-registration";

const siteUrl = "https://growmorex.in";
const organizationSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["Organization", "EducationalOrganization"],
      "@id": siteUrl + "/#organization",
      "name": "CosmoCareer",
      "url": siteUrl,
      "description": "Career discovery, practical skills learning, placement resources and creative services.",
      "email": "hello@growmorex.in",
      "contactPoint": [{
        "@type": "ContactPoint",
        "contactType": "customer support",
        "email": "hello@growmorex.in",
        "availableLanguage": ["English", "Hindi", "Marathi"]
      }]
    },
    {
      "@type": "WebSite",
      "@id": siteUrl + "/#website",
      "url": siteUrl,
      "name": "CosmoCareer",
      "publisher": { "@id": siteUrl + "/#organization" },
      "inLanguage": "en-IN"
    }
  ]
};

export const metadata:Metadata={
  metadataBase:new URL(siteUrl),
  title:{default:"CosmoCareer | Career Discovery, Courses & Career Growth",template:"%s | CosmoCareer"},
  description:"Explore career options with a career self-assessment, build practical skills through courses, and discover placement resources and creative services.",
  openGraph:{type:"website",url:siteUrl,title:"CosmoCareer | Learn. Create. Grow.",description:"Career discovery, practical learning, placement resources and creative services.",siteName:"CosmoCareer"},
  robots:{index:true,follow:true}
};

export default function RootLayout({children}:{children:React.ReactNode}){
  return <html lang="en-IN"><head><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(organizationSchema).replace(/</g,"\\u003c")}} /></head><body><WebMCPRegistration/><header className="site-header"><div className="nav-shell"><a className="brand" href="/" aria-label="CosmoCareer home"><span className="brand-mark">C</span><span>cosmo<span className="brand-accent">career</span></span></a><nav className="main-nav" aria-label="Main navigation"><a href="/courses">Courses</a><a href="/career-test">Career test</a><a href="/career-guide">Career guide</a><a href="/services">Services</a><details className="more-nav"><summary>Explore</summary><div className="more-menu"><a href="/placement-support">Placement support</a><a href="/placements">Opportunities</a><a href="/blog">Insights & blog</a><a href="/about">About us</a><a href="/faq">FAQs</a><a href="/contact">Contact</a></div></details></nav><div className="nav-actions"><a className="nav-login" href="/login">Log in</a><a className="btn primary nav-cta" href="/signup">Get started <span aria-hidden="true">↗</span></a></div></div></header>{children}<footer className="site-footer"><div className="footer-main"><div><a className="brand footer-brand" href="/"><span className="brand-mark">C</span><span>cosmo<span className="brand-accent">career</span></span></a><p>Find your direction. Build practical skills. Move forward with confidence.</p><a href="mailto:hello@growmorex.in">hello@growmorex.in</a></div><div><b>Explore</b><a href="/courses">Courses</a><a href="/career-test">Career test</a><a href="/career-guide">Career guide</a><a href="/blog">Insights & blog</a></div><div><b>Support</b><a href="/placement-support">Placement support</a><a href="/services">Creative services</a><a href="/faq">FAQs</a><a href="/contact">Contact us</a></div><div><b>Company</b><a href="/about">About us</a><a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="/refund-policy">Refund policy</a><a href="/admin/workspace">Admin workspace</a></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} CosmoCareer. All rights reserved.</span><span>Learn. Create. Grow.</span></div></footer></body></html>
