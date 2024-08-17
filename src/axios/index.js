import axios from 'axios'
import JSONbig from 'json-bigint'
import store from '../store'
import { ElMessage } from 'element-plus'

const service = axios.create({timeout: 100000});

// 请求拦截器，每次请求都会先执行这里的代码
service.interceptors.request.use(
    function (config) {
        config.headers.Authorization = localStorage.getItem('token')

        return config
    },
    function (err) {
    }
);

export default service;