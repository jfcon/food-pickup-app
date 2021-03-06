// Purpose is to test that inputs are valid on the order review page before allowing user to submit

$(() => {

    //disable button on load
    $('#confirmOrder').prop('disabled', true); 

    let firstNameLength = 0;
    let lastNameLength = 0;
    let phoneInputLength = 0;

    $("#firstName").keyup(function() {
        firstNameLength = $('#firstName').val().length;
        submitStatus();
    })

    $("#lastName").keyup(function() {
        lastNameLength = $('#lastName').val().length;
        submitStatus();
    });

    $("#phoneInput").keyup(function() {
        phoneInputLength = $('#phoneInput').val().length;
        let serializePhone = $("#phoneInput").serialize();
        phoneInputContents = serializePhone.slice(12);
        parsedPhoneInputContents = parseInt(phoneInputContents, 10);
        submitStatus();
    });

    //test conditions of length > 0, or 10 digits for phone to see whether to enable button for submit
    let submitStatus = function () {
        if (lastNameLength > 0 && firstNameLength > 0 && phoneInputLength === 10 && isNaN(phoneInputContents) === false) {
            $('#confirmOrder').prop('disabled', false);
        } else {
            $('#confirmOrder').prop('disabled', true);
        }
    };
});