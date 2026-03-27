import { usePricingStore } from "@/stores/usePricingStore";

interface Tab {
  id: string;
  icon: string;
  label: string;
}

const tabs: Tab[] = [
  { id: "vn", icon: "🇻🇳", label: "Từ Việt Nam" },
  { id: "cn", icon: "🇨🇳", label: "Từ China" },
  { id: "tiktok", icon: "🎵", label: "Line TikTok" },
  { id: "lo", icon: "📦", label: "Hàng Lô" },
  { id: "usps", icon: "✉️", label: "Priority USPS" },
];

const TabNavigation = () => {
  const store = usePricingStore();

  return (
    <div className="flex overflow-x-auto border-b-2 border-border glass-card sticky top-16 lg:top-20 z-40 rounded-none">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => store.setActiveTab(tab.id)}
          className={`px-6 py-4 text-sm font-bold uppercase tracking-wide transition-colors border-b-2 -mb-[2px] whitespace-nowrap ${
            store.activeMainTab === tab.id
              ? "text-primary border-primary bg-primary/5"
              : "text-muted-foreground border-transparent hover:text-primary"
          }`}
        >
          {tab.icon} {tab.label}
        </button>
      ))}
    </div>
  );
};

export default TabNavigation;
