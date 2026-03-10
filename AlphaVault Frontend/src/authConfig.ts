import { Configuration } from "@azure/msal-browser";

export const msalConfig: Configuration = {
  auth: {
    clientId: "df397345-7fb3-4123-a3a5-7cfd3cf1e508",
    authority: "https://login.microsoftonline.com/e4c980ba-90aa-4bb3-b931-847a929f8f3f",
    redirectUri: "http://localhost:8080",
  },
  cache: {
    cacheLocation: "sessionStorage", // This is a suggestion. You can change it to "localStorage" if needed.
    storeAuthStateInCookie: false, // Set to true for Internet Explorer 11
  },
};

export const loginRequest = {
  scopes: ["User.Read", "openid", "profile", "User.ReadBasic.All", "api://df397345-7fb3-4123-a3a5-7cfd3cf1e508/access_as_user"],
};