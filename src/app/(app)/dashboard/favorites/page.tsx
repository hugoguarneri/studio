
'use client';

import { DashboardView } from '../page';
import { dashboards } from '@/lib/mock-data';

export default function FavoritesPage() {
  const favoriteDashboards = dashboards.filter(d => d.isFavorite);
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-headline">Favorites</h1>
        <p className="text-muted-foreground">Your bookmarked dashboards.</p>
      </div>
      <DashboardView dashboards={favoriteDashboards} />
    </div>
  );
}
