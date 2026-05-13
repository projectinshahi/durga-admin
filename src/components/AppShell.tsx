"use client";
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState, useTransition } from 'react';
import { LogOut, Menu, X } from 'lucide-react';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [, startTransition] = useTransition();

  useEffect(() => {
    if (!loading && !user && pathname !== '/login') {
      router.push('/login');
    }
  }, [user, loading, pathname, router]);

  useEffect(() => {
    startTransition(() => {
      setIsMobileMenuOpen(false);
    });
  }, [pathname]);

  if (loading) {
    return <div className="h-screen w-full flex items-center justify-center bg-gray-50"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#b8860b]"></div></div>;
  }

  if (!user && pathname === '/login') {
    return <div className="w-full h-full overflow-auto">{children}</div>;
  }

  if (!user) return null;

  const isActive = (path: string) => pathname === path;

  return (
    <div className="flex w-full h-full flex-col md:flex-row relative">
      {/* Mobile Top Navbar */}
      <div className="md:hidden flex items-center justify-between bg-[#1a1110] text-[#c99f2b] p-5 shadow-lg flex-shrink-0 z-40 relative border-b border-[#b8860b]/30">
         <h2 className="text-xl font-serif font-bold tracking-wider uppercase">Dinorah Admin</h2>
         <button onClick={() => setIsMobileMenuOpen(true)} className="p-1 hover:bg-black/40 rounded transition-colors">
           <Menu size={28} />
         </button>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/70 z-40 md:hidden backdrop-blur-sm transition-opacity" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:static inset-y-0 left-0 w-[280px] bg-[#1a1110] text-white flex-shrink-0 flex flex-col border-r border-[#b8860b]/20 z-50 shadow-2xl transition-transform duration-300 ease-in-out md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-8 flex items-center justify-between">
          <h2 className="text-2xl font-serif font-bold text-[#c99f2b] tracking-wider uppercase">Dinorah Admin</h2>
          <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-white/50 hover:text-white p-1 hover:bg-white/10 rounded transition-colors">
             <X size={24} />
          </button>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          {/* <Link href="/" className={`block px-5 py-4 md:py-3 rounded-lg font-medium text-[14px] md:text-[13px] tracking-wide transition-colors ${isActive('/') ? 'bg-[#c99f2b] text-white shadow-md' : 'text-white/70 hover:text-white hover:bg-white/10'}`}>
            Dashboard Overview
          </Link> */}
          <Link href="/categories" className={`block px-5 py-4 md:py-3 rounded-lg font-medium text-[14px] md:text-[13px] tracking-wide transition-colors ${isActive('/categories') ? 'bg-[#c99f2b] text-white shadow-md' : 'text-white/70 hover:text-white hover:bg-white/10'}`}>
            Manage Categories
          </Link>
          <Link href="/designs" className={`block px-5 py-4 md:py-3 rounded-lg font-medium text-[14px] md:text-[13px] tracking-wide transition-colors ${isActive('/designs') ? 'bg-[#c99f2b] text-white shadow-md' : 'text-white/70 hover:text-white hover:bg-white/10'}`}>
            Featured Designs
          </Link>

        </nav>
        
        <div className="p-6 border-t border-[#b8860b]/20 flex flex-col gap-4 bg-black/20">
          <button onClick={logout} className="w-full py-4 text-red-400 hover:bg-red-500/20 hover:text-red-300 rounded-lg transition-colors flex items-center justify-center gap-2 font-bold text-[14px] md:text-[13px]">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-5 sm:p-8 md:p-12 relative h-full w-full">
        <div className="max-w-6xl mx-auto pb-16">
          {children}
        </div>
      </main>
    </div>
  );
}
