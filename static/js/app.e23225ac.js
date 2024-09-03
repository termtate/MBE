(function(){"use strict";var e={9313:function(e,t,a){var s=a(5130),o=a(6768),r=a(4232);const n={id:"app"},l={key:0},i={key:1};function d(e,t,a,s,d,c){const u=(0,o.g2)("router-link"),h=(0,o.g2)("router-view");return(0,o.uX)(),(0,o.CE)("div",n,[(0,o.Lk)("div",{class:"hotspot",onMouseenter:t[0]||(t[0]=(...e)=>c.showNav&&c.showNav(...e)),onMouseleave:t[1]||(t[1]=(...e)=>c.delayedHideNav&&c.delayedHideNav(...e))},null,32),d.isLoggedIn?((0,o.uX)(),(0,o.CE)("nav",{key:0,onMouseenter:t[3]||(t[3]=(...e)=>c.cancelHideNav&&c.cancelHideNav(...e)),onMouseleave:t[4]||(t[4]=(...e)=>c.delayedHideNav&&c.delayedHideNav(...e)),class:(0,r.C4)({visible:d.navVisible})},[(0,o.Lk)("ul",null,[d.isAdmin?((0,o.uX)(),(0,o.CE)("li",l,[(0,o.bF)(u,{to:"/user-management"},{default:(0,o.k6)((()=>[(0,o.eW)("User Management")])),_:1})])):(0,o.Q3)("",!0),d.isAdmin?((0,o.uX)(),(0,o.CE)("li",i,[(0,o.bF)(u,{to:"/data-management"},{default:(0,o.k6)((()=>[(0,o.eW)("Data Management")])),_:1})])):(0,o.Q3)("",!0),(0,o.Lk)("li",null,[(0,o.bF)(u,{to:"/chat"},{default:(0,o.k6)((()=>[(0,o.eW)("Chat")])),_:1})]),(0,o.Lk)("li",null,[(0,o.Lk)("a",{href:"#",onClick:t[2]||(t[2]=(...e)=>c.logout&&c.logout(...e))},"Logout")])])],34)):((0,o.uX)(),(0,o.CE)("nav",{key:1,onMouseenter:t[5]||(t[5]=(...e)=>c.cancelHideNav&&c.cancelHideNav(...e)),onMouseleave:t[6]||(t[6]=(...e)=>c.delayedHideNav&&c.delayedHideNav(...e)),class:(0,r.C4)({visible:d.navVisible})},[(0,o.Lk)("ul",null,[(0,o.Lk)("li",null,[(0,o.bF)(u,{to:"/register"},{default:(0,o.k6)((()=>[(0,o.eW)("Register")])),_:1})]),(0,o.Lk)("li",null,[(0,o.bF)(u,{to:"/login"},{default:(0,o.k6)((()=>[(0,o.eW)("Login")])),_:1})])])],34)),(0,o.bF)(h)])}a(4114),a(4979);var c={data(){return{navVisible:!1,isLoggedIn:!!localStorage.getItem("token"),isAdmin:!1,hideTimeout:null}},watch:{$route(){this.updateAuthStatus()}},methods:{showNav(){this.navVisible=!0,this.hideTimeout&&(clearTimeout(this.hideTimeout),this.hideTimeout=null)},delayedHideNav(){this.hideTimeout=setTimeout((()=>{this.navVisible=!1}),300)},cancelHideNav(){this.hideTimeout&&(clearTimeout(this.hideTimeout),this.hideTimeout=null)},updateAuthStatus(){const e=localStorage.getItem("token");if(this.isLoggedIn=!!e,this.isLoggedIn)try{const t=e.split(".")[1],a=t.replace(/-/g,"+").replace(/_/g,"/"),s=decodeURIComponent(atob(a).split("").map((function(e){return"%"+("00"+e.charCodeAt(0).toString(16)).slice(-2)})).join("")),o=JSON.parse(s);this.isAdmin=o.sub&&"admin"===o.sub.role}catch(t){console.error("Error parsing JWT:",t),this.isAdmin=!1}else this.isAdmin=!1},logout(){localStorage.removeItem("token"),this.isLoggedIn=!1,this.isAdmin=!1,this.$router.push("/login")}},mounted(){this.updateAuthStatus()}},u=a(1241);const h=(0,u.A)(c,[["render",d],["__scopeId","data-v-36401b88"]]);var m=h,g=a(1387);const p=e=>((0,o.Qi)("data-v-4bf5abf0"),e=e(),(0,o.jt)(),e),f={class:"container"},b=p((()=>(0,o.Lk)("h2",null,"Register",-1))),k={key:0,class:"error"},y=p((()=>(0,o.Lk)("footer",null,"MBE@2024",-1)));function v(e,t,a,n,l,i){const d=(0,o.g2)("he2"),c=(0,o.g2)("el-input"),u=(0,o.g2)("el-form-item"),h=(0,o.g2)("el-button"),m=(0,o.g2)("el-form");return(0,o.uX)(),(0,o.CE)("div",f,[(0,o.bF)(d,null,{default:(0,o.k6)((()=>[(0,o.eW)("MBE")])),_:1}),(0,o.bF)(m,{onSubmit:(0,s.D$)(n.register,["prevent"]),ref:"registerForm"},{default:(0,o.k6)((()=>[b,(0,o.bF)(u,{label:"Username",error:n.usernameError},{default:(0,o.k6)((()=>[(0,o.bF)(c,{modelValue:n.username,"onUpdate:modelValue":t[0]||(t[0]=e=>n.username=e),placeholder:"Your username"},null,8,["modelValue"])])),_:1},8,["error"]),(0,o.bF)(u,{label:"Password",error:n.passwordError},{default:(0,o.k6)((()=>[(0,o.bF)(c,{modelValue:n.password,"onUpdate:modelValue":t[1]||(t[1]=e=>n.password=e),type:"password",placeholder:"Your password"},null,8,["modelValue"])])),_:1},8,["error"]),(0,o.bF)(h,{type:"primary",onClick:n.register,class:"register-button"},{default:(0,o.k6)((()=>[(0,o.eW)("Register")])),_:1},8,["onClick"]),n.errorMessage?((0,o.uX)(),(0,o.CE)("p",k,(0,r.v_)(n.errorMessage),1)):(0,o.Q3)("",!0)])),_:1},8,["onSubmit"]),y])}var w=a(4373),_=a(144),C={setup(){const e=(0,_.KR)(""),t=(0,_.KR)(""),a=(0,_.KR)(""),s=(0,_.KR)(""),o=(0,_.KR)(""),r=()=>{let a=!0;return s.value="",o.value="",e.value||(s.value="Please enter your username.",a=!1),t.value||(o.value="Please enter your password.",a=!1),a},n=async()=>{if(r())try{await w.A.post("http://127.0.0.1:5000/register",{username:e.value,password:t.value}),alert("Registration successful!"),a.value=""}catch(s){console.error("Registration error:",s),a.value="Registration failed. Please try again."}};return{username:e,password:t,errorMessage:a,usernameError:s,passwordError:o,register:n}}};const F=(0,u.A)(C,[["render",v],["__scopeId","data-v-4bf5abf0"]]);var E=F;const I=e=>((0,o.Qi)("data-v-9b438082"),e=e(),(0,o.jt)(),e),S={class:"container"},V=I((()=>(0,o.Lk)("h2",null,"Login",-1))),$={key:0,class:"error"},H=I((()=>(0,o.Lk)("footer",null,"MBE@2024",-1)));function A(e,t,a,n,l,i){const d=(0,o.g2)("he2"),c=(0,o.g2)("el-input"),u=(0,o.g2)("el-form-item"),h=(0,o.g2)("el-button"),m=(0,o.g2)("el-form");return(0,o.uX)(),(0,o.CE)("div",S,[(0,o.bF)(d,null,{default:(0,o.k6)((()=>[(0,o.eW)("MBE")])),_:1}),(0,o.bF)(m,{onSubmit:(0,s.D$)(n.login,["prevent"]),ref:"loginForm",class:"login-form"},{default:(0,o.k6)((()=>[V,(0,o.bF)(u,{label:"Username  :",error:n.usernameError,class:"form-item"},{default:(0,o.k6)((()=>[(0,o.bF)(c,{modelValue:n.username,"onUpdate:modelValue":t[0]||(t[0]=e=>n.username=e),placeholder:"Your username","prefix-icon":"el-icon-user",class:"input-field"},null,8,["modelValue"])])),_:1},8,["error"]),(0,o.bF)(u,{label:"Password  :",error:n.passwordError,class:"form-item"},{default:(0,o.k6)((()=>[(0,o.bF)(c,{modelValue:n.password,"onUpdate:modelValue":t[1]||(t[1]=e=>n.password=e),type:"password",placeholder:"Your password","prefix-icon":"el-icon-lock",class:"input-field"},null,8,["modelValue"])])),_:1},8,["error"]),(0,o.bF)(h,{type:"primary",onClick:n.login,class:"login-button"},{default:(0,o.k6)((()=>[(0,o.eW)("Login")])),_:1},8,["onClick"]),n.errorMessage?((0,o.uX)(),(0,o.CE)("p",$,(0,r.v_)(n.errorMessage),1)):(0,o.Q3)("",!0)])),_:1},8,["onSubmit"]),H])}var U={setup(){const e=(0,_.KR)(""),t=(0,_.KR)(""),a=(0,_.KR)(""),s=(0,_.KR)(""),o=(0,_.KR)(""),r=(0,g.rd)(),n=()=>{let a=!0;return s.value="",o.value="",e.value||(s.value="Please enter your username.",a=!1),t.value||(o.value="Please enter your password.",a=!1),a},l=async()=>{if(n())try{const s=await w.A.post("http://127.0.0.1:5000/login",{username:e.value,password:t.value}),o=s.data.access_token;alert("Login successful!"),localStorage.setItem("token",o),a.value="",r.push("/chat")}catch(s){console.error("Login error:",s),s.response&&s.response.data.msg?a.value=s.response.data.msg:a.value="Login failed. Please try again."}};return{username:e,password:t,errorMessage:a,usernameError:s,passwordError:o,login:l}}};const D=(0,u.A)(U,[["render",A],["__scopeId","data-v-9b438082"]]);var L=D;const T=e=>((0,o.Qi)("data-v-e06a038e"),e=e(),(0,o.jt)(),e),M=T((()=>(0,o.Lk)("h2",null,"Protected Resource",-1)));function W(e,t,a,n,l,i){const d=(0,o.g2)("el-header"),c=(0,o.g2)("el-button"),u=(0,o.g2)("el-card"),h=(0,o.g2)("el-main"),m=(0,o.g2)("el-container");return l.isVisible?((0,o.uX)(),(0,o.Wv)(m,{key:0,class:"protected-container"},{default:(0,o.k6)((()=>[(0,o.bF)(d,{class:"title"},{default:(0,o.k6)((()=>[(0,o.bF)(s.eB,{name:"slide-fade"},{default:(0,o.k6)((()=>[M])),_:1})])),_:1}),(0,o.bF)(h,null,{default:(0,o.k6)((()=>[(0,o.bF)(c,{type:"primary",onClick:i.fetchProtectedData,loading:l.loading,class:"fetch-button"},{default:(0,o.k6)((()=>[(0,o.eW)(" Fetch Protected Data ")])),_:1},8,["onClick","loading"]),(0,o.bF)(s.eB,{name:"fade"},{default:(0,o.k6)((()=>[l.data?((0,o.uX)(),(0,o.Wv)(u,{key:0,class:"data-container"},{default:(0,o.k6)((()=>[(0,o.Lk)("pre",null,(0,r.v_)(l.data),1)])),_:1})):(0,o.Q3)("",!0)])),_:1})])),_:1})])),_:1})):(0,o.Q3)("",!0)}var P={data(){return{data:null,loading:!1,isVisible:!1}},created(){localStorage.getItem("token")?setTimeout((()=>{this.isVisible=!0}),200):this.$router.push("/login")},methods:{async fetchProtectedData(){this.loading=!0;const e=localStorage.getItem("token"),t=await fetch("/protected",{method:"GET",headers:{Authorization:`Bearer ${e}`}});this.loading=!1,t.ok?this.data=await t.json():this.$message.error("Failed to fetch protected data.")}}};const R=(0,u.A)(P,[["render",W],["__scopeId","data-v-e06a038e"]]);var X=R;const N=e=>((0,o.Qi)("data-v-3a156cde"),e=e(),(0,o.jt)(),e),x=N((()=>(0,o.Lk)("div",{class:"page-background"},null,-1))),j={class:"user-management"},B=N((()=>(0,o.Lk)("div",{class:"header"},[(0,o.Lk)("h2",null,"User Management")],-1))),K={class:"search-bar"},O=N((()=>(0,o.Lk)("i",{class:"el-icon-arrow-down el-icon--right"},null,-1))),Q={key:1};function z(e,t,a,s,r,n){const l=(0,o.g2)("el-input"),i=(0,o.g2)("el-button"),d=(0,o.g2)("el-table-column"),c=(0,o.g2)("el-dropdown-item"),u=(0,o.g2)("el-dropdown-menu"),h=(0,o.g2)("el-dropdown"),m=(0,o.g2)("el-table"),g=(0,o.g2)("el-pagination");return(0,o.uX)(),(0,o.CE)("div",null,[x,(0,o.Lk)("div",j,[B,(0,o.Lk)("div",K,[(0,o.bF)(l,{modelValue:r.searchQuery,"onUpdate:modelValue":t[0]||(t[0]=e=>r.searchQuery=e),placeholder:"请输入Username",clearable:"",class:"search-input"},null,8,["modelValue"]),(0,o.bF)(i,{type:"primary",onClick:n.searchUsers},{default:(0,o.k6)((()=>[(0,o.eW)("Search")])),_:1},8,["onClick"])]),n.paginatedUsers.length>0?((0,o.uX)(),(0,o.Wv)(m,{key:0,data:n.paginatedUsers,stripe:"",style:{width:"100%",margin:"20px 0"},border:""},{default:(0,o.k6)((()=>[(0,o.bF)(d,{prop:"id",label:"ID",width:"80"}),(0,o.bF)(d,{prop:"username",label:"Username"}),(0,o.bF)(d,{prop:"role",label:"Role"}),(0,o.bF)(d,{label:"Management"},{default:(0,o.k6)((e=>[(0,o.bF)(h,{trigger:"click",onCommand:t=>n.handleCommand(e.row,t)},{dropdown:(0,o.k6)((()=>[(0,o.bF)(u,null,{default:(0,o.k6)((()=>[(0,o.bF)(c,{command:"changeRole"},{default:(0,o.k6)((()=>[(0,o.eW)("修改角色")])),_:1}),(0,o.bF)(c,{command:"changePassword"},{default:(0,o.k6)((()=>[(0,o.eW)("修改密码")])),_:1}),(0,o.bF)(c,{command:"deleteUser"},{default:(0,o.k6)((()=>[(0,o.eW)("删除用户")])),_:1})])),_:1})])),default:(0,o.k6)((()=>[(0,o.bF)(i,{type:"text",size:"small"},{default:(0,o.k6)((()=>[(0,o.eW)(" 操作"),O])),_:1})])),_:2},1032,["onCommand"])])),_:1})])),_:1},8,["data"])):((0,o.uX)(),(0,o.CE)("p",Q,"没有找到用户。")),(0,o.bF)(g,{background:"",layout:"prev, pager, next","page-size":10,total:n.filteredUsers.length,currentPage:r.currentPage,"onUpdate:currentPage":t[1]||(t[1]=e=>r.currentPage=e),class:"pagination"},null,8,["total","currentPage"])])])}var q={data(){return{searchQuery:"",currentPage:1,users:[]}},computed:{filteredUsers(){return this.users.filter((e=>e.username.toLowerCase().includes(this.searchQuery.toLowerCase())))},paginatedUsers(){const e=10*(this.currentPage-1),t=e+10;return this.filteredUsers.slice(e,t)}},methods:{async fetchUsers(){try{const e=localStorage.getItem("token"),t=await fetch("/users",{method:"GET",headers:{Authorization:`Bearer ${e}`}});this.users=await t.json()}catch(e){console.error("获取用户数据时出错:",e)}},searchUsers(){this.currentPage=1},async handleCommand(e,t){switch(t){case"changeRole":await this.changeRole(e.id);break;case"changePassword":await this.changePassword(e.id);break;case"deleteUser":await this.deleteUser(e.id);break}},async changeRole(e){const t=prompt("请输入新角色 (user/admin):");if(t)try{const a=localStorage.getItem("token");await fetch(`/users/${e}/role`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${a}`},body:JSON.stringify({role:t})}),this.fetchUsers()}catch(a){console.error("修改角色时出错:",a)}},async changePassword(e){const t=prompt("请输入新密码:");if(t)try{const a=localStorage.getItem("token");await fetch(`/users/${e}/password`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${a}`},body:JSON.stringify({password:t})}),alert("密码已更新！")}catch(a){console.error("修改密码时出错:",a)}},async deleteUser(e){if(confirm("确定要删除此用户吗？"))try{const t=localStorage.getItem("token");await fetch(`/users/${e}`,{method:"DELETE",headers:{Authorization:`Bearer ${t}`}}),this.fetchUsers()}catch(t){console.error("删除用户时出错:",t)}}},mounted(){this.fetchUsers()}};const J=(0,u.A)(q,[["render",z],["__scopeId","data-v-3a156cde"]]);var Y=J;const G={class:"chat-content"};function Z(e,t,a,r,n,l){const i=(0,o.g2)("el-button"),d=(0,o.g2)("el-header"),c=(0,o.g2)("ChatHistory"),u=(0,o.g2)("el-aside"),h=(0,o.g2)("Message"),m=(0,o.g2)("el-scrollbar"),g=(0,o.g2)("el-input"),p=(0,o.g2)("el-footer"),f=(0,o.g2)("el-main"),b=(0,o.g2)("el-container");return(0,o.uX)(),(0,o.Wv)(b,{class:"chat-container"},{default:(0,o.k6)((()=>[(0,o.bF)(d,{class:"header"},{default:(0,o.k6)((()=>[(0,o.bF)(i,{type:"primary",onClick:e.toggleHistory,loading:n.loading,class:"history-button"},{default:(0,o.k6)((()=>[(0,o.eW)(" Chat History ")])),_:1},8,["onClick","loading"])])),_:1}),(0,o.bF)(s.eB,{name:"slide-left"},{default:(0,o.k6)((()=>[n.showHistory?((0,o.uX)(),(0,o.Wv)(u,{key:0,class:"history-container",onClick:(0,s.D$)(e.closeHistory,["self"]),ref:"historyContainer"},{default:(0,o.k6)((()=>[(0,o.bF)(c,{onLoadHistory:e.loadHistory,onNewChat:l.newChat,onDeleteChat:l.deleteChat,onDeleteSelected:l.deleteSelected,chatHistories:n.chatHistories},null,8,["onLoadHistory","onNewChat","onDeleteChat","onDeleteSelected","chatHistories"])])),_:1},8,["onClick"])):(0,o.Q3)("",!0)])),_:1}),(0,o.bF)(f,{class:"chat-main",onClick:e.closeHistoryIfOpen},{default:(0,o.k6)((()=>[(0,o.bF)(m,{class:"chat-messages"},{default:(0,o.k6)((()=>[(0,o.Lk)("div",G,[(0,o.bF)(s.F,{name:"message-transition"},{default:(0,o.k6)((()=>[((0,o.uX)(!0),(0,o.CE)(o.FK,null,(0,o.pI)(n.messages,((e,t)=>((0,o.uX)(),(0,o.Wv)(h,{key:t,message:e},null,8,["message"])))),128))])),_:1})])])),_:1}),(0,o.bF)(p,{class:"chat-input-container"},{default:(0,o.k6)((()=>[(0,o.bF)(g,{modelValue:n.userMessage,"onUpdate:modelValue":t[0]||(t[0]=e=>n.userMessage=e),onKeyup:(0,s.jR)(l.sendMessage,["enter"]),placeholder:"Type your message...",class:"chat-input",clearable:"",disabled:n.loading},null,8,["modelValue","onKeyup","disabled"]),(0,o.bF)(i,{onClick:l.sendMessage,type:"primary",class:"send-button",loading:n.loading},{default:(0,o.k6)((()=>[(0,o.eW)(" Send ")])),_:1},8,["onClick","loading"])])),_:1})])),_:1},8,["onClick"])])),_:1})}const ee=e=>((0,o.Qi)("data-v-bca5b14a"),e=e(),(0,o.jt)(),e),te={class:"chat-history"},ae=ee((()=>(0,o.Lk)("h3",null,"Chat History",-1)));function se(e,t,a,n,l,i){const d=(0,o.g2)("el-button"),c=(0,o.g2)("el-menu-item"),u=(0,o.g2)("el-menu"),h=(0,o.g2)("el-scrollbar"),m=(0,o.g2)("el-empty"),g=(0,o.g2)("el-checkbox"),p=(0,o.g2)("el-checkbox-group");return(0,o.uX)(),(0,o.CE)("div",te,[ae,a.chatHistories.length?((0,o.uX)(),(0,o.Wv)(h,{key:0,class:"history-list"},{default:(0,o.k6)((()=>[(0,o.bF)(u,{"default-active":l.activeIndex,class:"el-menu-vertical-demo"},{default:(0,o.k6)((()=>[(0,o.bF)(s.F,{name:"fade"},{default:(0,o.k6)((()=>[((0,o.uX)(!0),(0,o.CE)(o.FK,null,(0,o.pI)(a.chatHistories,((e,t)=>((0,o.uX)(),(0,o.Wv)(c,{key:e.id,onClick:t=>i.handleHistoryClick(e.id),class:(0,r.C4)({active:e.id===l.activeIndex})},{default:(0,o.k6)((()=>[(0,o.Lk)("span",null,"Chat "+(0,r.v_)(t+1)+" - "+(0,r.v_)(e.timestamp),1),(0,o.bF)(d,{type:"text",icon:"el-icon-delete",onClick:(0,s.D$)((t=>i.deleteSingle(e.id)),["stop"]),style:{float:"right","margin-right":"10px"}},null,8,["onClick"])])),_:2},1032,["onClick","class"])))),128))])),_:1})])),_:1},8,["default-active"])])),_:1})):((0,o.uX)(),(0,o.Wv)(m,{key:1,description:"No Chat History"})),a.chatHistories.length?((0,o.uX)(),(0,o.Wv)(p,{key:2,modelValue:l.selectedIds,"onUpdate:modelValue":t[0]||(t[0]=e=>l.selectedIds=e),class:"checkbox-group"},{default:(0,o.k6)((()=>[((0,o.uX)(!0),(0,o.CE)(o.FK,null,(0,o.pI)(a.chatHistories,(e=>((0,o.uX)(),(0,o.Wv)(g,{key:e.id,label:e.id},{default:(0,o.k6)((()=>[(0,o.eW)(" Select Chat "+(0,r.v_)(e.timestamp),1)])),_:2},1032,["label"])))),128))])),_:1},8,["modelValue"])):(0,o.Q3)("",!0),a.chatHistories.length?((0,o.uX)(),(0,o.Wv)(d,{key:3,type:"danger",icon:"el-icon-delete",onClick:i.deleteSelectedChats,disabled:!l.selectedIds.length,class:"delete-selected-button"},{default:(0,o.k6)((()=>[(0,o.eW)(" Delete Selected ")])),_:1},8,["onClick","disabled"])):(0,o.Q3)("",!0),(0,o.bF)(d,{type:"primary",onClick:i.newChat,class:"new-chat-button",icon:"el-icon-plus"},{default:(0,o.k6)((()=>[(0,o.eW)(" New Chat ")])),_:1},8,["onClick"])])}var oe=a(1219),re={props:{chatHistories:Array},data(){return{activeIndex:null,selectedIds:[]}},methods:{handleHistoryClick(e){this.activeIndex=e,this.$emit("load-history",e)},newChat(){this.activeIndex=null,this.$emit("new-chat")},deleteSingle(e){this.$emit("delete-chat",e),this.activeIndex===e&&(this.activeIndex=null),oe.nk.success("Chat deleted successfully")},deleteSelectedChats(){this.$emit("delete-selected",this.selectedIds),this.selectedIds=[],oe.nk.success("Selected chats deleted successfully")}}};const ne=(0,u.A)(re,[["render",se],["__scopeId","data-v-bca5b14a"]]);var le=ne;const ie={class:"message-content"};function de(e,t,a,n,l,i){const d=(0,o.g2)("el-card");return(0,o.uX)(),(0,o.Wv)(s.eB,{name:i.transitionName},{default:(0,o.k6)((()=>[a.message?((0,o.uX)(),(0,o.Wv)(d,{key:0,class:(0,r.C4)(i.messageClass)},{default:(0,o.k6)((()=>[(0,o.Lk)("div",ie,(0,r.v_)(a.message.content),1)])),_:1},8,["class"])):(0,o.Q3)("",!0)])),_:1},8,["name"])}var ce={props:{message:{type:Object,required:!0}},computed:{messageClass(){return"user"===this.message.role?"user-message":"model-message"},transitionName(){return"user"===this.message.role?"slide-up-right":"slide-up-left"}}};const ue=(0,u.A)(ce,[["render",de],["__scopeId","data-v-5457c93e"]]);var he=ue,me={components:{ChatHistory:le,Message:he},data(){return{userMessage:"",messages:[],loading:!1,showHistory:!1,chatHistories:[]}},async mounted(){this.loadChatHistories()},methods:{async sendMessage(){if(""===this.userMessage.trim()||this.loading)return;this.messages.push({role:"user",content:this.userMessage});const e=this.userMessage;this.userMessage="",this.loading=!0;try{const t=localStorage.getItem("token"),a=await w.A.post("/chat",{message:e},{headers:{Authorization:`Bearer ${t}`}});this.processResponse(a.data),console.log("API response data:",a.data)}catch(t){console.log(t),this.handleError(t,"Error sending message")}finally{this.loading=!1}},processResponse(e){if(console.log("Processing response:",e),e?.response)console.log("Adding assistant message:",e.response),this.addMessage("assistant",e.response);else if(e?.choices?.[0]?.message){const t=e.choices[0].message;this.addMessage(t.role||"assistant",t.content),console.log("Adding assistant message:",t.content)}else oe.nk.error("Unexpected response structure"),console.error("Unexpected response structure:",e)},addMessage(e,t){this.messages.push({role:e,content:t}),console.log("Messages array:",this.messages),this.$nextTick((()=>{const e=this.$el.querySelector(".chat-messages .el-scrollbar__wrap");e.scrollTop=e.scrollHeight})),console.log(`${e} message added:`,t)},async loadChatHistories(){try{const e=await this.authenticatedRequest("get","/api/chat-histories");this.chatHistories=e.data}catch(e){this.handleError(e,"Error loading chat histories")}},async newChat(){this.messages=[],this.closeHistory(),this.addMessage("model","You have started a new chat. How can I assist you?");const e={id:Date.now(),timestamp:(new Date).toLocaleString(),messages:this.messages};try{const t=await this.authenticatedRequest("post","/api/chat-histories",e);this.chatHistories.push(t.data)}catch(t){this.handleError(t,"Error creating new chat")}},async deleteChat(e){try{await this.authenticatedRequest("delete",`/api/chat-histories/${e}`),this.chatHistories=this.chatHistories.filter((t=>t.id!==e)),oe.nk.success("Chat deleted successfully")}catch(t){this.handleError(t,"Error deleting chat")}},async deleteSelected(e){try{await Promise.all(e.map((e=>this.authenticatedRequest("delete",`/api/chat-histories/${e}`)))),this.chatHistories=this.chatHistories.filter((t=>!e.includes(t.id))),oe.nk.success("Selected chats deleted successfully")}catch(t){this.handleError(t,"Error deleting selected chats")}},async authenticatedRequest(e,t,a=null){const s=localStorage.getItem("token");if(!s)throw oe.nk.error("Token not found. Please log in."),new Error("Token not found");return(0,w.A)({method:e,url:t,data:a,headers:{Authorization:`Bearer ${s}`}})},handleError(e,t){e.response&&401===e.response.status?(oe.nk.error("Unauthorized. Please log in again."),localStorage.removeItem("token")):oe.nk.error(t),console.error(t,e)}}};const ge=(0,u.A)(me,[["render",Z],["__scopeId","data-v-37d4f9ea"]]);var pe=ge;const fe=e=>((0,o.Qi)("data-v-0ad3f0de"),e=e(),(0,o.jt)(),e),be={class:"container"},ke=fe((()=>(0,o.Lk)("h2",null,"Knowledge Base Management",-1))),ye={key:0,class:"form-container"},ve={key:0,class:"form-container"};function we(e,t,a,r,n,l){const i=(0,o.g2)("el-input"),d=(0,o.g2)("el-button"),c=(0,o.g2)("el-tab-pane"),u=(0,o.g2)("el-table-column"),h=(0,o.g2)("el-table"),m=(0,o.g2)("el-tabs"),g=(0,o.g2)("el-card");return(0,o.uX)(),(0,o.CE)("div",be,[(0,o.bF)(g,{class:"box-card"},{default:(0,o.k6)((()=>[ke,(0,o.bF)(m,{modelValue:n.activeTab,"onUpdate:modelValue":t[3]||(t[3]=e=>n.activeTab=e),type:"border-card",onTabClick:l.handleTabClick},{default:(0,o.k6)((()=>[(0,o.bF)(c,{label:"Add Item",name:"add-item"},{default:(0,o.k6)((()=>[(0,o.bF)(s.eB,{name:"fade"},{default:(0,o.k6)((()=>["add-item"===n.activeTab?((0,o.uX)(),(0,o.CE)("div",ye,[(0,o.bF)(i,{modelValue:n.formData.addData,"onUpdate:modelValue":t[0]||(t[0]=e=>n.formData.addData=e),placeholder:"Enter data...",type:"textarea",rows:"3",resize:"none"},null,8,["modelValue"]),(0,o.bF)(i,{modelValue:n.formData.addEmbedding,"onUpdate:modelValue":t[1]||(t[1]=e=>n.formData.addEmbedding=e),placeholder:"Enter embedding (optional, comma separated)"},null,8,["modelValue"]),(0,o.bF)(d,{type:"primary",onClick:l.addItem},{default:(0,o.k6)((()=>[(0,o.eW)("Add Item")])),_:1},8,["onClick"])])):(0,o.Q3)("",!0)])),_:1})])),_:1}),(0,o.bF)(c,{label:"Search Items",name:"search-items"},{default:(0,o.k6)((()=>[(0,o.bF)(s.eB,{name:"fade"},{default:(0,o.k6)((()=>["search-items"===n.activeTab?((0,o.uX)(),(0,o.CE)("div",ve,[(0,o.bF)(i,{modelValue:n.formData.searchKeyword,"onUpdate:modelValue":t[2]||(t[2]=e=>n.formData.searchKeyword=e),placeholder:"Enter keyword..."},null,8,["modelValue"]),(0,o.bF)(d,{type:"primary",onClick:l.fetchItems},{default:(0,o.k6)((()=>[(0,o.eW)("Search")])),_:1},8,["onClick"]),(0,o.bF)(h,{data:n.items,style:{width:"100%","margin-top":"20px"}},{default:(0,o.k6)((()=>[(0,o.bF)(u,{prop:"id",label:"ID",width:"100"}),(0,o.bF)(u,{label:"Data"},{default:(0,o.k6)((e=>[(0,o.bF)(i,{modelValue:e.row.data,"onUpdate:modelValue":t=>e.row.data=t,placeholder:"Edit data..."},null,8,["modelValue","onUpdate:modelValue"])])),_:1}),(0,o.bF)(u,{label:"Embedding"},{default:(0,o.k6)((e=>[(0,o.bF)(i,{modelValue:e.row.embedding,"onUpdate:modelValue":t=>e.row.embedding=t,placeholder:"Edit embedding..."},null,8,["modelValue","onUpdate:modelValue"])])),_:1}),(0,o.bF)(u,{label:"Actions",width:"200"},{default:(0,o.k6)((e=>[(0,o.bF)(d,{type:"primary",onClick:t=>l.updateItem(e.row)},{default:(0,o.k6)((()=>[(0,o.eW)("Update")])),_:2},1032,["onClick"]),(0,o.bF)(d,{type:"danger",onClick:t=>l.deleteItem(e.row.id)},{default:(0,o.k6)((()=>[(0,o.eW)("Delete")])),_:2},1032,["onClick"])])),_:1})])),_:1},8,["data"])])):(0,o.Q3)("",!0)])),_:1})])),_:1})])),_:1},8,["modelValue","onTabClick"])])),_:1})])}var _e={data(){return{activeTab:"add-item",formData:{addData:"",addEmbedding:"",searchKeyword:""},items:[]}},methods:{handleTabClick(e){console.log("Switched to tab:",e.name)},async addItem(){if(!this.formData.addData.trim())return void this.$message.error("Data field cannot be empty.");const e=this.items.map((e=>e.id)).sort(((e,t)=>e-t));let t=1;for(let s=1;s<=e.length+1;s++)if(!e.includes(s)){t=s;break}try{const e=localStorage.getItem("token"),a=await fetch("/knowledge_base",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${e}`},body:JSON.stringify({id:t,data:this.formData.addData,embedding:this.formData.addEmbedding?this.formData.addEmbedding.split(",").map(Number):null})});a.ok?(this.$message.success("Item added successfully!"),this.formData.addData="",this.formData.addEmbedding="",this.fetchItems()):this.$message.error("Failed to add item")}catch(a){this.$message.error("Error adding item")}},async fetchItems(){if(this.formData.searchKeyword.trim())try{const e=localStorage.getItem("token"),t=await fetch(`/knowledge_base?keyword=${encodeURIComponent(this.formData.searchKeyword)}`,{method:"GET",headers:{Authorization:`Bearer ${e}`}});t.ok?this.items=await t.json():this.$message.error("Failed to fetch items")}catch(e){this.$message.error("Error fetching items")}else this.$message.error("Keyword field cannot be empty.")},async updateItem(e){if(e.data.trim())try{const t=localStorage.getItem("token"),a=await fetch(`/knowledge_base/${e.id}`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${t}`},body:JSON.stringify({data:e.data,embedding:e.embedding.split(",").map(Number)})});a.ok?this.$message.success("Entry updated successfully!"):this.$message.error("Failed to update item")}catch(t){this.$message.error("Error updating item")}else this.$message.error("Data field cannot be empty.")},async deleteItem(e){if(e)try{const t=localStorage.getItem("token"),a=await fetch(`/knowledge_base/${e}`,{method:"DELETE",headers:{Authorization:`Bearer ${t}`}});a.ok?(this.$message.success("Entry deleted successfully!"),this.fetchItems()):this.$message.error("Failed to delete item")}catch(t){this.$message.error("Error deleting item")}else this.$message.error("Invalid ID.")}}};const Ce=(0,u.A)(_e,[["render",we],["__scopeId","data-v-0ad3f0de"]]);var Fe=Ce;function Ee(e,t,a){const s=localStorage.getItem("token");if(s){const t=JSON.parse(atob(s.split(".")[1]));e.meta.requiresAdmin&&"admin"!==t.sub.role?(oe.nk.warning("You need admin privileges to access this section."),a("/chat")):a()}else a("/login")}const Ie=(0,g.aE)({history:(0,g.LA)(),routes:[{path:"/",redirect:"/login"},{path:"/register",component:E},{path:"/login",component:L},{path:"/protected",component:X,beforeEnter:Ee},{path:"/user-management",component:Y,beforeEnter:Ee,meta:{requiresAdmin:!0}},{path:"/data-management",component:Fe,beforeEnter:Ee,meta:{requiresAdmin:!0}},{path:"/chat",component:pe,beforeEnter:Ee}]});var Se=Ie,Ve=a(5774);a(4188);const $e=(0,s.Ef)(m);$e.use(Se),$e.use(Ve.A),$e.mount("#app")}},t={};function a(s){var o=t[s];if(void 0!==o)return o.exports;var r=t[s]={exports:{}};return e[s].call(r.exports,r,r.exports,a),r.exports}a.m=e,function(){var e=[];a.O=function(t,s,o,r){if(!s){var n=1/0;for(c=0;c<e.length;c++){s=e[c][0],o=e[c][1],r=e[c][2];for(var l=!0,i=0;i<s.length;i++)(!1&r||n>=r)&&Object.keys(a.O).every((function(e){return a.O[e](s[i])}))?s.splice(i--,1):(l=!1,r<n&&(n=r));if(l){e.splice(c--,1);var d=o();void 0!==d&&(t=d)}}return t}r=r||0;for(var c=e.length;c>0&&e[c-1][2]>r;c--)e[c]=e[c-1];e[c]=[s,o,r]}}(),function(){a.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return a.d(t,{a:t}),t}}(),function(){a.d=function(e,t){for(var s in t)a.o(t,s)&&!a.o(e,s)&&Object.defineProperty(e,s,{enumerable:!0,get:t[s]})}}(),function(){a.g=function(){if("object"===typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"===typeof window)return window}}()}(),function(){a.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)}}(),function(){a.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}}(),function(){var e={524:0};a.O.j=function(t){return 0===e[t]};var t=function(t,s){var o,r,n=s[0],l=s[1],i=s[2],d=0;if(n.some((function(t){return 0!==e[t]}))){for(o in l)a.o(l,o)&&(a.m[o]=l[o]);if(i)var c=i(a)}for(t&&t(s);d<n.length;d++)r=n[d],a.o(e,r)&&e[r]&&e[r][0](),e[r]=0;return a.O(c)},s=self["webpackChunkrag_system_frontend"]=self["webpackChunkrag_system_frontend"]||[];s.forEach(t.bind(null,0)),s.push=t.bind(null,s.push.bind(s))}();var s=a.O(void 0,[504],(function(){return a(9313)}));s=a.O(s)})();
//# sourceMappingURL=app.e23225ac.js.map