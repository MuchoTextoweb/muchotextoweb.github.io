// Основная функциональность
var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function() {
        this.classList.toggle("active");
        var content = this.nextElementSibling;
        if (content.style.maxHeight){
            content.style.maxHeight = null;
        } else {
            content.style.maxHeight = content.scrollHeight + "px";
        }
    });
}

// Счетчик посещений
function updateVisitCounter() {
    let visits = localStorage.getItem('visitCount') || 0;
    visits++;
    localStorage.setItem('visitCount', visits);
    document.getElementById('visitCounter').textContent = visits;
}

// Таймер времени на сайте
let timeOnSite = 0;
setInterval(() => {
    timeOnSite++;
    const minutes = Math.floor(timeOnSite / 60);
    const seconds = timeOnSite % 60;
    document.getElementById('timeCounter').textContent = 
        `${minutes}:${seconds.toString().padStart(2, '0')}`;
}, 1000);

// Прогресс изучения
function updateProgress() {
    const watched = JSON.parse(localStorage.getItem('watchedTasks')) || [];
    const total = 14;
    const percentage = Math.round((watched.length / total) * 100);
    
    document.getElementById('studyProgress').style.width = percentage + '%';
    document.querySelector('.progress-text').textContent = percentage + '%';
    document.getElementById('watchedCount').textContent = watched.length;
    
    // Обновляем индикаторы
    watched.forEach(taskId => {
        const button = document.querySelector(`[data-task="${taskId}"]`);
        if (button) {
            button.classList.add('watched');
            const markButton = button.parentElement.querySelector('.mark-watched');
            if (markButton) {
                markButton.classList.add('active');
                markButton.innerHTML = '<span class="check-icon">✓</span> Просмотрено';
            }
        }
    });
}

// Отметить как просмотренное
function markAsWatched(taskId) {
    let watched = JSON.parse(localStorage.getItem('watchedTasks')) || [];
    
    if (!watched.includes(taskId)) {
        watched.push(taskId);
        localStorage.setItem('watchedTasks', JSON.stringify(watched));
        showNotification('Материал отмечен как просмотренный!');
    } else {
        watched = watched.filter(id => id !== taskId);
        localStorage.setItem('watchedTasks', JSON.stringify(watched));
        showNotification('Отметка снята');
    }
    
    updateProgress();
}

// Сбросить прогресс
function resetProgress() {
    if (confirm('Вы уверены, что хотите сбросить весь прогресс?')) {
        localStorage.removeItem('watchedTasks');
        updateProgress();
        showNotification('Прогресс сброшен');
        
        // Сбрасываем все кнопки
        document.querySelectorAll('.mark-watched').forEach(btn => {
            btn.classList.remove('active');
            btn.innerHTML = '<span class="check-icon">✓</span> Отметить как просмотренное';
        });
        
        document.querySelectorAll('.watched').forEach(el => {
            el.classList.remove('watched');
        });
    }
}

// Модальное окно для заметок
let currentNoteTask = null;

function openNoteModal(taskId) {
    currentNoteTask = taskId;
    document.getElementById('noteTaskNumber').textContent = taskId;
    document.getElementById('noteModal').style.display = 'block';
    
    // Загружаем сохраненную заметку
    const notes = JSON.parse(localStorage.getItem('taskNotes')) || {};
    const savedNote = notes[taskId];
    
    if (savedNote) {
        document.getElementById('noteText').value = savedNote;
        document.getElementById('savedNote').innerHTML = 
            `<strong>Сохраненная заметка:</strong><br>${savedNote}`;
        document.getElementById('savedNote').classList.add('show');
    } else {
        document.getElementById('noteText').value = '';
        document.getElementById('savedNote').classList.remove('show');
    }
}

function closeNoteModal() {
    document.getElementById('noteModal').style.display = 'none';
    currentNoteTask = null;
}

function saveNote() {
    const noteText = document.getElementById('noteText').value;
    if (!noteText.trim()) {
        alert('Введите текст заметки');
        return;
    }
    
    const notes = JSON.parse(localStorage.getItem('taskNotes')) || {};
    notes[currentNoteTask] = noteText;
    localStorage.setItem('taskNotes', JSON.stringify(notes));
    
    showNotification('Заметка сохранена!');
    closeNoteModal();
}

// Закрытие модального окна при клике вне его
window.onclick = function(event) {
    const modal = document.getElementById('noteModal');
    if (event.target == modal) {
        closeNoteModal();
    }
}

// Уведомления
function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Кнопка "Наверх"
const scrollButton = document.getElementById('scrollToTop');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollButton.classList.add('show');
    } else {
        scrollButton.classList.remove('show');
    }
});

scrollButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Переключатель темной темы
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// Загружаем сохраненную тему
if (localStorage.getItem('darkTheme') === 'enabled') {
    body.classList.add('dark-theme');
    themeToggle.textContent = '☀️';
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-theme');
    
    if (body.classList.contains('dark-theme')) {
        localStorage.setItem('darkTheme', 'enabled');
        themeToggle.textContent = '☀️';
        showNotification('Темная тема включена');
    } else {
        localStorage.setItem('darkTheme', 'disabled');
        themeToggle.textContent = '🌙';
        showNotification('Светлая тема включена');
    }
});

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    updateVisitCounter();
    updateProgress();
});
