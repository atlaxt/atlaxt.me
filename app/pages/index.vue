<script setup lang="ts">
const { data: value } = await useAsyncData(
  'me',
  () => queryCollection('me').first(),
)
</script>

<template>
  <UiAtlas />

  <section id="about" class="min-h-screen w-full flex flex-col items-center mx-auto px-4 py-24 relative overflow-visible">
    <div class="absolute top-[50%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-600/20 blur-[180px] rounded-full pointer-events-none z-0 animate-pulse-slow" />

    <div class="w-full flex justify-center z-10 mb-16">
      <BitsTextPressure
        text="WHO AM I?"
        :flex="true"
        :alpha="false"
        :stroke="false"
        :width="true"
        :weight="true"
        :italic="true"
        text-color="#ffffff"
        stroke-color="#FF5722"
        :min-font-size="36"
        class-name="select-none"
        class="md:max-h-64 max-h-36 w-full max-w-6xl"
      />
    </div>

    <div class="w-full max-w-6xl z-10 relative">
      <div class="glass-panel p-8 md:p-12 rounded-sm relative group transition-all duration-500 hover:-translate-y-1">
        <div class="absolute left-0 top-0 bottom-0 w-1 bg-[#FF5722] shadow-[0_0_15px_rgba(255,87,34,0.4)] group-hover:shadow-[0_0_25px_rgba(255,87,34,0.8)] transition-all duration-500" />

        <ContentRenderer
          v-if="value"
          :value="value"
          class="modern-flow"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
/* ARKA PLAN ANİMASYONU */
@keyframes pulse-slow {
  0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 0.2; transform: translate(-50%, -50%) scale(1.1); }
}
.animate-pulse-slow {
  animation: pulse-slow 8s infinite ease-in-out;
}

/* FADE IN LABEL */
@keyframes fadeIn {
  to { opacity: 0.8; }
}
.animate-fadeIn {
  animation: fadeIn 1s forwards;
}

/* GLASS PANEL STİLİ */
.glass-panel {
  backdrop-filter: blur(10px);
}

/* MODERN FLOW CONTENT STYLES */
.modern-flow {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Başlıklar */
.modern-flow :deep(h1) {
  font-size: 2.5rem;
  font-weight: 800;
  color: white;
  margin-bottom: 1rem;
  line-height: 1.1;
  text-shadow: 0 0 20px rgba(0,0,0,0.5);
}

/* Paragraflar */
.modern-flow :deep(p) {
  font-size: 1.15rem; /* 18px-19px */
  line-height: 1.8;
  color: #d4d4d4; /* Hafif kırık beyaz */
  font-weight: 300;
  text-align: left;

  /* Animasyon */
  opacity: 0;
  transform: translateY(10px);
  animation: slideUpFade 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}

/* Animasyon Gecikmeleri (Stagger) */
.modern-flow :deep(p):nth-of-type(1) { animation-delay: 0.1s; }
.modern-flow :deep(p):nth-of-type(2) { animation-delay: 0.2s; }
.modern-flow :deep(p):nth-of-type(3) { animation-delay: 0.3s; }
.modern-flow :deep(p):nth-of-type(4) { animation-delay: 0.4s; }

/* Linkler - Magma Hover */
.modern-flow :deep(a) {
  color: white;
  text-decoration: none;
  font-weight: 500;
  border-bottom: 1px solid rgba(255, 87, 34, 0.5);
  transition: all 0.3s ease;
  padding-bottom: 1px;
}

.modern-flow :deep(a:hover) {
  color: #FF5722;
  border-bottom-color: #FF5722;
  box-shadow: 0 2px 10px rgba(255, 87, 34, 0.15);
  padding: 0 4px; /* Hover olunca hafif genişleme */
  margin: 0 -4px;
  border-radius: 4px;
}

/* Strong (Kalın) Yazılar */
.modern-flow :deep(strong) {
  color: white;
  font-weight: 700;
  border-bottom: 2px solid rgba(255, 255, 255, 0.1); /* Altına hafif çizgi */
}

/* Liste Maddeleri */
.modern-flow :deep(ul), .modern-flow :deep(ol) {
  padding-left: 1.5rem;
  margin-bottom: 1.5rem;
}
.modern-flow :deep(li) {
  color: #a3a3a3;
  margin-bottom: 0.5rem;
  marker: #FF5722;
}

@keyframes slideUpFade {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
