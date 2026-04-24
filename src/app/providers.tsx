"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {queryClient} from "@/src/lib/queryClient";
import {Toaster} from "react-hot-toast";

export function Providers({ children }: { children: React.ReactNode }) {

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            <Toaster
                position="top-center"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: '#18181b',
                        color: '#ededed',
                        border: '1px solid #3f3f46',
                    },
                }}
            />
            <ReactQueryDevtools initialIsOpen={false} />

        </QueryClientProvider>
    );
}