export type Assignment = 'Kevin' | 'Vy' | 'Both' | 'Unassigned';

export type IssueStatus = 'New Issue' | 'New Reply' | 'Completed';

export interface Email {
  id: string;
  sender: string;
  subject: string;
  body: string;
  timestamp: string;
  threadId: string;
  isReply: boolean;
}

export interface SortedItem extends Email {
  assignedTo: Assignment;
  status: IssueStatus;
  isRead: boolean;
  classificationReason?: string;
}

export interface Rule {
  id: string;
  owner: 'Kevin' | 'Vy';
  keyword: string;
  type: 'Keyword' | 'Concept';
}

export interface ClassificationResult {
  assignedTo: Assignment;
  isCompleted: boolean;
  reason: string;
}
