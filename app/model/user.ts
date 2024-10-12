// app/model/user.ts
export interface User {
    email: string;  // User's email
    name: string;   // User's name
    password: string; // User's password (hashed)
  }
  

  // Define the type for the LoaderData, assuming user has a name property
export type LoaderData = {
  user: {
    name: string; // Adjust this based on your actual user object structure
  } | null; // User can be null if not authenticated
};

export type CreateUserResponse = User | { message: string };


