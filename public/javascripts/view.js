const back_button = document.querySelector('#back_button');

back_button.onclick = e => {
    window.history.back();
};