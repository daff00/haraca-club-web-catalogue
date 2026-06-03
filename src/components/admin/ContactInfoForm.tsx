"use client";

import { useState } from "react";
import { toast } from "sonner";
import { updateContactInfo } from "@/actions/contact";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface Props {
  contact: {
    whatsapp: string;
    instagram: string;
    tiktok: string;
    shopee: string;
    tokopedia: string;
    email?: string | null;
    operatingHours: unknown;
  } | null;
}

export function ContactInfoForm({ contact }: Props) {
  const hours = contact?.operatingHours as
    | { weekdays: string; weekend: string }
    | undefined;

  const [whatsapp, setWhatsapp] = useState(contact?.whatsapp ?? "");
  const [instagram, setInstagram] = useState(contact?.instagram ?? "");
  const [tiktok, setTiktok] = useState(contact?.tiktok ?? "");
  const [shopee, setShopee] = useState(contact?.shopee ?? "");
  const [tokopedia, setTokopedia] = useState(contact?.tokopedia ?? "");
  const [email, setEmail] = useState(contact?.email ?? "");
  const [weekdays, setWeekdays] = useState(
    hours?.weekdays ?? "Monday – Saturday: 09.00 – 18.00 WIB"
  );
  const [weekend, setWeekend] = useState(
    hours?.weekend ?? "Sunday & Public Holidays: Slow response"
  );
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await updateContactInfo({
        whatsapp,
        instagram,
        tiktok,
        shopee,
        tokopedia,
        email: email || "",
        operatingHours: { weekdays, weekend },
      });

      if (res.success) toast.success("Contact info saved");
      else toast.error(res.error || "Failed to save");
    } catch (err: any) {
      toast.error(err?.message ?? "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-5 space-y-5">
      {/* First row: 2 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-[var(--color-text)] mb-1.5">
            WhatsApp Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            placeholder="628XXXXXXXXXX"
            className="w-full rounded-[var(--radius-input)] border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
            required
          />
          <p className="text-xs text-[var(--color-text-muted)] mt-1">
            Include country code, no + or spaces
          </p>
        </div>

        <div>
          <label className="block text-xs font-medium text-[var(--color-text)] mb-1.5">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="hello@haraca.id"
            className="w-full rounded-[var(--radius-input)] border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[var(--color-text)] mb-1.5">
            Instagram <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
            placeholder="@haraca"
            className="w-full rounded-[var(--radius-input)] border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[var(--color-text)] mb-1.5">
            TikTok <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={tiktok}
            onChange={(e) => setTiktok(e.target.value)}
            placeholder="@haraca"
            className="w-full rounded-[var(--radius-input)] border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[var(--color-text)] mb-1.5">
            Shopee URL <span className="text-red-500">*</span>
          </label>
          <input
            type="url"
            value={shopee}
            onChange={(e) => setShopee(e.target.value)}
            placeholder="https://shopee.co.id/..."
            className="w-full rounded-[var(--radius-input)] border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[var(--color-text)] mb-1.5">
            Tokopedia URL <span className="text-red-500">*</span>
          </label>
          <input
            type="url"
            value={tokopedia}
            onChange={(e) => setTokopedia(e.target.value)}
            placeholder="https://tokopedia.com/..."
            className="w-full rounded-[var(--radius-input)] border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
            required
          />
        </div>
      </div>

      {/* Separator + Operating Hours */}
      <div className="border-t border-[var(--color-border)] pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-[var(--color-text)] mb-1.5">
              Weekday Hours <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={weekdays}
              onChange={(e) => setWeekdays(e.target.value)}
              placeholder="Monday – Saturday: 09.00 – 18.00 WIB"
              className="w-full rounded-[var(--radius-input)] border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--color-text)] mb-1.5">
              Weekend / Holiday Hours <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={weekend}
              onChange={(e) => setWeekend(e.target.value)}
              placeholder="Sunday & Public Holidays: Slow response"
              className="w-full rounded-[var(--radius-input)] border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
              required
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end pt-2 border-t border-[var(--color-border)]">
        <Button
          type="submit"
          disabled={saving}
          className="bg-[var(--color-text)] text-[var(--color-bg)] hover:opacity-90 px-5 inline-flex items-center gap-2"
        >
          {saving ? (
            <>
              <div className="w-4 h-4 border-2 border-[var(--color-bg)] border-t-transparent rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save size={16} />
              Save Contact Info
            </>
          )}
        </Button>
      </div>
    </form>
  );
}