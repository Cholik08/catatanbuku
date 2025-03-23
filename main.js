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
    const belumDibaca = document.getElementById('inCompleteBookList');
    const bookData = getBookList();
    const filterBook = bookData.filter((book) => book.isComplete === false);

    belumDibaca.innerHTML = '';

    for (let book of filterBook){

        belumDibaca.innerHTML += 
        `<tr>
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.year}</td>
            <td>
                <div class='d-flex justify-content-center'>
                    <button class='btn btn-sm btn-success me-1' onclick={addComplete(${book.id})}>selesai dibaca</button>
                    <button class='btn btn-sm btn-danger me-1' onclick={deleteBook(${book.id})}>hapus</button>
                    <button class='btn btn-sm btn-warning' onclick={editBook(${book.id})}>edit</button>
                </div>
            </td>
        </tr>`;
    }
}

const renderBookListComplete = () => {
    const bookData = getBookList();
    const selesaiDibaca = document.getElementById('completeBookList');
    const filterBook = bookData.filter((book) => book.isComplete === true);

    selesaiDibaca.innerHTML = '';

    for (let book of filterBook){
        selesaiDibaca.innerHTML += 
        `<tr>
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.year}</td>
            <td>
                <div class='d-flex justify-content-center'>
                    <button class='btn btn-sm btn-success me-1' onclick={addComplete(${book.id})}>selesai dibaca</button>
                    <button class='btn btn-sm btn-danger me-1' onclick={deleteBook(${book.id})}>hapus</button>
                    <button class='btn btn-sm btn-warning' onclick={editBook(${book.id})}>edit</button>
                </div>
            </td>
        </tr>`;
    }
}

const refBook = () => {
    belumDibaca.setAttribute('class','visible');
    sudahDibaca.setAttribute('class','visible');
    const hasilCari = document.getElementById('pencarianBuku');
    hasilCari.setAttribute('class','d-none')
}

const deleteBook = (id) => {
    const konfir = confirm('anda yakin akan menghapus buku ?');
    if (konfir){
        const bookData = getBookList();
        const idBookDelete = id.toString();
        const filterBook = bookData.filter((book) => book.id !== idBookDelete);
        localStorage.setItem(storageKey,JSON.stringify(filterBook));
        renderBookList();
        renderBookListComplete();
        refBook();
    }
}

const deleteBookComplete = (id) => {
    const konfir = confirm('anda yakin akan menghapus buku ?');
    if (konfir){
        const bookData = getBookList();
        const idBookDelete = id.toString();
        const filterBook = bookData.filter((book) => book.id !== idBookDelete);
        localStorage.setItem(storageKey,JSON.stringify(filterBook));
        renderBookList();
        renderBookListComplete();
        refBook();
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
        refBook();
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
        refBook();
    }
}

const editBook = (id) => {
    
    bookForm.setAttribute('class','d-none');

    bookEdit.setAttribute('class','d-flex justify-content-center');

    const idBook = id.toString();
    const bookData = getBookList();
    const findBook = bookData.find((book) => book.id === idBook);
    const indexBook = bookData.findIndex((book) => book.id === idBook);

    const bookFormTitleEdit = document.getElementById('bookFormTitleEdit');
    const bookFormAuthorEdit = document.getElementById('bookFormAuthorEdit');
    const bookFormYearEdit = document.getElementById('bookFormYearEdit');

    bookFormTitleEdit.value = findBook.title;
    bookFormAuthorEdit.value = findBook.author;
    bookFormYearEdit.value = findBook.year;

    const bookFormEdit = document.getElementById('bookFormEdit');
    bookFormEdit.addEventListener('submit',(e) => {
        e.preventDefault();
        
        const newBookComplete = {
            id : findBook.id,
            title : bookFormTitleEdit.value,
            author : bookFormAuthorEdit.value,
            year : bookFormYearEdit.value,
            isComplete : findBook.isComplete
        }
        
        bookData.splice(indexBook,1,newBookComplete);
        localStorage.setItem(storageKey,JSON.stringify(bookData));
        renderBookList();
        renderBookListComplete();
        refBook();

        bookForm.setAttribute('class','visible w-50');

        bookEdit.setAttribute('class','d-none');
    });
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

const searchSubmit = document.getElementById('searchBook');
searchSubmit.addEventListener('submit', (e) => {
    e.preventDefault();

    const hasilCari = document.getElementById('pencarianBuku');
    const belumDibaca = document.getElementById('belumDibaca');
    const sudahDibaca = document.getElementById('sudahDibaca');
    const tidakDitemukanBuku = document.getElementById('tidakDitemukanBuku')

    if (localStorage.getItem(storageKey) === null){
        hasilCari.setAttribute('class','cari-buku')
    }
    else{
        let searchTitle = document.getElementById('searchBookTitle').value;
        const searchValue = searchTitle.toLowerCase();
        const bookData = getBookList();
        const filterBook = bookData.filter((book) => book.title.toLowerCase() === searchValue || book.author.toLowerCase() === searchValue || book.year.toString() === searchValue);

        const pencarianBuku = document.getElementById('searchBookList');

        pencarianBuku.innerHTML = '';
        for (let book of filterBook){

            let status = '';
            let p = '';
            if (book.isComplete === false){
                status = 'belum selesai';
                p = 'text-danger';
            }
            else{
                status = 'selesai';
                p = 'text-success';
            }

            pencarianBuku.innerHTML += 
            `<tr>
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>${book.year}</td>
                <td class='${p} text-center'>${status}</td>
                <td>
                    <div class='d-flex justify-content-center'>
                        <button class='btn btn-sm btn-success me-1' onclick={addComplete(${book.id})}>belum dibaca</button>
                        <button class='btn btn-sm btn-danger me-1' onclick={deleteBook(${book.id})}>hapus</button>
                        <button class='btn btn-sm btn-warning'>edit</button>
                    </div>
                </td>
            </tr>`;

            tidakDitemukanBuku.setAttribute('class','d-none');
        }

        hasilCari.setAttribute('class','cari-buku');
        belumDibaca.setAttribute('class','invisible');
        sudahDibaca.setAttribute('class','invisible');
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