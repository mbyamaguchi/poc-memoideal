import type { Idea } from "./types";

// **************************************
// 変数一覧
// **************************************

export const STORAGE_KEY = "ideas";

// **************************************
// 関数一覧
// **************************************

/**
 * ローカルストレージからすべてのアイデアを取得する
 * @param {string} key キー
 * @returns {Idea[]} 全てのアイデア
 */
export function readLocalStorage(key: string): Idea[] {
    const data = localStorage.getItem(key);
    if (data == null) {
        return [] as Idea[];
    } else {
        return JSON.parse(data) as Idea[];
    }
}

/**
 * ローカルストレージにすべてのアイデアを保存する
 * @param {string} key キー
 * @param {Idea[]} ideas すべてのアイデア
 */
export function saveLocalStorage(key: string, ideas: Idea[]): void {
    localStorage.setItem(key, JSON.stringify(ideas));
}