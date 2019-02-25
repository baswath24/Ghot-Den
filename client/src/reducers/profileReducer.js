import {
  GET_MY_PROFILE,
  GET_OTHER_PROFILE,
  GET_ALL_PROFILES,
  PROFILE_LOADING,
  CLEAR_CURRENT_PROFILE
} from '../actions/types';

const initialState = {
  profile: null,
  profiles: [],
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case PROFILE_LOADING:
      return {
        ...state,
        loading: true
      };
    case GET_MY_PROFILE:
      return {
        ...state,
        profile: action.payload,
        loading: false
      };
    case GET_OTHER_PROFILE:
      return {
        ...state,
        profile: action.payload,
        loading: false
      };
    case GET_ALL_PROFILES:
      console.log("In all profiles")
      return {
        ...state,
        profiles: action.payload,
        loading: false
      };
    case CLEAR_CURRENT_PROFILE:
      return {
        ...state,
        profile: null
      };
    default:
      return state;
  }
}