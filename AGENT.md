# Taste of Nawlins — Agent Operating Brief

## Project classification
SELL.

## Mode
Greenfield product inside an existing empty repository.

## Outcome
Launch a zero-budget, mobile-first digital home for Taste of Nawlins: a roaming New Orleans ghost kitchen that sells food, builds an owned audience, books catering, announces pop-ups, and supports youth through boxing and mentorship.

## Governing idea
Food first. Purpose proven.

The public experience should feel like a refined restaurant/editorial experience, not a nonprofit website or generic SaaS landing page.

## Brand
Taste of Nawlins is a Washington social-purpose company in development. Its specific social purpose should remain concise and centered on boxing and mentorship for youth.

Working specific social purpose draft:

> Taste of Nawlins supports youth through boxing and mentorship, using community food events to fund coaching, discipline, and opportunity.

Do not publish legal status as finalized until incorporation is verified.

## Signature recurring event
### Boxing & Beignets
A recurring pop-up fundraising event, initially about every other week, built around food, boxing culture, interviews with fighters, community partners, and fundraising for youth boxing and mentorship.

Boxing & Beignets is the mission-forward event. The rest of the business remains commercially focused on normal food sales, catering, pickup, delivery, and audience growth.

## Initial menu
- Beignets
- Chicory coffee
- Red beans

Keep the menu intentionally small until real sales data supports expansion.

## Primary public actions
1. See what is cooking / next drop
2. Order or follow the active ordering channel
3. Join the email list
4. Request catering
5. Follow Instagram / Facebook
6. Learn about Boxing & Beignets

## Homepage narrative
1. Food-first hero using real Taste of Nawlins photography
2. Next Drop status
3. Small changing menu
4. Documentary food/customer photography
5. Catering offer
6. Boxing & Beignets story/event
7. Email signup — “Know where we’re cooking next”
8. Instagram + Facebook
9. Compact social-purpose / annual-report link

## Design standard
Follow the Collins-level protocol and HEART_AND-SOUL doctrine used by the owner:
- strategy before styling
- content before containers
- distinction before decoration
- self-evident before experimental
- real photography before stock or generic AI food imagery
- one governing creative idea
- mobile designed intentionally, not compressed desktop
- no generic card walls
- no glassmorphism
- no arbitrary gradients
- no bento-grid-by-default
- no fake metrics
- no long intro animations
- no generic luxury serif chosen only to signal luxury
- no restaurant-template visual clichés
- no claims without proof

Typography should feel like a serious independent restaurant: editorial, restrained, highly legible, with a sophisticated display serif paired with a clean sans-serif only when licensing and performance are verified.

## Art direction
Use the real photographs supplied by Glenn as primary documentary material. Food and people should dominate. Crops must be intentional, mobile-specific, and never distort focal subjects.

Preferred creative territory: The Traveling Table — documentary photography, changing location/date information, restrained restaurant typography, and a sense that the kitchen can appear anywhere while the website remains its permanent address.

## Operations model
Public UI must stay simple. Behind it, the future owner agent should prepare changes and ask for confirmation.

Desired command pattern:
- owner says where/when they are serving and what menu is active
- agent prepares homepage Next Drop, menu availability, email alert, Instagram/Facebook drafts, and ordering link changes
- human previews
- human approves
- system publishes

Never give the browser direct infrastructure authority. Never expose secrets. Never fabricate operational state.

## Data model — MVP
MenuItem: name, description, image, price, available, category, sortOrder
ServiceDrop: date, startTime, endTime, location, type, orderingUrl, status
Subscriber: email, source, createdAt
CateringLead: name, email, phone, eventDate, guestCount, fulfillmentType, notes, status
Event: title, date, location, description, partner, fundraisingPurpose, status
SocialPost: platform, copy, media, status, scheduledAt

## Boxing & Beignets reporting
Make impact reporting clear, short, and evidence-based. Track event date, partner, attendance/orders where known, amount or resources raised when verified, youth program beneficiary, interviews/content created, and evidence links/photos.

Do not imply every ordinary Taste of Nawlins sale raises money for youth unless the owner has adopted and documented such a rule.

## Seattle lead strategy
Use top Seattle kitchens and restaurants as design, hospitality, partnership, catering, pop-up, and storytelling research leads—not as styles to copy. Study their principles: food photography, menu restraint, service language, editorial tone, hospitality details, special-event execution, and local cultural credibility.

Priority research leads from current 2026 Seattle dining recognition include Atoma, Surrell, Archipelago, Musang, Homer, Pancita, Ramie, Cafe Juanita, and Ilmu. Verify current details before outreach or publication.

## Build rules
- inspect before changing
- specify before building
- one verified slice at a time
- preserve GitHub as source of truth where possible
- hosting must remain owner-controlled
- no production-ready claim without runtime proof
- every release needs rollback

## First verified slice
Hero → Next Drop → 3-item menu → real imagery → catering → Boxing & Beignets → email signup → Instagram/Facebook → confirmation states → analytics evidence.

## Completion gate
Do not call the MVP complete until mobile layouts, forms, ordering links, email capture, accessibility, performance, error/success states, social links, and deployed runtime are independently checked.
