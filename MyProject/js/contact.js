document.addEventListener("DOMContentLoaded", () => {
    // Contact Form Validation and Submission
    const contactForm = document.getElementById("contact-form")
  
    if (contactForm) {
      contactForm.addEventListener("submit", (e) => {
        e.preventDefault()
  
        // Get form values
        const name = document.getElementById("name").value
        const email = document.getElementById("email").value
        const phone = document.getElementById("phone").value
        const subject = document.getElementById("subject").value
        const message = document.getElementById("message").value
        const privacy = document.querySelector('input[name="privacy"]').checked
  
        // Validate form (basic validation)
        if (!name || !email || !subject || !message || !privacy) {
          showNotification("กรุณากรอกข้อมูลให้ครบถ้วน", "error")
          return
        }
  
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
          showNotification("กรุณากรอกอีเมลให้ถูกต้อง", "error")
          return
        }
  
        // In a real application, you would send the form data to the server
        // For this example, we'll just show a success notification
  
        // Show loading state
        const submitBtn = contactForm.querySelector(".submit-btn")
        const originalText = submitBtn.textContent
        submitBtn.disabled = true
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> กำลังส่ง...'
  
        // Simulate form submission
        setTimeout(() => {
          // Reset form
          contactForm.reset()
  
          // Reset button
          submitBtn.disabled = false
          submitBtn.textContent = originalText
  
          // Show success notification
          showNotification("ส่งข้อความเรียบร้อยแล้ว เราจะติดต่อกลับโดยเร็วที่สุด")
        }, 1500)
      })
    }
  
    // FAQ Accordion
    const faqQuestions = document.querySelectorAll(".faq-question")
  
    if (faqQuestions.length > 0) {
      faqQuestions.forEach((question) => {
        question.addEventListener("click", () => {
          const faqItem = question.parentElement
          const isActive = faqItem.classList.contains("active")
  
          // Close all other FAQs
          document.querySelectorAll(".faq-item").forEach((item) => {
            item.classList.remove("active")
            const icon = item.querySelector(".faq-icon i")
            icon.className = "fas fa-plus"
          })
  
          // Toggle current FAQ
          if (!isActive) {
            faqItem.classList.add("active")
            const icon = question.querySelector(".faq-icon i")
            icon.className = "fas fa-minus"
          }
        })
      })
    }
  
    // Notification function
    function showNotification(message, type = "success") {
      // Check if notification container exists, if not create it
      let notificationContainer = document.querySelector(".notification-container")
      if (!notificationContainer) {
        notificationContainer = document.createElement("div")
        notificationContainer.className = "notification-container"
        document.body.appendChild(notificationContainer)
      }
  
      // Create notification
      const notification = document.createElement("div")
      notification.className = `notification ${type}`
      notification.innerHTML = `
              <div class="notification-content">
                  <i class="fas ${type === "success" ? "fa-check-circle" : "fa-exclamation-circle"}"></i>
                  <span>${message}</span>
              </div>
              <button class="notification-close"><i class="fas fa-times"></i></button>
          `
  
      // Add to container
      notificationContainer.appendChild(notification)
  
      // Add close functionality
      const closeBtn = notification.querySelector(".notification-close")
      closeBtn.addEventListener("click", () => {
        notification.classList.add("fade-out")
        setTimeout(() => {
          notification.remove()
        }, 300)
      })
  
      // Auto remove after 5 seconds
      setTimeout(() => {
        notification.classList.add("fade-out")
        setTimeout(() => {
          notification.remove()
        }, 300)
      }, 5000)
    }
  })
  