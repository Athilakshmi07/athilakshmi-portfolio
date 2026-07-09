import { memo, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { type SceneTheme } from '../../data/sceneThemes';

/* ── Types ─────────────────────────────────────────────────── */
interface Particle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  baseY: number;
  phase: number;
}

interface FloatingShape {
  group: THREE.Group | THREE.Mesh;
  rotationSpeed: THREE.Vector3;
  floatSpeed: number;
  floatAmplitude: number;
  baseY: number;
  phase: number;
  /** Custom animation callback for healthcare objects */
  customAnimate?: (elapsed: number, m: number) => void;
}

/* ── Constants ─────────────────────────────────────────────── */
const BASE_PARTICLE_COUNT = 600;
const MOUSE_INFLUENCE_RADIUS = 3.5;

/* ── Standard Shape Factory ────────────────────────────────── */
function makeGeometry(type: string, detail?: number): THREE.BufferGeometry {
  switch (type) {
    case 'icosahedron': return new THREE.IcosahedronGeometry(1.8, detail ?? 1);
    case 'octahedron': return new THREE.OctahedronGeometry(1.2, detail ?? 0);
    case 'dodecahedron': return new THREE.DodecahedronGeometry(1.0, detail ?? 0);
    case 'tetrahedron': return new THREE.TetrahedronGeometry(0.9, detail ?? 0);
    case 'torusKnot': return new THREE.TorusKnotGeometry(0.7, 0.02, 100, 8, 2, 3);
    case 'torus': return new THREE.TorusGeometry(1.0, 0.04, 12, 80);
    case 'box': return new THREE.BoxGeometry(1.4, 1.4, 1.4);
    case 'sphere': return new THREE.SphereGeometry(1.0, 16, 12);
    default: return new THREE.IcosahedronGeometry(1.2, 1);
  }
}

/* ─────────────────────────────────────────────────────────────
   HEALTHCARE 3D OBJECT BUILDERS
   ───────────────────────────────────────────────────────────── */

/** DNA Double Helix — two intertwined spirals with connecting rungs */
function buildDNAHelix(color1: number, color2: number, rungColor: number): THREE.Group {
  const group = new THREE.Group();
  const helixHeight = 8;
  const radius = 0.6;
  const turns = 3;
  const segments = 120;

  // Build two spiral curves
  const points1: THREE.Vector3[] = [];
  const points2: THREE.Vector3[] = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const angle = t * Math.PI * 2 * turns;
    const y = (t - 0.5) * helixHeight;
    points1.push(new THREE.Vector3(Math.cos(angle) * radius, y, Math.sin(angle) * radius));
    points2.push(new THREE.Vector3(Math.cos(angle + Math.PI) * radius, y, Math.sin(angle + Math.PI) * radius));
  }

  const curve1 = new THREE.CatmullRomCurve3(points1);
  const curve2 = new THREE.CatmullRomCurve3(points2);

  const tube1 = new THREE.Mesh(
    new THREE.TubeGeometry(curve1, segments, 0.03, 8, false),
    new THREE.MeshBasicMaterial({ color: color1, transparent: true, opacity: 0.7 }),
  );
  const tube2 = new THREE.Mesh(
    new THREE.TubeGeometry(curve2, segments, 0.03, 8, false),
    new THREE.MeshBasicMaterial({ color: color2, transparent: true, opacity: 0.7 }),
  );
  group.add(tube1, tube2);

  // Connecting rungs (base pairs)
  const rungMat = new THREE.MeshBasicMaterial({ color: rungColor, transparent: true, opacity: 0.4 });
  for (let i = 0; i < 24; i++) {
    const t = (i + 0.5) / 24;
    const p1 = curve1.getPoint(t);
    const p2 = curve2.getPoint(t);
    const dir = new THREE.Vector3().subVectors(p2, p1);
    const len = dir.length();
    const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);

    const rung = new THREE.Mesh(
      new THREE.CylinderGeometry(0.012, 0.012, len, 4),
      rungMat,
    );
    rung.position.copy(mid);
    rung.lookAt(p2);
    rung.rotateX(Math.PI / 2);
    group.add(rung);

    // Base pair spheres at each end
    const sphere1 = new THREE.Mesh(
      new THREE.SphereGeometry(0.04, 8, 6),
      new THREE.MeshBasicMaterial({ color: color1, transparent: true, opacity: 0.8 }),
    );
    sphere1.position.copy(p1);
    group.add(sphere1);

    const sphere2 = new THREE.Mesh(
      new THREE.SphereGeometry(0.04, 8, 6),
      new THREE.MeshBasicMaterial({ color: color2, transparent: true, opacity: 0.8 }),
    );
    sphere2.position.copy(p2);
    group.add(sphere2);
  }

  return group;
}

/** Heartbeat ECG Line — animated waveform */
function buildHeartbeatLine(color: number): { group: THREE.Group; animate: (elapsed: number, m: number) => void } {
  const group = new THREE.Group();

  // ECG waveform pattern (normalized)
  function ecgY(x: number): number {
    const t = ((x % 1) + 1) % 1;
    if (t < 0.1) return 0;
    if (t < 0.15) return (t - 0.1) * 6; // P wave up
    if (t < 0.2) return (0.2 - t) * 6; // P wave down
    if (t < 0.3) return 0;
    if (t < 0.33) return -(t - 0.3) * 10; // Q wave
    if (t < 0.38) return -0.3 + (t - 0.33) * 40; // R wave up
    if (t < 0.43) return 1.7 - (t - 0.38) * 46; // R wave down + S wave
    if (t < 0.48) return -0.6 + (t - 0.43) * 12; // S recovery
    if (t < 0.6) return 0;
    if (t < 0.7) return Math.sin((t - 0.6) * Math.PI / 0.1) * 0.25; // T wave
    return 0;
  }

  const linePoints = 200;
  const positions = new Float32Array(linePoints * 3);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const mat = new THREE.LineBasicMaterial({
    color,
    transparent: true,
    opacity: 0.6,
    linewidth: 2,
  });
  const line = new THREE.Line(geo, mat);
  group.add(line);

  // Glowing dot at the trace point
  const dot = new THREE.Mesh(
    new THREE.SphereGeometry(0.06, 12, 8),
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.9 }),
  );
  group.add(dot);

  const animate = (elapsed: number, m: number) => {
    const speed = 0.4 * m;
    const offset = elapsed * speed;
    const posArr = geo.attributes.position as THREE.BufferAttribute;

    for (let i = 0; i < linePoints; i++) {
      const t = i / linePoints;
      const x = (t - 0.5) * 8;
      const y = ecgY(t + offset) * 0.8;
      posArr.setXYZ(i, x, y, 0);
    }
    posArr.needsUpdate = true;

    // Move the dot along the trace
    const traceT = (offset % 1);
    dot.position.set((traceT - 0.5) * 8, ecgY(traceT + offset) * 0.8, 0);
    (dot.material as THREE.MeshBasicMaterial).opacity = 0.6 + Math.sin(elapsed * 8) * 0.3;
  };

  return { group, animate };
}

/** Medical Cross — glowing 3D plus symbol */
function buildMedicalCross(color: number): THREE.Group {
  const group = new THREE.Group();
  const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.5 });
  const matGlow = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.15 });

  // Vertical bar
  const vBar = new THREE.Mesh(new THREE.BoxGeometry(0.25, 1.2, 0.08), mat);
  group.add(vBar);

  // Horizontal bar
  const hBar = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.25, 0.08), mat);
  group.add(hBar);

  // Outer glow (slightly larger, more transparent)
  const vGlow = new THREE.Mesh(new THREE.BoxGeometry(0.35, 1.3, 0.12), matGlow);
  group.add(vGlow);
  const hGlow = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.35, 0.12), matGlow);
  group.add(hGlow);

  return group;
}

/** Molecule — central atom with orbiting electrons */
function buildMolecule(centerColor: number, electronColor: number, orbitColor: number): THREE.Group {
  const group = new THREE.Group();

  // Central atom
  const atom = new THREE.Mesh(
    new THREE.SphereGeometry(0.2, 16, 12),
    new THREE.MeshBasicMaterial({ color: centerColor, transparent: true, opacity: 0.7 }),
  );
  group.add(atom);

  // Orbit rings
  const orbitMat = new THREE.MeshBasicMaterial({ color: orbitColor, transparent: true, opacity: 0.2 });
  const orbits = [
    { radius: 0.6, tiltX: 0, tiltY: 0 },
    { radius: 0.8, tiltX: Math.PI / 3, tiltY: 0 },
    { radius: 0.7, tiltX: 0, tiltY: Math.PI / 3 },
  ];

  orbits.forEach(({ radius, tiltX, tiltY }) => {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.008, 6, 64), orbitMat);
    ring.rotation.set(tiltX, tiltY, 0);
    group.add(ring);
  });

  // Electrons (small glowing spheres)
  const electronMat = new THREE.MeshBasicMaterial({ color: electronColor, transparent: true, opacity: 0.9 });
  for (let i = 0; i < 3; i++) {
    const electron = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 6), electronMat);
    group.add(electron);
  }

  return group;
}

/** Capsule Pill */
function buildCapsule(color1: number, color2: number): THREE.Group {
  const group = new THREE.Group();

  // Body
  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(0.15, 0.15, 0.5, 12),
    new THREE.MeshBasicMaterial({ color: color1, transparent: true, opacity: 0.5 }),
  );
  group.add(body);

  // Top cap
  const topCap = new THREE.Mesh(
    new THREE.SphereGeometry(0.15, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2),
    new THREE.MeshBasicMaterial({ color: color1, transparent: true, opacity: 0.5 }),
  );
  topCap.position.y = 0.25;
  group.add(topCap);

  // Bottom cap
  const bottomCap = new THREE.Mesh(
    new THREE.SphereGeometry(0.15, 12, 8, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2),
    new THREE.MeshBasicMaterial({ color: color2, transparent: true, opacity: 0.5 }),
  );
  bottomCap.position.y = -0.25;
  group.add(bottomCap);

  return group;
}

/** Stethoscope — simplified wireframe */
function buildStethoscope(color: number): THREE.Group {
  const group = new THREE.Group();

  // Chest piece (circular disc)
  const disc = new THREE.Mesh(
    new THREE.CylinderGeometry(0.25, 0.25, 0.05, 24),
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.5 }),
  );
  disc.rotation.x = Math.PI / 2;
  group.add(disc);

  // Disc ring
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.25, 0.02, 8, 32),
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.7 }),
  );
  ring.rotation.x = Math.PI / 2;
  group.add(ring);

  // Tubing — curved path going up
  const tubePoints = [];
  for (let i = 0; i <= 40; i++) {
    const t = i / 40;
    const x = Math.sin(t * Math.PI * 0.8) * 0.4;
    const y = t * 1.5;
    const z = Math.cos(t * Math.PI * 0.3) * 0.1;
    tubePoints.push(new THREE.Vector3(x, y, z));
  }
  const tubeCurve = new THREE.CatmullRomCurve3(tubePoints);
  const tube = new THREE.Mesh(
    new THREE.TubeGeometry(tubeCurve, 30, 0.025, 6, false),
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.6 }),
  );
  group.add(tube);

  // Second tube (fork)
  const tubePoints2 = [];
  for (let i = 0; i <= 40; i++) {
    const t = i / 40;
    const x = -Math.sin(t * Math.PI * 0.8) * 0.4;
    const y = t * 1.5;
    const z = -Math.cos(t * Math.PI * 0.3) * 0.1;
    tubePoints2.push(new THREE.Vector3(x, y, z));
  }
  const tubeCurve2 = new THREE.CatmullRomCurve3(tubePoints2);
  const tube2 = new THREE.Mesh(
    new THREE.TubeGeometry(tubeCurve2, 30, 0.025, 6, false),
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.6 }),
  );
  group.add(tube2);

  // Earpieces (small spheres at top)
  const epMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.7 });
  const ep1 = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 6), epMat);
  ep1.position.copy(tubeCurve.getPoint(1));
  group.add(ep1);
  const ep2 = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 6), epMat);
  ep2.position.copy(tubeCurve2.getPoint(1));
  group.add(ep2);

  return group;
}

/* ── Component ─────────────────────────────────────────────── */
interface ThreeWorldProps {
  theme: SceneTheme;
}

const ThreeWorld = memo(({ theme }: ThreeWorldProps) => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 250 : BASE_PARTICLE_COUNT;
    const connectionDistance = theme.connectionDistance;
    const speedMul = theme.speedMultiplier;

    /* ── Scene Setup ───────────────────────────────────────── */
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(theme.fog.color, theme.fog.density);

    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 150);
    camera.position.set(0, 0, 12);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !isMobile,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.2 : 1.8));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    mount.appendChild(renderer.domElement);

    /* ── Particle System ───────────────────────────────────── */
    const particles: Particle[] = [];
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const colorPalette = theme.particleColors.map((c) => new THREE.Color(c));

    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * 28;
      const y = (Math.random() - 0.5) * 16;
      const z = (Math.random() - 0.5) * 18 - 3;
      const color = colorPalette[i % colorPalette.length];

      particlePositions[i * 3] = x;
      particlePositions[i * 3 + 1] = y;
      particlePositions[i * 3 + 2] = z;
      particleColors[i * 3] = color.r;
      particleColors[i * 3 + 1] = color.g;
      particleColors[i * 3 + 2] = color.b;

      particles.push({
        position: new THREE.Vector3(x, y, z),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.008 * speedMul,
          (Math.random() - 0.5) * 0.006 * speedMul,
          (Math.random() - 0.5) * 0.004 * speedMul,
        ),
        baseY: y,
        phase: Math.random() * Math.PI * 2,
      });
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.06,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });

    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);

    /* ── Constellation Lines ───────────────────────────────── */
    const maxConnections = isMobile ? 300 : 800;
    const linePositions = new Float32Array(maxConnections * 6);
    const lineColors = new Float32Array(maxConnections * 6);
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    lineGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));
    lineGeometry.setDrawRange(0, 0);

    const lineMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: theme.lineOpacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const lineSystem = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lineSystem);

    /* ── Floating Shapes ───────────────────────────────────── */
    const shapes: FloatingShape[] = [];
    const disposables: THREE.BufferGeometry[] = [];
    const disposableMats: THREE.Material[] = [];

    if (theme.customHealthcare) {
      /* ── Healthcare Custom Objects ───────────────────────── */

      // 1. DNA Double Helix — left side
      const dna = buildDNAHelix(0x00bcd4, 0x4dd0e1, 0x80deea);
      dna.position.set(-5.5, 0, -6);
      dna.scale.setScalar(0.9);
      scene.add(dna);
      shapes.push({
        group: dna as unknown as THREE.Mesh,
        rotationSpeed: new THREE.Vector3(0, 0.003, 0),
        floatSpeed: 0.4,
        floatAmplitude: 0.5,
        baseY: 0,
        phase: 0,
      });

      // 2. Heartbeat ECG — center, floating
      const heartbeat = buildHeartbeatLine(0x00e5ff);
      heartbeat.group.position.set(0, -2.5, -4);
      heartbeat.group.scale.setScalar(0.7);
      scene.add(heartbeat.group);
      shapes.push({
        group: heartbeat.group as unknown as THREE.Mesh,
        rotationSpeed: new THREE.Vector3(0, 0, 0),
        floatSpeed: 0.3,
        floatAmplitude: 0.2,
        baseY: -2.5,
        phase: 1,
        customAnimate: heartbeat.animate,
      });

      // 3. Medical Cross — upper right
      const cross = buildMedicalCross(0xff1744);
      cross.position.set(6, 2.5, -7);
      cross.scale.setScalar(1.2);
      scene.add(cross);
      shapes.push({
        group: cross as unknown as THREE.Mesh,
        rotationSpeed: new THREE.Vector3(0.001, 0.002, 0.0005),
        floatSpeed: 0.35,
        floatAmplitude: 0.4,
        baseY: 2.5,
        phase: 2,
      });

      // 4. Molecule — lower right
      const molecule = buildMolecule(0x00bcd4, 0x00e5ff, 0x4dd0e1);
      molecule.position.set(5, -2, -8);
      molecule.scale.setScalar(1.5);
      scene.add(molecule);
      shapes.push({
        group: molecule as unknown as THREE.Mesh,
        rotationSpeed: new THREE.Vector3(0.002, 0.003, 0.001),
        floatSpeed: 0.5,
        floatAmplitude: 0.3,
        baseY: -2,
        phase: 3,
        customAnimate: (elapsed, m) => {
          // Animate electrons orbiting
          const electrons = molecule.children.filter(
            (c) => c instanceof THREE.Mesh && (c.geometry as THREE.SphereGeometry).parameters?.radius === 0.05,
          );
          electrons.forEach((electron, idx) => {
            const orbitIdx = idx % 3;
            const orbits = [
              { radius: 0.6, tiltX: 0, tiltY: 0 },
              { radius: 0.8, tiltX: Math.PI / 3, tiltY: 0 },
              { radius: 0.7, tiltX: 0, tiltY: Math.PI / 3 },
            ];
            const orbit = orbits[orbitIdx];
            const angle = elapsed * (1.5 + idx * 0.4) * m + idx * (Math.PI * 2 / 3);
            const localX = Math.cos(angle) * orbit.radius;
            const localY = Math.sin(angle) * orbit.radius;
            // Apply orbit tilt
            const cosX = Math.cos(orbit.tiltX);
            const sinX = Math.sin(orbit.tiltX);
            const cosY = Math.cos(orbit.tiltY);
            const sinY = Math.sin(orbit.tiltY);
            electron.position.set(
              localX * cosY + localY * sinX * sinY,
              localY * cosX,
              -localX * sinY + localY * sinX * cosY,
            );
          });
        },
      });

      // 5. Capsule Pills — scattered
      const pillPositions: [number, number, number][] = [
        [-3, 3, -9],
        [3, 3.5, -10],
        [-2, -3.5, -7],
        [7, 0, -11],
      ];
      pillPositions.forEach((pos, i) => {
        const capsule = buildCapsule(0x00bcd4, 0x4dd0e1);
        capsule.position.set(...pos);
        capsule.scale.setScalar(0.8 + Math.random() * 0.4);
        capsule.rotation.z = Math.random() * Math.PI;
        scene.add(capsule);
        shapes.push({
          group: capsule as unknown as THREE.Mesh,
          rotationSpeed: new THREE.Vector3(
            (0.002 + Math.random() * 0.002) * (i % 2 === 0 ? 1 : -1),
            (0.003 + Math.random() * 0.002),
            (0.001 + Math.random() * 0.001),
          ),
          floatSpeed: 0.3 + Math.random() * 0.3,
          floatAmplitude: 0.3 + Math.random() * 0.3,
          baseY: pos[1],
          phase: i * 1.5,
        });
      });

      // 6. Stethoscope — center-left, floating
      const stethoscope = buildStethoscope(0x4dd0e1);
      stethoscope.position.set(-1.5, 1, -6);
      stethoscope.scale.setScalar(1.3);
      stethoscope.rotation.z = -0.3;
      scene.add(stethoscope);
      shapes.push({
        group: stethoscope as unknown as THREE.Mesh,
        rotationSpeed: new THREE.Vector3(0, 0.001, 0.0005),
        floatSpeed: 0.25,
        floatAmplitude: 0.35,
        baseY: 1,
        phase: 4,
      });

    } else {
      /* ── Standard Geometric Shapes ───────────────────────── */
      theme.shapes.forEach((shapeDef, i) => {
        const geo = makeGeometry(shapeDef.type, shapeDef.detail);
        disposables.push(geo);
        const edges = new THREE.EdgesGeometry(geo);
        disposables.push(edges);
        const mat = new THREE.LineBasicMaterial({
          color: shapeDef.color,
          transparent: true,
          opacity: 0.18 + (i % 3) * 0.06,
        });
        disposableMats.push(mat);
        const wireframe = new THREE.LineSegments(edges, mat);
        const wrapper = new THREE.Group();
        wrapper.add(wireframe);
        wrapper.position.set(...shapeDef.position);
        wrapper.scale.setScalar(shapeDef.scale);
        scene.add(wrapper);

        shapes.push({
          group: wrapper as unknown as THREE.Mesh,
          rotationSpeed: new THREE.Vector3(
            (0.001 + Math.random() * 0.003) * speedMul * (i % 2 === 0 ? 1 : -1),
            (0.002 + Math.random() * 0.002) * speedMul * (i % 2 === 0 ? -1 : 1),
            (0.0005 + Math.random() * 0.001) * speedMul,
          ),
          floatSpeed: (0.3 + Math.random() * 0.4) * speedMul,
          floatAmplitude: 0.3 + Math.random() * 0.5,
          baseY: shapeDef.position[1],
          phase: Math.random() * Math.PI * 2,
        });
      });
    }

    /* ── Central Glow Orb ──────────────────────────────────── */
    const orbGeometry = new THREE.SphereGeometry(0.4, 32, 32);
    const orbMaterial = new THREE.MeshBasicMaterial({
      color: theme.orbColor,
      transparent: true,
      opacity: 0.15,
    });
    const orb = new THREE.Mesh(orbGeometry, orbMaterial);
    orb.position.set(0, 0, -4);
    scene.add(orb);

    const glowRing = new THREE.Mesh(
      new THREE.TorusGeometry(1.6, 0.008, 8, 128),
      new THREE.MeshBasicMaterial({
        color: theme.ringColor,
        transparent: true,
        opacity: 0.2,
      }),
    );
    glowRing.position.copy(orb.position);
    scene.add(glowRing);

    /* ── Background Stars ──────────────────────────────────── */
    const starsGeo = new THREE.BufferGeometry();
    const starCount = 400;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 60;
      starPos[i * 3 + 1] = (Math.random() - 0.5) * 30;
      starPos[i * 3 + 2] = -15 - Math.random() * 30;
    }
    starsGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const stars = new THREE.Points(
      starsGeo,
      new THREE.PointsMaterial({
        color: theme.stars.color,
        size: theme.stars.size,
        transparent: true,
        opacity: theme.stars.opacity,
      }),
    );
    scene.add(stars);

    /* ── Lighting ──────────────────────────────────────────── */
    scene.add(new THREE.AmbientLight(0xffffff, 0.3));

    /* ── Mouse & Resize ────────────────────────────────────── */
    const pointer = { x: 0, y: 0 };
    const pointer3D = new THREE.Vector3(0, 0, 0);
    let width = 0;
    let height = 0;
    let frame = 0;

    const resize = () => {
      const w = mount.clientWidth || window.innerWidth;
      const h = mount.clientHeight || window.innerHeight;
      if (w === width && h === height) return;
      width = w;
      height = h;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };

    const onPointerMove = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.y = (e.clientY / window.innerHeight - 0.5) * 2;
      pointer3D.set(pointer.x * 10, -pointer.y * 6, 0);
    };

    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onPointerMove);
    resize();

    /* ── Scroll Listener ───────────────────────────────────── */
    let scrollProgress = 0;
    const snapShell = document.querySelector('.snap-shell') as HTMLElement | null;
    const onScroll = () => {
      if (snapShell) {
        scrollProgress = snapShell.scrollTop / (snapShell.scrollHeight - snapShell.clientHeight || 1);
      }
    };
    snapShell?.addEventListener('scroll', onScroll, { passive: true });

    /* ── Animation Loop ────────────────────────────────────── */
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsed = clock.getElapsedTime();
      const m = reduceMotion ? 0.1 : 1;

      /* Update particles */
      const positions = particleGeometry.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < particleCount; i++) {
        const p = particles[i];
        p.position.add(p.velocity.clone().multiplyScalar(m));
        p.position.y = p.baseY + Math.sin(elapsed * 0.5 * speedMul + p.phase) * 0.3 * m;

        if (p.position.x > 14) p.position.x = -14;
        if (p.position.x < -14) p.position.x = 14;
        if (p.position.z > 6) p.position.z = -12;
        if (p.position.z < -12) p.position.z = 6;

        const dx = pointer3D.x - p.position.x;
        const dy = pointer3D.y - p.position.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_INFLUENCE_RADIUS && dist > 0.1) {
          const force = ((MOUSE_INFLUENCE_RADIUS - dist) / MOUSE_INFLUENCE_RADIUS) * 0.004 * m * speedMul;
          p.position.x += dx * force;
          p.position.y += dy * force;
        }

        positions.setXYZ(i, p.position.x, p.position.y, p.position.z);
      }
      positions.needsUpdate = true;

      /* Update constellation lines */
      let lineIndex = 0;
      const linePositionsAttr = lineGeometry.attributes.position as THREE.BufferAttribute;
      const lineColorsAttr = lineGeometry.attributes.color as THREE.BufferAttribute;

      for (let i = 0; i < particleCount && lineIndex < maxConnections; i++) {
        for (let j = i + 1; j < particleCount && lineIndex < maxConnections; j++) {
          const pi = particles[i];
          const pj = particles[j];
          const ddx = pi.position.x - pj.position.x;
          const ddy = pi.position.y - pj.position.y;
          const ddz = pi.position.z - pj.position.z;
          const d = Math.sqrt(ddx * ddx + ddy * ddy + ddz * ddz);

          if (d < connectionDistance) {
            const alpha = 1 - d / connectionDistance;
            const ci = colorPalette[i % colorPalette.length];
            const cj = colorPalette[j % colorPalette.length];

            const idx = lineIndex * 6;
            linePositionsAttr.array[idx] = pi.position.x;
            linePositionsAttr.array[idx + 1] = pi.position.y;
            linePositionsAttr.array[idx + 2] = pi.position.z;
            linePositionsAttr.array[idx + 3] = pj.position.x;
            linePositionsAttr.array[idx + 4] = pj.position.y;
            linePositionsAttr.array[idx + 5] = pj.position.z;

            lineColorsAttr.array[idx] = ci.r * alpha;
            lineColorsAttr.array[idx + 1] = ci.g * alpha;
            lineColorsAttr.array[idx + 2] = ci.b * alpha;
            lineColorsAttr.array[idx + 3] = cj.r * alpha;
            lineColorsAttr.array[idx + 4] = cj.g * alpha;
            lineColorsAttr.array[idx + 5] = cj.b * alpha;

            lineIndex++;
          }
        }
      }
      lineGeometry.setDrawRange(0, lineIndex * 2);
      linePositionsAttr.needsUpdate = true;
      lineColorsAttr.needsUpdate = true;

      /* Floating shapes — standard rotation + float + custom animate */
      shapes.forEach((shape) => {
        shape.group.rotation.x += shape.rotationSpeed.x * m;
        shape.group.rotation.y += shape.rotationSpeed.y * m;
        shape.group.rotation.z += shape.rotationSpeed.z * m;
        shape.group.position.y =
          shape.baseY + Math.sin(elapsed * shape.floatSpeed + shape.phase) * shape.floatAmplitude * m;

        // Run custom animation if provided (heartbeat, electron orbits, etc.)
        shape.customAnimate?.(elapsed, m);
      });

      /* Central orb */
      orb.scale.setScalar(1 + Math.sin(elapsed * 1.5 * speedMul) * 0.15 * m);
      (orb.material as THREE.MeshBasicMaterial).opacity = 0.1 + Math.sin(elapsed * 2 * speedMul) * 0.05;
      glowRing.rotation.x = Math.sin(elapsed * 0.3 * speedMul) * 0.5;
      glowRing.rotation.y = elapsed * 0.15 * speedMul * m;
      glowRing.scale.setScalar(1 + Math.sin(elapsed * 0.8 * speedMul) * 0.1 * m);

      /* Stars drift */
      stars.rotation.y = elapsed * 0.003 * speedMul * m;
      stars.rotation.x = Math.sin(elapsed * 0.1 * speedMul) * 0.02 * m;

      /* Camera */
      camera.position.x += (pointer.x * 0.8 - camera.position.x) * 0.02 * m;
      camera.position.y += (-pointer.y * 0.4 + scrollProgress * -4 - camera.position.y) * 0.02 * m;
      camera.lookAt(0, scrollProgress * -2, -4);

      renderer.render(scene, camera);
      frame = window.requestAnimationFrame(animate);
    };

    animate();

    /* ── Cleanup ────────────────────────────────────────────── */
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
      snapShell?.removeEventListener('scroll', onScroll);
      mount.removeChild(renderer.domElement);

      particleGeometry.dispose();
      particleMaterial.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      orbGeometry.dispose();
      orbMaterial.dispose();
      glowRing.geometry.dispose();
      (glowRing.material as THREE.Material).dispose();
      starsGeo.dispose();
      (stars.material as THREE.Material).dispose();

      disposables.forEach((g) => g.dispose());
      disposableMats.forEach((mat) => mat.dispose());

      // Recursively dispose all scene children
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.LineSegments || obj instanceof THREE.Line) {
          obj.geometry?.dispose();
          if (obj.material) {
            if (Array.isArray(obj.material)) {
              obj.material.forEach((m) => m.dispose());
            } else {
              obj.material.dispose();
            }
          }
        }
        if (obj instanceof THREE.Points) {
          obj.geometry?.dispose();
          (obj.material as THREE.Material)?.dispose();
        }
      });

      renderer.dispose();
    };
  }, [theme]);

  return (
    <div
      ref={mountRef}
      className="pointer-events-none fixed inset-0 z-0 h-screen w-screen"
      aria-hidden="true"
    />
  );
});

ThreeWorld.displayName = 'ThreeWorld';

export default ThreeWorld;
