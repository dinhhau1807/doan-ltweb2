import {
  FETCH_USER_REQUEST,
  FETCH_USER_SUCCESS,
  USER_LOGOUT,
  UPDATE_USER_REQUEST,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_ERROR
} from '../constants/actions';
import moment from 'moment';

const initialState = {
  loading: false,
  data: null
};

export default function (state = initialState, { type, payload }) {
  switch (type) {
    case UPDATE_USER_REQUEST:
    case FETCH_USER_REQUEST:
      return {
        ...state,
        loading: true
      };
    case FETCH_USER_SUCCESS:
      return {
        ...state,
        data: {
          ...payload.user,
          dateOfBirth: payload.user.dateOfBirth
            ? moment(payload.user.dateOfBirth)
            : undefined
        },
        loading: false
      };
    case USER_LOGOUT:
      return initialState;
    case UPDATE_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        data: { ...state.data, ...payload.userUpdated }
      };
    case UPDATE_USER_ERROR:
      return {
        ...state,
        loading: false
      };
    default:
      return state;
  }
}
