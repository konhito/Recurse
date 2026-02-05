import { Problem, Difficulty } from "@/lib/types";
import { CheckCircle2, Circle, Clock, ArrowUpRight, ExternalLink } from "lucide-react";
import { clsx } from "clsx";

interface ProblemsTableProps {
    problems: Problem[];
}

export default function ProblemsTable({ problems }: ProblemsTableProps) {

    const getDifficultyColor = (diff: Difficulty) => {
        switch (diff) {
            case 'Easy': return 'text-green-400 bg-green-400/10 border-green-400/20';
            case 'Medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
            case 'Hard': return 'text-red-400 bg-red-400/10 border-red-400/20';
            default: return 'text-white/50';
        }
    };

    const getStatusIcon = (problem: Problem) => {
        // Determine status based on revisions
        const isCompleted = problem.revisions.some(r => r.completedDate);
        // Or checking if the *next* revision is overdue? 
        // For now, let's just show check if done at least once, else circle
        if (isCompleted) return <CheckCircle2 size={16} className="text-teal-500" />;
        return <Circle size={16} className="text-white/20" />;
    };

    const getLastPracticed = (problem: Problem) => {
        // Find latest completed date
        const dates = problem.revisions
            .filter(r => r.completedDate)
            .map(r => r.completedDate!)
            .sort().reverse();
        if (dates.length > 0) {
            return new Date(dates[0]).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
        }
        return "-";
    };

    return (
        <div className="w-full mt-8 overflow-hidden rounded-xl border border-white/10 bg-black/20 backdrop-blur-md">
            <table className="w-full text-left text-sm">
                <thead>
                    <tr className="border-b border-white/10 text-white/40 uppercase text-[10px] tracking-wider">
                        <th className="px-6 py-4 font-medium">Status</th>
                        <th className="px-6 py-4 font-medium">Title</th>
                        <th className="px-6 py-4 font-medium">Difficulty</th>
                        <th className="px-6 py-4 font-medium">Last Practiced</th>
                        {/* <th className="px-6 py-4 font-medium text-right">Action</th> */}
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {problems.map((problem) => (
                        <tr key={problem.id} className="group hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4">
                                {getStatusIcon(problem)}
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <span className="font-medium text-white/90 group-hover:text-white transition-colors">
                                        {problem.title}
                                    </span>
                                    {problem.url && (
                                        <a
                                            href={problem.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="opacity-0 group-hover:opacity-100 transition-opacity text-white/30 hover:text-white"
                                        >
                                            <ExternalLink size={12} />
                                        </a>
                                    )}
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className={clsx(
                                    "px-2 py-1 rounded text-[10px] uppercase tracking-wider font-semibold border",
                                    getDifficultyColor(problem.difficulty)
                                )}>
                                    {problem.difficulty}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-white/50 font-mono text-xs">
                                {getLastPracticed(problem)}
                            </td>
                            {/* <td className="px-6 py-4 text-right">
                <button className="text-white/30 hover:text-white transition-colors">
                    <ArrowUpRight size={16} />
                </button>
              </td> */}
                        </tr>
                    ))}
                    {problems.length === 0 && (
                        <tr>
                            <td colSpan={4} className="px-6 py-12 text-center text-white/30 italic">
                                No problems added yet. Start your journey!
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
