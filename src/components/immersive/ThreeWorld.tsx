import { memo, useEffect, useRef } from 'react';
import * as THREE from 'three';

/* ── Types ─────────────────────────────────────────────────── */
interface Particle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  baseY: number;
  phase: number;
}

interface FloatingShape {
  mesh: THREE.Mesh;
  rotationSpeed: THREE.Vector3;
  floatSpeed: number;
  floatAmplitude: number;
  baseY: number;
  phase: number;
}

/* ── Constants ─────────────────────────────────────────────── */
const PARTICLE_COUNT = 600;
const CONNECTION_DISTANCE = 1.6;
const MOUSE_INFLUENCE_RADIUS = 3.5;
const COLORS = {
  cyan: 0x14f1d9,
  lime: 0xa3e635,
  rose: 0xfb3f6c,
  violet: 0xa78bfa,
  limeYellow: 0xe5ff7a,
} as const;

/* ── Component ─────────────────────────────────────────────── */
const ThreeWorld = memo(() => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 250 : PARTICLE_COUNT;

    /* ── Scene Setup ───────────────────────────────────────── */
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050510, 0.045);

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
    const particleSizes = new Float32Array(particleCount);

    const colorPalette = [
      new THREE.Color(COLORS.cyan),
      new THREE.Color(COLORS.lime),
      new THREE.Color(COLORS.violet),
      new THREE.Color(COLORS.limeYellow),
    ];

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
      particleSizes[i] = 0.03 + Math.random() * 0.04;

      particles.push({
        position: new THREE.Vector3(x, y, z),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.008,
          (Math.random() - 0.5) * 0.006,
          (Math.random() - 0.5) * 0.004,
        ),
        baseY: y,
        phase: Math.random() * Math.PI * 2,
      });
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1));

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
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const lineSystem = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lineSystem);

    /* ── Floating Wireframe Shapes ─────────────────────────── */
    const shapes: FloatingShape[] = [];

    const shapeDefs = [
      { geo: new THREE.IcosahedronGeometry(1.8, 1), color: COLORS.cyan, pos: [-6, 2, -8], scale: 1 },
      { geo: new THREE.OctahedronGeometry(1.2, 0), color: COLORS.lime, pos: [7, -1.5, -6], scale: 1 },
      { geo: new THREE.DodecahedronGeometry(1.0, 0), color: COLORS.violet, pos: [-3, -3, -10], scale: 0.8 },
      { geo: new THREE.TetrahedronGeometry(0.9, 0), color: COLORS.rose, pos: [5, 3.5, -12], scale: 0.7 },
      { geo: new THREE.TorusKnotGeometry(0.7, 0.02, 100, 8, 2, 3), color: COLORS.limeYellow, pos: [0, 0, -5], scale: 1.2 },
    ];

    shapeDefs.forEach(({ geo, color, pos, scale }, i) => {
      const edges = new THREE.EdgesGeometry(geo);
      const mat = new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity: 0.18 + (i % 3) * 0.06,
      });
      const wireframe = new THREE.LineSegments(edges, mat);
      // Use a Group wrapper so we can treat it as a Mesh-like object for position/rotation
      const wrapper = new THREE.Mesh(new THREE.BufferGeometry(), new THREE.MeshBasicMaterial({ visible: false }));
      wrapper.add(wireframe);
      wrapper.position.set(pos[0], pos[1], pos[2]);
      wrapper.scale.setScalar(scale);
      scene.add(wrapper);

      shapes.push({
        mesh: wrapper,
        rotationSpeed: new THREE.Vector3(
          (0.001 + Math.random() * 0.003) * (i % 2 === 0 ? 1 : -1),
          (0.002 + Math.random() * 0.002) * (i % 2 === 0 ? -1 : 1),
          (0.0005 + Math.random() * 0.001),
        ),
        floatSpeed: 0.3 + Math.random() * 0.4,
        floatAmplitude: 0.3 + Math.random() * 0.5,
        baseY: pos[1],
        phase: Math.random() * Math.PI * 2,
      });

      geo.dispose();
    });

    /* ── Central Glow Orb ──────────────────────────────────── */
    const orbGeometry = new THREE.SphereGeometry(0.4, 32, 32);
    const orbMaterial = new THREE.MeshBasicMaterial({
      color: COLORS.lime,
      transparent: true,
      opacity: 0.15,
    });
    const orb = new THREE.Mesh(orbGeometry, orbMaterial);
    orb.position.set(0, 0, -4);
    scene.add(orb);

    // Outer glow ring
    const glowRing = new THREE.Mesh(
      new THREE.TorusGeometry(1.6, 0.008, 8, 128),
      new THREE.MeshBasicMaterial({
        color: COLORS.cyan,
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
        color: 0xffffff,
        size: 0.02,
        transparent: true,
        opacity: 0.5,
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
      // Project to approximate 3D space
      pointer3D.set(pointer.x * 10, -pointer.y * 6, 0);
    };

    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onPointerMove);
    resize();

    /* ── Scroll Listener (camera shift) ────────────────────── */
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

        // Gentle sine float
        p.position.y = p.baseY + Math.sin(elapsed * 0.5 + p.phase) * 0.3 * m;

        // Wrap around bounds
        if (p.position.x > 14) p.position.x = -14;
        if (p.position.x < -14) p.position.x = 14;
        if (p.position.z > 6) p.position.z = -12;
        if (p.position.z < -12) p.position.z = 6;

        // Mouse influence — particles gently pulled toward cursor
        const dx = pointer3D.x - p.position.x;
        const dy = pointer3D.y - p.position.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_INFLUENCE_RADIUS && dist > 0.1) {
          const force = ((MOUSE_INFLUENCE_RADIUS - dist) / MOUSE_INFLUENCE_RADIUS) * 0.004 * m;
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
          const dx = pi.position.x - pj.position.x;
          const dy = pi.position.y - pj.position.y;
          const dz = pi.position.z - pj.position.z;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < CONNECTION_DISTANCE) {
            const alpha = 1 - dist / CONNECTION_DISTANCE;
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

      /* Floating shapes */
      shapes.forEach((shape) => {
        shape.mesh.rotation.x += shape.rotationSpeed.x * m;
        shape.mesh.rotation.y += shape.rotationSpeed.y * m;
        shape.mesh.rotation.z += shape.rotationSpeed.z * m;
        shape.mesh.position.y =
          shape.baseY + Math.sin(elapsed * shape.floatSpeed + shape.phase) * shape.floatAmplitude * m;
      });

      /* Central orb */
      orb.scale.setScalar(1 + Math.sin(elapsed * 1.5) * 0.15 * m);
      (orb.material as THREE.MeshBasicMaterial).opacity = 0.1 + Math.sin(elapsed * 2) * 0.05;
      glowRing.rotation.x = Math.sin(elapsed * 0.3) * 0.5;
      glowRing.rotation.y = elapsed * 0.15 * m;
      glowRing.scale.setScalar(1 + Math.sin(elapsed * 0.8) * 0.1 * m);

      /* Stars drift */
      stars.rotation.y = elapsed * 0.003 * m;
      stars.rotation.x = Math.sin(elapsed * 0.1) * 0.02 * m;

      /* Camera — mouse follow + scroll-based vertical shift */
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

      shapes.forEach(({ mesh }) => {
        mesh.children.forEach((child) => {
          if (child instanceof THREE.LineSegments) {
            child.geometry.dispose();
            (child.material as THREE.Material).dispose();
          }
        });
        mesh.geometry.dispose();
        (mesh.material as THREE.Material).dispose();
      });

      renderer.dispose();
    };
  }, []);

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
