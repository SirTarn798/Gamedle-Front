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
  const result = loginSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const { email, password, previousUrl } = result.data;

  if (email !== testUser.email || password !== testUser.password) {
    return {
      errors: {
        email: ["Invalid email or password"],
      },
    };
  }

  await createSession(testUser.id, testUser.name, testUser.role);
  if (previousUrl) {
    redirect(previousUrl);
  } else {
    redirect("/");
  }
}

export async function logout() {
  await deleteSession();
  redirect("/");
}