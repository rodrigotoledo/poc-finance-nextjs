'use client';

import { useState } from 'react';
import { tUI } from '@/lib/i18n/ui';

export type CrudTab = 'overview' | 'list' | 'create';

type Props = {
  /** Conteúdo da aba Visão geral (cards + gráficos). */
  overview: React.ReactNode;
  /** Tabela / lista paginada. */
  list: React.ReactNode;
  /** Formulário de criação (ou painel equivalente). */
  form: React.ReactNode;
  /** Aba inicial. */
  defaultTab?: CrudTab;
};

const tabClass = (active: boolean) =>
  `rounded-lg px-3 py-1.5 text-sm font-medium transition ${
    active
      ? 'bg-indigo-600 text-white dark:bg-indigo-500'
      : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
  }`;

export function CrudWorkspace({ overview, list, form, defaultTab = 'overview' }: Props) {
  const [tab, setTab] = useState<CrudTab>(defaultTab);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 rounded-xl border border-zinc-200 bg-white p-2 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <button type="button" className={tabClass(tab === 'overview')} onClick={() => setTab('overview')}>
          {tUI('crud.tabs.overview')}
        </button>
        <button type="button" className={tabClass(tab === 'list')} onClick={() => setTab('list')}>
          {tUI('crud.tabs.list')}
        </button>
        <button type="button" className={tabClass(tab === 'create')} onClick={() => setTab('create')}>
          {tUI('crud.tabs.create')}
        </button>
      </div>

      {tab === 'overview' && <div className="space-y-4">{overview}</div>}
      {tab === 'list' && list}
      {tab === 'create' && form}
    </div>
  );
}
