exports.contactUsEmail = (
  email,
  firstname,
  lastname,
  message,
  phoneNo,
  countrycode
) => {
  return `<!DOCTYPE html>
  <html>
  <head>
      <meta charset="UTF-8">
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Contact Form Confirmation</title>
      <style>
          body {
              background-color: #f8f8f8;
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
          }
          .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              border-radius: 10px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .header {
              background: #111827;
              padding: 30px 20px;
              text-align: center;
              border-radius: 10px 10px 0 0;
          }
          .logo {
              max-width: 180px;
              height: auto;
              margin-bottom: 15px;
          }
          .content {
              padding: 30px;
              text-align: left;
          }
          .message {
              font-size: 24px;
              font-weight: bold;
              color: #111827;
              margin-bottom: 20px;
              text-align: center;
          }
          .details {
              background: #f8f8f8;
              padding: 20px;
              border-radius: 5px;
              margin: 20px 0;
          }
          .details p {
              margin: 10px 0;
              color: #424854;
          }
          .highlight {
              color: #111827;
              font-weight: 600;
          }
          .support {
              text-align: center;
              margin-top: 30px;
              padding: 20px;
              background: #f8f8f8;
              border-radius: 0 0 10px 10px;
              color: #666;
              font-size: 14px;
          }
          .support a {
              color: #111827;
              text-decoration: none;
              font-weight: 600;
          }
          .support a:hover {
              text-decoration: underline;
          }
          .brand-name {
              color: #FFD60A;
              font-size: 28px;
              font-weight: 700;
              margin: 10px 0;
              text-transform: uppercase;
              letter-spacing: 1px;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">
              <img class="logo" src="https://res.cloudinary.com/dtspyzore/image/upload/v1755887160/logo.png" alt="Padho India Logo">
              <div class="brand-name">Padho India</div>
          </div>
          <div class="content">
              <div class="message">Contact Form Confirmation</div>
              <p>Dear ${firstname} ${lastname},</p>
              <p>Thank you for reaching out to us. We have received your message and will get back to you shortly.</p>
              
              <div class="details">
                  <p><span class="highlight">Name:</span> ${firstname} ${lastname}</p>
                  <p><span class="highlight">Email:</span> ${email}</p>
                  <p><span class="highlight">Phone Number:</span> ${countrycode} ${phoneNo}</p>
                  <p><span class="highlight">Message:</span> ${message}</p>
              </div>
              
              <p>We value your interest in Padho India and will respond to your inquiry as soon as possible.</p>
          </div>
          
          <div class="support">
              <p>Need immediate assistance?</p>
              <p>Contact us at <a href="mailto:padhloindia@gmail.com">padhloindia@gmail.com</a></p>
              <p>© ${new Date().getFullYear()} Padho India. All rights reserved.</p>
          </div>
      </div>
  </body>
  </html>`
};