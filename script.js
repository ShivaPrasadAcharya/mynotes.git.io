class NotesApp {
    constructor() {
        this.notes = JSON.parse(localStorage.getItem('notes')) || [];
        this.editingId = null;
        this.init();
    }

    init() {
        // Initialize elements
        this.elements = {
            searchInput: document.getElementById('searchInput'),
            noteForm: document.getElementById('noteForm'),
            titleInput: document.getElementById('titleInput'),
            subtitleInput: document.getElementById('subtitleInput'),
            contentInput: document.getElementById('contentInput'),
            generatedCode: document.getElementById('generatedCode'),
            saveNoteBtn: document.getElementById('saveNoteBtn'),
            toggleFormBtn: document.getElementById('toggleFormBtn'),
            cancelBtn: document.getElementById('cancelBtn'),
            copyCodeBtn: document.getElementById('copyCodeBtn'),
            notesContainer: document.getElementById('notesContainer'),
            viewNotesBtn: document.getElementById('viewNotesBtn'),
            formTitle: document.getElementById('formTitle'),
            notificationToast: document.getElementById('notificationToast')
        };

        // Initialize toast
        this.toast = new bootstrap.Toast(this.elements.notificationToast);

        // Bind event listeners
        this.bindEventListeners();

        // Initial render
        this.renderNotes();
    }

    bindEventListeners() {
        this.elements.searchInput.addEventListener('input', () => this.renderNotes());
        this.elements.toggleFormBtn.addEventListener('click', () => this.toggleForm());
        this.elements.cancelBtn.addEventListener('click', () => this.clearForm());
        this.elements.saveNoteBtn.addEventListener('click', () => this.saveNote());
        this.elements.copyCodeBtn.addEventListener('click', () => this.copyGeneratedCode());
        this.elements.viewNotesBtn.addEventListener('click', () => this.scrollToNotes());

        // Generate code as user types
        ['titleInput', 'subtitleInput', 'contentInput'].forEach(inputId => {
            this.elements[inputId].addEventListener('input', () => this.generateCode());
        });
    }

    generateCode() {
        const title = this.elements.titleInput.value.trim();
        const subtitle = this.elements.subtitleInput.value.trim();
        const content = this.elements.contentInput.value.trim();

        if (title || subtitle || content) {
            const timestamp = new Date();
            const noteObject = {
                id: timestamp.getTime(),
                title,
                subtitle,
                content,
                createdAt: timestamp.toLocaleString(),
                lastEdited: timestamp.toLocaleString(),
                color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 95%)`,
                isPinned: false
            };
            
            this.elements.generatedCode.value = JSON.stringify(noteObject, null, 2);
        } else {
            this.elements.generatedCode.value = '';
        }
    }

    toggleForm(show = null) {
        const display = show === null ? 
            this.elements.noteForm.style.display === 'none' : show;
        this.elements.noteForm.style.display = display ? 'block' : 'none';
        this.elements.toggleFormBtn.innerHTML = display ? 
            '<i class="fas fa-times"></i> Close' : 
            '<i class="fas fa-plus"></i> New Note';
    }

    clearForm() {
        this.editingId = null;
        this.elements.titleInput.value = '';
        this.elements.subtitleInput.value = '';
        this.elements.contentInput.value = '';
        this.elements.generatedCode.value = '';
        this.elements.formTitle.textContent = 'Create New Note';
        this.elements.saveNoteBtn.textContent = 'Add Note';
        this.toggleForm(false);
    }

    showNotification(message, isError = false) {
        const toastElement = this.elements.notificationToast;
        toastElement.querySelector('.toast-body').textContent = message;
        toastElement.classList.toggle('toast-error', isError);
        this.toast.show();
    }

    saveNote() {
        const title = this.elements.titleInput.value.trim();
        const subtitle = this.elements.subtitleInput.value.trim();
        const content = this.elements.contentInput.value.trim();

        if (!title || !content) {
            this.showNotification('Please fill in both title and content!', true);
            return;
        }

        const timestamp = new Date();
        const newNote = {
            id: this.editingId || timestamp.getTime(),
            title,
            subtitle,
            content,
            createdAt: this.editingId ? 
                this.notes.find(n => n.id === this.editingId).createdAt : 
                timestamp.toLocaleString(),
            lastEdited: timestamp.toLocaleString(),
            color: this.editingId ? 
                this.notes.find(n => n.id === this.editingId).color : 
                `hsl(${Math.floor(Math.random() * 360)}, 70%, 95%)`,
            isPinned: this.editingId ? 
                this.notes.find(n => n.id === this.editingId).isPinned : 
                false
        };

        if (this.editingId) {
            this.notes = this.notes.map(note => 
                note.id === this.editingId ? newNote : note
            );
            this.showNotification('Note updated successfully');
        } else {
            this.notes.unshift(newNote);
            this.showNotification('Note added successfully');
        }

        this.saveToLocalStorage();
        this.clearForm();
        this.renderNotes();
    }

    editNote(id) {
        const note = this.notes.find(n => n.id === id);
        if (note) {
            this.editingId = id;
            this.elements.titleInput.value = note.title;
            this.elements.subtitleInput.value = note.subtitle || '';
            this.elements.contentInput.value = note.content;
            this.elements.formTitle.textContent = 'Edit Note';
            this.elements.saveNoteBtn.textContent = 'Save Changes';
            this.toggleForm(true);
            this.elements.noteForm.scrollIntoView({ behavior: 'smooth' });
        }
    }

    deleteNote(id) {
        if (confirm('Are you sure you want to delete this note?')) {
            this.notes = this.notes.filter(note => note.id !== id);
            this.saveToLocalStorage();
            this.renderNotes();
            this.showNotification('Note deleted');
        }
    }

    togglePin(id) {
        const pinnedCount = this.notes.filter(note => note.isPinned).length;
        const note = this.notes.find(n => n.id === id);
        
        if (!note.isPinned && pinnedCount >= 7) {
            this.showNotification('Maximum 7 notes can be pinned!', true);
            return;
        }

        this.notes = this.notes.map(note =>
            note.id === id ? { ...note, isPinned: !note.isPinned } : note
        );
        this.saveToLocalStorage();
        this.renderNotes();
    }

    toggleNoteContent(element, id) {
        const content = this.notes.find(note => note.id === id).content;
        const isExpanded = element.classList.contains('expanded');
        
        if (isExpanded) {
            element.classList.remove('expanded');
            element.classList.add('truncate-content');
            element.textContent = content.slice(0, 150) + '...';
            element.nextElementSibling.innerHTML = 
                '<i class="fas fa-chevron-down me-1"></i>Read More';
        } else {
            element.classList.add('expanded');
            element.classList.remove('truncate-content');
            element.textContent = content;
            element.nextElementSibling.innerHTML = 
                '<i class="fas fa-chevron-up me-1"></i>Show Less';
        }
    }

    copyGeneratedCode() {
        navigator.clipboard.writeText(this.elements.generatedCode.value);
        this.showNotification('Code copied to clipboard!');
    }

    scrollToNotes() {
        this.elements.notesContainer.scrollIntoView({ behavior: 'smooth' });
    }

    saveToLocalStorage() {
        localStorage.setItem('notes', JSON.stringify(this.notes));
    }

    renderNotes() {
        const searchTerm = this.elements.searchInput.value.toLowerCase();
        let filteredNotes = this.notes;

        if (searchTerm) {
            filteredNotes = this.notes.filter(note =>
