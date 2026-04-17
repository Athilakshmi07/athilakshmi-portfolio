import { memo, useEffect, useRef } from 'react';
import * as THREE from 'three';

type Tower = {
  mesh: THREE.Mesh;
  baseY: number;
  pulse: number;
};

type DropBall = {
  mesh: THREE.Mesh;
  ripple: THREE.Mesh;
  x: number;
  z: number;
  delay: number;
  speed: number;
  height: number;
  floor: number;
  drift: number;
};

const ThreeWorld = memo(() => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030505, 0.055);

    const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 120);
    camera.position.set(0, 2.5, 9.6);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    mount.appendChild(renderer.domElement);

    const world = new THREE.Group();
    world.rotation.x = -0.08;
    scene.add(world);

    const terrainGeometry = new THREE.PlaneGeometry(28, 26, 72, 72);
    terrainGeometry.rotateX(-Math.PI / 2);
    const terrainMaterial = new THREE.MeshBasicMaterial({
      color: '#14f1d9',
      wireframe: true,
      transparent: true,
      opacity: 0.24,
    });
    const terrain = new THREE.Mesh(terrainGeometry, terrainMaterial);
    terrain.position.set(0, -2.3, -2.8);
    world.add(terrain);

    const originalTerrain = Float32Array.from(terrainGeometry.attributes.position.array as ArrayLike<number>);

    const glowGeometry = new THREE.PlaneGeometry(28, 26, 1, 1);
    glowGeometry.rotateX(-Math.PI / 2);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: '#042f2e',
      transparent: true,
      opacity: 0.36,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const glowFloor = new THREE.Mesh(glowGeometry, glowMaterial);
    glowFloor.position.copy(terrain.position);
    glowFloor.position.y -= 0.04;
    world.add(glowFloor);

    const towerGeometry = new THREE.BoxGeometry(0.52, 1, 0.52);
    const towerMaterials = ['#14f1d9', '#a3e635', '#fb3f6c'].map(
      (color) =>
        new THREE.MeshPhysicalMaterial({
          color,
          emissive: color,
          emissiveIntensity: 0.42,
          metalness: 0.12,
          roughness: 0.24,
          clearcoat: 0.8,
          transparent: true,
          opacity: 0.72,
        }),
    );

    const towers: Tower[] = [];
    const towerLayout = [
      [-4.4, -1.2, 2.5],
      [-3.1, 1.3, 1.7],
      [-1.7, -0.35, 3.4],
      [-0.35, 1.85, 2.25],
      [1.2, -1.0, 4.2],
      [2.55, 1.15, 1.95],
      [4.1, -0.1, 3.1],
    ];

    towerLayout.forEach(([x, z, height], index) => {
      const mesh = new THREE.Mesh(towerGeometry, towerMaterials[index % towerMaterials.length]);
      mesh.scale.set(1, height, 1);
      mesh.position.set(x, -2.3 + height / 2, z - 1.2);
      mesh.rotation.y = (index % 2 === 0 ? 1 : -1) * 0.16;
      world.add(mesh);
      towers.push({ mesh, baseY: mesh.position.y, pulse: index * 0.77 });
    });

    const haloMaterial = new THREE.MeshBasicMaterial({ color: '#14f1d9', transparent: true, opacity: 0.32 });
    const halo = new THREE.Mesh(new THREE.TorusGeometry(3.25, 0.018, 8, 180), haloMaterial);
    halo.position.set(0.15, 0.28, -1.8);
    halo.rotation.set(1.35, 0.12, 0.25);
    world.add(halo);

    const portal = new THREE.Group();
    portal.position.set(2.1, 0.12, -2.4);
    world.add(portal);

    const portalMaterials = ['#14f1d9', '#a3e635', '#fb3f6c'].map(
      (color) => new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity: 0.3 }),
    );
    const portalRings = Array.from({ length: 5 }, (_, index) => {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(1.15 + index * 0.32, 0.012, 8, 190), portalMaterials[index % portalMaterials.length]);
      ring.rotation.set(1.18 + index * 0.08, 0.46 - index * 0.13, index * 0.34);
      portal.add(ring);
      return ring;
    });

    const knotMaterial = new THREE.MeshBasicMaterial({ color: '#e5ff7a', wireframe: true, transparent: true, opacity: 0.5 });
    const knot = new THREE.Mesh(new THREE.TorusKnotGeometry(0.52, 0.026, 120, 8, 2, 5), knotMaterial);
    portal.add(knot);

    const beaconMaterial = new THREE.MeshBasicMaterial({ color: '#a3e635', transparent: true, opacity: 0.72 });
    const beacon = new THREE.Mesh(new THREE.OctahedronGeometry(0.36, 0), beaconMaterial);
    beacon.position.set(0.15, 0.28, -1.8);
    world.add(beacon);

    const makeRibbon = (color: string, verticalOffset: number, phase: number) => {
      const points = Array.from({ length: 72 }, (_, index) => {
        const progress = index / 71;
        const x = (progress - 0.5) * 13.5;
        const y = verticalOffset + Math.sin(progress * Math.PI * 4 + phase) * 0.45;
        const z = -2.4 + Math.cos(progress * Math.PI * 3 + phase) * 1.15;
        return new THREE.Vector3(x, y, z);
      });
      const curve = new THREE.CatmullRomCurve3(points);
      const geometry = new THREE.TubeGeometry(curve, 160, 0.018, 8, false);
      const material = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.58 });
      const mesh = new THREE.Mesh(geometry, material);
      world.add(mesh);
      return { mesh, phase };
    };

    const ribbons = [makeRibbon('#14f1d9', 0.7, 0), makeRibbon('#a3e635', 1.25, 1.4), makeRibbon('#fb3f6c', 0.18, 2.6)];

    const ballGeometry = new THREE.SphereGeometry(0.17, 24, 16);
    const rippleGeometry = new THREE.TorusGeometry(0.28, 0.01, 8, 64);
    const ballMaterials = ['#14f1d9', '#a3e635', '#fb3f6c', '#e5ff7a'].map(
      (color) =>
        new THREE.MeshPhysicalMaterial({
          color,
          emissive: color,
          emissiveIntensity: 0.95,
          metalness: 0.18,
          roughness: 0.12,
          clearcoat: 1,
          transparent: true,
          opacity: 0.95,
        }),
    );

    const dropBalls: DropBall[] = Array.from({ length: 20 }, (_, index) => {
      const material = ballMaterials[index % ballMaterials.length].clone();
      const mesh = new THREE.Mesh(ballGeometry, material);
      const rippleMaterial = new THREE.MeshBasicMaterial({
        color: material.color,
        transparent: true,
        opacity: 0,
        depthWrite: false,
      });
      const ripple = new THREE.Mesh(rippleGeometry, rippleMaterial);
      const column = index % 10;
      const row = Math.floor(index / 10);
      const x = -6.1 + column * 1.35 + (row % 2) * 0.45;
      const z = -4.25 + row * 2.15 + Math.sin(index * 1.7) * 0.72;
      const floor = -2.18;
      mesh.position.set(x, floor + 3, z);
      ripple.position.set(x, floor + 0.03, z);
      ripple.rotation.x = Math.PI / 2;
      world.add(mesh, ripple);
      return {
        mesh,
        ripple,
        x,
        z,
        delay: index * 0.073,
        speed: 0.14 + (index % 5) * 0.018,
        height: 3.4 + (index % 4) * 0.55,
        floor,
        drift: 0.16 + (index % 3) * 0.05,
      };
    });

    const starsGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(520 * 3);
    for (let i = 0; i < 520; i += 1) {
      const base = i * 3;
      starPositions[base] = (Math.random() - 0.5) * 24;
      starPositions[base + 1] = (Math.random() - 0.5) * 12 + 1.3;
      starPositions[base + 2] = -5 - Math.random() * 18;
    }
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const stars = new THREE.Points(
      starsGeometry,
      new THREE.PointsMaterial({ color: '#d9f99d', size: 0.026, transparent: true, opacity: 0.68 }),
    );
    scene.add(stars);

    scene.add(new THREE.AmbientLight(0xffffff, 0.55));
    const key = new THREE.PointLight('#14f1d9', 46, 18);
    key.position.set(3.5, 4.2, 4);
    scene.add(key);
    const rim = new THREE.PointLight('#fb3f6c', 34, 18);
    rim.position.set(-4.5, 0.2, 3.5);
    scene.add(rim);
    const lift = new THREE.PointLight('#a3e635', 24, 14);
    lift.position.set(0, 2.7, -2);
    scene.add(lift);

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
      world.scale.setScalar(width < 700 ? 0.74 : 1);
      world.position.x = width < 700 ? 0.55 : 0.25;
      portal.position.x = width < 700 ? 1.35 : 2.15;
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

      const positions = terrainGeometry.attributes.position as THREE.BufferAttribute;
      for (let index = 0; index < positions.count; index += 1) {
        const x = originalTerrain[index * 3];
        const z = originalTerrain[index * 3 + 2];
        const wave =
          Math.sin(x * 0.78 + elapsed * 0.92 * motion) * 0.18 +
          Math.cos(z * 0.62 + elapsed * 0.7 * motion) * 0.16 +
          Math.sin((x + z) * 0.38 + elapsed * 1.15 * motion) * 0.12;
        positions.setY(index, wave);
      }
      positions.needsUpdate = true;

      world.rotation.y += ((pointer.x * 0.18 - world.rotation.y) * 0.035) * motion;
      world.rotation.x += ((-0.08 - pointer.y * 0.055 - world.rotation.x) * 0.03) * motion;
      world.position.y = Math.sin(elapsed * 0.5) * 0.11 * motion;
      camera.position.x += (pointer.x * 0.55 - camera.position.x) * 0.025 * motion;
      camera.position.y += (2.5 - pointer.y * 0.24 - camera.position.y) * 0.025 * motion;
      camera.lookAt(0, -0.55, -2.3);

      halo.rotation.z = elapsed * 0.18 * motion;
      halo.rotation.y = Math.sin(elapsed * 0.3) * 0.12;
      portal.rotation.y = Math.sin(elapsed * 0.24) * 0.16;
      portal.rotation.x = Math.sin(elapsed * 0.18) * 0.08;
      portalRings.forEach((ring, index) => {
        ring.rotation.z += (0.0035 + index * 0.0008) * motion * (index % 2 === 0 ? 1 : -1);
      });
      knot.rotation.x = elapsed * 0.32 * motion;
      knot.rotation.y = -elapsed * 0.44 * motion;
      beacon.rotation.x = elapsed * 0.58 * motion;
      beacon.rotation.y = elapsed * 0.42 * motion;
      beacon.scale.setScalar(1 + Math.sin(elapsed * 2.2) * 0.08 * motion);
      stars.rotation.y = elapsed * 0.004 * motion;

      towers.forEach(({ mesh, baseY, pulse }, index) => {
        const liftAmount = Math.sin(elapsed * 1.35 + pulse) * 0.11 * motion;
        mesh.position.y = baseY + liftAmount;
        mesh.rotation.y += (0.0015 + index * 0.00015) * motion;
        const material = mesh.material as THREE.MeshPhysicalMaterial;
        material.emissiveIntensity = 0.32 + Math.sin(elapsed * 1.8 + pulse) * 0.12;
      });

      ribbons.forEach(({ mesh, phase }, index) => {
        mesh.rotation.y = Math.sin(elapsed * 0.28 + phase) * 0.09;
        mesh.position.y = Math.sin(elapsed * 0.72 + phase) * 0.13 * motion;
        mesh.position.x = Math.sin(elapsed * 0.38 + index) * 0.16 * motion;
      });

      dropBalls.forEach(({ mesh, ripple, x, z, delay, speed, height, floor, drift }, index) => {
        const cycle = (elapsed * speed * motion + delay) % 1;
        const fall = cycle < 0.82 ? cycle / 0.82 : 1;
        const bounce = cycle >= 0.82 ? (cycle - 0.82) / 0.18 : 0;
        const easedFall = 1 - (1 - fall) * (1 - fall);
        const bounceLift = Math.sin(bounce * Math.PI) * 0.45 * (1 - bounce);
        const impact = Math.max(0, 1 - Math.abs(cycle - 0.84) / 0.16);

        mesh.position.x = x + Math.sin(elapsed * 0.92 + index) * drift;
        mesh.position.z = z + Math.cos(elapsed * 0.74 + index * 0.8) * drift;
        mesh.position.y = floor + height * (1 - easedFall) + bounceLift;
        mesh.rotation.x += (0.018 + index * 0.0008) * motion;
        mesh.rotation.z -= (0.013 + index * 0.0006) * motion;
        mesh.scale.set(1 + impact * 0.18, 1 - impact * 0.28, 1 + impact * 0.18);

        ripple.position.x = mesh.position.x;
        ripple.position.z = mesh.position.z;
        ripple.scale.setScalar(0.45 + impact * 2.2);
        ripple.rotation.z += 0.012 * motion;
        (ripple.material as THREE.MeshBasicMaterial).opacity = impact * 0.6;
        ((mesh.material as THREE.MeshPhysicalMaterial).emissiveIntensity = 0.72 + impact * 1.05);
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
      terrainGeometry.dispose();
      terrainMaterial.dispose();
      glowGeometry.dispose();
      glowMaterial.dispose();
      towerGeometry.dispose();
      towerMaterials.forEach((material) => material.dispose());
      halo.geometry.dispose();
      haloMaterial.dispose();
      portalRings.forEach((ring) => ring.geometry.dispose());
      portalMaterials.forEach((material) => material.dispose());
      knot.geometry.dispose();
      knotMaterial.dispose();
      beacon.geometry.dispose();
      beaconMaterial.dispose();
      ribbons.forEach(({ mesh }) => {
        mesh.geometry.dispose();
        (mesh.material as THREE.Material).dispose();
      });
      ballGeometry.dispose();
      rippleGeometry.dispose();
      ballMaterials.forEach((material) => material.dispose());
      dropBalls.forEach(({ mesh, ripple }) => {
        (mesh.material as THREE.Material).dispose();
        (ripple.material as THREE.Material).dispose();
      });
      starsGeometry.dispose();
      (stars.material as THREE.Material).dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="pointer-events-none fixed inset-0 z-0 h-screen w-screen" aria-hidden="true" />;
});

ThreeWorld.displayName = 'ThreeWorld';

export default ThreeWorld;
