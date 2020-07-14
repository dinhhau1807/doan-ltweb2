import {
  FETCH_USER_REQUEST,
  FETCH_USER_SUCCESS,
  USER_LOGOUT
} from '../constants/actions';

const initialState = {
  loading: false,
  data: {}
};

export default function (state = initialState, { type, payload }) {
  switch (type) {
    case FETCH_USER_REQUEST:
      return {
        ...state,
        loading: true
      };
    case FETCH_USER_SUCCESS:
      return {
        ...state,
        data: payload.user,
        loading: false
      };
    case USER_LOGOUT:
      return initialState;
    default:
      return state;
  }
}
