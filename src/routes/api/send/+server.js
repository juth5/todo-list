import sgMail from "@sendgrid/mail";
// SendGrid APIキーを設定
const SENDGRID_API_KEY = "";
sgMail.setApiKey(SENDGRID_API_KEY);

export const POST = async ({ request }) => {
  try {
    const { to, from, subject, text, html, ownerUid } = await request.json();

    // 必須フィールドのチェック
    if (!to || !from || !subject || !text || !ownerUid) {
      return new Response(
        JSON.stringify({ error: "Missing required fields." }),
        { status: 400 }
      );
    }

    //const inviteLink = `http://localhost:5173/invite?inviterId=${inviterId}&inviteeEmail=${encodeURIComponent(to)}`;
    const inviteLink = `http://localhost:5173/invite?inviterId=${ownerUid}&inviteeEmail=${encodeURIComponent(to)}`;


    // メール送信
    const msg = {
      to,
      from,
      subject,
      text: `You have been invited. Please accept the invitation by clicking this link: ${inviteLink}`,
      html: `<p>You have been invited. Please accept the invitation by clicking this link:</p><a href="${inviteLink}">${inviteLink}</a>`,
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
