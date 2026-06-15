"use client";

import { useState } from "react";
import { buildWaUrl, buildContactFormMessage } from "@/lib/wa";

const TOPICS = [
  "Ask about product",
  "Ask about sizing",
  "Custom print",
  "Order complaint",
  "Collaboration",
];

interface Props {
  waNumber: string;
}

export function ContactForm({ waNumber }: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [topic, setTopic] = useState(TOPICS[0]);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Name is required";
    if (!phone.trim()) e.phone = "WhatsApp number is required";
    if (!message.trim()) e.message = "Message is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    const waMessage = buildContactFormMessage({ name, phone, topic, message });
    const url = buildWaUrl(waMessage);
    window.open(url, "_blank");
  }

  return (
    <div>
      <p className="font-sans text-xs uppercase tracking-[0.3em] text-[var(--color-accent)] mb-6">
        Send a Message
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">

        {/* Name */}
        <div className="flex flex-col gap-1.5">
          <label className="font-sans text-xs uppercase tracking-wider text-[var(--color-text-muted)]">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className={`bg-transparent border-b py-3 font-sans text-sm text-[var(--color-text)] placeholder:text-[var(--color-border)] focus:outline-none transition-colors ${
              errors.name
                ? "border-red-500"
                : "border-[var(--color-border)] focus:border-[var(--color-text)]"
            }`}
          />
          {errors.name && (
            <p className="font-sans text-xs text-red-500">{errors.name}</p>
          )}
        </div>

        {/* WhatsApp */}
        <div className="flex flex-col gap-1.5">
          <label className="font-sans text-xs uppercase tracking-wider text-[var(--color-text-muted)]">
            WhatsApp Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="08xxxxxxxxxx"
            className={`bg-transparent border-b py-3 font-sans text-sm text-[var(--color-text)] placeholder:text-[var(--color-border)] focus:outline-none transition-colors ${
              errors.phone
                ? "border-red-500"
                : "border-[var(--color-border)] focus:border-[var(--color-text)]"
            }`}
          />
          {errors.phone && (
            <p className="font-sans text-xs text-red-500">{errors.phone}</p>
          )}
        </div>

        {/* Topic */}
        <div className="flex flex-col gap-1.5">
          <label className="font-sans text-xs uppercase tracking-wider text-[var(--color-text-muted)]">
            Topic
          </label>
          <select
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="bg-transparent border-b border-[var(--color-border)] py-3 font-sans text-sm text-[var(--color-text)] focus:outline-none focus:border-[var(--color-text)] transition-colors cursor-pointer"
          >
            {TOPICS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Message */}
        <div className="flex flex-col gap-1.5">
          <label className="font-sans text-xs uppercase tracking-wider text-[var(--color-text-muted)]">
            Message <span className="text-red-500">*</span>
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell us what's on your mind..."
            rows={5}
            className={`bg-transparent border-b py-3 font-sans text-sm text-[var(--color-text)] placeholder:text-[var(--color-border)] focus:outline-none transition-colors resize-none ${
              errors.message
                ? "border-red-500"
                : "border-[var(--color-border)] focus:border-[var(--color-text)]"
            }`}
          />
          {errors.message && (
            <p className="font-sans text-xs text-red-500">{errors.message}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="mt-2 bg-[var(--color-text)] text-[var(--color-bg)] font-sans text-sm font-medium py-4 hover:bg-[var(--color-brown-dark)] transition-colors"
        >
          Send via WhatsApp →
        </button>

        <p className="font-sans text-xs text-[var(--color-text-muted)] text-center">
          Submitting will open WhatsApp with your message pre-filled.
        </p>

      </form>
    </div>
  );
}