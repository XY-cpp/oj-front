import { createStore } from 'vuex'
import service from '../axios'

export default createStore({
	// 存放数据
	state: {
		uid: 0,
		avatar: 'http://127.0.0.1:8081/image/1',
		account: 'null',
		join_time: '',
		is_admin: false,
		is_login: false
	},
	// 存放函数
	mutations: {
		Login(state, data) {
			localStorage.setItem('has_cookie', true)
			state.uid = data.uid
			state.avatar = data.avatar
			state.account = data.account
			state.join_time = data.join_time
			state.is_login = true
			if (data.auth >= 30)
				state.is_admin = true
		},
		Logout(state) {
			state.uid = 0
			state.avatar = 'http://127.0.0.1:8081/image/1'
			state.account = 'null'
			state.join_time = ''
			state.is_login = false
			state.is_admin = false
			localStorage.removeItem('has_cookie')
			document.cookie = "token" + '=; Max-Age=-99999999;'; 
		},
	},
	actions: {

	},
	modules: {

	}
})

