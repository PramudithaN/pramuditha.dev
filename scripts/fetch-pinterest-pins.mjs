import fs from 'fs';

const boards = [
  { slug: 'logos', category: 'logos' },
  { slug: 'flyers', category: 'flyers' },
  { slug: 'manipulations', category: 'manipulations' },
  { slug: 'social', category: 'social' },
];

async function run() {
  const allImages = [];
  const seen = new Set();

  for (const b of boards) {
    try {
      const res = await fetch(`https://www.pinterest.com/ad0bep/${b.slug}.rss`);
      const xml = await res.text();
      const items = xml.split('<item>').slice(1);

      for (const item of items) {
        const match = item.match(/https:\/\/i\.pinimg\.com\/[^\s"&]+?\.(?:jpg|png|webp)/i);
        if (match) {
          const rawSrc = match[0];
          const filename = rawSrc.split('/').pop()?.toLowerCase();
          const key = `${b.category}:${filename}`;
          if (!seen.has(key)) {
            seen.add(key);
            const highRes = rawSrc.replace(/\/\d+x\//, '/736x/');
            allImages.push({
              src: highRes,
              rawSrc,
              board: b.category,
            });
          }
        }
      }
    } catch (err) {
      console.error(`Failed on board ${b.slug}:`, err);
    }
  }

  console.log(`Extracted ${allImages.length} images.`);

  const fileContent = `import type { GalleryImage } from '../components/showcase/Lightbox';

export const FALLBACK_PIN_IMAGES: GalleryImage[] = ${JSON.stringify(allImages, null, 2)};
`;

  fs.writeFileSync('src/constants/pinterestFallback.ts', fileContent, 'utf-8');
  console.log('Successfully wrote src/constants/pinterestFallback.ts');
}

run();
