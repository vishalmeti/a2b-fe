export const UserRepository = {
  LOGIN : "/auth/token/",
  REGISTER: "/users/register/",
  LOGOUT : "/auth/logout/",
  ME: "/users/me/",
  GET_NOTIFICATIONS: "/notifications/",
  GET_RECEIVED_REQUESTS: '/requests/',
  GET_COMMUNITIES: '/users/communities/',
  GET_MY_ITEMS: (user_id) => `/items/?user_id=${user_id}`,
}