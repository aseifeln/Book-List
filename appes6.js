class Book{
    constructor(title,author,isbn){
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

class UI{
    addBookToList(book){
        const list = document.getElementById('book-list');
        // Create a tr element
        const row = document.createElement('tr');
        // Insert cols
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="delete">X</a></td>
            `;

        list.appendChild(row);
    }

    showAlert(message, className){
        // create a div
        const div = document.createElement('div');
        // Add classes
        div.className = `alert ${className}`;
        // add text
        div.appendChild(document.createTextNode(message));
        // Get parent
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        // Insert alert
        container.insertBefore(div, form);

        // Timeout after 3 set
        setTimeout(function(){
            document.querySelector('.alert').remove();
        }, 3000);
    }

    deleteBook(target){
        if(target.className === 'delete'){
            target.parentElement.parentElement.remove();
        }
    }

    clearForm(){
        document.getElementById('title').value = '';
        document.getElementById('author').value = '';
        document.getElementById('isbn').value = '';
    }
}

// Local Storage Class
class Store{
    static getBooks(){
        let books;
        if(localStorage.getItem('books') === null){
            books = [];
        }else{
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }

    static displayBooks(){
        const books = Store.getBooks();

        books.forEach(function(book){
            const ui = new UI();
            ui.addBookToList(book);
        });
    }

    static addBook(book){
        const books = Store.getBooks();

        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn){
        const books = Store.getBooks();

        books.forEach(function(book, index){
            if(book.isbn === isbn){
                books.splice(index, 1)
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}

// Event Listener for loading LS
document.addEventListener('DOMContentLoaded', Store.displayBooks);

// Event Listener for Add Book
document.getElementById('book-form').addEventListener('submit', function(e){
    // Get form values
    const title = document.getElementById('title').value,
          author = document.getElementById('author').value,
          isbn = document.getElementById('isbn').value;

    // Instantiate book
    const book = new Book(title,author,isbn);

    // Instantiate UI
    const ui = new UI();

    // Validate
    if(title === '' || author === '' || isbn === ''){
        // Error alert
        ui.showAlert('Please fill in all fields', 'error');
    }else{
         // Add book to list
        ui.addBookToList(book);
        // Add book to LS
        Store.addBook(book);

        // Show success
        ui.showAlert('Book Added!', 'success');

        // Clear fields
        ui.clearForm();
    }

   

    e.preventDefault();
});

// Event Listener for Delete
document.getElementById('book-list').addEventListener('click', function(e){
    // Instantiate UI
    const ui = new UI();
    ui.deleteBook(e.target);

    // Remove from LS
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    // Show message
    ui.showAlert('Book Removed!', 'success');

    e.preventDefault();
})