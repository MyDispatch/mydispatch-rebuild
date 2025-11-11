import { LoginForm } from "@/components/login-form";
import { SignUpForm } from "@/components/sign-up-form";

export default function PreAuthPage() {
  return (
    <div className="min-h-svh w-full p-6 md:p-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold">Willkommen bei MyDispatch</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Melde dich an oder registriere dich, um fortzufahren.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          <div aria-labelledby="login-heading">
            <h2 id="login-heading" className="sr-only">Anmelden</h2>
            <LoginForm />
          </div>
          <div aria-labelledby="signup-heading">
            <h2 id="signup-heading" className="sr-only">Registrieren</h2>
            <SignUpForm />
          </div>
        </div>
      </div>
    </div>
  );
}
