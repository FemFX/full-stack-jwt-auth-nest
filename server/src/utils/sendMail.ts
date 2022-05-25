import * as nodemailer from "nodemailer";
export const sendActivationLink = async (to: string, link: string) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: "axel.luettgen3@ethereal.email",
      pass: "fSdf7KuSmDfZjccRkU",
    },
  });
  await transporter.sendMail({
    from: "axel.luettgen3@ethereal.email",
    to,
    subject: "Email Activation",
    text: "",
    html: `
        <div>
          <a href="${link}">${link}</a>
        </div>
      `,
  });
};
