import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { emailVerificationTokens } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const token = request.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(
      new URL("/login?verified=error", request.nextUrl.origin)
    );
  }

  try {
    const [record] = await db
      .select()
      .from(emailVerificationTokens)
      .where(eq(emailVerificationTokens.token, token))
      .limit(1);

    if (!record) {
      return NextResponse.redirect(
        new URL("/login?verified=error", request.nextUrl.origin)
      );
    }

    // Already verified
    if (record.verifiedAt !== null) {
      return NextResponse.redirect(
        new URL("/login?verified=error", request.nextUrl.origin)
      );
    }

    // Expired
    if (record.expiresAt < new Date()) {
      return NextResponse.redirect(
        new URL("/login?verified=error", request.nextUrl.origin)
      );
    }

    // Mark as verified
    await db
      .update(emailVerificationTokens)
      .set({ verifiedAt: new Date() })
      .where(eq(emailVerificationTokens.token, token));

    return NextResponse.redirect(
      new URL("/dashboard?verified=1", request.nextUrl.origin)
    );
  } catch {
    return NextResponse.redirect(
      new URL("/login?verified=error", request.nextUrl.origin)
    );
  }
}
