/* ── Scene Theme Definitions ────────────────────────────────── */

export type SceneThemeId = 'healthcare' | 'developer' | 'gaming' | 'software';

export interface ShapeDef {
  type: 'icosahedron' | 'octahedron' | 'dodecahedron' | 'tetrahedron' | 'torusKnot' | 'torus' | 'box' | 'sphere';
  color: number;
  position: [number, number, number];
  scale: number;
  detail?: number;
}

export interface SceneTheme {
  id: SceneThemeId;
  label: string;
  icon: string;
  description: string;
  bg: string;
  fog: { color: number; density: number };
  particleColors: number[];
  lineOpacity: number;
  connectionDistance: number;
  speedMultiplier: number;
  shapes: ShapeDef[];
  /** If true, ThreeWorld builds custom healthcare objects (DNA, heartbeat, etc.) */
  customHealthcare?: boolean;
  orbColor: number;
  ringColor: number;
  stars: { color: number; opacity: number; size: number };
  overlayGradients: string[];
  accent: string;
  accent2: string;
}

/* ───────────────────────────────────────────────────────────── */
/*  HEALTHCARE THEME (DEFAULT)                                   */
/*  Medical blue/teal/white, DNA helix, heartbeat ECG,           */
/*  medical cross, molecules, capsule pills                      */
/* ───────────────────────────────────────────────────────────── */
const healthcare: SceneTheme = {
  id: 'healthcare',
  label: 'Healthcare',
  icon: '🏥',
  description: 'Medical-grade precision & innovation',
  bg: '#020b18',
  fog: { color: 0x020b18, density: 0.038 },
  particleColors: [0x00bcd4, 0x4dd0e1, 0x26c6da, 0x80deea, 0x00e5ff],
  lineOpacity: 0.25,
  connectionDistance: 1.7,
  speedMultiplier: 0.8,
  customHealthcare: true,
  shapes: [], // Healthcare uses custom shapes (DNA, heartbeat, etc.)
  orbColor: 0x00bcd4,
  ringColor: 0x4dd0e1,
  stars: { color: 0x80deea, opacity: 0.4, size: 0.018 },
  overlayGradients: [
    'radial-gradient(ellipse at 50% 25%, rgba(0, 188, 212, 0.1), transparent 55%)',
    'radial-gradient(ellipse at 75% 65%, rgba(0, 229, 255, 0.05), transparent 40%)',
    'radial-gradient(ellipse at 25% 80%, rgba(77, 208, 225, 0.04), transparent 35%)',
  ],
  accent: '#00e5ff',
  accent2: '#4dd0e1',
};

/* ───────────────────────────────────────────────────────────── */
/*  DEVELOPER THEME                                              */
/* ───────────────────────────────────────────────────────────── */
const developer: SceneTheme = {
  id: 'developer',
  label: 'Developer',
  icon: '⌨️',
  description: 'Terminal-inspired matrix aesthetic',
  bg: '#040d04',
  fog: { color: 0x040d04, density: 0.04 },
  particleColors: [0x00ff41, 0x39ff14, 0x20c20e, 0x7fff00],
  lineOpacity: 0.28,
  connectionDistance: 1.8,
  speedMultiplier: 0.7,
  shapes: [
    { type: 'box', color: 0x00ff41, position: [-6, 2, -8], scale: 1.4 },
    { type: 'octahedron', color: 0x39ff14, position: [7, -1.5, -6], scale: 1.0 },
    { type: 'tetrahedron', color: 0x20c20e, position: [-3, -3, -10], scale: 0.9 },
    { type: 'box', color: 0x7fff00, position: [5, 3.5, -12], scale: 0.6 },
    { type: 'torusKnot', color: 0x00ff41, position: [0, 0, -5], scale: 1.0 },
  ],
  orbColor: 0x00ff41,
  ringColor: 0x39ff14,
  stars: { color: 0x00ff41, opacity: 0.35, size: 0.015 },
  overlayGradients: [
    'radial-gradient(ellipse at 50% 30%, rgba(0, 255, 65, 0.06), transparent 50%)',
    'radial-gradient(ellipse at 80% 70%, rgba(57, 255, 20, 0.04), transparent 40%)',
  ],
  accent: '#00ff41',
  accent2: '#39ff14',
};

/* ───────────────────────────────────────────────────────────── */
/*  GAMING THEME                                                 */
/* ───────────────────────────────────────────────────────────── */
const gaming: SceneTheme = {
  id: 'gaming',
  label: 'Gaming',
  icon: '🎮',
  description: 'Neon cyberpunk with electric energy',
  bg: '#0a0015',
  fog: { color: 0x0a0015, density: 0.035 },
  particleColors: [0xff00ff, 0x00ffff, 0xff3366, 0x9d00ff, 0xff6600],
  lineOpacity: 0.42,
  connectionDistance: 1.5,
  speedMultiplier: 1.5,
  shapes: [
    { type: 'icosahedron', color: 0xff00ff, position: [-6, 2, -7], scale: 1.3 },
    { type: 'dodecahedron', color: 0x00ffff, position: [7, -1, -6], scale: 1.1 },
    { type: 'octahedron', color: 0xff3366, position: [-4, -3, -9], scale: 0.9 },
    { type: 'tetrahedron', color: 0x9d00ff, position: [5, 4, -11], scale: 0.8 },
    { type: 'torus', color: 0xff6600, position: [0, 0.5, -5], scale: 1.4 },
    { type: 'torusKnot', color: 0xff00ff, position: [-2, 3, -8], scale: 0.7 },
  ],
  orbColor: 0xff00ff,
  ringColor: 0x00ffff,
  stars: { color: 0xcc88ff, opacity: 0.55, size: 0.025 },
  overlayGradients: [
    'radial-gradient(ellipse at 50% 30%, rgba(255, 0, 255, 0.1), transparent 50%)',
    'radial-gradient(ellipse at 20% 60%, rgba(0, 255, 255, 0.06), transparent 40%)',
    'radial-gradient(ellipse at 80% 80%, rgba(255, 51, 102, 0.05), transparent 35%)',
  ],
  accent: '#ff00ff',
  accent2: '#00ffff',
};

/* ───────────────────────────────────────────────────────────── */
/*  SOFTWARE THEME                                               */
/* ───────────────────────────────────────────────────────────── */
const software: SceneTheme = {
  id: 'software',
  label: 'Software',
  icon: '💼',
  description: 'Professional tech with clean geometry',
  bg: '#050510',
  fog: { color: 0x050510, density: 0.045 },
  particleColors: [0x14f1d9, 0xa3e635, 0xa78bfa, 0xe5ff7a],
  lineOpacity: 0.35,
  connectionDistance: 1.6,
  speedMultiplier: 1.0,
  shapes: [
    { type: 'icosahedron', color: 0x14f1d9, position: [-6, 2, -8], scale: 1.0 },
    { type: 'octahedron', color: 0xa3e635, position: [7, -1.5, -6], scale: 1.0 },
    { type: 'dodecahedron', color: 0xa78bfa, position: [-3, -3, -10], scale: 0.8 },
    { type: 'tetrahedron', color: 0xfb3f6c, position: [5, 3.5, -12], scale: 0.7 },
    { type: 'torusKnot', color: 0xe5ff7a, position: [0, 0, -5], scale: 1.2 },
  ],
  orbColor: 0xa3e635,
  ringColor: 0x14f1d9,
  stars: { color: 0xffffff, opacity: 0.5, size: 0.02 },
  overlayGradients: [
    'radial-gradient(ellipse at 50% 30%, rgba(20, 241, 217, 0.08), transparent 50%)',
    'radial-gradient(ellipse at 80% 70%, rgba(163, 230, 53, 0.05), transparent 40%)',
  ],
  accent: '#a3e635',
  accent2: '#14f1d9',
};

/* ── Exports ───────────────────────────────────────────────── */
export const SCENE_THEMES: Record<SceneThemeId, SceneTheme> = {
  healthcare,
  developer,
  gaming,
  software,
};

export const THEME_LIST: SceneTheme[] = [healthcare, developer, gaming, software];

export const DEFAULT_THEME: SceneThemeId = 'healthcare';
