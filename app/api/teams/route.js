import { NextResponse } from "next/server";
import { createTeam } from "@/src/lib/services";

export async function POST(request) {
  const body = await request.json();
  const res = await createTeam(body || {});
  return res.ok ? NextResponse.json({ ok:true, data: res.data }) : NextResponse.json({ ok:false, error: res.error }, { status: 400 });
}

export async function GET() {
  // optional: implement listing user's teams using session
  return NextResponse.json({ ok:false, error:{ title:'Not Implemented' } }, { status: 501 });
}


