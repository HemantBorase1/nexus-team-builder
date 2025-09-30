import { NextResponse } from "next/server";
import { updateUserAvatar } from "@/src/lib/avatar-service";
import { withAuth } from "@/src/lib/api/authMiddleware";

export const POST = withAuth(async (request, { user }) => {
  try {
    const form = await request.formData();
    const file = form.get('file');
    if (!file) return NextResponse.json({ ok:false, error:{ title:'Validation', description:'No file provided' } }, { status: 400 });
    const data = await updateUserAvatar({ userId: user.id, file });
    return NextResponse.json({ ok:true, data });
  } catch (e) {
    return NextResponse.json({ ok:false, error:{ title:'Upload failed', description: e.message } }, { status: 400 });
  }
});


