
import { createCookieSessionStorage, redirect } from "@remix-run/node";
import { URLSearchParams } from "url"
const sessionSecret = process.env.SESSION_SECRET as string
const cognitoDomain = process.env.COGNITO_DOMAIN as string
const clientId = process.env.CLIENT_ID as string
const clientSecret = process.env.CLIENT_SECRET as string

if (!sessionSecret) {
    throw new Error("SESSION_SECRET must be set");
}
if (!cognitoDomain) {
    throw new Error("COGNITO_DOMAIN must be set");
}
if (!clientId) {
    throw new Error("CLIENT_ID must be set");
}

const USER_SESSION_KEY = "cognitoCode";

export const sessionStorage = createCookieSessionStorage({
    cookie: {
        name: "__session",
        httpOnly: true,
        path: "/",
        sameSite: "lax",
        secrets: [process.env.SESSION_SECRET as string],
        secure: process.env.NODE_ENV === "production",
    },
});

export async function getSession(request: Request) {
    const cookie = request.headers.get("Cookie");
    return sessionStorage.getSession(cookie);
}

export async function getAuthCode() {
    console.log("Fetching Authorization code")
    let redirectUri = "http://localhost:3000/auth"
    const uri = `${cognitoDomain}/login?client_id=${clientId}&response_type=code&scope=email+openid&redirect_uri=${redirectUri}&state=/`;
    return redirect(uri);
}

async function getToken({ code, redirectUri }: { code: string, redirectUri: string }) {
    const uri = `${cognitoDomain}/oauth2/token`;
    const body = {
        grant_type: "authorization_code",
        client_id: clientId,
        redirect_uri: redirectUri,
        code: code
    }
    const encode = (str: string):string => Buffer.from(str, 'binary').toString('base64');
    const auth = encode(`${clientId}:${clientSecret}`)
    return await fetch(uri, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": `Basic ${auth}`
        },
        body: new URLSearchParams({"grant_type" : "authorization_code", "client_id" : clientId, "redirect_uri" : redirectUri, "code" : code})
    });
}

async function getUser({access_token} : {access_token : string}) {
    const uri = `${cognitoDomain}/oauth2/userInfo`;
  
    const response = await fetch(uri, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${access_token}`
      },
    });
    if (response.status === 200) {
      return await response.json();
    } else {
      return null;
    }
  }

export async function createUserSession({
    request,
    code
}: {
    request: Request;
    code: string
}) {
   
    const redirectUri = "http://localhost:3000/auth"
    const tokenResponse = await getToken({ code, redirectUri });
    if (tokenResponse.status === 200) {
       
        const json = await tokenResponse.json();
        console.log("obtained access tokens ")
        const { access_token, id_token, refresh_token } = json;
        const session = await getSession(request);
        session.set("access_token", access_token);
     //   session.set("id_token", id_token);
        session.set("refresh_token", refresh_token);

        return redirect(redirectUri, {
            headers: {
              "Set-Cookie": await sessionStorage.commitSession(session, {
                maxAge: true
                  ? 60 * 60 * 24 * 7 // 7 days
                  : undefined,
              }),
            },
          });
    } else {
        console.log("bad token response: ")
    }
}
/*
/auth:
    code:
        getToken(code) -> createUserSession -> redirect /auth
    !code
        user = getUser() (access token -> refresh? -> or fail)
        user: redirect / (or back to last url)
        !user: getAuthCode() -> /auth
    

        





  //The url does not have a code, so this is the first time we are hitting the login page
  //First try to get a user from an access token saved as a cookie
  if (!user) {
    user = await hasValidAccessToken(request);
    if (!user) {
      //Then try to refresh the access token from a refresh token saved as a cookie
      const { accessToken, idToken, refreshToken } = await refreshAccessToken(request, redirectUri);
      if (accessToken) {
        user = await getUser(accessToken);
        if (user) {
          headers.append("Set-cookie", await cookieAccessToken.serialize({
            access_token: accessToken
          }));
          headers.append("Set-cookie", await cookieIdToken.serialize({
            id_token: idToken
          }));
          headers.append("Set-cookie", await cookieRefreshToken.serialize({
            refresh_token: refreshToken
          }));
        }
      }
    }
    if (!user) {
      //if we still have no user then send them to the cognito login page
      const uri = `https://${cognitoDomain}/login?client_id=${clientId}&response_type=code&scope=email+openid&redirect_uri=${redirectUri}&state=${redirectTo}`;
      return redirect(uri);
    }
  }
  if (user) {
    //TODO Persist the user in the session
    console.log("This should be persisted in session: ", user);
    const state = url.searchParams.get("state");
    const finalRedirectTo = decodeURIComponent(state || redirectTo);
    console.log('finalRedirectTo :>> ', finalRedirectTo);
    return redirect(finalRedirectTo, { headers });
  }
  //All failed, return to login
  return redirect(`/login?redirect=${redirectTo}`);
}





//Does the user have a valid access token? If so, return the user info
// async function hasValidAccessToken(request) {
//   const cookieHeaders = request.headers.get("Cookie");
//   if (cookieHeaders) {
//     const cookieAccessTokenValue = await (cookieAccessToken.parse(cookieHeaders) || {});
//     if (cookieAccessTokenValue.access_token) {
//       return await getUser(cookieAccessTokenValue.access_token);
//     }
//   }
//   return null;
// }

async function refreshAccessToken(request, redirectUri) {
  const ret = {
    accessToken: undefined,
    idToken: undefined,
    refreshToken: undefined
  }
  const cookieHeaders = request.headers.get("Cookie");
  if (cookieHeaders) {
    const cookieRefreshTokenValue = await (cookieRefreshToken.parse(cookieHeaders) || {});
    if (cookieRefreshTokenValue.refresh_token) {
      const uri = `https://${cognitoDomain}/oauth2/token`;
      const body = {
        grant_type: "refresh_token",
        client_id: clientId,
        redirect_uri: redirectUri,
        refresh_token: cookieRefreshTokenValue.refresh_token
      }
      const response = await fetch(uri, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams(body)
      });
      if (response.status === 200) {
        const json = await response.json();
        const { access_token, id_token, refresh_token } = json;
        ret.accessToken = access_token;
        ret.idToken = id_token;
        ret.refreshToken = refresh_token;
      }
    }
  }
  return ret;
}