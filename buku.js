document.addEventListener('DOMContentLoaded', function () {
    const unreadBooks = JSON.parse(localStorage.getItem('unreadBooks')) || [];
    const readBooks = JSON.parse(localStorage.getItem('readBooks')) || [];

    displayBooks('unread-list', unreadBooks);
    displayBooks('read-list', readBooks);
});

function addBook() {
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const yearInput = document.getElementById('year').value;
    const status = document.getElementById('status').value;

    if (title && author && yearInput !== '' && !isNaN(yearInput)) {
        const year = Number(yearInput);
        const id = +new Date();

        const newBook = {
            id,
            title,
            author,
            year,
            isComplete: status === 'read',
        };

        const shelf = status === 'read' ? 'read' : 'unread';

        const books = JSON.parse(localStorage.getItem(`${shelf}Books`)) || [];
        books.push(newBook);

        localStorage.setItem(`${shelf}Books`, JSON.stringify(books));

        displayBooks(`${shelf}-list`, books);

        document.getElementById('title').value = '';
        document.getElementById('author').value = '';
        document.getElementById('year').value = '';
    } else {
        alert('Mohon isi semua kolom dengan benar.');
    }
}

function moveBook(id, fromShelf, toShelf) {
    const fromBooks = JSON.parse(localStorage.getItem(`${fromShelf}Books`)) || [];
    const toBooks = JSON.parse(localStorage.getItem(`${toShelf}Books`)) || [];

    const movedBook = fromBooks.find(book => book.id === id);

    if (movedBook) {
        fromBooks.splice(fromBooks.indexOf(movedBook), 1);
        toBooks.push(movedBook);

        localStorage.setItem(`${fromShelf}Books`, JSON.stringify(fromBooks));
        localStorage.setItem(`${toShelf}Books`, JSON.stringify(toBooks));

        displayBooks(`${fromShelf}-list`, fromBooks);
        displayBooks(`${toShelf}-list`, toBooks);
    }
}

function deleteBook(id, shelf) {
    const books = JSON.parse(localStorage.getItem(`${shelf}Books`)) || [];
    const bookIndex = books.findIndex(book => book.id === id);

    if (bookIndex !== -1) {
        books.splice(bookIndex, 1);
        localStorage.setItem(`${shelf}Books`, JSON.stringify(books));
        displayBooks(`${shelf}-list`, books);
    }
}

function displayBooks(listId, books) {
    const list = document.getElementById(listId);
    list.innerHTML = '';

    books.forEach(book => {
        const li = document.createElement('li');
        li.textContent = `ID: ${book.id} , ${book.title} oleh ${book.author}, Year: ${book.year}, Status: ${book.isComplete ? 'Read' : 'Unread'}`;

        const moveButton = document.createElement('button');
        moveButton.textContent = 'Move';
        moveButton.classList.add('move-button');
        moveButton.addEventListener('click', () => moveBook(book.id, `${listId.split('-')[0]}`, `${listId.includes('unread') ? 'read' : 'unread'}`));

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('delete-button');
        deleteButton.addEventListener('click', () => deleteBook(book.id, `${listId.split('-')[0]}`));

        li.appendChild(moveButton);
        li.appendChild(deleteButton);

        list.appendChild(li);
    });
}
