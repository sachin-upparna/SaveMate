import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({ to, subject, html }) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.warn('RESEND_API_KEY is not set. Skipping email send.');
      return { success: false, error: 'API key missing' };
    }

    const data = await resend.emails.send({
      from: 'SaveMate <no-reply@riverqueen.in>',
      to,
      subject,
      html,
    });

    if (data.error) {
      console.error('Resend API Error:', data.error);
      return { success: false, error: data.error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Failed to send email:', error);
    // Return graceful failure instead of throwing
    return { success: false, error: error.message };
  }
}
