import { NextResponse } from "next/server";
import { findCommonAvailability } from "@/src/lib/services";

export async function POST(request) {
  const { usersAvailability } = await request.json();
  const res = findCommonAvailability({ usersAvailability });
  return res.ok ? NextResponse.json({ ok:true, data: res.data }) : NextResponse.json({ ok:false, error: res.error }, { status: 400 });
}


