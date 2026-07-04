'use client';

import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import * as THREE from 'three';

type ContactDotSurfaceProps = Omit<React.ComponentProps<'div'>, 'ref'>;

/**
 * Section-scoped dotted wave animation for the Contact section.
 * Unlike DottedSurface (fixed, full-page), this is absolute-positioned
 * and sized to its parent container. Uses signal→ion palette.
 */
export function ContactDotSurface({ className, ...props }: ContactDotSurfaceProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;

    const SEPARATION = 120;
    const AMOUNTX = isMobile ? 18 : 30;
    const AMOUNTY = isMobile ? 10 : 16;

    const container = containerRef.current;
    const W = container.clientWidth;
    const H = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, W / H, 1, 10000);
    camera.position.set(0, 280, 1000);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const positions: number[] = [];
    const colors: number[] = [];
    const c1 = new THREE.Color(0x7b96ff); // signal
    const c2 = new THREE.Color(0xa56bff); // ion

    for (let ix = 0; ix < AMOUNTX; ix++) {
      for (let iy = 0; iy < AMOUNTY; iy++) {
        positions.push(
          ix * SEPARATION - (AMOUNTX * SEPARATION) / 2,
          0,
          iy * SEPARATION - (AMOUNTY * SEPARATION) / 2,
        );
        const col = c1.clone().lerp(c2, iy / AMOUNTY);
        colors.push(col.r, col.g, col.b);
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 7,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      sizeAttenuation: true,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    let count = 0;
    let animationId = 0;
    const arr = geometry.attributes.position.array as Float32Array;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      if (!prefersReduced) {
        let i = 0;
        for (let ix = 0; ix < AMOUNTX; ix++) {
          for (let iy = 0; iy < AMOUNTY; iy++) {
            arr[i * 3 + 1] =
              Math.sin((ix + count) * 0.3) * 45 + Math.sin((iy + count) * 0.5) * 45;
            i++;
          }
        }
        geometry.attributes.position.needsUpdate = true;
        count += 0.07;
      }
      renderer.render(scene, camera);
    };

    const handleResize = () => {
      const W2 = container.clientWidth;
      const H2 = container.clientHeight;
      camera.aspect = W2 / H2;
      camera.updateProjectionMatrix();
      renderer.setSize(W2, H2);
    };
    window.addEventListener('resize', handleResize);
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (container && renderer.domElement) {
        try { container.removeChild(renderer.domElement); } catch (_) {}
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={cn('pointer-events-none absolute inset-0', className)}
      {...props}
    />
  );
}
