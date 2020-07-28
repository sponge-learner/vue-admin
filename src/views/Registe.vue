<template>
	<div class="box">
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>注册</span>
			</div>
			<div>
				<el-form :model="registe" :rules="rules" ref="registe" label-width="60px" class="demo-login">
					<el-form-item label="账号" prop="username">
						<el-input v-model="registe.username" prefix-icon="el-icon-user-solid" placeholder="请输入账号"></el-input>
					</el-form-item>
					<el-form-item label="密码" prop="password">
						<el-input v-model="registe.password" placeholder="请输入密码" type="password" prefix-icon="el-icon-key"></el-input>
					</el-form-item>
					<el-form-item label="姓名" prop="fullname">
						<el-input v-model="registe.fullname" placeholder="请输入真实姓名" type="text" prefix-icon="el-icon-postcard"></el-input>
					</el-form-item>
					<el-form-item label="性别" prop="sex">
						<el-radio-group v-model="registe.sex">
							<el-radio label="男">男</el-radio>
							<el-radio label="女">女</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="手机" prop="tel">
						<el-input v-model.number="registe.tel" placeholder="请输入常用手机号!" type="text" prefix-icon="el-icon-phone"></el-input>
					</el-form-item>
					<el-form-item prop="checked">
						<el-checkbox v-model="registe.checked">同意本站用户协议</el-checkbox>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="submitForm('registe')">登录</el-button>
					</el-form-item>
				</el-form>
			</div>
		</el-card>
	</div>
</template>

<script>
	
	import { admin } from '@/api/index.js'
	export default {

		data() {
			return {
				registe: {
					username: '',
					password: '',
					fullname: '',
					tel: "",
					sex: ""
				},
				rules: {
					username: [
						{ required: true, message: '请输入账号', trigger: 'blur' },
					],
					password: [
						{ required: true, message: '请输入密码', trigger: 'blur' },
						{ min: 6, max: 16, message: '请输入6-16位密码', trigger: 'blur' }
					],
					fullname: [
						{ required: true, message: '请输入姓名', trigger: 'blur' },
					],
					tel: [
						{ type: 'number', required: true, message: '请输入手机号', trigger: 'blur' },
						{ pattern: /^0{0,1}(1[3-9][0-9]|15[7-9]|153|156|18[7-9])[0-9]{8}$/, message: '手机号格式不对', trigger: 'blur' }
					],
					checked: [
						{ required: true, message: '请输入同意用户协议', trigger: 'blur' },
					],
					sex: [
						{ required: true, message: '请选择性别', trigger: 'blur' },
					]
				}
			};
		},
		methods: {
			submitForm(formName) {
				this.$refs[formName].validate(async (valid) => {
					if (valid) {
						let res = await admin.registe({...this.registe});
						if (res.status) {
							this.$router.replace('/login')
						}
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			resetForm(formName) {
				this.$refs[formName].resetFields();
			}
		}
	}
</script>

<style scoped="scoped" lang="less">
	.box {
		width: 100%;
		height: 100vh;
		background: url(../assets/img/login-bg.jpg);
		background-size: cover;
	}

	.box-card {
		width: 340px;
		background-color: white;
		position: absolute;
		right: 100px;
		top: 50%;
		transform: translateY(-50%);
	}
</style>
