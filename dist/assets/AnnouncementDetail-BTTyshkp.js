import{B as i,r as c,d,I as x,f as m,j as e,U as u,V as h}from"./index-Pf0wcubd.js";const j=()=>{const{id:n}=i(),[t,o]=c.useState(null);c.useEffect(()=>{l()},[n]);const l=async()=>{try{const s=d(x,"announcements",n),r=await m(s);if(r.exists()){const a=r.data();o({...a,date:a.createdAt?a.createdAt.toDate().toLocaleDateString("tr-TR"):"Tarih bilinmiyor"})}else console.log("No such document!")}catch(s){console.error("Duyuru verisi alınırken bir hata oluştu:",s)}};return t?e.jsxs(e.Fragment,{children:[e.jsx(u,{}),e.jsx("div",{className:"bg-white px-6 py-12 lg:px-8",children:e.jsxs("div",{className:"mx-auto max-w-3xl text-base leading-7 text-gray-700",children:[e.jsxs("div",{className:"mx-auto max-w-2xl text-center",children:[e.jsx("h1",{className:"mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl",children:t.title}),e.jsx("div",{className:"mt-2 text-sm text-gray-500",children:e.jsxs("p",{children:["Tarih: ",e.jsx("span",{className:"font-medium",children:t.date})]})}),e.jsx("figure",{className:"mt-8",children:e.jsx("img",{alt:"Kapak Görseli",src:t.coverImageUrl,className:"aspect-video rounded-xl bg-gray-50 object-cover"})})]}),e.jsx("div",{className:"mt-6 text-xl leading-8",children:e.jsx("div",{dangerouslySetInnerHTML:{__html:t.content}})})]})}),e.jsx(h,{})]}):e.jsx("div",{children:"Yükleniyor..."})};export{j as default};