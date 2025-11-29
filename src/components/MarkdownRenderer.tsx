import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { useState } from 'react';
import 'highlight.js/styles/github.css';
import 'highlight.js/styles/github-dark.css';

interface Props {
  content: string;
}

export const MarkdownRenderer = ({ content }: Props) => {
  const [copiedBlock, setCopiedBlock] = useState<string | null>(null);

  const handleCopy = async (code: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedBlock(code);
    setTimeout(() => setCopiedBlock(null), 1500);
  };

  return (
    <ReactMarkdown
      className="prose prose-lg max-w-none dark:prose-invert"
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[[rehypeHighlight, { detect: true }]]}
      components={{
        code({ inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className ?? '');
          const codeString = String(children).replace(/\n$/, '');
          if (inline) {
            return (
              <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm dark:bg-slate-800" {...props}>
                {children}
              </code>
            );
          }
          return (
            <div className="relative">
              <pre className={className} {...props}>
                <code>{codeString}</code>
              </pre>
              <button
                type="button"
                className="absolute right-2 top-2 rounded-md bg-black/70 px-2 py-1 text-xs text-white hover:bg-black/90"
                onClick={() => handleCopy(codeString)}
              >
                {copiedBlock === codeString ? 'Copied' : 'Copy'}
              </button>
              {match?.[1] && (
                <span className="absolute left-2 top-2 rounded bg-slate-900/70 px-2 py-1 text-xs uppercase tracking-wide text-white">
                  {match[1]}
                </span>
              )}
            </div>
          );
        },
        img({ alt, src }) {
          if (!src) return null;
          return (
            <figure className="my-6">
              <img src={src} alt={alt ?? ''} className="mx-auto rounded-lg" />
              {alt ? <figcaption className="mt-2 text-center text-sm text-slate-500">{alt}</figcaption> : null}
            </figure>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
};
