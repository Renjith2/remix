


import { Form, json, redirect, useActionData, useNavigation } from "@remix-run/react";
import type { ActionFunctionArgs } from "@remix-run/node";
import { validateEmail, validateName, validatePassword } from "~/utils/validation";
import { authenticator } from "~/services/auth.server";
import { LoaderFunctionArgs } from "@remix-run/node";
import { getSession, commitSession } from "~/services/session.server";


type SignupActionData = {
  errors?: {
    name?: string;
    email?: string;
    password?: string;
  };
  values?: {
    name?: string;
    email?: string;
    password?: string;
  };
  error?: string;
};



// Loader to check if the user is already authenticated
export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const user = session.get("userName"); // Retrieve the userName from the session
  
  if (user) {
    // If the user is authenticated, redirect them to the home page
    return redirect("/home");
  }

  // If the user is not authenticated, return null
  return null;
}


export async function action({ request }: ActionFunctionArgs) {
  const clonedRequest = request.clone(); 
  const body = await request.formData();
  const name = body.get("name") as string;
  const email = body.get("email") as string;
  const password = body.get("password") as string;

  const errors: SignupActionData["errors"] = {};

  // Validate the data
  if (!name || !email || !password) {
    return json({ error: "All fields are required" }, { status: 400 });
  }

  
  // Use imported validation functions
  if (!validateName(name as string)) {
    errors.name = "Name must be more than 5 characters and contain only letters and spaces.";
  }

  if (!validateEmail(email as string)) {
    errors.email = "Email must end with @gmail.com.";
  }

  if (!validatePassword(password as string)) {
    errors.password = "Password must be at least 10 characters long, contain at least one uppercase letter, one lowercase letter, one digit, and one special character.";
  }

  // Check for errors before proceeding to user creation
  if (Object.keys(errors).length > 0) {
    return json({ errors, values: { name, email, password } }, { status: 400 });
  }

  try {
    // Authenticate the user
    const user = await authenticator.authenticate("user-pass", clonedRequest);

    if (user) {
      // Create a session with the user's name
      let session = await getSession(request.headers.get("Cookie"));
      session.set("userName", user.name); // Use name instead of id
      const cookie = await commitSession(session);

      // Redirect to the home page and attach the session cookie
      return redirect("/home", {
        headers: {
          "Set-Cookie": cookie,
        },
      });
    }

    return redirect("/signup");

  } catch (error) {
    console.error("Failed to create user:", error);
    return json({ error: "Failed to create user" }, { status: 500 });
  }
}





export default function SignupPage() {
  const actionData = useActionData<SignupActionData>(); // Access action data (errors, values)
  const navigation = useNavigation(); // Handle form submission state

  return (
    <div>
      <h1>Signup</h1>
      <Form method="post">
        <label>
          Name: 
          <input 
            type="text" 
            name="name" 
            defaultValue={actionData?.values?.name || ""} 
          />
        </label>
        <br />
        {actionData?.errors?.name && (
          <p style={{ color: "red" }}>{actionData.errors.name}</p>
        )}

        <label>
          Email: 
          <input 
            type="email" 
            name="email" 
            defaultValue={actionData?.values?.email || ""} 
          />
        </label>
        <br />
        {actionData?.errors?.email && (
          <p style={{ color: "red" }}>{actionData.errors.email}</p>
        )}

        <label>
          Password: 
          <input 
            type="password" 
            name="password" 
            defaultValue={actionData?.values?.password || ""} 
          />
        </label>
        <br />
        {actionData?.errors?.password && (
          <p style={{ color: "red" }}>{actionData.errors.password}</p>
        )}

        {actionData?.error && (
          <p style={{ color: "red" }}>{actionData.error}</p>
        )}

        <button type="submit" disabled={navigation.state === "submitting"}>
          {navigation.state === "submitting" ? "Signing up..." : "Sign up"}
        </button>
      </Form>
    </div>
  );
}

