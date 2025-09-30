import { NextResponse } from "next/server";
import { searchUsers } from "@/src/lib/services";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const faculty = searchParams.get('faculty') || undefined;
  const skills = (searchParams.get('skills') || "").split(',').filter(Boolean).map(s=>Number(s));
  const limit = Number(searchParams.get('limit') || 20);
  const offset = Number(searchParams.get('offset') || 0);
  const res = await searchUsers({ skills, faculty, limit, offset });
  return res.ok ? NextResponse.json({ ok:true, data: res.data }) : NextResponse.json({ ok:false, error: res.error }, { status: 400 });
}


