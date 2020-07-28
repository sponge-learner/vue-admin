<template>
	<div class="list">
		<div class="role">
			<el-card class="box-card">
				<div slot="header" class="clearfix">
					<span>角色列表</span>
					<el-button style="float: right; " @click="handleAdd" icon="el-icon-circle-plus-outline" type="primary" plain>添加角色</el-button>
				</div>
				<template>
					<el-table :data="tableData" :default-sort="{prop: 'date', order: 'descending'}">
						<el-table-column prop="id" label="#" width="50">
						</el-table-column>
						<el-table-column prop="name" label="角色">
							<template slot-scope="scope">
								<el-tag :type="scope.row.name == '超级管理员'?'success':'primary'" disabled>{{scope.row.name}}</el-tag>
							</template>
						</el-table-column>
						<el-table-column prop="address" label="操作">
							<template slot-scope="scope">
								<el-button type="primary" icon="el-icon-edit" @click.stop='openEditModal(scope.$index)' size="mini" plain
								 :disabled="scope.row.name == '超级管理员'"></el-button>
								<el-button type="success" icon="el-icon-delete" size="mini" @click='handleDel(scope.row.id,scope.$index,)'
								 plain :disabled="scope.row.name == '超级管理员'"></el-button>
								<el-button type="primary" icon="el-icon-setting" @click='openConfig(scope.row.id,)' size="mini" plain :disabled="scope.row.name == '超级管理员'"></el-button>
							</template>
						</el-table-column>
					</el-table>
				</template>
			</el-card>
		</div>
		<!-- 配置 -->
		<div class="auth" v-if="roleConfig">
			<el-card class="box-card" v-for="(item,index) in roleConfig" :key='item.id'>
				<div slot="header" class="clearfix" >
					<div class="congfig"><i class="el-icon-collection-tag"></i>
					<span v-text="item.name"></span></div>
					<el-switch v-model="item.checked" @change="allChecked(item,index)" style="float: right;color: #409EFF;">
					</el-switch>
				</div>
				<div v-for="child in item.children" class="text item">
					{{child.name}}
					<el-switch v-model='child.checked' @change="checked(item,child)" style="float: right;">
					</el-switch>
				</div>
			</el-card>

		</div>
		<!-- 修改信息弹窗 -->
		<el-dialog :title="isAdd?'添加角色':'编辑角色'" :visible.sync="editModalShow">
			<el-form :model="editForm" :rules="rules" ref="editForm">
				<el-form-item label="角色名称" label-width="100px" prop="name">
					<el-input v-model="editForm.name" autocomplete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click='cancel'>取 消</el-button>
				<el-button type="primary" @click="submitForm('editForm')">保 存</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import { auth } from '@/api/index'
	import { role } from '@/api/index'
	export default {
		data() {
			return {
				tableData: [],
				role_id: '',
				total: 0,
				editForm: {
					name: '',
					id: ''
				},
				roleConfig: '',
				isAdd: true,
				idx: 0,
				editModalShow: false,
				rules: {
					name: [
						{ required: true, message: '请输入账号', trigger: 'blur' },
					],
				}
			}
		},
		// computed: {
		// 	allchecked: {
		// 		get() {
		// 			return function(item) {
		// 				let allChecked = false;
		// 				item.children.forEach((item) => {
		// 					if (item.checked) {
		// 						allChecked = true;
		// 					}
		// 				})
		// 				return allChecked;
		// 			};
		// 		},
		// 		set(val) {
		// 			return function(item) {
		// 				item.children.forEach((item) => {
		// 					item.checked = val;
		// 					console.log(111)
		// 				})
		// 			};
		// 		}
		// 	}
		// },
		async created() {
			let { status, msg, data } = await auth.list()
			this.tableData = data;
		},
		methods: {
			formatter(row, column) {
				return row.address;
			},
			//进入编辑
			async openEditModal(idx) {

				this.isAdd = false;
				this.idx = idx;
				this.editModalShow = true
				this.editForm = { ...this.tableData[idx] };
			},
			//推出编辑
			cancel() {
				this.editForm = { name: '', id: "" }
				this.editModalShow = false;
			},
			//上传编辑
			async submitForm(formName) {
				this.$refs[formName].validate(async (valid) => {
					if (valid) {
						if (!this.isAdd) {
							//角色修改
							let { status, msg } = await role.edit({ ...this.editForm });
							if (status) {
								this.$message.success(msg);
								this.tableData[this.idx].name = (this.editForm.name);
							}
						} else {
							//角色增加
							let { status, data, msg } = await role.add({ ...this.editForm });
							this.editForm.id = data.id;
							this.tableData.push(this.editForm);
						}
						this.editForm = { name: '', id: "" }
						this.editModalShow = false;
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			//进入编辑状态
			handleAdd() {
				this.isAdd = true;
				this.editModalShow = true
			},
			//删除
			async handleDel(id, idx) {
				//角色删除
				let { status, msg } = await role.del({ id });
				if (status) {
					this.$message.success(msg);
					this.tableData.splice(idx, 1);
				}
			},
			async openConfig(id) {
				this.role_id = id;
				//打开权限配置
				let { status, data, msg } = await auth.config({ id });
				if (status) {
					this.roleConfig = data;
				}
			},
			checked(item, child) {
				console.log(item);
				let status = false;
				item.children.forEach((item) => {
					if (item.checked) {
						status = true;
					}
				})
				item.checked = status;
				this.handleMenu(item);
				this.handleMenu(child);
			},
			allChecked(item, index) {
				var that = item;
				item.children.forEach((item,idx) => {
					item.checked = that.checked;
					this.$set(that.children,idx,item);
					this.handleMenu(item);
				})
				//判断是添加菜单还是删除菜单
				this.handleMenu(item);
			},
			async handleMenu(item) {
				if (item.checked) {
					//获取
					let data = { role_id: this.role_id, menu_id: item.id }
					console.log(data);
					let res = await auth.menuAdd( data );
					console.log(res);
				} else {
					let data = { role_id: this.role_id, menu_id: item.id }
					console.log(data);
					let res = await auth.menuDel(data );
					console.log(res);
				}
			}
		}
	}
</script>

<style scoped="scoped">
	.congfig{
		color: #409EFF;
		display: flex;
		align-items: center;
		font-size: 18px;
	}
	.text {
		font-size: 14px;
	}

	.box-card {
		width: 500px;
	}

	.item {
		margin-bottom: 18px;
	}

	.clearfix:before,
	.clearfix:after {
		display: table;
		content: "";
	}

	.clearfix:after {
		clear: both
	}

	.el-pagination {
		float: right;
		padding: 20px 0;
	}

	.content {
		display: flex;
	}

	.content * {
		padding: 10px;
	}

	.list .el-table {
		box-sizing: border-box;
	}

	.list {
		display: flex;
		justify-content: space-between;
	}


	.auth {
		width: 90%;
	}

	.auth .box-card {
		width: 95%;
		float: right;
	}

	.auth>.box-card:first-child~.box-card {
		margin-top: 10px;
	}
</style>
