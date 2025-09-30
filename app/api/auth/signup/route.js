import { NextResponse } from "next/server";
import { signUp } from "@/src/lib/auth";
import { createUserProfile } from "@/src/lib/services";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password, full_name, faculty, year } = body || {};
    if (!email || !password) return NextResponse.json({ ok:false, error:{ title:'Validation', description:'Email and password required' } }, { status: 400 });
    const { user } = await signUp({ email, password });
    if (user?.id) await createUserProfile({ id: user.id, full_name, faculty, year });
    return NextResponse.json({ ok:true, data:{ id: user?.id } });
  } catch (e) {
    return NextResponse.json({ ok:false, error:{ title:'Signup failed', description: e.message } }, { status: 400 });
  }
}


