/* eslint-disable no-console */
/* global $ io*/

(function () {
    'use strict';

    let currentUser;
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
    const mainContent = $('#mainContent');

   
    function isSignedIn() {
        $.get('/isSignedIn', response => {
            console.log(response);
            currentUser = response; 
            if(currentUser) {
                userPageRender();
            }
            
        });
    }
    isSignedIn();
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
        }, 'json')
            .fail((xhr) => {
                console.log(' post failed');
                errorHeader[0].innerText = `${xhr.statusText} Code:${xhr.status}`;
                errorMessage[0].innerText = xhr.responseText;
                $('#hiddenButton').click();
            });

        //hideAddContactForm();
        
        event.preventDefault();
        $('#cancel').click();
        addContactForm[0].reset();
    });


    clearForms.click(() => {
        addContactForm[0].reset();
    });

    
    // code for the signup button
    const signUpFirstname = $('#signUpFirstname');
    const signUpLastname = $('#signUpLastname');
    const signUpEmail = $('#signUpEmail');
    const signUpPassword = $('#signUpPassword');
    const signUpAdminPassword = $('#signUpAdminPassword');
    const signUpFormCloseButton = $('#signUpFormCloseButton');
    const signUpForm = $('#signUpForm');
    const signUpSubmitButton = $('#signUpSubmitButton');
    
    signUpForm.submit((event) => {
        console.log('submit');
        const newUser = {
            firstname: signUpFirstname.val(),
            lastname: signUpLastname.val(),
            email: signUpEmail.val(),
            password: signUpPassword.val(),
            adminPassword: signUpAdminPassword.val(),
        };
        console.log(newUser);
        $.post('/userSignUp', newUser, (res) => {
            console.log(res);
            
        }).fail((xhr) => {
            errorHeader[0].innerText = `${xhr.statusText} Code:${xhr.status}`;
            errorMessage[0].innerText = xhr.responseText;
            $('#hiddenButton').click();
        });
        
        signUpFormCloseButton.click();
        event.preventDefault();
    });
    // end code for signup button

    // code for the signin button
    const signInEmail = $('#signInEmail');
    const signInPassword = $('#signInPassword');
    const signInFormCloseButton = $('#signInFormCloseButton');
    const signInForm = $('#signInForm');
    const signInSubmitButton = $('#signInSubmitButton');
    
    signInForm.submit((event) => {
        signIn();
        event.preventDefault();
    });
    
    
    function signIn() {

        console.log('submit');
        const newUser = {
            email: signInEmail.val(),
            password: signInPassword.val()
        };
        console.log(newUser);
        $.post('/userSignIn', newUser, (res) => {
            console.log('sign in',res);
            currentUser = res;
           
            userPageRender();
        })
            .fail((xhr) => {
                errorHeader[0].innerText = `${xhr.statusText} Code:${xhr.status}`;
                errorMessage[0].innerText = xhr.responseText;
                $('#hiddenButton').click();
            });
        signInFormCloseButton.click();
    }

    function userPageRender() {
        $('#addContact').css({ visibility: 'visible'});
        mainContent.show();
        startApp();
        $('.userName').html(currentUser.firstname);
        $('#signInButton').hide();
        $('#signUpButton').hide();
        $('#logOutButton').show();
        $('#profileButton').show();
    }
    // end code for signin button

    // code for logout button

    $('#logOutButton').click(() => {
        $.post('/logout', (res) => {
            console.log(res);
            logOutRender();
        });
    });

    function logOutRender() {
        $('#addContact').css({ visibility: 'hidden'});
        mainContent.hide();
        // startApp();
        $('.userName').html('');
        $('#signInButton').show();
        $('#signUpButton').show();
        $('#logOutButton').hide();
        $('#profileButton').hide();
    }
    // end code for logout button
    // code for chat window
    var socket = io.connect();

    const message = $('#message');
    const handle = $('#handle');
    const button = $('#theSendButton');
    const output = $('#output');
    const feedback = $('#feedback');

    button.click(() => {
        socket.emit('sendchat', {
            message: message.val(),
            handle: handle.val()
        });
        feedback.html('');
    });

    socket.on('chat', (data) => {
        // console.log('go chat', data);
        const theHtml = output.html();
        output.html( `${theHtml}<p><em>
        ${data.handle}:</em> ${data.message}
        </p>`);
    });

    handle.keyup(() => {
        console.log('keypress');
        
        socket.emit('typingToServer', handle.val());
    });

    socket.on('typing', (data) => {
        feedback.html(`<p><em>${data} is now typing</em></p>`);
    });

    // end code for chat window

    function startApp() {
        $.get('/api/contacts', loadedContacts => {
            //console.log(loadedContacts.rows);
            
            loadedContacts.forEach(contact => addContact(contact));
        }).fail((xhr) => {
            errorHeader[0].innerText = `${xhr.statusText} Code:${xhr.status}`;
            errorMessage[0].innerText = xhr.responseText;
            $('#hiddenButton').click();
        });
    }

    //$('#hiddenButton').hide();
    // mainContent.hide();
}());

