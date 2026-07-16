// Integration-platform tile (FND-005), already position-sorted. Only the rendered fields:
// visuals are resolved locally by name [FACT: IntegrationsSection.tsx:64-71].

export interface Integration {
  id: number;
  name: string;
  /** Tailwind class bundle from the CMS; null → component default frame. */
  colorClass: string | null;
}
