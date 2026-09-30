import React, { useState } from 'react';
import { Phone, MessageSquare, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { submitLead } from '../lib/api';
import { FitnessGoal, LeadFormData, PreferredWorkoutTime } from '../types';
import { BUSINESS_INFO } from '../data/gymData';

interface LeadFormProps {
  initialGoal?: FitnessGoal;
}

export const LeadForm: React.FC<LeadFormProps> = ({ initialGoal }) => {
  const [formData, setFormData] = useState<LeadFormData>({
    name: '',
    phone: '',
    email: '',
    fitness_goal: initialGoal || 'General Fitness',
    preferred_workout_time: 'Morning',
    message: '',
    website_field: '', // Honeypot field
    form_loaded_at: Date.now(),
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fitnessGoals: FitnessGoal[] = [
    'Weight Loss',
    'Muscle Gain',
    'General Fitness',
    'Strength Training',
    'Other',
  ];

  const preferredTimes: PreferredWorkoutTime[] = [
    'Morning',
    'Afternoon',
    'Evening',
  ];

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!formData.name.trim()) {
      errs.name = 'Please enter your full name.';
    } else if (formData.name.trim().length < 2) {
      errs.name = 'Name must be at least 2 characters.';
    }

    if (!formData.phone.trim()) {
      errs.phone = 'Please enter your phone number.';
    } else if (!/^[0-9+() -]{8,18}$/.test(formData.phone.trim())) {
      errs.phone = 'Please enter a valid phone number.';
    }

    if (!formData.email.trim()) {
      errs.email = 'Please enter your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address.';
    }

    if (!formData.fitness_goal) {
      errs.fitness_goal = 'Please select your fitness goal.';
    }

    if (!formData.preferred_workout_time) {
      errs.preferred_workout_time = 'Please select your preferred workout time.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await submitLead(formData);
      setIsSubmitted(true);
    } catch {
      setErrorMessage(
        'We couldn’t submit your enquiry right now. Please try again or contact IronFit directly at +91 90000 12345.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // SUCCESS STATE (Section 26)
  if (isSubmitted) {
    return (
      <div className="bg-neutral-950 p-8 sm:p-10 rounded border border-neutral-800 shadow-2xl text-center animate-fadeIn">
        <div className="w-16 h-16 rounded-full bg-emerald-950/80 border border-emerald-800 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-8 h-8 text-emerald-400" />
        </div>

        <h3 className="font-heading text-3xl sm:text-4xl font-bold text-white uppercase mb-4">
          You're All Set
        </h3>

        <p className="text-base sm:text-lg text-neutral-300 leading-relaxed max-w-md mx-auto mb-8">
          Thanks for your enquiry. The IronFit team will contact you to help you get started with the 30-Day Fitness Challenge.
        </p>

        <div className="p-6 bg-neutral-900 rounded border border-neutral-800 max-w-md mx-auto">
          <p className="text-xs uppercase tracking-wider text-neutral-400 font-bold mb-4">
            Need immediate assistance? Contact IronFit directly:
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={`tel:${BUSINESS_INFO.phoneClean}`}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-white font-medium text-sm py-3 px-4 rounded border border-neutral-700 transition-colors"
            >
              <Phone className="w-4 h-4 text-red-500" />
              <span>Call +91 90000 12345</span>
            </a>
            <a
              href={BUSINESS_INFO.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 bg-emerald-900/60 hover:bg-emerald-800/80 text-emerald-200 font-medium text-sm py-3 px-4 rounded border border-emerald-700/60 transition-colors"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp IronFit</span>
            </a>
          </div>
        </div>

        <div className="mt-8">
          <button
            type="button"
            onClick={() => {
              setIsSubmitted(false);
              setFormData({
                name: '',
                phone: '',
                email: '',
                fitness_goal: 'General Fitness',
                preferred_workout_time: 'Morning',
                message: '',
                website_field: '',
                form_loaded_at: Date.now(),
              });
            }}
            className="text-xs text-neutral-400 hover:text-white transition-colors underline cursor-pointer"
          >
            Submit another enquiry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-neutral-950 p-6 sm:p-10 rounded border border-neutral-800 shadow-2xl">
      {/* Form Header */}
      <div className="text-center mb-8">
        <h3 className="font-heading text-2xl sm:text-3xl font-bold text-white uppercase mb-2">
          Join the 30-Day Challenge
        </h3>
        <p className="text-sm sm:text-base text-neutral-400">
          Fill in your details below and let us know what you're looking to achieve.
        </p>
      </div>

      {errorMessage && (
        <div
          role="alert"
          className="mb-6 p-4 rounded bg-red-950/80 border border-red-800 text-red-200 text-sm flex items-start gap-3"
        >
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <p>{errorMessage}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        
        {/* Anti-spam Honeypot field (hidden from genuine users) */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="website_field">Do not fill this field</label>
          <input
            type="text"
            id="website_field"
            name="website_field"
            tabIndex={-1}
            autoComplete="off"
            value={formData.website_field || ''}
            onChange={(e) => setFormData({ ...formData, website_field: e.target.value })}
          />
        </div>

        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-xs uppercase tracking-wider font-bold text-neutral-300 mb-1.5">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            required
            aria-required="true"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'name-error' : undefined}
            value={formData.name}
            onChange={(e) => {
              setFormData({ ...formData, name: e.target.value });
              if (errors.name) setErrors({ ...errors, name: '' });
            }}
            placeholder="Your Full Name"
            className="w-full bg-neutral-900 border border-neutral-800 rounded px-4 py-3.5 text-white placeholder-neutral-500 text-sm sm:text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:border-transparent transition-all"
          />
          {errors.name && (
            <p id="name-error" className="mt-1 text-xs text-red-400 font-medium">
              {errors.name}
            </p>
          )}
        </div>

        {/* Phone & Email Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="phone" className="block text-xs uppercase tracking-wider font-bold text-neutral-300 mb-1.5">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              required
              aria-required="true"
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? 'phone-error' : undefined}
              value={formData.phone}
              onChange={(e) => {
                setFormData({ ...formData, phone: e.target.value });
                if (errors.phone) setErrors({ ...errors, phone: '' });
              }}
              placeholder="+91 98765 43210"
              className="w-full bg-neutral-900 border border-neutral-800 rounded px-4 py-3.5 text-white placeholder-neutral-500 text-sm sm:text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:border-transparent transition-all"
            />
            {errors.phone && (
              <p id="phone-error" className="mt-1 text-xs text-red-400 font-medium">
                {errors.phone}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-xs uppercase tracking-wider font-bold text-neutral-300 mb-1.5">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              required
              aria-required="true"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'email-error' : undefined}
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                if (errors.email) setErrors({ ...errors, email: '' });
              }}
              placeholder="you@example.com"
              className="w-full bg-neutral-900 border border-neutral-800 rounded px-4 py-3.5 text-white placeholder-neutral-500 text-sm sm:text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:border-transparent transition-all"
            />
            {errors.email && (
              <p id="email-error" className="mt-1 text-xs text-red-400 font-medium">
                {errors.email}
              </p>
            )}
          </div>
        </div>

        {/* Fitness Goal & Preferred Workout Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="fitness_goal" className="block text-xs uppercase tracking-wider font-bold text-neutral-300 mb-1.5">
              Fitness Goal <span className="text-red-500">*</span>
            </label>
            <select
              id="fitness_goal"
              required
              aria-required="true"
              value={formData.fitness_goal}
              onChange={(e) =>
                setFormData({ ...formData, fitness_goal: e.target.value as FitnessGoal })
              }
              className="w-full bg-neutral-900 border border-neutral-800 rounded px-4 py-3.5 text-white text-sm sm:text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:border-transparent transition-all cursor-pointer"
            >
              {fitnessGoals.map((goal) => (
                <option key={goal} value={goal} className="bg-neutral-900 text-white">
                  {goal}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="preferred_workout_time" className="block text-xs uppercase tracking-wider font-bold text-neutral-300 mb-1.5">
              Preferred Workout Time <span className="text-red-500">*</span>
            </label>
            <select
              id="preferred_workout_time"
              required
              aria-required="true"
              value={formData.preferred_workout_time}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  preferred_workout_time: e.target.value as PreferredWorkoutTime,
                })
              }
              className="w-full bg-neutral-900 border border-neutral-800 rounded px-4 py-3.5 text-white text-sm sm:text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:border-transparent transition-all cursor-pointer"
            >
              {preferredTimes.map((time) => (
                <option key={time} value={time} className="bg-neutral-900 text-white">
                  {time}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Message / Additional Information */}
        <div>
          <label htmlFor="message" className="block text-xs uppercase tracking-wider font-bold text-neutral-300 mb-1.5">
            Message / Additional Information <span className="text-neutral-500 lowercase font-normal">(optional)</span>
          </label>
          <textarea
            id="message"
            rows={3}
            value={formData.message || ''}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="Tell us anything else you'd like the IronFit team to know"
            maxLength={1000}
            className="w-full bg-neutral-900 border border-neutral-800 rounded px-4 py-3 text-white placeholder-neutral-500 text-sm sm:text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:border-transparent transition-all resize-y"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-neutral-800 disabled:text-neutral-500 text-white font-bold text-base sm:text-lg py-4 px-6 rounded shadow-xl shadow-red-950/50 transition-all hover:scale-[1.01] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Submitting Your Details...</span>
              </>
            ) : (
              <span>{BUSINESS_INFO.campaign.primaryCta}</span>
            )}
          </button>
        </div>

        {/* Supporting Microcopy (Section 24) */}
        <p className="text-center text-xs text-neutral-400 pt-1">
          Submit your details and the IronFit team will contact you to help you get started.
        </p>

      </form>
    </div>
  );
};
