import React, { useState, useEffect, useCallback } from 'react';
import {
  Users,
  Search,
  Filter,
  Phone,
  Mail,
  Download,
  LogOut,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Target,
  Clock,
  Eye,
  UserPlus,
} from 'lucide-react';
import { Lead, LeadStatus, DashboardMetrics, FitnessGoal } from '../../types';
import { fetchLeads, updateLeadStatus, fetchMetrics, submitLead } from '../../lib/api';
import { LeadDetailsModal } from './LeadDetailsModal';
import { SupabaseSetupHelper } from './SupabaseSetupHelper';
import { EmailNotificationManager } from './EmailNotificationManager';
import { BUSINESS_INFO } from '../../data/gymData';

interface AdminDashboardProps {
  token: string;
  user: { name: string; email: string };
  onLogout: () => void;
  onViewSite: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  token,
  user,
  onLogout,
  onViewSite,
}) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalLeads: 0,
    newLeads: 0,
    contactedLeads: 0,
    followUpLeads: 0,
    convertedLeads: 0,
    closedLeads: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [goalFilter, setGoalFilter] = useState<string>('All');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setRefreshing(true);
      const [leadsRes, metricsRes] = await Promise.all([
        fetchLeads(token, {
          search: searchTerm,
          status: statusFilter,
          fitnessGoal: goalFilter,
        }),
        fetchMetrics(token),
      ]);
      setLeads(leadsRes.leads);
      setIsSupabaseConnected(leadsRes.isSupabaseConnected);
      setMetrics(metricsRes);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token, searchTerm, statusFilter, goalFilter]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const [generatingTest, setGeneratingTest] = useState(false);
  const [testLeadMessage, setTestLeadMessage] = useState<string | null>(null);

  const handleGenerateTestLead = async () => {
    try {
      setGeneratingTest(true);
      setTestLeadMessage(null);
      const testNames = ['Rahul Sharma', 'Ananya Deshmukh', 'Kabir Malhotra', 'Simran Kaur', 'Aditya Verma'];
      const randomName =
        testNames[Math.floor(Math.random() * testNames.length)] +
        ` (${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`;

      const goals: FitnessGoal[] = ['Weight Loss', 'Muscle Gain', 'General Fitness', 'Strength Training'];
      const randomGoal = goals[Math.floor(Math.random() * goals.length)];
      const randomTime = ['Morning', 'Afternoon', 'Evening'][Math.floor(Math.random() * 3)] as
        | 'Morning'
        | 'Afternoon'
        | 'Evening';

      const res = await submitLead({
        name: randomName,
        phone: '+91 9' + Math.floor(100000000 + Math.random() * 900000000).toString(),
        email: `prospect_${Date.now().toString().slice(-4)}@example.com`,
        fitness_goal: randomGoal,
        preferred_workout_time: randomTime,
        message: 'Live test lead created from Admin Portal. Checking instant intake and email notification pipeline.',
      });

      setTestLeadMessage(
        `✅ Test lead "${randomName}" captured! Saved to Supabase: ${
          res.savedToSupabase ? 'Yes' : 'Local Backup'
        }. Email notification dispatched to owner.`
      );
      await loadData();
      setTimeout(() => setTestLeadMessage(null), 7000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to submit test lead';
      setTestLeadMessage(`❌ Error: ${msg}`);
    } finally {
      setGeneratingTest(false);
    }
  };

  const handleStatusChange = async (leadId: string, newStatus: LeadStatus) => {
    try {
      const updated = await updateLeadStatus(token, leadId, newStatus);
      setLeads((prev) => prev.map((l) => (l.id === leadId ? updated : l)));
      if (selectedLead && selectedLead.id === leadId) {
        setSelectedLead(updated);
      }
      // Refresh metrics
      const newMetrics = await fetchMetrics(token);
      setMetrics(newMetrics);
    } catch {
      // Handled
    }
  };

  const handleExportCSV = () => {
    if (leads.length === 0) return;
    const headers = [
      'ID',
      'Name',
      'Phone',
      'Email',
      'Fitness Goal',
      'Preferred Workout Time',
      'Status',
      'Created At',
      'Message',
    ];

    const rows = leads.map((l) => [
      `"${l.id}"`,
      `"${l.name.replace(/"/g, '""')}"`,
      `"${l.phone}"`,
      `"${l.email}"`,
      `"${l.fitness_goal}"`,
      `"${l.preferred_workout_time}"`,
      `"${l.status}"`,
      `"${new Date(l.created_at).toISOString()}"`,
      `"${(l.message || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `ironfit_leads_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadgeClass = (status: LeadStatus) => {
    switch (status) {
      case 'New':
        return 'text-red-400 font-semibold';
      case 'Contacted':
        return 'text-sky-400 font-semibold';
      case 'Follow-up':
        return 'text-amber-400 font-semibold';
      case 'Converted':
        return 'text-emerald-400 font-semibold';
      case 'Closed':
      default:
        return 'text-neutral-400 font-semibold';
    }
  };

  const fitnessGoals: (FitnessGoal | 'All')[] = [
    'All',
    'Weight Loss',
    'Muscle Gain',
    'General Fitness',
    'Strength Training',
    'Other',
  ];

  const statuses: (LeadStatus | 'All')[] = [
    'All',
    'New',
    'Contacted',
    'Follow-up',
    'Converted',
    'Closed',
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col">
      {/* Top Navbar */}
      <header className="bg-neutral-900 border-b border-neutral-800 sticky top-0 z-30 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-heading text-2xl font-bold tracking-wider text-white">
              IRON<span className="text-red-600">FIT</span>
            </span>
            <span className="text-xs uppercase tracking-widest text-neutral-400 font-bold pl-3 border-l border-neutral-800 hidden sm:inline">
              Owner Lead Portal
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onViewSite}
              className="text-xs text-neutral-300 hover:text-white px-3 py-1.5 rounded bg-neutral-950 border border-neutral-800 transition-colors flex items-center gap-1.5"
            >
              <span>View Landing Page</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onLogout}
              className="text-xs text-red-400 hover:text-red-300 px-3 py-1.5 rounded bg-neutral-950 border border-neutral-800 transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8">
        
        {/* Welcome Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-heading text-3xl font-bold text-white uppercase">
              30-Day Challenge Enquiries
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1">
              Welcome back, {user.name} ({user.email}). Direct prospect leads for IronFit HSR Layout.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleGenerateTestLead}
              disabled={generatingTest}
              className="text-xs font-semibold px-3 py-2 rounded bg-red-600 hover:bg-red-500 text-white flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
              title="Send a sample enquiry to verify database capture and email delivery"
            >
              <UserPlus className={`w-3.5 h-3.5 ${generatingTest ? 'animate-bounce' : ''}`} />
              <span>{generatingTest ? 'Generating...' : '+ Submit Live Test Lead'}</span>
            </button>
            <button
              onClick={loadData}
              disabled={refreshing}
              className="text-xs font-semibold px-3 py-2 rounded bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-200 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <button
              onClick={handleExportCSV}
              disabled={leads.length === 0}
              className="text-xs font-semibold px-3 py-2 rounded bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-200 flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-red-500" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Live Test Lead Toast Notification */}
        {testLeadMessage && (
          <div className="mb-6 p-4 rounded-lg bg-neutral-900 border border-neutral-700 text-sm flex items-center justify-between shadow-lg animate-fadeIn">
            <div className="flex items-center gap-2 text-white">
              <span>{testLeadMessage}</span>
            </div>
            <button
              onClick={() => setTestLeadMessage(null)}
              className="text-xs text-neutral-400 hover:text-white px-2 py-1 rounded"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Supabase Status / Setup Component */}
        <SupabaseSetupHelper token={token} onConfigUpdated={loadData} />

        {/* Email Notification Manager */}
        <EmailNotificationManager token={token} />

        {/* Summary Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-8">
          <div className="bg-neutral-900 p-4 rounded border border-neutral-800">
            <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-bold block mb-1">
              Total Leads
            </span>
            <span className="font-heading text-2xl sm:text-3xl font-bold text-white">
              {metrics.totalLeads}
            </span>
          </div>

          <div className="bg-neutral-900 p-4 rounded border border-neutral-800">
            <span className="text-[11px] uppercase tracking-wider text-red-400 font-bold block mb-1">
              New
            </span>
            <span className="font-heading text-2xl sm:text-3xl font-bold text-red-500">
              {metrics.newLeads}
            </span>
          </div>

          <div className="bg-neutral-900 p-4 rounded border border-neutral-800">
            <span className="text-[11px] uppercase tracking-wider text-sky-400 font-bold block mb-1">
              Contacted
            </span>
            <span className="font-heading text-2xl sm:text-3xl font-bold text-sky-400">
              {metrics.contactedLeads}
            </span>
          </div>

          <div className="bg-neutral-900 p-4 rounded border border-neutral-800">
            <span className="text-[11px] uppercase tracking-wider text-amber-400 font-bold block mb-1">
              Follow-up
            </span>
            <span className="font-heading text-2xl sm:text-3xl font-bold text-amber-400">
              {metrics.followUpLeads}
            </span>
          </div>

          <div className="bg-neutral-900 p-4 rounded border border-neutral-800">
            <span className="text-[11px] uppercase tracking-wider text-emerald-400 font-bold block mb-1">
              Converted
            </span>
            <span className="font-heading text-2xl sm:text-3xl font-bold text-emerald-400">
              {metrics.convertedLeads}
            </span>
          </div>

          <div className="bg-neutral-900 p-4 rounded border border-neutral-800">
            <span className="text-[11px] uppercase tracking-wider text-neutral-500 font-bold block mb-1">
              Closed
            </span>
            <span className="font-heading text-2xl sm:text-3xl font-bold text-neutral-400">
              {metrics.closedLeads}
            </span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-neutral-900 p-4 rounded border border-neutral-800 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by name, phone, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded pl-9 pr-4 py-2 text-xs sm:text-sm text-white placeholder-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-1.5 text-xs text-neutral-400">
              <Filter className="w-3.5 h-3.5 text-neutral-500" />
              <span>Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-neutral-950 border border-neutral-800 text-neutral-200 text-xs rounded px-2.5 py-1.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-500"
              >
                {statuses.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-neutral-400">
              <span>Goal:</span>
              <select
                value={goalFilter}
                onChange={(e) => setGoalFilter(e.target.value)}
                className="bg-neutral-950 border border-neutral-800 text-neutral-200 text-xs rounded px-2.5 py-1.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-500"
              >
                {fitnessGoals.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Lead Table */}
        <div className="bg-neutral-900 border border-neutral-800 rounded overflow-hidden shadow-xl">
          {loading ? (
            <div className="p-12 text-center text-neutral-500 text-sm">
              Loading enquiries...
            </div>
          ) : leads.length === 0 ? (
            <div className="p-12 text-center text-neutral-500 text-sm">
              <Users className="w-8 h-8 mx-auto mb-2 text-neutral-600" />
              <p>No enquiries found matching the selected filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-neutral-950 text-neutral-400 uppercase text-[11px] font-bold border-b border-neutral-800">
                  <tr>
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Phone</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Fitness Goal</th>
                    <th className="py-3 px-4">Preferred Time</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Received</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/80">
                  {leads.map((lead) => {
                    const cleanPhone = lead.phone.replace(/[^0-9+]/g, '');
                    return (
                      <tr
                        key={lead.id}
                        className="hover:bg-neutral-800/40 transition-colors group cursor-pointer"
                        onClick={() => setSelectedLead(lead)}
                      >
                        <td className="py-3.5 px-4 font-semibold text-white whitespace-nowrap">
                          {lead.name}
                        </td>
                        <td className="py-3.5 px-4 text-neutral-300 whitespace-nowrap">
                          <a
                            href={`tel:${cleanPhone}`}
                            onClick={(e) => e.stopPropagation()}
                            className="hover:text-red-400 inline-flex items-center gap-1 transition-colors"
                          >
                            <Phone className="w-3 h-3 text-red-500" />
                            <span>{lead.phone}</span>
                          </a>
                        </td>
                        <td className="py-3.5 px-4 text-neutral-300 whitespace-nowrap">
                          <a
                            href={`mailto:${lead.email}`}
                            onClick={(e) => e.stopPropagation()}
                            className="hover:text-neutral-100 inline-flex items-center gap-1 transition-colors"
                          >
                            <Mail className="w-3 h-3 text-neutral-500" />
                            <span>{lead.email}</span>
                          </a>
                        </td>
                        <td className="py-3.5 px-4 text-neutral-300 whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            <Target className="w-3 h-3 text-red-500" />
                            <span>{lead.fitness_goal}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-neutral-400 whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-neutral-500" />
                            <span>{lead.preferred_workout_time}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                          <select
                            value={lead.status}
                            onChange={(e) =>
                              handleStatusChange(lead.id, e.target.value as LeadStatus)
                            }
                            className={`bg-neutral-950 border border-neutral-800 text-xs rounded px-2 py-1 ${getStatusBadgeClass(
                              lead.status
                            )} cursor-pointer`}
                          >
                            {statuses
                              .filter((s) => s !== 'All')
                              .map((st) => (
                                <option key={st} value={st} className="bg-neutral-900 text-white">
                                  {st}
                                </option>
                              ))}
                          </select>
                        </td>
                        <td className="py-3.5 px-4 text-neutral-500 text-xs whitespace-nowrap">
                          {new Date(lead.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => setSelectedLead(lead)}
                            className="text-xs text-neutral-400 hover:text-white px-2 py-1 rounded hover:bg-neutral-800 inline-flex items-center gap-1 transition-colors"
                            title="View Full Lead Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </main>

      {/* Lead Details Modal */}
      {selectedLead && (
        <LeadDetailsModal
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
};
