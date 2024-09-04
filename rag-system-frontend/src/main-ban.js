import { createApp } from 'vue'; // 从 'vue' 模块中导入 createApp
import App from './components/ChatWindow.vue'; // 确保路径正确
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
const app = createApp(App);
app.use(ElementPlus);
app.mount('#app');
