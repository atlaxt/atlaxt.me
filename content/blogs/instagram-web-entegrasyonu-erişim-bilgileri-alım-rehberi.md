# Instagram Web Entegrasyonu: Erişim Bilgileri Alım Rehberi

Bu rehber, Instagram paylaşımlarınızın web sitenizde otomatik ve güncel olarak görünmesi için gerekli olan teknik verileri (**Access Token** ve **User ID**) almanız amacıyla hazırlanmıştır.

> **Önemli Not:** Bu adımları bir kez tamamladığınızda, sisteminiz kalıcı bir anahtar ile çalışacak ve her 60 günde bir yenileme zahmetine girmeyeceksiniz.

---

## 1. Adım: Instagram Hesabınızı Hazırlayın

Bağlantı kurulabilmesi için hesabınızın "Profesyonel" statüsünde olması ve bir Facebook Sayfasına bağlı olması şarttır.

1. **Profesyonel Hesaba Geçiş:** Instagram uygulamasında *Ayarlar -> Hesap Türü* yolunu izleyerek hesabınızı **İşletme (Business)** veya **İçerik Üreticisi (Creator)** yapın.
2. **Facebook Sayfası Bağlantısı:** *Profili Düzenle -> Sayfa* kısmından hesabınızı bir Facebook Sayfasına bağlayın. Eğer bir sayfanız yoksa, "Yeni Bir Sayfa Oluştur"u seçerek hızlıca oluşturabilirsiniz.

---

## 2. Adım: Meta Uygulamasını Oluşturma

1. [Meta for Developers](https://developers.facebook.com/) adresine gidin ve Facebook hesabınızla giriş yapın.
2. **Uygulamalarım (My Apps)** sekmesinden **Uygulama Oluştur (Create App)** butonuna basın.
3. Uygulama türü olarak **"Diğer"** -> **"İşletme" (Business)** seçeneğini işaretleyerek ilerleyin.
4. Uygulamanıza bir isim verin (Örn: *Site_Entegrasyonu*) ve süreci tamamlayın.

---

## 3. Adım: Kalıcı Erişim Anahtarı (Token) Oluşturma

Sitenin bağlantısının kopmaması için bu adım en kritik aşamadır.

1. [İşletme Ayarları](https://business.facebook.com/settings) sayfasına gidin.
2. Sol menüde **Kullanıcılar -> Sistem Kullanıcıları** sekmesine tıklayın.
3. **Ekle** butonuna basarak bir kullanıcı oluşturun (İsim: `site_bot`, Rol: `Çalışan/Employee` veya `Yönetici/Admin`).
4. Oluşturduğunuz kullanıcıyı seçin ve **Varlıklar Atayın** butonuna basın:
    * **Uygulamalar:** Az önce oluşturduğunuz uygulamayı seçin ve "Tam Kontrol" yetkisi verin.
    * **Sayfalar:** Instagram hesabınızın bağlı olduğu sayfayı seçin ve tüm yetkileri açın.
5. Şimdi **Yeni Token Oluştur** butonuna basın:
    * Uygulamanızı seçin.
    * İzinler listesinden `instagram_basic`, `pages_show_list` ve `pages_read_engagement` seçeneklerini işaretleyin.
6. Ekrana gelen uzun kodu kopyalayın ve güvenli bir yere kaydedin. Bu kod sizin **"Kalıcı Erişim Anahtarınızdır"**.

---

## 4. Adım: Instagram Business ID Bulma

1. [Graph API Explorer](https://developers.facebook.com/tools/explorer/) aracına gidin.
2. Sağ taraftaki "Access Token" kısmına az önce aldığınız kodu yapıştırın.
3. Üstteki adres çubuğuna şu sorguyu yapıştırıp **Submit** deyin:
    `me/accounts?fields=instagram_business_account{id,username,name}`
4. Sonuçlarda `instagram_business_account` başlığı altındaki **id** numarasını kopyalayın.

---

## Teknik Ekibe İletilecek Bilgiler

Kurulum tamamlandı! Lütfen aşağıdaki iki veriyi yazılımcınıza iletin:

1. **Access Token:** (3. Adımda aldığınız uzun kod)
2. **Instagram Business ID:** (4. Adımda aldığınız 17 haneli numara)

---
*Bu bilgiler sitenizin Instagram ile güvenli konuşmasını sağlar. Lütfen bu kodları yetkisiz kişilerle paylaşmayın.*
