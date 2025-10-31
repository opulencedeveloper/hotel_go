import nodemailer from "nodemailer";

import { IForgotPasswordEmail, IOTP, ISendEmail, IVerificationEmail } from "./interface";
import { IForgotPassword } from "../auth/interface";

const emailHost = process.env.EMAILHOST || "";
const emailSender = process.env.EMAILSENDER;
const emailSenderPassword = process.env.EMAILSENDERPASSWORD;
const emailFrom = process.env.EMAILFROM;
const adminEmail = process.env.ADMIN_EMAIL || "";
const companyName = process.env.COMPANY_NAME || "";
  const baseUrl = process.env.FRONTEND_URL || "";



// export const sendEmail = async (input: ISendEmail) => {
//   const { receiverEmail, subject, emailTemplate } = input;

//   var transport = nodemailer.createTransport({
//       host: emailHost,
//       port: 587,
//       auth: {
//       user: emailSender,
//       pass: emailSenderPassword
//       }
//   });
  
//   var mailOptions = {
//       from: `Exquisite Investment <${emailFrom}>`,
//       to: receiverEmail,
//       subject,
//       html: emailTemplate ,
//   };
  
//   transport.sendMail(mailOptions, (error: any, info:any) => {
//       if (error) {
//       return console.log(error);
//       }
//       console.log('Successfully sent');
//   });
// };


export const sendEmail = async (input: ISendEmail) => {
  const { receiverEmail, subject, emailTemplate } = input;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: emailSender,
      pass: emailSenderPassword,
    },
  });

  const mailOptions = {
    from: `${process.env.COMPANY_NAME || "Your Company"} <${process.env.EMAILSENDER}>`,
    to: receiverEmail,
    subject,
    html: emailTemplate,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${receiverEmail}`);
  } catch (error) {
    console.error(`Failed to send email to ${receiverEmail}:`, error);
  }
};



export const sendEmailVerificationMail = async (input: IVerificationEmail) => {
  const { email, firstName, otp, expiryTime } = input;


  const verificationLink = `${baseUrl}/email-verified?email=${encodeURIComponent(
    email
  )}&token=${encodeURIComponent(otp)}`;

  return sendEmail({
    receiverEmail: email,
    subject: "Welcome to HotelGo - Verify Your Email",
    emailTemplate: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      margin: 0;
      padding: 20px;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 20px 40px rgba(0,0,0,0.1);
    }
    .email-header {
      background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
      padding: 30px 20px;
      text-align: center;
      position: relative;
    }
    .email-header::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="hotel" patternUnits="userSpaceOnUse" width="20" height="20"><path d="M10 2L18 8L10 14L2 8Z" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23hotel)"/></svg>');
      opacity: 0.1;
    }
    .hotel-icon {
      width: 60px;
      height: 60px;
      background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
      border-radius: 12px;
      margin: 0 auto 15px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      color: white;
      position: relative;
      z-index: 1;
    }
    .email-header h1 {
      color: #ffffff;
      margin: 0;
      font-size: 28px;
      font-weight: 700;
      position: relative;
      z-index: 1;
    }
    .email-header p {
      color: #e2e8f0;
      margin: 5px 0 0;
      font-size: 14px;
      position: relative;
      z-index: 1;
    }
    .email-content {
      padding: 40px 30px;
    }
    .email-content h2 {
      color: #1e293b;
      font-size: 24px;
      margin: 0 0 20px;
      font-weight: 600;
    }
    .email-content p {
      color: #64748b;
      line-height: 1.6;
      margin: 0 0 20px;
      font-size: 16px;
    }
    .verification-section {
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
      border-radius: 12px;
      padding: 25px;
      margin: 25px 0;
      text-align: center;
      border: 1px solid #e2e8f0;
    }
    .verification-code {
      display: inline-block;
      padding: 15px 30px;
      margin: 15px 0;
      background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
      color: #ffffff;
      font-weight: 700;
      font-size: 24px;
      border-radius: 8px;
      letter-spacing: 3px;
      box-shadow: 0 4px 12px rgba(251, 191, 36, 0.3);
    }
    .verify-button {
      display: inline-block;
      padding: 15px 35px;
      background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
      color: #ffffff;
      text-decoration: none;
      font-weight: 600;
      border-radius: 8px;
      margin: 20px 0;
      font-size: 16px;
      transition: all 0.3s ease;
      box-shadow: 0 4px 12px rgba(30, 60, 114, 0.3);
    }
    .verify-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(30, 60, 114, 0.4);
    }
    .security-note {
      background: #fef3c7;
      border-left: 4px solid #f59e0b;
      padding: 15px;
      margin: 20px 0;
      border-radius: 0 8px 8px 0;
    }
    .security-note p {
      color: #92400e;
      margin: 0;
      font-size: 14px;
    }
    .email-footer {
      background: #f8fafc;
      text-align: center;
      padding: 25px;
      border-top: 1px solid #e2e8f0;
    }
    .email-footer p {
      color: #64748b;
      font-size: 12px;
      margin: 5px 0;
    }
    .social-links {
      margin: 15px 0;
    }
    .social-links a {
      display: inline-block;
      margin: 0 10px;
      color: #64748b;
      text-decoration: none;
      font-size: 14px;
    }
    .copy-link-section {
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid #e2e8f0;
    }
    .link-text {
      background-color: #f8fafc;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 12px;
      font-family: 'Courier New', monospace;
      font-size: 12px;
      color: #475569;
      word-break: break-all;
      user-select: all;
      margin-top: 10px;
    }
    .otp-display {
      background: #f8fafc;
      border: 2px dashed #cbd5e1;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
      text-align: center;
    }
    .otp-label {
      color: #64748b;
      font-size: 14px;
      margin-bottom: 10px;
      font-weight: 600;
    }
    .otp-code {
      font-size: 32px;
      font-weight: 700;
      color: #f59e0b;
      letter-spacing: 5px;
      font-family: 'Courier New', monospace;
      background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
      display: inline-block;
      padding: 15px 25px;
      border: 2px solid #fbbf24;
      border-radius: 8px;
      margin: 10px 0;
      box-shadow: 0 2px 8px rgba(251, 191, 36, 0.2);
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      <div class="hotel-icon">🏨</div>
      <h1>HotelGo</h1>
      <p>Professional Hotel Management System</p>
    </div>
    <div class="email-content">
      <h2>Welcome to HotelGo, ${firstName}!</h2>
      <p>Thank you for choosing HotelGo as your hotel management solution. We're excited to help you streamline your hotel operations and enhance guest experiences.</p>
      
      <div class="verification-section">
        <p><strong>Please verify your email address to complete your registration:</strong></p>
        
        <div class="otp-display">
          <p class="otp-label">Your 6-digit verification code:</p>
          <div class="otp-code">${otp}</div>
          <p style="margin-top: 15px; color: #64748b; font-size: 12px;">Enter this code on the verification page or click the button below</p>
        </div>
       
        <p style="margin: 15px 0; color: #64748b; font-size: 14px;">Click the button below to verify automatically:</p>
        <a href="${verificationLink}" class="verify-button">Verify Email Address</a>
        
        <div class="copy-link-section">
          <p style="margin: 20px 0 10px; color: #64748b; font-size: 14px; font-weight: 600;">If the button doesn't work, copy and paste this link on your browser:</p>
          <div class="link-text">${verificationLink}</div>
        </div>
      </div>

      <div class="security-note">
        <p><strong>Security Note:</strong> This verification code will expire in ${expiryTime}. If you didn't create an account with HotelGo, please ignore this email.</p>
      </div>

      <p>Once verified, you'll have access to:</p>
      <ul style="color: #64748b; line-height: 1.8;">
        <li>Complete guest management system</li>
        <li>Real-time reservation tracking</li>
        <li>Staff coordination tools</li>
        <li>Business analytics dashboard</li>
        <li>24/7 customer support</li>
      </ul>
    </div>
    <div class="email-footer">
      <p>&copy; ${new Date().getFullYear()} HotelGo. All rights reserved.</p>
      <p>Professional Hotel Management Solutions</p>
      <div class="social-links">
        <a href="#">Support</a> | <a href="#">Documentation</a> | <a href="#">Privacy Policy</a>
      </div>
    </div>
  </div>
</body>
</html>`,
  });
};



export const sendForgotPasswordEmail = async (input: IForgotPasswordEmail) => {
  const email = input.email;
  const otp = input.otp;
  const userName = input.firstName;
  const expiryTime = input.expiryTime;
  const verificationLink = `${baseUrl}/reset-password?otp=${otp}&email=${email}`;
  return sendEmail({
    receiverEmail: email,
    subject: "HotelGo - Password Reset Request",
    emailTemplate: `<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      margin: 0;
      padding: 20px;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 20px 40px rgba(0,0,0,0.1);
    }
    .email-header {
      background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%);
      padding: 30px 20px;
      text-align: center;
      position: relative;
    }
    .email-header::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="security" patternUnits="userSpaceOnUse" width="20" height="20"><path d="M10 2L18 8L10 14L2 8Z" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23security)"/></svg>');
      opacity: 0.1;
    }
    .security-icon {
      width: 60px;
      height: 60px;
      background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
      border-radius: 12px;
      margin: 0 auto 15px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      color: white;
      position: relative;
      z-index: 1;
    }
    .email-header h1 {
      color: #ffffff;
      margin: 0;
      font-size: 28px;
      font-weight: 700;
      position: relative;
      z-index: 1;
    }
    .email-header p {
      color: #fecaca;
      margin: 5px 0 0;
      font-size: 14px;
      position: relative;
      z-index: 1;
    }
    .email-content {
      padding: 40px 30px;
    }
    .email-content h2 {
      color: #1e293b;
      font-size: 24px;
      margin: 0 0 20px;
      font-weight: 600;
    }
    .email-content p {
      color: #64748b;
      line-height: 1.6;
      margin: 0 0 20px;
      font-size: 16px;
    }
    .reset-section {
      background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
      border-radius: 12px;
      padding: 25px;
      margin: 25px 0;
      text-align: center;
      border: 1px solid #fecaca;
    }
    .reset-button {
      display: inline-block;
      padding: 15px 35px;
      background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%);
      color: #ffffff;
      text-decoration: none;
      font-weight: 600;
      border-radius: 8px;
      margin: 20px 0;
      font-size: 16px;
      transition: all 0.3s ease;
      box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
    }
    .reset-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(220, 38, 38, 0.4);
    }
    .security-note {
      background: #fef3c7;
      border-left: 4px solid #f59e0b;
      padding: 15px;
      margin: 20px 0;
      border-radius: 0 8px 8px 0;
    }
    .security-note p {
      color: #92400e;
      margin: 0;
      font-size: 14px;
    }
    .warning-note {
      background: #fef2f2;
      border-left: 4px solid #ef4444;
      padding: 15px;
      margin: 20px 0;
      border-radius: 0 8px 8px 0;
    }
    .warning-note p {
      color: #dc2626;
      margin: 0;
      font-size: 14px;
    }
    .email-footer {
      background: #f8fafc;
      text-align: center;
      padding: 25px;
      border-top: 1px solid #e2e8f0;
    }
    .email-footer p {
      color: #64748b;
      font-size: 12px;
      margin: 5px 0;
    }
    .social-links {
      margin: 15px 0;
    }
    .social-links a {
      display: inline-block;
      margin: 0 10px;
      color: #64748b;
      text-decoration: none;
      font-size: 14px;
    }
    .otp-display {
      background: #f8fafc;
      border: 2px dashed #cbd5e1;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
      text-align: center;
    }
    .otp-code {
      font-size: 24px;
      font-weight: 700;
      color: #1e293b;
      letter-spacing: 3px;
      font-family: 'Courier New', monospace;
    }
    .copy-link-section {
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid #e2e8f0;
    }
    .link-text {
      background-color: #f8fafc;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 12px;
      font-family: 'Courier New', monospace;
      font-size: 12px;
      color: #475569;
      word-break: break-all;
      user-select: all;
      margin-top: 10px;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      <div class="security-icon">🔐</div>
      <h1>HotelGo</h1>
      <p>Password Reset Request</p>
    </div>
    <div class="email-content">
      <h2>Hello, ${userName}!</h2>
      <p>We received a request to reset your password for your HotelGo account. This is a secure process to help you regain access to your hotel management dashboard.</p>
      
      <div class="reset-section">
        <p><strong>Click the button below to reset your password:</strong></p>
        <a href="${verificationLink}" class="reset-button">Reset My Password</a>
        
        <div class="copy-link-section">
          <p style="margin: 20px 0 10px; color: #64748b; font-size: 14px; font-weight: 600;">If the button doesn't work, copy and paste this link on your browser:</p>
          <div class="link-text">${verificationLink}</div>
        </div>
        
      
      </div>

      <div class="security-note">
        <p><strong>Security Information:</strong> This password reset link will expire in ${expiryTime}. For your security, please complete the password reset process as soon as possible.</p>
      </div>

      <div class="warning-note">
        <p><strong>Important:</strong> If you did not request this password reset, please ignore this email. Your account remains secure and no changes have been made.</p>
      </div>

      <p>For additional security, we recommend:</p>
      <ul style="color: #64748b; line-height: 1.8;">
        <li>Using a strong, unique password</li>
        <li>Enabling two-factor authentication</li>
        <li>Regularly updating your password</li>
        <li>Contacting support if you have concerns</li>
      </ul>
    </div>
    <div class="email-footer">
      <p>&copy; ${new Date().getFullYear()} HotelGo. All rights reserved.</p>
      <p>Professional Hotel Management Solutions</p>
      <div class="social-links">
        <a href="#">Support</a> | <a href="#">Security Center</a> | <a href="#">Privacy Policy</a>
      </div>
    </div>
  </div>
</body>
</html>`,
  });
};