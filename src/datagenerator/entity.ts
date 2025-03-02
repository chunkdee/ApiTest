// types/crmTypes.ts

// Base Entity
interface BaseEntity {
    id: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
  // User Entity
  interface User extends BaseEntity {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    role: 'Admin' | 'Sales' | 'Support' | 'Manager';
    isActive: boolean;
    profileImage?: string; // URL to the user's profile image
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
    stage: 'Prospecting' | 'Qualification' | 'Proposal' | 'Negotiation' | 'Closed Won' | 'Closed Lost';
    closeDate: Date;
    companyId: string;
    company?: Company;
    contactId?: string;
    contact?: Contact;
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
    assignedTo?: User;
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
    userId?: string;
    user?: User;
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
    userId: string;
    user?: User;
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
    title: string;
    description: string;
    dueDate: Date;
    completed: boolean;
    userId?: string;
    user?: User;
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
    generatedBy: string;
    generatedOn: Date;
    content: string;
  }
  
  // Exporting all types
  export type {
    BaseEntity,
    User,
    Contact,
    Company,
    Opportunity,
    Lead,
    Activity,
    Note,
    Task,
    Report,
  };