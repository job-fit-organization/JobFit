import { IconName } from '@/app/learning/data/icon'
import { Lock } from 'lucide-react';

// 칭호 카드 컴포넌트
export default function TitleCard({ title, label, icon, isOwned, isActive, onEquip, renderIcon }: { title: string, label: string, icon: IconName, isOwned: boolean, isActive: boolean, onEquip: () => void, renderIcon: (iconName: IconName, className?: string) => React.ReactNode }) {
    return (
        <div className={`p-8 rounded-[2.5rem] border transition-all flex items-center justify-between relative overflow-hidden group ${isOwned ? (isActive ? 'bg-indigo-500/10 border-indigo-500/50' : 'bg-slate-800/30 border-white/5 hover:border-indigo-500/30') : 'bg-slate-900/50 border-transparent opacity-60'}`}>
            {!isOwned && <div className="absolute inset-0 z-10 bg-black/40 backdrop-blur-[1px] flex items-center justify-center"><Lock className="w-6 h-6 text-slate-700" /></div>}
            <div className="flex items-center gap-5">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${isOwned ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-800 text-slate-700'}`}>
                    <div className="w-6 h-6">
                        {renderIcon(icon)}
                    </div>
                </div>
                <div>
                    <h4 className={`font-black text-lg ${isOwned ? 'text-white' : 'text-slate-600'}`}>&quot;{title}&quot;</h4>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{label} Reward</p>
                </div>
            </div>
            {isOwned && (
                <button onClick={onEquip} disabled={isActive} className={`px-5 py-2 rounded-xl text-[10px] font-black transition-all ${isActive ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-400 hover:bg-slate-600 hover:text-white'}`}>
                    {isActive ? 'EQUIPPED' : 'EQUIP'}
                </button>
            )}
        </div>
    );
}