import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';


// 创建 Vue 应用实例并使用插件
const app = createApp(App);

app.use(router);
app.use(ElementPlus);

// 挂载应用
app.mount('#app');
