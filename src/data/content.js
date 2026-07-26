import beccaImage from '../assets/heroes/becca.png';
import candyImage from '../assets/heroes/candy.png';
import chefImage from '../assets/heroes/chef.png';
import evaImage from '../assets/heroes/eva.png';
import frejaImage from '../assets/heroes/freja.png';
import ghostImage from '../assets/heroes/ghost.png';
import laylaImage from '../assets/heroes/layla.png';
import luckyImage from '../assets/heroes/lucky.png';
import maddieImage from '../assets/heroes/maddie.png';
import nikolaImage from '../assets/heroes/nikola.png';
import rayImage from '../assets/heroes/ray.png';
import rosieImage from '../assets/heroes/rosie.png';
import rustyImage from '../assets/heroes/rusty.png';
import sargeImage from '../assets/heroes/sarge.png';
import taraImage from '../assets/heroes/tara.png';
import tarzanImage from '../assets/heroes/tarzan.png';
import travisImage from '../assets/heroes/travis.png';

export const heroImagesBySlug = {
  becca: { src: beccaImage },
  candy: { src: candyImage },
  chef: { src: chefImage },
  eva: { src: evaImage },
  freja: { src: frejaImage },
  ghost: { src: ghostImage },
  leyla: { src: laylaImage },
  lucky: { src: luckyImage },
  maddie: { src: maddieImage },
  nikola: { src: nikolaImage },
  ray: { src: rayImage },
  rosie: { src: rosieImage },
  rusty: { src: rustyImage },
  sarge: { src: sargeImage },
  tara: { src: taraImage },
  tarzan: { src: tarzanImage },
  travis: { src: travisImage },
};

export const guideSections = [
  { id: 'events', type: 'category', slug: 'events', icon: 'CalendarDays', route: '/events' },
  { id: 'heroes', type: 'category', slug: 'heroes', icon: 'Shield', route: '/heroes' },
  { id: 'villages', type: 'category', slug: 'villages', icon: 'Landmark', route: '/villages' },
  { id: 'alliance', type: 'category', slug: 'alliance', icon: 'Handshake', route: '/alliance' },
  { id: 'buildings', type: 'category', slug: 'buildings', icon: 'Hammer', route: '/buildings' },
  { id: 'world-map', type: 'category', slug: 'world-map', icon: 'Map', route: '/world-map' },
  { id: 'tips', type: 'category', slug: 'tips', icon: 'Sparkles', route: '/tips' },
  { id: 'faq', type: 'category', slug: 'faq', icon: 'CircleHelp', route: '/faq' },
];

export const metaFormations = [
  {
    id: 'full-sustain-meta',
    type: 'hero-meta',
    title: { en: 'Full Sustain Meta', de: 'Volle Überlebens-Meta' },
    summary: {
      en: 'A slow, stable arena composition that wins through survival, energy rotation, permanent healing, and gradual pressure instead of fast burst.',
      de: 'Eine langsame, stabile Arena-Komposition, die über Überleben, Energierotation, permanente Heilung und stetigen Druck gewinnt statt über schnellen Burst.',
    },
    formation: {
      frontline: [
        {
          hero: 'Nikola',
          slug: 'nikola',
          role: { en: 'Center/front-main tank', de: 'Zentraler Front-Main-Tank' },
          notes: {
            en: ['Absorbs the main damage', 'Shield and sustain core', 'Gives the backline time to charge ultimates'],
            de: ['Absorbiert den Hauptschaden', 'Schild- und Sustain-Core', 'Gibt der Backline Zeit, Ultimates aufzuladen'],
          },
        },
        {
          hero: 'Layla',
          slug: 'leyla',
          role: { en: 'Frontline healer beside Nikola', de: 'Frontline-Heilerin neben Nikola' },
          notes: {
            en: ['Constantly heals Nikola', 'Stays close enough for support skills', 'Makes guard lines hard to kill'],
            de: ['Heilt Nikola konstant', 'Bleibt nah genug für Support-Skills', 'Macht Guard-Linien schwer zu töten'],
          },
        },
      ],
      backline: [
        {
          hero: 'Rosie',
          slug: 'rosie',
          role: { en: 'Middle back carry', de: 'Mittlerer Backline-Carry' },
          notes: {
            en: ['Safest backline position', 'Maximizes ultimate value', 'Sustained AoE pressure'],
            de: ['Sicherste Backline-Position', 'Maximiert Ultimate-Wert', 'Anhaltender AoE-Druck'],
          },
        },
        {
          hero: 'Tarzan',
          slug: 'tarzan',
          role: { en: 'Back-side punisher', de: 'Seitlicher Backline-Bestrafter' },
          notes: {
            en: ['Jumps onto the enemy backline', 'Should not be focused early', 'Punishes supports and DPS'],
            de: ['Springt auf die gegnerische Backline', 'Sollte nicht früh fokussiert werden', 'Bestraft Supports und DPS'],
          },
        },
        {
          hero: 'Tara',
          slug: 'tara',
          role: { en: 'Backline utility and defense support', de: 'Backline-Utility und Verteidigungs-Support' },
          notes: {
            en: ['Adds stronger team stability', 'Improves sustain and debuff pressure', 'Replaces Freja once unlocked'],
            de: ['Gibt dem Team mehr Stabilität', 'Verbessert Sustain und Debuff-Druck', 'Ersetzt Freja, sobald sie freigeschaltet ist'],
          },
        },
      ],
    },
    whyItWorks: {
      en: ['Does not rely on fast burst damage', 'Extreme survivability keeps the team alive through enemy ultimates', 'Energy rotation lets sustain skills cycle repeatedly', 'Nikola + Layla make the frontline extremely hard to kill', 'Rosie, Tarzan, and Tara create steady pressure while the team stays alive'],
      de: ['Verlässt sich nicht auf schnellen Burst-Schaden', 'Extreme Überlebensfähigkeit hält das Team durch gegnerische Ultimates am Leben', 'Energierotation lässt Sustain-Skills wiederholt zirkulieren', 'Nikola + Layla machen die Frontline extrem schwer zu töten', 'Rosie, Tarzan und Tara erzeugen stetigen Druck, während das Team am Leben bleibt'],
    },
    mistakes: {
      en: ['Do not put Tarzan in the frontline', 'Do not put Rosie in the frontline', 'Do not expose Tara without frontline protection', 'If the backline dies early, the sustain system collapses'],
      de: ['Tarzan nicht in die Frontline stellen', 'Rosie nicht in die Frontline stellen', 'Tara nicht ohne Frontline-Schutz offen stehen lassen', 'Wenn die Backline früh stirbt, bricht das Sustain-System zusammen'],
    },
    upgradePath: {
      en: 'Use Tara in the final version of this formation. If Tara is not unlocked yet, Freja is the temporary bridge pick until Tara can take the slot.',
      de: 'Nutze Tara in der finalen Version dieser Formation. Wenn Tara noch nicht freigeschaltet ist, ist Freja nur der vorübergehende Übergangspick, bis Tara den Platz übernimmt.',
    },
  },
];

export const heroClasses = [
  {
    id: 'aeronaut',
    title: { en: 'Aeronaut Heroes', de: 'Aeronaut-Helden' },
    summary: {
      en: 'March efficiency and flexible ranged or hybrid picks. Lucky is especially important for stamina efficiency while marching.',
      de: 'Marsch-Effizienz sowie flexible Fernkampf- und Hybrid-Picks. Lucky ist besonders wichtig für Ausdauer-Effizienz beim Marschieren.',
    },
    heroes: [
      { slug: 'kiki', name: 'Kiki', rarity: 'SSR', note: { en: 'SSR Aeronaut damage dealer focused on piercing laser wave clear.', de: 'SSR-Aeronaut-Damage-Dealerin mit durchdringendem Laser-Waveclear.' } },
      { slug: 'tony', name: 'Tony', rarity: 'SSR', note: { en: 'SSR Aeronaut guard and burst setup hero.', de: 'SSR-Aeronaut-Guard und Burst-Setup-Held.' } },
      { slug: 'lucky', name: 'Lucky', rarity: 'SR', note: { en: 'Extremely important for stamina efficiency while marching.', de: 'Extrem wichtig für die Ausdauer-Effizienz beim Marschieren.' } },
      { slug: 'sarge', name: 'Sarge', rarity: 'SR', note: { en: 'Solid shooter for the start of the game.', de: 'Solider Schütze für den Start des Spiels.' } },
      { slug: 'maddie', name: 'Maddie', rarity: 'SSR', note: { en: 'Early hybrid all-rounder mixing tanking, healing, and damage.', de: 'Früher Hybrid-Allrounder aus Tank, Heilung und Schaden.' } },
      { slug: 'titi', name: 'Titi', rarity: 'SSR', note: { en: 'SSR Aeronaut slot; keep notes updated once exact skill data is verified.', de: 'SSR-Aeronaut-Slot; Notizen aktualisieren, sobald exakte Skilldaten bestätigt sind.' } },
      { slug: 'wright', name: 'Wright', rarity: 'SSR', note: { en: 'SSR Aeronaut slot; evaluate after your core team is stable.', de: 'SSR-Aeronaut-Slot; nach stabilem Kernteam bewerten.' } },
    ],
  },
  {
    id: 'rover',
    title: { en: 'Rover Heroes', de: 'Rover-Helden' },
    summary: {
      en: 'Starter stability, PvE value, control tools, and the Layla frontline sustain core.',
      de: 'Starter-Stabilität, PvE-Wert, Kontrollwerkzeuge und Layla als Frontline-Sustain-Core.',
    },
    heroes: [
      { slug: 'ghost', name: 'Ghost', rarity: 'R', note: { en: 'Basic entry class for the start.', de: 'Basis-Klasse für den Einstieg.' } },
      { slug: 'eva', name: 'Eva', rarity: 'SR', note: { en: 'Reliable choice for early PvE.', de: 'Zuverlässige Wahl für das frühe PvE.' } },
      { slug: 'travis', name: 'Travis', rarity: 'SR', note: { en: 'Situational supporter and bridge pick.', de: 'Situativer Unterstützer und Übergangspick.' } },
      { slug: 'becca', name: 'Becca', rarity: 'SSR', note: { en: 'SSR Rover damage option with positional payoff.', de: 'SSR-Rover-Damage-Option mit Positionswert.' } },
      { slug: 'candy', name: 'Candy', rarity: 'SSR', note: { en: 'Healing and crit support for damage-focused teams.', de: 'Heilung und Krit-Support für damage-fokussierte Teams.' } },
      { slug: 'chiron', name: 'Chiron', rarity: 'SSR', note: { en: 'Defense-break support for bosses and tanky enemies.', de: 'Defense-Break-Support gegen Bosse und tankige Gegner.' } },
      { slug: 'jacob', name: 'Jacob', rarity: 'SSR', note: { en: 'Flamethrower AoE and taunting puppet control.', de: 'Flammenwerfer-AoE und Kontrolle durch Spott-Puppen.' } },
      { slug: 'leyla', name: 'Layla', rarity: 'SSR', note: { en: 'Support class, but huge HP buffs make her a frontline priority.', de: 'Support-Klasse, gehört wegen enormer LP-Buffs trotzdem in die vorderste Frontreihe.' } },
    ],
  },
  {
    id: 'stalwart',
    title: { en: 'Stalwart Heroes', de: 'Stalwart-Helden' },
    summary: {
      en: 'Frontline fillers, early attackers, AoE carries, defense buffers, and protected backline pressure.',
      de: 'Frontline-Füller, frühe Angreifer, AoE-Carries, Defense-Buffer und geschützte Backline-Pressure.',
    },
    heroes: [
      { slug: 'nikola', name: 'Nikola', rarity: 'SSR', note: { en: 'Premium frontline tank and current meta anchor.', de: 'Premium-Frontline-Tank und aktueller Meta-Anker.' } },
      { slug: 'rusty', name: 'Rusty', rarity: 'R', note: { en: 'Low damage and quickly replaced as the account grows.', de: 'Geringer Schaden, wird im Verlauf des Spiels schnell ersetzt.' } },
      { slug: 'chef', name: 'Chef', rarity: 'SR', note: { en: 'Unlocked directly at the beginning.', de: 'Wird direkt zu Beginn freigeschaltet.' } },
      { slug: 'freja', name: 'Freja', rarity: 'SR', note: { en: 'Strong early attacker and bridge DPS.', de: 'Starker früher Angreifer und Übergangs-DPS.' } },
      { slug: 'ray', name: 'Ray', rarity: 'SSR', note: { en: 'Glass cannon with massive grenade AoE damage.', de: 'Glaskanone mit massivem Granaten-Flächenschaden.' } },
      { slug: 'rosie', name: 'Rosie', rarity: 'SSR', note: { en: 'One of the strongest AoE damage dealers for the backline.', de: 'Einer der stärksten AoE-Schadensverursacher für die hintere Reihe.' } },
      { slug: 'tara', name: 'Tara', rarity: 'SSR', note: { en: 'Extremely strong defense buffs for the whole team.', de: 'Bietet dem gesamten Team extrem starke Verteidigungs-Buffs.' } },
      { slug: 'tarzan', name: 'Tarzan', rarity: 'SSR', note: { en: 'Important backline pressure pick; protect his position.', de: 'Wichtig für die hintere Reihe, sollte geschützt positioniert werden.' } },
      { slug: 'tesla', name: 'Tesla', rarity: 'SSR', note: { en: 'SSR Stalwart slot; add detailed skill notes after verification.', de: 'SSR-Stalwart-Slot; detaillierte Skillnotizen nach Verifizierung ergänzen.' } },
    ],
  },
];

export const heroClassBySlug = heroClasses.reduce((lookup, heroClass) => {
  heroClass.heroes.forEach((hero) => {
    lookup[hero.slug] = {
      classId: heroClass.id,
      classTitle: heroClass.title,
      rarity: hero.rarity,
      note: hero.note,
    };
  });
  return lookup;
}, {});

const heroSourceNote = {
  en: 'Based on public hero tier, recruitment, equipment, and beginner guides found online in July 2026, including LDShop’s German hero tier list dated 2026-02-11. Exact in-game values can change with patches and should be verified in-game before spending rare materials.',
  de: 'Basierend auf öffentlichen Tier-, Rekrutierungs-, Ausrüstungs- und Beginner-Guides, die im Juli 2026 online gefunden wurden, inklusive der deutschen LDShop-Helden-Tierliste vom 2026-02-11. Exakte Spielwerte können sich durch Patches ändern und sollten vor dem Einsatz seltener Materialien im Spiel geprüft werden.',
};

const eventSourceNote = {
  en: 'Based on official Tiles Survive patch notes and public event guides checked on 2026-07-26. Event names, schedules, rewards, and unlock rules can change by server age, season, and patch, so always confirm details in the in-game Event Center before spending rare items.',
  de: 'Basierend auf offiziellen Tiles-Survive-Patchnotes und öffentlichen Event-Guides, geprüft am 2026-07-26. Eventnamen, Zeitpläne, Belohnungen und Freischaltungen können sich je nach Serveralter, Saison und Patch ändern. Details immer im Event Center im Spiel prüfen, bevor seltene Items eingesetzt werden.',
};

const territorySourceLinks = [
  {
    title: { en: 'In-game screenshots - territory details level 1-6', de: 'Ingame-Screenshots - Gebietsdetails Stufe 1-6' },
    url: '#territory-detail-screenshots',
    note: { en: 'Shows the occupation benefits, points, and garrison state for each territory level.', de: 'Zeigt Besetzungsvorteile, Punkte und Garnison für jede Gebietsstufe.' },
    screenshots: [
      { src: '/screenshots/territories/detail-level-1-dorf.png', title: { en: 'Level 1 Village details', de: 'Stufe 1 Dorf Details' }, description: { en: 'Resource gathering speed +5.0%, points +1, garrison 100%.', de: 'Sammelgeschwindigkeit Ressourcen +5,0 %, Punkte +1, Garnison 100 %.' } },
      { src: '/screenshots/territories/detail-level-2-fabrik.png', title: { en: 'Level 2 Factory details', de: 'Stufe 2 Fabrik Details' }, description: { en: 'Research speed +5.0%, points +3, garrison 100%.', de: 'Forschungstempo +5,0 %, Punkte +3, Garnison 100 %.' } },
      { src: '/screenshots/territories/detail-level-3-stadt.png', title: { en: 'Level 3 Town details', de: 'Stufe 3 Stadt Details' }, description: { en: 'Troop attack bonus +2.0%, points +10, garrison 100%.', de: 'Truppenangriffsbonus +2,0 %, Punkte +10, Garnison 100 %.' } },
      { src: '/screenshots/territories/detail-level-4-metropole.png', title: { en: 'Level 4 Metropolis details', de: 'Stufe 4 Metropole Details' }, description: { en: 'Basic resource production +20.0%, points +20, garrison 100%.', de: 'Einfache Ressourcenproduktion +20,0 %, Punkte +20, Garnison 100 %.' } },
      { src: '/screenshots/territories/detail-level-5-forschungszentrum.png', title: { en: 'Level 5 Research Center details', de: 'Stufe 5 Forschungszentrum Details' }, description: { en: 'Training speed +10.0%, points +50, garrison 100%.', de: 'Trainingstempo +10,0 %, Punkte +50, Garnison 100 %.' } },
      { src: '/screenshots/territories/detail-level-6-militaerbasis.png', title: { en: 'Level 6 Military Base details', de: 'Stufe 6 Militärbasis Details' }, description: { en: 'Troop health bonus +5.0%, points +100, garrison 100%.', de: 'Truppenzustandsbonus +5,0 %, Punkte +100, Garnison 100 %.' } },
    ],
  },
  {
    title: { en: 'Reddit community notes - Alliance Territory Boosts', de: 'Reddit-Community-Hinweise - Allianzgebiets-Buffs' },
    url: 'https://www.reddit.com/r/tilessurvive/comments/1q5s4r7/alliance_territory_boosts/',
    note: { en: 'Lists level 1 and level 2 territory buff examples; higher levels are still incomplete there.', de: 'Nennt Buff-Beispiele für Stufe 1 und Stufe 2; höhere Stufen sind dort noch unvollständig.' },
  },
  {
    title: { en: 'Reddit community notes - occupying villages/factories/towns', de: 'Reddit-Community-Hinweise - Dörfer/Fabriken/Städte einnehmen' },
    url: 'https://www.reddit.com/r/tilessurvive/comments/1pubhmd/taking_villiagefactorytownetc/',
    note: { en: 'Community replies mention territory slot limits and declaration limits.', de: 'Community-Antworten nennen Gebietsslots und Limits für Kriegserklärungen.' },
  },
];

const territorySourceNote = {
  en: 'Territory names, occupation benefits, points, and garrison state for level 1-6 are now based on provided in-game screenshots. Limits and stacking behavior should still be checked in-game because they can depend on alliance level and server state.',
  de: 'Gebietsnamen, Besetzungsvorteile, Punkte und Garnison für Stufe 1-6 basieren jetzt auf bereitgestellten Ingame-Screenshots. Limits und Stapelung bitte weiter im Spiel prüfen, weil sie von Allianzlevel und Serverstand abhängen können.',
};

const allianceSourceLinks = [
  {
    title: { en: 'In-game screenshots - alliance menu, ranks, and chests', de: 'Ingame-Screenshots - Allianzmenü, Ränge und Kisten' },
    url: '#alliance-system-screenshots',
    note: { en: 'Shows the alliance menu, member rank groups, applicant list, cooperation chest progress, and alliance gift list.', de: 'Zeigt Allianzmenü, Mitgliederränge, Bewerberliste, Fortschritt der Kooperationskiste und Allianzgeschenke.' },
    screenshots: [
      { src: '/screenshots/alliance/alliance-menu.png', title: { en: 'Alliance menu', de: 'Allianzmenü' }, description: { en: 'Shows News, Alliance City rank 1, Help, Technology, Shop, Chests, and Rankings.', de: 'Zeigt Neuigkeiten, Stadt Rang 1, Hilfe, Technik, Laden, Kisten und Ranglisten.' } },
      { src: '/screenshots/alliance/alliance-ranks.png', title: { en: 'Alliance ranks', de: 'Allianzränge' }, description: { en: 'Shows R4, R3, R2, R1, and applicant list groups with current member limits.', de: 'Zeigt R4, R3, R2, R1 und Bewerberliste mit aktuellen Mitgliederlimits.' } },
      { src: '/screenshots/alliance/alliance-chests.png', title: { en: 'Alliance chests and gifts', de: 'Allianzkisten und Geschenke' }, description: { en: 'Shows cooperation chest progress and alliance gift rewards. Player names are anonymized.', de: 'Zeigt Fortschritt der Kooperationskiste und Allianzgeschenk-Belohnungen. Spielernamen sind anonymisiert.' } },
    ],
  },
  {
    title: { en: 'Official Tiles Survive game info list', de: 'Offizielle Tiles-Survive-Game-Info-Liste' },
    url: 'https://tilessurvive.com/en/list',
    note: { en: 'Official game info and patch-note list used only for general context because menu details are mostly visible from screenshots.', de: 'Offizielle Game-Info- und Patchnote-Liste; hier nur allgemeiner Kontext, weil Menüdetails hauptsächlich aus Screenshots kommen.' },
  },
  {
    title: { en: 'LDShop alliance event guide', de: 'LDShop Allianz-Event-Guide' },
    url: 'https://www.ldshop.gg/blog/tiles-survive/alliance-event.html',
    note: { en: 'Public guide describing why coordinated alliance activity matters for events and rewards.', de: 'Öffentlicher Guide, der erklärt, warum koordinierte Allianzaktivität für Events und Belohnungen wichtig ist.' },
  },
];

const allianceMenuSourceLinks = [
  {
    title: { en: 'In-game screenshot - alliance menu', de: 'Ingame-Screenshot - Allianzmenü' },
    url: '#alliance-menu-screenshot',
    note: { en: 'Shows the visible alliance menu entries.', de: 'Zeigt die sichtbaren Menüpunkte der Allianz.' },
    screenshots: [
      { src: '/screenshots/alliance/alliance-menu.png', title: { en: 'Alliance menu', de: 'Allianzmenü' }, description: { en: 'Shows News, Alliance City rank 1, Help, Technology, Shop, Chests, and Rankings.', de: 'Zeigt Neuigkeiten, Stadt Rang 1, Hilfe, Technik, Laden, Kisten und Ranglisten.' } },
    ],
  },
];

const allianceRanksSourceLinks = [
  {
    title: { en: 'In-game screenshot - alliance ranks', de: 'Ingame-Screenshot - Allianzränge' },
    url: '#alliance-ranks-screenshot',
    note: { en: 'Shows R4, R3, R2, R1, and applicant list groups.', de: 'Zeigt R4, R3, R2, R1 und die Bewerberliste.' },
    screenshots: [
      { src: '/screenshots/alliance/alliance-ranks.png', title: { en: 'Alliance ranks', de: 'Allianzränge' }, description: { en: 'Shows the visible rank groups and the applicant list. Momentary member counts are not used as guide rules.', de: 'Zeigt die sichtbaren Ranggruppen und Bewerberliste. Momentane Mitgliederzahlen werden nicht als Guide-Regel genutzt.' } },
    ],
  },
];

const allianceChestSourceLinks = [
  {
    title: { en: 'In-game screenshot - alliance chests and gifts', de: 'Ingame-Screenshot - Allianzkisten und Geschenke' },
    url: '#alliance-chests-screenshot',
    note: { en: 'Shows cooperation chest progress and alliance gift rewards.', de: 'Zeigt Fortschritt der Kooperationskiste und Allianzgeschenk-Belohnungen.' },
    screenshots: [
      { src: '/screenshots/alliance/alliance-chests.png', title: { en: 'Alliance chests and gifts', de: 'Allianzkisten und Geschenke' }, description: { en: 'Shows cooperation chest progress and alliance gift rewards. Player names are anonymized.', de: 'Zeigt Fortschritt der Kooperationskiste und Allianzgeschenk-Belohnungen. Spielernamen sind anonymisiert.' } },
    ],
  },
];

const allianceSourceNote = {
  en: 'Alliance menu, rank, and chest details are based on provided in-game screenshots. Exact permissions, technology trees, shop inventory, and rank limits can change with alliance level or patches and should be verified in-game.',
  de: 'Allianzmenü, Ränge und Kisten basieren auf bereitgestellten Ingame-Screenshots. Exakte Berechtigungen, Technikbäume, Ladeninventar und Ranglimits können sich mit Allianzlevel oder Patches ändern und sollten im Spiel geprüft werden.',
};

export const guideEntries = [
  {
    id: 'event-alliance-duel-vs',
    type: 'event',
    slug: 'alliance-duel-vs',
    route: '/events/alliance-duel-vs',
    status: 'researched',
    ownerId: 'system',
    updatedAt: '2026-07-26',
    featured: true,
    title: { en: 'Alliance Duel VS', de: 'Allianzduell VS' },
    summary: {
      en: 'A multi-day alliance competition with daily themes such as radar, building, research, hero growth, troop training, and kill event.',
      de: 'Ein mehrtägiger Allianz-Wettkampf mit Tages-Themen wie Radar, Bauen, Forschung, Heldenwachstum, Truppentraining und Kill Event.',
    },
    tags: ['events', 'alliance', 'weekly', 'pvp', 'growth'],
    details: {
      beginnerBasics: {
        en: 'Alliance Duel VS is a multi-day alliance scoring event. Each day rewards a different activity, so the main skill is not spending everything at once. A beginner should think of it as a weekly schedule: save items, wait for the correct day, score points together with the alliance, then claim milestones.',
        de: 'Allianzduell VS ist ein mehrtägiges Allianz-Punkteevent. Jeder Tag belohnt eine andere Aktivität, deshalb ist die wichtigste Regel: nicht alles sofort ausgeben. Als Anfänger solltest du es wie einen Wochenplan sehen: Items sparen, auf den passenden Tag warten, zusammen mit der Allianz Punkte machen und dann Meilensteine abholen.'
      },
      beginnerSteps: {
        en: [
          'Open the event and write down the current day theme.',
          'If it is not the matching day, save your items.',
          'On Radar day do radar tasks; on Building day finish buildings; on Research day finish research; on Hero day upgrade heroes; on Training day train troops; on Kill Event day fight only if prepared.',
          'Claim personal milestones after scoring.',
          'Check alliance chat for shared push times.'
        ],
        de: [
          'Öffne das Event und merke dir das Tagesthema.',
          'Wenn es nicht der passende Tag ist, sparst du deine Items.',
          'Am Radar-Tag machst du Radaraufgaben; am Bau-Tag Gebäude; am Forschungs-Tag Forschung; am Helden-Tag Helden; am Trainings-Tag Truppen; am Kill-Event-Tag kämpfst du nur vorbereitet.',
          'Hole deine persönlichen Meilensteine ab.',
          'Achte im Allianzchat auf gemeinsame Push-Zeiten.'
        ]
      },
      beginnerSpendPlan: {
        en: [
          'Do not spend rare items immediately when the event appears.',
          'First read the task list and check which action gives points today.',
          'Spend only enough to reach the next good milestone unless your alliance has a coordinated push.',
          'Stop when the next reward costs more than it is worth for your account.'
        ],
        de: [
          'Gib seltene Items nicht sofort aus, nur weil das Event erscheint.',
          'Lies zuerst die Aufgabenliste und prüfe, welche Aktion heute wirklich Punkte gibt.',
          'Gib nur so viel aus, bis du den nächsten guten Meilenstein erreichst, außer deine Allianz macht einen gemeinsamen Push.',
          'Stoppe, wenn die nächste Belohnung mehr kostet, als sie deinem Account bringt.'
        ]
      },
      beginnerMistakes: {
        en: [
          'Using building speedups on Hero day.',
          'Training troops before Troop Training day starts.',
          'Joining Kill Event without shields, healing speedups, or hospital space.',
          'Ignoring alliance timing and scoring alone.'
        ],
        de: [
          'Bau-Speedups am Helden-Tag benutzen.',
          'Truppen trainieren, bevor der Truppentraining-Tag startet.',
          'Beim Kill Event ohne Schild, Heil-Speedups oder Krankenhausplatz mitmachen.',
          'Allianz-Timing ignorieren und allein punkten.'
        ]
      },
      participationRules: {
        en: [
          'Power Plant level 10 is required to participate.',
          'Only alliances with 10 or more members are eligible for partner matching.',
          'On Sunday, the 32 best alliances in each State can enter weekly matchmaking.',
          'Your alliance plays a one-week duel against a matched enemy alliance.',
          'Every day introduces a new daily theme.'
        ],
        de: [
          'Für die Teilnahme wird Kraftwerkslevel 10 benötigt.',
          'Nur Allianzen mit 10 oder mehr Mitgliedern sind für die Partnervermittlung berechtigt.',
          'Am Sonntag können die 32 besten Allianzen je Staat am wöchentlichen Matchmaking teilnehmen.',
          'Deine Allianz tritt eine Woche lang gegen eine zugewiesene gegnerische Allianz an.',
          'Jeden Tag wird ein neues Tagesthema eingeführt.'
        ]
      },
      eventMechanics: {
        en: [
          'Themes tab: Complete tasks for the current daily theme to earn alliance points and personal milestone rewards.',
          'Raid tab: When the “Defeat Enemies” theme begins, raids become available. Move close to the enemy alliance to start attacks while your allies support defense.',
          'Victory tab: At the end of the event, the alliance with the higher score wins and receives rich rewards.',
          'Daily scoring: the alliance with more points wins the corresponding daily ranking for that day.',
          'Event scoring: at the end of the event, the alliance with the higher total score wins the match.',
          'Alliance changes during the event block new alliance points for that day. Your solo points for unlocking milestone rewards remain unaffected.',
          'Only purchases that contain gems count for purchase-related points.',
          'Top performers receive additional rewards based on ranking lists.'
        ],
        de: [
          'Themen-Tab: Erledige Aufgaben des aktuellen Tagesthemas, um Punkte für deine Allianz und persönliche Meilensteinbelohnungen zu verdienen.',
          'Überfälle-Tab: Sobald das Thema „Besiege Feinde“ beginnt, werden Überfälle verfügbar. Versetze dich in die Nähe der feindlichen Allianz, um Angriffe zu starten, während Verbündete bei der Verteidigung unterstützen.',
          'Sieg-Tab: Am Ende des Events gewinnt die Allianz mit der höheren Punktzahl und erhält reiche Belohnungen.',
          'Tageswertung: Die Allianz mit mehr Punkten gewinnt die entsprechende Punktzahl für diesen Tag.',
          'Eventwertung: Am Ende des Events gewinnt die Allianz mit dem höheren Score.',
          'Allianzwechsel während des Events blockiert neue Allianzpunkte für diesen Tag. Deine Solo-Punkte zum Freischalten von Meilensteinbelohnungen bleiben unberührt.',
          'Nur Käufe, die Edelsteine enthalten, tragen zu Kaufpunkten bei.',
          'Mitglieder mit Top-Leistungen erhalten basierend auf den Ranglisten zusätzliche Belohnungen.'
        ]
      },
      dailyThemes: {
        en: [
          'Day 1 - Radar and resources: Spend 1 commander stamina = 300 points; complete 1 spy mission = 37,500; use equipment patch worth 100 EXP = 2,900; 400 EXP = 11,500; 2,000 EXP = 57,200; 10,000 EXP = 285,800; earn 1 diamond through pack purchases = 20; gather food/wood/metal/fuel resource tasks give small point gains.',
          'Day 2 - Building and dispatch: Speed up construction by 1 minute = 250; increase power by 1 through construction = 9; dispatch 1 Class A truck = 50,000; complete 1 S-tier task in difficult dispatch = 75,000; earn 1 diamond through pack purchases = 20.',
          'Day 3 - Research and monsters: Reduce research timer by 1 minute = 250; increase power by 1 through research = 4; spend 1 battle medal = 2,500; complete 1 spy mission = 30,000; earn 1 diamond through pack purchases = 20; every 100 monster EXP from a single attempt = 1,000; use 1 monster cell = 12,000.',
          'Day 4 - Heroes and recruitment: Wish recruitment = 13,400; advanced recruitment = 3,000; standard recruitment = 500; use 1 legendary hero fragment = 15,200; epic fragment = 1,600; rare fragment = 160; use 1 hero skill handbook/book = 2,500; earn 1 diamond through pack purchases = 20.',
          'Day 5 - Mixed growth and troop training: Complete 1 spy mission = 37,500; construction speedup 1 minute = 250; construction power +1 = 9; research timer -1 minute = 250; research power +1 = 4; training speedup 1 minute, excluding queue time = 250; train 1 troop level 1 = 6, level 2 = 11, level 3 = 17, level 4 = 22, level 5 = 26, level 6 = 33, level 7 = 37, level 8 = 44.',
          'Day 6 - Burrow Conquest, dispatch, speedups, healing, and enemy troops: Faulty sandworm egg = 5,000; fresh sandworm egg = 50,000; perfect sandworm egg = 500,000; dispatch 1 Class A truck = 50,000; complete 1 S-tier task in difficult dispatch = 75,000; construction speedup 1 minute = 250; research timer -1 minute = 250; training speedup 1 minute, excluding queue time = 250; healing speedup 1 minute = 250; defeat enemy troops in assigned alliance battles: level 1 = 6, level 2 = 12, level 3 = 18, level 4 = 24, level 5 = 30.'
        ],
        de: [
          'Tag 1 - Radar und Ressourcen: 1 Kommandantenausdauer verbrauchen = 300 Punkte; 1 Spionagemission abschließen = 37.500; Ausrüstungsfetzen im Wert von 100 EP verwenden = 2.900; 400 EP = 11.500; 2.000 EP = 57.200; 10.000 EP = 285.800; 1 Diamant durch Paketkäufe verdienen = 20; Nahrung/Holz/Metall/Benzin sammeln gibt kleine Zusatzpunkte.',
          'Tag 2 - Bau und Entsendung: Bau um 1 Minute beschleunigen = 250; Kraft durch Bau um 1 erhöhen = 9; 1 LKW Klasse A entsenden = 50.000; 1 S-Stufen-Aufgabe in schwieriger Entsendung abschließen = 75.000; 1 Diamant durch Paketkäufe verdienen = 20.',
          'Tag 3 - Forschung und Ungeheuer: Forschungstimer um 1 Minute senken = 250; Kraft durch Forschung um 1 erhöhen = 4; 1 Kampfmedaille ausgeben = 2.500; 1 Spionagemission abschließen = 30.000; 1 Diamant durch Paketkäufe verdienen = 20; je 100 Ungeheuer-EP aus einem einzelnen Versuch = 1.000; 1 Ungeheuer-Zelle verwenden = 12.000.',
          'Tag 4 - Helden und Rekrutierung: 1 Wunsch-Rekrutierung = 13.400; 1 fortgeschrittene Rekrutierung = 3.000; 1 Standard-Rekrutierung = 500; 1 legendäres Heldenfragment nutzen = 15.200; episches Fragment = 1.600; seltenes Fragment = 160; 1 Heldenfähigkeiten-Handbuch/Buch verwenden = 2.500; 1 Diamant durch Paketkäufe verdienen = 20.',
          'Tag 5 - Gemischtes Wachstum und Truppentraining: 1 Spionagemission abschließen = 37.500; Bau um 1 Minute beschleunigen = 250; Baukraft +1 = 9; Forschungstimer um 1 Minute senken = 250; Forschungskraft +1 = 4; Training um 1 Minute beschleunigen, ohne Zeit in Warteschlange = 250; 1 Truppe trainieren: Level 1 = 6, Level 2 = 11, Level 3 = 17, Level 4 = 22, Level 5 = 26, Level 6 = 33, Level 7 = 37, Level 8 = 44.',
          'Tag 6 - Burrow Conquest, Entsendung, Speedups, Heilung und Gegnertruppen: 1 fehlerhaftes Sandwurm-Ei = 5.000; 1 frisches Sandwurm-Ei = 50.000; 1 perfektes Sandwurm-Ei = 500.000; 1 LKW Klasse A entsenden = 50.000; 1 S-Stufen-Aufgabe in schwieriger Entsendung abschließen = 75.000; Bau-Speedup 1 Minute = 250; Forschungstimer 1 Minute senken = 250; Training 1 Minute beschleunigen, ohne Warteschlange = 250; Heilungsbeschleuniger 1 Minute = 250; je 1 besiegte feindliche Truppe in zugewiesenen Allianzschlachten: Level 1 = 6, Level 2 = 12, Level 3 = 18, Level 4 = 24, Level 5 = 30.'
        ]
      },
      milestoneRewards: {
        en: [
          'Daily theme milestone chests unlock at 2,500 points, 5,000 points, and 12,000 points.',
          'The winning alliance receives event-end victory rewards.',
          'Top-ranking members receive additional ranking rewards.'
        ],
        de: [
          'Die täglichen Themen-Meilensteintruhen werden bei 2.500 Punkten, 5.000 Punkten und 12.000 Punkten freigeschaltet.',
          'Die siegreiche Allianz erhält am Eventende Sieg-Belohnungen.',
          'Mitglieder mit Top-Leistungen erhalten zusätzliche Ranglistenbelohnungen.'
        ]
      },
      dailyRankingRewards: {
        en: [
          'Rank 1: Legendary Hero Fragment x5, Battle Medal x300, Gems x10,000, Equipment Patch x100.',
          'Rank 2: Legendary Hero Fragment x4, Battle Medal x250, Gems x8,000, Equipment Patch x80.',
          'Rank 3: Legendary Hero Fragment x3, Battle Medal x200, Gems x7,000, Equipment Patch x70.',
          'Rank 4-10: Legendary Hero Fragment x2, Battle Medal x150, Gems x4,000, Equipment Patch x40.',
          'Rank 11-30: Legendary Hero Fragment x1, Battle Medal x100, Gems x1,000, Equipment Patch x10.',
          'Item tooltip notes: Legendary Hero Fragment can be exchanged for a fragment of an owned legendary hero; Battle Medal is used for advanced settlement technology research; Equipment Patch gives 100 equipment EXP when improving hero equipment.'
        ],
        de: [
          'Rang 1: Legendäres Heldenfragment x5, Kampfmedaille x300, Edelsteine x10.000, Ausrüstungsfetzen x100.',
          'Rang 2: Legendäres Heldenfragment x4, Kampfmedaille x250, Edelsteine x8.000, Ausrüstungsfetzen x80.',
          'Rang 3: Legendäres Heldenfragment x3, Kampfmedaille x200, Edelsteine x7.000, Ausrüstungsfetzen x70.',
          'Rang 4-10: Legendäres Heldenfragment x2, Kampfmedaille x150, Edelsteine x4.000, Ausrüstungsfetzen x40.',
          'Rang 11-30: Legendäres Heldenfragment x1, Kampfmedaille x100, Edelsteine x1.000, Ausrüstungsfetzen x10.',
          'Item-Tooltips: Legendäres Heldenfragment kann gegen ein Fragment eines legendären Helden in Besitz eingetauscht werden; Kampfmedaille wird für die Forschung an fortgeschrittener Siedlungstechnologie genutzt; Ausrüstungsfetzen geben 100 Ausrüstungs-EP beim Verbessern von Heldenausrüstung.'
        ]
      },
      allianceRewards: {
        en: [
          'Gold daily participation rewards require at least 500,000 daily Alliance Duel points: 10,000 Hero EXP x10, 10,000 Wood x20, 10,000 Food x20, 10,000 Metal x4, 10,000 Fuel x1.',
          'Silver daily participation rewards: 10,000 Hero EXP x20, 10,000 Wood x40, 10,000 Food x40, 10,000 Metal x8, 10,000 Fuel x2.',
          'Diamond daily participation rewards: 10,000 Hero EXP x30, 10,000 Wood x100, 10,000 Food x100, 10,000 Metal x20, 10,000 Fuel x5.',
          'Gold weekly victory rewards require at least 3,000,000 weekly Alliance Duel points: Battle Medal x800, 10,000 Wood x200, 10,000 Food x200, 10,000 Metal x40, 10,000 Fuel x10.',
          'Silver weekly victory rewards: Battle Medal x1,100, Gems x1,500, 10,000 Wood x300, 10,000 Food x300, 10,000 Metal x60.',
          'Diamond weekly victory rewards: Battle Medal x2,200, Gems x2,200, 10,000 Wood x400, 10,000 Food x400, 10,000 Metal x80.',
          'Gold weekly defeat rewards require at least 3,000,000 weekly Alliance Duel points: Battle Medal x450, 10,000 Wood x340, 10,000 Food x140, 10,000 Metal x28, 10,000 Fuel x7.',
          'Silver weekly defeat rewards: Battle Medal x850, Gems x850, 10,000 Wood x200, 10,000 Food x200, 10,000 Metal x40.',
          'Diamond weekly defeat rewards: Battle Medal x1,100, Gems x1,100, 10,000 Wood x300, 10,000 Food x300, 10,000 Metal x60.',
          'Resource tooltip notes: each 10,000 resource item grants that resource directly to your settlement; 10,000 Hero EXP grants 10,000 hero EXP.'
        ],
        de: [
          'Gold tägliche Teilnahmebelohnungen benötigen mindestens 500.000 tägliche Allianzduell-Punkte: 10.000 Helden-EP x10, 10.000 Holz x20, 10.000 Nahrung x20, 10.000 Metall x4, 10.000 Benzin x1.',
          'Silber tägliche Teilnahmebelohnungen: 10.000 Helden-EP x20, 10.000 Holz x40, 10.000 Nahrung x40, 10.000 Metall x8, 10.000 Benzin x2.',
          'Diamant tägliche Teilnahmebelohnungen: 10.000 Helden-EP x30, 10.000 Holz x100, 10.000 Nahrung x100, 10.000 Metall x20, 10.000 Benzin x5.',
          'Gold wöchentliche Siegesbelohnungen benötigen mindestens 3.000.000 wöchentliche Allianzduell-Punkte: Kampfmedaille x800, 10.000 Holz x200, 10.000 Nahrung x200, 10.000 Metall x40, 10.000 Benzin x10.',
          'Silber wöchentliche Siegesbelohnungen: Kampfmedaille x1.100, Edelsteine x1.500, 10.000 Holz x300, 10.000 Nahrung x300, 10.000 Metall x60.',
          'Diamant wöchentliche Siegesbelohnungen: Kampfmedaille x2.200, Edelsteine x2.200, 10.000 Holz x400, 10.000 Nahrung x400, 10.000 Metall x80.',
          'Gold wöchentliche Niederlagen-Belohnungen benötigen mindestens 3.000.000 wöchentliche Allianzduell-Punkte: Kampfmedaille x450, 10.000 Holz x340, 10.000 Nahrung x140, 10.000 Metall x28, 10.000 Benzin x7.',
          'Silber wöchentliche Niederlagen-Belohnungen: Kampfmedaille x850, Edelsteine x850, 10.000 Holz x200, 10.000 Nahrung x200, 10.000 Metall x40.',
          'Diamant wöchentliche Niederlagen-Belohnungen: Kampfmedaille x1.100, Edelsteine x1.100, 10.000 Holz x300, 10.000 Nahrung x300, 10.000 Metall x60.',
          'Ressourcen-Tooltips: Jedes 10.000er-Ressourcenitem gewährt deiner Siedlung direkt diese Ressource; 10.000 Helden-EP gewährt 10.000 Helden-EP.'
        ]
      },
      leagueRewards: {
        en: [
          'League rewards unlock after at least 12,000,000 points during the league season.',
          'Titles: Silver = Kampfvorhut, Gold = Legionskommandant, Diamond = Unübertroffen.',
          'March skin: Kriegsmaschine gives march speed against infected +3%. The skin is temporary and expires after the listed duration.',
          'Silver alliance rank 1: member ranks 1-10, 11-30, and 31-100 receive Kriegsmaschine for 7 days and Kampfvorhut for 30 days.',
          'Silver alliance rank 2-3: member ranks 1-10 receive Kriegsmaschine 7 days and Kampfvorhut 30 days; 11-30 receive Kriegsmaschine 3 days and Kampfvorhut 14 days; 31-100 receive no march skin and Kampfvorhut 14 days.',
          'Silver alliance rank 4-16: member ranks 1-10 receive Kriegsmaschine 3 days and Kampfvorhut 14 days; 11-30 and 31-100 receive no march skin and Kampfvorhut 7 days.',
          'Gold alliance rank 1: all member brackets receive Kriegsmaschine 14 days and Legionskommandant 30 days.',
          'Gold alliance rank 2-3: member ranks 1-10 receive Kriegsmaschine 14 days and Legionskommandant 30 days; 11-30 receive Kriegsmaschine 7 days and Legionskommandant 14 days; 31-100 receive Kriegsmaschine 3 days and Legionskommandant 14 days.',
          'Gold alliance rank 4-16: member ranks 1-10 receive Kriegsmaschine 7 days and Legionskommandant 14 days; 11-30 and 31-100 receive Kriegsmaschine 3 days and Legionskommandant 7 days.',
          'Diamond alliance rank 1: all member brackets receive Kriegsmaschine 30 days and Unübertroffen 30 days.',
          'Diamond alliance rank 2-3: member ranks 1-10 receive Kriegsmaschine 30 days and Unübertroffen 30 days; 11-30 receive Kriegsmaschine 14 days and Unübertroffen 14 days; 31-100 receive Kriegsmaschine 7 days and Unübertroffen 14 days.',
          'Diamond alliance rank 4-16: member ranks 1-10 receive Kriegsmaschine 14 days and Unübertroffen 14 days; 11-30 and 31-100 receive Kriegsmaschine 7 days and Unübertroffen 7 days.',
          'Extra league items include Umschmiedehammer for rerolling equipment secondary stats, 500 Allianzsilber for the alliance shop, and Vorratskiste (100,000) containing food, wood, metal, or fuel.'
        ],
        de: [
          'Ligabelohnungen können ab mindestens 12.000.000 Punkten während der Ligasaison beansprucht werden.',
          'Titel: Silber = Kampfvorhut, Gold = Legionskommandant, Diamant = Unübertroffen.',
          'Marschskin: Kriegsmaschine gibt Marschtempo gegen Infizierte +3 %. Der Skin ist zeitlich begrenzt und läuft nach der angegebenen Dauer ab.',
          'Silber Allianzrang 1: Mitgliederrang 1-10, 11-30 und 31-100 erhalten Kriegsmaschine für 7 Tage und Kampfvorhut für 30 Tage.',
          'Silber Allianzrang 2-3: Mitgliederrang 1-10 erhält Kriegsmaschine 7 Tage und Kampfvorhut 30 Tage; 11-30 erhält Kriegsmaschine 3 Tage und Kampfvorhut 14 Tage; 31-100 erhält keinen Marschskin und Kampfvorhut 14 Tage.',
          'Silber Allianzrang 4-16: Mitgliederrang 1-10 erhält Kriegsmaschine 3 Tage und Kampfvorhut 14 Tage; 11-30 und 31-100 erhalten keinen Marschskin und Kampfvorhut 7 Tage.',
          'Gold Allianzrang 1: Alle Mitgliederränge erhalten Kriegsmaschine 14 Tage und Legionskommandant 30 Tage.',
          'Gold Allianzrang 2-3: Mitgliederrang 1-10 erhält Kriegsmaschine 14 Tage und Legionskommandant 30 Tage; 11-30 erhält Kriegsmaschine 7 Tage und Legionskommandant 14 Tage; 31-100 erhält Kriegsmaschine 3 Tage und Legionskommandant 14 Tage.',
          'Gold Allianzrang 4-16: Mitgliederrang 1-10 erhält Kriegsmaschine 7 Tage und Legionskommandant 14 Tage; 11-30 und 31-100 erhalten Kriegsmaschine 3 Tage und Legionskommandant 7 Tage.',
          'Diamant Allianzrang 1: Alle Mitgliederränge erhalten Kriegsmaschine 30 Tage und Unübertroffen 30 Tage.',
          'Diamant Allianzrang 2-3: Mitgliederrang 1-10 erhält Kriegsmaschine 30 Tage und Unübertroffen 30 Tage; 11-30 erhält Kriegsmaschine 14 Tage und Unübertroffen 14 Tage; 31-100 erhält Kriegsmaschine 7 Tage und Unübertroffen 14 Tage.',
          'Diamant Allianzrang 4-16: Mitgliederrang 1-10 erhält Kriegsmaschine 14 Tage und Unübertroffen 14 Tage; 11-30 und 31-100 erhalten Kriegsmaschine 7 Tage und Unübertroffen 7 Tage.',
          'Zusätzliche Liga-Items: Umschmiedehammer zum Ändern der sekundären Ausrüstungswerte, 500 Allianzsilber für Gegenstände im Allianz-Shop und Vorratskiste (100.000) mit Nahrung, Holz, Metall oder Benzin.'
        ]
      },
      weeklyResult: {
        en: [
          'The result screen shows both alliances, the remaining event timer, alliance points, MVP, weekly score, date, theme, score, MVP, and winner.',
          'Weekly example: Day 1 Radar Training = 1 point, Day 2 Base Construction = 2 points, Day 3 Technology Research = 2 points, Day 4 Hero Development = 2 points, Day 5 Battle Preparation = 2 points, Day 6 Defeat Enemies = 4 points.',
          'The winner column marks the alliance that won each day. In the example, the same alliance won all visible daily rows.'
        ],
        de: [
          'Der Ergebnisbildschirm zeigt beide Allianzen, den verbleibenden Eventtimer, Allianzpunkte, MVP, wöchentlichen Punktestand, Datum, Thema, Punktestand, MVP und Gewinner.',
          'Wochenbeispiel: Tag 1 Radar-Training = 1 Punkt, Tag 2 Basisbau = 2 Punkte, Tag 3 Technologieforschung = 2 Punkte, Tag 4 Helden-Entwicklung = 2 Punkte, Tag 5 Schlachtvorbereitung = 2 Punkte, Tag 6 Gegner besiegen = 4 Punkte.',
          'Die Gewinner-Spalte zeigt, welche Allianz den jeweiligen Tag gewonnen hat. Im Beispiel gewinnt dieselbe Allianz alle sichtbaren Tageszeilen.'
        ]
      },
      goals: { en: ['Match spending and speedups to the daily theme', 'Coordinate alliance participation across all event days', 'Save resources before the correct day starts'], de: ['Ausgaben und Speedups an das Tages-Thema anpassen', 'Allianz-Teilnahme über alle Eventtage koordinieren', 'Ressourcen vor dem passenden Tag sparen'] },
      strategy: { en: 'Use the detailed daily theme list above as the spending calendar. Save items before the correct day, then push together when your alliance calls for points.', de: 'Nutze die detaillierte Tagesthemen-Liste oben als Ausgaben-Kalender. Spare Items bis zum passenden Tag und pushe dann gemeinsam, wenn deine Allianz Punkte ansagt.' },
      requirements: {
            "en": [
                  "Power Plant level 10",
                  "Alliance with at least 10 members",
                  "Enough saved resources for the current daily theme"
            ],
            "de": [
                  "Kraftwerkslevel 10",
                  "Allianz mit mindestens 10 Mitgliedern",
                  "Genug gesparte Ressourcen für das aktuelle Tagesthema"
            ]
      },
      neededItems: {
            "en": [
                  "Use the daily theme list above to decide which items are needed on each day",
                  "Common scoring items: stamina, spy missions, construction speedups, research speedups, recruitment items, hero fragments, troop training, dispatch, healing speedups, and combat resources",
                  "Shields, healing speedups, and combat readiness for Defeat Enemies day"
            ],
            "de": [
                  "Nutze die Tagesthemen-Liste oben, um zu entscheiden, welche Items an welchem Tag gebraucht werden",
                  "Häufige Punkte-Items: Ausdauer, Spionagemissionen, Bau-Speedups, Forschungs-Speedups, Rekrutierung, Heldenfragmente, Truppentraining, Entsendung, Heilungs-Speedups und Kampfressourcen",
                  "Schilde, Heilungs-Speedups und Kampfbereitschaft für Gegner-besiegen-Tag"
            ]
      },
      preparation: {
            "en": [
                  "Stop spending one or two days before the event if possible",
                  "Tell alliance members which day is which theme",
                  "Pre-build, pre-research, and pre-train so completions can be claimed on the right day"
            ],
            "de": [
                  "Wenn möglich ein bis zwei Tage vorher nicht mehr unnoetig ausgeben",
                  "In der Allianz klar ansagen, welcher Tag welches Thema hat",
                  "Bauen, Forschen und Training vorbereiten, damit Abschlüsse am richtigen Tag geclaimt werden"
            ]
      },
      walkthrough: {
            "en": [
                  "Check participation rules first",
                  "Open the current daily theme",
                  "Compare your saved items with the point values in the detailed daily theme list",
                  "Spend only during the matching day",
                  "Claim milestone, daily ranking, and alliance rewards when available"
            ],
            "de": [
                  "Prüfe zuerst die Teilnahmebedingungen",
                  "Öffne das aktuelle Tagesthema",
                  "Vergleiche deine gesparten Items mit den Punktwerten in der detaillierten Tagesthemen-Liste",
                  "Gib Items nur am passenden Tag aus",
                  "Hole Meilenstein-, Tagesrang- und Allianzbelohnungen ab, sobald sie verfügbar sind"
            ]
      },
      watchouts: {
            "en": [
                  "Do not finish big upgrades on the wrong day",
                  "Kill Event can cost troops if healing capacity and shields are ignored",
                  "Alliance ranking depends on many members scoring, not only one spender"
            ],
            "de": [
                  "Große Upgrades nicht am falschen Tag abschließen",
                  "Kill Event kann Truppen kosten, wenn Heilkapazitaet und Schilde ignoriert werden",
                  "Allianzrang hängt von vielen aktiven Mitgliedern ab, nicht nur von einem starken Spieler"
            ]
      },
      sourceLinks: [
        {
          title: {
            en: 'Alliance Duel VS in-game reference',
            de: 'Allianzduell VS Ingame-Referenz',
          },
          url: '#player-screenshots-alliance-duel-vs',
          note: {
            en: 'Includes daily themes, exact point values for days 1-6, participation rules, raids, victory rules, milestone chests, daily ranking rewards, alliance rewards, league rewards, titles, and item names.',
            de: 'Enthält Tagesthemen, exakte Punktwerte für Tag 1-6, Teilnahmebedingungen, Überfälle, Siegregeln, Meilensteintruhen, tägliche Rangbelohnungen, Allianzbelohnungen, Ligabelohnungen, Titel und Item-Namen.',
          },
          screenshots: [
            { src: '/screenshots/alliance-duel-vs/day-1.png', title: { en: 'Day 1 daily theme', de: 'Tag 1 Tagesthema' }, description: { en: 'Tasks and point values for stamina, spy missions, equipment patches, pack diamonds, and resource gathering.', de: 'Aufgaben und Punktwerte für Ausdauer, Spionagemissionen, Ausrüstungsfetzen, Paket-Diamanten und Ressourcensammeln.' } },
            { src: '/screenshots/alliance-duel-vs/day-2.png', title: { en: 'Day 2 daily theme', de: 'Tag 2 Tagesthema' }, description: { en: 'Building and dispatch day: construction speedups, building power, class A trucks, difficult dispatch tasks, and pack diamonds.', de: 'Bau- und Entsendungstag: Bau-Speedups, Baukraft, LKW Klasse A, schwierige Entsendungsaufgaben und Paket-Diamanten.' } },
            { src: '/screenshots/alliance-duel-vs/day-3.png', title: { en: 'Day 3 daily theme', de: 'Tag 3 Tagesthema' }, description: { en: 'Research and monster progress day with research speedups, research power, battle medals, spy missions, monster EXP, and monster cells.', de: 'Forschungs- und Ungeheuer-Tag mit Forschungs-Speedups, Forschungskraft, Kampfmedaillen, Spionagemissionen, Ungeheuer-EP und Ungeheuer-Zellen.' } },
            { src: '/screenshots/alliance-duel-vs/day-4.png', title: { en: 'Day 4 daily theme', de: 'Tag 4 Tagesthema' }, description: { en: 'Hero development day: recruitment attempts, hero fragments, hero skill books, and pack diamonds give points.', de: 'Helden-Entwicklungstag: Rekrutierungen, Heldenfragmente, Heldenfähigkeiten-Bücher und Paket-Diamanten geben Punkte.' } },
            { src: '/screenshots/alliance-duel-vs/day-5.png', title: { en: 'Day 5 daily theme', de: 'Tag 5 Tagesthema' }, description: { en: 'Mixed growth day with spy missions, construction, research, training speedups, and troop training by troop level.', de: 'Gemischter Wachstumstag mit Spionagemissionen, Bau, Forschung, Trainings-Speedups und Truppentraining nach Truppenlevel.' } },
            { src: '/screenshots/alliance-duel-vs/day-6.png', title: { en: 'Day 6 daily theme', de: 'Tag 6 Tagesthema' }, description: { en: 'Final battle-focused day with sandworm eggs, dispatch tasks, speedups, healing accelerators, and defeated enemy troops.', de: 'Letzter kampflastiger Tag mit Sandwurm-Eiern, Entsendungen, Speedups, Heilungsbeschleunigern und besiegten gegnerischen Truppen.' } },
            { src: '/screenshots/alliance-duel-vs/guide-themes.png', title: { en: 'Alliance Duel guide - themes', de: 'Allianzduell-Anleitung - Themen' }, description: { en: 'In-game explanation that a new theme starts every day and theme tasks unlock personal milestone rewards.', de: 'Ingame-Erklärung: Jeden Tag startet ein neues Thema, und Themenaufgaben schalten persönliche Meilensteinbelohnungen frei.' } },
            { src: '/screenshots/alliance-duel-vs/guide-raids.png', title: { en: 'Alliance Duel guide - raids', de: 'Allianzduell-Anleitung - Überfälle' }, description: { en: 'Shows how raids become available during the defeat-enemies theme and that players move near the enemy alliance to attack.', de: 'Zeigt, dass Überfälle beim Thema Gegner besiegen verfügbar werden und man nah an die gegnerische Allianz ziehen muss.' } },
            { src: '/screenshots/alliance-duel-vs/guide-victory.png', title: { en: 'Alliance Duel guide - victory', de: 'Allianzduell-Anleitung - Sieg' }, description: { en: 'Explains that the alliance with the higher score wins and that top members receive extra rank-based rewards.', de: 'Erklärt, dass die Allianz mit höherer Punktzahl gewinnt und Top-Mitglieder zusätzliche Rangbelohnungen erhalten.' } },
            { src: '/screenshots/alliance-duel-vs/guide-rules-1.png', title: { en: 'Alliance Duel rules 1', de: 'Allianzduell-Regeln 1' }, description: { en: 'Participation requirements: base power level 10, at least 10 members, and top 32 alliances joining weekly matchmaking.', de: 'Teilnahmebedingungen: Kraftwerkslevel 10, mindestens 10 Mitglieder und die 32 besten Allianzen nehmen am Wochenmatchmaking teil.' } },
            { src: '/screenshots/alliance-duel-vs/guide-rules-2.png', title: { en: 'Alliance Duel rules 2', de: 'Allianzduell-Regeln 2' }, description: { en: 'Rules for the weekly duel, daily themes, daily scores, alliance score comparison, and alliance switching during the event.', de: 'Regeln zum Wochenduell, täglichen Themen, Tagespunkten, Allianzvergleich und Allianzwechsel während des Events.' } },
            { src: '/screenshots/alliance-duel-vs/guide-rules-3.png', title: { en: 'Alliance Duel rules 3', de: 'Allianzduell-Regeln 3' }, description: { en: 'Small rule note: only purchases that include diamonds count toward the point tasks.', de: 'Kleine Regelnotiz: Nur Käufe mit Edelsteinen zählen für die Punkteaufgaben.' } },
            { src: '/screenshots/alliance-duel-vs/daily-ranking-silver.png', title: { en: 'Daily ranking rewards - Silver', de: 'Tägliche Rangbelohnungen - Silber' }, description: { en: 'Silver league daily ranking table for ranks 1, 2, 3, 4-10, and 11-30.', de: 'Tägliche Rangbelohnungen der Silber-Liga für Rang 1, 2, 3, 4-10 und 11-30.' } },
            { src: '/screenshots/alliance-duel-vs/daily-ranking-gold.png', title: { en: 'Daily ranking rewards - Gold', de: 'Tägliche Rangbelohnungen - Gold' }, description: { en: 'Gold league daily ranking table with higher gem and equipment patch amounts.', de: 'Tägliche Rangbelohnungen der Gold-Liga mit höheren Edelstein- und Ausrüstungsfetzen-Mengen.' } },
            { src: '/screenshots/alliance-duel-vs/daily-ranking-diamond.png', title: { en: 'Daily ranking rewards - Diamond', de: 'Tägliche Rangbelohnungen - Diamant' }, description: { en: 'Diamond league daily ranking table for the strongest daily placement rewards.', de: 'Tägliche Rangbelohnungen der Diamant-Liga für die stärksten Tagesplatzierungen.' } },
            { src: '/screenshots/alliance-duel-vs/alliance-rewards-silver.png', title: { en: 'Alliance rewards - Silver', de: 'Allianzbelohnungen - Silber' }, description: { en: 'Silver alliance rewards with daily participation rewards and weekly victory or defeat rewards.', de: 'Silber-Allianzbelohnungen mit täglichen Teilnahmebelohnungen und wöchentlichen Sieg- oder Niederlagenbelohnungen.' } },
            { src: '/screenshots/alliance-duel-vs/alliance-rewards-gold.png', title: { en: 'Alliance rewards - Gold', de: 'Allianzbelohnungen - Gold' }, description: { en: 'Gold alliance rewards with the required daily and weekly point thresholds.', de: 'Gold-Allianzbelohnungen mit den nötigen täglichen und wöchentlichen Punkteschwellen.' } },
            { src: '/screenshots/alliance-duel-vs/alliance-rewards-diamond.png', title: { en: 'Alliance rewards - Diamond', de: 'Allianzbelohnungen - Diamant' }, description: { en: 'Diamond alliance rewards with the highest listed participation and weekly reward amounts.', de: 'Diamant-Allianzbelohnungen mit den höchsten gelisteten Teilnahme- und Wochenbelohnungen.' } },
            { src: '/screenshots/alliance-duel-vs/league-silver-rank-1.png', title: { en: 'League rewards - Silver alliance rank 1', de: 'Ligabelohnungen - Silber Allianzrang 1' }, description: { en: 'Silver league member ranking rewards for alliance rank 1, including temporary march skin and title durations.', de: 'Silber-Ligabelohnungen für Allianzrang 1 mit Mitgliederrängen und Laufzeiten für Marschskin und Titel.' } },
            { src: '/screenshots/alliance-duel-vs/league-silver-rank-2-3.png', title: { en: 'League rewards - Silver alliance rank 2-3', de: 'Ligabelohnungen - Silber Allianzrang 2-3' }, description: { en: 'Silver league member ranking rewards for alliance ranks 2-3.', de: 'Silber-Ligabelohnungen für Allianzrang 2-3.' } },
            { src: '/screenshots/alliance-duel-vs/league-silver-rank-4-16.png', title: { en: 'League rewards - Silver alliance rank 4-16', de: 'Ligabelohnungen - Silber Allianzrang 4-16' }, description: { en: 'Silver league member ranking rewards for alliance ranks 4-16.', de: 'Silber-Ligabelohnungen für Allianzrang 4-16.' } },
            { src: '/screenshots/alliance-duel-vs/league-gold-rank-1.png', title: { en: 'League rewards - Gold alliance rank 1', de: 'Ligabelohnungen - Gold Allianzrang 1' }, description: { en: 'Gold league member ranking rewards for alliance rank 1.', de: 'Gold-Ligabelohnungen für Allianzrang 1.' } },
            { src: '/screenshots/alliance-duel-vs/league-gold-rank-2-3.png', title: { en: 'League rewards - Gold alliance rank 2-3', de: 'Ligabelohnungen - Gold Allianzrang 2-3' }, description: { en: 'Gold league member ranking rewards for alliance ranks 2-3.', de: 'Gold-Ligabelohnungen für Allianzrang 2-3.' } },
            { src: '/screenshots/alliance-duel-vs/league-gold-rank-4-16.png', title: { en: 'League rewards - Gold alliance rank 4-16', de: 'Ligabelohnungen - Gold Allianzrang 4-16' }, description: { en: 'Gold league member ranking rewards for alliance ranks 4-16.', de: 'Gold-Ligabelohnungen für Allianzrang 4-16.' } },
            { src: '/screenshots/alliance-duel-vs/league-diamond-rank-1.png', title: { en: 'League rewards - Diamond alliance rank 1', de: 'Ligabelohnungen - Diamant Allianzrang 1' }, description: { en: 'Diamond league member ranking rewards for alliance rank 1.', de: 'Diamant-Ligabelohnungen für Allianzrang 1.' } },
            { src: '/screenshots/alliance-duel-vs/league-diamond-rank-2-3.png', title: { en: 'League rewards - Diamond alliance rank 2-3', de: 'Ligabelohnungen - Diamant Allianzrang 2-3' }, description: { en: 'Diamond league member ranking rewards for alliance ranks 2-3.', de: 'Diamant-Ligabelohnungen für Allianzrang 2-3.' } },
            { src: '/screenshots/alliance-duel-vs/league-diamond-rank-4-16.png', title: { en: 'League rewards - Diamond alliance rank 4-16', de: 'Ligabelohnungen - Diamant Allianzrang 4-16' }, description: { en: 'Diamond league member ranking rewards for alliance ranks 4-16.', de: 'Diamant-Ligabelohnungen für Allianzrang 4-16.' } },
            { src: '/screenshots/alliance-duel-vs/weekly-result.png', title: { en: 'Weekly result overview', de: 'Wochenergebnis' }, description: { en: 'Weekly result overview with daily themes, daily score, MVP column, winner column, and anonymized alliance details.', de: 'Wochenergebnis mit Tagesthemen, Tagespunktestand, MVP-Spalte, Gewinner-Spalte und anonymisierten Allianzdetails.' } },
            { src: '/screenshots/alliance-duel-vs/march-skin-war-machine.png', title: { en: 'March skin - Kriegsmaschine', de: 'Marschskin - Kriegsmaschine' }, description: { en: 'Temporary march skin with march speed against infected +3%.', de: 'Zeitlich begrenzter Marschskin mit Marschtempo gegen Infizierte +3 %.' } },
            { src: '/screenshots/alliance-duel-vs/title-silver-kampfvorhut.png', title: { en: 'Silver title - Kampfvorhut', de: 'Silber-Titel - Kampfvorhut' }, description: { en: 'Silver league title reward.', de: 'Titelbelohnung der Silber-Liga.' } },
            { src: '/screenshots/alliance-duel-vs/title-gold-legionskommandant.png', title: { en: 'Gold title - Legionskommandant', de: 'Gold-Titel - Legionskommandant' }, description: { en: 'Gold league title reward.', de: 'Titelbelohnung der Gold-Liga.' } },
            { src: '/screenshots/alliance-duel-vs/title-diamond-unuebertroffen.png', title: { en: 'Diamond title - Unübertroffen', de: 'Diamant-Titel - Unübertroffen' }, description: { en: 'Diamond league title reward.', de: 'Titelbelohnung der Diamant-Liga.' } },
            { src: '/screenshots/alliance-duel-vs/item-legendary-hero-fragment.png', title: { en: 'Legendary Hero Fragment tooltip', de: 'Legendäres Heldenfragment Tooltip' }, description: { en: 'Item tooltip for legendary hero fragments and where the item can be obtained.', de: 'Item-Tooltip für legendäre Heldenfragmente und wo dieses Item erhältlich ist.' } },
            { src: '/screenshots/alliance-duel-vs/item-battle-medal.png', title: { en: 'Battle Medal tooltip', de: 'Kampfmedaille Tooltip' }, description: { en: 'Item tooltip explaining that battle medals are used for advanced settlement technology research and come from Alliance Duel.', de: 'Item-Tooltip: Kampfmedaillen werden für fortgeschrittene Siedlungstechnologie genutzt und kommen aus dem Allianzduell.' } },
            { src: '/screenshots/alliance-duel-vs/item-gems.png', title: { en: 'Gems tooltip', de: 'Edelstein Tooltip' }, description: { en: 'Tooltip for gems, the premium currency shown in ranking and alliance rewards.', de: 'Tooltip für Edelsteine, die Premiumwährung aus Rang- und Allianzbelohnungen.' } },
            { src: '/screenshots/alliance-duel-vs/item-equipment-patch.png', title: { en: 'Equipment Patch tooltip', de: 'Ausrüstungsfetzen Tooltip' }, description: { en: 'Tooltip explaining that equipment patches add 100 EXP when improving hero equipment.', de: 'Tooltip: Ausrüstungsfetzen geben 100 EP beim Verbessern von Heldenausrüstung.' } },
            { src: '/screenshots/alliance-duel-vs/item-reforge-hammer.png', title: { en: 'Reforge Hammer tooltip', de: 'Umschmiedehammer Tooltip' }, description: { en: 'Used to change secondary equipment stats.', de: 'Wird verwendet, um sekundäre Ausrüstungswerte zu ändern.' } },
            { src: '/screenshots/alliance-duel-vs/item-alliance-silver.png', title: { en: 'Alliance Silver tooltip', de: 'Allianzsilber Tooltip' }, description: { en: 'Currency for buying items in the alliance shop.', de: 'Währung zum Abholen von Gegenständen im Allianz-Shop.' } },
            { src: '/screenshots/alliance-duel-vs/item-supply-crate-100k.png', title: { en: 'Supply crate tooltip', de: 'Vorratskiste Tooltip' }, description: { en: 'Contains 100,000 units of food, wood, metal, or fuel.', de: 'Enthält 100.000 Einheiten Nahrung, Holz, Metall oder Benzin.' } },
            { src: '/screenshots/alliance-duel-vs/item-wood.png', title: { en: '10,000 Wood tooltip', de: '10.000 Holz Tooltip' }, description: { en: 'Resource item tooltip showing that it grants 10,000 wood to the settlement.', de: 'Ressourcen-Tooltip: Gewährt deiner Siedlung 10.000 Holz.' } },
            { src: '/screenshots/alliance-duel-vs/item-food.png', title: { en: '10,000 Food tooltip', de: '10.000 Nahrung Tooltip' }, description: { en: 'Resource item tooltip showing that it grants 10,000 food to the settlement.', de: 'Ressourcen-Tooltip: Gewährt deiner Siedlung 10.000 Nahrung.' } },
            { src: '/screenshots/alliance-duel-vs/item-metal.png', title: { en: '10,000 Metal tooltip', de: '10.000 Metall Tooltip' }, description: { en: 'Resource item tooltip showing that it grants 10,000 metal to the settlement.', de: 'Ressourcen-Tooltip: Gewährt deiner Siedlung 10.000 Metall.' } },
            { src: '/screenshots/alliance-duel-vs/item-fuel.png', title: { en: '10,000 Fuel tooltip', de: '10.000 Benzin Tooltip' }, description: { en: 'Resource item tooltip showing that it grants 10,000 fuel to the settlement.', de: 'Ressourcen-Tooltip: Gewährt deiner Siedlung 10.000 Benzin.' } },
            { src: '/screenshots/alliance-duel-vs/item-hero-exp.png', title: { en: '10,000 Hero EXP tooltip', de: '10.000 Helden-EP Tooltip' }, description: { en: 'Hero EXP item tooltip showing that it grants 10,000 hero EXP and can come from packs or exploration.', de: 'Helden-EP-Tooltip: Gewährt 10.000 Helden-EP und ist über Pakete oder Erkunden erhältlich.' } },
          ],
        },
        {
          title: {
            en: 'LDShop Alliance Event Guide - Alliance Duel VS',
            de: 'LDShop Allianz-Event-Guide - Allianzduell VS',
          },
          url: 'https://www.ldshop.gg/blog/tiles-survive/alliance-event.html',
          note: {
            en: 'Lists Alliance Duel VS in the alliance event calendar and describes the six-day schedule.',
            de: 'Listet Alliance Duel VS im Allianz-Event-Kalender und beschreibt den sechstägigen Ablauf.',
          },
        },
      ],
      sourceNote: eventSourceNote,
    },
  },
  {
    id: 'event-turbo-turtle',
    type: 'event',
    slug: 'turbo-turtle',
    route: '/events/turbo-turtle',
    status: 'researched',
    ownerId: 'system',
    updatedAt: '2026-07-26',
    featured: true,
    title: { en: 'Turbo Turtle', de: 'Turbo-Schildkröte' },
    summary: { en: 'A recurring growth event tied to gear progression, gear scraps, and upgrade speedups.', de: 'Ein wiederkehrendes Growth-Event rund um Gear-Fortschritt, Gear Scraps und Upgrade-Speedups.' },
    tags: ['events', 'gear', 'growth', 'speedups'],
    details: {
      beginnerBasics: {
        en: 'Turbo Turtle is a gear-growth event. You get value when you upgrade gear while the event tasks are active. For beginners, the rule is simple: gear materials are precious, so do not spend them on quiet days if Turbo Turtle is coming.',
        de: 'Turbo-Schildkröte ist ein Gear-Wachstumsevent. Du bekommst Wert, wenn du Gear verbesserst, während die Eventaufgaben aktiv sind. Für Anfänger ist die Regel einfach: Gear-Material ist wertvoll, also nicht an ruhigen Tagen ausgeben, wenn Turbo-Schildkröte bald kommt.'
      },
      beginnerSteps: {
        en: [
          'Open Turbo Turtle and read the active task stage.',
          'Check which gear material gives points.',
          'Upgrade only the requested gear or material type.',
          'Claim every milestone you reach.',
          'Save leftover materials for the next round.'
        ],
        de: [
          'Öffne Turbo-Schildkröte und lies die aktive Aufgabenstufe.',
          'Prüfe, welches Gear-Material Punkte gibt.',
          'Verbessere nur das Gear oder Material, das die Aufgabe verlangt.',
          'Hole jeden erreichten Meilenstein ab.',
          'Spare übrige Materialien für die nächste Runde.'
        ]
      },
      beginnerSpendPlan: {
        en: [
          'Do not spend rare items immediately when the event appears.',
          'First read the task list and check which action gives points today.',
          'Spend only enough to reach the next good milestone unless your alliance has a coordinated push.',
          'Stop when the next reward costs more than it is worth for your account.'
        ],
        de: [
          'Gib seltene Items nicht sofort aus, nur weil das Event erscheint.',
          'Lies zuerst die Aufgabenliste und prüfe, welche Aktion heute wirklich Punkte gibt.',
          'Gib nur so viel aus, bis du den nächsten guten Meilenstein erreichst, außer deine Allianz macht einen gemeinsamen Push.',
          'Stoppe, wenn die nächste Belohnung mehr kostet, als sie deinem Account bringt.'
        ]
      },
      beginnerMistakes: {
        en: [
          'Upgrading gear before opening the event page.',
          'Spending all gear scraps for a small reward.',
          'Missing task stages and scoring fewer points than expected.'
        ],
        de: [
          'Gear verbessern, bevor du die Eventseite geöffnet hast.',
          'Alle Gear Scraps für eine kleine Belohnung ausgeben.',
          'Aufgabenstufen übersehen und weniger Punkte bekommen als erwartet.'
        ]
      },
      goals: { en: ['Upgrade gear during the event window', 'Spend gear materials only when tasks score points'], de: ['Gear während des Eventfensters verbessern', 'Gear-Material nur ausgeben, wenn Aufgaben Punkte geben'] },
      rewards: { en: ['Gear progression rewards', 'Milestone rewards', 'Growth materials'], de: ['Gear-Fortschrittsbelohnungen', 'Meilensteinbelohnungen', 'Growth-Materialien'] },
      strategy: { en: 'Stockpile gear scraps and gear speedups during quiet days. Use them during Turbo Turtle, especially when it overlaps with other growth events.', de: 'Gear Scraps und Gear-Speedups an ruhigen Tagen sparen. In Turbo Turtle einsetzen, besonders wenn es sich mit anderen Growth-Events überschneidet.' },
      requirements: {
            "en": [
                  "Access to gear upgrades and event tasks",
                  "Saved gear materials before the event opens"
            ],
            "de": [
                  "Zugang zu Gear-Upgrades und Eventaufgaben",
                  "Gesparte Gear-Materialien vor Eventstart"
            ]
      },
      neededItems: {
            "en": [
                  "Gear scraps",
                  "Gear upgrade materials",
                  "Gear or universal speedups where accepted by tasks"
            ],
            "de": [
                  "Gear Scraps",
                  "Gear-Upgrade-Materialien",
                  "Gear- oder Universal-Speedups, wenn sie in den Aufgaben zählen"
            ]
      },
      preparation: {
            "en": [
                  "Hold gear upgrades until Turbo Turtle is active",
                  "Check the current task stage before spending",
                  "Pair with other growth events when the calendar overlaps"
            ],
            "de": [
                  "Gear-Upgrades bis zum aktiven Turbo-Turtle-Fenster aufheben",
                  "Vor dem Ausgeben die aktuelle Aufgabenstufe prüfen",
                  "Mit anderen Growth-Events kombinieren, wenn sich der Kalender überschneidet"
            ]
      },
      walkthrough: {
            "en": [
                  "Open the event task page",
                  "Spend only the material type requested by the active stage",
                  "Claim milestones before the event ends"
            ],
            "de": [
                  "Event-Aufgabenseite öffnen",
                  "Nur den Materialtyp ausgeben, den die aktive Stufe verlangt",
                  "Meilensteine vor Eventende abholen"
            ]
      },
      watchouts: {
            "en": [
                  "Patch notes mention optimized point handling during task stages, so always check which stage is currently active",
                  "Do not burn rare gear items for low milestones if the next round is close"
            ],
            "de": [
                  "Patchnotes nennen optimiertes Punktehandling während Aufgabenstufen, also immer aktive Stufe prüfen",
                  "Seltene Gear-Items nicht für niedrige Meilensteine verbrennen, wenn die naechste Runde bald kommt"
            ]
      },
      exactRewards: {
            "en": [
                  "Gear progression rewards",
                  "Milestone chests",
                  "Growth materials"
            ],
            "de": [
                  "Gear-Fortschrittsbelohnungen",
                  "Meilensteintruhen",
                  "Growth-Materialien"
            ]
      },
      sourceLinks: [
        {
          title: {
            en: 'Official v2.5.300 Patch Notes - Turbo Turtle',
            de: 'Offizielle v2.5.300 Patchnotes - Turbo Turtle',
          },
          url: 'https://tilesurvivegame.com/en/blog/1008',
          note: {
            en: 'Mentions Turbo Turtle event optimization and task-stage point handling.',
            de: 'Nennt Turbo-Turtle-Event-Optimierung und Punkte während Task-Stages.',
          },
        },
        {
          title: {
            en: 'LDShop Alliance Event Guide - Mid-Week Growth Events',
            de: 'LDShop Allianz-Event-Guide - Mid-Week Growth Events',
          },
          url: 'https://www.ldshop.gg/blog/tiles-survive/alliance-event.html',
          note: {
            en: 'Places Turbo Turtle with Power Play as mid-week growth events.',
            de: 'Führt Turbo Turtle zusammen mit Power Play als Mid-Week-Growth-Events.',
          },
        },
      ],
      sourceNote: eventSourceNote,
    },
  },
  {
    id: 'event-power-play',
    type: 'event',
    slug: 'power-play',
    route: '/events/power-play',
    status: 'researched',
    ownerId: 'system',
    updatedAt: '2026-07-26',
    featured: true,
    title: { en: 'Power Play', de: 'Machtspiel' },
    summary: { en: 'A construction and power-growth event where building speedups and Power Plant timing matter most.', de: 'Ein Bau- und Power-Growth-Event, bei dem Bau-Speedups und Power-Plant-Timing besonders wichtig sind.' },
    tags: ['events', 'buildings', 'power-plant', 'speedups'],
    details: {
      beginnerBasics: {
        en: 'Power Play rewards account power growth, mainly from buildings and power-related upgrades. Beginners should use it to finish upgrades they already needed anyway, not to start random upgrades only because an event is active.',
        de: 'Machtspiel belohnt Machtzuwachs, vor allem durch Gebäude und Power-bezogene Upgrades. Anfänger sollten damit Upgrades abschließen, die sie sowieso brauchen, nicht zufällig irgendetwas starten, nur weil ein Event aktiv ist.'
      },
      beginnerSteps: {
        en: [
          'Before spending, check which upgrades give points.',
          'Choose one important building or Power Plant upgrade.',
          'Make sure you have resources to finish it.',
          'Use speedups until the next milestone is reached.',
          'Stop and save the rest if the next milestone is too expensive.'
        ],
        de: [
          'Prüfe vor dem Ausgeben, welche Upgrades Punkte geben.',
          'Wähle ein wichtiges Gebäude oder Power-Plant-Upgrade.',
          'Stelle sicher, dass du genug Ressourcen zum Abschließen hast.',
          'Nutze Speedups bis zum nächsten Meilenstein.',
          'Stoppe und spare den Rest, wenn der nächste Meilenstein zu teuer ist.'
        ]
      },
      beginnerSpendPlan: {
        en: [
          'Do not spend rare items immediately when the event appears.',
          'First read the task list and check which action gives points today.',
          'Spend only enough to reach the next good milestone unless your alliance has a coordinated push.',
          'Stop when the next reward costs more than it is worth for your account.'
        ],
        de: [
          'Gib seltene Items nicht sofort aus, nur weil das Event erscheint.',
          'Lies zuerst die Aufgabenliste und prüfe, welche Aktion heute wirklich Punkte gibt.',
          'Gib nur so viel aus, bis du den nächsten guten Meilenstein erreichst, außer deine Allianz macht einen gemeinsamen Push.',
          'Stoppe, wenn die nächste Belohnung mehr kostet, als sie deinem Account bringt.'
        ]
      },
      beginnerMistakes: {
        en: [
          'Finishing upgrades before the event starts.',
          'Starting upgrades without enough resources to complete them.',
          'Using every speedup for a reward that is not worth it.'
        ],
        de: [
          'Upgrades vor Eventstart abschließen.',
          'Upgrades starten, ohne genug Ressourcen für den Abschluss zu haben.',
          'Alle Speedups für eine Belohnung ausgeben, die es nicht wert ist.'
        ]
      },
      goals: { en: ['Time major building upgrades', 'Use construction speedups during point windows', 'Avoid finishing upgrades before the event starts'], de: ['Große Gebäude-Upgrades passend timen', 'Bau-Speedups in Punktefenstern nutzen', 'Upgrades nicht vor Eventstart abschließen'] },
      rewards: { en: ['Construction milestones', 'Speedups', 'Growth resources'], de: ['Bau-Meilensteine', 'Speedups', 'Growth-Ressourcen'] },
      strategy: { en: 'Queue upgrades before the event if needed, but claim or finish them when Power Play is active. Power Plant upgrades are usually the highest-impact timing target.', de: 'Upgrades bei Bedarf vorbereiten, aber erst abschließen oder claimen, wenn Power Play aktiv ist. Power-Plant-Upgrades sind meist das wichtigste Timing-Ziel.' },
      requirements: {
            "en": [
                  "Upgradeable buildings, especially high-value power upgrades",
                  "Construction queue timing before the event starts"
            ],
            "de": [
                  "Aufwertbare Gebäude, besonders starke Power-Upgrades",
                  "Bauwarteschlangen-Timing vor Eventstart"
            ]
      },
      neededItems: {
            "en": [
                  "Construction speedups",
                  "Resources for major buildings",
                  "Power Plant materials if your event tasks include them"
            ],
            "de": [
                  "Bau-Speedups",
                  "Ressourcen für große Gebäude",
                  "Power-Plant-Materialien, wenn deine Eventaufgaben sie verlangen"
            ]
      },
      preparation: {
            "en": [
                  "Start long upgrades early and finish them during the event",
                  "Save instant completions for point windows"
            ],
            "de": [
                  "Lange Upgrades vorher starten und im Event abschließen",
                  "Sofortabschlüsse für Punktefenster sparen"
            ]
      },
      walkthrough: {
            "en": [
                  "Check which upgrades give points",
                  "Finish high-power buildings first",
                  "Use speedups only until the next valuable milestone is reached"
            ],
            "de": [
                  "Prüfen, welche Upgrades Punkte geben",
                  "Zuerst Gebäude mit hoher Power abschließen",
                  "Speedups nur bis zum naechsten sinnvollen Meilenstein einsetzen"
            ]
      },
      watchouts: {
            "en": [
                  "Finished before event start usually means lost points",
                  "Resource shortages can block the best building day"
            ],
            "de": [
                  "Vor Eventstart fertig bedeutet meistens verlorene Punkte",
                  "Ressourcenmangel kann den besten Bautag blockieren"
            ]
      },
      exactRewards: {
            "en": [
                  "Construction milestones",
                  "Speedups",
                  "Growth resources"
            ],
            "de": [
                  "Bau-Meilensteine",
                  "Speedups",
                  "Growth-Ressourcen"
            ]
      },
      sourceLinks: [
        {
          title: {
            en: 'LDShop Alliance Event Guide - Power Play',
            de: 'LDShop Allianz-Event-Guide - Power Play',
          },
          url: 'https://www.ldshop.gg/blog/tiles-survive/alliance-event.html',
          note: {
            en: 'Names Power Play in the event calendar and describes it as a Power Plant management event.',
            de: 'Nennt Power Play im Eventkalender und beschreibt es als Power-Plant-Management-Event.',
          },
        },
      ],
      sourceNote: eventSourceNote,
    },
  },
  {
    id: 'event-arcadian-conquest',
    type: 'event',
    slug: 'arcadian-conquest',
    route: '/events/arcadian-conquest',
    status: 'researched',
    ownerId: 'system',
    updatedAt: '2026-07-26',
    featured: true,
    title: { en: 'Arcadian Conquest', de: 'Arkadianische Eroberung' },
    summary: { en: 'A major alliance siege event around Arcadia occupation, towers, relocation timing, personal points, and Governor rewards.', de: 'Ein großes Allianz-Siege-Event rund um Arcadia-Besetzung, Türme, Relocation-Timing, persönliche Punkte und Governor-Belohnungen.' },
    tags: ['events', 'alliance', 'pvp', 'arcadia', 'governor'],
    details: {
      beginnerBasics: {
        en: 'Arcadian Conquest is a large alliance war event. The goal is not just killing enemies; your alliance must occupy Arcadia or important towers and hold them. Beginners are useful when they follow calls, reinforce buildings, heal troops, and do not teleport randomly.',
        de: 'Arkadianische Eroberung ist ein großes Allianz-Kriegsevent. Es geht nicht nur darum, Gegner zu töten; deine Allianz muss Arcadia oder wichtige Türme besetzen und halten. Anfänger helfen, wenn sie Ansagen befolgen, Gebäude verstärken, Truppen heilen und nicht zufällig teleportieren.'
      },
      beginnerSteps: {
        en: [
          'Ask your alliance where beginners should stand.',
          'Teleport only when leaders give the location.',
          'Send troops to reinforce assigned buildings or towers.',
          'Do not attack strong players alone.',
          'Heal wounded troops in waves and keep following alliance calls.',
          'After the battle, claim personal and alliance rewards.'
        ],
        de: [
          'Frag deine Allianz, wo Anfänger stehen sollen.',
          'Teleportiere nur, wenn Leader den Ort ansagen.',
          'Schicke Truppen zur Verstärkung der zugewiesenen Gebäude oder Türme.',
          'Greife starke Spieler nicht allein an.',
          'Heile verwundete Truppen in Wellen und befolge weiter die Allianzansagen.',
          'Hole nach dem Kampf persönliche und Allianzbelohnungen ab.'
        ]
      },
      beginnerSpendPlan: {
        en: [
          'Spend healing speedups only when you can keep fighting or your alliance asks for it.',
          'Use march speedups only for important buildings or time-critical reinforcements.',
          'Do not waste combat buffs if you are offline or only scouting.',
          'Save teleports unless your alliance gives a clear target area.'
        ],
        de: [
          'Gib Heil-Speedups nur aus, wenn du weiterkämpfen kannst oder deine Allianz es ansagt.',
          'Nutze Marsch-Speedups nur für wichtige Gebäude oder zeitkritische Verstärkungen.',
          'Verschwende Kampf-Buffs nicht, wenn du offline bist oder nur scoutest.',
          'Spare Teleports, bis deine Allianz ein klares Zielgebiet ansagt.'
        ]
      },
      beginnerMistakes: {
        en: [
          'Teleporting into enemy territory alone.',
          'Attacking the biggest enemy player solo.',
          'Forgetting to heal and losing all usable troops early.',
          'Ignoring towers and only chasing kills.'
        ],
        de: [
          'Allein ins Gegnergebiet teleportieren.',
          'Den stärksten Gegner allein angreifen.',
          'Heilung vergessen und früh keine nutzbaren Truppen mehr haben.',
          'Türme ignorieren und nur Kills jagen.'
        ]
      },
      goals: { en: ['Occupy Arcadia or key towers', 'Keep alliance presence active through the battle phase', 'Earn personal points through occupation and combat'], de: ['Arcadia oder wichtige Türme besetzen', 'Allianz-Präsenz durch die Kampfphase halten', 'Persönliche Punkte durch Besetzung und Kampf sammeln'] },
      rewards: { en: ['Governor privileges', 'Personal point rewards', 'Alliance prestige and buffs'], de: ['Governor-Vorteile', 'Persönliche Punktebelohnungen', 'Allianz-Prestige und Buffs'] },
      strategy: { en: 'Plan relocation before the battle starts, split squads for attack and defense, and coordinate rallies. Smaller alliances can still score by repeated attacks and tower play.', de: 'Relocation vor Kampfbeginn planen, Teams für Angriff und Verteidigung aufteilen und Rallys koordinieren. Kleinere Allianzen können über wiederholte Angriffe und Turmspiel punkten.' },
      requirements: {
            "en": [
                  "Alliance participation",
                  "Online time during the three-hour siege",
                  "Relocators or event relocation access",
                  "Enough troops and hospital capacity"
            ],
            "de": [
                  "Allianzteilnahme",
                  "Onlinezeit während der dreistuendigen Belagerung",
                  "Teleport-Items oder Event-Teleportzugang",
                  "Genug Truppen und Krankenhauskapazitaet"
            ]
      },
      neededItems: {
            "en": [
                  "Relocators",
                  "Healing speedups",
                  "Combat buffs",
                  "March speedups",
                  "Troops for attacks and reinforcements"
            ],
            "de": [
                  "Teleport-Items",
                  "Heilungs-Speedups",
                  "Kampf-Buffs",
                  "Marsch-Speedups",
                  "Truppen für Angriffe und Verstaerkungen"
            ]
      },
      preparation: {
            "en": [
                  "Agree on rally leaders and tower targets",
                  "Move during the free relocation window",
                  "Set battle teams and healing queues before the fight starts"
            ],
            "de": [
                  "Rally-Leader und Turmziele vorher festlegen",
                  "Im freien Teleportfenster versetzen",
                  "Kampfteams und Heilungswarteschlangen vor Start vorbereiten"
            ]
      },
      walkthrough: {
            "en": [
                  "Relocate near Arcadia or assigned towers",
                  "Occupy Arcadia, towers, or attack enemies for points",
                  "Win by occupying Arcadia for 1.5 hours or by longest total occupation when time ends",
                  "Claim personal and alliance rewards after the battle"
            ],
            "de": [
                  "In die Naehe von Arcadia oder zugewiesenen Türmen teleportieren",
                  "Arcadia oder Türme besetzen oder Gegner für Punkte angreifen",
                  "Gewinnen durch 1,5 Stunden Arcadia-Besetzung oder laengste Gesamtbesetzung bei Ablauf",
                  "Persönliche und Allianzbelohnungen danach abholen"
            ]
      },
      watchouts: {
            "en": [
                  "Peace Flares are not the answer inside the active fight zone",
                  "The official guide lists 10,000 occupation points per 60 seconds",
                  "Towers can remove 2 percent of stationed troops per attack and fire faster over time"
            ],
            "de": [
                  "Friedensschilde loesen das Problem in der aktiven Kampfzone nicht",
                  "Der offizielle Guide nennt 10.000 Besetzungspunkte pro 60 Sekunden",
                  "Türme können pro Angriff 2 Prozent stationierter Truppen entfernen und mit der Zeit schneller feuern"
            ]
      },
      exactRewards: {
            "en": [
                  "Governor skills",
                  "Title assignment rights",
                  "Governor packs",
                  "Governor skins",
                  "Personal and alliance rank rewards"
            ],
            "de": [
                  "Governor-Skills",
                  "Titelvergabe-Rechte",
                  "Governor-Pakete",
                  "Governor-Skins",
                  "Persönliche und Allianz-Rangbelohnungen"
            ]
      },
      sourceLinks: [
        {
          title: {
            en: 'Official Arcadian Conquest Strategy Guide',
            de: 'Offizieller Arcadian-Conquest-Strategieguide',
          },
          url: 'https://tilesurvivegame.com/en/blog/828',
          note: {
            en: 'Official guide explains Arcadian Conquest, Arcadia occupation, tower mechanics, Governor rewards, and point scoring.',
            de: 'Offizieller Guide erklärt Arcadian Conquest, Arcadia-Besetzung, Turmmechaniken, Governor-Belohnungen und Punktewertung.',
          },
        },
      ],
      sourceNote: eventSourceNote,
    },
  },
  {
    id: 'event-reservoir-raid',
    type: 'event',
    slug: 'reservoir-raid',
    route: '/events/reservoir-raid',
    status: 'researched',
    ownerId: 'system',
    updatedAt: '2026-07-26',
    featured: true,
    title: { en: 'Reservoir Raid', de: 'Reservoir-Raid' },
    summary: { en: 'An instanced alliance-vs-alliance map where holding water structures and fast movement can matter more than raw power.', de: 'Eine instanzierte Allianz-gegen-Allianz-Karte, bei der Wasserstrukturen und schnelle Bewegung oft wichtiger sind als reine Power.' },
    tags: ['events', 'alliance', 'gvg', 'reservoir', 'map-control'],
    details: {
      beginnerBasics: {
        en: 'Reservoir Raid is an alliance map-control battle. Your alliance scores by controlling water structures and fighting around them. Beginners should focus on being online, entering on time, reinforcing targets, and not wasting troops in random fights.',
        de: 'Reservoir-Raid ist ein Allianz-Kampf um Kartenkontrolle. Deine Allianz punktet, indem sie Wasserstrukturen kontrolliert und darum kämpft. Anfänger sollten vor allem pünktlich online sein, rechtzeitig eintreten, Ziele verstärken und Truppen nicht in zufälligen Kämpfen verschwenden.'
      },
      beginnerSteps: {
        en: [
          'Join when the event opens.',
          'Look for alliance markers or chat calls.',
          'Send troops to structures your alliance wants to hold.',
          'If your team is weak, reinforce instead of starting solo fights.',
          'Heal when needed and return to the fight.',
          'Claim rewards after the result is posted.'
        ],
        de: [
          'Tritt bei, wenn das Event startet.',
          'Achte auf Allianzmarker oder Chatansagen.',
          'Schicke Truppen zu Strukturen, die deine Allianz halten will.',
          'Wenn dein Team schwach ist, verstärke lieber, statt Solo-Kämpfe zu starten.',
          'Heile bei Bedarf und kehre zurück.',
          'Hole Belohnungen ab, sobald das Ergebnis da ist.'
        ]
      },
      beginnerSpendPlan: {
        en: [
          'Use healing speedups only if you will keep participating.',
          'Use march speedups to reach key structures, not random enemies.',
          'Save combat buffs for coordinated pushes.'
        ],
        de: [
          'Nutze Heil-Speedups nur, wenn du weiter teilnimmst.',
          'Nutze Marsch-Speedups für wichtige Strukturen, nicht für zufällige Gegner.',
          'Spare Kampf-Buffs für koordinierte Pushes.'
        ]
      },
      beginnerMistakes: {
        en: [
          'Entering late without telling the alliance.',
          'Fighting away from objectives.',
          'Leaving buildings empty after capturing them.',
          'Spending healing speedups after the battle is already lost.'
        ],
        de: [
          'Zu spät eintreten, ohne der Allianz Bescheid zu geben.',
          'Weit weg von Zielen kämpfen.',
          'Gebäude nach der Einnahme leer lassen.',
          'Heil-Speedups ausgeben, obwohl der Kampf schon verloren ist.'
        ]
      },
      goals: { en: ['Capture and hold reservoirs or purifiers', 'Use teleports and fast marches for map control', 'Score individual and alliance contribution'], de: ['Reservoirs oder Purifier einnehmen und halten', 'Teleports und schnelle Märsche für Kartenkontrolle nutzen', 'Individuelle und Allianz-Beiträge punkten'] },
      rewards: { en: ['Special shop currency', 'Badges', 'Solo milestone rewards'], de: ['Spezielle Shop-Währung', 'Badges', 'Solo-Meilensteinbelohnungen'] },
      strategy: { en: 'Send fast teams to side objectives early, block enemy routes with smart teleport placement, and keep healing speedups ready for heavy troop cycles.', de: 'Schnelle Teams früh zu Seitenzielen schicken, Gegnerwege mit gutem Teleport-Placement blocken und Heil-Speedups für starke Truppenzyklen bereithalten.' },
      requirements: {
            "en": [
                  "Alliance registration and enough online players",
                  "Prepared PvP teams and healing capacity"
            ],
            "de": [
                  "Allianzregistrierung und genug Spieler online",
                  "Vorbereitete PvP-Teams und Heilkapazitaet"
            ]
      },
      neededItems: {
            "en": [
                  "Healing speedups",
                  "March speedups",
                  "Combat buffs",
                  "Relocation items if the event rules allow them"
            ],
            "de": [
                  "Heilungs-Speedups",
                  "Marsch-Speedups",
                  "Kampf-Buffs",
                  "Teleport-Items, falls die Eventregeln sie erlauben"
            ]
      },
      preparation: {
            "en": [
                  "Assign teams to reservoir, purifier, and reinforcement jobs",
                  "Decide rally leaders before queue pressure starts"
            ],
            "de": [
                  "Teams für Reservoir, Purifier und Verstaerkung einteilen",
                  "Rally-Leader vor dem Start festlegen"
            ]
      },
      walkthrough: {
            "en": [
                  "Enter at event start",
                  "Capture important water points",
                  "Reinforce occupied buildings",
                  "Rotate wounded teams and keep scoring until the timer ends"
            ],
            "de": [
                  "Zum Start eintreten",
                  "Wichtige Wasserpunkte einnehmen",
                  "Besetzte Gebäude verst?rken",
                  "Verwundete Teams rotieren und bis Timerende weiter punkten"
            ]
      },
      watchouts: {
            "en": [
                  "Rewards and special currency have been adjusted in patch notes, so check the current shop before spending",
                  "Late entry often means losing building control early"
            ],
            "de": [
                  "Belohnungen und Spezialw?hrung wurden laut Patchnotes angepasst, also aktuellen Shop vor Ausgaben prüfen",
                  "Später Einstieg bedeutet oft frühen Kontrollverlust"
            ]
      },
      exactRewards: {
            "en": [
                  "Reservoir Raid rewards",
                  "Special shop currency where active",
                  "Alliance and personal rewards"
            ],
            "de": [
                  "Reservoir-Raid-Belohnungen",
                  "Spezialshop-Währung, wenn aktiv",
                  "Allianz- und persönliche Belohnungen"
            ]
      },
      sourceLinks: [
        {
          title: {
            en: 'LDShop Alliance Event Guide - Reservoir Raid',
            de: 'LDShop Allianz-Event-Guide - Reservoir Raid',
          },
          url: 'https://www.ldshop.gg/blog/tiles-survive/alliance-event.html',
          note: {
            en: 'Lists Reservoir Raid and describes reservoir/purifier map control.',
            de: 'Listet Reservoir Raid und beschreibt Kartenkontrolle über Reservoirs/Purifier.',
          },
        },
        {
          title: {
            en: 'Official v2.5.500 Patch Notes - Reservoir Raid rewards',
            de: 'Offizielle v2.5.500 Patchnotes - Reservoir-Raid-Belohnungen',
          },
          url: 'https://tilesurvivegame.com/en/blog/1047',
          note: {
            en: 'Mentions Reservoir Raid solo milestone reward changes.',
            de: 'Nennt Änderungen an Reservoir-Raid-Solo-Meilensteinbelohnungen.',
          },
        },
      ],
      sourceNote: eventSourceNote,
    },
  },
  {
    id: 'event-reservoir-glory-clash',
    type: 'event',
    slug: 'reservoir-glory-clash',
    route: '/events/reservoir-glory-clash',
    status: 'researched',
    ownerId: 'system',
    updatedAt: '2026-07-26',
    featured: false,
    title: { en: 'Reservoir: Glory Clash', de: 'Reservoir: Ruhmeskonflikt' },
    summary: { en: 'A Reservoir Raid tier and ranking layer with promotion, demotion, and star-rating rules between phases.', de: 'Eine Reservoir-Raid-Rang- und Tier-Ebene mit Aufstieg, Abstieg und Star-Rating-Regeln zwischen Phasen.' },
    tags: ['events', 'reservoir', 'glory-clash', 'ranking'],
    details: {
      beginnerBasics: {
        en: 'Reservoir: Glory Clash is a more competitive Reservoir-style event. The basic idea is still objective control, but mistakes hurt more because ranking and coordination matter.',
        de: 'Reservoir: Ruhmeskonflikt ist eine wettbewerbsstärkere Reservoir-Variante. Die Grundidee bleibt Objektivkontrolle, aber Fehler tun mehr weh, weil Ranking und Koordination wichtiger sind.'
      },
      beginnerSteps: {
        en: [
          'Confirm whether your alliance is registered.',
          'Be online before the battle window.',
          'Follow assigned roles: reinforce, scout, attack, or hold.',
          'Prioritize objectives over random kills.',
          'Review result mail so the next round goes better.'
        ],
        de: [
          'Prüfe, ob deine Allianz registriert ist.',
          'Sei vor dem Kampffenster online.',
          'Befolge deine Rolle: verstärken, scouten, angreifen oder halten.',
          'Ziele sind wichtiger als zufällige Kills.',
          'Lies die Ergebnis-Mail, damit die nächste Runde besser wird.'
        ]
      },
      beginnerSpendPlan: {
        en: [
          'Do not spend rare items immediately when the event appears.',
          'First read the task list and check which action gives points today.',
          'Spend only enough to reach the next good milestone unless your alliance has a coordinated push.',
          'Stop when the next reward costs more than it is worth for your account.'
        ],
        de: [
          'Gib seltene Items nicht sofort aus, nur weil das Event erscheint.',
          'Lies zuerst die Aufgabenliste und prüfe, welche Aktion heute wirklich Punkte gibt.',
          'Gib nur so viel aus, bis du den nächsten guten Meilenstein erreichst, außer deine Allianz macht einen gemeinsamen Push.',
          'Stoppe, wenn die nächste Belohnung mehr kostet, als sie deinem Account bringt.'
        ]
      },
      beginnerMistakes: {
        en: [
          'Treating it like normal Reservoir Raid with no preparation.',
          'Ignoring bracket or league rules.',
          'Using all boosts before the real fight starts.'
        ],
        de: [
          'Es wie normalen Reservoir-Raid ohne Vorbereitung behandeln.',
          'Bracket- oder Liga-Regeln ignorieren.',
          'Alle Boosts verbrauchen, bevor der echte Kampf startet.'
        ]
      },
      goals: { en: ['Climb or hold Glory Clash tier', 'Maintain stars between phases', 'Coordinate alliance performance over multiple rounds'], de: ['Glory-Clash-Tier steigen oder halten', 'Stars zwischen Phasen sichern', 'Allianzleistung über mehrere Runden koordinieren'] },
      rewards: { en: ['Tier-based rewards', 'Improved Reservoir progression'], de: ['Tier-basierte Belohnungen', 'Besserer Reservoir-Fortschritt'] },
      strategy: { en: 'Treat it as a season layer, not a single fight. Stable attendance and organized Reservoir Raid execution matter more than one burst round.', de: 'Als Saison-Ebene betrachten, nicht als einzelnen Kampf. Stabile Teilnahme und organisierte Reservoir-Raid-Ausführung sind wichtiger als eine einzelne Burst-Runde.' },
      requirements: {
            "en": [
                  "Eligible alliance participation",
                  "Teams strong enough for coordinated reservoir combat"
            ],
            "de": [
                  "Berechtigte Allianzteilnahme",
                  "Teams stark genug für koordinierten Reservoir-Kampf"
            ]
      },
      neededItems: {
            "en": [
                  "Healing speedups",
                  "March speedups",
                  "Combat buffs",
                  "Prepared troop presets"
            ],
            "de": [
                  "Heilungs-Speedups",
                  "Marsch-Speedups",
                  "Kampf-Buffs",
                  "Vorbereitete Truppenpresets"
            ]
      },
      preparation: {
            "en": [
                  "Treat it as a higher-stakes Reservoir variant",
                  "Check league or bracket rules before the battle"
            ],
            "de": [
                  "Als wichtigere Reservoir-Variante behandeln",
                  "Liga- oder Bracket-Regeln vor dem Kampf prüfen"
            ]
      },
      walkthrough: {
            "en": [
                  "Register if required",
                  "Join during the battle window",
                  "Play objective control first and kills second",
                  "Claim rewards after results are mailed or posted"
            ],
            "de": [
                  "Falls noetig registrieren",
                  "Im Kampffenster beitreten",
                  "Zuerst Objektivkontrolle, danach Kills spielen",
                  "Belohnungen nach Ergebnis-Mail oder Anzeige abholen"
            ]
      },
      watchouts: {
            "en": [
                  "Do not treat it like a solo kill event",
                  "Objective control usually matters more than random fighting"
            ],
            "de": [
                  "Nicht wie ein Solo-Kill-Event spielen",
                  "Objektivkontrolle ist meist wichtiger als zufällige K?mpfe"
            ]
      },
      exactRewards: {
            "en": [
                  "Glory Clash ranking rewards",
                  "Personal battle rewards",
                  "Alliance result rewards"
            ],
            "de": [
                  "Glory-Clash-Rangbelohnungen",
                  "Persönliche Kampfbelohnungen",
                  "Allianz-Ergebnisbelohnungen"
            ]
      },
      sourceLinks: [
        {
          title: {
            en: 'Official v2.5.200 Patch Notes - Reservoir: Glory Clash',
            de: 'Offizielle v2.5.200 Patchnotes - Reservoir: Glory Clash',
          },
          url: 'https://tilesurvivegame.com/en/blog/975',
          note: {
            en: 'Mentions Reservoir: Glory Clash and star-rating reset rules.',
            de: 'Nennt Reservoir: Glory Clash und Star-Rating-Reset-Regeln.',
          },
        },
      ],
      sourceNote: eventSourceNote,
    },
  },
  {
    id: 'event-oil-clash',
    type: 'event',
    slug: 'oil-clash',
    route: '/events/oil-clash',
    status: 'researched',
    ownerId: 'system',
    updatedAt: '2026-07-26',
    featured: true,
    title: { en: 'Oil Clash', de: 'Öl-Konflikt' },
    summary: { en: 'A seasonal faction and alliance competition around territory occupation, rally timing, and coordinated combat output.', de: 'Ein saisonaler Fraktions- und Allianz-Wettkampf rund um Gebietskontrolle, Rally-Timing und koordinierte Kampfkraft.' },
    tags: ['events', 'clash', 'alliance', 'territory', 'season'],
    details: {
      beginnerBasics: {
        en: 'Oil Clash is a clash event about occupying event buildings and holding territory. Beginners should not think of it as a solo fight. Your alliance scores better when people move together, reinforce the right places, and use resources during the active scoring window.',
        de: 'Öl-Konflikt ist ein Konflikt-Event rund um Eventgebäude und Gebietskontrolle. Anfänger sollten es nicht als Solo-Kampf sehen. Deine Allianz punktet besser, wenn Spieler zusammen laufen, richtige Orte verstärken und Ressourcen im aktiven Punktefenster einsetzen.'
      },
      beginnerSteps: {
        en: [
          'Open the event and check the map or objective list.',
          'Move with your alliance toward oil objectives.',
          'Reinforce strong players instead of standing alone.',
          'Read battle logs after fights to understand losses.',
          'Claim ranking and Deepsea Crude related rewards after results.'
        ],
        de: [
          'Öffne das Event und prüfe Karte oder Zielliste.',
          'Bewege dich mit deiner Allianz zu Öl-Ziele.',
          'Verstärke starke Spieler, statt allein zu stehen.',
          'Lies Kampfberichte nach Kämpfen, um Verluste zu verstehen.',
          'Hole Ranking- und Deepsea Crude-Belohnungen nach dem Ergebnis ab.'
        ]
      },
      beginnerSpendPlan: {
        en: [
          'Do not spend rare items immediately when the event appears.',
          'First read the task list and check which action gives points today.',
          'Spend only enough to reach the next good milestone unless your alliance has a coordinated push.',
          'Stop when the next reward costs more than it is worth for your account.'
        ],
        de: [
          'Gib seltene Items nicht sofort aus, nur weil das Event erscheint.',
          'Lies zuerst die Aufgabenliste und prüfe, welche Aktion heute wirklich Punkte gibt.',
          'Gib nur so viel aus, bis du den nächsten guten Meilenstein erreichst, außer deine Allianz macht einen gemeinsamen Push.',
          'Stoppe, wenn die nächste Belohnung mehr kostet, als sie deinem Account bringt.'
        ]
      },
      beginnerMistakes: {
        en: [
          'Leaving your alliance before clash events.',
          'Running into occupied buildings alone.',
          'Ignoring result mails and repeating the same mistake next round.'
        ],
        de: [
          'Vor Konflikt-Events die Allianz wechseln.',
          'Allein in besetzte Gebäude laufen.',
          'Ergebnis-Mails ignorieren und denselben Fehler nächste Runde wiederholen.'
        ]
      },
      goals: { en: ['Occupy event buildings', 'Coordinate rally and troop training windows', 'Maximize alliance and solo ranking'], de: ['Event-Gebäude besetzen', 'Rally- und Truppentrainingsfenster koordinieren', 'Allianz- und Solo-Rang maximieren'] },
      rewards: { en: ['Deepsea Crude', 'Alliance and solo ranking rewards', 'Territory rewards'], de: ['Deepsea Crude', 'Allianz- und Solo-Rangbelohnungen', 'Gebietsbelohnungen'] },
      strategy: { en: 'Do not switch alliances casually before Clash events. Coordinate troop training, combat buffs, and rallies around active occupation windows.', de: 'Vor Clash-Events nicht leichtfertig die Allianz wechseln. Truppentraining, Kampfbuffs und Rallys um aktive Besetzungsfenster koordinieren.' },
      requirements: {
            "en": [
                  "Alliance or state participation depending on server rules",
                  "Teams ready for territory occupation and PvP"
            ],
            "de": [
                  "Allianz- oder State-Teilnahme je nach Serverregeln",
                  "Teams für Gebietskontrolle und PvP bereit"
            ]
      },
      neededItems: {
            "en": [
                  "Healing and march speedups",
                  "Combat buffs",
                  "Troops for holding territory"
            ],
            "de": [
                  "Heilungs- und Marsch-Speedups",
                  "Kampf-Buffs",
                  "Truppen zum Halten von Gebiet"
            ]
      },
      preparation: {
            "en": [
                  "Scout the event map and set occupation priorities",
                  "Save PvP boosts for the scoring window"
            ],
            "de": [
                  "Eventkarte prüfen und Besetzungsziele festlegen",
                  "PvP-Boosts für das Punktefenster sparen"
            ]
      },
      walkthrough: {
            "en": [
                  "Enter the clash area",
                  "Occupy oil objectives",
                  "Defend alliance holdings",
                  "Read battle logs and result mail after the round"
            ],
            "de": [
                  "Clash-Gebiet betreten",
                  "Oil-Ziele besetzen",
                  "Allianzbesitz verteidigen",
                  "Kampfberichte und Ergebnis-Mail nach der Runde lesen"
            ]
      },
      watchouts: {
            "en": [
                  "Patch notes mention improved result mails and battle logs, so use them to learn what went wrong",
                  "Do not leave weak troops sitting in contested objectives"
            ],
            "de": [
                  "Patchnotes nennen verbesserte Ergebnis-Mails und Kampfberichte, also daraus lernen",
                  "Schwache Truppen nicht in umkaempften Zielen stehen lassen"
            ]
      },
      exactRewards: {
            "en": [
                  "Deepsea Crude related rewards",
                  "Clash ranking rewards",
                  "Alliance result rewards"
            ],
            "de": [
                  "Belohnungen rund um Deepsea Crude",
                  "Clash-Rangbelohnungen",
                  "Allianz-Ergebnisbelohnungen"
            ]
      },
      sourceLinks: [
        {
          title: {
            en: 'Official v2.5.300 Patch Notes - Oil Clash ranking',
            de: 'Offizielle v2.5.300 Patchnotes - Oil-Clash-Ranking',
          },
          url: 'https://tilesurvivegame.com/en/blog/1008',
          note: {
            en: 'Mentions Oil Clash ranking rules together with Gene Clash and Copper Clash.',
            de: 'Nennt Oil-Clash-Ranking-Regeln zusammen mit Gene Clash und Copper Clash.',
          },
        },
        {
          title: {
            en: 'Official v2.5.200 Patch Notes - Oil Clash resources',
            de: 'Offizielle v2.5.200 Patchnotes - Oil-Clash-Ressourcen',
          },
          url: 'https://tilesurvivegame.com/en/blog/975',
          note: {
            en: 'Mentions Oil Clash and Deepsea Crude from occupied buildings.',
            de: 'Nennt Oil Clash und Deepsea Crude aus besetzten Gebäuden.',
          },
        },
      ],
      sourceNote: eventSourceNote,
    },
  },
  {
    id: 'event-gene-clash',
    type: 'event',
    slug: 'gene-clash',
    route: '/events/gene-clash',
    status: 'researched',
    ownerId: 'system',
    updatedAt: '2026-07-26',
    featured: false,
    title: { en: 'Gene Clash', de: 'Gen-Konflikt' },
    summary: { en: 'A Clash-family alliance event with territory occupation, ranking mails, battle logs, and Dragon DNA rewards in current patch notes.', de: 'Ein Clash-Familien-Allianz-Event mit Gebietskontrolle, Rang-Mails, Battle Logs und Dragon-DNA-Belohnungen laut aktuellen Patchnotes.' },
    tags: ['events', 'clash', 'alliance', 'territory'],
    details: {
      beginnerBasics: {
        en: 'Gene Clash is a clash event about occupying event buildings and holding territory. Beginners should not think of it as a solo fight. Your alliance scores better when people move together, reinforce the right places, and use resources during the active scoring window.',
        de: 'Gen-Konflikt ist ein Konflikt-Event rund um Eventgebäude und Gebietskontrolle. Anfänger sollten es nicht als Solo-Kampf sehen. Deine Allianz punktet besser, wenn Spieler zusammen laufen, richtige Orte verstärken und Ressourcen im aktiven Punktefenster einsetzen.'
      },
      beginnerSteps: {
        en: [
          'Open the event and check the map or objective list.',
          'Move with your alliance toward gene objectives.',
          'Reinforce strong players instead of standing alone.',
          'Read battle logs after fights to understand losses.',
          'Claim ranking and Dragon DNA related rewards after results.'
        ],
        de: [
          'Öffne das Event und prüfe Karte oder Zielliste.',
          'Bewege dich mit deiner Allianz zu Gen-Ziele.',
          'Verstärke starke Spieler, statt allein zu stehen.',
          'Lies Kampfberichte nach Kämpfen, um Verluste zu verstehen.',
          'Hole Ranking- und Dragon DNA-Belohnungen nach dem Ergebnis ab.'
        ]
      },
      beginnerSpendPlan: {
        en: [
          'Do not spend rare items immediately when the event appears.',
          'First read the task list and check which action gives points today.',
          'Spend only enough to reach the next good milestone unless your alliance has a coordinated push.',
          'Stop when the next reward costs more than it is worth for your account.'
        ],
        de: [
          'Gib seltene Items nicht sofort aus, nur weil das Event erscheint.',
          'Lies zuerst die Aufgabenliste und prüfe, welche Aktion heute wirklich Punkte gibt.',
          'Gib nur so viel aus, bis du den nächsten guten Meilenstein erreichst, außer deine Allianz macht einen gemeinsamen Push.',
          'Stoppe, wenn die nächste Belohnung mehr kostet, als sie deinem Account bringt.'
        ]
      },
      beginnerMistakes: {
        en: [
          'Leaving your alliance before clash events.',
          'Running into occupied buildings alone.',
          'Ignoring result mails and repeating the same mistake next round.'
        ],
        de: [
          'Vor Konflikt-Events die Allianz wechseln.',
          'Allein in besetzte Gebäude laufen.',
          'Ergebnis-Mails ignorieren und denselben Fehler nächste Runde wiederholen.'
        ]
      },
      goals: { en: ['Occupy event buildings', 'Score alliance territory points', 'Track battle logs and result mails'], de: ['Event-Gebäude besetzen', 'Allianz-Gebietspunkte erzielen', 'Battle Logs und Ergebnis-Mails prüfen'] },
      rewards: { en: ['Dragon DNA', 'Alliance and solo result rewards'], de: ['Dragon DNA', 'Allianz- und Solo-Ergebnisbelohnungen'] },
      strategy: { en: 'Use the same planning discipline as Oil Clash: stay in your alliance, coordinate markers, and keep active members ready for occupation windows.', de: 'Wie bei Oil Clash planen: in der Allianz bleiben, Marker koordinieren und aktive Mitglieder für Besetzungsfenster bereithalten.' },
      requirements: {
            "en": [
                  "Unlocked clash participation",
                  "Teams prepared for PvP and occupation"
            ],
            "de": [
                  "Freigeschaltete Clash-Teilnahme",
                  "Teams für PvP und Besetzung vorbereitet"
            ]
      },
      neededItems: {
            "en": [
                  "Healing speedups",
                  "March speedups",
                  "Combat buffs",
                  "Troop reserves"
            ],
            "de": [
                  "Heilungs-Speedups",
                  "Marsch-Speedups",
                  "Kampf-Buffs",
                  "Truppenreserven"
            ]
      },
      preparation: {
            "en": [
                  "Coordinate targets with the alliance",
                  "Prepare to hold objectives instead of only chasing kills"
            ],
            "de": [
                  "Ziele mit der Allianz abstimmen",
                  "Auf Objektivhalten vorbereiten statt nur Kills zu jagen"
            ]
      },
      walkthrough: {
            "en": [
                  "Join during the clash window",
                  "Take gene objectives",
                  "Reinforce strong holders",
                  "Claim mail and ranking rewards after results"
            ],
            "de": [
                  "Im Clash-Fenster beitreten",
                  "Gene-Ziele einnehmen",
                  "Starke Halter verst?rken",
                  "Mail- und Rangbelohnungen nach Ergebnis abholen"
            ]
      },
      watchouts: {
            "en": [
                  "Battle logs matter for improving next round assignments",
                  "Overextending without reinforcements loses objectives quickly"
            ],
            "de": [
                  "Kampfberichte sind wichtig für bessere Einteilung in der naechsten Runde",
                  "Zu weit ohne Verstaerkung vorzugehen verliert Ziele schnell"
            ]
      },
      exactRewards: {
            "en": [
                  "Dragon DNA related rewards",
                  "Clash ranking rewards",
                  "Alliance result rewards"
            ],
            "de": [
                  "Belohnungen rund um Dragon DNA",
                  "Clash-Rangbelohnungen",
                  "Allianz-Ergebnisbelohnungen"
            ]
      },
      sourceLinks: [
        {
          title: {
            en: 'Official v2.5.500 Patch Notes - Gene Clash result mail and battle log',
            de: 'Offizielle v2.5.500 Patchnotes - Gene-Clash-Ergebnismails und Battle Logs',
          },
          url: 'https://tilesurvivegame.com/en/blog/1047',
          note: {
            en: 'Mentions Gene Clash in result mail and territory battle log updates.',
            de: 'Nennt Gene Clash bei Ergebnis-Mail- und Territory-Battle-Log-Updates.',
          },
        },
        {
          title: {
            en: 'Official v2.5.200 Patch Notes - Gene Clash resources',
            de: 'Offizielle v2.5.200 Patchnotes - Gene-Clash-Ressourcen',
          },
          url: 'https://tilesurvivegame.com/en/blog/975',
          note: {
            en: 'Mentions Gene Clash and Dragon DNA from occupied buildings.',
            de: 'Nennt Gene Clash und Dragon DNA aus besetzten Gebäuden.',
          },
        },
      ],
      sourceNote: eventSourceNote,
    },
  },
  {
    id: 'event-copper-clash',
    type: 'event',
    slug: 'copper-clash',
    route: '/events/copper-clash',
    status: 'researched',
    ownerId: 'system',
    updatedAt: '2026-07-26',
    featured: false,
    title: { en: 'Copper Clash', de: 'Kupfer-Konflikt' },
    summary: { en: 'A Clash-family alliance event connected to territory occupation, ranking logic, and Red Copper rewards.', de: 'Ein Clash-Familien-Allianz-Event mit Gebietskontrolle, Ranking-Logik und Red-Copper-Belohnungen.' },
    tags: ['events', 'clash', 'alliance', 'territory'],
    details: {
      beginnerBasics: {
        en: 'Copper Clash is a clash event about occupying event buildings and holding territory. Beginners should not think of it as a solo fight. Your alliance scores better when people move together, reinforce the right places, and use resources during the active scoring window.',
        de: 'Kupfer-Konflikt ist ein Konflikt-Event rund um Eventgebäude und Gebietskontrolle. Anfänger sollten es nicht als Solo-Kampf sehen. Deine Allianz punktet besser, wenn Spieler zusammen laufen, richtige Orte verstärken und Ressourcen im aktiven Punktefenster einsetzen.'
      },
      beginnerSteps: {
        en: [
          'Open the event and check the map or objective list.',
          'Move with your alliance toward copper objectives.',
          'Reinforce strong players instead of standing alone.',
          'Read battle logs after fights to understand losses.',
          'Claim ranking and Red Copper related rewards after results.'
        ],
        de: [
          'Öffne das Event und prüfe Karte oder Zielliste.',
          'Bewege dich mit deiner Allianz zu Kupfer-Ziele.',
          'Verstärke starke Spieler, statt allein zu stehen.',
          'Lies Kampfberichte nach Kämpfen, um Verluste zu verstehen.',
          'Hole Ranking- und Red Copper-Belohnungen nach dem Ergebnis ab.'
        ]
      },
      beginnerSpendPlan: {
        en: [
          'Do not spend rare items immediately when the event appears.',
          'First read the task list and check which action gives points today.',
          'Spend only enough to reach the next good milestone unless your alliance has a coordinated push.',
          'Stop when the next reward costs more than it is worth for your account.'
        ],
        de: [
          'Gib seltene Items nicht sofort aus, nur weil das Event erscheint.',
          'Lies zuerst die Aufgabenliste und prüfe, welche Aktion heute wirklich Punkte gibt.',
          'Gib nur so viel aus, bis du den nächsten guten Meilenstein erreichst, außer deine Allianz macht einen gemeinsamen Push.',
          'Stoppe, wenn die nächste Belohnung mehr kostet, als sie deinem Account bringt.'
        ]
      },
      beginnerMistakes: {
        en: [
          'Leaving your alliance before clash events.',
          'Running into occupied buildings alone.',
          'Ignoring result mails and repeating the same mistake next round.'
        ],
        de: [
          'Vor Konflikt-Events die Allianz wechseln.',
          'Allein in besetzte Gebäude laufen.',
          'Ergebnis-Mails ignorieren und denselben Fehler nächste Runde wiederholen.'
        ]
      },
      goals: { en: ['Hold territory buildings', 'Raise alliance placement', 'Use markers and battle logs for coordination'], de: ['Gebietsgebäude halten', 'Allianzplatzierung verbessern', 'Marker und Battle Logs zur Koordination nutzen'] },
      rewards: { en: ['Red Copper', 'Alliance and solo ranking rewards'], de: ['Red Copper', 'Allianz- und Solo-Rangbelohnungen'] },
      strategy: { en: 'Prioritize attendance and clean map calls. Higher-ranked alliances gain more event resource from occupied buildings in current patch notes.', de: 'Teilnahme und klare Kartenansagen priorisieren. Höher platzierte Allianzen erhalten laut aktuellen Patchnotes mehr Event-Ressourcen aus besetzten Gebäuden.' },
      requirements: {
            "en": [
                  "Unlocked clash participation",
                  "Occupation-capable teams"
            ],
            "de": [
                  "Freigeschaltete Clash-Teilnahme",
                  "Teams, die Ziele halten können"
            ]
      },
      neededItems: {
            "en": [
                  "Healing and march speedups",
                  "Combat buffs",
                  "Troops for defense and rallies"
            ],
            "de": [
                  "Heilungs- und Marsch-Speedups",
                  "Kampf-Buffs",
                  "Truppen für Verteidigung und Rallys"
            ]
      },
      preparation: {
            "en": [
                  "Mark high-value copper objectives",
                  "Assign defense and attack groups"
            ],
            "de": [
                  "Wichtige Copper-Ziele markieren",
                  "Verteidigungs- und Angriffsgruppen einteilen"
            ]
      },
      walkthrough: {
            "en": [
                  "Enter the clash",
                  "Capture copper points",
                  "Rotate weakened teams",
                  "Review results and battle logs"
            ],
            "de": [
                  "Clash betreten",
                  "Copper-Punkte einnehmen",
                  "Geschwaechte Teams rotieren",
                  "Ergebnisse und Kampfberichte prüfen"
            ]
      },
      watchouts: {
            "en": [
                  "Random solo attacks rarely beat coordinated occupation",
                  "Do not spend all healing early if the event has several waves"
            ],
            "de": [
                  "Zufaellige Soloangriffe schlagen selten koordinierte Besetzung",
                  "Heilung nicht komplett früh verbrauchen, falls das Event mehrere Wellen hat"
            ]
      },
      exactRewards: {
            "en": [
                  "Red Copper related rewards",
                  "Clash ranking rewards",
                  "Alliance result rewards"
            ],
            "de": [
                  "Belohnungen rund um Red Copper",
                  "Clash-Rangbelohnungen",
                  "Allianz-Ergebnisbelohnungen"
            ]
      },
      sourceLinks: [
        {
          title: {
            en: 'Official v2.5.500 Patch Notes - Copper Clash result mail and battle log',
            de: 'Offizielle v2.5.500 Patchnotes - Copper-Clash-Ergebnismails und Battle Logs',
          },
          url: 'https://tilesurvivegame.com/en/blog/1047',
          note: {
            en: 'Mentions Copper Clash in result mail and territory battle log updates.',
            de: 'Nennt Copper Clash bei Ergebnis-Mail- und Territory-Battle-Log-Updates.',
          },
        },
        {
          title: {
            en: 'Official v2.5.200 Patch Notes - Copper Clash resources',
            de: 'Offizielle v2.5.200 Patchnotes - Copper-Clash-Ressourcen',
          },
          url: 'https://tilesurvivegame.com/en/blog/975',
          note: {
            en: 'Mentions Copper Clash and Red Copper from occupied buildings.',
            de: 'Nennt Copper Clash und Red Copper aus besetzten Gebäuden.',
          },
        },
      ],
      sourceNote: eventSourceNote,
    },
  },
  {
    id: 'event-state-clash',
    type: 'event',
    slug: 'state-clash',
    route: '/events/state-clash',
    status: 'researched',
    ownerId: 'system',
    updatedAt: '2026-07-26',
    featured: false,
    title: { en: 'State Clash', de: 'Staatenkonflikt' },
    summary: { en: 'A cross-state battle event whose battle phase has appeared alongside Arcadian Conquest in recent reward and timing updates.', de: 'Ein Cross-State-Kampf-Event, dessen Battle Phase in aktuellen Reward- und Timing-Updates neben Arcadian Conquest genannt wird.' },
    tags: ['events', 'state', 'pvp', 'cross-state'],
    details: {
      beginnerBasics: {
        en: 'State Clash is a larger PvP event between states or servers. Beginners should see it as a dangerous war phase: rewards can be good, but unprepared accounts can lose many troops or spend too many healing items.',
        de: 'Staatenkonflikt ist ein größeres PvP-Event zwischen States oder Servern. Anfänger sollten es als gefährliche Kriegsphase sehen: Belohnungen können gut sein, aber unvorbereitete Accounts verlieren viele Truppen oder verbrauchen zu viele Heil-Items.'
      },
      beginnerSteps: {
        en: [
          'Check the event timer and phase.',
          'Ask your alliance or state leaders where beginners should help.',
          'Shield when offline if the rules allow it.',
          'Fight only during planned windows.',
          'Heal carefully and claim solo/state rewards.'
        ],
        de: [
          'Prüfe Eventtimer und Phase.',
          'Frag Allianz- oder State-Leader, wo Anfänger helfen sollen.',
          'Schilde dich offline, wenn die Regeln es erlauben.',
          'Kämpfe nur in geplanten Fenstern.',
          'Heile vorsichtig und hole Solo-/State-Belohnungen ab.'
        ]
      },
      beginnerSpendPlan: {
        en: [
          'Save speedups and buffs for the battle phase, not preparation screens.',
          'Do not spend healing speedups if you cannot keep playing.',
          'Keep shields for sleep/work times.'
        ],
        de: [
          'Spare Speedups und Buffs für die Kampfphase, nicht für Vorbereitungsbildschirme.',
          'Gib Heil-Speedups nicht aus, wenn du danach nicht weiterspielen kannst.',
          'Behalte Schilde für Schlaf-/Arbeitszeiten.'
        ]
      },
      beginnerMistakes: {
        en: [
          'Thinking it is safe like a PvE event.',
          'Going offline unshielded.',
          'Attacking stronger states alone.'
        ],
        de: [
          'Denken, es sei sicher wie ein PvE-Event.',
          'Offline ohne Schild gehen.',
          'Allein stärkere States angreifen.'
        ]
      },
      goals: { en: ['Prepare for the battle phase', 'Use combat and troop resources only when scoring is active', 'Coordinate with state or alliance calls'], de: ['Auf die Battle Phase vorbereiten', 'Kampf- und Truppenressourcen nur bei aktiver Wertung einsetzen', 'Mit State- oder Allianz-Calls koordinieren'] },
      rewards: { en: ['Solo progress rewards', 'Speedups', 'Battle phase rewards'], de: ['Solo-Fortschrittsbelohnungen', 'Speedups', 'Battle-Phase-Belohnungen'] },
      strategy: { en: 'Check the event page for exact phase timing. Recent patch notes changed some battle durations, so do not rely on old schedules.', de: 'Exakte Phasenzeiten im Event prüfen. Aktuelle Patchnotes haben Kampfzeiten angepasst, daher nicht auf alte Zeitpläne verlassen.' },
      requirements: {
            "en": [
                  "Eligible state or server phase",
                  "PvP teams and healing capacity",
                  "Alliance or state coordination"
            ],
            "de": [
                  "Berechtigte State- oder Serverphase",
                  "PvP-Teams und Heilkapazitaet",
                  "Allianz- oder State-Abstimmung"
            ]
      },
      neededItems: {
            "en": [
                  "Healing speedups",
                  "Combat buffs",
                  "March speedups",
                  "Shields for off-hours if usable"
            ],
            "de": [
                  "Heilungs-Speedups",
                  "Kampf-Buffs",
                  "Marsch-Speedups",
                  "Schilde für Offline-Zeiten, falls nutzbar"
            ]
      },
      preparation: {
            "en": [
                  "Check battle phase time because recent notes reduced some phases to two hours",
                  "Set targets and safe zones before fighting"
            ],
            "de": [
                  "Kampfphasenzeit prüfen, weil aktuelle Notes manche Phasen auf zwei Stunden reduziert haben",
                  "Ziele und sichere Zonen vor dem Kampf festlegen"
            ]
      },
      walkthrough: {
            "en": [
                  "Join during the state clash window",
                  "Fight around assigned objectives",
                  "Heal in waves",
                  "Claim solo, alliance, and state rewards"
            ],
            "de": [
                  "Im State-Clash-Fenster teilnehmen",
                  "Um zugewiesene Ziele k?mpfen",
                  "In Wellen heilen",
                  "Solo-, Allianz- und State-Belohnungen abholen"
            ]
      },
      watchouts: {
            "en": [
                  "Troop losses and healing pressure can be high",
                  "Battle phase timing changes by patch and state age"
            ],
            "de": [
                  "Truppenverluste und Heilungsdruck können hoch sein",
                  "Kampfphasen-Timing aendert sich je nach Patch und State-Alter"
            ]
      },
      exactRewards: {
            "en": [
                  "Solo progress rewards",
                  "State result rewards",
                  "Speedups including progress rewards noted in patch updates"
            ],
            "de": [
                  "Solo-Fortschrittsbelohnungen",
                  "State-Ergebnisbelohnungen",
                  "Speedups inklusive in Patchnotes erwaehnter Fortschrittsbelohnungen"
            ]
      },
      sourceLinks: [
        {
          title: {
            en: 'Official v2.5.500 Patch Notes - State Clash battle phase',
            de: 'Offizielle v2.5.500 Patchnotes - State-Clash-Battle-Phase',
          },
          url: 'https://tilesurvivegame.com/en/blog/1047',
          note: {
            en: 'Mentions State Clash battle phase rewards and timing changes.',
            de: 'Nennt State-Clash-Battle-Phase-Belohnungen und Timing-Änderungen.',
          },
        },
      ],
      sourceNote: eventSourceNote,
    },
  },
  {
    id: 'event-state-clash-league',
    type: 'event',
    slug: 'state-clash-league',
    route: '/events/state-clash-league',
    status: 'researched',
    ownerId: 'system',
    updatedAt: '2026-07-26',
    featured: false,
    title: { en: 'State Clash League', de: 'Staatenkonflikt-Liga' },
    summary: { en: 'A league layer for State Clash battle phases, mentioned in recent official timing adjustments.', de: 'Eine League-Ebene für State-Clash-Battle-Phasen, die in aktuellen offiziellen Timing-Anpassungen genannt wird.' },
    tags: ['events', 'state', 'league', 'pvp'],
    details: {
      beginnerBasics: {
        en: 'State Clash League is the organized league layer of State Clash. It is even more coordination-heavy, so beginners should follow state calls instead of making independent decisions.',
        de: 'Staatenkonflikt-Liga ist die organisierte Liga-Ebene vom Staatenkonflikt. Sie ist noch stärker koordinationslastig, deshalb sollten Anfänger State-Ansagen folgen statt eigene Einzelaktionen zu machen.'
      },
      beginnerSteps: {
        en: [
          'Confirm that your state is eligible.',
          'Read the battle window time.',
          'Prepare troops, shields, and healing before the window.',
          'Follow state targets.',
          'Check rewards and logs after the phase.'
        ],
        de: [
          'Prüfe, ob dein State berechtigt ist.',
          'Lies das Kampffenster.',
          'Bereite Truppen, Schilde und Heilung vor dem Fenster vor.',
          'Folge den State-Zielen.',
          'Prüfe Belohnungen und Berichte nach der Phase.'
        ]
      },
      beginnerSpendPlan: {
        en: [
          'Do not spend rare items immediately when the event appears.',
          'First read the task list and check which action gives points today.',
          'Spend only enough to reach the next good milestone unless your alliance has a coordinated push.',
          'Stop when the next reward costs more than it is worth for your account.'
        ],
        de: [
          'Gib seltene Items nicht sofort aus, nur weil das Event erscheint.',
          'Lies zuerst die Aufgabenliste und prüfe, welche Aktion heute wirklich Punkte gibt.',
          'Gib nur so viel aus, bis du den nächsten guten Meilenstein erreichst, außer deine Allianz macht einen gemeinsamen Push.',
          'Stoppe, wenn die nächste Belohnung mehr kostet, als sie deinem Account bringt.'
        ]
      },
      beginnerMistakes: {
        en: [
          'Joining without knowing the phase time.',
          'Using buffs before the real league battle.',
          'Ignoring state leadership.'
        ],
        de: [
          'Teilnehmen, ohne die Phasenzeit zu kennen.',
          'Buffs vor dem echten Liga-Kampf nutzen.',
          'State-Leitung ignorieren.'
        ]
      },
      goals: { en: ['Follow league battle phase timing', 'Coordinate active fighters', 'Plan resources around phase windows'], de: ['League-Battle-Phase-Timing beachten', 'Aktive Kämpfer koordinieren', 'Ressourcen um Phasenfenster planen'] },
      rewards: { en: ['League battle rewards', 'Progress rewards'], de: ['League-Battle-Belohnungen', 'Fortschrittsbelohnungen'] },
      strategy: { en: 'Treat this as a high-coordination event. Confirm unlock and participation rules in your server before committing resources.', de: 'Als stark koordiniertes Event behandeln. Freischaltung und Teilnahme-Regeln auf deinem Server prüfen, bevor Ressourcen eingesetzt werden.' },
      requirements: {
            "en": [
                  "League eligibility",
                  "Coordinated state-scale PvP teams"
            ],
            "de": [
                  "Liga-Berechtigung",
                  "Koordinierte State-weite PvP-Teams"
            ]
      },
      neededItems: {
            "en": [
                  "Healing speedups",
                  "Combat buffs",
                  "March speedups",
                  "Troop reserves"
            ],
            "de": [
                  "Heilungs-Speedups",
                  "Kampf-Buffs",
                  "Marsch-Speedups",
                  "Truppenreserven"
            ]
      },
      preparation: {
            "en": [
                  "Confirm registration and battle windows",
                  "Assign leaders, targets, and reserve teams"
            ],
            "de": [
                  "Registrierung und Kampffenster bestätigen",
                  "Leader, Ziele und Reserveteams einteilen"
            ]
      },
      walkthrough: {
            "en": [
                  "Enter the league battle phase",
                  "Follow state calls over solo decisions",
                  "Hold objectives and rotate wounded teams"
            ],
            "de": [
                  "In die Liga-Kampfphase eintreten",
                  "State-Calls vor Soloentscheidungen befolgen",
                  "Ziele halten und verwundete Teams rotieren"
            ]
      },
      watchouts: {
            "en": [
                  "League events punish uncoordinated solo fighting",
                  "Server timing can differ, so trust the in-game event clock"
            ],
            "de": [
                  "Liga-Events bestrafen unkoordiniertes Solo-Fighting",
                  "Server-Timing kann abweichen, daher Eventuhr im Spiel nutzen"
            ]
      },
      exactRewards: {
            "en": [
                  "League ranking rewards",
                  "State and personal battle rewards"
            ],
            "de": [
                  "Liga-Rangbelohnungen",
                  "State- und persönliche Kampfbelohnungen"
            ]
      },
      sourceLinks: [
        {
          title: {
            en: 'Official v2.5.500 Patch Notes - State Clash League battle phase',
            de: 'Offizielle v2.5.500 Patchnotes - State-Clash-League-Battle-Phase',
          },
          url: 'https://tilesurvivegame.com/en/blog/1047',
          note: {
            en: 'Mentions State Clash League battle phase timing changes.',
            de: 'Nennt Timing-Änderungen für die State-Clash-League-Battle-Phase.',
          },
        },
      ],
      sourceNote: eventSourceNote,
    },
  },
  {
    id: 'event-infected-fiend-conquest',
    type: 'event',
    slug: 'infected-fiend-conquest',
    route: '/events/infected-fiend-conquest',
    status: 'researched',
    ownerId: 'system',
    updatedAt: '2026-07-26',
    featured: false,
    title: { en: 'Infected Fiend Conquest', de: 'Eroberung des infizierten Unholds' },
    summary: { en: 'A rally-focused Infected Fiend event with tech bonuses, leader rewards, and improved Aid Crate rewards in recent patches.', de: 'Ein Rally-fokussiertes Infected-Fiend-Event mit Tech-Boni, Leader-Belohnungen und verbesserten Aid-Crate-Belohnungen in aktuellen Patches.' },
    tags: ['events', 'infected', 'rally', 'pve'],
    details: {
      beginnerBasics: {
        en: 'Infected Fiend Conquest is a rally PvE event. You usually do not beat the strongest targets alone; you join or start rallies with alliance members. Beginners help by joining rallies quickly and not launching weak rallies that nobody can fill.',
        de: 'Eroberung des infizierten Unholds ist ein Rally-PvE-Event. Die stärksten Ziele besiegst du meist nicht allein; du startest oder trittst Rallys mit Allianzmitgliedern bei. Anfänger helfen, indem sie schnell Rallys beitreten und keine schwachen Rallys starten, die niemand füllt.'
      },
      beginnerSteps: {
        en: [
          'Open the event and check the target levels.',
          'Join rallies from strong alliance players first.',
          'If you start a rally, choose a level your alliance can beat.',
          'Claim Aid Crates and progress rewards.',
          'Repeat while stamina or attempts are worth using.'
        ],
        de: [
          'Öffne das Event und prüfe Ziellevel.',
          'Tritt zuerst Rallys starker Allianzspieler bei.',
          'Wenn du eine Rally startest, wähle ein Level, das deine Allianz schafft.',
          'Hole Aid Crates und Fortschrittsbelohnungen ab.',
          'Wiederhole es, solange Ausdauer oder Versuche sinnvoll sind.'
        ]
      },
      beginnerSpendPlan: {
        en: [
          'Spend stamina on targets your alliance can defeat reliably.',
          'Do not invest event tech before reading whether it helps only rally leaders.',
          'Save attempts if no strong rally leader is online.'
        ],
        de: [
          'Gib Ausdauer für Ziele aus, die deine Allianz sicher schafft.',
          'Investiere Event-Tech nicht, bevor du gelesen hast, ob es nur Rally-Leadern hilft.',
          'Spare Versuche, wenn kein starker Rally-Leader online ist.'
        ]
      },
      beginnerMistakes: {
        en: [
          'Starting targets that are too high.',
          'Ignoring leader-only tech text.',
          'Letting Aid Crates expire unclaimed.'
        ],
        de: [
          'Zu hohe Ziele starten.',
          'Leader-only-Techtexte ignorieren.',
          'Aid Crates nicht rechtzeitig abholen.'
        ]
      },
      goals: { en: ['Lead or join Fiend rallies', 'Understand which tech bonuses apply to rally leaders', 'Claim Aid Crates consistently'], de: ['Fiend-Rallys leiten oder beitreten', 'Verstehen, welche Tech-Boni für Rally-Leader gelten', 'Aid Crates regelmäßig claimen'] },
      rewards: { en: ['Aid Crates', 'Speedups', 'Advanced Recruitment Token chance'], de: ['Aid Crates', 'Speedups', 'Chance auf Advanced Recruitment Token'] },
      strategy: { en: 'Leader-only tech effects matter. If you invested before patch corrections, check refunds and updated rules in the event tech tree.', de: 'Leader-only-Tech-Effekte sind wichtig. Wenn du vor Patch-Korrekturen investiert hast, Refunds und neue Regeln im Event-Tech-Baum prüfen.' },
      requirements: {
            "en": [
                  "Rally access and enough alliance members joining",
                  "Leader tech checked before launching rallies"
            ],
            "de": [
                  "Rally-Zugang und genug Allianzmitglieder, die beitreten",
                  "Leader-Tech vor Rallystart prüfen"
            ]
      },
      neededItems: {
            "en": [
                  "Stamina or rally attempts",
                  "Strong rally leaders",
                  "Healing speedups if fights are costly"
            ],
            "de": [
                  "Ausdauer oder Rally-Versuche",
                  "Starke Rally-Leader",
                  "Heilungs-Speedups, falls K?mpfe teuer sind"
            ]
      },
      preparation: {
            "en": [
                  "Pick the strongest rally leaders",
                  "Make sure leader-only tech is understood",
                  "Tell members which Fiend level to join"
            ],
            "de": [
                  "Staerkste Rally-Leader bestimmen",
                  "Leader-only-Tech verstehen",
                  "Mitgliedern ansagen, welches Fiend-Level beigetreten werden soll"
            ]
      },
      walkthrough: {
            "en": [
                  "Start or join Fiend rallies",
                  "Use leader tech where it actually applies",
                  "Claim Aid Crates and event progress rewards"
            ],
            "de": [
                  "Fiend-Rallys starten oder beitreten",
                  "Leader-Tech dort nutzen, wo sie wirklich wirkt",
                  "Aid Crates und Fortschrittsbelohnungen claimen"
            ]
      },
      watchouts: {
            "en": [
                  "Patch notes clarified that some effects only work for rally leaders",
                  "Do not invest event tech blindly before reading the current description"
            ],
            "de": [
                  "Patchnotes stellen klar, dass manche Effekte nur für Rally-Leader wirken",
                  "Event-Tech nicht blind investieren, bevor die aktuelle Beschreibung gelesen wurde"
            ]
      },
      exactRewards: {
            "en": [
                  "Epic Aid Crate",
                  "5-minute speedup guaranteed in mentioned patch notes",
                  "Chance for 15-minute speedup or Advanced Recruitment Token"
            ],
            "de": [
                  "Epic Aid Crate",
                  "5-Minuten-Speedup laut Patchnotes garantiert",
                  "Chance auf 15-Minuten-Speedup oder Advanced Recruitment Token"
            ]
      },
      sourceLinks: [
        {
          title: {
            en: 'Official v2.5.500 Patch Notes - Infected Fiend Conquest',
            de: 'Offizielle v2.5.500 Patchnotes - Infected Fiend Conquest',
          },
          url: 'https://tilesurvivegame.com/en/blog/1047',
          note: {
            en: 'Mentions Infected Fiend Conquest tech descriptions, leader-only effects, and Aid Crate rewards.',
            de: 'Nennt Infected-Fiend-Conquest-Techbeschreibungen, Leader-only-Effekte und Aid-Crate-Belohnungen.',
          },
        },
      ],
      sourceNote: eventSourceNote,
    },
  },
  {
    id: 'event-underground-goldmine',
    type: 'event',
    slug: 'underground-goldmine',
    route: '/events/underground-goldmine',
    status: 'researched',
    ownerId: 'system',
    updatedAt: '2026-07-26',
    featured: false,
    title: { en: 'Underground Goldmine', de: 'Unterirdische Goldmine' },
    summary: { en: 'A combat-power and digging event that has received formation-power and report optimizations in recent updates.', de: 'Ein Combat-Power- und Grabungs-Event, das zuletzt Optimierungen bei Formation Power und Digging Reports erhalten hat.' },
    tags: ['events', 'goldmine', 'pve', 'formation'],
    details: {
      beginnerBasics: {
        en: 'Underground Goldmine is a PvE progression event. You send formations into mine levels and try to clear as high as you can without wasting attempts. Beginners should treat reports as feedback: if you lose, change the team or lower the level.',
        de: 'Unterirdische Goldmine ist ein PvE-Fortschrittsevent. Du schickst Formationen in Minenstufen und versuchst, so hoch wie möglich zu kommen, ohne Versuche zu verschwenden. Anfänger sollten Berichte als Feedback nutzen: Wenn du verlierst, ändere das Team oder senke die Stufe.'
      },
      beginnerSteps: {
        en: [
          'Start with a level your team can beat.',
          'Use your best PvE formation, not random heroes.',
          'Read the report after every failed dig.',
          'Upgrade heroes or gear before pushing higher.',
          'Claim stage and progress rewards.'
        ],
        de: [
          'Starte mit einer Stufe, die dein Team schafft.',
          'Nutze deine beste PvE-Formation, nicht zufällige Helden.',
          'Lies den Bericht nach jeder fehlgeschlagenen Grabung.',
          'Verbessere Helden oder Gear, bevor du höher gehst.',
          'Hole Stufen- und Fortschrittsbelohnungen ab.'
        ]
      },
      beginnerSpendPlan: {
        en: [
          'Do not spend rare items immediately when the event appears.',
          'First read the task list and check which action gives points today.',
          'Spend only enough to reach the next good milestone unless your alliance has a coordinated push.',
          'Stop when the next reward costs more than it is worth for your account.'
        ],
        de: [
          'Gib seltene Items nicht sofort aus, nur weil das Event erscheint.',
          'Lies zuerst die Aufgabenliste und prüfe, welche Aktion heute wirklich Punkte gibt.',
          'Gib nur so viel aus, bis du den nächsten guten Meilenstein erreichst, außer deine Allianz macht einen gemeinsamen Push.',
          'Stoppe, wenn die nächste Belohnung mehr kostet, als sie deinem Account bringt.'
        ]
      },
      beginnerMistakes: {
        en: [
          'Using quick deploy without checking the team.',
          'Pushing too high and wasting attempts.',
          'Ignoring why the report says you lost.'
        ],
        de: [
          'Quick Deploy nutzen, ohne das Team zu prüfen.',
          'Zu hoch pushen und Versuche verschwenden.',
          'Ignorieren, warum du laut Bericht verloren hast.'
        ]
      },
      goals: { en: ['Deploy accurate teams', 'Use quick deploy carefully', 'Review digging reports for lower levels'], de: ['Passende Teams einsetzen', 'Quick Deploy sorgfältig nutzen', 'Digging Reports für niedrige Level prüfen'] },
      rewards: { en: ['Goldmine progress rewards', 'Event materials'], de: ['Goldmine-Fortschrittsbelohnungen', 'Event-Materialien'] },
      strategy: { en: 'Because formation power calculation was updated, re-check saved teams instead of assuming old power numbers still represent real strength.', de: 'Da die Formation-Power-Berechnung angepasst wurde, gespeicherte Teams neu prüfen statt alten Power-Zahlen blind zu vertrauen.' },
      requirements: {
            "en": [
                  "Unlocked Goldmine event",
                  "Strong enough formations for the current mine level"
            ],
            "de": [
                  "Freigeschaltetes Goldmine-Event",
                  "Formationen stark genug für die aktuelle Minenstufe"
            ]
      },
      neededItems: {
            "en": [
                  "Best hero formations",
                  "Digging attempts or event energy where shown",
                  "Combat upgrades before pushing deeper"
            ],
            "de": [
                  "Beste Heldenformationen",
                  "Grabungsversuche oder Eventenergie, wenn angezeigt",
                  "Kampf-Upgrades vor tieferen Stufen"
            ]
      },
      preparation: {
            "en": [
                  "Recheck formation power after patches",
                  "Use reports to identify why a dig failed"
            ],
            "de": [
                  "Formation Power nach Patches neu prüfen",
                  "Berichte nutzen, um Fehlschlaege zu verstehen"
            ]
      },
      walkthrough: {
            "en": [
                  "Select the highest stable mine level",
                  "Deploy a tested formation",
                  "Use quick deploy only after verifying the team",
                  "Read digging reports after losses"
            ],
            "de": [
                  "Hoechste stabile Minenstufe wählen",
                  "Getestete Formation einsetzen",
                  "Quick Deploy erst nach Teamprüfung nutzen",
                  "Digging Reports nach Niederlagen lesen"
            ]
      },
      watchouts: {
            "en": [
                  "Displayed power was optimized in patches, so old saved teams can be misleading",
                  "Pushing too high wastes attempts"
            ],
            "de": [
                  "Angezeigte Power wurde in Patches optimiert, alte Teams können taeuschen",
                  "Zu hohe Stufen verschwenden Versuche"
            ]
      },
      exactRewards: {
            "en": [
                  "Goldmine progress rewards",
                  "Event materials",
                  "Stage rewards shown per mine level"
            ],
            "de": [
                  "Goldmine-Fortschrittsbelohnungen",
                  "Event-Materialien",
                  "Stufenbelohnungen je Minenlevel"
            ]
      },
      sourceLinks: [
        {
          title: {
            en: 'Official v2.5.300 Patch Notes - Underground Goldmine',
            de: 'Offizielle v2.5.300 Patchnotes - Underground Goldmine',
          },
          url: 'https://tilesurvivegame.com/en/blog/1008',
          note: {
            en: 'Mentions Underground Goldmine event optimizations, formation power, digging reports, and quick deploy.',
            de: 'Nennt Underground-Goldmine-Event-Optimierungen, Formation Power, Digging Reports und Quick Deploy.',
          },
        },
        {
          title: {
            en: 'Official v2.5.200 Patch Notes - Underground Goldmine Behemoth Power',
            de: 'Offizielle v2.5.200 Patchnotes - Underground-Goldmine-Behemoth-Power',
          },
          url: 'https://tilesurvivegame.com/en/blog/975',
          note: {
            en: 'Mentions Behemoth Power displays in modes such as Underground Goldmine.',
            de: 'Nennt Behemoth-Power-Anzeigen in Modi wie Underground Goldmine.',
          },
        },
      ],
      sourceNote: eventSourceNote,
    },
  },
  {
    id: 'event-awakening-of-dragons',
    type: 'event',
    slug: 'awakening-of-dragons',
    route: '/events/awakening-of-dragons',
    status: 'researched',
    ownerId: 'system',
    updatedAt: '2026-07-26',
    featured: false,
    title: { en: 'Awakening of Dragons', de: 'Erwachen der Drachen' },
    summary: { en: 'A dragon-themed collection and progression event introduced around version 2.5.500.', de: 'Ein drachenthematisches Collection- und Progression-Event, eingeführt rund um Version 2.5.500.' },
    tags: ['events', 'collection', 'seasonal', 'dragon'],
    details: {
      beginnerBasics: {
        en: 'Awakening of Dragons is a seasonal dragon progression area. It is less about one big fight and more about daily consistency: open the season event center, complete tasks, collect dragon resources, and claim milestones.',
        de: 'Erwachen der Drachen ist ein saisonaler Drachen-Fortschrittsbereich. Es geht weniger um einen großen Kampf und mehr um tägliche Routine: Season Event Center öffnen, Aufgaben erledigen, Drachenressourcen sammeln und Meilensteine abholen.'
      },
      beginnerSteps: {
        en: [
          'Open the Season Event Center daily.',
          'Check which dragon tasks reset today.',
          'Complete free or cheap tasks first.',
          'Spend dragon resources only after checking exchange limits.',
          'Claim daily and seasonal rewards before reset.'
        ],
        de: [
          'Öffne das Season Event Center täglich.',
          'Prüfe, welche Drachenaufgaben heute resetten.',
          'Erledige kostenlose oder günstige Aufgaben zuerst.',
          'Gib Drachenressourcen erst nach Prüfung der Tauschlimits aus.',
          'Hole tägliche und saisonale Belohnungen vor Reset ab.'
        ]
      },
      beginnerSpendPlan: {
        en: [
          'Do not spend rare items immediately when the event appears.',
          'First read the task list and check which action gives points today.',
          'Spend only enough to reach the next good milestone unless your alliance has a coordinated push.',
          'Stop when the next reward costs more than it is worth for your account.'
        ],
        de: [
          'Gib seltene Items nicht sofort aus, nur weil das Event erscheint.',
          'Lies zuerst die Aufgabenliste und prüfe, welche Aktion heute wirklich Punkte gibt.',
          'Gib nur so viel aus, bis du den nächsten guten Meilenstein erreichst, außer deine Allianz macht einen gemeinsamen Push.',
          'Stoppe, wenn die nächste Belohnung mehr kostet, als sie deinem Account bringt.'
        ]
      },
      beginnerMistakes: {
        en: [
          'Forgetting daily resets.',
          'Spending rare dragon resources before knowing the milestone path.',
          'Ignoring linked events like Raise Your Dragon or Dragon Calamity.'
        ],
        de: [
          'Tägliche Resets vergessen.',
          'Seltene Drachenressourcen ausgeben, bevor der Meilensteinpfad klar ist.',
          'Verknüpfte Events wie Drachen aufziehen oder Drachenkatastrophe ignorieren.'
        ]
      },
      goals: { en: ['Collect event cards through daily activity', 'Follow the event progression line', 'Check exchange rules in the event tab'], de: ['Event-Karten durch tägliche Aktivität sammeln', 'Der Event-Fortschrittslinie folgen', 'Tauschregeln im Event-Tab prüfen'] },
      rewards: { en: ['Dragon collection rewards', 'Seasonal progression rewards'], de: ['Drachen-Collection-Belohnungen', 'Saison-Fortschrittsbelohnungen'] },
      strategy: { en: 'Daily consistency is usually stronger than one-time rushing. Finish daily event tasks before spending extra resources.', de: 'Tägliche Konstanz ist meist stärker als einmaliges Rushen. Erst tägliche Eventaufgaben abschließen, dann Extra-Ressourcen einsetzen.' },
      requirements: {
            "en": [
                  "Season II access where available",
                  "Daily participation in dragon-related event tabs"
            ],
            "de": [
                  "Season-II-Zugang, falls auf deinem Server verfügbar",
                  "Tägliche Teilnahme in drachenbezogenen Event-Tabs"
            ]
      },
      neededItems: {
            "en": [
                  "Season event attempts",
                  "Dragon resources shown in the event",
                  "Saved stamina or growth items if tasks request them"
            ],
            "de": [
                  "Saison-Eventversuche",
                  "Im Event angezeigte Drachenressourcen",
                  "Gesparte Ausdauer oder Growth-Items, wenn Aufgaben sie verlangen"
            ]
      },
      preparation: {
            "en": [
                  "Open the Season Event Center every day",
                  "Check linked dragon events such as Raise Your Dragon and Dragon Calamity"
            ],
            "de": [
                  "Season Event Center täglich öffnen",
                  "Verknuepfte Drachenevents wie Drachen aufziehen und Drachenkatastrophe prüfen"
            ]
      },
      walkthrough: {
            "en": [
                  "Follow the season event center tasks",
                  "Spend dragon resources only after checking exchange limits",
                  "Claim daily and seasonal milestones"
            ],
            "de": [
                  "Aufgaben im Season Event Center verfolgen",
                  "Drachenressourcen erst nach Pruefung der Tauschlimits ausgeben",
                  "Tägliche und Saison-Meilensteine abholen"
            ]
      },
      watchouts: {
            "en": [
                  "Availability depends on season and server age",
                  "Dragon event names can stay English in sources while the German client uses localized names"
            ],
            "de": [
                  "Verfuegbarkeit hängt von Saison und Serveralter ab",
                  "Drachenevent-Namen können in Quellen Englisch bleiben, während der deutsche Client lokalisierte Namen nutzt"
            ]
      },
      exactRewards: {
            "en": [
                  "Dragon progression rewards",
                  "Seasonal milestone rewards",
                  "Event exchange rewards"
            ],
            "de": [
                  "Drachen-Fortschrittsbelohnungen",
                  "Saison-Meilensteinbelohnungen",
                  "Event-Tauschbelohnungen"
            ]
      },
      sourceLinks: [
        {
          title: {
            en: 'Official v2.5.700 Patch Notes - Season II',
            de: 'Offizielle v2.5.700 Patchnotes - Season II',
          },
          url: 'https://tilesurvivegame.com/en/blog/1078',
          note: {
            en: 'Mentions Season II: Awakening of Dragons, Raise Your Dragon, and Dragon Calamity changes.',
            de: 'Nennt Season II: Awakening of Dragons, Drachen aufziehen und Dragon-Calamity-Änderungen.',
          },
        },
        {
          title: {
            en: 'Official v2.5.500 Patch Notes - Dragon DNA context',
            de: 'Offizielle v2.5.500 Patchnotes - Dragon-DNA-Kontext',
          },
          url: 'https://tilesurvivegame.com/en/blog/1047',
          note: {
            en: 'Current public source mentions Dragon DNA as event resource context; exact event title should still be verified in-game.',
            de: 'Aktuelle öffentliche Quelle nennt Dragon DNA als Eventressourcen-Kontext; exakter Eventtitel sollte weiter im Spiel geprüft werden.',
          },
        },
      ],
      sourceNote: eventSourceNote,
    },
  },
  {
    id: 'event-future-tycoon',
    type: 'event',
    slug: 'future-tycoon',
    route: '/events/future-tycoon',
    status: 'researched',
    ownerId: 'system',
    updatedAt: '2026-07-26',
    featured: false,
    title: { en: 'Future Tycoon', de: 'Zukunftstycoon' },
    summary: { en: 'A recurring event mentioned in official patch notes, with earned items preserved after the event round ends.', de: 'Ein wiederkehrendes Event aus offiziellen Patchnotes, bei dem verdiente Items nach Eventende erhalten bleiben.' },
    tags: ['events', 'growth', 'tycoon'],
    details: {
      beginnerBasics: {
        en: 'Future Tycoon is a tycoon-style reward event. You earn or use event items on a reward path. The important beginner question is whether items carry over, because that decides if you should spend now or save for a better round.',
        de: 'Zukunftstycoon ist ein Tycoon-artiges Belohnungsevent. Du verdienst oder nutzt Eventitems auf einem Belohnungspfad. Die wichtigste Anfängerfrage ist, ob Items erhalten bleiben, denn das entscheidet, ob du jetzt ausgibst oder für eine bessere Runde sparst.'
      },
      beginnerSteps: {
        en: [
          'Open the rules page first.',
          'Check which items remain after the round.',
          'Look at the reward path before spending.',
          'Use items until a valuable milestone, then stop.',
          'Claim rewards before the round changes.'
        ],
        de: [
          'Öffne zuerst die Regeln.',
          'Prüfe, welche Items nach der Runde bleiben.',
          'Sieh dir den Belohnungspfad vor dem Ausgeben an.',
          'Nutze Items bis zu einem wertvollen Meilenstein und stoppe dann.',
          'Hole Belohnungen ab, bevor die Runde wechselt.'
        ]
      },
      beginnerSpendPlan: {
        en: [
          'Do not spend rare items immediately when the event appears.',
          'First read the task list and check which action gives points today.',
          'Spend only enough to reach the next good milestone unless your alliance has a coordinated push.',
          'Stop when the next reward costs more than it is worth for your account.'
        ],
        de: [
          'Gib seltene Items nicht sofort aus, nur weil das Event erscheint.',
          'Lies zuerst die Aufgabenliste und prüfe, welche Aktion heute wirklich Punkte gibt.',
          'Gib nur so viel aus, bis du den nächsten guten Meilenstein erreichst, außer deine Allianz macht einen gemeinsamen Push.',
          'Stoppe, wenn die nächste Belohnung mehr kostet, als sie deinem Account bringt.'
        ]
      },
      beginnerMistakes: {
        en: [
          'Spending because the timer looks scary even though items carry over.',
          'Chasing a reward you cannot realistically reach.',
          'Ignoring the rules page.'
        ],
        de: [
          'Ausgeben, nur weil der Timer Druck macht, obwohl Items erhalten bleiben.',
          'Eine Belohnung jagen, die du realistisch nicht erreichst.',
          'Die Regelseite ignorieren.'
        ]
      },
      goals: { en: ['Complete event tasks', 'Use event items according to the current round rules', 'Check what carries over after the round'], de: ['Eventaufgaben abschließen', 'Eventitems nach aktuellen Rundenregeln nutzen', 'Prüfen, was nach der Runde erhalten bleibt'] },
      rewards: { en: ['Round rewards', 'Event items retained after the round'], de: ['Rundenbelohnungen', 'Eventitems bleiben nach der Runde erhalten'] },
      strategy: { en: 'Do not assume every tycoon-style event resets the same way. Check the event screen before spending stored items.', de: 'Nicht annehmen, dass jedes Tycoon-Event gleich resettet. Vor dem Einsatz gesparter Items den Eventscreen prüfen.' },
      requirements: {
            "en": [
                  "Event Center access during the active round",
                  "Understanding of which items carry over"
            ],
            "de": [
                  "Event-Center-Zugang während der aktiven Runde",
                  "Verstehen, welche Items erhalten bleiben"
            ]
      },
      neededItems: {
            "en": [
                  "Future Tycoon event items",
                  "Resources requested by the current board or task list"
            ],
            "de": [
                  "Future-Tycoon-Eventitems",
                  "Ressourcen, die das aktuelle Brett oder die Aufgabenliste verlangt"
            ]
      },
      preparation: {
            "en": [
                  "Read the round rules before spending",
                  "Save retained items if the current reward path is weak"
            ],
            "de": [
                  "Rundenregeln vor dem Ausgeben lesen",
                  "Erhalten bleibende Items sparen, wenn der aktuelle Belohnungspfad schwach ist"
            ]
      },
      walkthrough: {
            "en": [
                  "Complete tasks to earn event items",
                  "Use items on the current tycoon board",
                  "Stop at a good milestone if the next reward is too expensive"
            ],
            "de": [
                  "Aufgaben erledigen, um Eventitems zu verdienen",
                  "Items auf dem aktuellen Tycoon-Brett einsetzen",
                  "Bei gutem Meilenstein stoppen, wenn die naechste Belohnung zu teuer ist"
            ]
      },
      watchouts: {
            "en": [
                  "Official notes say earned event items stay after the event round, but always confirm in the current rules",
                  "Do not spend just because the event timer is low if carryover is active"
            ],
            "de": [
                  "Offizielle Notes sagen, dass verdiente Eventitems nach der Runde bleiben, trotzdem aktuelle Regeln prüfen",
                  "Nicht nur wegen niedrigem Timer ausgeben, wenn Carryover aktiv ist"
            ]
      },
      exactRewards: {
            "en": [
                  "Round rewards",
                  "Retained event items",
                  "Milestone rewards shown on the board"
            ],
            "de": [
                  "Rundenbelohnungen",
                  "Erhaltene Eventitems",
                  "Meilensteinbelohnungen auf dem Brett"
            ]
      },
      sourceLinks: [
        {
          title: {
            en: 'Official v2.4.200 Patch Notes - Future Tycoon',
            de: 'Offizielle v2.4.200 Patchnotes - Future Tycoon',
          },
          url: 'https://tilessurvive.com/en/blog/800',
          note: {
            en: 'Mentions Future Tycoon event item retention after the round ends.',
            de: 'Nennt Future Tycoon und dass Eventitems nach Rundenende erhalten bleiben.',
          },
        },
      ],
      sourceNote: eventSourceNote,
    },
  },
  {
    id: 'event-fishing-tournament',
    type: 'event',
    slug: 'fishing-tournament',
    route: '/events/fishing-tournament',
    status: 'researched',
    ownerId: 'system',
    updatedAt: '2026-07-26',
    featured: false,
    title: { en: 'Fishing Tournament', de: 'Angelturnier' },
    summary: { en: 'A fishing event with Bulk Fishing unlocks after fishing gear and Fishadex progress requirements are met.', de: 'Ein Angel-Event mit Bulk Fishing, sobald Angelgear- und Fishadex-Fortschritt die Anforderungen erfüllen.' },
    tags: ['events', 'fishing', 'collection'],
    details: {
      beginnerBasics: {
        en: 'Fishing Tournament is a collection and attempt-spending event. You fish for points and collection progress. Beginners should understand that better gear and Fishadex progress can make attempts more valuable, so timing matters.',
        de: 'Angelturnier ist ein Sammlungs- und Versuchsevent. Du angelst für Punkte und Sammlungsfortschritt. Anfänger sollten verstehen, dass besseres Angelgear und Fishadex-Fortschritt Versuche wertvoller machen können, deshalb zählt Timing.'
      },
      beginnerSteps: {
        en: [
          'Check your fishing gear and Fishadex progress.',
          'Use free or daily attempts first.',
          'If Bulk Fishing is locked, decide whether saving attempts is smarter.',
          'Fish until the next useful milestone.',
          'Claim tournament and collection rewards.'
        ],
        de: [
          'Prüfe Angelgear und Fishadex-Fortschritt.',
          'Nutze zuerst kostenlose oder tägliche Versuche.',
          'Wenn Bulk Fishing gesperrt ist, entscheide, ob Sparen klüger ist.',
          'Angle bis zum nächsten sinnvollen Meilenstein.',
          'Hole Turnier- und Sammlungsbelohnungen ab.'
        ]
      },
      beginnerSpendPlan: {
        en: [
          'Do not spend rare items immediately when the event appears.',
          'First read the task list and check which action gives points today.',
          'Spend only enough to reach the next good milestone unless your alliance has a coordinated push.',
          'Stop when the next reward costs more than it is worth for your account.'
        ],
        de: [
          'Gib seltene Items nicht sofort aus, nur weil das Event erscheint.',
          'Lies zuerst die Aufgabenliste und prüfe, welche Aktion heute wirklich Punkte gibt.',
          'Gib nur so viel aus, bis du den nächsten guten Meilenstein erreichst, außer deine Allianz macht einen gemeinsamen Push.',
          'Stoppe, wenn die nächste Belohnung mehr kostet, als sie deinem Account bringt.'
        ]
      },
      beginnerMistakes: {
        en: [
          'Using all attempts before improving gear.',
          'Planning around Bulk Fishing before it is unlocked.',
          'Ignoring collection rewards.'
        ],
        de: [
          'Alle Versuche nutzen, bevor Gear verbessert ist.',
          'Mit Bulk Fishing planen, bevor es freigeschaltet ist.',
          'Sammlungsbelohnungen ignorieren.'
        ]
      },
      goals: { en: ['Upgrade fishing gear', 'Build Fishadex progress', 'Use Bulk Fishing only when unlocked and efficient'], de: ['Angelgear verbessern', 'Fishadex-Fortschritt ausbauen', 'Bulk Fishing nur nach Freischaltung und sinnvoller Effizienz nutzen'] },
      rewards: { en: ['Fishing points', 'Tournament rewards', 'Collection progress'], de: ['Fishing-Punkte', 'Turnierbelohnungen', 'Collection-Fortschritt'] },
      strategy: { en: 'Save event items if you are close to Bulk Fishing unlock requirements. Multiplying attempts can be stronger after the unlock.', de: 'Eventitems sparen, wenn du kurz vor Bulk-Fishing-Anforderungen stehst. Multiplizierte Versuche können nach Freischaltung stärker sein.' },
      requirements: {
            "en": [
                  "Fishing Tournament unlocked",
                  "Bulk Fishing requires max fishing gear and 100 Fishadex stars according to official notes"
            ],
            "de": [
                  "Angelturnier freigeschaltet",
                  "Bulk Fishing benoetigt laut offiziellen Notes maximales Angelgear und 100 Fishadex-Sterne"
            ]
      },
      neededItems: {
            "en": [
                  "Fishing attempts or bait",
                  "Fishing gear upgrades",
                  "Fishadex collection progress"
            ],
            "de": [
                  "Angelversuche oder Koeder",
                  "Angelgear-Upgrades",
                  "Fishadex-Sammlungsfortschritt"
            ]
      },
      preparation: {
            "en": [
                  "Upgrade fishing gear before heavy spending",
                  "Save attempts if you are close to Bulk Fishing unlock"
            ],
            "de": [
                  "Angelgear vor großem Ausgeben verbessern",
                  "Versuche sparen, wenn Bulk Fishing bald freigeschaltet wird"
            ]
      },
      walkthrough: {
            "en": [
                  "Fish manually until Bulk Fishing is unlocked",
                  "Use multiplied attempts only when the reward path is worth it",
                  "Claim tournament and collection rewards"
            ],
            "de": [
                  "Manuell angeln, bis Bulk Fishing frei ist",
                  "Multiplizierte Versuche nur nutzen, wenn der Belohnungspfad es wert ist",
                  "Turnier- und Sammlungsbelohnungen abholen"
            ]
      },
      watchouts: {
            "en": [
                  "Bulk Fishing is locked behind exact requirements, so do not plan around it too early",
                  "Collection progress can matter as much as raw attempts"
            ],
            "de": [
                  "Bulk Fishing ist an genaue Anforderungen gebunden, also nicht zu früh damit planen",
                  "Sammlungsfortschritt kann genauso wichtig sein wie reine Versuche"
            ]
      },
      exactRewards: {
            "en": [
                  "Fishing points",
                  "Tournament rewards",
                  "Collection progress rewards"
            ],
            "de": [
                  "Angel-Punkte",
                  "Turnierbelohnungen",
                  "Sammlungs-Fortschrittsbelohnungen"
            ]
      },
      sourceLinks: [
        {
          title: {
            en: 'Official v2.5.000 Patch Notes - Fishing Tournament',
            de: 'Offizielle v2.5.000 Patchnotes - Fishing Tournament',
          },
          url: 'https://tilesurvivegame.com/en/blog/961',
          note: {
            en: 'Mentions Bulk Fishing Mode in Fishing Tournament and unlock requirements.',
            de: 'Nennt Bulk Fishing Mode im Fishing Tournament und Freischaltbedingungen.',
          },
        },
      ],
      sourceNote: eventSourceNote,
    },
  },
  {
    id: 'event-partner-paradise',
    type: 'event',
    slug: 'partner-paradise',
    route: '/events/partner-paradise',
    status: 'researched',
    ownerId: 'system',
    updatedAt: '2026-07-26',
    featured: false,
    title: { en: 'Partner Paradise', de: 'Partnerparadies' },
    summary: { en: 'A newer event whose task progress calculations were optimized in official update notes.', de: 'Ein neueres Event, dessen Aufgabenfortschritt laut offiziellen Update Notes optimiert wurde.' },
    tags: ['events', 'partner', 'tasks'],
    details: {
      beginnerBasics: {
        en: 'Partner Paradise is a task event. You complete listed activities and claim stage rewards. Beginners should not guess what counts; always check the task list after each activity.',
        de: 'Partnerparadies ist ein Aufgaben-Event. Du erledigst gelistete Aktivitäten und holst Stufenbelohnungen ab. Anfänger sollten nicht raten, was zählt; prüfe nach jeder Aktivität die Aufgabenliste.'
      },
      beginnerSteps: {
        en: [
          'Update the game if the event is missing.',
          'Open Partner Paradise in the Event Center.',
          'Read every task before spending items.',
          'Complete cheap tasks first.',
          'Claim rewards after each stage.'
        ],
        de: [
          'Aktualisiere das Spiel, wenn das Event fehlt.',
          'Öffne Partnerparadies im Event Center.',
          'Lies jede Aufgabe, bevor du Items ausgibst.',
          'Erledige günstige Aufgaben zuerst.',
          'Hole Belohnungen nach jeder Stufe ab.'
        ]
      },
      beginnerSpendPlan: {
        en: [
          'Do not spend rare items immediately when the event appears.',
          'First read the task list and check which action gives points today.',
          'Spend only enough to reach the next good milestone unless your alliance has a coordinated push.',
          'Stop when the next reward costs more than it is worth for your account.'
        ],
        de: [
          'Gib seltene Items nicht sofort aus, nur weil das Event erscheint.',
          'Lies zuerst die Aufgabenliste und prüfe, welche Aktion heute wirklich Punkte gibt.',
          'Gib nur so viel aus, bis du den nächsten guten Meilenstein erreichst, außer deine Allianz macht einen gemeinsamen Push.',
          'Stoppe, wenn die nächste Belohnung mehr kostet, als sie deinem Account bringt.'
        ]
      },
      beginnerMistakes: {
        en: [
          'Assuming tasks count retroactively.',
          'Updating too late and missing the event.',
          'Spending rare items on low-value tasks.'
        ],
        de: [
          'Annehmen, dass Aufgaben rückwirkend zählen.',
          'Zu spät aktualisieren und das Event verpassen.',
          'Seltene Items für schwache Aufgaben ausgeben.'
        ]
      },
      goals: { en: ['Complete event objectives efficiently', 'Update the game before trying the event', 'Review task progress after each activity'], de: ['Eventziele effizient abschließen', 'Spiel vor dem Event aktualisieren', 'Aufgabenfortschritt nach Aktivitäten prüfen'] },
      rewards: { en: ['Partner Paradise task rewards'], de: ['Partner-Paradise-Aufgabenbelohnungen'] },
      strategy: { en: 'Make sure the latest version is installed. The event may not be visible or may behave differently before updating.', de: 'Stelle sicher, dass die neueste Version installiert ist. Das Event ist vor dem Update eventuell nicht sichtbar oder funktioniert anders.' },
      requirements: {
            "en": [
                  "Latest game version for the event behavior noted in patch notes",
                  "Event Center access"
            ],
            "de": [
                  "Neueste Spielversion für das in Patchnotes genannte Eventverhalten",
                  "Event-Center-Zugang"
            ]
      },
      neededItems: {
            "en": [
                  "Task-specific activity items",
                  "Daily activity time",
                  "Event attempts where shown"
            ],
            "de": [
                  "Aufgabenspezifische Aktivitätsitems",
                  "Tägliche Aktivitätszeit",
                  "Eventversuche, wenn angezeigt"
            ]
      },
      preparation: {
            "en": [
                  "Update the app before the event",
                  "Check task progress after each activity type"
            ],
            "de": [
                  "App vor dem Event aktualisieren",
                  "Aufgabenfortschritt nach jeder Aktivitätsart prüfen"
            ]
      },
      walkthrough: {
            "en": [
                  "Open Partner Paradise in the Event Center",
                  "Complete listed tasks in order of cheapest progress",
                  "Claim rewards after each completed stage"
            ],
            "de": [
                  "Partnerparadies im Event Center öffnen",
                  "Aufgaben nach günstigstem Fortschritt erledigen",
                  "Belohnungen nach jeder abgeschlossenen Stufe abholen"
            ]
      },
      watchouts: {
            "en": [
                  "Patch notes specifically mention task-progress optimization, so older task lists may be outdated",
                  "Do not assume every task counts retroactively"
            ],
            "de": [
                  "Patchnotes nennen speziell Aufgabenfortschritt-Optimierung, ältere Aufgabenlisten können veraltet sein",
                  "Nicht davon ausgehen, dass jede Aufgabe rueckwirkend zaehlt"
            ]
      },
      exactRewards: {
            "en": [
                  "Partner Paradise task rewards",
                  "Stage rewards shown in the event"
            ],
            "de": [
                  "Partner-Paradise-Aufgabenbelohnungen",
                  "Im Event angezeigte Stufenbelohnungen"
            ]
      },
      sourceLinks: [
        {
          title: {
            en: 'Official v2.4.300 Patch Notes - Partner Paradise',
            de: 'Offizielle v2.4.300 Patchnotes - Partner Paradise',
          },
          url: 'https://tilessurvive.com/en/blog/807',
          note: {
            en: 'Mentions Partner Paradise task-progress optimizations and update requirement.',
            de: 'Nennt Partner-Paradise-Aufgabenfortschritt und Update-Anforderung.',
          },
        },
      ],
      sourceNote: eventSourceNote,
    },
  },
  {
    id: 'event-invite-your-friends',
    type: 'event',
    slug: 'invite-your-friends',
    route: '/events/invite-your-friends',
    status: 'researched',
    ownerId: 'system',
    updatedAt: '2026-07-26',
    featured: false,
    title: { en: 'Invite Your Friends', de: 'Freunde einladen' },
    summary: { en: 'A social invite event in the Event Center with rewards for bringing new players into Tiles Survive.', de: 'Ein soziales Invite-Event im Event Center mit Belohnungen für eingeladene neue Spieler.' },
    tags: ['events', 'social', 'invite', 'event-center'],
    details: {
      beginnerBasics: {
        en: 'Invite Your Friends is a social event. It is not about fighting or farming; it rewards tracked invitations. Beginners must use the official in-game invite flow so the game can count progress.',
        de: 'Freunde einladen ist ein soziales Event. Es geht nicht um Kämpfen oder Farmen, sondern um getrackte Einladungen. Anfänger müssen den offiziellen Ingame-Invite-Ablauf nutzen, damit das Spiel Fortschritt zählen kann.'
      },
      beginnerSteps: {
        en: [
          'Open the invite event.',
          'Copy the official invite link or code.',
          'Send that exact link to a new player.',
          'Wait until the event registers progress.',
          'Claim milestones only after progress appears.'
        ],
        de: [
          'Öffne das Invite-Event.',
          'Kopiere den offiziellen Invite-Link oder Code.',
          'Sende genau diesen Link an einen neuen Spieler.',
          'Warte, bis das Event Fortschritt registriert.',
          'Hole Meilensteine erst ab, wenn Fortschritt sichtbar ist.'
        ]
      },
      beginnerSpendPlan: {
        en: [
          'Usually no rare combat items are needed.',
          'Do not buy anything until the event shows what reward tier you can reach.',
          'Focus on correct tracking instead of speed.'
        ],
        de: [
          'Normalerweise brauchst du keine seltenen Kampfitems.',
          'Kaufe nichts, bevor das Event zeigt, welche Belohnungsstufe du erreichen kannst.',
          'Konzentriere dich auf korrektes Tracking statt Geschwindigkeit.'
        ]
      },
      beginnerMistakes: {
        en: [
          'Sending a normal app link instead of the tracked invite link.',
          'Inviting players who are not eligible.',
          'Expecting rewards before the friend completes required progress.'
        ],
        de: [
          'Einen normalen App-Link statt des getrackten Invite-Links senden.',
          'Spieler einladen, die nicht berechtigt sind.',
          'Belohnungen erwarten, bevor der Freund den nötigen Fortschritt erreicht.'
        ]
      },
      goals: { en: ['Invite new players', 'Follow event tracking rules', 'Claim eligible invite rewards'], de: ['Neue Spieler einladen', 'Event-Tracking-Regeln beachten', 'Berechtigte Invite-Belohnungen claimen'] },
      rewards: { en: ['Exclusive invite rewards', 'Pathfinder Frame chance or reward depending on event rules'], de: ['Exklusive Invite-Belohnungen', 'Pathfinder Frame je nach Eventregeln als Chance oder Belohnung'] },
      strategy: { en: 'Use the in-game invite link or official event flow so progress is tracked correctly. Manual invites may not count.', de: 'Den Ingame-Invite-Link oder offiziellen Eventablauf nutzen, damit Fortschritt korrekt getrackt wird. Manuelle Einladungen zählen eventuell nicht.' },
      requirements: {
            "en": [
                  "Event Center invite event active",
                  "New players must use the tracked invite flow"
            ],
            "de": [
                  "Invite-Event im Event Center aktiv",
                  "Neue Spieler müssen den getrackten Invite-Ablauf nutzen"
            ]
      },
      neededItems: {
            "en": [
                  "Official invite link or code",
                  "Friends who create or bind eligible accounts"
            ],
            "de": [
                  "Offizieller Invite-Link oder Code",
                  "Freunde, die berechtigte Accounts erstellen oder verbinden"
            ]
      },
      preparation: {
            "en": [
                  "Copy the in-game invite link",
                  "Explain to friends that manual installs may not count"
            ],
            "de": [
                  "Ingame-Invite-Link kopieren",
                  "Freunden erklaeren, dass manuelle Installationen eventuell nicht zählen"
            ]
      },
      walkthrough: {
            "en": [
                  "Open Invite Your Friends in the Event Center",
                  "Send the tracked link",
                  "Wait for the event to register progress",
                  "Claim milestones"
            ],
            "de": [
                  "Freunde einladen im Event Center öffnen",
                  "Getrackten Link senden",
                  "Warten, bis das Event Fortschritt registriert",
                  "Meilensteine claimen"
            ]
      },
      watchouts: {
            "en": [
                  "Tracking matters more than the invite itself",
                  "Reward eligibility can require a new player or certain progress"
            ],
            "de": [
                  "Tracking ist wichtiger als die Einladung selbst",
                  "Belohnungsberechtigung kann einen neuen Spieler oder bestimmten Fortschritt verlangen"
            ]
      },
      exactRewards: {
            "en": [
                  "Exclusive invite rewards",
                  "Pathfinder Frame reward or chance mentioned in official notes"
            ],
            "de": [
                  "Exklusive Invite-Belohnungen",
                  "Pathfinder Frame als Belohnung oder Chance laut offiziellen Notes"
            ]
      },
      sourceLinks: [
        {
          title: {
            en: 'Official v2.5.600 Patch Notes - Invite Your Friends',
            de: 'Offizielle v2.5.600 Patchnotes - Invite Your Friends',
          },
          url: 'https://tilessurvive.com/en/blog/1055',
          note: {
            en: 'Mentions Invite Your Friends as live in the Event Center and the Pathfinder Frame reward.',
            de: 'Nennt Invite Your Friends als live im Event Center und Pathfinder-Frame-Belohnung.',
          },
        },
      ],
      sourceNote: eventSourceNote,
    },
  },
  {
    id: 'event-rising-legend',
    type: 'event',
    slug: 'rising-legend',
    route: '/events/rising-legend',
    status: 'researched',
    ownerId: 'system',
    updatedAt: '2026-07-26',
    featured: false,
    title: { en: 'Rising Legend', de: 'Aufsteigende Legende' },
    summary: { en: 'A premier competition event named through community selection, with qualifiers and multi-faction battlefield phases.', de: 'Ein großes Wettkampf-Event, dessen Name per Community-Auswahl festgelegt wurde, mit Qualifiern und Multi-Faction-Battlefield-Phasen.' },
    tags: ['events', 'competition', 'qualifiers', 'pvp'],
    details: {
      beginnerBasics: {
        en: 'Rising Legend is a high-end competition event. Beginners may not be able to win, but they still need to understand registration, qualifiers, and battle phases so they do not waste resources at the wrong time.',
        de: 'Aufsteigende Legende ist ein großes Wettbewerbsevent. Anfänger werden es vielleicht nicht gewinnen, sollten aber Registrierung, Qualifier und Kampfphasen verstehen, damit sie Ressourcen nicht zum falschen Zeitpunkt verschwenden.'
      },
      beginnerSteps: {
        en: [
          'Check whether your account can register or qualify.',
          'Read the phase calendar.',
          'Do not spend before your phase is active.',
          'Follow alliance or state calls during battles.',
          'Claim qualifier and participation rewards.'
        ],
        de: [
          'Prüfe, ob dein Account registrieren oder sich qualifizieren kann.',
          'Lies den Phasenkalender.',
          'Gib nichts aus, bevor deine Phase aktiv ist.',
          'Befolge Allianz- oder State-Ansagen in Kämpfen.',
          'Hole Qualifier- und Teilnahmebelohnungen ab.'
        ]
      },
      beginnerSpendPlan: {
        en: [
          'Do not spend rare items immediately when the event appears.',
          'First read the task list and check which action gives points today.',
          'Spend only enough to reach the next good milestone unless your alliance has a coordinated push.',
          'Stop when the next reward costs more than it is worth for your account.'
        ],
        de: [
          'Gib seltene Items nicht sofort aus, nur weil das Event erscheint.',
          'Lies zuerst die Aufgabenliste und prüfe, welche Aktion heute wirklich Punkte gibt.',
          'Gib nur so viel aus, bis du den nächsten guten Meilenstein erreichst, außer deine Allianz macht einen gemeinsamen Push.',
          'Stoppe, wenn die nächste Belohnung mehr kostet, als sie deinem Account bringt.'
        ]
      },
      beginnerMistakes: {
        en: [
          'Spending for a phase you are not eligible for.',
          'Missing registration.',
          'Using premium buffs before the real battle window.'
        ],
        de: [
          'Für eine Phase ausgeben, für die du nicht berechtigt bist.',
          'Registrierung verpassen.',
          'Premium-Buffs vor dem echten Kampffenster nutzen.'
        ]
      },
      goals: { en: ['Register or qualify when available', 'Watch battle zone groupings', 'Prepare for later battlefield phases'], de: ['Registrieren oder qualifizieren, wenn verfügbar', 'Battle-Zone-Gruppen beobachten', 'Auf spätere Battlefield-Phasen vorbereiten'] },
      rewards: { en: ['Competition rewards', 'Qualifier progress rewards'], de: ['Wettkampfbelohnungen', 'Qualifier-Fortschrittsbelohnungen'] },
      strategy: { en: 'Treat this as a high-end competition. Confirm your server eligibility and registration window before planning resources around it.', de: 'Als High-End-Wettkampf behandeln. Serverberechtigung und Registrierungsfenster prüfen, bevor Ressourcen dafür geplant werden.' },
      requirements: {
            "en": [
                  "Eligible player or alliance status",
                  "Registration or qualifier access when the phase opens"
            ],
            "de": [
                  "Berechtigter Spieler- oder Allianzstatus",
                  "Registrierung oder Qualifier-Zugang, wenn die Phase öffnet"
            ]
      },
      neededItems: {
            "en": [
                  "Strong PvP teams",
                  "Healing speedups",
                  "Battle buffs",
                  "Time for qualifier and battlefield windows"
            ],
            "de": [
                  "Starke PvP-Teams",
                  "Heilungs-Speedups",
                  "Kampf-Buffs",
                  "Zeit für Qualifier- und Battlefield-Fenster"
            ]
      },
      preparation: {
            "en": [
                  "Check registration and battle zone grouping",
                  "Plan around qualifier schedule",
                  "Save high-value buffs for real fights"
            ],
            "de": [
                  "Registrierung und Battle-Zone-Gruppierung prüfen",
                  "Um den Qualifier-Zeitplan planen",
                  "Wertvolle Buffs für echte K?mpfe sparen"
            ]
      },
      walkthrough: {
            "en": [
                  "Register or qualify",
                  "Follow phase tasks and battlefield calls",
                  "Push when your bracket is active",
                  "Claim qualifier and competition rewards"
            ],
            "de": [
                  "Registrieren oder qualifizieren",
                  "Phasenaufgaben und Battlefield-Calls befolgen",
                  "Pushen, wenn dein Bracket aktiv ist",
                  "Qualifier- und Wettkampfbelohnungen abholen"
            ]
      },
      watchouts: {
            "en": [
                  "This is not a normal daily event; eligibility and grouping can exclude accounts",
                  "Do not spend before confirming the phase is open for you"
            ],
            "de": [
                  "Das ist kein normales Tages-Event; Berechtigung und Gruppierung können Accounts ausschliessen",
                  "Nicht ausgeben, bevor die Phase für dich offen ist"
            ]
      },
      exactRewards: {
            "en": [
                  "Qualifier rewards",
                  "Competition ranking rewards",
                  "Battlefield phase rewards"
            ],
            "de": [
                  "Qualifier-Belohnungen",
                  "Wettkampf-Rangbelohnungen",
                  "Battlefield-Phasenbelohnungen"
            ]
      },
      sourceLinks: [
        {
          title: {
            en: 'Official v2.5.200 Patch Notes - Rising Legend Qualifiers',
            de: 'Offizielle v2.5.200 Patchnotes - Rising-Legend-Qualifier',
          },
          url: 'https://tilesurvivegame.com/en/blog/975',
          note: {
            en: 'Mentions Rising Legend qualifiers and multi-faction battlefield.',
            de: 'Nennt Rising-Legend-Qualifier und Multi-Faction-Battlefield.',
          },
        },
      ],
      sourceNote: eventSourceNote,
    },
  },
  {
    id: 'event-alliance-siege',
    type: 'event',
    slug: 'alliance-siege',
    route: '/events/alliance-siege',
    status: 'researched',
    ownerId: 'system',
    updatedAt: '2026-07-26',
    featured: false,
    title: { en: 'Alliance Siege', de: 'Allianzbelagerung' },
    summary: { en: 'An alliance combat event with a defense lineup setup option referenced in official patch notes.', de: 'Ein Allianz-Kampf-Event mit Defense-Lineup-Setup laut offiziellen Patchnotes.' },
    tags: ['events', 'alliance', 'siege', 'defense'],
    details: {
      beginnerBasics: {
        en: 'Alliance Siege is an alliance combat event where your defense setup matters. Beginners should set a proper defense lineup before the event and update it whenever their heroes or troops improve.',
        de: 'Allianzbelagerung ist ein Allianz-Kampfevent, bei dem deine Verteidigungsaufstellung wichtig ist. Anfänger sollten vor dem Event ein gutes Defense Lineup setzen und es aktualisieren, wenn Helden oder Truppen stärker werden.'
      },
      beginnerSteps: {
        en: [
          'Open Alliance Siege before start.',
          'Set your best defense lineup.',
          'Check displayed defense power.',
          'Join during the event window and follow calls.',
          'Claim personal and alliance rewards.'
        ],
        de: [
          'Öffne Allianzbelagerung vor Start.',
          'Setze dein bestes Defense Lineup.',
          'Prüfe die angezeigte Verteidigungskraft.',
          'Nimm im Eventfenster teil und folge Ansagen.',
          'Hole persönliche und Allianzbelohnungen ab.'
        ]
      },
      beginnerSpendPlan: {
        en: [
          'Do not spend rare items immediately when the event appears.',
          'First read the task list and check which action gives points today.',
          'Spend only enough to reach the next good milestone unless your alliance has a coordinated push.',
          'Stop when the next reward costs more than it is worth for your account.'
        ],
        de: [
          'Gib seltene Items nicht sofort aus, nur weil das Event erscheint.',
          'Lies zuerst die Aufgabenliste und prüfe, welche Aktion heute wirklich Punkte gibt.',
          'Gib nur so viel aus, bis du den nächsten guten Meilenstein erreichst, außer deine Allianz macht einen gemeinsamen Push.',
          'Stoppe, wenn die nächste Belohnung mehr kostet, als sie deinem Account bringt.'
        ]
      },
      beginnerMistakes: {
        en: [
          'Leaving an old weak defense lineup active.',
          'Forgetting to update after upgrades.',
          'Ignoring alliance participation windows.'
        ],
        de: [
          'Ein altes schwaches Defense Lineup aktiv lassen.',
          'Nach Upgrades nicht aktualisieren.',
          'Allianz-Teilnahmefenster ignorieren.'
        ]
      },
      goals: { en: ['Set a proper defense lineup', 'Keep defense power updated', 'Coordinate alliance participation'], de: ['Passendes Defense Lineup setzen', 'Defense Power aktuell halten', 'Allianzteilnahme koordinieren'] },
      rewards: { en: ['Alliance Siege rewards'], de: ['Alliance-Siege-Belohnungen'] },
      strategy: { en: 'Review the defense preset before the event starts. Changes should update displayed defense power, so do not leave an old lineup active.', de: 'Defense Preset vor Eventstart prüfen. Änderungen sollten die angezeigte Defense Power aktualisieren, daher kein altes Lineup aktiv lassen.' },
      requirements: {
            "en": [
                  "Alliance participation",
                  "Defense lineup set before the event",
                  "Updated strongest teams"
            ],
            "de": [
                  "Allianzteilnahme",
                  "Defense Lineup vor dem Event gesetzt",
                  "Aktualisierte staerkste Teams"
            ]
      },
      neededItems: {
            "en": [
                  "Defense presets",
                  "Combat-ready heroes and troops",
                  "Healing or battle items depending on rules"
            ],
            "de": [
                  "Defense-Presets",
                  "Kampfbereite Helden und Truppen",
                  "Heilungs- oder Kampfitems je nach Regeln"
            ]
      },
      preparation: {
            "en": [
                  "Set the defense lineup early",
                  "Refresh displayed defense power after team changes",
                  "Coordinate who is online for attacks or defense"
            ],
            "de": [
                  "Defense Lineup früh setzen",
                  "Angezeigte Defense Power nach Teamaenderungen aktualisieren",
                  "Abstimmen, wer für Angriff oder Verteidigung online ist"
            ]
      },
      walkthrough: {
            "en": [
                  "Open Alliance Siege before start",
                  "Set or confirm defense lineup",
                  "Join the event window and follow alliance calls",
                  "Claim alliance and personal rewards"
            ],
            "de": [
                  "Alliance Siege vor Start öffnen",
                  "Defense Lineup setzen oder bestätigen",
                  "Im Eventfenster teilnehmen und Allianz-Calls befolgen",
                  "Allianz- und persönliche Belohnungen abholen"
            ]
      },
      watchouts: {
            "en": [
                  "An old defense preset can leave your account weaker than expected",
                  "Lineup power updates were specifically mentioned in patch notes"
            ],
            "de": [
                  "Ein altes Defense-Preset kann deinen Account schw?cher machen als erwartet",
                  "Lineup-Power-Updates wurden explizit in Patchnotes genannt"
            ]
      },
      exactRewards: {
            "en": [
                  "Alliance Siege rewards",
                  "Personal participation rewards",
                  "Alliance result rewards"
            ],
            "de": [
                  "Alliance-Siege-Belohnungen",
                  "Persönliche Teilnahmebelohnungen",
                  "Allianz-Ergebnisbelohnungen"
            ]
      },
      sourceLinks: [
        {
          title: {
            en: 'Official v2.4.800 Patch Notes - Alliance Siege defense lineup',
            de: 'Offizielle v2.4.800 Patchnotes - Alliance-Siege-Defense-Lineup',
          },
          url: 'https://tilessurvive.com/en/list',
          note: {
            en: 'Game-info list references Alliance Siege defense lineup optimization in v2.4.800 notes.',
            de: 'Die Game-Info-Liste nennt Alliance-Siege-Defense-Lineup-Optimierung in den v2.4.800-Notes.',
          },
        },
      ],
      sourceNote: eventSourceNote,
    },
  },

  {
    id: 'event-raise-your-dragon',
    type: 'event',
    slug: 'raise-your-dragon',
    route: '/events/raise-your-dragon',
    status: 'researched',
    ownerId: 'system',
    updatedAt: '2026-07-26',
    featured: false,
    title: { en: 'Raise Your Dragon', de: 'Drachen aufziehen' },
    summary: { en: 'A Season Event Center shortcut/event tied to dragon progression in Season II.', de: 'Ein Season-Event-Center-Shortcut/Event rund um Drachenfortschritt in Season II.' },
    tags: ['events', 'dragon', 'seasonal', 'progression'],
    details: {
      beginnerBasics: {
        en: 'Raise Your Dragon is a dragon progression shortcut or event in the Season Event Center. Beginners should use it like a daily growth checklist for dragon progress.',
        de: 'Drachen aufziehen ist ein Drachen-Fortschritts-Shortcut oder Event im Season Event Center. Anfänger sollten es wie eine tägliche Wachstums-Checkliste für Drachenfortschritt nutzen.'
      },
      beginnerSteps: {
        en: [
          'Open the Season Event Center.',
          'Use the Raise Your Dragon shortcut.',
          'Read the listed tasks.',
          'Complete free daily tasks first.',
          'Claim progress rewards before reset.'
        ],
        de: [
          'Öffne das Season Event Center.',
          'Nutze den Shortcut Drachen aufziehen.',
          'Lies die gelisteten Aufgaben.',
          'Erledige kostenlose Tagesaufgaben zuerst.',
          'Hole Fortschrittsbelohnungen vor Reset ab.'
        ]
      },
      beginnerSpendPlan: {
        en: [
          'Do not spend rare items immediately when the event appears.',
          'First read the task list and check which action gives points today.',
          'Spend only enough to reach the next good milestone unless your alliance has a coordinated push.',
          'Stop when the next reward costs more than it is worth for your account.'
        ],
        de: [
          'Gib seltene Items nicht sofort aus, nur weil das Event erscheint.',
          'Lies zuerst die Aufgabenliste und prüfe, welche Aktion heute wirklich Punkte gibt.',
          'Gib nur so viel aus, bis du den nächsten guten Meilenstein erreichst, außer deine Allianz macht einen gemeinsamen Push.',
          'Stoppe, wenn die nächste Belohnung mehr kostet, als sie deinem Account bringt.'
        ]
      },
      beginnerMistakes: {
        en: [
          'Spending dragon resources before checking milestones.',
          'Forgetting daily tasks.',
          'Assuming reward tables are identical on every server.'
        ],
        de: [
          'Drachenressourcen ausgeben, bevor Meilensteine geprüft sind.',
          'Tagesaufgaben vergessen.',
          'Annehmen, dass Belohnungstabellen auf jedem Server gleich sind.'
        ]
      },
      goals: { en: ['Open the Season Event Center', 'Raise or progress the dragon system when the event is active', 'Claim daily and milestone rewards'], de: ['Season Event Center öffnen', 'Drachensystem verbessern, wenn das Event aktiv ist', 'Tägliche und Meilensteinbelohnungen claimen'] },
      rewards: { en: ['Dragon progression rewards', 'Season event rewards'], de: ['Drachen-Fortschrittsbelohnungen', 'Saison-Eventbelohnungen'] },
      strategy: { en: 'Use this as a daily check-in event. Do not spend dragon resources until you know the current milestone and exchange limits.', de: 'Als tägliches Check-in-Event nutzen. Drachenressourcen erst ausgeben, wenn Meilenstein und Tauschlimits klar sind.' },
      requirements: { en: ['Season II or dragon event access on your server', 'Season Event Center available'], de: ['Season-II- oder Drachenevent-Zugang auf deinem Server', 'Season Event Center verfügbar'] },
      neededItems: { en: ['Dragon resources shown in the event', 'Daily activity attempts', 'Season event items if listed'], de: ['Im Event angezeigte Drachenressourcen', 'Tägliche Aktivitätsversuche', 'Saison-Eventitems, falls gelistet'] },
      preparation: { en: ['Check the event every day', 'Save rare dragon resources until a valuable milestone is reachable'], de: ['Event täglich prüfen', 'Seltene Drachenressourcen sparen, bis ein wertvoller Meilenstein erreichbar ist'] },
      walkthrough: { en: ['Open Season Event Center', 'Use the Raise Your Dragon shortcut', 'Complete listed tasks', 'Claim progress rewards before reset'], de: ['Season Event Center öffnen', 'Shortcut Drachen aufziehen nutzen', 'Gelistete Aufgaben erledigen', 'Fortschrittsbelohnungen vor Reset claimen'] },
      watchouts: { en: ['Official notes confirm the shortcut, but exact reward tables are server and event-round specific', 'Check the German in-game name because sources may use English'], de: ['Offizielle Notes bestätigen den Shortcut, aber genaue Reward-Tabellen sind server- und rundenabhängig', 'Deutschen Ingame-Namen prüfen, weil Quellen oft Englisch nutzen'] },
      exactRewards: { en: ['Dragon progression rewards', 'Season milestone rewards', 'Exact quantities shown in the active event'], de: ['Drachen-Fortschrittsbelohnungen', 'Saison-Meilensteinbelohnungen', 'Exakte Mengen stehen im aktiven Event'] },
      sourceLinks: [
        {
          title: { en: 'Official v2.5.700 Patch Notes - Raise Your Dragon', de: 'Offizielle v2.5.700 Patchnotes - Drachen aufziehen' },
          url: 'https://tilesurvivegame.com/en/blog/1078',
          note: { en: 'Mentions the Raise Your Dragon shortcut in the Season Event Center.', de: 'Nennt den Drachen-aufziehen-Shortcut im Season Event Center.' },
        },
      ],
      sourceNote: eventSourceNote,
    },
  },
  {
    id: 'event-dragon-calamity',
    type: 'event',
    slug: 'dragon-calamity',
    route: '/events/dragon-calamity',
    status: 'researched',
    ownerId: 'system',
    updatedAt: '2026-07-26',
    featured: false,
    title: { en: 'Dragon Calamity', de: 'Drachenkatastrophe' },
    summary: { en: 'A Season II dragon combat event with Rift enemies and dragon-related information screens.', de: 'Ein Season-II-Drachenkampf-Event mit Rift-Gegnern und drachenbezogenen Infoanzeigen.' },
    tags: ['events', 'dragon', 'seasonal', 'pve'],
    details: {
      beginnerBasics: {
        en: 'Dragon Calamity is a seasonal dragon combat event. You fight Rift enemies or dragon-related targets. Beginners should start with safe target levels and read enemy information before attacking.',
        de: 'Drachenkatastrophe ist ein saisonales Drachen-Kampfevent. Du kämpfst gegen Rift-Gegner oder drachenbezogene Ziele. Anfänger sollten mit sicheren Zielstufen starten und Gegnerinfos vor Angriffen lesen.'
      },
      beginnerSteps: {
        en: [
          'Open Dragon Calamity in the season area.',
          'Read the target information screen.',
          'Choose a target your formation can beat.',
          'Attack or rally according to the rules.',
          'Claim kill and season progress rewards.'
        ],
        de: [
          'Öffne Drachenkatastrophe im Saisonbereich.',
          'Lies den Ziel-Info-Screen.',
          'Wähle ein Ziel, das deine Formation schafft.',
          'Greife nach Eventregeln an oder rallye.',
          'Hole Kill- und Saisonfortschrittsbelohnungen ab.'
        ]
      },
      beginnerSpendPlan: {
        en: [
          'Do not spend rare items immediately when the event appears.',
          'First read the task list and check which action gives points today.',
          'Spend only enough to reach the next good milestone unless your alliance has a coordinated push.',
          'Stop when the next reward costs more than it is worth for your account.'
        ],
        de: [
          'Gib seltene Items nicht sofort aus, nur weil das Event erscheint.',
          'Lies zuerst die Aufgabenliste und prüfe, welche Aktion heute wirklich Punkte gibt.',
          'Gib nur so viel aus, bis du den nächsten guten Meilenstein erreichst, außer deine Allianz macht einen gemeinsamen Push.',
          'Stoppe, wenn die nächste Belohnung mehr kostet, als sie deinem Account bringt.'
        ]
      },
      beginnerMistakes: {
        en: [
          'Attacking targets that are too high.',
          'Skipping enemy information screens.',
          'Using attempts before your best team is selected.'
        ],
        de: [
          'Zu hohe Ziele angreifen.',
          'Gegner-Info-Screens überspringen.',
          'Versuche nutzen, bevor dein bestes Team ausgewählt ist.'
        ]
      },
      goals: { en: ['Fight dragon-calamity targets', 'Read Rift enemy information before attacking', 'Use dragon event progress efficiently'], de: ['Dragon-Calamity-Ziele bekämpfen', 'Rift-Gegnerinfos vor Angriffen lesen', 'Drachenevent-Fortschritt effizient nutzen'] },
      rewards: { en: ['Dragon event rewards', 'Seasonal progress rewards'], de: ['Drachenevent-Belohnungen', 'Saison-Fortschrittsbelohnungen'] },
      strategy: { en: 'Treat Rift enemies like event bosses: check power, use correct teams, and do not waste attempts on targets too high for your account.', de: 'Rift-Gegner wie Eventbosse behandeln: Power prüfen, passende Teams nutzen und Versuche nicht an zu hohen Zielen verschwenden.' },
      requirements: { en: ['Season II: Awakening of Dragons active', 'Enough combat power for current Rift targets'], de: ['Season II: Awakening of Dragons aktiv', 'Genug Kampfkraft für aktuelle Rift-Ziele'] },
      neededItems: { en: ['Event attempts or stamina where shown', 'Best PvE formations', 'Healing or recovery items if the fight causes losses'], de: ['Eventversuche oder Ausdauer, wenn angezeigt', 'Beste PvE-Formationen', 'Heilungs- oder Recovery-Items, falls der Kampf Verluste verursacht'] },
      preparation: { en: ['Inspect Rift Crawler, Rift Stalker, Rift Ravager, and Rift Dragon information screens', 'Start with a safe target level'], de: ['Infoanzeigen für Rift Crawler, Rift Stalker, Rift Ravager und Rift Dragon prüfen', 'Mit sicherer Zielstufe starten'] },
      walkthrough: { en: ['Open Dragon Calamity in the season area', 'Pick a target your formation can beat', 'Attack or rally according to event rules', 'Claim kill, progress, and season rewards'], de: ['Dragon Calamity im Saisonbereich öffnen', 'Ziel wählen, das deine Formation schafft', 'Nach Eventregeln angreifen oder rallyn', 'Kill-, Fortschritts- und Saisonbelohnungen abholen'] },
      watchouts: { en: ['Patch notes mention several information-screen optimizations, so read the target details before fighting', 'Event availability depends on season/server age'], de: ['Patchnotes nennen mehrere Info-Screen-Optimierungen, daher Zielinfos vor dem Kampf lesen', 'Eventverfügbarkeit hängt von Saison und Serveralter ab'] },
      exactRewards: { en: ['Dragon Calamity rewards', 'Seasonal progression rewards', 'Exact quantities shown in the active event'], de: ['Dragon-Calamity-Belohnungen', 'Saison-Fortschrittsbelohnungen', 'Exakte Mengen stehen im aktiven Event'] },
      sourceLinks: [
        {
          title: { en: 'Official v2.5.700 Patch Notes - Dragon Calamity', de: 'Offizielle v2.5.700 Patchnotes - Dragon Calamity' },
          url: 'https://tilesurvivegame.com/en/blog/1078',
          note: { en: 'Mentions Dragon Calamity optimizations in Season II and Rift enemy information screens.', de: 'Nennt Dragon-Calamity-Optimierungen in Season II und Rift-Gegner-Infoanzeigen.' },
        },
      ],
      sourceNote: eventSourceNote,
    },
  },
  {
    id: 'event-state-transfer',
    type: 'event',
    slug: 'state-transfer',
    route: '/events/state-transfer',
    status: 'researched',
    ownerId: 'system',
    updatedAt: '2026-07-26',
    featured: false,
    title: { en: 'State Transfer', de: 'Staatenwechsel' },
    summary: { en: 'A server/state migration event whose schedule can differ by State.', de: 'Ein Server- beziehungsweise State-Wechsel-Event, dessen Zeitplan je nach State abweichen kann.' },
    tags: ['events', 'state', 'account', 'schedule'],
    details: {
      beginnerBasics: {
        en: 'State Transfer is not a normal reward event. It lets eligible accounts move to another State during a limited schedule. Beginners must be careful because the decision affects where the account lives.',
        de: 'Staatenwechsel ist kein normales Belohnungsevent. Es erlaubt berechtigten Accounts, während eines begrenzten Zeitplans in einen anderen State zu wechseln. Anfänger müssen vorsichtig sein, weil die Entscheidung bestimmt, wo der Account spielt.'
      },
      beginnerSteps: {
        en: [
          'Read the event schedule for your State.',
          'Check account requirements and target-State limits.',
          'Talk to the destination alliance before transferring.',
          'Confirm cost and restrictions.',
          'Transfer only when you are sure.'
        ],
        de: [
          'Lies den Eventzeitplan deines States.',
          'Prüfe Account-Anforderungen und Ziel-State-Limits.',
          'Sprich vor dem Wechsel mit der Zielallianz.',
          'Bestätige Kosten und Einschränkungen.',
          'Wechsle nur, wenn du sicher bist.'
        ]
      },
      beginnerSpendPlan: {
        en: [
          'Do not buy transfer items before confirming eligibility.',
          'Do not spend resources preparing for a State you may not enter.',
          'The value is relocation, not normal milestone rewards.'
        ],
        de: [
          'Kaufe keine Transferitems, bevor Berechtigung bestätigt ist.',
          'Gib keine Ressourcen für einen State aus, den du vielleicht nicht betreten kannst.',
          'Der Wert ist der Wechsel, nicht normale Meilensteinbelohnungen.'
        ]
      },
      beginnerMistakes: {
        en: [
          'Choosing a target State without an alliance plan.',
          'Missing the schedule for your State.',
          'Assuming the transfer can be undone easily.'
        ],
        de: [
          'Ein Ziel-State ohne Allianzplan wählen.',
          'Den Zeitplan deines States verpassen.',
          'Annehmen, dass der Wechsel leicht rückgängig ist.'
        ]
      },
      goals: { en: ['Move to an eligible target State during the event window', 'Check transfer limits and account requirements', 'Avoid missing the schedule for your State'], de: ['In ein berechtigtes Ziel-State während des Eventfensters wechseln', 'Transferlimits und Account-Anforderungen prüfen', 'Zeitplan deines States nicht verpassen'] },
      rewards: { en: ['No normal farming reward focus; value is account relocation'], de: ['Kein normales Farming-Belohnungsziel; der Wert ist der Account-Wechsel'] },
      strategy: { en: 'Do not start spending around migration until you know your State schedule and target-State rules.', de: 'Rund um Migration nicht planen oder ausgeben, bevor Zeitplan und Ziel-State-Regeln klar sind.' },
      requirements: { en: ['State Transfer event active for your State', 'Eligible account and target State according to in-game rules'], de: ['State-Transfer-Event für dein State aktiv', 'Berechtigter Account und Ziel-State nach Ingame-Regeln'] },
      neededItems: { en: ['Transfer item or ticket if required by the current rules', 'Open target-State slot'], de: ['Transferitem oder Ticket, falls aktuelle Regeln es verlangen', 'Freier Ziel-State-Slot'] },
      preparation: { en: ['Read the event schedule', 'Coordinate with the destination alliance', 'Check whether rankings, resources, or troops have limits'], de: ['Eventzeitplan lesen', 'Mit Zielallianz abstimmen', 'Prüfen, ob Rankings, Ressourcen oder Truppen Limits haben'] },
      walkthrough: { en: ['Open State Transfer when it is active', 'Choose an eligible target State', 'Confirm costs and restrictions', 'Complete transfer before the event window closes'], de: ['State Transfer öffnen, wenn aktiv', 'Berechtigtes Ziel-State wählen', 'Kosten und Einschränkungen bestätigen', 'Transfer vor Ende des Eventfensters abschließen'] },
      watchouts: { en: ['Official notes say the schedule varies by State', 'A wrong target can be hard or impossible to undo during the same event'], de: ['Offizielle Notes sagen, dass der Zeitplan je State variiert', 'Ein falsches Ziel kann im selben Event schwer oder gar nicht rückgängig sein'] },
      exactRewards: { en: ['Account relocation', 'Any current compensation or bonus is shown only in the active transfer screen'], de: ['Account-Wechsel', 'Aktuelle Kompensation oder Boni stehen nur im aktiven Transfer-Screen'] },
      sourceLinks: [
        {
          title: { en: 'Official v2.4.500 Patch Notes - State Transfer', de: 'Offizielle v2.4.500 Patchnotes - State Transfer' },
          url: 'https://tilesurvivegame.com/en/blog/849',
          note: { en: 'Mentions State Transfer and that event schedules vary by State.', de: 'Nennt State Transfer und dass Eventzeitpläne je State variieren.' },
        },
      ],
      sourceNote: eventSourceNote,
    },
  },
  {
    id: 'event-survivor-showcase',
    type: 'event',
    slug: 'survivor-showcase',
    route: '/events/survivor-showcase',
    status: 'researched',
    ownerId: 'system',
    updatedAt: '2026-07-26',
    featured: false,
    title: { en: 'Survivor Showcase', de: 'Survivor Showcase' },
    summary: { en: 'A named event/system visible in official game-info listings and app descriptions; detailed reward tables still need in-game confirmation.', de: 'Ein in offiziellen Game-Info-Listen und App-Beschreibungen genanntes Event/System; genaue Reward-Tabellen brauchen noch Ingame-Bestätigung.' },
    tags: ['events', 'survivor', 'collection', 'needs-verification'],
    details: {
      beginnerBasics: {
        en: 'Survivor Showcase is a draft guide entry because public details are limited. Beginners should treat it as a task or showcase event and wait for the live event screen before spending survivor resources.',
        de: 'Survivor Showcase ist ein Draft-Guideeintrag, weil öffentliche Details begrenzt sind. Anfänger sollten es als Aufgaben- oder Showcase-Event behandeln und auf den Live-Eventscreen warten, bevor Survivor-Ressourcen ausgegeben werden.'
      },
      beginnerSteps: {
        en: [
          'Open the event when it appears.',
          'Read the task list carefully.',
          'Check whether upgrades, collection, or display actions give progress.',
          'Complete cheap tasks first.',
          'Note which rewards and milestones are active in your current event round.'
        ],
        de: [
          'Öffne das Event, wenn es erscheint.',
          'Lies die Aufgabenliste sorgfältig.',
          'Prüfe, ob Upgrades, Sammlung oder Anzeigeaktionen Fortschritt geben.',
          'Erledige günstige Aufgaben zuerst.',
          'Merke dir, welche Belohnungen und Meilensteine in deiner aktuellen Eventrunde aktiv sind.'
        ]
      },
      beginnerSpendPlan: {
        en: [
          'Do not spend rare items immediately when the event appears.',
          'First read the task list and check which action gives points today.',
          'Spend only enough to reach the next good milestone unless your alliance has a coordinated push.',
          'Stop when the next reward costs more than it is worth for your account.'
        ],
        de: [
          'Gib seltene Items nicht sofort aus, nur weil das Event erscheint.',
          'Lies zuerst die Aufgabenliste und prüfe, welche Aktion heute wirklich Punkte gibt.',
          'Gib nur so viel aus, bis du den nächsten guten Meilenstein erreichst, außer deine Allianz macht einen gemeinsamen Push.',
          'Stoppe, wenn die nächste Belohnung mehr kostet, als sie deinem Account bringt.'
        ]
      },
      beginnerMistakes: {
        en: [
          'Spending survivor resources before tasks are visible.',
          'Trusting incomplete public information more than the in-game screen.',
          'Ignoring German in-game names.'
        ],
        de: [
          'Survivor-Ressourcen ausgeben, bevor Aufgaben sichtbar sind.',
          'Unvollständigen öffentlichen Infos mehr vertrauen als dem Ingame-Screen.',
          'Deutsche Ingame-Namen ignorieren.'
        ]
      },
      goals: { en: ['Open the event when it appears', 'Check whether progress is tied to survivor collection, upgrades, or display tasks'], de: ['Event öffnen, wenn es erscheint', 'Prüfen, ob Fortschritt an Survivor-Sammlung, Upgrades oder Anzeigeaufgaben gebunden ist'] },
      rewards: { en: ['Showcase rewards shown in the active event'], de: ['Showcase-Belohnungen aus dem aktiven Event'] },
      strategy: { en: 'Because public details are thin, do not spend rare survivor resources until the in-game task list is visible.', de: 'Da öffentliche Details knapp sind, seltene Survivor-Ressourcen erst ausgeben, wenn die Ingame-Aufgabenliste sichtbar ist.' },
      requirements: { en: ['Event visible on your server', 'Relevant survivor feature unlocked'], de: ['Event auf deinem Server sichtbar', 'Passende Survivor-Funktion freigeschaltet'] },
      neededItems: { en: ['Survivor resources if requested by tasks', 'Collection or upgrade materials shown in event'], de: ['Survivor-Ressourcen, falls Aufgaben sie verlangen', 'Sammlungs- oder Upgrade-Materialien aus dem Event'] },
      preparation: { en: ['Check the German event page when it appears', 'Save upgrade materials until tasks are confirmed'], de: ['Deutsche Eventseite prüfen, wenn sie erscheint', 'Upgrade-Materialien sparen, bis Aufgaben bestätigt sind'] },
      walkthrough: { en: ['Open Survivor Showcase', 'Read task list', 'Complete cheapest non-rare tasks first', 'Claim milestones'], de: ['Survivor Showcase öffnen', 'Aufgabenliste lesen', 'Günstigste Aufgaben ohne seltene Items zuerst erledigen', 'Meilensteine claimen'] },
      watchouts: { en: ['This entry is marked draft because exact mechanics are not fully published in the sources found', 'Use in-game German names as the final authority'], de: ['Dieser Eintrag ist Draft, weil exakte Mechaniken in gefundenen Quellen nicht voll veröffentlicht sind', 'Deutsche Ingame-Namen sind die wichtigste Referenz'] },
      exactRewards: { en: ['Exact rewards depend on the active event round', 'Active event milestone rewards'], de: ['Exakte Belohnungen hängen von der aktiven Eventrunde ab', 'Aktive Event-Meilensteinbelohnungen'] },
      sourceLinks: [
        {
          title: { en: 'Official Tiles Survive Game Info List - Survivor Showcase references', de: 'Offizielle Tiles-Survive-Game-Info-Liste - Survivor-Showcase-Hinweise' },
          url: 'https://tilessurvive.com/en/list',
          note: { en: 'Public game-info list references Survivor Showcase in update/news entries.', de: 'Öffentliche Game-Info-Liste verweist in Update-/News-Einträgen auf Survivor Showcase.' },
        },
      ],
      sourceNote: eventSourceNote,
    },
  },
  {
    id: 'event-ghoulion-pursuit',
    type: 'event',
    slug: 'ghoulion-pursuit',
    route: '/events/ghoulion-pursuit',
    status: 'researched',
    ownerId: 'system',
    updatedAt: '2026-07-26',
    featured: false,
    title: { en: 'Ghoulion Pursuit', de: 'Ghoulion-Jagd' },
    summary: { en: 'A rotating event mentioned in public event-spending guides; exact in-game mechanics still need confirmation from a live German event screen.', de: 'Ein rotierendes Event aus öffentlichen Event-Spending-Guides; genaue Mechaniken brauchen noch Bestätigung durch einen aktuellen deutschen Eventscreen.' },
    tags: ['events', 'rotation', 'pve', 'needs-verification'],
    details: {
      beginnerBasics: {
        en: 'Ghoulion Pursuit is marked as draft because the available source confirms the rotation but not the full reward table. Beginners should wait until it appears in their Event Center before spending.',
        de: 'Ghoulion-Jagd ist als Draft markiert, weil die verfügbare Quelle die Rotation bestätigt, aber nicht die komplette Belohnungstabelle. Anfänger sollten warten, bis es im eigenen Event Center erscheint, bevor sie ausgeben.'
      },
      beginnerSteps: {
        en: [
          'Open the event only when it appears on your server.',
          'Read the current task list.',
          'Check what currency or attempts are required.',
          'Complete low-cost tasks first.',
          'Stop at your planned milestone.'
        ],
        de: [
          'Öffne das Event erst, wenn es auf deinem Server erscheint.',
          'Lies die aktuelle Aufgabenliste.',
          'Prüfe, welche Währung oder Versuche nötig sind.',
          'Erledige günstige Aufgaben zuerst.',
          'Stoppe am geplanten Meilenstein.'
        ]
      },
      beginnerSpendPlan: {
        en: [
          'Do not spend rare items immediately when the event appears.',
          'First read the task list and check which action gives points today.',
          'Spend only enough to reach the next good milestone unless your alliance has a coordinated push.',
          'Stop when the next reward costs more than it is worth for your account.'
        ],
        de: [
          'Gib seltene Items nicht sofort aus, nur weil das Event erscheint.',
          'Lies zuerst die Aufgabenliste und prüfe, welche Aktion heute wirklich Punkte gibt.',
          'Gib nur so viel aus, bis du den nächsten guten Meilenstein erreichst, außer deine Allianz macht einen gemeinsamen Push.',
          'Stoppe, wenn die nächste Belohnung mehr kostet, als sie deinem Account bringt.'
        ]
      },
      beginnerMistakes: {
        en: [
          'Assuming every server has the same rotation.',
          'Spending before the active reward pool is clear.',
          'Chasing a milestone without enough currency.'
        ],
        de: [
          'Annehmen, dass jeder Server dieselbe Rotation hat.',
          'Ausgeben, bevor der aktive Belohnungspool klar ist.',
          'Einen Meilenstein jagen, ohne genug Währung zu haben.'
        ]
      },
      goals: { en: ['Check the active Event Center task list', 'Spend only if Ghoulion rewards match your account needs', 'Record German event text when it appears'], de: ['Aktive Event-Center-Aufgabenliste prüfen', 'Nur ausgeben, wenn Ghoulion-Belohnungen zu deinem Account passen', 'Deutschen Eventtext sichern, wenn es erscheint'] },
      rewards: { en: ['Rotation rewards shown in the active event', 'Milestone rewards if the round uses milestones'], de: ['Rotationsbelohnungen aus dem aktiven Event', 'Meilensteinbelohnungen, falls die Runde Meilensteine nutzt'] },
      strategy: { en: 'Treat this as unverified until your server shows it. Save rare event currency unless the reward pool is clearly better than other rotations.', de: 'Bis zur Anzeige auf deinem Server als unverifiziert behandeln. Seltene Eventwährung sparen, außer der Reward-Pool ist klar besser als andere Rotationen.' },
      requirements: { en: ['Event active on your server', 'Event Center access'], de: ['Event auf deinem Server aktiv', 'Event-Center-Zugang'] },
      neededItems: { en: ['Current event attempts or currency', 'Combat or activity resources requested by the task list'], de: ['Aktuelle Eventversuche oder Währung', 'Kampf- oder Aktivitätsressourcen aus der Aufgabenliste'] },
      preparation: { en: ['Wait for the live event screen before spending', 'Compare milestone costs with saved currency'], de: ['Live-Eventscreen abwarten, bevor du ausgibst', 'Meilensteinkosten mit gesparter Währung vergleichen'] },
      walkthrough: { en: ['Open Ghoulion Pursuit when it appears', 'Read the active task list', 'Complete low-cost tasks first', 'Claim milestones and stop at your planned limit'], de: ['Ghoulion-Jagd öffnen, wenn sie erscheint', 'Aktive Aufgabenliste lesen', 'Günstige Aufgaben zuerst erledigen', 'Meilensteine claimen und am geplanten Limit stoppen'] },
      watchouts: { en: ['This is a draft entry because the available public source is not an official patch note', 'German event names may differ from English guide names'], de: ['Das ist ein Draft-Eintrag, weil die gefundene Quelle keine offizielle Patchnote ist', 'Deutsche Eventnamen können vom englischen Guide-Namen abweichen'] },
      exactRewards: { en: ['Exact rewards depend on the active event round', 'Public guide confirms it as an event rotation, not the reward table'], de: ['Exakte Belohnungen hängen von der aktiven Eventrunde ab', 'Der öffentliche Guide bestätigt die Rotation, nicht die Reward-Tabelle'] },
      sourceLinks: [
        {
          title: { en: 'Packsify Event Spending Guide - Ghoulion Pursuit rotation', de: 'Packsify Event-Spending-Guide - Ghoulion-Pursuit-Rotation' },
          url: 'https://www.packsify.com/blogs/tiles-survive-event-spending-guide',
          note: { en: 'Mentions Ghoulion Pursuit among event rotations; use as secondary source until official or in-game confirmation is added.', de: 'Nennt Ghoulion Pursuit in Event-Rotationen; als Sekundärquelle nutzen, bis offizielle oder Ingame-Bestätigung ergänzt ist.' },
        },
      ],
      sourceNote: eventSourceNote,
    },
  },
  {
    id: 'event-lucky-spin',
    type: 'event',
    slug: 'lucky-spin',
    route: '/events/lucky-spin',
    status: 'researched',
    ownerId: 'system',
    updatedAt: '2026-07-26',
    featured: false,
    title: { en: 'Lucky Spin', de: 'Glücksrad' },
    summary: { en: 'A spin-style event referenced by public game listings; exact wheel rewards depend on the active round.', de: 'Ein Spin-/Rad-Event aus öffentlichen Game-Listen; genaue Radbelohnungen hängen von der aktiven Runde ab.' },
    tags: ['events', 'spin', 'luck', 'needs-verification'],
    details: {
      beginnerBasics: {
        en: 'Lucky Spin is a wheel event. You spend spin tickets or currency for random rewards plus milestones. Beginners must understand that luck events can feel exciting but drain currency quickly.',
        de: 'Glücksrad ist ein Rad-Event. Du gibst Spin-Tickets oder Währung für zufällige Belohnungen plus Meilensteine aus. Anfänger müssen verstehen, dass Glücksevents spannend wirken, aber Währung schnell verbrauchen können.'
      },
      beginnerSteps: {
        en: [
          'Open Lucky Spin and inspect the reward pool.',
          'Check milestone rewards before spinning.',
          'Decide how many spins you can afford.',
          'Use single spins or quick spin only within that limit.',
          'Stop when your planned milestone is reached.'
        ],
        de: [
          'Öffne Glücksrad und prüfe den Belohnungspool.',
          'Prüfe Meilensteinbelohnungen vor dem Drehen.',
          'Entscheide, wie viele Spins du dir leisten kannst.',
          'Nutze Einzel- oder Quick-Spin nur innerhalb dieses Limits.',
          'Stoppe, wenn dein geplanter Meilenstein erreicht ist.'
        ]
      },
      beginnerSpendPlan: {
        en: [
          'Spend only if the visible top rewards help your account.',
          'Do not use premium currency just because you are close to a random prize.',
          'Set a spin limit before starting.'
        ],
        de: [
          'Gib nur aus, wenn die sichtbaren Hauptbelohnungen deinem Account helfen.',
          'Nutze Premiumwährung nicht nur, weil du nah an einem Zufallspreis bist.',
          'Setze vor dem Start ein Spin-Limit.'
        ]
      },
      beginnerMistakes: {
        en: [
          'Spinning without checking the reward pool.',
          'Chasing luck with premium currency.',
          'Stopping one milestone too late because the wheel feels close.'
        ],
        de: [
          'Drehen, ohne den Belohnungspool zu prüfen.',
          'Mit Premiumwährung Glück jagen.',
          'Einen Meilenstein zu spät stoppen, weil sich das Rad knapp anfühlt.'
        ]
      },
      goals: { en: ['Use spin attempts on a valuable reward pool', 'Stop after planned milestones', 'Check whether quick spin is available'], de: ['Spin-Versuche in einem wertvollen Belohnungspool nutzen', 'Nach geplanten Meilensteinen stoppen', 'Prüfen, ob Quick Spin verfügbar ist'] },
      rewards: { en: ['Wheel rewards', 'Milestone rewards', 'Round-specific rare prizes'], de: ['Radbelohnungen', 'Meilensteinbelohnungen', 'Rundenspezifische seltene Preise'] },
      strategy: { en: 'Only spin when the visible top rewards match what your account needs. Save attempts if the pool is weak.', de: 'Nur drehen, wenn die sichtbaren Hauptbelohnungen zu deinem Account passen. Versuche sparen, wenn der Pool schwach ist.' },
      requirements: { en: ['Lucky Spin active in Event Center', 'Spin attempts or event currency'], de: ['Glücksrad im Event Center aktiv', 'Spin-Versuche oder Eventwährung'] },
      neededItems: { en: ['Spin tickets or event currency', 'Optional premium currency if the event allows extra spins'], de: ['Spin-Tickets oder Eventwährung', 'Optional Premiumwährung, falls Extra-Spins möglich sind'] },
      preparation: { en: ['Inspect the reward pool before using tickets', 'Decide a hard stop point before spending'], de: ['Belohnungspool vor Ticketnutzung prüfen', 'Vor dem Ausgeben einen festen Stoppunkt festlegen'] },
      walkthrough: { en: ['Open Lucky Spin', 'Check reward pool and milestone bar', 'Use single or quick spin according to your plan', 'Claim milestones'], de: ['Glücksrad öffnen', 'Belohnungspool und Meilensteinleiste prüfen', 'Einzel- oder Quick-Spin nach Plan nutzen', 'Meilensteine claimen'] },
      watchouts: { en: ['This entry is draft until exact in-game rewards are confirmed', 'Luck events can drain premium currency quickly'], de: ['Dieser Eintrag bleibt Draft, bis genaue Ingame-Belohnungen bestätigt sind', 'Glücksevents können Premiumwährung schnell verbrauchen'] },
      exactRewards: { en: ['Exact wheel pool depends on the active round', 'Milestone rewards shown in event'], de: ['Exakter Radpool hängt von der aktiven Runde ab', 'Meilensteinbelohnungen im Event'] },
      sourceLinks: [
        {
          title: { en: 'Official Tiles Survive Game Info List - Lucky Spin references', de: 'Offizielle Tiles-Survive-Game-Info-Liste - Lucky-Spin-Hinweise' },
          url: 'https://tilessurvive.com/en/list',
          note: { en: 'Public game-info list references Lucky Spin in update/news entries.', de: 'Öffentliche Game-Info-Liste verweist in Update-/News-Einträgen auf Lucky Spin.' },
        },
      ],
      sourceNote: eventSourceNote,
    },
  },
  {
    id: 'hero-nikola',
    type: 'hero',
    slug: 'nikola',
    route: '/heroes/nikola',
    status: 'researched',
    ownerId: 'system',
    updatedAt: '2026-07-07',
    featured: true,
    title: { en: 'Nikola', de: 'Nikola' },
    summary: {
      en: 'S-Tier tempo fighter with burst pressure, attack-speed style scaling, and defensive passives for long fights.',
      de: 'S-Tier-Tempo-Kämpfer mit Burst-Druck, Angriffstempo-Skalierung und defensiven Passiven für lange Kämpfe.',
    },
    tags: ['heroes', 's-tier', 'damage', 'defense', 'pvp'],
    details: {
      tier: { en: 'S-Tier', de: 'S-Tier' },
      rarity: { en: 'High-tier / premium hero', de: 'High-Tier / Premium-Held' },
      role: { en: 'Burst damage, pressure, flexible frontline damage', de: 'Burst-Schaden, Druck, flexibler Frontline-Schaden' },
      bestFor: {
        en: ['Campaign pushing', 'PvP pressure', 'Long fights where defensive passives matter', 'Aggressive or defensive teams'],
        de: ['Kampagnenfortschritt', 'PvP-Druck', 'Lange Kämpfe mit wichtigen Defensiv-Passiven', 'Aggressive oder defensive Teams'],
      },
      strengths: {
        en: ['Strong rhythm-based damage window', 'Can raise attack speed or attack reach depending on skill timing', 'Has protective passive value', 'Works in both offensive and defensive playstyles'],
        de: ['Starkes schadensstarkes Timing-Fenster', 'Kann je nach Skill-Timing Angriffstempo oder Reichweite steigern', 'Bringt defensive passive Vorteile mit', 'Funktioniert offensiv und defensiv'],
      },
      weaknesses: {
        en: ['Needs correct timing to get full value', 'Likely gear- and level-hungry because his value comes from combat stats', 'Less beginner-proof than simple healers or pure tanks'],
        de: ['Braucht gutes Timing für vollen Wert', 'Vermutlich ausrüstungs- und levelhungrig, weil sein Wert aus Kampfwerten kommt', 'Weniger anfängerfreundlich als einfache Heiler oder reine Tanks'],
      },
      investment: {
        en: 'Very high. Prioritize if he is one of your first S-Tier pulls and you need a main damage carry.',
        de: 'Sehr hoch. Priorisieren, wenn er einer deiner ersten S-Tier-Pulls ist und du einen Haupt-Damage-Carry brauchst.',
      },
      equipment: {
        en: 'Prioritize Helmet for Attack first, then Armor/Greaves if he is exposed in front or midline fights.',
        de: 'Zuerst Helm für Angriff priorisieren, danach Rüstung/Beinschutz, wenn er in Front- oder Midline-Kämpfen viel Schaden nimmt.',
      },
      sourceNote: heroSourceNote,
    },
  },
  {
    id: 'hero-rosie',
    type: 'hero',
    slug: 'rosie',
    route: '/heroes/rosie',
    status: 'researched',
    ownerId: 'system',
    updatedAt: '2026-07-07',
    featured: true,
    title: { en: 'Rosie', de: 'Rosie' },
    summary: {
      en: 'S-Tier damage-sustain carry with double strikes, AoE Smash, and lifesteal that keeps her alive in hard fights.',
      de: 'S-Tier-Damage-Sustain-Carry mit Doppelschlägen, AoE-Smash und Lebensraub für harte Kämpfe.',
    },
    tags: ['heroes', 's-tier', 'lifesteal', 'aoe', 'carry'],
    details: {
      tier: { en: 'S-Tier', de: 'S-Tier' },
      rarity: { en: 'High-tier / premium hero', de: 'High-Tier / Premium-Held' },
      role: { en: 'Self-sustaining damage carry', de: 'Selbstheilender Damage-Carry' },
      bestFor: {
        en: ['Campaign', 'PvP', 'Late-game events', 'Teams that need one hero to carry damage and survival'],
        de: ['Kampagne', 'PvP', 'Late-Game-Events', 'Teams, die Schaden und Überleben in einem Helden brauchen'],
      },
      strengths: {
        en: ['Massive damage through double strikes', 'AoE Smash helps clear grouped enemies', 'Lifesteal gives strong sustain', 'Excellent all-around carry candidate'],
        de: ['Massiver Schaden durch Doppelschläge', 'AoE-Smash hilft gegen Gruppen', 'Lebensraub bringt starke Ausdauer', 'Sehr gute Allround-Carry-Kandidatin'],
      },
      weaknesses: {
        en: ['Can become the obvious target for enemy control or burst', 'Needs strong Attack gear because both damage and lifesteal scale with output', 'If underleveled, her sustain may not keep pace with burst damage'],
        de: ['Kann ein offensichtliches Ziel für Kontrolle oder Burst werden', 'Braucht starke Angriffsausrüstung, weil Schaden und Lebensraub vom Output abhängen', 'Unterlevelt hält ihre Ausdauer Burst-Schaden nicht zuverlässig stand'],
      },
      investment: {
        en: 'Top priority. A safe main-carry investment if you own her.',
        de: 'Top-Priorität. Eine sichere Haupt-Carry-Investition, wenn du sie besitzt.',
      },
      equipment: {
        en: 'Helmet first for Attack and lifesteal value; upgrade Armor and Greaves once she is your main campaign/PvP carry.',
        de: 'Helm zuerst für Angriff und Lebensraub-Wert; Rüstung und Beinschutz nachziehen, sobald sie dein Haupt-Carry ist.',
      },
      sourceNote: heroSourceNote,
    },
  },
  {
    id: 'hero-leyla',
    type: 'hero',
    slug: 'leyla',
    route: '/heroes/leyla',
    status: 'researched',
    ownerId: 'system',
    updatedAt: '2026-07-07',
    featured: true,
    title: { en: 'Layla', de: 'Layla' },
    summary: {
      en: 'S-Tier frontline life-support monster with HP scaling, reliable team healing, and top formation value.',
      de: 'S-Tier-Frontline-Lebensunterstützung mit HP-Skalierung, zuverlässiger Teamheilung und Top-Formationswert.',
    },
    tags: ['heroes', 's-tier', 'support', 'healing', 'attack-scaling'],
    details: {
      tier: { en: 'S-Tier', de: 'S-Tier' },
      rarity: { en: 'Limited / targeted recruitment candidate', de: 'Limited-/Targeted-Recruitment-Kandidatin' },
      role: { en: 'Frontline life support, team healer, sustain core', de: 'Frontline-Lebenssupport, Team-Heilerin, Sustain-Core' },
      bestFor: {
        en: ['PvP', 'Arena', 'Campaign', 'Guard/frontline formations', 'Lineups built around Rosie or Nikola'],
        de: ['PvP', 'Arena', 'Kampagne', 'Guard-/Frontline-Formationen', 'Aufstellungen rund um Rosie oder Nikola'],
      },
      strengths: {
        en: ['Core skill reportedly gives +26% bonus HP at level 30', 'Reliable team healing', 'Makes guard lines extremely durable', 'Stabilizes chaotic fights', 'Fits most top PvP, Arena, and Campaign formations'],
        de: ['Core-Skill gibt laut LDShop +26 % Bonus-HP auf Level 30', 'Zuverlässige Teamheilung', 'Macht Guard-Linien extrem langlebig', 'Stabilisiert chaotische Kämpfe', 'Passt in viele Top-PvP-, Arena- und Kampagnenformationen'],
      },
      weaknesses: {
        en: ['Does not replace a dedicated damage carry', 'Best value appears when the frontline and carry are already worth protecting', 'Exact HP-scaling values should be checked in-game after patches'],
        de: ['Ersetzt keinen dedizierten Damage-Carry', 'Bester Wert, wenn Frontline und Carry bereits schützenswert sind', 'Exakte HP-Skalierungswerte nach Patches im Spiel prüfen'],
      },
      investment: {
        en: 'Very high. Invest early if you lack sustain or want a stable PvP/campaign core.',
        de: 'Sehr hoch. Früh investieren, wenn dir Sustain fehlt oder du einen stabilen PvP-/Kampagnenkern willst.',
      },
      equipment: {
        en: 'Prioritize survivability if she is used as frontline life support; keep her alive so healing and HP scaling stay active.',
        de: 'Überlebensfähigkeit priorisieren, wenn sie als Frontline-Lebenssupport spielt; sie muss leben, damit Heilung und HP-Skalierung aktiv bleiben.',
      },
      sourceNote: heroSourceNote,
      heroStrategy: {
        en: 'Place Layla next to Nikola in sustain formations so her healing and support uptime protects the main tank.',
        de: 'Layla in Sustain-Formationen neben Nikola stellen, damit ihre Heilung und Support-Uptime den Haupttank schützt.',
      },
    },
  },
  {
    id: 'hero-tarzan',
    type: 'hero',
    slug: 'tarzan',
    route: '/heroes/tarzan',
    status: 'researched',
    ownerId: 'system',
    updatedAt: '2026-07-07',
    featured: true,
    title: { en: 'Tarzan', de: 'Tarzan' },
    summary: {
      en: 'S-Tier backline punisher with AoE burst and counter damage, but less self-sustain than Rosie.',
      de: 'S-Tier-Backline-Bestrafter mit AoE-Burst und Konterschaden, aber weniger Selbstheilung als Rosie.',
    },
    tags: ['heroes', 's-tier', 'aoe', 'counter', 'backline'],
    details: {
      tier: { en: 'S-Tier', de: 'S-Tier' },
      rarity: { en: 'High-tier / premium hero', de: 'High-Tier / Premium-Held' },
      role: { en: 'Backline burst, AoE punisher, counter fighter', de: 'Backline-Burst, AoE-Bestrafung, Konterkämpfer' },
      bestFor: {
        en: ['Killing weak supports and DPS heroes', 'Punishing clustered teams', 'PvP matchups where enemies hit into counters'],
        de: ['Schwache Supports und DPS-Helden ausschalten', 'Gruppierte Teams bestrafen', 'PvP-Matchups, in denen Gegner in Konter laufen'],
      },
      strengths: {
        en: ['High AoE burst', 'Threatens fragile backline units', 'Crushing Blow-style counter state punishes attackers', 'Splash counter damage creates pressure around him'],
        de: ['Hoher AoE-Burst', 'Bedroht fragile Backline-Einheiten', 'Konterzustand bestraft Angreifer', 'Splash-Konterschaden erzeugt Druck um ihn herum'],
      },
      weaknesses: {
        en: ['No Rosie-like self-heal was noted in public guides', 'Can need protection or healing support', 'Less valuable when enemies are spread out or very tanky'],
        de: ['Keine Rosie-ähnliche Selbstheilung in den öffentlichen Guides genannt', 'Kann Schutz oder Heil-Support brauchen', 'Weniger wertvoll gegen verteilte oder sehr tankige Gegner'],
      },
      investment: {
        en: 'High. Best when you already have sustain covered and need burst or PvP pressure.',
        de: 'Hoch. Am besten, wenn Sustain bereits abgedeckt ist und du Burst oder PvP-Druck brauchst.',
      },
      equipment: {
        en: 'Helmet for burst first; add Armor/Greaves if he often triggers counters under fire.',
        de: 'Helm zuerst für Burst; Rüstung/Beinschutz ergänzen, wenn er oft unter Beschuss kontert.',
      },
      sourceNote: heroSourceNote,
      heroStrategy: {
        en: 'Use Rosie in the middle back position in the sustain meta. She is safer there and gets better ultimate value while Nikola and Layla hold the front.',
        de: 'Rosie in der Sustain-Meta mittig hinten spielen. Dort ist sie sicherer und bekommt besseren Ultimate-Wert, während Nikola und Layla die Front halten.',
      },
    },
  },
  {
    id: 'hero-freja',
    type: 'hero',
    slug: 'freja',
    route: '/heroes/freja',
    status: 'researched',
    ownerId: 'system',
    updatedAt: '2026-07-07',
    featured: false,
    title: { en: 'Freja', de: 'Freja' },
    summary: {
      en: 'A strong SR/F2P-friendly fighter with double strikes and shielded AoE slashes.',
      de: 'Starke SR-/F2P-freundliche Kämpferin mit Doppelschlägen und geschützten AoE-Hieben.',
    },
    tags: ['heroes', 'a-tier', 'sr', 'f2p', 'aoe'],
    details: {
      tier: { en: 'A-Tier in the public list, described as unusually strong for SR', de: 'A-Tier in der öffentlichen Liste, für SR ungewöhnlich stark beschrieben' },
      rarity: { en: 'SR', de: 'SR' },
      role: { en: 'F2P damage fighter, AoE slasher', de: 'F2P-Damage-Fighter, AoE-Slasher' },
      bestFor: {
        en: ['Free-to-play squads', 'Early and mid-game campaign', 'Players without S-Tier carries'],
        de: ['Free-to-play-Teams', 'Early- und Midgame-Kampagne', 'Spieler ohne S-Tier-Carries'],
      },
      strengths: {
        en: ['Accessible compared with premium S-Tier heroes', 'Consistent double-strike damage', 'Shielded AoE slashes improve survival and wave clear', 'Good bridge hero until stronger pulls arrive'],
        de: ['Zugänglicher als Premium-S-Tier-Helden', 'Konstanter Doppelschlag-Schaden', 'Geschützte AoE-Hiebe verbessern Überleben und Waveclear', 'Guter Übergangsheld bis stärkere Pulls kommen'],
      },
      weaknesses: {
        en: ['May fall behind true S-Tier heroes at equal investment', 'Still needs skill books and gear to stay relevant', 'Public tier placement is inconsistent because the source praises her like S-Tier while listing her under A-Tier'],
        de: ['Kann echten S-Tier-Helden bei gleichem Investment unterliegen', 'Braucht trotzdem Skillbücher und Ausrüstung', 'Öffentliche Tier-Einordnung ist uneinheitlich, da die Quelle sie unter A-Tier listet, aber wie S-Tier lobt'],
      },
      investment: {
        en: 'High for F2P or early accounts; medium once you own several S-Tier heroes.',
        de: 'Hoch für F2P- oder frühe Accounts; mittel, sobald du mehrere S-Tier-Helden besitzt.',
      },
      equipment: {
        en: 'Balanced Attack and survivability. Do not overinvest Alloy gear if an S-Tier carry is coming soon.',
        de: 'Ausgewogen Angriff und Überleben. Alloy-Gear nicht überinvestieren, wenn bald ein S-Tier-Carry folgt.',
      },
      sourceNote: heroSourceNote,
      heroStrategy: {
        en: 'Use Tarzan on a back-side slot. He wants access to enemy backline targets but should not eat early frontline focus.',
        de: 'Tarzan auf einen seitlichen Backline-Slot stellen. Er will Zugriff auf gegnerische Backline-Ziele, sollte aber keinen frühen Frontline-Fokus abbekommen.',
      },
    },
  },
  {
    id: 'hero-candy',
    type: 'hero',
    slug: 'candy',
    route: '/heroes/candy',
    status: 'researched',
    ownerId: 'system',
    updatedAt: '2026-07-07',
    featured: false,
    title: { en: 'Candy', de: 'Candy' },
    summary: {
      en: 'A-Tier support who boosts carry damage through healing and critical-hit amplification.',
      de: 'A-Tier-Support, der Carry-Schaden durch Heilung und Krit-Verstärkung erhöht.',
    },
    tags: ['heroes', 'a-tier', 'support', 'healing', 'crit'],
    details: {
      tier: { en: 'A-Tier', de: 'A-Tier' },
      rarity: { en: 'Support hero', de: 'Support-Heldin' },
      role: { en: 'Hyper-carry enhancer, healer, critical amplifier', de: 'Hyper-Carry-Verstärkerin, Heilerin, Krit-Verstärkerin' },
      bestFor: {
        en: ['Teams built around Rosie, Nikola, Tarzan, or another main carry', 'Long fights where healing matters', 'Damage-race PvP lineups'],
        de: ['Teams rund um Rosie, Nikola, Tarzan oder einen anderen Haupt-Carry', 'Lange Kämpfe mit wichtigem Healing', 'PvP-Damage-Race-Aufstellungen'],
      },
      strengths: {
        en: ['Raises the damage ceiling of powerful carries', 'Adds healing while supporting offense', 'Excellent when paired with already-built DPS heroes'],
        de: ['Erhöht das Schadenslimit starker Carries', 'Bringt Heilung und offensiven Support', 'Sehr gut mit bereits aufgebauten DPS-Helden'],
      },
      weaknesses: {
        en: ['Less valuable without a strong carry to buff', 'Lower direct impact than a main DPS when roster power is low', 'Can be a poor first investment if your team lacks damage'],
        de: ['Weniger wertvoll ohne starken Carry zum Buffen', 'Geringerer direkter Effekt als ein Haupt-DPS bei schwachem Roster', 'Schwache Erstinvestition, wenn deinem Team Schaden fehlt'],
      },
      investment: {
        en: 'Medium to high. Invest after your main carry has levels, skills, and gear.',
        de: 'Mittel bis hoch. Investieren, nachdem dein Haupt-Carry Level, Skills und Ausrüstung hat.',
      },
      equipment: {
        en: 'Support gear can trail behind the carry; keep her alive enough to deliver buffs and healing.',
        de: 'Support-Ausrüstung darf hinter dem Carry liegen; sie muss lange genug leben, um Buffs und Heilung zu liefern.',
      },
      sourceNote: heroSourceNote,
      heroStrategy: {
        en: 'Freja is the sustain team bridge pick before Tara. Keep her opposite Tarzan in the backline for steady damage without exposing her.',
        de: 'Freja ist der Übergangspick im Sustain-Team vor Tara. Stelle sie gegenüber von Tarzan in die Backline für stetigen Schaden ohne unnötiges Risiko.',
      },
    },
  },
  {
    id: 'hero-kiki',
    type: 'hero',
    slug: 'kiki',
    route: '/heroes/kiki',
    status: 'researched',
    ownerId: 'system',
    updatedAt: '2026-07-07',
    featured: false,
    title: { en: 'Kiki', de: 'Kiki' },
    summary: {
      en: 'A-Tier AoE wave-clear hero built around piercing attacks and Beam Burst.',
      de: 'A-Tier-AoE-Waveclear-Heldin mit durchdringenden Angriffen und Beam Burst.',
    },
    tags: ['heroes', 'a-tier', 'aoe', 'wave-clear', 'burst'],
    details: {
      tier: { en: 'A-Tier', de: 'A-Tier' },
      rarity: { en: 'AoE damage hero', de: 'AoE-Damage-Heldin' },
      role: { en: 'Line-clearing burst DPS', de: 'Linien-Waveclear-Burst-DPS' },
      bestFor: {
        en: ['Monster waves', 'Exploration lanes', 'Enemy formations lined up in straight paths', 'Campaign stages with many small enemies'],
        de: ['Monsterwellen', 'Exploration-Lanes', 'Gegnerformationen in Linien', 'Kampagnenstufen mit vielen kleinen Gegnern'],
      },
      strengths: {
        en: ['Excellent wave clear', 'Piercing attacks reward good positioning', 'Beam Burst can remove tightly packed or straight-line enemies', 'Creates breathing room in difficult encounters'],
        de: ['Sehr guter Waveclear', 'Durchdringende Angriffe belohnen gutes Positioning', 'Beam Burst räumt enge oder lineare Gegnergruppen ab', 'Schafft Raum in schwierigen Kämpfen'],
      },
      weaknesses: {
        en: ['Less effective when enemies are spread out', 'May need tanks or control to keep enemies aligned', 'Pure burst can feel weaker against bosses if waves are not the problem'],
        de: ['Weniger effektiv gegen verstreute Gegner', 'Braucht eventuell Tanks oder Kontrolle, damit Gegner ausgerichtet bleiben', 'Reiner Burst wirkt gegen Bosse schwächer, wenn Wellen nicht das Problem sind'],
      },
      investment: {
        en: 'Medium to high. Great if your roster lacks wave clear; lower priority if Rosie or Tarzan already clears groups.',
        de: 'Mittel bis hoch. Sehr gut, wenn deinem Roster Waveclear fehlt; niedriger, wenn Rosie oder Tarzan Gruppen bereits räumen.',
      },
      equipment: {
        en: 'Helmet first for burst. Defensive gear can be delayed if she stays safely behind the frontline.',
        de: 'Helm zuerst für Burst. Defensive Ausrüstung kann warten, wenn sie sicher hinter der Front steht.',
      },
      sourceNote: heroSourceNote,
      heroStrategy: {
        en: 'Tara replaces Freja once unlocked in the full sustain meta, adding better utility, defensive value, and debuff pressure.',
        de: 'Tara ersetzt Freja in der Full-Sustain-Meta nach dem Freischalten und bringt bessere Utility, Defensive und Debuff-Druck.',
      },
    },
  },
  {
    id: 'hero-maddie',
    type: 'hero',
    slug: 'maddie',
    route: '/heroes/maddie',
    status: 'researched',
    ownerId: 'system',
    updatedAt: '2026-07-07',
    featured: false,
    title: { en: 'Maddie', de: 'Maddie' },
    summary: {
      en: 'B-Tier hybrid filler with some tanking, healing, and damage, but weak scaling later.',
      de: 'B-Tier-Hybrid-Füllerin mit etwas Tanken, Heilung und Schaden, aber schwacher später Skalierung.',
    },
    tags: ['heroes', 'b-tier', 'damage', 'healing', 'early-game'],
    details: {
      tier: { en: 'B-Tier', de: 'B-Tier' },
      rarity: { en: 'Damage hero', de: 'Damage-Heldin' },
      role: { en: 'Hybrid filler, early sustain/damage', de: 'Hybrid-Füllerin, früher Sustain/Schaden' },
      bestFor: {
        en: ['Early and mid-game accounts', 'Players missing S/A-tier damage options', 'Campaign filler slot'],
        de: ['Early- und Midgame-Accounts', 'Spieler ohne S-/A-Tier-Damage-Optionen', 'Kampagnen-Füllslot'],
      },
      strengths: {
        en: ['Covers several jobs at once early', 'Some tanking, healing, and damage', 'Useful before better supports arrive'],
        de: ['Deckt früh mehrere Aufgaben gleichzeitig ab', 'Etwas Tanken, Heilung und Schaden', 'Nützlich, bevor bessere Supports kommen'],
      },
      weaknesses: {
        en: ['Nothing scales especially well', 'Healing falls behind', 'Can collapse quickly in burst-heavy matchups', 'Later replaced by better supports'],
        de: ['Nichts skaliert besonders gut', 'Heilung fällt zurück', 'Kann in Burst-lastigen Matchups schnell fallen', 'Später von besseren Supports ersetzt'],
      },
      investment: {
        en: 'Medium. Build her if she is your best damage option, but avoid spending your rarest gear before you know your long-term carry.',
        de: 'Mittel. Baue sie, wenn sie deine beste Damage-Option ist, aber gib seltenstes Gear erst aus, wenn dein Langzeit-Carry klar ist.',
      },
      equipment: {
        en: 'Moderate Helmet upgrades are fine; save best Alloy gear for S-Tier carries.',
        de: 'Moderate Helm-Upgrades sind okay; bestes Alloy-Gear für S-Tier-Carries sparen.',
      },
      sourceNote: heroSourceNote,
    },
  },
  {
    id: 'hero-chef',
    type: 'hero',
    slug: 'chef',
    route: '/heroes/chef',
    status: 'researched',
    ownerId: 'system',
    updatedAt: '2026-07-07',
    featured: false,
    title: { en: 'Chef', de: 'Chef' },
    summary: {
      en: 'B-Tier early healing option with a heal/tank mix, useful at low levels but not a long-term core.',
      de: 'B-Tier-frühe Heiloption mit Heal-/Tank-Mix, nützlich auf niedrigen Stufen, aber kein langfristiger Core.',
    },
    tags: ['heroes', 'b-tier', 'sr', 'healing', 'production'],
    details: {
      tier: { en: 'B-Tier', de: 'B-Tier' },
      rarity: { en: 'SR', de: 'SR' },
      role: { en: 'Early healer, temporary frontline filler', de: 'Früher Heiler, temporärer Frontline-Füller' },
      bestFor: {
        en: ['Low-level stages', 'Early accounts needing healing', 'Temporary frontline coverage', 'Low-spend rosters'],
        de: ['Niedrige Stufen', 'Frühe Accounts mit Heilungsbedarf', 'Temporäre Frontline-Abdeckung', 'Low-Spend-Roster'],
      },
      strengths: {
        en: ['Heal plus tank mix helps early', 'Can stabilize low-level teams', 'Useful before stronger supports arrive'],
        de: ['Heal-plus-Tank-Mix hilft früh', 'Kann Low-Level-Teams stabilisieren', 'Nützlich, bevor stärkere Supports kommen'],
      },
      weaknesses: {
        en: ['Stats and tempo fall behind later', 'Quickly exposed in PvP', 'Not a long-term core'],
        de: ['Werte und Tempo halten später nicht mit', 'Wird im PvP schnell entlarvt', 'Kein langfristiger Core'],
      },
      investment: {
        en: 'Low to medium. Use him early, but plan to transition resources into stronger heroes.',
        de: 'Niedrig bis mittel. Früh nutzen, aber später Ressourcen in stärkere Helden verschieben.',
      },
      equipment: {
        en: 'Use spare gear. Do not prioritize your best Helmet/Armor unless he is your only healer.',
        de: 'Ersatzgear verwenden. Besten Helm/Rüstung nur priorisieren, wenn er dein einziger Heiler ist.',
      },
      sourceNote: heroSourceNote,
    },
  },
  {
    id: 'hero-becca',
    type: 'hero',
    slug: 'becca',
    route: '/heroes/becca',
    status: 'researched',
    ownerId: 'system',
    updatedAt: '2026-07-07',
    featured: false,
    title: { en: 'Becca', de: 'Becca' },
    summary: {
      en: 'A-Tier positional cannon whose straight-line ultimate melts grouped teams and finishes low-HP targets.',
      de: 'A-Tier-Positionskanone, deren Linien-Ulti gedrängte Teams schmilzt und Low-HP-Ziele finisht.',
    },
    tags: ['heroes', 'a-tier', 'crit', 'line-damage', 'finisher'],
    details: {
      tier: { en: 'A-Tier', de: 'A-Tier' },
      role: { en: 'Positional cannon, line DPS, finisher', de: 'Positionskanone, Linien-DPS, Finisher' },
      bestFor: { en: ['Grouped enemy teams', 'Straight lanes', 'Finishing targets below 30% HP'], de: ['Gedrängte Gegnerteams', 'Gerade Linien', 'Ziele unter 30 % HP finishen'] },
      strengths: { en: ['Ultimate can melt clustered teams', 'Heartseeker-style bonus crit against low-HP targets', 'High payoff when positioning is clean'], de: ['Ulti kann gruppierte Teams schmelzen', 'Heartseeker-artiger Bonus-Krit gegen Low-HP-Ziele', 'Hoher Ertrag bei sauberem Positioning'] },
      weaknesses: { en: ['Low durability', 'Less flexible in messy fights', 'Needs protection and lane setup'], de: ['Geringe Haltbarkeit', 'Weniger flexibel in chaotischen Kämpfen', 'Braucht Schutz und Linien-Setup'] },
      investment: { en: 'Medium to high if you can protect her and play around lane positioning.', de: 'Mittel bis hoch, wenn du sie schützen und um Linienpositionierung spielen kannst.' },
      equipment: { en: 'Helmet first for burst and finishing power; defensive gear only after your frontline is stable.', de: 'Helm zuerst für Burst und Finisher-Power; Defensive erst, wenn die Front stabil ist.' },
      sourceNote: heroSourceNote,
    },
  },
  {
    id: 'hero-eva',
    type: 'hero',
    slug: 'eva',
    route: '/heroes/eva',
    status: 'researched',
    ownerId: 'system',
    updatedAt: '2026-07-07',
    featured: false,
    title: { en: 'Eva', de: 'Eva' },
    summary: { en: 'B-Tier steady early PvE slot with consistent stats but little burst or utility.', de: 'B-Tier-Slot für frühes PvE mit konstanten Werten, aber wenig Burst oder Utility.' },
    tags: ['heroes', 'b-tier', 'early-game'],
    details: {
      tier: { en: 'B-Tier', de: 'B-Tier' },
      role: { en: 'Steady early PvE filler', de: 'Solider Early-PvE-Füller' },
      bestFor: { en: ['Early PvE', 'Temporary formation stability'], de: ['Frühes PvE', 'Temporäre Formationsstabilitätät'] },
      strengths: { en: ['Consistent baseline stats', 'Can hold a slot while your roster develops'], de: ['Konstante Grundwerte', 'Kann einen Slot halten, während dein Roster wächst'] },
      weaknesses: { en: ['No notable burst', 'No major utility', 'Upgrades do not convert into late-game wins once stronger heroes arrive'], de: ['Kein nennenswerter Burst', 'Keine große Utility', 'Upgrades werden später nicht zu Siegen, sobald bessere Helden da sind'] },
      investment: { en: 'Low to medium. Use early, then redirect rare resources.', de: 'Niedrig bis mittel. Früh nutzen, später seltene Ressourcen umleiten.' },
      sourceNote: heroSourceNote,
    },
  },
  {
    id: 'hero-ghost',
    type: 'hero',
    slug: 'ghost',
    route: '/heroes/ghost',
    status: 'researched',
    ownerId: 'system',
    updatedAt: '2026-07-07',
    featured: false,
    title: { en: 'Ghost', de: 'Ghost' },
    summary: { en: 'B-Tier budget tank who absorbs damage early but lacks burst and major utility.', de: 'B-Tier-Budget-Tank, der früh Schaden hält, aber Burst und große Utility vermissen lässt.' },
    tags: ['heroes', 'b-tier', 'tank', 'budget'],
    details: {
      tier: { en: 'B-Tier', de: 'B-Tier' },
      role: { en: 'Budget tank, early frontline placeholder', de: 'Budget-Tank, früher Frontline-Platzhalter' },
      bestFor: { en: ['Early teams without legendary tanks', 'Buying time for carries'], de: ['Frühe Teams ohne legendäre Tanks', 'Zeit für Carries kaufen'] },
      strengths: { en: ['Reliable damage soaking for a budget option', 'Useful while building real core heroes'], de: ['Zuverlässiges Schaden-Tanken für eine Budget-Option', 'Nützlich, während Core-Helden aufgebaut werden'] },
      weaknesses: { en: ['Low impact', 'No burst', 'No major team utility'], de: ['Niedriger Impact', 'Kein Burst', 'Keine große Team-Utility'] },
      investment: { en: 'Low. Build only enough to keep early teams alive.', de: 'Niedrig. Nur so weit bauen, dass frühe Teams überleben.' },
      sourceNote: heroSourceNote,
    },
  },
  {
    id: 'hero-lucky',
    type: 'hero',
    slug: 'lucky',
    route: '/heroes/lucky',
    status: 'researched',
    ownerId: 'system',
    updatedAt: '2026-07-07',
    featured: false,
    title: { en: 'Lucky', de: 'Lucky' },
    summary: { en: 'D-Tier combat pick with tiny battle impact, mostly considered account utility by some players.', de: 'D-Tier-Kampfwahl mit sehr kleinem Kampfbeitrag, teils eher als Account-Utility betrachtet.' },
    tags: ['heroes', 'd-tier', 'utility', 'low-priority'],
    details: {
      tier: { en: 'D-Tier', de: 'D-Tier' },
      role: { en: 'Account utility / low combat filler', de: 'Account-Utility / schwacher Kampf-Füller' },
      bestFor: { en: ['Possible stamina or efficiency side value', 'Not recommended for combat strength'], de: ['Möglicher Ausdauer- oder Effizienz-Nebennutzen', 'Nicht für Kampfstärke empfohlen'] },
      strengths: { en: ['May have niche account-efficiency value for some players'], de: ['Kann für manche Spieler Nischenwert bei Account-Effizienz haben'] },
      weaknesses: { en: ['Very small combat contribution', 'Often only helps herself', 'Poor choice if you need battle power'], de: ['Sehr kleiner Kampfbeitrag', 'Hilft oft nur sich selbst', 'Schlechte Wahl, wenn du Kampfkraft brauchst'] },
      investment: { en: 'Very low for combat. Spend elsewhere if your goal is fighting power.', de: 'Für Kampf sehr niedrig. Investiere woanders, wenn Kampfkraft dein Ziel ist.' },
      sourceNote: heroSourceNote,
    },
  },
  {
    id: 'hero-rusty',
    type: 'hero',
    slug: 'rusty',
    route: '/heroes/rusty',
    status: 'researched',
    ownerId: 'system',
    updatedAt: '2026-07-07',
    featured: false,
    title: { en: 'Rusty', de: 'Rusty' },
    summary: { en: 'D-Tier fun-looking filler with weak damage, survival, and team value.', de: 'D-Tier-Füller mit schwachem Schaden, schwacher Überlebensfähigkeit und wenig Teamwert.' },
    tags: ['heroes', 'd-tier', 'low-priority'],
    details: {
      tier: { en: 'D-Tier', de: 'D-Tier' },
      role: { en: 'Temporary combat filler', de: 'Temporärer Kampf-Füller' },
      bestFor: { en: ['Starter roster only'], de: ['Nur Starter-Roster'] },
      strengths: { en: ['Can be used while building a roster'], de: ['Kann genutzt werden, während du dein Roster aufbaust'] },
      weaknesses: { en: ['Low damage impact', 'Weak survivability', 'Little team value', 'Quickly benched as roster grows'], de: ['Geringer Schadenseffekt', 'Schwache Überlebensfähigkeit', 'Wenig Teamwert', 'Schnell auf der Bank, sobald dein Roster wächst'] },
      investment: { en: 'Very low.', de: 'Sehr niedrig.' },
      sourceNote: heroSourceNote,
    },
  },
  {
    id: 'hero-tara',
    type: 'hero',
    slug: 'tara',
    route: '/heroes/tara',
    status: 'researched',
    ownerId: 'system',
    updatedAt: '2026-07-07',
    featured: false,
    title: { en: 'Tara', de: 'Tara' },
    summary: { en: 'A-Tier team-defense buffer who stacks well with shields and healing to reduce burst damage.',
      de: 'A-Tier-Team-DEF-Bufferin, die gut mit Schilden und Heilung stapelt und Burst-Schaden abmildert.' },
    tags: ['heroes', 'a-tier', 'defense', 'support'],
    details: {
      tier: { en: 'A-Tier', de: 'A-Tier' },
      role: { en: 'Team DEF buffer, anti-burst support', de: 'Team-DEF-Bufferin, Anti-Burst-Support' },
      bestFor: { en: ['Shield teams', 'Healing teams', 'Reducing burst damage', 'Supporting core heroes'], de: ['Schild-Teams', 'Heilungs-Teams', 'Burst-Schaden reduzieren', 'Core-Helden verstärken'] },
      strengths: { en: ['Global team DEF buff', 'Stacks well with shields and healing', 'Adds some chip DPS', 'Improves survivability of core heroes'], de: ['Globaler Team-DEF-Buff', 'Stapelt gut mit Schilden und Heilung', 'Bringt etwas Chip-DPS', 'Verbessert Überleben der Core-Helden'] },
      weaknesses: { en: ['Moderate personal stats', 'Enhances cores instead of solo-carrying fights', 'Lower value if your core heroes are weak'], de: ['Moderate persönliche Werte', 'Verstärkt Cores statt Kämpfe allein zu gewinnen', 'Weniger wertvoll, wenn deine Core-Helden schwach sind'] },
      investment: { en: 'Medium to high after you have a strong carry or tank to protect.', de: 'Mittel bis hoch, nachdem du einen starken Carry oder Tank zum Schützen hast.' },
      equipment: { en: 'Keep her durable enough to maintain team value; main carry gear still comes first.', de: 'Robust genug halten, um Teamwert zu liefern; Haupt-Carry-Gear bleibt zuerst.' },
      sourceNote: heroSourceNote,
    },
  },
  {
    id: 'hero-tony',
    type: 'hero',
    slug: 'tony',
    route: '/heroes/tony',
    status: 'researched',
    ownerId: 'system',
    updatedAt: '2026-07-07',
    featured: false,
    title: { en: 'Tony', de: 'Tony' },
    summary: {
      en: 'A-Tier burst setup and combo enabler whose Pulse Mark makes the next active skill hit harder.',
      de: 'A-Tier-Burst-Setup und Combo-Enabler, dessen Pulse Mark den nächsten aktiven Skill stärker treffen lässt.',
    },
    tags: ['heroes', 'a-tier', 'combo', 'burst-setup'],
    details: {
      tier: { en: 'A-Tier', de: 'A-Tier' },
      role: { en: 'Burst setup, combo enabler, AoE marker', de: 'Burst-Setup, Combo-Enabler, AoE-Marker' },
      bestFor: { en: ['Skill-chain teams', 'Wave burst combos', 'Teams with strong active-skill carries'], de: ['Skill-Chain-Teams', 'Wave-Burst-Kombos', 'Teams mit starken Active-Skill-Carries'] },
      strengths: { en: ['Showtime applies Pulse Mark in AoE', 'Marked enemies take more damage from the next active skill', 'Can help teams chain-kill waves'], de: ['Showtime verteilt Pulse Mark per AoE', 'Markierte Gegner nehmen mehr Schaden vom nächsten aktiven Skill', 'Kann Teams helfen, Wellen in Ketten zu vernichten'] },
      weaknesses: { en: ['Needs timing and coordination', 'Lower value if teammates cannot exploit the mark'], de: ['Braucht Timing und Koordination', 'Weniger wertvoll, wenn Teamkameraden die Markierung nicht nutzen'] },
      investment: { en: 'Medium to high in active-skill burst teams; lower in auto-friendly lineups.', de: 'Mittel bis hoch in Active-Skill-Burst-Teams; niedriger in auto-freundlichen Aufstellungen.' },
      sourceNote: heroSourceNote,
    },
  },
  {
    id: 'hero-chiron',
    type: 'hero',
    slug: 'chiron',
    route: '/heroes/chiron',
    status: 'researched',
    ownerId: 'system',
    updatedAt: '2026-07-07',
    featured: false,
    title: { en: 'Chiron', de: 'Chiron' },
    summary: {
      en: 'A-Tier defense-break enabler who turns DEF reduction windows into repeatable team burst.',
      de: 'A-Tier-Defense-Break-Enabler, der DEF-Down-Fenster in wiederholbaren Team-Burst verwandelt.',
    },
    tags: ['heroes', 'a-tier', 'defense-break', 'boss'],
    details: {
      tier: { en: 'A-Tier', de: 'A-Tier' },
      role: { en: 'DEF-reduction enabler, boss damage support', de: 'DEF-Reduktions-Enabler, Boss-Damage-Support' },
      bestFor: { en: ['Bosses', 'Tanky waves', 'Teams that can burst during DEF-down windows'], de: ['Bosse', 'Tankige Wellen', 'Teams, die DEF-Down-Fenster bursten können'] },
      strengths: { en: ['Arrowstorm applies DEF reduction for several seconds', 'Deadshot gains extra crit against DEF-reduced targets', 'Great into durable enemies'], de: ['Arrowstorm vergibt DEF-Reduktion für mehrere Sekunden', 'Deadshot erhält extra Krit gegen DEF-reduzierte Ziele', 'Stark gegen haltbare Gegner'] },
      weaknesses: { en: ['Value drops if you cannot maintain the DEF-down window', 'Less impressive when fights end too quickly'], de: ['Wert sinkt, wenn du das DEF-Down-Fenster nicht halten kannst', 'Weniger eindrucksvoll, wenn Kämpfe zu schnell enden'] },
      investment: { en: 'Medium to high for boss/tank content; pair with burst carries.', de: 'Mittel bis hoch für Boss-/Tank-Content; mit Burst-Carries paaren.' },
      sourceNote: heroSourceNote,
    },
  },
  {
    id: 'hero-jacob',
    type: 'hero',
    slug: 'jacob',
    route: '/heroes/jacob',
    status: 'researched',
    ownerId: 'system',
    updatedAt: '2026-07-07',
    featured: false,
    title: { en: 'Jacob', de: 'Jacob' },
    summary: {
      en: 'A-Tier control-heavy damage dealer with flamethrower cone attacks and a taunting bomb puppet.',
      de: 'A-Tier-kontrollstarker Damage-Dealer mit Flammenwerfer-Kegel und provozierender Bomben-Puppe.',
    },
    tags: ['heroes', 'a-tier', 'control', 'aoe'],
    details: {
      tier: { en: 'A-Tier', de: 'A-Tier' },
      role: { en: 'Control damage, enemy grouping, backline protection', de: 'Kontroll-Schaden, Gegnergruppierung, Backline-Schutz' },
      bestFor: { en: ['Chaotic fights', 'Protecting backline carries', 'Grouping enemies for AoE'], de: ['Chaotische Kämpfe', 'Backline-Carries schützen', 'Gegner für AoE sammeln'] },
      strengths: { en: ['Basic attacks act like a pushing flamethrower cone', 'Bomb Carnival summons a taunting bomb puppet', 'Explosion punishes nearby enemies after delay'], de: ['Basisangriffe wirken wie ein schiebender Flammenwerfer-Kegel', 'Bomb Carnival ruft eine provozierende Bomben-Puppe', 'Explosion bestraft nahe Gegner nach kurzer Verzögerung'] },
      weaknesses: { en: ['Needs clean positioning', 'Bomb timing can be wasted if enemies move away'], de: ['Braucht sauberes Positioning', 'Bomben-Timing kann verpuffen, wenn Gegner wegbewegen'] },
      investment: { en: 'Medium to high if your team needs control and AoE setup.', de: 'Mittel bis hoch, wenn dein Team Kontrolle und AoE-Setup braucht.' },
      sourceNote: heroSourceNote,
    },
  },
  {
    id: 'hero-travis',
    type: 'hero',
    slug: 'travis',
    route: '/heroes/travis',
    status: 'researched',
    ownerId: 'system',
    updatedAt: '2026-07-07',
    featured: false,
    title: { en: 'Travis', de: 'Travis' },
    summary: {
      en: 'B-Tier rare hero with flexible damage that can feel strong under the right conditions.',
      de: 'B-Tier-seltener Held mit flexiblem Schaden, der unter passenden Bedingungen stark wirken kann.',
    },
    tags: ['heroes', 'b-tier', 'rare', 'backup-dps'],
    details: {
      tier: { en: 'B-Tier', de: 'B-Tier' },
      role: { en: 'Flexible backup DPS', de: 'Flexibler Backup-DPS' },
      bestFor: { en: ['Early and mid-game backup damage', 'Accounts lacking legendary DPS'], de: ['Early-/Midgame-Backup-Schaden', 'Accounts ohne legendäre DPS'] },
      strengths: { en: ['Surprisingly solid for a rare hero', 'Can feel close to top picks under matching conditions'], de: ['Überraschend solide für einen seltenen Helden', 'Kann unter passenden Bedingungen fast wie Top-Picks wirken'] },
      weaknesses: { en: ['Limited ceiling', 'Usually becomes backup behind legendary heroes later'], de: ['Begrenzte Obergrenze', 'Später meist Backup hinter Legendären'] },
      investment: { en: 'Low to medium. Good bridge DPS, not a final core.', de: 'Niedrig bis mittel. Guter Übergangs-DPS, kein finaler Core.' },
      sourceNote: heroSourceNote,
    },
  },
  {
    id: 'hero-ray',
    type: 'hero',
    slug: 'ray',
    route: '/heroes/ray',
    status: 'researched',
    ownerId: 'system',
    updatedAt: '2026-07-07',
    featured: false,
    title: { en: 'Ray', de: 'Ray' },
    summary: {
      en: 'C-Tier explosive AoE wave-clear hero who scales with gear but is extremely fragile.',
      de: 'C-Tier-explosiver AoE-Waveclear-Held, der mit Gear skaliert, aber extrem zerbrechlich ist.',
    },
    tags: ['heroes', 'c-tier', 'aoe', 'fragile'],
    details: {
      tier: { en: 'C-Tier', de: 'C-Tier' },
      role: { en: 'Explosive wave clear, fragile DPS', de: 'Explosiver Waveclear, fragiler DPS' },
      bestFor: { en: ['Campaign groups', 'Events with packed waves', 'Teams with strong tank/healer cover'], de: ['Kampagnengruppen', 'Events mit dichten Wellen', 'Teams mit starkem Tank-/Heiler-Schutz'] },
      strengths: { en: ['Grenades and explosions delete groups', 'Can scale well with equipment'], de: ['Granaten und Explosionen vernichten Gruppen', 'Kann gut mit Ausrüstung skalieren'] },
      weaknesses: { en: ['Extremely fragile', 'Fails fast in long fights without tank/healer protection'], de: ['Extrem zerbrechlich', 'Versagt in langen Kämpfen schnell ohne Tank-/Heiler-Schutz'] },
      investment: { en: 'Low to medium only if you specifically need wave clear and can protect him.', de: 'Niedrig bis mittel nur, wenn du gezielt Waveclear brauchst und ihn schützen kannst.' },
      sourceNote: heroSourceNote,
    },
  },
  {
    id: 'hero-sarge',
    type: 'hero',
    slug: 'sarge',
    route: '/heroes/sarge',
    status: 'researched',
    ownerId: 'system',
    updatedAt: '2026-07-07',
    featured: false,
    title: { en: 'Sarge', de: 'Sarge' },
    summary: {
      en: 'C-Tier simple shooter DPS with satisfying early boss/story damage but predictable PvP value.',
      de: 'C-Tier-einfacher Shooter-DPS mit gutem frühen Boss-/Story-Gefühl, aber vorhersehbarem PvP-Wert.',
    },
    tags: ['heroes', 'c-tier', 'shooter', 'early-game'],
    details: {
      tier: { en: 'C-Tier', de: 'C-Tier' },
      role: { en: 'Simple shooter DPS', de: 'Einfacher Shooter-DPS' },
      bestFor: { en: ['Early story', 'Early bosses', 'Temporary ranged damage'], de: ['Frühe Story', 'Frühe Bosse', 'Temporärer Fernkampfschaden'] },
      strengths: { en: ['Rapid-fire triple shot feels good early', 'Straightforward damage role'], de: ['Schnellfeuer-Dreifachschuss fühlt sich früh gut an', 'Einfache Schadensrolle'] },
      weaknesses: { en: ['Predictable in PvP', 'Low-rarity scaling means SR/SSR options usually replace him'], de: ['Vorhersehbar im PvP', 'Niedrige Raritäts-Skalierung bedeutet, dass SR/SSR-Optionen ihn meist ersetzen'] },
      investment: { en: 'Low. Use early, then replace.', de: 'Niedrig. Früh nutzen, dann ersetzen.' },
      sourceNote: heroSourceNote,
    },
  },
  {
    id: 'hero-titi',
    type: 'hero',
    slug: 'titi',
    route: '/heroes/titi',
    status: 'researched',
    ownerId: 'system',
    updatedAt: '2026-07-07',
    featured: false,
    title: { en: 'Titi', de: 'Titi' },
    summary: {
      en: 'SSR Aeronaut hero listed as part of the Aeronaut roster. Keep exact investment decisions pending verified skill data.',
      de: 'SSR-Aeronaut-Heldin aus dem Aeronaut-Roster. Exakte Investitionsentscheidungen erst nach bestätigten Skilldaten treffen.',
    },
    tags: ['heroes', 'ssr', 'aeronaut'],
    details: {
      tier: { en: 'Needs verification', de: 'Muss verifiziert werden' },
      role: { en: 'Aeronaut SSR slot', de: 'Aeronaut-SSR-Slot' },
      bestFor: { en: ['Roster completion', 'Aeronaut-focused accounts'], de: ['Roster-Vervollständigung', 'Aeronaut-fokussierte Accounts'] },
      strengths: { en: ['SSR base rarity gives long-term potential', 'Belongs to the Aeronaut class group'], de: ['SSR-Grundseltenheit bringt langfristiges Potenzial', 'Gehört zur Aeronaut-Klasse'] },
      weaknesses: { en: ['Exact skill value still needs in-game verification', 'Do not overinvest before comparing with proven cores'], de: ['Exakter Skillwert muss noch im Spiel verifiziert werden', 'Nicht überinvestieren, bevor sie mit bewährten Cores verglichen wurde'] },
      investment: { en: 'Hold major resources until skill details and team fit are confirmed.', de: 'Große Ressourcen zurückhalten, bis Skilldetails und Team-Fit bestätigt sind.' },
      sourceNote: heroSourceNote,
    },
  },
  {
    id: 'hero-wright',
    type: 'hero',
    slug: 'wright',
    route: '/heroes/wright',
    status: 'draft',
    ownerId: 'system',
    updatedAt: '2026-07-07',
    featured: false,
    title: { en: 'Wright', de: 'Wright' },
    summary: {
      en: 'SSR Aeronaut hero. Treat as a later evaluation target once your main sustain or damage core is stable.',
      de: 'SSR-Aeronaut-Held. Als spätere Bewertungsoption behandeln, sobald dein Sustain- oder Damage-Core stabil ist.',
    },
    tags: ['heroes', 'ssr', 'aeronaut'],
    details: {
      tier: { en: 'Needs verification', de: 'Muss verifiziert werden' },
      role: { en: 'Aeronaut SSR slot', de: 'Aeronaut-SSR-Slot' },
      bestFor: { en: ['Aeronaut roster depth', 'Accounts testing class-specific formations'], de: ['Aeronaut-Roster-Tiefe', 'Accounts, die klassenspezifische Formationen testen'] },
      strengths: { en: ['SSR rarity', 'May become valuable in Aeronaut-focused setups'], de: ['SSR-Seltenheit', 'Kann in Aeronaut-fokussierten Setups wertvoll werden'] },
      weaknesses: { en: ['Not enough verified public skill context yet', 'Lower priority than known meta cores until tested'], de: ['Noch zu wenig bestätigter öffentlicher Skillkontext', 'Bis zum Test niedriger als bekannte Meta-Cores priorisieren'] },
      investment: { en: 'Evaluate after core carries, tanks, and sustain supports are already handled.', de: 'Erst bewerten, wenn Haupt-Carries, Tanks und Sustain-Supports abgedeckt sind.' },
      sourceNote: heroSourceNote,
    },
  },
  {
    id: 'hero-tesla',
    type: 'hero',
    slug: 'tesla',
    route: '/heroes/tesla',
    status: 'draft',
    ownerId: 'system',
    updatedAt: '2026-07-07',
    featured: false,
    title: { en: 'Tesla', de: 'Tesla' },
    summary: {
      en: 'SSR Stalwart hero listed with the Stalwart roster. Hold final ranking until verified skill data is added.',
      de: 'SSR-Stalwart-Held aus dem Stalwart-Roster. Finale Bewertung zurückhalten, bis bestätigte Skilldaten ergänzt sind.',
    },
    tags: ['heroes', 'ssr', 'stalwart'],
    details: {
      tier: { en: 'Needs verification', de: 'Muss verifiziert werden' },
      role: { en: 'Stalwart SSR slot', de: 'Stalwart-SSR-Slot' },
      bestFor: { en: ['Stalwart roster depth', 'Late roster testing'], de: ['Stalwart-Roster-Tiefe', 'Spätere Roster-Tests'] },
      strengths: { en: ['SSR rarity', 'Fits the Stalwart class group with other combat-focused picks'], de: ['SSR-Seltenheit', 'Passt in die Stalwart-Klasse mit weiteren kampforientierten Picks'] },
      weaknesses: { en: ['Exact advantages are still pending verification', 'Should not replace proven Stalwart options without testing'], de: ['Exakte Vorteile müssen noch verifiziert werden', 'Sollte bewährte Stalwart-Optionen nicht ohne Test ersetzen'] },
      investment: { en: 'Medium only after testing; keep scarce resources for proven carries first.', de: 'Mittel erst nach Tests; knappe Ressourcen zuerst für bewährte Carries behalten.' },
      sourceNote: heroSourceNote,
    },
  },
  {
    id: 'village-territory-overview',
    type: 'village',
    slug: 'gebiete-stufe-1-6',
    route: '/villages/gebiete-stufe-1-6',
    status: 'researched',
    ownerId: 'system',
    updatedAt: '2026-07-26',
    featured: true,
    title: { en: 'Territories Level 1-6', de: 'Gebiete Stufe 1-6' },
    summary: {
      en: 'Guide to alliance territories: what level 1-6 areas are, why you capture them, how many can be held, and how to plan attacks.',
      de: 'Guide zu Allianzgebieten: was Stufe-1-bis-6-Gebiete sind, warum man sie erobert, wie viele man halten kann und wie man Angriffe plant.',
    },
    tags: ['villages', 'territory', 'alliance', 'buffs', 'strategy'],
    details: {
      beginnerBasics: {
        en: 'Territories are alliance map objectives. Your alliance captures and holds them to gain useful passive buffs. The goal is not simply to own random areas, but to choose the territories whose buffs help your alliance most.',
        de: 'Gebiete sind Allianz-Ziele auf der Weltkarte. Deine Allianz erobert und hält sie, um nützliche passive Buffs zu bekommen. Das Ziel ist nicht, wahllos irgendetwas zu besitzen, sondern die Gebiete zu wählen, deren Buffs eurer Allianz am meisten bringen.',
      },
      confidence: {
        en: 'High for territory names, visuals, occupation benefits, points, and garrison values because level 1-6 are documented with in-game screenshots. Medium for holding limits and duplicate-buff stacking because those can depend on alliance level and server state.',
        de: 'Hoch für Gebietsnamen, Aussehen, Besetzungsvorteile, Punkte und Garnison, weil Stufe 1-6 mit Ingame-Screenshots belegt sind. Mittel für Gebietslimits und Stapelung gleicher Buffs, weil das von Allianzlevel und Serverstand abhängen kann.',
      },
      territoryLevels: [
        { level: '1', image: '/screenshots/territories/level-1-dorf.png', name: { en: 'Village', de: 'Dorf' }, summary: { en: 'Resource gathering speed +5.0%, points +1.', de: 'Sammelgeschwindigkeit Ressourcen +5,0 %, Punkte +1.' } },
        { level: '2', image: '/screenshots/territories/level-2-fabrik.png', name: { en: 'Factory', de: 'Fabrik' }, summary: { en: 'Research speed +5.0%, points +3.', de: 'Forschungstempo +5,0 %, Punkte +3.' } },
        { level: '3', image: '/screenshots/territories/level-3-stadt.png', name: { en: 'Town', de: 'Stadt' }, summary: { en: 'Troop attack bonus +2.0%, points +10.', de: 'Truppenangriffsbonus +2,0 %, Punkte +10.' } },
        { level: '4', image: '/screenshots/territories/level-4-metropole.png', name: { en: 'Metropolis', de: 'Metropole' }, summary: { en: 'Basic resource production +20.0%, points +20.', de: 'Einfache Ressourcenproduktion +20,0 %, Punkte +20.' } },
        { level: '5', image: '/screenshots/territories/level-5-forschungszentrum.png', name: { en: 'Research Center', de: 'Forschungszentrum' }, summary: { en: 'Training speed +10.0%, points +50.', de: 'Trainingstempo +10,0 %, Punkte +50.' } },
        { level: '6', image: '/screenshots/territories/level-6-militaerbasis.png', name: { en: 'Military Base', de: 'Militärbasis' }, summary: { en: 'Troop health bonus +5.0%, points +100.', de: 'Truppenzustandsbonus +5,0 %, Punkte +100.' } },
      ],
      goals: {
        en: ['Secure the best available buffs for the alliance', 'Replace weak or outdated territories with better ones', 'Coordinate declarations, rallies, reinforcements, and shield timing'],
        de: ['Die besten verfügbaren Buffs für die Allianz sichern', 'Schwache oder veraltete Gebiete später durch bessere ersetzen', 'Kriegserklärungen, Rallys, Verstärkungen und Schild-Timing koordinieren'],
      },
      holdingLimit: {
        en: ['Community reports mention up to 6 held territories at alliance level 12.', 'There are also reports of only 3 active war declarations at the same time or within a time window.', 'Always check the current limit in Alliance -> City/territory screen because limits can depend on alliance level and server state.'],
        de: ['Community-Hinweise nennen bis zu 6 gehaltene Gebiete bei Allianzlevel 12.', 'Außerdem gibt es Hinweise auf nur 3 aktive Kriegserklärungen gleichzeitig oder innerhalb eines Zeitfensters.', 'Prüfe das aktuelle Limit immer im Spiel unter Allianz -> Stadt/Gebiete, weil es von Allianzlevel und Serverstand abhängen kann.'],
      },
      capturePlan: {
        en: ['Pick the target by buff value first, not by distance alone.', 'Scout the owner and nearby alliances before declaring.', 'Declare only when members are online and can reinforce quickly.', 'Send the strongest march first, then reinforce the occupation.', 'Keep a reserve march for counterattacks and failed defenses.'],
        de: ['Wähle das Ziel zuerst nach Buff-Wert, nicht nur nach Entfernung.', 'Prüfe Besitzer und nahe Allianzen vor der Kriegserklärung.', 'Erkläre nur Krieg, wenn genug Mitglieder online sind und schnell verstärken können.', 'Schicke zuerst den stärksten Marsch, danach die Besatzung verstärken.', 'Halte einen Reservemarsch für Gegenangriffe und gescheiterte Verteidigungen bereit.'],
      },
      priorities: {
        en: ['Early alliance: level 1 and level 2 are usually easier and give practical growth buffs.', 'Growing alliance: replace low-value territories with higher-level targets once the alliance can defend them.', 'Competitive alliance: plan around level 5 and level 6 objectives because research and military bonuses can matter more than basic economy.'],
        de: ['Frühe Allianz: Stufe 1 und Stufe 2 sind meistens leichter und geben praktische Wachstumsbuffs.', 'Wachsende Allianz: niedrigwertige Gebiete ersetzen, sobald ihr höhere Ziele halten könnt.', 'Starke Allianz: auf Stufe 5 und Stufe 6 planen, weil Forschungs- und Militärboni wichtiger sein können als reine Ökonomie.'],
      },
      watchouts: {
        en: ['Do not fill all territory slots with low-level targets if higher levels are about to open.', 'Do not declare when most members are offline.', 'Do not assume duplicate buffs stack unless the active game screen confirms it.', 'Holding a high-level territory is only worth it if the alliance can defend it.'],
        de: ['Nicht alle Gebietsslots mit niedrigen Zielen blockieren, wenn bald höhere Stufen öffnen.', 'Keine Kriegserklärung starten, wenn die meisten Mitglieder offline sind.', 'Nicht davon ausgehen, dass gleiche Buffs stapeln, solange es der aktive Spielbildschirm nicht bestätigt.', 'Ein hohes Gebiet lohnt sich nur, wenn die Allianz es auch verteidigen kann.'],
      },
      strategy: {
        en: 'Treat territories like alliance equipment: the best choice depends on what your alliance currently needs. Early growth favors resource and timer buffs; later, research and combat-focused territories become more important.',
        de: 'Behandle Gebiete wie Allianz-Ausrüstung: Die beste Wahl hängt davon ab, was eure Allianz gerade braucht. Früh sind Ressourcen- und Timer-Buffs stark; später werden Forschungs- und Kampfgebiete wichtiger.',
      },
      sourceLinks: territorySourceLinks,
      sourceNote: territorySourceNote,
    },
  },
  {
    id: 'village-territory-level-1',
    type: 'village',
    slug: 'gebiet-stufe-1-dorf',
    route: '/villages/gebiet-stufe-1-dorf',
    status: 'researched',
    ownerId: 'system',
    updatedAt: '2026-07-26',
    featured: true,
    title: { en: 'Level 1 Territory - Village', de: 'Gebiet Stufe 1 - Dorf' },
    image: { src: '/screenshots/territories/level-1-dorf.png', alt: { en: 'Level 1 Village territory', de: 'Gebiet Stufe 1 Dorf' } },
    summary: { en: 'Entry territory focused on resource growth and early alliance economy.', de: 'Einstiegsgebiet für Ressourcenwachstum und frühe Allianzökonomie.' },
    tags: ['villages', 'level-1', 'resources', 'buffs'],
    details: {
      confidence: { en: 'High: occupation benefit, points, coordinates, and garrison are taken from an in-game screenshot.', de: 'Hoch: Besetzungsvorteil, Punkte, Koordinaten und Garnison stammen aus einem Ingame-Screenshot.' },
      occupationBenefits: { en: ['Resource gathering speed +5.0%'], de: ['Sammelgeschwindigkeit Ressourcen +5,0 %'] },
      buffs: { en: ['Resource gathering speed +5.0%'], de: ['Sammelgeschwindigkeit Ressourcen +5,0 %'] },
      points: { en: '+1 territory point', de: '+1 Gebietspunkt' },
      garrison: { en: 'Garrison starts at 100%.', de: 'Garnison startet bei 100 %.' },
      coordinates: { en: 'Example screenshot: X:88 Y:748', de: 'Beispiel-Screenshot: X:88 Y:748' },
      capturePlan: { en: ['Best early target for new alliances', 'Easy to justify if members still need food, wood, metal, and fuel', 'Replace later if higher territories give stronger alliance-wide value'], de: ['Bestes frühes Ziel für neue Allianzen', 'Lohnt sich, wenn Mitglieder noch viel Nahrung, Holz, Metall und Benzin brauchen', 'Später ersetzen, wenn höhere Gebiete stärkeren Allianz-Wert bringen'] },
      strategy: { en: 'Take level 1 villages early to speed up basic growth. Do not keep too many forever if better territory slots open.', de: 'Stufe-1-Dörfer früh nehmen, um Grundwachstum zu beschleunigen. Nicht zu viele dauerhaft halten, sobald bessere Gebietsslots offen sind.' },
      sourceLinks: territorySourceLinks,
      sourceNote: territorySourceNote,
    },
  },
  {
    id: 'village-territory-level-2',
    type: 'village',
    slug: 'gebiet-stufe-2-fabrik',
    route: '/villages/gebiet-stufe-2-fabrik',
    status: 'researched',
    ownerId: 'system',
    updatedAt: '2026-07-26',
    featured: true,
    title: { en: 'Level 2 Territory - Factory', de: 'Gebiet Stufe 2 - Fabrik' },
    image: { src: '/screenshots/territories/level-2-fabrik.png', alt: { en: 'Level 2 Factory territory', de: 'Gebiet Stufe 2 Fabrik' } },
    summary: { en: 'Timer territory for construction, research, and training speed.', de: 'Timer-Gebiet für Bau-, Forschungs- und Trainingsgeschwindigkeit.' },
    tags: ['villages', 'level-2', 'timers', 'buffs'],
    details: {
      confidence: { en: 'High: occupation benefit, points, coordinates, and garrison are taken from an in-game screenshot.', de: 'Hoch: Besetzungsvorteil, Punkte, Koordinaten und Garnison stammen aus einem Ingame-Screenshot.' },
      occupationBenefits: { en: ['Research speed +5.0%'], de: ['Forschungstempo +5,0 %'] },
      buffs: { en: ['Research speed +5.0%'], de: ['Forschungstempo +5,0 %'] },
      points: { en: '+3 territory points', de: '+3 Gebietspunkte' },
      garrison: { en: 'Garrison starts at 100%.', de: 'Garnison startet bei 100 %.' },
      coordinates: { en: 'Example screenshot: X:168 Y:788', de: 'Beispiel-Screenshot: X:168 Y:788' },
      capturePlan: { en: ['Very useful during growth weeks and Alliance Duel preparation', 'Prioritize if many members are upgrading buildings, research, and troops', 'Defend it more seriously than level 1 because the timer buffs help everyone'], de: ['Sehr nützlich für Wachstumswochen und Allianzduell-Vorbereitung', 'Priorisieren, wenn viele Mitglieder Gebäude, Forschung und Truppen ausbauen', 'Ernster verteidigen als Stufe 1, weil Timer-Buffs allen helfen'] },
      strategy: { en: 'Level 2 factories are often more valuable than level 1 villages once the alliance is actively pushing power.', de: 'Stufe-2-Fabriken sind oft wertvoller als Stufe-1-Dörfer, sobald die Allianz aktiv Kraft pusht.' },
      sourceLinks: territorySourceLinks,
      sourceNote: territorySourceNote,
    },
  },
  {
    id: 'village-territory-level-3',
    type: 'village',
    slug: 'gebiet-stufe-3-stadt',
    route: '/villages/gebiet-stufe-3-stadt',
    status: 'researched',
    ownerId: 'system',
    updatedAt: '2026-07-26',
    featured: false,
    title: { en: 'Level 3 Territory - Town', de: 'Gebiet Stufe 3 - Stadt' },
    image: { src: '/screenshots/territories/level-3-stadt.png', alt: { en: 'Level 3 Town territory', de: 'Gebiet Stufe 3 Stadt' } },
    summary: { en: 'Mid-tier territory that should replace weaker economic slots once your alliance can hold it.', de: 'Mittleres Gebiet, das schwächere Ökonomie-Slots ersetzen sollte, sobald eure Allianz es halten kann.' },
    tags: ['villages', 'level-3', 'territory', 'strategy'],
    details: {
      confidence: { en: 'High: occupation benefit, points, coordinates, and garrison are taken from an in-game screenshot.', de: 'Hoch: Besetzungsvorteil, Punkte, Koordinaten und Garnison stammen aus einem Ingame-Screenshot.' },
      occupationBenefits: { en: ['Troop attack bonus +2.0%'], de: ['Truppenangriffsbonus +2,0 %'] },
      buffs: { en: ['Troop attack bonus +2.0%'], de: ['Truppenangriffsbonus +2,0 %'] },
      points: { en: '+10 territory points', de: '+10 Gebietspunkte' },
      garrison: { en: 'Garrison starts at 100%.', de: 'Garnison startet bei 100 %.' },
      coordinates: { en: 'Example screenshot: X:248 Y:848', de: 'Beispiel-Screenshot: X:248 Y:848' },
      capturePlan: { en: ['Attack only with enough online members to reinforce', 'Use it as the first real test of whether your alliance can defend mid-level territory'], de: ['Nur angreifen, wenn genug Mitglieder online sind und verstärken können', 'Als ersten echten Test nutzen, ob eure Allianz mittlere Gebiete halten kann'] },
      strategy: { en: 'Take level 3 towns when your alliance has stable activity and can replace a weaker level 1 slot.', de: 'Stufe-3-Städte nehmen, wenn eure Allianz stabil aktiv ist und einen schwächeren Stufe-1-Slot ersetzen kann.' },
      sourceLinks: territorySourceLinks,
      sourceNote: territorySourceNote,
    },
  },
  {
    id: 'village-territory-level-4',
    type: 'village',
    slug: 'gebiet-stufe-4-metropole',
    route: '/villages/gebiet-stufe-4-metropole',
    status: 'researched',
    ownerId: 'system',
    updatedAt: '2026-07-26',
    featured: false,
    title: { en: 'Level 4 Territory - Metropolis', de: 'Gebiet Stufe 4 - Metropole' },
    image: { src: '/screenshots/territories/level-4-metropole.png', alt: { en: 'Level 4 Metropolis territory', de: 'Gebiet Stufe 4 Metropole' } },
    summary: { en: 'Higher-value territory for established alliances that can coordinate occupation and defense.', de: 'Höherwertiges Gebiet für eingespielte Allianzen, die Einnahme und Verteidigung koordinieren können.' },
    tags: ['villages', 'level-4', 'territory', 'alliance'],
    details: {
      confidence: { en: 'High: occupation benefit, points, coordinates, and garrison are taken from an in-game screenshot. The owning alliance was anonymized.', de: 'Hoch: Besetzungsvorteil, Punkte, Koordinaten und Garnison stammen aus einem Ingame-Screenshot. Die besitzende Allianz wurde unkenntlich gemacht.' },
      occupationBenefits: { en: ['Basic resource production +20.0%'], de: ['Einfache Ressourcenproduktion +20,0 %'] },
      buffs: { en: ['Basic resource production +20.0%'], de: ['Einfache Ressourcenproduktion +20,0 %'] },
      points: { en: '+20 territory points', de: '+20 Gebietspunkte' },
      garrison: { en: 'Garrison shown at 100%.', de: 'Garnison wird mit 100 % angezeigt.' },
      coordinates: { en: 'Example screenshot: X:328 Y:748', de: 'Beispiel-Screenshot: X:328 Y:748' },
      capturePlan: { en: ['Use alliance markers and a fixed rally time', 'Prepare reinforcements before the declaration', 'Avoid taking it if you cannot defend against nearby stronger alliances'], de: ['Allianzmarker und feste Rally-Zeit nutzen', 'Verstärkungen vor der Kriegserklärung vorbereiten', 'Nicht nehmen, wenn ihr es gegen stärkere Nachbarn nicht halten könnt'] },
      strategy: { en: 'Level 4 is about quality over quantity: one well-defended strong territory beats several weak targets that are constantly lost.', de: 'Bei Stufe 4 zählt Qualität mehr als Menge: Ein gut verteidigtes starkes Gebiet ist besser als mehrere schwache Ziele, die ständig verloren gehen.' },
      sourceLinks: territorySourceLinks,
      sourceNote: territorySourceNote,
    },
  },
  {
    id: 'village-territory-level-5',
    type: 'village',
    slug: 'gebiet-stufe-5-forschungszentrum',
    route: '/villages/gebiet-stufe-5-forschungszentrum',
    status: 'researched',
    ownerId: 'system',
    updatedAt: '2026-07-26',
    featured: false,
    title: { en: 'Level 5 Territory - Research Center', de: 'Gebiet Stufe 5 - Forschungszentrum' },
    image: { src: '/screenshots/territories/level-5-forschungszentrum.png', alt: { en: 'Level 5 Research Center territory', de: 'Gebiet Stufe 5 Forschungszentrum' } },
    summary: { en: 'Late territory target likely aimed at research and high-value alliance progression.', de: 'Spätes Gebietsziel, vermutlich rund um Forschung und hochwertigen Allianzfortschritt.' },
    tags: ['villages', 'level-5', 'research', 'late-game'],
    details: {
      confidence: { en: 'High: occupation benefit, points, coordinates, and garrison are taken from an in-game screenshot. The owning alliance was anonymized.', de: 'Hoch: Besetzungsvorteil, Punkte, Koordinaten und Garnison stammen aus einem Ingame-Screenshot. Die besitzende Allianz wurde unkenntlich gemacht.' },
      occupationBenefits: { en: ['Training speed +10.0%'], de: ['Trainingstempo +10,0 %'] },
      buffs: { en: ['Training speed +10.0%'], de: ['Trainingstempo +10,0 %'] },
      points: { en: '+50 territory points', de: '+50 Gebietspunkte' },
      garrison: { en: 'Garrison shown at 100%.', de: 'Garnison wird mit 100 % angezeigt.' },
      coordinates: { en: 'Example screenshot: X:408 Y:828', de: 'Beispiel-Screenshot: X:408 Y:828' },
      capturePlan: { en: ['Plan around your strongest online window', 'Use scouts and alliance chat before any declaration', 'Keep enough troops back for defense after occupation'], de: ['Um das stärkste Online-Zeitfenster planen', 'Vor jeder Kriegserklärung scouten und Allianzchat nutzen', 'Nach der Einnahme genug Truppen für Verteidigung zurückhalten'] },
      strategy: { en: 'Level 5 should not be a random prestige target. Take it when the buff supports your alliance plan and you can keep it.', de: 'Stufe 5 sollte kein zufälliges Prestigeziel sein. Nehmt es, wenn der Buff euren Allianzplan unterstützt und ihr es halten könnt.' },
      sourceLinks: territorySourceLinks,
      sourceNote: territorySourceNote,
    },
  },
  {
    id: 'village-territory-level-6',
    type: 'village',
    slug: 'gebiet-stufe-6-militaerbasis',
    route: '/villages/gebiet-stufe-6-militaerbasis',
    status: 'researched',
    ownerId: 'system',
    updatedAt: '2026-07-26',
    featured: false,
    title: { en: 'Level 6 Territory - Military Base', de: 'Gebiet Stufe 6 - Militärbasis' },
    image: { src: '/screenshots/territories/level-6-militaerbasis.png', alt: { en: 'Level 6 Military Base territory', de: 'Gebiet Stufe 6 Militärbasis' } },
    summary: { en: 'Top territory target for strong alliances, likely tied to combat value and server competition.', de: 'Top-Gebietsziel für starke Allianzen, vermutlich mit Kampfwert und Serverkonkurrenz verbunden.' },
    tags: ['villages', 'level-6', 'combat', 'late-game'],
    details: {
      confidence: { en: 'High: occupation benefit, points, coordinates, and garrison are taken from an in-game screenshot. The owning alliance was anonymized.', de: 'Hoch: Besetzungsvorteil, Punkte, Koordinaten und Garnison stammen aus einem Ingame-Screenshot. Die besitzende Allianz wurde unkenntlich gemacht.' },
      occupationBenefits: { en: ['Troop health bonus +5.0%'], de: ['Truppenzustandsbonus +5,0 %'] },
      buffs: { en: ['Troop health bonus +5.0%'], de: ['Truppenzustandsbonus +5,0 %'] },
      points: { en: '+100 territory points', de: '+100 Gebietspunkte' },
      garrison: { en: 'Garrison shown at 100%.', de: 'Garnison wird mit 100 % angezeigt.' },
      coordinates: { en: 'Example screenshot: X:508 Y:588', de: 'Beispiel-Screenshot: X:508 Y:588' },
      capturePlan: { en: ['Only attack with coordinated leadership', 'Prepare rally leaders, reinforcements, shields, and recovery resources', 'Expect counterattacks from stronger alliances'], de: ['Nur mit koordinierter Führung angreifen', 'Rally-Leiter, Verstärkungen, Schilde und Heilressourcen vorbereiten', 'Mit Gegenangriffen stärkerer Allianzen rechnen'] },
      strategy: { en: 'Level 6 is an alliance war objective. The goal is long-term control, not a short trophy capture that is lost immediately.', de: 'Stufe 6 ist ein Allianzkriegsziel. Ziel ist langfristige Kontrolle, nicht eine kurze Trophäen-Einnahme, die sofort wieder verloren geht.' },
      sourceLinks: territorySourceLinks,
      sourceNote: territorySourceNote,
    },
  },
  {
    id: 'map-world-territory-layout',
    type: 'map',
    slug: 'weltkarte-gebiete',
    route: '/world-map/weltkarte-gebiete',
    status: 'researched',
    ownerId: 'system',
    updatedAt: '2026-07-26',
    featured: true,
    title: { en: 'World Map Territory Layout', de: 'Weltkarte Gebietsaufbau' },
    image: { src: '/screenshots/world-map.png', alt: { en: 'Tiles Survive world map territory layout', de: 'Tiles Survive Weltkarte mit Gebietsaufbau' } },
    summary: {
      en: 'Large overview map showing the territory rings from villages and factories toward Arcadia in the center.',
      de: 'Große Übersichtskarte mit den Gebietsringen von Dörfern und Fabriken bis zur Arkadia in der Mitte.',
    },
    tags: ['world-map', 'territories', 'arcadia', 'strategy'],
    details: {
      beginnerBasics: {
        en: 'The world map is built in rings. Lower territories sit farther outside, while stronger objectives are closer to the center. The middle contains Arcadia, the major central objective.',
        de: 'Die Weltkarte ist in Ringen aufgebaut. Niedrigere Gebiete liegen weiter außen, stärkere Ziele näher an der Mitte. Im Zentrum liegt Arkadia als wichtiges zentrales Ziel.',
      },
      mapZones: {
        en: ['Outer ring: many level 1 villages.', 'Next rings: level 2 factories and level 3 towns.', 'Middle rings: level 4 metropolises and level 5 research centers.', 'Inner ring: level 6 military bases around Arcadia.', 'Center: Arcadia.'],
        de: ['Äußerer Ring: viele Stufe-1-Dörfer.', 'Nächste Ringe: Stufe-2-Fabriken und Stufe-3-Städte.', 'Mittlere Ringe: Stufe-4-Metropolen und Stufe-5-Forschungszentren.', 'Innerer Ring: Stufe-6-Militärbasen rund um Arkadia.', 'Zentrum: Arkadia.'],
      },
      mapGoal: {
        en: 'Use the map to plan alliance movement. A growing alliance should not only chase the center; it should first secure territories it can actually capture and defend.',
        de: 'Nutze die Karte zur Allianzplanung. Eine wachsende Allianz sollte nicht nur blind Richtung Mitte laufen, sondern zuerst Gebiete sichern, die sie wirklich einnehmen und verteidigen kann.',
      },
      strategy: {
        en: 'The closer a territory is to the center, the more contested it usually becomes. Plan paths, nearby enemies, rally timing, and defense before declaring war on higher-level territories.',
        de: 'Je näher ein Gebiet an der Mitte liegt, desto umkämpfter ist es meistens. Plane Wege, Nachbarn, Rally-Timing und Verteidigung, bevor ihr höhere Gebiete angreift.',
      },
      sourceLinks: [
        {
          title: { en: 'Provided world map screenshot', de: 'Bereitgestellter Weltkarten-Screenshot' },
          url: '#world-map-screenshot',
          note: { en: 'Shows the visible map layout and territory names around Arcadia.', de: 'Zeigt den sichtbaren Kartenaufbau und Gebietsnamen rund um Arkadia.' },
          screenshots: [
            { src: '/screenshots/world-map.png', title: { en: 'World map territory layout', de: 'Weltkarte Gebietsaufbau' }, description: { en: 'Large map overview with villages, factories, towns, metropolises, research centers, military bases, and Arcadia.', de: 'Große Kartenübersicht mit Dörfern, Fabriken, Städten, Metropolen, Forschungszentren, Militärbasen und Arkadia.' } },
          ],
        },
      ],
      sourceNote: {
        en: 'The layout is based on the provided map screenshot. Exact server availability and ownership can change by state and season.',
        de: 'Der Aufbau basiert auf dem bereitgestellten Karten-Screenshot. Exakte Verfügbarkeit und Besitzer können je nach Staat und Saison wechseln.',
      },
    },
  },
  {
    id: 'alliance-system-overview',
    type: 'alliance',
    slug: 'allianz-uebersicht',
    route: '/alliance/allianz-uebersicht',
    status: 'researched',
    ownerId: 'system',
    updatedAt: '2026-07-26',
    featured: true,
    title: { en: 'Alliance Overview', de: 'Allianz-Übersicht' },
    image: { src: '/screenshots/alliance/alliance-menu.png', alt: { en: 'Alliance menu overview', de: 'Allianzmenü Übersicht' } },
    summary: {
      en: 'Overview of the alliance menu: news, alliance city, help, technology, shop, chests, rankings, and what beginners should check every day.',
      de: 'Übersicht über das Allianzmenü: Neuigkeiten, Stadt, Hilfe, Technik, Laden, Kisten, Ranglisten und was Anfänger täglich prüfen sollten.',
    },
    tags: ['alliance', 'menu', 'daily', 'beginner'],
    details: {
      beginnerBasics: {
        en: 'The alliance menu is the daily control center for group progress. It is not only a chat or member list: it contains shared rewards, help timers, alliance technology, city progress, shop items, rankings, and chest claims.',
        de: 'Das Allianzmenü ist die tägliche Zentrale für gemeinsamen Fortschritt. Es ist nicht nur Chat oder Mitgliederliste: Dort findest du gemeinsame Belohnungen, Hilfe-Timer, Allianztechnik, Stadtfortschritt, Ladenitems, Ranglisten und Kisten.',
      },
      allianceMenu: {
        en: [
          'News: announcements and alliance information.',
          'Alliance City: shows the alliance city and its current rank; the screenshot shows rank 1.',
          'Help: where members can help each other reduce timers.',
          'Technology: alliance research and shared bonuses.',
          'Shop: alliance shop for exchange items.',
          'Chests: cooperation chest, infected power chest, and alliance gifts.',
          'Rankings: placement and activity comparisons.'
        ],
        de: [
          'Neuigkeiten: Ankündigungen und Allianzinfos.',
          'Stadt: zeigt die Allianzstadt und ihren aktuellen Rang; im Screenshot Rang 1.',
          'Hilfe: hier können Mitglieder gegenseitig Timer verkürzen.',
          'Technik: Allianzforschung und gemeinsame Boni.',
          'Laden: Allianzshop für Tauschgegenstände.',
          'Kisten: Kooperationskiste, Infizierten-Machtkiste und Allianzgeschenke.',
          'Ranglisten: Platzierungen und Aktivitätsvergleiche.'
        ],
      },
      dailyRoutine: {
        en: ['Open Alliance every day.', 'Use Help before long building, research, and healing timers finish.', 'Claim available chests and alliance gifts.', 'Check News for calls, rules, and event plans.', 'Spend alliance currency only after checking what the shop offers and what your account needs.'],
        de: ['Öffne die Allianz jeden Tag.', 'Nutze Hilfe, bevor lange Bau-, Forschungs- oder Heilungstimer fertig werden.', 'Hole verfügbare Kisten und Allianzgeschenke ab.', 'Prüfe Neuigkeiten für Calls, Regeln und Eventpläne.', 'Gib Allianzwährung erst aus, nachdem du Ladenangebot und Account-Bedarf geprüft hast.'],
      },
      strategy: {
        en: 'A good alliance account routine is simple: help others, claim gifts, read calls, and save major resources for alliance events. The menu rewards active members who check it repeatedly, not only players who spend.',
        de: 'Eine gute Allianzroutine ist einfach: anderen helfen, Geschenke abholen, Calls lesen und große Ressourcen für Allianzevents sparen. Das Menü belohnt aktive Mitglieder, die regelmäßig reinschauen, nicht nur Spieler, die ausgeben.',
      },
      confidence: {
        en: 'High for visible menu entries because they are directly shown in the screenshot. Medium for exact feature depth because menus can unlock more options as the alliance grows.',
        de: 'Hoch für sichtbare Menüpunkte, weil sie direkt im Screenshot stehen. Mittel für die genaue Funktionstiefe, weil mit Allianzfortschritt weitere Optionen freigeschaltet werden können.',
      },
      sourceLinks: allianceMenuSourceLinks,
      sourceNote: allianceSourceNote,
    },
  },
  {
    id: 'alliance-ranks-members',
    type: 'alliance',
    slug: 'allianzraenge-mitglieder',
    route: '/alliance/allianzraenge-mitglieder',
    status: 'researched',
    ownerId: 'system',
    updatedAt: '2026-07-26',
    featured: true,
    title: { en: 'Alliance Ranks and Members', de: 'Allianzränge und Mitglieder' },
    image: { src: '/screenshots/alliance/alliance-ranks.png', alt: { en: 'Alliance rank list', de: 'Allianzrangliste' } },
    summary: {
      en: 'Explains R5, R4, R3, R2, R1, the applicant list, and how alliances usually use ranks in practice.',
      de: 'Erklärt R5, R4, R3, R2, R1, die Bewerberliste und wie Allianzen Ränge in der Praxis meistens nutzen.',
    },
    tags: ['alliance', 'ranks', 'members', 'management'],
    details: {
      beginnerBasics: {
        en: 'Alliance ranks organize trust and responsibility. R5 is the alliance leader. R4 members are officers who help organize the alliance. R1 to R3 are normal member ranks, and each alliance can define for itself what those ranks mean.',
        de: 'Allianzränge ordnen Vertrauen und Verantwortung. R5 ist der Allianzführer. R4 sind Offiziere, die bei der Organisation der Allianz helfen. R1 bis R3 sind normale Mitgliederränge, und jede Allianz kann selbst festlegen, was diese Ränge bedeuten.',
      },
      memberRanks: {
        en: [
          'R5 - Alliance leader: only the leader can fully control the alliance and promote or manage R4 officers.',
          'R4 - Officers: trusted organizers with management rights. They can accept members, kick lower-ranked members, write group mails, create polls, start events, and make alliance changes.',
          'R4 limit: R4 officers cannot kick another R4 and cannot promote someone to R4. That is reserved for R5.',
          'R3 - Active member rank: often used for very active or strong members. The exact meaning depends on the alliance.',
          'R2 and R1 - Normal member ranks: usually sorted by strength, activity, trust, or internal rules.',
          'New members usually start as R1. R5 or an R4 can then decide whether the member should stay R1 or move to R2/R3.'
        ],
        de: [
          'R5 - Allianzführer: nur der Anführer hat die volle Kontrolle über die Allianz und kann R4-Offiziere hochstufen oder verwalten.',
          'R4 - Offiziere: vertrauenswürdige Organisatoren mit Verwaltungsrechten. Sie können Mitglieder aufnehmen, niedrigere Ränge kicken, Gruppenmails schreiben, Umfragen erstellen, Events starten und Änderungen an der Allianz vornehmen.',
          'R4-Grenze: R4 können keinen anderen R4 kicken und niemanden zu R4 hochstufen. Das kann nur der R5.',
          'R3 - aktiver Mitgliederrang: wird oft für sehr aktive oder starke Mitglieder genutzt. Die genaue Bedeutung hängt von der Allianz ab.',
          'R2 und R1 - normale Mitgliederränge: meistens nach Stärke, Aktivität, Vertrauen oder internen Regeln sortiert.',
          'Neue Mitglieder starten normalerweise als R1. Danach entscheidet der R5 oder ein R4, ob das Mitglied R1 bleibt oder auf R2/R3 gesetzt wird.'
        ],
      },
      applicantList: {
        en: ['R0 is the applicant list, not a normal member rank.', 'Players who apply to join the alliance appear there.', 'R5 or R4 can accept or reject applicants, depending on the alliance permissions.'],
        de: ['R0 ist die Bewerberliste, kein normaler Mitgliederrang.', 'Dort erscheinen Spieler, die sich bei der Allianz bewerben.', 'R5 oder R4 können Bewerber annehmen oder ablehnen, abhängig von den Allianzberechtigungen.'],
      },
      watchouts: {
        en: ['Do not promote unknown players too fast.', 'Do not give R4 to inactive or unreliable members.', 'R4 officers should organize, solve problems, and make sure members still have fun playing.', 'R1 to R3 rules should be explained clearly so nobody feels treated unfairly.'],
        de: ['Unbekannte Spieler nicht zu schnell befördern.', 'R4 nicht an inaktive oder unzuverlässige Mitglieder geben.', 'R4 sollten organisieren, Probleme lösen und darauf achten, dass alle Spaß am Spielen haben.', 'Regeln für R1 bis R3 sollten klar erklärt werden, damit sich niemand unfair behandelt fühlt.'],
      },
      strategy: {
        en: 'Use ranks as trust levels, not decorations. R5 and R4 should agree on clear rules for when someone becomes R3, R2, or R1. In many alliances this is sorted by strength, but activity, helpfulness, and teamwork often matter just as much.',
        de: 'Nutze Ränge als Vertrauensstufen, nicht als Deko. R5 und R4 sollten gemeinsam festlegen, ab wann jemand R3, R2 oder R1 bekommt. In vielen Allianzen wird nach Stärke sortiert, aber Aktivität, Hilfsbereitschaft und Teamplay sind oft genauso wichtig.',
      },
      confidence: {
        en: 'High for the visible rank structure and applicant list. Officer permissions and rank usage are based on player experience and should be checked against the current in-game permission screen.',
        de: 'Hoch für die sichtbare Rangstruktur und Bewerberliste. Offiziersrechte und Rangnutzung basieren auf Spielerfahrung und sollten mit dem aktuellen Berechtigungsbildschirm im Spiel abgeglichen werden.',
      },
      sourceLinks: allianceRanksSourceLinks,
      sourceNote: allianceSourceNote,
    },
  },
  {
    id: 'alliance-chests-gifts',
    type: 'alliance',
    slug: 'allianzkisten-geschenke',
    route: '/alliance/allianzkisten-geschenke',
    status: 'researched',
    ownerId: 'system',
    updatedAt: '2026-07-26',
    featured: true,
    title: { en: 'Alliance Chests and Gifts', de: 'Allianzkisten und Geschenke' },
    image: { src: '/screenshots/alliance/alliance-chests.png', alt: { en: 'Alliance chests and gifts', de: 'Allianzkisten und Geschenke' } },
    summary: {
      en: 'Explains cooperation chest progress, infected power chest tab, alliance gifts, package gifts, and why members should claim them daily.',
      de: 'Erklärt Kooperationskiste, Infizierten-Machtkiste, Allianzgeschenke, Paketgeschenke und warum Mitglieder sie täglich abholen sollten.',
    },
    tags: ['alliance', 'chests', 'gifts', 'rewards'],
    details: {
      beginnerBasics: {
        en: 'Alliance chests are shared reward systems. Some rewards come from alliance activity, some from combat or infected-related activity, and some gifts appear when members buy packages.',
        de: 'Allianzkisten sind gemeinsame Belohnungssysteme. Manche Belohnungen kommen durch Allianzaktivität, manche durch Kampf- oder Infizierten-Aktivität, und manche Geschenke erscheinen, wenn Mitglieder Pakete kaufen.',
      },
      allianceChests: {
        en: ['Two tabs are visible: Infected Power Chest and Alliance Gift.', 'The screenshot is on Alliance Gift.', 'Available gifts show a green check when they can be claimed or are already handled.'],
        de: ['Zwei Tabs sind sichtbar: Infizierten-Machtkiste und Allianzgeschenk.', 'Der Screenshot zeigt den Tab Allianzgeschenk.', 'Verfügbare Geschenke zeigen ein grünes Häkchen, wenn sie abgeholt werden können oder erledigt sind.'],
      },
      cooperationChest: {
        en: ['The cooperation chest progress is shown with a key bar.', 'Screenshot value: 8,790 / 18,000.', 'More alliance activity appears to fill the bar toward the next cooperation chest reward.'],
        de: ['Der Fortschritt der Kooperationskiste wird mit einer Schlüssel-Leiste angezeigt.', 'Screenshot-Wert: 8.790 / 18.000.', 'Mehr Allianzaktivität füllt die Leiste Richtung nächste Kooperationskisten-Belohnung.'],
      },
      allianceGift: {
        en: ['Alliance Gift can be triggered by package purchases.', 'The visible gold panel says allies receive a gift when a package is bought.', 'Examples shown include Alliance Gift I and Alliance Gift II with rewards such as Hero EXP, speedups, and resources.'],
        de: ['Allianzgeschenke können durch Paketkäufe ausgelöst werden.', 'Das sichtbare goldene Feld sagt, dass Verbündete ein Geschenk erhalten, wenn ein Paket gekauft wird.', 'Gezeigte Beispiele sind Allianzgeschenk I und II mit Belohnungen wie Helden-EP, Speedups und Ressourcen.'],
      },
      dailyRoutine: {
        en: ['Open Chests daily.', 'Claim all available alliance gifts.', 'Check the cooperation chest bar before logging off.', 'Do not ignore small gifts: many small claims add up over weeks.'],
        de: ['Kisten täglich öffnen.', 'Alle verfügbaren Allianzgeschenke abholen.', 'Vor dem Ausloggen die Kooperationskisten-Leiste prüfen.', 'Kleine Geschenke nicht ignorieren: viele kleine Abholungen summieren sich über Wochen.'],
      },
      watchouts: {
        en: ['Package gifts depend on members buying packages, so they are not guaranteed for every alliance.', 'Claim timers may expire, so check often.', 'Visible player names in guide screenshots are anonymized for privacy.'],
        de: ['Paketgeschenke hängen davon ab, ob Mitglieder Pakete kaufen, daher sind sie nicht in jeder Allianz garantiert.', 'Abhol-Timer können ablaufen, also regelmäßig prüfen.', 'Sichtbare Spielernamen in Guide-Screenshots sind aus Datenschutzgründen unkenntlich gemacht.'],
      },
      confidence: {
        en: 'High for visible tabs, gift names, and the cooperation chest progress from the screenshot. Medium for exact drop tables because the full reward list is not visible.',
        de: 'Hoch für sichtbare Tabs, Geschenknamen und Kooperationskisten-Fortschritt aus dem Screenshot. Mittel für exakte Drop-Tabellen, weil nicht die komplette Belohnungsliste sichtbar ist.',
      },
      sourceLinks: allianceChestSourceLinks,
      sourceNote: allianceSourceNote,
    },
  },
  {
    id: 'alliance-rally-basics',
    type: 'alliance',
    slug: 'rally-basics',
    route: '/alliance/rally-basics',
    status: 'draft',
    ownerId: 'system',
    updatedAt: '2026-07-07',
    featured: true,
    title: { en: 'Rally Basics', de: 'Rally-Grundlagen' },
    summary: {
      en: 'Coordinate rally timing, roles, and resource support before committing troops.',
      de: 'Stimme Rally-Zeitpunkt, Rollen und Ressourcenhilfe ab, bevor Truppen gebunden werden.',
    },
    tags: ['alliance', 'rally', 'strategy'],
  },
  {
    id: 'building-watchtower',
    type: 'building',
    slug: 'watchtower',
    route: '/buildings/watchtower',
    status: 'draft',
    ownerId: 'system',
    updatedAt: '2026-07-07',
    featured: false,
    title: { en: 'Watchtower', de: 'Wachturm' },
    summary: {
      en: 'Improves scouting awareness and helps prevent costly tile-route mistakes.',
      de: 'Verbessert Aufklärung und verhindert teure Fehler auf Feldrouten.',
    },
    tags: ['buildings', 'scouting', 'defense'],
  },
  {
    id: 'tip-no-wasted-tiles',
    type: 'tip',
    slug: 'no-wasted-tiles',
    route: '/tips/no-wasted-tiles',
    status: 'draft',
    ownerId: 'system',
    updatedAt: '2026-07-07',
    featured: true,
    title: { en: 'Avoid Wasted Tiles', de: 'Vermeide verschwendete Felder' },
    summary: {
      en: 'Scout paths before spending boosts, especially when event objectives overlap with village tasks.',
      de: 'Prüfe Wege vor dem Einsatz von Boni, besonders wenn Eventziele und Dorfaufgaben zusammenfallen.',
    },
    tags: ['tips', 'efficiency', 'events'],
  },
];

export const faqItems = [
  {
    id: 'faq-language',
    question: { en: 'Can the guide be switched to German?', de: 'Kann der Guide auf Deutsch umgestellt werden?' },
    answer: {
      en: 'Yes. English is the default language, and the language toggle switches the whole interface to German.',
      de: 'Ja. Englisch ist die Standardsprache, und der Sprachumschalter stellt die gesamte Oberfläche auf Deutsch um.',
    },
  },
  {
    id: 'faq-community',
    question: { en: 'Is the app ready for accounts and community features?', de: 'Ist die App bereit für Accounts und Community-Funktionen?' },
    answer: {
      en: 'The project already separates auth, favorites, comments, admin services, and content ownership so those features can be implemented later.',
      de: 'Das Projekt trennt bereits Auth, Favoriten, Kommentare, Admin-Services und Content-Ownership, sodass diese Funktionen später ergänzt werden können.',
    },
  },
];
