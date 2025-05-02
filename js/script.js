$(document).ready(function () {

    function fetchNumberFact() {
        const apiUrl = 'http://numbersapi.com/1/30/date?json';
        $('#api-spinner').show();
        $('#numbers-api-fact').hide();
        $.ajax({
            url: apiUrl, method: 'GET', dataType: 'json',
            success: function (data) {
                $('#numbers-api-fact').text(data ? data.text : 'Could not retrieve fact.').show();
                $('#api-spinner').hide();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error("AJAX Error:", textStatus, errorThrown);
                $('#numbers-api-fact').text('Failed to load fact due to an error.').show();
                $('#api-spinner').hide();
            }
        });
    }
    fetchNumberFact();

    const dropZoneLabel = $('#drop-zone-label');
    const fileInput = $('#file-input');
    const uploadStatus = $('#upload-status');
    const previewArea = $('#preview-area');

    fileInput.on('change', function (e) {
        handleFiles(e.target.files);
    });

    let dragCounter = 0;

    dropZoneLabel.on('dragenter', function (e) {
        e.preventDefault();
        e.stopPropagation();
        dragCounter++;
        dropZoneLabel.addClass('drag-over');
    });

    dropZoneLabel.on('dragover', function (e) {
        e.preventDefault();
        e.stopPropagation();
        dropZoneLabel.addClass('drag-over');
    });

    dropZoneLabel.on('dragleave', function (e) {
        e.preventDefault();
        e.stopPropagation();
        dragCounter--;
        if (dragCounter === 0) {
            dropZoneLabel.removeClass('drag-over');
        }
    });

    dropZoneLabel.on('drop', function (e) {
        e.preventDefault();
        e.stopPropagation();
        dragCounter = 0;
        dropZoneLabel.removeClass('drag-over');
        const files = e.originalEvent.dataTransfer.files;
        fileInput[0].files = files;
        handleFiles(files);
    });

    $(document).on('dragenter dragover drop', function (e) {
        if ($(e.target).closest('#drop-zone-label').length === 0) {
            e.preventDefault();
            e.stopPropagation();
        }
    });

    function handleFiles(files) {
        uploadStatus.html('');
        previewArea.html('');

        if (!files || files.length === 0) {
            uploadStatus.html('<span class="text-warning">No files selected or dropped.</span>');
            fileInput.val('');
            return;
        }

        Array.from(files).forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    const img = $('<img>').attr('src', e.target.result).attr('alt', file.name);
                    previewArea.append(img);
                }
                reader.readAsDataURL(file);
            }
        });

        const formData = new FormData();

        formData.append('uploadedImage', files[0]);

        if (files.length > 1) {
            uploadStatus.append('<p><span class="text-info">Note: Only the first selected image will be uploaded in this demo.</span></p>');
        }

        uploadFile(formData);
    }

    function uploadFile(formData) {
        uploadStatus.html('<span class="text-primary">Uploading... <i class="fas fa-spinner fa-spin"></i></span>');
        $.ajax({
            url: 'http://localhost:3000/upload', method: 'POST', data: formData,
            processData: false, contentType: false,
            success: function (response) {
                uploadStatus.html(`<span class="text-success">Success: ${response.message} (Filename: ${response.filename})</span>`);
                fileInput.val('');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error("Upload Error:", textStatus, errorThrown, jqXHR.responseJSON);
                const errorMsg = jqXHR.responseJSON?.message || 'File upload failed.';
                uploadStatus.html(`<span class="text-danger">Error: ${errorMsg}</span>`);
                fileInput.val('');
            }
        });
    }

});
