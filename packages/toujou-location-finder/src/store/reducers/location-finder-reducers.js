import { combineReducers } from 'redux';
import { locatorReducer } from './_locator_reducer.js';
import { featuresReducer } from './_features-reducer.js';
import { dataReducer } from './_data-reducer.js';
import { searchReducer } from './_search-reducer.js';
import { paginationReducer } from './_pagination-reducer.js';
import { popupReducer } from './_popup-reducer.js';

// eslint-disable-next-line no-unused-vars
export const locationFinderReducer = combineReducers({
  features: featuresReducer,
  locator: locatorReducer,
  data: dataReducer,
  search: searchReducer,
  pagination: paginationReducer,
  popup: popupReducer,
});

export default locationFinderReducer;
