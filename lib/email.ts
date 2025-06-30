import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@robosemi.com',
      ...options,
    });
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

export function generateOrderConfirmationEmail(orderData: any): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Order Confirmation - RoboSemi</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #2563EB, #059669); color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .order-details { background: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
        .item { border-bottom: 1px solid #eee; padding: 10px 0; }
        .total { font-weight: bold; font-size: 18px; color: #2563EB; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Order Confirmation</h1>
          <p>Thank you for your order!</p>
        </div>
        <div class="content">
          <h2>Order #${orderData.orderNumber}</h2>
          <p>Hi ${orderData.shippingAddress.name},</p>
          <p>Your order has been confirmed and will be processed shortly.</p>
          
          <div class="order-details">
            <h3>Order Details:</h3>
            ${orderData.items.map((item: any) => `
              <div class="item">
                <strong>${item.name}</strong><br>
                Quantity: ${item.quantity} × ₹${item.price.toLocaleString()}
              </div>
            `).join('')}
            <div class="total">
              Total: ₹${orderData.total.toLocaleString()}
            </div>
          </div>
          
          <div class="order-details">
            <h3>Shipping Address:</h3>
            <p>
              ${orderData.shippingAddress.name}<br>
              ${orderData.shippingAddress.street}<br>
              ${orderData.shippingAddress.city}, ${orderData.shippingAddress.state} ${orderData.shippingAddress.zipCode}
            </p>
          </div>
          
          <p>We'll send you another email when your order ships.</p>
          <p>Thank you for choosing RoboSemi!</p>
        </div>
      </div>
    </body>
    </html>
  `;
}