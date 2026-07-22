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
};
