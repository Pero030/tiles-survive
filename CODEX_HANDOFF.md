# Codex-Handover: Tiles Survive Guide

Stand: 2026-07-07

Dieses Dokument ist fuer die Weiterarbeit mit Codex gedacht. Es beschreibt, was bereits umgesetzt wurde, welche Regeln und Entscheidungen gelten, wo die wichtigen Dateien liegen und wohin das Projekt weiterentwickelt werden soll.

## Projektziel

Das Projekt ist ein fan-made Guide fuer das Spiel **Tiles Survive**.

Die Seite soll:

- standardmaessig auf Englisch laufen
- per Sprachumschalter auf Deutsch umstellbar sein
- wie ein Tiles-Survive-Spielguide wirken, nicht wie eine generische Landingpage
- spaeter ohne Grundumbau um Benutzerkonten, Favoriten, Kommentare und Admin-Bereiche erweitert werden koennen
- Helden, Meta-Teams, Events, Gebaeude, Allianz, Weltkarte, Tipps und FAQ als ausbaubare Guide-Inhalte verwalten

## Technischer Stand

Framework:

- React
- Vite
- React Router
- Lucide Icons

Wichtige Dateien:

- `src/data/content.js`
  - Hauptdatenmodell fuer Guide-Inhalte, Helden, Meta-Formation, Heldenklassen und Bildzuordnung
- `src/data/translations.js`
  - UI-Texte fuer Englisch und Deutsch
- `src/context/LanguageContext.jsx`
  - Sprachumschaltung mit `localStorage`
- `src/features/admin/contentRepository.js`
  - zentrale Content-Repository-Schicht, vorbereitet fuer spaetere Admin-/Account-Funktionen
- `src/components/layout/Header.jsx`
  - Header, Navigation, Logo, Sprachumschalter
- `src/components/ui/GuideCard.jsx`
  - Karten fuer Guide-Eintraege und Helden
- `src/pages/CollectionPage.jsx`
  - Uebersichtsseiten, insbesondere `/heroes`
- `src/pages/DetailPage.jsx`
  - Detailseiten fuer Helden und andere Inhalte
- `src/styles/global.css`
  - komplettes Styling

## Bisher umgesetzte Anforderungen

### Sprache

Die App ist zweisprachig:

- Englisch ist Default.
- Deutsch ist per Sprachselect im Header waehlbar.
- Sprache wird in `localStorage` gespeichert.
- UI-Texte stehen in `src/data/translations.js`.

Wichtige Regel:

- Neue sichtbare UI-Texte immer in Englisch und Deutsch anlegen.
- Content-Eintraege sollten Felder wie `{ en: '...', de: '...' }` nutzen.

### Architektur fuer spaetere Features

Die Inhalte wurden absichtlich nicht hart in Komponenten geschrieben, sondern als strukturierte Daten:

- stabile `id`
- `type`
- `slug`
- `route`
- `status`
- `ownerId`
- `updatedAt`
- `featured`
- lokalisierte `title`, `summary`, `details`
- zentrale Repository-Schicht

Grund:

Spaeter sollen Benutzerkonten, Favoriten, Kommentare und Admin-Bearbeitung ergaenzt werden koennen, ohne die App neu zu bauen.

Nicht entfernen:

- `ownerId`
- `status`
- `updatedAt`
- `contentRepository`

Diese Felder sind bewusst als Zukunftsstruktur vorhanden.

### Designrichtung

Die Seite wurde in Richtung Tiles-Survive-Look angepasst:

- helles gruenes Spielfeld-/Tile-Gefuehl
- starkes, verspieltes Logo im Header
- klare Karten, Badges und Panels
- keine generische Corporate-Landingpage
- keine grosse Marketing-Hero-Erklaerflaeche als Hauptzweck
- Heldenuebersicht soll direkt nutzbar sein

Bekannte Designregeln fuer Weiterarbeit:

- Keine grossen Erklaertexte im Interface, wenn ein direkt nutzbares Element besser ist.
- Keine dekorativen Karten in Karten.
- Buttons/Controls sollen stabil dimensioniert sein.
- Text darf beim Sprachwechsel keine Layout-Spruenge verursachen.
- Header darf sich beim Umschalten Deutsch/Englisch nicht verschieben.
- Bei neuen UIs immer Mobile und Desktop bedenken.

### Header

Der Header wurde mehrfach stabilisiert.

Aktueller Stand:

- Logo sitzt ganz links im Header.
- Header nutzt eigene Breite, nicht mehr den zentrierten Seitencontainer.
- Desktop-Logo hat feste Breite.
- Nav-Links haben feste Breiten pro Link.
- Sprachfeld hat feste Breite.
- Hover/Active verschiebt nichts.
- Unter `1080px` wird auf Mobile-Menue umgeschaltet.

Wichtige Dateien:

- `src/components/layout/Header.jsx`
- `src/styles/global.css`

Wenn Header angepasst wird:

- Danach unbedingt Sprachwechsel Englisch/Deutsch testen.
- Keine dynamischen Nav-Breiten einfuehren.
- Keine `transform: translateY(...)` fuer Hover im Header verwenden.

### Logo

Das Logo wurde aus `C:\Users\Alex\Desktop\logo.png` kopiert nach:

- `src/assets/brand/tiles-survive-logo.png`

Es wird im Header verwendet.

### Startseitentext

Der alte Text war unpassend:

- "Master every tile before night falls"
- "Beherrsche jedes Feld, bevor die Nacht faellt"

Er wurde ersetzt.

Aktuell:

- EN: `Upgrade your base. Build the right team.`
- DE: `Basis ausbauen. Helden richtig aufstellen.`

Beschreibung:

- Helden-Meta
- Power Plant
- Bauprioritaeten
- Events
- Allianzen
- Kampfaufstellungen

### Helden-Meta

Auf `/heroes` gibt es ein Meta-Panel fuer **Full Sustain Meta**.

Formation:

Frontline:

- Nikola
- Layla

Backline:

- Rosie
- Tarzan
- Freja

Upgrade:

- Wenn Tara freigeschaltet ist, ersetzt Tara Freja.

Wichtige Regel:

- Tarzan, Rosie und Freja nicht in die Frontline stellen.

### Heldenklassen

Auf `/heroes` gibt es eine eigene Klassenuebersicht.

Aeronaut-Helden:

- Lucky (SR)
- Sarge (SR)
- Maddie (SSR)
- Titi (SSR)
- Wright (SSR)

Rover-Helden:

- Ghost (R)
- Eva (SR)
- Travis (SR)
- Becka (SSR)
- Candy (SSR)
- Chiron (SSR)
- Jacob (SSR)
- Layla (SSR)

Stalwart-Helden:

- Rusty (R)
- Chef (SR)
- Freja (SR)
- Ray (SSR)
- Rosie (SSR)
- Tara (SSR)
- Tarzan (SSR)
- Tesla (SSR)

Quelle fuer diese Struktur: direkte Nutzerangabe im Chat.

Hinweis:

- Titi, Wright und Tesla wurden als Draft-Helden angelegt, aber noch ohne echte Bilder und ohne verifizierte Skilldetails.
- Andere fehlende Bilder kommen spaeter.

### Heldenbilder

Folgende Bilder wurden vom Nutzer geliefert und eingebaut:

- Chef
- Travis
- Becka
- Eva
- Freja
- Ghost
- Layla
- Maddie
- Lucky
- Nikola
- Ray
- Rosie
- Rusty
- Sarge
- Tarzan
- Tara

Die Bilder liegen in:

- `src/assets/heroes/`

Die Zuordnung liegt in:

- `src/data/content.js`
- Export: `heroImagesBySlug`

Wichtig:

- Sichtbarer Name ist `Layla`.
- Route/Slug ist noch `leyla`, damit vorhandene Links stabil bleiben.
- Sichtbarer Name ist `Becka`.
- Route/Slug ist noch `becca`.

### Heldenkarten und Detailseiten

Heldenkarten zeigen:

- Portraet, falls vorhanden
- Initiale als Platzhalter, falls kein Bild vorhanden
- Typ
- Featured-Stern, falls relevant
- Heldenklasse
- Rarity
- Titel
- Zusammenfassung
- Details-Link

Detailseiten zeigen:

- grosses Portraet
- Klasse
- Rarity
- ID
- Status
- Updated
- Details wie Tier, Rolle, Staerken, Schwaechen, Investment, Equipment usw.

## Aktuelle bekannte Helden

Aktuell gibt es 24 Heldeneintraege:

- Nikola
- Rosie
- Layla
- Tarzan
- Freja
- Candy
- Kiki
- Maddie
- Chef
- Becka
- Eva
- Ghost
- Lucky
- Rusty
- Tara
- Tony
- Chiron
- Jacob
- Travis
- Ray
- Sarge
- Titi
- Wright
- Tesla

Hinweis:

Nikola, Kiki und Tony sind zusaetzliche vorhandene Eintraege und sollen nicht geloescht werden, nur weil sie nicht in der zuletzt gelieferten Klassenliste standen.

## Quellen- und Inhaltsregeln

Es wurden online gefundene Informationen und Nutzerangaben kombiniert.

Wichtig fuer Weiterarbeit:

- Wenn neue Online-Infos genutzt werden, Quelle pruefen.
- Bei aktuellen Game-Daten, Tierlisten oder Patch-relevanten Daten immer online verifizieren.
- Keine erfundenen exakten Zahlen eintragen.
- Wenn Skillwerte nicht sicher sind, als "muss verifiziert werden" markieren.
- Nutzerangaben aus dem Chat duerfen als Projektvorgabe uebernommen werden.

Bestehender Quellenhinweis steht in `heroSourceNote` in `src/data/content.js`.

## Offene Aufgaben / Naechste sinnvolle Schritte

### Helden vervollstaendigen

Noch offen:

- Bilder fuer Candy, Chiron, Jacob, Kiki, Tony, Titi, Wright, Tesla und eventuell weitere Helden
- exakte Skilldetails fuer Titi, Wright, Tesla
- bessere Pros/Cons fuer alle Helden, wenn neue Quellen oder Ingame-Daten vorliegen
- eventuell Filter nach Klasse, Rarity, Tier und Rolle

### Hero-Seite verbessern

Moegliche naechste Features:

- Filter-Tabs: Alle, Aeronaut, Rover, Stalwart
- Filter nach Rarity: R, SR, SSR
- Sortierung nach Tier oder Investment
- Meta-Team-Presets als eigene Sektion
- "Owned/Favorite" vorbereitet, falls Accounts/Favoriten spaeter kommen

### Admin-ready Ausbau

Spaeter denkbar:

- Content-Editor fuer Guide-Eintraege
- Login/Auth
- Favoriten pro User
- Kommentare unter Helden oder Guides
- Rollen: User, Moderator, Admin
- Draft/Published Workflow

Architektur ist dafuer vorbereitet, aber Backend existiert noch nicht.

## Befehle

Projekt starten:

```bash
npm run dev
```

Build pruefen:

```bash
npm run build
```

Aktuelle lokale URL:

```text
http://127.0.0.1:5173/
```

Heldenseite:

```text
http://127.0.0.1:5173/heroes
```

## Wichtig fuer Codex bei Weiterarbeit

1. Erst vorhandene Dateien lesen, nicht blind neu bauen.
2. Bestehende Datenstruktur in `content.js` weiterverwenden.
3. Neue Inhalte zweisprachig anlegen.
4. Header-Layout nicht wieder dynamisch machen.
5. Bilder in `src/assets/heroes/` ablegen und in `heroImagesBySlug` verknuepfen.
6. Fehlende Skilldaten lieber als unsicher markieren, nicht erfinden.
7. Nach UI-Aenderungen `npm run build` ausfuehren.
8. Bei Header/Responsive/Layout nach Moeglichkeit im Browser pruefen.
9. Keine vorhandenen Helden oder Felder loeschen, ausser der Nutzer sagt es explizit.
10. Keine grossen Refactors ohne konkreten Grund.

## Zuletzt erfolgreich geprueft

Zuletzt wurde `npm run build` erfolgreich ausgefuehrt.

Der Header wurde nach dem Sprachwechsel gemessen:

- aktuelle Browserbreite: keine Positionsverschiebung
- 1120px: keine Positionsverschiebung
- 1070px Mobile-Menue-Bereich: keine Positionsverschiebung

Die Heldenbilder wurden im Browser geprueft:

- 16 echte Portraets geladen
- restliche Helden nutzen Platzhalter

