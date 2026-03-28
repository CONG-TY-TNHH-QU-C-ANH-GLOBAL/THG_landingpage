import { usePricingStore } from "@/stores/usePricingStore";

const TikTokTabIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="inline w-4 h-4 align-middle mr-0.5">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34l.04-8.55a8.18 8.18 0 0 0 4.77 1.52V6.25a4.85 4.85 0 0 1-1.04-.56Z" />
  </svg>
);

interface Tab {
  id: string;
  icon: string;
  label: string;
}

const tabs: Tab[] = [
  { id: "vn", icon: "🇻🇳", label: "Từ Việt Nam" },
  { id: "cn", icon: "🇨🇳", label: "Từ China" },
  { id: "tiktok", icon: "tiktok", label: "Line TikTok" },
  { id: "lo", icon: "📦", label: "Hàng Lô" },
  { id: "usps", icon: "✉️", label: "Priority USPS" },
  { id: "extras", icon: "📝", label: "Phụ Phí & Khác" }
];

const TabNavigation = () => {
  const store = usePricingStore();

  return (
    <div className="flex overflow-x-auto border-b-2 border-border glass-card sticky top-16 lg:top-20 z-40 rounded-none">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => {
            store.setActiveTab(tab.id);
            if (tab.id === "vn" || tab.id === "cn") {
              store.setOrigin(tab.id as "vn" | "cn");
            }
          }}
          className={`px-6 py-4 text-sm font-bold uppercase tracking-wide transition-colors border-b-2 -mb-[2px] whitespace-nowrap ${store.activeMainTab === tab.id
            ? "text-primary border-primary bg-primary/5"
            : "text-muted-foreground border-transparent hover:text-primary"
            }`}
        >
          {tab.icon === "tiktok" ? <TikTokTabIcon /> : `${tab.icon} `}{tab.label}
        </button>
      ))}
    </div>
  );
};

export default TabNavigation;
