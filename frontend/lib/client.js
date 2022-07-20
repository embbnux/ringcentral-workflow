const TOKEN_STORAGE_KEY = 'rc-workflow-jwt-token';

export class Client {
  constructor(config) {
    this._config = config;
  }

  cleanToken() {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }

  get token() {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  }
}