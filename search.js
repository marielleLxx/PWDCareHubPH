function handleKey(event) {
  if (event.key === 'Enter') {
    performSearch(event);
  }
}

async function performSearch(event) {
  if (event) event.preventDefault();
  
  const searchInput = document.getElementById('searchInput').value.toLowerCase();
  const resultsDiv = document.getElementById('results');
  
  if (searchInput.trim() === '') {
    resultsDiv.innerHTML = '';
    return;
  }
  
  resultsDiv.innerHTML = '<p class="alert alert-info">Searching...</p>';
  
  // Define all pages
  const pages = [
    { title: 'Home', url: 'home.html' },
    { title: 'PWD ID Application Guide', url: 'pwdIdApp.html' },
    { title: 'Benefits and Discounts', url: 'benefits.html' },
    { title: 'Government Programs', url: 'program.html' },
    { title: 'Employment and Legal Rights', url: 'employment.html' },
    { title: 'Contact Us', url: 'contactus.html' }
  ];
  
  // Search in current page first
  const pageText = getFullPageText().toLowerCase();
  const currentPageFound = pageText.includes(searchInput);
  
  // Search in other pages
  const foundPages = [];
  
  for (let page of pages) {
    try {
      const response = await fetch(page.url);
      const html = await response.text();
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;
      const pageContentText = tempDiv.innerText.toLowerCase();
      
      if (pageContentText.includes(searchInput)) {
        foundPages.push(page);
      }
    } catch (error) {
      console.log(`Could not fetch ${page.url}`);
    }
  }
  
  // Display results
  resultsDiv.innerHTML = '';
  
  if (currentPageFound) {
    resultsDiv.innerHTML += `<div class="alert alert-success"><strong>✓ Found on current page:</strong> "${searchInput}"</div>`;
    highlightText(searchInput);
  }
  
  if (foundPages.length > 0) {
    resultsDiv.innerHTML += '<h5>Search Results on Other Pages:</h5>';
    resultsDiv.innerHTML += '<ul class="search-results-list">';
    foundPages.forEach(result => {
      resultsDiv.innerHTML += `<li><a href="${result.url}">${result.title}</a></li>`;
    });
    resultsDiv.innerHTML += '</ul>';
  } else if (!currentPageFound && foundPages.length === 0) {
    resultsDiv.innerHTML = `<p class="alert alert-warning">No results found for "${searchInput}".</p>`;
  }
}

function getFullPageText() {
  const elements = document.querySelectorAll('body *');
  let fullText = '';
  
  elements.forEach(element => {
    if (element.tagName !== 'SCRIPT' && element.tagName !== 'STYLE' && element.tagName !== 'NAV') {
      fullText += element.innerText + ' ';
    }
  });
  
  return fullText;
}

function highlightText(searchTerm) {
  const elements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div, li, b, strong, em, i');
  const regex = new RegExp(`(${searchTerm})`, 'gi');
  
  elements.forEach(element => {
    if (element.childNodes.length === 1 && element.childNodes[0].nodeType === 3) {
      const text = element.innerText;
      if (regex.test(text)) {
        element.innerHTML = text.replace(regex, '<mark>$1</mark>');
        regex.lastIndex = 0;
      }
    }
  });
}

// Voice Search Function
function startVoiceSearch() {
  const searchInput = document.getElementById('searchInput');
  const resultsDiv = document.getElementById('results');
  
  // Check browser support
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  
  if (!SpeechRecognition) {
    resultsDiv.innerHTML = '<p class="alert alert-danger">Voice search is not supported in your browser. Please use Chrome, Edge, or Safari.</p>';
    return;
  }
  
  const recognition = new SpeechRecognition();
  
  // Set language to English
  recognition.lang = 'en-US';
  recognition.continuous = false;
  recognition.interimResults = false;
  
  resultsDiv.innerHTML = '<p class="alert alert-info">🎤 Listening... Please speak now.</p>';
  
  recognition.onstart = function() {
    console.log('Voice search started');
  };
  
  recognition.onresult = function(event) {
    const transcript = event.results[0][0].transcript.toLowerCase();
    searchInput.value = transcript;
    resultsDiv.innerHTML = `<p class="alert alert-info">You said: "${transcript}"</p>`;
    
    // Trigger search with the spoken text
    setTimeout(() => {
      performSearch(null);
    }, 500);
  };
  
  recognition.onerror = function(event) {
    resultsDiv.innerHTML = `<p class="alert alert-danger">Error: ${event.error}. Please try again.</p>`;
    console.error('Voice recognition error:', event.error);
  };
  
  recognition.onend = function() {
    console.log('Voice search ended');
  };
  
  recognition.start();
}