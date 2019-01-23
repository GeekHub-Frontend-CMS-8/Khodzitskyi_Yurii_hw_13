
    $(document).ready(function () {
        let getPosOfLi = 0;
        let mainArray = [];
        let secondArr = [];
        let lastLoadedIdFromServer = 0;
        if (JSON.parse(localStorage.getItem('localStorageArray')) != null) {
            mainArray = JSON.parse(localStorage.getItem('localStorageArray'));
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
                //check for completed tasks
                if (mainArray[i].completed === true) {
                    itemsText = '<span style="text-decoration: line-through;color: #b3b3b3">' + mainArray[i].title + '</span>';
                    itemsCheckbox = '<input type="checkbox" id="todoListCheckboxItem' + i + '"" class="todoListCheckboxItem" checked="checked">';
                }
                //appending item to the html
                $('#todoList').append(
                    '<li id="li' + i +'">'+
                    itemsCheckbox +
                    itemsText +
                    '<a href="#ex1" rel="modal:open" class="editBtn">Edit</a>' +
                    '<button class="rmBtn">' + '\u00D7' + '</button>' +
                    '<div class="clearfix"></div>' +
                    '</li>'
                )
            }
            //add new item from text input
            $('#addButton').on('click',function getInputText() {
                if ($('#inputText').val() != '') {
                    mainArray.push({
                        "id": mainArray.length,
                        "title": $('#inputText').val(),
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
                mainArray.splice(parseInt(e.target.parentElement.id.substr(2)),1);
                pushToLocalStorage();
                renderArray(todoList);
            });
            $('.editBtn').on('click',function (e) {
                getPosOfLi = parseInt(e.target.parentElement.id.substr(2));
                $('#modalEditInput').val(mainArray[parseInt(e.target.parentElement.id.substr(2))].title);
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
                if (e.target.checked === true) {
                    mainArray[parseInt(e.target.parentElement.id.substr(2))].completed = true;
                }
                else {
                    mainArray[parseInt(e.target.parentElement.id.substr(2))].completed = false;
                }
                pushToLocalStorage();
                renderArray(todoList);
            });
        }
        //download more tasks from server
        $('#loadMoreTodos').on('click',function () {
            let loadFromServerLenght = lastLoadedIdFromServer + 5;
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
        //save button in modal window on edit
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