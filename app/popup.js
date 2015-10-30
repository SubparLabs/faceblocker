// Saves ad-replacement option to chrome.storage
function save_options() {
  var option = document.getElementById('option').value;
  chrome.storage.sync.set({
    selectedOption: option,
  }, function() {
    
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Option Saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 1500);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value option = 'off'.
  chrome.storage.sync.get({
    selectedOption: "off",
  }, function(items) {
    document.getElementById('option').value = items.selectedOption;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);