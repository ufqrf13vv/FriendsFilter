new Promise( (resolve, reject) => {
    VK.init({
        apiId: 6302770
    });
    VK.Auth.login(response => {
        if (response.session) {
            resolve(response);
        } else {
            reject(new Error('Не удалось авторизироваться!'));
        }
    }, 2)
}).then(response => {
    return new Promise( (resolve, reject) => {
        VK.api('friends.get', { fields: 'nickname, photo_100', v: '5.69', count: 10 }, data => {
            if (data.response) {
                resolve(data.response);
            } else {
                reject(new Error('Не удалось получить список друзей!'))
            }
        })
    });
}).then(result => {
    let wrapper = document.querySelector('.filter__wrapper');
    let search = document.querySelector('.filter__search');
    let allFriendsList = document.querySelector('#all-friends');
    let chooseFriendsList = document.querySelector('#choose-friends');
    let save = document.querySelector('#save');
    let resultList = result.items;
    let newAllFriends = [];
    let friends = {};

    const firstList = JSON.parse(JSON.stringify(result.items));

    if (!localStorage.friends) {
        renderTemplate(result, 'all');
        newAllFriends = result.items;
    } else {    //  если есть сохранённые списки
        friends = JSON.parse(localStorage.friends);
        renderTemplate({ items: friends }, 'choose');
        newAllFriends = friends;
    }

    //  Рендерим списки
    function renderTemplate(data, list) {
        let template = document.querySelector('#user-template').textContent;
        let render = Handlebars.compile(template);
        let html = '';
        let dataItems = data.items;
        let resultItems = result.items;

        if (list === 'all') {
            dataItems.forEach( (item, i, dataItems) => {
                item.class_name = 'filter__item-btn--add';
            });

            html = render(data);
            allFriendsList.innerHTML = html;
        } else if (list === 'choose') {    //  если человек есть в сохранённом списке, то в список выбранных друзей мы его не добавляем
            dataItems.forEach( (item, i, dataItems) => {
                item.class_name = 'filter__item-btn--add';

                resultItems.forEach( (item, j, resultItems) => {
                    item.class_name = 'filter__item-btn--remove';

                    if (item.id == dataItems[i].id) {
                        resultItems.splice(j, 1);
                    }
                });
            });
            //  общий список
            html = render(data);
            allFriendsList.innerHTML = html;

            //  список выбранных друзей
            html = render({items: resultItems});
            chooseFriendsList.innerHTML = html
        } else if (list === 'choose-search') {  //   Поиск по выбранным людям
            dataItems.forEach( (item, i, dataItems) => {
                item.class_name = 'filter__item-btn--remove';
            });

            html = render(data);
            chooseFriendsList.innerHTML = html;
        }
    }

    // Поиск
    search.addEventListener('keyup', event => {
        let fullName = '';

        if (event.target.id == 'search-all') {
            let all = [];

            newAllFriends.forEach( item => {
                fullName = `${item.first_name} ${item.last_name}`;

                if (fullName.toLowerCase().indexOf(event.target.value.toLowerCase()) != -1) {
                    all.push(item);
                }
            });

            renderTemplate({ items: all }, 'all');
        } else {
            let chooseArray = [];
            let arrayOfIndex = [];
            let newChooseArray = [];


            if (!localStorage.friends) {
                firstList.forEach( (firstItem, i) => {
                    resultList.forEach( (resItem, j) => {
                        if (firstItem.id == resItem.id) {
                            arrayOfIndex.push(i);
                        }
                    });
                });
                //  Выбранные элементы
                firstList.forEach( (item, i) => {
                    if (!arrayOfIndex.includes(i)) {
                        chooseArray.push(item);
                    }
                });
            }

            chooseArray.forEach(item => {
                fullName = `${item.first_name} ${item.last_name}`;

                if (fullName.toLowerCase().indexOf(event.target.value.toLowerCase()) != -1) {
                    newChooseArray.push(item);
                }
            });

            renderTemplate({ items: newChooseArray }, 'choose-search');
        }
    });

    wrapper.addEventListener('click', event => {
        if (event.target.nodeName === 'BUTTON') {
            let parent = event.target.parentElement;

            if (event.target.classList.contains('filter__item-btn--add')) {
                event.target.classList.remove('filter__item-btn--add');
                event.target.classList.add('filter__item-btn--remove');

                newAllFriends = moveRight(parent, newAllFriends);
            } else {
                event.target.classList.remove('filter__item-btn--remove');
                event.target.classList.add('filter__item-btn--add');

                friends = moveLeft(parent, result.items, friends);
            }
        }
    });

    let dragElements = wrapper.querySelectorAll('.filter__item');

    [].forEach.call(dragElements, elem => {
        elem.addEventListener('dragstart', function (event) {
            event.dataTransfer.effectAllowed = 'move';
            event.dataTransfer.setData('text', this.dataset.id);

            return true;
        });
    });

    wrapper.addEventListener('dragenter', event => {
        event.preventDefault();

        return true;
    });

    wrapper.addEventListener('dragover', event => {
        event.preventDefault();

        return true;
    });

    wrapper.addEventListener('drop', event => {
        let userId = event.dataTransfer.getData('text');
        let elem = wrapper.querySelector(`.filter__item[data-id="${userId}"`);
        let list = buttonClass(elem.children);

        if (list) {
            newAllFriends = moveRight(elem, newAllFriends);
        } else {
            friends = moveLeft(elem, result.items, friends);
        }
    });

    //  Сохранение данных
    save.addEventListener('click', () => {
        localStorage.friends = JSON.stringify(newAllFriends);
        alert('Данные сохранены!')
    });
}).catch((error) => {
    alert('Ошибка ' + error.message);
});
//  Определение класса кнопки для идентификации списка
function buttonClass(children) {
    let result = false;

    for (let i = 0; i < children.length; i++) {
        if (children[i].classList.contains('filter__item-btn--add')) {
            children[i].classList.remove('filter__item-btn--add');
            children[i].classList.add('filter__item-btn--remove');
            result = true;
        } else if (children[i].classList.contains('filter__item-btn--remove')) {
            children[i].classList.remove('filter__item-btn--remove');
            children[i].classList.add('filter__item-btn--add');
        }
    }

    return result;
}
//  Перемещение элемента в список выбранных друзей
function moveRight(elem, allFriends) {
    let chooseFriends = document.querySelector('#choose-friends');

    chooseFriends.appendChild(elem);

    for (let i = 0; i < allFriends.length; i++) {
        if (allFriends[i].id == elem.dataset.id) {
            allFriends.splice(i, 1);
        }
    }

    return allFriends;
}
//  Перемещение элемента из списка выбранных друзей в общий список
function moveLeft(elem, resultItems, friends) {
    let allFriends = document.querySelector('#all-friends');

    allFriends.appendChild(elem);

    for (let i = 0; i < resultItems.length; i++) {
        if (resultItems[i].id == elem.dataset.id) {
            friends.push(resultItems[i]);
        }
    }

    return friends;
}