import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isAllowedEmail } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const { origin, searchParams } = request.nextUrl;
  const code = searchParams.get("code");
  const supabase = await createClient();

  if (code) {
    const { data } = await supabase.auth.exchangeCodeForSession(code);

    if (data.user && !isAllowedEmail(data.user.email)) {
      await supabase.auth.signOut();
      return NextResponse.redirect(`${origin}/login?error=domain`);
    }
    if (data.user) return NextResponse.redirect(origin);
  }
  return NextResponse.redirect(`${origin}/login?error=auth`);
}
