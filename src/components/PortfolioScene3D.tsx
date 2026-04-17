import { memo, useEffect, useRef } from 'react';
import * as THREE from 'three';

const PortfolioScene3D = memo(() => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.set(0, 0.25, 7);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const screen = new THREE.Mesh(
      new THREE.BoxGeometry(3.45, 2.2, 0.12, 12, 12, 2),
      new THREE.MeshPhysicalMaterial({
        color: '#111827',
        metalness: 0.25,
        roughness: 0.18,
        clearcoat: 0.72,
        clearcoatRoughness: 0.12,
      }),
    );
    screen.rotation.set(-0.12, -0.28, 0.06);
    group.add(screen);

    const glass = new THREE.Mesh(
      new THREE.PlaneGeometry(3.18, 1.88),
      new THREE.MeshBasicMaterial({
        color: '#f5f5f7',
        transparent: true,
        opacity: 0.9,
      }),
    );
    glass.position.set(-0.02, 0, 0.08);
    glass.rotation.copy(screen.rotation);
    group.add(glass);

    const accentColors = ['#0071e3', '#34c759', '#ff375f', '#8e8e93'];
    const cards = Array.from({ length: 8 }, (_, index) => {
      const card = new THREE.Mesh(
        new THREE.BoxGeometry(index % 3 === 0 ? 0.95 : 0.62, 0.3, 0.04),
        new THREE.MeshStandardMaterial({
          color: accentColors[index % accentColors.length],
          roughness: 0.36,
          metalness: 0.08,
          emissive: accentColors[index % accentColors.length],
          emissiveIntensity: 0.05,
        }),
      );
      card.position.set(-1.08 + (index % 3) * 0.88, 0.56 - Math.floor(index / 3) * 0.48, 0.2 + index * 0.006);
      card.rotation.copy(screen.rotation);
      group.add(card);
      return card;
    });

    const chip = new THREE.Mesh(
      new THREE.CylinderGeometry(0.48, 0.48, 0.08, 64),
      new THREE.MeshStandardMaterial({
        color: '#d2d2d7',
        metalness: 0.64,
        roughness: 0.22,
        emissive: '#ffffff',
        emissiveIntensity: 0.06,
      }),
    );
    chip.position.set(1.35, -0.78, 0.18);
    chip.rotation.set(Math.PI / 2 - 0.12, -0.28, 0.06);
    group.add(chip);

    const orbitMaterial = new THREE.MeshBasicMaterial({ color: '#0071e3', wireframe: true, transparent: true, opacity: 0.18 });
    const orbits = Array.from({ length: 3 }, (_, index) => {
      const orbit = new THREE.Mesh(new THREE.TorusGeometry(2.15 + index * 0.42, 0.008, 8, 140), orbitMaterial);
      orbit.rotation.set(1.1 + index * 0.18, 0.2 - index * 0.22, 0.48);
      group.add(orbit);
      return orbit;
    });

    const particleGeometry = new THREE.IcosahedronGeometry(0.08, 0);
    const particleMaterial = new THREE.MeshStandardMaterial({ color: '#0071e3', roughness: 0.35, emissive: '#0071e3', emissiveIntensity: 0.16 });
    const particles = Array.from({ length: 22 }, (_, index) => {
      const mesh = new THREE.Mesh(particleGeometry, particleMaterial);
      const angle = index * 1.37;
      const radius = 2.1 + (index % 6) * 0.18;
      mesh.position.set(Math.cos(angle) * radius, Math.sin(index * 0.7) * 1.25, Math.sin(angle) * 0.9);
      group.add(mesh);
      return { mesh, angle, radius, speed: 0.12 + index * 0.002 };
    });

    scene.add(new THREE.AmbientLight(0xffffff, 1.3));
    const keyLight = new THREE.PointLight('#ffffff', 34, 15);
    keyLight.position.set(1.8, 3.2, 4.4);
    scene.add(keyLight);
    const blueLight = new THREE.PointLight('#0071e3', 18, 12);
    blueLight.position.set(-2.8, -1.4, 3.2);
    scene.add(blueLight);

    const pointer = { x: 0, y: 0 };
    let frame = 0;
    let width = 0;
    let height = 0;

    const resize = () => {
      const nextWidth = mount.clientWidth || window.innerWidth;
      const nextHeight = mount.clientHeight || window.innerHeight;
      if (nextWidth === width && nextHeight === height) return;
      width = nextWidth;
      height = nextHeight;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      group.scale.setScalar(width < 640 ? 0.8 : 1);
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
      const motion = reduceMotion ? 0.18 : 1;

      group.rotation.y += ((pointer.x * 0.18 - group.rotation.y) * 0.035) * motion;
      group.rotation.x += ((-pointer.y * 0.08 - group.rotation.x) * 0.03) * motion;
      screen.position.y = Math.sin(elapsed * 0.7) * 0.045 * motion;
      glass.position.y = screen.position.y;
      chip.rotation.z = elapsed * 0.28 * motion;

      cards.forEach((card, index) => {
        card.position.z = 0.2 + Math.sin(elapsed * 1.4 + index) * 0.035 * motion;
      });

      orbits.forEach((orbit, index) => {
        orbit.rotation.z = elapsed * (0.08 + index * 0.035) * motion;
      });

      particles.forEach(({ mesh, angle, radius, speed }, index) => {
        const orbit = angle + elapsed * speed * motion;
        mesh.position.x = Math.cos(orbit) * radius;
        mesh.position.z = Math.sin(orbit) * 0.9;
        mesh.rotation.x += 0.008 * motion;
        mesh.rotation.y += 0.011 * motion;
        mesh.scale.setScalar(0.7 + Math.sin(elapsed * 1.2 + index) * 0.18);
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
      [screen, glass, chip, ...cards, ...orbits].forEach((mesh) => {
        mesh.geometry.dispose();
        const material = mesh.material;
        if (Array.isArray(material)) material.forEach((item) => item.dispose());
        else material.dispose();
      });
      particleGeometry.dispose();
      particleMaterial.dispose();
      orbitMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="h-full min-h-[320px] w-full" aria-hidden="true" />;
});

PortfolioScene3D.displayName = 'PortfolioScene3D';

export default PortfolioScene3D;
