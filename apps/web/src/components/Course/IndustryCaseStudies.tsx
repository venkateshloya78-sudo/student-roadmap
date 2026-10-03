import React, { useState } from 'react';
import { Building2, Server, ShieldCheck, Zap, ChevronRight, Layers, ArrowUpRight } from 'lucide-react';

interface CaseStudiesProps {
  lessonTitle: string;
  courseCategory?: string;
}

export default function IndustryCaseStudies({ lessonTitle, courseCategory = 'programming' }: CaseStudiesProps) {
  const caseStudies = [
    {
      company: "Netflix",
      logo: "🎬",
      title: "High-Throughput In-Memory Caching & Stream Processing",
      subtitle: "How Netflix manages 200M+ real-time viewing profiles with sub-millisecond lookups",
      problem: "When millions of users stream video simultaneously, reading user preferences directly from relational databases causes massive disk I/O bottlenecks and high latency spikes.",
      architecture: [
        "Distributed Key-Value Caching: Utilizes EVCache (built on Memcached) and Redis clusters sharded across AWS Availability Zones.",
        "Constant-Time Lookups: Employs hash-table based indices to ensure user bookmarks and playback positions resolve in O(1) time.",
        "Asynchronous Event Sinks: Writes are queued through Kafka and persisted asynchronously to Cassandra without blocking the user interface."
      ],
      impact: "Reduced peak 99th percentile API latency from 240ms to under 8ms, handling over 2.5 billion API requests daily with 99.999% uptime.",
      keyTakeaway: "Memory-first data structures and non-blocking I/O are non-negotiable for hyper-scale user-facing platforms."
    },
    {
      company: "Uber",
      logo: "🚗",
      title: "Geospatial Indexing & Real-Time Driver Matching",
      subtitle: "H3 Discrete Global Grid System for sub-second driver dispatch",
      problem: "Matching thousands of passengers with nearest available drivers across continuous GPS coordinates requires millions of distance calculations every second.",
      architecture: [
        "Hexagonal Spatial Partitioning: Divides the entire globe into nested hierarchical hexagons using H3 indices (64-bit integers).",
        "Bitwise Spatial Queries: Resolving a driver's neighborhood is converted into instant bitwise bit-shift operations rather than expensive trigonometry calculations.",
        "Lock-Free Concurrency: Driver location streams update concurrent in-memory skip-lists without blocking read dispatches."
      ],
      impact: "Matches drivers and riders in less than 30ms across 10,000+ cities globally, reducing compute server costs by 65%.",
      keyTakeaway: "Choosing the optimal mathematical representation for your data structure transforms an O(N^2) problem into O(1) bit arithmetic."
    },
    {
      company: "Google",
      logo: "🔍",
      title: "MapReduce & Inverted Indexing at Exabyte Scale",
      subtitle: "The architecture behind indexing 100+ billion web pages",
      problem: "Scanning raw web documents for search terms on a single machine or standard database is physically impossible due to data scale (exabytes).",
      architecture: [
        "Inverted Index Pipeline: Maps every unique term to a sorted array (postings list) of Document IDs and term positions.",
        "Divide-and-Conquer Sharding: The map phase tokenizes web pages into key-value pairs; the reduce phase merges postings lists in parallel across thousands of nodes.",
        "Compression Algorithms: Variable-byte encoding compresses billions of document IDs into minimal memory footprint."
      ],
      impact: "Returns search results across tens of billions of documents in under 0.25 seconds for billions of queries per day.",
      keyTakeaway: "Large scale computing relies on partitioning work across immutable chunks and aggregating with deterministic map-reduce primitives."
    }
  ];

  const [selectedCase, setSelectedCase] = useState<number>(0);
  const activeCase = caseStudies[selectedCase];

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Building2 size={160} />
        </div>
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-3 border border-indigo-500/30">
            <Building2 size={12} /> Real-World Engineering Case Studies
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">
            How Industry Giants Apply These Concepts at Scale
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            See how companies like Netflix, Uber, and Google design their production architectures around the fundamental concepts you are mastering in <span className="text-indigo-300 font-semibold">{lessonTitle}</span>.
          </p>
        </div>
      </div>

      {/* Case Study Tabs & Detail View */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Navigation Sidebar */}
        <div className="space-y-3">
          {caseStudies.map((cs, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedCase(idx)}
              className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-4 ${
                selectedCase === idx
                  ? 'bg-white border-indigo-600 shadow-md ring-2 ring-indigo-600/10'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="text-3xl p-2 rounded-xl bg-slate-100 flex-shrink-0">
                {cs.logo}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">{cs.company}</span>
                  <ChevronRight size={16} className={selectedCase === idx ? 'text-indigo-600' : 'text-slate-300'} />
                </div>
                <h4 className="font-bold text-slate-900 text-sm mt-0.5 truncate">{cs.title}</h4>
                <p className="text-xs text-slate-500 line-clamp-2 mt-1">{cs.subtitle}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Detailed Breakdown Card */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3 pb-6 border-b border-slate-100">
            <span className="text-4xl">{activeCase.logo}</span>
            <div>
              <div className="flex items-center gap-2">
                <span className="badge bg-indigo-50 text-indigo-700 font-bold text-xs">{activeCase.company} Architecture Blueprint</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">{activeCase.title}</h3>
              <p className="text-slate-500 text-xs sm:text-sm mt-0.5">{activeCase.subtitle}</p>
            </div>
          </div>

          {/* Problem Statement */}
          <div className="bg-rose-50/70 border border-rose-100 rounded-2xl p-5">
            <div className="flex items-center gap-2 text-rose-800 font-bold text-sm mb-2">
              <Zap size={16} className="text-rose-600" />
              <span>The Engineering Challenge at Scale</span>
            </div>
            <p className="text-slate-700 text-sm leading-relaxed">{activeCase.problem}</p>
          </div>

          {/* Architecture Solution */}
          <div>
            <div className="flex items-center gap-2 text-slate-900 font-bold text-base mb-3">
              <Layers size={18} className="text-indigo-600" />
              <span>Architectural Solution & Implementation</span>
            </div>
            <ul className="space-y-3">
              {activeCase.architecture.map((arch, i) => (
                <li key={i} className="flex items-start gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm text-slate-700">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="leading-relaxed">{arch}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Performance Impact */}
          <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-5">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm mb-2">
              <ShieldCheck size={16} className="text-emerald-600" />
              <span>Measured Business & System Impact</span>
            </div>
            <p className="text-emerald-900 font-medium text-sm leading-relaxed">{activeCase.impact}</p>
          </div>

          {/* Key Engineering Takeaway */}
          <div className="p-4 rounded-xl bg-slate-900 text-white flex items-start gap-3 text-xs sm:text-sm">
            <span className="text-xl">💡</span>
            <div>
              <span className="font-bold text-indigo-400 uppercase tracking-wider block mb-1">Architectural Takeaway:</span>
              <p className="text-slate-300 leading-relaxed">{activeCase.keyTakeaway}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
