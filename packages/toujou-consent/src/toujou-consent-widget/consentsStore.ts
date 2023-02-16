import { createStore, compose } from 'redux';
import consentReducer from './reducers/consent-reducers';
import { toujouLoadStorageState } from './store-persistence';

function configureStore() {
  const composeEnhancers = window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__']({ trace: true, traceLimit: 25 }) as typeof compose || compose;
  const composedEnhancers = composeEnhancers();
  const persistedState = toujouLoadStorageState();

  return createStore(
    consentReducer,
    persistedState,
    composedEnhancers,
  );
}
export const consentsStore = configureStore();
