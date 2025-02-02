import { generateAffiliateProductSoldEmailHTML, generateDesignRejectedEmailHTML, generateDesignSoldEmailHTML, generateLevelUpEmailHTML, generateOrderEmailHTML, generateProductRejectedEmailHTML, generateProductSoldEmailHTML, generateResetPassEmailHTML, generateVerificationEmailHTML } from '@/components/EmailTemplate';
import { Order, OrderItem, User } from '@prisma/client';
import nodemailer from 'nodemailer';

const email = process.env.GMAIL_ACCOUNT;
const pass = process.env.GMAIL_PASS;

const transporter = nodemailer.createTransport({
  service: 'gmail', // or another email service
  auth: {
    user: email,
    pass: pass,
  },
});



export const sendVerificationEmail = (receiverEmail: string, username: string, token: string) => {
  const mailOptions = {
    from: email,
    to: receiverEmail,
    subject: 'Verify your email',
    html: generateVerificationEmailHTML(username, token),
  };

  return transporter.sendMail(mailOptions);
};



export const sendResetPassEmail = (receiverEmail: string, username: string, token: string) => {
  const mailOptions = {
    from: email,
    to: receiverEmail,
    subject: 'Reset your password',
    html: generateResetPassEmailHTML(username, token),
  };

  return transporter.sendMail(mailOptions);
};




export const sendDesignRejetedEmail = (receiverEmail : string, username: string, designName: string, reason: string) => {
  const mailOptions = {
    from: email,
    to: receiverEmail,
    subject: 'Your Design was rejected',
    html: generateDesignRejectedEmailHTML(username, designName , reason),
  };

  return transporter.sendMail(mailOptions);
};





export const sendProductRejetedEmail = (receiverEmail : string, username: string, productName: string, reason: string) => {
  const mailOptions = {
    from: email,
    to: receiverEmail,
    subject: 'Your Product was rejected',
    html: generateProductRejectedEmailHTML(username, productName , reason),
  };

  return transporter.sendMail(mailOptions);
};

export const sendLevelUpEmail = async (
  receiverEmail: string,
  username: string,
  storeName : string,
  newLevel: number,
  isHighestLevel: boolean
): Promise<void> => {
  try {
    const mailOptions = {
      from: email,
      to: receiverEmail,
      subject: isHighestLevel
        ? 'Congratulations! You’ve unlocked unlimited creations!'
        : `Congratulations on reaching Level ${newLevel}!`,
      html: generateLevelUpEmailHTML(username,storeName, newLevel, isHighestLevel),
    };

    await transporter.sendMail(mailOptions);

    console.log(`Level-up email sent successfully to ${receiverEmail}`);
  } catch (error) {
    console.error(`Failed to send level-up email to ${receiverEmail}:`, error);
    throw new Error('Failed to send email');
  }
};


interface OrderWithItems extends Order {
  orderItems : OrderItem[]
  user : User
}


export const sendOrderEmail = (
  order: OrderWithItems,
) => {
  const mailOptions = {
    from: email,
    to: order.user.email,
    subject: 'Thanks for your Order',
    html: generateOrderEmailHTML(order),
  };

  return transporter.sendMail(mailOptions);
};


export const sendProductSoldEmail = async (
  receiverEmail: string,
  username: string,
  storeName: string,
  productName: string,
  profit: number,
): Promise<void> => {
  try {
    const mailOptions = {
      from: email,
      to: receiverEmail,
      subject: `Great news! Your product ${productName} was sold!`,
      html: generateProductSoldEmailHTML(username, storeName, productName, profit),
    };

    await transporter.sendMail(mailOptions);

    console.log(`Product sold email sent successfully to ${receiverEmail}`);
  } catch (error) {
    console.error(`Failed to send product sold email to ${receiverEmail}:`, error);
    throw new Error('Failed to send email');
  }
};


export const sendDesignSoldEmail = async (
  receiverEmail: string,
  username: string,
  storeName: string,
  designName: string,
  designProfit: number,
): Promise<void> => {
  try {
    const mailOptions = {
      from: email,
      to: receiverEmail,
      subject: `Great news! Your design ${designName} was sold!`,
      html: generateDesignSoldEmailHTML(username, storeName, designName, designProfit),
    };

    await transporter.sendMail(mailOptions);

    console.log(`Design sold email sent successfully to ${receiverEmail}`);
  } catch (error) {
    console.error(`Failed to send design sold email to ${receiverEmail}:`, error);
    throw new Error('Failed to send email');
  }
};


export const sendAffiliateProductSoldEmail = async (
  receiverEmail: string,
  username: string,
  productName: string,
  affiliateCommission: number,
): Promise<void> => {
  try {
    const mailOptions = {
      from: email,
      to: receiverEmail,
      subject: `Great News! You earned a commission from a sale!`,
      html: generateAffiliateProductSoldEmailHTML(username, productName, affiliateCommission),
    };

    await transporter.sendMail(mailOptions);

    console.log(`Affiliate product sold email sent successfully to ${receiverEmail}`);
  } catch (error) {
    console.error(`Failed to send affiliate product sold email to ${receiverEmail}:`, error);
    throw new Error('Failed to send email');
  }
};
