export interface AdminInquiryEmailPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface CustomerConfirmationEmailPayload {
  name: string;
  email: string;
  subject: string;
}

export interface BookingConfirmationEmailPayload {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  make: string;
  model: string;
  bookingAmount: number;
  dealerPhone?: string;
  nextSteps?: string;
}

export interface PaymentSuccessEmailPayload {
  razorpayPaymentId: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  make: string;
  model: string;
  amountPaid: number;
  remainingAmount: number;
}

export interface AdminOrderEmailPayload {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  addressLine?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  make: string;
  model: string;
  amountPaid: number;
  remainingAmount: number;
}

export const generateBookingConfirmationHtml = (payload: BookingConfirmationEmailPayload): string => {
  const {
    orderNumber,
    customerName,
    make,
    model,
    bookingAmount,
    dealerPhone = '+1 (800) 555-LUXE',
    nextSteps = 'Our logistics manager will contact you to confirm delivery scheduling and final paperwork.',
  } = payload;

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #0f0f11; color: #ffffff; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);">
      <h2 style="color: #f59e0b; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px;">Booking Confirmation</h2>
      <p style="font-size: 14px;">Dear <strong>${customerName}</strong>,</p>
      <p style="font-size: 14px; line-height: 1.6; color: #d4d4d8;">
        Your vehicle booking has been successfully reserved! Below are your booking and vehicle details:
      </p>
      
      <table style="width: 100%; border-collapse: collapse; margin-top: 15px; text-align: left; font-size: 14px; background-color: rgba(255,255,255,0.03); border-radius: 8px;">
        <tr>
          <td style="padding: 10px; color: #a1a1aa; width: 130px;"><strong>Booking ID:</strong></td>
          <td style="padding: 10px; color: #f59e0b; font-weight: bold;">${orderNumber}</td>
        </tr>
        <tr>
          <td style="padding: 10px; color: #a1a1aa;"><strong>Vehicle:</strong></td>
          <td style="padding: 10px; color: #ffffff;">${make} ${model}</td>
        </tr>
        <tr>
          <td style="padding: 10px; color: #a1a1aa;"><strong>Amount:</strong></td>
          <td style="padding: 10px; color: #10b981; font-weight: bold;">$${bookingAmount.toLocaleString()}</td>
        </tr>
        <tr>
          <td style="padding: 10px; color: #a1a1aa;"><strong>Dealer Phone:</strong></td>
          <td style="padding: 10px; color: #ffffff;">${dealerPhone}</td>
        </tr>
      </table>

      <div style="margin-top: 20px; background-color: rgba(59, 130, 246, 0.1); border-left: 4px solid #3b82f6; padding: 12px; border-radius: 4px;">
        <strong style="color: #60a5fa; display: block; margin-bottom: 4px;">Next Steps:</strong>
        <span style="font-size: 13px; color: #93c5fd;">${nextSteps}</span>
      </div>

      <p style="margin-top: 25px; font-size: 12px; color: #71717a;">Motovra Luxury Motors • Concierge Service</p>
    </div>
  `;
};

export const generatePaymentSuccessHtml = (payload: PaymentSuccessEmailPayload): string => {
  const {
    razorpayPaymentId,
    orderNumber,
    customerName,
    make,
    model,
    amountPaid,
    remainingAmount,
  } = payload;

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #0f0f11; color: #ffffff; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);">
      <h2 style="color: #10b981; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px;">Payment Successful</h2>
      <p style="font-size: 14px;">Dear <strong>${customerName}</strong>,</p>
      <p style="font-size: 14px; line-height: 1.6; color: #d4d4d8;">
        Thank you for your payment! We have received your booking deposit. Below is your official payment receipt:
      </p>
      
      <table style="width: 100%; border-collapse: collapse; margin-top: 15px; text-align: left; font-size: 14px; background-color: rgba(255,255,255,0.03); border-radius: 8px;">
        <tr>
          <td style="padding: 10px; color: #a1a1aa; width: 140px;"><strong>Transaction ID:</strong></td>
          <td style="padding: 10px; color: #60a5fa; font-weight: bold;">${razorpayPaymentId}</td>
        </tr>
        <tr>
          <td style="padding: 10px; color: #a1a1aa;"><strong>Booking ID:</strong></td>
          <td style="padding: 10px; color: #f59e0b; font-weight: bold;">${orderNumber}</td>
        </tr>
        <tr>
          <td style="padding: 10px; color: #a1a1aa;"><strong>Vehicle:</strong></td>
          <td style="padding: 10px; color: #ffffff;">${make} ${model}</td>
        </tr>
        <tr>
          <td style="padding: 10px; color: #a1a1aa;"><strong>Amount Paid:</strong></td>
          <td style="padding: 10px; color: #10b981; font-weight: bold;">$${amountPaid.toLocaleString()}</td>
        </tr>
        <tr>
          <td style="padding: 10px; color: #a1a1aa;"><strong>Remaining Due:</strong></td>
          <td style="padding: 10px; color: #fbbf24; font-weight: bold;">$${remainingAmount.toLocaleString()}</td>
        </tr>
      </table>

      <p style="margin-top: 20px; font-size: 14px; color: #d4d4d8;">
        Our concierge team is finalizing your delivery paperwork. You can track your booking status anytime on your Motovra dashboard.
      </p>

      <p style="margin-top: 25px; font-size: 12px; color: #71717a;">Motovra Luxury Motors • Payment Receipt</p>
    </div>
  `;
};

export const generateAdminOrderHtml = (payload: AdminOrderEmailPayload): string => {
  const {
    orderNumber,
    customerName,
    customerPhone,
    customerEmail,
    addressLine,
    city,
    state,
    postalCode,
    make,
    model,
    amountPaid,
    remainingAmount,
  } = payload;

  const addressStr = [addressLine, city, state, postalCode].filter(Boolean).join(', ');

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #0f0f11; color: #ffffff; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);">
      <h2 style="color: #f59e0b; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px;">🚨 New Vehicle Order Received</h2>
      <p style="font-size: 14px;">A new luxury vehicle order has been successfully placed & verified on the Motovra platform.</p>
      
      <table style="width: 100%; border-collapse: collapse; margin-top: 15px; text-align: left; font-size: 14px; background-color: rgba(255,255,255,0.03); border-radius: 8px;">
        <tr>
          <td style="padding: 10px; color: #a1a1aa; width: 140px;"><strong>Order Number:</strong></td>
          <td style="padding: 10px; color: #f59e0b; font-weight: bold;">${orderNumber}</td>
        </tr>
        <tr>
          <td style="padding: 10px; color: #a1a1aa;"><strong>Vehicle:</strong></td>
          <td style="padding: 10px; color: #ffffff;">${make} ${model}</td>
        </tr>
        <tr>
          <td style="padding: 10px; color: #a1a1aa;"><strong>Customer Name:</strong></td>
          <td style="padding: 10px; color: #ffffff;">${customerName}</td>
        </tr>
        <tr>
          <td style="padding: 10px; color: #a1a1aa;"><strong>Customer Phone:</strong></td>
          <td style="padding: 10px; color: #ffffff;"><a href="tel:${customerPhone}" style="color: #60a5fa;">${customerPhone}</a></td>
        </tr>
        <tr>
          <td style="padding: 10px; color: #a1a1aa;"><strong>Customer Email:</strong></td>
          <td style="padding: 10px; color: #3b82f6;"><a href="mailto:${customerEmail}" style="color: #3b82f6;">${customerEmail}</a></td>
        </tr>
        ${addressStr ? `
        <tr>
          <td style="padding: 10px; color: #a1a1aa;"><strong>Delivery Address:</strong></td>
          <td style="padding: 10px; color: #e4e4e7;">${addressStr}</td>
        </tr>
        ` : ''}
        <tr>
          <td style="padding: 10px; color: #a1a1aa;"><strong>Deposit Paid:</strong></td>
          <td style="padding: 10px; color: #10b981; font-weight: bold;">$${amountPaid.toLocaleString()}</td>
        </tr>
        <tr>
          <td style="padding: 10px; color: #a1a1aa;"><strong>Remaining Due:</strong></td>
          <td style="padding: 10px; color: #fbbf24; font-weight: bold;">$${remainingAmount.toLocaleString()}</td>
        </tr>
      </table>

      <p style="margin-top: 20px; font-size: 12px; color: #71717a;">Motovra Luxury Motors • Admin Operations Alert</p>
    </div>
  `;
};

export const emailService = {
  /**
   * Send Brevo REST API email helper
   */
  async sendBrevoEmail(payload: {
    to: { email: string; name?: string }[];
    subject: string;
    htmlContent: string;
  }) {
    const apiKey = process.env.BREVO_API_KEY;
    const senderEmail = process.env.SENDER_EMAIL || 'concierge@motovra.com';
    const senderName = 'Motovra Luxury Motors';

    if (!apiKey) {
      // In development / test environment without Brevo API key, log email for testing
      console.log(`[Brevo Mock Email Sent] To: ${payload.to[0].email} | Subject: ${payload.subject}`);
      return { messageId: `mock_brevo_${Date.now()}` };
    }

    try {
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api-key': apiKey,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          sender: { name: senderName, email: senderEmail },
          to: payload.to,
          subject: payload.subject,
          htmlContent: payload.htmlContent,
          headers: {
            'X-Mailin-Priority': '1',
            'X-Priority': '1',
            'Importance': 'high',
          },
          tags: ['otp-verification'],
        }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('[Brevo Email Error]', error);
      return { error: true };
    }
  },

  /**
   * TDD Cycle 2: Admin Inquiry Notification via Brevo
   */
  async sendAdminInquiryNotification(payload: AdminInquiryEmailPayload) {
    const { name, email, subject, message } = payload;
    const adminEmail = process.env.DEALERSHIP_EMAIL || 'admin@motovra.com';

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #0f0f11; color: #ffffff; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);">
        <h2 style="color: #f59e0b; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px;">New Contact Inquiry</h2>
        <p style="font-size: 14px;">You have received a new inquiry from the Motovra luxury platform.</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px; text-align: left; font-size: 14px;">
          <tr>
            <td style="padding: 8px; color: #a1a1aa; width: 100px;"><strong>Name:</strong></td>
            <td style="padding: 8px; color: #ffffff;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 8px; color: #a1a1aa;"><strong>Email:</strong></td>
            <td style="padding: 8px; color: #3b82f6;"><a href="mailto:${email}" style="color: #3b82f6; text-decoration: none;">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px; color: #a1a1aa;"><strong>Subject:</strong></td>
            <td style="padding: 8px; color: #ffffff;">${subject}</td>
          </tr>
          <tr>
            <td style="padding: 8px; color: #a1a1aa; vertical-align: top;"><strong>Message:</strong></td>
            <td style="padding: 8px; color: #e4e4e7; background-color: rgba(255,255,255,0.05); border-radius: 6px;">${message.replace(/\n/g, '<br/>')}</td>
          </tr>
        </table>
        
        <p style="margin-top: 20px; font-size: 12px; color: #71717a;">Motovra Concierge System</p>
      </div>
    `;

    return await this.sendBrevoEmail({
      to: [{ email: adminEmail, name: 'Motovra Admin' }],
      subject: `[New Inquiry] ${subject}`,
      htmlContent,
    });
  },

  /**
   * TDD Cycle 3: Customer Confirmation Email via Brevo
   */
  async sendCustomerConfirmationEmail(payload: CustomerConfirmationEmailPayload) {
    const { name, email, subject } = payload;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #0f0f11; color: #ffffff; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);">
        <h2 style="color: #f59e0b; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px;">We've Received Your Inquiry</h2>
        <p style="font-size: 14px;">Hello <strong>${name}</strong>,</p>
        <p style="font-size: 14px; line-height: 1.6; color: #d4d4d8;">
          Thank you for contacting <strong>Motovra Luxury Motors</strong>. We've received your inquiry regarding:
        </p>
        <div style="background-color: rgba(245, 158, 11, 0.1); border-left: 4px solid #f59e0b; padding: 12px; margin: 15px 0; border-radius: 4px; font-weight: bold; color: #fbbf24;">
          ${subject}
        </div>
        <p style="font-size: 14px; color: #d4d4d8;">
          Our VIP Automotive Concierge team will review your inquiry and respond within 24 hours.
        </p>
        <br/>
        <p style="font-size: 14px; color: #a1a1aa; margin: 0;">Regards,</p>
        <p style="font-size: 14px; font-weight: bold; color: #ffffff; margin-top: 4px;">Motovra Concierge Team</p>
      </div>
    `;

    return await this.sendBrevoEmail({
      to: [{ email, name }],
      subject: `We've received your inquiry: ${subject}`,
      htmlContent,
    });
  },

  /**
   * TDD Cycle 1 (Booking Email): Booking Confirmation Email via Brevo
   */
  async sendBookingConfirmationEmail(payload: BookingConfirmationEmailPayload) {
    const htmlContent = generateBookingConfirmationHtml(payload);

    return await this.sendBrevoEmail({
      to: [{ email: payload.customerEmail, name: payload.customerName }],
      subject: `Booking Confirmed: ${payload.make} ${payload.model} (${payload.orderNumber})`,
      htmlContent,
    });
  },

  /**
   * TDD Cycle 2 (Payment Email): Payment Success Email via Brevo
   */
  async sendPaymentSuccessEmail(payload: PaymentSuccessEmailPayload) {
    const htmlContent = generatePaymentSuccessHtml(payload);

    return await this.sendBrevoEmail({
      to: [{ email: payload.customerEmail, name: payload.customerName }],
      subject: `Payment Receipt: ${payload.make} ${payload.model} (${payload.razorpayPaymentId})`,
      htmlContent,
    });
  },

  /**
   * Admin Order Received Notification Email via Brevo
   */
  async sendAdminOrderNotification(payload: AdminOrderEmailPayload) {
    const htmlContent = generateAdminOrderHtml(payload);
    const adminEmail = process.env.DEALERSHIP_EMAIL || 'admin@motovra.com';

    return await this.sendBrevoEmail({
      to: [{ email: adminEmail, name: 'Motovra Admin' }],
      subject: `[New Order] ${payload.make} ${payload.model} (${payload.orderNumber}) - ${payload.customerName}`,
      htmlContent,
    });
  },

  async sendVerificationEmail(payload: { email: string; verificationToken: string; name?: string }): Promise<any> {
    const name = payload.name || payload.email.split('@')[0];
    const otpCode = payload.verificationToken; // 6-digit OTP or token

    const htmlContent = `
      <div style="font-family: 'Inter', system-ui, sans-serif; background-color: #0b0c10; color: #ffffff; padding: 40px 20px; text-align: center;">
        <div style="max-width: 550px; margin: 0 auto; background: #12141c; border-radius: 20px; padding: 40px 32px; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
          <img src="https://motovra.com/motovra-logo.jpg" alt="Motovra Emblem" style="height: 52px; width: auto; margin-bottom: 24px; border-radius: 12px;" />
          <h2 style="color: #ffffff; font-size: 26px; font-weight: 800; margin-bottom: 12px; tracking-tight: -0.5px;">Verify Your Email</h2>
          <p style="color: #a1a1aa; font-size: 15px; line-height: 1.6; margin-bottom: 32px;">
            Welcome to Motovra, <strong style="color: #ffffff;">${name}</strong>! Use the 6-digit verification code below to activate your account:
          </p>
          
          <div style="background: rgba(229, 169, 16, 0.08); border: 2px dashed rgba(229, 169, 16, 0.5); border-radius: 16px; padding: 20px 10px; margin-bottom: 32px; text-align: center;">
            <span style="font-family: 'Space Grotesk', 'Courier New', monospace; font-size: 38px; font-weight: 800; letter-spacing: 14px; color: #e5a910; display: inline-block; padding-left: 14px;">${otpCode}</span>
          </div>

          <p style="color: #71717a; font-size: 13px; margin-top: 24px;">
            This OTP code is valid for <strong>15 minutes</strong>. If you did not create a Motovra account, you can safely ignore this email.
          </p>
        </div>
      </div>
    `;

    return await this.sendBrevoEmail({
      to: [{ email: payload.email, name }],
      subject: `[${otpCode}] Motovra Email Verification Code`,
      htmlContent,
    });
  },

  async sendWelcomeEmail(payload: { email: string; name?: string }): Promise<any> {
    const name = payload.name || payload.email.split('@')[0];
    const loginUrl = `${process.env.APP_URL || 'http://localhost:5173'}/login`;

    const htmlContent = `
      <div style="font-family: 'Inter', sans-serif; background-color: #0b0c10; color: #ffffff; padding: 40px 20px; text-align: center;">
        <div style="max-width: 550px; margin: 0 auto; background: #12141c; border-radius: 16px; padding: 32px; border: 1px solid rgba(255,255,255,0.1);">
          <img src="https://motovra.com/motovra-logo.jpg" alt="Motovra" style="height: 48px; margin-bottom: 24px;" />
          <h2 style="color: #ffffff; font-size: 24px; margin-bottom: 12px;">Account Verified!</h2>
          <p style="color: #a1a1aa; font-size: 15px; line-height: 1.6; margin-bottom: 28px;">
            Your Motovra account is now fully active. You can browse, reserve, and manage luxury vehicle orders.
          </p>
          <a href="${loginUrl}" style="display: inline-block; background-color: #e5a910; color: #000000; font-weight: 700; text-decoration: none; padding: 14px 32px; border-radius: 9999px; font-size: 15px;">Sign In to Showroom</a>
        </div>
      </div>
    `;

    return await this.sendBrevoEmail({
      to: [{ email: payload.email, name }],
      subject: 'Welcome to Motovra — Account Verified',
      htmlContent,
    });
  },
};
