import { NextResponse } from "next/server";
import { signOut } from "@/src/lib/auth";

export async function POST() {
  try {
    await signOut();
    return NextResponse.json({ ok:true });
  } catch (e) {
    return NextResponse.json({ ok:false, error:{ title:'Logout failed', description: e.message } }, { status: 400 });
  }
}


