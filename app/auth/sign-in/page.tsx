import { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-900">
      <SignIn
        appearance={{
          baseTheme: dark,
          elements: {
            formTitle: "font-extrabold text-4xl",
            welcomeMessage: "font-bold text-3xl",
            signUpLink: "font-semibold text-xl",
          },
        }}
      />
    </div>
  );
}
