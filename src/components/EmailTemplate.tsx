
// emails

import { Order, OrderItem, User } from "@prisma/client";


export const generateVerificationEmailHTML = (username: string, token: string) => {
    const domain = process.env.NEXT_PUBLIC_BASE_URL 

    const emailHTML = `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f9f9f9;
              padding: 20px;
              margin: 0;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #fff;
              border: 1px solid #dcdcdc;
              border-radius: 8px;
              padding: 20px;
              text-align: center;
            }
            .logo {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 10px;
            }
            .logo .part1 {
              color: #000;
            }
            .logo .part2 {
              color: #0070f3;
            }
            .message {
              font-size: 16px;
              line-height: 1.6;
              margin-bottom: 20px;
            }
            .button {
              display: inline-block;
              background: linear-gradient(90deg, #007291, #00a3c4);
              color: #fff !important;
              text-decoration: none;
              padding: 12px 25px;
              border-radius: 6px;
              font-weight: bold;
              margin-top: 20px;
              transition: background 0.3s ease;
            }
            .button:hover {
              background: linear-gradient(90deg, #005f7a, #008b9f);
            }
            .footer {
              font-size: 12px;
              color: #777;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">
              <img src="https://firebasestorage.googleapis.com/v0/b/tactical-hydra-424919-a1.appspot.com/o/aestheticpro.png?alt=media&token=3d5c4c50-bc46-4e81-af42-4ab3763a9ed5" alt="AestheticPro Logo" style="max-width: 200px; margin-bottom: 1px;">
            </div>
            <p class="message">Hi ${username},</p>
            <p class="message">Welcome to AestheticPro.tn ! We're excited to have you on board.</p>
            <p class="message">To complete your account setup, please verify your email by clicking the button below:</p>
            <a class="button" href="${domain}/auth/verify-email/${token}" aria-label="Verify Email">Verify Email</a>
            <p class="message">If you didn't create an account with AestheticPro.tn , please ignore this email.</p>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} AestheticPro.tn . All rights reserved.</p>
              <p>AestheticPro.tn  Inc., Korba city, Nabeul, Tunisia</p>
            </div>
          </div>
        </body>
      </html>
    `;
    return emailHTML;
};

  
export const generateResetPassEmailHTML = (username: string, token: string) => {
    const domain = process.env.NEXT_PUBLIC_BASE_URL 
    const emailHTML = `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f9f9f9;
              padding: 20px;
              margin: 0;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #fff;
              border: 1px solid #dcdcdc;
              border-radius: 8px;
              padding: 20px;
              text-align: center;
            }
            .logo {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 20px;
            }
            .logo .part1 {
              color: #000;
            }
            .logo .part2 {
              color: #0070f3;
            }
            .message {
              font-size: 16px;
              line-height: 1.6;
              margin-bottom: 10px;
            }
            .button {
              display: inline-block;
              background: linear-gradient(90deg, #007291, #00a3c4);
              color: #fff !important;
              text-decoration: none;
              padding: 12px 25px;
              border-radius: 6px;
              font-weight: bold;
              margin-top: 20px;
              transition: background 0.3s ease;
            }
            .button:hover {
              background: linear-gradient(90deg, #005f7a, #008b9f);
              color: #fff !important;
            }
            .footer {
              font-size: 12px;
              color: #777;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">
              <img src="https://firebasestorage.googleapis.com/v0/b/tactical-hydra-424919-a1.appspot.com/o/aestheticpro.png?alt=media&token=3d5c4c50-bc46-4e81-af42-4ab3763a9ed5" alt="AestheticPro Logo" style="max-width: 200px; margin-bottom: 1px;">
            </div>
            <p class="message">Hi ${username},</p>
            <p class="message">You requested to reset your password. Please click the button below to proceed:</p>
            <a class="button" href="${domain}/auth/reset-password/${token}" aria-label="Reset Password">Reset Password</a>
            <p class="message">If you did not request a password reset, please ignore this email or contact support if you have any questions.</p>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} AestheticPro.tn . All rights reserved.</p>
              <p>AestheticPro.tn  Inc., Korba city, Nabeul, Tunisia</p>
            </div>
          </div>
        </body>
      </html>
    `;
    return emailHTML;
};


export const generateDesignRejectedEmailHTML = (username: string, designName: string, reason: string) => {
  const emailHTML = `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f9f9f9;
            padding: 20px;
            margin: 0;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #fff;
            border: 1px solid #dcdcdc;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
          }
          .logo {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
          }
          .logo .part1 {
            color: #000;
          }
          .logo .part2 {
            color: #0070f3;
          }
          .message {
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 20px;
          }
          .reason {
            font-weight: bold;
            color: #ff4d4f;
          }
          .footer {
            font-size: 12px;
            color: #777;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">
              <img src="https://firebasestorage.googleapis.com/v0/b/tactical-hydra-424919-a1.appspot.com/o/aestheticpro.png?alt=media&token=3d5c4c50-bc46-4e81-af42-4ab3763a9ed5" alt="AestheticPro Logo" style="max-width: 100px; margin-bottom: 1px;">
          </div>
          <p class="message">Hi ${username},</p>
          <p class="message">We regret to inform you that your design "${designName}" has been rejected.</p>
          <p class="message">Reason for rejection: <span class="reason">${reason}</span></p>
          <p class="message">Please ensure that your designs adhere to our selling terms and policies to avoid further issues.</p>
          <p class="message">If you repeatedly violate our terms, you risk being banned from our platform.</p>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} AestheticPro.tn . All rights reserved.</p>
            <p>Contact us: astheticprocontact@gmail.com</p>
          </div>
        </div>
      </body>
    </html>
  `;
  return emailHTML;
};



export const generateProductRejectedEmailHTML = (username: string, productName: string, reason: string) => {
  const emailHTML = `
    <html>
      <head>
        <style>
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #fff;
            border: 1px solid #dcdcdc;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
          }
          .logo {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
          }
          .logo .part1 {
            color: #000;
          }
          .logo .part2 {
            color: #0070f3;
          }
          .message {
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 20px;
          }
          .reason {
            font-weight: bold;
            color: #ff4d4f;
          }
          .footer {
            font-size: 12px;
            color: #777;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">
              <img src="https://firebasestorage.googleapis.com/v0/b/tactical-hydra-424919-a1.appspot.com/o/aestheticpro.png?alt=media&token=3d5c4c50-bc46-4e81-af42-4ab3763a9ed5" alt="AestheticPro Logo" style="max-width: 100px; margin-bottom: 1px;">
          </div>
          <p class="message">Hi ${username},</p>
          <p class="message">We regret to inform you that your product "${productName}" has been rejected.</p>
          <p class="message">Reason for rejection: <span class="reason">${reason}</span></p>
          <p class="message">Please ensure that your products adhere to our selling terms and policies to avoid further issues.</p>
          <p class="message">If you repeatedly violate our terms, you risk being banned from our platform.</p>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} AestheticPro.tn . All rights reserved.</p>
            <p>Contact us: astheticprocontact@gmail.com</p>
          </div>
        </div>
      </body>
    </html>
  `;
  return emailHTML;
};

interface OrderWithItems extends Order {
  orderItems : OrderItem[]
  user : User
}
export const generateOrderEmailHTML = (order: OrderWithItems) => {
  const orderItemsHTML = order.orderItems.map(item => `
    <div class="order-item">
      <div class="order-item-details">
        <div style="display: flex; justify-content: center; align-items: center;">
          ${item.capturedMockup.map(mockup => `<img src="${mockup}" alt="نموذج المنتج" style="max-width: 300px; margin-right: 10px;">`).join('')}
        </div>
        <p><strong>عنوان المنتج:</strong> ${item.productTitle}</p>
        <p><strong>الفئة:</strong> ${item.productCategory}</p>
        <p><strong>الحجم:</strong> ${item.productSize}</p>
        <p><strong>الكمية:</strong> ${item.quantity}</p>
      </div>
    </div>
    <hr style="border: 0; border-top: 1px solid #dcdcdc; margin: 20px 0;">
  `).join('');

  const emailHTML = `
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f9f9f9;
          padding: 20px;
          margin: 0;
        }
        .container {
          max-width: 800px;
          margin: 0 auto;
          background-color: #fff;
          border: 1px solid #dcdcdc;
          border-radius: 8px;
          padding: 20px;
          direction: rtl;
        }
        .logo {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 10px;
          text-align: center;
        }
        .header {
          text-align: center;
          margin-bottom: 20px;
        }
        .header img {
          max-width: 100px;
          margin-bottom: 10px;
        }
        .header h1 {
          font-size: 24px;
          margin: 0;
        }
        .content {
          font-size: 16px;
          line-height: 1.6;
        }
        .order-details {
          margin-top: 20px;
          border-top: 1px solid #dcdcdc;
          padding-top: 20px;
        }
        .order-item {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
        }
        .order-item img {
          max-width: 100px;
          margin-left: 20px;
        }
        .order-item-details {
          flex-grow: 1;
        }
        .footer {
          font-size: 12px;
          color: #777;
          margin-top: 20px;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">
              <img src="https://firebasestorage.googleapis.com/v0/b/tactical-hydra-424919-a1.appspot.com/o/aestheticpro.png?alt=media&token=3d5c4c50-bc46-4e81-af42-4ab3763a9ed5" alt="شعار AestheticPro" style="max-width: 100px; margin-bottom: 1px;">
          </div>
        <h1 style="font-size: 28px; font-weight: bold; color: #333;">شكراً لطلبك 💖</h1>
        <p style="font-size: 16px; color: #555; margin-top: 8px;">نقدّر ثقتك بنا</p>
        </div>
        <div class="content">
          <p>مرحباً ${order.user.name}</p>
          <p>نحن حالياً نقوم بمعالجة طلبك وسنتصل بك قريباً لتأكيد التفاصيل.</p>
          <div class="order-details">
            <h2>تفاصيل الطلب</h2>
            <p><strong>قيمة الطلب:</strong> ${order.amount.toFixed(2)} دينار تونسي</p>
            <h3>العناصر المطلوبة:</h3>
            ${orderItemsHTML}
          </div>
        </div>
        <div class="footer">
          <p>&copy; AestheticPro.tn . جميع الحقوق محفوظة.</p>
          <p>للتواصل معنا: astheticprocontact@gmail.com</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return emailHTML;
};


export const generateLevelUpEmailHTML = (
  username: string,
  storeName: string,
  newLevel: number,
  isHighestLevel: boolean
) => {
  const emailHTML = `
    <html>
      <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 0; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #fff; border: 1px solid #dcdcdc; border-radius: 8px; padding: 20px; text-align: center;">
          <div style="margin-bottom: 10px;">
            <img src="https://firebasestorage.googleapis.com/v0/b/tactical-hydra-424919-a1.appspot.com/o/aestheticpro.png?alt=media&token=3d5c4c50-bc46-4e81-af42-4ab3763a9ed5" 
                 alt="Company Logo - AestheticPro" style="max-width: 100px; margin-bottom: 10px;">
          </div>
          <h1 style="font-size: 24px; font-weight: bold; color: #0070f3; margin-bottom: 20px;">Congratulations, ${username} 🎉 !</h1>
          <p style="font-size: 16px; line-height: 1.6; color: #333;">
            Your store <strong style="color: #0070f3;">${storeName}</strong> has reached <strong>Level ${newLevel}</strong> on our platform!
          </p>
          ${
            isHighestLevel
              ? `
          <p style="font-size: 16px; line-height: 1.6; color: #333; margin-top: 20px;">
            You've unlocked <strong style="color: #0070f3;">unlimited products and designs creation</strong> for your store!
          </p>
          <p style="font-size: 16px; line-height: 1.6; color: #333;">We are excited to see your store thrive with these new privileges. Keep up the fantastic work!</p>
          `
              : `
          <p style="font-size: 16px; line-height: 1.6; color: #333;">
            You're now one step closer to unlocking the highest level and all its exclusive benefits!
          </p>
          <p style="font-size: 16px; line-height: 1.6; color: #333;">
            Continue striving for success to make your store even more remarkable.
          </p>
          `
          }
          <div style="margin-top: 20px; font-size: 12px; color: #777;">
            <p>&copy; ${new Date().getFullYear()} AestheticPro.tn. All rights reserved.</p>
            <p>Contact us: <a href="mailto:astheticprocontact@gmail.com" style="color: #0070f3;">astheticprocontact@gmail.com</a></p>
          </div>
        </div>
      </body>
    </html>
  `;
  return emailHTML;
};

export const generateProductSoldEmailHTML = (
  username: string,
  storeName: string,
  productName: string,
  profit: number,
) => {
  const emailHTML = `
    <html>
      <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 0; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #fff; border: 1px solid #dcdcdc; border-radius: 8px; padding: 20px; text-align: center;">
          <div style="margin-bottom: 10px;">
            <img src="https://firebasestorage.googleapis.com/v0/b/tactical-hydra-424919-a1.appspot.com/o/aestheticpro.png?alt=media&token=3d5c4c50-bc46-4e81-af42-4ab3763a9ed5" 
                 alt="Company Logo - AestheticPro" style="max-width: 100px; margin-bottom: 10px;">
          </div>
          <h1 style="font-size: 24px; font-weight: bold; color: #0070f3; margin-bottom: 20px;">Great News, ${username} 🎉!</h1>
          <p style="font-size: 16px; line-height: 1.6; color: #333;">
            Your store <strong style="color: #0070f3;">${storeName}</strong> has made a sale!
          </p>
          <p style="font-size: 16px; line-height: 1.6; color: #333;">
            A customer just purchased your product <strong style="color: #0070f3;">${productName}</strong>.
          </p>
          <p style="font-size: 16px; line-height: 1.6; color: #333;">
            You earned <strong style="color: #0070f3;">${profit} TND</strong> in profit from this sale.
          </p>
          <p style="font-size: 16px; line-height: 1.6; color: #333; margin-top: 20px;">
            This is a great step forward! Keep up the excellent work, and continue creating amazing products.
          </p>
          <div style="margin-top: 20px; font-size: 12px; color: #777;">
            <p>&copy; ${new Date().getFullYear()} AestheticPro.tn. All rights reserved.</p>
            <p>Contact us: <a href="mailto:astheticprocontact@gmail.com" style="color: #0070f3;">astheticprocontact@gmail.com</a></p>
          </div>
        </div>
      </body>
    </html>
  `;
  return emailHTML;
};



export const generateDesignSoldEmailHTML = (
  username: string,
  storeName: string,
  designName: string,
  designProfit: number,
) => {
  const emailHTML = `
    <html>
      <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 0; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #fff; border: 1px solid #dcdcdc; border-radius: 8px; padding: 20px; text-align: center;">
          <div style="margin-bottom: 10px;">
            <img src="https://firebasestorage.googleapis.com/v0/b/tactical-hydra-424919-a1.appspot.com/o/aestheticpro.png?alt=media&token=3d5c4c50-bc46-4e81-af42-4ab3763a9ed5" 
                 alt="Company Logo - AestheticPro" style="max-width: 100px; margin-bottom: 10px;">
          </div>
          <h1 style="font-size: 24px; font-weight: bold; color: #0070f3; margin-bottom: 20px;">Awesome News, ${username} 🎉!</h1>
          <p style="font-size: 16px; line-height: 1.6; color: #333;">
            Your design <strong style="color: #0070f3;">${designName}</strong> has been sold in your store <strong style="color: #0070f3;">${storeName}</strong>!
          </p>
          <p style="font-size: 16px; line-height: 1.6; color: #333;">
            You earned <strong style="color: #0070f3;">${designProfit} TND</strong> in profit from this sale.
          </p>
          <p style="font-size: 16px; line-height: 1.6; color: #333; margin-top: 20px;">
            You're doing great! Keep creating stunning designs to continue impressing your customers.
          </p>
          <div style="margin-top: 20px; font-size: 12px; color: #777;">
            <p>&copy; ${new Date().getFullYear()} AestheticPro.tn. All rights reserved.</p>
            <p>Contact us: <a href="mailto:astheticprocontact@gmail.com" style="color: #0070f3;">astheticprocontact@gmail.com</a></p>
          </div>
        </div>
      </body>
    </html>
  `;
  return emailHTML;
};



export const generateAffiliateProductSoldEmailHTML = (
  username: string,
  productName: string,
  affiliateCommission: number,
) => {
  const emailHTML = `
    <html>
      <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 0; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #fff; border: 1px solid #dcdcdc; border-radius: 8px; padding: 20px; text-align: center;">
          <div style="margin-bottom: 10px;">
            <img src="https://firebasestorage.googleapis.com/v0/b/tactical-hydra-424919-a1.appspot.com/o/aestheticpro.png?alt=media&token=3d5c4c50-bc46-4e81-af42-4ab3763a9ed5" 
                 alt="Company Logo - AestheticPro" style="max-width: 100px; margin-bottom: 10px;">
          </div>
          <h1 style="font-size: 24px; font-weight: bold; color: #0070f3; margin-bottom: 20px;">Congratulations, ${username} 🎉!</h1>
          <p style="font-size: 16px; line-height: 1.6; color: #333;">
            A customer purchased a product you referred! Here's the detail:
          </p>
          <p style="font-size: 16px; line-height: 1.6; color: #333;">
            Product: <strong style="color: #0070f3;">${productName}</strong>
          </p>
          <p style="font-size: 16px; line-height: 1.6; color: #333;">
            Your affiliate commission: <strong>${affiliateCommission} TND</strong>
          </p>
          <p style="font-size: 16px; line-height: 1.6; color: #333; margin-top: 20px;">
            Keep up the great work and keep referring awesome products to earn more!
          </p>
          <div style="margin-top: 20px; font-size: 12px; color: #777;">
            <p>&copy; ${new Date().getFullYear()} AestheticPro.tn. All rights reserved.</p>
            <p>Contact us: <a href="mailto:astheticprocontact@gmail.com" style="color: #0070f3;">astheticprocontact@gmail.com</a></p>
          </div>
        </div>
      </body>
    </html>
  `;
  return emailHTML;
};


export const generateStoreApprovedPaymentRequestEmailHTML = (
  username: string,
  paymentAmount: number,
  requestDate: string,
  storeRevenue: number,
  receivedPayments: number,
  unreceivedPayments: number
) => {
  const formattedAmount = paymentAmount.toFixed(2);
  const formattedStoreRevenue = storeRevenue.toFixed(2);
  const formattedReceivedPayments = receivedPayments.toFixed(2);
  const formattedUnreceivedPayments = unreceivedPayments.toFixed(2);

  const emailHTML = `
    <html>
      <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 0; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #fff; border: 1px solid #dcdcdc; 
                    border-radius: 8px; padding: 20px; text-align: center;">
          <div style="margin-bottom: 10px;">
            <img src="https://firebasestorage.googleapis.com/v0/b/tactical-hydra-424919-a1.appspot.com/o/aestheticpro.png?alt=media&token=3d5c4c50-bc46-4e81-af42-4ab3763a9ed5" 
                 alt="Company Logo - AestheticPro" width="100" height="100" role="presentation"
                 style="max-width: 100px; margin-bottom: 10px;">
          </div>
          <h1 style="font-size: 24px; font-weight: bold; color: #0070f3; margin-bottom: 20px;">
            Payment Request Approved ✅
          </h1>
          <p style="font-size: 16px; line-height: 1.6; color: #333;">
            Hello <strong>${username}</strong>, we're pleased to inform you that your payment request has been successfully approved.
          </p>
          <p style="font-size: 16px; line-height: 1.6; color: #333;">
          <p style="font-size: 16px; line-height: 1.6; color: #333;">
            Payment Amount: <strong>${formattedAmount} TND</strong>, as per your request dated <strong>${requestDate}</strong>.
          </p>
          </p>
          <p style="font-size: 16px; line-height: 1.6; color: #333;">
            The transaction has been successfully completed! If you haven't received the amount yet, please make sure to contact us for assistance.
          </p>
          <h2 style="font-size: 18px; color: #0070f3; margin-top: 20px;">Your Current Financial Status:</h2>
          <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
            <tr style="background-color: #0070f3; color: #fff;">
              <th style="padding: 10px; border: 1px solid #dcdcdc;">Details</th>
              <th style="padding: 10px; border: 1px solid #dcdcdc;">Amount (TND)</th>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #dcdcdc;">Store Revenue</td>
              <td style="padding: 10px; border: 1px solid #dcdcdc;">${formattedStoreRevenue}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #dcdcdc;">Received Payments</td>
              <td style="padding: 10px; border: 1px solid #dcdcdc;">${formattedReceivedPayments}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #dcdcdc;">Unreceived Payments</td>
              <td style="padding: 10px; border: 1px solid #dcdcdc;">${formattedUnreceivedPayments}</td>
            </tr>
          </table>
          <p style="font-size: 16px; line-height: 1.6; color: #333; margin-top: 20px;">
            If you have any questions, please don't hesitate to reach out to our support team.
          </p>
          <div style="margin-top: 20px; font-size: 12px; color: #777;">
            <p>&copy; ${new Date().getFullYear()} AestheticPro.tn. All rights reserved.</p>
            <p>Contact us: <a href="mailto:astheticprocontact@gmail.com" style="color: #0070f3;">
              astheticprocontact@gmail.com</a>
            </p>
          </div>
        </div>
      </body>
    </html>
  `;

  return emailHTML;
};

export const generateAffiliateApprovedPaymentRequestEmailHTML = (
  username: string,
  paymentAmount: number,
  requestDate: string,
  affiliateUserRevenue: number,
  receivedPayments: number,
  unreceivedPayments: number
) => {
  const formattedAmount = paymentAmount.toFixed(2);
  const formattedaffiliateUserRevenue = affiliateUserRevenue.toFixed(2);
  const formattedReceivedPayments = receivedPayments.toFixed(2);
  const formattedUnreceivedPayments = unreceivedPayments.toFixed(2);

  const emailHTML = `
    <html>
      <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 0; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #fff; border: 1px solid #dcdcdc; 
                    border-radius: 8px; padding: 20px; text-align: center;">
          <div style="margin-bottom: 10px;">
            <img src="https://firebasestorage.googleapis.com/v0/b/tactical-hydra-424919-a1.appspot.com/o/aestheticpro.png?alt=media&token=3d5c4c50-bc46-4e81-af42-4ab3763a9ed5" 
                 alt="Company Logo - AestheticPro" width="100" height="100" role="presentation"
                 style="max-width: 100px; margin-bottom: 10px;">
          </div>
          <h1 style="font-size: 24px; font-weight: bold; color: #0070f3; margin-bottom: 20px;">
            Payment Request Approved ✅
          </h1>
          <p style="font-size: 16px; line-height: 1.6; color: #333;">
            Hello <strong>${username}</strong>, we're pleased to inform you that your payment request has been successfully approved.
          </p>
          <p style="font-size: 16px; line-height: 1.6; color: #333;">
          <p style="font-size: 16px; line-height: 1.6; color: #333;">
            Payment Amount: <strong>${formattedAmount} TND</strong>, as per your request dated <strong>${requestDate}</strong>.
          </p>
          </p>
          <p style="font-size: 16px; line-height: 1.6; color: #333;">
            The transaction has been successfully completed! If you haven't received the amount yet, please make sure to contact us for assistance.
          </p>
          <h2 style="font-size: 18px; color: #0070f3; margin-top: 20px;">Your Current Financial Status:</h2>
          <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
            <tr style="background-color: #0070f3; color: #fff;">
              <th style="padding: 10px; border: 1px solid #dcdcdc;">Details</th>
              <th style="padding: 10px; border: 1px solid #dcdcdc;">Amount (TND)</th>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #dcdcdc;">Affiliate Revenue</td>
              <td style="padding: 10px; border: 1px solid #dcdcdc;">${formattedaffiliateUserRevenue}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #dcdcdc;">Received Payments</td>
              <td style="padding: 10px; border: 1px solid #dcdcdc;">${formattedReceivedPayments}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #dcdcdc;">Unreceived Payments</td>
              <td style="padding: 10px; border: 1px solid #dcdcdc;">${formattedUnreceivedPayments}</td>
            </tr>
          </table>
          <p style="font-size: 16px; line-height: 1.6; color: #333; margin-top: 20px;">
            If you have any questions, please don't hesitate to reach out to our support team.
          </p>
          <div style="margin-top: 20px; font-size: 12px; color: #777;">
            <p>&copy; ${new Date().getFullYear()} AestheticPro.tn. All rights reserved.</p>
            <p>Contact us: <a href="mailto:astheticprocontact@gmail.com" style="color: #0070f3;">
              astheticprocontact@gmail.com</a>
            </p>
          </div>
        </div>
      </body>
    </html>
  `;

  return emailHTML;
};







  