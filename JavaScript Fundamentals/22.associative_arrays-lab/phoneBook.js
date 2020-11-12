function phoneBook(input) {
    let phonebook = {}

    for (let line of input){
        line = line.split(' ');
        let [name, phoneNumber] = line;
        phonebook[name] = phoneNumber;
    }

    for (let key in phonebook){
        console.log(`${key} -> ${phonebook[key]}`);
    }
}

phoneBook(
    ['Tim 0834212554',
    'Peter 0877547887',
    'Bill 0896543112',
    'Tim 0876566344']
)