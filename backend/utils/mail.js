import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();


// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
  service: "Gmail",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOtpMail = async(to,otp)=>{
    await transporter.sendMail({
        from: process.env.EMAIL,
        to: to,
        subject: "Reset Your Password",
        html: `<p>Your OTP for password reset is ${otp}</br>.It expires in 5 minutes.</p>`
    })
}


export const sendDeliveryOtp = async (user, otp, orderDetails) => {
    // Calculate delivery fee
    const deliveryFee = orderDetails.subTotal > 500 ? 0 : 50;
    const totalAmount = orderDetails.subTotal + deliveryFee;

    const orderIdLast6 = orderDetails.orderId.slice(-6);

    // Generate items HTML
    const itemsHTML = orderDetails.items.map(item => `
        <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 8px; text-align: left;">${item.name}</td>
            <td style="padding: 8px; text-align: center;">₹${item.price}</td>
            <td style="padding: 8px; text-align: center;">${item.quantity}</td>
            <td style="padding: 8px; text-align: right; font-weight: bold;">₹${item.price * item.quantity}</td>
        </tr>
    `).join('');

    const billHTML = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #ff4d2d, #ff6b47); color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .otp-box { background: #fff3cd; border: 2px solid #ffeaa7; border-radius: 8px; padding: 15px; text-align: center; margin: 20px 0; }
            .bill-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .bill-table th { background: #f8f9fa; padding: 12px; text-align: left; border-bottom: 2px solid #dee2e6; }
            .total-row { background: #f8f9fa; font-weight: bold; }
            .footer { background: #f8f9fa; padding: 15px; text-align: center; color: #666; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🍔 QuickBite - Order Delivery</h1>
                <p>Your food order is being delivered!</p>
            </div>

             <div class="order-id-box">
                    <h3 style="color: #1976d2; margin: 0;">📋 Order ID: #${orderIdLast6}</h3>
                    <p style="margin: 5px 0 0 0; color: #666; font-size: 12px;">Reference for your order</p>
                </div>
            
            <div class="content">
                <div class="otp-box">
                    <h2 style="color: #ff4d2d; margin: 0;">Delivery OTP: ${otp}</h2>
                    <p style="margin: 10px 0 0 0; color: #666;">Share this OTP with your delivery partner</p>
                    <p style="margin: 5px 0 0 0; color: #999; font-size: 12px;">Expires in 20 minutes</p>
                </div>

                <h3 style="color: #333; border-bottom: 2px solid #ff4d2d; padding-bottom: 10px;">📋 Order Summary</h3>
                
                <table class="bill-table">
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th style="text-align: center;">Price</th>
                            <th style="text-align: center;">Qty</th>
                            <th style="text-align: right;">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemsHTML}
                        <tr style="border-top: 2px solid #dee2e6;">
                            <td style="padding: 12px; font-weight: bold;" colspan="3">Subtotal</td>
                            <td style="padding: 12px; text-align: right; font-weight: bold;">₹${orderDetails.subTotal}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px;" colspan="3">Delivery Fee ${orderDetails.subTotal > 500 ? '(Free for orders above ₹500)' : ''}</td>
                            <td style="padding: 8px; text-align: right; color: ${deliveryFee === 0 ? '#28a745' : '#333'};">
                                ${deliveryFee === 0 ? 'FREE' : '₹' + deliveryFee}
                            </td>
                        </tr>
                        <tr class="total-row">
                            <td style="padding: 15px; font-size: 18px;" colspan="3">💰 Total Amount</td>
                            <td style="padding: 15px; text-align: right; font-size: 18px; color: #ff4d2d;">₹${totalAmount}</td>
                        </tr>
                    </tbody>
                </table>

                <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <h4 style="margin: 0 0 10px 0; color: #155724;">📍 Delivery Details</h4>
                    <p style="margin: 5px 0;"><strong>Restaurant:</strong> ${orderDetails.shopName}</p>
                    <p style="margin: 5px 0;"><strong>Address:</strong> ${orderDetails.deliveryAddress}</p>
                    <p style="margin: 5px 0;"><strong>Payment:</strong> ${orderDetails.paymentMethod === 'cod' ? '💵 Cash on Delivery' : '💳 Online Payment'}</p>
                </div>
            </div>

            <div class="footer">
                <p>Thank you for choosing QuickBite! 🙏</p>
                <p style="font-size: 12px;">For support: support@quickbite.com | +1 (555) 123-4567</p>
            </div>
        </div>
    </body>
    </html>
    `;

    await transporter.sendMail({
        from: process.env.EMAIL,
        to: user.email,
        subject: `🍔 QuickBite - Order Delivery OTP & Bill`,
        html: billHTML
    });
};
