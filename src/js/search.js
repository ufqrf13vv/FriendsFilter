export default function searchFriends(list) {
    let newArray = [];
    let fullName = '';

    list.forEach( item => {
        fullName = `${item.first_name} ${item.last_name}`;

        if (fullName.toLowerCase().indexOf(event.target.value.toLowerCase()) != -1) {
            newArray.push(item);
        }
    });

    return newArray;
}