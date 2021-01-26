<template>
	<div>
		<el-tabs v-model="activeName" type="border-card">
			<el-tab-pane label="部门管理" name="DeptManag">
				<DeptManag></DeptManag>
			</el-tab-pane>
			<el-tab-pane label="职位管理" name="PositionManag">
				<PositionManag></PositionManag>
			</el-tab-pane>
			<el-tab-pane label="职称管理" name="JobLevelManag">
				<JobLevelManag></JobLevelManag>
			</el-tab-pane>
			<el-tab-pane label="奖惩规则" name="EcManag">
				<EcManag></EcManag>
			</el-tab-pane>
			<el-tab-pane label="权限组" name="PermissionManag">
				<PermissionManag></PermissionManag>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
	// 导入组件
	import DeptManag from '../../components/sys/basic/DeptManag.vue'
	import PositionManag from '../../components/sys/basic/PositionManag.vue'
	import JobLevelManag from '../../components/sys/basic/JobLevelManag.vue'
	import EcManag from '../../components/sys/basic/EcManag.vue'
	import PermissionManag from '../../components/sys/basic/PermissionManag.vue'
	export default {
		data() {
			return {
				activeName: 'DeptManag'
			}
		},
		components: { //注册组件
			// 默认注册是键值对,如果键和值一样 只写一个即可
			"DeptManag": DeptManag,
			"PositionManag": PositionManag,
			"JobLevelManag": JobLevelManag,
			"EcManag": EcManag,
			"PermissionManag": PermissionManag
		}
	}
</script>

<style>
</style>
