"use server";

import { createSession, decrypt, deleteSession } from "@/lib/session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function login(prevState: any, formData: FormData) {
  const userEmail = formData.get('email');
  const userPassword = formData.get('password');

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/login`, {
      method: 'POST',
      headers: {
        Accept: 'application.json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: userEmail, password: userPassword }),
    });
    const data = await response.json();
    const message = data.message;
    const token = data.token;
    const user = data.user;
    if ( response.status != 200) {
      console.log("status code", response.status, "message", message);
      console.log("message = ", message);
      return {
        errors: {
          message: message,
        },
      };
    } else {
      console.log("Login successful:", data);
      await createSession(token, user);
    }
  } catch (error) {
    return {
      errors: {
        message: "Cannot connect to server",
      },
    };
  }
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);
  const userRole = session?.user?.role;
  if (userRole === "ADMIN") {
    redirect("/admin");
  }
  redirect("/");
}

export async function logout() {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);
  try {
    const response = await fetch('http://localhost/api/revoke', {
      method: 'DELETE',
      headers: {
        Accept: 'application.json',
        Authorization: `Bearer ${session?.token}`,
      },
    });
  } catch (error) {
    return {
      errors: {
        message: "Cannot connect to server",
      },
    };
  }
  await deleteSession();
  redirect("/");
}