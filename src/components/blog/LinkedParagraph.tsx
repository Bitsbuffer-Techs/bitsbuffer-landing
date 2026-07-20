import Link from 'next/link';
import { Fragment } from 'react';

// Added 2026-07-17 alongside the blog-writing skill: blog-posts.ts stores
// paragraphs as plain strings, unlike WF Engine's MDX where [text](url)
// links just work. This parses that same markdown link syntax out of a
// plain string so the skill's "sideways" and "downward" interlink rule
// (section 4) can actually render as a real link, not just implied text.
// Internal links (starting with /) use next/link for client-side nav,
// external links get target=_blank + rel=noopener.
const LINK_PATTERN = /\[([^\]]+)\]\(([^)]+)\)/g;

export default function LinkedParagraph({ text, className }: { text: string; className?: string }) {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  LINK_PATTERN.lastIndex = 0;
  while ((match = LINK_PATTERN.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(<Fragment key={key++}>{text.slice(lastIndex, match.index)}</Fragment>);
    }
    const [, label, href] = match;
    if (href.startsWith('/')) {
      parts.push(
        <Link key={key++} href={href} className="text-accent-bright hover:text-accent font-semibold">
          {label}
        </Link>
      );
    } else {
      parts.push(
        <a
          key={key++}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent-bright hover:text-accent font-semibold"
        >
          {label}
        </a>
      );
    }
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    parts.push(<Fragment key={key++}>{text.slice(lastIndex)}</Fragment>);
  }

  return <p className={className}>{parts}</p>;
}
