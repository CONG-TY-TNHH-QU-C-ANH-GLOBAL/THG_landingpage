import { cn } from "@/shared/ui/cn";

// User-generated text is rendered as TEXT, never as HTML.
//
// The Vite page ran bodies through DOMPurify and dangerouslySetInnerHTML. This app has no
// sanitizer dependency and adding one is out of scope for the migration, so the safer
// subset is used instead: JSX escapes the string, which is XSS-proof by construction with
// no dependency and no sanitizer-bypass surface to maintain. `whitespace-pre-wrap` keeps
// the authored line breaks, so the rendered result is visually identical for the plain
// text these forms actually collect (the submit contract is a plain textarea, not an HTML
// editor). A body containing markup renders literally instead of as markup — the one
// behavioral delta, recorded in the PR.
//
// `break-words` stops an unbroken URL or a long Vietnamese compound from forcing
// horizontal overflow at the 320px breakpoint.

export function UgcBody({ text, className }: Readonly<{ text: string; className?: string }>) {
  return (
    <div className={cn("whitespace-pre-wrap break-words leading-relaxed text-foreground/90", className)}>
      {text}
    </div>
  );
}
