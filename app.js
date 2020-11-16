if (typeof (document) !== "undefined") {
    //script
}
//Represents day wise entries
class journalEntry {
    constructor(date, myEntry) {
        this.date = date;
        this.myEntry = myEntry;
    }
}

//Managing user tasks
class user {
    static displayEntries() {
        const entry1 = storeEntries.getEntries();

        entry1.forEach((entry) => user.addEntry(entry));
    }
    static addEntry(entry) {
        const list = document.querySelector('#journalEntry');

        const row = document.createElement('tr');

        row.innerHTML = `
        <td>${entry.date}</td>
        <td>${entry.myEntry}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;

        list.appendChild(row);
    }

    static deleteEntry(el) {
        if (el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#journal');
        container.insertBefore(div, form);

        //Alert meaasge vanish in 2 seconds
        setTimeout(() => document.querySelector('.alert').remove(), 2000);
    }

    static clearFields() {
        document.querySelector('#date').value = '';
        document.querySelector('#myEntry').value = '';
    }
}

//local storage class
class storeEntries {
    static getEntries() {
        let entries;
        if (localStorage.getItem('entries') === null) {
            entries = [];
        } else {
            entries = JSON.parse(localStorage.getItem('entries'));
        }

        return entries;
    }
    static addEntry(entry) {
        const entries = storeEntries.getEntries();
        entries.push(entry);
        localStorage.setItem('entries', JSON.stringify(entries));
    }

    static removeEntry(date) {
        const entries = storeEntries.getEntries();

        entries.forEach((entry, index) => {
            if (entry.date === date) {
                entries.splice(index, 1);
            }
        });

        localStorage.setItem('entries', JSON.stringify(entries));
    }
}

//Event: Displaying the entires
window.addEventListener('DOMContentLoaded', function () {
    user.displayEntries();
});
// Event: Adding an entry
document.querySelector('#journal').addEventListener('submit', (e) => {
    //prevent default
    e.preventDefault();
    //console.log('test');
    //getting the values in the form

    const date = document.querySelector('#date').value;
    const myEntry = document.querySelector('#myEntry').value;

    //validating
    if (date === '' || myEntry === '') {
        user.showAlert('Please fill in all fields', 'danger');
    } else {
        const setEntry = new journalEntry(date, myEntry);

        //adding Journal Entry to the table
        user.addEntry(setEntry);

        //storing Journal Entry in local storage
        storeEntries.addEntry(setEntry);

        // showing success message
        user.showAlert('Entry is added', 'success');

        //clearing all the fields
        user.clearFields();
    }

});

document.querySelector('#journalEntry').addEventListener('click', (e) => {
    // Removing entry from the journal (user interface)
    user.deleteEntry(e.target);

    // Removing book from local storage
    storeEntries.removeEntry(e.target.parentElement.previousElementSibling.textContent);

    //Shows success message
    user.showAlert('Entry deleted', 'success');

});
//test push