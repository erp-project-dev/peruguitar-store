(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,26735,e=>{"use strict";var r=e.i(43476),t=e.i(59368);function n(){let e=t.SettingGetCommand.handle().publishNumber;return(0,r.jsxs)("form",{onSubmit:r=>{r.preventDefault();let t=r.currentTarget;if(!t.reportValidity())return;let n=t.elements.namedItem("merchantName").value,o=t.elements.namedItem("productName").value,a=t.elements.namedItem("productPrice").value,i=`
Hola, te escribe *${n}*. Deseo publicar un instrumento en Peru Guitar.

• *Modelo:* ${o}  
• *Precio:* S/ ${a}

Confirmo que mi instrumento cumple con los criterios de exclusividad de Peru Guitar  
(_gama alta, boutique, rareza o modelo rebuscado_).

Quedo atento(a) a tus indicaciones para continuar.
    `.trim(),u=`https://wa.me/${e}?text=${encodeURIComponent(i)}`;window.open(u,"_blank")},className:"space-y-6",children:[(0,r.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[(0,r.jsx)("input",{name:"merchantName",type:"text",placeholder:"Tu nombre completo",required:!0,maxLength:100,className:"w-full px-4 py-4 bg-white border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-gray-600 md:col-span-2"}),(0,r.jsx)("input",{name:"productName",type:"text",placeholder:"Nombre del instrumento",required:!0,maxLength:100,className:"w-full px-4 py-4 bg-white border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-gray-600"}),(0,r.jsx)("input",{name:"productPrice",type:"number",placeholder:"Precio (S/)",required:!0,maxLength:6,className:"w-full px-4 py-4 bg-white border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-gray-600"})]}),(0,r.jsx)("button",{type:"submit",className:"block w-full text-center bg-green-600 hover:bg-green-700 transition px-6 py-3 rounded-xl text-lg font-medium text-white cursor-pointer",children:"Contactar por WhatsApp"})]})}e.s(["default",()=>n])}]);