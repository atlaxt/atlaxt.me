<script setup lang="ts">
import SocialIcon from '@/components/SocialIcon.vue'
import { useColorMode } from '@/composables/useColorMode'
import signBlack from '/sign_black.png'
import signWhite from '/sign_white.png'

const { isDark } = useColorMode()
const year = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <div class="footer-inner max-w-4xl mx-auto px-4 md:px-8">

      <div class="footer-row">
        <!-- Sol: logo + yıl -->
        <RouterLink to="/" class="footer-brand" aria-label="Ana sayfa">
          <img :src="isDark ? signWhite : signBlack" alt="Atlas" class="footer-logo">
          <span class="footer-year">{{ year }}</span>
        </RouterLink>

        <!-- Sağ: sosyal ikonlar -->
        <div class="footer-right">
          <a href="https://github.com/atlaxt" target="_blank" rel="noopener noreferrer" aria-label="GitHub" class="footer-icon">
            <SocialIcon name="github" />
          </a>
          <a href="https://linkedin.com/in/atlaxt" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" class="footer-icon">
            <SocialIcon name="linkedin" />
          </a>
          <a href="https://instagram.com/atlaxt.me" target="_blank" rel="noopener noreferrer" aria-label="Instagram" class="footer-icon">
            <SocialIcon name="instagram" />
          </a>
          <a href="/rss.xml" target="_blank" rel="noopener noreferrer" aria-label="RSS" class="footer-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 11a9 9 0 0 1 9 9" />
              <path d="M4 4a16 16 0 0 1 16 16" />
              <circle cx="5" cy="19" r="1" fill="currentColor" stroke="none" />
            </svg>
          </a>
        </div>
      </div>

    </div>
  </footer>
</template>

<style scoped>
.footer {
  border-top: 1px solid var(--border);
}

.footer-inner {
  padding-top: 1.25rem;
  padding-bottom: 1.25rem;
}

.footer-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Brand */
.footer-brand {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  opacity: 0.4;
  transition: opacity 0.15s ease;
}

.footer-brand:hover {
  opacity: 0.75;
}

.footer-logo {
  height: 1.1rem;
  width: auto;
  display: block;
}

.footer-year {
  font-size: 0.62rem;
  color: var(--text-muted);
  letter-spacing: 0.08em;
  font-variant-numeric: tabular-nums;
}

/* Social icons */
.footer-right {
  display: flex;
  align-items: center;
  gap: 0.1rem;
}

.footer-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  color: var(--text-muted);
  opacity: 0.35;
  transition: opacity 0.15s ease;
  text-decoration: none;
}

.footer-icon:hover {
  opacity: 0.8;
}

.footer-icon :deep(svg) {
  width: 14px;
  height: 14px;
}
</style>
