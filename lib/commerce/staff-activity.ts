import { randomUUID } from 'node:crypto';
import { db } from './database';

export async function recordStaffActivity(action: string, subject: string) {
  await db().prepare('INSERT INTO staff_activity (id,action,subject,created) VALUES (?,?,?,?)')
    .run(randomUUID(), action, subject, Date.now());
}
