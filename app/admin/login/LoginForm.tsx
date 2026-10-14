"use client";

import { loginAction } from "@/app/admin/actions";
import { ActionForm, Field, SubmitButton } from "@/components/admin/ui";

export function LoginForm() {
  return (
    <ActionForm action={loginAction} className="space-y-5">
      <Field label="Password">
        <input name="password" type="password" required autoFocus autoComplete="current-password" className="admin-input" />
      </Field>
      <SubmitButton>Sign in</SubmitButton>
    </ActionForm>
  );
}
