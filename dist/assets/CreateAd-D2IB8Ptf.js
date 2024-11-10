import{r as i,u as $,G as H,k as G,j as e,M as Q,D as V,F as _,h as v,i as W,S as h,a as J,b as X,c as Y,N as Z,O as ee,I as w}from"./index-Dcbjm_y_.js";import{S}from"./react-select.esm-Dy9iw_O8.js";const ae=Q();function ne(){const[m,y]=i.useState(null),[D,T]=i.useState(!0),[C,F]=i.useState([]),[c,f]=i.useState([]),[u,b]=i.useState([]),B=$(),[te,q]=i.useState(""),{company:o,loading:U}=H(),[s,x]=i.useState({title:"",content:"",sectors:[],dueDate:"",duration:"3",paymentMethod:"",maxBid:"",requestSample:!1,adType:"",quantity:"",unit:""});i.useEffect(()=>{const t=G.onAuthStateChanged(a=>{y(a||null)});return()=>t()},[]),i.useEffect(()=>{(async()=>{if(m){const a=V(v(w,"sectors"),_("type","==","Alt Sektör")),n=(await W(a)).docs.map(r=>({value:r.data().name,label:r.data().name}));F(n),T(!1)}})()},[m]);const I=t=>t.replace(/\D/g,"").replace(/\B(?=(\d{3})+(?!\d))/g,"."),j=t=>{const{name:a,value:l}=t.target;x({...s,[a]:I(l)})},d=t=>{const{name:a,value:l,type:n,checked:r,files:p}=t.target;n==="file"?A(p):x({...s,[a]:n==="checkbox"?r:l})},A=t=>{const a=Array.from(t).slice(0,5-c.length),l=a.map(n=>URL.createObjectURL(n));f([...c,...l]),b([...u,...a])},O=t=>{const a=c.filter((n,r)=>r!==t),l=u.filter((n,r)=>r!==t);f(a),b(l)},E=t=>{x({...s,sectors:t.map(a=>a.value)})},L=t=>{x({...s,unit:t.value})},z=async t=>{if(t.preventDefault(),!s.adType){q("Lütfen bir teklif tipi seçiniz."),h.fire({icon:"error",title:"Hata",text:"Lütfen bir teklif tipi seçiniz."});return}if(!o||!o.isBuyer||o.isBuyerConfirmed!=="yes"){h.fire({icon:"error",title:"Erişim Engellendi",text:"İlan oluşturabilmek için alıcı olarak onaylanmış olmalısınız."});return}try{const a=new Date(s.dueDate);a.setHours(0,0,0,0);let l=[];u.length>0&&(l=await Promise.all(u.map(async(N,R)=>{const k=J(ae,`ads/${m.uid}/${R}-${N.name}`);return await X(k,N),await Y(k)})));const n=s.maxBid.replace(/[.]/g,""),r=s.quantity.replace(/[.]/g,""),p=new Date,P=parseInt(s.duration),g=new Date(p);g.setDate(g.getDate()+P);const K={...s,maxBid:n,quantity:r,images:l,userId:m.uid,companyId:o.id,dueDate:a,createdAt:Z(),endDate:g};await ee(v(w,"companies",o.id,"ads"),K),h.fire({icon:"success",title:"Başarılı",text:"İlan başarıyla oluşturuldu."}).then(()=>{B("/dashboard")})}catch(a){h.fire({icon:"error",title:"Hata",text:"İlan oluşturulurken bir hata oluştu: "+a.message})}};if(D||U)return e.jsx("div",{children:"Loading..."});if(!o||!o.isBuyer||o.isBuyerConfirmed!=="yes")return e.jsx("div",{children:"İlan oluşturmak için alıcı olarak onaylanmış olmalısınız."});const M=[{value:"Adet",label:"Adet"},{value:"Kilo",label:"Kilo"},{value:"Paket",label:"Paket"}];return e.jsxs("div",{className:"max-w-4xl mx-auto mb-20",children:[e.jsx("h2",{className:"text-lg font-medium leading-6 text-gray-900",children:"İlan Detayları"}),e.jsx("p",{className:"mt-1 text-sm text-gray-500",children:"Oluşturmak istediğiniz ilanın detaylarını giriniz."}),e.jsxs("form",{onSubmit:z,children:[e.jsxs("div",{className:"mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-4 sm:gap-x-6",children:[e.jsxs("div",{className:"sm:col-span-4 grid grid-cols-1 sm:gap-x-6 sm:grid-cols-2",children:[e.jsxs("div",{className:"sm:col-span-1",children:[e.jsxs("div",{className:"",children:[e.jsx("label",{htmlFor:"title",className:"block text-sm font-medium text-gray-700",children:"İlan Başlığı"}),e.jsx("input",{type:"text",name:"title",id:"title",value:s.title,onChange:d,className:"mt-1 block w-full rounded-md border-gray-300 shadow-sm"})]}),e.jsxs("div",{className:"",children:[e.jsx("label",{htmlFor:"content",className:"block text-sm font-medium text-gray-700",children:"İlan İçeriği"}),e.jsx("textarea",{name:"content",id:"content",value:s.content,onChange:d,rows:4,className:"mt-1 block w-full rounded-md border-gray-300 shadow-sm"})]})]}),e.jsxs("div",{className:"sm:col-span-1",children:[e.jsx("label",{htmlFor:"images",className:"block text-sm font-medium text-gray-700",children:"Görseller (Maksimum 5 adet)"}),e.jsxs("div",{className:"mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6",children:[e.jsx("input",{type:"file",name:"images",id:"images",accept:"image/*",multiple:!0,onChange:d,className:"hidden"}),e.jsx("label",{htmlFor:"images",className:"cursor-pointer",children:e.jsx("span",{children:"Birden fazla dosya yükleyin veya sürükleyin"})})]}),c.length>0&&e.jsx("div",{className:"mt-4 grid grid-cols-2 gap-2",children:c.map((t,a)=>e.jsxs("div",{className:"relative",children:[e.jsx("img",{src:t,alt:`Uploaded ${a}`,className:"w-full h-auto rounded-md"}),e.jsx("button",{type:"button",onClick:()=>O(a),className:"absolute top-0 right-0 bg-red-600 text-white p-1 rounded-full",children:"×"})]},a))})]})]}),e.jsxs("div",{className:"sm:col-span-4",children:[e.jsx("label",{htmlFor:"sectors",className:"block text-sm font-medium text-gray-700",children:"Sektör Seçimi"}),e.jsx(S,{isMulti:!0,name:"sectors",options:C,className:"mt-1 block w-full rounded-md border-gray-300 shadow-sm",classNamePrefix:"select",required:!0,onChange:E})]}),e.jsxs("div",{className:"sm:col-span-1",children:[e.jsx("label",{htmlFor:"dueDate",className:"block text-sm font-medium text-gray-700",children:"Termin Tarihi"}),e.jsx("input",{type:"date",name:"dueDate",id:"dueDate",min:new Date().toISOString().split("T")[0],value:s.dueDate,onChange:d,className:"mt-1 block w-full rounded-md border-gray-300 shadow-sm"})]}),e.jsxs("div",{className:"sm:col-span-1",children:[e.jsx("label",{htmlFor:"duration",className:"block text-sm font-medium text-gray-700",children:"İlan Süresi"}),e.jsxs("select",{name:"duration",id:"duration",value:s.duration,onChange:d,className:"mt-1 block w-full rounded-md border-gray-300 shadow-sm",children:[e.jsx("option",{value:"3",children:"3 gün"}),e.jsx("option",{value:"7",children:"7 gün"}),e.jsx("option",{value:"15",children:"15 gün"}),e.jsx("option",{value:"30",children:"30 gün"})]})]}),e.jsxs("div",{className:"sm:col-span-1",children:[e.jsx("label",{htmlFor:"maxBid",className:"block text-sm font-medium text-gray-700",children:"Max Fiyat Teklifi (Opsiyonel)"}),e.jsx("input",{type:"text",name:"maxBid",id:"maxBid",value:s.maxBid,onChange:j,className:"mt-1 block w-full rounded-md border-gray-300 shadow-sm"})]}),e.jsxs("div",{className:"sm:col-span-1",children:[e.jsx("label",{htmlFor:"quantity",className:"block text-sm font-medium text-gray-700",children:"Adet"}),e.jsx("input",{type:"text",name:"quantity",id:"quantity",required:!0,value:s.quantity,onChange:j,className:"mt-1 block w-full rounded-md border-gray-300 shadow-sm"})]}),e.jsxs("div",{className:"sm:col-span-1",children:[e.jsx("label",{htmlFor:"unit",className:"block text-sm font-medium text-gray-700",children:"Birim"}),e.jsx(S,{name:"unit",options:M,required:!0,className:"mt-1 block w-full rounded-md border-gray-300 shadow-sm",classNamePrefix:"select",onChange:L})]}),e.jsx("div",{className:"sm:col-span-4",children:e.jsxs("div",{className:"flex items-start",children:[e.jsx("div",{className:"flex items-center h-5",children:e.jsx("input",{id:"requestSample",name:"requestSample",type:"checkbox",checked:s.requestSample,onChange:d,className:"h-4 w-4 text-sky-600 border-gray-300 rounded"})}),e.jsx("div",{className:"ml-3 text-sm",children:e.jsx("label",{htmlFor:"requestSample",className:"font-medium text-gray-700",children:"Numune talep ediyorum."})})]})}),e.jsxs("div",{className:"sm:col-span-4",children:[e.jsx("label",{htmlFor:"adType",className:"block text-sm font-medium text-gray-700",children:"Teklif Tipi Seç"}),e.jsxs("div",{className:"mt-2 space-y-2",children:[e.jsxs("div",{className:"flex items-center",children:[e.jsx("input",{id:"adType1",name:"adType",type:"radio",value:"Kapalı Usül Teklif",checked:s.adType==="Kapalı Usül Teklif",onChange:d,className:"h-4 w-4 text-sky-600 border-gray-300"}),e.jsx("label",{htmlFor:"adType1",className:"ml-3 block text-sm font-medium text-gray-700",children:"Kapalı Usül Teklif"})]}),e.jsxs("div",{className:"flex items-center",children:[e.jsx("input",{id:"adType2",name:"adType",type:"radio",value:"Açık Usül Teklif",checked:s.adType==="Açık Usül Teklif",onChange:d,className:"h-4 w-4 text-sky-600 border-gray-300"}),e.jsx("label",{htmlFor:"adType2",className:"ml-3 block text-sm font-medium text-gray-700",children:"Açık Usül Teklif"})]})]})]})]}),e.jsx("div",{className:"mt-6 text-right",children:e.jsx("button",{type:"submit",className:"inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-sky-500",children:"Oluştur"})})]})]})}export{ne as default};
