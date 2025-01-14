import { combineReducers, createStore, DeepPartial, Store, StoreEnhancer } from 'redux';
import { StoreNotFoundError } from '../exceptions/StoreNotFoundError';
import { Reducers } from './types';
import { isDebug } from '../../libs/dev';

const hasEffectsReducers: string[] = [];
const autoReducers: Reducers = {};
let usersReducers: Reducers = {};
let store: Store;
let listeners: Array<(store: Store) => void> = [];

const combine = () => {
  if (isDebug()) {
    Object.keys(usersReducers).forEach((key) => {
      if (autoReducers[key] && hasEffectsReducers.indexOf(key) === -1) {
        // Indeed, it's reducer name but not model name
        console.warn(`Model '${key}' has been registered automatically, do not register it again.`);
      }
    });
  }

  return combineReducers({
    ...autoReducers,
    ...usersReducers,
  });
};

export const watchEffectsReducer = (reducerName: string, className: string) => {
  hasEffectsReducers.push(reducerName);
  setTimeout(() => {
    if (!usersReducers[reducerName]) {
      console.error(
`Model '${className}' has override protected method 'effects()', consider register its instance manually:


Example:

const store = createReduxStore({ 
  ...aModel.register(),
  ...bModel.register(),
  ...cModel.register(),
});


`
      );
    }
  });
};

export const appendReducers = (reducers: Reducers) => {
  Object.assign(autoReducers, reducers);

  if (store) {
    store.replaceReducer(combine());
  }
};

export function createReduxStore(reducer: Reducers, enhancer?: StoreEnhancer): Store;
export function createReduxStore<S>(reducer: Reducers, preloadedState?: DeepPartial<S>, enhancer?: StoreEnhancer): Store;

export function createReduxStore(reducer: Reducers, ...args: any[]) {
  usersReducers = reducer;

  if (store) {
    store.replaceReducer(combine());
  } else {
    store = createStore(combine(), ...args);
    listeners.forEach((listener) => listener(store));
    listeners = [];
  }

  return store;
}

export const getStore = () => {
  if (!store) {
    throw new StoreNotFoundError();
  }

  return store;
};

export const onStoreCreated = (fn: (store: Store) => void): void => {
  if (store) {
    fn(store);
  } else {
    listeners.push(fn);
  }
};
