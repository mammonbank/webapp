// TODO вынести рэди в layout
$(document).ready(function() {

$('.register__button').click(function() {
    $.post('//localhost:3000/api/clients', {
        firstName: $('#firstName').val(),
        lastName: $('#lastName').val(),
        patronymic: $('#patronymic').val(),
        dateOfBirth: $('#dateOfBirth').val(),
        phoneNumber: $('#phoneNumber').val(),
        email: $('#email').val(),
        password: $('#password').val(),
        passportNumber: $('#passportNumber').val(),
        passportIdNumber: $('#passportIdNumber').val(),
        mothersMaidenName: $('#mothersMaidenName').val()
    }, function(data) {
        console.log(data);
    });
});

});
