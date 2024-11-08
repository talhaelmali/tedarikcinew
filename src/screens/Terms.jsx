import React from 'react';
import Header from '../components/Header';
import Footer from './Footer';

const Terms = () => {
  return (
    <>
      <Header />
      <div className="bg-white px-6 py-12 lg:px-8">
        <div className="mx-auto max-w-3xl text-base leading-7 text-gray-700">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Kullanım Şartları
            </h1>
          </div>

          <div className="mt-6 text-xl leading-8">
            <p className="mb-4">
              Bu Kullanım Şartları, www.e-tedarikci.com adresi üzerinden ulaşılan web sitesinin, İnternet kullanıcıları tarafından ziyaret edilmesine ilişkin kullanım koşullarını içermektedir. Bu siteyi ziyaret eden kullanıcılar (“Kullanıcılar”), aşağıdaki Kullanım Şartları’nı okumuş ve kabul etmiş sayılırlar.
            </p>
            <p className="mb-4">
              Yukarıda belirtilen web sitesi ve bu web sitesinde yer alan ticari marka, logo, bilgi, resim ve görüntü başta olmak üzere, her türlü içerik üzerindeki tüm hak ve menfaatler (fikri ve sınaî mülkiyet hakları dâhil olmak üzere) CADERK BİLİŞİM SANAYİ VE TİCARET LİMİTED ŞİRKETİ’ne (“Şirket”), ve/veya hak ve menfaatleri saklı üçüncü şahıslara aittir. Söz konusu içerikler, Şirket’in önceden alınan yazılı izni olmadan, doğrudan veya dolaylı olarak kopyalanamaz, çoğaltılamaz, dağıtılamaz, yayınlanamaz, değiştirilemez, aynen veya değiştirilerek veya ticari bir amaçla kaynak gösterilmek suretiyle de olsa kullanılamaz, hiçbir format altında bilgisayar sistemlerine aktarılamaz ve bunlar üzerinde herhangi bir şekilde tasarrufta bulunulamaz.
            </p>
            <p className="mb-4">
              Şirket, web sitesi ve içeriklerin, doğruluğu ve güncelliği açısından herhangi bir garanti vermemektedir. Web sitesinde ve içeriğinde bulunan hiçbir unsur, Şirket’in, Kullanıcılar’a yada üçüncü kişilere herhangi bir taahhütte bulunduğu şeklinde yorumlanamaz. İçeriklere ulaşılmasında yaşanan gecikme veya kesintiler bakımından Şirket’in hiçbir sorumluluğu bulunmamaktadır. Şirket, içerikleri, işbu Şartlar da dâhil olmak üzere dilediği zaman, önceden haber vermek zorunluluğu bulunmaksızın, tek taraflı olarak değiştirme ve güncelleme hakkına sahiptir. Kullanıcıların, web sitesini ziyaret etmelerinden veya içeriklere dayanarak gerçekleştirdikleri herhangi bir işlemden kaynaklanabilecek zarar ve ziyan sebebiyle Şirket’in hiçbir sorumluluğu bulunmamaktadır.
            </p>
            <p className="mb-4">
              İşbu Kullanım Şartları ve/veya web sitesi’ne ilişkin olarak söz konusu olabilecek her türlü uyuşmazlıkta Türk Kanunları’nın uygulanacağı; işbu Şartların ve Şirket’e ait kayıtların (bilgisayar kayıtları dâhil olmak üzere) Hukuk Muhakemeleri Kanunu’nun 193. maddesine uygun olarak tek ve gerçek münhasır delil olarak kabul edileceği ve İstanbul Anadolu Adliyesi Mahkemeleri ile İcra ve İflas Müdürlükleri’nin tek yetkili olacağı Şirket tarafından beyan ve Kullanıcılar tarafından kabul ve taahhüt edilmektedir.
            </p>
            <p className="mb-4">
              Kullanıcılar, işbu Şartları okumamış veya okumuş olup da işbu Şartlara veya yürürlükte bulunan ilgili yasa veya düzenlemelere uygun davranmamış olmalarından kaynaklanabilecek her türlü zarar ve ziyandan sorumlu olacaktır.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Terms;