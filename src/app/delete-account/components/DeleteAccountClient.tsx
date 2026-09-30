'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Mail,
  Copy,
  Check,
  ExternalLink,
  ShieldAlert,
  Clock,
  Trash2,
  CheckCircle2,
  FileText,
  AlertTriangle,
  ArrowLeft,
  Info,
  HelpCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const SUPPORT_EMAIL = 'hycat.support@gmail.com';

export function DeleteAccountClient() {
  const [lang, setLang] = useState<'vi' | 'en'>('vi');
  const [emailInput, setEmailInput] = useState('');
  const [usernameInput, setUsernameInput] = useState('');
  const [reasonInput, setReasonInput] = useState('');
  const [copiedSubject, setCopiedSubject] = useState(false);
  const [copiedBody, setCopiedBody] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);

  // Subject line
  const subjectVi = `[Closy] Yêu cầu xóa tài khoản và dữ liệu người dùng${emailInput ? ` - ${emailInput.trim()}` : ''}`;
  const subjectEn = `[Closy] Account and Data Deletion Request${emailInput ? ` - ${emailInput.trim()}` : ''}`;
  const currentSubject = lang === 'vi' ? subjectVi : subjectEn;

  // Email body format
  const bodyVi = `Kính gửi Đội ngũ hỗ trợ Closy (HYCAT TEAM),

Tôi viết email này để yêu cầu xóa vĩnh viễn tài khoản và toàn bộ dữ liệu cá nhân liên quan của tôi trên ứng dụng Closy (Smart Wardrobe).

--- THÔNG TIN TÀI KHOẢN CẦN XÓA ---
• Email đăng ký tài khoản Closy: ${emailInput.trim() || '[Nhập địa chỉ email bạn đã dùng để đăng ký Closy]'}
• Tên tài khoản / Họ tên: ${usernameInput.trim() || '[Nhập username hoặc họ tên hiển thị trong app]'}
• Lý do yêu cầu xóa (không bắt buộc): ${reasonInput.trim() || '[Ví dụ: Không còn nhu cầu sử dụng / Tạo tài khoản mới / Lý do riêng tư]'}

--- XÁC NHẬN CỦA TÔI ---
1. Tôi hiểu và đồng ý rằng toàn bộ dữ liệu gồm: thông tin hồ sơ, danh sách trang phục trong tủ đồ, các bộ outfit đã phối, lịch sử tương tác AI Stylist, ảnh đã tải lên và các bài viết trên cộng đồng sẽ bị xóa vĩnh viễn và không thể khôi phục.
2. Tôi gửi email này từ chính hòm thư đã đăng ký tài khoản (hoặc kèm thông tin chứng minh quyền sở hữu tài khoản).

Kính mong Đội ngũ Closy hỗ trợ xử lý và phản hồi xác nhận cho tôi qua email này.

Xin chân thành cảm ơn!
Người yêu cầu: ${usernameInput.trim() || '[Họ tên của bạn]'}`;

  const bodyEn = `Dear Closy Support Team (HYCAT TEAM),

I am writing to formally request the permanent deletion of my account and all associated personal data from the Closy (Smart Wardrobe) application.

--- ACCOUNT INFORMATION ---
• Registered Email address: ${emailInput.trim() || '[Enter your registered Closy email address]'}
• Username / Full Name: ${usernameInput.trim() || '[Enter your username or display name in the app]'}
• Reason for deletion (optional): ${reasonInput.trim() || '[e.g., No longer using the app / Creating a new account / Privacy reasons]'}

--- CONFIRMATION & ACKNOWLEDGEMENT ---
1. I understand and acknowledge that all my associated data, including my profile information, virtual wardrobe items, saved outfits, AI Stylist chat logs, uploaded photos, and community posts will be permanently deleted and cannot be recovered.
2. I am sending this request from my registered email address (or providing verifiable proof of account ownership).

Please confirm once the account and data deletion process has been completed.

Sincerely,
Requested by: ${usernameInput.trim() || '[Your Name]'}`;

  const currentBody = lang === 'vi' ? bodyVi : bodyEn;

  // Mailto Link with encoded parameters
  const mailtoUrl = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(currentSubject)}&body=${encodeURIComponent(currentBody)}`;

  const handleCopy = async (text: string, type: 'subject' | 'body' | 'all') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'subject') {
        setCopiedSubject(true);
        setTimeout(() => setCopiedSubject(false), 2000);
        toast.success(lang === 'vi' ? 'Đã sao chép tiêu đề email!' : 'Email subject copied to clipboard!');
      } else if (type === 'body') {
        setCopiedBody(true);
        setTimeout(() => setCopiedBody(false), 2000);
        toast.success(lang === 'vi' ? 'Đã sao chép nội dung email!' : 'Email body copied to clipboard!');
      } else {
        setCopiedAll(true);
        setTimeout(() => setCopiedAll(false), 2000);
        toast.success(
          lang === 'vi'
            ? 'Đã sao chép toàn bộ mẫu email (tiêu đề & nội dung)!'
            : 'Copied full email template (subject & body) to clipboard!'
        );
      }
    } catch {
      toast.error(lang === 'vi' ? 'Không thể sao chép tự động. Vui lòng chọn và copy thủ công.' : 'Failed to copy. Please copy manually.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#111111] dark:bg-[#121212] dark:text-[#EEEEEE] pb-20">
      {/* Top Banner / Navigation */}
      <header className="border-b border-black/5 dark:border-white/10 bg-white/80 dark:bg-[#1A1A1A]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-5 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{lang === 'vi' ? 'Về trang chủ Closy' : 'Back to Closy Home'}</span>
          </Link>

          {/* Language Switcher */}
          <div className="flex items-center gap-1 bg-black/5 dark:bg-white/10 p-1 rounded-full text-xs font-semibold">
            <button
              type="button"
              onClick={() => setLang('vi')}
              className={`px-3 py-1 rounded-full transition-all ${
                lang === 'vi'
                  ? 'bg-white dark:bg-[#2A2A2A] text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Tiếng Việt
            </button>
            <button
              type="button"
              onClick={() => setLang('en')}
              className={`px-3 py-1 rounded-full transition-all ${
                lang === 'en'
                  ? 'bg-white dark:bg-[#2A2A2A] text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              English
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-5 pt-8 md:pt-12">
        {/* Header Hero */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs font-semibold border border-amber-500/20">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>
              {lang === 'vi'
                ? 'Tuân thủ chính sách dữ liệu người dùng Google Play (CH Play)'
                : 'Google Play Data Safety & Account Deletion Policy Compliance'}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            {lang === 'vi'
              ? 'Hướng dẫn gửi yêu cầu xóa tài khoản & dữ liệu'
              : 'Account and Data Deletion Request Guide'}
          </h1>

          <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
            {lang === 'vi' ? (
              <>
                Ứng dụng <strong>Closy - Smart Wardrobe</strong> (phát triển bởi <strong>HYCAT TEAM</strong>) cam kết
                bảo vệ quyền riêng tư và quyền tự chủ dữ liệu của người dùng. Nếu bạn không còn nhu cầu sử dụng, bạn có
                thể gửi yêu cầu xóa tài khoản và dữ liệu cá nhân theo hướng dẫn chi tiết bên dưới.
              </>
            ) : (
              <>
                The <strong>Closy - Smart Wardrobe</strong> application (developed by <strong>HYCAT TEAM</strong>) is
                committed to respecting your privacy and data rights. If you wish to delete your account and associated
                personal data, please follow the detailed steps below.
              </>
            )}
          </p>
        </div>

        {/* Quick Summary Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="rounded-2xl border bg-card p-5 shadow-xs flex flex-col justify-between">
            <div className="space-y-2">
              <div className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-sm">
                {lang === 'vi' ? 'Hòm thư tiếp nhận' : 'Support Email'}
              </h3>
              <p className="text-xs text-muted-foreground break-all font-mono font-medium text-foreground">
                {SUPPORT_EMAIL}
              </p>
            </div>
            <p className="text-[11px] text-muted-foreground mt-3 pt-3 border-t">
              {lang === 'vi'
                ? 'Gửi từ chính email đã đăng ký để được xác thực nhanh nhất'
                : 'Send from your registered email for fastest verification'}
            </p>
          </div>

          <div className="rounded-2xl border bg-card p-5 shadow-xs flex flex-col justify-between">
            <div className="space-y-2">
              <div className="size-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-sm">
                {lang === 'vi' ? 'Thời gian xử lý' : 'Processing Timeline'}
              </h3>
              <p className="text-xs text-muted-foreground">
                {lang === 'vi'
                  ? 'Phản hồi trong vòng 24 - 48h. Hoàn tất xóa trong 3 - 7 ngày làm việc.'
                  : 'Acknowledged within 24-48 hours. Completely deleted within 3-7 business days.'}
              </p>
            </div>
            <p className="text-[11px] text-muted-foreground mt-3 pt-3 border-t">
              {lang === 'vi' ? 'Tối đa không quá 30 ngày theo quy định' : 'Within 30 days max per regulatory requirements'}
            </p>
          </div>

          <div className="rounded-2xl border bg-card p-5 shadow-xs flex flex-col justify-between">
            <div className="space-y-2">
              <div className="size-9 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-sm">
                {lang === 'vi' ? 'Phạm vi xóa dữ liệu' : 'Scope of Deletion'}
              </h3>
              <p className="text-xs text-muted-foreground">
                {lang === 'vi'
                  ? 'Hồ sơ tài khoản, tủ đồ cá nhân, ảnh trang phục, lịch sử AI Stylist & bài viết.'
                  : 'Account profile, wardrobe items, photos, AI chat logs, and community posts.'}
              </p>
            </div>
            <p className="text-[11px] text-muted-foreground mt-3 pt-3 border-t">
              {lang === 'vi' ? 'Thao tác không thể khôi phục' : 'Irreversible deletion'}
            </p>
          </div>
        </div>

        {/* 3 Step Guide */}
        <section className="mt-10 space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>
              {lang === 'vi'
                ? 'Quy trình 3 bước gửi yêu cầu xóa tài khoản'
                : '3-Step Process to Request Account Deletion'}
            </span>
          </h2>

          <div className="space-y-4">
            {/* Step 1 */}
            <div className="rounded-2xl border bg-card p-5 md:p-6 shadow-xs relative overflow-hidden">
              <div className="flex items-start gap-4">
                <div className="size-8 rounded-full bg-[#1A1A1A] text-white dark:bg-white dark:text-[#1A1A1A] font-bold text-sm flex items-center justify-center shrink-0">
                  1
                </div>
                <div className="space-y-2 flex-1">
                  <h3 className="font-semibold text-base">
                    {lang === 'vi' ? 'Chuẩn bị thông tin tài khoản' : 'Prepare Your Account Information'}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {lang === 'vi' ? (
                      <>
                        Để bảo vệ an toàn cho chủ tài khoản và tránh trường hợp xóa nhầm, bạn cần cung cấp:
                      </>
                    ) : (
                      <>
                        To prevent unauthorized deletion requests and protect your account security, please prepare:
                      </>
                    )}
                  </p>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                    <li>
                      <strong>{lang === 'vi' ? 'Địa chỉ email đã đăng ký:' : 'Registered Email Address:'}</strong>{' '}
                      {lang === 'vi'
                        ? 'Email bạn dùng để tạo tài khoản hoặc email liên kết với Google login trên Closy.'
                        : 'The email address associated with your Closy account or Google sign-in.'}
                    </li>
                    <li>
                      <strong>{lang === 'vi' ? 'Tên tài khoản (Username) / Họ tên:' : 'Username / Display Name:'}</strong>{' '}
                      {lang === 'vi'
                        ? 'Tên hiển thị trong phần Hồ sơ của ứng dụng.'
                        : 'Your username or display name shown in your in-app profile.'}
                    </li>
                    <li>
                      <strong>{lang === 'vi' ? 'Hòm thư gửi yêu cầu:' : 'Sender Email:'}</strong>{' '}
                      {lang === 'vi'
                        ? 'Khuyến nghị gửi trực tiếp từ chính hòm thư email bạn đã đăng ký tài khoản Closy.'
                        : 'We strongly recommend sending the email from the registered email address itself for instant verification.'}
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="rounded-2xl border bg-card p-5 md:p-6 shadow-xs relative overflow-hidden">
              <div className="flex items-start gap-4">
                <div className="size-8 rounded-full bg-[#1A1A1A] text-white dark:bg-white dark:text-[#1A1A1A] font-bold text-sm flex items-center justify-center shrink-0">
                  2
                </div>
                <div className="space-y-3 flex-1">
                  <h3 className="font-semibold text-base">
                    {lang === 'vi' ? 'Soạn email theo mẫu quy định' : 'Compose Email Using the Official Format'}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {lang === 'vi' ? (
                      <>
                        Bạn có thể nhập thông tin của mình vào biểu mẫu nhanh dưới đây để tạo mẫu email tự động, hoặc
                        sao chép trực tiếp khung định dạng chuẩn gửi tới{' '}
                        <strong className="text-foreground">{SUPPORT_EMAIL}</strong>.
                      </>
                    ) : (
                      <>
                        You can fill in your details below to generate a pre-filled email draft, or copy the standard
                        format to send directly to <strong className="text-foreground">{SUPPORT_EMAIL}</strong>.
                      </>
                    )}
                  </p>

                  {/* Quick Form to generate template */}
                  <div className="rounded-xl border border-dashed p-4 bg-muted/40 space-y-4 my-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5" />
                      {lang === 'vi'
                        ? 'Công cụ điền nhanh mẫu email (tùy chọn)'
                        : 'Quick Email Generator Tool (Optional)'}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="input-email" className="text-xs">
                          {lang === 'vi' ? 'Email đăng ký Closy:' : 'Registered Closy Email:'}
                        </Label>
                        <Input
                          id="input-email"
                          placeholder={lang === 'vi' ? 'vidu@gmail.com' : 'example@gmail.com'}
                          value={emailInput}
                          onChange={(e) => setEmailInput(e.target.value)}
                          className="text-sm bg-background"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="input-username" className="text-xs">
                          {lang === 'vi' ? 'Username / Họ tên:' : 'Username / Full Name:'}
                        </Label>
                        <Input
                          id="input-username"
                          placeholder={lang === 'vi' ? 'nguyenvana' : 'johndoe'}
                          value={usernameInput}
                          onChange={(e) => setUsernameInput(e.target.value)}
                          className="text-sm bg-background"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="input-reason" className="text-xs">
                        {lang === 'vi' ? 'Lý do xóa (không bắt buộc):' : 'Reason for deletion (optional):'}
                      </Label>
                      <Input
                        id="input-reason"
                        placeholder={
                          lang === 'vi'
                            ? 'Không còn nhu cầu sử dụng, muốn bảo mật dữ liệu cá nhân...'
                            : 'No longer using the app, privacy concerns...'
                        }
                        value={reasonInput}
                        onChange={(e) => setReasonInput(e.target.value)}
                        className="text-sm bg-background"
                      />
                    </div>
                  </div>

                  {/* Mail Preview Card */}
                  <div className="space-y-3 pt-2">
                    {/* Subject line */}
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-semibold text-muted-foreground">
                          {lang === 'vi' ? 'Tiêu đề email (Subject):' : 'Email Subject:'}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(currentSubject, 'subject')}
                          className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                        >
                          {copiedSubject ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-600 font-medium">
                                {lang === 'vi' ? 'Đã sao chép' : 'Copied'}
                              </span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>{lang === 'vi' ? 'Sao chép tiêu đề' : 'Copy Subject'}</span>
                            </>
                          )}
                        </button>
                      </div>
                      <div className="p-3 bg-muted/60 rounded-xl text-sm font-mono border text-foreground select-all break-words">
                        {currentSubject}
                      </div>
                    </div>

                    {/* Body content */}
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-semibold text-muted-foreground">
                          {lang === 'vi' ? 'Nội dung email (Body):' : 'Email Body:'}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(currentBody, 'body')}
                          className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                        >
                          {copiedBody ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-600 font-medium">
                                {lang === 'vi' ? 'Đã sao chép' : 'Copied'}
                              </span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>{lang === 'vi' ? 'Sao chép nội dung' : 'Copy Body'}</span>
                            </>
                          )}
                        </button>
                      </div>
                      <div className="p-4 bg-muted/60 rounded-xl text-xs md:text-sm font-mono whitespace-pre-wrap border text-foreground select-all leading-relaxed max-h-[360px] overflow-y-auto">
                        {currentBody}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-wrap items-center gap-3 pt-3">
                      <a
                        href={mailtoUrl}
                        className="inline-flex items-center justify-center gap-2 bg-[#1A1A1A] hover:bg-[#333333] text-white dark:bg-white dark:text-[#1A1A1A] dark:hover:bg-neutral-200 px-5 py-2.5 rounded-full text-sm font-semibold shadow-xs transition-all"
                      >
                        <Mail className="w-4 h-4" />
                        <span>
                          {lang === 'vi' ? 'Mở ứng dụng Email gửi ngay' : 'Open Email App and Send'}
                        </span>
                        <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                      </a>

                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          handleCopy(
                            `Gửi tới: ${SUPPORT_EMAIL}\nTiêu đề: ${currentSubject}\n\nNội dung:\n${currentBody}`,
                            'all'
                          )
                        }
                        className="rounded-full text-sm font-medium gap-2"
                      >
                        {copiedAll ? (
                          <>
                            <Check className="w-4 h-4 text-emerald-600" />
                            <span className="text-emerald-600">
                              {lang === 'vi' ? 'Đã sao chép toàn bộ!' : 'Copied Full Template!'}
                            </span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            <span>
                              {lang === 'vi' ? 'Sao chép toàn bộ mẫu email' : 'Copy Full Email Template'}
                            </span>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="rounded-2xl border bg-card p-5 md:p-6 shadow-xs relative overflow-hidden">
              <div className="flex items-start gap-4">
                <div className="size-8 rounded-full bg-[#1A1A1A] text-white dark:bg-white dark:text-[#1A1A1A] font-bold text-sm flex items-center justify-center shrink-0">
                  3
                </div>
                <div className="space-y-2 flex-1">
                  <h3 className="font-semibold text-base">
                    {lang === 'vi'
                      ? 'Tiếp nhận, xác thực & hoàn tất xóa dữ liệu'
                      : 'Verification, Processing & Completion Notification'}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {lang === 'vi' ? (
                      <>
                        Sau khi nhận được thư yêu cầu của bạn, đội ngũ kỹ thuật của HYCAT TEAM sẽ thực hiện:
                      </>
                    ) : (
                      <>
                        Upon receiving your email request, the HYCAT TEAM technical support team will:
                      </>
                    )}
                  </p>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                    <li>
                      <strong>{lang === 'vi' ? 'Phản hồi tiếp nhận:' : 'Acknowledge request:'}</strong>{' '}
                      {lang === 'vi'
                        ? 'Gửi thư xác nhận tiếp nhận yêu cầu trong vòng 24 - 48 giờ làm việc.'
                        : 'Acknowledge receipt of your request within 24-48 business hours.'}
                    </li>
                    <li>
                      <strong>{lang === 'vi' ? 'Xác thực tài khoản:' : 'Identity verification:'}</strong>{' '}
                      {lang === 'vi'
                        ? 'Đối chiếu thông tin để đảm bảo quyền sở hữu chính chủ (chúng tôi không bao giờ hỏi mật khẩu của bạn).'
                        : 'Verify account ownership to prevent malicious requests (we never ask for your password).'}
                    </li>
                    <li>
                      <strong>{lang === 'vi' ? 'Tiến hành xóa vĩnh viễn:' : 'Permanent purge:'}</strong>{' '}
                      {lang === 'vi'
                        ? 'Xóa toàn bộ hồ sơ, hình ảnh quần áo trên kho lưu trữ đám mây, các bộ phối outfit và dữ liệu trò chuyện AI.'
                        : 'Permanently purge your profile, wardrobe images on cloud storage (Cloudinary), outfit records, and AI chat logs.'}
                    </li>
                    <li>
                      <strong>{lang === 'vi' ? 'Thông báo hoàn tất:' : 'Completion notice:'}</strong>{' '}
                      {lang === 'vi'
                        ? 'Gửi email thông báo hoàn thành đến bạn ngay sau khi quy trình hoàn tất.'
                        : 'Send a final email notifying you that the deletion process is complete.'}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Data Deletion Policy Table / Details */}
        <section className="mt-12 rounded-2xl border bg-card p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-2 text-foreground">
            <Info className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold">
              {lang === 'vi'
                ? 'Chi tiết các loại dữ liệu được xóa & thời gian lưu trữ'
                : 'Data Types Deleted & Retention Policy (Data Safety Details)'}
            </h2>
          </div>

          <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
            <div className="border rounded-xl p-4 bg-muted/20 space-y-2">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <Trash2 className="w-4 h-4 text-red-500" />
                <span>
                  {lang === 'vi' ? '1. Dữ liệu bị xóa hoàn toàn và vĩnh viễn' : '1. Data Permanently Deleted'}
                </span>
              </h3>
              <ul className="list-disc pl-5 space-y-1 text-xs md:text-sm">
                <li>
                  <strong>{lang === 'vi' ? 'Thông tin tài khoản cá nhân:' : 'Personal Profile:'}</strong>{' '}
                  {lang === 'vi'
                    ? 'Họ tên, email, tên đăng nhập (username), ảnh đại diện (avatar), thông tin mật khẩu mã hóa.'
                    : 'Full name, email address, username, avatar photo, encrypted credentials.'}
                </li>
                <li>
                  <strong>{lang === 'vi' ? 'Tủ đồ thông minh:' : 'Smart Wardrobe Catalog:'}</strong>{' '}
                  {lang === 'vi'
                    ? 'Tất cả danh mục trang phục, phụ kiện, thẻ phân loại, ghi chú và các thông số phân tích phong cách từ AI.'
                    : 'All cataloged clothing items, accessories, tags, notes, and AI-extracted attributes.'}
                </li>
                <li>
                  <strong>{lang === 'vi' ? 'Hình ảnh trang phục tải lên:' : 'Uploaded Garment Images:'}</strong>{' '}
                  {lang === 'vi'
                    ? 'Toàn bộ tệp hình ảnh bạn đã tải lên được thu hồi và xóa sạch khỏi hạ tầng máy chủ và Cloudinary.'
                    : 'All original and processed clothing image assets purged from application servers and Cloudinary storage.'}
                </li>
                <li>
                  <strong>{lang === 'vi' ? 'Bộ sưu tập outfits & lịch sử phối đồ:' : 'Outfits & Styling History:'}</strong>{' '}
                  {lang === 'vi'
                    ? 'Các bản phối outfit cá nhân đã lưu, lịch trình mặc đồ, trang phục yêu thích.'
                    : 'All custom outfit compositions, calendar styling logs, and favorite outfit collections.'}
                </li>
                <li>
                  <strong>{lang === 'vi' ? 'Lịch sử AI Stylist & Thử đồ ảo:' : 'AI Stylist & Virtual Try-on:'}</strong>{' '}
                  {lang === 'vi'
                    ? 'Toàn bộ nội dung hội thoại tư vấn với AI Stylist và ảnh kết quả thử đồ ảo.'
                    : 'All conversational dialogues with the AI Stylist and generated virtual try-on render files.'}
                </li>
                <li>
                  <strong>{lang === 'vi' ? 'Hoạt động cộng đồng:' : 'Community Activity:'}</strong>{' '}
                  {lang === 'vi'
                    ? 'Các bài viết, hình ảnh chia sẻ trên bảng tin cộng đồng, bình luận và lượt yêu thích của bạn.'
                    : 'Feed posts, outfit shares, public comments, and like records.'}
                </li>
              </ul>
            </div>

            <div className="border rounded-xl p-4 bg-muted/20 space-y-2">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-500" />
                <span>
                  {lang === 'vi' ? '2. Dữ liệu sao lưu kỹ thuật & thời hạn' : '2. Technical Backups Retention Policy'}
                </span>
              </h3>
              <p className="text-xs md:text-sm">
                {lang === 'vi' ? (
                  <>
                    Sau khi tài khoản được xóa khỏi cơ sở dữ liệu hoạt động chính, các bản sao lưu kỹ thuật
                    (technical backup snapshots) dùng cho mục đích phòng chống thảm họa hệ thống sẽ được ghi đè và dọn
                    dẹp cuốn chiếu theo chu kỳ tự động trong vòng <strong>tối đa 30 ngày</strong>.
                  </>
                ) : (
                  <>
                    After an account is removed from the active database, routine automated disaster-recovery backup
                    snapshots are completely overwritten and purged within a rolling window of <strong>up to 30 days</strong>.
                  </>
                )}
              </p>
            </div>
          </div>
        </section>

        {/* Important Notes */}
        <section className="mt-8 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5 md:p-6 space-y-3">
          <h2 className="font-semibold text-sm md:text-base text-amber-900 dark:text-amber-200 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>{lang === 'vi' ? 'Lưu ý quan trọng' : 'Important Notices'}</span>
          </h2>
          <ul className="list-disc pl-5 text-xs md:text-sm text-muted-foreground space-y-1.5 leading-relaxed">
            <li>
              <strong>{lang === 'vi' ? 'Gỡ cài đặt ứng dụng:' : 'Uninstalling the app:'}</strong>{' '}
              {lang === 'vi'
                ? 'Hành động xóa hoặc gỡ ứng dụng khỏi thiết bị di động (Android / iOS) KHÔNG đồng nghĩa với việc xóa tài khoản hay dữ liệu của bạn trên máy chủ. Bạn phải gửi yêu cầu qua email để tiến hành xóa.'
                : 'Deleting or uninstalling the app from your mobile device does NOT automatically delete your account or cloud data. You must submit an email request.'}
            </li>
            <li>
              <strong>{lang === 'vi' ? 'Tính không thể hoàn tác:' : 'Irreversibility:'}</strong>{' '}
              {lang === 'vi'
                ? 'Một khi tài khoản đã bị xóa hoàn tất, bạn không thể khôi phục lại các trang phục hay dữ liệu phối đồ đã lưu.'
                : 'Once account deletion is executed, all saved wardrobe garments, outfits, and customizations cannot be restored.'}
            </li>
            <li>
              <strong>{lang === 'vi' ? 'Tài khoản liên kết Google:' : 'Google Sign-in accounts:'}</strong>{' '}
              {lang === 'vi'
                ? 'Nếu bạn đăng ký qua tài khoản Google, hãy gửi email yêu cầu từ chính địa chỉ email Google đó.'
                : 'If you signed up with Google Sign-In, please send the request from that exact Google email address.'}
            </li>
          </ul>
        </section>

        {/* Footer Navigation */}
        <div className="mt-12 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/" className="hover:underline">
              {lang === 'vi' ? 'Trang chủ Closy' : 'Closy Home'}
            </Link>
            <span>•</span>
            <Link href="/privacy" className="hover:underline">
              {lang === 'vi' ? 'Chính sách bảo mật' : 'Privacy Policy'}
            </Link>
            <span>•</span>
            <a href={`mailto:${SUPPORT_EMAIL}`} className="hover:underline">
              {SUPPORT_EMAIL}
            </a>
          </div>

          <p>© 2026 Closy. Developed by HYCAT TEAM.</p>
        </div>
      </main>
    </div>
  );
}
