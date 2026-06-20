"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { 
  useForgotPassword, 
  useConfirmForgotPasswordOtp, 
  useResetPassword 
} from "@/features/auth/queries/auth.queries";

const emailSchema = z.object({
  email: z.string().min(1, "Vui lòng nhập email").email("Email không hợp lệ"),
});

const resetPasswordSchema = z.object({
  password: z.string().min(8, "Mật khẩu tối thiểu 8 ký tự"),
  confirmPassword: z.string().min(1, "Vui lòng nhập lại mật khẩu"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmPassword"],
});

type EmailFormValues = z.infer<typeof emailSchema>;
type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export function ForgotPasswordClient() {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "otp" | "reset">("email");
  const [resetEmail, setResetEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  // Email form
  const {
    register: registerEmail,
    handleSubmit: handleEmailSubmit,
    formState: { errors: emailErrors },
  } = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
  });

  // Reset password form
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  // OTP state
  const [otpCode, setOtpCode] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(59);
  const [canResend, setCanResend] = useState(false);
  const otpRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  // API mutations
  const { mutate: sendOtp, isPending: isSending } = useForgotPassword();
  const { mutate: confirmOtp, isPending: isConfirming } = useConfirmForgotPasswordOtp();
  const { mutate: resetPassword, isPending: isResetting } = useResetPassword();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === "otp" && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0) {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [step, timeLeft]);

  const onEmailSubmit = (data: EmailFormValues) => {
    sendOtp({ email: data.email }, {
      onSuccess: () => {
        setResetEmail(data.email);
        setStep("otp");
        setTimeLeft(59);
        setCanResend(false);
      }
    });
  };

  const onVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otpCode.join("");
    if (otpString.length !== 6) {
      toast.error("Vui lòng nhập đủ 6 mã OTP");
      return;
    }

    confirmOtp({ email: resetEmail, otpCode: otpString }, {
      onSuccess: (res: any) => {
        // The API should ideally return a token to reset password
        // Since we don't know the exact response structure, we might just proceed
        // If the backend requires a token, we should extract it here
        const token = res?.data?.token || res?.token || otpString; 
        setResetToken(token);
        setStep("reset");
      }
    });
  };

  const onPasswordSubmit = (data: ResetPasswordFormValues) => {
    resetPassword({
      email: resetEmail,
      newPassword: data.password,
      confirmPassword: data.confirmPassword,
      token: resetToken // If API uses token, else pass OTP or email
    }, {
      onSuccess: () => {
        router.push("/auth/login");
      }
    });
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^[0-9]*$/.test(value)) return;
    const newOtp = [...otpCode];
    newOtp[index] = value;
    setOtpCode(newOtp);
    if (value !== "" && index < 5) {
      otpRefs[index + 1].current?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && otpCode[index] === "" && index > 0) {
      otpRefs[index - 1].current?.focus();
    }
  };

  const handleResend = () => {
    if (!canResend) return;
    setOtpCode(["", "", "", "", "", ""]);
    otpRefs[0].current?.focus();
    setCanResend(false);
    setTimeLeft(59);
    sendOtp({ email: resetEmail });
  };

  if (step === "otp") {
    return (
      <div className="w-full px-6 py-10 sm:px-10 flex flex-col items-center animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="text-center w-full mb-10">
          <h1 className="font-playfair text-[32px] md:text-[36px] font-semibold text-ethos-primary mb-2">Nhập mã xác thực</h1>
          <p className="font-inter text-[14px] text-ethos-on-surface-variant max-w-[280px] mx-auto">
            Vui lòng nhập mã OTP đã được gửi đến email <strong>{resetEmail}</strong>
          </p>
        </div>

        <form className="w-full flex flex-col items-center" onSubmit={onVerifyOtp}>
          <div className="flex justify-between items-center w-full max-w-[340px] gap-2 mb-12">
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <input
                key={index}
                ref={otpRefs[index]}
                value={otpCode[index]}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                onFocus={(e) => e.target.select()}
                className="w-12 h-14 md:w-14 md:h-16 text-center font-playfair text-[32px] font-medium bg-transparent border-b border-ethos-outline text-ethos-primary focus:bg-ethos-surface-low focus:border-ethos-primary focus:border-b-2 outline-none transition-all duration-300 rounded-none placeholder:text-ethos-surface-dim"
                inputMode="numeric"
                maxLength={1}
                placeholder="·"
                type="text"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={isConfirming || otpCode.join("").length !== 6}
            className="w-full max-w-[340px] h-12 bg-ethos-primary text-ethos-on-primary font-inter text-[15px] font-medium flex items-center justify-center hover:bg-ethos-primary-container transition-all duration-300 group mb-8 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isConfirming ? "Đang xác thực..." : "Xác Nhận"}
          </button>

          <div className="flex items-center justify-center font-inter text-[14px] text-ethos-on-surface-variant mb-6">
            <span>Chưa nhận được mã?</span>
            <button
              type="button"
              onClick={handleResend}
              disabled={!canResend || isSending}
              className="ml-1 text-ethos-primary font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:underline"
            >
              <span>{canResend ? "Gửi lại ngay" : `Gửi lại (00:${timeLeft < 10 ? `0${timeLeft}` : timeLeft})`}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setStep("email")}
            className="text-ethos-on-surface-variant hover:text-ethos-primary transition-colors flex items-center gap-1 font-inter text-[14px]"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Quay lại
          </button>
        </form>
      </div>
    );
  }

  if (step === "reset") {
    return (
      <div className="w-full px-6 py-8 sm:px-10 sm:py-10 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="mb-10 text-center">
          <h1 className="font-playfair text-[32px] md:text-[36px] font-semibold text-ethos-primary mb-2">Tạo mật khẩu mới</h1>
          <p className="font-inter text-[14px] text-ethos-on-surface-variant">Vui lòng thiết lập mật khẩu mới cho tài khoản của bạn.</p>
        </div>

        <form noValidate className="space-y-6" onSubmit={handlePasswordSubmit(onPasswordSubmit)}>
          <div className="space-y-2 relative group">
            <label className="block font-inter text-[12px] font-bold text-ethos-on-surface-variant uppercase tracking-[0.1em]" htmlFor="password">Mật khẩu mới</label>
            <div className="relative flex items-center">
              <input
                id="password"
                type={passwordVisible ? "text" : "password"}
                placeholder="••••••••"
                {...registerPassword("password")}
                onFocus={() => setFocusedInput('new-password')}
                onBlur={() => setFocusedInput(null)}
                className={`w-full block font-inter text-[16px] text-ethos-primary placeholder:text-ethos-outline-variant py-3 focus:outline-none focus:ring-0 border-0 border-b border-ethos-primary bg-transparent transition-all duration-300 pr-10 ${focusedInput === 'new-password' ? 'bg-ethos-surface-low border-b-2 px-4 rounded-none' : 'px-0'} ${passwordErrors.password ? 'border-red-500' : ''}`}
              />
              <button type="button" onClick={() => setPasswordVisible(!passwordVisible)} className="absolute right-2 flex items-center justify-center p-1 text-ethos-on-surface-variant hover:text-ethos-primary transition-colors focus:outline-none">
                <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {passwordVisible ? (
                    <>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </>
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  )}
                </svg>
              </button>
            </div>
            {passwordErrors.password && <p className="text-red-500 text-xs mt-1">{passwordErrors.password.message}</p>}
          </div>

          <div className="space-y-2 relative group">
            <label className="block font-inter text-[12px] font-bold text-ethos-on-surface-variant uppercase tracking-[0.1em]" htmlFor="confirmPassword">Xác nhận mật khẩu mới</label>
            <div className="relative flex items-center">
              <input
                id="confirmPassword"
                type={confirmPasswordVisible ? "text" : "password"}
                placeholder="••••••••"
                {...registerPassword("confirmPassword")}
                onFocus={() => setFocusedInput('confirm-password')}
                onBlur={() => setFocusedInput(null)}
                className={`w-full block font-inter text-[16px] text-ethos-primary placeholder:text-ethos-outline-variant py-3 focus:outline-none focus:ring-0 border-0 border-b border-ethos-primary bg-transparent transition-all duration-300 pr-10 ${focusedInput === 'confirm-password' ? 'bg-ethos-surface-low border-b-2 px-4 rounded-none' : 'px-0'} ${passwordErrors.confirmPassword ? 'border-red-500' : ''}`}
              />
              <button type="button" onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)} className="absolute right-2 flex items-center justify-center p-1 text-ethos-on-surface-variant hover:text-ethos-primary transition-colors focus:outline-none">
                <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {confirmPasswordVisible ? (
                    <>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </>
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  )}
                </svg>
              </button>
            </div>
            {passwordErrors.confirmPassword && <p className="text-red-500 text-xs mt-1">{passwordErrors.confirmPassword.message}</p>}
          </div>

          <div className="pt-4 pb-4">
            <button
              type="submit"
              disabled={isResetting}
              className="w-full h-12 bg-ethos-primary text-ethos-on-primary font-inter text-[15px] font-medium flex items-center justify-center hover:bg-ethos-primary-container hover:shadow-[0_10px_30px_rgba(45,45,45,0.15)] transition-all duration-300 ease-in-out disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isResetting ? "Đang xử lý..." : "Đặt Lại Mật Khẩu"}
            </button>
          </div>
        </form>
      </div>
    );
  }

  // Email UI
  return (
    <div className="w-full px-6 py-8 sm:px-10 sm:py-10 animate-in fade-in duration-500">
      <div className="mb-10 text-center">
        <h1 className="font-playfair text-[32px] md:text-[36px] font-semibold text-ethos-primary mb-2">Khôi phục mật khẩu</h1>
        <p className="font-inter text-[14px] text-ethos-on-surface-variant">Nhập email đã đăng ký để nhận mã khôi phục.</p>
      </div>

      <form noValidate className="space-y-6" onSubmit={handleEmailSubmit(onEmailSubmit)}>
        <div className="space-y-2">
          <label className="block font-inter text-[12px] font-bold text-ethos-on-surface-variant uppercase tracking-[0.1em]" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="your@email.com"
            {...registerEmail("email")}
            onFocus={() => setFocusedInput('email')}
            onBlur={() => setFocusedInput(null)}
            className={`w-full block font-inter text-[16px] text-ethos-primary placeholder:text-ethos-outline-variant py-3 focus:outline-none focus:ring-0 border-0 border-b border-ethos-primary bg-transparent transition-all duration-300 ${focusedInput === 'email' ? 'bg-ethos-surface-low border-b-2 px-4 rounded-none' : 'px-0'} ${emailErrors.email ? 'border-red-500' : ''}`}
          />
          {emailErrors.email && <p className="text-red-500 text-xs mt-1">{emailErrors.email.message}</p>}
        </div>

        <div className="pt-4 pb-4">
          <button
            type="submit"
            disabled={isSending}
            className="w-full h-12 bg-ethos-primary text-ethos-on-primary font-inter text-[15px] font-medium flex items-center justify-center hover:bg-ethos-primary-container hover:shadow-[0_10px_30px_rgba(45,45,45,0.15)] transition-all duration-300 ease-in-out disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSending ? "Đang gửi..." : "Gửi Mã Xác Nhận"}
          </button>
        </div>
      </form>
      
      <div className="text-center mt-4">
        <Link 
          href="/auth/login"
          className="text-ethos-on-surface-variant hover:text-ethos-primary transition-colors flex items-center justify-center gap-1 font-inter text-[14px]"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Quay lại Đăng nhập
        </Link>
      </div>
    </div>
  );
}
