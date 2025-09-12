// Terror in Tierhaven Documentation - Interactive JavaScript

// Back to Top Button functionality
document.addEventListener('DOMContentLoaded', function() {
    const backToTop = document.getElementById('backToTop');
    
    if (backToTop) {
        // Show/hide back to top button based on scroll position
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });
        
        // Smooth scroll to top when clicked
        backToTop.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Collapsible sections functionality
    const collapsibles = document.querySelectorAll('.collapsible');
    
    collapsibles.forEach(function(collapsible) {
        collapsible.addEventListener('click', function() {
            this.classList.toggle('active');
            const content = this.nextElementSibling;
            
            if (content && content.classList.contains('collapsible-content')) {
                content.classList.toggle('active');
            }
        });
    });
    
    // Search functionality for FAQ page
    const searchInput = document.getElementById('faqSearch');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            searchFAQ();
        });
        
        // Also handle Enter key
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                searchFAQ();
            }
        });
    }
    
    // Syntax highlighting for code blocks
    highlightCode();
    
    // Copy code functionality
    addCopyButtons();
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add interactive checklist functionality
    const checklistItems = document.querySelectorAll('.checklist li');
    
    checklistItems.forEach(function(item) {
        item.addEventListener('click', function() {
            this.classList.toggle('checked');
            
            // Store state in localStorage
            const checkedItems = [];
            document.querySelectorAll('.checklist li.checked').forEach(function(checked) {
                checkedItems.push(checked.textContent);
            });
            localStorage.setItem('tit-checklist', JSON.stringify(checkedItems));
        });
    });
    
    // Restore checklist state from localStorage
    const savedChecklist = localStorage.getItem('tit-checklist');
    if (savedChecklist) {
        const checkedItems = JSON.parse(savedChecklist);
        checklistItems.forEach(function(item) {
            if (checkedItems.includes(item.textContent)) {
                item.classList.add('checked');
            }
        });
    }
    
    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        // Ctrl+K or Cmd+K to focus search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const search = document.getElementById('faqSearch');
            if (search) {
                search.focus();
            }
        }
        
        // Escape to close search
        if (e.key === 'Escape') {
            const search = document.getElementById('faqSearch');
            if (search && document.activeElement === search) {
                search.blur();
                search.value = '';
                searchFAQ();
            }
        }
    });
});

// Search FAQ function
function searchFAQ() {
    const searchInput = document.getElementById('faqSearch');
    if (!searchInput) return;
    
    const searchTerm = searchInput.value.toLowerCase();
    const faqItems = document.querySelectorAll('.faq-item');
    const sections = document.querySelectorAll('.content');
    
    if (searchTerm === '') {
        // Show all items if search is empty
        faqItems.forEach(function(item) {
            item.style.display = '';
        });
        sections.forEach(function(section) {
            section.style.display = '';
        });
        return;
    }
    
    // Track which sections have visible items
    const visibleSections = new Set();
    
    faqItems.forEach(function(item) {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const text = (question ? question.textContent : '') + 
                    (answer ? answer.textContent : '');
        
        if (text.toLowerCase().includes(searchTerm)) {
            item.style.display = '';
            // Mark the parent section as visible
            const parentSection = item.closest('.content');
            if (parentSection) {
                visibleSections.add(parentSection);
            }
            
            // Highlight matching text
            highlightSearchTerm(item, searchTerm);
        } else {
            item.style.display = 'none';
        }
    });
    
    // Show/hide sections based on whether they have visible items
    sections.forEach(function(section) {
        if (visibleSections.has(section)) {
            section.style.display = '';
            // Auto-expand collapsed sections with results
            const collapsible = section.querySelector('.collapsible');
            const content = section.querySelector('.collapsible-content');
            if (collapsible && content && !content.classList.contains('active')) {
                collapsible.classList.add('active');
                content.classList.add('active');
            }
        }
    });
}

// Highlight search terms in text
function highlightSearchTerm(element, searchTerm) {
    // Remove existing highlights
    const existingHighlights = element.querySelectorAll('.search-highlight');
    existingHighlights.forEach(function(highlight) {
        const parent = highlight.parentNode;
        parent.replaceChild(document.createTextNode(highlight.textContent), highlight);
        parent.normalize();
    });
    
    if (!searchTerm) return;
    
    // Add new highlights
    const walker = document.createTreeWalker(
        element,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );
    
    const textNodes = [];
    let node;
    
    while (node = walker.nextNode()) {
        if (node.nodeValue.toLowerCase().includes(searchTerm)) {
            textNodes.push(node);
        }
    }
    
    textNodes.forEach(function(textNode) {
        const span = document.createElement('span');
        span.innerHTML = textNode.nodeValue.replace(
            new RegExp('(' + escapeRegExp(searchTerm) + ')', 'gi'),
            '<span class="search-highlight" style="background: #8b4789; color: white; padding: 2px 4px; border-radius: 3px;">$1</span>'
        );
        textNode.parentNode.replaceChild(span, textNode);
    });
}

// Escape special characters for regex
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Basic syntax highlighting for code blocks
function highlightCode() {
    const codeBlocks = document.querySelectorAll('code.language-javascript');
    
    codeBlocks.forEach(function(block) {
        let html = block.innerHTML;
        
        // Highlight comments
        html = html.replace(/(\/\/.*$)/gm, '<span class="comment">$1</span>');
        html = html.replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="comment">$1</span>');
        
        // Highlight strings
        html = html.replace(/("[^"]*")/g, '<span class="string">$1</span>');
        html = html.replace(/('[^']*')/g, '<span class="string">$1</span>');
        html = html.replace(/(`[^`]*`)/g, '<span class="string">$1</span>');
        
        // Highlight keywords
        const keywords = ['const', 'let', 'var', 'function', 'if', 'else', 'for', 'while', 
                         'return', 'new', 'async', 'await', 'try', 'catch', 'class', 'extends'];
        keywords.forEach(function(keyword) {
            const regex = new RegExp('\\b(' + keyword + ')\\b', 'g');
            html = html.replace(regex, '<span class="keyword">$1</span>');
        });
        
        block.innerHTML = html;
    });
}

// Add copy buttons to code blocks
function addCopyButtons() {
    const codeBlocks = document.querySelectorAll('pre code');
    
    codeBlocks.forEach(function(block) {
        const pre = block.parentElement;
        
        // Create copy button
        const button = document.createElement('button');
        button.className = 'copy-button';
        button.textContent = 'Copy';
        button.style.cssText = `
            position: absolute;
            top: 5px;
            right: 5px;
            padding: 5px 10px;
            background: #8b4789;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            font-size: 12px;
            opacity: 0;
            transition: opacity 0.3s;
        `;
        
        // Make pre element relative for button positioning
        pre.style.position = 'relative';
        
        // Show button on hover
        pre.addEventListener('mouseenter', function() {
            button.style.opacity = '1';
        });
        
        pre.addEventListener('mouseleave', function() {
            button.style.opacity = '0';
        });
        
        // Copy functionality
        button.addEventListener('click', function() {
            const textToCopy = block.textContent || block.innerText;
            
            navigator.clipboard.writeText(textToCopy).then(function() {
                button.textContent = 'Copied!';
                button.style.background = '#4a8f4e';
                
                setTimeout(function() {
                    button.textContent = 'Copy';
                    button.style.background = '#8b4789';
                }, 2000);
            }).catch(function(err) {
                console.error('Failed to copy:', err);
                button.textContent = 'Failed';
                button.style.background = '#d44a4a';
                
                setTimeout(function() {
                    button.textContent = 'Copy';
                    button.style.background = '#8b4789';
                }, 2000);
            });
        });
        
        pre.appendChild(button);
    });
}

// Theme toggle (future enhancement)
function initThemeToggle() {
    const savedTheme = localStorage.getItem('tit-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

// Initialize on load
window.addEventListener('load', function() {
    initThemeToggle();
    
    // Add loading animation removal
    const loading = document.querySelector('.loading');
    if (loading) {
        loading.style.display = 'none';
    }
    
    // Log successful load
    console.log('Terror in Tierhaven Documentation loaded successfully');
});