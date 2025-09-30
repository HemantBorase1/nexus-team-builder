import { NextResponse } from "next/server";
import { parseJson } from "@/src/lib/api/utils";
import { createProject, getProjects } from "@/src/lib/services";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const owner_id = searchParams.get('owner_id') || undefined;
  const status = searchParams.get('status') || undefined;
  const q = searchParams.get('q') || undefined;
  const limit = Number(searchParams.get('limit') || 20);
  const offset = Number(searchParams.get('offset') || 0);
  const res = await getProjects({ owner_id, status, q, limit, offset });
  return res.ok ? NextResponse.json({ ok:true, data: res.data }) : NextResponse.json({ ok:false, error: res.error }, { status: 400 });
}

export async function POST(request) {
  const body = await parseJson(request);
  const res = await createProject(body || {});
  return res.ok ? NextResponse.json({ ok:true, data: res.data }) : NextResponse.json({ ok:false, error: res.error }, { status: 400 });
}


