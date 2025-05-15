'use strict';

document.addEventListener('DOMContentLoaded', () => {
	const form = document.getElementById('contactForm');

	form.addEventListener('submit', function (e) {
		e.preventDefault();

		const nameInput = this.name;
		const emailInput = this.email;
		const phoneInput = this.phone;

		let isValid = true;

		[nameInput, emailInput, phoneInput].forEach(input => {
			input.classList.remove('is-valid', 'is-invalid');
		});

		if (nameInput.value.trim().length < 2) {
			nameInput.classList.add('is-invalid');
			isValid = false;
		} else {
			nameInput.classList.add('is-valid');
		}

		const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
		if (!emailPattern.test(emailInput.value.trim())) {
			emailInput.classList.add('is-invalid');
			isValid = false;
		} else {
			emailInput.classList.add('is-valid');
		}

		const phonePattern = /^[0-9\-\+\s\(\)]{7,15}$/;
		if (!phonePattern.test(phoneInput.value.trim())) {
			phoneInput.classList.add('is-invalid');
			isValid = false;
		} else {
			phoneInput.classList.add('is-valid');
		}

		if (isValid) {
			alert("Form is valid and ready to be submitted!");
			this.submit();
		}
	});
});

// back to top button
const scrollToTopBtn = document.getElementById('scrollToTopBtn');

// Show or hide button based on scroll position
window.addEventListener('scroll', () => {
	if (window.pageYOffset > 300) {
		scrollToTopBtn.classList.add('show');
	} else {
		scrollToTopBtn.classList.remove('show');
	}
});

// Scroll to top on click
scrollToTopBtn.addEventListener('click', () => {
	window.scrollTo({
		top: 0,
		behavior: 'smooth'
	});
});
