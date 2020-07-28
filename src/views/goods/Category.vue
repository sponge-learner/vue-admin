<template>
	<div>
		<el-card class="box-card">
			<div slot="header">
				<span>分类列表</span>
			</div>
			<!-- 树形组件 -->
			<el-tree ref="tree" :load='loadNode' lazy node-key="id" :default-expanded-keys="[1]" :props="defaultProps">
				<span class="custom-tree-node" slot-scope="{ node, data }">
					<span>{{ node.label }}</span>
					<span>
						<el-button type="text" @click.stop='openEditModal(node,data)' icon="el-icon-edit" :disabled="node.level==0" size="mini">
							编辑
						</el-button>
						<el-button type="text" @click.stop='openAddModle(node,data)' icon="el-icon-plus" size="mini">
							添加
						</el-button>
						<el-button type="text" icon="el-icon-delete" size="mini" @click.stop="remove(node, data)" :disabled="node.level==1">
							删除
						</el-button>
					</span>
				</span>
			</el-tree>
		</el-card>
		<!-- 添加弹窗 -->
		<el-dialog title="添加分类" :visible.sync="insertModalShow">
			<el-form :model="insertForm">
				<el-form-item label="分类名称" label-width="120px">
					<el-input v-model="insertForm.name" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="商品主图" prop="img_lg" label-width="120px">
					<div class="box_del" @mouseenter='isshow = true' @mouseleave='isshow = false'>
						<el-upload class="avatar-uploader" action="/api/upload/avatar" :on-error='handleAvatarError' :show-file-list="false"
						 :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
							<img v-if="insertForm.img" :src="insertForm.img" class="avatar">
							<i v-else class="el-icon-plus avatar-uploader-icon"></i>
						</el-upload>
						<div class="deleteurl" @click="removeUrl" v-if="insertForm.img&&isshow">
							<i class="el-icon-delete"></i>
						</div>
					</div>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click='cancel'>取 消</el-button>
				<el-button type="primary" @click='handleInsertNode'>添 加</el-button>
			</div>
		</el-dialog>
		<!-- 编辑弹窗 -->
		<el-dialog title="编辑分类" :visible.sync="editModalShow">
			<el-form :model="editForm">
				<el-form-item label="分类名称" label-width="120px">
					<el-input v-model="editForm.name" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="商品主图" prop="img_lg" label-width="120px">
					<div class="box_del" @mouseenter='isshow = true' @mouseleave='isshow = false'>
						<el-upload class="avatar-uploader" action="/api/upload/avatar" :show-file-list="false" :on-success="handleAvatarSuccess"
						 :before-upload="beforeAvatarUpload">
							<img v-if="editForm.img" :src="editForm.img" class="avatar">
							<i v-else class="el-icon-plus avatar-uploader-icon"></i>
						</el-upload>
						<div class="deleteurl" @click="removeUrl" v-if="editForm.img&&isshow">
							<i class="el-icon-delete"></i>
						</div>
					</div>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click='cancel'>取 消</el-button>
				<el-button type="primary" @click='handleUpdateNode'>保 存</el-button>
			</div>
		</el-dialog>
	</div>

</template>

<script>
	import { goods } from '@/api/index';
	export default {
		data() {
			return {
				defaultProps: {
					label: 'name'
				},
				insertForm: {
					name: '',
					pId: '',
					img: ''
				},
				editForm: {
					name: '',
					id: '',
					img: ''
				},
				isshow: false,
				imageUrl: '',
				isEdit: false,
				nodeData: {}, //节点数据
				node: {}, //节点
				insertModalShow: false,
				editModalShow: false,
			};
		},
		methods: {
			async loadNode(node, resolve) {
				//node:节点对象
				//resolve:返回下一级节点数据的方法
				if (node.level == 0) {
					let { status, data } = await goods.subcate({ pId: 0 });
					return resolve(data)
				}
				//父级节点id
				let pId = node.data.id;
				//获取子节点数据
				let { status, data } = await goods.subcate({ pId });
				if (status) {
					return resolve(data);
				}
			},
			//node代表节点对象，data代表的是节点数据
			//打开添加model
			openAddModle(node, data) {
				// console.log(node,data);
				//父节点的node节点对象
				this.isEdit = false;
				this.insertModalShow = true;
				this.node = node;
				this.nodeData = data;
				this.insertForm.pId = data.id;
			},
			//插入节点
			async handleInsertNode() {
				//1.表单校验
				//2.ajax
				if (this.insertForm.img == "" && this.insertForm.name == "") {
					this.$message.error('请填写完整信息');
					return false;
				}
				let { status, msg, data: { id } } = await goods.addCategorySub({ ...this.insertForm });
				if (status) {
					this.insertForm.id = id;
					this.$refs.tree.append({ ...this.insertForm }, this.node);
				}
				this.cancel();
			},
			//打开编辑Modal
			openEditModal(node, data) {
				this.editModalShow = true;
				this.isEdit = true;
				this.node = node;
				this.nodeData = data;
				this.editForm = { ...data };
			},
			//退出蒙版
			cancel() {
				this.insertModalShow = false;
				this.editModalShow = false;
				this.editForm = { name: '', pId: '', img: '' };
				this.insertForm = { name: '', id: '', img: '' }
			},
			//编辑节点
			async handleUpdateNode() {
				if (this.editForm.img == "" && this.editForm.name == "") {
					this.$message.error('请填写完整信息');
					return false;
				}
				let { status, msg } = await goods.updateCategory({ ...this.editForm });
				if (status) {
					this.node.data = this.editForm;
					this.$message.success(msg)
				}
				this.cancel()
			},
			//上传失败
			handleAvatarError(error) {
				const result = JSON.parse(error.message);
					// 导入Excel失败提示信息
				this.$message.error(result.msg);
			},
			//上传成功
			handleAvatarSuccess(res, file) {

				this.imageUrl = URL.createObjectURL(file.raw);
				let { msg, status, src } = res;
				if (this.isEdit) {
					this.editForm.img = src;
					return false;
				}
				this.insertForm.img = src;
				console.log(this.insertForm.img);
			},
			beforeAvatarUpload(file) {
				const isJPG = file.type === 'image/jpeg';
				const isLt2M = file.size / 1024 / 1024 < 2;

				if (!isJPG) {
					this.$message.error('上传头像图片只能是 JPG 格式!');
				}
				if (!isLt2M) {
					this.$message.error('上传头像图片大小不能超过 2MB!');
				}
				return isJPG && isLt2M;
			},
			//删除图片
			removeUrl() {
				if (this.isEdit) {
					this.editForm.img = '';
					return false;
				}
				this.insertForm.img = '';
			},
			//删除节点
			remove(node, data) {
				this.$confirm('此操作将永久删除该文件,是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(async () => {
					this.$message({
						type: 'success',
						message: '删除成功'
					});
					console.log(data.id);
					var id = data.id
					let { status, msg } = await goods.del({ id })
					if (status) {
						this.$refs.tree.remove({ ...data });
						this.$message.success(msg);
					}
				}).catch(() => {
					this.$message.info('删除失败');
				});
			}
		}
	};
</script>

<style scoped="scoped">
	.box_del {
		display: inline-block;
		width: 150px;
		height: 150px;
		border: 1px dashed #999999;
		box-sizing: border-box;
		border-radius: 6px;
	}

	.deleteurl {
		height: 148px;
		width: 148px;
		background-color: rgba(0, 0, 0, 0.5);
		position: absolute;
		top: 0;
		display: flex;
		justify-content: center;
	}

	.el-icon-delete {
		line-height: 148px;
		color: white;
		text-align: center;
		font-size: 25px;
	}

	.custom-tree-node {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 14px;
		padding-right: 8px;
	}

	.avatar-uploader .el-upload {

		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
	}

	.avatar-uploader-icon {
		font-size: 28px;
		color: #8c939d;
		width: 148px;
		height: 148px;
		line-height: 148px;
		text-align: center;
	}

	.avatar {
		width: 148px;
		height: 148px;
		display: block;
	}


	.el-row {
		background-color: #f5f5f5;
		padding: 10px;
		margin-bottom: 10px;
	}

	.el-upload {
		display: inline-block;
		text-align: center;
		cursor: pointer;
		outline: 0;

	}
</style>
