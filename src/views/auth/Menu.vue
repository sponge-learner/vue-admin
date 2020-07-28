<template>
	<div>
		<el-card class="box-card">
			<div slot="header">
				<span>分类列表</span>
			</div>
			<el-alert title="Tips" :closable='false' type="warning" description="设置后台管理系统的左侧菜单，目前至多支持两层菜单，三层以上菜单将不会显示。"
			 show-icon>
			</el-alert>
			<!-- 树形组件 -->
			<el-tree ref="tree" :load='loadNode' lazy node-key="id" :default-expanded-keys="[1]" :props="defaultProps">
				<span class="custom-tree-node" slot-scope="{ node, data }">
					<span>{{ node.label }}</span>
					<span>
						<el-popover placement="left" width="100" font-size='20px' trigger="hover">
							<i :class="`el-icon-${data.icon}`" style="font-size: 25px;"></i>
							<el-button slot="reference" type="text" @click.stop='openIconModal(node,data)' :icon="`el-icon-${data.icon}`"
							 :disabled="node.level==0" size="mini">
								图标
							</el-button>
						</el-popover>

						<el-button type="text" @click.stop='openEditModal(node,data)' icon="el-icon-edit" :disabled="node.level==0" size="mini">
							编辑
						</el-button>
						<el-button type="text" @click.stop='openAddModle(node,data)' icon="el-icon-plus" size="mini">
							添加
						</el-button>
						<el-button type="text" icon="el-icon-delete" size="mini" @click.stop="remove(node, data)" :disabled="node.level==1">
							删除
						</el-button>
						<span class="dispalynum">显示序号：<el-tag type="text">
								{{data.order}}
							</el-tag></span>
					</span>
				</span>
			</el-tree>
		</el-card>
		<!-- 图标弹窗 -->
		<el-dialog title="修改图标" :visible.sync="editIconShow" width="79%">
			<ul class="icon_box">
				<div v-for="(item,index) in iconList" :class="{icon_active:item.checked}" @click.stop='iconActive(item,index)'>
					<li :class="`el-icon-${item.name}`"></li>
					<p v-text="item.name"></p>
				</div>
			</ul>
			<el-pagination background layout="prev,pager, sizes, next" :page-size="30" @size-change="handleSizeChange" style="float: right;"
			 :page-sizes="pageNum" :total='300' @current-change='currentchange '>
			</el-pagination>
			<div slot="footer" class="dialog-footer">
				<el-button @click='cancel'>取 消</el-button>
				<el-button type="primary" @click="handleIconEdit('editForm')">保 存</el-button>
			</div>
		</el-dialog>
		<!-- 添加弹窗 -->
		<el-dialog title="添加分类" :visible.sync="insertModalShow">
			<el-form :model="insertForm" :rules="rules" ref='insertForm'>
				<el-form-item label="添加节点" label-width="120px" prop="name">
					<el-input v-model="insertForm.name" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="链接地址" placeholder="指定此菜单的链接地址" prop="path" label-width="120px">
					<el-input v-model="insertForm.path" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="显示顺序" label-width="120px" prop="order">
					<el-input v-model="insertForm.order" placeholder="显示的顺序按照数字从小到大,如2001" autocomplete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click='cancel'>取 消</el-button>
				<el-button type="primary" @click="handleInsertNode('insertForm')">添 加</el-button>
			</div>

		</el-dialog>
		<!-- 编辑弹窗 -->
		<el-dialog title="编辑节点" :visible.sync="editModalShow">
			<el-form :model="editForm" :rules="rules" ref='editForm'>
				<el-form-item label="订单管理" prop="name" label-width="120px">
					<el-input v-model="editForm.name" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="链接地址" label-width="120px" prop="path">
					<el-input v-model="editForm.path" autocomplete="off" placeholder="指定此菜单的链接地址"></el-input>
				</el-form-item>
				<el-form-item label="显示顺序" label-width="120px" prop="order">
					<el-input v-model="editForm.order" autocomplete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click='cancel'>取 消</el-button>
				<el-button type="primary" @click="handleUpdateNode('editForm')">保 存</el-button>
			</div>
		</el-dialog>
	</div>

</template>

<script>
	import New from '@/new.js'
	import { menu } from '@/api/index';
	export default {
		data() {
			return {
				defaultProps: {
					label: 'name'
				},
				insertForm: {
					pId: '',
					name: '',
					path: '',
					order: ''
				},
				editForm: {
					id: '',
					name: '',
					path: '',
				},
				rules: {
					name: [
						{ required: true, message: '请输入菜单名称', trigger: 'blur' },
					],
					path: [
						{ required: false, message: '请输入路径链接', trigger: 'blur' },
					],
					order: [
						{ required: true, message: '请输入菜单顺序', trigger: 'blur' },
					]
				},
				iconEdit: {
					id: '',
					icon: '',
					name: '',
				},
				pageIndex: 1,
				pageSize: 30,
				total: '',
				pageNum: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
				iconList: [],
				isEdit: false,
				nodeData: {}, //节点数据
				node: {}, //节点
				insertModalShow: false,
				editModalShow: false,
				editIconShow: false,
			};
		},
		methods: {
			async loadNode(node, resolve) {
				//node:节点对象
				//resolve:返回下一级节点数据的方法
				if (node.level == 0) {
					let { status, data } = await menu.list({ pId: 0 });
					return resolve(data)
				}
				//父级节点id
				let pId = node.data.id;
				//获取子节点数据
				let { status, data } = await menu.list({ pId });
				if (status) {
					console.log(data);
					return resolve(data);
				}
			},
			//node代表节点对象，data代表的是节点数据
			//添加model
			openAddModle(node, data) {
				// console.log(node,data);
				//父节点的node节点对象
				this.isEdit = false;
				this.insertModalShow = true;
				this.node = node;
				this.nodeData = data;
				this.insertForm.pId = data.id;

			},
			//打开编辑Modal
			openEditModal(node, data) {
				this.isEdit = true;
				this.editModalShow = true;
				this.node = node;
				this.nodeData = data;
				this.editForm = { ...data };
			},
			cancel() {
				this.insertModalShow = false;
				this.editModalShow = false;
				this.editIconShow = false;
				this.editForm = { name: '', pId: '', img: '' };
				this.insertForm = { name: '', id: '', img: '' }
			},
			//编辑节点
			async handleUpdateNode(formname) {
				//1.表单校验
				//2.ajax
				this.$refs[formname].validate(async (valid) => {
					if (valid) {
						let { status, msg } = await menu.editMenu({ ...this.editForm });
						if (status) {
							this.node.data = this.editForm;
							this.$message.success(msg);
						}
						this.cancel();
					} else {
						this.$message.info('未提交成功!');
						return false;
					}
				})

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
					console.log(id);
					let { status, msg } = await menu.delNode({ id })
					console.log(msg);
					if (status) {
						this.$refs.tree.remove({ ...data });
						this.$message.success(msg);
					}
				}).catch(() => {
					this.$message.info('删除失败');
				});
			},
			//插入节点
			handleInsertNode(forname) {
				//1.表单校验
				//2.ajax
				this.$refs[forname].validate(async (valid) => {
					if (valid) {
						let { status, msg, data: { id } } = await menu.addNode({ ...this.insertForm });
						if (status) {
							this.insertForm.id = id;
							this.$refs.tree.append({ ...this.insertForm }, this.node);
						}
						this.cancel();
					} else {
						this.$message.info('未提交成功!');
						return false;
					}
				})
			},
			//打开图标编辑
			currentchange(val) {
				this.pageIndex = val;
				this.iconPage();
			},
			//分页器
			handleSizeChange(val) {
				this.pageSize = val;
				this.iconPage();
			},
			//打开icon模板
			async openIconModal(node, data) {
				this.nodeData = data;
				this.editIconShow = true;
				this.iconPage();
				this.iconEdit.id = data.id;
			},
			//获取图标列表
			async iconPage() {
				let res = await menu.iconList({ pageSize: this.pageSize, pageIndex: this.pageIndex })
				this.total = res.total;
				this.iconList = res.icons
				this.iconList.forEach((item) => {
					item.checked = false;
				})
			},
			//图标点击激活
			iconActive(choose, index) {
				let that = this;
				this.iconList.forEach((item, index) => {
					if (choose == item) {
						item.checked = true;
						that.iconEdit.icon = item.id;
						that.iconEdit.name = item.name;
					} else {
						item.checked = false;
					}
					this.$set(this.iconList, index, item)
				})
			},
			//改变图标
			async handleIconEdit() {
				let { msg, status } = await menu.editIcon({ ...this.iconEdit })
				if (status && this.iconEdit) {
					this.nodeData.icon = this.iconEdit.name;
					let data = { icon_name: this.iconEdit.name, id: this.nodeData.id }
					New.$emit('updata', data)
				}
				this.cancel();
			}
		}
	};
</script>

<style scoped="scoped">
	.el-dialog {
		width: 1220px !important;
	}

	.dispalynum {
		width: 100px;
		display: inline-block;
		font-size: 12px;
	}

	.icon_box {
		display: flex;
		flex-wrap: wrap;
	}

	.icon_box div {
		width: 110px;
		height: 120px;
		text-align: center;
		border: 1px solid #eee;
		border-collapse: collapse;
	}

	.icon_box li {
		width: 60px;
		font-size: 30px;
		padding: 20px;
		text-align: center;
		margin: 0 auto;
	}

	.icon_box div:hover {
		color: #409EFF;
	}

	.custom-tree-node {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 14px;
		padding-right: 8px;
	}

	.el-tree {
		margin-top: 20px;
	}

	.icon_active {
		color: white !important;
		background-color: #409EFF;
	}
</style>
