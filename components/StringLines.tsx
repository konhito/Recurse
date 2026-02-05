"use client";

import { useMemo } from "react";

export default function StringLines() {
    // Generate random properties for each line
    const lines = useMemo(() => {
        return Array.from({ length: 120 }, (_, i) => ({
            id: i,
            left: `${(i / 120) * 100}%`,
            opacity: 0.06, // Fixed opacity for all lines
        }));
    }, []);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {lines.map((line) => (
                <div
                    key={line.id}
                    className="absolute top-0 bottom-0 w-px"
                    style={{
                        left: line.left,
                        background: `linear-gradient(to bottom, 
                            rgba(255, 255, 255, ${line.opacity}) 0%, 
                            rgba(255, 255, 255, ${line.opacity}) 70%, 
                            rgba(255, 255, 255, ${line.opacity * 0.5}) 85%, 
                            transparent 100%)`,
                    }}
                />
            ))}
        </div>
    );
}
