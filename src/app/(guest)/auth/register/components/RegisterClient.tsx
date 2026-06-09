"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRegister, useConfirmRegisterOtp } from "@/features/auth/queries/auth.queries";
import { toast } from "sonner";
import { Gender } from "@/common/enum";
import Image from "next/image";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

export function RegisterClient() {
  const router = useRouter();
  const [step, setStep] = useState<"register" | "otp">("register");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
    address: "",
    gender: undefined as unknown as Gender,
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

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === "otp" && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0) {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [step, timeLeft]);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp");
      return;
    }
    
    register(formData, {
      onSuccess: () => {
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

    confirmOtp({ email: formData.email, otpCode: otpString }, {
      onSuccess: () => {
        router.push("/auth/login");
      }
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'gender' ? Number(value) : value }));
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
    // In a real app, you would also trigger the resend API here
    toast.success("Mã OTP đã được gửi lại");
  };

  if (step === "otp") {
    return (
      <div className="bg-ethos-surface text-ethos-on-surface min-h-screen flex items-center justify-center selection:bg-ethos-primary-container selection:text-ethos-on-primary-container flex-col antialiased">
        <main className="w-full max-w-md px-[20px] md:px-0 py-[80px] flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="mb-16">
            <span className="font-playfair text-[32px] font-medium text-ethos-primary tracking-tight">Closy</span>
          </div>

          <div className="text-center w-full mb-14">
            <h1 className="font-playfair text-[36px] md:text-[48px] font-semibold text-ethos-primary mb-4">
              Xác Thực Tài Khoản
            </h1>
            <p className="font-inter text-[16px] text-ethos-on-surface-variant max-w-[280px] mx-auto">
              Vui lòng nhập mã OTP đã được gửi đến {formData.email || 'email của bạn'}
            </p>
          </div>

          <form className="w-full flex flex-col items-center" onSubmit={handleVerifyOtp}>
            <div className="flex justify-between items-center w-full max-w-[340px] gap-2 mb-16">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <input
                  key={index}
                  ref={otpRefs[index]}
                  value={otpCode[index]}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  onFocus={(e) => e.target.select()}
                  aria-label={`Digit ${index + 1}`}
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
              className="w-full max-w-[340px] h-[48px] bg-ethos-primary text-ethos-on-primary font-inter text-[16px] font-medium flex items-center justify-center hover:bg-ethos-surface-tint hover:shadow-[0px_10px_30px_rgba(45,45,45,0.1)] transition-all duration-300 rounded group mb-12 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isConfirming ? "Đang xác thực..." : "Verify"}
              {!isConfirming && (
                <svg className="ml-2 w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              )}
            </button>

            <div className="flex items-center justify-center font-inter text-[14px] text-ethos-on-surface-variant">
              <span>Chưa nhận được mã?</span>
              <button 
                type="button" 
                onClick={handleResend}
                disabled={!canResend}
                className="ml-1 text-ethos-primary font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:underline"
              >
                <span>{canResend ? "Gửi lại ngay" : `Gửi lại (00:${timeLeft < 10 ? `0${timeLeft}` : timeLeft})`}</span>
              </button>
            </div>

            <button 
              type="button"
              onClick={() => setStep("register")}
              className="mt-8 text-ethos-on-surface-variant hover:text-ethos-primary transition-colors flex items-center gap-1 font-inter text-[14px]"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Trở lại đăng ký
            </button>
          </form>
        </main>
      </div>
    );
  }

  // Registration UI
  return (
    <div className="bg-ethos-surface text-ethos-on-surface min-h-screen flex w-full relative overflow-hidden antialiased">
      {/* Left Side: Editorial Image */}
      <section className="hidden lg:block lg:w-[55%] relative bg-ethos-surface-variant">
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/20 to-transparent pointer-events-none mix-blend-overlay"></div>
        <Image 
          alt="High-end editorial fashion photography" 
          className="absolute inset-0 w-full h-full object-cover object-center" 
          src="https://lh3.googleusercontent.com/aida/AP1WRLtaCdgB7jZ1fDTLXuC0CIEx_vyosxOTPqoHCZTPCYKJCVSSKIRzNGCGljBg5xl9HH8F_0TvA3-F1hVLKJEuj6VdVLMQtwSZRFmyePdeoGXjTJ4FnYwbaLz1dqoj0J_cMMzy7azwPQ1_VznHKIqeW8iTJl_LLhHpnfjTS0a_eqkATMMkGNG5bu1z2swXkFPXReTJPGkht5Tq1HBp08l3kq-AtYvgCVXJQyEOw5GVykd4QAkvLO8UqDDGPLc"
          fill
        />
        <div className="absolute bottom-[64px] left-[64px] z-20">
          <span className="font-playfair text-[48px] font-semibold text-ethos-surface-lowest drop-shadow-md tracking-tight">Closy.</span>
        </div>
      </section>

      {/* Right Side: Registration Form */}
      <section className="w-full lg:w-[45%] flex flex-col justify-center px-[20px] md:px-[64px] py-[80px] bg-ethos-surface z-20 relative overflow-y-auto">
        <div className="w-full max-w-[420px] mx-auto flex flex-col gap-10">
          
          {/* Mobile Brand Header */}
          <div className="lg:hidden text-center mb-4">
            <span className="font-playfair text-[36px] font-semibold text-ethos-primary tracking-tight">Closy.</span>
          </div>

          <header className="flex flex-col gap-2">
            <h1 className="font-playfair text-[24px] md:text-[32px] font-medium text-ethos-primary">Create an Account</h1>
            <p className="font-inter text-[16px] text-ethos-on-surface-variant">Begin your journey towards a more conscious, curated wardrobe.</p>
          </header>

          <form className="flex flex-col gap-6" onSubmit={handleRegister}>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2 relative group">
                <label className="font-inter text-[12px] font-bold text-ethos-on-surface-variant uppercase tracking-[0.1em] group-focus-within:text-ethos-primary transition-colors duration-300 ml-1" htmlFor="firstName">Họ</label>
                <input 
                  id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Nguyễn" required 
                  onFocus={() => setFocusedInput('firstName')} onBlur={() => setFocusedInput(null)}
                  className={`w-full h-[48px] bg-transparent border-b border-ethos-primary/30 text-ethos-primary font-inter text-[16px] transition-all duration-300 focus:outline-none placeholder:text-ethos-on-surface-variant/50 ${focusedInput === 'firstName' ? 'bg-ethos-surface-low border-b-2 border-ethos-primary px-4 rounded-none' : 'px-1'}`}
                />
              </div>
              <div className="flex flex-col gap-2 relative group">
                <label className="font-inter text-[12px] font-bold text-ethos-on-surface-variant uppercase tracking-[0.1em] group-focus-within:text-ethos-primary transition-colors duration-300 ml-1" htmlFor="lastName">Tên</label>
                <input 
                  id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Văn A" required 
                  onFocus={() => setFocusedInput('lastName')} onBlur={() => setFocusedInput(null)}
                  className={`w-full h-[48px] bg-transparent border-b border-ethos-primary/30 text-ethos-primary font-inter text-[16px] transition-all duration-300 focus:outline-none placeholder:text-ethos-on-surface-variant/50 ${focusedInput === 'lastName' ? 'bg-ethos-surface-low border-b-2 border-ethos-primary px-4 rounded-none' : 'px-1'}`}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2 relative group">
              <label className="font-inter text-[12px] font-bold text-ethos-on-surface-variant uppercase tracking-[0.1em] group-focus-within:text-ethos-primary transition-colors duration-300 ml-1" htmlFor="username">Tên đăng nhập</label>
              <input 
                id="username" name="username" value={formData.username} onChange={handleChange} placeholder="nguyenvana" required 
                onFocus={() => setFocusedInput('username')} onBlur={() => setFocusedInput(null)}
                className={`w-full h-[48px] bg-transparent border-b border-ethos-primary/30 text-ethos-primary font-inter text-[16px] transition-all duration-300 focus:outline-none placeholder:text-ethos-on-surface-variant/50 ${focusedInput === 'username' ? 'bg-ethos-surface-low border-b-2 border-ethos-primary px-4 rounded-none' : 'px-1'}`}
              />
            </div>

            <div className="flex flex-col gap-2 relative group">
              <label className="font-inter text-[12px] font-bold text-ethos-on-surface-variant uppercase tracking-[0.1em] group-focus-within:text-ethos-primary transition-colors duration-300 ml-1" htmlFor="email">Email Address</label>
              <input 
                id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="jane@example.com" required 
                onFocus={() => setFocusedInput('email')} onBlur={() => setFocusedInput(null)}
                className={`w-full h-[48px] bg-transparent border-b border-ethos-primary/30 text-ethos-primary font-inter text-[16px] transition-all duration-300 focus:outline-none placeholder:text-ethos-on-surface-variant/50 ${focusedInput === 'email' ? 'bg-ethos-surface-low border-b-2 border-ethos-primary px-4 rounded-none' : 'px-1'}`}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2 relative group">
                <label className="font-inter text-[12px] font-bold text-ethos-on-surface-variant uppercase tracking-[0.1em] group-focus-within:text-ethos-primary transition-colors duration-300 ml-1" htmlFor="dateOfBirth">Ngày sinh</label>
                <div className={`w-full h-[48px] bg-transparent border-b border-ethos-primary/30 flex items-center transition-all duration-300 focus-within:bg-ethos-surface-low focus-within:border-b-2 focus-within:border-ethos-primary focus-within:px-4 px-1 group`}>
                  <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    onFocus={() => setFocusedInput('dateOfBirth')}
                    onBlur={() => setFocusedInput(null)}
                    className="w-full bg-transparent border-none outline-none text-ethos-primary font-inter text-[16px] [color-scheme:light] dark:[color-scheme:dark] [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-datetime-edit-fields-wrapper]:p-0"
                  />
                  <Popover>
                    <PopoverTrigger className="p-1 outline-none text-ethos-on-surface-variant group-focus-within:text-ethos-primary transition-colors shrink-0">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-ethos-surface border-ethos-primary/20 shadow-xl shadow-black/10" align="start">
                      <Calendar
                        mode="single"
                        captionLayout="dropdown"
                        startMonth={new Date(1900, 0)}
                        endMonth={new Date(new Date().getFullYear() + 10, 11)}
                        selected={formData.dateOfBirth ? new Date(formData.dateOfBirth) : undefined}
                        onSelect={(date) => {
                          if (date) {
                            const y = date.getFullYear();
                            const m = String(date.getMonth() + 1).padStart(2, '0');
                            const d = String(date.getDate()).padStart(2, '0');
                            setFormData({...formData, dateOfBirth: `${y}-${m}-${d}`});
                          } else {
                            setFormData({...formData, dateOfBirth: ""});
                          }
                        }}
                        className="bg-ethos-surface text-ethos-on-surface"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="flex flex-col gap-2 relative group">
                <label className="font-inter text-[12px] font-bold text-ethos-on-surface-variant uppercase tracking-[0.1em] group-focus-within:text-ethos-primary transition-colors duration-300 ml-1" htmlFor="gender">Giới tính</label>
                <Select 
                  value={formData.gender ? formData.gender.toString() : ""} 
                  onValueChange={(value) => setFormData({...formData, gender: Number(value) as Gender})}
                  onOpenChange={setIsGenderOpen}
                >
                  <SelectTrigger
                    onFocus={() => setFocusedInput('gender')}
                    onBlur={() => setFocusedInput(null)}
                    className={`w-full h-[48px] data-[size=default]:h-[48px] bg-transparent border-0 border-b border-ethos-primary/30 text-ethos-primary font-inter text-[16px] transition-all duration-300 focus:ring-0 focus:outline-none hover:bg-ethos-surface-low rounded-none shadow-none [&>span]:line-clamp-1 data-placeholder:text-ethos-on-surface-variant/50 ${focusedInput === 'gender' || isGenderOpen ? 'bg-ethos-surface-low border-b-2 border-ethos-primary px-4' : 'px-1'}`}
                  >
                    <SelectValue placeholder="Chọn giới tính">
                      {formData.gender === Gender.Male && "Nam"}
                      {formData.gender === Gender.Female && "Nữ"}
                      {formData.gender === Gender.Other && "Khác"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent alignItemWithTrigger={false} className="bg-ethos-surface border-ethos-primary/20 text-ethos-on-surface shadow-xl shadow-black/10 z-50">
                    <SelectItem value={Gender.Male.toString()} className="focus:bg-ethos-surface-low focus:text-ethos-primary cursor-pointer py-3">Nam</SelectItem>
                    <SelectItem value={Gender.Female.toString()} className="focus:bg-ethos-surface-low focus:text-ethos-primary cursor-pointer py-3">Nữ</SelectItem>
                    <SelectItem value={Gender.Other.toString()} className="focus:bg-ethos-surface-low focus:text-ethos-primary cursor-pointer py-3">Khác</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-col gap-2 relative group">
              <label className="font-inter text-[12px] font-bold text-ethos-on-surface-variant uppercase tracking-[0.1em] group-focus-within:text-ethos-primary transition-colors duration-300 ml-1" htmlFor="address">Địa chỉ</label>
              <input 
                id="address" name="address" value={formData.address} onChange={handleChange} placeholder="123 Đường ABC, Quận 1, TP.HCM" required 
                onFocus={() => setFocusedInput('address')} onBlur={() => setFocusedInput(null)}
                className={`w-full h-[48px] bg-transparent border-b border-ethos-primary/30 text-ethos-primary font-inter text-[16px] transition-all duration-300 focus:outline-none placeholder:text-ethos-on-surface-variant/50 ${focusedInput === 'address' ? 'bg-ethos-surface-low border-b-2 border-ethos-primary px-4 rounded-none' : 'px-1'}`}
              />
            </div>

            <div className="flex flex-col gap-2 relative group">
              <label className="font-inter text-[12px] font-bold text-ethos-on-surface-variant uppercase tracking-[0.1em] group-focus-within:text-ethos-primary transition-colors duration-300 ml-1" htmlFor="password">Password</label>
              <div className="relative flex items-center">
                <input 
                  id="password" name="password" type={passwordVisible ? "text" : "password"} value={formData.password} onChange={handleChange} placeholder="••••••••" required 
                  onFocus={() => setFocusedInput('password')} onBlur={() => setFocusedInput(null)}
                  className={`w-full h-[48px] bg-transparent border-b border-ethos-primary/30 text-ethos-primary font-inter text-[16px] pr-10 transition-all duration-300 focus:outline-none placeholder:text-ethos-on-surface-variant/50 ${focusedInput === 'password' ? 'bg-ethos-surface-low border-b-2 border-ethos-primary pl-4 rounded-none' : 'pl-1'}`}
                />
                <button type="button" onClick={() => setPasswordVisible(!passwordVisible)} className="absolute right-2 flex items-center justify-center p-1 shrink-0 text-ethos-on-surface-variant hover:text-ethos-primary transition-colors focus:outline-none">
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
            </div>

            <div className="flex flex-col gap-2 relative group">
              <label className="font-inter text-[12px] font-bold text-ethos-on-surface-variant uppercase tracking-[0.1em] group-focus-within:text-ethos-primary transition-colors duration-300 ml-1" htmlFor="confirmPassword">Confirm Password</label>
              <div className="relative flex items-center">
                <input 
                  id="confirmPassword" name="confirmPassword" type={confirmPasswordVisible ? "text" : "password"} value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" required 
                  onFocus={() => setFocusedInput('confirmPassword')} onBlur={() => setFocusedInput(null)}
                  className={`w-full h-[48px] bg-transparent border-b border-ethos-primary/30 text-ethos-primary font-inter text-[16px] pr-10 transition-all duration-300 focus:outline-none placeholder:text-ethos-on-surface-variant/50 ${focusedInput === 'confirmPassword' ? 'bg-ethos-surface-low border-b-2 border-ethos-primary pl-4 rounded-none' : 'pl-1'}`}
                />
                <button type="button" onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)} className="absolute right-2 flex items-center justify-center p-1 shrink-0 text-ethos-on-surface-variant hover:text-ethos-primary transition-colors focus:outline-none">
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
            </div>

            <button 
              type="submit" 
              disabled={isRegistering}
              className="w-full h-[48px] mt-4 bg-ethos-primary text-ethos-on-primary font-inter text-[16px] font-medium rounded shadow-[0px_4px_10px_rgba(24,25,25,0.05)] hover:shadow-[0px_10px_30px_rgba(24,25,25,0.15)] hover:-translate-y-[2px] transition-all duration-300 ease-out flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isRegistering ? "Đang xử lý..." : "Create Account"}
              {!isRegistering && (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              )}
            </button>
          </form>

          <div className="flex items-center gap-4">
            <div className="flex-1 h-[1px] bg-ethos-surface-variant"></div>
            <span className="font-inter text-[12px] font-bold tracking-[0.1em] text-ethos-on-surface-variant uppercase">Or register with</span>
            <div className="flex-1 h-[1px] bg-ethos-surface-variant"></div>
          </div>

          <div className="flex flex-col gap-4">
            <button type="button" className="group relative w-full h-[48px] flex items-center justify-center gap-3 border border-ethos-outline rounded bg-transparent text-ethos-primary font-inter text-[16px] transition-all duration-300 hover:border-ethos-primary hover:bg-ethos-surface-low hover:shadow-[0px_4px_12px_rgba(45,45,45,0.03)] overflow-hidden">
              <span className="relative z-10 font-medium">Google</span>
            </button>
          </div>

          <p className="text-center font-inter text-[14px] text-ethos-on-surface-variant mt-2">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-ethos-primary font-medium hover:text-ethos-secondary transition-colors underline-offset-4 hover:underline ml-1">
              Sign In
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
