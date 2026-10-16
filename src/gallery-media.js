// To add a customer photo or short clip, add one entry below and upload the asset
// into public/gallery/. Publish only media for which you have consent to share.
// kind: 'photo' uses src and alt; kind: 'video' uses src, poster, and caption.
// Video recommendations: MP4/H.264 or WebM, short clips, captions when speech is present.
// Never include an unpublished or missing file in this list.
export const galleryMedia = [
  {
    id: 'counter',
    kind: 'photo',
    src: '/images/counter-1440.webp',
    alt: 'Taste of Nawlins food being handed across a neighborhood counter',
    caption: 'Across the counter',
  },
  {
    id: 'first-taste',
    kind: 'photo',
    src: '/images/first-taste-1440.webp',
    alt: 'A customer holding a Taste of Nawlins food container',
    caption: 'First taste',
  },
  {
    id: 'walmart',
    kind: 'photo',
    src: '/images/walmart-1440.webp',
    alt: 'A worker holding a Taste of Nawlins food container',
    caption: 'Around town',
  },
  {
    id: 'table',
    kind: 'photo',
    src: '/images/table-1920.webp',
    alt: 'People gathered around a table with Taste of Nawlins food',
    caption: 'At the table',
  },
  // Example for a consent-cleared clip:
  // { id: 'guest-reaction', kind: 'video', src: '/gallery/guest-reaction.mp4',
  //   poster: '/gallery/guest-reaction.webp', caption: 'The first bite',
  //   captionsSrc: '/gallery/guest-reaction.vtt' },
  { id: 'tasting-table', kind: 'video', src: 'https://drive.google.com/file/d/1a8g2SapUSMcHa8lbPUx862QCaMKGx0JW/preview', embed: true, poster: 'https://drive.google.com/thumbnail?id=1a8g2SapUSMcHa8lbPUx862QCaMKGx0JW&sz=w1000', caption: 'Tasting together' },
  { id: 'sweet-taste', kind: 'video', src: 'https://v3b.fal.media/files/b/0aae8e84/TDyvJJxWTYUp2xV4RuC4G_uc', poster: 'https://drive.google.com/thumbnail?id=1nHLXE-TjIdsqEvnF3-gzpqZSvSxELNaB&sz=w1000', caption: 'A sweet first taste' },
  { id: 'beignet-moment', kind: 'video', src: 'https://v3b.fal.media/files/b/0aae8e81/AfZQrCk46BaUPA1mrDa3T_uc', poster: 'https://drive.google.com/thumbnail?id=1GI_h1-aDHdzzMs83DtYpTDyhhDj6Mg-J&sz=w1000', caption: 'A moment with beignets' },
  { id: 'one-more-bite', kind: 'video', src: 'https://v3b.fal.media/files/b/0aae8e86/gRGzFx3fye9SnnnCdd5R2_uc', poster: 'https://drive.google.com/thumbnail?id=1feWTY9tPfxea4VPn5qznchtHlCkb8WJe&sz=w1000', caption: 'One more first bite' },
  { id: 'community-meeting', kind: 'photo', src: 'https://v3b.fal.media/files/b/0aae8e88/Qws2e7jYYadcNwTUIJIHa_IMG_20261003_130752400~2.jpg', alt: 'Taste of Nawlins representative with a community member outdoors', caption: 'Neighbors we met' },
  { id: 'neighbors-outside', kind: 'photo', src: 'https://v3b.fal.media/files/b/0aae8e89/JhGR5t0pqdjLO4lIKiIiX_IMG_20261003_121830278_HDR.jpg', alt: 'Four people outside a neighborhood storefront', caption: 'Together in the neighborhood' },
  { id: 'community-first-bites', kind: 'video', src: 'https://v3b.fal.media/files/b/0aae8e87/ZOvHjIl_khqUmnZPHqcW8_videoplayback.mp4', caption: 'Community first bites' },
  { id: 'a-bite-with-friends', kind: 'video', src: 'https://v3b.fal.media/files/b/0aae8e87/UArnzGIOz7To0jjd06LrE_videoplayback1.mp4', caption: 'A bite with friends' },
  { id: 'around-the-neighborhood', kind: 'video', src: 'https://v3b.fal.media/files/b/0aae8e87/A0ZBeE5elSD-fhiZP9Ej4_videoplayback11.mp4', caption: 'Around the neighborhood' },
  { id: 'another-neighbor-tastes', kind: 'video', src: 'https://v3b.fal.media/files/b/0aae8e88/4NHVBRTVIAZ0xgTkoJN-8_videoplayback12.mp4', caption: 'Another first taste' },
]
