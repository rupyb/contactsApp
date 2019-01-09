/* eslint-disable no-console */
/* global $ */

(function () {
    'use strict';

    let contacts = [];
    let addContactForm = $('#addContactForm');
    let theTableBody = $('#contactsTable tbody');
    let updateForm = $('#updateForm');

    const updateFirstName = $('#updateFirstName');
    const updateLastName = $('#updateLastName');
    const updateEmail = $('#updateEmail');
    const updatePhone = $('#updatePhone');
    const errorDiv = $('#errorMessage');
    const errorHeader = $('#errorh2');
    const errorMessage = $('#errorp');
    const errorMessageFooter = $('#errorMessageFooter');
    const errorCloseButton = $('#errorCloseButton');
    const confirmButton = $('<button type="button" class="btn btn-danger">Delete</button>'); 
    const clearForms = $('.closeForm');
    const cancelUpdateFormButton = $('#cancelUpdateFormButton');
    let rowToUpdate;


   

    theTableBody.on('click', 'button.delete', event => {
        const rowToDelete = $(event.target).closest('tr');
        $.ajax({
            method: 'GET',
            url: `/api/contacts/${rowToDelete.data('contactId')}`,
            success: (res) => {
                errorHeader[0].innerText = 'Are you sure you want to delete this entry?';
                errorMessage[0].innerText = `${res[0].firstname} ${res[0].lastname} 
                ${res[0].email} ${res[0].phone}`;
                errorMessageFooter.prepend(confirmButton);
                confirmButton.click(() => {
                    $.ajax({
                        method: 'DELETE',
                        url: `/api/contacts/${rowToDelete.data('contactId')}`,
                        success: () => {
                            rowToDelete.remove();
                            errorCloseButton.click();
                        }
                    }).fail((xhr) => {
                        errorHeader[0].innerText = `${xhr.statusText} Code:${xhr.status}`;
                        errorMessage[0].innerText = xhr.responseText;
                        $('#hiddenButton').click();
                    });
                });
            }
        })
            .fail((xhr) => {
                console.log('xhr fail delete', xhr);

                errorHeader[0].innerText = `${xhr.statusText} Code:${xhr.status}`;
                errorMessage[0].innerText = xhr.responseText;
                $('#hiddenButton').click();
            });
    });

    theTableBody.on('click', 'button.update', event => {
        rowToUpdate = $(event.target).closest('tr');

        const data = {
            firstname: rowToUpdate[0].children[0].innerText,
            lastname: rowToUpdate[0].children[1].innerText,
            email: rowToUpdate[0].children[2].innerText,
            phone: rowToUpdate[0].children[3].innerText
        };
        showUpdateForm(data);

    });

    function showUpdateForm(data) {
        // updateForm.show();
        updateFirstName.val(data.firstname);
        updateLastName.val(data.lastname);
        updateEmail.val(data.email);
        updatePhone.val(data.phone);
    }

    updateForm.submit((event) => {
        console.log('enterded event');
        event.preventDefault();

        const updatedContact = {
            firstname: updateFirstName.val(),
            lastname: updateLastName.val(),
            email: updateEmail.val(),
            phone: updatePhone.val()
        };

        $.ajax({
            method: 'PUT',
            url: `/api/contacts/${rowToUpdate.data('contactId')}`,
            data: updatedContact,
            success: () => {
                console.log(updatedContact);
                
                $.get(`/api/contacts/${rowToUpdate.data('contactId')}`, contact => {
                    console.log('enetered get after put');
                    
                    rowToUpdate[0].children[0].innerText = contact[0].firstname;
                    rowToUpdate[0].children[1].innerText = contact[0].lastname;
                    rowToUpdate[0].children[2].innerText = contact[0].email;
                    rowToUpdate[0].children[3].innerText = contact[0].phone;
                }).fail((xhr) => {
                    console.log('failed', xhr);
                });
                cancelUpdateFormButton.click();

            }
        }).fail((xhr) => {
            cancelUpdateFormButton.click();
            errorHeader[0].innerText = `${xhr.statusText} Code:${xhr.status}`;
            errorMessage[0].innerText = xhr.responseText;
            $('#hiddenButton').click();

        });
    });
    function addContact(newContact) {
        if (!contacts.length) {
            theTableBody.empty();
        }

        contacts.push(newContact);

        $(`<tr>
            <td>${newContact.firstname}</td>
            <td>${newContact.lastname}</td>
            <td>${newContact.email}</td>
            <td>${newContact.phone}</td>
            <td><button type="button" class="delete btn btn-primary" data-toggle="modal" data-target="#errorMessage">delete</button></td>
            <td><button class="update btn btn-primary" data-toggle="modal" data-target="#updateForm">update</button></td>
        </tr>`)
            .appendTo(theTableBody)
            .data('contactId', newContact.id);
    }

    let firstNameElem = $('#first');
    let lastNameElem = $('#last');
    let emailElem = $('#email');
    let phoneElem = $('#phone');

    addContactForm.submit(function (event) {
        let newContact = {
            firstname: firstNameElem.val(),
            lastname: lastNameElem.val(),
            email: emailElem.val(),
            phone: phoneElem.val()
        };
        console.log('entered post');
        $.post('/api/contacts', newContact, res => {
            console.log('success post');
            
            addContact(res);
        }, 'json').fail((xhr) => {
            console.log(' post failed');
            errorHeader[0].innerText = `${xhr.statusText} Code:${xhr.status}`;
            errorMessage[0].innerText = xhr.responseText;
            errorDiv.show();
        });

        //hideAddContactForm();
        
        event.preventDefault();
        $('#cancel').click();
        addContactForm[0].reset();
    });


    clearForms.click(() => {
        addContactForm[0].reset();
    });

    function startApp() {
        $.get('/api/contacts', loadedContacts => {
            //console.log(loadedContacts.rows);
            
            loadedContacts.forEach(contact => addContact(contact));
        }).fail((xhr) => {
            errorHeader[0].innerText = `${xhr.statusText} Code:${xhr.status}`;
            errorMessage[0].innerText = xhr.responseText;
            errorDiv.show();
        });
    }
    $('#hiddenButton').hide();
    startApp();
}());
