import type { Idea } from "./types";
import { STORAGE_KEY, readLocalStorage, saveLocalStorage } from "./storage";

// **************************************
// 処理
// **************************************

let ideas: Idea[] = [];
let ideaIndex: number = 0;

// ************************
// 要素一覧
// ************************

const ideaList = document.getElementById("list") as HTMLDivElement;
const addButton = document.getElementById("add") as HTMLButtonElement;
const ideaTitle = document.getElementById("ideaTitle") as HTMLInputElement;
const ideaBody = document.getElementById("ideaBody") as HTMLTextAreaElement;
const editButton = document.getElementById("edit") as HTMLButtonElement;
const saveButton = document.getElementById("save") as HTMLButtonElement;
const deleteButton = document.getElementById("delete") as HTMLButtonElement;

// **************************************
// 関数一覧
// **************************************

/**
 * 新しいアイデアを作成する
 * @returns {Idea} 新しいアイデア
 */
function newIdea(): Idea {
    const timestamp: number = Date.now();
    return {
        id: timestamp.toString() + ideas.length.toString(),
        title: `new idea ${ideas.length + 1}`,
        body: "",
        createdAt: timestamp,
        updatedAt: timestamp,
    };
}

// ************************
// 処理
// ************************

init();
addButton.addEventListener("click", clickAddIdea);
editButton.addEventListener("click", clickEditIdea);
saveButton.addEventListener("click", clickSaveIdea);
deleteButton.addEventListener("click", clickDeleteIdea);

// **************************************
// 関数一覧
// **************************************

/**
 * 初期化
 */
function init(): void {
    ideas = readLocalStorage(STORAGE_KEY);
    if (ideas.length === 0) {
        // 新しいアイデアを2つ作成する
        ideas.push(newIdea());
        ideas.push(newIdea());
        saveLocalStorage(STORAGE_KEY, ideas);
    }
    showIdeaElements(ideaList, ideas);
    setActiveStyle(ideaIndex + 1, true);
    setIdeaElement();
    setHiddenButton(saveButton, false);
    setHiddenButton(editButton, true);
}

/**
 * アイデアの要素を作成する
 * @param {Idea} idea アイデア
 * @returns {HTMLDivElement}
 */
function newIdeaElement(idea: Idea): HTMLDivElement {
    const div = document.createElement("div");
    div.innerText = idea.title;
    div.setAttribute("data-id", idea.id);
    div.classList.add("w-full", "p-sm");
    div.addEventListener("click", selectedIdea);
    return div;
}

/**
 * 全てのアイデア一覧を削除する
 * @param {HTMLDivElement} div
 */
function clearIdeaElements(div: HTMLDivElement): void {
    div.innerText = "";
}

/**
 * すべてのアイデア一覧を表示する
 * @param {HTMLDivElement} div
 * @param {Idea[]} ideas
 */
function showIdeaElements(div: HTMLDivElement, ideas: Idea[]): void {
    clearIdeaElements(div);
    ideas.forEach((idea) => {
        const ideaElement = newIdeaElement(idea);
        div.appendChild(ideaElement);
    });
}

/**
 * アイデアの設定をする
 */
function setIdeaElement() {
    const idea: Idea = ideas[ideaIndex]!;
    ideaTitle.value = idea.title;
    ideaBody.value = idea.body;
}

/**
 * button要素の表示・非表示を設定する
 * @param {HTMLButtonElement} button
 * @param {boolean} isHidden
 */
function setHiddenButton(button: HTMLButtonElement, isHidden: boolean) {
    if (isHidden) {
        button.removeAttribute("hidden");
    } else {
        button.setAttribute("hidden", "hidden");
    }

}

/**
 * タイトルと本文の要素のdisabled属性を設定する
 * @param editMode
 */
function setEditMode(editMode: boolean) {
    if (editMode) {
        ideaTitle.removeAttribute("disabled");
        ideaBody.removeAttribute("disabled");
    } else {
        ideaTitle.setAttribute("disabled", "disabled");
        ideaBody.setAttribute("disabled", "disabled");
    }
}

// ************************
// イベント関連の関数一覧
// ************************

/**
 * 追加ボタンが押されたときの処理
 * @param {MouseEvent} event
 */
function clickAddIdea(event: MouseEvent): void {
    setEditMode(true);
    setHiddenButton(editButton, false);
    setHiddenButton(saveButton, true);
    ideas.push(newIdea());
    saveLocalStorage(STORAGE_KEY, ideas);
    ideaIndex = ideas.length - 1;
    showIdeaElements(ideaList, ideas);
    setActiveStyle(ideaIndex + 1, true);
    setIdeaElement();
}

/**
 * div要素にアクティブスタイルを設定する
 * @param {number} index
 * @param {boolean} isActive
 */
function setActiveStyle(index: number, isActive: boolean): void {
    const selector = `#list > div:nth-child(${index})`;
    const element = document.querySelector(selector) as HTMLDivElement;
    if (isActive) {
        element.classList.add("active");
    } else {
        element.classList.remove("active");
    }
}

/**
 * アイデアが選択されたときの処理
 * @param {MouseEvent} event
 */
function selectedIdea(event: MouseEvent): void {
    setEditMode(false);
    setHiddenButton(saveButton, false);
    setHiddenButton(editButton, true);
    setActiveStyle(ideaIndex + 1, false);

    const target = event.target as HTMLDialogElement;
    const id = target.getAttribute("data-id");
    ideaIndex = ideas.findIndex((idea) => idea.id === id);
    setIdeaElement();
    setActiveStyle(ideaIndex + 1, true);
}

/**
 * 編集ボタンが押されたときの処理
 * @param {MouseEvent} event
 */
function clickEditIdea(event: MouseEvent): void {
    setEditMode(true);
    setHiddenButton(editButton, false);
    setHiddenButton(saveButton, true);
}

/**
 * 保存ボタンが押された時の処理
 * @param {MouseEvent} event
 */
function clickSaveIdea(event: MouseEvent) {
    const idea = ideas[ideaIndex]!;
    idea.title = ideaTitle.value;
    idea.body = ideaBody.value;
    idea.updatedAt = Date.now();
    // すべてのアイデアをローカルストレージに保存する
    saveLocalStorage(STORAGE_KEY, ideas);
    // タイトルと本文を表示モードにする
    setEditMode(false);
    // 保存ボタンを非表示し編集ボタンを表示にする
    setHiddenButton(saveButton, false);
    setHiddenButton(editButton, true);
    // すべてのアイデアのタイトルを一覧で表示する
    showIdeaElements(ideaList, ideas);
    // アイデア一覧のタイトルにアクティブなスタイルを設定する
    setActiveStyle(ideaIndex + 1, true);
}

/**
 * 削除ボタンが押されたときの処理
 * @param {MouseEvent} event
 */
function clickDeleteIdea(event: MouseEvent): void {
    if (ideas.length === 1) {
        alert("これ以上削除できません。");
        return;
    }
    const ideaId = ideas[ideaIndex]?.id;
    ideas = ideas.filter((idea) => idea.id !== ideaId);
    saveLocalStorage(STORAGE_KEY, ideas);
    if (1 <= ideaIndex) {
        ideaIndex--;
    }
    setIdeaElement();
    setEditMode(false);
    setHiddenButton(saveButton, false);
    setHiddenButton(editButton, true);
    showIdeaElements(ideaList, ideas);
    setActiveStyle(ideaIndex + 1, true);

}