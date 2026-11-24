import { useEffect } from 'react';
import { font, galleryValues, sizes, text, type CardSize } from '../design/theme';
import { CardBack } from '../components/CardBack';
import { CardFace } from '../components/CardFace';
import { EbbeTheme } from '../components/EbbeTheme';

const SIZE_ORDER: CardSize[] = ['sm', 'md', 'lg'];

/** Galerie unter /ebbe/design zum Begutachten des Designs. Nicht indexiert. */
export function DesignGallery() {
  useEffect(() => {
    document.title = `${text.gameName} – ${text.galleryTitle}`;
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);

  return (
    <EbbeTheme className="min-h-screen bg-ebbe-table text-ebbe-card">
      <main className="mx-auto max-w-3xl px-4 py-6" style={{ fontFamily: font.family }}>
        <header className="mb-6">
          <h1 className="text-2xl font-bold">{text.gameName}</h1>
          <p className="text-sm opacity-80">{text.galleryTitle}</p>
          <p className="mt-2 text-sm opacity-80">{text.galleryIntro}</p>
        </header>

        {SIZE_ORDER.map((size) => (
          <section key={size} className="mb-8">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide opacity-80">
              {text.galleryFaces} · {text.sizeLabel[size]} · {sizes[size].width}×{sizes[size].height}
            </h2>
            <div className="flex flex-wrap items-end gap-3">
              {galleryValues.map((v) => (
                <CardFace key={v} value={v} size={size} />
              ))}
              <CardBack size={size} />
            </div>
          </section>
        ))}

        <section className="mb-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide opacity-80">{text.galleryBack}</h2>
          <div className="flex flex-wrap items-end gap-3">
            {SIZE_ORDER.map((size) => (
              <CardBack key={size} size={size} />
            ))}
          </div>
        </section>
      </main>
    </EbbeTheme>
  );
}
