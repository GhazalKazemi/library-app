import React from "react";

export const OktaConfig = {
    clientId: process.env.LIBRARY_APP_OKTA_CLIENT_ID,
    issuer: `https://${process.env.LIBRARY_APP_OKTA_BASE_URL}/oauth2/default`,
    redirectUri: "http://localhost:3000/login/callback",
    scopes: ['openid', 'profile', 'email'],
    pkce: true, 
    disableHttpsCheck: true,
    useClassicEngine: true
}