/**
 * @fileoverview カード詳細表示コンポーネント
 * @description カードの詳細情報を表示・編集するためのモーダルコンポーネント
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  ClockIcon, 
  TagIcon, 
  CheckIcon, 
  PaperClipIcon, 
  UserIcon, 
  XMarkIcon as XIcon, 
  PlusIcon, 
  TrashIcon
} from '@heroicons/react/24/outline';
import { Card, Checklist, ChecklistItem, Comment } from '../../types';
import { formatDate } from '../../utils/helpers';

/**
 * カード詳細表示コンポーネントのプロパティ
 */
interface CardDetailViewProps {
  card: Card;
  onClose: () => void;
  onUpdate: (data: Partial<Card>) => void;
}

/**
 * カード詳細表示コンポーネント
 * @param {CardDetailViewProps} props - コンポーネントのプロパティ
 * @returns {JSX.Element} カード詳細表示コンポーネント
 */
const CardDetailView: React.FC<CardDetailViewProps> = ({ card, onClose, onUpdate }) => {
  // 状態管理
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description || '');
  const [dueDate, setDueDate] = useState<string>(card.dueDate ? new Date(card.dueDate).toISOString().split('T')[0] : '');
  const [activeTab, setActiveTab] = useState<'main' | 'activity'>('main');
  const [newComment, setNewComment] = useState('');
  const [newChecklistTitle, setNewChecklistTitle] = useState('');
  const [showAddChecklist, setShowAddChecklist] = useState(false);
  const [editingChecklistId, setEditingChecklistId] = useState<string | null>(null);
  const [newChecklistItemText, setNewChecklistItemText] = useState('');

  // 参照
  const modalRef = useRef<HTMLDivElement>(null);
  const titleInputRef = useRef<HTMLTextAreaElement>(null);

  // タイトル更新ハンドラー
  const handleTitleUpdate = () => {
    if (title.trim() !== card.title) {
      onUpdate({ title: title.trim() });
    }
  };

  // 説明更新ハンドラー
  const handleDescriptionUpdate = () => {
    if (description.trim() !== card.description) {
      onUpdate({ description: description.trim() });
    }
  };

  // 期限日更新ハンドラー
  const handleDueDateUpdate = (newDate: string) => {
    setDueDate(newDate);
    onUpdate({ dueDate: newDate ? new Date(newDate) : null });
  };

  // チェックリスト追加ハンドラー
  const handleAddChecklist = () => {
    if (newChecklistTitle.trim()) {
      const newChecklist: Checklist = {
        id: `checklist-${Date.now()}`,
        title: newChecklistTitle.trim(),
        items: []
      };
      
      onUpdate({
        checklists: [...card.checklists, newChecklist]
      });
      
      setNewChecklistTitle('');
      setShowAddChecklist(false);
    }
  };

  // チェックリストアイテム追加ハンドラー
  const handleAddChecklistItem = (checklistId: string) => {
    if (newChecklistItemText.trim()) {
      const newItem: ChecklistItem = {
        id: `item-${Date.now()}`,
        text: newChecklistItemText.trim(),
        completed: false
      };
      
      const updatedChecklists = card.checklists.map(list => {
        if (list.id === checklistId) {
          return {
            ...list,
            items: [...list.items, newItem]
          };
        }
        return list;
      });
      
      onUpdate({ checklists: updatedChecklists });
      setNewChecklistItemText('');
      setEditingChecklistId(null);
    }
  };

  // チェックリストアイテム完了状態切り替えハンドラー
  const handleToggleChecklistItem = (checklistId: string, itemId: string) => {
    const updatedChecklists = card.checklists.map(list => {
      if (list.id === checklistId) {
        return {
          ...list,
          items: list.items.map(item => {
            if (item.id === itemId) {
              return { ...item, completed: !item.completed };
            }
            return item;
          })
        };
      }
      return list;
    });
    
    onUpdate({ checklists: updatedChecklists });
  };

  // コメント追加ハンドラー
  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: `comment-${Date.now()}`,
        text: newComment.trim(),
        createdAt: new Date(),
        userId: 'current-user',
        user: {
          id: 'current-user',
          name: 'Current User',
          email: '',
          avatar: ''
        }
      };
      
      onUpdate({
        comments: [...card.comments, comment]
      });
      
      setNewComment('');
    }
  };

  // モーダル外クリックハンドラー
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  // ESCキーでモーダルを閉じる
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [onClose]);

  // タイトル入力フィールドにフォーカス
  useEffect(() => {
    if (titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, []);

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div 
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* ヘッダー */}
        <div className="p-4 border-b flex justify-between items-center">
          <div className="flex items-center">
            <button
              className={`px-4 py-2 font-medium ${activeTab === 'main' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
              onClick={() => setActiveTab('main')}
            >
              カード
            </button>
            <button
              className={`px-4 py-2 font-medium ${activeTab === 'activity' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
              onClick={() => setActiveTab('activity')}
            >
              アクティビティ
            </button>
          </div>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        {/* コンテンツ */}
        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col md:flex-row h-full">
            {/* メインコンテンツ */}
            <div className="flex-1 p-4 overflow-y-auto">
              {/* タイトル */}
              <div className="mb-4">
                <textarea
                  ref={titleInputRef}
                  className="w-full text-xl font-bold p-2 border border-gray-300 rounded resize-none"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  onBlur={handleTitleUpdate}
                  rows={2}
                />
              </div>

              {/* リスト内の位置 */}
              <div className="mb-4 text-sm text-gray-600">
                <span>リスト内のカード</span>
              </div>

              {/* 説明 */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">説明</h3>
                <textarea
                  className="w-full p-3 border border-gray-300 rounded resize-none min-h-[100px]"
                  placeholder="カードの説明を追加..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  onBlur={handleDescriptionUpdate}
                />
              </div>

              {/* チェックリスト */}
              {card.checklists.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">チェックリスト</h3>
                  
                  {card.checklists.map(checklist => {
                    // チェックリストの完了率を計算
                    const totalItems = checklist.items.length;
                    const completedItems = checklist.items.filter(item => item.completed).length;
                    const progress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;
                    
                    return (
                      <div key={checklist.id} className="mb-4 bg-gray-50 p-3 rounded">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">{checklist.title}</h4>
                          <button className="text-gray-500 hover:text-red-500">
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                        
                        {/* 進捗バー */}
                        <div className="mb-3">
                          <div className="flex justify-between text-xs text-gray-600 mb-1">
                            <span>{completedItems}/{totalItems}</span>
                            <span>{Math.round(progress)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full" 
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        {/* チェックリストアイテム */}
                        <ul className="space-y-2">
                          {checklist.items.map(item => (
                            <li key={item.id} className="flex items-start">
                              <input
                                type="checkbox"
                                checked={item.completed}
                                onChange={() => handleToggleChecklistItem(checklist.id, item.id)}
                                className="mt-1 mr-2 cursor-pointer"
                                id={`checkbox-${item.id}`}
                              />
                              <label 
                                htmlFor={`checkbox-${item.id}`}
                                className={`${item.completed ? 'line-through text-gray-500' : ''} cursor-pointer flex-grow`}
                                onClick={() => handleToggleChecklistItem(checklist.id, item.id)}
                              >
                                {item.text}
                              </label>
                            </li>
                          ))}
                        </ul>
                        
                        {/* 新しいアイテム追加 */}
                        {editingChecklistId === checklist.id ? (
                          <div className="mt-3">
                            <input
                              type="text"
                              className="w-full p-2 border border-gray-300 rounded mb-2"
                              placeholder="新しいアイテムを追加..."
                              value={newChecklistItemText}
                              onChange={e => setNewChecklistItemText(e.target.value)}
                              autoFocus
                            />
                            <div className="flex space-x-2">
                              <button
                                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                onClick={() => handleAddChecklistItem(checklist.id)}
                              >
                                追加
                              </button>
                              <button
                                className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                                onClick={() => setEditingChecklistId(null)}
                              >
                                キャンセル
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            className="mt-3 flex items-center text-gray-600 hover:text-gray-900"
                            onClick={() => setEditingChecklistId(checklist.id)}
                          >
                            <PlusIcon className="h-4 w-4 mr-1" />
                            <span>アイテムを追加</span>
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* アクティビティ/コメント */}
              {activeTab === 'activity' && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">アクティビティ</h3>
                  
                  {/* コメント入力 */}
                  <div className="mb-4">
                    <textarea
                      className="w-full p-3 border border-gray-300 rounded resize-none"
                      placeholder="コメントを追加..."
                      value={newComment}
                      onChange={e => setNewComment(e.target.value)}
                      rows={3}
                    />
                    <button
                      className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                      disabled={!newComment.trim()}
                      onClick={handleAddComment}
                    >
                      コメントを保存
                    </button>
                  </div>
                  
                  {/* コメント一覧 */}
                  <div className="space-y-4">
                    {card.comments.map(comment => (
                      <div key={comment.id} className="flex space-x-3">
                        <div className="flex-shrink-0">
                          {comment.user.avatar ? (
                            <img
                              src={comment.user.avatar}
                              alt={comment.user.name}
                              className="h-8 w-8 rounded-full"
                            />
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-blue-500 text-white flex items-center justify-center">
                              {comment.user.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center">
                            <span className="font-medium">{comment.user.name}</span>
                            <span className="ml-2 text-xs text-gray-500">
                              {formatDate(comment.createdAt, 'long')}
                            </span>
                          </div>
                          <div className="mt-1 text-gray-800">{comment.text}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* サイドバー */}
            <div className="w-full md:w-64 p-4 bg-gray-50 border-l">
              <h3 className="text-sm font-medium text-gray-700 mb-3">アクション</h3>
              
              <div className="space-y-3">
                {/* ラベル */}
                <button className="flex items-center w-full p-2 text-gray-700 hover:bg-gray-100 rounded">
                  <TagIcon className="h-5 w-5 mr-2 text-gray-500" />
                  <span>ラベル</span>
                </button>
                
                {/* チェックリスト */}
                {showAddChecklist ? (
                  <div className="p-2 bg-white border rounded shadow-sm">
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded mb-2"
                      placeholder="チェックリストのタイトル"
                      value={newChecklistTitle}
                      onChange={e => setNewChecklistTitle(e.target.value)}
                      autoFocus
                    />
                    <div className="flex space-x-2">
                      <button
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                        onClick={handleAddChecklist}
                      >
                        追加
                      </button>
                      <button
                        className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                        onClick={() => setShowAddChecklist(false)}
                      >
                        キャンセル
                      </button>
                    </div>
                  </div>
                ) : (
                  <button 
                    className="flex items-center w-full p-2 text-gray-700 hover:bg-gray-100 rounded"
                    onClick={() => setShowAddChecklist(true)}
                  >
                    <CheckIcon className="h-5 w-5 mr-2 text-gray-500" />
                    <span>チェックリスト</span>
                  </button>
                )}
                
                {/* 期限日 */}
                <div className="flex flex-col w-full p-2 text-gray-700 hover:bg-gray-100 rounded">
                  <div className="flex items-center mb-2">
                    <ClockIcon className="h-5 w-5 mr-2 text-gray-500" />
                    <span>期限日</span>
                  </div>
                  <input
                    type="date"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={dueDate}
                    onChange={(e) => handleDueDateUpdate(e.target.value)}
                  />
                </div>
                
                {/* 添付ファイル */}
                <button className="flex items-center w-full p-2 text-gray-700 hover:bg-gray-100 rounded">
                  <PaperClipIcon className="h-5 w-5 mr-2 text-gray-500" />
                  <span>添付ファイル</span>
                </button>
                
                {/* メンバー */}
                <button className="flex items-center w-full p-2 text-gray-700 hover:bg-gray-100 rounded">
                  <UserIcon className="h-5 w-5 mr-2 text-gray-500" />
                  <span>メンバー</span>
                </button>
                
                {/* コメント */}
                <button 
                  className="flex items-center w-full p-2 text-gray-700 hover:bg-gray-100 rounded"
                  onClick={() => setActiveTab('activity')}
                >
                  <svg className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span>コメント</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardDetailView; 