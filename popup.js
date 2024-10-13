document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('start').addEventListener('click', () => {
    // Read clipboard text
    navigator.clipboard
      .readText()
      .then((clipboardText) => {
        const textList = clipboardText
          .split('\n')
          .map((s) => s.trim())
          .filter(Boolean); // Remove empty lines and trim spaces

        if (textList.length > 0) {
          // Send the text list to the active tab's content script
          chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { textList });
          });
        } else {
          alert('Clipboard is empty or does not contain valid strings.');
        }
      })
      .catch((err) => {
        console.error('Failed to read clipboard: ', err);
      });
  });
});
