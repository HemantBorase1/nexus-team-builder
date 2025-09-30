import { NextResponse } from "next/server";
import { optimizeTeamFormations } from "@/src/lib/matching";

export async function POST(request) {
  const { candidates, teamSize = 5, project } = await request.json();
  const results = optimizeTeamFormations({ candidates, teamSize, project });
  return NextResponse.json({ ok:true, data: results });
}


