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
    },
    {
      "@type": "WebPage",
      "@id": siteUrl + "/#webpage",
      "url": siteUrl + "/",
      "name": "CosmoCareer | Career Discovery, Courses and Creative Services",
      "description": "Explore career options, take a 60-question career self-assessment, build practical skills and discover career resources.",
      "isPartOf": { "@id": siteUrl + "/#website" },
      "about": { "@id": siteUrl + "/#organization" },
      "inLanguage": "en-IN"
    }
  ]
};

export const metadata:Metadata={
  metadataBase:new URL(siteUrl),
  title:{default:"CosmoCareer | Career Discovery, Courses & Career Growth",template:"%s | CosmoCareer"},
  description:"Explore career options with a 60-question career test, build practical skills through courses, and discover placement resources and creative services.",
  openGraph:{type:"website",url:siteUrl,title:"CosmoCareer | Learn. Create. Grow.",description:"Career discovery, practical learning, placement resources and creative services.",siteName:"CosmoCareer"},
  robots:{index:true,follow:true}
};

export default function RootLayout({children}:{children:React.ReactNode}){
  return <html lang="en-IN"><head><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(organizationSchema).replace(/</g,"\\u003c")}} /></head><body><WebMCPRegistration/><header className="nav"><a className="brand" href="/">Cosmo<span>Career</span></a><nav className="links"><a href="/">Home</a><a href="/courses">Courses</a><a href="/services">Services</a><a href="/career-test">Career Test</a><a href="/career-guide">Career Guide</a><a href="/placement-support">Placement Support</a><a href="/blog">Blog</a><a href="/about">About</a><a href="/faq">FAQ</a><a href="/contact">Contact</a><a href="/signup">Sign up</a><a href="/login" className="btn primary">Login</a></nav></header>{children}<footer className="footer">© {new Date().getFullYear()} CosmoCareer · Learn. Create. Grow.<div style={{display:"flex",justifyContent:"center",gap:18,flexWrap:"wrap",marginTop:14,fontSize:13}}><a href="/about">About</a><a href="/contact">Contact</a><a href="/career-guide">Career Guide</a><a href="/placement-support">Placement Support</a><a href="/blog">Blog</a><a href="/faq">FAQ</a><a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="/refund-policy">Refund Policy</a><a href="/admin/workspace">Admin workspace</a></div><p style={{marginTop:12,fontSize:12}}><a href="mailto:hello@growmorex.in">hello@growmorex.in</a></p></footer></body></html>
}