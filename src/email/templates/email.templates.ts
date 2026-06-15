export function otpEmailHtml(otp: string, expiryMinutes: number): string {
  return `
    <h2>Verify your email</h2>
    <p>Thanks for signing up for MamaVoice. Use the code below to verify your email address:</p>
    <p style="font-size: 24px; font-weight: bold; letter-spacing: 4px;">${otp}</p>
    <p>This code expires in ${expiryMinutes} minutes.</p>
    <p>If you did not create an account, you can ignore this email.</p>
  `;
}

export function passwordResetEmailHtml(resetUrl: string): string {
  return `
    <h2>Reset your password</h2>
    <p>We received a request to reset your MamaVoice password.</p>
    <p><a href="${resetUrl}">Reset password</a></p>
    <p>This link expires in 15 minutes.</p>
    <p>If you did not request this, you can ignore this email.</p>
  `;
}

export function securityAlertEmailHtml(context: {
  flags: string[];
  ipAddress: string;
  country: string | null;
  city: string | null;
  loggedInAt: Date;
}): string {
  const location = [context.city, context.country].filter(Boolean).join(', ') || 'Unknown';
  const flags = context.flags.join(', ');

  return `
    <h2>Unusual login activity detected</h2>
    <p>We noticed a sign-in to your MamaVoice account that looks unusual.</p>
    <ul>
      <li><strong>Time:</strong> ${context.loggedInAt.toISOString()}</li>
      <li><strong>IP address:</strong> ${context.ipAddress}</li>
      <li><strong>Location:</strong> ${location}</li>
      <li><strong>Flags:</strong> ${flags}</li>
    </ul>
    <p>If this was you, no action is needed. If not, please reset your password immediately.</p>
  `;
}
