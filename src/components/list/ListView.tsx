/**
 * @fileoverview リストビューコンポーネント
 * @description リストとそのカードを表示するコンポーネント
 */

import React, { useState } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { List } from '../../types';
import { useBoardContext } from '../../context/BoardContext';
import CardItem from '../card/CardItem';
import { PlusIcon, EllipsisHorizontalIcon as DotsHorizontalIcon, PencilIcon, TrashIcon, ArchiveBoxIcon as ArchiveIcon } from '@heroicons/react/24/outline';
import { Menu } from '@headlessui/react';

/**
 * リストビューコンポーネントのプロパティ
 */
interface ListViewProps {
  list: List;
  index: number;
}

/**
 * リストビューコンポーネント
 * @param {ListViewProps} props - コンポーネントのプロパティ
 * @returns {JSX.Element} リストビューコンポーネント
 */
const ListView: React.FC<ListViewProps> = ({ list, index }) => {
  const { addCard, updateList, deleteList, archiveList } = useBoardContext();
  const [newCardTitle, setNewCardTitle] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(list.title);
  const [showAddCard, setShowAddCard] = useState(false);

  /**
   * 新しいカードを追加する
   * @param {React.FormEvent} e - フォームイベント
   */
  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCardTitle.trim()) {
      addCard(list.id, newCardTitle);
      setNewCardTitle('');
      setShowAddCard(false);
    }
  };

  /**
   * リストのタイトルを更新する
   * @param {React.FormEvent} e - フォームイベント
   */
  const handleUpdateTitle = (e: React.FormEvent) => {
    e.preventDefault();
    if (editedTitle.trim()) {
      updateList(list.id, { title: editedTitle });
      setIsEditing(false);
    }
  };

  /**
   * リストを削除する
   */
  const handleDeleteList = () => {
    if (window.confirm('このリストを削除してもよろしいですか？含まれるすべてのカードも削除されます。')) {
      deleteList(list.id);
    }
  };

  /**
   * リストをアーカイブする
   */
  const handleArchiveList = () => {
    archiveList(list.id);
  };

  return (
    <Draggable draggableId={list.id} index={index}>
      {(provided) => (
        <div
          className="w-72 shrink-0"
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          <div className="bg-gray-100 rounded-md shadow">
            {/* リストヘッダー */}
            <div
              className="p-2 flex justify-between items-center bg-gray-200 rounded-t-md"
              {...provided.dragHandleProps}
            >
              {isEditing ? (
                <form onSubmit={handleUpdateTitle} className="flex-1">
                  <input
                    type="text"
                    className="w-full p-1 border rounded"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    autoFocus
                    onBlur={handleUpdateTitle}
                  />
                </form>
              ) : (
                <h3
                  className="font-semibold text-gray-700 cursor-pointer"
                  onClick={() => setIsEditing(true)}
                >
                  {list.title}
                </h3>
              )}

              {/* リストメニュー */}
              <Menu as="div" className="relative">
                <Menu.Button className="p-1.5 rounded-full hover:bg-gray-300 flex items-center justify-center">
                  <DotsHorizontalIcon className="h-5 w-5 text-gray-500" />
                </Menu.Button>
                <Menu.Items className="absolute right-0 z-10 mt-1 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${
                            active ? 'bg-gray-100' : ''
                          } flex items-center w-full text-left px-4 py-2 text-sm text-gray-700`}
                          onClick={() => setIsEditing(true)}
                        >
                          <PencilIcon className="h-4 w-4 mr-2" />
                          リスト名を編集
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${
                            active ? 'bg-gray-100' : ''
                          } flex items-center w-full text-left px-4 py-2 text-sm text-gray-700`}
                          onClick={handleArchiveList}
                        >
                          <ArchiveIcon className="h-4 w-4 mr-2" />
                          リストをアーカイブ
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${
                            active ? 'bg-gray-100' : ''
                          } flex items-center w-full text-left px-4 py-2 text-sm text-red-600`}
                          onClick={handleDeleteList}
                        >
                          <TrashIcon className="h-4 w-4 mr-2" />
                          リストを削除
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Menu>
            </div>

            {/* カードリスト */}
            <Droppable droppableId={list.id} type="card">
              {(provided) => (
                <div
                  className="p-2 min-h-[50px] max-h-[calc(100vh-16rem)] overflow-y-auto"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {list.cards
                    .filter(card => !card.archived)
                    .sort((a, b) => a.position - b.position)
                    .map((card, cardIndex) => (
                      <CardItem key={card.id} card={card} index={cardIndex} />
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            {/* カード追加フォーム */}
            <div className="p-2 border-t">
              {showAddCard ? (
                <form onSubmit={handleAddCard}>
                  <textarea
                    className="w-full p-2 border rounded mb-2 resize-none"
                    placeholder="カードのタイトルを入力..."
                    value={newCardTitle}
                    onChange={(e) => setNewCardTitle(e.target.value)}
                    autoFocus
                    rows={3}
                  />
                  <div className="flex space-x-2">
                    <button
                      type="submit"
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-500"
                      disabled={!newCardTitle.trim()}
                    >
                      カードを追加
                    </button>
                    <button
                      type="button"
                      className="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                      onClick={() => {
                        setShowAddCard(false);
                        setNewCardTitle('');
                      }}
                    >
                      キャンセル
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  className="w-full flex items-center p-2 text-gray-600 hover:bg-gray-200 rounded"
                  onClick={() => setShowAddCard(true)}
                >
                  <PlusIcon className="h-5 w-5 mr-1" />
                  カードを追加
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default ListView; 