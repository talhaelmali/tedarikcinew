import{R as T,j as t,L as h}from"./index-DFtkyR6U.js";import{d as r}from"./dayjs.min-Cfwo7Ngx.js";import{r as k,d as A}from"./duration-BWaI6B3_.js";r.extend(k);r.extend(A);const L=T.memo(({ad:s})=>{const p=e=>e==="Kapalı Usül Teklif"?{className:"bg-yellow-100 text-yellow-800",text:"Kapalı Usül Teklif"}:e==="Açık Usül İhale"||e==="Açık Usül Teklif"?{className:"bg-green-100 text-green-800",text:"Açık Usül Teklif"}:{className:"bg-gray-100 text-gray-800",text:e},g=(e,n)=>{if(!e||!n)return null;let l;if(e.seconds)l=new Date(e.seconds*1e3);else if(e instanceof Date)l=new Date(e.getTime());else if(typeof e=="string")l=new Date(e);else return null;return l.setDate(l.getDate()+parseInt(n)),l},f=e=>{if(!e)return"Bilinmiyor";let n;if(e.seconds)n=r(e.seconds*1e3);else if(e instanceof Date)n=r(e.getTime());else if(typeof e=="string")n=r(e);else return"Bilinmiyor";const l=r(),u=n.diff(l);if(u<=0)return"İlan Süresi Doldu";const a=r.duration(u),b=Math.floor(a.asDays()),v=a.hours(),w=a.minutes();return`${b} gün ${v} saat ${w} dakika`},y=e=>e.length>100?e.substring(0,100)+"...":e,c=e=>e.length>30?e.substring(0,30)+"...":e,m=e=>e.length>3?[...e.slice(0,3),"..."]:e,x=s.images||"https://via.placeholder.com/150";let i;s.createdAt&&s.createdAt.seconds?i=r(s.createdAt.seconds*1e3):s.createdAt instanceof Date?i=r(s.createdAt.getTime()):typeof s.createdAt=="string"?i=r(s.createdAt):i=null;const N=i?i.fromNow():"Bilinmiyor",o=p(s.adType),j=s.endDate||g(s.createdAt,s.duration),d=f(j);return t.jsx("li",{className:"py-4",children:t.jsxs("div",{className:"border rounded-lg shadow-sm bg-white",children:[t.jsxs("div",{className:"hidden md:flex justify-between items-center p-4",children:[t.jsxs("div",{className:"flex",children:[t.jsx("img",{src:x,alt:s.title,className:"w-24 h-24 object-cover rounded-lg mr-4",onError:e=>{e.target.onerror=null,e.target.src="https://via.placeholder.com/150"}}),t.jsxs("div",{children:[t.jsx("div",{className:"flex items-center space-x-2",children:s.sectors&&m(s.sectors).map((e,n)=>t.jsx("span",{className:"bg-gray-100 text-gray-800 text-sm font-medium px-2 py-1 rounded max-w-[100px] truncate",title:e,children:e},n))}),t.jsxs("h3",{className:"text-sm font-medium text-gray-900",children:[t.jsx(h,{to:`/ad-details/${s.companyId}/${s.id}`,className:"hover:underline",children:c(s.title)}),t.jsxs("span",{className:"text-blue-600",children:[" #",s.id]})]}),t.jsx("p",{className:"text-sm text-gray-500 mt-1",children:y(s.content)})]})]}),t.jsxs("div",{className:"text-right",children:[t.jsxs("div",{className:"flex justify-end items-center gap-2",children:[t.jsx("span",{className:`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium ${o.className}`,children:o.text}),t.jsx("p",{className:"text-sm text-gray-500",children:N})]}),t.jsxs("div",{className:"mt-2 space-y-1",children:[s.requestSample&&t.jsx("div",{className:"inline-block bg-blue-800 text-white text-sm font-medium px-3 py-1 mr-2 rounded-md",children:"Numune Talep Ediyor"}),s.maxBid&&t.jsxs("div",{className:"inline-block bg-[#EE6F2D] text-white text-sm font-medium px-3 py-1 rounded-md",children:["Bütçe: ",new Intl.NumberFormat("tr-TR",{style:"currency",currency:"TRY"}).format(s.maxBid)]})]}),t.jsxs("p",{className:"text-sm text-gray-500 mt-2",children:[t.jsx("span",{className:"text-blue-600",children:"İlanın Bitimine:"})," ",d]})]})]}),t.jsx("div",{className:"md:hidden p-4",children:t.jsxs("div",{className:"flex items-center space-x-4",children:[t.jsx("img",{src:x,alt:s.title,className:"w-16 h-16 object-cover rounded-lg",onError:e=>{e.target.onerror=null,e.target.src="https://via.placeholder.com/150"}}),t.jsxs("div",{className:"flex-1",children:[t.jsxs("h3",{className:"text-sm font-medium text-gray-900",children:[t.jsx(h,{to:`/ad-details/${s.companyId}/${s.id}`,className:"hover:underline",children:c(s.title)}),t.jsxs("span",{className:"text-blue-600",children:[" #",s.id]})]}),t.jsx("div",{className:"flex flex-wrap gap-1 mt-1",children:s.sectors&&m(s.sectors).map((e,n)=>t.jsx("span",{className:"bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 rounded truncate",title:e,children:e},n))}),t.jsxs("div",{className:"flex flex-wrap gap-2 mt-2",children:[s.requestSample&&t.jsx("span",{className:"bg-blue-800 text-white text-xs font-medium px-2 py-1 rounded-md",children:"Numune Talep Ediyor"}),s.maxBid&&t.jsxs("span",{className:"bg-[#EE6F2D] text-white text-xs font-medium px-2 py-1 rounded-md",children:["Bütçe: ",new Intl.NumberFormat("tr-TR",{style:"currency",currency:"TRY"}).format(s.maxBid)]})]}),t.jsxs("p",{className:"text-xs text-gray-500 mt-2",children:[t.jsx("span",{className:"text-blue-600",children:"İlanın Bitimine:"})," ",d]})]})]})})]})},s.id)});export{L as A};