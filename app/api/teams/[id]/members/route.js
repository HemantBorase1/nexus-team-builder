import { NextResponse } from "next/server";
import { addTeamMember } from "@/src/lib/services";

export async function POST(request, { params }) {
  const team_id = params?.id;
  const body = await request.json();
  const res = await addTeamMember({ team_id, user_id: body?.user_id, role: body?.role });
  return res.ok ? NextResponse.json({ ok:true }) : NextResponse.json({ ok:false, error: res.error }, { status: 400 });
}


