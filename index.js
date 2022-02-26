const buttonNewTransaction = document.querySelector('.new');
const buttonFormCancel = document.querySelector('.cancel');
const modalOverlay = document.querySelector('.modal-overlay');

buttonNewTransaction.onclick = function() {
    modalOverlay.classList.add('active');
};

buttonFormCancel.onclick = function() {
    modalOverlay.classList.remove('active');
};
