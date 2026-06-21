import Navbar from './Navbar';

interface PageLayoutProps {
  user: { name: string; role: string; email: string };
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '6xl' | '7xl';
  children: React.ReactNode;
}

const WIDTH_CLASSES: Record<string, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '4xl': 'max-w-4xl',
  '6xl': 'max-w-6xl',
  '7xl': 'max-w-7xl',
};

export default function PageLayout({ user, maxWidth = '6xl', children }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />
      <div className={`${WIDTH_CLASSES[maxWidth]} mx-auto px-4 sm:px-6 lg:px-8 py-8`}>
        {children}
      </div>
    </div>
  );
}
