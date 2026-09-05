"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, Phone, Calendar, Clock, Wallet, MapPin, Siren } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getDateMin } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { SHERPUR_LOCATIONS, prettyArea } from "@/lib/constants";
import type { Provider } from "@/types";
import { useLanguage } from "@/context/LanguageContext";

const requestFormSchema = z.object({
  service: z.string().min(1, "What service do you need? Please select one"),
  description: z
    .string()
    .min(10, "Please describe the problem in a bit more detail")
    .max(2000, "Description is too long"),
  area: z.string().min(1, "Please select your area"),
  address: z.string().max(300).optional(),
  preferredDate: z.string().min(1, "Please select a preferred date"),
  preferredTime: z.string().optional(),
  budget: z.string().optional(),
  emergency: z.boolean().optional(),
  phone: z
    .string()
    .regex(/^(?:\+?88)?01[3-9]\d{8}$/, "Enter a valid Bangladesh phone number"),
});

type RequestFormValues = z.input<typeof requestFormSchema>;

const timeSlots = [
  "Morning (9am - 12pm)",
  "Noon (12pm - 3pm)",
  "Afternoon (3pm - 6pm)",
  "Evening (6pm - 9pm)",
];

export function ServiceRequestForm({
  provider,
  open,
  onOpenChange,
  defaultService,
}: {
  provider: Provider;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultService?: string;
}) {
  const router = useRouter();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<RequestFormValues>({
    resolver: zodResolver(requestFormSchema),
    defaultValues: {
      service: defaultService ?? provider.category,
      description: "",
      area: provider.location?.area ?? "Sherpur Sadar",
      address: "",
      preferredDate: "",
      preferredTime: timeSlots[0],
      budget: "",
      emergency: false,
      phone: user?.phone ?? "",
    },
  });

  // Auth may hydrate after the form mounts — make sure the customer's phone is prefilled.
  useEffect(() => {
    if (user?.phone) setValue("phone", user.phone);
  }, [user?.phone, setValue]);

  const onSubmit = async (values: RequestFormValues) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          providerId: provider._id,
          ...values,
          emergency: Boolean(values.emergency),
          preferredTime: values.preferredTime || undefined,
          budget: values.budget ? Number(values.budget) : undefined,
          address: values.address || undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error || t("Unable to send request."));
        return;
      }
      toast.success(t("Request sent successfully!"));
      onOpenChange(false);
      reset();
    } catch {
      toast.error(t("Something went wrong. Please try again."));
    } finally {
      setSubmitting(false);
    }
  };

  const handleLoginRedirect = () => {
    onOpenChange(false);
    router.push("/login");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">{t("Service Request")}</DialogTitle>
          <DialogDescription>
            {provider.businessName} — {t("the provider will respond when you send a request.")}
          </DialogDescription>
        </DialogHeader>

        {!user ? (
          <div className="space-y-4 py-2 text-center">
            <p className="text-sm text-muted-foreground">
              {t("You need an account to send a service request. It only takes a moment — just name, phone, password.")}
            </p>
            <div className="flex flex-col gap-2">
              <Button onClick={handleLoginRedirect}>{t("Login")}</Button>
              <Button variant="outline" onClick={() => router.push("/register")}>
                {t("Create an account")}
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div className="space-y-1.5">
              <Label htmlFor={`service-${provider._id}`}>{t("What service do you need?")}</Label>
              <Input
                id={`service-${provider._id}`}
                placeholder={t("e.g. AC gas charging, wiring...")}
                {...register("service")}
                aria-invalid={Boolean(errors.service)}
              />
              {errors.service && (
                <p className="text-xs text-destructive">{t(errors.service.message!)}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor={`desc-${provider._id}`}>{t("Describe the problem")}</Label>
              <textarea
                id={`desc-${provider._id}`}
                rows={3}
                placeholder={t("What's the problem? When did it start? Where? The more we know, the better the provider can help.")}
                className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                {...register("description")}
                aria-invalid={Boolean(errors.description)}
              />
              {errors.description && (
                <p className="text-xs text-destructive">{t(errors.description.message!)}</p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor={`area-${provider._id}`}>
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="size-3.5" /> {t("Your location")}
                  </span>
                </Label>
                <select
                  id={`area-${provider._id}`}
                  className="h-9 w-full rounded-lg border border-input bg-background px-2 text-sm"
                  {...register("area")}
                >
                  {SHERPUR_LOCATIONS.map((loc) => (
                    <option key={loc.area} value={loc.area}>
                      {prettyArea(loc.area)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor={`address-${provider._id}`}>{t("Full address")}</Label>
                <Input
                  id={`address-${provider._id}`}
                  placeholder={t("House, road, village...")}
                  {...register("address")}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor={`date-${provider._id}`}>
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="size-3.5" /> {t("Preferred date")}
                  </span>
                </Label>
                <Input
                  id={`date-${provider._id}`}
                  type="date"
                  min={getDateMin()}
                  className="h-9"
                  {...register("preferredDate")}
                  aria-invalid={Boolean(errors.preferredDate)}
                />
                {errors.preferredDate && (
                  <p className="text-xs text-destructive">
                    {t(errors.preferredDate.message!)}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor={`time-${provider._id}`}>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="size-3.5" /> {t("Preferred time")}
                  </span>
                </Label>
                <select
                  id={`time-${provider._id}`}
                  className="h-9 w-full rounded-lg border border-input bg-background px-2 text-sm"
                  {...register("preferredTime")}
                >
                  {timeSlots.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
                <Label htmlFor={`budget-${provider._id}`}>
                  <span className="inline-flex items-center gap-1">
                    <Wallet className="size-3.5" /> {t("Optional budget (৳)")}
                  </span>
                </Label>
                <Input
                  id={`budget-${provider._id}`}
                  type="number"
                  min={0}
                  placeholder={t("e.g. 500")}
                  {...register("budget")}
                />
            </div>

            <div className="space-y-1.5">
                <Label htmlFor={`phone-${provider._id}`}>
                  <span className="inline-flex items-center gap-1">
                    <Phone className="size-3.5" /> {t("Your phone number")}
                  </span>
                </Label>
              <Input
                id={`phone-${provider._id}`}
                type="tel"
                placeholder="01XXXXXXXXX"
                {...register("phone")}
              />
            </div>

            <label className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2.5 text-sm font-medium text-red-800">
              <input
                type="checkbox"
                className="size-4 rounded accent-red-600"
                {...register("emergency")}
              />
              <span className="inline-flex items-center gap-1.5">
                <Siren className="size-4" /> {t("This request is urgent (emergency)")}
              </span>
            </label>

            <Button type="submit" className="w-full" size="lg" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> {t("Sending...")}
                </>
              ) : (
                t("Send Service Request")
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}