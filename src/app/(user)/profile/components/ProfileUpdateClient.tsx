"use client";
import { useState, useEffect } from "react";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";
import { useProfile, useUpdateProfile, useChangePassword } from "@/features/profile/queries/profile.queries";
import { Gender } from "@/common/enum";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { UserRes } from "@/features/profile/types";
import { getUserAvatar } from "@/lib/utils";

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
        dateOfBirth: profile.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().split('T')[0] : "",
        gender: profile.gender as Gender,
      });
    }
  }, [profile]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: name === 'gender' ? Number(value) : value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();

    updateProfile({
      firstName: profileData.firstName,
      lastName: profileData.lastName,
      address: profileData.address,
      gender: profileData.gender,
      dateOfBirth: profileData.dateOfBirth ? profileData.dateOfBirth : undefined,
    });
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp");
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
      }
    });
  };

  const inputClassName = "w-full bg-cream-dark/30 border border-cream-dark/50 focus:border-ink focus:ring-1 focus:ring-ink focus:bg-transparent rounded-xl px-4 py-3 outline-none transition-all font-body-sm text-ink placeholder:text-ink-muted/50";
  const labelClassName = "block text-[11px] font-label-caps text-ink-muted uppercase tracking-wider mb-2 font-bold";

  return (
    <div className="animate-in fade-in duration-700 max-w-2xl mx-auto w-full pb-20">
      {/* Profile Header */}
      <div className="text-center mb-10 space-y-3">
        <h1 className="font-heading text-4xl md:text-5xl text-ink font-bold tracking-tight">Profile Information</h1>
        <p className="font-body-sm text-ink-muted">Update your personal details and preferences.</p>
      </div>

      {/* Avatar Section */}
      <div className="flex justify-center mb-12 relative">
        <div className="size-24 rounded-full overflow-hidden border border-cream-dark/50 bg-cream-dark/30 relative group cursor-not-allowed">
          <img
            src={getUserAvatar(profile)}
            alt="Avatar"
            className="w-full h-full object-cover opacity-90 transition-opacity group-hover:opacity-75"
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10 backdrop-blur-[2px]">
            <span className="text-[10px] font-label-caps uppercase tracking-wider text-ink bg-white/80 px-2 py-1 rounded">Edit</span>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSaveProfile} className="space-y-8">
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className={labelClassName}>First Name</label>
              <input
                name="firstName"
                value={profileData.firstName}
                onChange={handleProfileChange}
                className={inputClassName}
                placeholder="e.g. Alexander"
                required
              />
            </div>
            <div>
              <label className={labelClassName}>Last Name</label>
              <input
                name="lastName"
                value={profileData.lastName}
                onChange={handleProfileChange}
                className={inputClassName}
                placeholder="e.g. Chen"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className={labelClassName}>Date of Birth</label>
              <div className={cn("flex items-center w-full", inputClassName, "p-0 overflow-hidden pr-3 transition-all", !profileData.dateOfBirth && "text-ink-muted/50")}>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={profileData.dateOfBirth}
                  onChange={handleProfileChange}
                  className="w-full h-full bg-transparent border-none outline-none text-ink font-body-sm px-4 py-3 [color-scheme:light] dark:[color-scheme:dark] [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-datetime-edit-fields-wrapper]:p-0"
                />
                  <Popover>
                    <PopoverTrigger className="outline-none opacity-50 hover:opacity-100 transition-opacity shrink-0">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-background border-cream-dark/50 rounded-xl shadow-xl">
                    <Calendar
                      mode="single"
                      captionLayout="dropdown"
                      startMonth={new Date(1900, 0)}
                      endMonth={new Date(new Date().getFullYear() + 10, 11)}
                      selected={profileData.dateOfBirth ? new Date(profileData.dateOfBirth) : undefined}
                      onSelect={(date) => {
                        if (date) {
                          const y = date.getFullYear();
                          const m = String(date.getMonth() + 1).padStart(2, '0');
                          const d = String(date.getDate()).padStart(2, '0');
                          setProfileData(prev => ({ ...prev, dateOfBirth: `${y}-${m}-${d}` }));
                        } else {
                          setProfileData(prev => ({ ...prev, dateOfBirth: "" }));
                        }
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div>
              <label className={labelClassName}>Gender</label>
              <Select
                value={profileData.gender ? profileData.gender.toString() : ""}
                onValueChange={(value) => setProfileData(prev => ({ ...prev, gender: Number(value) }))}
              >
                <SelectTrigger style={{ width: '100%', height: '68%' }} className={cn("w-full flex justify-between items-center", inputClassName)}>
                  <SelectValue placeholder="Chọn giới tính">
                    {profileData.gender === Gender.Male && "Nam"}
                    {profileData.gender === Gender.Female && "Nữ"}
                    {profileData.gender === Gender.Other && "Khác"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent alignItemWithTrigger={false} className="bg-background border-cream-dark/50 shadow-xl rounded-xl z-50">
                  <SelectItem value={Gender.Male.toString()} className="focus:bg-cream-dark/30 cursor-pointer">Nam</SelectItem>
                  <SelectItem value={Gender.Female.toString()} className="focus:bg-cream-dark/30 cursor-pointer">Nữ</SelectItem>
                  <SelectItem value={Gender.Other.toString()} className="focus:bg-cream-dark/30 cursor-pointer">Khác</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className={labelClassName}>Email Address</label>
              <input
                name="email"
                value={profileData.email}
                readOnly
                className={cn(inputClassName, "opacity-70 cursor-not-allowed bg-cream-dark/10")}
              />
            </div>
            <div>
              <label className={labelClassName}>Address</label>
              <input
                name="address"
                value={profileData.address}
                onChange={handleProfileChange}
                className={inputClassName}
                placeholder="e.g. New York, NY"
              />
            </div>
          </div>
        </div>

        {/* Profile Form Actions */}
        <div className="pt-8 border-t border-cream-dark/50 flex items-center justify-end gap-6">
          <button
            type="button"
            className="text-sm font-medium text-ink-muted hover:text-ink transition-colors"
            onClick={() => {
              // Reset
              setProfileData({
                firstName: profile?.firstName || "",
                lastName: profile?.lastName || "",
                address: profile?.address || "",
                dateOfBirth: profile?.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().split('T')[0] : "",
                gender: profile?.gender as Gender ?? (undefined as unknown as Gender),
                email: profile?.email || "",
              });
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isUpdating}
            className="bg-[#1A1A1A] text-[#F9F9F7] px-8 py-3 rounded-xl text-sm font-medium hover:bg-black transition-colors shadow-lg shadow-black/10 disabled:opacity-70 flex items-center gap-2"
          >
            {isUpdating ? <><Loader2 className="size-4 animate-spin" /> Saving...</> : "Save Changes"}
          </button>
        </div>
      </form>

      {/* Password Section */}
      <div className="mt-16 pt-16 border-t border-cream-dark/50 space-y-8">
        <div className="text-center mb-8 space-y-2">
          <h2 className="font-heading text-3xl text-ink font-bold tracking-tight">Security</h2>
          <p className="font-body-sm text-ink-muted">Update your password to keep your account secure.</p>
        </div>

        <form onSubmit={handleSavePassword} className="space-y-6">
          <div>
            <label className={labelClassName}>Current Password</label>
            <div className="relative">
              <input
                name="oldPassword"
                type={showOldPassword ? "text" : "password"}
                value={passwordData.oldPassword}
                onChange={handlePasswordChange}
                className={cn(inputClassName, "pr-10")}
                required
              />
              <button
                type="button"
                onClick={() => setShowOldPassword(!showOldPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink transition-colors focus:outline-none"
              >
                {showOldPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className={labelClassName}>New Password</label>
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
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink transition-colors focus:outline-none"
                >
                  {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <div>
              <label className={labelClassName}>Confirm New Password</label>
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
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink transition-colors focus:outline-none"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3 pt-2">
            <input
              type="checkbox"
              id="logoutAllDevices"
              name="logoutAllDevices"
              checked={passwordData.logoutAllDevices}
              onChange={handlePasswordChange}
              className="size-5 rounded-md border-cream-dark/50 bg-cream-dark/30 text-ink focus:ring-ink"
            />
            <label htmlFor="logoutAllDevices" className="text-[13px] font-medium text-ink-muted select-none cursor-pointer">
              Sign out from all other devices
            </label>
          </div>

          <div className="pt-8 border-t border-cream-dark/50 flex items-center justify-end gap-6">
            <button
              type="button"
              className="text-sm font-medium text-ink-muted hover:text-ink transition-colors"
              onClick={() => setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "", logoutAllDevices: false })}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isChangingPassword}
              className="bg-[#1A1A1A] text-[#F9F9F7] px-8 py-3 rounded-xl text-sm font-medium hover:bg-black transition-colors shadow-lg shadow-black/10 disabled:opacity-70 flex items-center gap-2"
            >
              {isChangingPassword ? <><Loader2 className="size-4 animate-spin" /> Updating...</> : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
