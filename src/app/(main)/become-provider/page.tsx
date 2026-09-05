"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Loader2,
  Store,
  BadgeCheck,
  TrendingUp,
  Clock,
  ImagePlus,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CATEGORIES,
  SHERPUR_LOCATIONS,
  prettyArea,
} from "@/lib/constants";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useCategories } from "@/hooks/useQueries";
import { uploadFile } from "@/lib/upload";

const DAYS = [
  "Saturday",
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
];

const becomeProviderSchema = {
  businessName: { required: "Business name required" },
  category: { required: "Please select a category" },
  phone: {
    required: "Phone required",
    pattern: {
      value: /^(?:\+?88)?01[3-9]\d{8}$/,
      message: "Please enter a valid Bangladesh phone number",
    },
  },
  address: { required: "Please enter your address" },
  area: { required: "Please select an area" },
  experienceYears: { required: "Please enter your experience" },
  description: { required: "Please tell customers a bit about yourself" },
  startingPrice: {
    pattern: {
      value: /^\d*\.?\d*$/,
      message: "Please enter a valid amount",
    },
  },
  name: {
    required: "Name required",
    minLength: { value: 2, message: "Name is too short" },
  },
  password: {
    required: "Password required",
    minLength: { value: 6, message: "Password must be at least 6 characters" },
  },
};

export default function BecomeProviderPage() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const { t } = useLanguage();
  const { data: dbCategories } = useCategories();
  const categoryOptions = (() => {
    const list = dbCategories && dbCategories.length > 0 ? dbCategories : CATEGORIES;
    const seen = new Set(list.map((c) => c.slug));
    return [
      ...list,
      ...CATEGORIES.filter((c) => !seen.has(c.slug)),
    ];
  })();
  const [workEnabled, setWorkEnabled] = useState(true);
  const [workOpen, setWorkOpen] = useState("09:00");
  const [workClose, setWorkClose] = useState("18:00");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      businessName: "",
      category: "",
      phone: user?.phone ?? "",
      address: "",
      area: "Sherpur Sadar",
      experienceYears: "",
      description: "",
      startingPrice: "",
      name: user?.name ?? "",
      password: "",
    },
  });

  const removeAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
  };

  const removePhoto = (index: number) => {
    setPhotoFiles((prev) => prev.filter((_, i) => i !== index));
    setPhotoPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (values: Record<string, string>) => {
    try {
      if (workEnabled) {
        if (!workOpen || !workClose) {
          toast.error(t("Please set the start and end time of your working hours."));
          return;
        }
        if (workOpen >= workClose) {
          toast.error(t("Closing time must be after the opening time."));
          return;
        }
      }
      if (!user && !avatarFile) {
        toast.error(t("Please add a profile photo — new providers need one."));
        return;
      }
      const workingHours = workEnabled
        ? DAYS.map((day) => ({ day, open: workOpen, close: workClose }))
        : [];
      const res = await fetch("/api/become-provider", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(!user ? { name: values.name, password: values.password } : {}),
          ...values,
          experience: values.experienceYears,
          startingPrice: values.startingPrice
            ? Number(values.startingPrice)
            : undefined,
          workingHours,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error || t("Unable to submit provider application."));
        return;
      }

      // Optional photos — upload after the account is created (needs login).
      if (avatarFile || photoFiles.length) {
        setUploading(true);
        try {
          const avatarUrl = avatarFile ? await uploadFile(avatarFile) : undefined;
          const photoUrls: string[] = [];
          for (const file of photoFiles) {
            photoUrls.push(await uploadFile(file));
          }
          const update: Record<string, unknown> = {};
          if (avatarUrl) update.avatar = avatarUrl;
          if (photoUrls.length) update.photos = photoUrls;
          if (Object.keys(update).length) {
            const up = await fetch("/api/provider-me", {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(update),
            });
            if (!up.ok) throw new Error("photos failed");
          }
        } catch {
          toast.error(t("Profile saved, but one of your photos failed to upload."));
        } finally {
          setUploading(false);
        }
      }

      toast.success(t("Application submitted! We'll review and approve it."));
      await refreshUser();
      setTimeout(() => router.push("/provider"), 1500);
    } catch {
      toast.error(t("Something went wrong. Please try again."));
    }
  };

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6">
      <header className="text-center">
        <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
          <Store className="size-7" />
        </span>
        <h1 className="mt-4 text-2xl font-bold sm:text-3xl">
          {t("Become a Provider")}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {t("People in Sherpur are looking for services — become a provider and connect with them. Free signup, 0% commission.")}
        </p>
      </header>

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        {[
          {
            icon: TrendingUp,
            title: "More customers",
            desc: "Frequent 12k+ visits",
          },
          {
            icon: BadgeCheck,
            title: "Verified badge",
            desc: "Reviewed and approved by admin",
          },
          {
            icon: Store,
            title: "Free listing",
            desc: "0% commission, no fee",
          },
        ].map((f) => (
          <div
            key={f.title}
            className="rounded-xl border border-border bg-card p-4 text-center"
          >
            <f.icon className="mx-auto size-5 text-primary" />
            <p className="mt-2 text-sm font-semibold">{t(f.title)}</p>
            <p className="text-xs text-muted-foreground">{t(f.desc)}</p>
          </div>
        ))}
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-8 space-y-4 rounded-2xl border border-border bg-card p-6"
        noValidate
      >
        {!user ? (
          <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
            {t("No account? No problem. Your name and password below create your account when you apply.")}
          </p>
        ) : (
          <p className="rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">
            {t("Applying as")}{" "}
            <span className="font-medium text-foreground">{user.name}</span> ({user.phone})
          </p>
        )}

        {!user && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="name">{t("Your name")}</Label>
              <Input
                id="name"
                placeholder="e.g. Rafiqul Islam"
                {...register("name", becomeProviderSchema.name)}
                aria-invalid={Boolean(errors.name)}
              />
              {errors.name && (
                <p className="text-xs text-destructive">{t(errors.name.message ?? "")}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">{t("Password")}</Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                placeholder="********"
                {...register("password", becomeProviderSchema.password)}
                aria-invalid={Boolean(errors.password)}
              />
              {errors.password && (
                <p className="text-xs text-destructive">{t(errors.password.message ?? "")}</p>
              )}
            </div>
          </div>
        )}

        {user && (
          <div className="space-y-1.5">
            <Label htmlFor="name">{t("Your name")}</Label>
            <Input
              id="name"
              value={user.name}
              readOnly
              className="bg-muted text-muted-foreground"
              aria-label={t("Your name")}
            />
            <p className="text-xs text-muted-foreground">
              {t("Your name is taken from your account.")}
            </p>
          </div>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="businessName">{t("Business name")}</Label>
          <Input
            id="businessName"
            placeholder="e.g. Rashed Electric House"
            {...register("businessName", becomeProviderSchema.businessName)}
            aria-invalid={Boolean(errors.businessName)}
          />
          {errors.businessName && (
            <p className="text-xs text-destructive">{t(errors.businessName.message ?? "")}</p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="category">{t("Service category")}</Label>
            <select
              id="category"
              className="h-9 w-full rounded-lg border border-input bg-background px-2 text-sm"
              {...register("category", becomeProviderSchema.category)}
            >
              <option value="">{t("Select category...")}</option>
              {categoryOptions.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-xs text-destructive">{t(errors.category.message ?? "")}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="experienceYears">{t("Experience (years)")}</Label>
            <Input
              id="experienceYears"
              type="number"
              min={0}
              placeholder="e.g. 5"
              {...register("experienceYears", becomeProviderSchema.experienceYears)}
            />
            {errors.experienceYears && (
              <p className="text-xs text-destructive">{t(errors.experienceYears.message ?? "")}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="startingPrice">{t("Starting rate")} (৳)</Label>
            <Input
              id="startingPrice"
              type="number"
              min={0}
              placeholder="e.g. 500"
              {...register("startingPrice", becomeProviderSchema.startingPrice)}
            />
            {errors.startingPrice && (
              <p className="text-xs text-destructive">{t(errors.startingPrice.message ?? "")}</p>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="phone">{t("Phone number")}</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="01XXXXXXXXX"
            {...register("phone", becomeProviderSchema.phone)}
            aria-invalid={Boolean(errors.phone)}
          />
          {errors.phone && (
            <p className="text-xs text-destructive">{t(errors.phone.message ?? "")}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="address">{t("Address")}</Label>
          <Input
            id="address"
            placeholder={t("Shop/Road, village...")}
            {...register("address", becomeProviderSchema.address)}
          />
          {errors.address && (
            <p className="text-xs text-destructive">{t(errors.address.message ?? "")}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="area">{t("Service area")}</Label>
          <select
            id="area"
            className="h-9 w-full rounded-lg border border-input bg-background px-2 text-sm"
            {...register("area", becomeProviderSchema.area)}
          >
            {SHERPUR_LOCATIONS.map((loc) => (
              <option key={loc.area} value={loc.area}>
                {prettyArea(loc.area)}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="description">{t("About you — description")}</Label>
          <textarea
            id="description"
            rows={4}
            placeholder={t("How many years of experience, which services you offer, your pricing... (customers will see this)")}
            className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            {...register("description", becomeProviderSchema.description)}
          />
          {errors.description && (
            <p className="text-xs text-destructive">{t(errors.description.message ?? "")}</p>
          )}
        </div>

        <div className="space-y-3 rounded-2xl border border-border p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Clock className="size-4 text-primary" />
              <Label className="cursor-pointer" htmlFor="workEnabled">
                {t("Working hours")}
              </Label>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                id="workEnabled"
                type="checkbox"
                checked={workEnabled}
                onChange={(e) => setWorkEnabled(e.target.checked)}
                className="size-4 shrink-0 accent-primary"
              />
              {t("Open for work")}
            </label>
          </div>
          <p className="text-xs text-muted-foreground">
            {t("Set the hours customers can reach you. You can change these later from your dashboard.")}
          </p>
          {workEnabled && (
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <div className="space-y-1.5">
                <Label htmlFor="workOpen">{t("From")}</Label>
                <Input
                  id="workOpen"
                  type="time"
                  value={workOpen}
                  onChange={(e) => setWorkOpen(e.target.value)}
                  className="w-32"
                />
              </div>
              <span className="mt-5 text-sm text-muted-foreground">–</span>
              <div className="space-y-1.5">
                <Label htmlFor="workClose">{t("To")}</Label>
                <Input
                  id="workClose"
                  type="time"
                  value={workClose}
                  onChange={(e) => setWorkClose(e.target.value)}
                  className="w-32"
                />
              </div>
              <span className="mt-5 text-xs text-muted-foreground">
                @{t("same hours every day")}
              </span>
            </div>
          )}
        </div>

        <div className="space-y-3 rounded-2xl border border-border p-4">
          <div className="flex items-center gap-2">
            <ImagePlus className="size-4 text-primary" />
            <Label>
              {t("Photos")}
              {!user && <span className="ml-1 text-destructive">*</span>}
            </Label>
          </div>
          <p className="text-xs text-muted-foreground">
            {!user
              ? t("Add a profile photo to get started. Work photos are optional. Max 5MB each.")
              : t("Optional — add a profile photo and a few photos of your work. Max 5MB each.")}
          </p>

          <div className="space-y-1.5">
            <Label>
              {t("Profile photo")}
              {!user && <span className="ml-1 text-destructive">*</span>}
            </Label>
            {avatarPreview ? (
              <div className="flex items-center gap-3">
                <img
                  src={avatarPreview}
                  alt=""
                  className="size-16 rounded-full border border-border object-cover"
                />
                <div className="flex flex-col gap-2">
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-input px-3 py-1.5 text-sm hover:bg-muted">
                    <ImagePlus className="size-4 text-primary" />
                    {t("Change photo")}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0] ?? null;
                        setAvatarFile(f);
                        setAvatarPreview(f ? URL.createObjectURL(f) : null);
                      }}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={removeAvatar}
                    className="inline-flex items-center gap-1 text-sm text-destructive hover:underline"
                  >
                    <X className="size-3.5" /> {t("Remove photo")}
                  </button>
                </div>
              </div>
            ) : (
              <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed px-3 py-2 text-sm hover:bg-muted">
                <ImagePlus className="size-4 text-primary" />
                {t("Choose profile photo")}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0] ?? null;
                    setAvatarFile(f);
                    setAvatarPreview(f ? URL.createObjectURL(f) : null);
                  }}
                />
              </label>
            )}
          </div>

          <div className="space-y-1.5">
            <Label>{t("Photos of your work")}</Label>
            <div className="flex flex-wrap gap-2">
              {photoPreviews.map((src, i) => (
                <div key={src + i} className="relative">
                  <img
                    src={src}
                    alt=""
                    className="size-20 rounded-lg border border-border object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(i)}
                    className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-foreground text-background"
                    aria-label={t("Remove photo")}
                  >
                    <X className="size-3" />
                  </button>
                </div>
              ))}
              {photoFiles.length < 6 && (
                <label className="flex size-20 cursor-pointer items-center justify-center rounded-lg border border-dashed text-muted-foreground hover:bg-muted">
                  <ImagePlus className="size-5" />
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      const files = Array.from(e.target.files ?? []);
                      if (!files.length) return;
                      setPhotoFiles((prev) => [...prev, ...files]);
                      setPhotoPreviews((prev) => [
                        ...prev,
                        ...files.map((f) => URL.createObjectURL(f)),
                      ]);
                    }}
                  />
                </label>
              )}
            </div>
          </div>
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={isSubmitting || uploading}
        >
          {isSubmitting || uploading ? (
            <>
              <Loader2 className="size-4 animate-spin" /> {t("Submitting...")}
            </>
          ) : (
            t("Apply as Provider")
          )}
        </Button>
      </form>
    </main>
  );
}