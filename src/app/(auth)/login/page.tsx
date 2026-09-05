"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Phone } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

const loginFormSchema = z.object({
  identifier: z.string().min(3, "Please enter your phone or email"),
  password: z.string().min(1, "Please enter your password"),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

export default function LoginPage() {
  // useSearchParams + router need a suspense boundary during prerender
  return (
    <Suspense
      fallback={
        <div className="flex h-64 w-full max-w-md animate-pulse items-center justify-center rounded-2xl bg-muted" />
      }
    >
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const { login } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { identifier: "", password: "" },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setSubmitting(true);
    const result = await login(values.identifier, values.password);
    setSubmitting(false);

    if (!result.ok) {
      setFormError(result.error ?? t("Unable to log in."));
      return;
    }

    const next = searchParams.get("next");
    const fallback =
      result.role === "admin"
        ? "/admin"
        : result.role === "provider"
          ? "/provider"
          : "/dashboard";
    router.push(next || fallback);
    router.refresh();
  };

  const [formError, setFormError] = useState<string | null>(null);

  return (
    <div className="w-full max-w-md">
      <div className="mb-8 flex flex-col items-center text-center">
        <Logo />
        <h1 className="mt-6 text-2xl font-bold">{t("Welcome back!")}</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          {t("Log in to access your account")}
        </p>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">{t("Login")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
            noValidate
          >
            <div className="space-y-1.5">
              <Label htmlFor="identifier">{t("Phone or email")}</Label>
              <div className="relative">
                <Phone className="pointer-events-none absolute inset-y-0 left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="identifier"
                  type="text"
                  autoComplete="username"
                  placeholder="01XXXXXXXXX"
                  className="h-11 pl-10"
                  {...register("identifier")}
                  aria-invalid={Boolean(errors.identifier)}
                />
              </div>
              {errors.identifier && (
                <p className="text-xs text-destructive">{t(errors.identifier.message ?? "")}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">{t("Password")}</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  className="h-11 pr-10"
                  placeholder="••••••••"
                  {...register("password")}
                  aria-invalid={Boolean(errors.password)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? t("Hide password") : t("Show password")}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive">{t(errors.password.message ?? "")}</p>
              )}
            </div>

            {formError && (
              <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {formError}
              </p>
            )}

            <Button type="submit" className="h-11 w-full" disabled={submitting}>
              {submitting ? t("Logging in...") : t("Login")}
            </Button>
          </form>

          <div className="mt-5 flex items-center justify-between text-sm">
            <Link href="/forgot-password" className="font-medium text-primary hover:underline">
              {t("Forgot your password?")}
            </Link>
            <Link href="/register" className="font-medium text-primary hover:underline">
              {t("Create account")}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}