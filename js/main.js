
    $(document).ready(function () {
        let getPosOfLi = 0;
        let mainArray = [];
        let secondArr = [];
        let lastLoadedIdFromServer = 0;
        let parseLocal = JSON.parse(localStorage.getItem('localStorageArray'));
        if (parseLocal != null) {
            mainArray = parseLocal;
        }
        //let todoList = $('#todoList');
        renderArray(todoList);
        $.getJSON('https://jsonplaceholder.typicode.com/todos', function(data) {
            secondArr = data;
        });
        //add element button
        function renderArray(todoList) {
            todoList.innerHTML = '';
            for (i = 0; i < mainArray.length; i++) {
                let itemsCheckbox = '<input type="checkbox" id="todoListCheckboxItem' + i + '"" class="todoListCheckboxItem">';
                let itemsText = '<span>' + mainArray[i].title + '</span>';
                //let editBtn = '<button class="editBtn">'+ 'edit' +'</button>';   <a href="#ex1" rel="modal:open">Open Modal</a>
                let editBtn = '<a href="#ex1" rel="modal:open" class="editBtn">Edit</a>';
                let rmBtn = '<button class="rmBtn">' + '\u00D7' + '</button>';
                //check for completed tasks
                if (mainArray[i].completed === true) {
                    let liItemPos = 'li' + i;
                    let checkboxId = 'todoListCheckboxItem' + i;
                    itemsText = '<span style="text-decoration: line-through">' + mainArray[i].title + '</span>';
                    itemsCheckbox = '<input type="checkbox" id="todoListCheckboxItem' + i + '"" class="todoListCheckboxItem" checked="checked">';
                }
                //create template for appending to the html
                let template = '<li id="li' + i +'">'+itemsCheckbox + itemsText + editBtn + rmBtn + '</li>';
                $('#todoList').append(template)
            }
            //add new item from text input
            $('#addButton').on('click',function getInputText() {
                let text = $('#inputText').val();
                if (text != '') {
                    mainArray.push({
                        "id": mainArray.length,
                        "title": text,
                        "completed": false
                    });
                }
                $('#inputText').val('');
                if (mainArray != null) {
                    pushToLocalStorage();
                }
                renderArray(todoList);
            });
            //delete element button
            $('.rmBtn').on('click',function (e) {
                let li = e.target.parentElement.id;
                let elem = parseInt(li.substr(2));
                mainArray.splice(elem,1);
                pushToLocalStorage();
                renderArray(todoList);
            });
            $('.editBtn').on('click',function (e) {
                let li = e.target.parentElement.id;
                let elem = parseInt(li.substr(2));
                getPosOfLi = elem;
                $('#modalEditInput').val(mainArray[elem].title);
                renderArray(todoList);
            });
            //clear array and local storage
            $('#clearArrayStorage').on('click',function () {
                localStorage.clear();
                $('#todoList').empty();
                mainArray = [];
            });
            //get parent id and set parameter "completed"
            $('.todoListCheckboxItem').on('click',function (e) {
                let li = e.target.parentElement.id;
                let elem = parseInt(li.substr(2));
                if (e.target.checked === true) {
                    mainArray[elem].completed = true;
                }
                else {
                    mainArray[elem].completed = false;
                }
                pushToLocalStorage();
                renderArray(todoList);
            });
        }
        $('#loadMoreTodos').on('click',function () {
            let loadFromServerLenght = lastLoadedIdFromServer + 10;
                $.getJSON('https://jsonplaceholder.typicode.com/todos', function(data) {
                    secondArr = data;
                });
            for (let i = lastLoadedIdFromServer; i < loadFromServerLenght; i++) {
                mainArray.push(secondArr[i]);
                lastLoadedIdFromServer = secondArr[i].id;
                if (lastLoadedIdFromServer > secondArr.length - 1) {
                    lastLoadedIdFromServer = 0;
                }
                pushToLocalStorage();
                renderArray(todoList);
            }
        });
        $('#modalSaveBtn').on('click', function () {
            mainArray[getPosOfLi].title = $('#modalEditInput').val();
            $('#modalEditInput').empty();
            pushToLocalStorage();
            renderArray(todoList);
        });
        function pushToLocalStorage() {
            localStorage.setItem('localStorageArray', JSON.stringify(mainArray));
        }
    });