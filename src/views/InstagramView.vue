<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import InstagramCard from '@/components/InstagramCard.vue'
import PageHeader from '@/components/PageHeader.vue'
import { getSocial } from '@/data/socials'
import { useSeo } from '@/seo/useSeo'

const instagramHref = getSocial('instagram').href

useSeo({
  title: 'Instagram',
  description: 'Instagram fotoğraflarım ve paylaşımlarım.',
  canonicalPath: '/instagram',
  type: 'website',
})

interface InstagramProfile {
  username: string
  biography?: string
  profile_picture_url?: string
  followers_count: number
  follows_count: number
  media_count: number
}

interface InstagramPhoto {
  id: string
  caption?: string
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM'
  media_url: string
  permalink: string
}

const router = useRouter()

const profile = ref<InstagramProfile | null>(null)
const photos = ref<InstagramPhoto[]>([])
const loading = ref(true)

const token = import.meta.env.VITE_META_INSTAGRAM_ACCESS_TOKEN
const userId = import.meta.env.VITE_META_INSTAGRAM_USER_ID

function formatCount(n: number) {
  if (n >= 1_000_000)
    return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000)
    return `${(n / 1_000).toFixed(1)}K`
  return String(n)
}

async function fetchAll() {
  try {
    const base = `https://graph.facebook.com/v22.0`
    const [profileRes, mediaRes] = await Promise.all([
      fetch(`${base}/${userId}?fields=username,biography,profile_picture_url,followers_count,follows_count,media_count&access_token=${token}`),
      fetch(`${base}/${userId}/media?fields=id,caption,media_type,media_url,permalink&limit=24&access_token=${token}`),
    ])
    const [profileData, mediaData] = await Promise.all([profileRes.json(), mediaRes.json()])
    if (!profileData || profileData.error || !mediaData?.data) {
      if (import.meta.env.PROD) {
        window.open(instagramHref, '_blank')
        router.back()
      }
      return
    }
    profile.value = profileData
    photos.value = mediaData.data
  }
  catch (err) {
    console.error('Hata:', err)
    if (import.meta.env.PROD) {
      window.open(instagramHref, '_blank')
      router.back()
    }
  }
  finally {
    loading.value = false
  }
}

onMounted(fetchAll)
</script>

<template>
  <div class="px-2 md:px-0 py-16">
    <PageHeader :crumbs="[{ label: 'Instagram', to: '/instagram' }]" />

    <div v-if="loading">
      <!-- Profil skeleton -->
      <div class="flex items-center gap-6 mb-10">
        <div class="rounded-full shrink-0 skeleton" style="width: 72px; height: 72px;" />
        <div class="flex flex-col gap-3 flex-1">
          <div class="skeleton" style="height: 12px; width: 120px;" />
          <div class="flex gap-5">
            <div class="skeleton" style="height: 28px; width: 44px;" />
            <div class="skeleton" style="height: 28px; width: 44px;" />
            <div class="skeleton" style="height: 28px; width: 44px;" />
          </div>
          <div class="skeleton" style="height: 10px; width: 200px;" />
        </div>
      </div>
      <!-- Grid skeleton -->
      <div class="grid gap-px" style="grid-template-columns: repeat(3, 1fr);">
        <div v-for="n in 9" :key="n" class="skeleton aspect-square" />
      </div>
    </div>

    <template v-else>
      <!-- Profil header -->
      <div v-if="profile" class="flex items-center gap-6 mb-10 w-full">
        <a
          :href="`https://instagram.com/${profile.username}`"
          target="_blank"
          rel="noopener noreferrer"
          class="shrink-0"
        >
          <img
            v-if="profile.profile_picture_url"
            :src="profile.profile_picture_url"
            :alt="profile.username"
            class="rounded-full object-cover transition-opacity hover:opacity-80"
            style="width: 72px; height: 72px; border: 1px solid var(--border);"
          >
          <div
            v-else
            class="rounded-full flex items-center justify-center"
            style="width: 72px; height: 72px; background: var(--bg-subtle); border: 1px solid var(--border);"
          >
            <span class="t-caption">@</span>
          </div>
        </a>

        <div class="flex flex-col gap-2 min-w-0 w-full">
          <div class="flex items-center justify-between gap-3 w-full">
            <a
              :href="`https://instagram.com/${profile.username}`"
              target="_blank"
              rel="noopener noreferrer"
              class="t-section transition-opacity hover:opacity-60 w-fit"
            >
              @{{ profile.username }}
            </a>
            <a
              :href="`https://instagram.com/${profile.username}`"
              target="_blank"
              rel="noopener noreferrer"
              class="follow-btn"
            >
              Takip Et
            </a>
          </div>

          <div class="flex gap-5">
            <div class="flex flex-col items-start">
              <span class="t-section">{{ formatCount(profile.media_count) }}</span>
              <span class="t-caption">gönderi</span>
            </div>
            <div class="flex flex-col items-start">
              <span class="t-section">{{ formatCount(profile.followers_count) }}</span>
              <span class="t-caption">takipçi</span>
            </div>
            <div class="flex flex-col items-start">
              <span class="t-section">{{ formatCount(profile.follows_count) }}</span>
              <span class="t-caption">takip</span>
            </div>
          </div>

          <p v-if="profile.biography" class="t-small" style="white-space: pre-line;">
            {{ profile.biography }}
          </p>
        </div>
      </div>

      <!-- Gönderiler grid -->
      <div
        class="grid gap-px"
        style="grid-template-columns: repeat(3, 1fr);"
      >
        <InstagramCard
          v-for="photo in photos"
          :key="photo.id"
          v-bind="photo"
        />
      </div>
    </template>
  </div>
</template>

<style scoped>
.follow-btn {
  display: inline-flex;
  align-items: center;
  padding: 0.3rem 0.85rem;
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  text-decoration: none;
  background: var(--text);
  color: var(--bg);
  border: 1px solid var(--text);
  transition: opacity 0.15s ease;
  white-space: nowrap;
}

.follow-btn:hover {
  opacity: 0.75;
}

.skeleton {
  background: var(--bg-subtle);
  position: relative;
  overflow: hidden;
}

.skeleton::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent 0%, var(--border) 50%, transparent 100%);
  background-size: 200% 100%;
  animation: shimmer 1.6s ease-in-out infinite;
}

@keyframes shimmer {
  0% { background-position: 200% center; }
  100% { background-position: -200% center; }
}
</style>
