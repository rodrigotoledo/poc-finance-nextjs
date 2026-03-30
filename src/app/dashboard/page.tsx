import { DashboardContent } from "@/components/dashboard/dashboard-content";
import { LiveFeed } from "@/components/dashboard/live-feed";
import { PageHeader } from "@/components/page-header";
import { Suspense } from 'react';
import { tUI } from "@/lib/i18n/ui";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title={tUI('dashboard.header.title')}
        description={tUI('dashboard.header.description')}
      />
      <Suspense fallback={<div>{tUI('common.loading')}</div>}>
        <DashboardContent />
      </Suspense>
      <LiveFeed />
    </div>
  );
}
