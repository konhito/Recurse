import { ReactNode } from "react";

export default function AppLayout({ children }: { children: ReactNode }) {
    return (
        <main className="min-h-screen bg-zinc-950 flex justify-center">
            <div className="w-full max-w-3xl px-6 py-12 md:py-20">
                {children}
            </div>
        </main>
    );
}
