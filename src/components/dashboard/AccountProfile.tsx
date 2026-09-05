"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { uploadFile } from "@/lib/upload";
import { timeAgo } from "@/lib/utils";

export function AccountProfile() {
  const { user, logout, updateProfile } = useAuth();
  const { t } = useLanguage();
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const currentAvatar = avatarPreview ?? user?.avatar ?? null;

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error(t("Please enter your name."));
      return;
    }
    setSaving(true);
    try {
      let avatar = user?.avatar ?? "";
      if (avatarFile) avatar = await uploadFile(avatarFile);
      const res = await updateProfile({ name: name.trim(), email, avatar, phone });
      if (!res.ok) {
        toast.error(res.error ?? t("Unable to update profile."));
        setSaving(false);
        return;
      }
      toast.success(t("Profile updated"));
      setAvatarFile(null);
      setAvatarPreview(null);
    } catch (e) {
      toast.error((e as Error).message || t("Unable to update profile."));
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("Edit profile")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentAvatar ? (
            <div className="flex items-center gap-3">
              <Avatar className="size-16">
                <AvatarImage src={currentAvatar} alt={user?.name ?? t("User")} />
                <AvatarFallback className="bg-brand-50 text-xl font-bold text-brand-700">
                  {name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <Label
                  htmlFor="profile-avatar-reset"
                  className="cursor-pointer rounded-lg border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:border-primary/50"
                >
                  <input
                    id="profile-avatar-reset"
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
              htmlFor="profile-avatar-upload"
              className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-border px-3 py-5 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
            >
              <input
                id="profile-avatar-upload"
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

          <div className="space-y-1.5">
            <Label htmlFor="profile-name">{t("Name")}</Label>
            <Input
              id="profile-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={80}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="profile-email">{t("Email (optional)")}</Label>
            <Input
              id="profile-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="profile-phone">{t("Phone number")}</Label>
            <Input
              id="profile-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              maxLength={14}
              placeholder="01XXXXXXXXX"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {t("This is your login number and how providers reach you.")}
          </p>

          <Button onClick={handleSave} disabled={saving} className="w-full">
            {saving ? t("Saving...") : t("Save changes")}
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("Account details")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          {[
            ["Role", user?.role],
            ["Joined", user?.createdAt ? timeAgo(user.createdAt) : "—"],
          ].map(([label, value]) => (
            <div
              key={label}
              className="flex items-center justify-between border-b border-border/50 pb-2"
            >
              <span className="text-muted-foreground">{t(label ?? "")}</span>
              <span className="font-medium capitalize">{value}</span>
            </div>
          ))}
          <div className="pt-2">
            <Button
              variant="outline"
              className="w-full text-destructive hover:bg-destructive hover:text-white"
              onClick={handleLogout}
            >
              {t("Log out")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}