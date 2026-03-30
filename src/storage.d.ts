import type { Idea } from "./types";
export declare const STORAGE_KEY = "ideas";
/**
 * ローカルストレージからすべてのアイデアを取得する
 * @param {string} key キー
 * @returns {Idea} 全てのアイデア
 */
export declare function readLocalStorage(key: string): Idea[];
//# sourceMappingURL=storage.d.ts.map