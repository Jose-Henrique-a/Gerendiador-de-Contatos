const API_URL = 'https://web-production-eedc.up.railway.app';

// Função para carregar usuários
async function loadUsers() {
    try {
        const response = await fetch(`${API_URL}/users/`);
        const users = await response.json();
        
        const usersList = document.getElementById('usersList');
        if (usersList) {
            usersList.innerHTML = '';
            users.forEach(user => {
                const li = document.createElement('li');
                li.innerHTML = `${user.name} (${user.email}) - ID: ${user.id} 
                    <button onclick="editUser(${user.id})">Editar</button>
                    <button onclick="deleteUser(${user.id})">Deletar</button>`;
                usersList.appendChild(li);
            });
        }

        const userSelect = document.getElementById('contactUserId');
        if (userSelect) {
            userSelect.innerHTML = '<option value="">Selecione um usuário</option>';
            users.forEach(user => {
                const option = document.createElement('option');
                option.value = user.id;
                option.textContent = `${user.name} (${user.email})`;
                userSelect.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Erro ao carregar usuários:', error);
    }
}

// Função para carregar contatos
async function loadContacts() {
    try {
        const response = await fetch(`${API_URL}/contacts/`);
        const contacts = await response.json();
        
        const contactsList = document.getElementById('contactsList');
        if (contactsList) {
            contactsList.innerHTML = '';
            contacts.forEach(contact => {
                const li = document.createElement('li');
                li.innerHTML = `${contact.name} - Tel: ${contact.phone} - Email: ${contact.email} (Usuário ID: ${contact.user_id})
                    <button onclick="editContact(${contact.id})">Editar</button>
                    <button onclick="deleteContact(${contact.id})">Deletar</button>`;
                contactsList.appendChild(li);
            });
        }
    } catch (error) {
        console.error('Erro ao carregar contatos:', error);
    }
}

// Função para criar usuário
async function createUser(event) {
    event.preventDefault();
    const name = document.getElementById('userName').value;
    const email = document.getElementById('userEmail').value;
    try {
        const response = await fetch(`${API_URL}/users/?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}`, {
            method: 'POST'
        });
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

// Função para criar contato
async function createContact(event) {
    event.preventDefault();
    const name = document.getElementById('contactName').value;
    const phone = document.getElementById('contactPhone').value;
    const email = document.getElementById('contactEmail').value;
    const user_id = parseInt(document.getElementById('contactUserId').value);
    try {
        const response = await fetch(`${API_URL}/contacts/?name=${encodeURIComponent(name)}&phone=${encodeURIComponent(phone)}&email=${encodeURIComponent(email)}&user_id=${user_id}`, {
            method: 'POST'
        });
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

// Função para editar usuário
async function editUser(userId) {
    const name = prompt("Novo nome:");
    const email = prompt("Novo email:");
    if (name || email) {
        try {
            const response = await fetch(`${API_URL}/users/${userId}?name=${encodeURIComponent(name || '')}&email=${encodeURIComponent(email || '')}`, {
                method: 'PUT'
            });
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

// Função para editar contato
async function editContact(contactId) {
    const name = prompt("Novo nome:");
    const phone = prompt("Novo telefone:");
    const email = prompt("Novo email:");
    const user_id = prompt("Novo ID do usuário:");
    if (name || phone || email || user_id) {
        try {
            const url = `${API_URL}/contacts/${contactId}?name=${encodeURIComponent(name || '')}&phone=${encodeURIComponent(phone || '')}&email=${encodeURIComponent(email || '')}&user_id=${user_id || ''}`;
            const response = await fetch(url, {
                method: 'PUT'
            });
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

// Função para deletar usuário
async function deleteUser(userId) {
    if (confirm("Tem certeza que deseja deletar este usuário?")) {
        try {
            const response = await fetch(`${API_URL}/users/${userId}`, {
                method: 'DELETE'
            });
            if (response.ok) loadUsers();
        } catch (error) {
            console.error('Erro ao deletar usuário:', error);
        }
    }
}

// Função para deletar contato
async function deleteContact(contactId) {
    if (confirm("Tem certeza que deseja deletar este contato?")) {
        try {
            const response = await fetch(`${API_URL}/contacts/${contactId}`, {
                method: 'DELETE'
            });
            if (response.ok) loadContacts();
        } catch (error) {
            console.error('Erro ao deletar contato:', error);
        }
    }
}

// Inicialização baseada na página atual
window.addEventListener('load', () => {
    const userForm = document.getElementById('userForm');
    const contactForm = document.getElementById('contactForm');

    if (userForm) {
        userForm.addEventListener('submit', createUser);
        loadUsers();
    }
    if (contactForm) {
        contactForm.addEventListener('submit', createContact);
        loadUsers(); // Necessário para preencher o select de usuários
        loadContacts();
    }
});