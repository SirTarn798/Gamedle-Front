"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { login } from "./actions";

export function LoginForm() {
  const [state, loginAction] = useActionState(login, undefined);

  return (
    <form action={loginAction} className="w-4/12 bg-mainTheme bg-opacity-50 p-6 rounded-lg text-white text-xl">
      <div className="grid grid-cols-[auto_1fr] gap-4 items-center">
        <h1>Email</h1>
        <input 
          id="email" 
          name="email" 
          placeholder="Email"
          className="text-secondaryColor p-2 rounded-md border-2 border-secondaryColor bg-mainTheme text-lg"
         />
        <h1>Password</h1>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Password"
          className="text-secondaryColor p-2 rounded-md border-2 border-secondaryColor bg-mainTheme text-lg"
        />
      </div>
      <div className="flex-col items-center justify-center">
        {state?.errors?.message && (
          <div className="mt-6 text-red-500 place-self-center">{state.errors.message}</div>
        )}
        <div className="mt-6 place-self-center">
          <button
            type="submit"
            className="border-2 border-white hover:bg-acceptGreen hover:border-0 hover:text-black text-white px-8 py-2 rounded-md transition-colors duration-200 font-medium"
          >
            Sign Up
          </button>
        </div>
      </div>
    </form>
  );
}

export default function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button disabled={pending} type="submit">
      Login
    </button>
  );
}