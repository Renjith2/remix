// app/services/session.server.ts
import { createCookieSessionStorage } from "@remix-run/node";

// Create a cookie session storage object
export let sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "_session", // cookie name
    sameSite: "lax", // helps with CSRF
    path: "/", // cookie will work on all routes
    httpOnly: true, // for security reasons
    secrets: ["s3cr3t"], // replace this with an actual secret
    secure: process.env.NODE_ENV === "production" ? true : false,
    maxAge:60
  },
});

// Export session methods for use in other files
export let { getSession, commitSession, destroySession } = sessionStorage;
