import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { Locale } from "@/shared/i18n";
import type { FulfillParityCopy } from "../parity-content";
import { Alias } from "./section";

interface Props {
  lang: Locale;
  parity: FulfillParityCopy;
}

export default function CommitmentSection({ lang, parity }: Readonly<Props>) {
  return (
    <section className="w-full py-12 px-4 md:px-8 bg-background flex justify-center">
      {/* Retired-but-published anchor: the trust chapter is now this policy/SLA commitment band. */}
      <Alias id="trust" />
      <div className="w-full max-w-6xl bg-thg-textMain rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl border border-white/10">
        <div className="flex flex-col gap-3 max-w-2xl">
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight m-0">
            {parity.policyTitle}
          </h2>
          <p className="text-white/70 text-sm md:text-base m-0 leading-relaxed">{parity.policyDesc}</p>
        </div>

        <Link
          href={`/${lang}/policy`}
          className="inline-flex items-center gap-2 px-6 py-3 bg-thg-gold hover:bg-thg-gold/80 text-white font-medium rounded-lg transition-colors duration-300 shrink-0 no-underline"
        >
          {parity.policyCta}
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
