exports.adminNotificationEmail = (
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
      <title>New Contact Form Submission</title>
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
          .brand-name {
              color: #FFD60A;
              font-size: 28px;
              font-weight: 700;
              margin: 10px 0;
              text-transform: uppercase;
              letter-spacing: 1px;
          }
          .content {
              padding: 30px;
          }
          .alert {
              background: #FEF3C7;
              color: #92400E;
              padding: 15px;
              border-radius: 5px;
              margin-bottom: 20px;
              font-weight: 600;
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
          .label {
              color: #111827;
              font-weight: 600;
              min-width: 120px;
              display: inline-block;
          }
          .reply-button {
              display: inline-block;
              background: #111827;
              color: white;
              padding: 12px 25px;
              text-decoration: none;
              border-radius: 5px;
              margin-top: 20px;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">
              <div class="brand-name">Padho India - Admin Alert</div>
          </div>
          <div class="content">
              <div class="alert">New Contact Form Submission Received!</div>
              
              <div class="details">
                  <p><span class="label">Name:</span> ${firstname} ${lastname}</p>
                  <p><span class="label">Email:</span> ${email}</p>
                  <p><span class="label">Phone:</span> ${countrycode} ${phoneNo}</p>
                  <p><span class="label">Message:</span> ${message}</p>
                  <p><span class="label">Time:</span> ${new Date().toLocaleString()}</p>
              </div>
              
              <a href="mailto:${email}" class="reply-button">Reply to User</a>
          </div>
      </div>
  </body>
  </html>`;
};
