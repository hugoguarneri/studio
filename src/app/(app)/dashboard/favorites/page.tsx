
'use client';

import { DashboardView, ViewMode } from '../page';
import { dashboards } from '@/lib/mock-data';

export default function FavoritesPage({ viewMode }: { viewMode: ViewMode }) {
  const favoriteDashboards = dashboards.filter(d => d.isFavorite);
  return <DashboardView dashboards={favoriteDashboards} viewMode={viewMode} />;
}
