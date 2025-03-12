/**
 * @fileoverview ローカルストレージ操作ユーティリティ
 * @description データの永続化のためのローカルストレージ操作関数を提供します
 */

/**
 * ローカルストレージからデータを取得する
 * @param {string} key - 取得するデータのキー
 * @param {any} defaultValue - データが存在しない場合のデフォルト値
 * @returns {any} 取得したデータまたはデフォルト値
 */
export const getFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`ローカルストレージからの取得エラー: ${key}`, error);
    return defaultValue;
  }
};

/**
 * ローカルストレージにデータを保存する
 * @param {string} key - 保存するデータのキー
 * @param {any} value - 保存するデータ
 */
export const saveToLocalStorage = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`ローカルストレージへの保存エラー: ${key}`, error);
  }
};

/**
 * ローカルストレージからデータを削除する
 * @param {string} key - 削除するデータのキー
 */
export const removeFromLocalStorage = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`ローカルストレージからの削除エラー: ${key}`, error);
  }
};

/**
 * ローカルストレージのすべてのデータをクリアする
 */
export const clearLocalStorage = (): void => {
  try {
    localStorage.clear();
  } catch (error) {
    console.error('ローカルストレージのクリアエラー', error);
  }
}; 