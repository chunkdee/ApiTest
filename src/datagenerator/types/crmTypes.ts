// types/crmTypes.ts


export type OpportunityStage =  'Prospecting' | 'Qualification' | 'Proposal' | 'Negotiation' | 'Closed Won' | 'Closed Lost';

export enum TaskTitle {
  CALL = 'Call',
  EMAIL = 'Email',
  MEETING = 'Meeting',
  FOLLOW_UP = 'Follow Up',
  REVIEW = 'Review',
  PROPOSAL = 'Proposal',
  CONTRACT = 'Contract',
  DEMO = 'Demo'
}

export enum DealStatus {
  New = 'New',
  Qualified = 'Qualified',
  Proposal = 'Proposal',
  Negotiation = 'Negotiation',
  ClosedWon = 'Closed Won',
  ClosedLost = 'Closed Lost'
}

export enum DealStage {
  InitialContact = 'Initial Contact',
  Meeting = 'Meeting',
  Proposal = 'Proposal',
  Contract = 'Contract',
  Closed = 'Closed'
}

type Identifier = string | number;

interface BaseEntity<IdentifierType extends Identifier = Identifier>
    extends Record<string, any> {
    id: IdentifierType;
    createdAt: Date;
    updatedAt: Date;
}

// Supabase User Entity
interface User extends BaseEntity {
  email: string;
  phone?: string;
  confirmed_at?: Date;
  email_confirmed_at?: Date;
  phone_confirmed_at?: Date;
  last_sign_in_at?: Date;
  role?: string;
  aud: string;
  profile?: Profile;  // Relationship to Profile
}

// Permission type definitions
type Action = 'create' | 'read' | 'update' | 'delete' | 'manage';
type Resource = 'users' | 'contacts' | 'companies' | 'opportunities' | 'leads' | 'activities' | 'notes' | 'tasks' | 'reports';

interface Permission {
  action: Action;
  resource: Resource;
  conditions?: Record<string, any>;
}

// Permission type definitions
export interface PermissionSubject {
  subject: Resource;
  actions: Action[];
  conditions?: {
    [key: string]: any;
  };
}

interface RolePermission {
  role: string;
  permissions: PermissionSubject[];
}

// Profile Entity (formerly User)
 interface Profile extends BaseEntity {
  userId: string;  // Foreign key to User
  user?: User;     // Relationship to User
  firstName: string;
  lastName: string;
  role: 'Admin' | 'Sales' | 'Support' | 'Manager';
  isActive: boolean;
  profileImage?: string;
  permissions: PermissionSubject[];  // Updated permissions type
  contacts?: Contact[];
  companies?: Company[];
  opportunities?: Opportunity[];
  leads?: Lead[];
  activities?: Activity[];
  notes?: Note[];
  tasks?: Task[];
}

// Contact Entity
interface Contact extends BaseEntity {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  position?: string;  // Added position property
  profileImage?: string; // URL to the contact's profile image
  companyId?: string;
  company?: Company;
  opportunities?: Opportunity[];
  activities?: Activity[];
  notes?: Note[];
  tasks?: Task[];
}

// Company Entity (formerly Account)
interface Company extends BaseEntity {
  name: string;
  industry: string;
  website?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  logo?: string; // URL to the company's logo
  contacts?: Contact[];
  opportunities?: Opportunity[];
  activities?: Activity[];
  notes?: Note[];
  tasks?: Task[];
}

// Opportunity Entity
interface Opportunity extends BaseEntity {
  name: string;
  amount: number;
  stage: OpportunityStage;
  probability: number;
  description?: string;
  closeDate: Date;
  companyId: string;
  company?: Company;
  contacts?: Contact[];  // Changed from single contact to contacts array
  activities?: Activity[];
  notes?: Note[];
  tasks?: Task[];
}

// Lead Entity
interface Lead extends BaseEntity {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  profileImage?: string; // URL to the lead's profile image
  status: 'New' | 'Contacted' | 'Qualified' | 'Lost';
  source?: 'Web' | 'Referral' | 'Advertisement';
  assignedToId?: string;
  assignedTo?: Profile;  // Changed from User to Profile
  activities?: Activity[];
  notes?: Note[];
  tasks?: Task[];
}

// Activity Entity
interface Activity extends BaseEntity {
  type: 'Call' | 'Email' | 'Meeting' | 'Task';
  description: string;
  dueDate: Date;
  completed: boolean;
  profileId?: string;
  profile?: Profile;  // Changed from user to profile
  contactId?: string;
  contact?: Contact;
  companyId?: string;
  company?: Company;
  opportunityId?: string;
  opportunity?: Opportunity;
  leadId?: string;
  lead?: Lead;
}

// Note Entity
interface Note extends BaseEntity {
  content: string;
  profileId: string;
  profile?: Profile;  // Changed from user to profile
  contactId?: string;
  contact?: Contact;
  companyId?: string;
  company?: Company;
  opportunityId?: string;
  opportunity?: Opportunity;
  leadId?: string;
  lead?: Lead;
}

// Task Entity
interface Task extends BaseEntity {
  title: string //TaskTitle;
  description: string;
  dueDate: Date;
  completed: boolean;
  profileId?: string;
  profile?: Profile;  // Changed from user to profile
  contactId?: string;
  contact?: Contact;
  companyId?: string;
  company?: Company;
  opportunityId?: string;
  opportunity?: Opportunity;
  leadId?: string;
  lead?: Lead;
}

// Report Entity
interface Report extends BaseEntity {
  name: string;
  type: 'Sales' | 'Support' | 'Marketing';
  generatedByProfileId: string;  // Changed from generatedBy
  profile?: Profile;
  generatedOn: Date;
  content: string;
}

interface Quote extends BaseEntity {
  quoteNumber: string;
  opportunityId: Identifier;
  opportunity?: Opportunity;
  contactId: Identifier;
  contact?: Contact;
  companyId: Identifier;
  company?: Company;
  items: QuoteItem[];
  totalAmount: number;
  status: 'Draft' | 'Sent' | 'Accepted' | 'Rejected';
}

interface QuoteItem {
  productId: Identifier;
  product?: any[]//ProductService;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

// Exporting all types
export type {
  BaseEntity,
  User,
  Profile,  // Added Profile to exports
  Permission,  // Export Permission type
  Contact,
  Company,
  Opportunity,
  Lead,
  Activity,
  Note,
  Task,
  Report,
  Quote,
};