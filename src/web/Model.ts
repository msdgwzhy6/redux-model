import { BaseModel } from '../core/BaseModel';
import * as ReactRedux from 'react-redux';
import { HttpServiceWithMeta, UseSelector } from '../core/utils/types';
import { METHOD } from '../core/utils/method';

export abstract class Model<Data = null> extends BaseModel<Data> {
  protected switchReduxSelector<TState = any, TSelected = any>(): UseSelector<TState, TSelected> {
    return ReactRedux.useSelector;
  }

  protected patch<Response>(uri: string): HttpServiceWithMeta<Data, Response, unknown> {
    return this.serviceAction<Response>(uri, METHOD.patch);
  }
}
