import { SignIn } from "@clerk/clerk-react";

export function SignInPage() {
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-4rem)] py-10 bg-muted/20">
      <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" afterSignInUrl="/kanban" />
    </div>
  );
}
