import React from 'react';
import Header from '../components/Header';
import Footer from './Footer';


const Cookies = () => {
  return (
    <>
    <Header/>
      <div className="bg-white px-6 py-12 lg:px-8">
        <div className="mx-auto max-w-3xl text-base leading-7 text-gray-700">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Çerez Aydınlatma Metni
            </h1>
          </div>

          <div className="mt-6 text-xl leading-8">
            <p className="mb-4">
            6698 sayılı Kişisel Verilerin Korunması Kanunu’nun (“Kanun”) 10’uncu maddesi ile Aydınlatma Yükümlülüğünün Yerine Getirilmesinde Uyulacak Usul ve Esaslar Hakkında Tebliğ kapsamında veri sorumlusu sıfatıyla CADERK BİLİŞİM SANAYİ VE TİCARET LİMİTED ŞİRKETİ (“Caderk Bilişim” veya “Şirket”) tarafından hazırlanmıştır.            </p>
            <p className="mb-4">
            Çerezler, ziyaret ettiğiniz internet siteleri tarafından tarayıcılar aracılığıyla cihazınıza veya ağ sunucusuna depolanan küçük metin dosyalarıdır. Bu Çerez Aydınlatma Metni’nin amacı, internet sitemizde kullanılan çerezlerin cihazınıza yerleştirilmesi aracılığıyla otomatik yolla elde edilen kişisel verilerin işlenmesine ilişkin olarak, hangi amaçlarla hangi tür çerezleri kullandığımızı ve bu çerezleri nasıl yönetebileceğiniz hakkında sizlere bilgi vermektir.            </p>
            <p className="mb-4">
            İnternet sitemizde kullandığımız, zorunlu çerezler haricindeki çerezler için, kullanıcıların açık rızaları alınmakta ve istedikleri zaman rızalarını değiştirebilme olanağı sağlanmaktadır. Kullanıcılar çerez yönetim paneli üzerinden, internet sitemizde kullanılan çerez çeşitlerini görebilmekte ve Zorunlu Çerezler dışında kalan tüm çerezler için “açık” veya “kapalı” seçenekleri ile tercihlerini belirleyebilmektedirler. Yine bu panel üzerinden kullanıcılar tercihlerini her zaman değiştirebilmektedirler.            </p>

            <h2 className="mt-8 text-2xl font-semibold text-gray-900">1. İnternet Sitemizde Kullanılan Çerez Türleri</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 px-4 text-left text-sm font-semibold text-gray-900">
                      Çerez Türü
                    </th>
                    <th scope="col" className="py-3.5 px-4 text-left text-sm font-semibold text-gray-900">
                      Açıklama
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="py-4 px-4 text-sm text-gray-500">Oturum Çerezleri</td>
                    <td className="py-4 px-4 text-sm text-gray-500">
                    Oturum çerezleri, Site’yi kullanımınız sırasında geçerli olan çerezler olup internet tarayıcısı kapatılıncaya kadar geçerliliklerini korurlar. İnternet sitemizde kullanım sürelerine göre oturum çerezleri ve kalıcı çerezler kullanmaktadır. Oturum çerezi, oturumun sürekliliğinin sağlanması amacıyla kullanılmakta olup kullanıcı tarayıcısını kapattığında bu çerezler de silinmektedir.                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 text-sm text-gray-500">Kalıcı Çerezler</td>
                    <td className="py-4 px-4 text-sm text-gray-500">
                    Bu çerezler tarayıcınızda saklanan ve tarafınızca silininceye dek veya son kullanım tarihine kadar geçerliliğini koruyan çerezlerdir. Kalıcı çerez internet tarayıcısı kapatıldığı zaman silinmemekte ve belirli bir tarihte veya belirli bir süre sonra kendiliğinden silinmektedir.                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 text-sm text-gray-500">Birinci Taraf Çerezler</td>
                    <td className="py-4 px-4 text-sm text-gray-500">
                    Çerezin birinci taraf ya da üçüncü taraf olması durumu, internet sitesinin ya da etki alanının yerleştirdiği çereze göre değişiklik arz etmektedir. Birinci taraf çerezler, doğrudan kullanıcının ziyaret ettiği internet sitesi yani tarayıcının adres çubuğunda gösterilen internet adresi tarafından yerleştirilmektedir.                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 text-sm text-gray-500">Üçüncü Taraf Çerezler</td>
                    <td className="py-4 px-4 text-sm text-gray-500">
                    Üçüncü taraf çerezler kullanıcının ziyaret ettiği etki alanından farklı bir etki alanı tarafından yerleştirilmektedir.                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 text-sm text-gray-500">Zorunlu Çerezler</td>
                    <td className="py-4 px-4 text-sm text-gray-500">
                    Bu çerezler internet sitemizin çalışması amacıyla gerekli olan çerezlerdir. Söz konusu çerezler birinci taraf çerezler olup oturum süresince (gizlilik tercihlerinize dair çerezler hariç olmak üzere, zira bu çerezler oturum süresinden daha uzun ömürlüdür.) kişisel veri işlemekte, oturum sonlandığında otomatikman silinmektedirler. Söz konusu çerezler talep etmiş olduğunuz bir bilgi toplumu hizmetinin (log-in olma, form doldurma ve gizlilik tercihlerinin hatırlanması) yerine getirilebilmesi için zorunlu olarak kullanılmaktadırlar. Ayrıca performans ve analitik amaçlı çerez internet sitemizdeki ziyaretçilerin sayılması ve trafiğin ölçülmesine olanak sağlamaktadır ve birinci taraftır. Bu sayede sitemizin performansını ölçmekte ve iyileştirebilmekteyiz.                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 text-sm text-gray-500">Reklam/Pazarlama Çerezleri</td>
                    <td className="py-4 px-4 text-sm text-gray-500">
                    Bu çerezler internet sitemiz aracılığıyla reklam ortaklarımızın yerleştirdikleri çerezler olup üçüncü taraf çerezlerdir. Bu çerezler iş ortaklarımız tarafından ilgi alanlarınıza göre profilinizin çıkarılması ve size ilgili reklamlar göstermek üzere kullanılmaktadır.                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 text-sm text-gray-500">İşlevsel Çerezler</td>
                    <td className="py-4 px-4 text-sm text-gray-500">
                    Bu tür çerezler, internet sitemizi daha işlevsel kılmak ve kişiselleştirme amaçlarıyla (gizlilik tercihleriniz hariç olmak üzere diğer tercihlerinizin siteye tekrar girdiğinizde hatırlanmasını sağlamak) kullanılmaktadır.                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="mt-8 text-2xl font-semibold text-gray-900">2. İşlenen Kişisel Verilerin İşlenme Amacı, Aktarıldığı Yerler, Çerez Adı, Çerez Tipi ve Saklama Süresi</h2>
              <p className="mt-4 mb-4">
                Zorunlu çerezler, talep etmiş olduğunuz bir bilgi toplumu hizmetinin (log-in olma, form doldurma, gizlilik tercihlerinin hatırlanması) yerine getirilebilmesi amacıyla kullanılmaktadır. Reklam ve Pazarlama çerezleri iş ortaklarımız tarafından ilgi alanlarınıza göre profilinizin çıkarılması ve size ilgili reklamlar göstermek amacıyla kullanılmaktadır. İşlevsel çerezler ise sitemizi daha işlevsel kılmak ve kişiselleştirme amacıyla kullanılmaktadır.
              </p>

              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="py-3.5 px-4 text-left text-sm font-semibold text-gray-900">Çerez Adı</th>
                      <th scope="col" className="py-3.5 px-4 text-left text-sm font-semibold text-gray-900">Açıklama / Amaç</th>
                      <th scope="col" className="py-3.5 px-4 text-left text-sm font-semibold text-gray-900">Çerez Tipi</th>
                      <th scope="col" className="py-3.5 px-4 text-left text-sm font-semibold text-gray-900">Saklama Süresi</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="py-4 px-4 text-sm text-gray-500">i18n_redirected</td>
                      <td className="py-4 px-4 text-sm text-gray-500">Kullanıcının dil tercihlerini saklar.</td>
                      <td className="py-4 px-4 text-sm text-gray-500">Birinci Taraf Çerez</td>
                      <td className="py-4 px-4 text-sm text-gray-500">1 yıl</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-4 text-sm text-gray-500">_dc_gtm_UA-</td>
                      <td className="py-4 px-4 text-sm text-gray-500">Google Analytics sunucu isteklerini izlemek için kullanılır.</td>
                      <td className="py-4 px-4 text-sm text-gray-500">Zorunlu</td>
                      <td className="py-4 px-4 text-sm text-gray-500">1 gün</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-4 text-sm text-gray-500">_ga</td>
                      <td className="py-4 px-4 text-sm text-gray-500">Google Ads performansını ölçmek için kullanılır.</td>
                      <td className="py-4 px-4 text-sm text-gray-500">Pazarlama</td>
                      <td className="py-4 px-4 text-sm text-gray-500">2 yıl</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-4 text-sm text-gray-500">_gid</td>
                      <td className="py-4 px-4 text-sm text-gray-500">Sayfa görüntülenmelerini saymak için kullanılır.</td>
                      <td className="py-4 px-4 text-sm text-gray-500">Performans</td>
                      <td className="py-4 px-4 text-sm text-gray-500">1 gün</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-4 text-sm text-gray-500">IDE</td>
                      <td className="py-4 px-4 text-sm text-gray-500">Google reklam kampanyalarını optimize etmek için kullanılır.</td>
                      <td className="py-4 px-4 text-sm text-gray-500">Pazarlama</td>
                      <td className="py-4 px-4 text-sm text-gray-500">2 yıl</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-4 text-sm text-gray-500">_gcl_au</td>
                      <td className="py-4 px-4 text-sm text-gray-500">Dönüşüm verilerini almak için kullanılır.</td>
                      <td className="py-4 px-4 text-sm text-gray-500">Pazarlama</td>
                      <td className="py-4 px-4 text-sm text-gray-500">90 gün</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-4 text-sm text-gray-500">_fbp</td>
                      <td className="py-4 px-4 text-sm text-gray-500">Ziyaretleri izlemek için kullanılır.</td>
                      <td className="py-4 px-4 text-sm text-gray-500">Pazarlama</td>
                      <td className="py-4 px-4 text-sm text-gray-500">90 gün</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-4 text-sm text-gray-500">fr</td>
                      <td className="py-4 px-4 text-sm text-gray-500">Facebook reklam hedeflemesi için kullanılır.</td>
                      <td className="py-4 px-4 text-sm text-gray-500">Pazarlama</td>
                      <td className="py-4 px-4 text-sm text-gray-500">90 gün</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-4 text-sm text-gray-500">li_sugr</td>
                      <td className="py-4 px-4 text-sm text-gray-500">LinkedIn pazarlama çerezidir.</td>
                      <td className="py-4 px-4 text-sm text-gray-500">Performans</td>
                      <td className="py-4 px-4 text-sm text-gray-500">90 gün</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-4 text-sm text-gray-500">lang</td>
                      <td className="py-4 px-4 text-sm text-gray-500">Kullanıcının dil ayarını hatırlamak için kullanılır.</td>
                      <td className="py-4 px-4 text-sm text-gray-500">Performans</td>
                      <td className="py-4 px-4 text-sm text-gray-500">Oturum süresince</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-4 text-sm text-gray-500">bcookie</td>
                      <td className="py-4 px-4 text-sm text-gray-500">LinkedIn'e erişen cihazları tanımlamak için kullanılır.</td>
                      <td className="py-4 px-4 text-sm text-gray-500">Performans</td>
                      <td className="py-4 px-4 text-sm text-gray-500">1 yıl</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-4 text-sm text-gray-500">AnalyticsSyncHistory</td>
                      <td className="py-4 px-4 text-sm text-gray-500">LinkedIn Ads kimliği senkronizasyonu için kullanılır.</td>
                      <td className="py-4 px-4 text-sm text-gray-500">Performans</td>
                      <td className="py-4 px-4 text-sm text-gray-500">30 gün</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-4 text-sm text-gray-500">UserMatchHistory</td>
                      <td className="py-4 px-4 text-sm text-gray-500">LinkedIn kullanıcı davranışını izlemek için kullanılır.</td>
                      <td className="py-4 px-4 text-sm text-gray-500">Performans</td>
                      <td className="py-4 px-4 text-sm text-gray-500">2 yıl</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="mt-4 mb-4">
              Kişisel verileriniz, şirketimiz tarafından internet sitemizi ziyaret etmeniz dolayısıyla teknik iletişim dosyaları olan çerezler vasıtasıyla teknik ve otomatik yöntemlerle toplanmaktadır. Çerezler vasıtası ile elde edilen kişisel verileriniz, kişisel verilerinizin aşağıda yer alan işlenme amaçları doğrultusunda, çerezlerin çalışması için birlikte çalıştığımız iş ortaklarımıza ve kanunen yetkili kamu kurumlarına çerezlerin kullanılabilmesi ve resmi kurum taleplerinin karşılanabilmesi için aktarılabilecektir.
              </p>

            <h2 className="mt-8 text-2xl font-semibold text-gray-900">3. Çerez Kullanımının Engellenmesi</h2>
            <p className="mt-4 mb-4">
              Tarayıcı ayarlarınızı değiştirerek çerezlere ilişkin tercihlerinizi kişiselleştirme imkânına sahipsiniz. Tarayıcı üreticileri, kendi ürünleri özelinde çerezlerin yönetimi hususunda ilgili yardım sayfaları sunmaktadır. Yardım almak için aşağıdaki linkleri inceleyebilirsiniz.
            </p>
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 px-4 text-left text-sm font-semibold text-gray-900">
                      Tarayıcı
                    </th>
                    <th scope="col" className="py-3.5 px-4 text-left text-sm font-semibold text-gray-900">
                      Yardım Linki
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="py-4 px-4 text-sm text-gray-500">Google Chrome</td>
                    <td className="py-4 px-4 text-sm text-blue-500">
                      <a href="https://support.google.com/chrome/answer/95647?hl=en" target="_blank" rel="noopener noreferrer">
                        Google Chrome Yardım
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 text-sm text-gray-500">Opera</td>
                    <td className="py-4 px-4 text-sm text-blue-500">
                      <a href="https://help.opera.com/en/latest/web-preferences/" target="_blank" rel="noopener noreferrer">
                        Opera Yardım
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 text-sm text-gray-500">Mozilla Firefox</td>
                    <td className="py-4 px-4 text-sm text-blue-500">
                      <a href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" target="_blank" rel="noopener noreferrer">
                        Mozilla Firefox Yardım
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 text-sm text-gray-500">Safari</td>
                    <td className="py-4 px-4 text-sm text-blue-500">
                      <a href="https://support.apple.com/kb/PH5042?locale=en_US" target="_blank" rel="noopener noreferrer">
                        Safari Yardım
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="mt-8 text-2xl font-semibold text-gray-900">4. Çerezlerinize İlişkin Haklarınız</h2>
            <p className="mt-4 mb-4">
            Çerezlerinize ilişkin talepleriniz ve haklarınız Kişisel Verilerin Korunması Kanunu’nun “ilgili kişinin haklarını düzenleyen” 11. maddesinden kaynaklanmakta olup bu madde kapsamındaki taleplerinizi Veri Sorumlusuna Başvuru Usul ve Esasları Hakkında Tebliğ uyarınca şirketimize iletebilirsiniz.
Bu haklarınıza yönelik başvurularınızı, internet sitemizden ulaşabileceğiniz Destek Formu’nu doldurarak Şirket’in KUŞPINAR MAH. KIBRIS ŞEHİTLERİ. CAD. AYSEL YAKAR APT NO: 64 İÇ KAPI NO: 3 PAMUKKALE/ DENİZLİadresine posta yoluyla veya caderkbilisim@hs01.kep.tr kayıtlı elektronik posta adresine adresine göndererek iletebilirsiniz.
Şirketimiz taleplerinizi, talebin niteliğine göre en kısa sürede ve en geç otuz gün içinde ücretsiz olarak sonuçlandırır. Ancak, işlemin ayrıca bir maliyeti gerektirmesi hâlinde ücret alınabilir. Şirketimiz talebi kabul edip işleme koyabilir veya gerekçesini açıklayarak talebi yazılı usulle reddedebilir.
Yukarıda belirtilen prosedür takip edilerek gerçekleştirilen başvurunun reddedilmesi, verilen cevabın yetersiz bulunması veya süresinde başvuruya cevap verilmemesi hâllerinde, cevabın tebliğini takiben otuz ve her hâlde başvuru tarihinden itibaren altmış gün içinde Kişisel Verileri Koruma Kurulu’na (“Kurul”) şikâyette bulunma hakkı mevcuttur. Ancak başvuru yolu tüketilmeden şikâyet yoluna başvurulamaz.
Kurul, şikâyet üzerine veya ihlal iddiasını öğrenmesi durumunda resen, görev alanına giren konularda gerekli incelemeyi yapar. Şikâyet üzerine Kurul, talebi inceleyerek ilgililere bir cevap verir. Şikâyet tarihinden itibaren altmış gün içinde cevap verilmezse talep reddedilmiş sayılır. Şikâyet üzerine veya resen yapılan inceleme sonucunda, ihlalin varlığının anlaşılması hâlinde Kurul, tespit ettiği hukuka aykırılıkların veri sorumlusu tarafından giderilmesine karar vererek ilgililere tebliğ eder. Bu karar, tebliğden itibaren gecikmeksizin ve en geç otuz gün içinde yerine getirilir. Kurul, telafisi güç veya imkânsız zararların doğması ve açıkça hukuka aykırılık olması hâlinde, veri işlenmesinin veya verinin yurt dışına aktarılmasının durdurulmasına karar verebilir.
Şirketimiz tarafından düzenlenen işbu Çerez Aydınlatma Metni kişisel bilgi uygulamalarımızın gösterilmesi amacıyla, periyodik olarak güncellenebilir. Çerez Aydınlatma Metni’mizde önemli herhangi bir değişiklik yapılması durumunda, başta internet sitemiz aracılığıyla olmak üzere bilgilendirme yapılacaktır.
Verilerinizin Şirketimiz nezdinde hassasiyetle korunduğunu belirtir bize duyduğunuz güven için teşekkür ederiz.
            </p>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default Cookies;