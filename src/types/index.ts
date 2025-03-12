/**
 * @fileoverview タスク管理アプリケーションの型定義
 * @description アプリケーション全体で使用される型定義を提供します
 */

/**
 * ボード情報の型定義
 */
export interface Board {
  id: string;
  title: string;
  background: string;
  lists: List[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * リスト情報の型定義
 */
export interface List {
  id: string;
  boardId: string;
  title: string;
  cards: Card[];
  position: number;
  archived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * カード情報の型定義
 */
export interface Card {
  id: string;
  listId: string;
  title: string;
  description: string;
  position: number;
  dueDate: Date | null;
  labels: Label[];
  checklists: Checklist[];
  attachments: Attachment[];
  comments: Comment[];
  assignedUsers: User[];
  archived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * ラベル情報の型定義
 */
export interface Label {
  id: string;
  name: string;
  color: string;
}

/**
 * チェックリスト情報の型定義
 */
export interface Checklist {
  id: string;
  title: string;
  items: ChecklistItem[];
}

/**
 * チェックリストアイテム情報の型定義
 */
export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

/**
 * 添付ファイル情報の型定義
 */
export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  createdAt: Date;
}

/**
 * コメント情報の型定義
 */
export interface Comment {
  id: string;
  text: string;
  userId: string;
  createdAt: Date;
  user: User;
}

/**
 * ユーザー情報の型定義
 */
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

/**
 * 通知情報の型定義
 */
export interface Notification {
  id: string;
  type: 'due' | 'mention' | 'activity';
  message: string;
  read: boolean;
  cardId?: string;
  userId?: string;
  createdAt: Date;
}

/**
 * フィルター情報の型定義
 */
export interface Filter {
  labels: string[];
  dueDate: 'overdue' | 'today' | 'week' | 'month' | 'none' | null;
  assignedUsers: string[];
}

/**
 * 自動化ルール情報の型定義
 */
export interface AutomationRule {
  id: string;
  boardId: string;
  name: string;
  trigger: {
    type: 'dueDate' | 'label' | 'checklist';
    condition: any;
  };
  action: {
    type: 'moveList' | 'addLabel' | 'notify';
    data: any;
  };
  active: boolean;
} 