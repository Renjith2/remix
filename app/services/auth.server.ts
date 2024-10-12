

import { Authenticator } from "remix-auth";
import { sessionStorage } from "~/services/session.server";
import { FormStrategy } from "remix-auth-form";
import { createUser } from "~/src"; // Ensure this is the correct path to your user creation logic
import { User } from "~/model/user"; // Ensure this is the correct path to your user model


// Create an instance of the authenticator
export let authenticator = new Authenticator<User>(sessionStorage);

authenticator.use(
  new FormStrategy(async ({ form }) => {
   // Extract the user registration details from the form
   let nameEntry = form.get("name");
   let emailEntry = form.get("email");
   let passwordEntry = form.get("password");

   // Ensure that the values are strings
   let name = typeof nameEntry === 'string' ? nameEntry : '';
   let email = typeof emailEntry === 'string' ? emailEntry : '';
   let password = typeof passwordEntry === 'string' ? passwordEntry : '';
    if (!name || !email || !password) {
      throw new Error("All fields are required.");
    }

    try {
      let user = await createUser(name, email, password);
      console.log(user);

 

      return user; // Should only return user data without additional info
    } catch (error) {
      // Use type assertion to tell TypeScript the type of error
      if (error instanceof Error) {
        throw new Error("Failed to create user: " + error.message);
      } else {
        throw new Error("Failed to create user due to an unknown error.");
      }
    }
  }),
  "user-pass" // Strategy name
);


