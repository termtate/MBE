(function(){"use strict";var e={1581:function(e,t,o){var n=o(5130),r=o(6768);const a={id:"app"},l={key:0},i={key:1};function d(e,t,o,n,d,u){const s=(0,r.g2)("router-link"),c=(0,r.g2)("router-view");return(0,r.uX)(),(0,r.CE)("div",a,[d.isLoggedIn?((0,r.uX)(),(0,r.CE)("nav",l,[(0,r.Lk)("ul",null,[(0,r.Lk)("li",null,[(0,r.bF)(s,{to:"/protected"},{default:(0,r.k6)((()=>[(0,r.eW)("Protected")])),_:1})]),(0,r.Lk)("li",null,[(0,r.bF)(s,{to:"/add-item"},{default:(0,r.k6)((()=>[(0,r.eW)("Add Item")])),_:1})]),(0,r.Lk)("li",null,[(0,r.bF)(s,{to:"/get-items"},{default:(0,r.k6)((()=>[(0,r.eW)("Get Items")])),_:1})]),(0,r.Lk)("li",null,[(0,r.bF)(s,{to:"/update-item"},{default:(0,r.k6)((()=>[(0,r.eW)("Update Item")])),_:1})]),(0,r.Lk)("li",null,[(0,r.bF)(s,{to:"/delete-item"},{default:(0,r.k6)((()=>[(0,r.eW)("Delete Item")])),_:1})]),(0,r.Lk)("li",null,[(0,r.Lk)("a",{href:"#",onClick:t[0]||(t[0]=(...e)=>u.logout&&u.logout(...e))},"Logout")])])])):((0,r.uX)(),(0,r.CE)("nav",i,[(0,r.Lk)("ul",null,[(0,r.Lk)("li",null,[(0,r.bF)(s,{to:"/register"},{default:(0,r.k6)((()=>[(0,r.eW)("Register")])),_:1})]),(0,r.Lk)("li",null,[(0,r.bF)(s,{to:"/login"},{default:(0,r.k6)((()=>[(0,r.eW)("Login")])),_:1})])])])),(0,r.bF)(c)])}o(4114);var u={name:"App",data(){return{isLoggedIn:!!localStorage.getItem("token")}},watch:{$route(){this.isLoggedIn=!!localStorage.getItem("token")}},methods:{logout(){localStorage.removeItem("token"),this.isLoggedIn=!1,this.$router.push("/login")}}},s=o(1241);const c=(0,s.A)(u,[["render",d]]);var m=c,p=o(1387);const h=(0,r.Lk)("h2",null,"Add Item",-1),f=(0,r.Lk)("button",{type:"submit"},"Add Item",-1);function g(e,t,o,a,l,i){return(0,r.uX)(),(0,r.CE)("div",null,[h,(0,r.Lk)("form",{onSubmit:t[3]||(t[3]=(0,n.D$)(((...e)=>i.addItem&&i.addItem(...e)),["prevent"]))},[(0,r.bo)((0,r.Lk)("input",{"onUpdate:modelValue":t[0]||(t[0]=e=>l.text=e),placeholder:"Text"},null,512),[[n.Jo,l.text]]),(0,r.bo)((0,r.Lk)("input",{"onUpdate:modelValue":t[1]||(t[1]=e=>l.embedding=e),placeholder:"Embedding (comma separated)"},null,512),[[n.Jo,l.embedding]]),(0,r.bo)((0,r.Lk)("input",{"onUpdate:modelValue":t[2]||(t[2]=e=>l.vector=e),placeholder:"Vector (comma separated)"},null,512),[[n.Jo,l.vector]]),f],32)])}var k=o(4373),b={data(){return{text:"",embedding:"",vector:""}},methods:{async addItem(){try{const e=localStorage.getItem("token");await k.A.post("http://127.0.0.1:5000/items",{text:this.text,embedding:this.embedding.split(",").map(Number),vector:this.vector.split(",").map(Number)},{headers:{Authorization:`Bearer ${e}`}}),alert("Item added!")}catch(e){console.error("Error adding item:",e),alert("Failed to add item.")}}}};const v=(0,s.A)(b,[["render",g]]);var L=v,I=o(4232);const y=(0,r.Lk)("h2",null,"Items",-1),w={key:0};function E(e,t,o,n,a,l){return(0,r.uX)(),(0,r.CE)("div",null,[y,(0,r.Lk)("button",{onClick:t[0]||(t[0]=(...e)=>l.fetchItems&&l.fetchItems(...e))},"Fetch Items"),a.items?((0,r.uX)(),(0,r.CE)("div",w,[(0,r.Lk)("pre",null,(0,I.v_)(a.items),1)])):(0,r.Q3)("",!0)])}var A={data(){return{items:null}},methods:{async fetchItems(){try{const e=localStorage.getItem("token"),t=await k.A.get("http://127.0.0.1:5000/items",{headers:{Authorization:`Bearer ${e}`}});this.items=t.data}catch(e){console.error("Error fetching items:",e),alert("Failed to fetch items.")}}}};const S=(0,s.A)(A,[["render",E]]);var x=S;const C=(0,r.Lk)("h2",null,"Update Item",-1),_=(0,r.Lk)("button",{type:"submit"},"Update Item",-1);function U(e,t,o,a,l,i){return(0,r.uX)(),(0,r.CE)("div",null,[C,(0,r.Lk)("form",{onSubmit:t[4]||(t[4]=(0,n.D$)(((...e)=>i.updateItem&&i.updateItem(...e)),["prevent"]))},[(0,r.bo)((0,r.Lk)("input",{"onUpdate:modelValue":t[0]||(t[0]=e=>l.id=e),placeholder:"Item ID"},null,512),[[n.Jo,l.id]]),(0,r.bo)((0,r.Lk)("input",{"onUpdate:modelValue":t[1]||(t[1]=e=>l.text=e),placeholder:"Text"},null,512),[[n.Jo,l.text]]),(0,r.bo)((0,r.Lk)("input",{"onUpdate:modelValue":t[2]||(t[2]=e=>l.embedding=e),placeholder:"Embedding (comma separated)"},null,512),[[n.Jo,l.embedding]]),(0,r.bo)((0,r.Lk)("input",{"onUpdate:modelValue":t[3]||(t[3]=e=>l.vector=e),placeholder:"Vector (comma separated)"},null,512),[[n.Jo,l.vector]]),_],32)])}var F={data(){return{id:"",text:"",embedding:"",vector:""}},methods:{async updateItem(){try{const e=localStorage.getItem("token");await k.A.put(`http://127.0.0.1:5000/items/${this.id}`,{text:this.text,embedding:this.embedding.split(",").map(Number),vector:this.vector.split(",").map(Number)},{headers:{Authorization:`Bearer ${e}`}}),alert("Item updated!")}catch(e){console.error("Error updating item:",e),alert("Failed to update item.")}}}};const $=(0,s.A)(F,[["render",U]]);var O=$;const D=(0,r.Lk)("h2",null,"Delete Item",-1),V=(0,r.Lk)("button",{type:"submit"},"Delete Item",-1);function J(e,t,o,a,l,i){return(0,r.uX)(),(0,r.CE)("div",null,[D,(0,r.Lk)("form",{onSubmit:t[1]||(t[1]=(0,n.D$)(((...e)=>i.deleteItem&&i.deleteItem(...e)),["prevent"]))},[(0,r.bo)((0,r.Lk)("input",{"onUpdate:modelValue":t[0]||(t[0]=e=>l.id=e),placeholder:"Item ID"},null,512),[[n.Jo,l.id]]),V],32)])}var P={data(){return{id:""}},methods:{async deleteItem(){try{const e=localStorage.getItem("token");await k.A.delete(`http://127.0.0.1:5000/items/${this.id}`,{headers:{Authorization:`Bearer ${e}`}}),alert("Item deleted!")}catch(e){console.error("Error deleting item:",e),alert("Failed to delete item.")}}}};const X=(0,s.A)(P,[["render",J]]);var j=X;const T=(0,r.Lk)("h2",null,"Register",-1),R=(0,r.Lk)("button",{type:"submit"},"Register",-1);function W(e,t,o,a,l,i){return(0,r.uX)(),(0,r.CE)("div",null,[T,(0,r.Lk)("form",{onSubmit:t[2]||(t[2]=(0,n.D$)(((...e)=>i.register&&i.register(...e)),["prevent"]))},[(0,r.bo)((0,r.Lk)("input",{"onUpdate:modelValue":t[0]||(t[0]=e=>l.username=e),placeholder:"Username"},null,512),[[n.Jo,l.username]]),(0,r.bo)((0,r.Lk)("input",{"onUpdate:modelValue":t[1]||(t[1]=e=>l.password=e),type:"password",placeholder:"Password"},null,512),[[n.Jo,l.password]]),R],32)])}var z={data(){return{username:"",password:""}},methods:{async register(){try{await k.A.post("http://127.0.0.1:5000/register",{username:this.username,password:this.password}),alert("Registration successful!")}catch(e){console.error("Registration error:",e),alert("Registration failed.")}}}};const B=(0,s.A)(z,[["render",W]]);var N=B;const M=(0,r.Lk)("h2",null,"Login",-1),G=(0,r.Lk)("label",{for:"username"},"Username:",-1),Q=(0,r.Lk)("label",{for:"password"},"Password:",-1),q=(0,r.Lk)("button",{type:"submit"},"Login",-1);function H(e,t,o,a,l,i){return(0,r.uX)(),(0,r.CE)("div",null,[M,(0,r.Lk)("form",{onSubmit:t[2]||(t[2]=(0,n.D$)(((...e)=>i.login&&i.login(...e)),["prevent"]))},[(0,r.Lk)("div",null,[G,(0,r.bo)((0,r.Lk)("input",{"onUpdate:modelValue":t[0]||(t[0]=e=>l.username=e),type:"text",id:"username"},null,512),[[n.Jo,l.username]])]),(0,r.Lk)("div",null,[Q,(0,r.bo)((0,r.Lk)("input",{"onUpdate:modelValue":t[1]||(t[1]=e=>l.password=e),type:"password",id:"password"},null,512),[[n.Jo,l.password]])]),q],32)])}var K={data(){return{username:"",password:""}},methods:{async login(){const e=await fetch("/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:this.username,password:this.password})});if(e.ok){const t=await e.json();localStorage.setItem("token",t.access_token),this.$router.push("/protected")}else alert("Login failed")}}};const Y=(0,s.A)(K,[["render",H]]);var Z=Y;const ee=(0,r.Lk)("h2",null,"Protected Resource",-1),te={key:0};function oe(e,t,o,n,a,l){return(0,r.uX)(),(0,r.CE)("div",null,[ee,(0,r.Lk)("button",{onClick:t[0]||(t[0]=(...e)=>l.fetchProtectedData&&l.fetchProtectedData(...e))},"Fetch Protected Data"),a.data?((0,r.uX)(),(0,r.CE)("div",te,[(0,r.Lk)("pre",null,(0,I.v_)(a.data),1)])):(0,r.Q3)("",!0)])}var ne={data(){return{data:null}},created(){localStorage.getItem("token")||this.$router.push("/login")},methods:{async fetchProtectedData(){const e=localStorage.getItem("token"),t=await fetch("/protected",{method:"GET",headers:{Authorization:`Bearer ${e}`}});t.ok?this.data=await t.json():alert("Failed to fetch protected data.")}}};const re=(0,s.A)(ne,[["render",oe]]);var ae=re;function le(e,t,o){localStorage.getItem("token")?o():o("/login")}const ie=(0,p.aE)({history:(0,p.LA)(),routes:[{path:"/",redirect:"/login"},{path:"/register",component:N},{path:"/login",component:Z},{path:"/protected",component:ae,beforeEnter:le},{path:"/add-item",component:L,beforeEnter:le},{path:"/get-items",component:x,beforeEnter:le},{path:"/update-item",component:O,beforeEnter:le},{path:"/delete-item",component:j,beforeEnter:le}]});var de=ie;(0,n.Ef)(m).use(de).mount("#app")}},t={};function o(n){var r=t[n];if(void 0!==r)return r.exports;var a=t[n]={exports:{}};return e[n].call(a.exports,a,a.exports,o),a.exports}o.m=e,function(){var e=[];o.O=function(t,n,r,a){if(!n){var l=1/0;for(s=0;s<e.length;s++){n=e[s][0],r=e[s][1],a=e[s][2];for(var i=!0,d=0;d<n.length;d++)(!1&a||l>=a)&&Object.keys(o.O).every((function(e){return o.O[e](n[d])}))?n.splice(d--,1):(i=!1,a<l&&(l=a));if(i){e.splice(s--,1);var u=r();void 0!==u&&(t=u)}}return t}a=a||0;for(var s=e.length;s>0&&e[s-1][2]>a;s--)e[s]=e[s-1];e[s]=[n,r,a]}}(),function(){o.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return o.d(t,{a:t}),t}}(),function(){o.d=function(e,t){for(var n in t)o.o(t,n)&&!o.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})}}(),function(){o.g=function(){if("object"===typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"===typeof window)return window}}()}(),function(){o.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)}}(),function(){o.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}}(),function(){var e={524:0};o.O.j=function(t){return 0===e[t]};var t=function(t,n){var r,a,l=n[0],i=n[1],d=n[2],u=0;if(l.some((function(t){return 0!==e[t]}))){for(r in i)o.o(i,r)&&(o.m[r]=i[r]);if(d)var s=d(o)}for(t&&t(n);u<l.length;u++)a=l[u],o.o(e,a)&&e[a]&&e[a][0](),e[a]=0;return o.O(s)},n=self["webpackChunkrag_system_frontend"]=self["webpackChunkrag_system_frontend"]||[];n.forEach(t.bind(null,0)),n.push=t.bind(null,n.push.bind(n))}();var n=o.O(void 0,[504],(function(){return o(1581)}));n=o.O(n)})();
//# sourceMappingURL=app.d2108047.js.map