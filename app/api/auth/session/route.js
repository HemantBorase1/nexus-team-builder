import { NextResponse } from "next/server";
import { getCurrentSession } from "@/src/lib/api/utils";

export async function GET() {
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ ok:false, error:{ title:'No session' } }, { status: 401 });
  return NextResponse.json({ ok:true, data: session });
}


