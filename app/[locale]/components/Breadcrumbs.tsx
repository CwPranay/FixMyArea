'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { useLocale } from 'next-intl';

export default function Breadcrumbs() {
    const pathname = usePathname();
    const locale = useLocale();

    // Handle null pathname
    if (!pathname) return null;

    // Remove locale from pathname and split
    const pathWithoutLocale = pathname.replace(`/${locale}`, '');
    const paths = pathWithoutLocale.split('/').filter((path) => path);

    // Don't show breadcrumbs on home page
    if (paths.length === 0) return null;

    const formatLabel = (str: string) => {
        return str
            .split('-')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    return (
        <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 py-3 px-4 sm:px-6 [font-family:var(--font-poppins)]">
            <div className="max-w-7xl mx-auto">
                <ol className="flex items-center space-x-2 text-sm">
                    <li>
                        <Link
                            href={`/${locale}`}
                            className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
                        >
                            <Home className="w-4 h-4" />
                        </Link>
                    </li>

                    {paths.map((path, index) => {
                        const href = `/${locale}/${paths.slice(0, index + 1).join('/')}`;
                        const isLast = index === paths.length - 1;

                        return (
                            <li key={path} className="flex items-center space-x-2">
                                <ChevronRight className="w-4 h-4 text-gray-400" />
                                {isLast ? (
                                    <span className="text-blue-600 font-medium">{formatLabel(path)}</span>
                                ) : (
                                    <Link
                                        href={href}
                                        className="text-gray-600 hover:text-blue-600 transition-colors"
                                    >
                                        {formatLabel(path)}
                                    </Link>
                                )}
                            </li>
                        );
                    })}
                </ol>
            </div>
        </nav>
    );
}
