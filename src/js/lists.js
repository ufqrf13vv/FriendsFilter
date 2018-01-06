import Handlebars from 'handlebars/dist/handlebars.min.js';

//  Определение класса кнопки для идентификации списка
export function buttonClass(children) {
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
//  Формирование списка выбранных друзей
export function getChooseArray(firstList, resultList) {
    let chooseArray = [];
    let arrayOfIndex = [];

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

    return chooseArray;
}
//  Рендерим списки
export function renderTemplate(dataList, initiallyList, list, leftContainer, rightContainer = '') {
    let html = '';
    let dataListItems = dataList.items;
    let template = `{{#each items}}
                        <li class="filter__item" data-id="{{id}}" draggable="true">
                            <div class="filter__item-photo" style="background: url('{{photo_100}}'); background-size: cover;"></div>
                            <div class="filter__item-name">{{first_name}} {{last_name}}</div>
                            <button class="filter__item-btn {{class_name}}"></button>
                        </li>
                        {{/each}}`;
    let render = Handlebars.compile(template);

    if (list === 'all') {
        dataListItems.forEach( (item) => {
            item.class_name = 'filter__item-btn--add';
        });

        html = render(dataList);
        leftContainer.innerHTML = html;
    } else if (list === 'choose') {    //  если человек есть в сохранённом списке, то в список выбранных друзей мы его не добавляем
        dataListItems.forEach( (item, i) => {
            item.class_name = 'filter__item-btn--add';

            initiallyList.forEach( (item, j, initiallyList) => {
                item.class_name = 'filter__item-btn--remove';

                if (item.id == dataListItems[i].id) {
                    initiallyList.splice(j, 1);
                }
            });
        });
        //  общий список
        html = render(dataList);
        leftContainer.innerHTML = html;
        //  список выбранных друзей
        html = render({items: initiallyList});
        rightContainer.innerHTML = html
    } else if (list === 'choose-search') {  //   Поиск по выбранным людям
        dataListItems.forEach( (item) => {
            item.class_name = 'filter__item-btn--remove';
        });

        html = render(dataList);
        rightContainer.innerHTML = html;
    }
}