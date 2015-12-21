class Viewer {
    static renderCreditApps(creditApps) {
        var html = '<ul>';
        creditApps.forEach((creditApp) => {
            html += '<li>' + creditApp.plannedSum + '</li>';
        });
        html += '</ul>';

        $('main').append(html);
    }
}