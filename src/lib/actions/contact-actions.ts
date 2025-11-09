"use server";
// filepath: src/lib/actions/contact-actions.ts

import { sendEmail } from "@/lib/actions/mail";

export type ContactFormData = {
  name: string;
  email: string;
  message: string;
};

export async function sendContactEmail(data: ContactFormData) {
  try {
    // Validering
    if (!data.name || !data.email || !data.message) {
      return { success: false, error: "Alla fält måste fyllas i" };
    }

    // Email validering
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(data.email)) {
      return { success: false, error: "Ogiltig e-postadress" };
    }

    // Hämta mottagare från ENV (KRÄVS!)
    const contactEmail = process.env.CONTACT_EMAIL;

    if (!contactEmail) {
      console.error("[ContactForm] CONTACT_EMAIL not configured");
      return {
        success: false,
        error:
          "Kontaktfunktionen är inte konfigurerad. Kontakta administratören.",
      };
    }

    // Skicka email
    await sendEmail({
      to: contactEmail,
      subject: `Nytt kontaktmeddelande från ${data.name}`,
      text: `
Nytt meddelande från kontaktformuläret

Namn: ${data.name}
E-post: ${data.email}

Meddelande:
${data.message}

---
Detta meddelande skickades från News Gamma kontaktformulär.
      `,
      html: `
        <div style="font-family: sans-serif; max-width: 600px;">
          <h2>Nytt kontaktmeddelande</h2>
          <p><strong>Namn:</strong> ${data.name}</p>
          <p><strong>E-post:</strong> ${data.email}</p>
          <hr>
          <h3>Meddelande:</h3>
          <p style="white-space: pre-wrap;">${data.message}</p>
          <hr>
          <p style="color: #666; font-size: 12px;">
            Detta meddelande skickades från News Gamma kontaktformulär.
          </p>
        </div>
      `,
    });

    console.log(
      `[ContactForm] Email sent to ${contactEmail} from:`,
      data.email
    );
    return { success: true };
  } catch (error) {
    console.error("[ContactForm] Error:", error);
    return {
      success: false,
      error: "Kunde inte skicka meddelandet. Försök igen senare.",
    };
  }
}
