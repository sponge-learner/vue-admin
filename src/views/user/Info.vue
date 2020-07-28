<template>
	<div class="list">
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>账户信息</span>
			</div>
			<div class="infoEdit">
				<el-form ref="form" :rules="rules" :model="form" label-width="100px">
					<el-form-item label="账户" prop="username">
						<el-input v-model="form.username" disable></el-input>
					</el-form-item>
					<el-form-item label="姓名" prop="fullname">
						<el-input v-model="form.fullname" disable></el-input>
					</el-form-item>
					<el-form-item label="权限" prop="role">
						<el-select v-model="form.role">
							<el-option v-for="item in rolelist" :label='item.name' :value="item.id" :key="item.id"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="性别" prop="sex">
						<el-radio-group v-model="form.sex">
							<el-radio label="男">男</el-radio>
							<el-radio label="女">女</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="手机" prop="tel">
						<el-input v-model.number="form.tel" type="text"></el-input>
					</el-form-item>
					<el-form-item label="头像" prop="avatar">
						<Upload ref='upload' :oldurl='oldurl' :url='form.avatar' @success='uploadSuccess($event)' @remove='removeurl'></Upload>
					</el-form-item>
					<!-- <el-form-item label="头像2">
						<uploadSelf ref='upload' @success='successupload($event)' :oldurl='form.avatar' @remove='removeurl' :url='form.avatar'></uploadSelf>
						<button type="button" @click="up">提交</button>
					</el-form-item> -->
					<el-form-item>
						<el-button type="primary" @click="onSubmit('form')">保存修改</el-button>
						<el-button>取消</el-button>
					</el-form-item>
				</el-form>
			</div>
		</el-card>
	</div>
</template>

<script>
	import { role } from '@/api/index'
	// import uploadSelf from '@/components/uploadSelf.vue'
	import Upload from '@/components/Upload.vue'
	import { user } from '@/api/index'
	import { admin } from '@/api/index'
	export default {
		components: {
			Upload,
			// uploadSelf
		},
		data() {
			return {
				form: {
					username: '',
					fullname: '',
					sex: '',
					tel: ''，
					avatar: '',
					role: '',
					email: '',
				},
				oldurl:'',
				rolelist: [],
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
			}
		},
		async created() {			
			var id = sessionStorage.id;
			let { data } = await admin.info({ id });
			this.form = data;

			let res = await role.list();
			this.rolelist = res.data;
		},
		methods: {
			successupload(img) {
				this.form.avatar = img;
			},
			up() {
				this.$refs.upload.upload().then(function(res) {
					console.log(res);
				})
			},
			removeurl() {
				let new_form = {...this.form}
				this.oldurl = new_form.avatar;
				console.log(this.oldurl);		
				this.form.avatar = '';
			},
			uploadSuccess(res) {
				this.form.avatar = res.src;
			},
			onSubmit(formName) {
				this.$refs[formName].validate(async (valid) => {
					if (valid) {
						let { status, msg } = await admin.updata({ ...this.form });
						if (status) {
							this.$message.success(msg);
							this.$refs.upload.handleRemove();
						}
					} else {
						this.$message.info('未提交成功!');
						return false;
					}
				});
			}
		}
	}
</script>

<style scoped="scoped">
	.infoEdit {
		padding: 0 150px;
	}

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
