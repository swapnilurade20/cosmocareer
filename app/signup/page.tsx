"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

const fieldStyle = { width: "100%", padding: "13px 14px", border: "1px solid #d0d5dd", borderRadius: 12, background: "#fff", color: "#101828", fontSize: 15 };

export default function SignupPage() {
  const [values, setValues] = useState({ name: "", email: "", phone: "", password: "", preferredLanguage: "en" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({ ...values, name: values.name.trim(), email: values.email.trim().toLowerCase(), phone: values.phone.trim() })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "We couldn't create your account. Please try again.");
      router.replace("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create your account.");
    } finally {
      setBusy(false);
    }
  }

  return <main className="section" style={{ minHeight: "72vh", display: "grid", placeItems: "center", background: "linear-gradient(135deg,#f6f7ff 0%,#f8fbff 55%,#fff 100%)" }}>
    <div className="container" style={{ maxWidth: 540, width: "100%" }}>
      <section className="card" style={{ padding: "clamp(24px,5vw,40px)", border: "1px solid #eaecf5", boxShadow: "0 18px 55px rgba(16,24,40,.08)", borderRadius: 22 }}>
        <a href="/" style={{ textDecoration: "none", fontWeight: 900, fontSize: 20, color: "#344054" }}>Cosmo<span style={{ color: "#6254d9" }}>Career</span></a>
        <div style={{ marginTop: 25 }}><span className="tag">GET STARTED</span><h1 style={{ fontSize: 32, margin: "12px 0 8px" }}>Create your account</h1><p className="muted">Join CosmoCareer to explore careers, learn new skills and track your progress.</p></div>
        <form onSubmit={submit} style={{ display: "grid", gap: 15, marginTop: 24 }}>
          <label style={{ display: "grid", gap: 7, fontWeight: 700 }}>Full name<input required minLength={2} maxLength={100} autoComplete="name" value={values.name} onChange={e => setValues(v => ({ ...v, name: e.target.value }))} placeholder="Your full name" style={fieldStyle}/></label>
          <label style={{ display: "grid", gap: 7, fontWeight: 700 }}>Email address<input required type="email" maxLength={254} autoComplete="email" value={values.email} onChange={e => setValues(v => ({ ...v, email: e.target.value }))} placeholder="you@example.com" style={fieldStyle}/></label>
          <label style={{ display: "grid", gap: 7, fontWeight: 700 }}>Phone number <span className="muted" style={{ fontWeight: 400, display: "inline" }}>(optional)</span><input type="tel" maxLength={20} autoComplete="tel" value={values.phone} onChange={e => setValues(v => ({ ...v, phone: e.target.value }))} placeholder="Your phone number" style={fieldStyle}/></label>
          <label style={{ display: "grid", gap: 7, fontWeight: 700 }}>Password<input required type={showPassword ? "text" : "password"} minLength={10} maxLength={72} autoComplete="new-password" value={values.password} onChange={e => setValues(v => ({ ...v, password: e.target.value }))} placeholder="At least 10 characters" style={fieldStyle}/></label>
          <label style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 14 }}><input type="checkbox" checked={showPassword} onChange={e => setShowPassword(e.target.checked)}/> Show password</label>
          <label style={{ display: "grid", gap: 7, fontWeight: 700 }}>Preferred language<select value={values.preferredLanguage} onChange={e => setValues(v => ({ ...v, preferredLanguage: e.target.value }))} style={fieldStyle}><option value="en">English</option><option value="hi">हिन्दी</option></select></label>
          {error && <p role="alert" style={{ margin: 0, padding: 12, borderRadius: 10, background: "#fff1f0", color: "#b42318" }}>{error}</p>}
          <button disabled={busy} className="btn primary" style={{ width: "100%", minHeight: 48, opacity: busy ? .7 : 1 }}>{busy ? "Creating your account…" : "Create account"}</button>
        </form>
        <p className="muted" style={{ textAlign: "center", marginBottom: 0, marginTop: 22 }}>Already registered? <a href="/login" style={{ color: "#5145cd", fontWeight: 700 }}>Sign in</a></p>
        <p style={{ fontSize: 12, color: "#667085", textAlign: "center", marginBottom: 0 }}>New registrations create learner accounts. Staff and administrator accounts are provisioned securely by an administrator.</p>
      </section>
    </div>
  </main>;
}
