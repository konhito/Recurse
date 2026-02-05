"use client";

import { useState, useMemo } from "react";
import { useProblems } from "@/lib/storage";
import { Search, Trash2, ExternalLink } from "lucide-react";
import clsx from "clsx";
import { format } from "date-fns";

export default function ProblemLibrary() {
    const { problems, deleteProblem } = useProblems();
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState<'date' | 'difficulty'>('date');

    const filteredProblems = useMemo(() => {
        return problems
            .filter(p => p.title.toLowerCase().includes(search.toLowerCase()))
            .sort((a, b) => {
                if (sort === 'difficulty') {
                    const map = { Easy: 1, Medium: 2, Hard: 3 };
                    return map[a.difficulty] - map[b.difficulty];
                }
                // Default: Recent added
                return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
            });
    }, [problems, search, sort]);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search library..."
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2 pl-10 pr-4 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-700"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <select
                    className="bg-zinc-900 border border-zinc-800 rounded-xl py-2 px-3 text-sm text-zinc-400 focus:outline-none"
                    value={sort}
                    onChange={(e) => setSort(e.target.value as any)}
                >
                    <option value="date">Recent</option>
                    <option value="difficulty">Difficulty</option>
                </select>
            </div>

            <div className="space-y-2">
                {filteredProblems.map(problem => (
                    <div key={problem.id} className="group flex items-center justify-between p-4 bg-zinc-900/30 border border-transparent hover:border-zinc-800 rounded-xl transition-all">
                        <div className="flex items-center gap-3">
                            <span className={clsx(
                                "w-2 h-2 rounded-full",
                                problem.difficulty === 'Easy' && "bg-emerald-500",
                                problem.difficulty === 'Medium' && "bg-amber-500",
                                problem.difficulty === 'Hard' && "bg-rose-500",
                            )} />
                            <div>
                                <h4 className="text-zinc-200 text-sm font-medium">{problem.title}</h4>
                                <p className="text-[10px] text-zinc-500 font-mono">Added {format(new Date(problem.addedAt), 'MMM d')}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <a
                                href={problem.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg"
                            >
                                <ExternalLink className="w-4 h-4" />
                            </a>
                            <button
                                onClick={() => deleteProblem(problem.id)}
                                className="p-2 text-zinc-500 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}

                {filteredProblems.length === 0 && (
                    <div className="text-center py-12 text-zinc-600 text-sm">
                        No problems found.
                    </div>
                )}
            </div>
        </div>
    );
}
