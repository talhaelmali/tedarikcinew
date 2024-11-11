import{r,g as G,B as J,u as K,G as L,l as U,o as Z,D as Q,J as T,h as y,K as V,j as e,S as W,f as M,d as O,i as X,O as A}from"./index-DFtkyR6U.js";import{O as ee}from"./OrderDetailsModal-qeUftjwA.js";import{F as N}from"./StarIcon-Bty82P9t.js";import"./index-B9cPBpaU.js";function se({title:o,titleId:l,...i},h){return r.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"currentColor","aria-hidden":"true","data-slot":"icon",ref:h,"aria-labelledby":l},i),o?r.createElement("title",{id:l},o):null,r.createElement("path",{d:"M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z"}))}const te=r.forwardRef(se),u=G(),oe=()=>{const{orderId:o,companyId1:l,companyId2:i}=J(),h=K(),{company:c}=L(),[E,I]=r.useState([]),[f,b]=r.useState(""),[j,R]=r.useState(!1),[x,$]=r.useState(null),[v,k]=r.useState(""),[p,S]=r.useState(null),[z,C]=r.useState(!1),g=`${o}_${l}_${i}`;let D="";r.useEffect(()=>{const s=U(),t=Z(s,a=>{if(!a)h("/login");else if(c){const n=c.id;n===l||n===i?(R(!0),D=n===l?i:l,F(D)):W.fire({icon:"error",title:"Erişim Engellendi",text:"Bu sohbete erişim yetkiniz bulunmamaktadır."}).then(()=>h("/dashboard"))}else return});return()=>t()},[c,h,l,i]);const F=async s=>{if(!s)return;const t=await M(O(u,"companies",s));if(t.exists()){const a=t.data();k(a.companyName),P(s)}else console.error("Company not found")},P=async s=>{const t=y(u,"companies",s,"ratings"),a=await X(t);if(a.empty)S("N/A");else{let n=0,d=0;a.forEach(w=>{const m=w.data(),Y=(m.communication+m.quality+m.speed)/3;n+=Y,d++}),S((n/d).toFixed(1))}};r.useEffect(()=>{(async()=>{const t=O(u,"orders",o),a=await M(t);a.exists()?$(a.data()):console.error("Order not found")})()},[o]),r.useEffect(()=>{if(!j)return;const s=Q(y(u,"chats",g,"messages"),T("createdAt","asc")),t=V(s,a=>{const n=[];a.forEach(d=>{n.push({id:d.id,...d.data()})}),I(n)});return()=>t()},[g,j]);const B=async()=>{if(f.trim()==="")return;await A(y(u,"chats",g,"messages"),{chatId:g,userId:c.id,userName:c.companyName,message:f,createdAt:new Date});let s=c.id===l?i:l;const t=`Yeni bir mesaj aldınız: ${f.substring(0,20)}...`;await A(y(u,"notifications"),{companyId:s,message:t,route:`/chat/${o}/${l}/${i}`,read:!1,timestamp:new Date,type:"Mesaj"}),b("")},H=()=>{C(!0)},_=()=>{C(!1)},q=s=>{const a=Math.floor(s),n=s%1!==0,d=5-a-(n?1:0);return e.jsxs("div",{className:"flex",children:[[...Array(a)].map((w,m)=>e.jsx(N,{className:"h-5 w-5 text-yellow-500"},m)),n&&e.jsx(N,{className:"h-5 w-5 text-gray-300"},"half-star"),[...Array(d)].map((w,m)=>e.jsx(N,{className:"h-5 w-5 text-gray-300"},m))]})};return j?e.jsxs("div",{className:"flex flex-col h-full bg-white border",children:[e.jsx("div",{className:"bg-white shadow p-4 flex justify-between items-center",children:e.jsxs("div",{className:"flex items-center",children:[e.jsx("img",{className:"h-10 w-10 rounded-full",src:"https://firebasestorage.googleapis.com/v0/b/ihale-6cb24.appspot.com/o/profilepic.svg?alt=media&token=b85d5d31-8627-48b9-9691-335d0d58329e",alt:"Profile"}),e.jsxs("div",{className:"ml-4",children:[e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsx("h3",{className:"text-lg font-bold text-gray-900",children:v}),e.jsxs("div",{className:"flex items-center space-x-1 bg-gray-200 p-1 rounded",children:[p!=="N/A"&&e.jsxs(e.Fragment,{children:[q(p),e.jsx("span",{className:"text-sm font-medium text-gray-600",children:p})]}),p==="N/A"&&e.jsx("span",{className:"text-sm font-medium text-gray-600",children:"Puanlanmadı"})]})]}),e.jsxs("p",{className:"text-sm text-gray-500",children:["@",v.split(" ").map(s=>s[0]+"****").join(" ")]})]})]})}),x&&e.jsxs("div",{className:"bg-white shadow p-4 flex justify-between items-center mt-4",children:[e.jsx("div",{className:"flex items-center",children:e.jsxs("div",{className:"ml-4",children:[e.jsxs("h3",{className:"text-lg font-bold text-gray-900",children:["Sipariş İlan Adı: ",x.ad.title]}),e.jsxs("p",{className:"text-sm text-gray-500",children:["Sipariş İçeriği: ",x.ad.content]}),e.jsxs("p",{className:"text-sm text-gray-600",children:["Sipariş ID: ",o]})]})}),e.jsx("button",{onClick:H,className:"bg-blue-600 text-white px-4 py-2 rounded-md",children:"Sipariş Detaylarını Göster"})]}),e.jsx("div",{className:"bg-white shadow p-4 text-lg font-semibold text-gray-900",children:"Mesajlaşma"}),e.jsx("div",{className:"flex-1 overflow-y-auto p-4",style:{maxHeight:"30vh",overflowY:"scroll"},children:E.map((s,t)=>e.jsxs("div",{className:`p-4 my-2 rounded-lg max-w-[45%] ${s.userId===c.id?"bg-green-100 self-end ml-auto":"bg-gray-100 self-start mr-auto"}`,children:[e.jsx("p",{children:s.message}),e.jsx("p",{className:"text-xs text-gray-500 mt-2",children:new Date(s.createdAt.seconds*1e3).toLocaleString()})]},t))}),e.jsxs("div",{className:"bg-white p-4 shadow flex items-center rounded-full",children:[e.jsx("input",{type:"text",value:f,onChange:s=>b(s.target.value),placeholder:"Mesajınızı yazın...",className:"flex-1 p-2 border border-gray-300 rounded-full pl-4 focus:outline-none"}),e.jsx("button",{onClick:B,className:"bg-blue-600 text-white px-4 py-4 rounded-full flex items-center justify-center ml-2",children:e.jsx(te,{className:"h-5 w-5 transform"})})]}),z&&x&&e.jsx(ee,{order:x,closeModal:_})]}):e.jsx("div",{className:"flex justify-center items-center h-screen",children:"Yükleniyor..."})};export{oe as default};