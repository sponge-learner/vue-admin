import axios from 'axios'
//获取商品列表
let list = (data) => axios.get('/api/admin/goods/list', { params: data })

//获取子级分类
let subcate = (pId) => axios.get('/api/category/sub', { params: pId })

//删除分类
let del = (id) => axios.delete('/api/category', { params: id })

//商品删除
let goodsdel = (id) => axios.delete('/api/admin/goods', { params: id });

//发布商品
let release = (data) => axios.post('/api/admin/goods', data);

//获取商品详情
let detail = (id) => axios.get('/api/admin/goods', { params: id })

//更新分类
let updateCategory = (data) => axios.put('/api/category', data);

//添加子结点
let addCategorySub = (data) => axios.post('/api/category', data);

//编辑商品
let editGoods = (data) => axios.put('/api/admin/goods',data);
export default {
	list,
	subcate,
	del,
	goodsdel,
	release,
	detail,
	updateCategory,
	addCategorySub,
	editGoods
}
