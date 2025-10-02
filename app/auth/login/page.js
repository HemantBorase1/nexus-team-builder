"use client";

import { useState } from "react";
import { Card, CardHeader, CardContent } from "@/src/components/ui/Card";
import Input from "@/src/components/ui/Input";
import Button from "@/src/components/ui/Button";
import Avatar from "@/src/components/ui/Avatar";
import { toast } from "react-hot-toast";
import authService from "@/src/services/auth-service";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return setError("Email and password required");
    setError("");
    try {
      const res = await authService.login({ email, password });
      if (!res.ok) throw new Error(res.error?.description || 'Login failed');
      toast.success('Welcome back');
      // Demo: redirect to profile page when demo account logs in
      if (email.toLowerCase() === 'demo@nexus.app') {
        window.location.href = "/profile";
      } else {
        window.location.href = "/dashboard";
      }
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    }
  };

  return (
    <>
      {/* Left brand area */}
      <div className="hidden md:block">
        <div className="glass-card">
          <div className="inner p-6">
            <div className="text-3xl font-bold bg-gradient-to-r from-[#8B5CF6] via-[#3B82F6] to-[#06B6D4] bg-clip-text text-transparent">Nexus</div>
            <div className="text-white/80 mt-2">Build Dream Teams. Automatically.</div>
            <div className="mt-6 grid grid-cols-3 gap-3">
              {["Alex","Jamie","Taylor"].map((n,i)=> (
                <div key={i} className="text-center">
                  <Avatar name={n} />
                  <div className="text-xs text-white/70 mt-1">Teammate</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right form */}
      <div>
        <div className="glass-card max-w-md">
          <div className="inner p-6">
            <h1 className="text-2xl font-semibold gradient-text text-center">Welcome Back</h1>
            <form onSubmit={onSubmit} className="mt-4 space-y-3">
              <Input
                type="email"
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!email && error ? "Enter your email" : ""}
                leftIcon={<span>✉</span>}
              />
              <Input
                type={show? 'text':'password'}
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={!password && error ? "Enter your password" : ""}
                rightIcon={<button type="button" onClick={()=>setShow(v=>!v)} aria-label="Toggle password">{show? '🙈':'👁'}</button>}
              />
              <div className="flex items-center justify-between text-xs">
                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" className="h-4 w-4 rounded border-white/20 bg-[#1A1A2E]" />
                  <span className="text-white/70">Remember me</span>
                </label>
                <a href="/auth/forgot" className="text-white/80 hover:text-white transition">Forgot password?</a>
              </div>
              {error && <div className="text-sm text-red-400">{error}</div>}
              <Button className="w-full btn-gradient" type="submit">Log in</Button>
              {/* Social logins removed for email/password only flow */}
              <div className="text-center text-sm text-white/70">
                Don&apos;t have an account? <a href="/auth/signup" className="bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] bg-clip-text text-transparent">Sign up</a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}


