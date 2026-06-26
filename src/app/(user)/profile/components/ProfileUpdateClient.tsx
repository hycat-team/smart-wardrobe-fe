"use client";

import { useState, useEffect } from "react";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useProfile, useUpdateProfile, useChangePassword } from "@/features/profile/queries/profile.queries";
import { Gender } from "@/common/enum";
import { cn, getUserAvatar } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { UserRes } from "@/features/profile/types";
import Image from "next/image";

export function ProfileUpdateClient({ initialProfile }: { initialProfile: UserRes }) {
  const { data: profile } = useProfile(initialProfile);

  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    dateOfBirth: "",
    gender: undefined as unknown as Gender,
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
    logoutAllDevices: true,
  });

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();
  const { mutate: changePassword, isPending: isChangingPassword } = useChangePassword();

  useEffect(() => {
    if (profile) {
      setProfileData({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        email: profile.email || "",
        address: profile.address || "",
        dateOfBirth: profile.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().split("T")[0] : "",
        gender: profile.gender as Gender,
      });
    }
  }, [profile]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: name === "gender" ? Number(value) : value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();

    updateProfile({
      firstName: profileData.firstName,
      lastName: profileData.lastName,
      address: profileData.address,
      gender: profileData.gender,
      dateOfBirth: profileData.dateOfBirth || undefined,
    });
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("M?t kh?u xác nh?n không kh?p");
      return;
    }

    changePassword(passwordData, {
      onSuccess: () => {
        setPasswordData({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
          logoutAllDevices: false,
        });
      },
    });
  };

  const inputClassName = "w-full rounded-xl border border-cream-dark/50 bg-cream-dark/30 px-4 py-3 font-body-sm text-ink outline-none transition-all placeholder:text-ink-muted/50 focus:border-ink focus:bg-transparent focus:ring-1 focus:ring-ink";
  const labelClassName = "mb-2 block text-sm font-semibold text-ink-muted";

  return (
    <div className="mx-auto w-full max-w-2xl animate-in fade-in pb-20 pt-10 duration-700">
      <div className="mb-10 space-y-3 text-center">
        <h1 className="font-sans text-4xl font-bold tracking-tight text-ink md:text-5xl">Thông tin cá nhân</h1>
        <p className="font-body-sm text-ink-muted">C?p nh?t h? so và nh?ng tùy ch?n phù h?p v?i b?n.</p>
      </div>

      <div className="relative mb-12 flex justify-center">
        <div className="group relative size-24 cursor-not-allowed overflow-hidden rounded-full border border-cream-dark/50 bg-cream-dark/30">
          <Image
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            src={getUserAvatar(profile)}
            alt="?nh d?i di?n"
            className="h-full w-full object-cover opacity-90 transition-opacity group-hover:opacity-75"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/10 opacity-0 transition-opacity group-hover:opacity-100">
            <span className="rounded bg-white/80 px-2 py-1 text-xs font-medium text-ink">Ch?nh s?a</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-8">
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className={labelClassName}>Tên</label>
              <input
                name="firstName"
                value={profileData.firstName}
                onChange={handleProfileChange}
                className={inputClassName}
                placeholder="Ví d?: An"
                required
              />
            </div>
            <div>
              <label className={labelClassName}>H?</label>
              <input
                name="lastName"
                value={profileData.lastName}
                onChange={handleProfileChange}
                className={inputClassName}
                placeholder="Ví d?: Nguy?n"
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className={labelClassName}>Ngày sinh</label>
              <div className={cn("flex w-full items-center overflow-hidden p-0 pr-3 transition-all", inputClassName, !profileData.dateOfBirth && "text-ink-muted/50")}>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={profileData.dateOfBirth}
                  onChange={handleProfileChange}
                  className="h-full w-full border-none bg-transparent px-4 py-3 font-body-sm text-ink outline-none [color-scheme:light] [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-datetime-edit-fields-wrapper]:p-0 dark:[color-scheme:dark]"
                />
                <Popover>
                  <PopoverTrigger className="shrink-0 opacity-50 outline-none transition-opacity hover:opacity-100">
                    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto rounded-xl border-cream-dark/50 bg-background p-0 shadow-xl">
                    <Calendar
                      mode="single"
                      captionLayout="dropdown"
                      startMonth={new Date(1900, 0)}
                      endMonth={new Date(new Date().getFullYear() + 10, 11)}
                      selected={profileData.dateOfBirth ? new Date(profileData.dateOfBirth) : undefined}
                      onSelect={(date) => {
                        if (date) {
                          const y = date.getFullYear();
                          const m = String(date.getMonth() + 1).padStart(2, "0");
                          const d = String(date.getDate()).padStart(2, "0");
                          setProfileData((prev) => ({ ...prev, dateOfBirth: `${y}-${m}-${d}` }));
                        } else {
                          setProfileData((prev) => ({ ...prev, dateOfBirth: "" }));
                        }
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div>
              <label className={labelClassName}>Gi?i tính</label>
              <Select value={profileData.gender ? profileData.gender.toString() : ""} onValueChange={(value) => setProfileData((prev) => ({ ...prev, gender: Number(value) }))}>
                <SelectTrigger style={{ width: "100%", height: "68%" }} className={cn("w-full items-center justify-between", inputClassName)}>
                  <SelectValue placeholder="Ch?n gi?i tính">
                    {profileData.gender === Gender.Male && "Nam"}
                    {profileData.gender === Gender.Female && "N?"}
                    {profileData.gender === Gender.Other && "Khác"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent alignItemWithTrigger={false} className="z-50 rounded-xl border-cream-dark/50 bg-background shadow-xl">
                  <SelectItem value={Gender.Male.toString()} className="cursor-pointer focus:bg-cream-dark/30">Nam</SelectItem>
                  <SelectItem value={Gender.Female.toString()} className="cursor-pointer focus:bg-cream-dark/30">N?</SelectItem>
                  <SelectItem value={Gender.Other.toString()} className="cursor-pointer focus:bg-cream-dark/30">Khác</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className={labelClassName}>Ð?a ch? email</label>
              <input name="email" value={profileData.email} readOnly className={cn(inputClassName, "cursor-not-allowed bg-cream-dark/10 opacity-70")} />
            </div>
            <div>
              <label className={labelClassName}>Ð?a ch?</label>
              <input
                name="address"
                value={profileData.address}
                onChange={handleProfileChange}
                className={inputClassName}
                placeholder="Ví d?: Qu?n 3, TP. H? Chí Minh"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-6 border-t border-cream-dark/50 pt-8">
          <button
            type="button"
            className="text-sm font-medium text-ink-muted transition-colors hover:text-ink"
            onClick={() => {
              setProfileData({
                firstName: profile?.firstName || "",
                lastName: profile?.lastName || "",
                address: profile?.address || "",
                dateOfBirth: profile?.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().split("T")[0] : "",
                gender: (profile?.gender as Gender) ?? (undefined as unknown as Gender),
                email: profile?.email || "",
              });
            }}
          >
            H?y
          </button>
          <button type="submit" disabled={isUpdating} className="flex items-center gap-2 rounded-xl bg-[#1A1A1A] px-8 py-3 text-sm font-medium text-[#F9F9F7] shadow-lg shadow-black/10 transition-colors hover:bg-black disabled:opacity-70">
            {isUpdating ? <><Loader2 className="size-4 animate-spin" /> Ðang luu...</> : "Luu thay d?i"}
          </button>
        </div>
      </form>

      <div className="mt-16 space-y-8 border-t border-cream-dark/50 pt-16">
        <div className="mb-8 space-y-2 text-center">
          <h2 className="font-sans text-3xl font-bold tracking-tight text-ink">B?o m?t</h2>
          <p className="font-body-sm text-ink-muted">C?p nh?t m?t kh?u d? tài kho?n c?a b?n luôn an toàn.</p>
        </div>

        <form onSubmit={handleSavePassword} className="space-y-6">
          <div>
            <label className={labelClassName}>M?t kh?u hi?n t?i</label>
            <div className="relative">
              <input
                name="oldPassword"
                type={showOldPassword ? "text" : "password"}
                value={passwordData.oldPassword}
                onChange={handlePasswordChange}
                className={cn(inputClassName, "pr-10")}
                required
              />
              <button type="button" onClick={() => setShowOldPassword(!showOldPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted transition-colors hover:text-ink focus:outline-none" aria-label={showOldPassword ? "?n m?t kh?u hi?n t?i" : "Hi?n m?t kh?u hi?n t?i"}>
                {showOldPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
              </button>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className={labelClassName}>M?t kh?u m?i</label>
              <div className="relative">
                <input
                  name="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className={cn(inputClassName, "pr-10")}
                  required
                  minLength={6}
                />
                <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted transition-colors hover:text-ink focus:outline-none" aria-label={showNewPassword ? "?n m?t kh?u m?i" : "Hi?n m?t kh?u m?i"}>
                  {showNewPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                </button>
              </div>
            </div>
            <div>
              <label className={labelClassName}>Xác nh?n m?t kh?u m?i</label>
              <div className="relative">
                <input
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className={cn(inputClassName, "pr-10")}
                  required
                  minLength={6}
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted transition-colors hover:text-ink focus:outline-none" aria-label={showConfirmPassword ? "?n xác nh?n m?t kh?u" : "Hi?n xác nh?n m?t kh?u"}>
                  {showConfirmPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3 pt-2">
            <input type="checkbox" id="logoutAllDevices" name="logoutAllDevices" checked={passwordData.logoutAllDevices} onChange={handlePasswordChange} className="size-5 rounded-md border-cream-dark/50 bg-cream-dark/30 text-ink focus:ring-ink" />
            <label htmlFor="logoutAllDevices" className="cursor-pointer select-none text-[13px] font-medium text-ink-muted">
              Ðang xu?t kh?i các thi?t b? khác
            </label>
          </div>

          <div className="flex items-center justify-end gap-6 border-t border-cream-dark/50 pt-8">
            <button type="button" className="text-sm font-medium text-ink-muted transition-colors hover:text-ink" onClick={() => setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "", logoutAllDevices: false })}>
              H?y
            </button>
            <button type="submit" disabled={isChangingPassword} className="flex items-center gap-2 rounded-xl bg-[#1A1A1A] px-8 py-3 text-sm font-medium text-[#F9F9F7] shadow-lg shadow-black/10 transition-colors hover:bg-black disabled:opacity-70">
              {isChangingPassword ? <><Loader2 className="size-4 animate-spin" /> Ðang c?p nh?t...</> : "C?p nh?t m?t kh?u"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
