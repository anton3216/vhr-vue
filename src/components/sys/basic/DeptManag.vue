<template>
	<div style="width:500px">
		<el-input placeholder="输入部门名称查找" v-model="filterText" size="mini">
		</el-input>
		<el-tree class="filter-tree" :data="depts" :props="defaultProps" :filter-node-method="filterNode" ref="tree"
		 :expand-on-click-node="false">
			<span class="custom-tree-node" slot-scope="{ node, data }" style="display: flex;justify-content: space-between;width: 100%;">
				<span>{{ node.label }}</span>
				<span>
					<el-button type="primary" style="padding:2px" size="mini" @click="() => showAddDeptView(data)">
						添加部门
					</el-button>
					<el-button type="danger" style="padding:2px" size="mini" @click="() => removeDept(node, data)">
						删除部门
					</el-button>
				</span>
			</span>
		</el-tree>
		<el-dialog title="添加部门" :visible.sync="dialogVisible" width="30%">
			<div>
				<table>
					<tr>
						<td>
							<el-tag type="warning">上级部门</el-tag>
						</td>
						<td>
							<span style="margin-left: 10px;">{{parentDeptName}}</span>
						</td>
					</tr>
					<tr>
						<td>
							<el-tag type="warning">名称</el-tag>
						</td>
						<td>
							<el-input style="margin-left: 10px;" size="mini" placeholder="添加部门..." v-model="dept.childrenDept.name"></el-input>
						</td>
					</tr>
					<tr>
						<td>
							<el-tag type="warning">是否启用</el-tag>
						</td>
						<td>
							<el-switch style="margin-left: 10px;" v-model="dept.childrenDept.enabled" active-text="启用" inactive-text="禁用">
							</el-switch>
						</td>
					</tr>
				</table>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="addDept">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				filterText: '',
				depts: [],
				defaultProps: {
					children: 'children',
					label: 'name'
				},
				dialogVisible: false,
				dept: {
					childrenDept: {
						name: '',
						enabled: '',
						parentId: ''
					},
					parentDept: {
						id: '',
						isParent: '',
						depPath: ''
					}
				},
				parentDeptName: ''
			};
		},
		watch: {
			filterText(val) {
				this.$refs.tree.filter(val);
			}
		},
		methods: {
			filterNode(value, data) {
				if (!value) return true;
				return data.name.indexOf(value) !== -1;
			},
			initDepts() {
				this.getRequest("system/basic/dept/").then(
					res => {
						if (res) {
							this.depts = res
						}
						this.parentDeptName = '';
					}
				);
			},
			showAddDeptView(data) {
				this.dept.parentDept = {
					id: data.id,
					isParent: data.isParent,
					depPath: data.depPath
				}
				this.dept.childrenDept = {
					parentId: data.id
				}
				this.parentDeptName = data.name
				this.dialogVisible = true
			},
			removeDept(data) {
				if (data.data.children.length == 0) {
					this.$confirm('此操作删除 [ ' + data.data.name + ' ] 部门, 是否继续?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						this.deleteRequest("system/basic/dept/" + data.data.id + "/" + data.data.parentId).then(
							res => {
								if (res) {
									this.initDepts()
								}
							}
						);
					}).catch(() => {
						this.$message({
							type: 'info',
							message: '已取消删除'
						});
					});
				}else{
					this.$message.error("该部门有子部门,不能直接删除");
				}
			},
			addDept() {
				this.postRequest("system/basic/dept/", this.dept).then(
					res => {
						if (res) {
							this.initDepts()
							this.dialogVisible = false
							this.dept = {
								childrenDept: {
									name: '',
									enabled: '',
									parentId: ''
								},
								parentDept: {
									id: '',
									isParent: '',
									depPath: ''
								}
							}
						}
					}
				);
			}
		},
		mounted() {
			this.initDepts()
		}
	};
</script>

<style>
</style>
