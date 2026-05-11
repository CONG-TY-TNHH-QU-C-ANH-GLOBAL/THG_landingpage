// Modal lead form — replaces "Get Started" → facebook.com CTA (audit P0.6).
// POSTs to CMS /api/v1/leads with Turnstile token (DEV_BYPASS in dev).

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
  /** Source page for analytics — defaults to current pathname */
  sourcePage?: string;
}

export function LeadFormDialog({ trigger, sourcePage }: Props) {
  const { language } = useI18n();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      toast.error("Vui lòng điền tên và email.");
      return;
    }
    setPending(true);
    try {
      const path = sourcePage ?? (typeof window !== "undefined" ? window.location.pathname : "/");
      // Turnstile token — DEV_BYPASS works when CMS has empty TURNSTILE_SECRET_KEY.
      // Production: replace with @marsidev/react-turnstile widget output.
      const token = "DEV_BYPASS";
      await cmsClient.postLead({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        message: form.message.trim() || undefined,
        source_page: path,
        locale: language,
        turnstile_token: token,
      });
      setDone(true);
      toast.success("Cảm ơn bạn! THG sẽ liên hệ trong 24h.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Submit thất bại. Thử lại sau.");
    } finally {
      setPending(false);
    }
  }

  function reset() {
    setForm({ name: "", email: "", phone: "", message: "" });
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Liên hệ tư vấn</DialogTitle>
          <DialogDescription>
            Để lại thông tin, đội THG sẽ phản hồi trong 24h. Bạn cũng có thể chat trực tiếp qua Facebook nếu cần gấp.
          </DialogDescription>
        </DialogHeader>

        {done ? (
          <div className="py-6 text-center space-y-3">
            <div className="text-3xl">✅</div>
            <div className="font-semibold text-base">Đã gửi yêu cầu thành công!</div>
            <p className="text-sm text-muted-foreground">
              Đội ngũ THG sẽ liên hệ với <strong>{form.email}</strong> trong vòng 24 giờ.
            </p>
            <Button onClick={() => setOpen(false)} className="mt-2 w-full">Đóng</Button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-3">
            <div>
              <Label htmlFor="lead-name">Họ tên *</Label>
              <Input
                id="lead-name"
                required
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="Nguyễn Văn A"
                disabled={pending}
              />
            </div>
            <div>
              <Label htmlFor="lead-email">Email *</Label>
              <Input
                id="lead-email"
                type="email"
                required
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="ban@example.com"
                disabled={pending}
              />
            </div>
            <div>
              <Label htmlFor="lead-phone">Điện thoại (optional)</Label>
              <Input
                id="lead-phone"
                type="tel"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                placeholder="0901 234 567"
                disabled={pending}
              />
            </div>
            <div>
              <Label htmlFor="lead-message">Nhu cầu (optional)</Label>
              <Textarea
                id="lead-message"
                value={form.message}
                onChange={(e) => set("message", e.target.value)}
                placeholder="Vd: Em đang bán POD trên TikTok Shop, cần fulfill 200 đơn/ngày từ VN sang US…"
                rows={4}
                disabled={pending}
              />
            </div>

            <Button type="submit" disabled={pending} className="w-full">
              {pending ? "Đang gửi…" : "Gửi yêu cầu tư vấn"}
            </Button>

            <div className="text-[10px] text-center text-muted-foreground">
              Bằng cách submit, bạn đồng ý cho THG xử lý dữ liệu để liên hệ tư vấn.
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
