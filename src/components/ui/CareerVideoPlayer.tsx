'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Youtube } from 'lucide-react';
import { Card } from './Card';
import type { YouTubeVideo } from '@/types/career';

interface PlayerProps {
  isOpen: boolean;
  onClose: () => void;
  video: YouTubeVideo | null;
  careerTitle: string;
}

export function CareerVideoPlayer({ isOpen, onClose, video, careerTitle }: PlayerProps) {
  if (!video) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black backdrop-blur-md"
          />

          {/* Player Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-full max-w-3xl relative z-10"
          >
            <Card padding="none" className="border-white/[0.08] bg-[#030712] overflow-hidden shadow-[0_0_50px_rgba(168,85,247,0.15)]">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 sm:px-6 border-b border-white/[0.05] bg-[#070b19]">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-500/10 text-red-500">
                    <Youtube className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-slate-100 text-xs sm:text-sm truncate max-w-md sm:max-w-xl">
                      {video.title}
                    </h3>
                    <p className="text-[10px] text-slate-400 font-medium">
                      Exploration: {careerTitle} &middot; Channel: {video.channelTitle}
                    </p>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.05] transition-colors cursor-pointer"
                  aria-label="Close video player"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* YouTube Embed iFrame */}
              <div className="relative aspect-video w-full bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/${video.embedId}?autoplay=1&rel=0&modestbranding=1`}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full border-0"
                />
              </div>

              {/* Footer info */}
              <div className="p-4 bg-[#070b19]/50 text-center text-[10px] sm:text-xs text-slate-500 font-semibold uppercase tracking-wider">
                Video content provided via official YouTube Embed Player
              </div>
            </Card>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
