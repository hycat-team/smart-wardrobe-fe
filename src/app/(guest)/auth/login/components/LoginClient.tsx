"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLogin } from "@/features/auth/queries/auth.queries";
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
            router.push("/wardrobe");
          }
        },
      }
    );
  };

  return (
    <div className="w-full px-6 py-8 sm:px-10 sm:py-10">

      <form noValidate className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <label className="block font-inter text-[12px] font-bold text-ethos-on-surface-variant uppercase tracking-[0.1em]" htmlFor="email">Email / Tên Đăng Nhập</label>
          <input
            id="email"
            type="text"
            placeholder="your@email.com or username"
            {...register("email")}
            onFocus={() => setFocusedInput('email')}
            onBlur={() => setFocusedInput(null)}
            className={`w-full block font-inter text-[16px] text-ethos-primary placeholder:text-ethos-outline-variant py-3 focus:outline-none focus:ring-0 border-0 border-b border-ethos-primary bg-transparent transition-all duration-300 ${focusedInput === 'email' ? 'bg-ethos-surface-low border-b-2 px-4 rounded-none' : 'px-0'} ${errors.email ? 'border-red-500' : ''}`}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="block font-inter text-[12px] font-bold text-ethos-on-surface-variant uppercase tracking-[0.1em]" htmlFor="password">Mật khẩu</label>
            <Link href="/auth/forgot-password" className="font-inter text-[13px] text-ethos-on-surface-variant hover:text-ethos-primary transition-colors">Quên mật khẩu?</Link>
          </div>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            {...register("password")}
            onFocus={() => setFocusedInput('password')}
            onBlur={() => setFocusedInput(null)}
            className={`w-full block font-inter text-[16px] text-ethos-primary placeholder:text-ethos-outline-variant py-3 focus:outline-none focus:ring-0 border-0 border-b border-ethos-primary bg-transparent transition-all duration-300 ${focusedInput === 'password' ? 'bg-ethos-surface-low border-b-2 px-4 rounded-none' : 'px-0'} ${errors.password ? 'border-red-500' : ''}`}
          />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isPending}
            className="w-full h-12 bg-ethos-primary text-ethos-on-primary font-inter text-[15px] font-medium flex items-center justify-center hover:bg-ethos-primary-container hover:shadow-[0_10px_30px_rgba(45,45,45,0.15)] transition-all duration-300 ease-in-out group disabled:opacity-70 disabled:cursor-not-allowed"
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
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-ethos-on-surface-variant font-inter text-[11px] font-bold tracking-[0.1em] uppercase">Hoặc tiếp tục với</span>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4">
          <button type="button" className="flex justify-center items-center h-11 border border-gray-200 bg-transparent hover:bg-gray-50 hover:border-gray-300 transition-colors duration-300 rounded-lg">
            <svg aria-hidden="true" className="h-5 w-5 text-ethos-primary" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"></path>
            </svg>
            <span className="sr-only">Sign in with Google</span>
          </button>
          <button type="button" className="flex justify-center items-center h-11 border border-gray-200 bg-transparent hover:bg-gray-50 hover:border-gray-300 transition-colors duration-300 rounded-lg">
            <svg aria-hidden="true" className="h-5 w-5 text-ethos-primary" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12c0-5.523-4.477-10-10-10z"></path>
            </svg>
            <span className="sr-only">Sign in with Apple</span>
          </button>
        </div>
      </div>
    </div>
  );
}
