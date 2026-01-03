import { SignUp } from "@clerk/clerk-react";

export function SignUpPage() {
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-4rem)] py-10 bg-muted/20">
      <SignUp path="/sign-up" routing="path" signInUrl="/sign-in" afterSignUpUrl="/kanban" />
    </div>
  );
}
