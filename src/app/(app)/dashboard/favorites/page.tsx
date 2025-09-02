
'use client';

import { DashboardView } from '../page';
import { dashboards } from '@/lib/mock-data';

export default function FavoritesPage() {
  const favoriteDashboards = dashboards.filter(d => d.isFavorite);
  return <DashboardView dashboards={favoriteDashboards} />;
}
