"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLogin } from "@/features/auth/queries/auth.queries";
import { GoogleLoginButton } from "@/features/auth/components/GoogleLoginButton";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const loginSchema = z.object({
  email: z.string().min(1, "Vui lòng nhập email hoặc username"),
  password: z.string().min(1, "Vui lòng nhập mật khẩu"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginClient() {
  const router = useRouter();
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate: login, isPending } = useLogin();

  const onSubmit = (data: LoginFormValues) => {
    login(
      { loginName: data.email, password: data.password },
      {
        onSuccess: (res: any) => {
          if (res?.isAdmin) {
            router.push("/admin/dashboard");
          } else {
            router.push("/brands");
          }
        },
      }
    );
  };

  return (
    <div className="w-full px-6 py-8 sm:px-10 sm:py-10">

      <form noValidate className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <label className="block font-inter text-[12px] font-bold text-muted-foreground uppercase tracking-[0.1em]" htmlFor="email">Email / Tên Đăng Nhập</label>
          <input
            id="email"
            type="text"
            tabIndex={1}
            placeholder="your@email.com or username"
            {...register("email")}
            onFocus={() => setFocusedInput('email')}
            onBlur={() => setFocusedInput(null)}
            className={`w-full block font-inter text-[16px] text-foreground placeholder:text-muted-foreground/60 px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary border bg-muted/50 transition-all duration-300 rounded-2xl ${focusedInput === 'email' ? 'border-primary' : 'border-border'} ${errors.email ? 'border-red-500' : ''}`}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="block font-inter text-[12px] font-bold text-muted-foreground uppercase tracking-[0.1em]" htmlFor="password">Mật khẩu</label>
            <Link href="/auth/forgot-password" tabIndex={3} className="font-inter text-[13px] text-muted-foreground hover:text-primary transition-colors">Quên mật khẩu?</Link>
          </div>
          <div className="relative">
            <input
              id="password"
              type={passwordVisible ? "text" : "password"}
              tabIndex={2}
              placeholder="••••••••"
              {...register("password")}
              onFocus={() => setFocusedInput('password')}
              onBlur={() => setFocusedInput(null)}
              className={`w-full block font-inter text-[16px] text-foreground placeholder:text-muted-foreground/60 px-4 py-3 pr-12 focus:outline-none focus:ring-1 focus:ring-primary border bg-muted/50 transition-all duration-300 rounded-2xl ${focusedInput === 'password' ? 'border-primary' : 'border-border'} ${errors.password ? 'border-red-500' : ''}`}
            />
            <button
              type="button"
              onClick={() => setPasswordVisible(!passwordVisible)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {passwordVisible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isPending}
            tabIndex={4}
            className="w-full h-12 bg-primary text-primary-foreground font-inter text-[15px] font-medium flex items-center justify-center rounded-full hover:bg-primary/90 hover:shadow-lg transition-all duration-300 ease-in-out group disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <span>{isPending ? "Đang đăng nhập..." : "Đăng Nhập"}</span>
            {!isPending && (
              <svg className="ml-2 w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            )}
          </button>
        </div>
      </form>

      <div className="mt-8">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-background text-muted-foreground font-inter text-[11px] font-bold tracking-[0.1em] uppercase">
              Hoặc tiếp tục với
            </span>
          </div>
        </div>
        <div className="mt-6">
          <GoogleLoginButton label="Đăng nhập bằng Google" />
        </div>
      </div>
    </div>
  );
}
