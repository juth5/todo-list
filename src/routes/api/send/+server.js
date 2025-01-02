import sgMail from "@sendgrid/mail";
// SendGrid APIキーを設定
const SENDGRID_API_KEY = "";
sgMail.setApiKey(SENDGRID_API_KEY);

export const POST = async ({ request }) => {
  try {
    const { to, from, subject, text, html } = await request.json();

    // 必須フィールドのチェック
    if (!to || !from || !subject || !text) {
      return new Response(
        JSON.stringify({ error: "Missing required fields." }),
        { status: 400 }
      );
    }

    // メール送信
    const msg = {
      to,
      from,
      subject,
      text,
      html,
    };

    await sgMail.send(msg);

    return new Response(JSON.stringify({ message: "Email sent successfully!" }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(JSON.stringify({ error: "Failed to send email." }), {
      status: 500,
    });
  }
};
