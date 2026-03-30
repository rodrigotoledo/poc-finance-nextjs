'use client';

import { useTranslations } from 'next-intl';

/**
 * Thin wrappers so the rest of the app doesn't import next-intl directly everywhere.
 * Keeps translations centralized and easy to swap later.
 */
export function useTEntity() {
  return useTranslations('entity');
}

export function useTUI() {
  return useTranslations('ui');
}

