import Workspace from './Workspace';
import { adminQuery } from './views';

export default async function AdminPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  return <Workspace panel="home" query={adminQuery(await searchParams)} />;
}
