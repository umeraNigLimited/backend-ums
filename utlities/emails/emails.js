import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "umera.ng",
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: "admin@umera.ng",
    pass: process.env.NEWPASS,
    tls: {
      rejectUnauthorized: false,
    },
  },
  pool: true, // Enable connection pooling
  maxConnections: 5, // Maximum number of connections to maintain
  maxMessages: 100, // Maximum number of messages per connection
  connectionTimeout: 60000, // Increase timeout
  socketTimeout: 60000,
  idleTimeout: 60000,
});

export const idEmail = async (id, name, email) => {
  console.log(id);
  console.log(name);
  console.log(email);
  const mailOptions = {
    from: "noreply@umera.ng",
    to: email,
    subject: `Your Staff ID Has Been Generated`,
    html: `
    <div style="height: 100%; text-align: center; font-family: Arial, sans-serif; padding: 20px;">
      <h1 style="color: #333;">Dear ${name}</h1>
      <p style="text-align: center; font-size: 16px; color: #555;">
        We are pleased to inform you that your staff ID has been successfully generated. <br />
        You can now use it to log in and for all official purposes.
      </p>

      <div style="height: 20px; text-align: center; margin: 20px 0;">
        <span style="height: 50px; padding: 20px; color: white; background-color: #890709; display: inline-block;">
          <h2 style="margin: 0; font-size: 24px;">${id}</h2>
        </span>
      </div>

      <p style="text-align: center; font-size: 18px; color: #333;">Welcome to UMéRA</p>
      
      <hr style="border: 1px solid #ccc; width: 80%; margin: 20px auto;" />

      <p style="font-size: 14px; color: #555; text-align: center;">Follow us on:</p>
      <p style="text-align: center;">
        <a href="https://www.facebook.com/umerafarms" target="_blank" style="color: #3b5998; text-decoration: none;">Facebook</a> | 
        <a href="https://www.instagram.com/umera.ng" target="_blank" style="color: #e4405f; text-decoration: none;">Instagram</a>
      </p>
      
      <p style="font-size: 12px; color: #999; text-align: center;">
        UMéRA Nigeria Limited &copy; ${new Date().getFullYear()}. All rights reserved.
      </p>
    </div>
  `,
  };

  // <img src='cid:unique@umera.ng' width='100%'/>

  await transporter.sendMail(mailOptions);
};

export const handleResetPassword = async (token, email) => {
  const mailOptions = {
    from: "noreply@umera.ng",
    to: email,
    subject: `UMéRA Staff`,
    html: `
    <div style="height: 100%; text-align: center; font-family: Arial, sans-serif; padding: 20px;">
      <h1 style="color: #333;">Hello ${email},</h1>
      <p style="text-align: center; font-size: 16px; color: #555;">
        We received a request to reset your password. Click the link below to reset it:
      </p>

      <div style="text-align: center; margin: 20px 0;">
        <a href="${token}" style="background-color: #890709; color: white; padding: 15px 25px; font-size: 16px; text-decoration: none; border-radius: 5px;">
          Reset Your Password
        </a>
      </div>

      <p style="text-align: center; font-size: 14px; color: #555;">
        If you didn't request this, you can ignore this email.
      </p>

      <p style="text-align: center; font-size: 14px; color: #555;">
        For security purposes, this link will expire in 24 hours.
      </p>

      <hr style="border: 1px solid #ccc; width: 80%; margin: 20px auto;" />

      <p style="font-size: 14px; color: #555; text-align: center;">Follow us on:</p>
      <p style="text-align: center;">
        <a href="https://www.facebook.com/umerafarms" target="_blank" style="color: #3b5998; text-decoration: none;">Facebook</a> | 
        <a href="https://www.instagram.com/umera.ng" target="_blank" style="color: #e4405f; text-decoration: none;">Instagram</a>
      </p>
      
      <p style="font-size: 12px; color: #999; text-align: center;">
        UMéRA Nigeria Limited &copy; ${new Date().getFullYear()}. All rights reserved.
      </p>
    </div>
  `,
  };
  console.log(email);
  console.log("The Email don go");
  await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Message sent:", info.messageId);
      console.log("Preview URL:", nodemailer.getTestMessageUrl(info)); // Useful for testing with Ethereal
      console.log("Accepted:", info.accepted); // Array of recipients that accepted the email
      console.log("Rejected:", info.rejected); // Array of recipients that rejected the email
      console.log("Pending:", info.pending); // Array of recipients where delivery is pending
    }
  });
};

export const emailToDirectors = async (report) => {
  const mailOptions = {
    from: "admin@umera.ng",
    to: "yemisi@umera.ng",
    subject: `Report of ${report.name}`,
    html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Weekly Staff Report</title>
    </head>
    <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f9; color: #333;">
      <div style="max-width: 600px; margin: 20px auto; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
        <div style="background: #890709; color: #fff; padding: 30px; text-align: center; border-bottom: 2px solid #fff;">
          <h1 style="margin: 0; font-size: 28px;">Weekly Staff Report</h1>
        </div>
        <div style="padding: 20px; line-height: 1.6;">
          <p>Dear Directors,</p>
          <p>Please find below the latest report submitted by <strong>${
            report.name
          }</strong>.</p>
          <div style="background: #f9f9f9; padding: 20px; margin: 20px 0; border-left: 5px solid #890709; border-radius: 5px;>
            <p style="margin: 8px 0; font-size: 14px; color: #555;"><strong style="color: #890709;">SUBMITTED ON:</strong></p>
            <pre style="margin: 8px 0; font-size: 14px; color: #555;">${
              report.sent_at
            }</pre>
            <p style="margin: 8px 0; font-size: 14px; color: #555;"><strong style="color: #890709;">TASKS OVERVIEW:</strong></p>
            <pre style="margin: 8px 0; font-size: 14px; color: #555;">${
              report.content
            }</pre>
            <p style="margin: 8px 0; font-size: 14px; color: #555;"><strong style="color: #890709;">CHALLENGES:</strong></p>
            <pre style="margin: 8px 0; font-size: 14px; color: #555;">${
              report.chalenge
            }</pre>
            <p style="margin: 8px 0; font-size: 14px; color: #555;"><strong style="color: #890709;">WORK IN PROGRESS:</strong></p>
            <pre style="margin: 8px 0; font-size: 14px; color: #555;">${
              report.workinprogress
            }</pre>
            <p style="margin: 8px 0; font-size: 14px; color: #555;"><strong style="color: #890709;">OBJECTIVES/INNOVATIONS:</strong></p>
            <pre style="margin: 8px 0; font-size: 14px; color: #555;">${
              report.objectives
            }</pre>
            <p style="margin: 8px 0; font-size: 14px; color: #555;"><strong style="color: #890709;">RECOMMENDATIONS:</strong></p>
            <pre style="margin: 8px 0; font-size: 14px; color: #555;">${
              report.recommendations
            }</pre>
            <p style="margin: 8px 0; font-size: 14px; color: #555;"><strong style="color: #890709;">OFFICIAL REQUESTS:</strong></p>
            <pre style="margin: 8px 0; font-size: 14px; color: #555;">${
              report.request
            }</pre>
            <p style="margin: 8px 0; font-size: 14px; color: #555;"><strong style="color: #890709;">GADGETS IN USE:</strong></p>
            <pre style="margin: 8px 0; font-size: 14px; color: #555;">${
              report.gadget
            }</pre>
          </div>
        </div>
        <div style="background: #333; color: #fff; text-align: center; padding: 15px; font-size: 14px;">
          <p>&copy; ${new Date().getFullYear()} UMéRA NG. All Rights Reserved.</p>
          <p><a href="mailto:support@yourcompany.com" style="color: #890709; text-decoration: none;">Contact Support</a></p>
        </div>
      </div>
    </body>
    </html>
  `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Message sent:", info.messageId);
      console.log("Preview URL:", nodemailer.getTestMessageUrl(info)); // Useful for testing with Ethereal
      console.log("Accepted:", info.accepted); // Array of recipients that accepted the email
      console.log("Rejected:", info.rejected); // Array of recipients that rejected the email
      console.log("Pending:", info.pending); // Array of recipients where delivery is pending
    }
  });
};
