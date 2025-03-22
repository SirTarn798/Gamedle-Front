"use server";

import { createSession, deleteSession } from "@/lib/session";
import { redirect } from "next/navigation";

export async function login(prevState: any, formData: FormData) {
  console.log(formData)
  const userEmail = formData.get('email');
  const userPassword = formData.get('password');

  try {
    const response = await fetch('http://localhost/api/login', {
      method: 'POST',
      headers: {
        Accept: 'application.json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: userEmail, password: userPassword }),
    });
    console.log(response);
    const data = await response.json();
    console.log("Login successful:", data);
  
    const message = data.message;
    const token = data.token;
    const user = data.user;
  
    if ( response.status != 200) {
      return {
        errors: {
          message: message,
        },
      };
    }
  
    await createSession(token, user);
    redirect("/");
  } catch (error) {
    return {
      errors: {
        message: "Cannot connect to server",
      },
    };
  }


  // const result = loginSchema.safeParse(Object.fromEntries(formData));

  // if (!response.ok) {
  //   return {
  //     errors: response.error.flatten().fieldErrors,
  //   };
  // }

  // const { email, password, previousUrl } = response.data;

  // if (email !== testUser.email || password !== testUser.password) {
  //   return {
  //     errors: {
  //       email: ["Invalid email or password"],
  //     },
  //   };
  // }

  // await createSession(testUser.id, testUser.name, testUser.role);
  // if (previousUrl) {
  //   redirect(previousUrl);
  // } else {
  //   redirect("/");
  // }
}

export async function logout() {
  await deleteSession();
  redirect("/");
}