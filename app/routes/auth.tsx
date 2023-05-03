import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useSearchParams } from "@remix-run/react";
import * as React from "react";

import { createUserSession } from "~/auth.server";
import { verifyLogin } from "~/models/user.server";
import { safeRedirect, validateEmail } from "~/utils";



export async function loader({ request }: LoaderArgs) {

    const url = new URL(request.url)
    const code = url.searchParams.get('code') as string

    if(code) {
        console.log('we received a code! Calling createUserSession')
        return createUserSession({code, request})
    }

    // url = /some_internal_id/some_name?id=some_id
    /*
    const url = new URL(request.url)
    const state = url.searchParams.get('state')
    const client_info = url.searchParams.get('client_info')
    const code = url.searchParams.get('code') as string

    const error = url.searchParams.get('error')

    console.log("/redirect state: ", state)
    console.log("/redirect client_info: ", client_info)
    


    if (state == "login") {
        console.log('received login state')
        console.log("/redirect code: ", code)
        return createUserSessionAD({request, code})

    }

    if (state === "password_reset") {
        console.log('received password reset state')
        //If the query string has a error param
        // if (req.query.error) {
        //     //and if the error_description contains AADB2C90091 error code
        //     //Means user selected the Cancel button on the password reset experience 
        //     if (JSON.stringify(req.query.error_description).includes('AADB2C90091')) {


        // return json(
        //     { status: 200 }
        // );
    } */
}
