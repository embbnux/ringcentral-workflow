import { EventEmitter } from 'events';
const TOKEN_STORAGE_KEY = 'rc-workflow-jwt-token';

export class Client extends EventEmitter {
  async getUserInfo() {
    const userInfo = await this._request('/users/me');
    return userInfo;
  }

  async getFlows() {
    const flows = await this._request('/flows');
    return flows;
  }

  async getFlow(id) {
    const flows = await this._request(`/flows/${id}`);
    return flows;
  }

  async createFlow(name, nodes) {
    const flow = await this._request('/flows', 'POST', {
      name,
      nodes,
    });
    return flow;
  }

  async updateFlow(id, name, nodes) {
    const flow = await this._request(`/flows/${id}`, 'PUT', {
      name,
      nodes,
    });
    return flow;
  }

  async deleteFlow(id) {
    const flow = await this._request(`/flows/${id}`, 'DELETE');
    return flow;
  }

  async toggleFlow(id, enabled) {
    const flow = await this._request(`/flows/${id}/toggle`, 'POST', {
      enabled
    });
    return flow;
  }

  async getTriggers() {
    const triggers = await this._request('/flow-editor/triggers');
    return triggers;
  }

  async getConditions() {
    const conditions = await this._request('/flow-editor/conditions');
    return conditions;
  }

  async getActions() {
    const actions = await this._request('/flow-editor/actions');
    return actions;
  }

  async getActionParamsOptions(actionId) {
    const options = await this._request(`/flow-editor/actions/${actionId}/params-options`);
    return options;
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
      const error =  new Error('Fetch data error please retry later');
      error.response = response;
      throw error;
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
