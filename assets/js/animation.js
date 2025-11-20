// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// GSAP Animations
document.addEventListener('DOMContentLoaded', function() {
    console.log('GSAP animations loaded');
    
    // Hero section animations - animate all direct children except FAQ section
    const heroElements = document.querySelectorAll('.hero > *:not(.faq-section)');
    gsap.from(heroElements, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out"
    });

    // Topbar animation (File: index.html)
    gsap.from('.topbar', {
        opacity: 0,
        y: -20,
        duration: 0.6,
        ease: "power2.out"
    });

    // Stats animation (File: index.html)
    gsap.from('.stats', {
        opacity: 0,
        y: 20,
        duration: 0.6,
        delay: 0.4,
        ease: "power2.out"
    });

    // Add floating animation to stats numbers (File: index.html)
    gsap.to('.stats strong', {
        y: -5,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.2
    });

    // Leaderboard cards animation (File: index.html)
    gsap.from('.leaderboard-card', {
        opacity: 0,
        y: 20,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
            trigger: '.counting-section',
            start: 'top 80%'
        }
    });

    // FAQ section animation (separate from hero elements), (File: index.html)
    gsap.from('.faq-section', {
        y: 30,
        duration: 0.8,
        delay: 0.7,
        ease: "power2.out"
    });

    // FAQ items animation (File: index.html)
    gsap.from('.faq-item', {
        y: 20,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
            trigger: '.faq-section',
            start: 'top 80%'
        }
    });
    
    // FAQ accordion functionality
    console.log('Setting up FAQ accordion');
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', () => {
            console.log('FAQ question clicked');
            const faqItem = question.parentElement;
            const isActive = faqItem.classList.contains('active');
            console.log('FAQ item active:', isActive);
            
            // Close all other FAQ items
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Toggle current item
            if (!isActive) {
                console.log('Activating FAQ item');
                faqItem.classList.add('active');
            }
        });
    });
});

// Function to animate stats when they update
function animateStatsUpdate() {
    // Add a subtle pulse animation when stats update
    gsap.from('.stats strong', {
        scale: 1.1,
        duration: 0.3,
        ease: "power2.out",
        stagger: 0.1
    });
}