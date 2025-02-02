
// Action Types

export const SAVE_REDIRECT_URL = 'SAVE_REDIRECT_URL';


// Action Creators

  export const saveRedirectUrl = (url : string | null) => ({
    type: SAVE_REDIRECT_URL,
    payload: url,
  });










