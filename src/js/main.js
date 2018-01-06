import { buttonClass, getChooseArray, renderTemplate } from './lists';
import { moveRight, moveLeft, getDragElements } from './d&d';
import api from './vk';
import searchFriends from './search';

import styles from '../css/style.css';
import html from '../index.hbs';

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
    return api('friends.get', { fields: 'nickname, photo_100', v: '5.69' });
}).then(result => {
    let wrapper = document.querySelector('.filter__wrapper');
    let search = document.querySelector('.filter__search');
    let allFriendsList = document.querySelector('#all-friends');
    let chooseFriendsList = document.querySelector('#choose-friends');
    let save = document.querySelector('#save');
    let friends = {};
    let resultList = JSON.parse(JSON.stringify(result.items));

    const firstList = JSON.parse(JSON.stringify(result.items));

    if (!localStorage.friends) {
        renderTemplate(result, firstList, 'all', allFriendsList);
        getDragElements(wrapper);
    } else {    //  если есть сохранённые списки
        resultList = JSON.parse(localStorage.friends);
        renderTemplate({ items: resultList }, result.items, 'choose', allFriendsList, chooseFriendsList);
        getDragElements(wrapper);
    }

    // Поиск
    search.addEventListener('keyup', event => {
        if (event.target.id == 'search-all') {
            let all = searchFriends(resultList);

            renderTemplate({ items: all }, firstList, 'all', allFriendsList);
            getDragElements(wrapper);
        } else {
            let chooseArray = getChooseArray(firstList, resultList);
            let newChooseArray = searchFriends(chooseArray);

            renderTemplate({ items: newChooseArray }, firstList, 'choose-search', allFriendsList, chooseFriendsList);
            getDragElements(wrapper);
        }
    });

    wrapper.addEventListener('click', event => {
        if (event.target.nodeName === 'BUTTON') {
            let parent = event.target.parentElement;

            if (event.target.classList.contains('filter__item-btn--add')) {
                event.target.classList.remove('filter__item-btn--add');
                event.target.classList.add('filter__item-btn--remove');

                moveRight(parent, resultList, chooseFriendsList);
            } else {
                event.target.classList.remove('filter__item-btn--remove');
                event.target.classList.add('filter__item-btn--add');

                moveLeft(parent, firstList, resultList, allFriendsList);
            }
        }
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
            moveRight(elem, resultList, chooseFriendsList);
        } else {
            moveLeft(elem, firstList, resultList, allFriendsList);
        }
    });

    //  Сохранение данных
    save.addEventListener('click', () => {
        localStorage.friends = JSON.stringify(resultList);
        alert('Данные сохранены!')
    });
}).catch((error) => {
    alert('Ошибка ' + error.message);
});