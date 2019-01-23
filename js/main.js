
    $(document).ready(function () {
        let mainArray = [];
        let parseLocal = JSON.parse(localStorage.getItem('localStorageArray'));
            // {
            //     "id": 0,
            //     "title": 'text1',
            //     "completed": false
            // }
        if (parseLocal != null) {
            mainArray = parseLocal;
        }
        let todoList = document.getElementById('todoList');
        renderArray(todoList);
        //add element button
        $('#addButton').on('click',function getInputText() {
            let text = document.getElementById('inputText').value;
            if (text != '') {
                mainArray.push({
                    "id": mainArray.length,
                    "title": text,
                    "completed": false
                });
            }
            document.getElementById('inputText').value = '';
            if (mainArray != null) {
                pushToLocalStorage();
            }
            renderArray(todoList);
        });

        function renderArray(todoList) {
            todoList.innerHTML = '';
            for (i = 0; i < mainArray.length; i++) {
                let li = document.createElement('li');
                let todoStatus = document.createElement('input');
                let rmBtn = document.createElement('button');
                li.appendChild(todoStatus);
                //check completed or not
                if (mainArray[i].completed === true) {
                    li.setAttribute('style', 'text-decoration:line-through');
                    todoStatus.setAttribute('checked', 'checked');
                }
                todoStatus.setAttribute('type', 'checkbox');
                todoStatus.setAttribute('class', 'todoListCheckboxItem');
                li.appendChild(document.createTextNode(mainArray[i].title));
                li.appendChild(rmBtn);
                li.setAttribute('id','li' + i);
                rmBtn.setAttribute('class', 'rmBtn');
                rmBtn.appendChild(document.createTextNode('\u00D7'));
                todoList.appendChild(li);
            }
            //delete element button
            $('.rmBtn').click(function (e) {
                let li = e.target.parentElement.id;
                let elem = parseInt(li.substr(2));
                mainArray.splice(elem,1);
                pushToLocalStorage();
                renderArray(todoList);
            });
            //clear array and local storage
            $('#clearArrayStorage').click(function () {
                localStorage.clear();
                document.getElementById('todoList').innerHTML = '';
                mainArray = [];
            });
            $('#loadMoreTodos').click(function () {
                let secondArr = [];
                renderArray(todoList);
                $(function(){
                    $.getJSON('https://jsonplaceholder.typicode.com/todos', function(data) {
                        secondArr = data;
                        secondArr.splice(10, 190);
                        for (i = 0; i <10; i++) {
                            mainArray[mainArray.length] = secondArr[i];
                        }
                        pushToLocalStorage();
                        renderArray(todoList);
                    });
                });
            });
            //get parent id and set parameter "completed"
            $('.todoListCheckboxItem').click(function (e) {
                let li = e.target.parentElement.id;
                let elem = parseInt(li.substr(2));
                if (e.target.checked == true) {
                    mainArray[elem].completed = true;
                }
                else {
                    mainArray[elem].completed = false;
                }
                pushToLocalStorage();
                renderArray(todoList);
            });
        }
        function pushToLocalStorage() {
            localStorage.setItem('localStorageArray', JSON.stringify(mainArray));
        }
    });