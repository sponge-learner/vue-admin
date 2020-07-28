import axios from 'axios'

//获取列表
let list = () => axios.get('/api/role/list');


//获取角色菜单配置
let  config =(id) => axios.get('/api/role/config',{params:id})

//为角色添加菜单
let  menuAdd = (data) =>axios.post('/api/role/menu',data)
//为角色删除菜单
let  menuDel = (data) =>axios.delete('/api/role/menu',{params:data})


export default {
	list,
	config,
	menuAdd,
	menuDel
}
