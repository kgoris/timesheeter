import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable()
export class ConfigService {

  private _api_url = '/api';

  private _refresh_token_url = this._api_url + '/refresh';

  private _login_url = this._api_url + '/login';

  private _logout_url = this._api_url + '/logout';

  private _change_password_url = this._api_url + '/changePassword';

  private _whoami_url = this._api_url + '/whoami';

  private _user_url = this._api_url + '/user';

  private _users_url = this._user_url + '/all';

  private _reset_credentials_url = this._user_url + '/reset-credentials';

  private _client_url = this._api_url + '/client';

  private _all_clients_url = this._client_url + '/all';

  private _chantier_url = this._api_url + '/chantier';

  private _all_chantiers_url = this._chantier_url + '/all';

  get reset_credentials_url(): string {
      return this._reset_credentials_url;
  }

  get refresh_token_url(): string {
      return this._refresh_token_url;
  }

  get whoami_url(): string {
      return this._whoami_url;
  }

  get users_url(): string {
      return this._users_url;
  }

  get login_url(): string {
      return this._login_url;
  }

  get logout_url(): string {
      return this._logout_url;
  }

  get change_password_url(): string {
      return this._change_password_url;
  }

  get clients_url(): string {
    return this._all_clients_url;
  }

  get chantiers_url(): string{
    return this._all_chantiers_url;
  }

}
