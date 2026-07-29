/**
 * The avatar.
 *
 * A small luminous figure, built from primitives — no model files. It reads the
 * five state dimensions and nothing else. Keep the vocabulary small and
 * consistent so the player learns to read it without being told.
 *
 * Hard constraint from the compendium: at its worst this is DIMINISHED, FOGGY
 * and SMALL. Never grotesque. Sad-but-recognisable invites empathy; grotesque
 * invites distance.
 */

import * as THREE from 'three';
import type { SelfState } from './state.js';

const VITAL = new THREE.Color('#ffc27a'); // warm, present
const DRAINED = new THREE.Color('#7d8290'); // grey, but never sickly

/** A soft radial falloff, drawn once and reused for the glow and the haze. */
function radialTexture(
  inner = 'rgba(255,214,160,0.85)',
  outer = 'rgba(255,190,120,0)'
): THREE.CanvasTexture {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, inner);
  g.addColorStop(1, outer);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export interface Avatar {
  root: THREE.Group;
  focus: THREE.Vector3;
  attend(k: number): void;
  update(s: SelfState, t: number): void;
}

export function createAvatar({ reducedMotion = false }: { reducedMotion?: boolean } = {}): Avatar {
  const root = new THREE.Group(); // travels the track
  const body = new THREE.Group(); // carries posture and scale
  root.add(body);

  const material = new THREE.MeshStandardMaterial({
    color: VITAL.clone(),
    emissive: VITAL.clone(),
    emissiveIntensity: 0.9,
    roughness: 0.55,
    metalness: 0.0,
  });

  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.22, 0.44, 6, 16), material);
  torso.position.y = 0.52;
  body.add(torso);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.165, 20, 16), material);
  head.position.y = 1.02;
  body.add(head);

  // Clarity lives here: a shell that fogs the figure's edges as it comes apart.
  const hazeMaterial = new THREE.MeshBasicMaterial({
    color: 0xb9c4d6,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const haze = new THREE.Mesh(new THREE.CapsuleGeometry(0.32, 0.58, 6, 16), hazeMaterial);
  haze.position.y = 0.62;
  body.add(haze);

  // The light it casts is its vitality — it dims with the figure.
  const lamp = new THREE.PointLight(VITAL.clone(), 2.6, 7, 2);
  lamp.position.y = 0.7;
  body.add(lamp);

  const glow = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: radialTexture(),
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.7,
    })
  );
  glow.scale.set(2.6, 2.6, 1);
  glow.position.y = 0.68;
  body.add(glow);

  const colour = new THREE.Color();
  let attention = 0; // 0 walking, 1 meeting your eye at the reveal

  return {
    root,
    /** Where the camera should look — the head, not the feet. */
    focus: new THREE.Vector3(),

    /**
     * The reveal. There is no face here and there should not be — but "it looks
     * back at you" needs *something*, so the figure gathers itself: it lifts,
     * its light comes up, and the haze pulls in. Attention, not a face.
     */
    attend(k: number): void {
      attention = k;
    },

    update(s: SelfState, t: number): void {
      // SCALE — present -> diminished. Never so small it reads as comic.
      const size = 1 - s.scale * 0.38;
      body.scale.setScalar(size);

      // COLOUR / LIGHT — warm and luminous -> drained.
      //
      // Everything here keeps a floor. At its worst this figure must still be
      // clearly SEEN: diminished and sad, never swallowed by the dark. A player
      // who can't make out their own avatar has been given nothing to feel.
      colour.copy(VITAL).lerp(DRAINED, s.colour);
      material.color.copy(colour);
      material.emissive.copy(colour);
      material.emissiveIntensity = (0.9 - s.colour * 0.5) * (1 + attention * 0.35);
      lamp.color.copy(colour);
      lamp.intensity = (2.6 - s.colour * 1.45) * (1 + attention * 0.3);
      glow.material.opacity = 0.5 - s.colour * 0.24;
      glow.scale.setScalar((1.95 - s.colour * 0.5 - attention * 0.25) * size);

      // CLARITY — sharp -> coming apart at the edges. It pulls itself together
      // a little when it turns to look at you.
      hazeMaterial.opacity = s.clarity * 0.5 * (1 - attention * 0.45);
      haze.scale.setScalar(1 + s.clarity * 0.35);

      // POSTURE — upright and fluid -> heavy, slumped, dragging.
      const slump = s.posture * 0.34 * (1 - attention * 0.25);
      body.rotation.x = slump;
      head.position.y = 1.02 - slump * 0.42 + attention * 0.035;

      // Idle life. It breathes more slowly the heavier it gets, and the world
      // dimension is the only thing allowed to make it unsteady.
      if (!reducedMotion) {
        const breath = Math.sin(t * (1.7 - s.posture * 0.8)) * 0.022 * (1 - s.posture * 0.5);
        body.position.y = breath;
        const unsteady = s.world * 0.03 + s.clarity * 0.012;
        body.position.x = Math.sin(t * 9.1) * unsteady;
        body.rotation.z = Math.sin(t * 6.3) * unsteady * 0.6;
      }

      this.focus.set(
        root.position.x,
        root.position.y + (0.86 - slump * 0.3) * size,
        root.position.z
      );
    },
  };
}
