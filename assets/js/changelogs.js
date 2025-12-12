function waitForMarked() {
  return new Promise((resolve) => {
    if (typeof marked !== 'undefined') {
      resolve();
    } else {
      const checkInterval = setInterval(() => {
        if (typeof marked !== 'undefined') {
          clearInterval(checkInterval);
          resolve();
        }
      }, 100);
      setTimeout(() => clearInterval(checkInterval), 5000);
    }
  });
}

let currentMarkdownContent = '';
let isUpdating = false;

async function setupMarked() {
  await waitForMarked();
  
  const renderer = new marked.Renderer();
  
  renderer.heading = function(token) {
    const level = token.depth;
    const className = level === 1 ? 'md-h1' : level === 2 ? 'md-h2' : level === 3 ? 'md-h3' : 'md-h4';
    return `<h${level} class="${className}">${token.text}</h${level}>\n`;
  };
  
  renderer.paragraph = function(token) {
    return `<p class="md-paragraph">${token.text}</p>\n`;
  };
  
  renderer.list = function(token) {
    const tag = token.ordered ? 'ol' : 'ul';
    const listClass = token.ordered ? 'md-ol' : 'md-ul';
    let items = '';
    for (let item of token.items) {
      items += `<li class="md-list-item">${item.text}</li>`;
    }
    return `<${tag} class="md-list ${listClass}">\n${items}\n</${tag}>\n`;
  };
  
  renderer.blockquote = function(token) {
    return `<blockquote class="md-blockquote">\n${token.text}</blockquote>\n`;
  };
  

  renderer.code = function(token) {
    const lang = token.lang || '';
    let code = token.text;
    if (lang && typeof hljs !== 'undefined') {
      try {
        code = hljs.highlight(code, { language: lang, ignoreIllegals: true }).value;
      } catch (e) {
        // Silent fail
      }
    }
    return `<pre><code class="hljs language-${lang}">${code}</code></pre>\n`;
  };
  
  renderer.codespan = function(token) {
    return `<code class="md-inline-code">${token.text}</code>`;
  };
  
  renderer.link = function(token) {
    return `<a href="${token.href}" class="md-link" target="_blank" rel="noopener noreferrer">${token.text}</a>`;
  };
  
  renderer.hr = function() {
    return '<hr class="md-hr">\n';
  };
  
  marked.setOptions({
    renderer: renderer,
    breaks: true,
    gfm: true,
    pedantic: false,
    mangle: false
  });
}



function renderMarkdown(markdown, showAnimation = true) {
  try {
    const html = marked.parse(markdown);
    
    const contentDiv = document.getElementById('markdown-content');
    if (!contentDiv) {
      throw new Error('Could not find #markdown-content element');
    }
    
    contentDiv.innerHTML = html;
    
    if (showAnimation) {
      const elements = contentDiv.querySelectorAll('h1, h2, h3, h4, h5, h6, p, ul, ol, blockquote, pre, hr');
      elements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.animation = `fadeInUp 0.6s ease-out ${0.3 + index * 0.08}s both`;
      });
    }
    
    return true;
  } catch (error) {
    return false;
  }
}

async function loadAndRenderMarkdown() {
  try {
    await setupMarked();
    const timestamp = new Date().getTime();
    const response = await fetch(`/changelogs/changelogs.md?t=${timestamp}`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const markdown = await response.text();
    
    if (!markdown || markdown.trim().length === 0) {
      throw new Error('Markdown file is empty');
    }
    
    currentMarkdownContent = markdown;
    renderMarkdown(markdown, true);
    
    const spinner = document.querySelector('.loading-spinner');
    if (spinner) {
      spinner.style.opacity = '0';
      spinner.style.transition = 'opacity 0.4s ease-out';
      setTimeout(() => {
        spinner.style.display = 'none';
      }, 400);
    }
    
  } catch (error) {
    
    const contentDiv = document.getElementById('markdown-content');
    if (contentDiv) {
      contentDiv.innerHTML = `
        <div class="error-message" style="animation: slideInDown 0.6s ease-out;">
          <h3>Error Loading Changelogs</h3>
          <p><strong>Error:</strong> ${error.message}</p>
          <p style="font-size: 12px; margin-top: 16px; color: #888;">
            Expected file location: /changelogs/changelogs.md
          </p>
        </div>
      `;
    }
    
    const spinner = document.querySelector('.loading-spinner');
    if (spinner) {
      spinner.style.opacity = '0';
      spinner.style.transition = 'opacity 0.4s ease-out';
      setTimeout(() => {
        spinner.style.display = 'none';
      }, 400);
    }
  }
}

async function checkForUpdates() {
  if (isUpdating) return; // Skip if already updating
  
  try {
    const timestamp = new Date().getTime();
    const response = await fetch(`/changelogs/changelogs.md?t=${timestamp}`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
    if (!response.ok) return;
    
    const markdown = await response.text();
    
    if (markdown !== currentMarkdownContent) {
      isUpdating = true;
      currentMarkdownContent = markdown;
      
      const contentDiv = document.getElementById('markdown-content');
      contentDiv.style.opacity = '0.5';
      contentDiv.style.transition = 'opacity 0.3s ease-out';

      await setupMarked(); // Ensure marked is ready
      renderMarkdown(markdown, true);
      
      // Fade back in
      setTimeout(() => {
        contentDiv.style.opacity = '1';
      }, 300);
      
      isUpdating = false;
    }
  } catch (error) {
    // Silent fail on update check
  }
}

function startLiveUpdates() {
  setInterval(checkForUpdates, 5000);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    loadAndRenderMarkdown();
    startLiveUpdates();
  });
} else {
  loadAndRenderMarkdown();
  startLiveUpdates();
}
