import React from 'react';
import Header from '../components/Header';
import Footer from './Footer';

const Privacy = () => {
  return (
    <>
      <Header />
      <div className="bg-white px-6 py-12 lg:px-8">
        <div className="mx-auto max-w-3xl text-base leading-7 text-gray-700">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Bilgi Güvenliği Politikası
            </h1>
          </div>

          <div className="mt-6 text-xl leading-8">
            <p className="mb-4">
              Caderk Bilişim, kurumsal bilgiyi son derece değerli bir varlık olarak kabul eder. Bilgi ve bu bilgilerin barındırıldığı destek iş sistemlerinin kaybolması, bozulması, CADERK BİLİŞİM SANAYİ VE TİCARET LİMİTED ŞİRKETİ’ne zarar verecek şekilde 3. kişilere ifşası veya çalınması, şirket iş faaliyetlerinin bütünlüğü ve itibarı üzerinde ciddi bir etkiye sahip olabilir. Bu nedenle tüm Caderk Bilişim çalışanlarının, Bilgi Güvenliği ilkelerinin bilincinde olmaları bir gerekliliktir.
            </p>
            <p className="mb-4">
              Bilgi güvenliği, bilgi varlıklarının aşağıdaki özelliklerinin korunmasını sağlar:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Gizlilik:</strong> Bilginin sadece yetkili kişiler tarafından erişilebilir olması,</li>
              <li><strong>Bütünlük:</strong> Bilginin yetkisiz değiştirmelerden korunması ve değiştirildiğinde farkına varılması,</li>
              <li><strong>Kullanılabilirlik / Erişilebilirlik:</strong> Bilginin yetkili kullanıcılar tarafından gerek duyulduğu an kullanılabilir olması.</li>
            </ul>
            <p className="mb-4">
              Caderk Bilişim, ISO 27001 Bilgi Güvenliği Yönetim Sistemini uygulamakta olup, aşağıda belirtilen hedefleri benimsemiştir:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Şirketin güvenilirliğini ve temsil ettiği imajı korumak,</li>
              <li>Şirketin temel ve destekleyici iş faaliyetlerinin en az kesinti ile devam etmesini sağlamak,</li>
              <li>Yasa, mevzuat ve üçüncü taraflarla yapılan sözleşmelere uyumu sağlamak,</li>
              <li>Riskleri yeterli düzeyde ele almak için Bilgi Güvenliği Yönetim Sistemini sürekli iyileştirerek sürdürmek.</li>
            </ul>
            <p className="mb-4">
              Caderk Bilişim’in politika ve prosedürleri, Caderk Bilişim bilgilerini ve/veya Caderk Bilişim bilgi sistemleri altyapılarını kullanan tüm tam/yarı zamanlı, süreli/süresiz sözleşmeli Caderk Bilişim personeli, stajyerler ve üçüncü şahıs hizmet sağlayıcıları için, coğrafi konumdan veya bölümünden bağımsız olarak geçerlidir.
            </p>
            <p className="mb-4">
              Caderk Bilişim bilgilerini ve/veya Caderk Bilişim bilgi sistemleri altyapılarını kullananlar:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Bilgi Güvenliği Politikası ile birlikte İş Etiği Kurallarında belirtilen gizli bilgilerin korunması ilkeleriyle diğer politika ve dokümanları öğrenmek ve bunlara uymak,</li>
              <li>Kişisel ve elektronik iletişimde şirkete ait bilginin gizliliğini, bütünlüğünü ve erişilebilirliğini sağlamak,</li>
              <li>Risk düzeylerine göre belirlenen güvenlik önlemlerini almak,</li>
              <li>Bilgi güvenliği ihlal olaylarını raporlamak ve bu ihlalleri engelleyecek önlemleri almak,</li>
              <li>Şirket içi bilgi kaynaklarını (duyuru, doküman vb.) yetkisiz olarak 3. kişilere iletmemek,</li>
              <li>Şirket bilgi sistemleri altyapılarını, mevzuata aykırı faaliyetler amacıyla kullanmamak,</li>
              <li>Caderk Bilişim müşterileri, iş ortakları, tedarikçiler veya diğer üçüncü kişilere ait bilgilerin gizliliğini, bütünlüğünü ve erişilebilirliğini korumak zorundadır.</li>
            </ul>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Privacy;