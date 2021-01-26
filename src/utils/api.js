// 导入
import axios from 'axios'
import { Message } from 'element-ui'
import router from '../router/index.js'

// ajax响应拦截器
axios.interceptors.response.use(
	success => {
		// 进行判断
		if(success.status && success.status == 200 && success.data.status == 500){
			// 使用message组件展示失败信息
			Message.error({ message : success.data.msg})
			// return空数据
			return;
		}
		
		if(success.data.msg){
			Message.success({message : success.data.msg})
		}
			
		return success.data;
	},
	error => {
		if(error.response.status == 504 || error.response.status == 404){
			Message.error({ message : '服务器被吃了_(:зゝ∠)_'})
		}else if(error.response.status == 403){
			Message.error({ message : '权限不足,请联系管理员'})
		}else if(error.response.status == 401){
			Message.error({ message : '尚未登录,请先登录'})
			router.replace("/")
		}else{
			if(error.response.data.msg){
				Message.error({ message : error.response.data.msg})
			}else {
				Message.error({ message : '未知错误'})
			}
		}
	}
);

// 方便以后维护使用,可以用来统一加前缀
let base = '';

// 封装post key value请求
export const postKeyValueRequest = (url,params) => {
	return axios({
		url:`${base}${url}`,
		data: params,
		method:'post',
		transformRequest : [function (data){
			let ret = '';
			for(let i in data){
				// console.log(i + "-----------------------" + data[i]);
				ret += encodeURIComponent(i) + '=' + encodeURIComponent(data[i]) + '&'
			}
			return ret;
		}],
		headers : {
			'Content-Type' : 'application/x-www-form-urlencoded'
		}
	})
}

// 封装post请求 传递json
export const postRequest = (url,params) =>{
	return axios({
		method : 'post',
		url : `${base}${url}`,
		data : params
	})
}
// 封装delete请求 传递json
export const deleteRequest = (url,params) =>{
	return axios({
		method : 'delete',
		url : `${base}${url}`,
		data : params
	})
}
// 封装get请求 传递json
export const getRequest = (url,params) =>{
	return axios({
		method : 'get',
		url : `${base}${url}`,
		data : params
	})
}
// 封装put请求 传递json
export const putRequest = (url,params) =>{
	return axios({
		method : 'put',
		url : `${base}${url}`,
		data : params
	})
}