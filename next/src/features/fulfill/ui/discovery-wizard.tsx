"use client";

import { useState } from "react";
import { ArrowRight, ArrowLeft, Check } from "lucide-react";

export type DiscoveryData = {
  scale: string;
  category: string[];
  route: string[];
  pain: string[];
  timeline: string;
};

interface Props {
  onComplete: (data: DiscoveryData) => void;
  lang: string;
}

const STEPS = [
  {
    id: "scale",
    title: "Quy mô doanh nghiệp của bạn?",
    type: "single",
    options: ["< 100 đơn/ngày", "100 - 500 đơn/ngày", "500 - 1000 đơn/ngày", "> 1000 đơn/ngày"],
  },
  {
    id: "category",
    title: "Bạn đang bán (hoặc dự định bán) loại sản phẩm nào?",
    subtitle: "Chọn tất cả những gì phù hợp",
    type: "multi",
    options: ["Apparel (Áo thun, Hoodie...)", "Drinkware (Mug, Tumbler...)", "Accessories (Mũ, Túi...)", "Wall Art / Print", "Khác"],
  },
  {
    id: "route",
    title: "Tuyến đường (Thị trường) ưu tiên của bạn là gì?",
    subtitle: "Chọn tất cả những gì phù hợp",
    type: "multi",
    options: ["United States (Mỹ)", "UK & Châu Âu", "Worldwide"],
  },
  {
    id: "pain",
    title: "Vấn đề lớn nhất bạn đang gặp phải với Fulfillment hiện tại?",
    subtitle: "Chọn tất cả những gì phù hợp",
    type: "multi",
    options: ["Thời gian vận chuyển quá lâu", "Chất lượng in ấn/QC không ổn định", "Chi phí Fulfillment cao", "Support chậm, khó giải quyết issue", "Không đáp ứng được scale lớn"],
  },
  {
    id: "timeline",
    title: "Khi nào bạn sẵn sàng onboard hệ thống mới?",
    type: "single",
    options: ["Càng sớm càng tốt (ASAP)", "Trong vòng 1 - 3 tháng tới", "Chỉ đang tham khảo"],
  },
];

export function DiscoveryWizard({ onComplete, lang }: Readonly<Props>) {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<DiscoveryData>({
    scale: "",
    category: [],
    route: [],
    pain: [],
    timeline: "",
  });

  const stepDef = STEPS[currentStep];

  const handleSelect = (option: string) => {
    if (stepDef.type === "single") {
      setData((prev) => ({ ...prev, [stepDef.id]: option }));
      // Auto-advance for single select
      setTimeout(() => nextStep({ ...data, [stepDef.id]: option }), 300);
    } else {
      setData((prev) => {
        const list = prev[stepDef.id as keyof DiscoveryData] as string[];
        const isSelected = list.includes(option);
        const newList = isSelected ? list.filter((item) => item !== option) : [...list, option];
        return { ...prev, [stepDef.id]: newList };
      });
    }
  };

  const nextStep = (latestData = data) => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((c) => c + 1);
    } else {
      onComplete(latestData);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep((c) => c - 1);
  };

  const currentSelection = data[stepDef.id as keyof DiscoveryData];
  const canProceed = Array.isArray(currentSelection) ? currentSelection.length > 0 : !!currentSelection;

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-thg-border rounded-full overflow-hidden mb-8">
        <div
          className="h-full bg-thg-gold transition-all duration-500 ease-out"
          style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
        />
      </div>

      <div className="flex-1 flex flex-col justify-center">
        <h2 className="text-2xl md:text-3xl font-sans tracking-tight font-bold text-thg-textMain mb-2">
          {stepDef.title}
        </h2>
        {stepDef.subtitle && (
          <p className="text-sm font-mono text-thg-textMuted mb-6 uppercase tracking-widest">
            {stepDef.subtitle}
          </p>
        )}
        {!stepDef.subtitle && <div className="h-6 mb-2" />}

        <div className="grid gap-3 mt-4">
          {stepDef.options.map((option) => {
            const isSelected = Array.isArray(currentSelection)
              ? currentSelection.includes(option)
              : currentSelection === option;

            return (
              <button
                key={option}
                onClick={() => handleSelect(option)}
                className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 text-left ${
                  isSelected
                    ? "border-yellow-300 bg-thg-goldBg text-thg-gold shadow-sm"
                    : "border-thg-border bg-white text-thg-textMain hover:border-thg-borderHover hover:bg-slate-50"
                }`}
              >
                <span className="font-medium">{option}</span>
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                    isSelected ? "border-thg-gold bg-thg-gold text-white" : "border-thg-border bg-thg-bg"
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3" strokeWidth={3} />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between mt-12 pt-6 border-t border-thg-border">
        <button
          onClick={prevStep}
          disabled={currentStep === 0}
          className={`inline-flex items-center gap-2 text-sm font-mono uppercase tracking-widest transition-colors ${
            currentStep === 0 ? "text-thg-textMuted/30 cursor-not-allowed" : "text-thg-textMuted hover:text-thg-textMain"
          }`}
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {stepDef.type === "multi" && (
          <button
            onClick={() => nextStep()}
            disabled={!canProceed}
            className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
              canProceed
                ? "bg-thg-gold text-white shadow-sm hover:shadow-md hover:scale-105"
                : "bg-thg-surfaceSubtle border border-thg-border text-slate-400 cursor-not-allowed"
            }`}
          >
            Tiếp tục <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
