const StoreReducer = (state, action) => {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        user: action.payload
      };
    case "REMOVE_USER":
      return {
        ...state,
        user: {
          id: "",
          token: ""
        }
      };
    default:
      return state;
  }
};

export default StoreReducer;
