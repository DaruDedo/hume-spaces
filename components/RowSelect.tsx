'use client';

import { Children, isValidElement, useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import styles from './RowSelect.module.css';
import { propertySearchTerm } from '@/lib/property-search-term';

type Option = { value?: string | number; children?: ReactNode; disabled?: boolean };

export default function RowSelect({ children, name, value, defaultValue, required, disabled, onValueChange, searchPlaceholder, onAddOption, resultLimit, overlay }: {
  children: ReactNode;
  name?: string;
  value?: string | number;
  defaultValue?: string | number;
  required?: boolean;
  disabled?: boolean;
  onValueChange?: (value: string) => void;
  searchPlaceholder?: string;
  onAddOption?: (term: string) => void;
  resultLimit?: number;
  overlay?: boolean;
}) {
  const options = Children.toArray(children).filter(isValidElement<Option>).map(({ props }) => ({
    ...props,
    value: String(props.value ?? props.children),
  }));
  const initial = String(defaultValue ?? options[0]?.value ?? '');
  const [current, setCurrent] = useState(initial);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const search = useRef<HTMLInputElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const native = useRef<HTMLSelectElement>(null);
  const list = useRef<HTMLSpanElement>(null);
  const listId = useId();
  const selected = String(value ?? current);
  const term = query.trim().replace(/\s+/g, ' ');
  const normalized = term.toLocaleLowerCase();
  const matches = options.filter(option =>
    (option.value !== '' || (!required && name)) && String(option.children).toLocaleLowerCase().includes(normalized));
  const canAdd = onAddOption && propertySearchTerm(term)
    && !options.some(option => String(option.children).toLocaleLowerCase() === normalized);

  useEffect(() => {
    const form = native.current?.form;
    const reset = () => { setCurrent(initial); setOpen(false); };
    form?.addEventListener('reset', reset);
    return () => form?.removeEventListener('reset', reset);
  }, [initial]);

  useEffect(() => {
    if (!open) return;
    const target = list.current?.querySelector<HTMLButtonElement>('[aria-selected="true"]:not(:disabled)')
      ?? list.current?.querySelector<HTMLButtonElement>('button:not(:disabled)');
    (search.current ?? target)?.focus({ preventScroll: overlay });
    if (overlay && list.current && target) {
      const menu = list.current;
      menu.scrollTop = Math.max(0, target.offsetTop + target.offsetHeight - menu.clientHeight);
    }
  }, [open, overlay]);

  function close() {
    setOpen(false);
    setQuery('');
    trigger.current?.focus({ preventScroll: overlay });
  }

  function navigate(event: KeyboardEvent<HTMLSpanElement>) {
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
      return;
    }
    const rows = Array.from(list.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)') ?? []);
    const currentIndex = rows.indexOf(document.activeElement as HTMLButtonElement);
    let next: HTMLButtonElement | undefined;
    switch (event.key) {
      case 'ArrowDown': next = rows[Math.min(currentIndex + 1, rows.length - 1)]; break;
      case 'ArrowUp': next = rows[Math.max(currentIndex - 1, 0)]; break;
      case 'Home': next = rows[0]; break;
      case 'End': next = rows.at(-1); break;
      default:
        if (event.key.length === 1 && event.key !== ' ' && !event.ctrlKey && !event.metaKey && !event.altKey) {
          const ordered = [...rows.slice(currentIndex + 1), ...rows.slice(0, currentIndex + 1)];
          next = ordered.find(row => row.textContent?.trim().toLowerCase().startsWith(event.key.toLowerCase()));
        }
    }
    if (next) {
      event.preventDefault();
      next.focus();
    }
  }

  return <span className={styles.picker} data-overlay={overlay || undefined} onBlur={event => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setOpen(false);
      setQuery('');
    }
  }}>
    <button className={styles.trigger} type="button" ref={trigger} disabled={disabled}
      aria-haspopup="listbox" aria-expanded={open} aria-controls={listId}
      onClick={() => setOpen(!open)} onKeyDown={event => {
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
          event.preventDefault();
          setOpen(true);
        }
      }}>
      <span>{options.find(option => option.value === selected)?.children}</span>
      <span aria-hidden="true" className={styles.arrow} />
    </button>
    <select ref={native} className={styles.native} name={name} value={selected} required={required}
      disabled={disabled} tabIndex={-1} aria-hidden="true" onChange={() => {}}
      onInvalid={event => {
        event.preventDefault();
        trigger.current?.focus();
        setOpen(true);
      }}>{children}</select>
    {open && searchPlaceholder && <input ref={search} className={styles.search} type="search"
      aria-label={searchPlaceholder} placeholder={searchPlaceholder} value={query} maxLength={60}
      onChange={event => { event.stopPropagation(); setQuery(event.target.value); }}
      onKeyDown={event => {
        if (event.key === 'Enter') event.preventDefault();
        if (event.key === 'Escape') close();
        if (event.key === 'ArrowDown') {
          event.preventDefault();
          list.current?.querySelector<HTMLButtonElement>('button:not(:disabled)')?.focus();
        }
      }} />}
    <span id={listId} ref={list} role="listbox" aria-label="Options" className={styles.list} hidden={!open} onKeyDown={navigate}>
      {open && matches.slice(0, resultLimit ?? matches.length).map(option => (
        <button type="button" role="option" tabIndex={-1} key={option.value}
          aria-selected={option.value === selected} disabled={option.disabled}
          onMouseDown={event => event.preventDefault()}
          onClick={() => {
            setCurrent(option.value);
            onValueChange?.(option.value);
            close();
          }}>
          {option.children}
        </button>
      ))}
    </span>
    {open && resultLimit !== undefined && matches.length > resultLimit &&
      <small role="status">Showing {resultLimit} of {matches.length}. Search to narrow the list.</small>}
    {open && canAdd && <button type="button" className={styles.trigger} onMouseDown={event => event.preventDefault()}
      onClick={() => { onAddOption?.(term); close(); }}>Add “{term}”</button>}
    {open && matches.length === 0 && !canAdd && <span role="status">No matching options.</span>}
  </span>;
}
