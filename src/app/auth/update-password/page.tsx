'use client';
import { UpdatePasswordForm } from "@/components/auth/update-password/UpdatePasswordForm";

export default function UpdatePasswordPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10 bg-muted">
      <div className="w-full max-w-sm md:max-w-3xl">
        <UpdatePasswordForm />
      </div>
    </div>
  )
}