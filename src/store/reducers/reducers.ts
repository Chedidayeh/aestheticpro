import {  SAVE_REDIRECT_URL } from "../actions/action";


const initialState = {
  url: null,
  id : null,
};

export type RootState = ReturnType<typeof rootReducer>;


const rootReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case SAVE_REDIRECT_URL:
      return {
        ...state,
        url: action.payload,
      };
    default:
      return state;
  }
};

export default rootReducer;




