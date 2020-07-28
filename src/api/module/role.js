import axios from 'axios'
//获取角色列表
let list = () => axios.get('/api/role/list')
//更新角色
let edit = (data) => axios.put('/api/role', data)
//添加角色
let add = (data) => axios.post('/api/role', data)
//删除角色
let del = (data) => axios.delete('/api/role',{params:data});


//商品分类

export default {
	list,
	edit,
	add,
	del
}
