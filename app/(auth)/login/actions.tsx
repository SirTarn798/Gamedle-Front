"use server";

import { z } from "zod";
import { createSession, deleteSession } from "@/lib/session";
import { redirect } from "next/navigation";

const testUser = {
  id: "1",
  name: "steve",
  role: "user",
  email: "admin@gmail.com",
  password: "12345678",
};
const testUserStaff = {
  id: "1",
  name: "steve",
  role: "staff",
  email: "admin@gmail.com",
  password: "12345678",
};

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }).trim(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .trim(),
  previousUrl: z.string().optional(), // Add previousUrl to schema
});

export async function login(prevState: any, formData: FormData) {
  console.log(formData)
  // console.log(formData.get('email')); // Correct way to get email
  // console.log(formData.get('password')); // Correct way to get password
  const userEmail = formData.get('email');
  const userPassword = formData.get('password');

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

  if ( response.status == 200) {
    console.log("200 OK p ja")
  } else {
    return {
      error: message,
    };
  }

  await createSession(token, user);
  redirect("/");



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