import { Rule, SortedItem } from './types';

export const INITIAL_RULES: Rule[] = [
  { id: '1', owner: 'Kevin', keyword: 'contracts', type: 'Concept' },
  { id: '2', owner: 'Kevin', keyword: 'legal questions', type: 'Concept' },
  { id: '3', owner: 'Kevin', keyword: 'litigation', type: 'Keyword' },
  { id: '4', owner: 'Vy', keyword: 'due diligence', type: 'Concept' },
  { id: '5', owner: 'Vy', keyword: 'marketing materials', type: 'Concept' },
  { id: '6', owner: 'Vy', keyword: 'Stonehaven Nexus platform', type: 'Concept' },
  { id: '7', owner: 'Vy', keyword: 'login issues', type: 'Keyword' },
];

export const MOCK_EMAILS: SortedItem[] = [
  {
    id: 'e1',
    threadId: 't1',
    sender: 'client@megacorp.com',
    subject: 'Review of MSA Agreement',
    body: 'Hi Team, could you please review the attached MSA contract? We have some legal questions regarding the liability clause.',
    timestamp: '2023-10-27T09:00:00Z',
    isReply: false,
    assignedTo: 'Kevin',
    status: 'New Issue',
    isRead: false,
    classificationReason: 'Contains keywords relating to contracts and legal questions.'
  },
  {
    id: 'e2',
    threadId: 't2',
    sender: 'investor@fund.com',
    subject: 'Nexus Platform Access & DD',
    body: 'I am trying to access the Stonehaven Nexus platform to download the due diligence reports but my login is failing.',
    timestamp: '2023-10-27T10:30:00Z',
    isReply: false,
    assignedTo: 'Vy',
    status: 'New Issue',
    isRead: false,
    classificationReason: 'Discusses Stonehaven Nexus platform and due diligence.'
  },
  {
    id: 'e3',
    threadId: 't1', // Reply to t1
    sender: 'client@megacorp.com',
    subject: 'Re: Review of MSA Agreement',
    body: 'Following up on this, do we have an ETA?',
    timestamp: '2023-10-28T09:15:00Z',
    isReply: true,
    assignedTo: 'Kevin',
    status: 'New Reply',
    isRead: false,
    classificationReason: 'Reply to existing thread assigned to Kevin.'
  },
  {
    id: 'e4',
    threadId: 't3',
    sender: 'partner@legalmarketing.com',
    subject: 'Contract Marketing Blurb',
    body: 'Can we get approval on the marketing materials? Also, does the contract allow us to use the logo?',
    timestamp: '2023-10-28T11:00:00Z',
    isReply: false,
    assignedTo: 'Both',
    status: 'New Issue',
    isRead: true,
    classificationReason: 'Mentions both marketing materials (Vy) and contract terms (Kevin).'
  },
  {
    id: 'e5',
    threadId: 't4',
    sender: 'Kevin@stonehaven.com',
    subject: 'Internal: Project Alpha',
    body: 'Done.',
    timestamp: '2023-10-28T14:00:00Z',
    isReply: true,
    assignedTo: 'Kevin',
    status: 'Completed',
    isRead: true,
    classificationReason: 'Sender marked as Done.'
  }
];
