"use client";

import { useMemo, useState } from "react";
import { useProblems } from "@/lib/storage";
import { getNextRevision, getRevisionStatus } from "@/lib/scheduler";
import { CheckCircle2, Clock, ArrowRight } from "lucide-react";
import clsx from "clsx";

// Helper component for the action button state
function ProblemActions({ problem, revision, onComplete }: { problem: any, revision: any, onComplete: () => void }) {
    const [started, setStarted] = useState(false);

    const handleStart = () => {
        window.open(problem.url, '_blank');
        setStarted(true);
    };

    if (started) {
        return (
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onComplete();
                }}
                className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-emerald-500 text-white rounded-full text-xs md:text-sm font-medium hover:bg-emerald-600 transition-colors active:scale-95"
            >
                <CheckCircle2 className="w-3.5 h-3.5 md:w-4 md:h-4" /> Mark Done
            </button>
        );
    }

    return (
        <button
            onClick={(e) => {
                e.stopPropagation();
                handleStart();
            }}
            className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-zinc-100 text-zinc-900 rounded-full text-xs md:text-sm font-medium hover:bg-white transition-colors active:scale-95"
        >
            Start Review <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
        </button>
    );
}

export default function DailyFocus() {
    const { problems, isLoaded, updateProblem } = useProblems();

    // Filter problems that are due or overdue
    const dueProblems = useMemo(() => {
        if (!isLoaded) return [];

        return problems
            .map(p => {
                const nextRev = getNextRevision(p);
                if (!nextRev) return null;
                const status = getRevisionStatus(nextRev);
                if (status === 'due' || status === 'overdue') {
                    return { problem: p, revision: nextRev, status };
                }
                return null;
            })
            .filter((item): item is NonNullable<typeof item> => item !== null)
            .sort((a, b) => {
                // Sort overdue first, then by earliest scheduled date
                if (a.status === 'overdue' && b.status !== 'overdue') return -1;
                if (b.status === 'overdue' && a.status !== 'overdue') return 1;
                return new Date(a.revision.scheduledDate).getTime() - new Date(b.revision.scheduledDate).getTime();
            });
    }, [problems, isLoaded]);

    const handleComplete = async (problem: any, revision: any) => {
        // Update the specific revision to have completedDate = new Date().toISOString()
        const updatedRevisions = problem.revisions.map((r: any) => {
            if (r.number === revision.number) {
                return { ...r, completedDate: new Date().toISOString() };
            }
            return r;
        });

        await updateProblem(problem.id, { revisions: updatedRevisions });
    };

    if (!isLoaded) return <div className="text-zinc-500 text-sm animate-pulse">Syncing...</div>;

    if (dueProblems.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-8 md:p-12 text-center border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/30">
                <CheckCircle2 className="w-10 h-10 md:w-12 md:h-12 text-emerald-500/50 mb-3 md:mb-4" />
                <h3 className="text-base md:text-lg font-medium text-zinc-200">All Caught Up</h3>
                <p className="text-xs md:text-sm text-zinc-500 max-w-xs mt-2">
                    You have no revisions due today. Enjoy your peace or add a new problem to learn.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4 md:space-y-6">
            <header className="flex items-baseline justify-between">
                <h2 className="text-xl md:text-2xl font-serif text-white">Today's Focus</h2>
                <span className="text-xs md:text-sm text-zinc-500 font-mono">
                    {dueProblems.length} {dueProblems.length === 1 ? 'task' : 'tasks'}
                </span>
            </header>

            <div className="grid gap-3 md:gap-4">
                {dueProblems.map(({ problem, revision, status }) => (
                    <div
                        key={problem.id}
                        className="group relative p-4 md:p-5 bg-zinc-900/50 border border-zinc-800/50 rounded-xl hover:border-zinc-700 transition-all hover:shadow-lg hover:shadow-black/20"
                    >
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3 mb-3">
                            <div className="space-y-1 flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className={clsx(
                                        "px-2 py-0.5 text-[10px] uppercase tracking-wider rounded-sm font-medium",
                                        problem.difficulty === 'Easy' && "bg-emerald-950/50 text-emerald-400 border border-emerald-900/50",
                                        problem.difficulty === 'Medium' && "bg-amber-950/50 text-amber-400 border border-amber-900/50",
                                        problem.difficulty === 'Hard' && "bg-rose-950/50 text-rose-400 border border-rose-900/50",
                                    )}>
                                        {problem.difficulty}
                                    </span>
                                    {status === 'overdue' && (
                                        <span className="text-[10px] font-bold text-rose-500 flex items-center gap-1">
                                            <Clock className="w-3 h-3" /> Overdue
                                        </span>
                                    )}
                                </div>
                                <h3 className="text-base md:text-lg font-medium text-zinc-100 group-hover:text-white transition-colors">
                                    {problem.title}
                                </h3>
                            </div>

                            <div className="flex items-center gap-3 justify-between md:justify-end">
                                <div className="flex flex-col items-end text-right">
                                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Revision</span>
                                    <span className="text-lg md:text-xl font-mono text-zinc-300">#{revision.number}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between mt-4 gap-3">
                            <div className="flex gap-2 flex-wrap">
                                {problem.tags.slice(0, 3).map((tag: string) => (
                                    <span key={tag} className="text-xs text-zinc-500">#{tag}</span>
                                ))}
                            </div>

                            <ProblemActions
                                problem={problem}
                                revision={revision}
                                onComplete={() => handleComplete(problem, revision)}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
