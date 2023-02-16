import {
  RESET_PAGINATION,
  SET_PREV_PAGINATION_PAGE,
  SET_NEXT_PAGINATION_PAGE,
  SET_HAS_PAGINATION,
  SET_HAS_NO_PAGINATION,
} from '../actions/_pagination';

const initialState = {
  hasPagination: false,
  currentPage: 1,
};

export function paginationReducer(state = initialState, action) {
  // eslint-disable-next-line default-case
  switch (action.type) {
  case RESET_PAGINATION:
    return { ...state, currentPage: 1 };
  case SET_PREV_PAGINATION_PAGE: {
    // eslint-disable-next-line no-param-reassign
    const newPage = state.currentPage === 1 ? 1 : state.currentPage - 1;
    return { ...state, currentPage: newPage };
  }
  case SET_NEXT_PAGINATION_PAGE: {
    const newPage = state.currentPage + 1;
    return { ...state, currentPage: newPage };
  }
  case SET_HAS_PAGINATION:
    return { ...state, hasPagination: true };
  case SET_HAS_NO_PAGINATION:
    return { ...state, hasPagination: false };
  }

  return state;
}
