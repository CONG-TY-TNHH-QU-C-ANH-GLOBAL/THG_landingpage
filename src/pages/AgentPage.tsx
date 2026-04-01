import React, { useState, useEffect } from 'react';
import {
    collection, query, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import {
    app, auth, db, loginWithGoogle, logout
} from '@/lib/firebase';
import {
    PenTool, Image as ImageIcon, History, Send, Sparkles, Download,
    Copy, LayoutDashboard, CheckCircle2, Loader2, Truck, Package,
    Globe, FileText, Video, Facebook, Instagram, Trash2, Mail,
    LogOut, Settings, Search, Bell
} from 'lucide-react';

const appId = 'thg-fulfill-production';
const OPENAI_KEY = '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';

const taskOptions = [
    { id: "blog", label: "Bài Blog SEO", icon: PenTool },
    { id: "email", label: "Email Sales", icon: Mail },
    { id: "report", label: "Báo cáo Logistics", icon: FileText },
    { id: "tiktok", label: "Caption TikTok", icon: Video },
    { id: "facebook", label: "Bài Facebook", icon: Facebook },
    { id: "instagram", label: "Caption IG", icon: Instagram },
];

export default function AgentPage() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [isAuthReady, setIsAuthReady] = useState(false);
    const [history, setHistory] = useState<any[]>([]);
    const [isActionLoading, setIsActionLoading] = useState(false);
    const [errMsg, setErrMsg] = useState('');

    // States cho Content
    const [topic, setTopic] = useState('');
    const [taskType, setTaskType] = useState('blog');
    const [writerResult, setWriterResult] = useState('');

    // States cho Design
    const [designPrompt, setDesignPrompt] = useState('');
    const [designResult, setDesignResult] = useState<string | null>(null);

    // 1. Khởi tạo Auth
    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUser(user);
                setUserId(user.uid);
            } else {
                setCurrentUser(null);
                setUserId(null);
            }
            setIsAuthReady(true);
        });
        return () => unsub();
    }, []);

    // 2. Đăng nhập / Đăng xuất
    const handleLogin = async () => {
        try { await loginWithGoogle(); }
        catch (error: any) {
            console.error("Lỗi đăng nhập:", error);
            alert(`Lỗi đăng nhập Google: ${error.message || "Hãy mở Console (F12) để xem chi tiết"}`);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            setActiveTab('dashboard');
        } catch (error) { console.error("Lỗi đăng xuất:", error); }
    };

    // 3. Lắng nghe dữ liệu thời gian thực
    useEffect(() => {
        if (!isAuthReady || !userId) return;
        const q = query(collection(db, 'artifacts', appId, 'users', userId, 'thg_work_history'));
        const unsubscribe = onSnapshot(q, (snap) => {
            const data = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
            setHistory(data.sort((a, b) => {
                const t1 = a.createdAt?.seconds || 0;
                const t2 = b.createdAt?.seconds || 0;
                return t2 - t1;
            }));
        });
        return () => unsubscribe();
    }, [isAuthReady, userId]);

    // 4. Công cụ Viết AI (OpenAI GPT-4o-mini)
    const generateContent = async () => {
        if (!topic) return;
        setIsActionLoading(true);
        setWriterResult('');
        setErrMsg('');

        try {
            const systemPrompt = "Bạn là chuyên gia Content Marketing tại THG Fulfill. Chuyên sâu về: Fulfillment, Vận chuyển Việt-Trung, Kho bãi, Thủ tục hải quan. Hãy viết nội dung chuyên nghiệp, chuẩn xác và thu hút khách hàng B2B.";

            const typeMap: Record<string, string> = {
                blog: "Bài Blog SEO dài 1000 chữ",
                email: "Email Sales chào hàng trực tiếp",
                report: "Báo cáo phân tích thị trường Logistics",
                tiktok: "Kịch bản viral kèm Caption TikTok",
                facebook: "Bài đăng Fanpage tương tác cao",
                instagram: "Caption Instagram tinh tế"
            };

            const userPrompt = `Yêu cầu: Viết ${typeMap[taskType] || typeMap.blog}. \nChủ đề: ${topic}. \nNgôn ngữ: Tiếng Việt.`;

            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${OPENAI_KEY}`,
                },
                body: JSON.stringify({
                    model: 'gpt-4o-mini',
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: userPrompt },
                    ],
                }),
            });

            const data = await response.json();
            const content = data.choices?.[0]?.message?.content ?? '';

            if (content) {
                setWriterResult(content);
                if (userId) {
                    await addDoc(collection(db, 'artifacts', appId, 'users', userId, 'thg_work_history'), {
                        type: 'content', subType: taskType, title: topic, content, createdAt: serverTimestamp()
                    });
                }
            } else {
                const errDetail = data.error?.message || 'OpenAI không trả về kết quả.';
                setErrMsg(errDetail);
            }
        } catch (e: any) { setErrMsg(e.message || 'Lỗi kết nối OpenAI'); }
        finally { setIsActionLoading(false); }
    };

    // 5. Công cụ Thiết kế AI (DALL-E 3)
    const generateDesign = async () => {
        if (!designPrompt) return;
        setIsActionLoading(true);
        setDesignResult(null);
        setErrMsg('');

        try {
            const fullPrompt = `Ultra-modern logistics center for THG Fulfill, professional commercial photography, high-end branding, ${designPrompt}.`;

            const response = await fetch('https://api.openai.com/v1/images/generations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${OPENAI_KEY}`,
                },
                body: JSON.stringify({
                    model: 'dall-e-3',
                    prompt: fullPrompt,
                    n: 1,
                    size: '1792x1024',
                    response_format: 'url',
                }),
            });

            const data = await response.json();
            const url = data.data?.[0]?.url;

            if (url) {
                setDesignResult(url);
                if (userId) {
                    await addDoc(collection(db, 'artifacts', appId, 'users', userId, 'thg_work_history'), {
                        type: 'design', title: designPrompt, imageUrl: url, createdAt: serverTimestamp()
                    });
                }
            } else {
                const errDetail = data.error?.message || 'DALL-E không trả về kết quả.';
                setErrMsg(errDetail);
            }
        } catch (e: any) { setErrMsg(e.message || 'Lỗi kết nối DALL-E'); }
        finally { setIsActionLoading(false); }
    };

    const deleteItem = async (id: string) => {
        if (!userId) return;
        try {
            await deleteDoc(doc(db, 'artifacts', appId, 'users', userId, 'thg_work_history', id));
        } catch (e) { console.error(e); }
    };

    const copy = (txt: string) => {
        navigator.clipboard.writeText(txt);
    };

    // --- UI Components ---
    if (!currentUser && isAuthReady) {
        return (
            <div className="min-h-screen bg-white flex font-sans overflow-hidden">
                {/* Left Side: Visual */}
                <div className="hidden lg:flex w-1/2 bg-blue-600 relative p-16 flex-col justify-between">
                    <div className="flex items-center gap-4">
                        <div className="bg-white p-3 rounded-2xl shadow-xl">
                            <Truck className="text-blue-600 w-8 h-8" />
                        </div>
                        <h2 className="text-white text-2xl font-black">THG Fulfill</h2>
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-5xl font-black text-white leading-tight mb-6">Tương lai của Logistics là Trí tuệ Nhân tạo.</h3>
                        <p className="text-blue-100 text-lg max-w-md">Nền tảng AI tích hợp dành cho đội ngũ vận hành chuỗi cung ứng thông minh của THG.</p>
                    </div>
                    <div className="flex gap-8">
                        <div className="text-white/60 font-bold text-xs uppercase tracking-widest">Global Shipping</div>
                        <div className="text-white/60 font-bold text-xs uppercase tracking-widest">Smart Warehousing</div>
                        <div className="text-white/60 font-bold text-xs uppercase tracking-widest">AI Marketing</div>
                    </div>
                    <Sparkles className="absolute right-0 bottom-0 w-[80%] h-[80%] text-white/5" />
                </div>

                {/* Right Side: Login */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#F8FAFC]">
                    <div className="max-w-md w-full animate-in fade-in slide-in-from-right-8 duration-700">
                        <div className="lg:hidden flex items-center gap-3 mb-10">
                            <Truck className="text-blue-600 w-8 h-8" />
                            <h2 className="text-2xl font-black">THG Fulfill</h2>
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter">Hệ thống AI Agent</h1>
                        <p className="text-slate-500 mb-12 font-medium">Đăng nhập bằng tài khoản Gmail công ty để bắt đầu công việc.</p>

                        <button
                            onClick={handleLogin}
                            className="w-full group bg-white border-2 border-slate-200 hover:border-blue-600 py-5 rounded-[1.5rem] flex items-center justify-center gap-4 transition-all hover:shadow-xl hover:shadow-blue-50 active:scale-[0.98]"
                        >
                            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/action/google.svg" className="w-6 h-6 group-hover:scale-110 transition-transform" alt="Google" />
                            <span className="font-bold text-slate-700">Tiếp tục với Google Workspace</span>
                        </button>

                        <div className="mt-12 p-6 bg-blue-50 rounded-3xl border border-blue-100">
                            <div className="flex gap-4">
                                <CheckCircle2 className="text-blue-600 shrink-0" size={24} />
                                <p className="text-xs text-blue-900 leading-relaxed">Dữ liệu được mã hóa và bảo vệ theo tiêu chuẩn của THG Logistics Group. Chỉ nhân viên được ủy quyền mới có thể truy cập.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!isAuthReady) {
        return (
            <div className="h-screen bg-white flex items-center justify-center">
                <div className="flex flex-col items-center gap-6">
                    <Loader2 className="animate-spin text-blue-600" size={50} />
                    <p className="text-xs font-black text-slate-300 uppercase tracking-[0.4em]">Initializing Core System</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-[#F1F5F9] text-slate-900 font-sans overflow-hidden text-left">
            {/* Sidebar - Desktop Only */}
            <aside className="w-80 bg-slate-900 text-white flex flex-col p-8 z-20">
                <div className="flex items-center gap-4 mb-16">
                    <div className="bg-blue-600 p-2 rounded-xl">
                        <Truck className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="font-black text-xl leading-none">THG Fulfill</h1>
                        <span className="text-[10px] font-bold text-blue-400 tracking-widest uppercase">Admin Agent</span>
                    </div>
                </div>

                <nav className="space-y-2 flex-1">
                    <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all ${activeTab === 'dashboard' ? 'bg-blue-600 shadow-lg shadow-blue-900/50 font-bold' : 'text-slate-400 hover:bg-white/5'}`}>
                        <LayoutDashboard size={20} /> Tổng quan
                    </button>
                    <button onClick={() => setActiveTab('writer')} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all ${activeTab === 'writer' ? 'bg-blue-600 shadow-lg shadow-blue-900/50 font-bold' : 'text-slate-400 hover:bg-white/5'}`}>
                        <PenTool size={20} /> AI Writer
                    </button>
                    <button onClick={() => setActiveTab('designer')} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all ${activeTab === 'designer' ? 'bg-blue-600 shadow-lg shadow-blue-900/50 font-bold' : 'text-slate-400 hover:bg-white/5'}`}>
                        <ImageIcon size={20} /> AI Designer
                    </button>
                    <button onClick={() => setActiveTab('history')} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all ${activeTab === 'history' ? 'bg-blue-600 shadow-lg shadow-blue-900/50 font-bold' : 'text-slate-400 hover:bg-white/5'}`}>
                        <History size={20} /> Kho lưu trữ
                    </button>
                </nav>

                <div className="bg-white/5 rounded-3xl p-5 border border-white/10 mt-auto">
                    <div className="flex items-center gap-3 mb-4">
                        <img src={currentUser?.photoURL || ''} className="w-10 h-10 rounded-full border-2 border-blue-500" alt="Avatar" />
                        <div className="overflow-hidden">
                            <p className="text-xs font-black truncate">{currentUser?.displayName}</p>
                            <p className="text-[10px] text-slate-500 truncate">{currentUser?.email}</p>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 py-3 bg-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-red-500 hover:text-white transition-all">
                        <LogOut size={14} /> Đăng xuất
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto p-12 relative">
                {/* Header Bar */}
                <div className="flex items-center justify-between mb-16">
                    <div className="relative w-96 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                        <input type="text" placeholder="Tìm kiếm tác vụ..." className="w-full bg-white border-none rounded-2xl py-4 pl-12 pr-6 shadow-sm focus:ring-2 focus:ring-blue-600 outline-none font-medium transition-all" />
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="p-4 bg-white rounded-2xl shadow-sm text-slate-400 hover:text-blue-600 transition-all"><Bell size={20} /></button>
                        <button className="p-4 bg-white rounded-2xl shadow-sm text-slate-400 hover:text-blue-600 transition-all"><Settings size={20} /></button>
                    </div>
                </div>

                {activeTab === 'dashboard' && (
                    <div className="max-w-6xl mx-auto animate-in fade-in duration-700">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col justify-between h-48 hover:shadow-2xl transition-all">
                                <Globe className="text-blue-600" size={32} />
                                <div>
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Vận chuyển chính</h4>
                                    <p className="text-2xl font-black">Việt - Trung Quốc</p>
                                </div>
                            </div>
                            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col justify-between h-48 hover:shadow-2xl transition-all">
                                <FileText className="text-orange-500" size={32} />
                                <div>
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tổng tác vụ</h4>
                                    <p className="text-2xl font-black">{history.length} <span className="text-sm font-bold text-slate-300">File</span></p>
                                </div>
                            </div>
                            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col justify-between h-48 hover:shadow-2xl transition-all">
                                <Package className="text-purple-500" size={32} />
                                <div>
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Fulfillment</h4>
                                    <p className="text-2xl font-black">AI Optimized</p>
                                </div>
                            </div>
                            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col justify-between h-48 hover:shadow-2xl transition-all">
                                <CheckCircle2 className="text-green-500" size={32} />
                                <div>
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Trạng thái</h4>
                                    <p className="text-2xl font-black">Live & Secure</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-blue-600 rounded-[3.5rem] p-16 text-white relative overflow-hidden shadow-2xl shadow-blue-200">
                            <div className="relative z-10 max-w-2xl">
                                <h3 className="text-5xl font-black mb-6 tracking-tighter leading-tight">Nâng tầm quản vận hành với Agent AI.</h3>
                                <p className="text-blue-100 text-lg mb-10 font-medium">Bắt đầu bằng cách chọn một công cụ từ thanh điều hướng hoặc sử dụng phím tắt nhanh.</p>
                                <div className="flex flex-wrap gap-4">
                                    <button onClick={() => { setTaskType('blog'); setActiveTab('writer') }} className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-black text-sm shadow-xl hover:scale-105 transition-all">Tạo bài Blog mới</button>
                                    <button onClick={() => { setActiveTab('designer') }} className="bg-blue-700 text-white border border-blue-400/30 px-8 py-4 rounded-2xl font-black text-sm hover:bg-blue-800 transition-all">Thiết kế Banner</button>
                                </div>
                            </div>
                            <Sparkles className="absolute right-[-60px] top-[-60px] w-96 h-96 text-white/10" />
                        </div>
                    </div>
                )}

                {activeTab === 'writer' && (
                    <div className="max-w-4xl mx-auto animate-in slide-in-from-bottom-8 duration-700 pb-20">
                        <div className="bg-white rounded-[3.5rem] p-16 shadow-sm border border-slate-100">
                            <div className="flex items-center gap-6 mb-16">
                                <div className="bg-blue-100 p-5 rounded-[1.5rem]">
                                    <PenTool className="text-blue-600" size={40} />
                                </div>
                                <div>
                                    <h3 className="text-3xl font-black tracking-tight">AI Content Logistics</h3>
                                    <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-1">THG Fulfill Marketing Hub</p>
                                </div>
                            </div>

                            <div className="space-y-12">
                                <div>
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-6 block">Chọn định dạng đầu ra</label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {taskOptions.map(opt => {
                                            const Icon = opt.icon;
                                            return (
                                                <button key={opt.id} onClick={() => setTaskType(opt.id)} className={`flex items-center gap-3 p-5 rounded-2xl border-2 transition-all font-black text-xs ${taskType === opt.id ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-50 text-slate-500 hover:border-slate-200'}`}>
                                                    <Icon size={18} /> {opt.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-6 block">Yêu cầu nội dung cụ thể</label>
                                    <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="VD: Phân tích tuyến vận chuyển Bằng Tường - Hà Nội..." className="w-full bg-slate-50 border-none rounded-2xl py-6 px-8 text-xl font-bold focus:ring-2 focus:ring-blue-600 outline-none shadow-inner" />
                                </div>

                                <button
                                    onClick={generateContent}
                                    disabled={isActionLoading || !topic}
                                    className="w-full bg-slate-900 text-white font-black py-6 rounded-2xl flex items-center justify-center gap-4 disabled:opacity-30 shadow-2xl transition-all active:scale-[0.98]"
                                >
                                    {isActionLoading ? <Loader2 className="animate-spin" /> : <Send size={24} />}
                                    Tạo nội dung AI ngay
                                </button>
                            </div>

                            {writerResult && (
                                <div className="mt-16 bg-slate-50 rounded-[2.5rem] p-12 border border-slate-200 relative group animate-in fade-in duration-1000">
                                    <button onClick={() => copy(writerResult)} className="absolute top-8 right-8 bg-white p-4 rounded-2xl shadow-md text-blue-600 hover:bg-blue-600 hover:text-white transition-all transform hover:rotate-6"><Copy size={24} /></button>
                                    <div className="prose prose-slate max-w-none whitespace-pre-wrap leading-relaxed text-slate-700 font-bold text-lg">
                                        {writerResult}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'designer' && (
                    <div className="max-w-4xl mx-auto animate-in slide-in-from-bottom-8 duration-700 pb-20">
                        <div className="bg-white rounded-[3.5rem] p-16 shadow-sm border border-slate-100">
                            <div className="flex items-center gap-6 mb-16">
                                <div className="bg-purple-100 p-5 rounded-[1.5rem]">
                                    <ImageIcon className="text-purple-600" size={40} />
                                </div>
                                <div>
                                    <h3 className="text-3xl font-black tracking-tight">AI Designer Hub</h3>
                                    <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-1">Branded Content Engine</p>
                                </div>
                            </div>

                            <div className="mb-12">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-6 block">Mô tả ý tưởng thiết kế</label>
                                <textarea value={designPrompt} onChange={(e) => setDesignPrompt(e.target.value)} rows={4} placeholder="VD: Banner ngày lễ 8/3 với hình ảnh xe tải THG và hoa, phong cách trang nhã chuyên nghiệp..." className="w-full bg-slate-50 border-none rounded-[2.5rem] py-8 px-10 text-xl font-bold focus:ring-2 focus:ring-blue-600 outline-none shadow-inner resize-none transition-all" />
                            </div>

                            <button onClick={generateDesign} disabled={isActionLoading || !designPrompt} className="w-full bg-blue-600 text-white font-black py-6 rounded-2xl flex items-center justify-center gap-4 disabled:opacity-30 shadow-2xl transition-all active:scale-[0.98]">
                                {isActionLoading ? <Loader2 className="animate-spin" /> : <Sparkles size={24} />}
                                Thiết kế Banner 4K
                            </button>

                            {designResult && (
                                <div className="mt-16 flex flex-col items-center group animate-in zoom-in-95 duration-700">
                                    <div className="relative rounded-[3.5rem] overflow-hidden shadow-2xl border-[20px] border-white w-full">
                                        <img src={designResult} alt="AI Banner" className="w-full" />
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <a href={designResult} download="thg_fulfill_design.jpeg" className="bg-white text-blue-600 p-6 rounded-full shadow-2xl hover:scale-110 transition-transform">
                                                <Download size={40} />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'history' && (
                    <div className="max-w-6xl mx-auto animate-in fade-in duration-500 pb-20">
                        <div className="flex items-center justify-between mb-16">
                            <h2 className="text-4xl font-black tracking-tight">Thư viện tác vụ của bạn</h2>
                            <div className="px-6 py-2.5 bg-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm border border-slate-100">
                                Tổng lưu trữ: {history.length}
                            </div>
                        </div>

                        {history.length === 0 ? (
                            <div className="text-center py-48 bg-white rounded-[4rem] border border-dashed border-slate-200">
                                <History className="mx-auto text-slate-100 mb-8" size={100} />
                                <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-xs">Chưa có bản ghi nào được lưu</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {history.map(item => (
                                    <div key={item.id} className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100 hover:shadow-2xl transition-all group relative">
                                        <div className="flex justify-between items-start mb-8">
                                            <div className={`p-4 rounded-2xl ${item.type === 'content' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                                                {item.type === 'content' ? <PenTool size={20} /> : <ImageIcon size={20} />}
                                            </div>
                                            <button onClick={() => deleteItem(item.id)} className="p-3 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"><Trash2 size={16} /></button>
                                        </div>

                                        <h4 className="font-black text-slate-800 mb-4 text-lg line-clamp-1">{item.title}</h4>

                                        <div className="mb-8 rounded-2xl overflow-hidden h-40 bg-slate-50 border border-slate-100">
                                            {item.type === 'content' ? (
                                                <p className="text-xs text-slate-500 p-5 line-clamp-6 font-bold leading-relaxed">{item.content}</p>
                                            ) : (
                                                <img src={item.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                                            )}
                                        </div>

                                        <div className="flex gap-3">
                                            <button onClick={() => item.type === 'content' ? copy(item.content) : window.open(item.imageUrl)} className="flex-1 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg shadow-slate-200">
                                                {item.type === 'content' ? 'Sao chép' : 'Tải về'}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
