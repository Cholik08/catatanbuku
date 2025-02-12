const bookForm = document.getElementById('bookForm');
const bookFormTitle = document.getElementById('bookFormTitle');
const bookFormAuthor = document.getElementById('bookFormAuthor');
const bookFormYear = document.getElementById('bookFormYear');
const bookFormIsComplete = document.getElementById('bookFormIsComplete');

const storageKey = 'STORAGE_KEY';

const cekStorage = () => {
    return typeof (Storage) !== 'undefined';
}

const putBookList = (data) => {
    if (cekStorage()){
        let bookData = [];
        if (localStorage.getItem(storageKey) !== null){
            bookData = JSON.parse(localStorage.getItem(storageKey))
        }

        bookData.unshift(data);

        localStorage.setItem(storageKey,JSON.stringify(bookData))
    }
}

const getBookList = () => {
    if (cekStorage()){
        return JSON.parse(localStorage.getItem(storageKey) || []);
    }
    else{
        return [];
    }
}

const renderBookList = () => {
    const belumDibaca = document.querySelector('#incompleteBookList');
    const bookData = getBookList();
    const filterBook = bookData.filter((book) => book.isComplete === false);

    belumDibaca.innerHTML = '';

    for (let book of filterBook){

        let row = document.createElement('div');
        row.setAttribute('data-bookid',book.id);
        row.setAttribute('data-testid','bookItem');

        row.innerHTML += 
        `<h3 data-testid="bookItemTitle">${book.title}</h3>
        <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
        <p data-testid="bookItemYear">Tahun: ${book.year}</p>
        <div>
            <button data-testid="bookItemIsCompleteButton" onclick={addComplete(${book.id})}>selesai dibaca</button>
            <button data-testid="bookItemDeleteButton" onclick={deleteBook(${book.id})}>hapus</button>
            <button data-testid="bookItemEditButton">edit</button>
        </div>`;
        belumDibaca.appendChild(row);
    }
}

const renderBookListComplete = () => {
    const bookData = getBookList();
    const selesaiDibaca = document.querySelector('#completeBookList');
    const filterBook = bookData.filter((book) => book.isComplete === true);

    selesaiDibaca.innerHTML = '';

    for (let book of filterBook){
        let row = document.createElement('div');
        row.setAttribute('data-bookid',book.id);
        row.setAttribute('data-testid','bookItem');

        row.innerHTML += 
        `<h3 data-testid="bookItemTitle">${book.title}</h3>
        <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
        <p data-testid="bookItemYear">Tahun: ${book.year}</p>
        <div>
            <button data-testid="bookItemIsCompleteButton" onclick={addnoComplete(${book.id})}>belum selesai</button>
            <button data-testid="bookItemDeleteButton" onclick={deleteBookComplete(${book.id})}>hapus</button>
            <button data-testid="bookItemEditButton">edit</button>
        </div>`;
        selesaiDibaca.appendChild(row);
    }
}

const deleteBook = (id) => {
    const konfir = confirm('anda yakin akan menghapus buku ?');
    if (konfir){
        const bookData = getBookList();
        const idBookDelete = id.toString();
        const filterBook = bookData.filter((book) => book.id !== idBookDelete);
        localStorage.setItem(storageKey,JSON.stringify(filterBook));
        renderBookList();
    }
}

const deleteBookComplete = (id) => {
    const konfir = confirm('anda yakin akan menghapus buku ?');
    if (konfir){
        const bookData = getBookList();
        const idBookDelete = id.toString();
        const filterBook = bookData.filter((book) => book.id !== idBookDelete);
        localStorage.setItem(storageKey,JSON.stringify(filterBook));
        renderBookListComplete();
    }
}

const addComplete = (id) => {
    const konfir = confirm('anda yakin telah telah selesai membaca buku ?');
    if (konfir){
        const bookData = getBookList();
        const idBookComplete = id.toString();
        const findBook = bookData.find((book) => book.id === idBookComplete);

        const filterBook = bookData.filter((book) => book.id !== idBookComplete);

        const newBookComplete = {
            id : findBook.id,
            title : findBook.title,
            author : findBook.author,
            year : findBook.year,
            isComplete : true
        }

        localStorage.setItem(storageKey,JSON.stringify(filterBook));
        putBookList(newBookComplete);
        renderBookList();
        renderBookListComplete();
    }
}

const addnoComplete = (id) => {
    const konfir = confirm('anda yakin belum selesai membaca buku ?');
    if (konfir){
        const bookData = getBookList();
        const idBookComplete = id.toString();
        const findBook = bookData.find((book) => book.id === idBookComplete);

        const filterBook = bookData.filter((book) => book.id !== idBookComplete);

        const newBookComplete = {
            id : findBook.id,
            title : findBook.title,
            author : findBook.author,
            year : findBook.year,
            isComplete : false
        }

        localStorage.setItem(storageKey,JSON.stringify(filterBook));
        putBookList(newBookComplete);
        renderBookList();
        renderBookListComplete();
    }
}

bookForm.addEventListener('submit',(e)=>{
    e.preventDefault();

    let complete = bookFormIsComplete;
    
    const bookId = new Date().getTime();
    const bookIdUpdate = bookId.toString();

    if (complete.checked !== true){
        complete = false;
        const newBookData = {
            id : bookIdUpdate,
            title : bookFormTitle.value,
            author : bookFormAuthor.value,
            year : parseInt(bookFormYear.value),
            isComplete : complete
        }
    
        putBookList(newBookData);
        renderBookList();
    }

    else{
        complete = true;
        const newBookData = {
            id : bookIdUpdate,
            title : bookFormTitle.value,
            author : bookFormAuthor.value,
            year : parseInt(bookFormYear.value),
            isComplete : complete
        }
    
        putBookList(newBookData);
        renderBookListComplete();
    }
})

window.addEventListener('load', () => {
    if (cekStorage()){
        if (localStorage.getItem(storageKey) !== null) {
            renderBookList();
            renderBookListComplete();
        }
    }
})