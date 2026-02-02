---
title: 'Modern Web Render Stratejileri: CSR, SSR, SSG ve ISR'
description: 'Web geliştirme süreçlerinde kullanılan render stratejilerinin karşılaştırılması.'
date: '2026-02-01'
image: '/writings/rendering_strategies_cover.jpg'
---

# Modern Web Render Stratejileri: CSR, SSR, SSG ve ISR Rehberi

Web performansı ve SEO, modern bir uygulamanın başarısını belirleyen en önemli faktörlerdir. Kullanıcıların sitenize girdiğinde içeriğe ne kadar hızlı ulaştığı ve arama motorlarının sitenizi ne kadar iyi anladığı, projenin başında seçtiğiniz **Render Stratejisine** bağlıdır.

Bu yazıda; sıkça duyduğumuz CSR, SSR, SSG ve ISR kavramlarını inceleyeceğiz. Hangi strateji nerede avantajlı, hangisi maliyetli?

---

## 1. Client-Side Rendering (CSR)

React, Vue veya Angular gibi modern kütüphanelerin varsayılan çalışma mantığıdır. İşin büyük kısmını kullanıcının tarayıcısına bıraktığımız modeldir.

**Nasıl Çalışır?**
Sunucu, tarayıcıya sadece temel bir HTML iskeleti ve gerekli JavaScript dosyalarını gönderir. Tarayıcı bu dosyaları indirip çalıştırdıktan sonra içeriği oluşturur ve sayfayı görünür hale getirir.

### Artıları ve Eksileri
* **+ Akıcı Deneyim:** Sayfa ilk kez yüklendikten sonraki geçişler çok hızlıdır, mobil uygulama hissi verir.
* **+ Düşük Sunucu Maliyeti:** Dinamik bir sunucu işlemine gerek yoktur, statik dosya sunucuları (CDN) yeterlidir.
* **- SEO Zorlukları:** Arama motoru botları bazen içeriği tam olarak tarayamayabilir veya indeksleme süresi uzayabilir.
* **- Yavaş İlk Açılış (FCP):** JavaScript dosyaları indirilip çalışana kadar kullanıcı boş bir ekranla karşılaşabilir.

**Kullanım Alanı:** SEO önceliği olmayan yönetim panelleri (Dashboard), kullanıcı girişi gerektiren SaaS uygulamaları.

---

## 2. Server-Side Rendering (SSR)

Nuxt.js veya Next.js gibi framework'lerin popülerleşmesini sağlayan yaklaşımdır. Klasik web mantığının modern teknolojilerle harmanlanmış halidir.

**Nasıl Çalışır?**
Kullanıcı bir sayfaya istek gönderdiğinde, sunucu o an gerekli veriyi çeker, HTML'i sunucu tarafında hazırlar ve tarayıcıya içeriği dolu bir sayfa gönderir. Tarayıcı daha sonra JavaScript'i yükleyerek sayfayı etkileşime hazır hale getirir.

### Artıları ve Eksileri
* **+ Güçlü SEO:** Arama motorları içeriği hazır olarak gördüğü için indeksleme performansı yüksektir.
* **+ Hızlı İlk Görünüm:** Kullanıcı siteye girer girmez içeriği görür, yüklenme sürelerini beklemez.
* **- Sunucu Yükü:** Her istekte sunucu işlemci gücü harcar. Yüksek trafikli anlarda sunucu maliyetleri artabilir.
* **- Yanıt Süresi:** Sunucu yoğunsa veya veritabanı sorguları yavaşsa, sayfanın yanıt verme süresi (TTFB) uzayabilir.

**Kullanım Alanı:** Haber siteleri, e-ticaret ürün detay sayfaları, içeriğin sürekli değiştiği dinamik platformlar.

---

## 3. Static Site Generation (SSG)

Performans odaklı projelerin vazgeçilmezidir. "Sayfaları önceden hazırlayalım, istek gelince beklemeden sunalım" mantığıyla çalışır.

**Nasıl Çalışır?**
Uygulama henüz geliştirme aşamasındayken (build time), tüm sayfaların HTML versiyonları oluşturulur. Canlı ortamda sunucuya bir istek geldiğinde, önceden hazırlanmış bu dosyalar anında servis edilir.

### Artıları ve Eksileri
* **+ En Yüksek Performans:** Sunucu tarafında hesaplama yapılmaz, sadece dosya transferi gerçekleşir.
* **+ Güvenlik:** Veritabanı bağlantısı derleme aşamasında kaldığı için güvenlik riskleri minimumdur.
* **- Build Süresi:** Sayfa sayısı arttıkça projenin derlenme süresi uzayabilir.
* **- Güncellik Sorunu:** İçerikte en ufak bir değişiklik yapıldığında tüm sitenin tekrar derlenmesi gerekir.

**Kullanım Alanı:** Bloglar, dökümantasyon siteleri, kurumsal tanıtım sayfaları.

---

## 4. Incremental Static Regeneration (ISR)

SSG'nin "güncellik" sorununa çözüm getiren hibrit bir yaklaşımdır. Statik sitelerin hızını, dinamik sitelerin esnekliğiyle birleştirir.

**Nasıl Çalışır?**
Sayfalar SSG gibi statik oluşturulur ancak belirlenen bir süre sonunda (örneğin 60 saniye) arka planda güncellenebilir. Kullanıcı siteyi gezerken sunucu, arka planda sayfayı yeniler ve bir sonraki ziyaretçiye güncel içeriği sunar.

### Artıları ve Eksileri
* **+ Hibrit Yapı:** SSG kadar hızlı açılırken, içeriği SSR gibi belirli aralıklarla güncel tutabilir.
* **+ Hızlı Derleme:** Tüm siteyi baştan derlemeye gerek kalmaz, sadece ihtiyaç duyulan sayfalar yenilenir.
* **- Anlık Tutarlılık:** Veri gerçek zamanlı değildir; kullanıcı kısa bir süreliğine eski veriyi görebilir.

**Kullanım Alanı:** Büyük e-ticaret siteleri, listeleme sayfaları, sık güncellenen bloglar.

---

## Özet Karşılaştırma Tablosu

Hızlı bir kıyaslama için tabloya göz atalım:

| Özellik | CSR | SSR | SSG | ISR |
| :--- | :--- | :--- | :--- | :--- |
| **SEO Uyumluluğu** | Düşük | Yüksek | Yüksek | Yüksek |
| **İlk Yükleme Hızı** | Yavaş | Hızlı | Çok Hızlı | Çok Hızlı |
| **Sunucu Yükü** | Düşük | Yüksek | Yok (Build anında) | Düşük |
| **Veri Güncelliği** | Anlık | Anlık | Build zamanı | Periyodik |
