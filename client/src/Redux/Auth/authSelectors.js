export const selectAuthState = (state) => state.auth;
export const selectIsAuthenticated = (state) => selectAuthState(state).isAuthenticated;
export const selectUserRole = (state) => selectAuthState(state).userRole;
export const selectToken = (state) => selectAuthState(state).token;