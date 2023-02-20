export const RESET_PAGINATION = 'RESET_PAGINATION';
export const SET_PREV_PAGINATION_PAGE = 'SET_PREV_PAGINATION_PAGE';
export const SET_NEXT_PAGINATION_PAGE = 'SET_NEXT_PAGINATION_PAGE';
export const SET_HAS_PAGINATION = 'SET_HAS_PAGINATION';
export const SET_HAS_NO_PAGINATION = 'SET_HAS_NO_PAGINATION';

export const resetPagination = () => ({
  type: RESET_PAGINATION,
});

export const setPrevPaginationPage = () => ({
  type: SET_PREV_PAGINATION_PAGE,
});

export const setNextPaginationPage = () => ({
  type: SET_NEXT_PAGINATION_PAGE,
});

export const setHasPagination = () => ({
  type: SET_HAS_PAGINATION,
});

export const setHasNoPagination = () => ({
  type: SET_HAS_NO_PAGINATION,
});
