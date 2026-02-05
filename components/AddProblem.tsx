"use client";

import { useState } from "react";
import { X, Loader2, Link as LinkIcon, Plus } from "lucide-react";
import { parseProblemUrl } from "@/lib/parser";
import { Difficulty, Problem } from "@/lib/types";
import { generateRevisions } from "@/lib/scheduler";
import { v4 as uuidv4 } from "uuid";

interface AddProblemProps {
    onAdd: (problem: Problem) => void;
    onClose: () => void;
}

export default function AddProblem({ onAdd, onClose }: AddProblemProps) {
    const [url, setUrl] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState<'url' | 'details'>('url');

    // Form State
    const [title, setTitle] = useState("");
    const [difficulty, setDifficulty] = useState<Difficulty>('Medium');

    const handleUrlSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const parsed = await parseProblemUrl(url);
        if (parsed) {
            setTitle(parsed.title);
            setDifficulty(parsed.difficulty);
            setStep('details');
        } else {
            // Fallback if parsing fails or invalid URL (allow manual entry anyway)
            setStep('details');
        }

        setIsLoading(false);
    };

    const handleFinalSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const newProblem: Problem = {
            id: uuidv4(),
            title: title || "Untitled Problem",
            url,
            difficulty,
            tags: [], // Could add tag input later
            addedAt: new Date().toISOString(),
            notes: "",
            revisions: generateRevisions(new Date()),
            confidenceHistory: [],
            isArchived: false,
        };

        onAdd(newProblem);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-serif text-white">Add New Problem</h3>
                    <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {step === 'url' ? (
                    <form onSubmit={handleUrlSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wider">LeetCode URL</label>
                            <div className="relative">
                                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
                                <input
                                    type="url"
                                    placeholder="https://leetcode.com/problems/..."
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-600 focus:border-zinc-700"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    required
                                    autoFocus
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-white text-zinc-900 font-medium py-3 rounded-xl hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2"
                        >
                            {isLoading ? <Loader2 className="animate-spin w-4 h4" /> : "Continue"}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleFinalSubmit} className="space-y-5">
                        <div>
                            <label className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wider">Title</label>
                            <input
                                type="text"
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 px-4 text-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-600 focus:border-zinc-700"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wider">Difficulty</label>
                            <div className="grid grid-cols-3 gap-3">
                                {(['Easy', 'Medium', 'Hard'] as Difficulty[]).map((d) => (
                                    <button
                                        key={d}
                                        type="button"
                                        onClick={() => setDifficulty(d)}
                                        className={`py-2 rounded-lg text-sm font-medium border transition-all ${difficulty === d
                                            ? d === 'Easy' ? 'bg-emerald-900/30 border-emerald-500/50 text-emerald-400'
                                                : d === 'Medium' ? 'bg-amber-900/30 border-amber-500/50 text-amber-400'
                                                    : 'bg-rose-900/30 border-rose-500/50 text-rose-400'
                                            : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:bg-zinc-900'
                                            }`}
                                    >
                                        {d}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-white text-zinc-900 font-medium py-3 rounded-xl hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 mt-2"
                        >
                            <Plus className="w-4 h-4" /> Add to Revisions
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
