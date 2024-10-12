
// app/routes/home.tsx
import { LoaderFunctionArgs, redirect, ActionFunctionArgs } from "@remix-run/node";
import { useLoaderData, Form } from "@remix-run/react";
import { getSession, destroySession } from "~/services/session.server";
import type { LoaderData } from "../model/user";

// Loader to check if the user is authenticated and load user data
export async function loader({ request }: LoaderFunctionArgs): Promise<LoaderData | Response> {
  const session = await getSession(request.headers.get("Cookie"));
  console.log("Session data:", session.data); // Log the session data

  const userName = session.get("userName"); // Retrieve the userName from the session
  console.log(userName);

  if (!userName) {
    return redirect("/signup"); // Redirect if the user is not authenticated
  }

  return { user: { name: userName } }; // Return the user data as an object
}

// Action to handle the logout process
export async function action({ request }: ActionFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  return redirect("/signup", {
    headers: {
      "Set-Cookie": await destroySession(session), // Destroy the session on logout
    },
  });
}

// HomePage component that displays user info and handles logout
export default function HomePage() {
  const { user } = useLoaderData<LoaderData>();

  return (
    <div>
      <h1>Welcome, {user?.name}!</h1> {/* Display user name correctly */}
      <p>You have successfully signed up.</p>

      {/* Logout Form */}
      <Form method="post">
        <button type="submit">Logout</button>
      </Form>
    </div>
  );
}
