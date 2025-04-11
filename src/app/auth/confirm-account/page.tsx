'use client';
import { ConfirmAccountForm } from "@/components/auth/confirm-account/ConfirmAccountForm";
import { Suspense } from "react";

export default function ConfirmAccountPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10 bg-muted">
      <div className="w-full max-w-sm md:max-w-3xl">
        <Suspense fallback={<div className="text-center">Loading...</div>}>
          <ConfirmAccountForm />
        </Suspense>
      </div>
    </div>
  )
}