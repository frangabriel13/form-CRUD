// Obtener los elementos del formulario
const formulario = document.getElementById('formulario');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const btnAdd = document.getElementById('btnAdd');
const userList = document.querySelector('.list');

let userId = null;

// Evento submit del formulario
formulario.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = nameInput.value;
  const email = emailInput.value;
  const phone = phoneInput.value;

  if (!name || !email) {
    // Validar que todos los campos estén completos
    alert('Nombre e email son obligatorios');
    return;
  }

  if (!isValidEmail(email)) {
    // Validar el formato del email
    alert('Por favor, ingresa un email válido.');
    return;
  }

  const isEmailTaken = await checkEmailExists(email);
  if (isEmailTaken && !userId) {
    alert('El email ya está registrado. Por favor, ingresa otro email.');
    return;
  }

  if (userId) {
    // Si existe un ID de usuario, realizar una petición PUT para actualizar el usuario
    try {
      await axios.put(`http://localhost:3001/users/${userId}`, { name, email, phone });
      // Restablecer los campos del formulario y el texto del botón
      nameInput.value = '';
      emailInput.value = '';
      phoneInput.value = '';
      btnAdd.innerText = 'Agregar';
      userId = null;
    } catch (error) {
      console.log(error);
    }
  } else {
    // Si no hay un ID de usuario, realizar una petición POST para crear un nuevo usuario
    try {
      await axios.post('http://localhost:3001/users', { name, email, phone });
      // Restablecer los campos del formulario
      nameInput.value = '';
      emailInput.value = '';
      phoneInput.value = '';
    } catch (error) {
      console.log(error);
    }
  }

  // Actualizar la lista de usuarios
  await getUsers();
});

const isValidEmail = (email) => {
  // Utiliza una expresión regular para validar el formato del email
  const emailRegex = /^\S+@\S+\.\S+$/;
  return emailRegex.test(email);
};

const checkEmailExists = async (email) => {
  try {
    const response = await axios.get('http://localhost:3001/users');
    const users = response.data;
    const existingUser = users.find(user => user.email === email);
    return existingUser !== undefined;
  } catch (error) {
    console.log(error);
    return false;
  }
};

// Función para obtener y mostrar la lista de usuarios
const getUsers = async () => {
  try {
    const response = await axios.get('http://localhost:3001/users');
    const users = response.data;

    // Limpiar la lista de usuarios antes de agregar los nuevos elementos
    userList.innerHTML = '';

    users.forEach((user) => {
      const listItem = document.createElement('div');
      listItem.classList.add('list-item');
      listItem.setAttribute('data-id', user.id); // Añadir atributo data-id
      listItem.innerHTML = `
        <p data-field="name">${user.name}</p>
        <p data-field="email">${user.email}</p>
        <p data-field="phone">${user.phone}</p>
        <button onclick="updateUser(${user.id})">Actualizar</button>
        <button onclick="deleteUser(${user.id})">Eliminar</button>
      `;
      userList.appendChild(listItem);
    });
  } catch (error) {
    console.log(error);
  }
};

// Función para eliminar un usuario
const deleteUser = async (id) => {
  try {
    await axios.delete(`http://localhost:3001/users/${id}`);
    await getUsers();
  } catch (error) {
    console.log(error);
  }
};

const updateUser = (id) => {
  userId = id;
  const user = userList.querySelector(`div[data-id="${id}"]`);
  if (user) {
    const name = user.querySelector('p[data-field="name"]').innerText;
    const email = user.querySelector('p[data-field="email"]').innerText;
    const phone = user.querySelector('p[data-field="phone"]').innerText;
    nameInput.value = name;
    emailInput.value = email;
    phoneInput.value = phone;
    btnAdd.innerText = 'Actualizar';
  }
};

// Obtener y mostrar la lista de usuarios al cargar la página
getUsers();