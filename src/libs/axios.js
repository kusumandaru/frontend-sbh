import Vue from 'vue'

// axios
import axios from 'axios'

const axiosIns = axios.create({
  // headers: {
  //   'Content-type': 'application/json',
  // },
  // You can add your headers here
  // ================================
  baseURL: 'http://localhost:8080/',
  // timeout: 1000,
  // headers: {'X-Custom-Header': 'foobar'}
})

Vue.prototype.$http = axiosIns

export default axiosIns
