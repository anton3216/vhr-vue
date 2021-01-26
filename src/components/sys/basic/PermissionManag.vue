<template>
	<div>
		<div>
			<el-input size="small" placeholder="请输入角色英文名" v-model="role.name" class="input">
				<template slot="prepend">ROLE_</template>
			</el-input>
			<el-input style="margin: 0 10px;" size="small" placeholder="请输入角色中文名" v-model="role.nameZh" class="input"></el-input>
			<el-button size="small" type="primary" @click="addRole">添加角色</el-button>
		</div>
		<div style="margin-top: 10px; width: 600px;">
			<el-collapse v-model="activeName" accordion @change="change">
				<el-collapse-item :title="r.nameZh" :name="r.id" v-for="(r,index) in roles">
					<el-card class="box-card">
						<div>
							<span>可访问的资源</span>
							<el-button icon="el-icon-delete" type="text" style="float: right;color : red;margin-top: -8px;" @click="deleteRole(r)"></el-button>
						</div>
						<div>
							<el-tree ref="tree" :key="index" show-checkbox :data="menus" :props="defaultProps" node-key="id"
							 :default-checked-keys="checkedMenus">
							</el-tree>
							<div style="display: flex;justify-content: flex-end;">
								<el-button size="mini" @click="cancelUpdate">取消修改</el-button>
								<el-button size="mini" type="primary" @click="updateRole(r.id,index)">确认修改</el-button>
							</div>
						</div>
					</el-card>
				</el-collapse-item>
			</el-collapse>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				activeName: '2',
				role: {
					name: '',
					nameZh: ''
				},
				roles: [],
				menus: [],
				checkedMenus: [],
				defaultProps: {
					children: 'children',
					label: 'name'
				}
			}
		},
		methods: {
			cancelUpdate() {
				this.activeName = -1
			},
			updateRole(rid, index) {
				// 获取选中的tree
				let tree = this.$refs.tree[index];
				// 获取选中的mid
				let checkedKeys = tree.getCheckedKeys(true);
				// 拼接请求url
				let url = "system/basic/premission/?rid=" + rid;
				checkedKeys.forEach(
					res => {
						url += "&mids=" + res;
					}
				);

				this.putRequest(url).then(
					res => {
						this.initRole();
						this.activeName = -1
						this.initCheckedMenus(rid)
					}
				);
			},
			change(rid) {
				if (rid) {
					this.initMenus()
					this.initCheckedMenus(rid)
				}
			},
			addRole() {
				if (this.role.name && this.role.nameZh) {
					this.postRequest("system/basic/premission/", this.role).then(
						res => {
							if (res) {
								this.initRole()
							}
						}
					);
				} else {
					this.$message.error("不能添加空数据")
				}
			},
			deleteRole(r) {
				this.$confirm('此操作将删除 [ ' + r.nameZh + ' ] 角色, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.deleteRequest("system/basic/premission/" + r.id).then(
						res => {
							if (res) {
								this.initRole()
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
			initRole() {
				this.getRequest("system/basic/premission/").then(
					res => {
						if (res) {
							this.roles = res
						}
					}
				);
			},
			initMenus() {
				this.getRequest("system/basic/premission/menus").then(
					res => {
						if (res) {
							this.menus = res
						}
					}
				);
			},
			initCheckedMenus(rid) {
				this.getRequest("system/basic/premission/mids/" + rid).then(
					res => {
						if (res) {
							this.checkedMenus = res
						}
					}
				);
			}
		},
		mounted() {
			this.initRole()
		}
	}
</script>

<style>
	.input {
		width: 250px;
	}
</style>
