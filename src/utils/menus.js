import {getRequest} from '../utils/api.js'

// 定义菜单的触发方式
export const initMenu = (router,store) => {
	// 判断vuex中的state的routes数组是否有数据
	if(store.state.routes.length > 0){
		return;
	}
	
	// 如果vuex中的state的routes数组没有数据,就发送请求,让后端响应数据回来
	getRequest('/system/config/menu').then(
		res => {
			// 调用格式化菜单的方法
			let fmtRoutes = formatRoutes(res);
			// 此时经过formatRoutes方法的操作,fmtRoutes数组已经有值
			// 为参数router赋值
			router.addRoutes(fmtRoutes);
			// 为了状态的统一,我们调用store中的initRouter,给store中的routes赋值
			store.commit('initRoutes',fmtRoutes);
		}
	);
}
// 定义格式化菜单的方法
export const formatRoutes = (routes) =>{
	// 定义数组,用于返回
	let fmtRoutes = [];
	routes.forEach(
		router => { // 给每一个元素起名为route
			// 批量变量定义
			let {path,component,name,meta,iconCls,children} = router
			// path = router.path
			// 判断每一项是否有子元素 并且子元素的类型是数组
			if(children && children instanceof Array){
				// 递归调用
				children = formatRoutes(children);
			}
			
			// 定义路由对象
			let fmtRouter = {
				path : path,
				name : name,
				iconCls : iconCls,
				meta : meta,
				children : children,
				// 将字符串转换成对象
				component(resolve){
					// 相当于导入组件
					// component是从数组中获取出来的数据
					// 根据组件名称进行path的设置
					if(component.startsWith('Home')){
						require(['../views/'+component+'.vue'],resolve);
					}else if(component.startsWith('Emp')){
						require(['../views/emp/'+component+'.vue'],resolve);
					}else if(component.startsWith('Per')){
						require(['../views/per/'+component+'.vue'],resolve);
					}else if(component.startsWith('Sal')){
						require(['../views/sal/'+component+'.vue'],resolve);
					}else if(component.startsWith('Sta')){
						require(['../views/sta/'+component+'.vue'],resolve);
					}else if(component.startsWith('Sys')){
						require(['../views/sys/'+component+'.vue'],resolve);
					}
				}
			}
			fmtRoutes.push(fmtRouter);
		}
	)
	return fmtRoutes;
}
