function Kw({ children }: { children: string }) {
  return <span style={{ color: '#c678dd' }}>{children}</span>;
}
function Str({ children }: { children: string }) {
  return <span style={{ color: '#98c379' }}>{children}</span>;
}
function Fn({ children }: { children: string }) {
  return <span style={{ color: '#61afef' }}>{children}</span>;
}
function Ty({ children }: { children: string }) {
  return <span style={{ color: '#e5c07b' }}>{children}</span>;
}

const AI_TAGS = [
  { label: 'react', color: '#3b82f6' },
  { label: 'hooks', color: '#06b6d4' },
  { label: 'typescript', color: '#f59e0b' },
  { label: 'performance', color: '#22c55e' },
];

export default function AISection() {
  return (
    <section
      className="py-24"
      style={{ background: '#13131a', borderTop: '1px solid #2a2a38', borderBottom: '1px solid #2a2a38' }}
    >
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 min-[900px]:grid-cols-2 gap-16 items-center">
          <div>
            <span
              className="inline-flex items-center text-[11px] font-bold tracking-[1px] px-2.5 py-1 rounded-md mb-5"
              style={{
                background: 'linear-gradient(135deg,#f59e0b22,#f59e0b11)',
                border: '1px solid #f59e0b44',
                color: '#f59e0b',
              }}
            >
              PRO FEATURE
            </span>
            <h2
              className="font-extrabold mb-4"
              style={{
                fontSize: 'clamp(24px, 3vw, 36px)',
                letterSpacing: '-0.5px',
                color: '#e2e2f0',
              }}
            >
              AI that works for developers
            </h2>
            <p className="mb-7 leading-[1.7]" style={{ color: '#6b6b8a' }}>
              Let AI handle the boring parts — tagging, summarizing, and explaining — so you can
              focus on building.
            </p>
            <ul className="flex flex-col gap-3">
              {[
                'Auto-tag suggestions based on content',
                'AI summaries for long notes and snippets',
                'Explain This Code — instant AI explanations',
                'Prompt Optimizer — refine your AI prompts',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-[15px]" style={{ color: '#e2e2f0' }}>
                  <span className="font-bold shrink-0 mt-px" style={{ color: '#22c55e' }}>✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div
            className="rounded-xl overflow-hidden"
            style={{ background: '#0a0a0f', border: '1px solid #2a2a38', fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}
          >
            <div
              className="flex items-center gap-1.5 px-3.5 py-2.5"
              style={{ background: '#131320', borderBottom: '1px solid #2a2a38' }}
            >
              <span className="w-3 h-3 rounded-full" style={{ background: '#ff5f57' }} />
              <span className="w-3 h-3 rounded-full" style={{ background: '#febc2e' }} />
              <span className="w-3 h-3 rounded-full" style={{ background: '#28c840' }} />
              <span className="ml-2 text-xs" style={{ color: '#6b6b8a' }}>useDebounce.ts</span>
            </div>
            <div className="p-5 overflow-x-auto">
              <pre className="m-0">
                <code
                  className="text-[12.5px] leading-[1.7]"
                  style={{ color: '#abb2bf', fontFamily: 'inherit' }}
                >
                  <Kw>import</Kw>
                  {' { useState, useEffect } '}
                  <Kw>from</Kw>
                  {' '}
                  <Str>&apos;react&apos;</Str>
                  {'\n\n'}
                  <Kw>export function</Kw>
                  {' '}
                  <Fn>useDebounce</Fn>
                  {'<T>(\n'}
                  {'  value: T,\n'}
                  {'  delay: '}
                  <Ty>number</Ty>
                  {'\n): T {\n'}
                  {'  '}
                  <Kw>const</Kw>
                  {' [debouncedValue, setDebouncedValue] =\n'}
                  {'    useState<T>(value)\n\n'}
                  {'  useEffect(() => {\n'}
                  {'    '}
                  <Kw>const</Kw>
                  {' timer = setTimeout(() => {\n'}
                  {'      setDebouncedValue(value)\n'}
                  {'    }, delay)\n'}
                  {'    '}
                  <Kw>return</Kw>
                  {' () => clearTimeout(timer)\n'}
                  {'  }, [value, delay])\n\n'}
                  {'  '}
                  <Kw>return</Kw>
                  {' debouncedValue\n}'}
                </code>
              </pre>
            </div>
            <div
              className="flex items-center gap-2 px-3.5 py-3 flex-wrap"
              style={{ background: '#0f0f1a', borderTop: '1px solid #2a2a38' }}
            >
              <span
                className="text-[11px] font-semibold tracking-[0.5px] mr-1"
                style={{ color: '#6b6b8a' }}
              >
                AI Generated Tags
              </span>
              {AI_TAGS.map((tag) => (
                <span
                  key={tag.label}
                  className="text-[11px] font-semibold px-2 py-0.5 rounded"
                  style={{
                    background: `${tag.color}26`,
                    color: tag.color,
                    border: `1px solid ${tag.color}4d`,
                  }}
                >
                  {tag.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
