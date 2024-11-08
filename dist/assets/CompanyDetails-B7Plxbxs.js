import{r as o,u as V,j as e,aE as c,k as F,h as f,I as m,D as g,F as h,i as v,d as U,f as L}from"./index-Pf0wcubd.js";import{s as n}from"./sweetalert.min-CUxdrMD-.js";function E(){const[t,u]=o.useState({companyName:"",companyTitle:"",city:"",district:"",postalCode:"",address:"",signatureCircularVerified:!1,taxDocumentVerified:!1,activityCertificateVerified:!1,taxDocumentURL:""}),[j,l]=o.useState(!0),d=V();return o.useEffect(()=>{(async()=>{try{const s=F.currentUser;if(!s){n("Oturum açılmadı","Şirket bilgilerini görüntülemek için giriş yapmalısınız.","error").then(()=>{d("/login")});return}const x=s.uid,N=f(m,"companies"),k=g(N,h("adminUserId","==",x)),y=await v(k);if(!y.empty){const a=y.docs[0].data();u({companyName:a.companyName||"",companyTitle:a.companyTitle||"",city:a.city||"",district:a.district||"",postalCode:a.postalCode||"",address:a.address||"",signatureCircularVerified:a.signatureCircularVerified??!1,taxDocumentVerified:a.taxDocumentVerified??!1,activityCertificateVerified:a.activityCertificateVerified??!1,taxDocumentURL:a.taxDocumentURL||""}),l(!1);return}const w=f(m,"members"),C=g(w,h("userId","==",x)),p=await v(C);if(!p.empty){const a=p.docs[0].data().companyId,D=U(m,"companies",a),b=await L(D);if(b.exists()){const r=b.data();u({companyName:r.companyName||"",companyTitle:r.companyTitle||"",city:r.city||"",district:r.district||"",postalCode:r.postalCode||"",address:r.address||"",signatureCircularVerified:r.signatureCircularVerified??!1,taxDocumentVerified:r.taxDocumentVerified??!1,activityCertificateVerified:r.activityCertificateVerified??!1,taxDocumentURL:r.taxDocumentURL||""}),l(!1);return}}n("Şirket bulunamadı","Bu kullanıcı ile ilişkilendirilmiş bir şirket bulunamadı.","error").then(()=>{d("/dashboard")})}catch(s){console.error("Şirket bilgileri alınırken hata oluştu: ",s),n("Hata",s.message,"error"),l(!1)}})()},[d]),j?e.jsx("div",{children:"Yükleniyor..."}):e.jsxs("div",{className:"pb-8",children:[e.jsxs("nav",{className:"flex border-b border-gray-200 mb-6",children:[e.jsx(c,{to:"/profile",className:({isActive:i})=>i?"text-blue-800 border-b-2 border-blue-800 py-2 px-4":"text-gray-600 py-2 px-4 hover:text-blue-600",children:"Profil"}),e.jsx(c,{to:"/my-company",className:({isActive:i})=>i?"text-blue-800 border-b-2 border-blue-800 py-2 px-4":"text-gray-600 py-2 px-4 hover:text-blue-600",children:"Firma Bilgileri"}),e.jsx(c,{to:"/teammembers",className:({isActive:i})=>i?"text-blue-800 border-b-2 border-blue-800 py-2 px-4":"text-gray-600 py-2 px-4 hover:text-blue-600",children:"Ekip Üyeleri"})]}),e.jsx("h2",{className:"text-2xl font-bold mb-6",children:"Şirket Bilgileri"}),e.jsxs("form",{children:[e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-6",children:[e.jsxs("div",{children:[e.jsx("label",{htmlFor:"companyName",className:"block text-sm font-medium text-gray-700",children:"Şirket Adı"}),e.jsx("input",{id:"companyName",name:"companyName",type:"text",value:t.companyName,className:"mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100 cursor-not-allowed",disabled:!0})]}),e.jsxs("div",{children:[e.jsx("label",{htmlFor:"companyTitle",className:"block text-sm font-medium text-gray-700",children:"Şirket Unvanı"}),e.jsx("input",{id:"companyTitle",name:"companyTitle",type:"text",value:t.companyTitle,className:"mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100 cursor-not-allowed",disabled:!0})]}),e.jsxs("div",{children:[e.jsx("label",{htmlFor:"city",className:"block text-sm font-medium text-gray-700",children:"İl"}),e.jsx("input",{id:"city",name:"city",type:"text",value:t.city,className:"mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100 cursor-not-allowed",disabled:!0})]}),e.jsxs("div",{children:[e.jsx("label",{htmlFor:"district",className:"block text-sm font-medium text-gray-700",children:"İlçe"}),e.jsx("input",{id:"district",name:"district",type:"text",value:t.district,className:"mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100 cursor-not-allowed",disabled:!0})]}),e.jsxs("div",{children:[e.jsx("label",{htmlFor:"postalCode",className:"block text-sm font-medium text-gray-700",children:"Posta Kodu"}),e.jsx("input",{id:"postalCode",name:"postalCode",type:"text",value:t.postalCode,className:"mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100 cursor-not-allowed",disabled:!0})]}),e.jsxs("div",{children:[e.jsx("label",{htmlFor:"address",className:"block text-sm font-medium text-gray-700",children:"Adres"}),e.jsx("input",{id:"address",name:"address",type:"text",value:t.address,className:"mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100 cursor-not-allowed",disabled:!0})]})]}),e.jsx("h3",{className:"text-lg font-medium mt-6 mb-4",children:"Belge Doğrulama Durumları"}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-6",children:[e.jsxs("div",{children:[e.jsx("label",{htmlFor:"signatureCircularVerified",className:"block text-sm font-medium text-gray-700",children:"İmza Sirküleri Doğrulandı mı?"}),e.jsx("input",{id:"signatureCircularVerified",name:"signatureCircularVerified",type:"text",value:t.signatureCircularVerified?"Evet":"Hayır",className:"mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100 cursor-not-allowed",disabled:!0})]}),e.jsxs("div",{children:[e.jsx("label",{htmlFor:"taxDocumentVerified",className:"block text-sm font-medium text-gray-700",children:"Vergi Levhası Doğrulandı mı?"}),e.jsx("input",{id:"taxDocumentVerified",name:"taxDocumentVerified",type:"text",value:t.taxDocumentVerified?"Evet":"Hayır",className:"mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100 cursor-not-allowed",disabled:!0})]}),e.jsxs("div",{children:[e.jsx("label",{htmlFor:"activityCertificateVerified",className:"block text-sm font-medium text-gray-700",children:"Faaliyet Belgesi Doğrulandı mı?"}),e.jsx("input",{id:"activityCertificateVerified",name:"activityCertificateVerified",type:"text",value:t.activityCertificateVerified?"Evet":"Hayır",className:"mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100 cursor-not-allowed",disabled:!0})]})]}),t.taxDocumentURL&&e.jsxs("div",{className:"mt-6",children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700",children:"Şirket Belgeleri"}),e.jsx("a",{href:t.taxDocumentURL,target:"_blank",rel:"noopener noreferrer",className:"mt-1 block w-full text-blue-500 hover:underline",children:"Şirket Belgelerini Görüntüle / İndir"})]})]})]})}export{E as default};