import JwtService from '@core/auth/jwt/jwtService'

class CustomJwtService extends JwtService {
  getRefreshToken() {
    if (localStorage.getItem(this.jwtConfig.storageRefreshTokenKeyName) !== 'undefined') {
      return localStorage.getItem(this.jwtConfig.storageRefreshTokenKeyName)
    }
    return false
  }

  refreshToken() {
    return new Promise((resolve, reject) => {
      if (!this.getRefreshToken()) {
        this.removeToken()
        this.removeRefreshToken()
        this.removeUser()
        reject()
      }
      resolve(this.axiosIns.post(this.jwtConfig.refreshEndpoint, { refresh: this.getRefreshToken() }))
    })
  }

  removeToken() {
    localStorage.removeItem(this.jwtConfig.storageTokenKeyName)
  }

  removeRefreshToken() {
    localStorage.removeItem(this.jwtConfig.storageRefreshTokenKeyName)
  }

  userLogin(...args) {
    return new Promise((resolve, reject) => {
      this.login(...args)
        .then(resp => {
          this.setToken(resp.data.token)
          this.setRefreshToken(resp.data.refresh)
          resolve(resp)
        })
        .catch(err => {
          reject(err)
        })
    })
  }

  async logoutAction() {
    try {
      const runLogoutAction = await this.axiosIns.post(this.jwtConfig.logoutEndpoint, { refresh: this.getRefreshToken() })

      return runLogoutAction.status === 204
    } catch (e) {
      return false
    }
  }

  logout() {
    return new Promise((resolve, reject) => {
      try {
        if (this.logoutAction()) {
          this.removeToken()
          this.removeRefreshToken()
          this.removeUser()
        }
        resolve()
      } catch (e) {
        reject(e)
      }
    })
  }

  async setUser() {
    const user = await this.fetchUser()
    localStorage.setItem(this.jwtConfig.userKey, JSON.stringify(user.data.user))
  }

  removeUser() {
    return localStorage.removeItem(this.jwtConfig.userKey)
  }

  fetchUser() {
    return new Promise((resolve, reject) => {
      try {
        const user = this.axiosIns.get(this.jwtConfig.userEndpoint)
        resolve(user)
      } catch (e) {
        reject()
      }
    })
  }
}

export default function useCustomJwt(axiosIns, jwtOverrideConfig) {
  const jwt = new CustomJwtService(axiosIns, jwtOverrideConfig)

  return {
    jwt,
  }
}
