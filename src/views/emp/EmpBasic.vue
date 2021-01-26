<template>
	<div>
		<div>
			<div style="margin-top:10px;display:flex;justify-content: space-between;">
				<div>
					<el-input :disabled="nomalSearchDisabled" clearable v-model="keyword" style="width: 350px;" size="mini"
					 prefix-icon="el-icon-search" placeholder="通过员工名搜索员工..." @clear="initEmps"></el-input>
					<el-button :disabled="nomalSearchDisabled" style="margin-left : 10px;" size="mini" type="primary" @click="initEmps"
					 icon="el-icon-search">搜索</el-button>
					<el-button size="mini" type="primary" :icon="showAdvSearchDisabled?'el-icon-folder-opened':'el-icon-folder'"
					 @click="showAdvSearch">高级搜索</el-button>
				</div>
				<div>
					<el-upload :disabled="uploadingDisabled" :show-file-list="false" :before-upload="beforeUpload" :on-success="uploadSuccess"
					 :on-error="uploadError" action="employee/basic/import/" style="display: inline-flex;margin-right: 10px;">
						<el-button :disabled="uploadingDisabled" size="mini" type="success" :icon="uploadButtonIcon">{{uploadButtonText}}</el-button>
					</el-upload>
					<el-button size="mini" type="success" icon="el-icon-download" @click="exportData">导出数据</el-button>
					<el-button size="mini" type="primary" icon="el-icon-plus" @click="showAddView">添加员工</el-button>
				</div>
			</div>
			<transition name="slide-fade">
				<div v-show="showAdvSearchDisabled" style="border: 1px solid #409eff; margin-top: 5px;box-sizing: border-box;border-radius: 5px;margin: 10px 0px;padding: 5px;justify-content: center">
					<el-row>
						<el-col :span="5">
							政治面貌 :
							<el-select v-model="advEmp.politicId" placeholder="请选择" size="mini">
								<el-option v-for="item in politicsstatuses" :key="item.id" :label="item.name" :value="item.id">
								</el-option>
							</el-select>
						</el-col>
						<el-col :span="4">
							民族 :
							<el-select v-model="advEmp.nationId" placeholder="请选择" size="mini">
								<el-option v-for="item in nations" :key="item.id" :label="item.name" :value="item.id">
								</el-option>
							</el-select>
						</el-col>
						<el-col :span="4">
							职位 :
							<el-select v-model="advEmp.posId" placeholder="请选择" size="mini">
								<el-option v-for="item in positions" :key="item.id" :label="item.name" :value="item.id">
								</el-option>
							</el-select>
						</el-col>
						<el-col :span="4">
							职称 :
							<el-select v-model="advEmp.jobLevelId" placeholder="请选择" size="mini">
								<el-option v-for="item in jobLevels" :key="item.id" :label="item.name" :value="item.id">
								</el-option>
							</el-select>
						</el-col>
						<el-col :span="7">
							聘用形式 :
							<el-radio-group v-model="advEmp.engageForm">
								<el-radio label="劳务合同" size="mini"></el-radio>
								<el-radio label="劳动合同" size="mini"></el-radio>
							</el-radio-group>
						</el-col>
					</el-row>
					<el-row style="margin-top: 5px;">
						<el-col :span="5">
							所属部门 :
							<el-popover placement="right" title="请选择部门" width="200" trigger="manual" v-model="popVisible">
								<el-tree default-expand-all :data="allDepts" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
								<div slot="reference" @click="showDeptView()" style="border: 1px solid #DCDFE6;width: 195px;height: 26px;display: inline-flex; border-radius: 5px;font-size: 13px;padding-left: 10px;box-sizing: border-box;align-items: center;">{{deptName}}</div>
							</el-popover>
						</el-col>
						<el-col span="10">
							入职日期 :
							<el-date-picker v-model="advEmp.beginDateScope" size="mini" type="daterange" unlink-panels range-separator="至"
							 start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" :picker-options="pickerOptions">
							</el-date-picker>
						</el-col>
						<el-col :span="5" :offset="4">
							<el-button size="mini">取消</el-button>
							<el-button size="mini" type="primary" icon="el-icon-search" @click="initEmps('advanced')">搜索</el-button>
						</el-col>
					</el-row>
				</div>
			</transition>
		</div>
		<div style="margin-top: 10px;">
			<template>
				<el-table :data="emps" border stripe height="425px" style="width: 100%" size="mini">
					<el-table-column type="selection" fixed>
					</el-table-column>
					<el-table-column prop="name" label="姓名" width="100" fixed align="center">
					</el-table-column>
					<el-table-column prop="workID" label="工号" width="100" align="center">
					</el-table-column>
					<el-table-column prop="gender" label="性别" width="55" align="center">
					</el-table-column>
					<el-table-column prop="birthday" label="出生日期" width="100" align="center">
					</el-table-column>
					<el-table-column prop="idCard" label="身份证号" width="180" align="center">
					</el-table-column>
					<el-table-column prop="wedlock" label="婚姻状况" width="80" align="center">
					</el-table-column>
					<el-table-column prop="nation.name" label="民族" width="80" align="center">
					</el-table-column>
					<el-table-column prop="nativePlace" label="籍贯" width="80" align="center">
					</el-table-column>
					<el-table-column prop="politicsstatus.name" label="政治面貌" align="center">
					</el-table-column>
					<el-table-column prop="phone" label="手机号码" width="120" align="center">
					</el-table-column>
					<el-table-column prop="email" label="电子邮箱" width="180" align="center">
					</el-table-column>
					<el-table-column prop="address" label="联系地址" width="200" align="center">
					</el-table-column>
					<el-table-column prop="department.name" label="所属部门" width="80" align="center">
					</el-table-column>
					<el-table-column prop="position.name" label="职位" width="100" align="center">
					</el-table-column>
					<el-table-column prop="jobLevel.name" label="职称" width="120" align="center">
					</el-table-column>
					<el-table-column prop="jobLevel.titleLevel" label="职称等级" width="80" align="center">
					</el-table-column>
					<el-table-column prop="engageForm" label="聘用形式" align="center">
					</el-table-column>
					<el-table-column prop="beginDate" label="入职日期" width="100" align="center">
					</el-table-column>
					<el-table-column prop="conversionTime" label="转正日期" width="100" align="center">
					</el-table-column>
					<el-table-column prop="beginContract" label="合同起始日期" width="110" align="center">
					</el-table-column>
					<el-table-column prop="endContract" label="合同截止日期" width="110" align="center">
					</el-table-column>
					<el-table-column prop="tiptopDegree" label="最高学历" align="center">
					</el-table-column>
					<el-table-column prop="school" label="毕业院校" width="150" align="center">
					</el-table-column>
					<el-table-column prop="specialty" label="专业" align="center" width="150">
					</el-table-column>
					<el-table-column label="操作" fixed="right" width="140">
						<template slot-scope="scope">
							<el-button style="padding:3px" @click="showUpdateView(scope.row)" size="mini">编辑</el-button>
							<el-button style="padding:3px" type="primary" size="mini">高级</el-button>
							<el-button style="padding:3px" @click="deleteEmp(scope.row.id)" type="danger" size="mini">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
				<el-pagination @current-change="currentChange" @prev-click="currentChange" @next-click="currentChange" layout="prev, pager, next, jumper"
				 :total="total" style="display: flex;justify-content: flex-end;">
				</el-pagination>
			</template>
		</div>
		<el-dialog :title="title" :visible.sync="dialogVisible" @close="closeDialog" width="80%">
			<div>
				<el-form ref="empForm" :model="emp" :rules="rules">
					<el-row :gutter="20">
						<el-col :span="6">
							<el-form-item label="姓名:" prop="name">
								<el-input v-model="emp.name" placeholder="请输入姓名" size="mini" style="width: 150px;"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item label="性别:" prop="gender">
								<el-radio-group v-model="emp.gender">
									<el-radio label="男" size="mini"></el-radio>
									<el-radio label="女" size="mini"></el-radio>
								</el-radio-group>
							</el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item label="出生日期:" prop="birthday">
								<el-date-picker v-model="emp.birthday" size="mini" type="date" placeholder="选择日期" style="width: 150px;">
								</el-date-picker>
							</el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item label="政治面貌:" prop="politicId">
								<el-select v-model="emp.politicId" placeholder="请选择" size="mini" style="width: 150px;">
									<el-option v-for="item in politicsstatuses" :key="item.id" :label="item.name" :value="item.id">
									</el-option>
								</el-select>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter="20">
						<el-col :span="6">
							<el-form-item label="民族:" prop="nationId">
								<el-select v-model="emp.nationId" placeholder="请选择" size="mini" style="width: 150px;">
									<el-option v-for="item in nations" :key="item.id" :label="item.name" :value="item.id">
									</el-option>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item label="籍贯:" prop="nativePlace">
								<el-input placeholder="请输入籍贯" v-model="emp.nativePlace" size="mini" style="width: 150px;"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item label="电子邮箱:" prop="email">
								<el-input placeholder="请输入电子邮箱" v-model="emp.email" size="mini" style="width: 150px;"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item label="联系地址:" prop="address">
								<el-input placeholder="请输入联系地址" v-model="emp.address" size="mini" style="width: 150px;"></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter="20">
						<el-col :span="6">
							<el-form-item label="职位:" prop="posId">
								<el-select v-model="emp.posId" placeholder="请选择" size="mini" style="width: 150px;">
									<el-option v-for="item in positions" :key="item.id" :label="item.name" :value="item.id">
									</el-option>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item label="职称:" prop="jobLevelId">
								<el-select v-model="emp.jobLevelId" placeholder="请选择" size="mini" style="width: 150px;">
									<el-option v-for="item in jobLevels" :key="item.id" :label="item.name" :value="item.id">
									</el-option>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item label="所属部门:" prop="departmentId">
								<el-popover placement="right" title="请选择部门" width="200" trigger="manual" v-model="popVisible">
									<el-tree default-expand-all :data="allDepts" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
									<div slot="reference" @click="showDeptView()" style="border: 1px solid #DCDFE6;width: 150px;height: 26px;display: inline-flex; border-radius: 5px;font-size: 13px;padding-left: 10px;box-sizing: border-box;align-items: center;">{{deptName}}</div>
								</el-popover>
							</el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item label="电话号码:" prop="phone">
								<el-input placeholder="请输入电话号码" v-model="emp.phone" size="mini" style="width: 150px;"></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter="20">
						<el-col :span="6">
							<el-form-item label="工号:">
								<el-input placeholder="请输入工号:" disabled v-model="emp.workID" size="mini" style="width: 150px;"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item label="学历:" prop="tiptopDegree">
								<el-select v-model="emp.tiptopDegree" placeholder="请选择" size="mini" style="width: 150px;">
									<el-option v-for="item in tiptopDegrees" :key="item" :label="item" :value="item">
									</el-option>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item label="毕业院校:" prop="school">
								<el-input placeholder="请输入毕业院校:" v-model="emp.school" size="mini" style="width: 150px;"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item label="专业名称:" prop="specialty">
								<el-input placeholder="请输入专业名称:" v-model="emp.specialty" size="mini" style="width: 150px;"></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter="20">
						<el-col :span="6">
							<el-form-item label="入职日期:" prop="beginDate">
								<el-date-picker v-model="emp.beginDate" size="mini" type="date" placeholder="选择日期" style="width: 123px;">
								</el-date-picker>
							</el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item label="转正日期:" prop="conversionTime">
								<el-date-picker v-model="emp.conversionTime" size="mini" type="date" placeholder="选择日期" style="width: 123px;">
								</el-date-picker>
							</el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item label="合同起始日期:" prop="beginContract">
								<el-date-picker v-model="emp.beginContract" size="mini" type="date" placeholder="选择日期" style="width: 123px;">
								</el-date-picker>
							</el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item label="合同终止日期:" prop="endContract">
								<el-date-picker v-model="emp.endContract" size="mini" type="date" placeholder="选择日期" style="width: 123px;">
								</el-date-picker>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter="20">
						<el-col :span="7">
							<el-form-item label="身份证号码:" prop="idCard">
								<el-input placeholder="请输入专业名称:" v-model="emp.idCard" size="mini" style="width: 150px;"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="聘用形式:" prop="engageForm">
								<el-radio-group v-model="emp.engageForm">
									<el-radio label="劳务合同" size="mini"></el-radio>
									<el-radio label="劳动合同" size="mini"></el-radio>
								</el-radio-group>
							</el-form-item>
						</el-col>
						<el-col :span="9">
							<el-form-item label="婚姻状况:" prop="wedlock">
								<el-radio-group v-model="emp.wedlock">
									<el-radio label="已婚" size="mini"></el-radio>
									<el-radio label="未婚" size="mini"></el-radio>
									<el-radio label="离异" size="mini"></el-radio>
								</el-radio-group>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="addEmployee">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				nomalSearchDisabled: false,
				showAdvSearchDisabled: false,
				uploadButtonText: '导入数据',
				uploadButtonIcon: 'el-icon-upload2',
				uploadingDisabled: false,
				title: '',
				emps: [],
				total: 0,
				page: 1,
				size: 10,
				keyword: '',
				dialogVisible: false,
				popVisible: false,
				emp: {
					"name": "大黄",
					"gender": "男",
					"birthday": "1990-01-01",
					"idCard": "610122199001011256",
					"wedlock": "已婚",
					"nationId": 1,
					"nativePlace": "辽宁",
					"politicId": 13,
					"email": "laowang@qq.com",
					"phone": "18565558897",
					"address": "济南槐荫",
					"departmentId": 5,
					"jobLevelId": 9,
					"posId": 29,
					"engageForm": "劳务合同",
					"tiptopDegree": "本科",
					"specialty": "信息管理与信息系统",
					"school": "深圳大学",
					"beginDate": "2018-01-01",
					"workState": "在职",
					"workID": "00000001",
					"contractTerm": 2.0,
					"conversionTime": "2018-04-01",
					"notWorkDate": null,
					"beginContract": "2018-01-01",
					"endContract": "2020-01-01",
					"workAge": null
				},
				advEmp: {
					politicId: null,
					nationId: null,
					jobLevelId: null,
					posId: null,
					engageForm: null,
					departmentId: null,
					beginDateScope: null
				},
				deptName: '请选择部门',
				tiptopDegrees: [
					"博士", "硕士", "本科", "专科", "高中", "初中"
				],
				politicsstatuses: [],
				nations: [],
				positions: [],
				jobLevels: [],
				defaultProps: {
					children: 'children',
					label: 'name'
				},
				allDepts: [],
				rules: {
					name: [{
						required: true,
						message: '员工姓名不能为空',
						trigger: 'blur'
					}],
					gender: [{
						required: true,
						message: '性别不能为空',
						trigger: 'blur'
					}],
					birthday: [{
						required: true,
						message: '出生日期不能为空',
						trigger: 'blur'
					}],
					idCard: [{
						required: true,
						message: '身份证号码不能为空',
						trigger: 'blur'
					}, {
						pattern: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/,
						message: '身份证格式不正确',
						trigger: 'blur'
					}],
					wedlock: [{
						required: true,
						message: '请选择婚姻状况',
						trigger: 'blur'
					}],
					nationId: [{
						required: true,
						message: '请选择民族',
						trigger: 'blur'
					}],
					nativePlace: [{
						required: true,
						message: '籍贯不能为空',
						trigger: 'blur'
					}],
					politicId: [{
						required: true,
						message: '请选择政治面貌',
						trigger: 'blur'
					}],
					email: [{
						required: true,
						message: '电子邮箱不能为空',
						trigger: 'blur'
					}, {
						type: 'email',
						message: '邮箱格式不合法',
						trigger: 'blur'
					}],
					phone: [{
						required: true,
						message: '手机号码不能为空',
						trigger: 'blur'
					}],
					address: [{
						required: true,
						message: '联系地址不能为空',
						trigger: 'blur'
					}],
					departmentId: [{
						required: true,
						message: '请选择部门',
						trigger: 'blur'
					}],
					jobLevelId: [{
						required: true,
						message: '请选择职称',
						trigger: 'blur'
					}],
					posId: [{
						required: true,
						message: '请选择职位',
						trigger: 'blur'
					}],
					engageForm: [{
						required: true,
						message: '请选择聘用形式',
						trigger: 'blur'
					}],
					tiptopDegree: [{
						required: true,
						message: '学历不能为空',
						trigger: 'blur'
					}],
					specialty: [{
						required: true,
						message: '请填写专业',
						trigger: 'blur'
					}],
					school: [{
						required: true,
						message: '请填写毕业院校',
						trigger: 'blur'
					}],
					beginDate: [{
						required: true,
						message: '请选择入职日期',
						trigger: 'blur'
					}],
					conversionTime: [{
						required: true,
						message: '请选择转正日期',
						trigger: 'blur'
					}],
					beginContract: [{
						required: true,
						message: '请选择合同起始日期',
						trigger: 'blur'
					}],
					endContract: [{
						required: true,
						message: '请选择合同截止日期',
						trigger: 'blur'
					}]
				}
			}
		},
		methods: {
			showAdvSearch() {
				this.showAdvSearchDisabled = !this.showAdvSearchDisabled;
				this.nomalSearchDisabled = this.showAdvSearchDisabled
			},
			uploadError(err, file, fileList) {
				this.uploadingDisabled = false
				this.uploadButtonIcon = "el-icon-upload2"
				this.uploadButtonText = "导入数据"
				this.$message.error(err.msg)
			},
			uploadSuccess(response, file, fileList) {
				this.uploadingDisabled = false
				this.uploadButtonIcon = "el-icon-upload2"
				this.uploadButtonText = "导入数据"
				this.$message.success(response.msg)
				this.initEmps()
			},
			beforeUpload() {
				this.uploadingDisabled = true
				this.uploadButtonIcon = "el-icon-loading"
				this.uploadButtonText = '正在导入'
			},
			exportData() {
				window.open("employee/basic/export");
			},
			deleteEmp(id) {
				this.$confirm('此操作将删除该员工, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.deleteRequest("employee/basic/deleteEmp/" + id).then(
						res => {
							if (res) {
								this.initEmps()
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
			emptyEmp() {
				this.emp = {
					"id": "",
					"name": "",
					"gender": "",
					"birthday": "",
					"idCard": "",
					"wedlock": "",
					"nationId": null,
					"nativePlace": "",
					"politicId": null,
					"email": "",
					"phone": "",
					"address": "",
					"departmentId": null,
					"jobLevelId": null,
					"posId": null,
					"engageForm": "",
					"tiptopDegree": "",
					"specialty": "",
					"school": "",
					"beginDate": "",
					"workState": null,
					"workID": "",
					"contractTerm": 2.0,
					"conversionTime": "",
					"notWorkDate": null,
					"beginContract": "",
					"endContract": "",
					"workAge": null,
				}
			},
			showUpdateView(data) {
				this.dialogVisible = true;
				this.title = "修改员工"
				this.emp = data
				this.deptName = data.department.name
			},
			addEmployee() {
				if (this.emp.id) {
					this.$refs.empForm.validate(
						valid => {
							if (valid) {
								this.putRequest("employee/basic/updateEmp", this.emp).then(
									res => {
										if (res) {
											this.initEmps()
											this.dialogVisible = false;
										}
									}
								);
							}
						}
					)
				} else {
					this.$refs.empForm.validate(
						valid => {
							if (valid) {
								this.postRequest("employee/basic/addEmp", this.emp).then(
									res => {
										if (res) {
											this.initEmps()
											this.dialogVisible = false;
										}
									}
								);
							}
						}
					)
				}
			},
			closeDialog() {
				this.popVisible = false;
			},
			handleNodeClick(data) {
				this.deptName = data.name
				this.emp.departmentId = data.id
				this.advEmp.departmentId = data.id
				this.popVisible = false
			},
			showDeptView() {
				this.popVisible = !this.popVisible
			},
			getMaxWordID() {
				this.getRequest("employee/basic/getworkid").then(
					res => {
						this.emp.workID = res
					}
				);
			},
			initOptions() {
				this.getRequest("system/basic/dept/").then(
					res => {
						if (res) {
							this.allDepts = res
						}
					}
				);
				this.getRequest("employee/basic/getAllPol").then(
					res => {
						this.politicsstatuses = res
					}
				);
				this.getRequest("employee/basic/getAllNations").then(
					res => {
						this.nations = res
					}
				);
				this.getRequest("employee/basic/getAllPositions").then(
					res => {
						this.positions = res
					}
				);
				this.getRequest("employee/basic/getAllJobLevels").then(
					res => {
						this.jobLevels = res
					}
				);
			},
			showAddView() {
				this.title = "添加员工"
				this.dialogVisible = true;
				this.emptyEmp()
				this.getMaxWordID();
			},
			currentChange(cp) {
				this.page = cp;
				this.initEmps()
			},
			initEmps(type) {
				let url = "employee/basic/getAllEmps?";
				if (type && type == 'advanced') {
					if (this.advEmp.politicId) {
						url += '&politicId=' + this.advEmp.politicId;
					}
					if (this.advEmp.nationId) {
						url += '&nationId=' + this.advEmp.nationId;
					}
					if (this.advEmp.jobLevelId) {
						url += '&jobLevelId=' + this.advEmp.jobLevelId;
					}
					if (this.advEmp.posId) {
						url += '&posId=' + this.advEmp.posId;
					}
					if (this.advEmp.engageForm) {
						url += '&engageForm=' + this.advEmp.engageForm;
					}
					if (this.advEmp.departmentId) {
						url += '&departmentId=' + this.advEmp.departmentId;
					}
					if (this.advEmp.beginDateScope) {
						url += '&beginDateScope=' + this.advEmp.beginDateScope;
					}
				} else {
					url += "page=" + this.page + "&size=" + this.size + "&name=" + this.keyword
				}
				this.getRequest(url).then(
					res => {
						if (res) {
							this.emps = res.data
							this.total = res.total
						}
					}
				);
			}
		},
		mounted() {
			this.initEmps()
			this.initOptions()
		}
	}
</script>

<style>
	/* 可以设置不同的进入和离开动画 */
	/* 设置持续时间和动画函数 */
	.slide-fade-enter-active {
		transition: all .8s ease;
	}

	.slide-fade-leave-active {
		transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
	}

	.slide-fade-enter,
	.slide-fade-leave-to

	/* .slide-fade-leave-active for below version 2.1.8 */
		{
		transform: translateX(10px);
		opacity: 0;
	}
</style>
