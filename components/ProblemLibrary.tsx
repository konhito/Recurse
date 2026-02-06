"use client";

import { useState, useMemo } from "react";
import { useProblems } from "@/lib/storage";
import { Search, Trash2, ExternalLink, ArrowUpDown, CheckCircle2, Circle, Clock } from "lucide-react";
import clsx from "clsx";
import { format, parseISO } from "date-fns";
import { getNextRevision, getRevisionStatus } from "@/lib/scheduler";

type SortField = 'title' | 'difficulty' | 'addedAt' | 'lastPracticed' | 'nextDue';
type SortDirection = 'asc' | 'desc';

export default function ProblemLibrary() {
    const { problems, deleteProblem } = useProblems();
    const [search, setSearch] = useState("");
    const [sortField, setSortField] = useState<SortField>('addedAt');
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const getLastPracticed = (problem: any) => {
        const dates = problem.revisions
            .filter((r: any) => r.completedDate)
            .map((r: any) => r.completedDate)
            .sort().reverse();
        return dates.length > 0 ? dates[0] : null;
    };

    const getNextDue = (problem: any) => {
        const nextRev = getNextRevision(problem);
        return nextRev ? nextRev.scheduledDate : null;
    };

    const getStatus = (problem: any) => {
        const nextRev = getNextRevision(problem);
        if (!nextRev) return 'completed';
        return getRevisionStatus(nextRev);
    };

    const filteredProblems = useMemo(() => {
        return problems
            .filter(p => p.title.toLowerCase().includes(search.toLowerCase()))
            .sort((a, b) => {
                let aVal: any, bVal: any;

                switch (sortField) {
                    case 'title':
                        aVal = a.title.toLowerCase();
                        bVal = b.title.toLowerCase();
                        break;
                    case 'difficulty':
                        const diffMap = { Easy: 1, Medium: 2, Hard: 3 };
                        aVal = diffMap[a.difficulty];
                        bVal = diffMap[b.difficulty];
                        break;
                    case 'addedAt':
                        aVal = new Date(a.addedAt).getTime();
                        bVal = new Date(b.addedAt).getTime();
                        break;
                    case 'lastPracticed':
                        const aLast = getLastPracticed(a);
                        const bLast = getLastPracticed(b);
                        aVal = aLast ? new Date(aLast).getTime() : 0;
                        bVal = bLast ? new Date(bLast).getTime() : 0;
                        break;
                    case 'nextDue':
                        const aNext = getNextDue(a);
                        const bNext = getNextDue(b);
                        aVal = aNext ? new Date(aNext).getTime() : Infinity;
                        bVal = bNext ? new Date(bNext).getTime() : Infinity;
                        break;
                }

                if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
                return 0;
            });
    }, [problems, search, sortField, sortDirection]);

    const SortableHeader = ({ field, children }: { field: SortField, children: React.ReactNode }) => (
        <th
            className="px-3 md:px-4 py-2.5 md:py-3 font-medium text-left cursor-pointer hover:bg-white/5 transition-colors select-none border-r border-white/5 last:border-r-0"
            onClick={() => handleSort(field)}
        >
            <div className="flex items-center gap-1.5">
                {children}
                <ArrowUpDown className={clsx(
                    "w-3 h-3 transition-opacity",
                    sortField === field ? "opacity-100" : "opacity-30"
                )} />
            </div>
        </th>
    );

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
                <input
                    type="text"
                    placeholder="Search problems..."
                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg py-2 pl-10 pr-4 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-700 focus:border-zinc-700"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>

            {/* Excel-Style Table */}
            <div className="w-full overflow-x-auto rounded-lg border border-white/10 bg-zinc-950/50">
                <table className="w-full border-collapse text-xs md:text-sm">
                    <thead className="sticky top-0 bg-zinc-900/90 backdrop-blur-sm z-10">
                        <tr className="border-b border-white/10 text-white/40 uppercase text-[10px] md:text-[11px] tracking-wider">
                            <th className="px-3 md:px-4 py-2.5 md:py-3 font-medium text-center w-12 border-r border-white/5">
                                Status
                            </th>
                            <SortableHeader field="title">Title</SortableHeader>
                            <SortableHeader field="difficulty">Difficulty</SortableHeader>
                            <SortableHeader field="addedAt">Added</SortableHeader>
                            <SortableHeader field="lastPracticed">Last Practiced</SortableHeader>
                            <SortableHeader field="nextDue">Next Due</SortableHeader>
                            <th className="px-3 md:px-4 py-2.5 md:py-3 font-medium text-center w-24">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredProblems.map((problem) => {
                            const status = getStatus(problem);
                            const lastPracticed = getLastPracticed(problem);
                            const nextDue = getNextDue(problem);

                            return (
                                <tr key={problem.id} className="group hover:bg-white/5 transition-colors">
                                    {/* Status Icon */}
                                    <td className="px-3 md:px-4 py-2.5 md:py-3 text-center border-r border-white/5">
                                        {status === 'completed' && <CheckCircle2 size={16} className="text-emerald-500 mx-auto" />}
                                        {status === 'due' && <Clock size={16} className="text-amber-500 mx-auto" />}
                                        {status === 'overdue' && <Clock size={16} className="text-rose-500 mx-auto" />}
                                        {status === 'locked' && <Circle size={16} className="text-white/20 mx-auto" />}
                                    </td>

                                    {/* Title */}
                                    <td className="px-3 md:px-4 py-2.5 md:py-3 font-medium text-white/90 border-r border-white/5">
                                        <div className="flex items-center gap-2 min-w-[200px]">
                                            <span className="truncate">{problem.title}</span>
                                        </div>
                                    </td>

                                    {/* Difficulty */}
                                    <td className="px-3 md:px-4 py-2.5 md:py-3 border-r border-white/5">
                                        <span className={clsx(
                                            "px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-semibold border inline-block",
                                            problem.difficulty === 'Easy' && "text-green-400 bg-green-400/10 border-green-400/20",
                                            problem.difficulty === 'Medium' && "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
                                            problem.difficulty === 'Hard' && "text-red-400 bg-red-400/10 border-red-400/20"
                                        )}>
                                            {problem.difficulty}
                                        </span>
                                    </td>

                                    {/* Added Date */}
                                    <td className="px-3 md:px-4 py-2.5 md:py-3 text-white/60 font-mono text-[11px] border-r border-white/5 whitespace-nowrap">
                                        {format(parseISO(problem.addedAt), 'MMM d, yyyy')}
                                    </td>

                                    {/* Last Practiced */}
                                    <td className="px-3 md:px-4 py-2.5 md:py-3 text-white/60 font-mono text-[11px] border-r border-white/5 whitespace-nowrap">
                                        {lastPracticed ? format(parseISO(lastPracticed), 'MMM d, yyyy') : '-'}
                                    </td>

                                    {/* Next Due */}
                                    <td className="px-3 md:px-4 py-2.5 md:py-3 text-white/60 font-mono text-[11px] border-r border-white/5 whitespace-nowrap">
                                        {nextDue ? format(parseISO(nextDue), 'MMM d, yyyy') : '-'}
                                    </td>

                                    {/* Actions */}
                                    <td className="px-3 md:px-4 py-2.5 md:py-3 text-center">
                                        <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <a
                                                href={problem.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-1.5 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded transition-colors"
                                                title="Open problem"
                                            >
                                                <ExternalLink className="w-3.5 h-3.5" />
                                            </a>
                                            <button
                                                onClick={() => deleteProblem(problem.id)}
                                                className="p-1.5 text-zinc-500 hover:text-rose-400 hover:bg-rose-950/30 rounded transition-colors"
                                                title="Delete problem"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}

                        {filteredProblems.length === 0 && (
                            <tr>
                                <td colSpan={7} className="px-6 py-12 text-center text-white/30 italic">
                                    {search ? 'No problems match your search.' : 'No problems added yet. Start your journey!'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Summary */}
            <div className="flex justify-between items-center text-[10px] text-white/30 px-2">
                <span>{filteredProblems.length} problem{filteredProblems.length !== 1 ? 's' : ''}</span>
                <span>Click column headers to sort</span>
            </div>
        </div>
    );
}
