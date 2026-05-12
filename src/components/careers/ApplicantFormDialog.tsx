// Apply-for-job modal — replaces mailto: CTA on Careers page.
// Two-step UX: upload CV file (PDF/DOC/DOCX) → fill form → submit.
// POSTs to CMS /api/v1/applicants → row appears in /admin/content/careers/applicants
// and fires Telegram notify to HR chat if configured.

import { useRef, useState, type FormEvent, type ReactNode } from "react";
import { toast } from "sonner";
import { FileText, Loader2, Upload, X } from "lucide-react";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/lib/i18n";
import { cmsClient } from "@/lib/cmsClient";
import { TURNSTILE_DEV_TOKEN, TURNSTILE_SITE_KEY, isTurnstileEnabled } from "@/lib/turnstile";
import { getUtmPayload } from "@/lib/utm";

interface Props {
  trigger: ReactNode;
  jobSlug: string;
  jobTitle: string;
  /** Source page for analytics — defaults to current pathname */
  sourcePage?: string;
  /** Optional callback when modal opens — used to close parent job-detail modal */
  onOpenChange?: (open: boolean) => void;
}

interface UploadedCv {
  url: string;
  filename: string;
  size: number;
}

const ACCEPT = "application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.pdf,.doc,.docx";
const MAX_BYTES = 10 * 1024 * 1024;

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

export function ApplicantFormDialog({ trigger, jobSlug, jobTitle, sourcePage, onOpenChange }: Props) {
  const { language, t } = useI18n();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [cv, setCv] = useState<UploadedCv | null>(null);
  const [cvLink, setCvLink] = useState("");
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", cover_letter: "" });
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileInstance | null>(null);

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // reset so the same file can be re-uploaded after error
    if (!file) return;
    if (file.size > MAX_BYTES) {
      toast.error(t("careers.form_err_size") || "File quá lớn — tối đa 10MB");
      return;
    }
    setUploading(true);
    try {
      const result = await cmsClient.uploadApplicantCv(file);
      setCv(result);
      setCvLink(""); // clear text link if a file was uploaded
      toast.success(t("careers.form_cv_uploaded") || "Đã upload CV");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : (t("careers.form_err_upload") || "Upload thất bại"));
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      toast.error(t("careers.form_err_required") || "Vui lòng điền họ tên và email.");
      return;
    }
    const effectiveCvUrl = cv?.url || cvLink.trim();
    if (!effectiveCvUrl) {
      toast.error(t("careers.form_err_cv") || "Vui lòng upload CV hoặc dán link CV.");
      return;
    }
    if (!cv && cvLink && !/^https?:\/\//i.test(cvLink.trim())) {
      toast.error(t("careers.form_err_cv_url") || "Link CV phải bắt đầu bằng http(s)://");
      return;
    }
    const token = isTurnstileEnabled() ? captchaToken : TURNSTILE_DEV_TOKEN;
    if (!token) {
      toast.error(t("careers.form_err_captcha"));
      return;
    }
    setPending(true);
    try {
      const path = sourcePage ?? (typeof window !== "undefined" ? window.location.pathname : "/careers");
      const utm = getUtmPayload();
      await cmsClient.postApplicant({
        job_slug: jobSlug,
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        cv_url: effectiveCvUrl,
        cover_letter: form.cover_letter.trim() || undefined,
        locale: language,
        source_page: path,
        utm: Object.keys(utm).length > 0 ? utm : undefined,
        turnstile_token: token,
      });
      setDone(true);
      toast.success(t("careers.form_success_toast") || "Đã gửi hồ sơ — HR sẽ liên hệ trong 3 ngày!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : (t("careers.form_err_generic") || "Gửi thất bại. Thử lại sau."));
      // Turnstile tokens are single-use — reset so the user can retry.
      turnstileRef.current?.reset();
      setCaptchaToken(null);
    } finally {
      setPending(false);
    }
  }

  function reset() {
    setForm({ name: "", email: "", phone: "", cover_letter: "" });
    setCv(null);
    setCvLink("");
    setDone(false);
    setCaptchaToken(null);
    turnstileRef.current?.reset();
  }

  function handleOpenChange(o: boolean) {
    setOpen(o);
    onOpenChange?.(o);
    if (!o) setTimeout(reset, 200);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("careers.form_title") || "Ứng tuyển vị trí"}</DialogTitle>
          <DialogDescription className="space-y-1">
            <span className="block font-semibold text-foreground">{jobTitle}</span>
            <span className="block text-xs">{t("careers.form_desc") || "Để lại thông tin — HR THG sẽ phản hồi trong 3 ngày làm việc."}</span>
          </DialogDescription>
        </DialogHeader>

        {done ? (
          <div className="py-6 text-center space-y-3">
            <div className="text-4xl">🎉</div>
            <div className="font-semibold text-base">{t("careers.form_success_title") || "Đã nhận hồ sơ thành công!"}</div>
            <p className="text-sm text-muted-foreground">
              {t("careers.form_success_desc") || "HR sẽ liên hệ với"} <strong>{form.email}</strong> {t("careers.form_success_desc2") || "trong vòng 3 ngày làm việc."}
            </p>
            <Button onClick={() => handleOpenChange(false)} className="mt-2 w-full">{t("careers.form_close") || "Đóng"}</Button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-3">
            <div>
              <Label htmlFor="applicant-name">{t("careers.form_name") || "Họ tên"} *</Label>
              <Input
                id="applicant-name"
                required
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="Nguyễn Văn A"
                disabled={pending}
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="applicant-email">Email *</Label>
                <Input
                  id="applicant-email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  placeholder="ban@example.com"
                  disabled={pending}
                />
              </div>
              <div>
                <Label htmlFor="applicant-phone">{t("careers.form_phone") || "Điện thoại"}</Label>
                <Input
                  id="applicant-phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  placeholder="0901 234 567"
                  disabled={pending}
                />
              </div>
            </div>

            {/* CV upload area */}
            <div>
              <Label>{t("careers.form_cv_label") || "CV (PDF/DOC/DOCX, tối đa 10MB)"} *</Label>
              {cv ? (
                <div className="flex items-center gap-3 mt-1 p-3 rounded-md border border-primary/30 bg-primary/5">
                  <FileText className="w-5 h-5 text-primary shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium truncate">{cv.filename}</div>
                    <div className="text-xs text-muted-foreground">{formatBytes(cv.size)}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCv(null)}
                    disabled={pending}
                    className="text-muted-foreground hover:text-foreground p-1"
                    aria-label="Xoá CV"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label
                  className={`mt-1 flex flex-col items-center justify-center gap-2 px-4 py-6 rounded-md border-2 border-dashed border-border bg-secondary/30 hover:bg-secondary/50 cursor-pointer transition-colors ${uploading ? "opacity-50 pointer-events-none" : ""}`}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-6 h-6 text-primary animate-spin" />
                      <span className="text-xs text-muted-foreground">{t("careers.form_uploading") || "Đang upload..."}</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-6 h-6 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">{t("careers.form_cv_pick") || "Chọn file CV"}</span>
                      <span className="text-xs text-muted-foreground">{t("careers.form_cv_hint2") || "Hoặc kéo thả vào đây"}</span>
                    </>
                  )}
                  <input
                    type="file"
                    className="sr-only"
                    accept={ACCEPT}
                    onChange={onFileSelected}
                    disabled={uploading || pending}
                  />
                </label>
              )}

              {!cv && (
                <details className="mt-2 text-xs">
                  <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                    {t("careers.form_cv_alt") || "Hoặc dán link CV (Google Drive / Dropbox / LinkedIn)"}
                  </summary>
                  <Input
                    type="url"
                    value={cvLink}
                    onChange={(e) => setCvLink(e.target.value)}
                    placeholder="https://drive.google.com/..."
                    disabled={pending}
                    className="mt-2 text-xs"
                  />
                  <p className="mt-1 text-[10px] text-muted-foreground">
                    {t("careers.form_cv_share_hint") || "Đảm bảo link được set 'Anyone with the link can view'."}
                  </p>
                </details>
              )}
            </div>

            <div>
              <Label htmlFor="applicant-cover">{t("careers.form_cover_letter") || "Thư giới thiệu (tùy chọn)"}</Label>
              <Textarea
                id="applicant-cover"
                value={form.cover_letter}
                onChange={(e) => set("cover_letter", e.target.value)}
                placeholder={t("careers.form_cover_placeholder") || "Vài dòng giới thiệu bản thân, lý do bạn quan tâm vị trí này..."}
                rows={4}
                disabled={pending}
              />
            </div>

            {isTurnstileEnabled() && (
              <div className="flex justify-center" data-testid="applicant-turnstile">
                <Turnstile
                  ref={turnstileRef}
                  siteKey={TURNSTILE_SITE_KEY}
                  onSuccess={setCaptchaToken}
                  onError={() => setCaptchaToken(null)}
                  onExpire={() => setCaptchaToken(null)}
                  options={{ theme: "light", size: "normal" }}
                />
              </div>
            )}

            <Button type="submit" disabled={pending || uploading} className="w-full">
              {pending ? (t("careers.form_submitting") || "Đang gửi…") : (t("careers.form_submit") || "Gửi hồ sơ ứng tuyển")}
            </Button>

            <div className="text-[10px] text-center text-muted-foreground">
              {t("careers.form_consent") || "Bằng cách submit, bạn đồng ý cho THG xử lý dữ liệu hồ sơ phục vụ tuyển dụng."}
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
