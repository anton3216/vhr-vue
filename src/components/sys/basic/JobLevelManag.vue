<template>
	<div>
		<div>
			<el-input v-model="jobLevel.name" style="width: 250px;" size="mini" placeholder="添加职称..."></el-input>
			<el-select v-model="jobLevel.titleLevel" placeholder="选择等级" size="mini" style="margin: 0 10px;">
				<el-option v-for="item in titleLevels" :key="item" :label="item" :value="item">
				</el-option>
			</el-select>
			<el-button size="mini" type="primary" @click="addJobLevel">添加职称</el-button>
		</div>
		<div>
			<el-table :data="joblevels" stripe border style="width: 100%;margin: 10px 0px;" @selection-change="handleSelectChange">
				<el-table-column type="selection"></el-table-column>
				<el-table-column prop="id" label="编号" width="180">
				</el-table-column>
				<el-table-column prop="name" label="名称" width="180">
				</el-table-column>
				<el-table-column prop="titleLevel" label="等级">
				</el-table-column>
				<el-table-column prop="createDate" label="创建时间">
				</el-table-column>
				<el-table-column prop="enabled" label="是否启用">
					<template slot-scope="scope">
						<el-tag type="success" v-if="scope.row.enabled">已启用</el-tag>
						<el-tag type="danger" v-else>未启用</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
						<el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-button @click="deleteMany" type="danger" size="small" :disabled="checkedSelection.length==0">批量删除</el-button>
		</div>
		<el-dialog title="修改职称" :visible.sync="dialogVisible" width="30%">
			<div>
				<table>
					<tr>
						<td>
							<el-tag type="warning">名称</el-tag>
						</td>
						<td>
							<el-input style="margin-left: 10px;" size="mini" placeholder="修改职称..." v-model="updatejl.name"></el-input>
						</td>
					</tr>
					<tr>
						<td>
							<el-tag type="warning">等级</el-tag>
						</td>
						<td>
							<el-select v-model="updatejl.titleLevel" placeholder="选择等级" size="mini" style="margin: 0 10px;">
								<el-option v-for="item in titleLevels" :key="item" :label="item" :value="item">
								</el-option>
							</el-select>
						</td>
					</tr>
					<tr>
						<td>
							<el-tag type="warning">是否启用</el-tag>
						</td>
						<td>
							<el-switch style="margin-left: 10px;" v-model="updatejl.enabled" active-text="启用" inactive-text="禁用">
							</el-switch>
						</td>
					</tr>
				</table>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="updateJobLevel">确 定</el-button>
			</span>
		</el-dialog>

	</div>
</template>

<script>
	export default {
		data() {
			return {
				titleLevels: [
					'正高级', '副高级', '中级', '初级'
				],
				value: '',
				joblevels: [],
				jobLevel: {
					name: '',
					titleLevel: ''
				},
				dialogVisible: false,
				updatejl: {
					name: '',
					titleLevel: '',
					enabled: ''
				},
				checkedSelection:[]
			}
		},
		methods: {
			deleteMany(){
				this.$confirm('删除 [ ' + this.checkedSelection.length + ' ] 条数据, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let ids = "?"
					this.checkedSelection.forEach(
						res => {
							ids += "ids=" + res.id + "&"
						}
					);
					this.deleteRequest('system/basic/jl/' + ids).then(
						res => {
							if (res) {
								this.initJobLevel()
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
			handleSelectChange (val){
				this.checkedSelection = val;
			},
			updateJobLevel(){
				this.putRequest("system/basic/jl/",this.updatejl).then(
					res => {
						if(res){
							this.initJobLevel()
							this.updatejl = {
								name: '',
								titleLevel: '',
								enabled: ''
							}
							this.dialogVisible = false
						}
					}
				);
			},
			addJobLevel() {
				this.postRequest("system/basic/jl/", this.jobLevel).then(
					res => {
						if (res) {
							this.initJobLevel()
							this.jobLevel = {
								name: '',
								titleLevel: ''
							}
						}
					}
				);
			},
			initJobLevel() {
				this.getRequest("/system/basic/jl/").then(
					res => {
						if (res) {
							this.joblevels = res;
						}
					}
				);
			},
			handleEdit(index, row) {
				Object.assign(this.updatejl,row)
				this.dialogVisible = true
			},
			handleDelete(index, row) {
				this.$confirm('删除 [ ' + row.name + ' ] 职称, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.deleteRequest('system/basic/jl/' + row.id).then(
						res => {
							if (res) {
								this.initJobLevel()
							}
						}
					);
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			}
		},
		mounted() {
			this.initJobLevel()
		}
	}
</script>
</script>

<style>
</style>
