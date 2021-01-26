import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

// 导入方法
import {postKeyValueRequest} from './utils/api.js'
import {postRequest} from './utils/api.js'
import {getRequest} from './utils/api.js'
import {putRequest} from './utils/api.js'
import {deleteRequest} from './utils/api.js'
import {initMenu} from './utils/menus.js'
import 'font-awesome/css/font-awesome.min.css'
// 绑定
Vue.prototype.postKeyValueRequest = postKeyValueRequest;
Vue.prototype.postRequest = postRequest;
Vue.prototype.getRequest = getRequest;
Vue.prototype.putRequest = putRequest;
Vue.prototype.deleteRequest = deleteRequest;

Vue.use(ElementUI);
Vue.config.productionTip = false

// 路由全局守卫
router.beforeEach(
	/*
		to 到哪去
		from 从哪来
		next 放行
		解决了刷新之后不显示导航栏的问题
	*/
	(to,from,next) => {
		if(to.path == '/'){
			next();
		}else{
			// 判断是否登录
			// window.sessionStorage.getItem("user")
			if(window.sessionStorage.getItem("user")){
				initMenu(router,store)
				next();
			}else{
				console.log(to);
				// 如果没有东西表示没登录
				next("/?redirect="+to.path)
			}
		}
	}
)


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
