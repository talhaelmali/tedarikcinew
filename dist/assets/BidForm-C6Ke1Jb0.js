import{B as L,r as i,u as U,G as I,k as G,j as e,f as H,d as M,I as y,S as d,i as q,h as v,O}from"./index-DFtkyR6U.js";import{d as N}from"./dayjs.min-Cfwo7Ngx.js";const P=()=>{const{companyId:m,adId:c}=L(),[R,g]=i.useState(null),[t,T]=i.useState(null),[h,w]=i.useState(""),[x,S]=i.useState(""),[p,A]=i.useState(""),[k,z]=i.useState([]),[f,E]=i.useState(!1),[C,D]=i.useState(!0),u=U(),{company:l,loading:b}=I();i.useEffect(()=>{const a=G.onAuthStateChanged(s=>{g(s||null)});return()=>a()},[]),i.useEffect(()=>{(async()=>{if(!(b||!l)){try{const s=await H(M(y,"companies",m,"ads",c));if(s.exists()){T(s.data());const n=s.data().endDate;if(n&&N().isAfter(N(n.seconds*1e3))){d.fire({title:"İlan Süresi Doldu",text:"Bu ilan süresi dolduğu için teklif verilemez.",icon:"info",confirmButtonText:"Tamam"}).then(()=>u("/ads"));return}}else{d.fire({title:"İlan Bulunamadı",text:"Görüntülemek istediğiniz ilan mevcut değil.",icon:"error",confirmButtonText:"Tamam"}).then(()=>u("/ads"));return}const r=(await q(v(y,"companies",m,"ads",c,"bids"))).docs.map(n=>({id:n.id,...n.data()}));z(r),r.find(n=>n.bidderCompanyId===l.id)&&E(!0)}catch(s){console.error("Error fetching data:",s)}D(!1)}})()},[m,c,u,l,b]);const j=a=>a.length>0?Math.min(...a.map(s=>parseFloat(s.bidAmount))):null,F=async a=>{a.preventDefault();const s=parseFloat(h);let o=null;if((t==null?void 0:t.adType)==="Açık Usül İhale"){const r=j(k);o=r!==null?r:t==null?void 0:t.maxBid}else o=t==null?void 0:t.maxBid;if(o!==null&&(s>=o||s===o)){d.fire({title:"Hata!",text:"Verdiğiniz teklif maksimum teklif ile aynı veya daha fazla olamaz. En az 1 düşük teklif vermelisiniz.",icon:"error",confirmButtonText:"Tamam"});return}if(!f&&!x){d.fire({title:"Hata!",text:"İlk teklif için detay girmelisiniz.",icon:"error",confirmButtonText:"Tamam"});return}try{if(l){const r={bidderCompanyId:l.id,bidderCompanyName:l.companyName,bidAmount:s,bidDetails:f?p:x,createdAt:new Date};await O(v(y,"companies",m,"ads",c,"bids"),r),d.fire({title:"Başarılı!",text:"Teklifiniz başarıyla gönderildi.",icon:"success",confirmButtonText:"Tamam"}).then(()=>{u(`/ad-details/${m}/${c}`)})}else console.log("User company does not exist")}catch(r){console.error("Error adding document:",r),d.fire({title:"Hata!",text:"Teklif gönderilirken bir hata oluştu.",icon:"error",confirmButtonText:"Tamam"})}};if(C||b)return e.jsx("div",{children:"Loading..."});const B=(t==null?void 0:t.adType)==="Açık Usül İhale"&&j(k)||(t==null?void 0:t.maxBid);return e.jsx("div",{className:"max-w-4xl mx-auto mb-20",children:e.jsxs("div",{className:"bg-white rounded-lg px-4 py-5 sm:px-6",children:[e.jsxs("h2",{className:"text-xl font-semibold text-gray-900",children:[t==null?void 0:t.title," Fiyat Teklifi"]}),e.jsx("p",{className:"text-sm text-gray-500",children:"Lütfen teklifinizi ve detayları aşağıda belirtin."}),e.jsxs("form",{onSubmit:F,className:"mt-6",children:[e.jsx("div",{className:"mb-4",children:f?e.jsxs(e.Fragment,{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700",children:"Yeni Detay (Opsiyonel)"}),e.jsx("textarea",{value:p,onChange:a=>A(a.target.value),className:"mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm",placeholder:"Ek detaylar opsiyoneldir."}),e.jsx("p",{className:"text-sm text-gray-500 mt-2",children:"Daha önce teklif verdiniz, detay girmek opsiyoneldir."})]}):e.jsxs(e.Fragment,{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700",children:"İlk Teklif Detayları"}),e.jsx("textarea",{value:x,onChange:a=>S(a.target.value),rows:"4",className:"mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm",placeholder:"Detaylar zorunludur.",required:!0})]})}),e.jsxs("div",{className:"mb-4",children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700",children:"Teklif Tutarı"}),e.jsxs("div",{className:"flex",children:[e.jsx("span",{className:"inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm",children:"₺"}),e.jsx("input",{type:"number",value:h,onChange:a=>w(a.target.value),className:"mt-1 block w-full rounded-none rounded-r-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm",required:!0}),e.jsx("span",{className:"inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm",children:"TRY"})]}),B!==null&&e.jsxs("p",{className:"text-sm text-gray-500 mt-2",children:["Maksimum Teklif: ₺",B]})]}),e.jsx("div",{className:"text-right",children:e.jsx("button",{type:"submit",className:"inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2",children:"Gönder"})})]})]})})};export{P as default};