import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { Resend } from 'resend';

const app = express();
const PORT = process.env.PORT || 4000;

// Read API key securely from .env
const resend = new Resend(process.env.RESEND_API_KEY);

app.use(cors());
app.use(express.json());

app.post('/api/inquire', async (req, res) => {
  const { name, email, subject, message } = req.body;

  // Print full details to the terminal
  console.log('--- New Studio Inquiry Received ---');
  console.log(`From:    ${name} <${email}>`);
  console.log(`Subject: ${subject}`);
  console.log(`Message: ${message}`);
  console.log('-----------------------------------');

  try {
    const { data, error } = await resend.emails.send({
      from: 'Elena Vance Atelier <onboarding@resend.dev>',
      to: email,
      subject: `Inquiry Received: ${subject || 'Studio Commission'}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 580px; margin: 0 auto; padding: 24px; color: #1a1a1a; line-height: 1.6;">
          <h2 style="color: #b89758; margin-top: 0; font-size: 22px;">Thank you for contacting the Atelier, ${name}.</h2>
          <p>We have received your message regarding <strong>${subject || 'General Studio Inquiry'}</strong>.</p>

          <div style="background-color: #f7f6f2; border-left: 3px solid #b89758; padding: 14px 18px; margin: 20px 0;">
            <p style="margin: 0; font-style: italic; color: #444;">"${message}"</p>
          </div>

          <p>Our studio representative reviews acquisition and commission requests daily and will follow up shortly with pricing, provenance documentation, and delivery logistics.</p>

          <hr style="border: none; border-top: 1px solid #eaeaea; margin: 30px 0 16px 0;" />
          <p style="font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 1px; margin: 0;">
            Elena Vance Atelier &bull; Contemporary Fine Art Studio
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend Error:', error);
      return res.status(400).json({ error: error.message });
    }

    console.log('Dispatch successful! Message ID:', data.id);

    return res.status(200).json({
      success: true,
      message: `Automated confirmation sent directly to ${email}!`,
    });
  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Internal server error occurred while sending email.' });
  }
});

app.listen(PORT, () => {
  console.log(`API Server running at http://localhost:${PORT}`);
});
