let currentRoom = 'Sala 1';
let postIts = {};
let editingPostIt = null;
let selectedColor = '#ffeb3b';

function changeRoom() {
    currentRoom = document.getElementById('roomList').value;
    loadPostIts();
}

function addRoom() {
    const newRoom = prompt("Nome da nova sala:");
    if (newRoom) {
        const roomList = document.getElementById('roomList');
        const newOption = document.createElement('option');
        newOption.value = newRoom;
        newOption.textContent = newRoom;
        roomList.appendChild(newOption);
    }
}

function loadPostIts() {
    const container = document.getElementById('postItContainer');
    container.innerHTML = '';
    const roomPostIts = postIts[currentRoom] || [];

    roomPostIts.forEach((postIt, index) => {
        const postItElement = document.createElement('div');
        postItElement.className = 'post-it';
        postItElement.style.backgroundColor = postIt.color;
        postItElement.innerHTML = `<p>${postIt.content}</p>`; // Apenas o conteúdo é exibido
        postItElement.onclick = () => editPostIt(index);
        container.appendChild(postItElement);
    });
}

function openEditModal() {
    document.getElementById('editModal').style.display = 'block';
    document.getElementById('nameInput').value = '';
    document.getElementById('classInput').value = '';
    document.getElementById('shiftInput').value = '';
    document.getElementById('textContent').value = '';
    selectedColor = '#ffeb3b';
    document.querySelectorAll('.color-option').forEach(option => option.classList.remove('selected'));
    document.querySelector('.color-option').classList.add('selected');
    editingPostIt = null;
}

function editPostIt(index) {
    const postIt = postIts[currentRoom][index];
    document.getElementById('editModal').style.display = 'block';
    document.getElementById('nameInput').value = postIt.name;
    document.getElementById('classInput').value = postIt.class;
    document.getElementById('shiftInput').value = postIt.shift;
    document.getElementById('textContent').value = postIt.content;
    selectedColor = postIt.color; // A cor de edição é a mesma do post-it
    document.querySelectorAll('.color-option').forEach(option => option.classList.remove('selected'));
    const selectedOption = [...document.querySelectorAll('.color-option')].find(option => option.style.backgroundColor === selectedColor);
    if (selectedOption) selectedOption.classList.add('selected');
    editingPostIt = index;
}

function savePostIt() {
    const name = document.getElementById('nameInput').value;
    const classInput = document.getElementById('classInput').value;
    const shiftInput = document.getElementById('shiftInput').value;
    const content = document.getElementById('textContent').value;

    if (!name || !classInput || !shiftInput || !content) {
        alert("Todos os campos devem ser preenchidos!");
        return;
    }

    const postItData = { name, class: classInput, shift: shiftInput, content, color: selectedColor };

    if (editingPostIt !== null) {
        postIts[currentRoom][editingPostIt] = postItData;
    } else {
        if (!postIts[currentRoom]) postIts[currentRoom] = [];
        postIts[currentRoom].push(postItData);
    }

    closeEditModal();
    loadPostIts();
}

function selectColor(element, color) {
    selectedColor = color;
    document.querySelectorAll('.color-option').forEach(option => option.classList.remove('selected'));
    element.classList.add('selected');
}

function deletePostIt() {
    if (editingPostIt !== null) {
        postIts[currentRoom].splice(editingPostIt, 1);
        closeEditModal();
        loadPostIts();
    }
}

function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
}
