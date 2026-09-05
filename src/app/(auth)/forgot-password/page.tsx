"use client";

import Link from "next/link";
import { useState } from "react";
import { KeyRound, Phone } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SUPPORT_PHONE, SUPPORT_EMAIL } from "@/lib/constants";
import { useLanguage } from "@/context/LanguageContext";

export default function ForgotPasswordPage() {
  const { t } = useLanguage();
  const [phone, setPhone] = useState("");

  return (
    <div className="w-full max-w-md">
      <div className="mb-8 flex flex-col items-center text-center">
        <Logo />
        <h1 className="mt-6 flex items-center gap-2 text-2xl font-bold">
          <KeyRound className="size-6 text-primary" /> {t("Password reset")}
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          {t("Need help getting back into your account?")}
        </p>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">{t("Contact support")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {t(
              "We don't have automated password resets yet. Please reach out to our support team and we'll help you reset your password manually."
            )}
          </p>
          <div className="space-y-1.5">
            <Label htmlFor="phone">{t("Phone number")}</Label>
            <Input
              id="phone"
              type="tel"
              className="h-11"
              placeholder="01XXXXXXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <span className="text-xs text-muted-foreground">
              {t("Include your phone number so we can verify your account.")}
            </span>
          </div>
          <div className="grid gap-2">
            <Button
              className="h-11 w-full"
              render={<a href={`tel:${SUPPORT_PHONE}`} />}
            >
              <Phone className="size-4" /> {t("Call support")} ({SUPPORT_PHONE})
            </Button>
            <Button
              variant="outline"
              className="h-11 w-full"
              render={<a href={`mailto:${SUPPORT_EMAIL}`} />}
            >
              {t("Email support")}
            </Button>
          </div>
            <Button
              variant="link"
              className="w-full"
              render={<Link href="/login">{t("Back to login")}</Link>}
            />
        </CardContent>
      </Card>
    </div>
  );
}