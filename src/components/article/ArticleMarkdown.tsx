import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { Link } from "react-router-dom";

import { ServiceVideoCard } from "@/components/service-pages/ServiceVideoCard";
import { parseYouTubeId } from "@/lib/youtube";
import { cn } from "@/lib/utils";

/**
 * The article body renderer shared by blog posts and events (CMS `body_md`).
 *
 * One rule on top of plain Markdown: a paragraph that holds nothing but a
 * YouTube link — the way the CMS editor's "insert video" button writes it —
 * renders as a player, so a recording pasted into the CMS plays in place.
 * A YouTube link inside a sentence or a list stays a link. The CMS preview
 * (CMS_management- src/components/cms/article/MarkdownPreview.tsx) applies
 * the same rule; change both together.
 */

interface HastText {
  type: "text";
  value: string;
}
interface HastElement {
  type: "element";
  tagName: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
}
type HastNode = HastText | HastElement | { type: string };

function textOf(node: HastNode): string {
  if (node.type === "text") return (node as HastText).value;
  if (node.type === "element") return ((node as HastElement).children ?? []).map(textOf).join("");
  return "";
}

function soleYouTubeLink(node: unknown): { id: string; label: string | null } | null {
  const children = ((node as HastElement | undefined)?.children ?? []).filter(
    (c) => !(c.type === "text" && (c as HastText).value.trim() === ""),
  );
  if (children.length !== 1) return null;
  const only = children[0];
  if (only.type !== "element" || (only as HastElement).tagName !== "a") return null;
  const href = (only as HastElement).properties?.href;
  const id = typeof href === "string" ? parseYouTubeId(href) : null;
  if (!id) return null;
  const label = textOf(only).trim();
  return { id, label: label && label !== href ? label : null };
}

const components: Components = {
  p({ node, children }) {
    const video = soleYouTubeLink(node);
    if (!video) return <p>{children}</p>;
    return (
      <figure className="not-prose my-8">
        <ServiceVideoCard videoId={video.id} title={video.label ?? "Video"} />
        {video.label && (
          <figcaption className="mt-3 text-center text-sm text-muted-foreground">{video.label}</figcaption>
        )}
      </figure>
    );
  },
  a({ href, children }) {
    // In-site paths stay in the SPA; everything else opens beside the article.
    if (href?.startsWith("/") && !href.startsWith("//")) return <Link to={href}>{children}</Link>;
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  },
  img({ src, alt }) {
    return <img src={typeof src === "string" ? src : undefined} alt={alt ?? ""} loading="lazy" />;
  },
};

const PROSE =
  "prose prose-neutral max-w-none prose-headings:text-navy prose-headings:font-bold prose-h2:text-xl prose-h2:mt-8 prose-h3:text-lg prose-p:text-foreground prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-navy prose-ul:text-foreground prose-ol:text-foreground prose-li:my-0.5 prose-blockquote:border-l-primary prose-blockquote:bg-primary/5 prose-blockquote:py-1 prose-blockquote:not-italic prose-blockquote:font-normal prose-blockquote:text-foreground [&_blockquote_p]:before:content-none [&_blockquote_p]:after:content-none prose-img:rounded-xl prose-img:shadow-md prose-table:text-sm";

export function ArticleMarkdown({ markdown, className }: { markdown: string; className?: string }) {
  return (
    <div className={cn(PROSE, className)}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
