let editingPostIt = null;
let selectedColor = 'yellow';
let currentRoom = 'Sala1';
const postIts = {};

document.addEventListener('DOMContentLoaded', () => {
    addRoom(currentRoom);
});

async function loadPostIts() {
    try {
        const response = await fetch(`http://localhost:3001/api/postIts?room=${currentRoom}`);
        const postIts = await response.json();

        document.getElementById('postItContainer').innerHTML = '';
        postIts.forEach(data => {
            const postIt = createPostItElement(data.id, data);
            document.getElementById('postItContainer').appendChild(postIt);
        });
    } catch (error) {
        console.error('Erro ao carregar Post-Its:', error);
    }
}

function openEditModal(postIt = null) {
    editingPostIt = postIt;

    if (postIt) {
        document.getElementById('nameInput').value = postIt.dataset.name;
        document.getElementById('classInput').value = postIt.dataset.class;
        document.getElementById('shiftInput').value = postIt.dataset.shift;
        document.getElementById('textContent').value = postIt.dataset.content;
        selectedColor = postIt.style.backgroundColor;
    } else {
        document.getElementById('nameInput').value = '';
        document.getElementById('classInput').value = '';
        document.getElementById('shiftInput').value = '';
        document.getElementById('textContent').value = '';
        selectedColor = 'yellow';
    }

    document.getElementById('editModal').style.display = 'block';
    updateColorSelection();
}

function closeEditModal() {
    editingPostIt = null;
    document.getElementById('editModal').style.display = 'none';
}

async function savePostIt() {
    const name = document.getElementById('nameInput').value;
    const className = document.getElementById('classInput').value;
    const shift = document.getElementById('shiftInput').value;
    const content = document.getElementById('textContent').value;

    const postItData = {
        name, class: className, shift, content, color: selectedColor, room: currentRoom
    };

    try {
        if (editingPostIt) {
            editingPostIt.dataset.name = name;
            editingPostIt.dataset.class = className;
            editingPostIt.dataset.shift = shift;
            editingPostIt.dataset.content = content;
            editingPostIt.style.backgroundColor = selectedColor;
            editingPostIt.querySelector('p').textContent = content;
        } else {
            const response = await fetch('http://localhost:3001/api/postIts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(postItData),
            });

            if (response.ok) {
                const newPostIt = await response.json();
                const postItElement = createPostItElement(newPostIt.id, postItData);
                document.getElementById('postItContainer').appendChild(postItElement);
            } else {
                console.error('Erro ao salvar Post-It:', response.statusText);
            }
        }
    } catch (error) {
        console.error('Erro:', error);
    }

    closeEditModal();
}

function createPostItElement(id, data) {
    const postIt = document.createElement('div');
    postIt.className = 'post-it';
    postIt.dataset.id = id;
    postIt.dataset.name = data.name;
    postIt.dataset.class = data.class;
    postIt.dataset.shift = data.shift;
    postIt.dataset.content = data.content;
    postIt.style.backgroundColor = data.color;
    postIt.innerHTML = `<p>${data.content}</p>`;
    postIt.onclick = () => openEditModal(postIt);
    return postIt;
}

function selectColor(color) {
    selectedColor = color;
    updateColorSelection();
}

function updateColorSelection() {
    document.querySelectorAll('.color-option').forEach(option => {
        option.classList.toggle('selected', option.style.backgroundColor === selectedColor);
    });
}

async function deletePostIt() {
    if (!editingPostIt) return;

    const postId = editingPostIt.dataset.id;
    try {
        const response = await fetch(`http://localhost:3001/api/postIts/${postId}`, { method: 'DELETE' });
        if (response.ok) {
            editingPostIt.remove();
        } else {
            console.error('Erro ao deletar o Post-It:', response.statusText);
        }
    } catch (error) {
        console.error('Erro ao deletar o Post-It:', error);
    }

    closeEditModal();
}

function addRoom(room = null) {
    const newRoom = room || prompt('Digite o nome da nova sala:');
    if (newRoom && !postIts[newRoom]) {
        postIts[newRoom] = [];
        const option = document.createElement('option');
        option.value = newRoom;
        option.textContent = newRoom;
        document.getElementById('roomSelect').appendChild(option);
        document.getElementById('roomSelect').value = newRoom;
        currentRoom = newRoom;
        loadPostIts();
    }
}

function changeRoom() {
    currentRoom = document.getElementById('roomSelect').value;
    loadPostIts();
}

function deleteRoom() {
    if (confirm(`Deseja realmente excluir a sala ${currentRoom}?`)) {
        delete postIts[currentRoom];
        document.querySelector(`#roomSelect option[value="${currentRoom}"]`).remove();
        currentRoom = document.getElementById('roomSelect').value;
        loadPostIts();
    }
}
