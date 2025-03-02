// generateSampleData.ts

import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';

import {
  User,
  Profile,
  Company,
  Contact,
  Opportunity,
  Lead,
  Activity,
  Note,
  Task,
  Report,
  PermissionSubject
} from './types/crmTypes'; // Adjust the import path as needed

// Helper function to generate a random date within the last year
function getRandomDate(): Date {
  const now = new Date();
  const past = new Date(now);
  past.setFullYear(now.getFullYear() - 1);
  return new Date(past.getTime() + Math.random() * (now.getTime() - past.getTime()));
}

// Generate sample users with Supabase auth structure
function generateUsers(count: number): User[] {
  return Array.from({ length: count }, () => ({
    id: uuidv4(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    confirmed_at: getRandomDate(),
    email_confirmed_at: getRandomDate(),
    phone_confirmed_at: getRandomDate(),
    last_sign_in_at: getRandomDate(),
    role: faker.helpers.arrayElement(['authenticated', 'admin']),
    aud: 'authenticated',
    createdAt: getRandomDate(),
    updatedAt: getRandomDate()
  }));
}

// Generate sample profiles
function generateProfiles(users: User[]): Profile[] {
  const defaultPermissions: PermissionSubject[] = [
    {
      subject: 'opportunities',
      actions: ['create', 'read', 'update'],
      conditions: {
        companyId: 'auth.user.company_id'
      }
    },
    {
      subject: 'contacts',
      actions: ['read', 'update'],
      conditions: {
        ownerId: 'auth.user.id'
      }
    }
  ];

  return users.map(user => ({
    id: uuidv4(),
    userId: String(user.id),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    role: faker.helpers.arrayElement(['Admin', 'Sales', 'Support', 'Manager']),
    isActive: faker.datatype.boolean(),
    profileImage: faker.image.avatar(),
    permissions: defaultPermissions,
    createdAt: getRandomDate(),
    updatedAt: getRandomDate(),
  }));
}

// Generate sample companies
function generateCompanies(count: number): Company[] {
  return Array.from({ length: count }, () => ({
    id: uuidv4(),
    name: faker.company.name(),
    industry: faker.company.buzzNoun(),
    website: faker.internet.url(),
    phone: faker.phone.number(),
    address: faker.location.streetAddress(),
    city: faker.location.city(),
    state: faker.location.state(),
    postalCode: faker.location.zipCode(),
    country: faker.location.country(),
    logo: faker.image.urlLoremFlickr({ category: 'business' }),
    createdAt: getRandomDate(),
    updatedAt: getRandomDate(),
  }));
}

// Generate sample contacts
function generateContacts(count: number, companies: Company[]): Contact[] {
  return Array.from({ length: count }, () => {
    const company = faker.helpers.arrayElement(companies);
    return {
      id: uuidv4(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      profileImage: faker.image.avatar(),
      position: faker.person.jobTitle(), // Added position field
      companyId: String(company.id),
      createdAt: getRandomDate(),
      updatedAt: getRandomDate(),
    };
  });
}

// Update generateOpportunities function
function generateOpportunities(count: number, companies: Company[], contacts: Contact[]): Opportunity[] {
  return Array.from({ length: count }, () => {
    // Select random number of contacts (1-3) for this opportunity
    const opportunityContacts = faker.helpers.arrayElements(contacts, faker.number.int({ min: 1, max: 3 }));
    
    return {
      id: uuidv4(),
      name: faker.company.buzzPhrase(),
      amount: faker.number.float({ min: 10000, max: 1000000, fractionDigits: 2 }),
      stage: faker.helpers.arrayElement(['Prospecting', 'Qualification', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost']),
      probability: faker.number.int({ min: 0, max: 100 }),
      description: faker.company.catchPhrase(),
      closeDate: getRandomDate(),
      companyId: String(faker.helpers.arrayElement(companies).id),
      contacts: opportunityContacts, // Changed from contactId to contacts array
      createdAt: getRandomDate(),
      updatedAt: getRandomDate(),
    };
  });
}

// Update other generate functions to use Profile instead of User
function generateLeads(count: number, profiles: Profile[]): Lead[] {
  return Array.from({ length: count }, () => ({
    id: uuidv4(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    company: faker.company.name(),
    profileImage: faker.image.avatar(),
    status: faker.helpers.arrayElement(['New', 'Contacted', 'Qualified', 'Lost']),
    source: faker.helpers.arrayElement(['Web', 'Referral', 'Advertisement']),
    assignedToId: String(faker.helpers.arrayElement(profiles).id),
    createdAt: getRandomDate(),
    updatedAt: getRandomDate(),
  }));
}

// Update activities to use Profile
function generateActivities(count: number, profiles: Profile[], contacts: Contact[], companies: Company[], opportunities: Opportunity[], leads: Lead[]): Activity[] {
  return Array.from({ length: count }, () => ({
    id: uuidv4(),
    type: faker.helpers.arrayElement(['Call', 'Email', 'Meeting', 'Task']),
    description: faker.lorem.sentence(),
    dueDate: getRandomDate(),
    completed: faker.datatype.boolean(),
    profileId: String(faker.helpers.arrayElement(profiles).id),
    contactId: String(faker.helpers.arrayElement(contacts).id),
    companyId: String(faker.helpers.arrayElement(companies).id),
    opportunityId: String(faker.helpers.arrayElement(opportunities).id),
    leadId: String(faker.helpers.arrayElement(leads).id),
    createdAt: getRandomDate(),
    updatedAt: getRandomDate(),
  }));
}

// Generate sample notes with Profile
function generateNotes(count: number, profiles: Profile[], contacts: Contact[], companies: Company[], opportunities: Opportunity[], leads: Lead[]): Note[] {
  return Array.from({ length: count }, () => ({
    id: uuidv4(),
    content: faker.lorem.paragraph(),
    profileId: String(faker.helpers.arrayElement(profiles).id),
    contactId: String(faker.helpers.arrayElement(contacts).id),
    companyId: String(faker.helpers.arrayElement(companies).id),
    opportunityId: String(faker.helpers.arrayElement(opportunities).id),
    leadId: String(faker.helpers.arrayElement(leads).id),
    createdAt: getRandomDate(),
    updatedAt: getRandomDate(),
  }));
}

// Generate sample tasks with Profile
function generateTasks(count: number, profiles: Profile[], contacts: Contact[], companies: Company[], opportunities: Opportunity[], leads: Lead[]): Task[] {
  return Array.from({ length: count }, () => ({
    id: uuidv4(),
    title: faker.lorem.words(),
    description: faker.lorem.sentence(),
    dueDate: getRandomDate(),
    completed: faker.datatype.boolean(),
    profileId: String(faker.helpers.arrayElement(profiles).id),
    contactId: String(faker.helpers.arrayElement(contacts).id),
    companyId: String(faker.helpers.arrayElement(companies).id),
    opportunityId: String(faker.helpers.arrayElement(opportunities).id),
    leadId: String(faker.helpers.arrayElement(leads).id),
    createdAt: getRandomDate(),
    updatedAt: getRandomDate(),
  }));
}

// Generate sample reports with Profile
function generateReports(count: number, profiles: Profile[]): Report[] {
  return Array.from({ length: count }, () => ({
    id: uuidv4(),
    name: faker.lorem.words(),
    type: faker.helpers.arrayElement(['Sales', 'Support', 'Marketing']),
    generatedByProfileId: String(faker.helpers.arrayElement(profiles).id),
    generatedOn: getRandomDate(),
    content: faker.lorem.paragraphs(),
    createdAt: getRandomDate(),
    updatedAt: getRandomDate(),
  }));
}

// Update the main function
function generateSampleData(userCount: number, companyCount: number, contactCount: number, opportunityCount: number, leadCount: number, activityCount: number, noteCount: number, taskCount: number, reportCount: number) {
  const users = generateUsers(userCount);
  const profiles = generateProfiles(users);
  const companies = generateCompanies(companyCount);
  const contacts = generateContacts(contactCount, companies);
  const opportunities = generateOpportunities(opportunityCount, companies, contacts);
  const leads = generateLeads(leadCount, profiles);
  const activities = generateActivities(activityCount, profiles, contacts, companies, opportunities, leads);
  const notes = generateNotes(noteCount, profiles, contacts, companies, opportunities, leads);
  const tasks = generateTasks(taskCount, profiles, contacts, companies, opportunities, leads);
  const reports = generateReports(reportCount, profiles);

  // Connect related entities using flatMap
  profiles.forEach(profile => {
    profile.user = users.find(user => user.id === profile.userId);
    profile.contacts = contacts.filter(contact => contact.companyId && companies.some(company => company.id === contact.companyId));
    profile.companies = companies.filter(company => contacts.some(contact => contact.companyId === company.id));
    profile.opportunities = opportunities.filter(opportunity => opportunity.companyId && companies.some(company => company.id === opportunity.companyId));
    profile.leads = leads.filter(lead => lead.assignedToId === profile.id);
    profile.activities = activities.filter(activity => activity.profileId === profile.id);
    profile.notes = notes.filter(note => note.userId === profile.id);
    profile.tasks = tasks.filter(task => task.userId === profile.id);
  });

  companies.forEach(company => {
    company.contacts = contacts.filter(contact => contact.companyId === company.id);
    company.opportunities = opportunities.filter(opportunity => opportunity.companyId === company.id);
    company.activities = activities.filter(activity => activity.companyId === company.id);
    company.notes = notes.filter(note => note.companyId === company.id);
    company.tasks = tasks.filter(task => task.companyId === company.id);
  });

  contacts.forEach(contact => {
    contact.company = companies.find(company => company.id === contact.companyId);
    contact.opportunities = opportunities.filter(opportunity => opportunity.contacts?.some(c => c.id === contact.id) || false);
    contact.activities = activities.filter(activity => activity.contactId === contact.id);
    contact.notes = notes.filter(note => note.contactId === contact.id);
    contact.tasks = tasks.filter(task => task.contactId === contact.id);
  });

  opportunities.forEach(opportunity => {
    opportunity.company = companies.find(company => company.id === opportunity.companyId);
    // Remove the old contact relationship
    // opportunity.contact = contacts.find(contact => contact.id === opportunity.contactId);
    opportunity.activities = activities.filter(activity => activity.opportunityId === opportunity.id);
    opportunity.notes = notes.filter(note => note.opportunityId === opportunity.id);
    opportunity.tasks = tasks.filter(task => task.opportunityId === opportunity.id);
  });

  leads.forEach(lead => {
    lead.assignedTo = profiles.find(profile => profile.id === lead.assignedToId);
    lead.activities = activities.filter(activity => activity.leadId === lead.id);
    lead.notes = notes.filter(note => note.leadId === lead.id);
    lead.tasks = tasks.filter(task => task.leadId === lead.id);
  });

  activities.forEach(activity => {
    activity.user = profiles.find(profile => profile.id === activity.profileId);
    activity.contact = contacts.find(contact => contact.id === activity.contactId);
    activity.company = companies.find(company => company.id === activity.companyId);
    activity.opportunity = opportunities.find(opportunity => opportunity.id === activity.opportunityId);
    activity.lead = leads.find(lead => lead.id === activity.leadId);
  });

  notes.forEach(note => {
    note.user = profiles.find(profile => profile.id === note.userId);
    note.contact = contacts.find(contact => contact.id === note.contactId);
    note.company = companies.find(company => company.id === note.companyId);
    note.opportunity = opportunities.find(opportunity => opportunity.id === note.opportunityId);
    note.lead = leads.find(lead => lead.id === note.leadId);
  });

  tasks.forEach(task => {
    task.user = profiles.find(profile => profile.id === task.userId);
    task.contact = contacts.find(contact => contact.id === task.contactId);
    task.company = companies.find(company => company.id === task.companyId);
    task.opportunity = opportunities.find(opportunity => opportunity.id === task.opportunityId);
    task.lead = leads.find(lead => lead.id === task.leadId);
  });

  reports.forEach(report => {
    report.generatedBy = String(users.find(user => user.id === report.generatedBy) || '');
  });


  // Write the generated data to a JSON file
  const data = {
    users,
    profiles,
    companies,
    contacts,
    opportunities,
    leads,
    activities,
    notes,
    tasks,
    reports,
  };

  return data;
}

// Update the export to provide clean data without circular references
function getCleanData() {
  const rawData = generateSampleData(5, 15, 10, 10, 5, 5, 5, 5, 5);
  
  const cleanData = {
    users: rawData.users.map(user => ({
      id: user.id,
      email: user.email,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    })),
    
    profiles: rawData.profiles.map(profile => ({
      id: profile.id,
      userId: profile.userId,
      firstName: profile.firstName,
      lastName: profile.lastName,
      role: profile.role,
      isActive: profile.isActive,
      profileImage: profile.profileImage,
      permissions: profile.permissions,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt
    })),
    
    companies: rawData.companies.map(company => ({
      id: company.id,
      name: company.name,
      industry: company.industry,
      website: company.website,
      phone: company.phone,
      address: company.address,
      city: company.city,
      state: company.state,
      postalCode: company.postalCode,
      country: company.country,
      logo: company.logo,
      createdAt: company.createdAt,
      updatedAt: company.updatedAt,
      contactIds: company.contacts?.map(c => c.id) || [],
      opportunityIds: company.opportunities?.map(o => o.id) || []
    })),
    
    contacts: rawData.contacts.map(contact => ({
      id: contact.id,
      firstName: contact.firstName,
      lastName: contact.lastName,
      email: contact.email,
      phone: contact.phone,
      profileImage: contact.profileImage,
      position: contact.position,
      companyId: contact.companyId,
      createdAt: contact.createdAt,
      updatedAt: contact.updatedAt,
      opportunityIds: contact.opportunities?.map(o => o.id) || []
    })),
    
    opportunities: rawData.opportunities.map(opportunity => ({
      id: opportunity.id,
      name: opportunity.name,
      amount: opportunity.amount,
      stage: opportunity.stage,
      probability: opportunity.probability,
      description: opportunity.description,
      closeDate: opportunity.closeDate,
      companyId: opportunity.companyId,
      contactIds: opportunity.contacts?.map(c => c.id) || [],
      createdAt: opportunity.createdAt,
      updatedAt: opportunity.updatedAt
    })),
    
    activities: rawData.activities.map(activity => ({
      id: activity.id,
      type: activity.type,
      description: activity.description,
      dueDate: activity.dueDate,
      completed: activity.completed,
      profileId: activity.profileId,
      contactId: activity.contactId,
      companyId: activity.companyId,
      opportunityId: activity.opportunityId,
      createdAt: activity.createdAt,
      updatedAt: activity.updatedAt
    })),
    
    notes: rawData.notes.map(note => ({
      id: note.id,
      content: note.content,
      profileId: note.profileId,
      contactId: note.contactId,
      companyId: note.companyId,
      opportunityId: note.opportunityId,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt
    })),
    
    tasks: rawData.tasks.map(task => ({
      id: task.id,
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      completed: task.completed,
      profileId: task.profileId,
      contactId: task.contactId,
      companyId: task.companyId,
      opportunityId: task.opportunityId,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt
    }))
  };

  return cleanData;
}

export default getCleanData();