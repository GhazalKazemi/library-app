import React from "react";

export const OktaConfig = {
    clientId: '0oafyjklv1uEtboOH5d7',
    issuer: "https://dev-73615806.okta.com/oauth2/default",
    redirectUri: "http://localhost:3000/login/callback",
    scopes: ['openid', 'profile', 'email'],
    pkce: true, 
    disableHttpsCheck: true,
    useClassicEngine: true
}