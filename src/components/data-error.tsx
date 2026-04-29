export function DataError({ message }: { message: string }) {
  return (
    <div
      className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200"
      role="alert"
    >
      <p className="font-medium">Não foi possível carregar os dados</p>
      <p className="mt-1 font-mono text-xs opacity-90">{message}</p>
      <p className="mt-2 text-xs opacity-80">
        Confirme que o Rails está a correr e que{" "}
        <code className="rounded bg-red-100 px-1 dark:bg-red-900/50">
          RAILS_INTERNAL_URL
        </code>{" "}
        /{" "}
        <code className="rounded bg-red-100 px-1 dark:bg-red-900/50">
          NEXT_PUBLIC_RAILS_URL
        </code>{" "}
        estão corretos.
      </p>
    </div>
  );
}
