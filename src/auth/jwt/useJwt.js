// import useJwt from '@core/auth/jwt/useJwt'
import axios from '@axios'
import useCustomJwt from './customJwtService'

const { jwt } = useCustomJwt(axios, {
  loginEndpoint: '/api/dashboard/login/',
  storageTokenKeyName: 'token',
  storageRefreshTokenKeyName: 'refresh',
  userKey: 'userData',
  refreshEndpoint: '/api/token/refresh/',
  logoutEndpoint: '/logout/',
  userEndpoint: '/api/dashboard/user/',
})
export default jwt
