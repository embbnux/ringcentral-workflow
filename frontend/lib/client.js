import { EventEmitter } from 'events';
const TOKEN_STORAGE_KEY = 'rc-workflow-jwt-token';

export class Client extends EventEmitter {
  async getUserInfo() {
    const response = await fetch(`/users/me?token=${this.token}`);
    if (response.status === 401) {
      this.emit('unauthorized');
      throw new Error('Session expired!');
    }
    if (response.status !== 200) {
      throw new Error('Fetch data error please retry later or reopen the dialog')
    }
    const data = await response.json();
    return data;
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
