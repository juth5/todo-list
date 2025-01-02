import sgMail from "@sendgrid/mail";
sgMail.setApiKey("");

export const sendEmail = async () => {
  const msg = {
    to: "takashiee893@yahoo.co.jp", // 受信者のメールアドレス
    from: "fukagawatakashiee893@gmail.com",  // 送信者のメールアドレス
    subject: "Test Email",
    text: "This is a test email sent using SendGrid.",
    html: "<strong>This is a test email sent using SendGrid.</strong>",
  };

  try {
    await sgMail.send(msg);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};