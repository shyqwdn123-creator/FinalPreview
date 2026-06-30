<template>
  <transition name="drawer">
    <div v-if="entry" class="drawer-overlay" @click.self="close">
      <!-- Confetti canvas -->
      <canvas ref="confettiCanvas" class="confetti-canvas"></canvas>

      <!-- Thumbs-up celebration overlay -->
      <transition name="pop">
        <div v-if="showCelebration" class="celebration-overlay">
          <div class="celebration-card">
            <svg class="thumbs-icon" width="64" height="64" viewBox="0 0 64 64" fill="none">
              <!-- Circle background -->
              <circle cx="32" cy="32" r="30" fill="#22c55e" opacity="0.15"/>
              <circle cx="32" cy="32" r="24" fill="#22c55e" opacity="0.1"/>
              <!-- Thumb -->
              <path d="M18 28c-2.5 1-4 3.5-4 6v4c0 1.5 1 3 2.5 3.5L24 44V26l-6 2z" fill="#22c55e" stroke="#16a34a" stroke-width="1.2" stroke-linejoin="round"/>
              <!-- Hand -->
              <path d="M24 26v18l14 6c2 0.8 4.5-0.2 5.5-2.2l6-14c0.8-2 0-4.3-2-5.2l-2-0.8c-1.5-0.6-3.2 0-4 1.5L40 32" fill="#22c55e" stroke="#16a34a" stroke-width="1.2" stroke-linejoin="round"/>
              <path d="M40 32h8c2.5 0 4.5 2 4.5 4.5v2c0 2.5-2 4.5-4.5 4.5h-6" fill="#22c55e" stroke="#16a34a" stroke-width="1.2" stroke-linejoin="round"/>
              <!-- Sparkles -->
              <circle cx="10" cy="22" r="2" fill="#fbbf24" opacity="0.9"/>
              <circle cx="54" cy="24" r="1.8" fill="#fbbf24" opacity="0.8"/>
              <circle cx="56" cy="42" r="1.5" fill="#fbbf24" opacity="0.7"/>
              <circle cx="8" cy="44" r="1.6" fill="#fbbf24" opacity="0.7"/>
            </svg>
            <p class="celebration-text">已掌握！</p>
          </div>
        </div>
      </transition>

      <aside class="drawer card">
        <header class="drawer-header">
          <div class="header-tags">
            <span class="type-badge" :class="`type-${entry.type}`">{{ typeLabel(entry.type) }}</span>
            <span class="text-muted text-sm">{{ entry.subject }} · {{ entry.bankName }}</span>
          </div>
          <button class="close-btn" @click="close" title="关闭">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </header>

        <div class="drawer-body">
          <div class="meta-row">
            <span class="meta-pill error">答错 {{ entry.wrongCount }} 次</span>
            <span class="meta-pill text-muted">最近：{{ formatDate(entry.lastWrongAt) }}</span>
            <span class="meta-pill text-muted">首次：{{ formatDate(entry.firstWrongAt) }}</span>
          </div>

          <div class="question-block">
            <div class="question-label text-muted">题目</div>
            <p class="question-text" :class="{ expanded: expanded }">{{ entry.question }}</p>
            <button v-if="isLong" class="expand-btn" @click="expanded = !expanded">
              {{ expanded ? '收起' : '展开全文' }}
            </button>
          </div>

          <!-- 单选/多选：显示完整选项 -->
          <div
            v-if="(entry.type === 'single' || entry.type === 'multi') && entry.options"
            class="options-block"
          >
            <div class="question-label text-muted">选项</div>
            <div
              v-for="opt in entry.options"
              :key="opt.label"
              class="opt-row"
              :class="{
                'opt-correct': isCorrectOption(opt.label),
                'opt-wrong': isUserWrongOption(opt.label),
              }"
            >
              <span class="opt-label">{{ opt.label }}</span>
              <span class="opt-text">{{ opt.text }}</span>
            </div>
          </div>

          <!-- 答案对照 -->
          <div class="answer-block">
            <div class="answer-row">
              <span class="answer-label">正确答案</span>
              <span class="answer-value correct">{{ formatAnswer(entry.answer) }}</span>
            </div>
            <div class="answer-row">
              <span class="answer-label">你的答案（最近）</span>
              <span class="answer-value user">
                {{ formatAnswer(entry.attempts[entry.attempts.length - 1]?.userAnswer) }}
              </span>
            </div>
          </div>

          <!-- 历次答错明细 -->
          <div v-if="entry.attempts.length > 1" class="attempts-block">
            <div class="question-label text-muted">历次答错</div>
            <ul class="attempt-list">
              <li v-for="(a, idx) in entry.attempts" :key="idx" class="attempt-item">
                <span class="attempt-date text-muted">{{ formatDateTime(a.at) }}</span>
                <span class="attempt-answer">{{ formatAnswer(a.userAnswer) }}</span>
                <span class="text-muted text-xs">{{ a.mode === 'exam' ? '模拟考试' : '练习' }}</span>
              </li>
            </ul>
          </div>
        </div>

        <footer class="drawer-footer">
          <button class="btn btn-secondary" @click="markMastered">
            {{ isEntryMastered ? '取消已掌握' : '标记已掌握' }}
          </button>
          <button class="btn btn-danger" @click="remove">从错题本移除</button>
        </footer>
      </aside>
    </div>
  </transition>
</template>

<script setup>
import { computed, ref, watch, onBeforeUnmount, nextTick } from 'vue'
import { useWrongBookStore } from '../../stores/wrongBook.js'

const wrongBook = useWrongBookStore()
const entry = computed(() => wrongBook.currentDrawerEntry)
const expanded = ref(false)
const showCelebration = ref(false)
const confettiCanvas = ref(null)
let confettiTimer = null

watch(entry, () => { expanded.value = false })

const isLong = computed(() => (entry.value?.question || '').length > 100)
const isEntryMastered = computed(() => {
  if (!entry.value) return false
  return wrongBook.isEntryMastered(entry.value.key) === true
})

function close() {
  wrongBook.closeDrawer()
}

function markMastered() {
  if (!entry.value) return
  const becomingMastered = !isEntryMastered.value
  wrongBook.markMastered(entry.value.key, becomingMastered)
  if (becomingMastered) {
    showCelebration.value = true
    nextTick(() => launchConfetti())
    setTimeout(() => { showCelebration.value = false }, 2000)
  }
}

function remove() {
  if (!entry.value) return
  if (confirm('确认从错题本移除这道题？原始历史记录会保留。')) {
    wrongBook.removeEntry(entry.value.key)
  }
}

const TYPE_LABELS = { single: '单选', multi: '多选', fill: '填空', essay: '简答' }
function typeLabel(t) { return TYPE_LABELS[t] || '其他' }

function formatDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return `${d.getMonth() + 1}/${d.getDate()}`
}
function formatDateTime(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}
function formatAnswer(a) {
  if (a === undefined || a === null || a === '') return '（未作答）'
  if (Array.isArray(a)) return a.join(' / ')
  return String(a)
}
function isCorrectOption(label) {
  if (!entry.value) return false
  const ans = entry.value.answer
  if (Array.isArray(ans)) return ans.includes(label)
  return ans === label
}
function isUserWrongOption(label) {
  if (!entry.value) return false
  const user = entry.value.attempts[entry.value.attempts.length - 1]?.userAnswer
  if (user === undefined || user === null || user === '') return false
  const inAnswer = isCorrectOption(label)
  if (Array.isArray(user)) {
    return user.includes(label) && !inAnswer
  }
  return user === label && !inAnswer
}

// ─── Confetti particle system ──────────────────────────
function launchConfetti() {
  const canvas = confettiCanvas.value
  if (!canvas) return
  const rect = canvas.getBoundingClientRect()
  canvas.width = rect.width
  canvas.height = rect.height
  const ctx = canvas.getContext('2d')

  const colors = ['#22c55e','#60a5fa','#f59e0b','#a78bfa','#f43f5e','#fbbf24','#34d399','#818cf8']
  const particles = []
  const count = 60
  const cx = rect.width * 0.78  // shoot from the button area
  const cy = rect.height * 0.75

  for (let i = 0; i < count; i++) {
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.2
    const speed = 3 + Math.random() * 9
    particles.push({
      x: cx,
      y: cy,
      vx: Math.cos(angle) * speed * (0.5 + Math.random()),
      vy: Math.sin(angle) * speed * (0.6 + Math.random()),
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 3 + Math.random() * 6,
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 12,
      life: 1,
      decay: 0.008 + Math.random() * 0.018,
      gravity: 0.08 + Math.random() * 0.12,
    })
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    let alive = false
    for (const p of particles) {
      if (p.life <= 0) continue
      alive = true
      p.vy += p.gravity
      p.x += p.vx
      p.y += p.vy
      p.rotation += p.rotSpeed
      p.life -= p.decay

      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate((p.rotation * Math.PI) / 180)
      ctx.globalAlpha = Math.max(0, p.life)
      ctx.fillStyle = p.color
      // Random shape: rect or circle
      if (Math.random() > 0.5) {
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6)
      } else {
        ctx.beginPath()
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.restore()
    }
    if (alive) {
      confettiTimer = requestAnimationFrame(animate)
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
  }
  if (confettiTimer) cancelAnimationFrame(confettiTimer)
  confettiTimer = requestAnimationFrame(animate)
}

// ESC 关闭
function onKeydown(e) {
  if (e.key === 'Escape' && entry.value) close()
}
window.addEventListener('keydown', onKeydown)
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  if (confettiTimer) cancelAnimationFrame(confettiTimer)
})
</script>

<style scoped>
.drawer-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: 200;
  display: flex;
  justify-content: flex-end;
}

/* ─── Confetti canvas ─────────────────────────────────── */
.confetti-canvas {
  position: fixed;
  inset: 0;
  z-index: 300;
  pointer-events: none;
}

/* ─── Celebration overlay ─────────────────────────────── */
.celebration-overlay {
  position: fixed;
  inset: 0;
  z-index: 310;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.celebration-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  animation: celebBounce 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes celebBounce {
  0% { transform: scale(0.3); opacity: 0; }
  60% { transform: scale(1.15); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}

.thumbs-icon {
  filter: drop-shadow(0 4px 16px rgba(34, 197, 94, 0.5));
  animation: thumbFloat 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes thumbFloat {
  0% { transform: translateY(30px) rotate(-15deg); opacity: 0; }
  40% { transform: translateY(-8px) rotate(3deg); opacity: 1; }
  100% { transform: translateY(0) rotate(0deg); opacity: 1; }
}

.celebration-text {
  font-size: 1.2rem;
  font-weight: 800;
  color: #22c55e;
  text-shadow: 0 2px 12px rgba(34, 197, 94, 0.4);
  animation: textReveal 0.5s 0.25s cubic-bezier(0.16, 1, 0.3, 1) both;
  margin: 0;
}

@keyframes textReveal {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Pop transition for celebration */
.pop-enter-active { transition: opacity 0.2s ease; }
.pop-leave-active { transition: opacity 0.35s ease; }
.pop-enter-from, .pop-leave-to { opacity: 0; }
.drawer {
  width: 480px;
  max-width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  border-radius: 0;
  background: var(--bg-card);
  border-left: 1px solid var(--border-color);
}
.drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--border-color);
}
.header-tags {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  min-width: 0;
}
.type-badge {
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  background: var(--accent-soft);
  color: var(--accent-primary);
  border: 1px solid var(--accent-border);
}
.type-badge.type-fill {
  background: var(--success-soft);
  color: var(--success);
  border-color: var(--success-border);
}
.close-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.close-btn:hover {
  background: var(--bg-surface-raised);
  color: var(--text-primary);
}
.drawer-body {
  flex: 1;
  overflow-y: auto;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}
.meta-row {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
}
.meta-pill {
  font-size: 0.75rem;
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  background: var(--bg-surface-raised);
  border: 1px solid var(--border-color);
}
.meta-pill.error {
  background: var(--error-soft);
  color: var(--error);
  border-color: var(--error-border);
}
.question-block, .options-block, .answer-block, .attempts-block {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.question-label {
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.question-text {
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.7;
  color: var(--text-primary);
  white-space: pre-wrap;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.question-text.expanded {
  -webkit-line-clamp: unset;
}
.expand-btn {
  align-self: flex-start;
  background: transparent;
  border: none;
  color: var(--accent-primary);
  cursor: pointer;
  font-size: 0.85rem;
  padding: 0;
}
.options-block {
  padding: 0.75rem;
  background: var(--bg-surface);
  border-radius: var(--radius-md);
}
.opt-row {
  display: flex;
  gap: 0.5rem;
  padding: 0.4rem 0.6rem;
  border-radius: var(--radius-sm);
  border: 1px solid transparent;
  font-size: 0.9rem;
  line-height: 1.5;
}
.opt-row.opt-correct {
  background: var(--success-soft);
  border-color: var(--success-border);
  color: var(--success);
}
.opt-row.opt-wrong {
  background: var(--error-soft);
  border-color: var(--error-border);
  color: var(--error);
}
.opt-label { font-weight: 600; flex-shrink: 0; }
.opt-text { flex: 1; }
.answer-block {
  padding: 0.75rem;
  background: var(--bg-surface-raised);
  border-radius: var(--radius-md);
  gap: 0.5rem;
}
.answer-row {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}
.answer-label {
  font-size: 0.75rem;
  color: var(--text-muted);
  min-width: 100px;
}
.answer-value {
  font-size: 0.92rem;
  font-weight: 500;
}
.answer-value.correct { color: var(--success); }
.answer-value.user { color: var(--error); }
.attempt-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}
.attempt-item {
  display: flex;
  gap: 0.75rem;
  padding: 0.4rem 0.6rem;
  background: var(--bg-surface);
  border-radius: var(--radius-sm);
  font-size: 0.85rem;
  align-items: center;
}
.attempt-date { min-width: 80px; font-variant-numeric: tabular-nums; }
.attempt-answer { flex: 1; color: var(--text-primary); }
.drawer-footer {
  display: flex;
  gap: 0.5rem;
  padding: 0.875rem 1.25rem;
  border-top: 1px solid var(--border-color);
  justify-content: space-between;
}

/* Drawer transition */
.drawer-enter-active, .drawer-leave-active {
  transition: opacity 0.2s ease;
}
.drawer-enter-active .drawer, .drawer-leave-active .drawer {
  transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1);
}
.drawer-enter-from, .drawer-leave-to {
  opacity: 0;
}
.drawer-enter-from .drawer, .drawer-leave-to .drawer {
  transform: translateX(100%);
}

@media (max-width: 768px) {
  .drawer-overlay {
    align-items: flex-end;
  }
  .drawer {
    width: 100vw;
    max-width: 100vw;
    height: calc(100vh - 72px);
    border-radius: var(--radius-xl) var(--radius-xl) 0 0;
    border-left: none;
    border-top: 1px solid var(--border-color);
  }
  .drawer-footer {
    padding-bottom: calc(0.875rem + env(safe-area-inset-bottom, 0px));
  }
}
</style>
