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
  { id: 'tasting-table', kind: 'video', src: '/gallery/first-bites-around-the-table.mp4', poster: '/gallery/first-bites-around-the-table.jpg', caption: 'Tasting together' },
  { id: 'sweet-taste', kind: 'video', src: '/gallery/a-sweet-first-taste.mp4', poster: '/gallery/a-sweet-first-taste.jpg', caption: 'A sweet first taste' },
  { id: 'beignet-moment', kind: 'video', src: '/gallery/a-moment-with-beignets.mp4', poster: '/gallery/a-moment-with-beignets.jpg', caption: 'A moment with beignets' },
  { id: 'one-more-bite', kind: 'video', src: '/gallery/one-more-first-bite.mp4', poster: '/gallery/one-more-first-bite.jpg', caption: 'One more first bite' },
  { id: 'community-meeting', kind: 'photo', src: '/gallery/community-meeting.jpg', alt: 'Taste of Nawlins representative with a community member outdoors', caption: 'Neighbors we met' },
  { id: 'neighbors-outside', kind: 'photo', src: '/gallery/neighbors-outside.jpg', alt: 'Four people outside a neighborhood storefront', caption: 'Together in the neighborhood' },
  { id: 'community-first-bites', kind: 'video', src: '/gallery/community-first-bites.mp4', poster: '/gallery/community-first-bites.jpg', caption: 'Community first bites' },
  { id: 'a-bite-with-friends', kind: 'video', src: '/gallery/a-bite-with-friends.mp4', poster: '/gallery/a-bite-with-friends.jpg', caption: 'A bite with friends' },
  { id: 'around-the-neighborhood', kind: 'video', src: '/gallery/around-the-neighborhood.mp4', poster: '/gallery/around-the-neighborhood.jpg', caption: 'Around the neighborhood' },
  { id: 'another-neighbor-tastes', kind: 'video', src: '/gallery/another-neighbor-tastes.mp4', poster: '/gallery/another-neighbor-tastes.jpg', caption: 'Another first taste' },
]
