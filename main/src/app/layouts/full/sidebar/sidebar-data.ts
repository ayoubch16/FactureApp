import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    navCap: 'Home',
  },
  {
    displayName: 'Dashboard',
    iconName: 'solar:atom-line-duotone',
    route: '/dashboard',
  },
  {
    displayName: 'Devis',
    iconName: 'hugeicons:invoice',
    route: '/devis',
  },
  {
    displayName: 'Factures',
    iconName: 'hugeicons:invoice',
    route: '/factures',
  },
  {
    displayName: 'BL',
    iconName: 'hugeicons:invoice',
    route: '/bl',
  },
  {
    displayName: 'Clients',
    iconName: 'clarity:users-line',
    route: '/clients',
  },
  {
    displayName: 'Articles',
    iconName: 'fluent-mdl2:product-variant',
    route: '/articles',
  },
  {
    displayName: 'Login',
    iconName: 'solar:lock-keyhole-minimalistic-line-duotone',
    route: '/authentication/login',
  },
];
