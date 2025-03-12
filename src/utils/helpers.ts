/**
 * @fileoverview ヘルパー関数
 * @description アプリケーション全体で使用される汎用的なヘルパー関数を提供します
 */

/**
 * ランダムなIDを生成する
 * @returns {string} ランダムなID
 */
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

/**
 * 日付をフォーマットする
 * @param {Date} date - フォーマットする日付
 * @param {string} format - 日付フォーマット（'short', 'medium', 'long'）
 * @returns {string} フォーマットされた日付文字列
 */
export const formatDate = (date: Date | null, format: 'short' | 'medium' | 'long' = 'medium'): string => {
  if (!date) return '';
  
  const dateObj = new Date(date);
  
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: format === 'short' ? '2-digit' : 'long',
    day: '2-digit',
    hour: format !== 'short' ? '2-digit' : undefined,
    minute: format !== 'short' ? '2-digit' : undefined,
  };
  
  return new Intl.DateTimeFormat('ja-JP', options).format(dateObj);
};

/**
 * 配列内の要素を並べ替える
 * @param {Array} array - 並べ替える配列
 * @param {number} fromIndex - 移動元のインデックス
 * @param {number} toIndex - 移動先のインデックス
 * @returns {Array} 並べ替えられた新しい配列
 */
export const reorder = <T>(array: T[], fromIndex: number, toIndex: number): T[] => {
  const result = Array.from(array);
  const [removed] = result.splice(fromIndex, 1);
  result.splice(toIndex, 0, removed);
  return result;
};

/**
 * 配列内の要素を別の配列に移動する
 * @param {Array} source - 移動元の配列
 * @param {Array} destination - 移動先の配列
 * @param {number} sourceIndex - 移動元のインデックス
 * @param {number} destinationIndex - 移動先のインデックス
 * @returns {Object} 移動後の両方の配列
 */
export const move = <T>(
  source: T[],
  destination: T[],
  sourceIndex: number,
  destinationIndex: number
): { source: T[]; destination: T[] } => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(sourceIndex, 1);
  
  destClone.splice(destinationIndex, 0, removed);
  
  return {
    source: sourceClone,
    destination: destClone
  };
};

/**
 * 期限日の状態を取得する
 * @param {Date | null} dueDate - 期限日
 * @returns {string} 期限日の状態（'overdue', 'dueToday', 'dueSoon', 'upcoming', 'none'）
 */
export const getDueDateStatus = (dueDate: Date | null): 'overdue' | 'dueToday' | 'dueSoon' | 'upcoming' | 'none' => {
  if (!dueDate) return 'none';
  
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dueDateTime = new Date(dueDate);
  const dueDateDay = new Date(dueDateTime.getFullYear(), dueDateTime.getMonth(), dueDateTime.getDate());
  
  const diffTime = dueDateDay.getTime() - today.getTime();
  const diffDays = diffTime / (1000 * 60 * 60 * 24);
  
  if (diffDays < 0) return 'overdue';
  if (diffDays === 0) return 'dueToday';
  if (diffDays <= 3) return 'dueSoon';
  return 'upcoming';
}; 