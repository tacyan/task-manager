/**
 * @fileoverview カードアイテムコンポーネント
 * @description リスト内のカードを表示するコンポーネント
 */

import React, { useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Card } from '../../types';
import { useBoardContext } from '../../context/BoardContext';
import { formatDate, getDueDateStatus } from '../../utils/helpers';
import { 
  ClockIcon, 
  CheckIcon, 
  PaperClipIcon, 
  PencilIcon,
  TrashIcon,
  EllipsisVerticalIcon,
  ChatBubbleLeftIcon,
  DocumentDuplicateIcon
} from '@heroicons/react/24/outline';
import CardDetailView from './CardDetailView';

/**
 * カードアイテムコンポーネントのプロパティ
 */
interface CardItemProps {
  card: Card;
  index: number;
}

/**
 * カードアイテムコンポーネント
 * @param {CardItemProps} props - コンポーネントのプロパティ
 * @returns {JSX.Element} カードアイテムコンポーネント
 */
const CardItem: React.FC<CardItemProps> = ({ card, index }) => {
  const { updateCard, deleteCard } = useBoardContext();
  const [showDetail, setShowDetail] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  /**
   * カードを削除する
   * @param {React.MouseEvent} e - マウスイベント
   */
  const handleDeleteCard = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('このカードを削除してもよろしいですか？')) {
      deleteCard(card.id);
    }
  };

  /**
   * カードを複製する
   * @param {React.MouseEvent} e - マウスイベント
   */
  const handleDuplicateCard = (e: React.MouseEvent) => {
    e.stopPropagation();
    // カードの複製処理（実装は省略）
    setShowMenu(false);
  };

  /**
   * 期限日のスタイルを取得する
   * @returns {string} CSSクラス名
   */
  const getDueDateClasses = () => {
    const status = getDueDateStatus(card.dueDate);
    switch (status) {
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'dueToday':
        return 'bg-yellow-100 text-yellow-800';
      case 'dueSoon':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  /**
   * チェックリストの完了率を計算する
   * @returns {number} 完了率（0-100）
   */
  const getChecklistCompletion = () => {
    if (!card.checklists.length) return 0;
    
    const totalItems = card.checklists.reduce(
      (total, list) => total + list.items.length, 
      0
    );
    
    if (totalItems === 0) return 0;
    
    const completedItems = card.checklists.reduce(
      (total, list) => total + list.items.filter(item => item.completed).length, 
      0
    );
    
    return Math.round((completedItems / totalItems) * 100);
  };

  const checklistCompletion = getChecklistCompletion();

  return (
    <>
      <Draggable draggableId={card.id} index={index}>
        {(provided) => (
          <div
            className="mb-2 bg-white rounded-md shadow hover:shadow-md cursor-pointer"
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            onClick={() => setShowDetail(true)}
          >
            <div className="p-3 relative">
              {/* ヘッダー部分 - タイトルとメニューボタン */}
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-gray-800 flex-1 pr-6">{card.title}</h4>
                <div className="flex-shrink-0">
                  <button
                    className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMenu(!showMenu);
                    }}
                  >
                    <EllipsisVerticalIcon className="h-4 w-4" />
                  </button>
                  
                  {showMenu && (
                    <div className="absolute top-8 right-3 z-10 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                      <div className="py-1">
                        <button
                          className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowDetail(true);
                            setShowMenu(false);
                          }}
                        >
                          <PencilIcon className="h-4 w-4 mr-2" />
                          編集
                        </button>
                        <button
                          className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={handleDuplicateCard}
                        >
                          <DocumentDuplicateIcon className="h-4 w-4 mr-2" />
                          複製
                        </button>
                        <button
                          className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                          onClick={handleDeleteCard}
                        >
                          <TrashIcon className="h-4 w-4 mr-2" />
                          削除
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* ラベル */}
              {card.labels.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {card.labels.map((label) => (
                    <span
                      key={label.id}
                      className={`px-2 py-0.5 rounded-sm text-xs text-white bg-${label.color}-500`}
                      title={label.name}
                    >
                      {label.name}
                    </span>
                  ))}
                </div>
              )}

              {/* メタ情報 */}
              <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-600">
                {/* 期限日 */}
                {card.dueDate && (
                  <span className={`flex items-center px-2 py-1 rounded ${getDueDateClasses()}`}>
                    <ClockIcon className="h-3 w-3 mr-1" />
                    {formatDate(card.dueDate, 'short')}
                  </span>
                )}

                {/* チェックリスト */}
                {card.checklists.length > 0 && (
                  <span className="flex items-center px-2 py-1 rounded bg-gray-100">
                    <CheckIcon className="h-3 w-3 mr-1" />
                    {checklistCompletion}%
                  </span>
                )}

                {/* 添付ファイル */}
                {card.attachments.length > 0 && (
                  <span className="flex items-center px-2 py-1 rounded bg-gray-100">
                    <PaperClipIcon className="h-3 w-3 mr-1" />
                    {card.attachments.length}
                  </span>
                )}

                {/* コメント */}
                {card.comments.length > 0 && (
                  <span className="flex items-center px-2 py-1 rounded bg-gray-100">
                    <ChatBubbleLeftIcon className="h-3 w-3 mr-1" />
                    {card.comments.length}
                  </span>
                )}
              </div>

              {/* 担当者 */}
              {card.assignedUsers.length > 0 && (
                <div className="mt-2 flex -space-x-1">
                  {card.assignedUsers.map((user) => (
                    <div
                      key={user.id}
                      className="h-6 w-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs border-2 border-white"
                      title={user.name}
                    >
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="h-full w-full rounded-full object-cover"
                        />
                      ) : (
                        user.name.charAt(0)
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </Draggable>

      {/* カード詳細モーダル */}
      {showDetail && (
        <CardDetailView
          card={card}
          onClose={() => setShowDetail(false)}
          onUpdate={(data: Partial<Card>) => updateCard(card.id, data)}
        />
      )}
    </>
  );
};

export default CardItem; 