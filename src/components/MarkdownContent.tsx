import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownContentProps {
  content: string;
  className?: string;
}

export function MarkdownContent({ content, className = "" }: MarkdownContentProps) {
  return (
    <div className={`w-full ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-[var(--foreground)] font-normal tracking-tight mt-12 mb-6 pb-3 border-b border-[var(--border)] first:mt-0">
              {children}
            </h2>
          ),
          h2: ({ children }) => (
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-serif text-[var(--foreground)] font-normal tracking-tight mt-10 mb-4 pb-2 border-b border-[var(--border)] first:mt-0">
              {children}
            </h3>
          ),
          h3: ({ children }) => (
            <h4 className="text-lg sm:text-xl lg:text-2xl font-serif text-[var(--foreground)] font-normal tracking-tight mt-8 mb-3 first:mt-0">
              {children}
            </h4>
          ),
          h4: ({ children }) => (
            <h5 className="text-base sm:text-lg font-serif text-[var(--foreground)] font-medium tracking-tight mt-6 mb-2 first:mt-0">
              {children}
            </h5>
          ),
          p: ({ children }) => (
            <p className="text-base sm:text-lg text-[var(--foreground)] font-light leading-relaxed my-4">
              {children}
            </p>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-[var(--foreground)]">
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="italic text-[var(--foreground)]">
              {children}
            </em>
          ),
          ul: ({ children }) => (
            <ul className="list-disc pl-6 space-y-2 my-4 text-[var(--foreground)]">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-6 space-y-2 my-4 text-[var(--foreground)]">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-base sm:text-lg text-[var(--foreground)] font-light leading-relaxed">
              {children}
            </li>
          ),
          table: ({ children }) => (
            <div className="w-full overflow-x-auto my-8 border border-[var(--border)] rounded-sm bg-[var(--card)]">
              <table className="w-full text-left text-sm border-collapse min-w-[500px]">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-[var(--muted)] border-b border-[var(--border)] text-[var(--foreground)]">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-[var(--border)] text-[var(--foreground)]">
              {children}
            </tbody>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-[var(--muted)]/40 transition-colors">
              {children}
            </tr>
          ),
          th: ({ children }) => (
            <th className="p-3.5 sm:p-4 font-mono text-xs uppercase tracking-wider text-[var(--foreground)] font-semibold border-r border-[var(--border)] last:border-r-0">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="p-3.5 sm:p-4 text-[var(--foreground)] font-light text-sm sm:text-base border-r border-[var(--border)] last:border-r-0 align-top">
              {children}
            </td>
          ),
          code: ({ className, children, ...props }: any) => {
            const match = /language-(\w+)/.exec(className || "");
            const isCodeBlock = Boolean(match) || (typeof children === "string" && children.includes("\n"));
            
            if (!isCodeBlock) {
              return (
                <code
                  className="font-mono text-xs sm:text-sm bg-[var(--muted)] text-[var(--foreground)] px-1.5 py-0.5 rounded border border-[var(--border)]"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return (
              <code className="font-mono text-xs sm:text-sm text-[var(--foreground)] block" {...props}>
                {children}
              </code>
            );
          },
          pre: ({ children }) => (
            <pre className="my-6 p-4 sm:p-6 bg-[var(--muted)]/60 text-[var(--foreground)] border border-[var(--border)] rounded-sm font-mono text-xs sm:text-sm overflow-x-auto leading-relaxed">
              {children}
            </pre>
          ),
          hr: () => <hr className="my-10 border-t border-[var(--border)]" />,
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-[var(--foreground)] pl-4 py-1 italic text-[var(--muted-foreground)] my-6">
              {children}
            </blockquote>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 font-medium text-[var(--foreground)] hover:opacity-70 transition-opacity"
            >
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
