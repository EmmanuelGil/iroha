(function ($) {
	'use strict';



	/*-------------------------------------------------------------------------------
  Detect mobile device 
-------------------------------------------------------------------------------*/



	var mobileDevice = false;

	if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
		$('html').addClass('mobile');
		mobileDevice = true;
	}

	else {
		$('html').addClass('no-mobile');
		mobileDevice = false;
	}



	/*-------------------------------------------------------------------------------
	  Window load
	-------------------------------------------------------------------------------*/



	/* Hide loader as soon as the DOM is ready (window load as fallback) */

	function hideLoader() {
		$('.loader').fadeOut(200);
	}

	$(function () { hideLoader(); });

	$(window).on('load', function () {

		hideLoader();

		/* Wow Init */

		if ($('.wow').length > 0) {
			var wow = new WOW({
				offset: 150,
				mobile: false
			}
			);
			wow.init();
		}

	});


	/* Contact modal (keyboard accessible) */

	var modal = document.getElementById("myModal");
	var btn = document.getElementById("myBtn");
	var span = modal ? modal.querySelector(".close") : null;

	function openModal() {
		if (modal) modal.style.display = "block";
	}

	function closeModal() {
		if (modal) modal.style.display = "none";
	}

	if (btn) {
		btn.addEventListener('click', openModal);
		btn.addEventListener('keydown', function (e) {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				openModal();
			}
		});
	}

	if (span) {
		span.addEventListener('click', closeModal);
		span.addEventListener('keydown', function (e) {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				closeModal();
			}
		});
	}

	window.addEventListener('click', function (event) {
		if (event.target === modal) closeModal();
	});

	document.addEventListener('keydown', function (e) {
		if (e.key === 'Escape') closeModal();
	});


	/* Language dropdown: toggle on click/tap (hover alone fails on touch) */

	$('.dropdown > .dropbtn').on('click', function (e) {
		e.stopPropagation();
		var $dropdown = $(this).closest('.dropdown');
		var isOpen = $dropdown.hasClass('open');
		$('.dropdown').removeClass('open').find('.dropbtn').attr('aria-expanded', 'false');
		$dropdown.toggleClass('open', !isOpen);
		$(this).attr('aria-expanded', String(!isOpen));
	});

	$(document).on('click', function () {
		$('.dropdown').removeClass('open').find('.dropbtn').attr('aria-expanded', 'false');
	});


	/*-------------------------------------------------------------------------------
	  Navbar 
	-------------------------------------------------------------------------------*/



	/* Fixed Navbar On Scroll */



	$('.js-navbar').affix({
		offset: {
			top: 50
		}
	});


	$('.js-navbar').on('affix.bs.affix', function () {
		if (!$('.js-navbar').hasClass('affix')) {
			$('.js-navbar').addClass('animated slideInDown');
		}
	});

	$('.js-navbar').on('affixed-top.bs.affix', function () {
		$('.js-navbar').removeClass('animated slideInDown');

	});



	/* Smooth Scroll To Anchor */



	$('.navigation ul li a, .mobile-menu ul li a').on('click', function () {
		var target = $(this.hash);
		if (target.length) {
			$('html,body').animate({
				scrollTop: (target.offset().top - $('.js-navbar').outerHeight() + 1)
			}, 1000);
			$('body').removeClass('menu-is-opened').addClass('menu-is-closed');
			return false;
		}
	});



	/* Scrollspy - Active Anchor Class On Scroll */



	$('body').scrollspy({
		offset: $('.js-navbar').outerHeight()
	});



	/*-------------------------------------------------------------------------------
	  Sidebar Menu
	-------------------------------------------------------------------------------*/


	function hideMenu() {
		$('body').removeClass('menu-is-opened').addClass('menu-is-closed');
	}

	function showMenu() {
		$('body').removeClass('menu-is-closed').addClass('menu-is-opened');
	}

	$('.navbar-toggle').on('click', function () {
		showMenu();
	});



	/* Close Menu */



	$('.close-menu, .click-capture').on('click', function () {
		hideMenu();
		$('.menu-list ul').slideUp(300);
	});



	/*-------------------------------------------------------------------------------
	  Owl Carousel Init
	-------------------------------------------------------------------------------*/


	if ($('.owl-carousel').length > 0) {



		/* Project Carousel */



		$('.project-carousel').owlCarousel({
			dots: true,
			margin: 30,
			smartSpeed: 250,
			responsiveRefreshRate: 0,
			responsive: {
				0: {
					items: 1
				},
				768: {
					items: 2
				},
				1200: {
					items: 3
				},
				1600: {
					items: 4
				}
			}
		});



		/* Client Carousel */



		$('.client-carousel').owlCarousel({
			margin: 30,
			smartSpeed: 250,
			nav: true,
			navText: [],
			dots: false,
			autoHeight: true,
			responsiveRefreshRate: 0,
			responsive: {
				0: {
					items: 1
				},
				768: {
					items: 1
				},
				992: {
					items: 2
				},
				1200: {
					items: 2
				}
			}
		});



		/* Partner Carousel */



		$('.partner-carousel').owlCarousel({
			margin: 30,
			smartSpeed: 250,
			dots: true,
			autoplay: true,
			responsiveRefreshRate: 0,
			responsive: {
				0: {
					items: 2
				},
				768: {
					items: 3
				},
				992: {
					items: 4
				},
				1200: {
					items: 5
				}
			}
		});



		/* Review Carousel */



		$(".review-carousel").owlCarousel({
			responsive: {
				0: {
					items: 1
				},
				720: {
					items: 1,

				},
				1280: {
					items: 1
				}
			},
			responsiveRefreshRate: 0,
			nav: true,
			navText: [],
			animateIn: 'fadeIn',
			dots: false
		});

	}



	/*-------------------------------------------------------------------------------
	  Filter Project Carousel 
	-------------------------------------------------------------------------------*/



	$('.js-filter-carousel li a').on('click', function () {
		$('.js-filter-carousel .active').removeClass('active');
		$(this).closest('li').addClass('active');
		var selector = $(this).attr('data-filter');
		$('.project-carousel').fadeOut(300);
		$('.project-carousel').fadeIn(300);
		setTimeout(function () {
			$('.project-carousel .owl-item').hide();
			$(selector).closest('.project-carousel .owl-item').show();
		}, 300);
		return false;
	});



	/*-------------------------------------------------------------------------------
	  Projects Modal
	-------------------------------------------------------------------------------*/



	$('.popup-with-zoom-anim').magnificPopup({
		type: 'inline',
		fixedBgPos: true,
		overflowY: 'auto',
		closeBtnInside: true,
		preloader: false,
		midClick: true,
		fixedContentPos: true,
		removalDelay: 300,
		mainClass: 'my-mfp-zoom-in'
	});



	/*-------------------------------------------------------------------------------
	  Change Bacgkround On Project Section
	-------------------------------------------------------------------------------*/



	$('.project-box').on('mouseover', function () {
		var index = $('.project-box').index(this);
		$('.bg-changer .section-bg').removeClass('active').eq(index).addClass('active');
	});



	/*-------------------------------------------------------------------------------
	  Ajax Forms
	-------------------------------------------------------------------------------*/



	/* The site is static (no PHP), so the form posts to FormSubmit.co, which
	   forwards every submission to the school's inbox. NOTE: the very first
	   submission triggers a one-time activation e-mail to CONTACT_EMAIL that
	   must be confirmed before messages start arriving. */

	var CONTACT_EMAIL = 'fjls@fukuokaschool.com';
	var FORM_ENDPOINT = 'https://formsubmit.co/ajax/' + CONTACT_EMAIL;

	if ($('.js-form').length > 0) {
		$('.js-form').each(function () {
			$(this).validate({
				errorClass: 'error wobble-error',
				submitHandler: function (form) {
					var $form = $(form);
					var $submit = $form.find('[type="submit"]').prop('disabled', true);
					$('.success-message, .error-message').hide();
					$.ajax({
						type: 'POST',
						url: FORM_ENDPOINT,
						dataType: 'json',
						data: {
							name: $form.find('[name="name"]').val(),
							email: $form.find('[name="email"]').val(),
							subject: $form.find('[name="subject"]').val(),
							message: $form.find('[name="message"]').val(),
							_subject: 'Website contact — Iroha Japanese Language School',
							_template: 'table',
							_captcha: 'false',
							_honey: $form.find('[name="_honey"]').val()
						},
						success: function () {
							$('.success-message').show();
							form.reset();
						},
						error: function () {
							$('.error-message').show();
						},
						complete: function () {
							$submit.prop('disabled', false);
						}
					});
				}
			});
		});
	}

})(jQuery);
