'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, BarChart3, List, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export function Navigation() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  const links = [
    { href: '/kanban', label: 'Kanban Board', icon: LayoutGrid },
    { href: '/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/applications', label: 'Applications', icon: List },
  ];

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/kanban" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">JT</span>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Job Tracker
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            {links.map(link => {
              const Icon = link.icon;
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <Icon size={20} />
                  <span className="hidden md:inline">{link.label}</span>
                </Link>
              );
            })}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
