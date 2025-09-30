import { NextResponse } from "next/server";
import { getUserProfile } from "@/src/lib/services";

export async function GET(_request, { params }) {
  const userId = params?.id;
  if (!userId) return NextResponse.json({ ok:false, error:{ title:'Validation', description:'User id required' } }, { status: 400 });
  const res = await getUserProfile({ userId });
  return res.ok ? NextResponse.json({ ok:true, data: res.data }) : NextResponse.json({ ok:false, error: res.error }, { status: 400 });
}


