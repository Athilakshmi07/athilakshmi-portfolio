import { memo, useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreeWorld = memo(() => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x050505, 8, 22);

    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.set(0, 0.1, 8);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const coreMaterial = new THREE.MeshPhysicalMaterial({
      color: '#f5f5f7',
      metalness: 0.38,
      roughness: 0.18,
      clearcoat: 0.8,
      transmission: 0.18,
      thickness: 0.45,
      emissive: '#14b8a6',
      emissiveIntensity: 0.04,
    });

    const core = new THREE.Mesh(new THREE.IcosahedronGeometry(1.25, 2), coreMaterial);
    group.add(core);

    const torusMaterial = new THREE.MeshBasicMaterial({ color: '#14b8a6', wireframe: true, transparent: true, opacity: 0.34 });
    const orbitA = new THREE.Mesh(new THREE.TorusGeometry(2.2, 0.012, 12, 180), torusMaterial);
    const orbitB = new THREE.Mesh(new THREE.TorusGeometry(3.05, 0.01, 12, 180), torusMaterial);
    orbitA.rotation.set(1.2, 0.45, 0.2);
    orbitB.rotation.set(1.7, -0.5, 0.8);
    group.add(orbitA, orbitB);

    const panelMaterials = ['#14b8a6', '#f43f5e', '#a3e635'].map(
      (color) =>
        new THREE.MeshStandardMaterial({
          color,
          roughness: 0.38,
          metalness: 0.18,
          emissive: color,
          emissiveIntensity: 0.12,
        }),
    );

    const panels = Array.from({ length: 9 }, (_, index) => {
      const panel = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.42, 0.08), panelMaterials[index % panelMaterials.length]);
      const angle = index * 0.7;
      panel.position.set(Math.cos(angle) * (2.6 + (index % 3) * 0.45), Math.sin(index * 0.9) * 1.35, Math.sin(angle) * 1.3);
      panel.rotation.set(index * 0.21, angle, index * 0.12);
      group.add(panel);
      return { panel, angle, radius: 2.6 + (index % 3) * 0.45, speed: 0.12 + index * 0.006 };
    });

    const starsGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(260 * 3);
    for (let i = 0; i < 260; i += 1) {
      const base = i * 3;
      starPositions[base] = (Math.random() - 0.5) * 22;
      starPositions[base + 1] = (Math.random() - 0.5) * 13;
      starPositions[base + 2] = -4 - Math.random() * 14;
    }
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const stars = new THREE.Points(
      starsGeometry,
      new THREE.PointsMaterial({ color: '#d9f99d', size: 0.025, transparent: true, opacity: 0.7 }),
    );
    scene.add(stars);

    scene.add(new THREE.AmbientLight(0xffffff, 0.65));
    const key = new THREE.PointLight('#ffffff', 36, 18);
    key.position.set(3.8, 4.2, 5);
    scene.add(key);
    const rim = new THREE.PointLight('#f43f5e', 22, 16);
    rim.position.set(-4, -2.5, 4);
    scene.add(rim);

    const pointer = { x: 0, y: 0 };
    let width = 0;
    let height = 0;
    let frame = 0;

    const resize = () => {
      const nextWidth = mount.clientWidth || window.innerWidth;
      const nextHeight = mount.clientHeight || window.innerHeight;
      if (nextWidth === width && nextHeight === height) return;
      width = nextWidth;
      height = nextHeight;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      group.scale.setScalar(width < 700 ? 0.72 : 1);
    };

    const onPointerMove = (event: PointerEvent) => {
      pointer.x = (event.clientX / window.innerWidth - 0.5) * 2;
      pointer.y = (event.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onPointerMove);
    resize();

    const clock = new THREE.Clock();
    const animate = () => {
      const elapsed = clock.getElapsedTime();
      const motion = reduceMotion ? 0.12 : 1;

      group.rotation.y += ((pointer.x * 0.22 - group.rotation.y) * 0.035) * motion;
      group.rotation.x += ((-pointer.y * 0.1 - group.rotation.x) * 0.03) * motion;
      group.position.y = Math.sin(elapsed * 0.55) * 0.18 * motion;
      core.rotation.x = elapsed * 0.18 * motion;
      core.rotation.y = elapsed * 0.28 * motion;
      orbitA.rotation.z = elapsed * 0.16 * motion;
      orbitB.rotation.z = -elapsed * 0.1 * motion;
      stars.rotation.y = elapsed * 0.006 * motion;

      panels.forEach(({ panel, angle, radius, speed }, index) => {
        const orbit = angle + elapsed * speed * motion;
        panel.position.x = Math.cos(orbit) * radius;
        panel.position.z = Math.sin(orbit) * 1.35;
        panel.position.y = Math.sin(elapsed * 0.8 + index) * 1.2;
        panel.rotation.x += 0.006 * motion;
        panel.rotation.y += 0.009 * motion;
      });

      renderer.render(scene, camera);
      frame = window.requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
      mount.removeChild(renderer.domElement);
      core.geometry.dispose();
      coreMaterial.dispose();
      orbitA.geometry.dispose();
      orbitB.geometry.dispose();
      torusMaterial.dispose();
      panels.forEach(({ panel }) => panel.geometry.dispose());
      panelMaterials.forEach((material) => material.dispose());
      starsGeometry.dispose();
      (stars.material as THREE.Material).dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="pointer-events-none fixed inset-0 z-0 h-screen w-screen" aria-hidden="true" />;
});

ThreeWorld.displayName = 'ThreeWorld';

export default ThreeWorld;
