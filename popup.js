document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('newtab-file-input');
    const previewButton = document.getElementById('preview-button');

    previewButton.addEventListener('click', function() {
        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            const reader = new FileReader();
            
            reader.onload = function(e) {
                const contents = e.target.result;
                // Store the HTML content in local storage
                localStorage.setItem('customNewTab', contents);
                
                // Open a new tab to preview
                chrome.tabs.create({ url: 'newtab.html' });
            };
            
            reader.readAsText(file);
        } else {
            alert('Please select an HTML file first');
        }
    });
});