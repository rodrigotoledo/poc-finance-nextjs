export function PageHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <header className="mb-8">
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        {title}
      </h1>
      {description ? (
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          {description}
        </p>
      ) : null}
    </header>
  );
}
