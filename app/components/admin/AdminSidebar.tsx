'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const AdminSidebar: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { href: '/admin/dashboard', label: 'Projects' },
    { href: '/admin/categories', label: 'Categories' },
  ];

  const baseClasses = "w-full text-left px-4 py-3 rounded-xl transition-colors duration-200";
  const activeClasses = "bg-purple-700 text-white";
  const inactiveClasses = "text-gray-300 hover:bg-purple-800 hover:text-white";

  return (
    <aside className="w-64 bg-gray-900 text-white p-4 flex-col hidden md:flex">
      <div className="mb-8 text-center">
        <Link href="/admin/dashboard">
          <h2 className="text-2xl font-bold">Admin Panel</h2>
        </Link>
      </div>
      <nav className="flex flex-col space-y-2">
        {navItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={`${baseClasses} ${pathname === item.href ? activeClasses : inactiveClasses}`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
