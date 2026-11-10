'use client';

import { useRef } from 'react';
import RowSelect from '@/components/RowSelect';
import { savePeriod } from './actions';
import { periods, type PeriodPanel } from './periods';

export default function PeriodPicker({ panel, period, search, status }: {
  panel: PeriodPanel; period: string; search?: string; status?: string;
}) {
  const field = useRef<HTMLInputElement>(null);
  return <form action={savePeriod} className="admin-period">
    <input type="hidden" name="panel" value={panel} />
    <input type="hidden" name="q" value={search ?? ''} />
    <input type="hidden" name="status" value={status ?? ''} />
    <input type="hidden" name="period" ref={field} />
    <label>Date range
      <RowSelect overlay value={period} onValueChange={value => {
        if (value === period || !field.current) return;
        field.current.value = value;
        field.current.form?.requestSubmit();
      }}>
        {periods.map(([value, title]) => <option key={value} value={value}>{title}</option>)}
      </RowSelect>
    </label>
  </form>;
}
