import { useState, useEffect } from 'react';
import {
  LeadOpportunity,
  TaskItem,
  ActivityItem,
  ProgramItem,
  StudentItem,
  CoachingSession,
  PaymentRecord,
  AutomationRule,
  StaffProfile,
  PipelineStage,
  QualificationData,
} from '../types/crm';
import {
  INITIAL_LEADS,
  INITIAL_TASKS,
  INITIAL_ACTIVITIES,
  INITIAL_PROGRAMS,
  INITIAL_STUDENTS,
  INITIAL_SESSIONS,
  INITIAL_PAYMENTS,
  INITIAL_AUTOMATIONS,
  INITIAL_STAFF,
} from '../lib/mockData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const STORAGE_KEY = 'dsp_coaching_crm_store_v1';

export interface CrmState {
  leads: LeadOpportunity[];
  tasks: TaskItem[];
  activities: ActivityItem[];
  programs: ProgramItem[];
  students: StudentItem[];
  sessions: CoachingSession[];
  payments: PaymentRecord[];
  automations: AutomationRule[];
  staff: StaffProfile[];
  currentUserId: string;
  totalLeadsCount: number;
}

const getInitialState = (): CrmState => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...parsed,
        totalLeadsCount: parsed.totalLeadsCount || 248,
      };
    }
  } catch (e) {
    console.error('Error loading local state:', e);
  }

  return {
    leads: INITIAL_LEADS,
    tasks: INITIAL_TASKS,
    activities: INITIAL_ACTIVITIES,
    programs: INITIAL_PROGRAMS,
    students: INITIAL_STUDENTS,
    sessions: INITIAL_SESSIONS,
    payments: INITIAL_PAYMENTS,
    automations: INITIAL_AUTOMATIONS,
    staff: INITIAL_STAFF,
    currentUserId: 'staff-1', // Patrick Ezeji
    totalLeadsCount: 248,
  };
};

export const calculateLeadScore = (qual?: QualificationData): number => {
  if (!qual) return 50;
  let score = 30; // base score

  if (qual.budgetReady === 'Full payment ready') score += 25;
  else if (qual.budgetReady === 'Installment required') score += 15;
  else if (qual.budgetReady === 'Need employer sponsorship') score += 10;

  if (qual.urgency === 'Immediate (this week)') score += 25;
  else if (qual.urgency === 'Next 30 days') score += 15;
  else if (qual.urgency === 'Exploring options') score += 5;

  if (qual.skillLevel === 'Intermediate' || qual.skillLevel === 'Advanced') score += 15;
  else score += 10;

  if (qual.goal && qual.goal.length > 5) score += 5;

  return Math.min(100, score);
};

// Global event listener setup for reactivity across components
let globalState = getInitialState();
const listeners = new Set<(state: CrmState) => void>();

const notify = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(globalState));
  } catch (err) {
    console.error('Failed to save to localStorage', err);
  }
  listeners.forEach((listener) => listener(globalState));
};

export const useCrmStore = () => {
  const [state, setState] = useState<CrmState>(globalState);

  useEffect(() => {
    listeners.add(setState);
    return () => {
      listeners.delete(setState);
    };
  }, []);

  // Sync with Supabase on mount if configured
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    const fetchSupabaseData = async () => {
      try {
        const { data: leadsData } = await supabase.from('opportunities').select('*');
        const { data: tasksData } = await supabase.from('tasks').select('*');
        if (leadsData && leadsData.length > 0) {
          // If remote data exists, we can merge or hydrate
          console.log('Supabase opportunities loaded:', leadsData.length);
        }
      } catch (err) {
        console.warn('Supabase fetch notice:', err);
      }
    };

    fetchSupabaseData();
  }, []);

  const currentUser = state.staff.find((s) => s.id === state.currentUserId) || state.staff[0];

  const addLead = (newLead: {
    fullName: string;
    phone: string;
    email?: string;
    source: any;
    programTitle: string;
    ownerName?: string;
    needNotes?: string;
    estimatedValue?: number;
    qualification?: QualificationData;
  }) => {
    const id = `lead-${Date.now()}`;
    const contactId = `ct-${Date.now()}`;
    const score = calculateLeadScore(newLead.qualification);

    const leadRecord: LeadOpportunity = {
      id,
      contactId,
      fullName: newLead.fullName,
      phone: newLead.phone,
      email: newLead.email || `${newLead.fullName.toLowerCase().replace(/\s+/g, '')}@example.com`,
      source: newLead.source || 'Website',
      programTitle: newLead.programTitle || 'AI & Automation Coaching',
      stage: 'New Lead',
      ownerName: newLead.ownerName || 'Unassigned',
      leadScore: score,
      estimatedValue: newLead.estimatedValue || 250000,
      nextAction: 'First contact call & qualification',
      nextActionDue: 'Today',
      needNotes: newLead.needNotes || '',
      qualification: newLead.qualification,
      createdAt: new Date().toISOString(),
    };

    // Auto-create a task for this lead
    const initialTask: TaskItem = {
      id: `task-${Date.now()}`,
      title: `Follow up with ${newLead.fullName} (${newLead.programTitle})`,
      assignee: newLead.ownerName !== 'Unassigned' ? newLead.ownerName! : currentUser.fullName,
      dueTime: '14:00',
      dueDate: 'Today',
      isCompleted: false,
      priority: score >= 80 ? 'urgent' : 'medium',
      relatedContact: newLead.fullName,
      opportunityId: id,
      createdAt: new Date().toISOString(),
    };

    // Activity log
    const activity: ActivityItem = {
      id: `act-${Date.now()}`,
      actorName: currentUser.fullName,
      actorInitials: currentUser.avatarInitials,
      actionTitle: `Captured new lead: ${newLead.fullName}`,
      description: `Source: ${newLead.source} · Program: ${newLead.programTitle} · Score: ${score}/100`,
      timeAgo: 'Just now',
      timestamp: new Date().toISOString(),
      relatedType: 'lead',
    };

    globalState = {
      ...globalState,
      leads: [leadRecord, ...globalState.leads],
      tasks: [initialTask, ...globalState.tasks],
      activities: [activity, ...globalState.activities],
      totalLeadsCount: globalState.totalLeadsCount + 1,
    };
    notify();

    // If Supabase is active, persist to remote
    if (isSupabaseConfigured && supabase) {
      supabase.from('opportunities').insert([
        {
          contact_id: contactId,
          title: `${newLead.fullName} - ${newLead.programTitle}`,
          stage: 'New Lead',
          source: newLead.source,
          estimated_value: leadRecord.estimatedValue,
          lead_score: score,
          next_action: leadRecord.nextAction,
          qualification_answers: newLead.qualification || {},
        },
      ]);
    }

    return leadRecord;
  };

  const updateLeadStage = (leadId: string, newStage: PipelineStage, reason?: string) => {
    const lead = globalState.leads.find((l) => l.id === leadId);
    if (!lead) return;

    const prevStage = lead.stage;
    let nextAction = lead.nextAction;

    if (newStage === 'Contacted' || newStage === 'Contact Established') {
      nextAction = 'Complete qualification questionnaire';
    } else if (newStage === 'Qualified') {
      nextAction = 'Prepare coaching proposal & pricing options';
    } else if (newStage === 'Offer Presented') {
      nextAction = 'Follow up on offer decision & handle objections';
    } else if (newStage === 'Payment Pending') {
      nextAction = 'Verify incoming bank transfer / invoice payment';
    } else if (newStage === 'Won') {
      nextAction = 'Onboarding complete & active in cohort';
    } else if (newStage === 'Lost') {
      nextAction = 'Archived with loss reason recorded';
    }

    const updatedLeads = globalState.leads.map((l) =>
      l.id === leadId
        ? {
            ...l,
            stage: newStage,
            lossReason: reason || l.lossReason,
            nextAction,
            updatedAt: new Date().toISOString(),
          }
        : l
    );

    const activity: ActivityItem = {
      id: `act-${Date.now()}`,
      actorName: currentUser.fullName,
      actorInitials: currentUser.avatarInitials,
      actionTitle: `Moved ${lead.fullName} to ${newStage}`,
      description: reason
        ? `Stage changed from ${prevStage} → ${newStage} (Reason: ${reason})`
        : `Stage transition: ${prevStage} → ${newStage}`,
      timeAgo: 'Just now',
      timestamp: new Date().toISOString(),
      relatedType: 'opportunity',
    };

    // If won, auto-create student record if not yet existing!
    let updatedStudents = [...globalState.students];
    if (newStage === 'Won' && !globalState.students.some((s) => s.email === lead.email)) {
      const newStudent: StudentItem = {
        id: `stud-${Date.now()}`,
        fullName: lead.fullName,
        email: lead.email,
        phone: lead.phone,
        programTitle: lead.programTitle,
        cohort: 'Cohort 2026-Q4',
        coachName: lead.ownerName !== 'Unassigned' ? lead.ownerName : 'Dr. Kalu E.',
        progressPercent: 0,
        attendanceRate: 100,
        paymentStatus: 'verified',
        amountPaid: lead.quotedPrice || lead.estimatedValue,
        balanceDue: 0,
        enrolledAt: new Date().toISOString().split('T')[0],
        status: 'onboarding',
      };
      updatedStudents.unshift(newStudent);
    }

    globalState = {
      ...globalState,
      leads: updatedLeads,
      students: updatedStudents,
      activities: [activity, ...globalState.activities],
    };
    notify();
  };

  const toggleTask = (taskId: string) => {
    const task = globalState.tasks.find((t) => t.id === taskId);
    if (!task) return;
    const isNowDone = !task.isCompleted;

    const updatedTasks = globalState.tasks.map((t) =>
      t.id === taskId ? { ...t, isCompleted: isNowDone } : t
    );

    const activity: ActivityItem = {
      id: `act-${Date.now()}`,
      actorName: currentUser.fullName,
      actorInitials: currentUser.avatarInitials,
      actionTitle: isNowDone ? `Completed task: ${task.title}` : `Reopened task: ${task.title}`,
      description: `Task status updated by ${currentUser.fullName}`,
      timeAgo: 'Just now',
      timestamp: new Date().toISOString(),
      relatedType: 'task',
    };

    globalState = {
      ...globalState,
      tasks: updatedTasks,
      activities: [activity, ...globalState.activities],
    };
    notify();
  };

  const addTask = (newTask: {
    title: string;
    assignee?: string;
    dueTime?: string;
    dueDate?: string;
    priority?: 'low' | 'medium' | 'high' | 'urgent';
    relatedContact?: string;
  }) => {
    const taskItem: TaskItem = {
      id: `task-${Date.now()}`,
      title: newTask.title,
      assignee: newTask.assignee || currentUser.fullName,
      dueTime: newTask.dueTime || '12:00',
      dueDate: newTask.dueDate || 'Today',
      isCompleted: false,
      priority: newTask.priority || 'medium',
      relatedContact: newTask.relatedContact,
      createdAt: new Date().toISOString(),
    };

    const activity: ActivityItem = {
      id: `act-${Date.now()}`,
      actorName: currentUser.fullName,
      actorInitials: currentUser.avatarInitials,
      actionTitle: `Created new task: ${newTask.title}`,
      description: `Assigned to ${taskItem.assignee} · Due: ${taskItem.dueDate} ${taskItem.dueTime}`,
      timeAgo: 'Just now',
      timestamp: new Date().toISOString(),
      relatedType: 'task',
    };

    globalState = {
      ...globalState,
      tasks: [taskItem, ...globalState.tasks],
      activities: [activity, ...globalState.activities],
    };
    notify();
  };

  const recordPayment = (data: {
    studentOrLeadName: string;
    programTitle: string;
    amountNGN: number;
    channel: 'Bank Transfer' | 'Paystack' | 'Flutterwave' | 'Installment' | 'Card';
    transactionRef: string;
    notes?: string;
    opportunityId?: string;
  }) => {
    const payment: PaymentRecord = {
      id: `pay-${Date.now()}`,
      studentOrLeadName: data.studentOrLeadName,
      programTitle: data.programTitle,
      amountNGN: Number(data.amountNGN),
      currency: 'NGN',
      channel: data.channel,
      transactionRef: data.transactionRef || `REF-${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'verified',
      verifiedBy: currentUser.fullName,
      recordedAt: new Date().toLocaleString(),
      notes: data.notes,
    };

    // If matches a lead, mark stage as Won and create student
    let updatedLeads = [...globalState.leads];
    let updatedStudents = [...globalState.students];

    const matchedLead = updatedLeads.find(
      (l) => l.fullName.toLowerCase() === data.studentOrLeadName.toLowerCase() || l.id === data.opportunityId
    );

    if (matchedLead) {
      updatedLeads = updatedLeads.map((l) =>
        l.id === matchedLead.id
          ? { ...l, stage: 'Won', quotedPrice: data.amountNGN, nextAction: 'Enrolled & Paid' }
          : l
      );

      if (!updatedStudents.some((s) => s.email === matchedLead.email)) {
        updatedStudents.unshift({
          id: `stud-${Date.now()}`,
          fullName: matchedLead.fullName,
          email: matchedLead.email,
          phone: matchedLead.phone,
          programTitle: matchedLead.programTitle,
          cohort: 'Cohort 2026-Q4',
          coachName: matchedLead.ownerName !== 'Unassigned' ? matchedLead.ownerName : 'Dr. Kalu E.',
          progressPercent: 0,
          attendanceRate: 100,
          paymentStatus: 'verified',
          amountPaid: data.amountNGN,
          balanceDue: 0,
          enrolledAt: new Date().toISOString().split('T')[0],
          status: 'active',
        });
      }
    }

    const activity: ActivityItem = {
      id: `act-${Date.now()}`,
      actorName: currentUser.fullName,
      actorInitials: currentUser.avatarInitials,
      actionTitle: `Verified payment of ₦${data.amountNGN.toLocaleString()}`,
      description: `From ${data.studentOrLeadName} via ${data.channel} · Ref: ${payment.transactionRef}`,
      timeAgo: 'Just now',
      timestamp: new Date().toISOString(),
      relatedType: 'finance',
    };

    globalState = {
      ...globalState,
      payments: [payment, ...globalState.payments],
      leads: updatedLeads,
      students: updatedStudents,
      activities: [activity, ...globalState.activities],
    };
    notify();
  };

  const scheduleSession = (session: {
    studentName: string;
    coachName: string;
    programTitle: string;
    sessionType: 'Consultation' | '1-on-1 Coaching' | 'Masterclass Review' | 'Project Audit' | 'Strategy Session';
    scheduledTime: string;
    dateStr: string;
    durationMinutes?: number;
  }) => {
    const newSession: CoachingSession = {
      id: `sess-${Date.now()}`,
      title: `${session.studentName} — ${session.sessionType}`,
      studentName: session.studentName,
      coachName: session.coachName,
      programTitle: session.programTitle,
      sessionType: session.sessionType,
      scheduledTime: session.scheduledTime,
      dateStr: session.dateStr || 'Tomorrow',
      durationMinutes: session.durationMinutes || 45,
      status: 'scheduled',
    };

    const activity: ActivityItem = {
      id: `act-${Date.now()}`,
      actorName: currentUser.fullName,
      actorInitials: currentUser.avatarInitials,
      actionTitle: `Scheduled ${session.sessionType}`,
      description: `Student: ${session.studentName} · Coach: ${session.coachName} · Time: ${session.scheduledTime}`,
      timeAgo: 'Just now',
      timestamp: new Date().toISOString(),
      relatedType: 'student',
    };

    globalState = {
      ...globalState,
      sessions: [newSession, ...globalState.sessions],
      activities: [activity, ...globalState.activities],
    };
    notify();
  };

  const toggleAutomation = (automationId: string) => {
    globalState = {
      ...globalState,
      automations: globalState.automations.map((a) =>
        a.id === automationId ? { ...a, isActive: !a.isActive } : a
      ),
    };
    notify();
  };

  const setCurrentUser = (staffId: string) => {
    globalState = {
      ...globalState,
      currentUserId: staffId,
    };
    notify();
  };

  const resetToDefaults = () => {
    localStorage.removeItem(STORAGE_KEY);
    globalState = getInitialState();
    notify();
  };

  return {
    state,
    currentUser,
    addLead,
    updateLeadStage,
    toggleTask,
    addTask,
    recordPayment,
    scheduleSession,
    toggleAutomation,
    setCurrentUser,
    resetToDefaults,
  };
};
