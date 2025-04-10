const API_URL = 'https://web-production-eedc.up.railway.app';

async function loadUsers() {
    try {
        const response = await fetch(`${API_URL}/users/`);
        const users = await response.json();
        
        const usersList = document.getElementById('usersList');
        usersList.innerHTML = '';
        users.forEach(user => {
            const li = document.createElement('li');
            li.innerHTML = `${user.name} (${user.email}) - ID: ${user.id} 
                <button onclick="editUser(${user.id})">Editar</button>
                <button onclick="deleteUser(${user.id})">Deletar</button>`;
            usersList.appendChild(li);
        });

        const userSelect = document.getElementById('contactUserId');
        userSelect.innerHTML = '<option value="">Selecione um usuário</option>';
        users.forEach(user => {
            const option = document.createElement('option');
            option.value = user.id;
            option.textContent = `${user.name} (${user.email})`;
            userSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao carregar usuários:', error);
    }
}

async function loadContacts() {
    try {
        const response = await fetch(`${API_URL}/contacts/`);
        const contacts = await response.json();
        
        const contactsList = document.getElementById('contactsList');
        contactsList.innerHTML = '';
        contacts.forEach(contact => {
            const li = document.createElement('li');
            li.innerHTML = `${contact.name} - Tel: ${contact.phone} - Email: ${contact.email} (Usuário ID: ${contact.user_id})
                <button onclick="editContact(${contact.id})">Editar</button>
                <button onclick="deleteContact(${contact.id})">Deletar</button>`;
            contactsList.appendChild(li);
        });
    } catch (error) {
        console.error('Erro ao carregar contatos:', error);
    }
}

async function createUser(event) {
    event.preventDefault();
    const name = document.getElementById('userName').value;
    const email = document.getElementById('userEmail').value;
    console.log('Tentando criar usuário:', { name, email });
    try {
        const response = await fetch(`${API_URL}/users/?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}`, {
            method: 'POST'
        });
        console.log('Resposta createUser:', response.status, response.ok);
        if (response.ok) {
            document.getElementById('userForm').reset();
            loadUsers();
        } else {
            console.error('Erro na resposta da API:', await response.text());
        }
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
    }
}

async function createContact(event) {
    event.preventDefault();
    const name = document.getElementById('contactName').value;
    const phone = document.getElementById('contactPhone').value;
    const email = document.getElementById('contactEmail').value;
    const user_id = parseInt(document.getElementById('contactUserId').value);
    console.log('Tentando criar contato:', { name, phone, email, user_id });
    try {
        const response = await fetch(`${API_URL}/contacts/?name=${encodeURIComponent(name)}&phone=${encodeURIComponent(phone)}&email=${encodeURIComponent(email)}&user_id=${user_id}`, {
            method: 'POST'
        });
        console.log('Resposta createContact:', response.status, response.ok);
        if (response.ok) {
            document.getElementById('contactForm').reset();
            loadContacts();
        } else {
            console.error('Erro na resposta da API:', await response.text());
        }
    } catch (error) {
        console.error('Erro ao criar contato:', error);
    }
}

async function editUser(userId) {
    const name = prompt("Novo nome:");
    const email = prompt("Novo email:");
    console.log('Tentando editar usuário:', { userId, name, email });
    if (name || email) {
        try {
            const response = await fetch(`${API_URL}/users/${userId}?name=${encodeURIComponent(name || '')}&email=${encodeURIComponent(email || '')}`, {
                method: 'PUT'
            });
            console.log('Resposta editUser:', response.status, response.ok);
            if (response.ok) {
                loadUsers();
            } else {
                console.error('Erro na resposta da API:', await response.text());
            }
        } catch (error) {
            console.error('Erro ao editar usuário:', error);
        }
    }
}

async function editContact(contactId) {
    const name = prompt("Novo nome:");
    const phone = prompt("Novo telefone:");
    const email = prompt("Novo email:");
    const user_id = prompt("Novo ID do usuário:");
    console.log('Tentando editar contato:', { contactId, name, phone, email, user_id });
    if (name || phone || email || user_id) {
        try {
            const url = `${API_URL}/contacts/${contactId}?name=${encodeURIComponent(name || '')}&phone=${encodeURIComponent(phone || '')}&email=${encodeURIComponent(email || '')}&user_id=${user_id || ''}`;
            const response = await fetch(url, {
                method: 'PUT'
            });
            console.log('Resposta editContact:', response.status, response.ok);
            if (response.ok) {
                loadContacts();
            } else {
                console.error('Erro na resposta da API:', await response.text());
            }
        } catch (error) {
            console.error('Erro ao editar contato:', error);
        }
    }
}

async function deleteUser(userId) {
    if (confirm("Tem certeza que deseja deletar este usuário?")) {
        try {
            const response = await fetch(`${API_URL}/users/${userId}`, {
                method: 'DELETE'
            });
            console.log('Resposta deleteUser:', response.status, response.ok);
            if (response.ok) loadUsers();
        } catch (error) {
            console.error('Erro ao deletar usuário:', error);
        }
    }
}

async function deleteContact(contactId) {
    if (confirm("Tem certeza que deseja deletar este contato?")) {
        try {
            const response = await fetch(`${API_URL}/contacts/${contactId}`, {
                method: 'DELETE'
            });
            console.log('Resposta deleteContact:', response.status, response.ok);
            if (response.ok) loadContacts();
        } catch (error) {
            console.error('Erro ao deletar contato:', error);
        }
    }
}

document.getElementById('userForm').addEventListener('submit', createUser);
document.getElementById('contactForm').addEventListener('submit', createContact);

window.addEventListener('load', () => {
    loadUsers();
    loadContacts();
});