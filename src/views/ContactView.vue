<script setup lang="ts">
import { ref } from 'vue'
import PageHeader from '@/components/PageHeader.vue'
import { useSeo } from '@/seo/useSeo'

useSeo({
  title: 'İletişim',
  description: 'Benimle iletişime geç.',
  canonicalPath: '/contact',
  type: 'website',
})

const email = ref('')
const subject = ref('')
const message = ref('')
const status = ref<'idle' | 'loading' | 'success' | 'error'>('idle')

async function send() {
  if (!subject.value.trim() || !message.value.trim() || status.value === 'loading')
    return

  status.value = 'loading'

  try {
    const res = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        replyTo: email.value.trim(),
        subject: subject.value.trim(),
        html: `
          <p style="font-family:monospace;font-size:13px;color:#71717a;margin:0 0 16px;">${email.value.trim()}</p>
          <p style="font-family:sans-serif;font-size:15px;line-height:1.7;color:#09090b;white-space:pre-wrap;margin:0;">${message.value.trim()}</p>
        `,
      }),
    })

    if (!res.ok)
      throw new Error(res.statusText)

    status.value = 'success'
  }
  catch {
    status.value = 'error'
  }
}
</script>

<template>
  <div class="px-2 md:px-0 py-16">
    <PageHeader :crumbs="[{ label: 'İletişim', to: '/contact' }]" />

    <Transition name="fade" mode="out-in">
      <div v-if="status === 'success'" class="success-state">
        <p class="t-page-title">
          Mesajın ulaştı.
        </p>
        <p class="t-small">
          En kısa sürede döneceğim.
        </p>
        <button class="reset-btn" @click="status = 'idle'; email = ''; subject = ''; message = ''">
          Yeni mesaj
        </button>
      </div>

      <form v-else class="contact-form" @submit.prevent="send">
        <div class="field">
          <label class="t-micro" for="email">E-posta</label>
          <input
            id="email"
            v-model="email"
            type="email"
            class="field-input"
            placeholder="sen@example.com"
            autocomplete="email"
            :disabled="status === 'loading'"
          >
        </div>

        <div class="field">
          <label class="t-micro" for="subject">Konu</label>
          <input
            id="subject"
            v-model="subject"
            type="text"
            class="field-input"
            placeholder="Ne hakkında?"
            autocomplete="off"
            :disabled="status === 'loading'"
          >
        </div>

        <div class="field">
          <label class="t-micro" for="message">Mesaj</label>
          <textarea
            id="message"
            v-model="message"
            class="field-input field-textarea"
            placeholder="Merhaba..."
            rows="6"
            :disabled="status === 'loading'"
          />
        </div>

        <div class="form-footer">
          <span v-if="status === 'error'" class="error-text">
            Bir hata oluştu, tekrar dene.
          </span>
          <span v-else />

          <button
            type="submit"
            class="send-btn"
            :disabled="status === 'loading'"
          >
            {{ status === 'loading' ? '...' : 'Gönder' }}
          </button>
        </div>
      </form>
    </Transition>
  </div>
</template>

<style scoped>
.contact-form {
  display: flex;
  flex-direction: column;
  gap: 2.25rem;
  max-width: 440px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}


.field-input {
  background: transparent;
  border: none;
  border-bottom: 1px solid var(--border);
  outline: none;
  font-family: inherit;
  font-size: 0.875rem;
  color: var(--text);
  padding: 0.4rem 0;
  width: 100%;
  transition: border-color 0.15s ease;
  resize: none;
}

.field-input::placeholder {
  color: var(--text-muted);
  opacity: 0.5;
}

.field-input:focus {
  border-color: var(--text-muted);
}

.field-input:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.field-textarea {
  line-height: 1.75;
}

.form-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.error-text {
  font-size: 0.72rem;
  color: #f87171;
  opacity: 0.85;
}

.send-btn {
  background: var(--text);
  border: none;
  font-family: inherit;
  font-size: 0.75rem;
  color: var(--bg);
  padding: 0.5rem 1.25rem;
  cursor: pointer;
  transition: opacity 0.15s ease;
  letter-spacing: 0.06em;
}

.send-btn:hover:not(:disabled) {
  opacity: 0.7;
}

.send-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

/* ── Success ───────────────────────────────────────────── */
.success-state {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  max-width: 440px;
  padding-top: 0.5rem;
}

.reset-btn {
  margin-top: 1.5rem;
  background: none;
  border: none;
  font-family: inherit;
  font-size: 0.72rem;
  color: var(--text-muted);
  cursor: pointer;
  padding: 0;
  transition: opacity 0.15s ease;
  text-align: left;
}

.reset-btn:hover {
  opacity: 0.8;
}

/* ── Transition ────────────────────────────────────────── */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
