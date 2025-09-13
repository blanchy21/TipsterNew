'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

interface QueryProviderProps {
    children: React.ReactNode;
}

export default function QueryProvider({ children }: QueryProviderProps) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        // Cache for 5 minutes by default
                        staleTime: 5 * 60 * 1000,
                        // Keep in cache for 10 minutes
                        gcTime: 10 * 60 * 1000,
                        // Retry failed requests 2 times
                        retry: 2,
                        // Don't refetch on window focus by default
                        refetchOnWindowFocus: false,
                        // Don't refetch on reconnect by default
                        refetchOnReconnect: 'always',
                    },
                    mutations: {
                        // Retry mutations once
                        retry: 1,
                    },
                },
            })
    );

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            {/* Only show devtools in development */}
            {process.env.NODE_ENV === 'development' && (
                <ReactQueryDevtools initialIsOpen={false} />
            )}
        </QueryClientProvider>
    );
}
