// /app/api/auth/logout/route.ts
import { cookies } from "next/headers";

export async function POST() {
  cookies().delete("auth_token");
  return new Response(null, { status: 200 });
}













