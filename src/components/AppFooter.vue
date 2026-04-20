<script setup lang="ts">
import SocialIcon from '@/components/SocialIcon.vue'
import { useColorMode } from '@/composables/useColorMode'
import { getSocial } from '@/data/socials'
import signBlack from '/sign_black.png'
import signWhite from '/sign_white.png'

const gh = getSocial('github')
const li = getSocial('linkedin')
const rss = getSocial('rss')

const { isDark } = useColorMode()
const year = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <div class="footer-inner">
      <!-- Ana alan -->
      <div class="footer-main">
        <!-- Sol: kimlik -->
        <div class="footer-identity">
          <RouterLink to="/" class="footer-logo-link">
            <img :src="isDark ? signWhite : signBlack" alt="Atlas" class="footer-logo">
          </RouterLink>
          <p class="footer-name">
            Atlas Yiğit Aydın
          </p>
          <p class="footer-tagline">
            Web geliştirici — Vue ekosistemine odaklanan,<br>UX'e önem veren.
          </p>
        </div>

        <!-- Sağ: navigasyon kolonları -->
        <div class="footer-nav-wrap">
          <nav class="footer-nav-col">
            <span class="footer-nav-label">Sayfalar</span>
            <RouterLink to="/" class="footer-nav-link">
              Ana Sayfa
            </RouterLink>
            <RouterLink to="/projects" class="footer-nav-link">
              Projeler
            </RouterLink>
            <RouterLink to="/blog" class="footer-nav-link">
              Blog
            </RouterLink>
            <RouterLink to="/notes" class="footer-nav-link">
              Notlar
            </RouterLink>
            <RouterLink to="/feed" class="footer-nav-link footer-nav-link--red">
              Haberler
            </RouterLink>
          </nav>
          <nav class="footer-nav-col">
            <span class="footer-nav-label">Keşfet</span>
            <RouterLink to="/photos" class="footer-nav-link">
              Fotoğraflar
            </RouterLink>
            <RouterLink to="/books" class="footer-nav-link">
              Kitaplar
            </RouterLink>
            <RouterLink to="/instagram" class="footer-nav-link">
              Instagram
            </RouterLink>
            <RouterLink to="/contact" class="footer-nav-link">
              İletişim
            </RouterLink>
            <RouterLink to="/cli" class="footer-nav-link">
              CLI
            </RouterLink>
          </nav>
        </div>
      </div>

      <!-- Alt bar -->
      <div class="footer-bar">
        <span class="footer-copy">© {{ year }}</span>

        <div class="footer-socials">
          <a :href="gh.href" target="_blank" rel="noopener noreferrer" class="footer-social" aria-label="GitHub">
            <SocialIcon name="github" />
          </a>
          <a :href="li.href" target="_blank" rel="noopener noreferrer" class="footer-social" aria-label="LinkedIn">
            <SocialIcon name="linkedin" />
          </a>
          <RouterLink to="/instagram" class="footer-social" aria-label="Instagram">
            <SocialIcon name="instagram" />
          </RouterLink>
          <a :href="rss.href" target="_blank" rel="noopener noreferrer" class="footer-social" aria-label="RSS">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
  margin-top: 6rem;
}

.footer-inner {
  max-width: 56rem;
  margin: 0 auto;
  padding: 3.5rem 2rem calc(2rem + 44px);
}

/* ── Ana alan ─────────────────────────────────────── */
.footer-main {
  display: flex;
  justify-content: space-between;
  gap: 3rem;
  padding-bottom: 3rem;
  border-bottom: 1px solid var(--border);
}

/* Kimlik */
.footer-identity {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-width: 0;
}

.footer-logo-link {
  display: block;
  width: fit-content;
  opacity: 0.75;
  transition: opacity 0.15s ease;
}

.footer-logo-link:hover {
  opacity: 1;
}

.footer-logo {
  height: 1.25rem;
  width: auto;
}

.footer-name {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text);
  letter-spacing: 0.02em;
  margin-top: 0.25rem;
}

.footer-tagline {
  font-size: 0.72rem;
  font-weight: 400;
  color: var(--text-muted);
  line-height: 1.6;
  opacity: 0.7;
}

/* Nav kolonları */
.footer-nav-wrap {
  display: flex;
  gap: 3.5rem;
  flex-shrink: 0;
}

.footer-nav-col {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.footer-nav-label {
  font-size: 0.6rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--text-muted);
  opacity: 0.45;
  margin-bottom: 0.2rem;
}

.footer-nav-link {
  font-size: 0.78rem;
  font-weight: 400;
  color: var(--text-muted);
  text-decoration: none;
  opacity: 0.6;
  transition: opacity 0.12s ease;
  width: fit-content;
}

.footer-nav-link:hover {
  opacity: 1;
}

.footer-nav-link--red {
  color: #c8232c;
}

/* ── Alt bar ──────────────────────────────────────── */
.footer-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 1.5rem;
}

.footer-copy {
  font-size: 0.68rem;
  color: var(--text-muted);
  opacity: 0.35;
  letter-spacing: 0.04em;
}

.footer-socials {
  display: flex;
  align-items: center;
  gap: 0.1rem;
}

.footer-social {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  color: var(--text-muted);
  opacity: 0.3;
  text-decoration: none;
  transition: opacity 0.12s ease;
}

.footer-social:hover {
  opacity: 0.85;
}

.footer-social :deep(svg) {
  width: 13px;
  height: 13px;
}

/* ── Mobil ────────────────────────────────────────── */
@media (max-width: 640px) {
  .footer-main {
    flex-direction: column;
    gap: 2.5rem;
  }

  .footer-nav-wrap {
    gap: 2.5rem;
  }
}
</style>
