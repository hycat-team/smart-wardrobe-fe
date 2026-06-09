"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useLogin } from "@/features/auth/queries/auth.queries";
import Image from "next/image";

export function LoginClient() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const { mutate: login, isPending } = useLogin();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Vui lòng nhập đầy đủ email và mật khẩu.");
      return;
    }

    login({ loginName: email, password }, {
      onSuccess: (res: any) => {
        if (res?.isAdmin) {
          router.push("/admin/dashboard");
        } else {
          router.push("/wardrobe");
        }
      }
    });
  };

  return (
    <div className="bg-ethos-surface text-ethos-on-surface font-inter text-base min-h-screen flex antialiased">
      {/* Split Layout Container */}
      <main className="w-full flex flex-col md:flex-row min-h-screen">
        
        {/* Left Side: Editorial Image */}
        <section className="hidden md:block md:w-1/2 relative bg-ethos-surface-low overflow-hidden">
          <Image 
            alt="Ethos Atelier Editorial" 
            className="absolute inset-0 w-full h-full object-cover grayscale-[20%]" 
            src="https://lh3.googleusercontent.com/aida/AP1WRLtaCdgB7jZ1fDTLXuC0CIEx_vyosxOTPqoHCZTPCYKJCVSSKIRzNGCGljBg5xl9HH8F_0TvA3-F1hVLKJEuj6VdVLMQtwSZRFmyePdeoGXjTJ4FnYwbaLz1dqoj0J_cMMzy7azwPQ1_VznHKIqeW8iTJl_LLhHpnfjTS0a_eqkATMMkGNG5bu1z2swXkFPXReTJPGkht5Tq1HBp08l3kq-AtYvgCVXJQyEOw5GVykd4QAkvLO8UqDDGPLc"
            fill
          />
          <div className="absolute inset-0 bg-ethos-primary/10"></div>
          <div className="absolute top-[64px] left-[64px] z-10">
            <h2 className="font-playfair text-[48px] font-semibold text-ethos-surface-lowest drop-shadow-md tracking-tight">Closy.</h2>
          </div>
          <div className="absolute bottom-[64px] left-[64px] z-10 max-w-md">
            <p className="font-inter text-[16px] text-ethos-surface-lowest/90 drop-shadow-sm">Consciously crafted. Meticulously curated. Your digital atelier awaits.</p>
          </div>
        </section>
        
        {/* Right Side: Login Form */}
        <section className="w-full md:w-1/2 flex flex-col justify-center px-[20px] md:px-[64px] lg:px-24 xl:px-32 relative bg-ethos-surface-lowest md:bg-transparent">
          
          {/* Mobile Brand */}
          <div className="md:hidden mt-[20px] mb-12 flex justify-center w-full">
            <h2 className="font-playfair text-[36px] font-semibold text-ethos-primary tracking-tight">Closy.</h2>
          </div>
          
          <div className="w-full max-w-md mx-auto">
            <div className="mb-12">
              <h1 className="font-playfair text-[36px] md:text-[48px] font-semibold text-ethos-primary mb-2">Welcome Back.</h1>
              <p className="font-inter text-[16px] text-ethos-on-surface-variant">Sign in to access your curated wardrobe.</p>
            </div>
            
            <form className="space-y-8" onSubmit={handleLogin}>
              <div className="space-y-2">
                <label className="block font-inter text-[12px] font-bold text-ethos-on-surface-variant uppercase tracking-[0.1em]" htmlFor="email">Email Address</label>
                <input 
                  id="email" 
                  name="email" 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedInput('email')}
                  onBlur={() => setFocusedInput(null)}
                  placeholder="your@email.com" 
                  required 
                  className={`w-full block font-inter text-[16px] text-ethos-primary placeholder:text-ethos-outline-variant py-3 focus:outline-none focus:ring-0 border-0 border-b border-ethos-primary bg-transparent transition-all duration-300 ${focusedInput === 'email' ? 'bg-ethos-surface-low border-b-2 px-4 rounded-none' : 'px-0'}`}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block font-inter text-[12px] font-bold text-ethos-on-surface-variant uppercase tracking-[0.1em]" htmlFor="password">Password</label>
                  <Link href="/auth/forgot-password" className="font-inter text-[14px] text-ethos-on-surface-variant hover:text-ethos-primary transition-colors">Forgot?</Link>
                </div>
                <input 
                  id="password" 
                  name="password" 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedInput('password')}
                  onBlur={() => setFocusedInput(null)}
                  placeholder="••••••••" 
                  required 
                  className={`w-full block font-inter text-[16px] text-ethos-primary placeholder:text-ethos-outline-variant py-3 focus:outline-none focus:ring-0 border-0 border-b border-ethos-primary bg-transparent transition-all duration-300 ${focusedInput === 'password' ? 'bg-ethos-surface-low border-b-2 px-4 rounded-none' : 'px-0'}`}
                />
              </div>
              
              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={isPending}
                  className="w-full h-12 bg-ethos-primary text-ethos-on-primary font-inter text-[16px] font-medium flex items-center justify-center hover:bg-ethos-primary-container hover:shadow-[0_10px_30px_rgba(45,45,45,0.15)] transition-all duration-300 ease-in-out group disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <span>{isPending ? "Signing In..." : "Sign In"}</span>
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
                  <div className="w-full border-t border-ethos-surface-dim"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-ethos-surface-lowest md:bg-ethos-surface text-ethos-on-surface-variant font-inter text-[12px] font-bold tracking-[0.1em] uppercase">Or continue with</span>
                </div>
              </div>
              <div className="mt-8 grid grid-cols-2 gap-4">
                <button type="button" className="flex justify-center items-center h-12 border border-ethos-surface-dim bg-transparent hover:bg-ethos-surface-low transition-colors duration-300">
                  <svg aria-hidden="true" className="h-5 w-5 text-ethos-primary" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"></path>
                  </svg>
                  <span className="sr-only">Sign in with Google</span>
                </button>
                <button type="button" className="flex justify-center items-center h-12 border border-ethos-surface-dim bg-transparent hover:bg-ethos-surface-low transition-colors duration-300">
                  <svg aria-hidden="true" className="h-5 w-5 text-ethos-primary" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12c0-5.523-4.477-10-10-10z"></path>
                  </svg>
                  <span className="sr-only">Sign in with Apple</span>
                </button>
              </div>
            </div>
            
            <div className="mt-12 text-center">
              <p className="font-inter text-[16px] text-ethos-on-surface-variant">
                New to Closy?{' '}
                <Link href="/auth/register" className="text-ethos-primary font-medium border-b border-ethos-primary pb-0.5 hover:text-ethos-on-surface-variant hover:border-ethos-on-surface-variant transition-colors">
                  Create an Account
                </Link>
              </p>
            </div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute bottom-4 right-4 text-ethos-outline font-inter text-[14px] hidden lg:block">
            © 2024 Ethos Atelier
          </div>
        </section>
      </main>
    </div>
  );
}
