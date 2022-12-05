// variables

let todoItems = []
const todoInput = document.querySelector('.todo-input');
const completedTodoDiv = document.querySelector('.completed-todos')
const uncompletedTodoDiv = document.querySelector('.uncompleted-todos')
const audio = new Audio('sound.mp3');
const delteAudio = new Audio('delete.mp3');

// get todo list on first boot
window.onload = () => {
    let storageTodoItem = localStorage.getItem('todoItems')
    if(storageTodoItem !== null) {
        todoItems = JSON.parse(storageTodoItem)
    }

    render()
}
// get the content typed into the input
todoInput.onkeyup = ((e) => {
    let value = e.target.value.replace(/^\s+/,"")
    if(value && e.keyCode === 13){
        addTodo(value)

        todoInput.value = ''
        todoInput.focus()
    }
})

// add todo
function addTodo(text){
    todoItems.push({
        id: Date.now(),
        text,
        completed: false
    })
   saveAndRender()
}

// remove todo 
function removeTodo(id){
    todoItems = todoItems.filter(todo => todo.id !==Number(id))
    saveAndRender()
}

// mark as completed
function markAsCompleted(id) {
    todoItems = todoItems.filter(todo =>{
        if(todo.id === Number(id)){
            todo.completed = true
        }

        return todo
    }) 
    
    audio.play()
    saveAndRender()
}


// mark as uncompleted
function markAsUncompleted(id){
    todoItems = todoItems.filter(todo =>{
        if(todo.id === Number(id)){
            todo.completed = false
        }

        return todo
    })
    saveAndRender
}

// save in local storage
function save(){
    localStorage.setItem('todoItems', JSON.stringify(todoItems))
}

// render
function render(){
    let uncompletedTodos = todoItems.filter(item => !item.completed)
    let completedTodos = todoItems.filter(item => item.completed)
    completedTodoDiv.innerHTML = ''
    uncompletedTodoDiv.innerHTML = ''

    if(uncompletedTodos.length > 0) {
        uncompletedTodos.forEach(todo => {
            uncompletedTodoDiv.append(createTodoElement(todo))
        })
    }
    else {
        uncompletedTodoDiv.innerHTML = `<div class ="empty"> No uncompleted missions</div>`
    }

    if(completedTodos.length > 0) {
        completedTodoDiv.innerHTML = `<div class ="completed-title">Completed (${completedTodos.length} / ${todoItems.length})</div>`
        completedTodos.forEach(todo => {
            completedTodoDiv.append(createTodoElement(todo))
        }) 
    }
}

// save and render
function saveAndRender() {
    save()
    render()
}

// create todo list item
function createTodoElement(todo){
    // create todo ist container
    const todoDiv = document.createElement('div');
    todoDiv.setAttribute('data-id', todo.id)
    todoDiv.className = 'todo-item'

    // create todo item text
const todotextSpan = document.createElement('span')
todotextSpan.innerHTML = todo.text

    // checkbox for list
    const todoInputCheckbox = document.createElement('input')
    todoInputCheckbox.type = 'checkbox'
    todoInputCheckbox.checked = todo.completed
    todoInputCheckbox.onclick = (e) => {
        let id = e.target.closest('.todo-item').dataset.id
        e.target.checked ? markAsCompleted(id) :markAsUncompleted(id)
    }

    // delete button for list
    const todoRemoveBtn = document.createElement("a")
    todoRemoveBtn.href = "#";
    todoRemoveBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-trash" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
    <line x1="4" y1="7" x2="20" y2="7"></line>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
    <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"></path>
    <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"></path>
 </svg> `

     todoRemoveBtn.onclick = (e) => {
        let id = e.target.closest('.todo-item').dataset.id;
        delteAudio.play()
        removeTodo(id)
        
     }

     todotextSpan.prepend(todoInputCheckbox)
     todoDiv.appendChild(todotextSpan)
     todoDiv.appendChild(todoRemoveBtn)

     return todoDiv
}
