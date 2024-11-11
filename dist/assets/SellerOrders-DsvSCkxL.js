import{r as i,j as e,L as $,d as I,I as m,f as B,S as f,a as z,s as P,b as Q,c as T,C as q,G as J,D as g,au as C,J as b,F as d,H as j,i as R,av as G}from"./index-DFtkyR6U.js";import"./RatingModal-ovPTvbSt.js";import{O as V}from"./OrderDetailsModal-qeUftjwA.js";import{F as Y,M as _}from"./Modal-DE-jR12_.js";import{v as W}from"./v4-SoommWqA.js";import"./index-B9cPBpaU.js";const X=({order:a})=>{const[S,y]=i.useState(!1),[l,x]=i.useState(null),[w,k]=i.useState(""),[n,D]=i.useState(null),[N,O]=i.useState(!1),[h,v]=i.useState(!1),p=a.ad.createdAt&&a.ad.createdAt instanceof Date?a.ad.createdAt.toLocaleDateString():"Tarih yok",c=async()=>{try{const t=I(m,"orders",a.id,"logistics",a.id),s=await B(t);s.exists()?x(s.data()):x({description:"Kargo / Lojistik bilgileri bekleniyor",status:"pending"})}catch(t){console.error("Error fetching logistics data:",t),f.fire("Hata!","Kargo / Lojistik durumu yüklenirken bir hata oluştu.","error")}},F=async()=>{try{const t=I(m,"companies",a.companyId),s=await B(t);s.exists()?k(s.data().companyName):k("Firma adı bulunamadı")}catch(t){console.error("Error fetching company name:",t),f.fire("Hata!","Firma bilgisi yüklenirken bir hata oluştu.","error")}},L=async()=>{try{const t=I(m,"orders",a.id),s=await B(t);s.exists()&&D(s.data().invoiceUrl)}catch(t){console.error("Error fetching invoice:",t),f.fire("Hata!","Fatura bilgisi yüklenirken bir hata oluştu.","error")}};i.useEffect(()=>{c(),F(),L()},[]);const M=async t=>{const s=t.target.files[0];if(!s)return;const o=s.size/(1024*1024),K=["application/pdf","image/jpeg","image/png"];if(o>20){f.fire("Hata!","Fatura dosyası maksimum 20MB olmalıdır.","error");return}if(!K.includes(s.type)){f.fire("Hata!","Sadece PDF, JPEG veya PNG formatında dosya yükleyebilirsiniz.","error");return}O(!0);const H=`${W()}-${s.name}`,U=z(P,`invoices/${a.id}/${H}`);try{await Q(U,s);const A=await T(U);D(A),await q(I(m,"orders",a.id),{invoiceUrl:A,invoiceUploadedAt:new Date}),f.fire("Başarılı!","Fatura başarıyla yüklendi.","success")}catch(A){console.error("Error uploading invoice:",A),f.fire("Hata!","Fatura yüklenirken bir hata oluştu.","error")}finally{O(!1)}},E=()=>l?l.status==="accepted"?e.jsx("span",{className:"bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded",children:"Kabul Edildi"}):l.status==="rejected"?e.jsx("span",{className:"bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded",children:"Reddedildi"}):l.description==="Kargo / Lojistik bilgileri bekleniyor"?e.jsx("span",{className:"bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded",children:"Kargo / Lojistik Bekleniyor"}):l.status==="pending"&&l.description!=="Kargo / Lojistik bilgileri bekleniyor"?e.jsx("span",{className:"bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded",children:"Bilgiler Güncellendi, İşlem Bekleniyor"}):e.jsx("span",{className:"bg-yellow-200 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded",children:"Beklemede"}):e.jsx("span",{className:"bg-gray-100 text-gray-800 text-xs font-semibold px-2.5 py-0.5 rounded",children:"Durum Bilinmiyor"}),r=()=>{v(!0)},u=()=>{v(!1)};return e.jsxs("li",{className:"py-4",children:[e.jsxs("div",{className:"flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-lg shadow space-y-4 sm:space-y-0 sm:space-x-4",children:[e.jsxs("div",{className:"flex flex-col space-y-2 w-full sm:w-auto",children:[e.jsx("div",{className:"flex items-center space-x-2 overflow-x-auto whitespace-nowrap",children:a.ad.sectors.map((t,s)=>e.jsx("span",{className:"bg-gray-100 text-gray-800 text-sm font-medium px-2 py-1 rounded max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap",children:t},s))}),e.jsxs("div",{className:"flex flex-col space-y-1",children:[e.jsx("h3",{className:"text-sm font-medium text-gray-900",children:a.ad.title}),e.jsxs("span",{className:"text-blue-600 text-xs",children:["#",a.id]})]}),e.jsx("p",{className:"text-sm text-gray-500",children:a.ad.content}),e.jsxs("p",{className:"text-ml text-gray-900",children:[e.jsx("span",{className:"font-semibold",children:"Firma:"})," ",e.jsx("span",{className:"text-blue-700 font-bold",children:w})]}),e.jsxs("div",{className:"flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0",children:[e.jsx("button",{onClick:()=>y(!0),className:"bg-gray-500 text-white px-2 py-1 rounded-md text-xs font-medium w-full sm:w-auto",children:"Kargo / Lojistik Bilgileri"}),e.jsxs($,{to:`/chat/${a.id}/${a.companyId}/${a.bidderCompanyId}`,className:"flex items-center bg-green-600 text-white px-2 py-1 rounded-md text-xs font-medium w-full sm:w-auto",children:[e.jsx(Y,{className:"h-4 w-4 mr-1"}),"Firmayla İletişime Geç"]}),n?e.jsx("a",{href:n,target:"_blank",rel:"noopener noreferrer",className:"bg-blue-600 text-white px-2 py-1 rounded-md text-xs font-medium w-full sm:w-auto",children:"Faturayı Göster"}):e.jsxs("label",{className:"bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-xs font-medium cursor-pointer w-full sm:w-auto",children:[N?"Yükleniyor...":"Fatura Yükle",e.jsx("input",{type:"file",className:"hidden",accept:".pdf, image/jpeg, image/png",onChange:M,disabled:N})]}),e.jsx("button",{onClick:r,className:"bg-indigo-600 text-white px-2 py-1 rounded-md text-xs font-medium w-full sm:w-auto",children:"Sipariş Detaylarını Görüntüle"})]})]}),e.jsx("div",{className:"text-right space-y-2 w-full sm:w-auto",children:e.jsxs("div",{className:"flex flex-col space-y-1 sm:flex-row sm:space-x-2 sm:space-y-0 justify-end",children:[e.jsx("span",{className:"text-xs",children:E()}),e.jsx("span",{className:"text-gray-500 text-xs",children:p})]})})]}),h&&e.jsx(V,{order:a,closeModal:u}),S&&l&&e.jsx(_,{order:a,delivery:l,readonly:!!l,closeModal:()=>y(!1)})]})},ie=()=>{const[a,S]=i.useState([]),[y,l]=i.useState(!0),[x]=i.useState(5),[w,k]=i.useState(0),[n,D]=i.useState(""),[N,O]=i.useState(""),[h,v]=i.useState(null),p=i.useRef(),{company:c}=J();i.useEffect(()=>{c&&(F(),L())},[c,n]),i.useEffect(()=>{const r=new IntersectionObserver(u=>{u[0].isIntersecting&&!y&&a.length<w&&M()},{threshold:1});return p.current&&r.observe(p.current),()=>{p.current&&r.unobserve(p.current)}},[a,w,h,y]);const F=async()=>{l(!0);const r=[],u=n?g(j(m,"orders"),d("bidderCompanyId","==",c.id),d("ad.title",">=",n),d("ad.title","<=",n+""),b("ad.title"),b("ad.createdAt","desc"),C(x)):g(j(m,"orders"),d("bidderCompanyId","==",c.id),b("ad.createdAt","desc"),C(x)),t=await R(u);t.forEach(s=>{const o=s.data();o.ad.createdAt&&o.ad.createdAt.toDate&&(o.ad.createdAt=o.ad.createdAt.toDate()),r.push({id:s.id,...o})}),S(r),l(!1),t.docs.length>0&&v(t.docs[t.docs.length-1])},L=async()=>{const r=n?g(j(m,"orders"),d("bidderCompanyId","==",c.id),d("ad.title",">=",n),d("ad.title","<=",n+"")):g(j(m,"orders"),d("bidderCompanyId","==",c.id)),u=await R(r);k(u.size)},M=async()=>{if(!h)return;l(!0);const r=[],u=n?g(j(m,"orders"),d("bidderCompanyId","==",c.id),d("ad.title",">=",n),d("ad.title","<=",n+""),b("ad.title"),b("ad.createdAt","desc"),G(h),C(x)):g(j(m,"orders"),d("bidderCompanyId","==",c.id),b("ad.createdAt","desc"),G(h),C(x)),t=await R(u);t.forEach(s=>{const o=s.data();o.ad.createdAt&&o.ad.createdAt.toDate&&(o.ad.createdAt=o.ad.createdAt.toDate()),r.push({id:s.id,...o})}),S(s=>[...s,...r]),l(!1),t.docs.length>0&&v(t.docs[t.docs.length-1])},E=()=>{D(N)};return e.jsxs("div",{className:"max-w-4xl mx-auto mb-20",children:[e.jsxs("div",{className:"flex items-center mb-4",children:[e.jsx("input",{type:"text",placeholder:"Sipariş Ara...",className:"flex-grow p-2 border border-gray-300 rounded-l-md",value:N,onChange:r=>O(r.target.value)}),e.jsx("button",{onClick:E,className:"p-2 bg-blue-600 text-white rounded-r-md",children:"Ara"})]}),e.jsx("h1",{className:"text-2xl font-semibold text-gray-900",children:"Kazandığınız Siparişler"}),e.jsxs("p",{className:"text-sm text-gray-500",children:["Toplam ",w," siparişten ",a.length," gösteriliyor."]}),e.jsx("ul",{role:"list",className:"divide-y divide-gray-200 mt-4",children:a.map(r=>e.jsx(X,{order:r},r.id))}),e.jsx("div",{ref:p,className:"h-10"}),y&&e.jsx("div",{children:"Loading more orders..."})]})};export{ie as default};