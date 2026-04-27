---
title: 'Instagram Web Entegrasyonu: Erişim Bilgileri Alım Rehberi'
description: 'Bu döküman, Instagram içeriklerinin web sitesi üzerinde dinamik olarak sergilenmesi için gereken Süresiz Erişim Anahtarı (Permanent Token) ve Instagram Business ID verilerinin hatasız bir şekilde temin edilmesi amacıyla hazırlanmıştır.'
date: '2026-04-20'
---

---

## 1. Aşama: Sosyal Medya Varlıklarının Hazırlanması

API erişimi için Instagram hesabının profesyonel bir işletme kimliğine sahip olması ve bir Facebook Sayfası ile ilişkilendirilmiş olması zorunludur.

* **Profesyonel Hesap:** Instagram ayarları üzerinden hesap türünü **İşletme (Business)** veya **İçerik Üreticisi (Creator)** statüsüne geçiriniz.
* **Facebook Sayfa Bağlantısı:** Instagram profilinizdeki "Profili Düzenle" > "Sayfa" adımlarını izleyerek hesabı bir Facebook Sayfasına bağlayınız. Mevcut bir sayfanız yoksa yeni bir tane oluşturunuz.

---

## 2. Aşama: Meta Developer Uygulama Kaydı

1. [Meta for Developers](https://developers.facebook.com/) platformuna giriş yapınız.
2. **Uygulamalarım (My Apps)** > **Uygulama Oluştur (Create App)** butonuna tıklayınız.
3. Uygulama türü olarak **"Diğer"** ve ardından **"İşletme" (Business)** seçeneğini belirleyiniz.
4. Uygulamanıza bir isim (Örn: `Web_Entegrasyonu`) vererek süreci tamamlayınız.

---

## 3. Aşama: Güvenlik Yapılandırması ve Yönlendirme Ayarları

> **⚠️ Önemli Teknik Not:** Meta'nın yetkilendirme pencereleri Chrome ve benzeri tarayıcılardaki reklam engelleyiciler veya gizlilik ayarları nedeniyle "Siyah Ekran" hatası verebilir veya pencereleri otomatik kapatabilir. Bu aşamadaki işlemleri **Safari** veya **Firefox** tarayıcısı kullanarak gerçekleştirmeniz önerilir.

1. Uygulama panelinde sol menüden *Instagram Graph API* > *Ayarlar* sekmesine gidiniz.
2. **"Geçerli OAuth yönlendirme URI'leri"** alanına web sitenizin tam adresini (`https://alanadiniz.com`) ekleyiniz ve kaydediniz.

---

## 4. Aşama: Sistem Kullanıcısı Tanımlama ve Uygulama Yetkilendirmesi

Standart kullanıcı jetonları 60 gün sonra geçerliliğini yitirir. Süresiz erişim için bir **Sistem Kullanıcısı** oluşturulmalıdır.

1. [İşletme Ayarları](https://business.facebook.com/settings) paneline gidiniz.
2. **Kullanıcılar > Sistem Kullanıcıları** sekmesinden yeni bir kullanıcı ekleyiniz (Rol: Yönetici).
3. **Kritik Adım:** Sol menüdeki **Hesaplar > Uygulamalar** sekmesine gidiniz.
4. Oluşturduğunuz uygulamayı seçin, **Kişi Ekle (Add People)** butonuna tıklayın ve oluşturduğunuz Sistem Kullanıcısını seçerek **"Uygulamayı Yönet" (Full Control)** yetkisi ile ekleyiniz. *Bu adım yapılmadığı takdirde jeton oluşturma aşamasında hata alınacaktır.*

---

## 5. Aşama: Varlık Ataması (Asset Assignment)

Sistem kullanıcısına ilgili verileri yönetme yetkisi tanımlanmalıdır:

1. **Sistem Kullanıcıları** sekmesinde oluşturduğunuz kullanıcıyı seçiniz ve **Varlıkları Ata (Assign Assets)** butonuna tıklayınız.
2. **Sayfalar:** İlgili Facebook sayfasını seçip yetki veriniz.
3. **Instagram Hesapları:** İlgili Instagram hesabını seçiniz ve **"Hesabı Yönet / Tam Kontrol"** yetkisini aktif ederek kaydediniz.

---

## 6. Aşama: Süresiz Erişim Anahtarı (Token) Üretimi

1. Sistem Kullanıcıları panelinde **Jeton Oluştur (Generate Token)** butonuna tıklayınız.
2. İlgili uygulamayı seçiniz ve aşağıdaki 3 izni işaretleyiniz:
    * `instagram_basic`
    * `pages_show_list`
    * `pages_read_engagement`
3. Oluşturulan kodu kopyalayınız. Bu sizin süresiz anahtarınızdır.
4. **Doğrulama:** [Access Token Debugger](https://developers.facebook.com/tools/debug/accesstoken/) aracına bu kodu yapıştırarak **"Expires: Never"** ibaresini kontrol ediniz.

---

## 7. Aşama: Instagram Business ID Erişimi

1. [Graph API Explorer](https://developers.facebook.com/tools/explorer/) aracına gidiniz.
2. "Access Token" kısmına aldığınız süresiz kodu yapıştırınız.
3. Adres çubuğuna şu sorguyu yazıp **Submit** butonuna basınız:
    `me/accounts?fields=instagram_business_account{id,username,name}`
4. Gelen sonuçtaki `id` (17 haneli numara) sizin **Instagram Business ID** verinizdir.

---

## Teknik Teslimat

Yapılandırma sonunda aşağıdaki iki veriyi teknik ekibe iletiniz:

* **Süresiz Erişim Anahtarı (Access Token):** `EAAG...` (Uzun kod bloğu)
* **Instagram Business ID:** `1784...` (17 haneli sayısal kimlik)

---
*Bu döküman, 2026 yılı güncel Meta protokollerine ve tarayıcı uyumluluklarına göre hazırlanmıştır.*
