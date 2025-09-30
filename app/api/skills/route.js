import { NextResponse } from "next/server";
import { getSkillsCatalog } from "@/src/lib/services";

export async function GET() {
  const res = await getSkillsCatalog();
  return res.ok ? NextResponse.json({ ok:true, data: res.data }) : NextResponse.json({ ok:false, error: res.error }, { status: 400 });
}


