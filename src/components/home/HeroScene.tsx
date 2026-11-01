"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const ACCENT_ORANGE = 0xff5a1f;
const BRIGHT_ORANGE = 0xff7a3d;

export function HeroScene() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.z = 8;

    const group = new THREE.Group();
    scene.add(group);

    // Pure, crisp geodesic wireframe sphere in vivid orange
    const icoGeo = new THREE.IcosahedronGeometry(2.1, 2);
    const wireGeo = new THREE.WireframeGeometry(icoGeo);
    const wireMat = new THREE.LineBasicMaterial({
      color: ACCENT_ORANGE,
      transparent: true,
      opacity: 0.65,
    });
    const wire = new THREE.LineSegments(wireGeo, wireMat);

    // Crisp vertex node points
    const pointsMat = new THREE.PointsMaterial({
      color: BRIGHT_ORANGE,
      size: 0.05,
      transparent: true,
      opacity: 0.85,
    });
    const points = new THREE.Points(icoGeo, pointsMat);

    group.add(wire, points);

    const updateThemeOpacity = () => {
      const isDark = document.documentElement.classList.contains("dark");
      if (isDark) {
        wireMat.opacity = 0.75;
        pointsMat.opacity = 0.95;
      } else {
        wireMat.opacity = 0.5;
        pointsMat.opacity = 0.75;
      }
    };
    updateThemeOpacity();

    const themeObserver = new MutationObserver(() => updateThemeOpacity());
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    const onPointer = (e: PointerEvent) => {
      pointer.tx = e.clientX / window.innerWidth - 0.5;
      pointer.ty = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener("pointermove", onPointer);

    const resize = () => {
      const { width, height } = container.getBoundingClientRect();
      renderer.setSize(width, height, false);
      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    const start = performance.now();
    let frame = 0;
    const loop = (now: number) => {
      const t = (now - start) / 1000;
      const intro = 1 - Math.pow(1 - Math.min(t / 2.2, 1), 4);

      pointer.x += (pointer.tx - pointer.x) * 0.05;
      pointer.y += (pointer.ty - pointer.y) * 0.05;

      group.rotation.y = t * 0.12 + pointer.x * 0.6;
      group.rotation.x = pointer.y * 0.4;
      group.scale.setScalar(0.6 + 0.4 * intro);

      renderer.render(scene, camera);
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointer);
      ro.disconnect();
      themeObserver.disconnect();
      icoGeo.dispose();
      wireGeo.dispose();
      wireMat.dispose();
      pointsMat.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={ref} className="pointer-events-none absolute inset-0 opacity-90 transition-opacity duration-700" />;
}
