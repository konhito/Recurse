import { useMemo, useState } from "react";
import { Problem } from "@/lib/types";
import { clsx } from "clsx";

interface ProgressHeatmapProps {
    problems: Problem[];
}

export default function ProgressHeatmap({ problems }: ProgressHeatmapProps) {
    // 1. Process data to find all completion dates
    const activityMap = useMemo(() => {
        const map: Record<string, number> = {};
        problems.forEach((problem) => {
            // Added date counts as activity? Maybe. Let's focus on revisions first.
            problem.revisions.forEach((rev) => {
                if (rev.completedDate) {
                    const dateStr = rev.completedDate.split('T')[0]; // YYYY-MM-DD
                    map[dateStr] = (map[dateStr] || 0) + 1;
                }
            });
            // Optionally count 'addedAt' as activity
            const addedDateStr = problem.addedAt.split('T')[0];
            map[addedDateStr] = (map[addedDateStr] || 0) + 1;
        });
        return map;
    }, [problems]);

    // 2. Generate calendar grid (Last 365 days)
    const calendarData = useMemo(() => {
        const today = new Date();
        const data = [];
        // Start 364 days ago
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - 364);

        // Adjust startDate to be a Sunday to align the grid properly?
        // Standard GitHub style: Columns are weeks, Rows are days (Sun-Sat or Mon-Sun).
        // Let's find the Sunday on or before startDate
        const dayOfWeek = startDate.getDay(); // 0 is Sunday
        const offset = dayOfWeek;
        startDate.setDate(startDate.getDate() - offset);

        // Generate dates until we cover today + rest of week
        const currentDate = new Date(startDate);
        const endDate = new Date(today);
        // Move end date to end of current week (Saturday)
        endDate.setDate(today.getDate() + (6 - today.getDay()));

        while (currentDate <= endDate) {
            const isoDate = currentDate.toISOString().split('T')[0];
            data.push({
                date: isoDate,
                count: activityMap[isoDate] || 0,
            });
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return data;
    }, [activityMap]);

    // Group by weeks for rendering
    const weeks = useMemo(() => {
        const result = [];
        let currentWeek = [];
        for (let i = 0; i < calendarData.length; i++) {
            currentWeek.push(calendarData[i]);
            if (currentWeek.length === 7) {
                result.push(currentWeek);
                currentWeek = [];
            }
        }
        if (currentWeek.length > 0) result.push(currentWeek);
        return result;
    }, [calendarData]);

    const [hoveredDate, setHoveredDate] = useState<{ date: string, count: number } | null>(null);

    // Helper for color intensity
    const getColor = (count: number) => {
        if (count === 0) return "bg-white/5";
        if (count <= 1) return "bg-teal-900/40";
        if (count <= 3) return "bg-teal-700/60";
        if (count <= 5) return "bg-teal-500";
        return "bg-teal-300";
    };

    return (
        <div className="w-full flex justify-center overflow-x-auto pb-2 md:pb-4">
            <div className="flex flex-col gap-2">
                <h4 className="text-white/60 text-xs md:text-sm font-medium tracking-wide">Activity (Last Year)</h4>
                <div className="flex gap-0.5 md:gap-1 relative">
                    {weeks.map((week, weekIndex) => (
                        <div key={weekIndex} className="flex flex-col gap-0.5 md:gap-1">
                            {week.map((day, dayIndex) => (
                                <div
                                    key={day.date}
                                    className={clsx(
                                        "w-2 h-2 md:w-3 md:h-3 rounded-[2px] transition-all duration-200 cursor-pointer",
                                        getColor(day.count),
                                        "hover:scale-125 hover:z-10 hover:border hover:border-white/50"
                                    )}
                                    onMouseEnter={() => setHoveredDate(day)}
                                    onMouseLeave={() => setHoveredDate(null)}
                                />
                            ))}
                        </div>
                    ))}
                </div>
                {/* Legend / Info */}
                <div className="flex items-center gap-1.5 md:gap-2 mt-1 md:mt-2 text-[9px] md:text-[10px] text-white/30 justify-end">
                    <span>Less</span>
                    <div className="w-2 h-2 md:w-3 md:h-3 bg-white/5 rounded-[2px]" />
                    <div className="w-2 h-2 md:w-3 md:h-3 bg-teal-900/40 rounded-[2px]" />
                    <div className="w-2 h-2 md:w-3 md:h-3 bg-teal-700/60 rounded-[2px]" />
                    <div className="w-2 h-2 md:w-3 md:h-3 bg-teal-500 rounded-[2px]" />
                    <div className="w-2 h-2 md:w-3 md:h-3 bg-teal-300 rounded-[2px]" />
                    <span>More</span>
                </div>
                {/* Tooltip */}
                {hoveredDate && (
                    <div className="absolute top-0 right-0 py-1 px-2 bg-zinc-900 border border-white/10 rounded text-[10px] md:text-xs text-white z-50 pointer-events-none transform -translate-y-full">
                        <span className="font-semibold text-teal-400">{hoveredDate.count} submissions</span> on {hoveredDate.date}
                    </div>
                )}
            </div>
        </div>
    );
}
