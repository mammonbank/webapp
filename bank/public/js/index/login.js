$(function() {
    
    function login(username, password) {
        return $.ajax({
            url: URLS.BANK_LOGIN.URL,
            method: URLS.BANK_LOGIN.METHOD
        });
    }

    $('#login-button').on('click', (e) => {
        e.preventDefault();
        login()
        .done((data) => {
            alertify.success("Доступ разрешен");
        })
        .fail((error) => {
            alertify.error("Доступ запрещен");
        })
    });
    
});