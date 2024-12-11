import { createStore, compose } from 'redux';
import consentReducer from './reducers/consent-reducers';
import { toujouLoadStorageState } from './store-persistence';
import {checkConsentExpiry} from './actions/consent-actions';

function configureStore() {
  const composeEnhancers = window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__']
    ? window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__']({ trace: true, traceLimit: 25 })
    : compose;
  const composedEnhancers = composeEnhancers();
  const persistedState = toujouLoadStorageState();
  const store = createStore(
    consentReducer,
    persistedState,
    composedEnhancers,
  );
  store.dispatch(checkConsentExpiry());
  return store;
}
export const consentsStore = configureStore();
