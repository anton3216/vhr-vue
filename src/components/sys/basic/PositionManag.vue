<template>
	<div>
		<div>
			<el-input class="addPositionInput" placeholder="...添加职位" prefix-icon="el-icon-circle-plus-outline" size="mini"
			 v-model="position.name" @keydown.enter.native="addPosition"></el-input>
			<el-button type="primary" icon="el-icon-plus" size="mini" @click="addPosition">添加职位</el-button>
		</div>
		<div>
			<el-table :data="positions" border style="width: 100%" class="positionTable" @selection-change="handleSelectionChange">
				<el-table-column type="selection"></el-table-column>
				<el-table-column prop="id" label="编号" width="180">
				</el-table-column>
				<el-table-column prop="name" label="姓名" width="180">
				</el-table-column>
				<el-table-column prop="createDate" label="创建日期">
				</el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
						<el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-button @click="deleteMany" type="danger" size="mini" style="margin-top: 10px;" :disabled="multipleSelection.length == 0">批量删除</el-button>
		</div>
		<el-dialog title="修改职位" :visible.sync="dialogVisible" width="30%">
			<div>
				<el-tag type="warning">职位名称</el-tag>
				<el-input v-model="updatePosition.name" size="small" style="width: 200px;margin-left: 10px;"></el-input>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="doUpdatePosition">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				positions: [],
				position: {
					name: ''
				},
				updatePosition: {
					name: ''
				},
				dialogVisible : false,
				multipleSelection: []
			}
		},
		methods: {
			deleteMany (){
				this.$confirm('此操作将永久删除 [ '+this.multipleSelection.length+' ]条数据, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let ids = '?';
					this.multipleSelection.forEach(
						res => {
							ids += "ids=" + res.id + "&"
						}
					);
					
					this.deleteRequest('system/basic/pos/'+ids).then(
						res => {
							if(res){
								this.initPosition()
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
			handleSelectionChange(val){
				this.multipleSelection = val
			},
			// 初始化positions
			initPosition() {
				// 发送get请求
				this.getRequest('/system/basic/pos/').then(
					res => {
						if (res) {
							this.positions = res;
						}
					}
				);
			},
			doUpdatePosition (){
				this.putRequest('system/basic/pos/',this.updatePosition).then(
					res => {
						if(res){
							this.initPosition()
							this.updatePosition.name = '';
							this.dialogVisible = false
						}
					}
				);
			},
			addPosition() {
				this.postRequest('system/basic/pos/', this.position).then(
					res => {
						if (res) {
							// 刷新列表
							this.initPosition();
							this.position.name = '';
						}
					}
				);
			},
			handleEdit(index, row) {
				//console.log(index, row);
				// 数据拷贝
				Object.assign(this.updatePosition,row);
				this.dialogVisible = true;
			},
			handleDelete(index, row) {
				this.$confirm('删除 [ ' + row.name + ' ] 职位, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.deleteRequest('system/basic/pos/' + row.id).then(
						res => {
							if (res) {
								this.initPosition()
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
			this.initPosition()
		}
	}
</script>

<style>
	.addPositionInput {
		width: 250px;
		margin-right: 10px;
	}

	.positionTable {
		margin-top: 15px;
	}
</style>
