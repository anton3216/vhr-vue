<template>
	<div>
		<!-- {{this.$router.options.routes}} -->
		<el-container>
			<el-header class="homeHeader">
				<div class="title">微人事</div>
				<el-dropdown class="userInfo" @command="commandHandler">
					<span class="el-dropdown-link">
						{{user.name}}
						<i>
							<img :src='user.userface' />
						</i>
					</span>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item command="userinfo">个人信息</el-dropdown-item>
						<el-dropdown-item command="setting">设置</el-dropdown-item>
						<el-dropdown-item command="logout" divided>注销登录</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
			</el-header>
			<el-container>
				<el-aside width="200px">
					<!-- 使用router替换@select='selectHandler' 能达到相同的效果 -->
					<el-menu class="el-menu-vertical-demo" router unique-opened>
						<el-submenu :index="index+''" v-for="(item,index) in routes" v-if="!item.hidden">
							<template slot="title">
								<i :class="item.iconCls" style="color:#409;margin-right: 7px;"></i>
								<span>{{item.name}}</span>
							</template>
							<el-menu-item :index="child.path" v-for="(child,index) in item.children"><i :class="child.iconCls" style="color:#409;margin-right: 7px;"></i>{{child.name}}</el-menu-item>
							<!-- <el-menu-item index="/test2">Test2</el-menu-item> -->
						</el-submenu>
					</el-menu>
				</el-aside>
				<el-main>
					<el-breadcrumb separator-class="el-icon-arrow-right" v-if="this.$router.currentRoute.path != '/home'">
					  <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
					  <el-breadcrumb-item>{{this.$router.currentRoute.name}}</el-breadcrumb-item>
					</el-breadcrumb>
					<div v-if="this.$router.currentRoute.path == '/home'" class="homeWelcome">欢迎来到微人事!</div>
					<router-view/>
				</el-main>
			</el-container>
		</el-container>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				user: JSON.parse(window.sessionStorage.getItem("user"))
			}
		},
		computed: {
			routes (){
				return this.$store.state.routes;
			}
		},
		methods: {
			commandHandler(cmd) {
				if (cmd == 'logout') {
					// 确认提示
					this.$confirm('此操作将注销登录,是否继续?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						// 给springsecurity中的logout发出get请求
						this.getRequest("/logout")
						// 清空sessionStorage
						window.sessionStorage.removeItem("user")
						// // 清空 store中的routes
						this.$store.commit('initRoutes',[])
						// 跳转到登录页面
						this.$router.replace("/")
					}).catch(() => {
						// 弹出提示信息
						this.$message({
							type: 'info',
							message: '已取消操作'
						})
					})
				}
			}
		}
	}
</script>

<style>
	.homeHeader {
		background-color: #409;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0px 15px;
		box-sizing: border-box;
	}

	.homeHeader .title {
		color: #fff;
		font-size: 40px;
		font-family: 楷体;
	}

	.homeHeader .userInfo {
		color: #FFFFFF;
		cursor: pointer;
		font-family: 微软雅黑;
		font-size: 15px;
	}

	.el-dropdown-link img {
		width: 45px;
		height: 45px;
		border-radius: 25px;
		margin-left: 5px;
	}

	.el-dropdown-link {
		display: flex;
		align-items: center;
	}
	
	.homeWelcome{
		text-align: center;
		font-size: 50px;
		font-family: 楷体;
		color : #409;
		margin-top : 130px
	}
</style>
