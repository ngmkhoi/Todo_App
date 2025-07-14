const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

function escapeHTML(str) {
    if (typeof str !== 'string') return '';
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
}

// === DOM Elements ===
const addBtn = $('.add-btn');
const addTaskModal = $('#addTaskModal');
const closeBtn = $('.btn-close-modal');
const taskForm = $('.todo-app-form');
const todoList = $("#todoList");

// Modal xác nhận
const confirmModal = $('#confirmModal');
const confirmMessage = $('#confirmMessage');
const cancelDeleteBtn = $('#cancelDeleteBtn');
const confirmDeleteBtn = $('#confirmDeleteBtn');

// Form Inputs
const formTitle = $('#formTitle');
const formSubmitBtn = $('#formSubmitBtn');
const taskIdInput = $('#task-id');
const titleInput = $('#title');

// Filters
const searchInput = $('#searchInput');
const filterStatus = $('#filterStatus');
const filterCategory = $('#filterCategory');
const filterPriority = $('#filterPriority');
const filterColor = $('#filterColor');
const clearFiltersBtn = $('#clearFiltersBtn');

// Modal cảnh báo
const warningModal = $('#warningModal');
const warningMessage = $('#warningMessage');
const closeWarningBtn = $('#closeWarningBtn');

// === Biến toàn cục ===
let onConfirmAction = null; // Lưu hành động sẽ thực thi khi người dùng xác nhận
let isFormDirty = false; // Cờ để kiểm tra xem form đã có thay đổi chưa
let todoTasks = []; 
const apiUrl = 'http://localhost:4000/tasks';

// === Các hàm xử lý API (CRUD) ===

async function getTasks() {
    try {
        const res = await fetch(apiUrl);
        if (!res.ok) throw new Error(res.status);
        const allTasks = await res.json();
        todoTasks = allTasks.sort((a, b) => b.id - a.id);
        applyFilters();
    } catch (error) {
        console.error("Failed to fetch and load tasks:", error);
        todoList.innerHTML = `<p class="empty-message">There is an error loading tasks. Please try again.</p>`;
    }
}

// === Các hàm xử lý Modal (Đã được nâng cấp) ===

function showConfirmModal(message, confirmCallback) {
    confirmMessage.textContent = message;
    onConfirmAction = confirmCallback; // Lưu lại hành động sẽ thực thi
    confirmModal.classList.add('show');
}

function hideConfirmModal() {
    confirmModal.classList.remove('show');
    onConfirmAction = null; // Xóa hành động sau khi modal đóng
}

function showWarningModal(message) {
    warningMessage.textContent = message;
    warningModal.classList.add('show');
}

function hideWarningModal() {
    warningModal.classList.remove('show');
}

// === Các hàm xử lý Form (Đã được nâng cấp) ===

function openForm() {
    addTaskModal.classList.add('show');
    titleInput.focus();
}

// Hàm này sẽ đóng form ngay lập tức và reset trạng thái
function forceCloseForm() {
    addTaskModal.classList.remove('show');
    taskForm.reset();
    isFormDirty = false; // Reset cờ
    taskIdInput.value = "";
    formTitle.textContent = "Add New Task";
    formSubmitBtn.textContent = "Add Task";
    $('#color-blue').checked = true;
}

// Hàm này sẽ kiểm tra trước khi đóng
function closeForm() {
    if (isFormDirty) {
        showConfirmModal(
            "You have unsaved changes. Are you sure you want to discard them?",
            forceCloseForm // Nếu xác nhận, gọi hàm đóng form ngay lập tức
        );
    } else {
        forceCloseForm(); // Nếu không có thay đổi, đóng luôn
    }
}

// === Gắn các sự kiện cơ bản (Đã được nâng cấp) ===

addBtn.onclick = openForm;
closeBtn.onclick = closeForm; // Nút 'X' và 'Cancel' giờ sẽ kiểm tra trước khi đóng
closeWarningBtn.onclick = hideWarningModal;
cancelDeleteBtn.onclick = hideConfirmModal;
clearFiltersBtn.onclick = clearFilters;

// Sự kiện click bên ngoài form để đóng
addTaskModal.onclick = function(event) {
    if (event.target === addTaskModal) {
        closeForm();
    }
};

// Sự kiện xác nhận chung cho modal
confirmDeleteBtn.onclick = async function () {
    if (typeof onConfirmAction === 'function') {
        await onConfirmAction(); // Thực thi hành động đã lưu
    }
    hideConfirmModal();
};

// Theo dõi thay đổi trong form
taskForm.oninput = () => {
    isFormDirty = true;
};

// Sự kiện submit form
taskForm.onsubmit = async event => {
    event.preventDefault();
    const formData = Object.fromEntries(new FormData(taskForm));
    const editingId = formData.taskId; 
    const currentTitle = formData.title.trim().toLowerCase();

    const isDuplicate = todoTasks.some(task => 
        task.title.toLowerCase().trim() === currentTitle && task.id != editingId
    );

    if (isDuplicate) {
        showWarningModal("Task with this title already exists. Please choose a different title.");
        return;
    }

    const taskData = {
        title: escapeHTML(formData.title),
        description: escapeHTML(formData.description),
        category: escapeHTML(formData.category),
        priority: escapeHTML(formData.priority),
        dueDate: formData.dueDate,
        cardColor: escapeHTML(taskForm.querySelector('input[name="cardColor"]:checked').value),
    };

    try {
        if (editingId) {
            const originalTask = todoTasks.find(task => task.id == editingId);
            taskData.isCompleted = originalTask.isCompleted;

            await fetch(`${apiUrl}/${editingId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(taskData)
            });
        } else {
            taskData.isCompleted = false;
            await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(taskData)
            });
        }
        await getTasks();
        forceCloseForm(); // Đóng form ngay lập tức sau khi submit thành công
    } catch (error) {
        console.error('Failed to save task:', error);
        showWarningModal('Could not save the task. Please try again.');
    }
};

// Sự kiện trên danh sách task
todoList.onclick = async function (event) {
    const taskCard = event.target.closest('.task-card');
    if (!taskCard) return;

    const taskId = taskCard.dataset.id;
    const task = todoTasks.find(t => t.id === taskId);
    if (!task) return;

    const deleteBtn = event.target.closest('.btn-delete');
    const completeBtn = event.target.closest('.btn-complete');
    const editBtn = event.target.closest('.btn-edit');

    if (deleteBtn) {
        // Dùng modal xác nhận chung
        showConfirmModal(
            `Are you sure you want to delete the task "${task.title}"?`,
            async () => { // Hành động xóa sẽ được truyền vào
                try {
                    await fetch(`${apiUrl}/${task.id}`, { method: 'DELETE' });
                    await getTasks();
                } catch (error) {
                    console.error('Failed to delete task:', error);
                    showWarningModal('Could not delete the task. Please try again.');
                }
            }
        );
    } else if (completeBtn) {
        const updatedStatus = { isCompleted: !task.isCompleted };
        try {
            await fetch(`${apiUrl}/${taskId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedStatus)
            });
            await getTasks();
        } catch (error) {
            console.error('Failed to update task status:', error);
            showWarningModal('Could not update task status.');
        }
    } else if (editBtn) {
        openForm();
        formTitle.innerText = 'Edit Task';
        formSubmitBtn.innerText = 'Update Task';
        taskIdInput.value = task.id;
        titleInput.value = task.title;
        $('#description').value = task.description;
        $('#category').value = task.category;
        $('#priority').value = task.priority;
        $('#dueDate').value = task.dueDate;
        taskForm.querySelector(`input[name="cardColor"][value="${task.cardColor}"]`).checked = true;
    }
};

// === Các hàm xử lý Filter và Render ===

function clearFilters() {
    // Reset tất cả các input về giá trị mặc định
    searchInput.value = '';
    filterStatus.value = 'all';
    filterCategory.value = 'all';
    filterPriority.value = 'all';
    filterColor.value = 'all';

    // Áp dụng lại bộ lọc để render lại toàn bộ danh sách
    applyFilters();
}

function applyFilters() {
    const searchKeyword = searchInput.value.toLowerCase().trim();
    const status = filterStatus.value;
    const category = filterCategory.value;
    const priority = filterPriority.value;
    const color = filterColor.value;
    
    let filteredTasks = todoTasks;

    if (searchKeyword) {
        filteredTasks = filteredTasks.filter(task =>
            task.title.toLowerCase().includes(searchKeyword) ||
            task.description.toLowerCase().includes(searchKeyword)
        );
    }
    if (status !== 'all') {
        filteredTasks = filteredTasks.filter(task => (status === 'completed' ? task.isCompleted : !task.isCompleted));
    }
    if (category !== 'all') {
        filteredTasks = filteredTasks.filter(task => task.category === category);
    }
    if (priority !== 'all') {
        filteredTasks = filteredTasks.filter(task => task.priority === priority);
    }
    if (color !== 'all') {
        filteredTasks = filteredTasks.filter(task => task.cardColor === color);
    }

    renderTask(filteredTasks);
}

searchInput.addEventListener('input', applyFilters);
filterStatus.addEventListener('change', applyFilters);
filterCategory.addEventListener('change', applyFilters);
filterPriority.addEventListener('change', applyFilters);
filterColor.addEventListener('change', applyFilters);

function renderTask(tasks) {
    if (!tasks || tasks.length === 0) {
        const message = todoTasks.length === 0 ? "You have no tasks. Let's add one!" : "No tasks match your filters.";
        todoList.innerHTML = `<p class="empty-message">${message}</p>`;
        return;
    }

    const html = tasks.map(task => `
        <div class="task-card ${task.isCompleted ? 'completed' : ''}" data-id="${task.id}">
            <div class="task-header ${escapeHTML(task.cardColor)}">
                <h3 class="task-title">${escapeHTML(task.title)}</h3>
                <div class="task-actions">
                    <button class="action-btn btn-complete">
                        ${task.isCompleted 
                            ? '<i class="fa-solid fa-circle-check"></i>' 
                            : '<i class="fa-regular fa-circle"></i>'
                        }
                    </button>
                    <button class="action-btn btn-edit"><i class="fa-solid fa-pen"></i></button>
                    <button class="action-btn btn-delete"><i class="fa-solid fa-trash"></i></button>
                </div>
            </div>
            <div class="task-body">
                <p class="task-description">${escapeHTML(task.description)}</p>
                <div class="task-meta">
                    <span class="task-category">${escapeHTML(task.category)}</span>
                    <span class="task-priority ${escapeHTML(task.priority.toLowerCase())}">${escapeHTML(task.priority)}</span>
                </div>
            </div>
            <div class="task-footer">
               <span class="task-due-date">Due: ${escapeHTML(task.dueDate)}</span>
            </div>
        </div>
    `).join('');
    
    todoList.innerHTML = html;
}

// === Khởi chạy ứng dụng ===
document.addEventListener('DOMContentLoaded', getTasks);