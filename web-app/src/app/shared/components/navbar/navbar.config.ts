import type { IconName } from '../icon/icon';

export interface NavbarItem {
  readonly label: string;
  readonly icon: IconName;
  readonly route: string | null;
  readonly enabled: boolean;
  readonly active?: boolean;
}

export const navbarItems: readonly NavbarItem[] = [
  { label: 'Panel', icon: 'grid', route: '/tasks', enabled: true, active: true },
  { label: 'Calendario', icon: 'calendar', route: null, enabled: false },
  { label: 'Reportes', icon: 'chart', route: null, enabled: false },
  { label: 'Configuración', icon: 'settings', route: null, enabled: false },
];
