import { NextResponse } from "next/server";
import { getTeamDetails } from "@/src/lib/services";

export async function GET(_request, { params }) {
  const id = params?.id;
  const res = await getTeamDetails({ team_id: id });
  return res.ok ? NextResponse.json({ ok:true, data: res.data }) : NextResponse.json({ ok:false, error: res.error }, { status: 400 });
}


