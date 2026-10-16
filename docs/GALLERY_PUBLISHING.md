# Taste of Nawlins — gallery publishing

The live gallery on the homepage reads `src/gallery-media.js`. All photos and clips are static files committed to GitHub, so it works on Netlify previews and later on Hostinger with no Netlify-specific runtime dependency.

## Adding an approved photo
1. Confirm permission from the pictured person or their guardian when necessary before publishing an identifiable image, especially minors.
2. Export a web-sized WebP/JPEG under `public/gallery/`, e.g. `public/gallery/first-bite.webp`; strip location metadata.
3. Add `{ id: 'first-bite', kind: 'photo', src: '/gallery/first-bite.webp', alt: 'Accurate description', caption: 'First bite' }` to the `galleryMedia` array in `src/gallery-media.js`.
4. Build and run the mobile smoke tests, preview, then merge.

## Adding a short video
1. Confirm distribution permission, especially for interviews, identifiable people, and minors.
2. Export vertical or landscape H.264 MP4 under `public/gallery/` with a separate WebP poster image. Keep clips short and compressed for mobile. Videos preload only when played, not on initial page load.
3. If people speak, create WebVTT captions and include `captionsSrc` in the entry.
4. Add `{ id:'reaction-1', kind:'video', src:'/gallery/reaction-1.mp4', poster:'/gallery/reaction-1.webp', captionsSrc:'/gallery/reaction-1.vtt', caption:'First bite' }`.
5. Review playback on iOS/Android, controls, captions, reduced motion, page weight, and consent before release.

## Boundaries
- No public upload feature is enabled. Only GitHub-approved assets are published.
- Never invent reactions, invent quotes, or imply the subject endorses something beyond their consent.
- Avoid videos that autoplay with audio.
- Current gallery shows four previously approved documentary photos. No new guest clips are published until actual footage is provided and permission is checked.
