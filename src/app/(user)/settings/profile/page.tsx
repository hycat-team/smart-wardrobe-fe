"use client";
import { useState, useEffect } from "react";
import { Camera, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";
import { useUpdateProfile, useChangePassword } from "@/features/profile/queries/profile.queries";
import { Gender } from "@/common/enum";

export default function ProfileSettings() {
  const user = useAuthStore((state) => state.user);
  
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    address: "",
    gender: Gender.Unknown,
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
    logoutAllDevices: false,
  });

  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();
  const { mutate: changePassword, isPending: isChangingPassword } = useChangePassword();

  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : "",
        address: user.address || "",
        gender: user.gender ?? Gender.Unknown,
      });
    }
  }, [user]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
    updateProfile(profileData);
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

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16">
      {/* Profile Section */}
      <section className="space-y-8">
        <div>
          <h2 className="text-xl font-heading font-bold text-foreground">Hồ sơ công khai</h2>
          <p className="text-sm text-muted-foreground mt-1">Thông tin này sẽ hiển thị trên trang cá nhân của bạn.</p>
        </div>

        <div className="flex items-center gap-6">
          <div className="relative group cursor-not-allowed">
            <div className="size-24 rounded-full overflow-hidden bg-secondary border-2 border-border relative">
              <img 
                src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"} 
                alt="Avatar" 
                className="w-full h-full object-cover opacity-80"
              />
            </div>
          </div>
          <div className="space-y-1">
            <Button variant="outline" className="h-9" disabled>Đổi ảnh đại diện</Button>
            <p className="text-xs text-muted-foreground">Chức năng đang được phát triển.</p>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-6 max-w-2xl border-t border-border pt-8">
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-foreground">Họ</Label>
              <Input id="firstName" name="firstName" value={profileData.firstName} onChange={handleProfileChange} className="bg-card text-foreground" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-foreground">Tên</Label>
              <Input id="lastName" name="lastName" value={profileData.lastName} onChange={handleProfileChange} className="bg-card text-foreground" />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth" className="text-foreground">Ngày sinh</Label>
              <Input id="dateOfBirth" type="date" name="dateOfBirth" value={profileData.dateOfBirth} onChange={handleProfileChange} className="bg-card text-foreground" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender" className="text-foreground">Giới tính</Label>
              <select 
                id="gender" name="gender" value={profileData.gender} onChange={handleProfileChange}
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <option value={Gender.Unknown}>Không xác định</option>
                <option value={Gender.Male}>Nam</option>
                <option value={Gender.Female}>Nữ</option>
                <option value={Gender.Other}>Khác</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="text-foreground">Địa chỉ</Label>
            <Input id="address" name="address" value={profileData.address} onChange={handleProfileChange} className="bg-card text-foreground" />
          </div>

          <div className="pt-4 flex items-center gap-4">
            <Button type="submit" disabled={isUpdating} className="bg-primary text-primary-foreground hover:bg-primary/90 px-8">
              {isUpdating ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </div>
        </form>
      </section>

      {/* Security Section */}
      <section className="space-y-8 border-t border-border pt-12">
        <div>
          <h2 className="text-xl font-heading font-bold text-foreground">Bảo mật & Mật khẩu</h2>
          <p className="text-sm text-muted-foreground mt-1">Cập nhật mật khẩu để bảo vệ tài khoản của bạn.</p>
        </div>

        <form onSubmit={handleSavePassword} className="space-y-6 max-w-2xl">
          <div className="space-y-2">
            <Label htmlFor="oldPassword" className="text-foreground">Mật khẩu hiện tại</Label>
            <Input id="oldPassword" name="oldPassword" type="password" value={passwordData.oldPassword} onChange={handlePasswordChange} className="bg-card text-foreground" required />
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-foreground">Mật khẩu mới</Label>
              <Input id="newPassword" name="newPassword" type="password" value={passwordData.newPassword} onChange={handlePasswordChange} className="bg-card text-foreground" required minLength={6} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-foreground">Xác nhận mật khẩu mới</Label>
              <Input id="confirmPassword" name="confirmPassword" type="password" value={passwordData.confirmPassword} onChange={handlePasswordChange} className="bg-card text-foreground" required minLength={6} />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input 
              type="checkbox" 
              id="logoutAllDevices" 
              name="logoutAllDevices" 
              checked={passwordData.logoutAllDevices} 
              onChange={handlePasswordChange}
              className="size-4 rounded border-input bg-card text-primary"
            />
            <Label htmlFor="logoutAllDevices" className="text-sm font-medium leading-none">
              Đăng xuất khỏi tất cả thiết bị khác
            </Label>
          </div>

          <div className="pt-4">
            <Button type="submit" disabled={isChangingPassword} className="bg-ink text-cream hover:bg-ink/90 px-8">
              {isChangingPassword ? "Đang cập nhật..." : "Đổi mật khẩu"}
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}
