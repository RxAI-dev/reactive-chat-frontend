import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'RxT-Beta | Reactive AI Chatbot',
  description:
    'Experience the future of conversational AI with RxT-Beta - the first real-scale Reactive Language Model with infinite memory, real-time processing, and event-driven architecture.',
  keywords: [
    'RxT-Beta',
    'Reactive AI',
    'Reactive Transformer',
    'RxLM',
    'Reactive Language Model',
    'AI Chatbot',
    'Event-Driven AI',
    'Infinite Context',
    'Mixture-of-Memory',
  ],
  authors: [{ name: 'Reactive AI' }],
  openGraph: {
    title: 'RxT-Beta | Reactive AI Chatbot',
    description: 'The first real-scale Reactive Language Model with infinite memory and context',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
