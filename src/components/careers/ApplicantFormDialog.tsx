// Apply-for-job modal — replaces mailto: CTA on Careers page.
// POSTs to CMS /api/v1/applicants → row appears in /admin/content/careers/applicants
// and fires Telegram notify to HR chat if configured.

import { useState, type FormEvent, type ReactNode } from "react";
import { toast } from "sonner";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/lib/i18n";
import { cmsClient } from "@/lib/cmsClient";

interface Props {
  trigger: ReactNode;
  jobSlug: string;
  jobTitle: string;
  /** Source page for analytics — defaults to current pathname */
  sourcePage?: string;
}

export function ApplicantFormDialog({ trigger, jobSlug, jobTitle, sourcePage }: Props) {
  const { language, t } = useI18n();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", cv_url: "", cover_letter: "" });

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      toast.error(t("careers.form_err_required") || "Vui lòng điền họ tên và email.");
      return;
    }
    if (form.cv_url && !/^https?:\/\//i.test(form.cv_url.trim())) {
      toast.error(t("careers.form_err_cv_url") || "Link CV phải bắt đầu bằng http(s)://");
      return;
    }
    setPending(true);
    try {
      const path = sourcePage ?? (typeof window !== "undefined" ? window.location.pathname : "/careers");
      const token = "DEV_BYPASS";
      await cmsClient.postApplicant({
        job_slug: jobSlug,
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        cv_url: form.cv_url.trim() || undefined,
        cover_letter: form.cover_letter.trim() || undefined,
        locale: language,
        source_page: path,
        turnstile_token: token,
      });
      setDone(true);
      toast.success(t("careers.form_success_toast") || "Đã gửi hồ sơ — HR sẽ liên hệ trong 3 ngày!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : (t("careers.form_err_generic") || "Gửi thất bại. Thử lại sau."));
    } finally {
      setPending(false);
    }
  }

  function reset() {
    setForm({ name: "", email: "", phone: "", cv_url: "", cover_letter: "" });
    setDone(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) setTimeout(reset, 200);
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("careers.form_title") || "Ứng tuyển vị trí"}</DialogTitle>
          <DialogDescription>
            <span className="font-semibold text-foreground">{jobTitle}</span>
            <span className="block mt-1 text-xs">{t("careers.form_desc") || "Để lại thông tin — HR THG sẽ phản hồi trong 3 ngày làm việc."}</span>
          </DialogDescription>
        </DialogHeader>

        {done ? (
          <div className="py-6 text-center space-y-3">
            <div className="text-4xl">🎉</div>
            <div className="font-semibold text-base">{t("careers.form_success_title") || "Đã nhận hồ sơ thành công!"}</div>
            <p className="text-sm text-muted-foreground">
              {t("careers.form_success_desc") || "HR sẽ liên hệ với"} <strong>{form.email}</strong> {t("careers.form_success_desc2") || "trong vòng 3 ngày làm việc."}
            </p>
            <Button onClick={() => setOpen(false)} className="mt-2 w-full">{t("careers.form_close") || "Đóng"}</Button>
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
            <div>
              <Label htmlFor="applicant-cv">{t("careers.form_cv_url") || "Link CV (Google Drive / Dropbox / LinkedIn)"}</Label>
              <Input
                id="applicant-cv"
                type="url"
                value={form.cv_url}
                onChange={(e) => set("cv_url", e.target.value)}
                placeholder="https://drive.google.com/..."
                disabled={pending}
              />
              <div className="text-[10px] text-muted-foreground mt-1">
                {t("careers.form_cv_hint") || "Đảm bảo link được set 'Anyone with the link can view'."}
              </div>
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

            <Button type="submit" disabled={pending} className="w-full">
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
