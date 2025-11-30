import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { ComponentPropsWithoutRef } from 'react';
import { useState, useEffect } from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';
import 'highlight.js/styles/github-dark.css';

interface Props {
  content: string;
}

export const MarkdownRenderer = ({ content }: Props) => {
  const [copiedBlock, setCopiedBlock] = useState<string | null>(null);

  type CodeProps = ComponentPropsWithoutRef<'code'> & { inline?: boolean; node?: unknown };

  const handleCopy = async (code: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedBlock(code);
    setTimeout(() => setCopiedBlock(null), 1500);
  };

  const CodeBlock = ({ inline, className, children, ...props }: CodeProps) => {
    const match = /language-(\w+)/.exec(className ?? '');
    const language = match?.[1];
    const codeString = String(children).replace(/\n$/, '');

    if (inline) {
      return (
        <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm font-medium text-slate-800 dark:bg-slate-800 dark:text-slate-200" {...props}>
          {children}
        </code>
      );
    }

    // Manual highlighting
    const highlightedCode = language && hljs.getLanguage(language)
      ? hljs.highlight(codeString, { language }).value
      : hljs.highlightAuto(codeString).value;

    return (
      <div className="group relative my-6 overflow-hidden rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-100/50 px-4 py-2 dark:border-slate-800 dark:bg-slate-800/50">
          <span className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {language ?? 'text'}
          </span>
          <button
            type="button"
            className="flex items-center gap-1.5 rounded text-xs font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
            onClick={() => handleCopy(codeString)}
          >
            {copiedBlock === codeString ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5 text-emerald-500">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                </svg>
                <span className="text-emerald-500">Copied</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
                  <path d="M7 3.5A1.5 1.5 0 018.5 2h3.879a1.5 1.5 0 011.06.44l3.122 3.12A1.5 1.5 0 0117 6.622V12.5a1.5 1.5 0 01-1.5 1.5h-1v-3.379a3 3 0 00-.879-2.121L10.5 5.379A3 3 0 008.379 4.5H7v-1z" />
                  <path d="M4.5 6A1.5 1.5 0 003 7.5v9A1.5 1.5 0 004.5 18h7a1.5 1.5 0 001.5-1.5v-5.879a1.5 1.5 0 00-.44-1.06L9.44 6.439A1.5 1.5 0 008.378 6H4.5z" />
                </svg>
                Copy
              </>
            )}
          </button>
        </div>
        <div className="overflow-x-auto p-4 text-sm">
          <pre {...props}>
            <code
              className={className}
              dangerouslySetInnerHTML={{ __html: highlightedCode }}
            />
          </pre>
        </div>
      </div>
    );
  };

  const components: Components = {
    code: CodeBlock as Components['code'],
    img({ alt, src }) {
      if (!src) return null;
      return (
        <figure className="my-8">
          <img src={src} alt={alt ?? ''} className="mx-auto rounded-lg shadow-sm" />
          {alt ? <figcaption className="mt-3 text-center text-sm text-slate-500 italic">{alt}</figcaption> : null}
        </figure>
      );
    },
    a({ href, children }) {
      return (
        <a href={href} className="text-indigo-600 underline decoration-indigo-300 decoration-2 underline-offset-2 hover:decoration-indigo-600 dark:text-indigo-400 dark:decoration-indigo-700 dark:hover:decoration-indigo-400" target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      );
    },
    blockquote({ children }) {
      return (
        <blockquote className="border-l-4 border-indigo-500 bg-slate-50 py-1 pl-4 pr-2 italic text-slate-700 dark:border-indigo-400 dark:bg-slate-800/50 dark:text-slate-300">
          {children}
        </blockquote>
      );
    }
  };

  return (
    <ReactMarkdown
      className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-serif prose-headings:font-semibold prose-p:leading-relaxed prose-li:marker:text-slate-400"
      remarkPlugins={[remarkGfm]}
      components={components}
    >
      {content}
    </ReactMarkdown>
  );
};
