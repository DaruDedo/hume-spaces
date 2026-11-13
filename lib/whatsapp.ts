export const whatsappNumber='919559024822';
export function whatsappMessageUrl(message: string) {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}
export function whatsappUrl(topic='commercial scenting'){return whatsappMessageUrl(`Hi HUME Spaces, I’m interested in ${topic}. Please share details, pricing and availability.`);}
