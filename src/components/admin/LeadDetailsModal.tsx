import React from 'react';
import { X, Phone, MessageSquare, Mail, Calendar, Clock, Target, CheckCircle2 } from 'lucide-react';
import { Lead, LeadStatus } from '../../types';

interface LeadDetailsModalProps {
  lead: Lead | null;
  onClose: () => void;
  onStatusChange: (id: string, newStatus: LeadStatus) => void;
}

export const LeadDetailsModal: React.FC<LeadDetailsModalProps> = ({
  lead,
  onClose,
  onStatusChange,
}) => {
  if (!lead) return null;

  const statuses: LeadStatus[] = ['New', 'Contacted', 'Follow-up', 'Converted', 'Closed'];

  const cleanPhone = lead.phone.replace(/[^0-9+]/g, '');
  const whatsappUrl = `https://wa.me/${cleanPhone.startsWith('+') ? cleanPhone.slice(1) : cleanPhone}?text=Hi%20${encodeURIComponent(
    lead.name
  )}%2C%20this%20is%20Kiran%20from%20IronFit%20Fitness%20Studio%20regarding%20your%20enquiry%20for%20the%2030-Day%20Fitness%20Challenge.`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg max-w-xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-neutral-800">
          <div>
            <span className="text-xs uppercase tracking-wider text-neutral-400 font-bold">
              Lead Details
            </span>
            <h3 className="font-heading text-2xl font-bold text-white mt-1">
              {lead.name}
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Enquiry ID: <span className="font-mono text-neutral-300">{lead.id}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-2 rounded hover:bg-neutral-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Contact Action Bar */}
        <div className="my-6 grid grid-cols-3 gap-3">
          <a
            href={`tel:${cleanPhone}`}
            className="flex flex-col items-center justify-center gap-1.5 p-3 rounded bg-neutral-950 border border-neutral-800 hover:border-red-600 transition-colors text-center text-xs text-neutral-200 font-medium"
          >
            <Phone className="w-4 h-4 text-red-500" />
            <span>Call Lead</span>
          </a>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center gap-1.5 p-3 rounded bg-neutral-950 border border-neutral-800 hover:border-emerald-600 transition-colors text-center text-xs text-neutral-200 font-medium"
          >
            <MessageSquare className="w-4 h-4 text-emerald-500" />
            <span>WhatsApp</span>
          </a>

          <a
            href={`mailto:${lead.email}?subject=IronFit%20Fitness%20Studio%20-%2030-Day%20Fitness%20Challenge`}
            className="flex flex-col items-center justify-center gap-1.5 p-3 rounded bg-neutral-950 border border-neutral-800 hover:border-neutral-600 transition-colors text-center text-xs text-neutral-200 font-medium"
          >
            <Mail className="w-4 h-4 text-neutral-400" />
            <span>Email</span>
          </a>
        </div>

        {/* Lead Attributes */}
        <div className="space-y-4 text-sm">
          <div className="grid grid-cols-2 gap-4 p-4 rounded bg-neutral-950 border border-neutral-800">
            <div>
              <span className="text-xs text-neutral-500 block uppercase font-bold">
                Fitness Goal
              </span>
              <div className="flex items-center gap-1.5 mt-1 text-neutral-200 font-semibold">
                <Target className="w-4 h-4 text-red-500" />
                <span>{lead.fitness_goal}</span>
              </div>
            </div>

            <div>
              <span className="text-xs text-neutral-500 block uppercase font-bold">
                Preferred Time
              </span>
              <div className="flex items-center gap-1.5 mt-1 text-neutral-200 font-semibold">
                <Clock className="w-4 h-4 text-red-500" />
                <span>{lead.preferred_workout_time}</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded bg-neutral-950 border border-neutral-800">
            <span className="text-xs text-neutral-500 block uppercase font-bold mb-1">
              Contact Information
            </span>
            <div className="space-y-1 text-neutral-300">
              <p>
                <span className="text-neutral-500">Phone:</span> {lead.phone}
              </p>
              <p>
                <span className="text-neutral-500">Email:</span> {lead.email}
              </p>
            </div>
          </div>

          <div className="p-4 rounded bg-neutral-950 border border-neutral-800">
            <span className="text-xs text-neutral-500 block uppercase font-bold mb-1">
              Prospect Message
            </span>
            <p className="text-neutral-200 italic leading-relaxed whitespace-pre-line text-sm">
              {lead.message ? `"${lead.message}"` : 'No additional message provided.'}
            </p>
          </div>

          <div className="flex items-center justify-between text-xs text-neutral-400 px-1">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-neutral-500" />
              <span>Submitted: {new Date(lead.created_at).toLocaleString()}</span>
            </div>
          </div>

          {/* Status Changer */}
          <div className="pt-4 border-t border-neutral-800">
            <label className="block text-xs uppercase font-bold text-neutral-300 mb-2">
              Update Lead Status
            </label>
            <div className="flex flex-wrap gap-2">
              {statuses.map((st) => (
                <button
                  key={st}
                  onClick={() => onStatusChange(lead.id, st)}
                  className={`text-xs font-semibold px-3 py-2 rounded transition-all cursor-pointer flex items-center gap-1.5 ${
                    lead.status === st
                      ? 'bg-red-600 text-white'
                      : 'bg-neutral-950 text-neutral-300 hover:bg-neutral-800 border border-neutral-800'
                  }`}
                >
                  {lead.status === st && <CheckCircle2 className="w-3.5 h-3.5" />}
                  <span>{st}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
