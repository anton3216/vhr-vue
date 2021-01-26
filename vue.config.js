// 1.定义一个代理对象
/*
	var
	let
	const
	
	都是js声明变量的关键字 let和const是ES6中新增的关键字
	var 和 let 的区别
	(1) 作用域
		var声明的变量的作用域只能是全局或整个函数块的
		let声明的变量的作用域 可以是当前代码块,可以是if while for switch等使用{}限定的代码块
	(2) 重复声明
		var允许在同一作用域中重复声明
		let不允许在同一作用域中重复声明,否则将抛出异常
	(3) 绑定全局对象
		var在全局环境声明变量,会在全局对象中新建一个属性
		let 在全局环境中声明变量,不会在全局对象中新建一个属性
	
	let 和 const区别
		类似,都具有上面let的特征
		唯一的区别是:const声明的变量是一个只读变量,声明之后不能修改,const声明的变量必须初始化
*/
let proxyObj = {};
// 2.给代理对象传递参数,让代理对象代理我们的请求
proxyObj['/'] = {
	ws : false,//关闭websocket,后期我们自己配置websocket
	target : 'http://localhost:9999',// 转发位置
	changeOrigin : true,
	pathRewrite : {// 地址重写
		'^/' : ''
	}
}
// 3.修改端口号
module.exports = {
	devServer : {
		host : 'localhost',
		port : '8888',
		proxy : proxyObj
	}
}