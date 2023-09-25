import "./style.css";

const todoList = document.getElementById("todoList");
const createInput = document.getElementById("createInput");
const createBtn = document.getElementById("createBtn");

const findTodo = (todos, id) => {
  for (const todo of todos) {
    if (todo.id === id) return todo;
  }
};

const createNewTodo = async (todo) => {
  await fetch(`https://650c842747af3fd22f67ba57.mockapi.io/Todo`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(todo)
  });

  main();
}

createBtn.addEventListener('click', (e) => { 
  e.preventDefault();
  createNewTodo({isDone: false, text: createInput.value})
  createInput.value = ""
})

const getAllTodos = async () => {
  const response = await fetch(
    "https://650c842747af3fd22f67ba57.mockapi.io/Todo"
  );
  return response.json();
};

const deleteTodo = async (todo) => {
  await fetch(`https://650c842747af3fd22f67ba57.mockapi.io/Todo/${todo.id}`, {
    method: "DELETE",
  });

  main();
};

const changeIsDone = async (todo) => {
  await fetch(`https://650c842747af3fd22f67ba57.mockapi.io/Todo/${todo.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({...todo, isDone: !todo.isDone})
  });

  main();
}

const changeText = async (todo, string) => {
  await fetch(`https://650c842747af3fd22f67ba57.mockapi.io/Todo/${todo.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({...todo, text: string})
  });

  main();
}

async function main() {
  const todos = await getAllTodos();
  todoList.innerHTML = "";

  todos.forEach((todo) => {
    const todoItem = document.createElement("li");
    todoItem.classList.add("flex", "gap-[12px]");
    todoItem.innerHTML = `
        <input class="checkbox" data-id="${todo.id}" type="checkbox" ${
          todo.isDone === true ? "checked" : ""
        }>
        <input
          class="input text-neutral-700 bg-gray-100 text-neutral-700 rounded-2xl p-3 grow min-w-1/3 h-auto"
          value="${todo.text}"
          data-id="${todo.id}"
        />
        <button
          class="deleteTodo  bg-slate-500 text-gray-600 px-4 rounded-2xl drop-shadow-xl flex-none min-w-[56px] h-12"
          data-id="${todo.id}"
        >
          <svg
            class="my-0 mx-auto"
            fill="#fff"
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            viewBox="0 -960 960 960"
            width="24"
          >
            <path
              d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"
            />
          </svg>
        </button>`;

    todoList.appendChild(todoItem);
  });

  const deleteBtns = document.getElementsByClassName("deleteTodo");
  const updateInputs = document.getElementsByClassName("checkbox");
  const inputTexts = document.getElementsByClassName("input");

  for (const btn of deleteBtns) {
    const todo = findTodo(todos, btn.dataset.id);

    btn.addEventListener("click", () => deleteTodo(todo));
  }

  for (const input of updateInputs) {
    const todo = findTodo(todos, input.dataset.id)
    
    input.addEventListener("change", () => changeIsDone(todo))
  }

  for (const input of inputTexts) {
    const todo = findTodo(todos, input.dataset.id)

    input.addEventListener("change", (e) => changeText(todo, e.target.value))
  }
}

main();
