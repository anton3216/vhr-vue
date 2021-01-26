<template>
	<div>
		<div style="margin-top: 10px;display: flex;justify-content: center;">
			<el-input v-model="keywords" style="width: 400px;margin-right: 10px;" prefix-icon="el-icon-search" size="mini"
			 placeholder="按照用户名查找..." clearable @clear="initHrs"></el-input>
			<el-button @click="hrSearch()" size="mini" type="primary" icon="el-icon-search">查找</el-button>
		</div>
		<div style="margin-top: 10px;display: flex;justify-content: space-around;flex-wrap: wrap;">
			<el-card class="box-card" v-for="(hr,index) in hrs" :key="index" style="width: 350px;margin-bottom: 20px;">
				<div slot="header" class="clearfix">
					<span>{{hr.name}}</span>
					<el-button @click="deleteHr(hr)" style="float: right; padding: 3px 0;color:orangered" type="text" icon="el-icon-delete"></el-button>
				</div>
				<div style="display: flex;justify-content: space-around;flex-wrap: wrap;">
					<img :src="hr.userface" :title="hr.name" :alt="hr.name" style="width: 80px;height: 80px;border-radius: 80px;" />
				</div>
				<div style="margin-top: 20px;">
					<div style="font-size: 14px;color: #409eff;">
						<table class="hrtable">
							<tr>
								<td>用户名 : </td>
								<td>{{hr.name}}</td>
							</tr>
							<tr>
								<td>电话号码 : </td>
								<td>{{hr.telephone}}</td>
							</tr>
							<tr>
								<td>手机号码 : </td>
								<td>{{hr.phone}}</td>
							</tr>
							<tr>
								<td>地址 : </td>
								<td>{{hr.address}}</td>
							</tr>
							<tr>
								<td>用户状态 : </td>
								<td>
									<el-switch @change="changeEnabled(hr)" v-model="hr.enabled" active-color="#13ce66" inactive-color="#ff4949" active-text="启用" inactive-text="禁用">
									</el-switch>
								</td>
							</tr>
							<tr>
								<td>用户角色 : </td>
								<td>
									<div>
										<el-tag size="mini" type="success" v-for="(role,indexj) in hr.roles" :key="indexj">{{role.nameZh}}</el-tag>
										<el-popover placement="bottom" title="角色列表" width="200" trigger="click" @show="showPop(hr)" @hide="hidePop(hr)">
											<el-button slot="reference" icon="el-icon-more" type="text"></el-button>
											<template>
												<el-select multiple v-model="selectedRoles" placeholder="请选择角色">
													<el-option v-for="(r,indexk) in roles" :key="indexk" :label="r.nameZh" :value="r.id"></el-option>
												</el-select>
											</template>
										</el-popover>
									</div>
								</td>
							</tr>
						</table>
					</div>
				</div>
			</el-card>
		</div>
	</div>
</template>
<div> :
	<div>

	</div>
</div>
<script>
	export default {
		data() {
			return {
				keywords: '',
				hrs: [],
				roles: [],
				selectedRoles: [],
			}
		},
		methods: {
			initHrs() {
				this.getRequest("system/hr/?keywords="+this.keywords).then(
					res => {
						if (res) {
							this.hrs = res
						}
					}
				);
			},
			initRoles() {
				this.getRequest("system/hr/roles").then(
					res => {
						if (res) {
							this.roles = res
						}
					}
				);
			},
			showPop(hr) {
				this.selectedRoles = []
				// 展示所有角色
				this.initRoles()
				// 获得当前hr对象的roles
				let roles = hr.roles;
				// 赋值给selectedRoles
				roles.forEach(
					role => {
						this.selectedRoles.push(role.id)
					}
				);
			},
			deleteHr(hr) {
				this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.deleteRequest("system/hr/" + hr.id).then(
						res => {
							if (res) {
								this.initHrs();
							}
						}
					);
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			},
			changeEnabled(hr){
				delete hr.roles;
				this.putRequest("system/hr/",hr).then(
					res => {
						if (res) {
							this.initHrs();
						}
					}
				);
			},
			hidePop(hr){
				let url = "system/hr/updateHrRole?hrid="+hr.id;
				this.selectedRoles.forEach(
					rid=>{
						url+= "&rids="+rid;
					}
				);
				this.putRequest(url).then(
					res => {
						if (res) {
							this.initHrs();
						}
					}
				);
			},
			hrSearch(){
				this.initHrs()
			}
		},
		mounted() {
			this.initHrs()
		}
	}
</script>

<style>
	.hrtable td {
		width: 50%;
	}
</style>
