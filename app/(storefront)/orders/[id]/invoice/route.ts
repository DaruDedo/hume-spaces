import { db, validId } from '@/lib/commerce/store';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!validId(id)) return new Response(null, { status: 404 });
  const invoice = await db().prepare('SELECT pdf FROM order_invoices WHERE order_id=?').get(id) as { pdf: Uint8Array } | undefined;
  if (!invoice) return new Response(null, { status: 404 });
  return new Response(Uint8Array.from(invoice.pdf), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="hume-gst-invoice.pdf"',
      'Cache-Control': 'private, no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
