# Firebase data structure

The website now uses a clear Firebase structure by content area. The app reads these collections and combines them into the guide at runtime. Older paths such as `siteContent/app`, `siteGuideEntries`, `sitePatchNotes`, and the mixed `guides` collection can stay as fallback while the new structure is checked.

## Main collections

- `appSettings/main`
  - Global settings such as `officialPatchFeedUrl`, `contentVersion`, and `updatedAt`.

- `assets/heroImages`
  - Hero image lookup object: `heroImagesBySlug`.
  - Image values can point to R2 with `r2://heroes/name.jpeg` or full public URLs.

- `guideSections/{sectionId}`
  - Main category/navigation sections such as `events`, `heroes`, `villages`, `faq`.

- `heroes/{heroSlug}`
  - One document per hero, for example `heroes/nikola`, `heroes/layla`, `heroes/rosie`.

- `events/{eventSlug}`
  - One document per event guide.
  - Example: `events/alliance-duel-vs` contains all texts and details for Alliance Duel VS.

- `villages/{villageSlug}`
  - Village and territory guides.

- `alliance/{allianceSlug}`
  - Alliance system guides, ranks, chests, rally basics, and similar alliance pages.

- `buildings/{buildingSlug}`
  - Building guides.

- `worldMap/{mapSlug}`
  - World map guides and map tooling content.

- `tips/{tipSlug}`
  - General tips and beginner help.

- `patchNotes/{patchId}`
  - One document per patch note, sorted by `date` in the app.

- `faqItems/{faqId}`
  - FAQ entries.

- `heroClasses/{classId}`
  - Hero class groups such as Aeronaut, Rover, Stalwart.

- `metaFormations/{formationId}`
  - Meta team formations and positioning guides.

- `translations/{languageCode}`
  - One document per language.
  - Shape: `{ language: "en", messages: { ... } }`.

- `admin/contentOverrides`
  - Admin builder overrides, separated from public guide content.

## Seed command

Run this to write the current local guide content into Firebase:

```bash
npm run seed:firebase-content
```

The script writes with `merge: true`, so existing documents are updated instead of wiped.

## Current seeded counts

- `events`: 26
- `heroes`: 27
- `villages`: 7
- `alliance`: 4
- `buildings`: 1
- `worldMap`: 1
- `tips`: 1