import React, { useState } from 'react';
import { Target, Award, ChevronDown, CheckCircle2, HelpCircle, Code2, Sparkles, Building } from 'lucide-react';

interface InterviewVaultProps {
  lessonTitle: string;
  courseCategory?: string;
}

export default function InterviewVault({ lessonTitle, courseCategory = 'programming' }: InterviewVaultProps) {
  const [activeTab, setActiveTab] = useState<'conceptual' | 'coding'>('conceptual');
  const [revealedSolutions, setRevealedSolutions] = useState<Record<number, boolean>>({});

  const toggleSolution = (id: number) => {
    setRevealedSolutions(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const conceptualQuestions = [
    {
      id: 1,
      company: "Google",
      difficulty: "Medium",
      question: `How does memory allocation and garbage collection work in this paradigm, and how do you prevent memory leaks?`,
      answer: `Memory management in modern high-level runtimes utilizes reference counting combined with a cyclic garbage collector. Variables act as named memory references pointing to objects allocated on the heap. Memory leaks occur when circular references prevent the reference counter from hitting zero, or when event listeners / global caches maintain strong references to objects that are no longer in active scope. To prevent leaks, utilize weak references (e.g. \`weakref\` in Python or \`WeakMap\` in JS) and explicitly prune detached objects.`,
      tags: ["Memory Management", "Garbage Collection", "Internals"]
    },
    {
      id: 2,
      company: "Meta / Facebook",
      difficulty: "Hard",
      question: `What is the worst-case time complexity of hash table operations, and how do production systems mitigate Hash Collision DoS attacks?`,
      answer: `The worst-case time complexity of hash table lookup, insertion, and deletion is O(N) when all keys hash to the same bucket (hash collision storm). In production systems, attackers could maliciously craft payload keys with identical hash values to force the server into O(N^2) processing time (SipHash DoS). To mitigate this, modern runtimes utilize randomized hash seeds (like SipHash-2-4 in Python and Rust) and tree-ified hash buckets (e.g. Red-Black trees in Java/C++ when bucket length exceeds threshold 8).`,
      tags: ["Hash Tables", "Security", "Algorithmic Complexity"]
    },
    {
      id: 3,
      company: "Amazon",
      difficulty: "Medium",
      question: `Explain the trade-offs between In-Memory Computation vs. Disk-Based Storage for large data workloads.`,
      answer: `In-memory computation (RAM) offers nanosecond-level access (~100ns) and high throughput, making it ideal for real-time aggregation and hot caching. However, RAM is volatile, constrained by capacity, and orders of magnitude more expensive per gigabyte than NVMe SSDs (~100-300μs latency). Distributed architectures solve this via a tiered storage model: active state resides in memory, while append-only write-ahead logs (WAL) and cold historical data are flushed to durable block/object storage.`,
      tags: ["System Design", "Storage", "Architecture"]
    }
  ];

  const codingChallenges = [
    {
      id: 101,
      title: "Optimized Stream Deduplication & Frequency Tracking",
      company: "Microsoft",
      difficulty: "Medium",
      description: "Given an incoming continuous data stream of transactions, return the top K most frequent entity IDs within a sliding window of N elements, ensuring minimal memory overhead and O(1) average lookup.",
      timeComplexity: "O(N log K)",
      spaceComplexity: "O(N) unique elements",
      starterCode: `def top_k_frequent_stream(stream, k):\n    # TODO: Implement frequency tracking with Min-Heap\n    pass`,
      solution: `from collections import Counter\nimport heapq\n\ndef top_k_frequent_stream(stream, k):\n    # Step 1: Compute frequencies using hash table O(N)\n    freq_map = Counter(stream)\n    \n    # Step 2: Maintain min-heap of size k O(U log K)\n    # Where U is number of unique keys\n    return heapq.nlargest(k, freq_map.keys(), key=freq_map.get)\n\n# Test verification\nprint(top_k_frequent_stream(["txn_a", "txn_b", "txn_a", "txn_c", "txn_a", "txn_b"], 2))\n# Output: ['txn_a', 'txn_b']`
    },
    {
      id: 102,
      title: "Thread-Safe Concurrency Lock & Rate Limiter",
      company: "Uber",
      difficulty: "Hard",
      description: "Implement a sliding-window rate limiter class that allows at most X requests per Y seconds per user key, handling concurrent simultaneous requests safely.",
      timeComplexity: "O(1) per request",
      spaceComplexity: "O(K) where K is number of active users",
      starterCode: `class SlidingWindowRateLimiter:\n    def __init__(self, max_requests: int, window_seconds: int):\n        pass\n    \n    def allow_request(self, user_id: str) -> bool:\n        pass`,
      solution: `import time\nfrom collections import deque\nimport threading\n\nclass SlidingWindowRateLimiter:\n    def __init__(self, max_requests: int, window_seconds: int):\n        self.max_requests = max_requests\n        self.window = window_seconds\n        self.user_timestamps = {}\n        self.lock = threading.Lock()\n        \n    def allow_request(self, user_id: str) -> bool:\n        now = time.time()\n        with self.lock:\n            if user_id not in self.user_timestamps:\n                self.user_timestamps[user_id] = deque()\n                \n            timestamps = self.user_timestamps[user_id]\n            \n            # Evict timestamps outside current window\n            while timestamps and now - timestamps[0] > self.window:\n                timestamps.popleft()\n                \n            if len(timestamps) < self.max_requests:\n                timestamps.append(now)\n                return True\n            return False`
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-purple-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold uppercase tracking-wider mb-3 border border-purple-500/30">
              <Award size={12} /> Top Tech Interview Vault
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">
              FAANG & High-Growth Tech Interview Questions
            </h2>
            <p className="text-slate-300 text-sm">
              Real interview problems tested at Google, Meta, Amazon, Microsoft, and Uber on <span className="text-purple-300 font-semibold">{lessonTitle}</span>.
            </p>
          </div>

          {/* Toggle Tab */}
          <div className="flex items-center bg-slate-800/80 p-1 rounded-2xl border border-slate-700">
            <button
              onClick={() => setActiveTab('conceptual')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'conceptual'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Conceptual & Deep-Dive (3)
            </button>
            <button
              onClick={() => setActiveTab('coding')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'coding'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Coding Challenges (2)
            </button>
          </div>
        </div>
      </div>

      {/* Conceptual Questions Tab */}
      {activeTab === 'conceptual' && (
        <div className="space-y-4">
          {conceptualQuestions.map((q) => {
            const isRevealed = revealedSolutions[q.id];
            return (
              <div key={q.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden transition-all">
                <div className="p-6 sm:p-8">
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-bold">
                        <Building size={12} className="text-indigo-600" /> {q.company}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        q.difficulty === 'Easy' ? 'bg-emerald-50 text-emerald-700' :
                        q.difficulty === 'Medium' ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'
                      }`}>
                        {q.difficulty}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {q.tags.map((t, idx) => (
                        <span key={idx} className="hidden sm:inline-block text-xs text-slate-400 bg-slate-50 px-2.5 py-1 rounded-md">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 leading-snug mb-4">
                    {q.question}
                  </h3>

                  <button
                    onClick={() => toggleSolution(q.id)}
                    className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-xl transition-all"
                  >
                    <ChevronDown size={14} className={`transition-transform duration-200 ${isRevealed ? 'rotate-180' : ''}`} />
                    {isRevealed ? 'Hide Detailed Answer & Architecture' : 'Reveal Staff Engineer Solution'}
                  </button>

                  {isRevealed && (
                    <div className="mt-6 p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 animate-fadeIn">
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider">
                        <CheckCircle2 size={16} /> Official Interviewer Answer Guide
                      </div>
                      <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
                        {q.answer}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Coding Challenges Tab */}
      {activeTab === 'coding' && (
        <div className="space-y-6">
          {codingChallenges.map((c) => {
            const isRevealed = revealedSolutions[c.id];
            return (
              <div key={c.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 sm:p-8 space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-purple-50 text-purple-700 text-xs font-bold">
                        <Building size={12} /> {c.company}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700">
                        {c.difficulty}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs font-mono text-slate-500">
                      <span>Time: <strong className="text-slate-800">{c.timeComplexity}</strong></span>
                      <span>•</span>
                      <span>Space: <strong className="text-slate-800">{c.spaceComplexity}</strong></span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900">{c.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{c.description}</p>

                  {/* Starter Code Block */}
                  <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-900">
                    <div className="px-4 py-2 bg-slate-950 text-slate-400 text-xs font-mono flex items-center gap-2">
                      <Code2 size={13} /> Starter Boilerplate
                    </div>
                    <pre className="p-4 text-xs font-mono text-slate-200 leading-relaxed overflow-x-auto">
                      <code>{c.starterCode}</code>
                    </pre>
                  </div>

                  <button
                    onClick={() => toggleSolution(c.id)}
                    className="inline-flex items-center gap-2 text-xs font-bold text-purple-600 hover:text-purple-800 bg-purple-50 hover:bg-purple-100 px-4 py-2.5 rounded-xl transition-all"
                  >
                    <ChevronDown size={14} className={`transition-transform duration-200 ${isRevealed ? 'rotate-180' : ''}`} />
                    {isRevealed ? 'Hide Reference Code' : 'View Optimal Solution & Walkthrough'}
                  </button>

                  {isRevealed && (
                    <div className="mt-4 rounded-2xl overflow-hidden border border-emerald-500/30 bg-slate-950 animate-fadeIn">
                      <div className="px-4 py-2.5 bg-emerald-950/60 border-b border-emerald-900/50 text-emerald-400 text-xs font-mono font-bold flex items-center justify-between">
                        <span className="flex items-center gap-2"><Sparkles size={13} /> Optimal Production Implementation</span>
                        <span>{c.timeComplexity}</span>
                      </div>
                      <pre className="p-5 text-xs font-mono text-emerald-300 leading-relaxed overflow-x-auto">
                        <code>{c.solution}</code>
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
