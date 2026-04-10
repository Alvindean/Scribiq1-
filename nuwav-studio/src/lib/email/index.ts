import { Resend } from "resend";

let _resend: Resend | null = null;

function getResend(): Resend {
  if (!_resend) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not set");
    }
    _resend = new Resend(process.env.RESEND_API_KEY);
  }
  return _resend;
}

const FROM = process.env.EMAIL_FROM ?? "noreply@nuwav.studio";

const baseStyles = `
  body { margin: 0; padding: 0; background-color: #0f0f0f; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
  .wrapper { background-color: #0f0f0f; padding: 48px 24px; }
  .card { background-color: #1a1a1a; border: 1px solid #2a2a2a; border-radius: 12px; max-width: 480px; margin: 0 auto; padding: 40px 36px; }
  .logo { font-size: 20px; font-weight: 700; color: #7c3aed; letter-spacing: -0.5px; margin-bottom: 32px; }
  h1 { margin: 0 0 16px; font-size: 22px; font-weight: 600; color: #ffffff; line-height: 1.3; }
  p { margin: 0 0 24px; font-size: 15px; color: #a1a1aa; line-height: 1.6; }
  .btn { display: inline-block; background-color: #7c3aed; color: #ffffff !important; text-decoration: none; font-size: 15px; font-weight: 600; padding: 13px 28px; border-radius: 8px; }
  .btn:hover { background-color: #6d28d9; }
  .expiry { font-size: 13px; color: #52525b; margin-top: 28px; margin-bottom: 0; }
  .divider { border: none; border-top: 1px solid #2a2a2a; margin: 28px 0; }
  .footer { font-size: 12px; color: #3f3f46; text-align: center; margin-top: 32px; }
`.trim();

function htmlShell(content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>${baseStyles}</style>
</head>
<body>
  <div class="wrapper">
    <div class="card">
      <div class="logo">nuwav studio</div>
      ${content}
    </div>
    <p class="footer">© ${new Date().getFullYear()} Nuwav Studio. All rights reserved.</p>
  </div>
</body>
</html>`;
}

export async function sendPasswordResetEmail(
  to: string,
  resetUrl: string
): Promise<void> {
  const html = htmlShell(`
    <h1>Reset your password</h1>
    <p>We received a request to reset the password for your Nuwav Studio account. Click the button below to choose a new password.</p>
    <a href="${resetUrl}" class="btn">Reset Password</a>
    <hr class="divider" />
    <p class="expiry">This link expires in <strong style="color:#a1a1aa">1 hour</strong>. If you did not request a password reset, you can safely ignore this email — your password will not change.</p>
  `);

  const resend = getResend();
  const { error } = await resend.emails.send({
    from: FROM,
    to,
    subject: "Reset your Nuwav Studio password",
    html,
  });

  if (error) {
    throw new Error(`Failed to send password reset email: ${error.message}`);
  }
}

export async function sendVerificationEmail(
  to: string,
  verifyUrl: string
): Promise<void> {
  const html = htmlShell(`
    <h1>Verify your email address</h1>
    <p>Thanks for signing up for Nuwav Studio! Please verify your email address to activate your account and get started.</p>
    <a href="${verifyUrl}" class="btn">Verify Email</a>
    <hr class="divider" />
    <p class="expiry">This link expires in <strong style="color:#a1a1aa">24 hours</strong>. If you did not create a Nuwav Studio account, you can safely ignore this email.</p>
  `);

  const resend = getResend();
  const { error } = await resend.emails.send({
    from: FROM,
    to,
    subject: "Verify your Nuwav Studio email address",
    html,
  });

  if (error) {
    throw new Error(`Failed to send verification email: ${error.message}`);
  }
}
