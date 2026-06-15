import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCRM } from '../../context/CRMContext';
import { 
  LayoutDashboard, 
  Users, 
  GitBranch, 
  Building2, 
  Calendar, 
  Contact, 
  BarChart3, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  PhoneCall
} from 'lucide-react';

export default function Sidebar({ collapsed, setCollapsed }) {
  const { agents } = useCRM();
  const location = useLocation();
  const navigate = useNavigate();

  const activeTab = location.pathname === '/' 
    ? 'dashboard' 
    : location.pathname.replace('/', '');

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'leads', label: 'Leads', icon: Users },
    { id: 'pipeline', label: 'Pipeline', icon: GitBranch },
    { id: 'properties', label: 'Properties', icon: Building2, badge: 'Coming' },
    { id: 'activities', label: 'Activities', icon: Calendar },
    { id: 'contacts', label: 'Contacts', icon: Contact },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const teamLead = agents.find(a => a.role === 'Team Lead') || agents[0];

  return (
    <aside 
      className={`fixed left-0 top-0 h-screen bg-[#08080d]/90 border-r border-r-neon/20 backdrop-blur-xl z-30 transition-all duration-300 flex flex-col justify-between
        ${collapsed ? 'w-20' : 'w-[260px]'}
      `}
      style={{
        borderLeft: '2px solid transparent',
        animation: 'neonPulse 3s infinite ease-in-out'
      }}
    >
      <div>
        {/* Logo Section */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-white/[0.04]">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center shadow-[0_0_15px_rgba(0,245,255,0.4)] shrink-0">
              <PhoneCall className="w-5 h-5 text-white animate-pulse" />
            </div>
            {!collapsed && (
              <span className="font-space font-bold text-lg tracking-wider bg-gradient-to-r from-neon-cyan to-white bg-clip-text text-transparent">
                CallLiveAI
              </span>
            )}
          </div>
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex p-1.5 rounded-lg border border-white/[0.08] hover:border-neon-cyan/50 text-slate-400 hover:text-white transition-all bg-white/[0.02]"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Team Lead Info */}
        <div className={`p-4 border-b border-white/[0.04] ${collapsed ? 'flex justify-center' : ''}`}>
          <div className={`flex items-center gap-3 bg-white/[0.02] p-2.5 rounded-xl border border-white/[0.04] overflow-hidden ${collapsed ? 'w-12 h-12 p-0 justify-center' : ''}`}>
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold font-sans select-none shrink-0"
              style={{
                background: 'linear-gradient(135deg, #00f5ff, #bf00ff)',
                fontSize: '14px',
                boxShadow: '0 0 12px rgba(0, 245, 255, 0.4)'
              }}
            >
              PS
            </div>
            {!collapsed && (
              <div className="overflow-hidden">
                <h4 className="font-space font-medium text-sm text-white truncate flex items-center gap-1.5">
                  Pintu Singha
                  <Sparkles className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400 animate-pulse" />
                </h4>
                <span className="inline-block mt-0.5 text-[10px] font-semibold tracking-wider text-neon-purple uppercase bg-neon-purple/10 px-2 py-0.5 rounded-full">
                  Team Lead
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1.5 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const isPlaceholder = ['properties', 'activities', 'contacts', 'reports', 'settings'].includes(item.id);

            return (
              <button
                key={item.id}
                onClick={() => {
                  if (isPlaceholder) {
                    alert(`${item.label} view is a demo placeholder. Access Dashboard, Leads, or Pipeline for full CRM capabilities.`);
                  } else {
                    navigate(item.id === 'dashboard' ? '/' : `/${item.id}`);
                  }
                }}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 group relative
                  ${isActive 
                    ? 'bg-gradient-to-r from-neon-cyan/10 to-transparent text-white border-l-2 border-neon-cyan shadow-[inset_4px_0_10px_rgba(0,245,255,0.08)]' 
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.02]'
                  }
                  ${collapsed ? 'justify-center px-0' : ''}
                `}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <Icon className={`w-5 h-5 shrink-0 transition-transform duration-300 group-hover:scale-110 
                    ${isActive ? 'text-neon-cyan' : 'text-slate-400 group-hover:text-neon-cyan'}
                  `} />
                  {!collapsed && <span className="font-medium text-sm truncate">{item.label}</span>}
                </div>

                {/* Badge for placeholders */}
                {!collapsed && item.badge && (
                  <span className="text-[9px] font-bold tracking-wider text-neon-cyan bg-neon-cyan/10 px-1.5 py-0.5 rounded uppercase">
                    {item.badge}
                  </span>
                )}

                {/* Hover Tooltip when Collapsed */}
                {collapsed && (
                  <div className="absolute left-20 bg-[#0a0a0f] border border-neon-cyan/30 text-white font-medium text-xs rounded-lg px-2.5 py-1.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-[0_0_15px_rgba(0,245,255,0.3)]">
                    {item.label} {item.badge && `(${item.badge})`}
                  </div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Online Team Members Section */}
      <div className={`p-4 border-t border-white/[0.04] bg-white/[0.01] ${collapsed ? 'flex flex-col items-center gap-3' : ''}`}>
        {!collapsed && (
          <h5 className="font-space font-semibold text-[10px] tracking-wider text-slate-500 uppercase mb-3 px-2">
            Active Agents ({agents.filter(a => a.online).length})
          </h5>
        )}
        <div className={`flex ${collapsed ? 'flex-col items-center gap-2' : 'items-center -space-x-2.5 px-2'}`}>
          {agents.map(agent => (
            <div 
              key={agent.id} 
              className="relative group cursor-pointer"
            >
              <img 
                src={agent.avatar} 
                alt={agent.name} 
                className={`w-8.5 h-8.5 rounded-full object-cover border-2 border-[#0a0a0f] hover:border-neon-cyan transition-all hover:-translate-y-1.5 duration-200`}
              />
              {agent.online && (
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#0a0a0f] rounded-full animate-pulse shadow-[0_0_8px_#10b981]" />
              )}
              
              {/* Agent Hover Tooltip */}
              <div className={`absolute bottom-full mb-2 bg-[#08080d] border border-white/[0.08] rounded-xl p-2.5 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 whitespace-nowrap
                ${collapsed ? 'left-12 bottom-0' : 'left-0'}
              `}>
                <p className="font-semibold text-xs text-white">{agent.name}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{agent.role}</p>
                <span className={`inline-flex items-center gap-1 mt-1 text-[9px] font-bold tracking-wider uppercase ${agent.online ? 'text-emerald-400' : 'text-slate-400'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${agent.online ? 'bg-emerald-400 animate-ping' : 'bg-slate-400'}`} />
                  {agent.online ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
