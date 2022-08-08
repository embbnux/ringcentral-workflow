import { EventEmitter } from 'events';
const TOKEN_STORAGE_KEY = 'rc-workflow-jwt-token';

export class Client extends EventEmitter {
  async getUserInfo() {
    const userInfo = await this._request('/users/me');
    return userInfo;
  }

  async _request(path, method = 'GET', body = null) {
    const response = await fetch(path, {
      method,
      headers: {
        'x-access-token': this.token,
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (response.status === 401) {
      this.emit('unauthorized');
      throw new Error('Session expired!');
    }
    if (response.status !== 200) {
      throw new Error('Fetch data error please retry later');
    }
    return response.json();
  }

  logout() {
    this.emit('unauthorized');
    this.cleanToken();
  }

  cleanToken() {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }

  get token() {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  }
}
