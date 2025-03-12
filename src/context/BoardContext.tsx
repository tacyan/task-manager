/**
 * @fileoverview ボード管理コンテキスト
 * @description ボードの状態管理とデータ操作のためのコンテキストを提供します
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Board, List, Card } from '../types';
import { getFromLocalStorage, saveToLocalStorage } from '../utils/localStorage';
import { generateId } from '../utils/helpers';

// コンテキストの型定義
interface BoardContextType {
  boards: Board[];
  currentBoard: Board | null;
  setCurrentBoard: (boardId: string) => void;
  addBoard: (title: string, background?: string) => Board;
  updateBoard: (boardId: string, data: Partial<Board>) => void;
  deleteBoard: (boardId: string) => void;
  addList: (boardId: string, title: string) => List;
  updateList: (listId: string, data: Partial<List>) => void;
  deleteList: (listId: string) => void;
  moveList: (boardId: string, sourceIndex: number, destinationIndex: number) => void;
  addCard: (listId: string, title: string) => Card;
  updateCard: (cardId: string, data: Partial<Card>) => void;
  deleteCard: (cardId: string) => void;
  moveCard: (
    sourceListId: string,
    destinationListId: string,
    sourceIndex: number,
    destinationIndex: number
  ) => void;
  archiveCard: (cardId: string) => void;
  restoreCard: (cardId: string) => void;
  archiveList: (listId: string) => void;
  restoreList: (listId: string) => void;
}

// コンテキストの作成
const BoardContext = createContext<BoardContextType | undefined>(undefined);

// コンテキストプロバイダーの型定義
interface BoardProviderProps {
  children: ReactNode;
}

// ローカルストレージのキー
const BOARDS_STORAGE_KEY = 'taskManager_boards';
const CURRENT_BOARD_KEY = 'taskManager_currentBoard';

/**
 * ボード管理コンテキストプロバイダー
 * @param {ReactNode} children - 子コンポーネント
 */
export const BoardProvider: React.FC<BoardProviderProps> = ({ children }) => {
  // ボードの状態
  const [boards, setBoards] = useState<Board[]>(() => 
    getFromLocalStorage<Board[]>(BOARDS_STORAGE_KEY, [])
  );
  
  // 現在選択中のボードID
  const [currentBoardId, setCurrentBoardId] = useState<string>(() => 
    getFromLocalStorage<string>(CURRENT_BOARD_KEY, '')
  );

  // 現在選択中のボード
  const currentBoard = boards.find(board => board.id === currentBoardId) || null;

  // ボードの変更を保存
  useEffect(() => {
    saveToLocalStorage(BOARDS_STORAGE_KEY, boards);
  }, [boards]);

  // 現在のボードIDの変更を保存
  useEffect(() => {
    saveToLocalStorage(CURRENT_BOARD_KEY, currentBoardId);
  }, [currentBoardId]);

  // 初期ボードの作成（ボードが存在しない場合）
  useEffect(() => {
    if (boards.length === 0) {
      const newBoard = addBoard('最初のボード', 'bg-blue-100');
      setCurrentBoardId(newBoard.id);
    } else if (currentBoardId === '' && boards.length > 0) {
      setCurrentBoardId(boards[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * 現在のボードを設定する
   * @param {string} boardId - ボードID
   */
  const setCurrentBoard = (boardId: string) => {
    setCurrentBoardId(boardId);
  };

  /**
   * 新しいボードを追加する
   * @param {string} title - ボードのタイトル
   * @param {string} background - ボードの背景色
   * @returns {Board} 作成されたボード
   */
  const addBoard = (title: string, background: string = 'bg-gray-100'): Board => {
    const newBoard: Board = {
      id: generateId(),
      title,
      background,
      lists: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setBoards(prevBoards => [...prevBoards, newBoard]);
    return newBoard;
  };

  /**
   * ボードを更新する
   * @param {string} boardId - 更新するボードのID
   * @param {Partial<Board>} data - 更新するデータ
   */
  const updateBoard = (boardId: string, data: Partial<Board>) => {
    setBoards(prevBoards => 
      prevBoards.map(board => 
        board.id === boardId 
          ? { ...board, ...data, updatedAt: new Date() } 
          : board
      )
    );
  };

  /**
   * ボードを削除する
   * @param {string} boardId - 削除するボードのID
   */
  const deleteBoard = (boardId: string) => {
    setBoards(prevBoards => prevBoards.filter(board => board.id !== boardId));
    
    // 削除したボードが現在選択中のボードだった場合、別のボードを選択
    if (currentBoardId === boardId) {
      const remainingBoards = boards.filter(board => board.id !== boardId);
      if (remainingBoards.length > 0) {
        setCurrentBoardId(remainingBoards[0].id);
      } else {
        setCurrentBoardId('');
      }
    }
  };

  /**
   * リストを追加する
   * @param {string} boardId - リストを追加するボードのID
   * @param {string} title - リストのタイトル
   * @returns {List} 作成されたリスト
   */
  const addList = (boardId: string, title: string): List => {
    const board = boards.find(b => b.id === boardId);
    if (!board) throw new Error(`ボードが見つかりません: ${boardId}`);

    const newList: List = {
      id: generateId(),
      boardId,
      title,
      cards: [],
      position: board.lists.length,
      archived: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setBoards(prevBoards => 
      prevBoards.map(board => 
        board.id === boardId 
          ? { 
              ...board, 
              lists: [...board.lists, newList],
              updatedAt: new Date() 
            } 
          : board
      )
    );

    return newList;
  };

  /**
   * リストを更新する
   * @param {string} listId - 更新するリストのID
   * @param {Partial<List>} data - 更新するデータ
   */
  const updateList = (listId: string, data: Partial<List>) => {
    setBoards(prevBoards => 
      prevBoards.map(board => ({
        ...board,
        lists: board.lists.map(list => 
          list.id === listId 
            ? { ...list, ...data, updatedAt: new Date() } 
            : list
        ),
        updatedAt: new Date()
      }))
    );
  };

  /**
   * リストを削除する
   * @param {string} listId - 削除するリストのID
   */
  const deleteList = (listId: string) => {
    setBoards(prevBoards => 
      prevBoards.map(board => ({
        ...board,
        lists: board.lists.filter(list => list.id !== listId),
        updatedAt: new Date()
      }))
    );
  };

  /**
   * リストを移動する
   * @param {string} boardId - ボードID
   * @param {number} sourceIndex - 移動元のインデックス
   * @param {number} destinationIndex - 移動先のインデックス
   */
  const moveList = (boardId: string, sourceIndex: number, destinationIndex: number) => {
    setBoards(prevBoards => 
      prevBoards.map(board => {
        if (board.id !== boardId) return board;

        const newLists = Array.from(board.lists);
        const [removed] = newLists.splice(sourceIndex, 1);
        newLists.splice(destinationIndex, 0, removed);

        // リストの位置を更新
        const updatedLists = newLists.map((list, index) => ({
          ...list,
          position: index,
          updatedAt: new Date()
        }));

        return {
          ...board,
          lists: updatedLists,
          updatedAt: new Date()
        };
      })
    );
  };

  /**
   * カードを追加する
   * @param {string} listId - カードを追加するリストのID
   * @param {string} title - カードのタイトル
   * @returns {Card} 作成されたカード
   */
  const addCard = (listId: string, title: string): Card => {
    let targetList: List | undefined;
    let targetBoard: Board | undefined;

    boards.forEach(board => {
      const list = board.lists.find(l => l.id === listId);
      if (list) {
        targetList = list;
        targetBoard = board;
      }
    });

    if (!targetList || !targetBoard) {
      throw new Error(`リストが見つかりません: ${listId}`);
    }

    const newCard: Card = {
      id: generateId(),
      listId,
      title,
      description: '',
      position: targetList.cards.length,
      dueDate: null,
      labels: [],
      checklists: [],
      attachments: [],
      comments: [],
      assignedUsers: [],
      archived: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setBoards(prevBoards => 
      prevBoards.map(board => {
        if (board.id !== targetBoard?.id) return board;

        return {
          ...board,
          lists: board.lists.map(list => {
            if (list.id !== listId) return list;

            return {
              ...list,
              cards: [...list.cards, newCard],
              updatedAt: new Date()
            };
          }),
          updatedAt: new Date()
        };
      })
    );

    return newCard;
  };

  /**
   * カードを更新する
   * @param {string} cardId - 更新するカードのID
   * @param {Partial<Card>} data - 更新するデータ
   */
  const updateCard = (cardId: string, data: Partial<Card>) => {
    setBoards(prevBoards => 
      prevBoards.map(board => ({
        ...board,
        lists: board.lists.map(list => ({
          ...list,
          cards: list.cards.map(card => 
            card.id === cardId 
              ? { ...card, ...data, updatedAt: new Date() } 
              : card
          ),
          updatedAt: list.cards.some(card => card.id === cardId) ? new Date() : list.updatedAt
        })),
        updatedAt: new Date()
      }))
    );
  };

  /**
   * カードを削除する
   * @param {string} cardId - 削除するカードのID
   */
  const deleteCard = (cardId: string) => {
    setBoards(prevBoards => 
      prevBoards.map(board => ({
        ...board,
        lists: board.lists.map(list => ({
          ...list,
          cards: list.cards.filter(card => card.id !== cardId),
          updatedAt: list.cards.some(card => card.id === cardId) ? new Date() : list.updatedAt
        })),
        updatedAt: new Date()
      }))
    );
  };

  /**
   * カードを移動する
   * @param {string} sourceListId - 移動元のリストID
   * @param {string} destinationListId - 移動先のリストID
   * @param {number} sourceIndex - 移動元のインデックス
   * @param {number} destinationIndex - 移動先のインデックス
   */
  const moveCard = (
    sourceListId: string,
    destinationListId: string,
    sourceIndex: number,
    destinationIndex: number
  ) => {
    setBoards(prevBoards => 
      prevBoards.map(board => {
        const sourceList = board.lists.find(list => list.id === sourceListId);
        const destinationList = board.lists.find(list => list.id === destinationListId);

        if (!sourceList || !destinationList) return board;

        const newSourceCards = Array.from(sourceList.cards);
        const [movedCard] = newSourceCards.splice(sourceIndex, 1);
        
        if (!movedCard) return board;

        const updatedMovedCard = {
          ...movedCard,
          listId: destinationListId,
          updatedAt: new Date()
        };

        const newDestinationCards = 
          sourceListId === destinationListId 
            ? newSourceCards 
            : Array.from(destinationList.cards);

        newDestinationCards.splice(destinationIndex, 0, updatedMovedCard);

        return {
          ...board,
          lists: board.lists.map(list => {
            if (list.id === sourceListId) {
              return {
                ...list,
                cards: sourceListId === destinationListId 
                  ? newDestinationCards.map((card, index) => ({
                      ...card,
                      position: index,
                      updatedAt: new Date()
                    }))
                  : newSourceCards.map((card, index) => ({
                      ...card,
                      position: index,
                      updatedAt: new Date()
                    })),
                updatedAt: new Date()
              };
            }
            
            if (list.id === destinationListId && sourceListId !== destinationListId) {
              return {
                ...list,
                cards: newDestinationCards.map((card, index) => ({
                  ...card,
                  position: index,
                  updatedAt: new Date()
                })),
                updatedAt: new Date()
              };
            }
            
            return list;
          }),
          updatedAt: new Date()
        };
      })
    );
  };

  /**
   * カードをアーカイブする
   * @param {string} cardId - アーカイブするカードのID
   */
  const archiveCard = (cardId: string) => {
    updateCard(cardId, { archived: true });
  };

  /**
   * カードをアーカイブから復元する
   * @param {string} cardId - 復元するカードのID
   */
  const restoreCard = (cardId: string) => {
    updateCard(cardId, { archived: false });
  };

  /**
   * リストをアーカイブする
   * @param {string} listId - アーカイブするリストのID
   */
  const archiveList = (listId: string) => {
    updateList(listId, { archived: true });
  };

  /**
   * リストをアーカイブから復元する
   * @param {string} listId - 復元するリストのID
   */
  const restoreList = (listId: string) => {
    updateList(listId, { archived: false });
  };

  // コンテキスト値
  const value = {
    boards,
    currentBoard,
    setCurrentBoard,
    addBoard,
    updateBoard,
    deleteBoard,
    addList,
    updateList,
    deleteList,
    moveList,
    addCard,
    updateCard,
    deleteCard,
    moveCard,
    archiveCard,
    restoreCard,
    archiveList,
    restoreList
  };

  return (
    <BoardContext.Provider value={value}>
      {children}
    </BoardContext.Provider>
  );
};

/**
 * ボードコンテキストを使用するためのカスタムフック
 * @returns {BoardContextType} ボードコンテキスト
 */
export const useBoardContext = (): BoardContextType => {
  const context = useContext(BoardContext);
  if (context === undefined) {
    throw new Error('useBoardContext must be used within a BoardProvider');
  }
  return context;
}; 