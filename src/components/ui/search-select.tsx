"use client";

import { useState } from "react";
import {
  Combobox,
  ComboboxInput,
  ComboboxOptions,
  ComboboxOption,
} from "@headlessui/react";
import { inputCls } from "@/components/ui/field";

export interface SelectOption {
  value: string;
  label: string;
  sublabel?: string;
}

interface SearchSelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  /** Chamado a cada keystroke — use para disparar fetch com debounce no pai. */
  onQueryChange?: (query: string) => void;
  isLoading?: boolean;
  /** Número mínimo de caracteres para mostrar resultados (default: 3). */
  minChars?: number;
  placeholder?: string;
  nullable?: boolean;
  nullLabel?: string;
}

export function SearchSelect({
  options,
  value,
  onChange,
  onQueryChange,
  isLoading = false,
  minChars = 3,
  placeholder = "Buscar…",
  nullable = false,
  nullLabel = "Nenhum",
}: SearchSelectProps) {
  const [query, setQuery] = useState("");

  const selected = options.find((o) => o.value === value) ?? null;

  const handleInput = (raw: string) => {
    setQuery(raw);
    onQueryChange?.(raw);
  };

  const handleClose = () => {
    setQuery("");
    onQueryChange?.("");
  };

  const belowMin = query.length > 0 && query.length < minChars;
  const readyToSearch = query.length >= minChars;

  return (
    <Combobox
      value={value}
      onChange={(v: string | null) => onChange(v ?? "")}
      onClose={handleClose}
    >
      <div className="relative">
        <ComboboxInput
          className={inputCls}
          displayValue={() => selected?.label ?? ""}
          onChange={(e) => handleInput(e.target.value)}
          placeholder={placeholder}
          autoComplete="off"
        />
        <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-zinc-400">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
            <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06z" clipRule="evenodd" />
          </svg>
        </span>

        <ComboboxOptions
          anchor="bottom start"
          className="z-50 mt-1 w-(--input-width) overflow-auto rounded-lg border border-zinc-200 bg-white py-1 text-sm shadow-lg dark:border-zinc-700 dark:bg-zinc-900 [--anchor-gap:4px]"
        >
          {belowMin ? (
            <div className="px-3 py-2 text-zinc-400">
              Digite ao menos {minChars} caracteres…
            </div>
          ) : isLoading ? (
            <div className="px-3 py-2 text-zinc-400">Buscando…</div>
          ) : readyToSearch && options.length === 0 ? (
            <div className="px-3 py-2 text-zinc-400">Nenhum resultado.</div>
          ) : (
            <>
              {nullable && (
                <ComboboxOption
                  value=""
                  className="cursor-pointer px-3 py-2 text-zinc-500 data-focus:bg-zinc-50 dark:text-zinc-400 dark:data-focus:bg-zinc-800"
                >
                  {nullLabel}
                </ComboboxOption>
              )}
              {options.map((o) => (
                <ComboboxOption
                  key={o.value}
                  value={o.value}
                  className="cursor-pointer px-3 py-2 data-focus:bg-indigo-50 data-focus:text-indigo-700 dark:data-focus:bg-indigo-950 dark:data-focus:text-indigo-300"
                >
                  <span className="font-medium">{o.label}</span>
                  {o.sublabel && (
                    <span className="ml-2 text-xs text-zinc-400">{o.sublabel}</span>
                  )}
                </ComboboxOption>
              ))}
            </>
          )}
        </ComboboxOptions>
      </div>
    </Combobox>
  );
}
