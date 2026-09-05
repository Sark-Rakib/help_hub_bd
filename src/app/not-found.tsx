"use client";

import Link from "next/link";
import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";

export default function NotFound() {
  const { t } = useLanguage();
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="flex size-20 items-center justify-center rounded-full bg-muted">
        <SearchX className="size-10 text-muted-foreground" />
      </div>
      <h1 className="mt-6 text-3xl font-extrabold sm:text-4xl">
        {t("404 — Not Found")}
      </h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        {t("The page you're looking for doesn't exist. The link may be broken, or the page may have moved.")}
      </p>
      <div className="mt-8 flex gap-3">
        <Button render={<Link href="/" />}>{t("Home page")}</Button>
        <Button variant="outline" render={<Link href="/search" />}>
          {t("Find providers")}
        </Button>
      </div>
    </div>
  );
}