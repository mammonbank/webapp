class Eventer {
    static bindHeaderEvents() {
        $('#logout-btn').on('click', () => {
            localStorage.removeItem('id');
            localStorage.removeItem('token');
            window.location.replace('/');
        })
    }
}