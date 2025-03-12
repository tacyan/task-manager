/**
 * @fileoverview ナビゲーションバーコンポーネント
 * @description アプリケーションのトップナビゲーションバーを提供します
 */

import React, { useState } from 'react';
import { useBoardContext } from '../../context/BoardContext';
import { PlusIcon, HomeIcon, BellIcon, MagnifyingGlassIcon as SearchIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { Popover } from '@headlessui/react';

/**
 * ナビゲーションバーコンポーネント
 * @returns {JSX.Element} ナビゲーションバーコンポーネント
 */
const NavigationBar: React.FC = () => {
  const { boards, currentBoard, setCurrentBoard, addBoard } = useBoardContext();
  const [showBoardMenu, setShowBoardMenu] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  /**
   * 新しいボードを作成する
   * @param {React.FormEvent} e - フォームイベント
   */
  const handleCreateBoard = (e: React.FormEvent) => {
    e.preventDefault();
    if (newBoardTitle.trim()) {
      addBoard(newBoardTitle);
      setNewBoardTitle('');
      setShowBoardMenu(false);
    }
  };

  /**
   * ボードを切り替える
   * @param {string} boardId - 切り替えるボードのID
   */
  const handleBoardChange = (boardId: string) => {
    setCurrentBoard(boardId);
    setShowBoardMenu(false);
  };

  return (
    <nav className="bg-blue-700 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {/* ロゴ */}
            <div className="flex-shrink-0 flex items-center">
              <HomeIcon className="h-8 w-8 mr-2" />
              <span className="font-bold text-xl">タスク管理</span>
            </div>

            {/* ボード選択 */}
            <div className="ml-6 relative">
              <button
                className="flex items-center px-3 py-2 rounded-md bg-blue-600 hover:bg-blue-500"
                onClick={() => setShowBoardMenu(!showBoardMenu)}
              >
                <span className="mr-1">ボード</span>
                <svg
                  className={`h-4 w-4 transition-transform ${showBoardMenu ? 'transform rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* ボードメニュー */}
              {showBoardMenu && (
                <div className="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                  <div className="py-1">
                    <div className="px-4 py-2 text-sm text-gray-700 font-semibold border-b">
                      あなたのボード
                    </div>
                    {boards.map(board => (
                      <button
                        key={board.id}
                        className={`block w-full text-left px-4 py-2 text-sm ${
                          currentBoard?.id === board.id
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                        onClick={() => handleBoardChange(board.id)}
                      >
                        {board.title}
                      </button>
                    ))}
                    <div className="border-t">
                      <form onSubmit={handleCreateBoard} className="px-4 py-2">
                        <input
                          type="text"
                          className="w-full px-2 py-1 text-sm border rounded text-gray-700"
                          placeholder="新しいボードを作成..."
                          value={newBoardTitle}
                          onChange={e => setNewBoardTitle(e.target.value)}
                        />
                        <button
                          type="submit"
                          className="mt-2 w-full flex items-center justify-center px-4 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-500"
                        >
                          <PlusIcon className="h-4 w-4 mr-1" />
                          作成
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center">
            {/* 検索 */}
            <div className="relative mx-4">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-blue-300" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 rounded-md bg-blue-600 text-white placeholder-blue-300 focus:outline-none focus:bg-white focus:text-gray-900 sm:text-sm"
                placeholder="検索..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>

            {/* 通知 */}
            <Popover className="relative">
              <Popover.Button className="p-2 rounded-full text-blue-200 hover:text-white focus:outline-none">
                <BellIcon className="h-6 w-6" />
              </Popover.Button>
              <Popover.Panel className="absolute right-0 z-10 mt-2 w-80 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-900 border-b pb-2">通知</h3>
                  <div className="mt-2 text-sm text-gray-500">
                    <p>新しい通知はありません</p>
                  </div>
                </div>
              </Popover.Panel>
            </Popover>

            {/* ユーザーメニュー */}
            <Popover className="relative ml-3">
              <Popover.Button className="p-1 rounded-full text-blue-200 hover:text-white focus:outline-none">
                <UserCircleIcon className="h-8 w-8" />
              </Popover.Button>
              <Popover.Panel className="absolute right-0 z-10 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="py-1">
                  <a
                    href="#profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    プロフィール
                  </a>
                  <a
                    href="#settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    設定
                  </a>
                  <a
                    href="#logout"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    ログアウト
                  </a>
                </div>
              </Popover.Panel>
            </Popover>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar; 