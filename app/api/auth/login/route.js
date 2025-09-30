import { NextResponse } from "next/server";
import { signInWithPassword } from "@/src/lib/auth";

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) return NextResponse.json({ ok:false, error:{ title:'Validation', description:'Email and password required' } }, { status: 400 });
    const data = await signInWithPassword({ email, password });
    return NextResponse.json({ ok:true, data });
  } catch (e) {
    return NextResponse.json({ ok:false, error:{ title:'Login failed', description: e.message } }, { status: 400 });
  }
}


