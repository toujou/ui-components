import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import locationFinderReducer from './reducers/location-finder-reducers';

function configureStore() {
  const composeEnhancers = window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__']
    ? window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__']({ trace: true, traceLimit: 25 })
    : compose;

  const composedEnhancers = composeEnhancers(
    applyMiddleware(thunk.withExtraArgument({ })),
  );

  return createStore(
    locationFinderReducer,
    composedEnhancers,
  );
}

export const locationFinderStore = configureStore();
