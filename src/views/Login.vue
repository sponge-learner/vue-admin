<template>
	<div class="box">

		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>登录</span>
			</div>
			<div>
				<el-form :model="login" :rules="rules" ref="login" label-width="60px" class="demo-login">
					<el-form-item label="账号" prop="username">
						<el-input v-model="login.username"  prefix-icon="el-icon-user-solid" placeholder="请输入账号"></el-input>
					</el-form-item>
					<el-form-item label="密码"  prop="password">
						<el-input v-model="login.password" placeholder="请输入密码" type="password" prefix-icon="el-icon-key"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="submitForm('login')">登录</el-button>
					</el-form-item>
				</el-form>
				<footer>
					<router-link to='/registe'>注册账号</router-link>
					<router-link to=''>忘记密码</router-link>
				</footer>
			</div>
		</el-card>


	</div>
</template>

<script>
	import axios from 'axios'
	export default {
		data() {
			return {
				login: {
					username: '',
					password: ''
				},
				rules: {
					username: [
						{ required: true, message: '请输入账号', trigger: 'blur' },
					],
					password: [
						{ required: true, message: '请数组密码', trigger: 'change' }
					]
				}
			};
		},
		methods: {
			submitForm(formName) {
				this.$refs[formName].validate(async (valid) => {
					if (valid) {
						let {status,msg,data:{id,token}} = await axios.post('/api/admin/login',{...this.login})
						console.log(id);		
						sessionStorage.id = id;
						sessionStorage.token = token;
						let { redirect } = this.$route.query;
						if (redirect) {
							this.$router.push(redirect);
						}else{
							this.$router.replace('/goods/list');
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
	footer{
		display: flex;
		justify-content: space-between;
	}
	footer a{
		color: black;
		list-style-type: none;
		text-decoration: none;
	}
</style>
