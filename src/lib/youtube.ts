/**
 * THG-CAT-006 — Helper YouTube cho storefront catalog (video giới thiệu sản phẩm
 * hiển thị ở slot đầu slider, click-to-play). Mirror logic của Hub (thghub).
 */

export function parseYouTubeId(url: string | null | undefined): string | null {
  if (!url) return null;
  const raw = url.trim();
  if (!raw) return null;
  let u: URL;
  try {
    u = new URL(raw);
  } catch {
    // User dán thiếu scheme (youtube.com/..., www.youtube.com/...) → thử https://
    try { u = new URL(`https://${raw}`); } catch { return null; }
  }
  const host = u.hostname.toLowerCase().replace(/^www\./, "");
  const idOk = (s: string | null | undefined): string | null =>
    s && /^[A-Za-z0-9_-]{11}$/.test(s) ? s : null;
  if (host === "youtu.be") return idOk(u.pathname.split("/").filter(Boolean)[0]);
  if (host === "youtube.com" || host === "m.youtube.com" || host === "music.youtube.com") {
    if (u.pathname === "/watch") return idOk(u.searchParams.get("v"));
    const parts = u.pathname.split("/").filter(Boolean);
    if (parts.length >= 2 && ["shorts", "embed", "v"].includes(parts[0])) return idOk(parts[1]);
  }
  return null;
}

export function youtubeThumb(idOrUrl: string | null | undefined): string | null {
  const id = /^[A-Za-z0-9_-]{11}$/.test(idOrUrl ?? "") ? (idOrUrl as string) : parseYouTubeId(idOrUrl);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
}

/** THG-CAT-006: link Shorts (video DỌC 9:16) → UI render khung dọc, tránh dải đen. */
export function isYouTubeShort(url: string | null | undefined): boolean {
  if (!url) return false;
  try {
    const u = new URL(/^https?:\/\//i.test(url) ? url : `https://${url}`);
    return u.pathname.toLowerCase().includes("/shorts/");
  } catch {
    return false;
  }
}

export function youtubeEmbedUrl(idOrUrl: string | null | undefined, autoplay = false): string | null {
  const id = /^[A-Za-z0-9_-]{11}$/.test(idOrUrl ?? "") ? (idOrUrl as string) : parseYouTubeId(idOrUrl);
  if (!id) return null;
  const params = new URLSearchParams({ rel: "0", modestbranding: "1" });
  if (autoplay) params.set("autoplay", "1");
  return `https://www.youtube.com/embed/${id}?${params.toString()}`;
}
