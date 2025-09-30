import { NextResponse } from "next/server";
import { updateProject, getProjectDetails } from "@/src/lib/services";

export async function GET(_request, { params }) {
  const id = params?.id;
  const res = await getProjectDetails({ project_id: id });
  return res.ok ? NextResponse.json({ ok:true, data: res.data }) : NextResponse.json({ ok:false, error: res.error }, { status: 400 });
}

export async function PUT(request, { params }) {
  const id = params?.id;
  const updates = await request.json();
  const res = await updateProject({ project_id: id, updates });
  return res.ok ? NextResponse.json({ ok:true }) : NextResponse.json({ ok:false, error: res.error }, { status: 400 });
}

export async function DELETE(_request, { params }) {
  // optional: implement hard delete when needed
  return NextResponse.json({ ok:false, error:{ title:'Not Implemented' } }, { status: 501 });
}


