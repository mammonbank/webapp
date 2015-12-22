class Eventer {
    static bindHeaderEvents() {
        $('#logout-btn').on('click', () => {
            localStorage.removeItem('id');
            localStorage.removeItem('token');
            window.location.replace('/');
        });

        let $currentTimeEl = $('#currentTime');
        let currentTime = moment().format('dddd, MMMM Do YYYY, HH:mm:ss');
        $currentTimeEl.html(currentTime);
        setInterval(() => {
            currentTime = moment().format('dddd, MMMM Do YYYY, HH:mm:ss');
            $currentTimeEl.html(currentTime);
        }, 1000)
    }
}