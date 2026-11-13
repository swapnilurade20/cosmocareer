"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

const fieldStyle = { width: "100%", padding: "14px 15px", border: "1px solid #d0d5dd", borderRadius: 12, background: "#fff", color: "#101828", fontSize: 15 };

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();


  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({ email: email.trim().toLowerCase(), password })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "We couldn't sign you in. Please check your details.");
      const next = new URLSearchParams(window.location.search).get("next");
      if (next && next.startsWith("/") && !next.startsWith("//") && !next.startsWith("/admin")) {
        router.replace(next);
      } else {
        router.replace(data.user?.role === "admin" ? "/admin" : data.user?.role === "employer" ? "/employer" : data.user?.role === "counsellor" ? "/counsellor" : data.user?.role === "teacher" ? "/teacher" : data.user?.role === "employee" ? "/employee" : "/dashboard");
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return <main className="section" style={{ minHeight: "72vh", display: "grid", placeItems: "center", background: "linear-gradient(135deg,#f6f7ff 0%,#f8fbff 55%,#fff 100%)" }}>
    <div className="container" style={{ maxWidth: 480, width: "100%" }}>
      <section className="card" style={{ padding: "clamp(24px,5vw,40px)", border: "1px solid #eaecf5", boxShadow: "0 18px 55px rgba(16,24,40,.08)", borderRadius: 22 }}>
        <a href="/" style={{ textDecoration: "none", fontWeight: 900, fontSize: 20, color: "#344054" }}>Cosmo<span style={{ color: "#6254d9" }}>Career</span></a>
        <div style={{ marginTop: 28 }}><span className="tag">WELCOME BACK</span><h1 style={{ fontSize: 32, margin: "12px 0 8px" }}>Sign in to your account</h1><p className="muted">Continue learning, manage your courses and access your workspace.</p></div>
        <form onSubmit={submit} style={{ display: "grid", gap: 17, marginTop: 26 }}>
          <label style={{ display: "grid", gap: 7, fontWeight: 700 }}>Email address
            <input type="email" autoComplete="username" required maxLength={254} value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" style={fieldStyle}/>
          </label>
          <label style={{ display: "grid", gap: 7, fontWeight: 700 }}>Password
            <div style={{ position: "relative" }}><input type={showPassword ? "text" : "password"} autoComplete="current-password" required maxLength={72} value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" style={{ ...fieldStyle, paddingRight: 76 }}/>
              <button type="button" onClick={() => setShowPassword(v => !v)} style={{ position: "absolute", right: 10, top: 9, border: 0, background: "transparent", color: "#6254d9", padding: 6, cursor: "pointer", fontWeight: 700 }}>{showPassword ? "Hide" : "Show"}</button>
            </div>
          </label>
          {error && <p role="alert" style={{ margin: 0, padding: 12, borderRadius: 10, background: "#fff1f0", color: "#b42318" }}>{error}</p>}
          <button disabled={busy} className="btn primary" style={{ width: "100%", minHeight: 48, opacity: busy ? .7 : 1 }}>{busy ? "Signing you in…" : "Sign in"}</button>
        </form>
        <p style={{ textAlign: "center", margin: "22px 0 0" }} className="muted">New to CosmoCareer? <a href="/signup" style={{ color: "#5145cd", fontWeight: 700 }}>Create an account</a></p>
        <p style={{ textAlign: "center", fontSize: 12, color: "#667085", marginBottom: 0 }}>For account security, administrator access is created and managed separately.</p>
      </section>
    </div>
  </main>;
}
