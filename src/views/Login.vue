<template>
	<div>
		<el-form :rules="rules" :model="loginForm" ref="loginForm" class="loginContainer">
			<h3 class="loginTitle">系统登录</h3>
			<el-form-item prop="username">
				<el-input type="text" v-model="loginForm.username" placeholder="请输入用户名"></el-input>
			</el-form-item>
			<el-form-item prop="password">
				<el-input type="password" show-password v-model="loginForm.password" placeholder="请输入密码" @keydown.enter.native="submitLogin"></el-input>
			</el-form-item>
			<el-checkbox v-model="checked" class="loginRem">记住我</el-checkbox>
			<el-button type="primary" class="loginButton" @click="submitLogin">登录</el-button>
		</el-form>
	</div>
</template>

<script>
	// 导入方法
	// 在main.js中编写插件
	// import {postKeyValueRequest} from '../utils/api.js'
	export default {
		name: "Login",
		data() {
			return {
				loginForm: {
					username: 'admin',
					password: '123'
				},
				checked: true,
				rules: {
					username: [{
						required: true,
						message: '用户名不能为空',
						trigger: 'blur'
					}],
					password: [{
						required: true,
						message: '密码不能为空',
						trigger: 'blur'
					}]
				}
			}
		},
		methods: {
			submitLogin() {
				this.$refs.loginForm.validate((valid) => {
					if (valid) {
						this.postKeyValueRequest('/doLogin',this.loginForm).then(
							res => {
								if(res){
									// sessionStorage
									// 浏览器关闭就消失,是js中的一个会话对象
									// user : key自己起名 可以更改
									// JSON.stringify(res) : value
									window.sessionStorage.setItem("user",JSON.stringify(res.obj));
									// 获取传递的参数
									let path = this.$route.query.redirect
									// 跳转
									// push压栈 可以点击后退按钮
									// replace 替换 后退按钮 不可点击
									//this.$router.push()
									this.$router.replace((path == '/' || path == undefined) ? '/home' : path);
								}
							}
						)
					} else {
						alert('error submit!!');
						// 当验证不通过时 返回false 阻止提交表单动作
						return false;
					}
				});
			}
		}
	}
</script>

<style>
	.loginButton{
		width: 100%;
	}
	.loginContainer{
		border-radius: 20px;
		background-clip: padding-box;
		margin: 100px auto;
		width: 350px;
		background: #FFFFFF;
		box-shadow: 0 0 25px darkgray;
		padding: 15px 35px 15px 35px;
		border : 1px solid #eaeaea;
	}
	.loginTitle{
		text-align: center;
		margin: 15px auto 20px auto;
		color: darkslategray;
	}
	.loginRem{
		text-align: left;
		margin: 0px 0px 15px 0px;
	}
</style>
