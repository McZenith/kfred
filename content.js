let textList = [];
let currentIndex = 0;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.textList && message.textList.length > 0) {
    textList = message.textList;
    currentIndex = 0;
    console.log('Text list received from clipboard:', textList);
    findAndHighlightText(textList[currentIndex]);
  }
});

// Listen for 'k' key to start the search and 'n' key to move to the next text
document.addEventListener('keydown', (e) => {
  if (e.key.toLowerCase() === 'k' && !e.ctrlKey && !e.altKey) {
    if (textList.length > 0) {
      console.log('Starting with first text:', textList[currentIndex]);
      findAndHighlightText(textList[currentIndex]);
    } else {
      console.log('No text list available.');
    }
  }

  if (e.key.toLowerCase() === 'n' && !e.ctrlKey && !e.altKey) {
    if (textList.length > 0) {
      currentIndex = (currentIndex + 1) % textList.length;
      console.log('Moving to next text:', textList[currentIndex]);
      findAndHighlightText(textList[currentIndex]);
    } else {
      console.log('No text list available.');
    }
  }
});

function findAndHighlightText(text) {
  if (!text) {
    console.log('Invalid text:', text);
    return;
  }

  const bodyText = document.body.innerText.toLowerCase();
  const textToFind = text.toLowerCase();

  if (bodyText.includes(textToFind)) {
    console.log(`Found "${text}" on the page.`);
    highlightTextOnPage(textToFind);
  } else {
    console.log(`"${text}" not found on this page.`);
  }
}

function highlightTextOnPage(text) {
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode(node) {
        return node.nodeValue.toLowerCase().includes(text)
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_REJECT;
      },
    }
  );

  let node;
  if ((node = walker.nextNode())) {
    const range = document.createRange();
    range.selectNodeContents(node);

    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);

    node.parentNode.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });

    // Copy the found text to clipboard
    navigator.clipboard.writeText(text).then(() => {
      console.log(`"${text}" copied to clipboard.`);
    });
  } else {
    console.log(`Unable to highlight "${text}" on the page.`);
  }
}
