import React, { useState } from 'react';
import { Play, Clock, Sparkles, Tv, CheckCircle2, Video, ExternalLink, Bookmark, Check } from 'lucide-react';
import { getLessonVideoData, CourseVideoData } from '../../data/courseVideos';

interface CourseVideoPlayerProps {
  courseSlug: string;
  lessonTitle: string;
  courseTitle: string;
}

export default function CourseVideoPlayer({
  courseSlug,
  lessonTitle,
  courseTitle
}: CourseVideoPlayerProps) {
  const initialVideo = getLessonVideoData(courseSlug, lessonTitle);
  const [activeVideo, setActiveVideo] = useState<CourseVideoData>(initialVideo);
  const [startSeconds, setStartSeconds] = useState<number>(0);
  const [copiedLink, setCopiedLink] = useState(false);

  // Switch video if lessonTitle changes
  React.useEffect(() => {
    const updated = getLessonVideoData(courseSlug, lessonTitle);
    setActiveVideo(updated);
    setStartSeconds(0);
  }, [courseSlug, lessonTitle]);

  const handleSeekChapter = (seconds: number) => {
    setStartSeconds(seconds);
  };

  const handleCopyVideoUrl = () => {
    const url = `https://www.youtube.com/watch?v=${activeVideo.youtubeId}${startSeconds > 0 ? `&t=${startSeconds}s` : ''}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const embedUrl = `https://www.youtube.com/embed/${activeVideo.youtubeId}?rel=0&modestbranding=1&controls=1&showinfo=0${
    startSeconds > 0 ? `&start=${startSeconds}&autoplay=1` : ''
  }`;

  return (
    <div className="space-y-6">
      {/* Video Container - Same 16:9 cinema layout as in Career Services */}
      <div className="bg-slate-950 rounded-3xl overflow-hidden shadow-2xl border border-slate-800">
        {/* Top Video Header */}
        <div className="px-5 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-2 truncate">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <span className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Tv size={13} className="text-red-400" /> Course Video Service
            </span>
            <span className="text-slate-500">•</span>
            <span className="truncate text-slate-400">{courseTitle}</span>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md">
              <Clock size={12} /> {activeVideo.duration}
            </span>
            <button
              onClick={handleCopyVideoUrl}
              className="text-slate-400 hover:text-white transition-colors flex items-center gap-1 text-xs"
              title="Copy YouTube video link"
            >
              {copiedLink ? (
                <>
                  <Check size={13} className="text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <ExternalLink size={13} />
                  <span className="hidden sm:inline">Share</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 16:9 Video iFrame */}
        <div className="w-full bg-black relative" style={{ aspectRatio: '16/9' }}>
          <iframe
            key={`${activeVideo.youtubeId}-${startSeconds}`}
            src={embedUrl}
            className="w-full h-full"
            style={{ minHeight: '340px' }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
            frameBorder="0"
            title={activeVideo.title}
          />
        </div>

        {/* Video Info Strip */}
        <div className="p-5 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border-t border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white mb-1 tracking-tight">
              {activeVideo.title}
            </h2>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
              <span className="font-semibold text-indigo-400 bg-indigo-950/60 border border-indigo-800/40 px-2.5 py-0.5 rounded-full">
                📺 {activeVideo.channel}
              </span>
              <span>•</span>
              <span>Full Video Class</span>
              <span>•</span>
              <span className="text-emerald-400 font-medium">✓ Verified Curriculum</span>
            </div>
          </div>

          {/* Alternative Instructors / Alternative Lecture Selector */}
          {activeVideo.alternativeVideos && activeVideo.alternativeVideos.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-slate-400 font-semibold">Switch Lecture:</span>
              <button
                onClick={() => {
                  setActiveVideo(initialVideo);
                  setStartSeconds(0);
                }}
                className={`text-xs px-2.5 py-1 rounded-lg font-bold transition-all ${
                  activeVideo.youtubeId === initialVideo.youtubeId
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
              >
                Primary
              </button>
              {activeVideo.alternativeVideos.map((alt) => (
                <button
                  key={alt.youtubeId}
                  onClick={() => {
                    setActiveVideo({
                      ...activeVideo,
                      youtubeId: alt.youtubeId,
                      title: alt.title,
                      channel: alt.channel,
                      duration: alt.duration
                    });
                    setStartSeconds(0);
                  }}
                  className={`text-xs px-2.5 py-1 rounded-lg font-bold transition-all ${
                    activeVideo.youtubeId === alt.youtubeId
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  {alt.channel}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chapters & Key Takeaways Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Interactive Video Chapters */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Clock size={16} className="text-indigo-600" />
              <span>Video Chapters & Timestamps</span>
            </h3>
            <span className="text-xs text-slate-400">Click to jump in video</span>
          </div>

          <div className="space-y-2">
            {activeVideo.chapters.map((chap, idx) => (
              <button
                key={idx}
                onClick={() => handleSeekChapter(chap.timeSeconds)}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all ${
                  startSeconds === chap.timeSeconds
                    ? 'bg-indigo-50 text-indigo-900 font-bold border border-indigo-200'
                    : 'hover:bg-slate-50 text-slate-700 font-medium'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
                    <Play size={10} className="fill-indigo-600 ml-0.5" />
                  </div>
                  <span className="text-xs sm:text-sm truncate">{chap.title}</span>
                </div>
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 ml-2 flex-shrink-0">
                  {chap.timeLabel}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Video Key Takeaways */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Sparkles size={16} className="text-emerald-600" />
                <span>Core Concepts in this Video</span>
              </h3>
              <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                Key Takeaways
              </span>
            </div>

            <div className="space-y-3">
              {activeVideo.keyTakeaways.map((point, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                    {point}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-600">
            💡 <strong>Study Tip:</strong> Watch the video walkthrough first to see the live demonstration, then switch to the <strong>Deep Notes</strong> tab to practice the code examples and exercises.
          </div>
        </div>
      </div>
    </div>
  );
}
