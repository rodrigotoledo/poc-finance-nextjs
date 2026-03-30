import { getRequestConfig } from 'next-intl/server';
import ptBR from '../src/messages/pt-BR.json';

export default getRequestConfig(async () => {
  return {
    locale: 'pt-BR',
    messages: ptBR,
  };
});

