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
            url: URLS.BANK_LOGIN,
            method: 'POST',
            data: {
                username: username,
                password: password
            }
        });
    }

    static saveData(data) {
        localStorage.setItem('id', data.id);
        localStorage.setItem('token', data.token);
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

                this.saveData(data);

                setTimeout(() => {
                    alertify.log("Перенаправляю в кабинет...");
                }, 500);
                
                setTimeout(() => {
                    window.history.pushState("bank_login", "Login", '/');
                    window.location.replace(URLS.BANK_DASHBOARD);
                }, 1500);
            })
            .fail((error) => {
                console.error(error.message);
                alertify.error("Доступ запрещен");
            })
        });
    }
}


$(() => {
    Index.init();
});
