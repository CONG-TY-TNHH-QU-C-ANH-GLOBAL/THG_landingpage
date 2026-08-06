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
import styles from "../ui/fulfill.module.css";

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
    <div className={styles.libraryGrid}>
      <div className={styles.player} ref={playerRef} tabIndex={-1}>
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${current.videoId}?autoplay=1`}
            title={current.title}
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={play}
            aria-label={`${playLabel}: ${current.title}`}
            className={styles.facade}
          >
            <Image
              src={current.poster}
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 800px"
              priority={false}
            />
            <span className={styles.facadeScrim} aria-hidden="true" />
            <span className={styles.facadeMark} aria-hidden="true">
              <Play size={22} fill="currentColor" />
            </span>
            <span className={styles.facadeCaption}>
              <span className={`${styles.facadeType} type-label`}>{current.typeLabel}</span>
              <span className="type-h3">{current.title}</span>
            </span>
          </button>
        )}
      </div>

      {/* Type first, then title — the type is what tells a visitor whether this is worth two
          minutes, and the title alone does not. */}
      <div
        role="radiogroup"
        aria-label={groupLabel}
        aria-orientation="vertical"
        className={styles.libraryList}
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
              className={`${styles.libraryRow} ${selected ? styles.libraryRowOn : ""}`}
            >
              <span className={styles.libraryThumb}>
                <Image src={resource.poster} alt="" fill sizes="96px" />
              </span>
              <span className={styles.libraryMeta}>
                <span className={`${styles.muted} type-label`}>{resource.typeLabel}</span>
                <span className={`${styles.libraryTitle} type-h4`}>{resource.title}</span>
              </span>
            </button>
          );
        })}
      </div>

      <noscript>
        <ul className={styles.noscriptList}>
          {resources.map((resource) => (
            <li key={resource.id} className="type-body">
              <a
                className={styles.linkQuiet}
                href={`https://www.youtube-nocookie.com/watch?v=${resource.videoId}`}
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
