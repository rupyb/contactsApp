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
                $.get(`/api/contacts/${rowToUpdate.data('contactId')}`, contact => {
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
        $.post('/api/contacts', newContact, res => {   
            addContact(res);
        }, 'json')
            .fail((xhr) => {
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
        const newUser = {
            firstname: signUpFirstname.val(),
            lastname: signUpLastname.val(),
            email: signUpEmail.val(),
            password: signUpPassword.val(),
            adminPassword: signUpAdminPassword.val(),
        };
        $.post('/userSignUp', newUser, () => {
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
    // let socket = io.connect();
    let socket;
    signInForm.submit((event) => {
        signIn();
        event.preventDefault();
    });
    
    
    function signIn() {
        const newUser = {
            email: signInEmail.val(),
            password: signInPassword.val()
        };
        $.post('/userSignIn', newUser, (res) => {
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
        $('#chatOpenButton').show();
        $('#logOutButton').show();
        $('#profileButton').show();
    }
    // end code for signin button

    // code for logout button

    $('#logOutButton').click(() => {
        $.post('/logout', () => {
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
    
    // var socket = io.connect();
    $('#chatOpenButton').click(() => {
        socket = io.connect();
        socket.emit('loggedIn', currentUser.firstname);
        const message = $('#message');
        // const handle = $('#handle');
        const button = $('#theSendButton');
        const output = $('#output');
        const feedback = $('#feedback');
        let currentUsersArray = [];
        const dropdownDiv = $('#dropdownDiv');
        let chatTarget;
        let theHtml;

        socket.on('status', userArray => {
            currentUsersArray = userArray;
            renderChatters(userArray);
        });
    
        function renderChatters(userArray) {
            dropdownDiv.empty();
            dropdownDiv.append($('<div><button id="chatDropdownButton" type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown">Everyone</button><div class="dropdown-menu" id="chatMenu"></div></div>'));
            const chatMenu = $('#chatMenu');
            chatMenu.append($('<div class="dropdown-item" id="everyoneButton">EveryOne</div>'));
            $('#everyoneButton').click(() => {
                renderChatters(currentUsersArray);
            });
            userArray.filter(chatter => chatter.name !== currentUser.firstname).map(chatter => {
                let newChatter = $(`<div class="dropdown-item">${chatter.name}</div>`);
                
                newChatter.click(() => {
                    $('#chatDropdownButton').text(chatter.name);
                    //  $('<div class="dropdown-item">Everyone</div>').appendTo(chatMenu);
                    $('#everyoneButton').show();
                    (chatMenu,newChatter).remove();
                    chatTarget = chatter;
                });
                newChatter.appendTo(chatMenu);// <a class="dropdown-item" href="#">Link 1</a>
            });
        }
        
       
        button.click(() => {
            socket.emit('sendchat', {
                message: message.val(),
                handle: currentUser.firstname,
                chatTarget
            });

            socket.emit('endTyping');

            if(chatTarget) {
                theHtml = output.html();
                output.html( `${theHtml}<p><em>
            ${currentUser.firstname}:</em> ${message.val()}
            </p>`);
            }

            message.val('');
            feedback.html('');
        });
    
        socket.on('endTyping', () => {
            feedback.html('');
        });

        socket.on('chat', (data) => {
            theHtml = output.html();
            output.html( `${theHtml}<p><em>
            ${data.handle}:</em> ${data.message}
            </p>`);
        });
    
        message.keyup(() => {
            socket.emit('typingToServer', {name:currentUser.firstname, chatTarget});
        });
    
        socket.on('typing', (data) => {
            feedback.html(`<p><em>${data} is now typing</em></p>`);
        });
    });
   

    // end code for chat window

    function startApp() {
        $.get('/api/contacts', loadedContacts => {
            loadedContacts.forEach(contact => addContact(contact));
        }).fail((xhr) => {
            errorHeader[0].innerText = `${xhr.statusText} Code:${xhr.status}`;
            errorMessage[0].innerText = xhr.responseText;
            $('#hiddenButton').click();
        });
    }
}());
