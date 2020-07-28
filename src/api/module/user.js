import axios from 'axios'
//获取用户列表
let list = () => axios.get('/api/admin/list');
//编辑修改
let edit = (data) => axios.put("/api/admin", data);
//删除
let del = (id) => axios.delete("/api/admin",{params:id});

//头像上传
let upload =()=>axios.post('/api/upload/avatar');
export default {
	list,
	edit,
	del,
	upload
}
