"use client";

// The Learning Library's one interactive concern: which resource is showing.
//
// Everything else about this section is server-rendered. The island holds two pieces of state — the
// selected resource and whether the player has been mounted — and nothing else. No scroll listener,
// no observer, no animation library, no carousel.
//
// ZERO IFRAMES AT REST. A facade with a real poster frame stands in for the player until someone
// asks for it; seven embedded players used to load seven full documents that nobody watched.
// Changing selection tears the player down, because exactly one may exist and audio from a film the
// visitor navigated away from is the worst outcome available here.
//
// Semantics: the resource list is an exclusive-selection group, so it is a radiogroup with roving
// tabindex — the same keyboard contract as every other such group on the site.
//
// Progressive enhancement: a <noscript> block lists every resource as a plain link, so with
// JavaScript disabled all seven films remain titled, typed and reachable.
import Image from "next/image";
import { useId, useRef, useState, type KeyboardEvent } from "react";
import { Play } from "lucide-react";

import { rovingIndex } from "@/shared/ui/roving";

export interface LibraryResource {
  id: string;
  videoId: string;
  /** The video's own title — existing content, never generated. */
  title: string;
  /** Localized type label, e.g. "Overview". */
  typeLabel: string;
  poster: string;
}

interface Props {
  resources: readonly LibraryResource[];
  /** Accessible name for the resource group. */
  groupLabel: string;
  /** Localized accessible name for the play control. */
  playLabel: string;
}

export default function LearningLibrary({ resources, groupLabel, playLabel }: Readonly<Props>) {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const baseId = useId();
  const btnRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const playerRef = useRef<HTMLDivElement | null>(null);
  const current = resources[active];

  // The resource set is content. If it ever arrives empty the section renders nothing rather than
  // throwing on `resources[0]` and taking the page down with it.
  if (!current) return null;

  function select(index: number) {
    setActive(index);
    setPlaying(false);
  }

  function onKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
    const target = rovingIndex(e.key, active, resources.length - 1);
    if (target === null) return;
    e.preventDefault();
    select(target);
    btnRefs.current[target]?.focus();
  }

  function play() {
    setPlaying(true);
    // Activating the facade removes it, so focus would fall to the document body and a keyboard
    // user would lose their place entirely. Move it onto the player that replaced it.
    requestAnimationFrame(() => playerRef.current?.focus());
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 mt-12 lg:mt-16 items-start">
      <div className="col-span-1 lg:col-span-8 sticky top-24" ref={playerRef} tabIndex={-1}>
        <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
          {playing ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${current.videoId}?autoplay=1`}
              title={current.title}
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full border-0"
            />
          ) : (
            <button
              type="button"
              onClick={play}
              aria-label={`${playLabel}: ${current.title}`}
              className="absolute inset-0 w-full h-full flex flex-col justify-end p-6 text-left border-0 bg-transparent cursor-pointer p-0 m-0 focus-visible:outline-none"
            >
              <Image
                src={current.poster}
                alt=""
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 800px"
                priority={false}
              />
              <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" aria-hidden="true" />
              <span className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
                <span className="flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground shadow-lg transform transition-transform duration-200 group-hover:scale-110">
                  <Play size={28} fill="currentColor" className="ml-1" />
                </span>
              </span>
              <span className="relative z-10 flex flex-col gap-1 drop-shadow-md p-6 pb-4">
                <span className="font-mono text-[11px] tracking-[0.1em] text-white/80 uppercase">{current.typeLabel}</span>
                <span className="font-sans text-[clamp(19px,2.5vw,24px)] text-white font-medium">{current.title}</span>
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Type first, then title — the type is what tells a visitor whether this is worth two
          minutes, and the title alone does not. */}
      <div
        role="radiogroup"
        aria-label={groupLabel}
        aria-orientation="vertical"
        className="col-span-1 lg:col-span-4 flex flex-col gap-3"
      >
        {resources.map((resource, i) => {
          const selected = i === active;
          return (
            <button
              key={resource.id}
              ref={(el) => {
                btnRefs.current[i] = el;
              }}
              type="button"
              role="radio"
              id={`${baseId}-res-${i}`}
              aria-checked={selected}
              tabIndex={selected ? 0 : -1}
              onClick={() => select(i)}
              onKeyDown={onKeyDown}
              className={`flex items-center gap-4 p-3 pr-4 border rounded-lg text-left transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                selected 
                  ? "border-primary bg-primary/5" 
                  : "border-transparent hover:bg-muted/50"
              }`}
            >
              <span className="relative w-[96px] h-[54px] flex-shrink-0 bg-black rounded overflow-hidden">
                <Image src={resource.poster} alt="" fill sizes="96px" className="object-cover" />
                {selected && (
                  <span className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                    <span className="text-white drop-shadow-md">
                      <Play size={20} fill="currentColor" />
                    </span>
                  </span>
                )}
              </span>
              <span className="flex flex-col flex-grow min-w-0">
                <span className="font-mono text-[11px] tracking-[0.1em] text-muted-foreground uppercase truncate">{resource.typeLabel}</span>
                <span className="font-sans text-[13.5px] font-medium text-foreground truncate">{resource.title}</span>
              </span>
            </button>
          );
        })}
      </div>

      <noscript>
        <ul className="col-span-1 lg:col-span-12 flex flex-col gap-2 mt-8 m-0 p-0 list-none">
          {resources.map((resource) => (
            <li key={resource.id} className="font-sans text-[16px] text-foreground m-0">
              <a
                className="font-sans text-[16px] text-foreground hover:text-primary transition-colors underline"
                href={`https://www.youtube.com/watch?v=${resource.videoId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {resource.typeLabel} — {resource.title}
              </a>
            </li>
          ))}
        </ul>
      </noscript>
    </div>
  );
}
