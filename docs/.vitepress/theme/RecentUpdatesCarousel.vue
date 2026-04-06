<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useData } from 'vitepress'

interface Update {
  title: string
  summary: string
  updateTimeStr: string
  path: string
}

const { isDark } = useData()
const updates = ref<Update[]>([])
const currentIndex = ref(0)
const isAutoPlay = ref(true)

onMounted(async () => {
  try {
    // 使用相对路径获取数据
    const response = await fetch('/vitepress-caicai666/.vitepress/recent-updates.json')
    if (response.ok) {
      const data = await response.json()
      // 为每个链接添加 base 路径前缀
      updates.value = data.map((item: any) => ({
        ...item,
        path: '/vitepress-caicai666' + item.path
      }))
      startAutoPlay()
    }
  } catch (error) {
    console.error('Failed to load recent updates:', error)
  }
})

const currentUpdate = computed(() => {
  if (updates.value.length === 0) return null
  return updates.value[currentIndex.value]
})

function goToSlide(index: number) {
  currentIndex.value = index % updates.value.length
  resetAutoPlay()
}

function nextSlide() {
  currentIndex.value = (currentIndex.value + 1) % updates.value.length
  resetAutoPlay()
}

function prevSlide() {
  currentIndex.value = (currentIndex.value - 1 + updates.value.length) % updates.value.length
  resetAutoPlay()
}

let autoPlayTimer: NodeJS.Timeout | null = null

function startAutoPlay() {
  if (autoPlayTimer) clearInterval(autoPlayTimer)
  autoPlayTimer = setInterval(() => {
    if (isAutoPlay.value) {
      nextSlide()
    }
  }, 5000) // 每 5 秒切换一次
}

function resetAutoPlay() {
  if (autoPlayTimer) clearInterval(autoPlayTimer)
  if (isAutoPlay.value) {
    startAutoPlay()
  }
}

function toggleAutoPlay() {
  isAutoPlay.value = !isAutoPlay.value
  if (isAutoPlay.value) {
    startAutoPlay()
  } else if (autoPlayTimer) {
    clearInterval(autoPlayTimer)
  }
}
</script>

<template>
  <div v-if="updates.length > 0" class="recent-updates-carousel">
    <div class="carousel-container">
      <h2 class="carousel-title">✨ 最近更新</h2>
      
      <div class="carousel-wrapper">
        <button
          class="carousel-btn carousel-btn-prev"
          @click="prevSlide"
          aria-label="Previous slide"
        >
          ‹
        </button>

        <div class="carousel-slide">
          <Transition name="fade" mode="out-in">
            <div v-if="currentUpdate" :key="currentIndex" class="slide-content">
              <div class="slide-header">
                <h3 class="slide-title">{{ currentUpdate.title }}</h3>
                <span class="slide-date">{{ currentUpdate.updateTimeStr }}</span>
              </div>
              <p class="slide-summary">{{ currentUpdate.summary }}</p>
              <a :href="currentUpdate.path" class="slide-link">
                阅读全文 →
              </a>
            </div>
          </Transition>
        </div>

        <button
          class="carousel-btn carousel-btn-next"
          @click="nextSlide"
          aria-label="Next slide"
        >
          ›
        </button>
      </div>

      <div class="carousel-controls">
        <div class="carousel-dots">
          <button
            v-for="(_, index) in updates"
            :key="index"
            class="dot"
            :class="{ active: index === currentIndex }"
            @click="goToSlide(index)"
            :aria-label="`Go to slide ${index + 1}`"
          />
        </div>
        
        <button
          class="autoplay-toggle"
          @click="toggleAutoPlay"
          :title="isAutoPlay ? '暂停自动播放' : '开启自动播放'"
        >
          {{ isAutoPlay ? '⏸' : '▶️' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.recent-updates-carousel {
  margin: 2rem 0 2rem 0;
  padding: 0 !important;
  background: transparent !important;
  border-radius: 0 !important;
  border: none !important;
  box-shadow: none !important;
  border-top: none !important;
}

.carousel-container {
  max-width: 100%;
  padding-top: 30px;
  margin-top: 1.5rem;
  overflow: hidden;
  border-top: none !important;
  border-bottom: none !important;
  border: none !important;
  box-shadow: none !important;
  outline: none !important;
}

.carousel-title {
  text-align: center;
  font-size: 1.5rem;
  margin: 0 0 1.5rem 0 !important;
  padding: 0 1.5rem !important;
  color: var(--vp-c-brand);
  font-weight: 600;
  border: none !important;
  border-top: none !important;
  border-bottom: none !important;
  box-shadow: none !important;
}

.carousel-wrapper {
  display: flex;
  align-items: center;
  gap: 0;
  position: relative;
  margin: 0 -1.5rem !important;
  padding: 0 1.5rem !important;
  border: none !important;
  border-top: none !important;
  box-shadow: none !important;
}

.carousel-slide {
  flex: 1;
  min-height: 140px;
  margin: 0 0.6rem;
  padding: 1.5rem;
  background: var(--vp-c-bg);
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  display: flex;
  align-items: center;
  overflow: hidden;
  border-top: 1px solid var(--vp-c-divider);
}

.slide-content {
  width: 100%;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease-in-out;
}

.fade-enter-from {
  opacity: 0;
}

.fade-leave-to {
  opacity: 0;
}

.slide-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.8rem;
  gap: 1rem;
}

.slide-title {
  flex: 1;
  font-size: 1.1rem;
  margin: 0;
  color: var(--vp-c-brand);
  line-height: 1.3;
}

.slide-date {
  flex-shrink: 0;
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
  white-space: nowrap;
}

.slide-summary {
  margin: 0.8rem 0;
  color: var(--vp-c-text-2);
  line-height: 1.5;
  font-size: 0.95rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.slide-link {
  display: inline-block;
  margin-top: 0.8rem;
  padding: 0.3rem 0.8rem;
  color: var(--vp-c-brand);
  background: var(--vp-c-brand-soft);
  border-radius: 4px;
  font-weight: 500;
  font-size: 0.9rem;
  text-decoration: none;
  transition: all 0.2s;
}

.slide-link:hover {
  opacity: 0.8;
  transform: translateX(2px);
}

.carousel-btn {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  cursor: pointer;
  border-radius: 6px;
  font-size: 1.3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.carousel-btn:hover {
  background: var(--vp-c-brand);
  color: white;
  border-color: var(--vp-c-brand);
}

.carousel-controls {
  margin: 1rem 1.5rem 1.5rem 1.5rem;
  padding-top: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
}

.carousel-dots {
  display: flex;
  gap: 0.4rem;
  justify-content: center;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: 2px solid var(--vp-c-divider);
  background: transparent;
  cursor: pointer;
  transition: all 0.2s;
}

.dot:hover {
  border-color: var(--vp-c-brand);
}

.dot.active {
  background: var(--vp-c-brand);
  border-color: var(--vp-c-brand);
}

.autoplay-toggle {
  padding: 0.3rem 0.6rem;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.autoplay-toggle:hover {
  background: var(--vp-c-brand-soft);
  border-color: var(--vp-c-brand);
}

@media (max-width: 768px) {
  .recent-updates-carousel {
    padding: 1rem;
    margin: 1.5rem 0;
  }

  .carousel-wrapper {
    gap: 0.5rem;
  }

  .carousel-btn {
    width: 34px;
    height: 34px;
    font-size: 1.1rem;
  }

  .carousel-slide {
    padding: 1rem;
    min-height: 120px;
  }

  .slide-title {
    font-size: 0.95rem;
  }

  .slide-summary {
    font-size: 0.9rem;
    -webkit-line-clamp: 2;
  }

  .carousel-controls {
    gap: 1rem;
  }
}
</style>

/* 彻底去除首页最近更新上方的分割线（VitePress 主题自动加的） */
:global(.VPHome .VPContent .VPHomeFeatures) {
  border-top: none !important;
  box-shadow: none !important;
}
:global(.VPHome .VPContent .VPHomeHero + .VPHomeFeatures) {
  border-top: none !important;
  box-shadow: none !important;
}
:global(.VPHome .VPContent .VPHomeFeatures + .recent-updates-carousel) {
  border-top: none !important;
  box-shadow: none !important;
}
