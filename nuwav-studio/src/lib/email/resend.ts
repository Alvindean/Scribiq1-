import { Resend } from "resend";

// Lazily initialise so `next build` can run without RESEND_API_KEY.
let _resend: Resend | null = null;

export function getResend(): Resend {
  if (!_resend) {
    const key = process.env.RESEND_API_KEY;
    if (!key) throw new Error("RESEND_API_KEY environment variable is not set");
    _resend = new Resend(key);
  }
  return _resend;
}

/** @deprecated Use getResend() instead. Kept for backwards compat. */
export const resend: Resend = new Proxy({} as Resend, {
  get(_t, prop) {
    return (getResend() as unknown as Record<string | symbol, unknown>)[prop];
  },
});

export const FROM_EMAIL =
  process.env.FROM_EMAIL ?? "Soniq <onboarding@soniq.app>";
