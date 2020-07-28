import axios from 'axios';

import { Message } from 'element-ui';
//loading 服务方式
import { Loading } from "element-ui"
axios.defaults.baseURL = 'http://localhost:3003'
let loading;
// 添加请求拦截器
axios.interceptors.request.use(function(config) {
	// 在发送请求之前做些什么
	//开启Loading
	loading = Loading.service({ background: "rgba(0,0,0,0.3)" });
	let token = sessionStorage.token;
	
	config.headers.Authorization = `Bearer ${token}`;
	return config;
}, function(error) {
	// 对请求错误做些什么
	return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function({ data, status }) {
	// 对响应数据做点什么
	//关闭loading
	loading.close();
	return data;
}, function(error) {
	// 对响应错误做点什么
	return Promise.reject(error);
});
