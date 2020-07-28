import axios from 'axios'

let registe = (data) => axios.post('/api/admin/register', data);

//获管理员信息
let info = (id) => axios.get('/api/admin',{params:id})
//更新管理员
let updata = (data) => axios.put('/api/admin',data);
export default {
	registe,
	info,
	updata
}