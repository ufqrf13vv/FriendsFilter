/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "../";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _style = __webpack_require__(1);

var _style2 = _interopRequireDefault(_style);

var _index = __webpack_require__(2);

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

new Promise(function (resolve, reject) {
    VK.init({
        apiId: 6302770
    });
    VK.Auth.login(function (response) {
        if (response.session) {
            resolve(response);
        } else {
            reject(new Error('Не удалось авторизироваться!'));
        }
    }, 2);
}).then(function (response) {
    return new Promise(function (resolve, reject) {
        VK.api('friends.get', { fields: 'nickname, photo_100', v: '5.69', count: 10 }, function (data) {
            if (data.response) {
                resolve(data.response);
            } else {
                reject(new Error('Не удалось получить список друзей!'));
            }
        });
    });
}).then(function (result) {
    var wrapper = document.querySelector('.filter__wrapper');
    var search = document.querySelector('.filter__search');
    var allFriendsList = document.querySelector('#all-friends');
    var chooseFriendsList = document.querySelector('#choose-friends');
    var save = document.querySelector('#save');
    var resultList = result.items;
    var newAllFriends = [];
    var friends = {};

    var firstList = JSON.parse(JSON.stringify(result.items));

    if (!localStorage.friends) {
        renderTemplate(result, 'all');
        newAllFriends = result.items;
    } else {
        //  если есть сохранённые списки
        friends = JSON.parse(localStorage.friends);
        renderTemplate({ items: friends }, 'choose');
        newAllFriends = friends;
    }

    //  Рендерим списки
    function renderTemplate(data, list) {
        var template = document.querySelector('#user-template').textContent;
        var render = Handlebars.compile(template);
        var html = '';
        var dataItems = data.items;
        var resultItems = result.items;

        if (list === 'all') {
            dataItems.forEach(function (item, i, dataItems) {
                item.class_name = 'filter__item-btn--add';
            });

            html = render(data);
            allFriendsList.innerHTML = html;
        } else if (list === 'choose') {
            //  если человек есть в сохранённом списке, то в список выбранных друзей мы его не добавляем
            dataItems.forEach(function (item, i, dataItems) {
                item.class_name = 'filter__item-btn--add';

                resultItems.forEach(function (item, j, resultItems) {
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
            html = render({ items: resultItems });
            chooseFriendsList.innerHTML = html;
        } else if (list === 'choose-search') {
            //   Поиск по выбранным людям
            dataItems.forEach(function (item, i, dataItems) {
                item.class_name = 'filter__item-btn--remove';
            });

            html = render(data);
            chooseFriendsList.innerHTML = html;
        }
    }

    // Поиск
    search.addEventListener('keyup', function (event) {
        var fullName = '';

        if (event.target.id == 'search-all') {
            var all = [];

            newAllFriends.forEach(function (item) {
                fullName = item.first_name + ' ' + item.last_name;

                if (fullName.toLowerCase().indexOf(event.target.value.toLowerCase()) != -1) {
                    all.push(item);
                }
            });

            renderTemplate({ items: all }, 'all');
        } else {
            var chooseArray = [];
            var arrayOfIndex = [];
            var newChooseArray = [];

            if (!localStorage.friends) {
                firstList.forEach(function (firstItem, i) {
                    resultList.forEach(function (resItem, j) {
                        if (firstItem.id == resItem.id) {
                            arrayOfIndex.push(i);
                        }
                    });
                });
                //  Выбранные элементы
                firstList.forEach(function (item, i) {
                    if (!arrayOfIndex.includes(i)) {
                        chooseArray.push(item);
                    }
                });
            }

            chooseArray.forEach(function (item) {
                fullName = item.first_name + ' ' + item.last_name;

                if (fullName.toLowerCase().indexOf(event.target.value.toLowerCase()) != -1) {
                    newChooseArray.push(item);
                }
            });

            renderTemplate({ items: newChooseArray }, 'choose-search');
        }
    });

    wrapper.addEventListener('click', function (event) {
        if (event.target.nodeName === 'BUTTON') {
            var parent = event.target.parentElement;

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

    var dragElements = wrapper.querySelectorAll('.filter__item');

    [].forEach.call(dragElements, function (elem) {
        elem.addEventListener('dragstart', function (event) {
            event.dataTransfer.effectAllowed = 'move';
            event.dataTransfer.setData('text', this.dataset.id);

            return true;
        });
    });

    wrapper.addEventListener('dragenter', function (event) {
        event.preventDefault();

        return true;
    });

    wrapper.addEventListener('dragover', function (event) {
        event.preventDefault();

        return true;
    });

    wrapper.addEventListener('drop', function (event) {
        var userId = event.dataTransfer.getData('text');
        var elem = wrapper.querySelector('.filter__item[data-id="' + userId + '"');
        var list = buttonClass(elem.children);

        if (list) {
            newAllFriends = moveRight(elem, newAllFriends);
        } else {
            friends = moveLeft(elem, result.items, friends);
        }
    });

    //  Сохранение данных
    save.addEventListener('click', function () {
        localStorage.friends = JSON.stringify(newAllFriends);
        alert('Данные сохранены!');
    });
}).catch(function (error) {
    alert('Ошибка ' + error.message);
});
//  Определение класса кнопки для идентификации списка
function buttonClass(children) {
    var result = false;

    for (var i = 0; i < children.length; i++) {
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
    var chooseFriends = document.querySelector('#choose-friends');

    chooseFriends.appendChild(elem);

    for (var i = 0; i < allFriends.length; i++) {
        if (allFriends[i].id == elem.dataset.id) {
            allFriends.splice(i, 1);
        }
    }

    return allFriends;
}
//  Перемещение элемента из списка выбранных друзей в общий список
function moveLeft(elem, resultItems, friends) {
    var allFriends = document.querySelector('#all-friends');

    allFriends.appendChild(elem);

    for (var i = 0; i < resultItems.length; i++) {
        if (resultItems[i].id == elem.dataset.id) {
            friends.push(resultItems[i]);
        }
    }

    return friends;
}

/***/ }),
/* 1 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "index.html";

/***/ })
/******/ ]);