'use strict';

const VALID_CHARS_REGEX = /^[a-zA-Z\s]{2,}$/;
const VALID_EMAIL_REGEX = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const NO_VALID_MSG = 'not valid!';
const EMAIL_EXISTS = 'Email belong another contact!';

const dataObj = select('.data');
const addObj = select('.add');
const contactListObj = select('.contacts-list');
const messageObj = select('.message');
const contacts = [];

class Contact {
    #id;
    #name;
    #city;
    #email;

    constructor(name, city, email) {
        name = (name ?? '').trim();
        city = (city ?? '').trim();
        email = (email ?? '').trim();

        this.validateData(name, city, email);
        this.#id = new Date().toISOString().replace(/[-:.]/g, '');
        this.name = name;
        this.city = city;
        this.email = email;
    }
 
    get id() {
        return this.#id;
    }

    get name() {
        return this.#name;
    }

    get city() {
        return this.#city;
    }

    get email() {
        return this.#email;
    }

    set name(value) {
        this.#name = value;        
    }

    set city(value) {
        this.#city = value;        
    }

    set email(value) {
        this.#email = value;
    }

    validateData(name, city, email) {
        const propsNames = [];

        if (!VALID_CHARS_REGEX.test(name)) {
            propsNames.push('Name');
        }

        if (!VALID_CHARS_REGEX.test(city)) {
            propsNames.push('City');
        }   
        
        if (!VALID_EMAIL_REGEX.test(email)) {
            propsNames.push('Email');
        }        

        if (propsNames.length > 0) {
            throw new Error(`${propsNames.join(', ')} ${propsNames.length === 1 ? 'is' : 'are'} ${NO_VALID_MSG}`);
        }
    }
}

function select(selector, scope = document) {
    return scope.querySelector(selector);
}

function listen(event, selector, callback) {
    return selector.addEventListener(event, callback);
}

listen('click', addObj, () => {
    addContact();
});

listen('click', contactListObj, (event) => {
    const contactDiv = event.target.closest('.contact');
    
    if (contactDiv) {
        const contactId = contactDiv.dataset.id;
        removeContact(contactId);
    }
});

function addContact() {
    const data = dataObj.value.split(',');    
    messageObj.innerText = "";
    
    try {
        const newContact = new Contact(...data);
        contacts.unshift(newContact);
        listContacts();

    } catch(error) {
        messageObj.innerText = error.message;
    } 

    dataObj.focus();
}

function listContacts() {
    contactListObj.replaceChildren();

    for (let contact of contacts) {
        const contactDiv = document.createElement('div');        
        const nameParagraph = document.createElement('p');
        const cityParagraph = document.createElement('p');
        const emailParagraph = document.createElement('p');

        nameParagraph.innerText = `Name: ${contact.name}`;
        contactDiv.appendChild(nameParagraph);    

        cityParagraph.innerText = `City: ${contact.city}`;
        contactDiv.appendChild(cityParagraph);

        emailParagraph.innerText = `Email: ${contact.email}`;
        contactDiv.appendChild(emailParagraph);        

        contactDiv.className = 'contact';
        contactDiv.dataset.id = contact.id; 
        contactListObj.appendChild(contactDiv);
    }
}

function removeContact(id) {
    const index = contacts.findIndex(item => item.id === id);

    contacts.splice(index, 1);
    listContacts();
}