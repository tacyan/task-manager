/**
 * @fileoverview アプリケーションのメインコンポーネント
 * @description アプリケーション全体の構造を定義します
 */

import React from 'react';
import { BoardProvider } from './context/BoardContext';
import NavigationBar from './components/ui/NavigationBar';
import BoardView from './components/board/BoardView';

/**
 * アプリケーションのメインコンポーネント
 * @returns {JSX.Element} アプリケーションのメインコンポーネント
 */
const App: React.FC = () => {
  return (
    <BoardProvider>
      <div className="flex flex-col h-screen">
        <NavigationBar />
        <BoardView />
      </div>
    </BoardProvider>
  );
};

export default App;
