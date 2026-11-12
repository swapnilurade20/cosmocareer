import {NextRequest,NextResponse} from "next/server";import {readSession,SESSION_COOKIE} from "@/lib/session";
export async function middleware(req:NextRequest){
  const path=req.nextUrl.pathname;
  const accept=req.headers.get("accept")||"";
  if(path==="/" && accept.includes("text/markdown")){
    const url=req.nextUrl.clone();url.pathname="/agent-markdown";url.searchParams.set("source","accept");
    return NextResponse.rewrite(url);
  }
  const token=req.cookies.get(SESSION_COOKIE)?.value;const s=token?await readSession(token):null;
  if(path.startsWith("/admin")){if(!s)return NextResponse.redirect(new URL("/login?next=/admin",req.url));if(s.role!=="admin")return NextResponse.redirect(new URL("/dashboard?denied=1",req.url))}
  if(path.startsWith("/employer")&&(!s||s.role!=="employer"))return NextResponse.redirect(new URL("/login?next=/employer",req.url));
  if(path.startsWith("/counsellor")&&(!s||!["admin","counsellor"].includes(s.role)))return NextResponse.redirect(new URL("/login?next=/counsellor",req.url));\n  if(path.startsWith("/employee")&&(!s||!["admin","employee","teacher"].includes(s.role)))return NextResponse.redirect(new URL("/dashboard?denied=1",req.url));
  if((path.startsWith("/notifications")||path.startsWith("/service-orders"))&&!s)return NextResponse.redirect(new URL("/login?next="+path,req.url));
  if(path.startsWith("/dashboard")||path.startsWith("/teacher")||path.startsWith("/employee"))if(!s)return NextResponse.redirect(new URL("/login",req.url));
  return NextResponse.next()
}
export const config={matcher:["/","/admin/:path*","/dashboard/:path*","/teacher/:path*","/employee/:path*","/employer/:path*","/counsellor/:path*","/notifications/:path*","/service-orders/:path*"]};
