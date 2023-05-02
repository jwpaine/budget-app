import { createCookieSessionStorage, redirect } from "@remix-run/node";
const msal = require('@azure/msal-node')
// import invariant from "tiny-invariant";

import type { User } from "~/models/user.server";
import { getUserById } from "~/models/user.server";

// invariant(process.env.SESSION_SECRET, "SESSION_SECRET must be set");

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



// Azure AD B2C

// getAuthCode(process.env.SIGN_UP_SIGN_IN_POLICY_AUTHORITY, [], APP_STATES.LOGIN, res);

const APP_STATES = {
  LOGIN: 'login',
  LOGOUT: 'logout',
  PASSWORD_RESET: 'password_reset',
  EDIT_PROFILE : 'update_profile'
}


 const confidentialClientConfig = {
    auth: {
        clientId: process.env.APP_CLIENT_ID, 
        authority: process.env.SIGN_UP_SIGN_IN_POLICY_AUTHORITY, 
        clientSecret: process.env.APP_CLIENT_SECRET,
        knownAuthorities: [process.env.AUTHORITY_DOMAIN], //This must be an array
        redirectUri: process.env.APP_REDIRECT_URI,
        validateAuthority: false
    }
};

// Initialize MSAL Node
const confidentialClientApplication = new msal.ConfidentialClientApplication(confidentialClientConfig);

const authCodeRequest = {
  redirectUri: confidentialClientConfig.auth.redirectUri,
  authority: process.env.SIGN_UP_SIGN_IN_POLICY_AUTHORITY,
  scopes: [],
  state: APP_STATES.LOGIN
};

const tokenRequest = {
  redirectUri: confidentialClientConfig.auth.redirectUri,
  authority: process.env.SIGN_UP_SIGN_IN_POLICY_AUTHORITY
};

export async function getAuthCode()  {

  // prepare the request
  console.log("Fetching Authorization code")


  //Each time you fetch Authorization code, update the relevant authority in the tokenRequest configuration

  // request an authorization code to exchange for a token
  return confidentialClientApplication.getAuthCodeUrl(authCodeRequest)
      .then((response) => {
          console.log("\nAuthCodeURL: \n" + response);
          //redirect to the auth code URL/send code to 
          return redirect(response);
      })
      .catch((error) => {
         throw error
      });
}

export async function logout_AD(request: Request) {
  const session = await getSession(request);
  return redirect(process.env.LOGOUT_ENDPOINT || "/", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}



const USER_SESSION_KEY = "userId";

export async function getSession(request: Request) {
  const cookie = request.headers.get("Cookie");
  return sessionStorage.getSession(cookie);
}

export async function getUserId(
  request: Request
): Promise<User["id"] | undefined> {
  const session = await getSession(request);
  const userId = session.get(USER_SESSION_KEY);
  return userId;
}

export async function getUser(request: Request) {
  console.log('getting user')
  const userId = await getUserId(request);
  if (userId === undefined) return null;

  const user = await getUserById(userId);
  console.log("User", user)
  if (user) return user;

  throw await logout(request);
}

export async function requireUserId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const userId = await getUserId(request);
  if (!userId) {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }
  return userId;
}

export async function requireUser(request: Request) {
  const userId = await requireUserId(request);

  const user = await getUserById(userId);
  if (user) return user;

  throw await logout(request);
}

export async function createUserSession({
  request,
  userId,
  remember,
  redirectTo,
}: {
  request: Request;
  userId: string;
  remember: boolean;
  redirectTo: string;
}) {
  const session = await getSession(request);
  session.set(USER_SESSION_KEY, userId);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session, {
        maxAge: remember
          ? 60 * 60 * 24 * 7 // 7 days
          : undefined,
      }),
    },
  });
}

export async function logout(request: Request) {
  const session = await getSession(request);
  return redirect("/", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}


