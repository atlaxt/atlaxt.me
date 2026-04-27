---
title: "LinkedIn'deki Takipçileri Toplu Takipten Çıkartma"
description: 'LinkedIn takip listesini tarayıcı konsolundan çalıştırılan bir JavaScript snippet ile toplu olarak temizlemek için hazırlanmış kısa bir rehber.'
date: '2026-04-27'
---

LinkedIn, takip ettiğiniz kişileri tek tek takipten çıkarmak dışında toplu bir seçenek sunmuyor. Aşağıdaki snippet bu süreci otomatikleştiriyor.

---

## Snippet Nasıl Çalıştırılır?

1. LinkedIn'de **"Takip Edilenler"** sayfasını açın: `linkedin.com/feed/following`
2. Tarayıcıda geliştirici konsolunu açın:
   - **Chrome / Edge:** `F12` → **Console** sekmesi
   - **Safari:** Önce `Ayarlar > Gelişmiş > Geliştirici menüsünü göster` aktif edin, ardından `⌥⌘C`
3. Aşağıdaki Gist'teki kodu konsola yapıştırıp `Enter`'a basın.

Gist: [github.com/atlaxt/285020294103f28419de920009c65ffa](https://gist.github.com/atlaxt/285020294103f28419de920009c65ffa)

---

## Ne Yapar?

Sayfadaki tüm **"Takip Ediliyor"** butonlarını bulur, her birine tıklar ve açılan onay diyaloğundaki **"Takip Etmeyi Durdur"** butonunu otomatik olarak onaylar. Görünür kişiler bittikçe sayfayı aşağı kaydırarak yeni kişileri yükler, takipten çıkartacak kimse kalmayınca durur.

---

*LinkedIn arayüzü değişirse buton metinleri farklılaşabilir; bu durumda snippet güncellenmesi gerekebilir.*
