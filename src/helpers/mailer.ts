import nodemailer from "nodemailer";
import User from "@/models/userModel";
import bcryptjs from "bcryptjs";

export const sendEmail = async ({ email, emailType, userID }: any) => {
  try {
    // create a hashed token
    const hashedToken = await bcryptjs.hash(userID.toString(), 10);

    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userID, {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 3600000,
      });
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userID, {
        forgotPasswordToken: hashedToken,
        forgotTokenExpiry: Date.now() + 3600000,
      });
    }

    //Paste Mail Trap InfoHere
    var transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.MTRAP_USER?.toString(),
        pass: process.env.MTRAP_PASS?.toString(),
      },
    });

    const mailOptions = {
      from: "TaskHero@gmail.com",
      to: email,
      subject:
        emailType === "VERIFY" ? "Verify your email" : "Reset your password",
      html: `<p>Click 
            <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">
            here</a> to 
            ${emailType === "VERIFY" ? "verify your email" : "reset your password"} 
            or copy and paste the link below into your browswer. 
            <br> ${process.env.DOMAIN}/verifyemail?token=${hashedToken}</p>`,
    };

    const mailResponse = await transport.sendMail(mailOptions);

    return mailResponse;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
