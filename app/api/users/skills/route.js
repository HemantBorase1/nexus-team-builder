import { parseJson, success, failure } from "@/src/lib/api/utils";
import { withAuth } from "@/src/lib/api/authMiddleware";
import { getUserSkills, updateUserSkills } from "@/src/lib/services";

export const GET = withAuth(async (_req, { user }) => {
  const res = await getUserSkills({ userId: user.id });
  return res.ok ? success(res.data) : failure(res.error, 400);
});

export const PUT = withAuth(async (request, { user }) => {
  const body = await parseJson(request);
  const res = await updateUserSkills({ userId: user.id, skills: body?.skills || [] });
  return res.ok ? success(true) : failure(res.error, 400);
});


