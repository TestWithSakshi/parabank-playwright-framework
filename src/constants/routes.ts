/**
 * Parabank routes. All served under BASE_URL (e.g. https://parabank.parasoft.com/parabank).
 * The app appends ";jsessionid=..." to hrefs — regex matchers must tolerate that.
 */
export const Routes = {
  home: '/index.htm',
  login: '/login.htm',
  register: '/register.htm',
  overview: '/overview.htm',
  logout: '/logout.htm',
} as const;
