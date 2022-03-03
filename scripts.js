const modalOverlay = document.querySelector('.modal-overlay');

const modal = {
    Toggle() {
        modalOverlay.classList.toggle('active');
    }
};

const Storage = {
    get() {
        return JSON.parse(localStorage.getItem("dev.finances:transactions")) || [];
        //  JSON.parse(string) converts string into an array
    },
    set(transactions) {
        localStorage.setItem("dev.finances:transactions", JSON.stringify(transactions));
        //  JSON.stringify(array) converts array into string
    }
};

const transactionsMethods = {
    all: Storage.get(),
    create(transaction) {
        transactionsMethods.all.push(transaction);

        App.reload();
    },
    delete(index) {
        transactionsMethods.all.splice(index, 1);

        App.reload();
    },
    incomes() {
        let totalIncomes = 0;

        transactionsMethods.all.forEach(transaction => {
            if (transaction.amount > 0) totalIncomes+=transaction.amount; 
        });

        return totalIncomes;
    },
    expenses() {
        let totalExpenses = 0;

        transactionsMethods.all.forEach(transaction => {
            if (transaction.amount < 0) totalExpenses+=transaction.amount;
        });

        return totalExpenses;
    },
    total() {
        let total = 0;

        transactionsMethods.all.forEach(transaction => {
            total+=transaction.amount;
        });

        return total;
    }
};

const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),
    addTransaction(transaction, index) {
        const tr = document.createElement('tr');
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index);
        tr.dataset.index = index;

        DOM.transactionsContainer.appendChild(tr);
    },
    innerHTMLTransaction(transaction, index) {
        const transactionType = transaction.amount > 0 ? "income" : "expense";

        const formattedAmount = Utils.formatCurrency(transaction.amount);

        const html = `
            <tr>
                <td class="description">${transaction.description}</td>
                <td class="${transactionType}">${formattedAmount}</td>
                <td class="date">${transaction.date}</td>
                <td>
                    <img class="remove-button" src="./assets/minus.svg" alt="Remove transaction" onclick="transactionsMethods.delete(${index})"/>
                </td>
            </tr>
        `;

        return html;
    },
    updateBalance() {
        document.getElementById('totalIncomesDisplay').innerHTML = Utils.formatCurrency(transactionsMethods.incomes());

        document.getElementById('totalExpensesDisplay').innerHTML = Utils.formatCurrency(transactionsMethods.expenses());

        document.getElementById('totalDisplay').innerHTML = Utils.formatCurrency(transactionsMethods.total());
    },
    clearTransactions() {
        DOM.transactionsContainer.innerHTML = '';
    }
};

const Utils = {
    formatAmount(amount) {
        amount = Number(amount) * 100;
        return Math.round(amount);
    },
    formatDate(date) {
        date = date.split("-");
        return `${date[1]}/${date[2]}/${date[0]}`;
    },
    formatCurrency(value) {
        value = (value/100).toLocaleString("en-US", {
            style: "currency",
            currency: "USD"
        });

        return value;
    }
};

const Form = {
    descriptionInput: document.querySelector('input#description'),
    amountInput: document.querySelector('input#amount'),
    dateInput: document.querySelector('input#date'),
    getValues() {
        return {
            description: Form.descriptionInput.value,
            amount: Form.amountInput.value,
            date: Form.dateInput.value
        };
    },
    validateFields() {
        const { description, amount, date } = Form.getValues();

        if (description.trim() === '' || amount.trim() === '' || date.trim() === '') {
            throw new Error("Please, fill all the fields.");
        };
    },
    formatData() {
        let { description, amount, date } = Form.getValues();

        amount = Utils.formatAmount(amount);
        date = Utils.formatDate(date);

        return {
            description,
            amount,
            date
        };
    },
    clearFields() {
        Form.descriptionInput.value = '';
        Form.amountInput.value = '';
        Form.dateInput.value = '';
    },
    submit(event) {
        event.preventDefault();

        try {
            Form.validateFields();

            const transaction = Form.formatData();

            transactionsMethods.create(transaction);

            Form.clearFields();

            modal.Toggle();
        } catch (error) {
            alert(error.message);
        };
    }
};

const App = {
    init() {
        transactionsMethods.all.forEach(DOM.addTransaction);
        
        DOM.updateBalance();

        Storage.set(transactionsMethods.all);
    },
    reload() {
        DOM.clearTransactions();
        App.init();
    }
};

App.init();

//  Transactions management - END