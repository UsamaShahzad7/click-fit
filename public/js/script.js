$(document).ready(function() {

    function fetchNumberFact() {
        const apiUrl = 'http://numbersapi.com/1/30/date?json';
        $('#api-spinner').show();
        $('#numbers-api-fact').hide();
        $.ajax({
            url: apiUrl, method: 'GET', dataType: 'json',
            success: function(data) {
                $('#numbers-api-fact').text(data ? data.text : 'Could not retrieve fact.').show();
                $('#api-spinner').hide();
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.error("AJAX Error:", textStatus, errorThrown);
                $('#numbers-api-fact').text('Failed to load fact due to an error.').show();
                $('#api-spinner').hide();
            }
        });
    }
    fetchNumberFact();

});
