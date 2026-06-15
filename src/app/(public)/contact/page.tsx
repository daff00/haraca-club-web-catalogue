import { getContactInfo } from "@/actions/contact";
import { ContactHero } from "@/components/public/contact/ContactHero";
import { ContactInfo } from "@/components/public/contact/ContactInfo";
import { ContactForm } from "@/components/public/contact/ContactForm";
import type { OperatingHours } from "@/types";

export default async function ContactPage() {
  const contact = await getContactInfo();
  const hours = contact?.operatingHours as OperatingHours | undefined;

  return (
    <>
      <ContactHero />

      <section className="py-[80px] bg-[var(--color-bg)]">
        <div className="content-wrapper">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <ContactInfo contact={contact} hours={hours} />
            <ContactForm waNumber={contact?.whatsapp ?? ""} />
          </div>
        </div>
      </section>
    </>
  );
}