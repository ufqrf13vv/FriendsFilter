//  Динамический список drag&drop элементов
export function getDragElements(container) {
    let childNodes = container.childNodes;
    let arrayItems = [];

    for (let i = 0; i < childNodes.length; i++) {
        if (childNodes[i].nodeName == 'DIV' && childNodes[i].classList.contains('filter__block')) {
            let children = childNodes[i].children;

            for (let j = 0; j < children.length; j++) {
                if (children[j].classList.contains('filter__list')) {
                    let listChildren = children[j].children;

                    for (let x = 0; x < listChildren.length; x++) {
                        if (listChildren[x].classList.contains('filter__item')) {
                            arrayItems.push(listChildren[x]);
                        }
                    }
                }
            }
        }
    }

    [].forEach.call(arrayItems, elem => {
        elem.addEventListener('dragstart', function (event) {
            event.dataTransfer.effectAllowed = 'move';
            event.dataTransfer.setData('text', this.dataset.id);
            return true;
        });
    });
}
//  Перемещение элемента в список выбранных друзей
export function moveRight(elem, allFriends, container) {
    container.appendChild(elem);

    for (let i = 0; i < allFriends.length; i++) {
        if (allFriends[i].id == elem.dataset.id) {
            allFriends.splice(i, 1);
        }
    }
}
//  Перемещение элемента из списка выбранных друзей в общий список
export function moveLeft(elem, resultItems, chooseFriends, container) {
    container.appendChild(elem);

    for (let i = 0; i < resultItems.length; i++) {
        if (resultItems[i].id == elem.dataset.id) {
            chooseFriends.push(resultItems[i]);
        }
    }
}