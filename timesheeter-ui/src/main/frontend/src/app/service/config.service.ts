import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable()
export class ConfigService {

  private _api_url = '/timesheeter/api';

  private _refresh_token_url = this._api_url + '/refresh';

  private _login_url = this._api_url + '/login';

  private _logout_url = this._api_url + '/logout';

  private _change_password_url = this._api_url + '/changePassword';

  private _whoami_url = this._api_url + '/whoami';

  private _user_url = this._api_url + '/user';

  private _users_url = this._user_url + '/all';

  private _create_user_url = this._user_url + '/new';

  private _update_user_url = this._user_url + '/update';

  private _reset_credentials_url = this._user_url + '/reset-credentials';

  private _client_url = this._api_url + '/client';

  private _new_client_url = this._client_url + '/new';

  private _update_client_url = this._client_url + '/update';

  private _all_clients_url = this._client_url + '/all';

  private _chantier_url = this._api_url + '/chantier';

  private _new_chantier_url = this._chantier_url + '/new';

  private _update_chantier_url = this._chantier_url + '/update';

  private _all_chantiers_url = this._chantier_url + '/all';

  private _recorded_timesheet = this._api_url + '/recordedtimesheets';

  private _timesheet_url = this._api_url + '/timesheet';

  private _all_timesheets_url = this._timesheet_url + '/all';

  private _timesheets_by_user = this._timesheet_url + "/user/";

  private _timesheets_by_chantier = this._timesheet_url + "/chantier/";

  private _timesheets_by_client = this._timesheet_url + "/client/";

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

  get recorded_timesheets_url(): string{
    return this._recorded_timesheet;
  }

  get timesheets_url(): string{
    return this._all_timesheets_url;
  }

  get timesheet_user(): string {
    return this._timesheets_by_user;
  }

  get timesheet_chantier(): string {
    return this._timesheets_by_chantier;
  }

  get timesheet_client(): string {
    return this._timesheets_by_client;
  }

  get user_url(): string{
    return this._user_url;
  }

  get create_user(): string{
    return this._create_user_url;
  }

  get update_user(): string{
    return this._update_user_url;
  }

  get create_chantier_url(): string{
    return this._new_chantier_url;
  }

  get update_chantier_url(): string {
    return this._update_chantier_url;
  }

  get create_client_url(): string{
    return this._new_client_url;
  }

  get update_client_url(): string{
    return this._update_client_url;
  }

  get chantier_url(): string{
    return this._chantier_url;
  }

  get client_url(): string{
    return this._client_url;
  }
}
