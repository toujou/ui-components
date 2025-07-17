import {createStore, compose, applyMiddleware} from 'redux';
import consentReducer from './store/reducers';
import {consentsStorePersistenceMiddleware, toujouLoadStorageState} from './store/persistence';
import {checkConsentExpiry} from './store/actions';

export function configureStore(initialState = {}, middlewares = []) {
  const composeEnhancers = window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__']
    ? window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__']({ trace: true, traceLimit: 25 })
    : compose;
  const composedEnhancers = composeEnhancers(...middlewares);
  const store = createStore(
    consentReducer,
    initialState,
    composedEnhancers,
  );
  store.dispatch(checkConsentExpiry());
  return store;
}
export const store = configureStore(toujouLoadStorageState(), [applyMiddleware(consentsStorePersistenceMiddleware)]);
