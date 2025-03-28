import { LoginForm } from "./LoginForm";

export default function Login() {
  return (
    <div className="relative z-10 w-full flex flex-col items-center">
      <h1 className="text-white text-shadow-md text-8xl">LOGIN</h1>
      <LoginForm />
    </div>
  );
}