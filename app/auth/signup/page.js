"use client";

import { useState } from "react";
import { Card, CardHeader, CardContent } from "@/src/components/ui/Card";
import Input from "@/src/components/ui/Input";
import Button from "@/src/components/ui/Button";
import Select from "@/src/components/ui/Select";
import { getAllFaculties } from "@/src/lib/mock-data";
import { toast } from "react-hot-toast";
import authService from "@/src/services/auth-service";

export default function SignupPage() {
  const faculties = getAllFaculties();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [faculty, setFaculty] = useState(faculties[0].id);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirm) return setError("Fill all fields");
    if (password !== confirm) return setError("Passwords do not match");
    setError("");
    try {
      const res = await authService.signup({ name, email, password, faculty });
      if (!res.ok) throw new Error(res.error?.description || 'Signup failed');
      toast.success('Account created');
      // Auto-login simulated by signup; redirect to onboarding
      window.location.href = "/onboarding";
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    }
  };

  return (
    <>
      {/* Left visuals match login */}
      <div className="hidden md:block">
        <div className="glass-card">
          <div className="inner p-6">
            <div className="text-3xl font-bold bg-gradient-to-r from-[#8B5CF6] via-[#3B82F6] to-[#06B6D4] bg-clip-text text-transparent">Join Nexus</div>
            <div className="text-white/80 mt-2">Create your account to get matched instantly.</div>
          </div>
        </div>
      </div>

      {/* Right form */}
      <div>
        <div className="glass-card max-w-md">
          <div className="inner p-6">
            <h1 className="text-2xl font-semibold gradient-text text-center">Join Nexus</h1>
            <form onSubmit={onSubmit} className="mt-4 space-y-3">
              <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} error={!name && error ? "Enter your name" : ""} />
              <Input type="email" label="Email" value={email} onChange={(e) => setEmail(e.target.value)} error={!email && error ? "Enter your email" : ""} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <Input type="password" label="Password" value={password} onChange={(e) => setPassword(e.target.value)} error={!password && error ? "Enter a password" : ""} />
                <Input type="password" label="Confirm Password" value={confirm} onChange={(e) => setConfirm(e.target.value)} error={!confirm && error ? "Confirm your password" : ""} />
              </div>
              <Select label="Faculty" value={faculty} onChange={(e)=>setFaculty(e.target.value)} options={faculties.map(f=>({label:f.name, value:f.id}))} className="bg-[#1A1A2E] border-white/15 text-white" />
              {error && <div className="text-sm text-red-400">{error}</div>}
              <label className="inline-flex items-center gap-2 text-xs">
                <input type="checkbox" className="h-4 w-4 rounded border-white/20 bg-[#1A1A2E]" />
                <span className="text-white/70">I agree to the Terms and Privacy Policy</span>
              </label>
              <Button className="w-full btn-gradient" type="submit">Create account</Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}


