import axios from 'axios';
//用户删除图片
let del = (data) => axios.delete('/api/upload',{params:data});

export default  {
	del,
}