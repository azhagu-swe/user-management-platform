import React from 'react';
import {
  Home,
  // Tv,
  // LayoutGrid,
  // Settings,
  User,
  ShieldCheck,
  KeyRound,
  Users,
} from 'lucide-react';

export const drawerWidth = 240;

// Define Roles (Example - match your backend roles)
export type UserRole = 'admin' | 'instructor' | 'SuperAdmin' | 'AccountAdmin' | 'guest';

export interface NavItem {
  text: string;
  icon: React.ReactNode;
  href: string;
  /** Roles allowed to see this item. If undefined, visible to all authenticated. */
  roles?: UserRole[];
  /** If true, visible even if not authenticated */
  public?: boolean;
}

export const mainNavItems: NavItem[] = [
  {
    text: 'Home',
    icon: React.createElement(Home, { size: 20 }),
    href: '/',
    public: true,
  },
    {
    text: 'User Management',
    icon: React.createElement(Users  , { size: 20 }),
    href: '/admin/users',
    roles: ['SuperAdmin','AccountAdmin'],
  },
  {
    text: 'Role Management',
    icon: React.createElement(ShieldCheck , { size: 20 }),
    href: '/roles',
    roles: ['SuperAdmin','AccountAdmin'],
  },
   {
    text: 'Permission',
    icon: React.createElement(KeyRound , { size: 20 }),
    href: '/permissions',
    roles: ['SuperAdmin','AccountAdmin'],
  },
 

  // {
  //   text: 'List2',
  //   icon: React.createElement(Tv, { size: 20 }),
  //   href: '/List2',
  //   public: true,
  // },
  // {
  //   text: 'List3',
  //   icon: React.createElement(LayoutGrid, { size: 20 }),
  //   href: '/List3',
  //   public: true,
  // },
  // {
  //   text: 'Admin Panel',
  //   icon: React.createElement(ShieldCheck, { size: 20 }),
  //   href: '/admin',
  //   roles: ['admin','SuperAdmin'],
  // }, // Admin only
];

export const secondaryNavItems: NavItem[] = [
  {
    text: 'Profile',
    icon: React.createElement(User, { size: 20 }),
    href: '/settings/profile',
  },
  // {
  //   text: 'Settings',
  //   icon: React.createElement(Settings, { size: 20 }),
  //   href: '/settings',
  // },
];
