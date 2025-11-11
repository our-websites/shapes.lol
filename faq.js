 // FAQ accordion functionality
    document.querySelectorAll('.faq-question').forEach(question => {
      question.addEventListener('click', () => {
        const faqItem = question.parentElement;
        const isActive = faqItem.classList.contains('active');
        
        // Close all other FAQ items
        document.querySelectorAll('.faq-item').forEach(item => {
          item.classList.remove('active');
        });
        
        // Toggle current item
        if (!isActive) {
          faqItem.classList.add('active');
        }
      });
    });