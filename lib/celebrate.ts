import confetti from "canvas-confetti";

const EMOJI = ["🎉", "🎊", "🥳"];
const SCALAR = 2;

let shapes: confetti.Shape[] | undefined;

/** Quick emoji burst from the top-center of an element. */
export function celebrate(from: HTMLElement) {
  shapes ??= EMOJI.map((text) => confetti.shapeFromText({ text, scalar: SCALAR }));
  const { left, top, width } = from.getBoundingClientRect();

  confetti({
    particleCount: 20,
    spread: 70,
    startVelocity: 25,
    ticks: 100,
    scalar: SCALAR,
    shapes,
    flat: true,
    disableForReducedMotion: true,
    origin: { x: (left + width / 2) / innerWidth, y: top / innerHeight },
  });
}
