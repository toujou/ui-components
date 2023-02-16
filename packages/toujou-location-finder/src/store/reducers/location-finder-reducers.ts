import { combineReducers } from 'redux';
import { locatorReducer } from './_locator_reducer';
import { featuresReducer } from './_features-reducer';
import { dataReducer } from './_data-reducer';
import { searchReducer } from './_search-reducer';
import { paginationReducer } from './_pagination-reducer';
import { popupReducer } from './_popup-reducer';

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
