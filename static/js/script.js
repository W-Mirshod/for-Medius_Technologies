function isDragAndDropSupported() {
  return typeof document.createElement('div').ondrop != 'undefined';
}

function isFormDataSupported() {
  return typeof FormData == 'function';
}

function isFileApiSupported() {
  const input = document.createElement('input');
  input.type = 'file';
  
  return typeof input.files != 'undefined';
}

if(isDragAndDropSupported() && isFormDataSupported() && isFileApiSupported()) {
  var Dropzone = function(container) {
    this.dropzone = container;
    this.dropzone.classList.add('dropzone--actual');
    this.dropzone.querySelector('[data-dropzone-label]').classList.add('button');
    
    this.setupDropzone();
    this.setupFileInput();
    this.setupStatusBox();
    this.setupFiles();
    this.setupFileRemove();
  }
  
  Dropzone.prototype.setupDropzone = function() {
    this.dropzone.addEventListener('dragover', this.onDragOver.bind(this));
    this.dropzone.addEventListener('dragleave', this.onDragLeave.bind(this));
    this.dropzone.addEventListener('drop', this.onDrop.bind(this));
  }
  
  Dropzone.prototype.onDragOver = function(event) {
    event.preventDefault();
    this.dropzone.classList.add('dropzone--dragover');
  }
  
  Dropzone.prototype.onDragLeave = function() {
    this.dropzone.classList.remove('dropzone--dragover');
  }
  
  Dropzone.prototype.onDrop = function(event) {
    event.preventDefault();
    this.dropzone.classList.remove('dropzone--dragover');
    this.files.classList.remove('hidden');
    this.status.innerHTML = 'Uploading files, please wait...';
    this.uploadFiles(event.dataTransfer.files);
  }
  
  Dropzone.prototype.setupFileInput = function() {
    this.fileInput = document.querySelector('[data-dropzone-file]');
    this.fileInput.addEventListener('change', this.onFileChange.bind(this));
    this.fileInput.addEventListener('focus', this.onFileFocus.bind(this));
    this.fileInput.addEventListener('blur', this.onFileBlur.bind(this));
  }
  
  Dropzone.prototype.onFileChange = function(event) {
    this.files.classList.remove('hidden');
    this.status.innerHTML = 'Uploading files, please wait...';
    this.uploadFiles(event.currentTarget.files);
  }
  
  Dropzone.prototype.onFileFocus = function() {
    this.dropzone.querySelector('[data-dropzone-label]').classList.add('dropzone__label--focused');
  }
  
  Dropzone.prototype.onFileBlur = function() {
    this.dropzone.querySelector('[data-dropzone-label]').classList.remove('dropzone__label--focused');
  }
  
  Dropzone.prototype.setupStatusBox = function() {
    this.status = document.createElement('div');
    this.status.className = 'visually-hidden';
    this.status.setAttribute('role', 'status');
    this.status.setAttribute('aria-live', 'polite');
    
    this.dropzone.appendChild(this.status);
  }
  
  Dropzone.prototype.setupFiles = function() {
    this.filesHeading = document.createElement('h2');
    this.filesHeading.className = 'heading';
    this.filesHeading.innerHTML = 'Files';
    
    this.file = document.createElement('ul');
    this.file.className = 'file';
    
    this.files = document.querySelector('[data-files]');
    this.files.appendChild(this.filesHeading);
    this.files.appendChild(this.file);
  }
  
  Dropzone.prototype.setupFileRemove = function() {
    document.querySelector('[data-files]').addEventListener('click', this.onFileRemoveClick.bind(this));
  }
  
  Dropzone.prototype.onFileRemoveClick = function(event) {
    const eventTarget = event.target;
    
    if(eventTarget.hasAttribute('data-file-remove')) {
      const listItem = eventTarget.parentNode;
      listItem.parentNode.removeChild(listItem);
    }
  }
  
  Dropzone.prototype.getStatusHtml = function(result, isSuccess) {
    this.fileName = document.createElement('span');
    
    this.fileStatus = document.createElement('span');
    this.fileStatus.className = 'file__status file__status--error';
    this.fileStatus.innerHTML = 'Error';

    if(isSuccess) {
      this.fileLink = document.createElement('a');
      this.fileLink.className = 'anchor';
      this.fileLink.setAttribute('href', '#');
      this.fileLink.setAttribute('target', '_blank');
      this.fileLink.innerHTML = result.name;
      
      this.fileName = document.createElement('div');
      this.fileName.appendChild(this.fileLink);
      
      this.fileStatus.className = 'file__status file__status--success';
      this.fileStatus.innerHTML = 'Success';
    } else
      this.fileName.innerHTML = result.name;
    
    this.fileName.className = 'file__name';
        
    this.fileRemove = document.createElement('button');
    this.fileRemove.className = 'file__remove button';
    this.fileRemove.setAttribute('type', 'button');
    this.fileRemove.setAttribute('data-file-remove', '');
    this.fileRemove.innerHTML = 'Remove';
    
    this.fileItem = document.createElement('li');
    this.fileItem.className = 'file__item';
    this.fileItem.appendChild(this.fileName);
    this.fileItem.appendChild(this.fileStatus);
    this.fileItem.appendChild(this.fileRemove);
    
    return this.fileItem;
  }
  
  Dropzone.prototype.uploadFiles = function(files) {
    for(const file of files)
      this.uploadFile(file);
  }
  
  Dropzone.prototype.uploadFile = function(file) {
    const formData = new FormData();
    formData.append('documents', file);
    this.file.appendChild(this.getStatusHtml(file, true));
  }
}

if(typeof Dropzone != 'undefined')
  new Dropzone(document.querySelector('[data-dropzone]'));