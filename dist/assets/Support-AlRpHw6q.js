import{r as u,o as N,j as e,S as o,a as D,s as z,b as F,c as S,d as C,I as y,e as H,h as B,D as G,F as I,i as R,k as U}from"./index-Pf0wcubd.js";import{v as P}from"./v4-SoommWqA.js";function E(){const[r,f]=u.useState({subject:"",message:""}),[c,d]=u.useState([]),[h,x]=u.useState(null),[g,b]=u.useState("");u.useEffect(()=>{const a=N(U,async s=>{if(s){x(s);try{const t=B(y,"companies"),m=G(t,I("adminUserId","==",s.uid)),l=await R(m);if(l.empty)console.log("CompanyId bulunamadı!");else{const n=l.docs[0];b(n.id)}}catch(t){console.error("companyId alınırken hata oluştu: ",t)}}else x(null)});return()=>a()},[]);const p=a=>{const{name:s,value:t}=a.target;f({...r,[s]:t})},j=a=>{const s=Array.from(a.target.files),t=s.reduce((i,w)=>i+w.size,0),m=20*1024*1024,l=["image/png","image/jpeg","application/pdf"],n=s.filter(i=>l.includes(i.type)?i.size>m?(o.fire("Hata",`${i.name} 20 MB'den büyük olamaz.`,"error"),!1):!0:(o.fire("Hata","Sadece PNG, JPG ve PDF formatları kabul edilmektedir.","error"),!1));if(n.length+c.length>5){o.fire("Hata","En fazla 5 dosya yükleyebilirsiniz.","error");return}if(t>m*n.length){o.fire("Hata","Toplam dosya boyutu 20 MB'yi geçemez.","error");return}d([...c,...n])},k=a=>{d(c.filter((s,t)=>t!==a))},v=async a=>{if(a.preventDefault(),!r.subject||!r.message){o.fire({icon:"error",title:"Hata",text:"Konu ve mesaj alanları zorunludur."});return}const s=P();try{const t=await Promise.all(c.map(async l=>{const n=D(z,`supportAttachments/${s}/${l.name}`),i=await F(n,l);return await S(i.ref)})),m=C(y,"supports",s);await H(m,{subject:r.subject,message:r.message,attachmentURLs:t,userId:h?h.uid:null,companyId:g,createdAt:new Date}),o.fire({icon:"success",title:"Başarılı",text:"Destek talebiniz başarıyla gönderildi."}),f({subject:"",message:""}),d([])}catch(t){o.fire({icon:"error",title:"Hata",text:"Destek talebi gönderilirken bir hata oluştu: "+t.message})}};return e.jsxs("div",{className:"max-w-2xl mx-auto p-6",children:[e.jsx("h2",{className:"text-2xl font-semibold text-gray-800",children:"Destek Talebi Gönder"}),e.jsxs("form",{onSubmit:v,children:[e.jsxs("div",{className:"mt-4",children:[e.jsx("label",{htmlFor:"subject",className:"block text-sm font-medium text-gray-700",children:"Konu"}),e.jsxs("select",{name:"subject",id:"subject",value:r.subject,onChange:p,required:!0,className:"mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm",children:[e.jsx("option",{value:"",disabled:!0,children:"Konu seçin"}),e.jsx("option",{value:"Firma Bilgilerimi Güncellemek İstiyorum",children:"Firma Bilgilerimi Güncellemek İstiyorum"}),e.jsx("option",{value:"Uyuşmazlık Çözümü",children:"Uyuşmazlık Çözümü"}),e.jsx("option",{value:"Teknik Destek",children:"Teknik Destek"}),e.jsx("option",{value:"Diğer",children:"Diğer"})]})]}),e.jsxs("div",{className:"mt-4",children:[e.jsx("label",{htmlFor:"message",className:"block text-sm font-medium text-gray-700",children:"Mesaj"}),e.jsx("textarea",{name:"message",id:"message",value:r.message,onChange:p,required:!0,rows:"6",className:"mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"})]}),e.jsxs("div",{className:"mt-4",children:[e.jsx("label",{htmlFor:"file",className:"block text-sm font-medium text-gray-700",children:"Ekler (Opsiyonel)"}),e.jsx("div",{className:"mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6",children:e.jsxs("div",{className:"space-y-1 text-center",children:[e.jsx("svg",{className:"mx-auto h-12 w-12 text-gray-400",stroke:"currentColor",fill:"none",viewBox:"0 0 48 48","aria-hidden":"true",children:e.jsx("path",{d:"M28 8H20a2 2 0 00-2 2v28a2 2 0 002 2h8a2 2 0 002-2V10a2 2 0 00-2-2zm-2 32H22V12h4v28zM12 6h24v4H12V6zm0 32h24v4H12v-4z",fill:"currentColor"})}),c.length>0?e.jsx("div",{className:"mt-2 flex flex-col items-center justify-center",children:c.map((a,s)=>e.jsxs("div",{className:"flex items-center justify-between w-full",children:[e.jsx("span",{className:"text-sm text-gray-500",children:a.name}),e.jsx("button",{type:"button",onClick:()=>k(s),className:"text-red-500",children:"Kaldır"})]},s))}):e.jsx("div",{children:e.jsxs("div",{className:"flex text-sm text-gray-600",children:[e.jsxs("label",{htmlFor:"file-upload",className:"relative cursor-pointer rounded-md bg-white font-medium text-sky-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-sky-500",children:[e.jsx("span",{children:"Dosya yükleyin veya sürükleyin"}),e.jsx("input",{id:"file-upload",name:"file-upload",type:"file",onChange:j,className:"sr-only",multiple:!0})]}),e.jsx("p",{className:"pl-1",children:"PNG, JPG, PDF up to 20MB, max 5 files"})]})})]})})]}),e.jsx("div",{className:"mt-6",children:e.jsx("button",{type:"submit",className:"inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",children:"Gönder"})})]})]})}export{E as default};
