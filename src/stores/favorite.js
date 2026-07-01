import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { loadFavorites, addFavorite, removeFavorite } from '../utils/api.js'

function makeKey(bankId, questionId) {
  return `${bankId}_${questionId}`
}

export const useFavoriteStore = defineStore('favorite', () => {
  // ===== state =====
  const favorites = ref([])
  const loading = ref(false)
  const loaded = ref(false)

  // ===== computed =====
  const favoritedKeys = computed(() => {
    const set = new Set()
    for (const f of favorites.value) {
      set.add(makeKey(f.bankId, f.questionId))
    }
    return set
  })

  const favoriteCount = computed(() => favorites.value.length)

  // Group by subject (from questionData)
  const favoritesBySubject = computed(() => {
    const map = {}
    for (const f of favorites.value) {
      const subject = f.questionData?.subject || '未分类'
      if (!map[subject]) map[subject] = []
      map[subject].push(f)
    }
    return map
  })

  // ===== actions =====
  async function load() {
    if (loaded.value) return
    loading.value = true
    try {
      favorites.value = await loadFavorites()
      loaded.value = true
    } catch (e) {
      console.error('加载收藏失败:', e)
    } finally {
      loading.value = false
    }
  }

  function isFavorited(bankId, questionId) {
    return favoritedKeys.value.has(makeKey(bankId, questionId))
  }

  async function toggleFavorite(bankId, questionId, bankName, questionData) {
    const key = makeKey(bankId, questionId)
    const wasFavorited = favoritedKeys.value.has(key)
    if (wasFavorited) {
      // Optimistic remove — update local state immediately
      favorites.value = favorites.value.filter(
        f => !(String(f.bankId) === String(bankId) && String(f.questionId) === String(questionId))
      try {
        await removeFavorite(bankId, questionId)
      } catch (e) {
        // Revert on failure
        favorites.value.unshift({
          id: Date.now(),
          bankId,
          questionId,
          bankName,
          questionData,
          createdAt: new Date().toISOString(),
        })
        console.error('取消收藏失败:', e)
      }
    } else {
      // Optimistic add — update local state immediately
      favorites.value.unshift({
        id: Date.now(),
        bankId,
        questionId,
        bankName,
        questionData,
        createdAt: new Date().toISOString(),
      })
      try {
        const result = await addFavorite({ bankId, questionId, bankName, questionData })
        // Update with server-assigned id
        const local = favorites.value.find(
          f => String(f.bankId) === String(bankId) && String(f.questionId) === String(questionId))
        if (local) local.id = result.id
      } catch (e) {
        // Revert on failure
        favorites.value = favorites.value.filter(
          f => !(String(f.bankId) === String(bankId) && String(f.questionId) === String(questionId))
        console.error('添加收藏失败:', e)
      }
    }
  }

  // Force reload (e.g. after import)
  async function reload() {
    loaded.value = false
    await load()
  }

  return {
    favorites,
    loading,
    loaded,
    favoritedKeys,
    favoriteCount,
    favoritesBySubject,
    load,
    isFavorited,
    toggleFavorite,
    reload,
  }
})
