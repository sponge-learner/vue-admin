<template>
	<div class="list">
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>用户列表</span>
			</div>
			<template>
				<el-table :data="tableData" style="width: 100%" :default-sort="{prop: 'date', order: 'descending'}">
					<el-table-column prop="id" label="#" width="70" sortable>
					</el-table-column>
					<el-table-column prop="avatar" label="头像" width="70">
						<template scope="scope">
							<el-avatar :src="scope.row.avatar"  height="75"></el-avatar>
							<!-- <img :src="scope.row.avatar" height="50" class="head_pic" /> -->
						</template>
					</el-table-column>
					<el-table-column prop="username" label="账号">
					</el-table-column>
					<el-table-column prop="fullname" label="姓名">
					</el-table-column>
					<el-table-column prop="sex" label="性别">
					</el-table-column>
					<el-table-column prop="tel" label="手机">
					</el-table-column>
					<el-table-column prop="role_name" label="角色" sortable>
						<template slot-scope="scope">
							<el-tag :type="scope.row.role == 1?'success':'primary'" disabled>{{scope.row.role_name}}</el-tag>
						</template>
					</el-table-column>
					<el-table-column prop="login_count" label="上次登录" sortable>
					</el-table-column>
					<el-table-column prop="login_time" label="登录次数" sortable>
					</el-table-column>
					<el-table-column label="操作">
						<template slot-scope="scope">
							<el-button type="primary" icon="el-icon-edit" plain size="mini" @click.stop='openEditModal(scope.$index)'></el-button>
							<el-button type="success" icon="el-icon-delete" plain size="mini" @click.stop='handeldel(scope.row.id,scope.$index)'></el-button>
						</template>
					</el-table-column>
				</el-table>
			</template>
		</el-card>
		<!-- 修改信息弹窗 -->
		<el-dialog title="修改信息" :visible.sync="editModalShow">
			<el-form :model="editForm" ref='editForm' :rules="rules">
				<el-form-item label="姓名" prop="fullname" label-width="120px">
					<el-input v-model="editForm.fullname" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="性别" prop="sex" label-width="120px">
					<el-radio-group v-model="editForm.sex">
						<el-radio label="男">男</el-radio>
						<el-radio label="女">女</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="电话" prop="tel" label-width="120px">
					<el-input v-model="editForm.tel" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="权限" prop="role" label-width="120px">
					<el-select v-model="editForm.role" @change='roleName' >
						<el-option v-for="item in rolelist" :value="item.id"  :label="item.name" :key='item.id'></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="头像" label-width="120px" prop="avatar">
					<Upload ref='upload' :oldurl='oldurl' :url='editForm.avatar' @success='uploadSuccess($event)' @remove='removeurl'></Upload>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click='cancel'>取 消</el-button>
				<el-button type="primary" @click="onSubmit('editForm')">保 存</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import { role } from '@/api/index'
	import Upload from '@/components/Upload.vue'
	import { user } from '@/api/index'
	import { admin } from '@/api/index'
	export default {
		components: {
			Upload
		},
		data() {
			return {
				tableData: [],
				total: 0,
				editModalShow: false,
				rolelist: [],
				editForm: {
					name: '',
					avatar: '',
					tel: '',
					role_name: '',
					email: '',
					sex: "",
					role: ''
				},
				oldurl: '',
				rules: {
					username: [
						{ required: true, message: '请输入账号', trigger: 'blur' },
					],
					role_name: [
						{ required: true, message: '请输入角色', trigger: 'blur' },
					],
					fullname: [
						{ required: true, message: '请输入姓名', trigger: 'blur' },
					],
					tel: [
						{ required: true, message: '请输入手机号', trigger: 'blur' },
						{ pattern: /^0{0,1}(1[3-9][0-9]|15[7-9]|153|156|18[7-9])[0-9]{8}$/, message: '手机号格式不对', trigger: 'blur' }
					],
					avatar: [
						{ required: true, message: '请选择头像', trigger: 'blur' },
					],
					sex: [
						{ required: true, message: '请选择性别', trigger: 'blur' },
					]
				},
				idx: 0,
			}
		},
		async created() {

			let { status, data, msg } = await user.list()
			this.tableData = data;

		},
		methods: {
			removeurl() {
				this.editForm.avatar = '';
			},
			uploadSuccess(res) {
				this.editForm.avatar = res.src;
			},
			formatter(row, column) {
				return row.address;
			},
			async onloadList(n) {
				let res = await goods.list({ pageSize: 4, pageIndex: n, sortByPrice: 'ASC' })
				this.tableData = res.goods;
				this.total = res.total * 10 / 4;
			},
			currentchange(val) {
				this.onloadList(val);
			},
			async openEditModal(idx) {
				this.idx = idx;
				this.editModalShow = true
				this.editForm = { ...this.tableData[idx] };

				let new_form = { ...this.editForm }
				this.oldurl = new_form.avatar;
				console.log(this.oldurl);

				//获取角色列表  下拉框
				let { data, status } = await role.list();
				this.rolelist = data;
			},
			cancel() {
				this.editModalShow = false;
			},
			onSubmit(formName) {
				this.$refs[formName].validate(async (valid) => {
					if (valid) {
						let { status, msg } = await admin.updata({ ...this.editForm });
						if (status) {
							this.$message.success(msg);
							// this.tableData[this.idx] = { ...this.editForm };
							this.$refs.upload.handleRemove();
							this.$set(this.tableData, this.idx, this.editForm)
							this.editModalShow = false;
						}
					} else {
						this.$message.info('未提交成功!');
						return false;
					}
				});
			},
			roleName() {
				this.rolelist.forEach((item)=>{
					if (item.id == this.editForm.role) {
						this.editForm.role_name = item.name;
					}
				})
			},
			async handeldel(id, idx) {
				this.$confirm('此操作将永久删除用户信息,是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(async () => {
					this.$message({
						type: 'success',
						message: '删除成功'
					});
					let { status, msg } = await user.del({ id });
					if (status) {
						this.tableData.splice(idx, 1);
						this.$message.success(msg);
					}
				}).catch(() => {
					this.$message.info('删除失败');
				});
			}

		}
	}
</script>

<style scoped="scoped">
	.text {
		font-size: 14px;
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
</style>
