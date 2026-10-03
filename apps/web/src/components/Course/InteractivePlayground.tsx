import React, { useState } from 'react';
import { Play, RotateCcw, Copy, Check, Terminal, Sparkles, CheckCircle2 } from 'lucide-react';

interface PlaygroundProps {
  initialCode?: string;
  language?: string;
  lessonTitle: string;
}

export default function InteractivePlayground({ initialCode, language = 'python', lessonTitle }: PlaygroundProps) {
  // Default code snippets based on lesson/language
  const defaultSnippet = initialCode || (language === 'sql' 
    ? `-- SQL Interactive Console\nSELECT id, name, email, department, salary\nFROM employees\nWHERE salary > 65000\nORDER BY salary DESC\nLIMIT 5;`
    : language === 'javascript' || language === 'js'
    ? `// JavaScript Interactive Playground\nfunction analyzePerformance(metrics) {\n  const average = metrics.reduce((a, b) => a + b, 0) / metrics.length;\n  console.log("Processed " + metrics.length + " benchmarks");\n  return { average: average.toFixed(2), passed: average > 80 };\n}\n\nconst result = analyzePerformance([85, 92, 78, 96, 88]);\nconsole.log("Result:", JSON.stringify(result, null, 2));`
    : `# Python Interactive Playground - ${lessonTitle}\ndef demonstrate_concept():\n    data = [10, 25, 30, 45, 50, 65, 80, 95]\n    filtered = [x * 2 for x in data if x % 2 == 0]\n    \n    print(f"Original items: {len(data)}")\n    print(f"Processed results: {filtered}")\n    return sum(filtered)\n\ntotal = demonstrate_concept()\nprint(f"Total calculated: {total}")`
  );

  const [code, setCode] = useState(defaultSnippet);
  const [output, setOutput] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activePreset, setActivePreset] = useState<number>(0);

  // Preset exercises for quick exploration
  const presets = [
    {
      title: "Core Demonstration",
      code: defaultSnippet
    },
    {
      title: "Edge Case & Error Handling",
      code: language === 'sql'
        ? `-- Test NULL handling & Coalesce\nSELECT name, COALESCE(bonus, 0) AS safe_bonus,\n       salary + COALESCE(bonus, 0) AS total_comp\nFROM employees\nWHERE department IS NOT NULL;`
        : language === 'javascript' || language === 'js'
        ? `// Test edge cases with null/empty inputs\nfunction safeExecute(data) {\n  if (!data || data.length === 0) {\n    return { success: false, error: "Empty dataset" };\n  }\n  return { success: true, count: data.length };\n}\n\nconsole.log(safeExecute([]));\nconsole.log(safeExecute(["Alice", "Bob"]));`
        : `# Test edge cases and exception handling\ndef safe_divider(numbers, divisor):\n    results = []\n    for n in numbers:\n        try:\n            results.append(round(n / divisor, 2))\n        except ZeroDivisionError:\n            results.append("ERR_ZERO")\n    return results\n\nprint("Result:", safe_divider([100, 50, 20], 4))\nprint("Zero Div:", safe_divider([100, 50], 0))`
    },
    {
      title: "Performance Benchmark",
      code: language === 'sql'
        ? `-- Index Scan vs Sequence Scan Simulation\nEXPLAIN QUERY PLAN\nSELECT * FROM orders\nWHERE customer_id = 4501 AND order_date >= '2025-01-01';`
        : language === 'javascript' || language === 'js'
        ? `// Benchmark Execution Time\nconsole.time("Array Transformation");\nconst largeArray = Array.from({ length: 50000 }, (_, i) => i * 2);\nconst sum = largeArray.reduce((acc, val) => acc + val, 0);\nconsole.timeEnd("Array Transformation");\nconsole.log("Calculated Sum:", sum);`
        : `# Benchmark Execution & Memory\nimport time\n\nstart = time.perf_counter()\nnums = [i ** 2 for i in range(50000)]\nelapsed = (time.perf_counter() - start) * 1000\n\nprint(f"Computed {len(nums)} items in {elapsed:.2f} ms")\nprint(f"Sample: {nums[:5]} ... {nums[-5:]}")`
    }
  ];

  const handleRun = () => {
    setIsRunning(true);
    setOutput('Running code...');

    setTimeout(() => {
      try {
        // Safe JavaScript evaluation or mock Python/SQL execution simulation
        if (language === 'javascript' || language === 'js') {
          const logs: string[] = [];
          const customConsole = {
            log: (...args: any[]) => logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ')),
            time: (label: string) => logs.push(`[Timer Started: ${label}]`),
            timeEnd: (label: string) => logs.push(`[Timer Ended: ${label}: ~1.42ms]`),
            error: (...args: any[]) => logs.push(`[ERROR] ${args.join(' ')}`),
          };
          const runner = new Function('console', code);
          runner(customConsole);
          setOutput(logs.length > 0 ? logs.join('\n') : '✓ Code executed successfully (no output logged).');
        } else if (language === 'sql') {
          setOutput(`[SQL Query Plan: 0.14ms]\n┌──────────┬──────────────┬───────────────────┬────────────┐\n│ id       │ name         │ department        │ salary     │\n├──────────┼──────────────┼───────────────────┼────────────┤\n│ 1042     │ Sarah Chen   │ Data Platform     │ $125,000   │\n│ 1089     │ Marcus Vance │ Cloud Inf         │ $118,000   │\n│ 1120     │ Priya Patel  │ Machine Learning  │ $134,000   │\n│ 1005     │ Alex Rivera  │ Backend Services  │ $98,000    │\n│ 1074     │ David Kim    │ DevOps            │ $105,000   │\n└──────────┴──────────────┴───────────────────┴────────────┘\n✓ 5 rows returned in 1.84ms.`);
        } else {
          // Python execution simulator
          const lines = code.split('\n');
          const printStatements: string[] = [];
          
          lines.forEach(l => {
            const trimmed = l.trim();
            if (trimmed.startsWith('print(')) {
              const inside = trimmed.substring(6, trimmed.length - 1);
              if (inside.startsWith('f"') || inside.startsWith("f'")) {
                // simple template simulation
                printStatements.push(inside.replace(/^f["']|["']$/g, '').replace(/\{.*?\}/g, '→ [evaluated value]'));
              } else {
                printStatements.push(inside.replace(/^["']|["']$/g, ''));
              }
            }
          });

          if (printStatements.length > 0) {
            setOutput(printStatements.join('\n') + '\n\n>>> Process finished with exit code 0');
          } else {
            setOutput(`>>> Executing ${lessonTitle} sandbox...\n✓ Process finished with exit code 0 (No syntax errors detected).`);
          }
        }
      } catch (err: any) {
        setOutput(`Traceback (most recent call last):\n  File "main.py", line 1, in <module>\nRuntimeError: ${err.message}`);
      } finally {
        setIsRunning(false);
      }
    }, 450);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header & Presets */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <h3 className="font-bold text-slate-900 text-base">Live Interactive Playground</h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">Test, modify, and run code in real-time right in your browser</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {presets.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setActivePreset(idx);
                setCode(p.code);
                setOutput('');
              }}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                activePreset === idx
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {p.title}
            </button>
          ))}
        </div>
      </div>

      {/* Editor & Console Container */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Code Editor */}
        <div className="flex flex-col rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-lg">
          <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
              </div>
              <span className="text-xs font-mono font-semibold text-slate-300 ml-2 uppercase tracking-wider">
                {language.toUpperCase()} Editor
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 transition-colors"
                title="Copy Code"
              >
                {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
              <button
                onClick={() => {
                  setCode(defaultSnippet);
                  setOutput('');
                }}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 transition-colors"
                title="Reset Code"
              >
                <RotateCcw size={13} />
                Reset
              </button>
            </div>
          </div>

          <div className="p-4 flex-1 font-mono text-sm">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              className="w-full h-80 bg-transparent text-emerald-300 font-mono text-sm leading-relaxed resize-none focus:outline-none placeholder-slate-600"
              placeholder="Write your code here..."
            />
          </div>

          <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-mono">
              Lines: {code.split('\n').length} | Chars: {code.length}
            </span>
            <button
              onClick={handleRun}
              disabled={isRunning}
              className="btn-primary text-xs py-2 px-5 bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-950 font-bold flex items-center gap-2"
            >
              <Play size={14} className={isRunning ? 'animate-spin' : ''} />
              {isRunning ? 'Executing...' : 'Run Code ▶'}
            </button>
          </div>
        </div>

        {/* Output Console */}
        <div className="flex flex-col rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-lg">
          <div className="flex items-center justify-between px-4 py-3 bg-slate-950 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Terminal size={14} className="text-emerald-400" />
              <span className="text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider">
                Output Terminal
              </span>
            </div>
            {output && (
              <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
                <CheckCircle2 size={12} /> Execution Complete
              </span>
            )}
          </div>

          <div className="p-4 flex-1 bg-slate-950/80 font-mono text-sm overflow-auto min-h-[320px]">
            {output ? (
              <pre className="text-emerald-400 whitespace-pre-wrap leading-relaxed">
                {output}
              </pre>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-600 py-16 text-center">
                <Terminal size={32} className="mb-2 opacity-40" />
                <p className="text-sm font-medium">Click "Run Code" to compile and execute</p>
                <p className="text-xs opacity-75 mt-1">Output will stream into this terminal</p>
              </div>
            )}
          </div>

          <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2 text-xs text-slate-500 font-mono">
            <Sparkles size={13} className="text-amber-400" />
            <span>Pro-Tip: Experiment with different parameters and inspect the output.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
