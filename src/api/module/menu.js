import axios from 'axios'
//获取子菜单
let list = (pId) => axios.get('/api/menu/sub', { params: pId });
//添加子菜单
let addNode = (data) => axios.post('/api/menu', data);
//删除菜单
let delNode = (data) => axios.delete('/api/menu', { params: data })
//获取指定的菜单列表
let leftMenu = (id) => axios.get('/api/menu/tree', { params: id })
//编辑
let editMenu = (data) => axios.put('/api/menu', data);
//获取图标
let iconList = (data) => axios.get('/api/admin/icon/list',{params:data});
//编辑图标
let editIcon = (data) => axios.put('/api/menu/icon',data);
export default {
	list,
	addNode,
	delNode,
	leftMenu,
	editMenu,
	iconList,
	editIcon
}
