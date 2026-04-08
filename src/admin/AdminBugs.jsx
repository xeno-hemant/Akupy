import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bug, Filter, CheckCircle2, AlertTriangle, AlertCircle, RefreshCw, XCircle, Bot, Code, LogOut } from 'lucide-react';
import api from '../utils/apiHelper';
import API from '../config/apiRoutes';

const STATUS_COLORS = {
  pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  verified: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  invalid: 'bg-red-500/10 text-red-500 border-red-500/20',
  fixed: 'bg-green-500/10 text-green-500 border-green-500/20',
  'auto-fixed': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
};

const SEVERITY_COLORS = {
  low: 'text-gray-400',
  medium: 'text-yellow-500',
  high: 'text-red-500',
  unknown: 'text-gray-500',
};

export default function AdminBugs() {
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
    } else {
      fetchBugs();
    }
  }, [navigate]);

  const fetchBugs = async () => {
    setLoading(true);
    try {
      const res = await api.get(API.ADMIN_BUGS);
      setBugs(res.data.bugs || []);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.patch(API.ADMIN_BUG_STATUS(id), { status });
      fetchBugs();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const handleCopyPrompt = (bug) => {
    const prompt = `Please fix this bug in the codebase.\n\nBug Title: ${bug.title}\nDescription: ${bug.description}\nPage: ${bug.pageUrl}\nAI Analysis: ${bug.aiAnalysis}\n\nSearch for the relevant files and implement the best fix. Make sure not to break existing features.`;
    navigator.clipboard.writeText(prompt);
    alert('Antigravity Prompt Copied to Clipboard!');
  };

  const filteredBugs = filter === 'all' ? bugs : bugs.filter(b => b.status === filter);

  const stats = {
    total: bugs.length,
    pending: bugs.filter(b => b.status === 'pending').length,
    verified: bugs.filter(b => b.status === 'verified').length,
    fixed: bugs.filter(b => b.status === 'fixed' || b.status === 'auto-fixed').length,
    autoFixed: bugs.filter(b => b.status === 'auto-fixed').length,
  };

  if (loading && bugs.length === 0) return <div className="min-h-screen flex items-center justify-center bg-[#0F172A] text-white">Loading Admin...</div>;

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ background: '#0F172A', color: '#F8FAFC' }}>
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg border border-white/10" style={{ background: '#1E293B', boxShadow: '0 4px 15px rgba(0,0,0,0.5)' }}>
            <Bug className="w-6 h-6 text-green-500" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white">Bug Tracking Center</h1>
            <p className="text-sm font-medium text-slate-400">Manage, verify, and resolve issues.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchBugs} className="p-2.5 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition">
            <RefreshCw className="w-5 h-5" />
          </button>
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 font-bold text-sm bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </div>

      {/* Stats Strip */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {[
          { label: 'Total Bugs', val: stats.total, icon: Bug, color: 'text-slate-300' },
          { label: 'Pending', val: stats.pending, icon: AlertCircle, color: 'text-yellow-500' },
          { label: 'Verified', val: stats.verified, icon: AlertTriangle, color: 'text-blue-500' },
          { label: 'Manual Fixed', val: stats.fixed - stats.autoFixed, icon: CheckCircle2, color: 'text-green-500' },
          { label: 'Auto-Fixed', val: stats.autoFixed, icon: Bot, color: 'text-purple-400' },
        ].map((s, i) => (
          <div key={i} className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700 hidden-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase text-slate-400 mb-1">{s.label}</p>
                <h3 className="text-2xl font-black">{s.val}</h3>
              </div>
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4 bg-slate-800/50 p-2 rounded-xl border border-slate-700">
        <div className="flex items-center gap-2 px-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-sm font-bold text-slate-300">Filter:</span>
        </div>
        <div className="flex gap-1 overflow-x-auto hide-scrollbar">
          {['all', 'pending', 'verified', 'invalid', 'fixed', 'auto-fixed'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition ${filter === f ? 'bg-slate-600 text-white shadow-sm' : 'text-slate-400 hover:bg-slate-700'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table Area */}
      <div className="bg-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/80">
                <th className="p-4 text-xs font-bold uppercase text-slate-400 border-b border-slate-700">Issue</th>
                <th className="p-4 text-xs font-bold uppercase text-slate-400 border-b border-slate-700">Info</th>
                <th className="p-4 text-xs font-bold uppercase text-slate-400 border-b border-slate-700">Status</th>
                <th className="p-4 text-xs font-bold uppercase text-slate-400 border-b border-slate-700">AI Context</th>
                <th className="p-4 text-xs font-bold uppercase text-slate-400 border-b border-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBugs.length > 0 ? filteredBugs.map(b => (
                <tr key={b._id} className="border-b border-slate-700/50 hover:bg-slate-800/80 transition group">
                  <td className="p-4 max-w-[250px]">
                    <div className="font-bold text-sm text-slate-100 flex items-center gap-2">
                       {b.title}
                       <span className={`text-[10px] uppercase font-black px-1.5 py-0.5 rounded-sm bg-slate-900 border border-slate-700 ${SEVERITY_COLORS[b.severity]}`}>
                         {b.severity}
                       </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2" title={b.description}>{b.description}</p>
                    <a href={b.pageUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-400 hover:underline mt-1 inline-flex items-center gap-1">
                       <Code className="w-3 h-3" /> Page Link
                    </a>
                  </td>
                  <td className="p-4">
                    <p className="text-xs font-medium text-slate-300">UID: <span className="text-slate-500 font-mono">{b.userId}</span></p>
                    <p className="text-xs font-medium text-slate-300 mt-1">Env: <span className="text-slate-500">{b.browser} • {b.device}</span></p>
                    <p className="text-[10px] text-slate-500 mt-1">{new Date(b.createdAt).toLocaleString()}</p>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 flex w-max items-center gap-1.5 rounded-full text-xs font-bold border ${STATUS_COLORS[b.status] || STATUS_COLORS.pending}`}>
                      {b.status === 'auto-fixed' ? <Bot className="w-3.5 h-3.5" /> : null}
                      {b.status.toUpperCase()}
                    </span>
                    {b.status === 'auto-fixed' && b.autoFixResult && (
                      <p className="text-[10px] text-purple-400/80 mt-2 max-w-[150px] leading-tight font-mono whitespace-nowrap overflow-hidden text-ellipsis bg-purple-500/10 p-1 rounded" title={b.autoFixResult}>
                        {b.autoFixResult}
                      </p>
                    )}
                  </td>
                  <td className="p-4 max-w-[200px]">
                     {b.aiAnalysis ? (
                       <p className="text-xs text-slate-400 bg-slate-900/50 p-2 rounded-lg line-clamp-3" title={b.aiAnalysis}>
                         {b.aiAnalysis}
                       </p>
                     ) : (
                       <p className="text-xs text-slate-600 italic">No AI Analysis</p>
                     )}
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-2 w-max">
                      {b.status === 'verified' && (
                        <>
                           <button onClick={() => updateStatus(b._id, 'fixed')} className="text-[11px] font-bold px-3 py-1.5 bg-green-500/10 text-green-500 border border-green-500/20 rounded-md hover:bg-green-500/20 transition flex items-center gap-1.5">
                             <CheckCircle2 className="w-3.5 h-3.5" /> Mark Fixed
                           </button>
                           <button onClick={() => handleCopyPrompt(b)} className="text-[11px] font-bold px-3 py-1.5 bg-slate-700 text-slate-200 border border-slate-600 rounded-md hover:bg-slate-600 transition flex items-center gap-1.5">
                             <Bot className="w-3.5 h-3.5" /> Generate Prompt
                           </button>
                        </>
                      )}
                      
                      {b.status === 'pending' && (
                         <div className="flex items-center gap-2">
                           <button onClick={() => updateStatus(b._id, 'verified')} className="text-slate-400 hover:text-green-500 transition"><CheckCircle2 className="w-5 h-5" /></button>
                           <button onClick={() => updateStatus(b._id, 'invalid')} className="text-slate-400 hover:text-red-500 transition"><XCircle className="w-5 h-5" /></button>
                         </div>
                      )}
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-500 font-medium">No bugs match filter: {filter}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
