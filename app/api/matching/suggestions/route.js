import { NextResponse } from "next/server";
import { searchUsers } from "@/src/lib/services";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const skills = (searchParams.get('skills') || "").split(',').filter(Boolean).map(Number);
  const res = await searchUsers({ skills, limit: 12, offset: 0 });
  return res.ok ? NextResponse.json({ ok:true, data: res.data }) : NextResponse.json({ ok:false, error: res.error }, { status: 400 });
}


