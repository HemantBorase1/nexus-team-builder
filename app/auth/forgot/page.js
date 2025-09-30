"use client";

import { useState } from "react";
import { Card, CardHeader, CardContent } from "@/src/components/ui/Card";
import Input from "@/src/components/ui/Input";
import Button from "@/src/components/ui/Button";

export default function ForgotPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  return (
    <Card>
      <CardHeader className="text-center">
        <h1 className="text-xl font-semibold">Reset password</h1>
      </CardHeader>
      <CardContent>
        {!sent ? (
          <form onSubmit={(e)=>{e.preventDefault(); setSent(true);}} className="space-y-3">
            <Input type="email" label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Button className="w-full" type="submit">Send reset link</Button>
          </form>
        ) : (
          <div className="text-center text-sm text-gray-700">We emailed a reset link if an account exists for {email}.</div>
        )}
      </CardContent>
    </Card>
  );
}


