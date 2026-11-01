import Link from "next/link";
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AuthPage() {
  const supabase = createClient();
  const router = useRouter();
  const [mode,setMode] = useState<"signup"|"signin">("signup");
  const [step,setStep] = useState<"email"|"otp"|"password">("email");
  const [email,setEmail] = useState("");
  const [otp,setOtp] = useState("");
  const [password,setPassword] = useState("");
  const [busy,setBusy] = useState(false);
  const [error,setError] = useState("");
  const [notice,setNotice] = useState("");

  async function sendCode() {
    setBusy(true); setError(""); setNotice("");
    const {error} = await supabase.auth.signInWithOtp({email:email.trim(),options:{shouldCreateUser:mode==="signup"}});
    if(error) setError(error.message); else {setStep("otp");setNotice("Check your inbox for the 6-digit verification code.");}
    setBusy(false);
  }
  async function verify() {
    setBusy(true);setError("");
    const {error}=await supabase.auth.verifyOtp({email:email.trim(),token:otp.trim(),type:"email"});
    if(error) setError(error.message); else if(mode==="signup") setStep("password"); else router.replace("/dashboard");
    setBusy(false);
  }
  async function setNewPassword() {
    setBusy(true);setError("");
    const {error}=await supabase.auth.updateUser({password});
    if(error) setError(error.message); else router.replace("/dashboard");
    setBusy(false);
  }
  async function signIn() {
    setBusy(true);setError("");
    const {error}=await supabase.auth.signInWithPassword({email:email.trim(),password});
    if(error) setError(error.message); else router.replace("/dashboard");
    setBusy(false);
  }

  return <main className="auth-shell"><Link href="/" className="auth-brand">API-<b>FLOW</b></Link>
    <section className="auth-card"><span className="auth-kicker">DEVELOPER ACCESS</span>
      <h1>{mode==="signin"?"Welcome back":step==="email"?"Create your account":step==="otp"?"Verify your email":"Create a password"}</h1>
      <p className="auth-subtitle">{step==="email"?"Your AI providers. One secure gateway.":step==="otp"?"Enter the one-time code sent to your email.":"Supabase Auth securely manages your password."}</p>
      {step==="email"&&<><label>Email address</label><input className="auth-input" type="email" autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"/>
        {mode==="signin"&&<><label>Password</label><input className="auth-input" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Your password"/></>}
        <button className="auth-submit" disabled={busy||!email.trim()||(mode==="signin"&&!password)} onClick={mode==="signup"?sendCode:signIn}>{busy?"Please wait...":mode==="signup"?"Send email OTP":"Sign in"}</button>
        <button className="auth-switch" onClick={()=>{setMode(mode==="signup"?"signin":"signup");setError("");}}>{mode==="signup"?"Already registered? Sign in":"Create a new account"}</button></>}
      {step==="otp"&&<><label>6-digit code</label><input className="auth-input" inputMode="numeric" maxLength={6} value={otp} onChange={e=>setOtp(e.target.value.replace(/\D/g,""))} placeholder="000000"/><button className="auth-submit" disabled={busy||otp.length!==6} onClick={verify}>{busy?"Verifying...":"Verify email"}</button><button className="auth-switch" onClick={()=>setStep("email")}>Change email</button></>}
      {step==="password"&&<><label>Create password</label><input className="auth-input" type="password" minLength={8} autoComplete="new-password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="At least 8 characters"/><button className="auth-submit" disabled={busy||password.length<8} onClick={setNewPassword}>{busy?"Saving...":"Create account"}</button></>}
      {error&&<p className="auth-error">{error}</p>}{notice&&<p className="auth-notice">{notice}</p>}
    </section>
  </main>;
}