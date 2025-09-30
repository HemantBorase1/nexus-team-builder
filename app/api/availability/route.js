import { requireAuth, parseJson, success, failure } from "@/src/lib/api/utils";
import { getUserAvailability, setUserAvailability } from "@/src/lib/services";

export async function GET() {
  const auth = await requireAuth();
  if (!auth.ok) return auth.response;
  const res = await getUserAvailability({ userId: auth.user.id });
  return res.ok ? success(res.data) : failure(res.error, 400);
}

export async function PUT(request) {
  const auth = await requireAuth();
  if (!auth.ok) return auth.response;
  const body = await parseJson(request);
  const res = await setUserAvailability({ userId: auth.user.id, slots: body?.slots || [] });
  return res.ok ? success(true) : failure(res.error, 400);
}


