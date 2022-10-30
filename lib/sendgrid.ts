import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
export async function sendEmail(msg) {
  try {
    const mail = await sgMail.send(msg);
    console.log("envia email", mail);
  } catch (error) {
    console.error(error);

    if (error.response) {
      console.error(error.response.body);
    }
  }
}
