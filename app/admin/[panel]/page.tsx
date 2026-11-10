import { notFound } from 'next/navigation';
import Workspace, { panels, type Panel } from '../Workspace';
import { adminQuery } from '../views';

export default async function AdminPanel({ params, searchParams }: {
  params: Promise<{ panel: string }>; searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { panel } = await params;
  if (panel === 'home' || !Object.hasOwn(panels, panel)) notFound();
  return <Workspace panel={panel as Panel} query={adminQuery(await searchParams)} />;
}
