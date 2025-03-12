/**
 * @fileoverview ボードビューコンポーネント
 * @description ボードとそのリストを表示するコンポーネント
 */

import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { useBoardContext } from '../../context/BoardContext';
import ListView from '../list/ListView';
import { PlusIcon, Cog6ToothIcon as CogIcon } from '@heroicons/react/24/outline';

/**
 * ボードビューコンポーネント
 * @returns {JSX.Element} ボードビューコンポーネント
 */
const BoardView: React.FC = () => {
  const { currentBoard, addList, moveList, moveCard } = useBoardContext();
  const [newListTitle, setNewListTitle] = useState('');
  const [showBoardSettings, setShowBoardSettings] = useState(false);
  const [enabled, setEnabled] = useState(false);

  // React 19との互換性のためにDnDを遅延初期化
  useEffect(() => {
    const timeout = setTimeout(() => {
      setEnabled(true);
    }, 500);
    return () => clearTimeout(timeout);
  }, []);

  /**
   * ドラッグ終了時の処理
   * @param {DropResult} result - ドラッグ&ドロップの結果
   */
  const handleDragEnd = (result: DropResult) => {
    const { source, destination, type } = result;

    // ドロップ先がない場合は何もしない
    if (!destination) return;

    // 同じ位置にドロップした場合は何もしない
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // リストの並べ替え
    if (type === 'list' && currentBoard) {
      moveList(currentBoard.id, source.index, destination.index);
      return;
    }

    // カードの並べ替え
    if (type === 'card') {
      moveCard(
        source.droppableId,
        destination.droppableId,
        source.index,
        destination.index
      );
    }
  };

  /**
   * 新しいリストを追加する
   * @param {React.FormEvent} e - フォームイベント
   */
  const handleAddList = (e: React.FormEvent) => {
    e.preventDefault();
    if (newListTitle.trim() && currentBoard) {
      addList(currentBoard.id, newListTitle);
      setNewListTitle('');
    }
  };

  // 現在のボードがない場合
  if (!currentBoard) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700">ボードが選択されていません</h2>
          <p className="mt-2 text-gray-500">
            ナビゲーションバーからボードを選択するか、新しいボードを作成してください。
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex-1 overflow-x-auto p-4 ${currentBoard.background}`}
      style={{ minHeight: 'calc(100vh - 4rem)' }}
    >
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">{currentBoard.title}</h1>
        <button
          className="p-2 rounded-full bg-white bg-opacity-70 hover:bg-opacity-100 text-gray-700"
          onClick={() => setShowBoardSettings(!showBoardSettings)}
        >
          <CogIcon className="h-5 w-5" />
        </button>
      </div>

      {/* ボード設定 */}
      {showBoardSettings && (
        <div className="mb-4 p-4 bg-white rounded-md shadow">
          <h3 className="text-lg font-semibold mb-2">ボード設定</h3>
          <div className="grid grid-cols-4 gap-2">
            <button
              className="p-2 rounded bg-blue-100 hover:bg-blue-200"
              onClick={() => {
                /* ボードの背景色を変更 */
              }}
            >
              青
            </button>
            <button
              className="p-2 rounded bg-green-100 hover:bg-green-200"
              onClick={() => {
                /* ボードの背景色を変更 */
              }}
            >
              緑
            </button>
            <button
              className="p-2 rounded bg-yellow-100 hover:bg-yellow-200"
              onClick={() => {
                /* ボードの背景色を変更 */
              }}
            >
              黄
            </button>
            <button
              className="p-2 rounded bg-red-100 hover:bg-red-200"
              onClick={() => {
                /* ボードの背景色を変更 */
              }}
            >
              赤
            </button>
          </div>
        </div>
      )}

      {enabled ? (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="board" type="list" direction="horizontal">
            {(provided) => (
              <div
                className="flex space-x-4"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {/* リスト */}
                {currentBoard.lists
                  .filter(list => !list.archived)
                  .sort((a, b) => a.position - b.position)
                  .map((list, index) => (
                    <ListView key={list.id} list={list} index={index} />
                  ))}
                {provided.placeholder}

                {/* 新しいリスト追加フォーム */}
                <div className="w-72 shrink-0">
                  <div className="bg-gray-100 rounded-md shadow p-2">
                    <form onSubmit={handleAddList}>
                      <input
                        type="text"
                        className="w-full p-2 border rounded mb-2"
                        placeholder="新しいリストを追加..."
                        value={newListTitle}
                        onChange={(e) => setNewListTitle(e.target.value)}
                      />
                      <button
                        type="submit"
                        className="w-full flex items-center justify-center p-2 bg-blue-600 text-white rounded hover:bg-blue-500"
                        disabled={!newListTitle.trim()}
                      >
                        <PlusIcon className="h-5 w-5 mr-1" />
                        リストを追加
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </Droppable>
        </DragDropContext>
      ) : (
        <div className="flex space-x-4">
          {/* 遅延ロード中のリスト表示（ドラッグ&ドロップなし） */}
          {currentBoard.lists
            .filter(list => !list.archived)
            .sort((a, b) => a.position - b.position)
            .map((list, index) => (
              <div key={list.id} className="w-72 shrink-0">
                <div className="bg-gray-100 rounded-md shadow">
                  <div className="p-2 bg-gray-200 rounded-t-md">
                    <h3 className="font-semibold text-gray-700">{list.title}</h3>
                  </div>
                  <div className="p-2 min-h-[50px]">
                    {list.cards
                      .filter(card => !card.archived)
                      .sort((a, b) => a.position - b.position)
                      .map(card => (
                        <div key={card.id} className="mb-2 bg-white rounded-md shadow p-3">
                          <h4 className="font-medium text-gray-800">{card.title}</h4>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            ))}

          {/* 新しいリスト追加フォーム */}
          <div className="w-72 shrink-0">
            <div className="bg-gray-100 rounded-md shadow p-2">
              <form onSubmit={handleAddList}>
                <input
                  type="text"
                  className="w-full p-2 border rounded mb-2"
                  placeholder="新しいリストを追加..."
                  value={newListTitle}
                  onChange={(e) => setNewListTitle(e.target.value)}
                />
                <button
                  type="submit"
                  className="w-full flex items-center justify-center p-2 bg-blue-600 text-white rounded hover:bg-blue-500"
                  disabled={!newListTitle.trim()}
                >
                  <PlusIcon className="h-5 w-5 mr-1" />
                  リストを追加
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BoardView; 