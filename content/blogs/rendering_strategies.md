---
title: 'Modern Web Render Stratejileri: CSR, SSR, SSG ve ISR'
description: 'CSR/SSR/SSG/ISR kafamda nasıl ayrılıyor? Hız, SEO ve maliyet tarafında pratik bir özet.'
date: '2026-02-01'
image: '/writings/rendering_strategies_cover.jpg'
---

Bir projeye başlarken ben genelde iki şeye takılıyorum: sayfa **ne kadar hızlı açılıyor** ve arama motorları **bu sayfayı ne kadar rahat anlayabiliyor**. Render stratejisi seçimi bu ikisini baya etkiliyor.

---

## 1. Client-Side Rendering (CSR)

CSR'de işi büyük ölçüde tarayıcıya bırakıyoruz. SPA dünyasında (React/Vue/Angular) en çok gördüğümüz yaklaşım bu.

**Nasıl Çalışır?**
Sunucu, tarayıcıya sadece temel bir HTML iskeleti ve gerekli JavaScript dosyalarını gönderir. Tarayıcı bu dosyaları indirip çalıştırdıktan sonra içeriği oluşturur ve sayfayı görünür hale getirir.

### Artıları ve Eksileri

* **+ Akıcı deneyim:** İlk yüklemeden sonra sayfa geçişleri çok hızlıdır, “mobil uygulama” hissi verir.
* **+ Ucuz/kolay dağıtım:** UI tarafını CDN'e koymak kolaydır; ama gerçek hayatta veri/iş mantığı için çoğu zaman ayrı bir API (dinamik backend) yine olur.
* **- SEO tarafı daha riskli:** Google çoğu zaman JS'i render edebiliyor ama indeksleme gecikebilir; bazı botlar JS içeriğini eksik görebilir. Kritik içerikte SSR/SSG genelde daha rahat ettiriyor.
* **- İlk açılış yavaşlayabilir (FCP):** JS dosyaları inmeden/çalışmadan kullanıcı boş bir ekran görebilir.

**Kullanım Alanı:** SEO önceliği olmayan yönetim panelleri (Dashboard), kullanıcı girişi gerektiren SaaS uygulamaları.

---

## 2. Server-Side Rendering (SSR)

SSR, “sayfayı sunucuda pişirip” tarayıcıya hazır HTML göndermek gibi düşünebilirsin. Nuxt/Next gibi framework'lerin en güçlü taraflarından biri.

**Nasıl Çalışır?**
Kullanıcı bir sayfaya istek gönderdiğinde, sunucu o an gerekli veriyi çeker, HTML'i sunucu tarafında hazırlar ve tarayıcıya içeriği dolu bir sayfa gönderir. Tarayıcı daha sonra JavaScript'i yükleyerek sayfayı etkileşime hazır hale getirir.

### Artıları ve Eksileri

* **+ SEO genelde daha güçlü:** Bot içerikleri “hazır HTML” olarak görür, indeksleme daha stabil olur.
* **+ İlk görünüm hızlı gelir:** Kullanıcı çoğu zaman içeriği daha erken görür.
* **- Sunucu masrafı/karmaşıklığı:** Her istekte sunucu çalışır. Trafik artınca maliyet de artabilir.
* **- TTFB uzayabilir:** Sunucu yoğunsa veya veri çekme yavaşsa ilk byte gecikebilir.

**Kullanım Alanı:** Haber siteleri, e-ticaret ürün detay sayfaları, içeriğin sürekli değiştiği dinamik platformlar.

---

## 3. Static Site Generation (SSG)

SSG'nin olayı basit: “sayfaları build sırasında üret, ziyaretçiye dosya gibi servis et”. Performans/kolay cache için harika.

**Nasıl Çalışır?**
Uygulama henüz geliştirme aşamasındayken (build time), tüm sayfaların HTML versiyonları oluşturulur. Canlı ortamda sunucuya bir istek geldiğinde, önceden hazırlanmış bu dosyalar anında servis edilir.

### Artıları ve Eksileri (SSG)

* **+ Çok hızlı:** İstek anında hesap yok; çoğu zaman direkt dosya/CDN servis ediyorsun.
* **+ Daha küçük saldırı yüzeyi:** Üretimde her istekte server-side kod dönmediği için risk azalır. (Ama build sırasında kullanılan secret'lar yine dikkat ister.)
* **- Build süresi uzayabilir:** Sayfa sayısı büyüdükçe build süresi uzar.
* **- İçerik güncellemesi “build” demek:** Küçük değişiklik bile yeniden üretim gerektirebilir.

**Kullanım Alanı:** Bloglar, dökümantasyon siteleri, kurumsal tanıtım sayfaları.

---

## 4. Incremental Static Regeneration (ISR)

ISR'yi ben SSG'nin “tamam hızlısın da güncel kal” çözümü gibi görüyorum. Statik hız + kontrollü güncelleme.

**Nasıl Çalışır?**
Sayfalar SSG gibi statik oluşturulur; ayrıca bir **yenileme penceresi** tanımlanır. Bu süre dolduktan sonra gelen **ilk istek**, sayfanın yeniden üretilmesini tetikler. Çoğu implementasyonda kullanıcıya eski (stale) içerik servis edilirken, arka planda yeni versiyon hazırlanır ve bir sonraki istek güncel içeriği alır.

### Artıları ve Eksileri

* **+ Statik hız + güncellik:** SSG kadar hızlı kalıp içerikleri periyodik tazeleyebilirsin.
* **+ Build yükü azalır:** Her şeyi baştan üretmek yerine sadece gereken sayfalar yenilenir.
* **- “Anlık” değil:** Kısa bir süre eski içerik görme ihtimali var (stale).

**Kullanım Alanı:** Büyük e-ticaret siteleri, listeleme sayfaları, sık güncellenen bloglar.

---

## Özet Karşılaştırma Tablosu

| Özellik | CSR | SSR | SSG | ISR |
| :--- | :--- | :--- | :--- | :--- |
| **SEO Uyumluluğu** | Düşük | Yüksek | Yüksek | Yüksek |
| **İlk Yükleme Hızı** | Yavaş | Hızlı | Çok Hızlı | Çok Hızlı |
| **Sunucu Yükü** | Düşük | Yüksek | Yok (istek anında) | Düşük-Orta (yenileme anlarında) |
| **Veri Güncelliği** | Anlık | Anlık | Build zamanı | Periyodik |
