/**
 * Confetti burst utility — spawns colorful ribbon particles at a given position.
 */
const COLORS = ['#f59e0b', '#ec4899', '#3b82f6', '#22c55e', '#a855f7', '#f97316', '#06b6d4', '#ef4444']
const PARTICLE_COUNT = 14
const RIBBON_COUNT = 6

function randomBetween(a, b) {
  return a + Math.random() * (b - a)
}

export function burstConfetti(x, y) {
  // Round dots
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const dot = document.createElement('span')
    const size = randomBetween(3, 7)
    const angle = randomBetween(0, Math.PI * 2)
    const distance = randomBetween(25, 60)
    const dx = Math.cos(angle) * distance
    const dy = Math.sin(angle) * distance
    const color = COLORS[Math.floor(Math.random() * COLORS.length)]
    const delay = randomBetween(0, 0.08)

    dot.className = 'confetti-dot'
    dot.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      background: ${color};
      pointer-events: none;
      z-index: 9999;
      --dx: ${dx}px;
      --dy: ${dy}px;
      --rot: ${randomBetween(-360, 360)}deg;
      animation: confetti-fly ${randomBetween(0.55, 0.75)}s cubic-bezier(0, 0.7, 0.3, 1) ${delay}s forwards;
    `
    document.body.appendChild(dot)
    dot.addEventListener('animationend', () => dot.remove())
  }

  // Ribbons
  for (let i = 0; i < RIBBON_COUNT; i++) {
    const ribbon = document.createElement('span')
    const w = randomBetween(4, 8)
    const h = randomBetween(10, 18)
    const angle = randomBetween(0, Math.PI * 2)
    const distance = randomBetween(30, 55)
    const dx = Math.cos(angle) * distance
    const dy = Math.sin(angle) * distance
    const color = COLORS[Math.floor(Math.random() * COLORS.length)]
    const delay = randomBetween(0, 0.1)

    ribbon.className = 'confetti-ribbon'
    ribbon.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      width: ${w}px;
      height: ${h}px;
      border-radius: 2px;
      background: ${color};
      pointer-events: none;
      z-index: 9999;
      --dx: ${dx}px;
      --dy: ${dy}px;
      --rot: ${randomBetween(-540, 540)}deg;
      animation: confetti-fly ${randomBetween(0.6, 0.8)}s cubic-bezier(0, 0.7, 0.3, 1) ${delay}s forwards;
    `
    document.body.appendChild(ribbon)
    ribbon.addEventListener('animationend', () => ribbon.remove())
  }
}
