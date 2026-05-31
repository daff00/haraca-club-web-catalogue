/**
 * WhatsApp message builder utilities
 */

const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";

export function buildWaUrl(message: string): string {
  const encoded = encodeURIComponent(message.trim());
  return `https://wa.me/${WA_NUMBER}?text=${encoded}`;
}

export function buildProductMessage({
  productName,
  size,
  color,
  quantity,
}: {
  productName: string;
  size: string;
  color: string;
  quantity: number;
}): string {
  return `Halo Haraca! Saya tertarik dengan produk ini:

Produk : ${productName}
Ukuran : ${size}
Warna  : ${color}
Jumlah : ${quantity}

Boleh minta info ketersediaan dan pengiriman?`;
}

export function buildContactFormMessage({
  name,
  phone,
  topic,
  message,
}: {
  name: string;
  phone: string;
  topic: string;
  message: string;
}): string {
  return `Halo Haraca! Saya ingin menghubungi kalian.

Nama    : ${name}
WA      : ${phone}
Topik   : ${topic}
Pesan   :
${message}`;
}

export function buildCustomSablonMessage(): string {
  return `Halo Haraca! Saya tertarik dengan layanan Custom Sablon.

Boleh minta info lebih lanjut mengenai:
- Minimum order
- Pilihan bahan
- Estimasi harga
- Proses pemesanan

Terima kasih!`;
}
