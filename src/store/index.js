// vue
import Vue from 'vue'
// vuex
import Vuex from 'vuex'

// 使用
Vue.use(Vuex)

// 声明一个vuex实例
export default new Vuex.Store({
	state : {
		// 声明一个路由数组
		routes : []
	},
	mutations : {
		// 初始化路由
		// state 参数是默认的,调用时可以不写
		// data 表示从后台响应回来的数据
		// 最多只能传递两个参数 如果想要传递多个参数,使用json进行拼接 传递json对象过来
		// {menus:[{},{},{},{},{},{}],user:{a:a,b:b,c:c}}
		initRoutes(state,data){
			state.routes = data;
		}
	},
	actions : {
		
	}
});