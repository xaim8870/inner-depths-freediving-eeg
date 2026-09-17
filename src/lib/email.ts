import "server-only";

type EmailMessage = {
  to: string;
  subject: string;
  text: string;
  html: string;
};

type BrevoResponse = {
  messageId?: unknown;
  message?: unknown;
};

function sanitizeProviderMessage(message: unknown) {
  if (typeof message !== "string") {
    return "No provider message returned";
  }

  return (
    message
      .replace(/https?:\/\/\S+/gi, "[redacted-url]")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 200) || "No provider message returned"
  );
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function emailHtml({ heading, message, actionLabel, actionUrl, note }: {
  heading: string;
  message: string;
  actionLabel: string;
  actionUrl: string;
  note: string;
}) {
  const safeUrl = escapeHtml(actionUrl);
  return `<!doctype html>
<html lang="en">
  <body style="margin:0;background:#f3f8f7;color:#173d4c;font-family:Arial,sans-serif">
    <div style="max-width:560px;margin:0 auto;padding:40px 20px">
      <div style="background:#fff;border:1px solid #d8e8e4;border-radius:20px;padding:32px">
        <div style="font-size:18px;font-weight:700;letter-spacing:.04em">Inner Depths</div>
        <h1 style="margin:28px 0 12px;font-size:26px;font-weight:500">${escapeHtml(heading)}</h1>
        <p style="margin:0 0 24px;color:#58727a;line-height:1.6">${escapeHtml(message)}</p>
        <a href="${safeUrl}" style="display:inline-block;border-radius:999px;background:#176b82;color:#fff;padding:12px 20px;text-decoration:none;font-weight:700">${escapeHtml(actionLabel)}</a>
        <p style="margin:24px 0 0;color:#789097;font-size:13px;line-height:1.5">${escapeHtml(note)}</p>
      </div>
    </div>
  </body>
</html>`;
}

async function sendEmail(message: EmailMessage) {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL;
  const senderName = process.env.BREVO_SENDER_NAME;

  if (!apiKey || !senderEmail || !senderName) {
    throw new Error("Transactional email is not configured");
  }

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      accept: "application/json",
      "api-key": apiKey,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      sender: {
        name: senderName,
        email: senderEmail,
      },
      to: [{ email: message.to }],
      subject: message.subject,
      htmlContent: message.html,
      textContent: message.text,
    }),
  });

  const result = (await response.json().catch(() => null)) as BrevoResponse | null;

  if (response.status !== 201 || typeof result?.messageId !== "string") {
    console.error("Brevo transactional email request failed", {
      status: response.status,
      message: sanitizeProviderMessage(result?.message),
    });

    throw new Error("Transactional email delivery failed");
  }
}

export async function sendVerificationEmail({
  to,
  verificationUrl,
}: {
  to: string;
  verificationUrl: string;
}) {
  await sendEmail({
    to,
    subject: "Verify your Inner Depths email",
    text: `Verify your email to finish setting up Inner Depths: ${verificationUrl}\n\nThis link expires in one hour. If you did not create this account, you can ignore this email.`,
    html: emailHtml({
      heading: "Verify your email",
      message: "Confirm your email address to finish setting up your Inner Depths account.",
      actionLabel: "Verify email",
      actionUrl: verificationUrl,
      note: "This link expires in one hour. If you did not create this account, you can ignore this email.",
    }),
  });
}

export async function sendPasswordResetEmail({
  to,
  resetUrl,
}: {
  to: string;
  resetUrl: string;
}) {
  await sendEmail({
    to,
    subject: "Reset your Inner Depths password",
    text: `Reset your Inner Depths password: ${resetUrl}\n\nThis link expires in one hour. If you did not request a password reset, ignore this email and your password will remain unchanged.`,
    html: emailHtml({
      heading: "Reset your password",
      message: "Use the secure link below to choose a new Inner Depths password.",
      actionLabel: "Reset password",
      actionUrl: resetUrl,
      note: "This link expires in one hour. If you did not request this reset, ignore this email and your password will remain unchanged.",
    }),
  });
}
