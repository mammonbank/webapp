class Index {
    static getFormData() {
        var formData = $('#login-form').serializeArray();
        
        if (!formData[0].value || !formData[1].value) {
            alertify.error("Заполните поля");
            return;
        }
        
        return {
            username: formData[0].value,
            password: formData[1].value
        }
    }
    
    static login(username, password) {
        return $.ajax({
            url: URLS.BANK_LOGIN.URL,
            method: URLS.BANK_LOGIN.METHOD,
            data: {
                username: username,
                password: password
            }
        });
    }
    
    static init() {
        $('#login-button').on('click', (e) => {
            e.preventDefault();
            var formData = this.getFormData();
            if (!formData) {
                return;
            }
            
            this.login(formData.username, formData.password)
            .done((data) => {
                alertify.success("Доступ разрешен");
                setTimeout(() => {
                    alertify.log("Перенаправляю в кабинет...");
                }, 500);
                
                setTimeout(() => {
                    window.history.pushState("bank_login", "Login", '/');
                    window.location.replace(URLS.BANK_DASHBOARD.URL);
                }, 1500);
            })
            .fail((error) => {
                alertify.error("Доступ запрещен");
            })
        });
    }
}


$(function() {
    Index.init();
});
