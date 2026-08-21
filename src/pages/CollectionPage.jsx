import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Circle, Download, MapPin, Paintbrush, Pencil, RotateCcw, Square, Star, Trash2, Type } from 'lucide-react';
import { Link } from 'react-router-dom';
import { GuideCard } from '../components/ui/GuideCard.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { getHeroClassBySlug, getHeroClasses, getHeroImagesBySlug, getMetaFormations } from '../services/siteContent.js';
import { contentRepository } from '../features/admin/contentRepository.js';
import { useLocalizedContent } from '../hooks/useLocalizedContent.js';
import { assetPath } from '../utils/assetPath.js';

const headings = {
  event: 'navEvents',
  hero: 'navHeroes',
  village: 'navVillages',
  alliance: 'navAlliance',
  building: 'navBuildings',
  map: 'navWorldMap',
  tip: 'navTips',
};

const heroRosterQuickInfo = {
  nikola: { suitability: { en: 'PvP and PvE', de: 'PvP und PvE' }, position: { en: 'Front', de: 'Vorne' } },
  rosie: { suitability: { en: 'PvP and PvE', de: 'PvP und PvE' }, position: { en: 'Back', de: 'Hinten' } },
  leyla: { suitability: { en: 'PvP and PvE', de: 'PvP und PvE' }, position: { en: 'Front', de: 'Vorne' } },
  tarzan: { suitability: { en: 'PvP', de: 'PvP' }, position: { en: 'Back', de: 'Hinten' } },
  freja: { suitability: { en: 'PvE', de: 'PvE' }, position: { en: 'Back', de: 'Hinten' } },
  candy: { suitability: { en: 'PvP and PvE', de: 'PvP und PvE' }, position: { en: 'Back', de: 'Hinten' } },
  kiki: { suitability: { en: 'PvE', de: 'PvE' }, position: { en: 'Back', de: 'Hinten' } },
  maddie: { suitability: { en: 'PvP and PvE', de: 'PvP und PvE' }, position: { en: 'Front', de: 'Vorne' } },
  chef: { suitability: { en: 'PvE', de: 'PvE' }, position: { en: 'Front', de: 'Vorne' } },
  becca: { suitability: { en: 'PvP and PvE', de: 'PvP und PvE' }, position: { en: 'Back', de: 'Hinten' } },
  eva: { suitability: { en: 'PvE', de: 'PvE' }, position: { en: 'Front', de: 'Vorne' } },
  ghost: { suitability: { en: 'PvE', de: 'PvE' }, position: { en: 'Front', de: 'Vorne' } },
  lucky: { suitability: { en: 'PvE', de: 'PvE' }, position: { en: 'Back', de: 'Hinten' } },
  rusty: { suitability: { en: 'PvE', de: 'PvE' }, position: { en: 'Front', de: 'Vorne' } },
  tara: { suitability: { en: 'PvP and PvE', de: 'PvP und PvE' }, position: { en: 'Back', de: 'Hinten' } },
  tony: { suitability: { en: 'PvP', de: 'PvP' }, position: { en: 'Front', de: 'Vorne' } },
  chiron: { suitability: { en: 'PvE', de: 'PvE' }, position: { en: 'Back', de: 'Hinten' } },
  jacob: { suitability: { en: 'PvP and PvE', de: 'PvP und PvE' }, position: { en: 'Front', de: 'Vorne' } },
  travis: { suitability: { en: 'PvE', de: 'PvE' }, position: { en: 'Back', de: 'Hinten' } },
  ray: { suitability: { en: 'PvE', de: 'PvE' }, position: { en: 'Back', de: 'Hinten' } },
  sarge: { suitability: { en: 'PvE', de: 'PvE' }, position: { en: 'Back', de: 'Hinten' } },
  wright: { suitability: { en: 'PvP', de: 'PvP' }, position: { en: 'Back', de: 'Hinten' } },
  knotty: { suitability: { en: 'PvE', de: 'PvE' }, position: { en: 'Front', de: 'Vorne' } },
  mike: { suitability: { en: 'PvP and PvE', de: 'PvP und PvE' }, position: { en: 'Front', de: 'Vorne' } },
  ragnar: { suitability: { en: 'PvP', de: 'PvP' }, position: { en: 'Front', de: 'Vorne' } },
  shark: { suitability: { en: 'PvP', de: 'PvP' }, position: { en: 'Front', de: 'Vorne' } },
  undine: { suitability: { en: 'PvP and PvE', de: 'PvP und PvE' }, position: { en: 'Back', de: 'Hinten' } },
};

const getWorldMapDraftKey = (entryId) => `tiles-survive-world-map-draft:${entryId || 'default'}`;

const loadWorldMapDraft = (entryId) => {
  if (typeof window === 'undefined') {
    return { strokes: [], texts: [], markers: [], shapes: [] };
  }

  try {
    const rawDraft = window.localStorage.getItem(getWorldMapDraftKey(entryId));
    if (!rawDraft) {
      return { strokes: [], texts: [], markers: [], shapes: [] };
    }
    const draft = JSON.parse(rawDraft);
    return {
      strokes: Array.isArray(draft.strokes) ? draft.strokes : [],
      texts: Array.isArray(draft.texts) ? draft.texts : [],
      markers: Array.isArray(draft.markers) ? draft.markers : [],
      shapes: Array.isArray(draft.shapes) ? draft.shapes : [],
    };
  } catch {
    return { strokes: [], texts: [], markers: [], shapes: [] };
  }
};

function HeroRosterCard({ entry, isMeta }) {
  const { t } = useLanguage();
  const { localize } = useLocalizedContent();
  const heroClassBySlug = getHeroClassBySlug();
  const heroImagesBySlug = getHeroImagesBySlug();
  const heroClass = heroClassBySlug[entry.slug];
  const heroImage = entry.image || heroImagesBySlug[entry.slug];
  const tier = localize(entry.details?.tier);
  const quickInfo = heroRosterQuickInfo[entry.slug] || { suitability: { en: 'PvP and PvE', de: 'PvP und PvE' }, position: { en: 'Back', de: 'Hinten' } };
  const suitability = localize(quickInfo.suitability);
  const position = localize(quickInfo.position);

  return (
    <article className={`hero-roster-card ${isMeta ? 'is-meta' : ''}`}>
      <Link className="hero-roster-image" to={entry.route} aria-label={`${localize(entry.title)} ${t('details')}`}>
        {heroImage?.src ? (
                      <img src={assetPath(heroImage.src)} alt={localize(heroImage.alt) || localize(entry.title)} loading="lazy" />
        ) : (
          <span aria-hidden="true">{localize(entry.title)?.slice(0, 1)}</span>
        )}
      </Link>

      <div className="hero-roster-body">
        <div className="hero-roster-topline">
          <div>
            <p className="hero-roster-class">{heroClass ? localize(heroClass.classTitle).replace(' Heroes', '').replace('-Helden', '') : t('heroClass')}</p>
            <h3 translate="no">{localize(entry.title)}</h3>
          </div>
          <div className="hero-roster-badges">
            {heroClass?.rarity && <span className={`rarity-badge rarity-${heroClass.rarity.toLowerCase()}`}>{heroClass.rarity}</span>}
            {isMeta && (
              <span className="meta-badge">
                <Star size={14} aria-hidden="true" />
                {t('meta')}
              </span>
            )}
          </div>
        </div>

        <p className="hero-roster-summary">{t('bestPosition')}: {position}</p>

        <dl className="hero-roster-meta">
          {tier && (
            <div>
              <dt>{t('importance')}</dt>
              <dd>{tier}</dd>
            </div>
          )}
          <div>
            <dt>{t('bestFor')}</dt>
            <dd>{suitability}</dd>
          </div>
          <div>
            <dt>{t('positioning')}</dt>
            <dd>{position}</dd>
          </div>
        </dl>

        <Link className="hero-roster-link" to={entry.route}>
          {t('details')}
          <ArrowRight size={17} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

function WorldMapFeature({ entry }) {
  const { t } = useLanguage();
  const { localize } = useLocalizedContent();
  const draftKey = getWorldMapDraftKey(entry?.id);
  const savedDraft = useMemo(() => loadWorldMapDraft(entry?.id), [entry?.id]);
  const [isEditing, setIsEditing] = useState(false);
  const [tool, setTool] = useState('pen');
  const [color, setColor] = useState('#f05a28');
  const [brushSize, setBrushSize] = useState(6);
  const [fontSize, setFontSize] = useState(34);
  const [opacity, setOpacity] = useState(100);
  const [strokes, setStrokes] = useState(savedDraft.strokes);
  const [texts, setTexts] = useState(savedDraft.texts);
  const [markers, setMarkers] = useState(savedDraft.markers);
  const [shapes, setShapes] = useState(savedDraft.shapes);
  const [activeStroke, setActiveStroke] = useState(null);
  const [activeShape, setActiveShape] = useState(null);
  const [textDraft, setTextDraft] = useState('');
  const [textPosition, setTextPosition] = useState(null);
  const [draggedTextIndex, setDraggedTextIndex] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [dragAction, setDragAction] = useState(null);

  useEffect(() => {
    const nextDraft = loadWorldMapDraft(entry?.id);
    setStrokes(nextDraft.strokes);
    setTexts(nextDraft.texts);
    setMarkers(nextDraft.markers);
    setShapes(nextDraft.shapes);
    setSelectedItem(null);
    setDragAction(null);
  }, [entry?.id]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    if (!strokes.length && !texts.length && !markers.length && !shapes.length) {
      window.localStorage.removeItem(draftKey);
      return;
    }

    window.localStorage.setItem(
      draftKey,
      JSON.stringify({
        version: 1,
        updatedAt: new Date().toISOString(),
        strokes,
        texts,
        markers,
        shapes,
      }),
    );
  }, [draftKey, strokes, texts, markers, shapes]);

  if (!entry?.image?.src) {
    return null;
  }

  const getPointerPosition = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(100, ((event.clientX - rect.left) / rect.width) * 100)),
      y: Math.max(0, Math.min(100, ((event.clientY - rect.top) / rect.height) * 100)),
    };
  };

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const itemKey = (type, index) => `${type}-${index}`;
  const selectedKey = selectedItem ? itemKey(selectedItem.type, selectedItem.index) : null;

  const shapeBounds = (shape) => {
    const x = Math.min(shape.start.x, shape.end.x);
    const y = Math.min(shape.start.y, shape.end.y);
    const width = Math.abs(shape.end.x - shape.start.x);
    const height = Math.abs(shape.end.y - shape.start.y);
    return { x, y, width, height, centerX: x + width / 2, centerY: y + height / 2 };
  };

  const textBounds = (text) => {
    const scale = text.scale || 1;
    const width = clamp(text.value.length * text.size * scale * 0.055, 5, 42);
    const height = clamp(text.size * scale * 0.13, 3.2, 12);
    return { x: text.x, y: text.y - height, width, height, centerX: text.x + width / 2, centerY: text.y - height / 2 };
  };

  const markerBounds = (marker) => {
    const radius = 2.8 * (marker.scale || 1);
    return { x: marker.x - radius, y: marker.y - radius, width: radius * 2, height: radius * 2, centerX: marker.x, centerY: marker.y };
  };

  const getSelectedObject = () => {
    if (!selectedItem) {
      return null;
    }
    if (selectedItem.type === 'text') {
      return texts[selectedItem.index] ? { ...texts[selectedItem.index], type: 'text' } : null;
    }
    if (selectedItem.type === 'marker') {
      return markers[selectedItem.index] ? { ...markers[selectedItem.index], type: 'marker' } : null;
    }
    if (selectedItem.type === 'shape') {
      return shapes[selectedItem.index] ? { ...shapes[selectedItem.index], type: 'shape' } : null;
    }
    return null;
  };

  const selectedObject = getSelectedObject();

  const getObjectBounds = (type, object) => {
    if (type === 'text') {
      return textBounds(object);
    }
    if (type === 'marker') {
      return markerBounds(object);
    }
    return shapeBounds(object);
  };

  const getSelectedBounds = () => {
    if (!selectedItem || !selectedObject) {
      return null;
    }
    return getObjectBounds(selectedItem.type, selectedObject);
  };

  const hitCorner = (point, bounds) => {
    if (!bounds) {
      return null;
    }
    const handles = [
      { corner: 'nw', x: bounds.x, y: bounds.y },
      { corner: 'ne', x: bounds.x + bounds.width, y: bounds.y },
      { corner: 'sw', x: bounds.x, y: bounds.y + bounds.height },
      { corner: 'se', x: bounds.x + bounds.width, y: bounds.y + bounds.height },
    ];
    return handles.find((handle) => Math.abs(handle.x - point.x) <= 2.4 && Math.abs(handle.y - point.y) <= 2.4)?.corner || null;
  };

  const hitObject = (point) => {
    for (let index = texts.length - 1; index >= 0; index -= 1) {
      const bounds = textBounds(texts[index]);
      if (point.x >= bounds.x - 1 && point.x <= bounds.x + bounds.width + 1 && point.y >= bounds.y - 1 && point.y <= bounds.y + bounds.height + 1) {
        return { type: 'text', index, bounds };
      }
    }
    for (let index = markers.length - 1; index >= 0; index -= 1) {
      const bounds = markerBounds(markers[index]);
      if (point.x >= bounds.x && point.x <= bounds.x + bounds.width && point.y >= bounds.y && point.y <= bounds.y + bounds.height) {
        return { type: 'marker', index, bounds };
      }
    }
    for (let index = shapes.length - 1; index >= 0; index -= 1) {
      const bounds = shapeBounds(shapes[index]);
      if (point.x >= bounds.x - 1 && point.x <= bounds.x + bounds.width + 1 && point.y >= bounds.y - 1 && point.y <= bounds.y + bounds.height + 1) {
        return { type: 'shape', index, bounds };
      }
    }
    return null;
  };

  const updateSelectedObject = (updates) => {
    if (!selectedItem) {
      return;
    }
    if (selectedItem.type === 'text') {
      setTexts((current) => current.map((text, index) => (index === selectedItem.index ? { ...text, ...updates } : text)));
    }
    if (selectedItem.type === 'marker') {
      setMarkers((current) => current.map((marker, index) => (index === selectedItem.index ? { ...marker, ...updates } : marker)));
    }
    if (selectedItem.type === 'shape') {
      setShapes((current) => current.map((shape, index) => (index === selectedItem.index ? { ...shape, ...updates } : shape)));
    }
  };

  const renderSelectionHandles = (type, object, index) => {
    if (selectedKey !== itemKey(type, index)) {
      return null;
    }
    const bounds = getObjectBounds(type, object);
    const handles = [
      [bounds.x, bounds.y],
      [bounds.x + bounds.width, bounds.y],
      [bounds.x, bounds.y + bounds.height],
      [bounds.x + bounds.width, bounds.y + bounds.height],
    ];
    return (
      <g className="world-map-selection">
        <rect x={bounds.x} y={bounds.y} width={bounds.width} height={bounds.height} fill="none" stroke="#ffffff" strokeWidth="0.35" vectorEffect="non-scaling-stroke" />
        <rect x={bounds.x} y={bounds.y} width={bounds.width} height={bounds.height} fill="none" stroke="#2491dc" strokeWidth="0.16" vectorEffect="non-scaling-stroke" />
        {handles.map(([x, y]) => (
          <rect className="world-map-resize-handle" key={`${x}-${y}`} x={x - 0.8} y={y - 0.8} width="1.6" height="1.6" rx="0.28" />
        ))}
      </g>
    );
  };

  const startDrawing = (event) => {
    if (!isEditing) {
      return;
    }

    const point = getPointerPosition(event);
    const selectedBounds = getSelectedBounds();
    const selectedCorner = hitCorner(point, selectedBounds);
    if (selectedCorner && selectedItem && selectedObject) {
      setDragAction({
        kind: 'resize',
        target: selectedItem,
        corner: selectedCorner,
        origin: point,
        original: selectedObject,
        bounds: selectedBounds,
      });
      return;
    }

    const objectHit = hitObject(point);
    if (objectHit) {
      setSelectedItem({ type: objectHit.type, index: objectHit.index });
      setDragAction({ kind: 'move', target: { type: objectHit.type, index: objectHit.index }, lastPoint: point });
      return;
    }

    if (tool === 'marker') {
      setMarkers((current) => {
        const next = [...current, { ...point, color, opacity, rotation: 0, scale: 1, label: String(current.length + 1) }];
        setSelectedItem({ type: 'marker', index: next.length - 1 });
        return next;
      });
      return;
    }

    if (tool === 'rect' || tool === 'circle') {
      setSelectedItem(null);
      setActiveShape({ type: tool, color, size: brushSize, opacity, rotation: 0, start: point, end: point });
      return;
    }

    if (tool === 'text') {
      setSelectedItem(null);
      setTextPosition(point);
      return;
    }

    setSelectedItem(null);
    setActiveStroke({ color, size: brushSize, opacity, points: [point] });
  };

  const continueDrawing = (event) => {
    if (dragAction) {
      const point = getPointerPosition(event);
      if (dragAction.kind === 'move') {
        const deltaX = point.x - dragAction.lastPoint.x;
        const deltaY = point.y - dragAction.lastPoint.y;
        if (dragAction.target.type === 'text') {
          setTexts((current) => current.map((text, index) => (index === dragAction.target.index ? { ...text, x: clamp(text.x + deltaX, 0, 100), y: clamp(text.y + deltaY, 0, 100) } : text)));
        }
        if (dragAction.target.type === 'marker') {
          setMarkers((current) => current.map((marker, index) => (index === dragAction.target.index ? { ...marker, x: clamp(marker.x + deltaX, 0, 100), y: clamp(marker.y + deltaY, 0, 100) } : marker)));
        }
        if (dragAction.target.type === 'shape') {
          setShapes((current) => current.map((shape, index) => (index === dragAction.target.index ? {
            ...shape,
            start: { x: clamp(shape.start.x + deltaX, 0, 100), y: clamp(shape.start.y + deltaY, 0, 100) },
            end: { x: clamp(shape.end.x + deltaX, 0, 100), y: clamp(shape.end.y + deltaY, 0, 100) },
          } : shape)));
        }
        setDragAction((current) => ({ ...current, lastPoint: point }));
        return;
      }

      if (dragAction.kind === 'resize') {
        if (dragAction.target.type === 'shape') {
          const { original, corner } = dragAction;
          const nextShape = {
            ...original,
            start: {
              x: corner.includes('w') ? point.x : original.start.x,
              y: corner.includes('n') ? point.y : original.start.y,
            },
            end: {
              x: corner.includes('e') ? point.x : original.end.x,
              y: corner.includes('s') ? point.y : original.end.y,
            },
          };
          setShapes((current) => current.map((shape, index) => (index === dragAction.target.index ? nextShape : shape)));
          return;
        }

        const distance = Math.hypot(point.x - dragAction.bounds.centerX, point.y - dragAction.bounds.centerY);
        const originalDistance = Math.max(1, Math.hypot(dragAction.origin.x - dragAction.bounds.centerX, dragAction.origin.y - dragAction.bounds.centerY));
        const scale = clamp((dragAction.original.scale || 1) * (distance / originalDistance), 0.25, 4);
        if (dragAction.target.type === 'text') {
          setTexts((current) => current.map((text, index) => (index === dragAction.target.index ? { ...text, scale } : text)));
        }
        if (dragAction.target.type === 'marker') {
          setMarkers((current) => current.map((marker, index) => (index === dragAction.target.index ? { ...marker, scale } : marker)));
        }
        return;
      }
    }

    if (draggedTextIndex !== null) {
      const point = getPointerPosition(event);
      setTexts((current) => current.map((text, index) => (index === draggedTextIndex ? { ...text, ...point } : text)));
      return;
    }

    if (activeShape) {
      const point = getPointerPosition(event);
      setActiveShape((current) => ({ ...current, end: point }));
      return;
    }

    if (!activeStroke || tool !== 'pen') {
      return;
    }

    const point = getPointerPosition(event);
    setActiveStroke((current) => ({ ...current, points: [...current.points, point] }));
  };

  const finishDrawing = () => {
    if (dragAction) {
      setDragAction(null);
      return;
    }

    if (draggedTextIndex !== null) {
      setDraggedTextIndex(null);
      return;
    }

    if (activeShape) {
      setShapes((current) => {
        const next = [...current, activeShape];
        setSelectedItem({ type: 'shape', index: next.length - 1 });
        return next;
      });
      setActiveShape(null);
      return;
    }

    if (!activeStroke) {
      return;
    }

    setStrokes((current) => [...current, activeStroke]);
    setActiveStroke(null);
  };

  const addTextToMap = () => {
    if (!textDraft.trim() || !textPosition) {
      return;
    }

    setTexts((current) => {
      const next = [...current, { ...textPosition, color, size: fontSize, opacity, rotation: 0, scale: 1, value: textDraft.trim() }];
      setSelectedItem({ type: 'text', index: next.length - 1 });
      return next;
    });
    setTextDraft('');
    setTextPosition(null);
  };

  const undoLastEdit = () => {
    if (textPosition) {
      setTextPosition(null);
      setSelectedItem(null);
      return;
    }

    if (texts.length) {
      setTexts((current) => current.slice(0, -1));
      setSelectedItem(null);
      return;
    }

    if (markers.length) {
      setMarkers((current) => current.slice(0, -1));
      setSelectedItem(null);
      return;
    }

    if (shapes.length) {
      setShapes((current) => current.slice(0, -1));
      setSelectedItem(null);
      return;
    }

    if (strokes.length) {
      setStrokes((current) => current.slice(0, -1));
    }
  };

  const clearEdits = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(draftKey);
    }
    setStrokes([]);
    setTexts([]);
    setMarkers([]);
    setShapes([]);
    setActiveStroke(null);
    setActiveShape(null);
    setTextPosition(null);
    setDraggedTextIndex(null);
    setSelectedItem(null);
    setDragAction(null);
  };

  const pathFromPoints = (points) => points.map((point) => `${point.x},${point.y}`).join(' ');

  const downloadEditedMap = async () => {
    const fileBaseName = 'tiles-survive-weltkarte-bearbeitet';
    const triggerDownload = (href, filename) => {
      const link = document.createElement('a');
      link.href = href;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
    };

    const loadImage = (source) => new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error('Image could not be loaded for export.'));
      image.src = source;
    });

    try {
      const image = await loadImage(assetPath(entry.image.src));
      const canvas = document.createElement('canvas');
      canvas.width = image.naturalWidth || 1920;
      canvas.height = image.naturalHeight || 1080;
      const context = canvas.getContext('2d');
      context.drawImage(image, 0, 0, canvas.width, canvas.height);

      const overlay = document.querySelector('.world-map-overlay');
      const overlayClone = overlay?.cloneNode(true) || null;
      overlayClone?.querySelectorAll('.world-map-selection, .world-map-draft-anchor').forEach((node) => node.remove());

      if (overlayClone) {
        overlayClone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        overlayClone.setAttribute('width', String(canvas.width));
        overlayClone.setAttribute('height', String(canvas.height));
        overlayClone.setAttribute('viewBox', '0 0 100 100');
        overlayClone.setAttribute('preserveAspectRatio', 'none');
        const overlaySource = new XMLSerializer().serializeToString(overlayClone);
        const overlayUrl = URL.createObjectURL(new Blob([overlaySource], { type: 'image/svg+xml;charset=utf-8' }));
        const overlayImage = await loadImage(overlayUrl);
        context.drawImage(overlayImage, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(overlayUrl);
      }

      const blob = await new Promise((resolve, reject) => {
        canvas.toBlob((nextBlob) => {
          if (nextBlob) {
            resolve(nextBlob);
          } else {
            reject(new Error('PNG export could not be created.'));
          }
        }, 'image/png');
      });
      const pngUrl = URL.createObjectURL(blob);
      triggerDownload(pngUrl, `${fileBaseName}.png`);
      setTimeout(() => URL.revokeObjectURL(pngUrl), 1000);
    } catch (error) {
      console.error(error);
      window.alert('PNG download could not be created: ' + (error.message || 'Unknown error'));
    }
  };

  return (
    <section className="world-map-feature" aria-labelledby="world-map-feature-title">
      <div className="section-heading">
        <p className="eyebrow">{t('worldMapGuide')}</p>
        <h2 id="world-map-feature-title">{localize(entry.title)}</h2>
        <p>{localize(entry.summary)}</p>
      </div>
      <div
        className={`world-map-editor ${isEditing ? 'is-editing' : ''}`}
        onPointerDown={startDrawing}
        onPointerMove={continueDrawing}
        onPointerUp={finishDrawing}
        onPointerLeave={finishDrawing}
      >
        <img src={assetPath(entry.image.src)} alt={localize(entry.image.alt) || localize(entry.title)} loading="eager" draggable="false" />
        <svg className="world-map-overlay" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {[...strokes, activeStroke].filter(Boolean).map((stroke, index) => (
            <polyline key={`stroke-${index}`} points={pathFromPoints(stroke.points)} fill="none" stroke={stroke.color} opacity={(stroke.opacity ?? 100) / 100} strokeWidth={stroke.size / 5} strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
          ))}
          {markers.map((marker, index) => (
            <g key={`${marker.x}-${marker.y}-${marker.label}`}>
              <g opacity={(marker.opacity ?? 100) / 100} transform={`rotate(${marker.rotation || 0} ${marker.x} ${marker.y})`}>
                <circle cx={marker.x} cy={marker.y} r={2.1 * (marker.scale || 1)} fill={marker.color} stroke="#fff" strokeWidth="0.45" vectorEffect="non-scaling-stroke" />
                <text x={marker.x} y={marker.y + 0.08} textAnchor="middle" dominantBaseline="middle" fill="#fff" fontSize={2.15 * (marker.scale || 1)} fontWeight="900">{marker.label}</text>
              </g>
              {renderSelectionHandles('marker', marker, index)}
            </g>
          ))}
          {[...shapes, activeShape].filter(Boolean).map((shape, index) => {
            const x = Math.min(shape.start.x, shape.end.x);
            const y = Math.min(shape.start.y, shape.end.y);
            const width = Math.abs(shape.end.x - shape.start.x);
            const height = Math.abs(shape.end.y - shape.start.y);
            const centerX = x + width / 2;
            const centerY = y + height / 2;
            return shape.type === 'rect' ? (
              <g key={`shape-${index}`}>
                <rect x={x} y={y} width={width} height={height} fill={shape.color} stroke={shape.color} opacity={(shape.opacity ?? 100) / 100} strokeWidth={shape.size / 8} vectorEffect="non-scaling-stroke" transform={`rotate(${shape.rotation || 0} ${centerX} ${centerY})`} />
                {index < shapes.length && renderSelectionHandles('shape', shape, index)}
              </g>
            ) : (
              <g key={`shape-${index}`}>
                <ellipse cx={centerX} cy={centerY} rx={width / 2} ry={height / 2} fill={shape.color} stroke={shape.color} opacity={(shape.opacity ?? 100) / 100} strokeWidth={shape.size / 8} vectorEffect="non-scaling-stroke" transform={`rotate(${shape.rotation || 0} ${centerX} ${centerY})`} />
                {index < shapes.length && renderSelectionHandles('shape', shape, index)}
              </g>
            );
          })}
          {texts.map((text, index) => (
            <g key={`${text.x}-${text.y}-${text.value}`}>
              <text className="world-map-draggable-text" x={text.x} y={text.y} fill={text.color} opacity={(text.opacity ?? 100) / 100} stroke="#fff" strokeWidth="0.32" paintOrder="stroke" fontSize={(text.size * (text.scale || 1)) / 10} fontWeight="900" transform={`rotate(${text.rotation || 0} ${text.x} ${text.y})`} data-dragging={draggedTextIndex === index ? 'true' : undefined}>{text.value}</text>
              {renderSelectionHandles('text', text, index)}
            </g>
          ))}
          {textPosition && <circle className="world-map-draft-anchor" cx={textPosition.x} cy={textPosition.y} r="1.2" fill={color} stroke="#fff" strokeWidth="0.3" vectorEffect="non-scaling-stroke" />}
        </svg>
      </div>

      {isEditing && (
        <div className="world-map-editor-toolbar" aria-label={t('editImage')}>
          <div className="world-map-tool-group">
            <button className={tool === 'pen' ? 'filter-pill is-active' : 'filter-pill'} type="button" onClick={() => setTool('pen')}>
              <Pencil size={16} aria-hidden="true" />
              {t('penTool')}
            </button>
            <button className={tool === 'text' ? 'filter-pill is-active' : 'filter-pill'} type="button" onClick={() => setTool('text')}>
              <Type size={16} aria-hidden="true" />
              {t('textTool')}
            </button>
            <button className={tool === 'marker' ? 'filter-pill is-active' : 'filter-pill'} type="button" onClick={() => setTool('marker')}>
              <MapPin size={16} aria-hidden="true" />
              {t('markerTool')}
            </button>
            <button className={tool === 'rect' ? 'filter-pill is-active' : 'filter-pill'} type="button" onClick={() => setTool('rect')}>
              <Square size={16} aria-hidden="true" />
              {t('rectangleTool')}
            </button>
            <button className={tool === 'circle' ? 'filter-pill is-active' : 'filter-pill'} type="button" onClick={() => setTool('circle')}>
              <Circle size={16} aria-hidden="true" />
              {t('circleTool')}
            </button>
          </div>

          <div className="world-map-tool-group">
            {['#ff0000', '#ffd400', '#ff4fc3', '#ffffff', '#f05a28', '#2491dc', '#49a84f', '#7e42d9', '#111827'].map((swatch) => (
              <button
                className={color === swatch ? 'color-swatch is-active' : 'color-swatch'}
                type="button"
                style={{ backgroundColor: swatch }}
                aria-label={swatch}
                onClick={() => setColor(swatch)}
                key={swatch}
              />
            ))}
          </div>

          <div className="world-map-range-tools">
            <label>
              <span>{t('brushSize')}</span>
              <input type="range" min="2" max="100" value={brushSize} onChange={(event) => setBrushSize(Number(event.target.value))} />
              <strong>{brushSize}</strong>
            </label>
            <label>
              <span>{t('fontSize')}</span>
              <input type="range" min="18" max="72" value={fontSize} onChange={(event) => setFontSize(Number(event.target.value))} />
              <strong>{fontSize}</strong>
            </label>
            <label>
              <span>{t('opacity')}</span>
              <input type="range" min="10" max="100" value={opacity} onChange={(event) => setOpacity(Number(event.target.value))} />
              <strong>{opacity}%</strong>
            </label>
          </div>

          {selectedItem && selectedObject && (
            <div className="world-map-selected-tools">
              <strong>{t('selectedObject')}</strong>
              <label>
                <span>{t('opacity')}</span>
                <input type="range" min="10" max="100" value={selectedObject.opacity ?? 100} onChange={(event) => updateSelectedObject({ opacity: Number(event.target.value) })} />
                <strong>{selectedObject.opacity ?? 100}%</strong>
              </label>
              <label>
                <span>{t('rotation')}</span>
                <input type="range" min="-180" max="180" value={selectedObject.rotation || 0} onChange={(event) => updateSelectedObject({ rotation: Number(event.target.value) })} />
                <strong>{selectedObject.rotation || 0}??</strong>
              </label>
            </div>
          )}

          {tool === 'text' && (
            <div className="world-map-text-tool">
              <input value={textDraft} placeholder={t('textPlaceholder')} onChange={(event) => setTextDraft(event.target.value)} />
              <button className="filter-pill" type="button" onClick={addTextToMap} disabled={!textPosition || !textDraft.trim()}>
                <Type size={16} aria-hidden="true" />
                {t('addText')}
              </button>
            </div>
          )}

          <div className="world-map-tool-group">
            <button className="filter-pill" type="button" onClick={undoLastEdit}>
              <RotateCcw size={16} aria-hidden="true" />
              {t('undo')}
            </button>
            <button className="filter-pill" type="button" onClick={clearEdits}>
              <Trash2 size={16} aria-hidden="true" />
              {t('clear')}
            </button>
            <button className="filter-pill" type="button" onClick={downloadEditedMap}>
              <Download size={16} aria-hidden="true" />
              {t('saveEditedImage')}
            </button>
          </div>
        </div>
      )}

      <button className="text-link world-map-edit-button" type="button" onClick={() => setIsEditing((current) => !current)}>
        {isEditing ? t('closeEditor') : t('editImage')}
        <Paintbrush size={17} aria-hidden="true" />
      </button>
    </section>
  );
}

function CollectionPage({ type }) {
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedRarity, setSelectedRarity] = useState('all');
  const { t } = useLanguage();
  const { localize } = useLocalizedContent();
  const entries = contentRepository.listEntries().filter((entry) => entry.type === type);
  const heroClassBySlug = getHeroClassBySlug();
  const heroClasses = getHeroClasses();
  const heroImagesBySlug = getHeroImagesBySlug();
  const metaFormations = getMetaFormations();
  const heroMeta = type === 'hero' ? metaFormations[0] : null;
  const metaHeroSlugs = useMemo(() => {
    if (!heroMeta) {
      return new Set();
    }
    return new Set([...heroMeta.formation.frontline, ...heroMeta.formation.backline].map((slot) => slot.slug));
  }, [heroMeta]);
  const rarityOptions = useMemo(() => {
    const raritySet = new Set(entries.map((entry) => heroClassBySlug[entry.slug]?.rarity).filter(Boolean));
    return [...raritySet].sort((first, second) => ['R', 'SR', 'SSR'].indexOf(first) - ['R', 'SR', 'SSR'].indexOf(second));
  }, [entries, heroClassBySlug]);
  const visibleEntries =
    type === 'hero'
      ? entries.filter((entry) => {
          const heroClass = heroClassBySlug[entry.slug];
          const matchesClass = selectedClass === 'all' || (selectedClass === 'meta' ? metaHeroSlugs.has(entry.slug) : heroClass?.classId === selectedClass);
          const matchesRarity = selectedRarity === 'all' || heroClass?.rarity === selectedRarity;
          return matchesClass && matchesRarity;
        })
      : entries;
  const featuredMap = type === 'map' ? visibleEntries.find((entry) => entry.featured && entry.image?.src) : null;
  const listEntries = featuredMap ? visibleEntries.filter((entry) => entry.id !== featuredMap.id) : visibleEntries;

  return (
    <div className="page-shell page-top">
      <div className="section-heading">
        <p className="eyebrow">Tiles Survive</p>
        <h1>{t(headings[type])}</h1>
      </div>
      {heroMeta && (
        <section className="meta-formation-panel" aria-labelledby="hero-meta-title">
          <div className="section-heading">
            <p className="eyebrow">{t('heroMetaIntro')}</p>
            <h2 id="hero-meta-title">{localize(heroMeta.title)}</h2>
            <p>{localize(heroMeta.summary)}</p>
          </div>

          <div className="formation-grid">
            <section>
              <h3>{t('frontline')}</h3>
              {heroMeta.formation.frontline.map((slot) => (
                <a className="formation-slot" href={`/heroes/${slot.slug}`} key={slot.slug}>
                  <span>
                    {heroImagesBySlug[slot.slug]?.src ? (
                      <img src={assetPath(heroImagesBySlug[slot.slug].src)} alt={slot.hero} loading="lazy" />
                    ) : (
                      slot.hero.slice(0, 1)
                    )}
                  </span>
                  <strong translate="no">{slot.hero}</strong>
                  <small>{localize(slot.role)}</small>
                </a>
              ))}
            </section>
            <section>
              <h3>{t('backline')}</h3>
              {heroMeta.formation.backline.map((slot) => (
                <a className="formation-slot" href={`/heroes/${slot.slug}`} key={slot.slug}>
                  <span>
                    {heroImagesBySlug[slot.slug]?.src ? (
                      <img src={assetPath(heroImagesBySlug[slot.slug].src)} alt={slot.hero} loading="lazy" />
                    ) : (
                      slot.hero.slice(0, 1)
                    )}
                  </span>
                  <strong translate="no">{slot.hero}</strong>
                  <small>{localize(slot.role)}</small>
                </a>
              ))}
            </section>
          </div>

          <div className="meta-info-grid">
            <section>
              <h3>{t('whyItWorks')}</h3>
              <ul>
                {localize(heroMeta.whyItWorks).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
            <section className="warning-panel">
              <h3>{t('mistakes')}</h3>
              <ul>
                {localize(heroMeta.mistakes).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
            <section>
              <h3>{t('upgradePath')}</h3>
              <p>{localize(heroMeta.upgradePath)}</p>
            </section>
          </div>
        </section>
      )}
      {type === 'hero' && (
        <section className="hero-roster-panel" aria-labelledby="hero-roster-title">
          <div className="section-heading">
            <p className="eyebrow">{t('heroRoster')}</p>
            <h2 id="hero-roster-title">{t('allHeroes')}</h2>
          </div>
          <div className="filter-toolbar" aria-label={t('heroFilters')}>
            <div className="filter-group" aria-label={t('heroClass')}>
              <button className={selectedClass === 'all' ? 'filter-pill is-active' : 'filter-pill'} type="button" onClick={() => setSelectedClass('all')}>
                {t('allClasses')}
              </button>
              <button className={selectedClass === 'meta' ? 'filter-pill is-active' : 'filter-pill'} type="button" onClick={() => setSelectedClass('meta')}>
                {t('meta')}
              </button>
              {heroClasses.map((heroClass) => (
                <button className={selectedClass === heroClass.id ? 'filter-pill is-active' : 'filter-pill'} type="button" onClick={() => setSelectedClass(heroClass.id)} key={heroClass.id}>
                  {localize(heroClass.title).replace(' Heroes', '').replace('-Helden', '')}
                </button>
              ))}
            </div>
            <div className="filter-group" aria-label={t('rarity')}>
              <button className={selectedRarity === 'all' ? 'filter-pill is-active' : 'filter-pill'} type="button" onClick={() => setSelectedRarity('all')}>
                {t('allRarities')}
              </button>
              {rarityOptions.map((rarity) => (
                <button className={selectedRarity === rarity ? 'filter-pill is-active' : 'filter-pill'} type="button" onClick={() => setSelectedRarity(rarity)} key={rarity}>
                  {rarity}
                </button>
              ))}
            </div>
            <p className="filter-count">{visibleEntries.length} / {entries.length}</p>
          </div>
        </section>
      )}
      {featuredMap && <WorldMapFeature entry={featuredMap} />}
      {listEntries.length ? (
        <div className={type === 'hero' ? 'hero-roster-grid' : 'card-grid'}>
          {listEntries.map((entry) => (
            type === 'hero' ? (
              <HeroRosterCard entry={entry} isMeta={metaHeroSlugs.has(entry.slug)} key={entry.id} />
            ) : (
              <GuideCard entry={entry} key={entry.id} />
            )
          ))}
        </div>
      ) : (
        <section className="empty-state">
          <p>{t('comingSoon')}</p>
        </section>
      )}
    </div>
  );
}

export default CollectionPage;


