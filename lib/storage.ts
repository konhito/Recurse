"use client";

import { useEffect, useState } from "react";
import { Problem } from "./types";
import { fetchProblems, createProblemAction, deleteProblemAction, updateProblemAction } from "@/app/actions";

export function useProblems() {
    const [problems, setProblems] = useState<Problem[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Initial Load - Fetch from Server
    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchProblems();
                setProblems(data);
                setIsLoaded(true);
            } catch (e) {
                console.error("Failed to fetch problems", e);
            }
        };
        load();
    }, []);

    // We no longer sync to localStorage automatically with useEffect.
    // Instead, we call Server Actions on specific events.

    const addProblem = async (problem: Problem) => {
        // Optimistic update
        setProblems((prev) => [problem, ...prev]);
        try {
            await createProblemAction(problem);
        } catch (e) {
            console.error("Failed to create problem", e);
            // Revert or show error? For now, we log.
        }
    };

    const updateProblem = async (id: string, updates: Partial<Problem>) => {
        let updatedProblem: Problem | undefined;

        setProblems((prev) => {
            return prev.map((p) => {
                if (p.id === id) {
                    updatedProblem = { ...p, ...updates };
                    return updatedProblem;
                }
                return p;
            });
        });

        if (updatedProblem) {
            try {
                await updateProblemAction(updatedProblem);
            } catch (e) {
                console.error("Failed to update problem", e);
            }
        }
    };

    const deleteProblem = async (id: string) => {
        // Optimistic update
        setProblems((prev) => prev.filter((p) => p.id !== id));
        try {
            await deleteProblemAction(id);
        } catch (e) {
            console.error("Failed to delete problem", e);
        }
    };

    const refreshProblems = async () => {
        try {
            const data = await fetchProblems();
            setProblems(data);
        } catch (e) {
            console.error("Failed to refresh problems", e);
        }
    };

    return {
        problems,
        addProblem,
        updateProblem,
        deleteProblem,
        refreshProblems,
        isLoaded,
    };
}
