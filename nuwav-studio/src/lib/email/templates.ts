const baseStyles = `
  body { margin: 0; padding: 0; background-color: #0f0e1a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
  .wrapper { background-color: #0f0e1a; padding: 48px 24px; }
  .card { background-color: #1a1827; border: 1px solid #2d2a40; border-radius: 12px; max-width: 480px; margin: 0 auto; padding: 40px 36px; }
  .logo { font-size: 20px; font-weight: 700; color: #7c3aed; letter-spacing: -0.5px; margin-bottom: 32px; }
  h1 { margin: 0 0 16px; font-size: 22px; font-weight: 600; color: #ffffff; line-height: 1.3; }
  p { margin: 0 0 24px; font-size: 15px; color: #a1a1aa; line-height: 1.6; }
  .btn { display: inline-block; background-color: #7c3aed; color: #ffffff !important; text-decoration: none; font-size: 15px; font-weight: 600; padding: 13px 28px; border-radius: 8px; }
  .btn:hover { background-color: #6d28d9; }
  .expiry { font-size: 13px; color: #52525b; margin-top: 28px; margin-bottom: 0; }
  .divider { border: none; border-top: 1px solid #2d2a40; margin: 28px 0; }
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
      <div class="logo">NuWav Studio</div>
      ${content}
    </div>
    <p class="footer">&copy; ${new Date().getFullYear()} NuWav Studio. All rights reserved.</p>
  </div>
</body>
</html>`;
}

export function welcomeEmailHtml(name: string): string {
  const displayName = name || "there";
  return htmlShell(`
    <h1>Welcome to NuWav Studio, ${displayName}!</h1>
    <p>We&rsquo;re thrilled to have you on board. NuWav Studio is your all-in-one platform for creating, producing, and distributing professional audio and video content.</p>
    <p>Get started by exploring your dashboard &mdash; create your first project, invite collaborators, and bring your creative vision to life.</p>
    <a href="${process.env.NEXT_PUBLIC_APP_URL ?? "https://app.nuwavstudio.com"}/dashboard" class="btn">Go to Dashboard</a>
    <hr class="divider" />
    <p class="expiry">Need help? Reply to this email or visit our <a href="${process.env.NEXT_PUBLIC_APP_URL ?? "https://app.nuwavstudio.com"}/support" style="color:#7c3aed;text-decoration:none;">support center</a>.</p>
  `);
}

export function verificationEmailHtml(name: string, verifyUrl: string): string {
  const displayName = name || "there";
  return htmlShell(`
    <h1>Verify your email address</h1>
    <p>Hi ${displayName}, thanks for signing up for NuWav Studio! Please verify your email address to activate your account and get started.</p>
    <a href="${verifyUrl}" class="btn">Verify Email</a>
    <hr class="divider" />
    <p class="expiry">This link expires in <strong style="color:#a1a1aa">24 hours</strong>. If you did not create a NuWav Studio account, you can safely ignore this email.</p>
  `);
}

export function passwordResetEmailHtml(name: string, resetUrl: string): string {
  const displayName = name || "there";
  return htmlShell(`
    <h1>Reset your password</h1>
    <p>Hi ${displayName}, we received a request to reset the password for your NuWav Studio account. Click the button below to choose a new password.</p>
    <a href="${resetUrl}" class="btn">Reset Password</a>
    <hr class="divider" />
    <p class="expiry">This link expires in <strong style="color:#a1a1aa">1 hour</strong>. If you did not request a password reset, you can safely ignore this email &mdash; your password will not change.</p>
  `);
}

export function inviteEmailHtml(
  inviterName: string,
  orgName: string,
  inviteUrl: string
): string {
  return htmlShell(`
    <h1>You&rsquo;ve been invited to ${orgName}</h1>
    <p><strong style="color:#ffffff">${inviterName}</strong> has invited you to collaborate on <strong style="color:#ffffff">${orgName}</strong> in NuWav Studio.</p>
    <p>Accept the invitation to join the team and start collaborating on projects together.</p>
    <a href="${inviteUrl}" class="btn">Accept Invitation</a>
    <hr class="divider" />
    <p class="expiry">This invitation expires in <strong style="color:#a1a1aa">7 days</strong>. If you were not expecting this invitation, you can safely ignore this email.</p>
  `);
}
