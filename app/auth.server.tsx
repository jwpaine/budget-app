
import { LoaderArgs, createCookieSessionStorage, redirect, json } from "@remix-run/node";
import { URLSearchParams } from "url"
import type { User } from "~/models/user.server";
const sessionSecret = process.env.SESSION_SECRET as string
const cognitoDomain = process.env.COGNITO_DOMAIN as string
const clientId = process.env.CLIENT_ID as string
const clientSecret = process.env.CLIENT_SECRET as string
const cognitoRedirect = process.env.COGNITO_REDIRECT as string

import { getUserById, createUser } from "~/models/user.server";

if (!sessionSecret) {
    throw new Error("SESSION_SECRET must be set");
}
if (!cognitoDomain) {
    throw new Error("COGNITO_DOMAIN must be set");
}
if (!clientId) {
    throw new Error("CLIENT_ID must be set");
}

if (!cognitoRedirect) {
    throw new Error("COGNITO_REDIRECT must be set");
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
   // let redirectUri = "http://localhost:3000/auth"
    const uri = `${cognitoDomain}/login?client_id=${clientId}&response_type=code&scope=email+openid&redirect_uri=${cognitoRedirect}&state=/`;
    return redirect(uri);
}

async function getToken({ code, redirectUri }: { code: string, redirectUri: string }) {
    const uri = `${cognitoDomain}/oauth2/token`;

    const encode = (str: string): string => Buffer.from(str, 'binary').toString('base64');
    const auth = encode(`${clientId}:${clientSecret}`)
    return await fetch(uri, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": `Basic ${auth}`
        },
        body: new URLSearchParams({ "grant_type": "authorization_code", "client_id": clientId, "redirect_uri": redirectUri, "code": code })
    });
}



async function createUserSession({
    request,
    code
}: {
    request: Request;
    code: string
}) {

    const redirectUri = cognitoRedirect
    const tokenResponse = await getToken({ code, redirectUri });

    if (tokenResponse.status === 200) {

        const json = await tokenResponse.json();
        console.log("obtained access tokens ")
        const { access_token, id_token, refresh_token } = json;
        const session = await getSession(request);
      //  session.set("access_token", access_token);
        //   session.set("id_token", id_token);
        session.set("refresh_token", refresh_token);

        const user = await getUser({access_token})

        const localUser = await getUserById({id: user.username})

        if(!localUser) {
            console.log("Local user does NOT exist: ", user.username)
            return // early
            const createLocalUser = await createUser(user.email, user.username)

        } else {
            console.log("Local user exists: ", user.username)
        }

        session.set("user", user)

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
        console.log("bad token response: ", tokenResponse)
    }
}


export async function getUserId(
    request: Request
  ): Promise<User["id"] | undefined> {
    const session = await getSession(request);
    const user = session.get("user");
    // console.log("getUserId: ", user)
    return user?.username || null
  }



export async function requireUserId(
    request: Request,
    redirectTo: string = new URL(request.url).pathname
  ) {
    const userId = await getUserId(request);

    if (!userId) {
        console.log("requireUserId: could not find userId")
        const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
        throw redirect(`/auth?${searchParams}`);
      }
      return userId;
  }

export async function authorize({ request, redirectTo }: { request: Request, redirectTo: string }) {
    const url = new URL(request.url)
    const code = url.searchParams.get('code')


    const session = await getSession(request);
    const redirectUri = cognitoRedirect //"http://localhost:3000/auth"

    if (!code) {
        // code
        /* user = getUser() (access token -> refresh? -> or fail)
         user: redirect / (or back to last url)
         !user: getAuthCode() -> /auth
         */
        // does our session contain access and refresh tokens?
      //  let access_token = session.get("access_token") as string
        const refresh_token = session.get("refresh_token") as string

        // if (!access_token) {
        //     console.log("Access token not set")
        //     return await getAuthCode()
        // } else {
            // const user = await getUser({ access_token })

            // if (user) {
            //     console.log("user found!: ", user)
            //     return redirect("/")
            // }

          //  console.log("user not found")
            console.log("attempting to obtain new access token using refresh token")

            const refreshed = await refreshAccessToken({ refresh_token, redirectUri });
            if (refreshed?.access_token) {
                // success
                console.log("successfully refreshed access token: ", refreshed.access_token)
                let access_token = refreshed.access_token
                const user = await getUser({ access_token })
                if (user) {
                    console.log("obtained user: ", user)
                    console.log("saving session")

                  //  session.set("access_token", access_token);
                    session.set("refresh_token", refresh_token);
                    session.set("user", user)

                    return redirect("/budget", {
                        headers: {
                            "Set-Cookie": await sessionStorage.commitSession(session, {
                                maxAge: true
                                    ? 60 * 60 * 24 * 7 // 7 days
                                    : undefined,
                            }),
                        },
                    });


                }
                console.log("could not obtain user")
                return getAuthCode()
                
            }

            console.log("Could not refresh access token.")
            return getAuthCode()

      //  }
        //   const user = getUser()


    } else {
        console.log('Code passed')
        return createUserSession({request, code})
    }

    return json({ 'code': false })

}



async function getUser({ access_token }: { access_token: string }) {
    console.log("validating user")
    const uri = `${cognitoDomain}/oauth2/userInfo`;
    const response = await fetch(uri, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${access_token}`
        },
    });
    if (response.status === 200) {
       
        return response.json();
    } else {
        return null;
    }
}

async function refreshAccessToken({ refresh_token, redirectUri }: { refresh_token: string, redirectUri: string }) {

    if (!refresh_token) return null

    const uri = `${cognitoDomain}/oauth2/token`;

    const encode = (str: string): string => Buffer.from(str, 'binary').toString('base64');
    const auth = encode(`${clientId}:${clientSecret}`)
    const response = await fetch(uri, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": `Basic ${auth}`
        },
        body: new URLSearchParams({ "grant_type": "refresh_token", "client_id": clientId, "redirect_uri": redirectUri, "refresh_token": refresh_token })
    });

    if (response.status === 200) {
        const json = await response.json();
        const { access_token, id_token, refresh_token } = json;
        return ({ access_token, id_token, refresh_token })
    }

    return null
}


export async function logout(request: Request) {
    const session = await getSession(request);
    return redirect("/", {
      headers: {
        "Set-Cookie": await sessionStorage.destroySession(session),
      },
    });
  }

