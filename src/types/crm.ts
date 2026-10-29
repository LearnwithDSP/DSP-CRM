export type UserRole =
  | 'owner'
  | 'sales_manager'
  | 'sales_rep'
  | 'marketing'
  | 'coach'
  | 'operations'
  | 'finance'
  | 'analyst';

export interface StaffProfile {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatarInitials: string;
  department: string;
  activeLeadsCount?: number;
  conversionRate?: number;
}

export type PipelineStage =
  | 'New Lead'
  | 'Contact Attempted'
  | 'Contact Established'
  | 'Qualified'
  | 'Offer Presented'
  | 'Follow-up / Decision Pending'
  | 'Payment Pending'
  | 'Won'
  | 'Lost'
  | 'Nurture';

export type LeadSource =
  | 'Website'
  | 'Instagram'
  | 'WhatsApp'
  | 'Facebook'
  | 'Google'
  | 'Masterclass'
  | 'Referral'
  | 'Events'
  | 'Manual'
  | 'Other';

export interface QualificationData {
  goal?: string;
  skillLevel?: 'Beginner' | 'Intermediate' | 'Advanced';
  urgency?: 'Immediate (this week)' | 'Next 30 days' | 'Exploring options';
  budgetReady?: 'Full payment ready' | 'Installment required' | 'Need employer sponsorship' | 'Undecided';
  priorTraining?: string;
  keyObjection?: string;
}

export interface Contact {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  whatsapp?: string;
  location?: string;
  occupation?: string;
  source: LeadSource;
  createdAt: string;
}

export interface LeadOpportunity {
  id: string;
  contactId: string;
  fullName: string;
  email: string;
  phone: string;
  source: LeadSource;
  programTitle: string;
  stage: PipelineStage;
  ownerName: string;
  ownerId?: string;
  leadScore: number; // 0 - 100
  estimatedValue: number; // in NGN
  quotedPrice?: number;
  nextAction?: string;
  nextActionDue?: string;
  needNotes?: string;
  lossReason?: string;
  qualification?: QualificationData;
  createdAt: string;
  updatedAt?: string;
}

export interface TaskItem {
  id: string;
  title: string;
  assignee: string;
  dueTime: string;
  dueDate: string;
  isCompleted: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  relatedContact?: string;
  opportunityId?: string;
  createdAt: string;
}

export interface ActivityItem {
  id: string;
  actorName: string;
  actorInitials: string;
  actionTitle: string;
  description: string;
  timeAgo: string;
  timestamp: string;
  relatedType?: 'lead' | 'contact' | 'task' | 'finance' | 'student' | 'opportunity';
}

export interface ProgramItem {
  id: string;
  title: string;
  code: string;
  category: string;
  activeLearners: number;
  capacity: number;
  completionRate: number; // percentage
  priceNGN: number;
  icon: string;
  description: string;
}

export interface StudentItem {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  programTitle: string;
  cohort: string;
  coachName: string;
  progressPercent: number;
  attendanceRate: number;
  paymentStatus: 'verified' | 'partial' | 'overdue' | 'sponsored';
  amountPaid: number;
  balanceDue: number;
  enrolledAt: string;
  status: 'active' | 'onboarding' | 'completed' | 'paused';
}

export interface CoachingSession {
  id: string;
  title: string;
  coachName: string;
  studentName: string;
  studentEmail?: string;
  programTitle: string;
  sessionType: 'Consultation' | '1-on-1 Coaching' | 'Masterclass Review' | 'Project Audit' | 'Strategy Session';
  scheduledTime: string;
  dateStr: string;
  durationMinutes: number;
  status: 'scheduled' | 'completed' | 'missed' | 'cancelled';
}

export interface PaymentRecord {
  id: string;
  studentOrLeadName: string;
  programTitle: string;
  amountNGN: number;
  currency: 'NGN' | 'USD';
  channel: 'Bank Transfer' | 'Paystack' | 'Flutterwave' | 'Installment' | 'Card';
  transactionRef: string;
  status: 'verified' | 'pending' | 'rejected' | 'refunded';
  verifiedBy: string;
  recordedAt: string;
  notes?: string;
}

export interface AutomationRule {
  id: string;
  name: string;
  triggerEvent: string;
  actionSummary: string;
  isActive: boolean;
  executionCount: number;
  lastRun?: string;
}
