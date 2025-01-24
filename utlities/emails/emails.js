import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "umera.ng",
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: "noreply@umera.ng",
    pass: process.env.PASS,
  },
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
    from: "noreply@umera.ng",
    to: "yemisi@umera.ng",
    subject: `Report of ${report.name}`,
    html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Weekly Staff Report</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
          background-color: #f4f4f9;
          color: #333;
        }
        .email-container {
          max-width: 600px;
          margin: 20px auto;
          background: #fff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: #890709;
          color: #fff;
          padding: 30px;
          text-align: center;
          border-bottom: 2px solid #fff;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
        }
        .body {
          padding: 20px;
          line-height: 1.6;
        }
        .body p {
          margin: 10px 0;
        }
        .report-section {
          background: #f9f9f9;
          padding: 20px;
          margin: 20px 0;
          border-left: 5px solid #890709;
          border-radius: 5px;
        }
        .report-section p {
          margin: 8px 0;
          font-size: 14px;
          color: #555;
        }
        .report-section strong {
          color: #890709;
        }
        .footer {
          background: #333;
          color: #fff;
          text-align: center;
          padding: 15px;
          font-size: 14px;
        }
        .footer a {
          color: #890709;
          text-decoration: none;
        }
        @media screen and (max-width: 600px) {
          .email-container {
            width: 100% !important;
          }
          .header h1 {
            font-size: 24px;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1>Weekly Staff Report</h1>
        </div>
        <div class="body">
          <p>Dear Directors,</p>
          <p>Please find below the latest report submitted by <strong>${
            report.name
          }</strong>.</p>
          <div class="report-section">
            <p><strong>SUBMITTED ON:</strong></p><p>${report.sent_at}</p>
            <p><strong>TASKS OVERVIEW:</strong></p><p>${report.content}</p>
            <p><strong>CHALENGES:</strong> </p><p>${report.chalenge}</p>
            <p><strong>WORK IN PROGRESS:</strong> </p><p>${
              report.workinprogress
            }</p>
            <p><strong>OBJECTIVES:</strong> </p><p>${report.objectives}</p>
            <p><strong>:</strong> </p><p>${report.recommendations}</p>
            <p><strong>OFFICIAL REQUESTS:</strong></p><p>${report.request}</p>
            <p><strong>GADGETS IN USE:</strong></p><p>${report.gadget}</p>
          </div>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} UMéRA NG. All Rights Reserved.</p>
          <p><a href="mailto:support@yourcompany.com">Contact Support</a></p>
        </div>
      </div>
    </body>
    </html>
  `,
  };

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
