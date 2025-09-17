// Terror in Tierhaven Documentation - Enhanced Interactive JavaScript
// Enhanced with Drakkenheim Immersion Effects

// Initialize Drakkenheim immersive elements
document.addEventListener('DOMContentLoaded', function() {
    // Create immersive elements
    createPageBorder();
    createToxicHaze();
    createFloatingDelieriumCrystals();

    // Initialize existing functionality
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

    // Start periodic crystal spawning
    setInterval(spawnRandomCrystal, 8000);

    // Log successful load with debug info
    console.log('Terror in Tierhaven Documentation loaded successfully - Drakkenheim immersion active');
    console.log('Elements created:', {
        'page-border': document.querySelector('.page-border') ? 'Created' : 'Failed',
        'toxic-haze': document.querySelector('.toxic-haze') ? 'Created' : 'Failed'
    });
});

// ===== DRAKKENHEIM IMMERSION FUNCTIONS =====

// Create vertical book border element
function createPageBorder() {
    const border = document.createElement('div');
    border.className = 'page-border';
    border.setAttribute('aria-hidden', 'true');
    document.body.appendChild(border);
}

// Create toxic haze overlay with multiple cloud layers
function createToxicHaze() {
    // Main cloud layer
    const haze = document.createElement('div');
    haze.className = 'toxic-haze';
    haze.setAttribute('aria-hidden', 'true');
    document.body.appendChild(haze);

    // Add secondary cloud layer for depth
    const secondaryHaze = document.createElement('div');
    secondaryHaze.className = 'toxic-haze-secondary';
    secondaryHaze.setAttribute('aria-hidden', 'true');
    secondaryHaze.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 180%;
        height: 100%;
        background:
            radial-gradient(ellipse 200px 100px at 40% 20%, rgba(139, 71, 139, 0.12) 0%, transparent 60%),
            radial-gradient(ellipse 150px 75px at 80% 60%, rgba(155, 77, 155, 0.08) 0%, transparent 70%),
            radial-gradient(ellipse 180px 90px at 10% 80%, rgba(90, 42, 90, 0.10) 0%, transparent 65%);
        animation: driftingCloudsSlow 35s linear infinite reverse;
        pointer-events: none;
        z-index: 1;
        opacity: 0.4;
        will-change: transform;
    `;
    document.body.appendChild(secondaryHaze);
}

// Create floating Delerium crystals with real images
function createFloatingDelieriumCrystals() {
    // Reduce crystals on mobile for performance
    const isMobile = window.innerWidth <= 768;
    const crystalCount = isMobile ? 3 : 5;

    // Create multiple crystal layers for depth
    for (let i = 0; i < crystalCount; i++) {
        setTimeout(() => {
            createCrystal(i);
        }, i * (isMobile ? 3000 : 2000));
    }
}

// Create individual floating crystal
function createCrystal(index) {
    const crystal = document.createElement('div');
    crystal.className = 'floating-crystal';
    crystal.setAttribute('aria-hidden', 'true');

    // Randomly choose crystal image
    const crystalImages = [
        'images/delerium-chunk-1.webp?v=7',
        'images/delerium-chunk-5.webp?v=7'
    ];

    const randomImage = crystalImages[Math.floor(Math.random() * crystalImages.length)];
    const size = 20 + Math.random() * 40; // 20-60px
    const startX = Math.random() * window.innerWidth;
    const startY = window.innerHeight + 50;

    crystal.style.cssText = `
        position: fixed;
        width: ${size}px;
        height: ${size}px;
        background-image: url('${randomImage}');
        background-size: cover;
        background-repeat: no-repeat;
        left: ${startX}px;
        top: ${startY}px;
        opacity: 0;
        z-index: 10;
        pointer-events: none;
        filter: brightness(0.8) hue-rotate(${Math.random() * 60}deg);
        animation: floatUp 15s linear infinite;
        animation-delay: ${index * 0.5}s;
        will-change: transform, opacity, filter;
    `;

    document.body.appendChild(crystal);

    // Remove crystal after animation
    setTimeout(() => {
        if (crystal.parentNode) {
            crystal.parentNode.removeChild(crystal);
        }
    }, 15000 + (index * 500));
}

// Spawn random crystals periodically
function spawnRandomCrystal() {
    const isMobile = window.innerWidth <= 768;
    const spawnChance = isMobile ? 0.6 : 0.3; // Lower spawn rate on mobile

    if (Math.random() > spawnChance) {
        createCrystal(Math.floor(Math.random() * 10));
    }
}

// Enhanced scroll effects with crystal interactions
function enhanceScrollEffects() {
    let ticking = false;

    function updateScrollEffects() {
        const scrollPercent = window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight);

        // Enhance toxic haze based on scroll
        const haze = document.querySelector('.toxic-haze');
        if (haze) {
            haze.style.opacity = 0.4 + (scrollPercent * 0.4);
            haze.style.filter = `blur(${1 + scrollPercent * 2}px)`;
        }

        // Enhance border glow based on scroll
        const border = document.querySelector('.page-border');
        if (border) {
            border.style.filter = `brightness(${0.8 + scrollPercent * 0.6}) contrast(${1 + scrollPercent * 0.3})`;
        }

        ticking = false;
    }

    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    });
}

// Initialize enhanced scroll effects
document.addEventListener('DOMContentLoaded', function() {
    enhanceScrollEffects();
});

// Add floating crystal animation keyframes via JavaScript
const style = document.createElement('style');
style.textContent = `
    @keyframes floatUp {
        0% {
            transform: translateY(0px) translateX(0px) rotate(0deg) scale(0.5);
            opacity: 0;
        }
        10% {
            opacity: 0.6;
            transform: translateY(-100px) translateX(20px) rotate(36deg) scale(1);
        }
        50% {
            opacity: 0.8;
            transform: translateY(-50vh) translateX(-30px) rotate(180deg) scale(1.2);
            filter: brightness(1.2) hue-rotate(30deg);
        }
        90% {
            opacity: 0.3;
            transform: translateY(-90vh) translateX(40px) rotate(324deg) scale(0.8);
        }
        100% {
            transform: translateY(-100vh) translateX(60px) rotate(360deg) scale(0.3);
            opacity: 0;
        }
    }

    .floating-crystal {
        transition: filter 0.3s ease;
    }

    .floating-crystal:hover {
        filter: brightness(1.5) hue-rotate(45deg) !important;
    }
`;
document.head.appendChild(style);

// ===== PARALLAX SCROLLING EFFECTS =====

// Enhanced parallax scrolling effects for immersive imagery
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const parallaxImages = document.querySelectorAll('.parallax-image');

    parallaxImages.forEach((image, index) => {
        const rect = image.parentElement.getBoundingClientRect();
        const speed = 0.5 + (index * 0.1); // Different speeds for depth

        // Only apply parallax when element is in viewport
        if (rect.bottom >= 0 && rect.top <= window.innerHeight) {
            const yPos = -(rect.top * speed);

            // Add subtle rotation and scale effects
            const rotationAngle = (rect.top * 0.02) % 360;
            const scaleValue = 1 + (Math.abs(rect.top) * 0.0001);
            
            // Combine all transforms in one assignment
            image.style.transform = `translateY(${yPos}px) scale(${Math.min(scaleValue, 1.1)})`;
            
            image.style.filter = `
                contrast(1.2)
                brightness(0.7)
                saturate(1.1)
                hue-rotate(${rotationAngle}deg)
            `;
        }
    });
});
// Enhanced contamination effects on scroll
let contaminationIntensity = 0;

window.addEventListener('scroll', function() {
    const scrollPercent = window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight);
    contaminationIntensity = Math.min(scrollPercent * 2, 1);

    // Increase toxic haze opacity as user scrolls deeper
    const toxicHaze = document.querySelector('.toxic-haze');
    if (toxicHaze) {
        toxicHaze.style.opacity = 0.6 + (contaminationIntensity * 0.3);
    }

    // Intensify corruption background
    const bodyAfter = document.body;
    if (bodyAfter) {
        bodyAfter.style.setProperty('--scroll-contamination', contaminationIntensity);
    }

    // Add dynamic creature sounds based on scroll position
    if (window.drakkenheimAudio && contaminationIntensity > 0.7) {
        // Trigger more intense effects at deeper scroll levels
        if (Math.random() < 0.001) { // Very rare
            if (typeof window.drakkenheimAudio.playInfectionPulse === 'function') {
                window.drakkenheimAudio.playInfectionPulse();
            }
        }
    }
});