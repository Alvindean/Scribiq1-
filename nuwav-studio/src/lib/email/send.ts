import { resend, FROM_EMAIL } from "./resend";
import {
  welcomeEmailHtml,
  verificationEmailHtml,
  passwordResetEmailHtml,
  inviteEmailHtml,
} from "./templates";

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://app.nuwavstudio.com";

export async function sendWelcomeEmail(
  to: string,
  name: string
): Promise<void> {
  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: "Welcome to NuWav Studio!",
    html: welcomeEmailHtml(name),
  });

  if (error) {
    throw new Error(`Failed to send welcome email: ${error.message}`);
  }
}

export async function sendVerificationEmail(
  to: string,
  name: string,
  token: string
): Promise<void> {
  const verifyUrl = `${APP_URL}/api/auth/verify-email?token=${token}`;

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: "Verify your NuWav Studio email address",
    html: verificationEmailHtml(name, verifyUrl),
  });

  if (error) {
    throw new Error(`Failed to send verification email: ${error.message}`);
  }
}

export async function sendPasswordResetEmail(
  to: string,
  name: string,
  token: string
): Promise<void> {
  const resetUrl = `${APP_URL}/reset-password?token=${token}`;

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: "Reset your NuWav Studio password",
    html: passwordResetEmailHtml(name, resetUrl),
  });

  if (error) {
    throw new Error(`Failed to send password reset email: ${error.message}`);
  }
}

export async function sendInviteEmail(
  to: string,
  inviterName: string,
  orgName: string,
  inviteUrl: string
): Promise<void> {
  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `You've been invited to join ${orgName} on NuWav Studio`,
    html: inviteEmailHtml(inviterName, orgName, inviteUrl),
  });

  if (error) {
    throw new Error(`Failed to send invite email: ${error.message}`);
  }
}
