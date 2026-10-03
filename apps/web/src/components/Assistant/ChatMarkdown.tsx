import React, { useState } from 'react'
import { Check, Copy } from 'lucide-react'

interface ChatMarkdownProps {
  content: string
}

export const ChatMarkdown: React.FC<ChatMarkdownProps> = ({ content }) => {
  // Helper to copy code block
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const handleCopy = (code: string, idx: number) => {
    navigator.clipboard.writeText(code)
    setCopiedIndex(idx)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  // Split content by code blocks ```lang ... ```
  const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g
  const parts: React.ReactNode[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null
  let blockIndex = 0

  while ((match = codeBlockRegex.exec(content)) !== null) {
    const textBefore = content.substring(lastIndex, match.index)
    if (textBefore) {
      parts.push(<FormattedText key={`text-${lastIndex}`} text={textBefore} />)
    }

    const language = match[1] || 'code'
    const code = match[2]
    const curIdx = blockIndex++

    parts.push(
      <div key={`code-${curIdx}`} className="my-3 rounded-xl overflow-hidden border border-slate-700 bg-slate-900 shadow-sm text-sm">
        <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700 text-xs text-slate-300 font-mono">
          <span className="uppercase tracking-wider font-semibold text-indigo-400">{language}</span>
          <button
            onClick={() => handleCopy(code, curIdx)}
            className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Copy code"
          >
            {copiedIndex === curIdx ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-medium">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
        <div className="p-4 overflow-x-auto text-slate-100 font-mono text-xs leading-relaxed selection:bg-indigo-600">
          <pre>{code}</pre>
        </div>
      </div>
    )

    lastIndex = match.index + match[0].length
  }

  if (lastIndex < content.length) {
    parts.push(<FormattedText key={`text-end`} text={content.substring(lastIndex)} />)
  }

  return <div className="space-y-2 text-slate-800 text-sm leading-relaxed">{parts}</div>
}

// Formats prose text: headers, bullet lists, bold, inline code, tables, quotes
const FormattedText: React.FC<{ text: string }> = ({ text }) => {
  const lines = text.split('\n')
  const elements: React.ReactNode[] = []
  let tableRows: string[] = []
  let inTable = false

  const flushTable = (keyPrefix: number) => {
    if (tableRows.length === 0) return null
    const headerRow = tableRows[0]
    const bodyRows = tableRows.slice(2) // skip separator row like |:---|:---|

    const parseCells = (row: string) =>
      row
        .split('|')
        .slice(1, -1)
        .map(c => c.trim())

    const headers = parseCells(headerRow)

    const rendered = (
      <div key={`table-${keyPrefix}`} className="my-3 overflow-x-auto rounded-lg border border-slate-200 shadow-sm">
        <table className="min-w-full text-xs text-left">
          <thead className="bg-slate-100 text-slate-700 font-semibold uppercase tracking-wider border-b border-slate-200">
            <tr>
              {headers.map((h, i) => (
                <th key={i} className="px-3 py-2">
                  <InlineFormatting line={h} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {bodyRows.map((r, ri) => (
              <tr key={ri} className={ri % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                {parseCells(r).map((cell, ci) => (
                  <td key={ci} className="px-3 py-2 text-slate-700">
                    <InlineFormatting line={cell} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
    tableRows = []
    inTable = false
    return rendered
  }

  lines.forEach((line, index) => {
    const trimmed = line.trim()

    // Table detection
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      inTable = true
      tableRows.push(trimmed)
      return
    } else if (inTable) {
      elements.push(flushTable(index))
    }

    if (!trimmed) {
      elements.push(<div key={`spacer-${index}`} className="h-1.5" />)
      return
    }

    // Headings
    if (line.startsWith('### ')) {
      elements.push(
        <h3 key={index} className="text-base font-bold text-slate-900 mt-4 mb-2 flex items-center gap-1.5">
          <InlineFormatting line={line.replace('### ', '')} />
        </h3>
      )
    } else if (line.startsWith('#### ')) {
      elements.push(
        <h4 key={index} className="text-sm font-semibold text-slate-800 mt-3 mb-1.5">
          <InlineFormatting line={line.replace('#### ', '')} />
        </h4>
      )
    } else if (line.startsWith('## ')) {
      elements.push(
        <h2 key={index} className="text-lg font-bold text-slate-900 mt-5 mb-2 pb-1 border-b border-slate-200">
          <InlineFormatting line={line.replace('## ', '')} />
        </h2>
      )
    } else if (line.startsWith('# ')) {
      elements.push(
        <h1 key={index} className="text-xl font-extrabold text-slate-900 mt-6 mb-3">
          <InlineFormatting line={line.replace('# ', '')} />
        </h1>
      )
    } else if (line.startsWith('> ')) {
      // Blockquote
      elements.push(
        <blockquote
          key={index}
          className="my-2 border-l-4 border-indigo-500 bg-indigo-50/60 pl-3.5 py-2 text-slate-700 italic rounded-r-lg"
        >
          <InlineFormatting line={line.replace('> ', '')} />
        </blockquote>
      )
    } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      // Bullet list
      const indent = line.search(/\S/) > 2 ? 'ml-5' : 'ml-2'
      elements.push(
        <div key={index} className={`flex items-start gap-2 my-1 ${indent}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0" />
          <div className="flex-1 text-slate-700">
            <InlineFormatting line={trimmed.replace(/^[-*]\s+/, '')} />
          </div>
        </div>
      )
    } else if (/^\d+\.\s/.test(trimmed)) {
      // Numbered list
      const numMatch = trimmed.match(/^(\d+)\.\s/)
      const num = numMatch ? numMatch[1] : '•'
      elements.push(
        <div key={index} className="flex items-start gap-2 my-1.5 ml-2">
          <span className="font-semibold text-indigo-600 text-xs mt-0.5 min-w-[1.2rem]">{num}.</span>
          <div className="flex-1 text-slate-700">
            <InlineFormatting line={trimmed.replace(/^\d+\.\s+/, '')} />
          </div>
        </div>
      )
    } else {
      // Standard paragraph
      elements.push(
        <p key={index} className="my-1 text-slate-700">
          <InlineFormatting line={line} />
        </p>
      )
    }
  })

  if (inTable) {
    elements.push(flushTable(lines.length))
  }

  return <>{elements}</>
}

// Inline token renderer for **bold**, *italic*, and `inline code`
const InlineFormatting: React.FC<{ line: string }> = ({ line }) => {
  // Regex to split by `code`, **bold**, *italic*
  const parts = line.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g)

  return (
    <>
      {parts.map((part, i) => {
        if (!part) return null

        if (part.startsWith('`') && part.endsWith('`')) {
          return (
            <code
              key={i}
              className="bg-slate-100 text-indigo-700 px-1.5 py-0.5 rounded text-[13px] font-mono border border-slate-200"
            >
              {part.slice(1, -1)}
            </code>
          )
        }

        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={i} className="font-semibold text-slate-900">
              {part.slice(2, -2)}
            </strong>
          )
        }

        if (part.startsWith('*') && part.endsWith('*')) {
          return (
            <em key={i} className="italic text-slate-800">
              {part.slice(1, -1)}
            </em>
          )
        }

        return <span key={i}>{part}</span>
      })}
    </>
  )
}
