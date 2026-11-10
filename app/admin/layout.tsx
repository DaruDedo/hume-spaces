import type { Metadata } from 'next';
import './admin.css';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Store admin', robots: { index: false, follow: false } };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <main id="main" className="admin-workspace">{children}</main>;
}
