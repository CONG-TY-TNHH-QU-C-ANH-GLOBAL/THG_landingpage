// Public surface of the shared markdown renderer. Server-compatible, dependency-free, and
// deliberately narrow — see markdown-blocks.tsx for the supported subset and why it does not
// use react-markdown.
export { MarkdownLines, renderInline, splitSections } from "./markdown-blocks";
