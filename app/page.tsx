"use client";

import { useState } from "react";
import DailyFocus from "@/components/DailyFocus";
import ProblemLibrary from "@/components/ProblemLibrary";
import AddProblem from "@/components/AddProblem";
import ProgressHeatmap from "@/components/ProgressHeatmap";
import ProblemsTable from "@/components/ProblemsTable";
import StringLines from "@/components/StringLines";
import { useProblems } from "@/lib/storage";
import { Plus, Settings, User, RefreshCw } from "lucide-react";
import { syncLeetCodeAction } from "@/app/sync-action";
import clsx from "clsx";

export default function Home() {
  const [view, setView] = useState<'focus' | 'library' | 'progress'>('focus');
  const [showAdd, setShowAdd] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [isHoveringCredit, setIsHoveringCredit] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const { addProblem, problems } = useProblems();

  return (

    <div className="min-h-screen w-full font-sans relative flex flex-col items-center selection:bg-teal-500 selection:text-white">

      {/* Fixed Background & Texture */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#3d4f5c] to-[#2d4f56] z-0" />
      <div className="fixed inset-0 texture-overlay opacity-20 pointer-events-none z-0" />
      <StringLines />

      {/* Top Action Bar (Fixed, buttons only) */}
      <div className="fixed top-0 z-50 w-full h-[70px] md:h-[90px] flex items-center justify-between px-4 md:px-12 pt-4 md:pt-6 pointer-events-none">
        {/* Left Icon: Add Problem */}
        <button
          onClick={() => setShowAdd(true)}
          className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:bg-white/10 hover:border-white/40 transition-all cursor-pointer bg-white/5 backdrop-blur-md pointer-events-auto active:scale-95"
          title="Add New Problem"
        >
          <Plus size={18} strokeWidth={1.5} className="md:w-5 md:h-5" />
        </button>

        <div className="flex items-center gap-2 md:gap-4 pointer-events-auto">
          {/* Sync Button */}
          <button
            onClick={async () => {
              const btn = document.getElementById('sync-btn');
              if (btn) btn.classList.add('animate-spin');
              try {
                await syncLeetCodeAction();
                // Ideally refresh data here
                window.location.reload();
              } catch (e) { console.error(e); }
              finally { if (btn) btn.classList.remove('animate-spin'); }
            }}
            className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:bg-white/10 hover:border-white/40 transition-all cursor-pointer bg-white/5 backdrop-blur-md active:scale-95"
            title="Sync LeetCode"
          >
            <RefreshCw id="sync-btn" size={16} strokeWidth={1.5} className="md:w-[18px] md:h-[18px]" />
          </button>

          {/* Right Icon: Profile => Secret Video */}
          <button
            onClick={() => setShowVideo(true)}
            className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:bg-white/10 hover:border-white/40 transition-all cursor-pointer bg-white/5 backdrop-blur-md active:scale-95"
          >
            <User size={16} strokeWidth={1.5} className="md:w-[18px] md:h-[18px]" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 w-full flex-1 px-4 md:px-12 flex flex-col items-center pb-28 md:pb-32">

        <div className="w-full max-w-5xl animate-in fade-in zoom-in-95 duration-500 pt-0">
          {view === 'focus' && (
            <>
              {/* Header Text */}
              <div className="flex flex-col items-center gap-2 md:gap-3 mb-8 md:mb-16">

                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[64px] mt-8 md:mt-15 leading-[1.1] text-white tracking-[0.02em] text-center drop-shadow-2xl">
                  <span className="font-regular">Clarity in </span>
                  <span className="font-serif italic font-light ml-1 md:ml-2">Complexity</span>
                </h1>
              </div>
              <DailyFocus />
            </>
          )}

          {view === 'library' && (
            <div className="flex flex-col w-full min-h-[60vh]">
              <div className="mb-6 md:mb-8 text-center mt-6 md:mt-8">
                <h2 className="text-3xl md:text-4xl font-serif text-white italic">Problem Library</h2>
                <p className="text-sm md:text-base text-white/50 font-light mt-2">Manage your collection</p>
              </div>
              <div className="flex-1 bg-black/20 rounded-2xl md:rounded-[32px] border border-white/10 p-4 md:p-8 backdrop-blur-md shadow-2xl">
                <ProblemLibrary />
              </div>
            </div>
          )}

          {view === 'progress' && (
            <div className="flex flex-col items-center w-full min-h-[60vh] mt-6 md:mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-3xl md:text-4xl font-serif text-white italic mb-2">Progress</h2>
              <p className="text-sm md:text-base text-white/50 font-light mb-6 md:mb-8">Track your consistency and mastery</p>

              <div className="w-full max-w-5xl space-y-4 md:space-y-8">
                {/* Heatmap Card */}
                <div className="bg-black/20 rounded-2xl md:rounded-[24px] border border-white/10 p-4 md:p-6 backdrop-blur-md shadow-2xl">
                  <ProgressHeatmap problems={problems} />
                </div>

                {/* Problems List */}
                <div className="bg-black/20 rounded-2xl md:rounded-[24px] border border-white/10 p-3 md:p-6 backdrop-blur-md shadow-2xl overflow-hidden">
                  <div className="flex justify-between items-center mb-0 px-2 md:px-4 pt-2">
                    <h3 className="text-base md:text-lg text-white font-medium">All Problems</h3>
                    <span className="text-[10px] md:text-xs text-white/40 uppercase tracking-widest px-2 md:px-3 py-1 bg-white/5 rounded-full border border-white/5">{problems.length} Total</span>
                  </div>
                  <ProblemsTable problems={problems} />
                </div>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Bottom Dock Navigation */}
      <div className="fixed bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-50 flex items-center space-x-6 md:space-x-12 bg-black/20 backdrop-blur-xl px-6 md:px-10 py-3 md:py-5 rounded-full border border-white/10 transition-all hover:bg-black/30">
        {[
          { id: 'focus', label: 'Daily Focus' },
          { id: 'library', label: 'Library' },
          { id: 'progress', label: 'Progress' }
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id as any)}
            className={clsx(
              "text-xs md:text-[15px] font-light transition-all tracking-wide relative active:scale-95",
              view === item.id
                ? "text-white font-medium"
                : "text-white/60 hover:text-white/90"
            )}
          >
            {item.label}
            {view === item.id && (
              <span className="absolute -bottom-1.5 md:-bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full opacity-60" />
            )}
          </button>
        ))}
      </div>

      {/* Footer Credits - Moved to bottom static position or removal? 
          "all the thing make it up". If dock is at bottom, footer might clash. 
          Let's make footer static at bottom of CONTENT flow, but ensure it's above the dock visually or hide it? 
          The user is minimalist. I'll stick it at the very bottom of the page but with z-index below the dock.
      */}
      <footer className="fixed bottom-2 md:bottom-4 w-full px-4 md:px-12 flex justify-between text-[8px] md:text-[10px] uppercase tracking-[0.15em] md:tracking-[0.2em] text-white/20 font-sans pointer-events-none z-40">
        <div className="w-1/3 text-left hidden md:block">Spaced Revision</div>
        <div className="w-1/3 text-center hidden md:block">Personal Tool</div>
        <div className="w-full md:w-1/3 text-right pointer-events-auto">
          v1.1
          <span className="mx-2 opacity-50">/</span>
          <a
            href="https://github.com/konhito"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white transition-colors underline decoration-white/20 hover:decoration-white underline-offset-4 relative"
            onMouseEnter={() => setIsHoveringCredit(true)}
            onMouseLeave={() => setIsHoveringCredit(false)}
            onMouseMove={(e) => setMousePos({ x: e.clientX, y: e.clientY })}
          >
            made by konhito
          </a>
        </div>
      </footer>

      {/* Floating Hover Image */}
      {isHoveringCredit && (
        <div
          className="fixed z-[60] pointer-events-none animate-in fade-in duration-200"
          style={{
            left: mousePos.x,
            top: mousePos.y - 50,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <img
            src="https://github.com/konhito.png"
            alt="Konhito"
            className="w-12 h-12 rounded-lg object-cover border border-white/10 shadow-lg"
          />
        </div>
      )}

      {/* Modals */}
      {showAdd && (
        <AddProblem
          onAdd={addProblem}
          onClose={() => setShowAdd(false)}
        />
      )}

      {/* Secret Video Player */}
      {showVideo && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center animate-in fade-in duration-300">
          <div className="relative w-full max-w-5xl aspect-video bg-black shadow-2xl overflow-hidden rounded-lg">
            <button
              onClick={() => setShowVideo(false)}
              className="absolute top-4 right-4 z-10 text-white/50 hover:text-white p-2"
            >
              Close
            </button>
            <video
              src="/From KlickPin CF Kokou no Hito _ The Climber _3 _ Recent anime Good anime series Manga drawing.mp4"
              autoPlay
              loop
              playsInline
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
