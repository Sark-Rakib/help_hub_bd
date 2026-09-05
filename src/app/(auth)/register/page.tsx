"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Store, UserRound } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import { uploadFile } from "@/lib/upload";
import { toast } from "sonner";

const registerFormSchema = z.object({
  name: z.string().min(2, "Please enter your name (minimum 2 letters)"),
  phone: z
    .string()
    .regex(/^(?:\+?88)?01[3-9]\d{8}$/, "Enter a valid Bangladesh phone number"),
  email: z
    .union([z.string().email("Enter a valid email"), z.literal("")])
    .optional(),
  password: z.string().min(6, "Password at least 6 characters"),
});

type RegisterFormValues = z.infer<typeof registerFormSchema>;

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 w-full max-w-md animate-pulse items-center justify-center rounded-2xl bg-muted" />
      }
    >
      <RegisterForm />
    </Suspense>
  );
}

function RegisterForm() {
  const { register: registerFn, updateProfile } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [role, setRole] = useState<"user" | "provider">(
    (searchParams.get("role") as "user" | "provider") ?? "user"
  );
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: { name: "", phone: "", email: "", password: "" },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setSubmitting(true);
    setFormError(null);
    const result = await registerFn({
      name: values.name,
      phone: values.phone,
      email: values.email || undefined,
      password: values.password,
      role,
    });
    if (result.ok && avatarFile) {
      try {
        const avatar = await uploadFile(avatarFile);
        await updateProfile({ avatar });
      } catch (e) {
        toast.error(
          (e as Error).message || t("Account created, but the photo could not be uploaded.")
        );
      }
    }
    setSubmitting(false);

    if (!result.ok) {
      setFormError(result.error ?? t("Unable to register."));
      return;
    }

    router.push(role === "provider" ? "/become-provider" : "/");
    router.refresh();
  };

  return (
    <div className="w-full max-w-md">
      <div className="mb-8 flex flex-col items-center text-center">
        <Logo />
        <h1 className="mt-6 text-2xl font-bold">{t("Create account")}</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          {t("Find services in Sherpur or become a provider")}
        </p>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">{t("Register")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-5 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setRole("user")}
              className={cn(
                "flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors",
                role === "user"
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border text-muted-foreground hover:bg-muted"
              )}
            >
              <UserRound className="size-4" />
              {t("Customer")}
            </button>
            <button
              type="button"
              onClick={() => setRole("provider")}
              className={cn(
                "flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors",
                role === "provider"
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border text-muted-foreground hover:bg-muted"
              )}
            >
              <Store className="size-4" />
              {t("Provider")}
            </button>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
            noValidate
          >
            <div className="space-y-1.5">
              <Label>{t("Profile photo (optional)")}</Label>
              {avatarPreview ? (
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={avatarPreview}
                    alt=""
                    className="size-14 rounded-full object-cover ring-2 ring-primary/30"
                  />
                  <div className="space-y-1">
                    <Label
                      htmlFor="avatar-reset"
                      className="cursor-pointer text-xs font-medium text-primary hover:underline"
                    >
                      <input
                        id="avatar-reset"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (!f) return;
                          setAvatarFile(f);
                          setAvatarPreview(URL.createObjectURL(f));
                        }}
                      />
                      {t("Change photo")}
                    </Label>
                    <button
                      type="button"
                      onClick={() => {
                        setAvatarFile(null);
                        setAvatarPreview(null);
                      }}
                      className="block text-xs text-muted-foreground hover:text-destructive"
                    >
                      {t("Remove")}
                    </button>
                  </div>
                </div>
              ) : (
                <Label
                  htmlFor="avatar-upload"
                  className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-border px-3 py-5 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
                >
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (!f) return;
                      setAvatarFile(f);
                      setAvatarPreview(URL.createObjectURL(f));
                    }}
                  />
                  {t("Add a profile photo")}
                </Label>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="name">{t("Your name")}</Label>
              <Input
                id="name"
                className="h-11"
                placeholder="Rahim Khan"
                {...register("name")}
                aria-invalid={Boolean(errors.name)}
              />
              {errors.name && (
                <p className="text-xs text-destructive">{t(errors.name.message ?? "")}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone">{t("Phone number")}</Label>
              <Input
                id="phone"
                type="tel"
                className="h-11"
                placeholder="01XXXXXXXXX"
                {...register("phone")}
                aria-invalid={Boolean(errors.phone)}
              />
              {errors.phone && (
                <p className="text-xs text-destructive">{t(errors.phone.message ?? "")}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">{t("Email (optional)")}</Label>
              <Input
                id="email"
                type="email"
                className="h-11"
                placeholder="rahim@example.com"
                {...register("email")}
                aria-invalid={Boolean(errors.email)}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{t(errors.email.message ?? "")}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">{t("Password")}</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="h-11 pr-10"
                  placeholder={t("Minimum 6 characters")}
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
              {submitting
                ? t("Creating account...")
                : role === "provider"
                  ? t("Create provider account")
                  : t("Create account")}
            </Button>
          </form>

          <div className="mt-5 text-center text-sm text-muted-foreground">
            {t("Already have an account?")}{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              {t("Login")}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}