import { useState } from 'react'
import './App.css'

// Todoアイテムの型を定義します。
// これにより、各Todoがどのようなデータを持つべきかが明確になります。
type Todo = {
  id: number;       // Todoを一位に識別するためのID
  text: string;     // Todoの内容
  completed: boolean; // Todoが完了したかどうかを示すフラグ
};

// Appコンポーネント: Todoリストのメインコンポーネントです。
function App() {
  // todos: 現在のTodoリストを保持するためのstateです。
  // setTodos: todos stateを更新するための関数です。
  // useState<Todo[]>([]) は、初期値を空の配列に設定しています。
  const [todos, setTodos] = useState<Todo[]>([]);

  // inputText: 入力フィールドの現在の値を保持するためのstateです。
  // setInputText: inputText stateを更新するための関数です。
  // useState('') は、初期値を空の文字列に設定しています。
  const [inputText, setInputText] = useState('');

  // handleInputChange: input要素の値が変更されたときに呼び出される関数です。
  // event.target.valueでinputの現在の値を取得し、inputText stateを更新します。
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(event.target.value);
  };

  // handleAddTodo: 「追加」ボタンがクリックされたときに呼び出される関数です。
  const handleAddTodo = () => {
    // 入力値が空の場合は、処理を行いません。
    if (inputText.trim() === '') return;

    // 新しいTodoオブジェクトを作成します。
    const newTodo: Todo = {
      id: Date.now(), // 現在のタイムスタンプをIDとして使用し、一意性を保証します。
      text: inputText,
      completed: false, // 新しいTodoは未完了として追加されます。
    };

    // 既存のTodoリストに新しいTodoを追加して、stateを更新します。
    // `...todos` は、既存のtodos配列の全要素を展開（コピー）しています。
    setTodos([...todos, newTodo]);

    // 入力フィールドをクリアします。
    setInputText('');
  };

  // handleToggleTodo: Todoアイテムがクリックされたときに、完了・未完了を切り替える関数です。
  const handleToggleTodo = (id: number) => {
    // `map`メソッドを使って、特定のIDを持つTodoの`completed`プロパティを反転させます。
    const updatedTodos = todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    // 更新されたTodoリストでstateを更新します。
    setTodos(updatedTodos);
  };

  // handleDeleteTodo: 「削除」ボタンがクリックされたときにTodoを削除する関数です。
  const handleDeleteTodo = (id: number) => {
    // `filter`メソッドを使って、指定されたID以外のTodoで新しい配列を作成します。
    const updatedTodos = todos.filter(todo => todo.id !== id);
    // 更新されたTodoリストでstateを更新します。
    setTodos(updatedTodos);
  };

  // コンポーネントの見た目（JSX）を返します。
  return (
    <div className="app-container">
      <h1 className="app-title">Todoリスト</h1>
      <div className="input-container">
        {/*
          value={inputText} でinputの表示内容をinputText stateに紐付けます。
          onChange={handleInputChange} でinputの内容が変更されるたびにhandleInputChangeが呼ばれます。
        */}
        <input
          type="text"
          value={inputText}
          onChange={handleInputChange}
          className="todo-input"
          placeholder="新しいTodoを入力"
        />
        {/* onClick={handleAddTodo} でボタンクリック時にhandleAddTodoが呼ばれます。 */}
        <button onClick={handleAddTodo} className="add-button">
          追加
        </button>
      </div>
      <ul className="todo-list">
        {/* todos配列をmapでループ処理し、各Todoアイテムをリスト項目として表示します。 */}
        {todos.map(todo => (
          // key={todo.id} は、Reactがリストの各要素を効率的に更新するために必要です。
          <li
            key={todo.id}
            className={`todo-item ${todo.completed ? 'completed' : ''}`}
          >
            {/*
              Todoのテキストをクリックしたときにも完了状態が切り替わるようにします。
              onClick={() => handleToggleTodo(todo.id)}
            */}
            <span onClick={() => handleToggleTodo(todo.id)} className="todo-text">
              {todo.text}
            </span>
            {/* 削除ボタン */}
            <button onClick={() => handleDeleteTodo(todo.id)} className="delete-button">
              削除
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App
