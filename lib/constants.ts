export const ROLE_REDIRECTS: Record<string, string> = {
  ADMIN: '/admin/dashboard',
  VENDOR: '/vendor/dashboard',
  END_USER: '/marketplace',
};

export const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Admin',
  VENDOR: 'Vendor',
  END_USER: 'User',
};

export const ROLE_BADGE_COLORS: Record<string, string> = {
  ADMIN: 'bg-purple-100 text-purple-700',
  VENDOR: 'bg-emerald-100 text-emerald-700',
  END_USER: 'bg-sky-100 text-sky-700',
};
