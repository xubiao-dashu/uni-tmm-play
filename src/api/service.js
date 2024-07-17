import axios from 'axios'
import { createUniAppAxiosAdapter } from '@uni-helper/axios-adapter'
import { httpLogError, requestError, throttleToLogin } from './utils'
export function createService() {
  const request = axios.create({ adapter: createUniAppAxiosAdapter() })
  request.interceptors.request.use(
    (request) => {
      return request
    },
    (err) => {
      return Promise.reject(err)
    }
  )

  request.interceptors.response.use(
    (response) => {
      const dataAxios = response.data
      // 这个状态码是和后端约定的，实际开发时再补充业务码进去
      const { code } = dataAxios
      // 根据 code 进行判断
      if (code === undefined) {
        return dataAxios
      } else {
        // 强制转字符串
        switch (`${code}`) {
          case '0':
            return dataAxios
          case '1000':
            throttleToLogin()
            break
          case '1003':
            throttleToLogin()
            break
          default:
            // 兜底处理
            return requestError(response)
        }
      }
    },
    (error) => {
      console.log(error)
      const status = error.response?.status
      switch (status) {
        // TODO 再考虑下怎么判断是跨域问题
        case undefined:
        case null:
          httpLogError(error, '网路错误或跨域')
          break
        case 400:
          httpLogError(error, '请求错误')
          break
        case 401:
          httpLogError(error, '未授权，请登录')
          break
        case 403:
          httpLogError(error, '拒绝访问')
          break
        case 404:
          httpLogError(error, `请求地址出错: ${error.response.config.url}`)
          break
        case 408:
          httpLogError(error, '请求超时')
          break
        case 500:
          httpLogError(error, '服务器内部错误')
          break
        case 501:
          httpLogError(error, '服务未实现')
          break
        case 502:
          httpLogError(error, '网关错误')
          break
        case 503:
          httpLogError(error, '服务不可用')
          break
        case 504:
          httpLogError(error, '网关超时')
          break
        case 505:
          httpLogError(error, 'HTTP版本不受支持')
          break
        default:
          httpLogError(error, '请求错误')
          break
      }
      return Promise.reject(error)
    }
  )
  return request
}

export const service = createService()
