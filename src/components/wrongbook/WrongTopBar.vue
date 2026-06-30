<template>
  <div class="wrong-topbar">
    <input
      type="search"
      class="search-input"
      :value="wrongBook.keyword"
      @input="onInput"
      placeholder="搜索题干关键词..."
    />
    <div class="sort-control" ref="sortRef">
      <label class="text-muted sort-label">排序</label>
      <button
        type="button"
        class="sort-trigger"
        :class="{ open: isOpen }"
        @click="toggle"
      >
        <span>{{ currentLabel }}</span>
        <svg class="sort-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
      <Transition name="sort-dropdown">
        <ul v-if="isOpen" class="sort-dropdown">
          <li
            v-for="opt in SORT_OPTIONS"
            :key="opt.value"
            class="sort-option"
            :class="{ active: wrongBook.sortBy === opt.value }"
            @click="select(opt.value)"
          >
            <span class="sort-check">
              <svg v-if="wrongBook.sortBy === opt.value" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </span>
            <span class="sort-label-text">{{ opt.label }}</span>
          </li>
        </ul>
      </Transition>
    </div>
    <button class="btn btn-sm btn-secondary" @click="exportMarkdown" :disabled="wrongBook.filteredEntries.length === 0">
      导出
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useWrongBookStore } from '../../stores/wrongBook.js'

const wrongBook = useWrongBookStore()

const SORT_OPTIONS = [
  { value: 'lastWrongAt', label: '最近答错' },
  { value: 'wrongCount', label: '答错次数' },
  { value: 'firstWrongAt', label: '首次答错' },
]

const isOpen = ref(false)
const sortRef = ref(null)

const currentLabel = computed(() => {
  return SORT_OPTIONS.find(o => o.value === wrongBook.sortBy)?.label || '排序'
})

function toggle() {
  isOpen.value = !isOpen.value
}

function select(value) {
  wrongBook.sortBy = value
  isOpen.value = false
}

function onInput(e) {
  wrongBook.keyword = e.target.value
}

function handleClickOutside(event) {
  if (sortRef.value && !sortRef.value.contains(event.target)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside, true)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside, true)
})

function exportMarkdown() {
  const lines = ['# 错题汇总', '']
  for (const e of wrongBook.filteredEntries) {
    lines.push(`## [${e.subject}] 第 ${e.id} 题`)
    lines.push('')
    lines.push(`**题型**：${typeLabel(e.type)}`)
    lines.push('')
    lines.push(`**题目**：${e.question}`)
    lines.push('')
    if (e.options && e.options.length) {
      for (const opt of e.options) lines.push(`- ${opt.label}. ${opt.text}`)
      lines.push('')
    }
    lines.push(`**正确答案**：${formatAnswer(e.answer)}`)
    lines.push('')
    lines.push(`**答错次数**：${e.wrongCount}`)
    lines.push('')
    lines.push('---')
    lines.push('')
  }
  const blob = new Blob([lines.join('\n')], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `wrong-questions-${new Date().toISOString().slice(0, 10)}.md`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function typeLabel(t) {
  return { single: '单选', multi: '多选', fill: '填空', essay: '简答' }[t] || t
}

function formatAnswer(a) {
  if (Array.isArray(a)) return a.join(' / ')
  return String(a ?? '')
}
</script>

<style scoped>
.wrong-topbar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 0;
}

.search-input {
  flex: 1;
  padding: 0.55rem 0.875rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--bg-surface);
  color: var(--text-primary);
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.search-input:focus {
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px var(--accent-soft);
}

.sort-control {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.sort-label {
  font-size: 0.8rem;
  white-space: nowrap;
}

.sort-trigger {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.5rem 0.625rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--bg-surface);
  color: var(--text-primary);
  font-size: 0.85rem;
  cursor: pointer;
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.sort-trigger:hover {
  border-color: var(--border-hover);
}

.sort-trigger.open,
.sort-trigger:focus {
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px var(--accent-soft);
}

.sort-arrow {
  width: 0.85rem;
  height: 0.85rem;
  transition: transform 0.2s ease;
}

.sort-trigger.open .sort-arrow {
  transform: rotate(180deg);
}

.sort-dropdown {
  position: absolute;
  top: calc(100% + 0.35rem);
  right: 0;
  min-width: 7rem;
  padding: 0.35rem;
  list-style: none;
  background: var(--bg-surface-raised);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  z-index: 50;
}

.sort-dropdown-enter-active,
.sort-dropdown-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.sort-dropdown-enter-from,
.sort-dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

.sort-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.65rem;
  font-size: 0.85rem;
  color: var(--text-primary);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: background 0.12s ease, color 0.12s ease;
}

.sort-option:hover {
  background: var(--bg-card-hover);
}

.sort-check {
  width: 0.95rem;
  height: 0.95rem;
  flex-shrink: 0;
  color: var(--accent-primary);
}

.sort-check svg {
  width: 100%;
  height: 100%;
  animation: scaleIn 0.15s ease;
}

.sort-option.active .sort-label-text {
  color: var(--accent-primary);
  font-weight: 600;
}
</style>
