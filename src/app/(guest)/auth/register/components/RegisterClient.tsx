"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRegister, useConfirmRegisterOtp, useResendRegisterOtp } from "@/features/auth/queries/auth.queries";
import { toast } from "sonner";
import { Gender } from "@/common/enum";
import Image from "next/image";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const registerSchema = z.object({
  firstName: z.string().min(1, "Vui lòng nhập họ"),
  lastName: z.string().min(1, "Vui lòng nhập tên"),
  username: z.string().min(3, "Tên đăng nhập từ 3 ký tự").max(50, "Tối đa 50 ký tự"),
  email: z.string().min(1, "Vui lòng nhập email").email("Email không hợp lệ"),
  dateOfBirth: z.string().min(1, "Vui lòng chọn ngày sinh"),
  gender: z.number({ message: "Vui lòng chọn giới tính" }),
  address: z.string().min(1, "Vui lòng nhập địa chỉ"),
  password: z.string().min(8, "Mật khẩu tối thiểu 8 ký tự"),
  confirmPassword: z.string().min(1, "Vui lòng nhập lại mật khẩu"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterClient() {
  const router = useRouter();
  const [step, setStep] = useState<"register" | "otp">("register");
  const [registeredEmail, setRegisteredEmail] = useState("");

  const {
    register: registerField,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      dateOfBirth: "",
      address: "",
      password: "",
      confirmPassword: "",
    },
  });

  const [otpCode, setOtpCode] = useState(["", "", "", "", "", ""]);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [isGenderOpen, setIsGenderOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(59);
  const [canResend, setCanResend] = useState(false);

  const otpRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  const { mutate: register, isPending: isRegistering } = useRegister();
  const { mutate: confirmOtp, isPending: isConfirming } = useConfirmRegisterOtp();
  const { mutate: resendOtp, isPending: isResending } = useResendRegisterOtp();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === "otp" && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0) {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [step, timeLeft]);

  const onRegisterSubmit = (data: RegisterFormValues) => {
    register(data, {
      onSuccess: () => {
        setRegisteredEmail(data.email);
        setStep("otp");
        setTimeLeft(59);
        setCanResend(false);
      }
    });
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otpCode.join("");
    if (otpString.length !== 6) {
      toast.error("Vui lòng nhập đủ 6 mã OTP");
      return;
    }

    confirmOtp({ email: registeredEmail, otpCode: otpString }, {
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

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").trim().slice(0, 6);
    if (!/^[0-9]+$/.test(pastedData)) return;

    const newOtp = [...otpCode];
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtpCode(newOtp);

    const nextFocusIndex = pastedData.length < 6 ? pastedData.length : 5;
    otpRefs[nextFocusIndex].current?.focus();
  };

  const handleResend = () => {
    if (!canResend || isResending) return;

    resendOtp({ email: registeredEmail }, {
      onSuccess: () => {
        setOtpCode(["", "", "", "", "", ""]);
        otpRefs[0].current?.focus();
        setCanResend(false);
        setTimeLeft(59);
      }
    });
  };

  if (step === "otp") {
    return (
      <div className="w-full px-6 py-10 sm:px-10 flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">

        <div className="text-center w-full mb-14">
          <h1 className="font-playfair text-[36px] md:text-[48px] font-semibold text-primary mb-4">
            Xác Thực Tài Khoản
          </h1>
          <p className="font-inter text-[16px] text-muted-foreground max-w-[280px] mx-auto">
            Vui lòng nhập mã OTP đã được gửi đến {registeredEmail || 'email của bạn'}
          </p>
        </div>

        <form className="w-full flex flex-col items-center" onSubmit={handleVerifyOtp}>
          <div className="flex justify-center items-center w-full gap-2 sm:gap-4 mb-12">
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <input
                key={index}
                ref={otpRefs[index]}
                value={otpCode[index]}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                onPaste={handleOtpPaste}
                onFocus={(e) => e.target.select()}
                aria-label={`Digit ${index + 1}`}
                className="w-12 h-14 sm:w-14 sm:h-16 text-center font-playfair text-[28px] sm:text-[32px] font-medium bg-muted/50 border border-border text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all duration-300 rounded-2xl placeholder:text-muted-foreground/30 shadow-sm"
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
            className="w-full max-w-[340px] h-12 bg-primary text-primary-foreground font-inter text-[16px] font-medium flex items-center justify-center rounded-full hover:bg-primary/90 hover:shadow-lg transition-all duration-300 group mb-12 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isConfirming ? "Đang xác thực..." : "Xác Nhận"}
            {!isConfirming && (
              <svg className="ml-2 w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            )}
          </button>

          <div className="flex items-center justify-center font-inter text-[14px] text-muted-foreground">
            <span>Chưa nhận được mã?</span>
            <button
              type="button"
              onClick={handleResend}
              disabled={!canResend || isResending}
              className="ml-1 text-primary font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:underline"
            >
              <span>{isResending ? "Đang gửi..." : canResend ? "Gửi lại ngay" : `Gửi lại (00:${timeLeft < 10 ? `0${timeLeft}` : timeLeft})`}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setStep("register")}
            className="mt-8 text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 font-inter text-[14px]"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Trở lại đăng ký
          </button>
        </form>
      </div>
    );
  }

  // Registration UI
  return (
    <div className="w-full px-6 py-8 sm:px-10 sm:py-10 max-h-[85vh] overflow-y-auto no-scrollbar">
      <div className="w-full flex flex-col gap-8">


        <form noValidate className="flex flex-col gap-6" onSubmit={handleSubmit(onRegisterSubmit)}>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2 relative group">
              <label className="font-inter text-[12px] font-bold text-muted-foreground uppercase tracking-[0.1em] group-focus-within:text-primary transition-colors duration-300 ml-1" htmlFor="firstName">Họ</label>
              <input
                id="firstName" placeholder="Nguyễn"
                {...registerField("firstName")}
                onFocus={() => setFocusedInput('firstName')} onBlur={() => setFocusedInput(null)}
                className={`w-full block font-inter text-[16px] text-foreground placeholder:text-muted-foreground/60 px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary border bg-muted/50 transition-all duration-300 rounded-2xl ${focusedInput === 'firstName' ? 'border-primary' : 'border-border'} ${errors.firstName ? 'border-red-500' : ''}`}
              />
              {errors.firstName && <p className="text-red-500 text-xs ml-1">{errors.firstName.message}</p>}
            </div>
            <div className="flex flex-col gap-2 relative group">
              <label className="font-inter text-[12px] font-bold text-muted-foreground uppercase tracking-[0.1em] group-focus-within:text-primary transition-colors duration-300 ml-1" htmlFor="lastName">Tên</label>
              <input
                id="lastName" placeholder="Văn A"
                {...registerField("lastName")}
                onFocus={() => setFocusedInput('lastName')} onBlur={() => setFocusedInput(null)}
                className={`w-full block font-inter text-[16px] text-foreground placeholder:text-muted-foreground/60 px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary border bg-muted/50 transition-all duration-300 rounded-2xl ${focusedInput === 'lastName' ? 'border-primary' : 'border-border'} ${errors.lastName ? 'border-red-500' : ''}`}
              />
              {errors.lastName && <p className="text-red-500 text-xs ml-1">{errors.lastName.message}</p>}
            </div>
          </div>

          <div className="flex flex-col gap-2 relative group">
            <label className="font-inter text-[12px] font-bold text-muted-foreground uppercase tracking-[0.1em] group-focus-within:text-primary transition-colors duration-300 ml-1" htmlFor="username">Tên đăng nhập</label>
            <input
              id="username" placeholder="nguyenvana"
              {...registerField("username")}
              onFocus={() => setFocusedInput('username')} onBlur={() => setFocusedInput(null)}
              className={`w-full block font-inter text-[16px] text-foreground placeholder:text-muted-foreground/60 px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary border bg-muted/50 transition-all duration-300 rounded-2xl ${focusedInput === 'username' ? 'border-primary' : 'border-border'} ${errors.username ? 'border-red-500' : ''}`}
            />
            {errors.username && <p className="text-red-500 text-xs ml-1">{errors.username.message}</p>}
          </div>

          <div className="flex flex-col gap-2 relative group">
            <label className="font-inter text-[12px] font-bold text-muted-foreground uppercase tracking-[0.1em] group-focus-within:text-primary transition-colors duration-300 ml-1" htmlFor="email">Email</label>
            <input
              id="email" type="email" placeholder="jane@example.com"
              {...registerField("email")}
              onFocus={() => setFocusedInput('email')} onBlur={() => setFocusedInput(null)}
              className={`w-full block font-inter text-[16px] text-foreground placeholder:text-muted-foreground/60 px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary border bg-muted/50 transition-all duration-300 rounded-2xl ${focusedInput === 'email' ? 'border-primary' : 'border-border'} ${errors.email ? 'border-red-500' : ''}`}
            />
            {errors.email && <p className="text-red-500 text-xs ml-1">{errors.email.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2 relative group">
              <label className="font-inter text-[12px] font-bold text-muted-foreground uppercase tracking-[0.1em] group-focus-within:text-primary transition-colors duration-300 ml-1" htmlFor="dateOfBirth">Ngày sinh</label>
              <div className={`w-full h-[48px] bg-muted/50 border flex items-center transition-all duration-300 rounded-2xl focus-within:border-primary focus-within:ring-1 focus-within:ring-primary px-4 group ${errors.dateOfBirth ? 'border-red-500' : 'border-border'}`}>
                <Controller
                  control={control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <Popover>
                      <PopoverTrigger
                        type="button"
                        className={`w-full flex items-center justify-between text-left font-inter text-[16px] bg-transparent border-none outline-none ${!field.value ? 'text-muted-foreground/60' : 'text-foreground'}`}
                        onFocus={() => setFocusedInput('dateOfBirth')}
                        onBlur={() => setFocusedInput(null)}
                      >
                        {field.value ? (
                          new Date(field.value).toLocaleDateString('vi-VN')
                        ) : (
                          <span>dd/mm/yyyy</span>
                        )}
                        <svg className="w-5 h-5 ml-4 text-muted-foreground group-focus-within:text-primary transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-background border-border shadow-xl shadow-black/10" align="start">
                        <Calendar
                          mode="single"
                          captionLayout="dropdown"
                          startMonth={new Date(1900, 0)}
                          endMonth={new Date(new Date().getFullYear() + 10, 11)}
                          selected={field.value ? new Date(field.value) : undefined}
                          onSelect={(date) => {
                            if (date) {
                              const y = date.getFullYear();
                              const m = String(date.getMonth() + 1).padStart(2, '0');
                              const d = String(date.getDate()).padStart(2, '0');
                              field.onChange(`${y}-${m}-${d}`);
                            } else {
                              field.onChange("");
                            }
                          }}
                          className="bg-background text-foreground"
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                />
              </div>
              {errors.dateOfBirth && <p className="text-red-500 text-xs ml-1">{errors.dateOfBirth.message}</p>}
            </div>
            <div className="flex flex-col gap-2 relative group">
              <label className="font-inter text-[12px] font-bold text-muted-foreground uppercase tracking-[0.1em] group-focus-within:text-primary transition-colors duration-300 ml-1" htmlFor="gender">Giới tính</label>
              <Controller
                control={control}
                name="gender"
                render={({ field }) => (
                  <Select
                    value={field.value !== undefined ? field.value.toString() : ""}
                    onValueChange={(value) => field.onChange(Number(value))}
                    onOpenChange={setIsGenderOpen}
                  >
                    <SelectTrigger
                      onFocus={() => setFocusedInput('gender')}
                      onBlur={() => setFocusedInput(null)}
                      className={`w-full h-[48px] data-[size=default]:h-[48px] bg-muted/50 border text-foreground font-inter text-[16px] transition-all duration-300 focus:ring-1 focus:ring-primary focus:outline-none rounded-2xl shadow-none [&>span]:line-clamp-1 data-placeholder:text-muted-foreground/60 px-4 ${focusedInput === 'gender' || isGenderOpen ? 'border-primary' : 'border-border'} ${errors.gender ? 'border-red-500' : ''}`}
                    >
                      <SelectValue placeholder="Chọn giới tính">
                        {field.value === Gender.Male && "Nam"}
                        {field.value === Gender.Female && "Nữ"}
                        {field.value === Gender.Other && "Khác"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent alignItemWithTrigger={false} className="bg-background border-border rounded-2xl text-foreground shadow-xl z-50">
                      <SelectItem value={Gender.Male.toString()} className="focus:bg-muted cursor-pointer py-3 rounded-xl mx-1 my-0.5">Nam</SelectItem>
                      <SelectItem value={Gender.Female.toString()} className="focus:bg-muted cursor-pointer py-3 rounded-xl mx-1 my-0.5">Nữ</SelectItem>
                      <SelectItem value={Gender.Other.toString()} className="focus:bg-muted cursor-pointer py-3 rounded-xl mx-1 my-0.5">Khác</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.gender && <p className="text-red-500 text-xs ml-1">{errors.gender.message}</p>}
            </div>
          </div>

          <div className="flex flex-col gap-2 relative group">
            <label className="font-inter text-[12px] font-bold text-muted-foreground uppercase tracking-[0.1em] group-focus-within:text-primary transition-colors duration-300 ml-1" htmlFor="address">Địa chỉ</label>
            <input
              id="address" placeholder="123 Đường ABC, Quận 1, TP.HCM"
              {...registerField("address")}
              onFocus={() => setFocusedInput('address')} onBlur={() => setFocusedInput(null)}
              className={`w-full block font-inter text-[16px] text-foreground placeholder:text-muted-foreground/60 px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary border bg-muted/50 transition-all duration-300 rounded-2xl ${focusedInput === 'address' ? 'border-primary' : 'border-border'} ${errors.address ? 'border-red-500' : ''}`}
            />
            {errors.address && <p className="text-red-500 text-xs ml-1">{errors.address.message}</p>}
          </div>

          <div className="flex flex-col gap-2 relative group">
            <label className="font-inter text-[12px] font-bold text-muted-foreground uppercase tracking-[0.1em] group-focus-within:text-primary transition-colors duration-300 ml-1" htmlFor="password">Mật khẩu</label>
            <div className="relative flex items-center">
              <input
                id="password" type={passwordVisible ? "text" : "password"} placeholder="••••••••"
                {...registerField("password")}
                onFocus={() => setFocusedInput('password')} onBlur={() => setFocusedInput(null)}
                className={`w-full block font-inter text-[16px] text-foreground placeholder:text-muted-foreground/60 px-4 py-3 pr-10 focus:outline-none focus:ring-1 focus:ring-primary border bg-muted/50 transition-all duration-300 rounded-2xl ${focusedInput === 'password' ? 'border-primary' : 'border-border'} ${errors.password ? 'border-red-500' : ''}`}
              />
              <button type="button" onClick={() => setPasswordVisible(!passwordVisible)} className="absolute right-2 flex items-center justify-center p-1 shrink-0 text-muted-foreground hover:text-primary transition-colors focus:outline-none">
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
            {errors.password && <p className="text-red-500 text-xs ml-1">{errors.password.message}</p>}
          </div>

          <div className="flex flex-col gap-2 relative group">
            <label className="font-inter text-[12px] font-bold text-muted-foreground uppercase tracking-[0.1em] group-focus-within:text-primary transition-colors duration-300 ml-1" htmlFor="confirmPassword">Xác nhận mật khẩu</label>
            <div className="relative flex items-center">
              <input
                id="confirmPassword" type={confirmPasswordVisible ? "text" : "password"} placeholder="••••••••"
                {...registerField("confirmPassword")}
                onFocus={() => setFocusedInput('confirmPassword')} onBlur={() => setFocusedInput(null)}
                className={`w-full block font-inter text-[16px] text-foreground placeholder:text-muted-foreground/60 px-4 py-3 pr-10 focus:outline-none focus:ring-1 focus:ring-primary border bg-muted/50 transition-all duration-300 rounded-2xl ${focusedInput === 'confirmPassword' ? 'border-primary' : 'border-border'} ${errors.confirmPassword ? 'border-red-500' : ''}`}
              />
              <button type="button" onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)} className="absolute right-2 flex items-center justify-center p-1 shrink-0 text-muted-foreground hover:text-primary transition-colors focus:outline-none">
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
            {errors.confirmPassword && <p className="text-red-500 text-xs ml-1">{errors.confirmPassword.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isRegistering}
            className="w-full h-12 mt-4 bg-primary text-primary-foreground font-inter text-[15px] font-medium flex items-center justify-center rounded-full hover:bg-primary/90 hover:shadow-lg transition-all duration-300 ease-in-out gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isRegistering ? "Đang xử lý..." : "Tạo Tài Khoản"}
            {!isRegistering && (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            )}
          </button>
        </form>

        {/* <div className="flex items-center gap-4">
            <div className="flex-1 h-[1px] bg-background-variant"></div>
            <span className="font-inter text-[12px] font-bold tracking-[0.1em] text-muted-foreground uppercase">Hoặc đăng ký với</span>
            <div className="flex-1 h-[1px] bg-background-variant"></div>
          </div>

          <div className="flex flex-col gap-4">
            <button type="button" className="group relative w-full h-12 flex items-center justify-center gap-3 border border-border rounded-full bg-transparent text-foreground font-inter text-[16px] transition-all duration-300 hover:border-primary hover:bg-muted/50 hover:shadow-sm overflow-hidden">
              <span className="relative z-10 font-medium">Google</span>
            </button>
          </div> */}

        <p className="text-center font-inter text-[14px] text-muted-foreground mt-2">
          Đã có tài khoản?{' '}
          <Link href="/auth/login" className="text-primary font-medium hover:text-primary/80 transition-colors underline-offset-4 hover:underline ml-1">
            Đăng Nhập
          </Link>
        </p>
      </div>
    </div>
  );
}
