<template>
	<div class="list">
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>商品列表</span>
			</div>
			<template>
				<el-table :data="tableData" style="width: 100%" :default-sort="{prop: 'date', order: 'descending'}">
					<el-table-column prop="id" label="#" width="50">
					</el-table-column>
					<el-table-column prop="name" width="600">
						<template scope="scope">
							<el-table  :data="scope.row.goodsList"  style="width: 100%" :default-sort="{prop: 'date', order: 'descending'}">
								<el-table-column prop="name" label="商品" width="300">
									<template scope="scope">
										<div class="content">
											<img :src="scope.row.img_md" height="75" class="head_pic" />
											<div>{{scope.row.name}}</div>
										</div>
									</template>
								</el-table-column>
								<el-table-column  prop="goods_price" label="单价" sortable>
								</el-table-column>
								<el-table-column prop="goods_num" label="数量" sortable>
								</el-table-column>
							</el-table>
						</template>
					</el-table-column>
					<el-table-column prop="payment" label="金额" sortable>
					</el-table-column>
					<el-table-column prop="create_time" label="下单时间" sortable>
					</el-table-column>
					<el-table-column prop="status" label="状态" sortable>
					</el-table-column>
					<el-table-column prop="address" label="操作">
						<template slot-scope="scope">
							<el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
						</template>
					</el-table-column>
				</el-table>
			</template>
			</el-pagination>
		</el-card>
	</div>
</template>

<script>
	import { older } from '@/api/index'
	export default {
		data() {
			return {
				tableData: [],
				total: 0,
			}
		},
		created() {
			this.onloadList();

		},
		methods: {
			formatter(row, column) {
				return row.address;
			},
			async onloadList(n) {
				let { data, status, msg } = await older.list()
				if (status) {				
					this.tableData = data;
					console.log(data);
					data.forEach((item)=>{
						item.create_time = this.GMTToStr(item.create_time)
						console.log(item.create_time );
					})
					this.tableData.create_time = this.GMTToStr(data.create_time)
					
				}

			},
			currentchange(val) {
				this.onloadList(val);
			},
			//时间转换
			GMTToStr(time){
			    let date = new Date(time)
			    let Str=date.getFullYear() + '-' +
			    (date.getMonth() + 1) + '-' + 
			    date.getDate() + ' ' + 
			    date.getHours() + ':' + 
			    date.getMinutes() + ':' + 
			    date.getSeconds()
			    return Str
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
