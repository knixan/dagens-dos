import { sendContactEmail } from "@/lib/actions/contact-actions";
import ContactFormClient from "./ContactFormClient";

export default function ContactFormWrapper() {
  return <ContactFormClient sendEmailAction={sendContactEmail} />;
}
