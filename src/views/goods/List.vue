<template>
	<div class="list">
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>商品列表</span>
			</div>
			<template>
				<el-table :data="tableData" style="width: 100%" :default-sort="{prop: 'date', order: 'descending'}">
					<el-table-column prop="name" label="商品名称" width="300">
						<template scope="scope">
							<div class="content">
								<img :src="scope.row.img_md" height="75" class="head_pic" />
								<div>{{scope.row.name}}</div>
							</div>
						</template>
					</el-table-column>
					<el-table-column prop="price" label="价格" sortable>
					</el-table-column>
					<el-table-column prop="articleNo" label="库存" sortable>
					</el-table-column>
					<el-table-column prop="create_time" label="发布时间" sortable>
					</el-table-column>
					<el-table-column prop="address" label="操作">
						<template slot-scope="scope">
							<el-link :href="`#/goods/edit/${scope.row.id}`">
								<el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
							</el-link>
							<el-button type="primary" icon="el-icon-delete" size="mini" style="margin-left: 20px;" @click='handelDel(scope.row.id,scope.$index)'>删除</el-button>
						</template>
					</el-table-column>
				</el-table>
			</template>
			<!-- <el-pagination
			      @size-change="handleSizeChange"
			      @current-change="currentchange"
			      
			      :page-sizes="[100, 200, 300, 400]"
			      :page-size="100"
			      layout="total, sizes, prev, pager, next, jumper"
			      :total="total">
			    </el-pagination> -->
			<el-pagination background layout="prev,pager, sizes, next" :page-size="4" @size-change="handleSizeChange"
			 :page-sizes="pageNum" :total='10' @current-change='currentchange '>
			</el-pagination>
		</el-card>
	</div>

	</div>
</template>

<script>
	import { goods } from '@/api/index'
	export default {
		data() {
			return {
				tableData: [],
				total: 0,
				pageSize: 4,
				pageIndex: 1,
				pageNum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
			}
		},
		created() {
			this.onloadList(1);
		},
		methods: {
			formatter(row, column) {
				return row.address;
			},
			async handelDel(id, idx) {
				this.$confirm('此操作将永久删除该文件,是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(async () => {
					this.$message({
						type: 'success',
						message: '删除成功'
					});
					console.log(id);
					console.log(id, idx)
					let { msg, status } = await goods.goodsdel({ id });
					if (status) {
						this.tableData.splice(idx, 1)
						this.$message.success(msg)
					}
				}).catch(() => {
					this.$message.info('删除失败');
				});



			},
			async onloadList(n) {
				let res = await goods.list({ pageSize: this.pageSize, pageIndex: this.pageIndex, sortByPrice: 'ASC' })
				this.tableData = res.goods;
				this.total = res.total * 10 / 4;
			},
			currentchange(val) {
				this.pageIndex = val;
				this.onloadList();
			},
			handleSizeChange(val) {
				this.pageSize = val;
				this.onloadList();
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

	.el-table .cell {
		display: flex;
	}

	.list .el-table {
		box-sizing: border-box;
	}
</style>
