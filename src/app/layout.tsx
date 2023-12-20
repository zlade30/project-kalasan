import './globals.css';
import { montserrat } from './font';
import type { Metadata } from 'next';
import { ReduxProvider } from '@/redux/provider';

export const metadata: Metadata = {
    title: 'Project Kalasan'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={montserrat.className}>
                <ReduxProvider>{children}</ReduxProvider>
            </body>
        </html>
    );
}
