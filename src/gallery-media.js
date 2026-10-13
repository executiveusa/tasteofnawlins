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
]
