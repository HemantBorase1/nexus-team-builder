import { NextResponse } from "next/server";
import { removeTeamMember } from "@/src/lib/services";

export async function DELETE(_request, { params }) {
  const team_id = params?.id;
  const user_id = params?.userId;
  const res = await removeTeamMember({ team_id, user_id });
  return res.ok ? NextResponse.json({ ok:true }) : NextResponse.json({ ok:false, error: res.error }, { status: 400 });
}


