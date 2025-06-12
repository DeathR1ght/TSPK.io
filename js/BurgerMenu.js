$(document).ready(function() {
    // Инициализация версии для слабовидящих
    if (typeof initVisionMode === 'function') {
        initVisionMode();
    }
    
    // Бургер-меню с анимациями
    $('.burger').click(function(e) {
        e.stopPropagation();
        toggleBurgerMenu();
    });

    // Закрытие меню при клике на ссылку
    $('.nav-links a').click(function(e) {
        if ($(this).attr('href').includes('#')) {
            e.preventDefault();
            const href = $(this).attr('href');
            
            if (href.includes('.html#')) {
                const [path, hash] = href.split('#');
                window.location.href = path;
                localStorage.setItem('pendingScroll', '#' + hash);
            } else {
                if (typeof scrollToTarget === 'function') {
                    scrollToTarget(href);
                }
            }
        }
        
        closeBurgerMenu();
    });

    // Закрытие меню при клике вне его области
    $(document).click(function(e) {
        if (!$(e.target).closest('.burger-container, .nav-links').length) {
            closeBurgerMenu();
        }
    });

    // Автоматическое закрытие при увеличении экрана
    $(window).resize(function() {
        handleResponsiveMenu();
    });
});

// Функции для бургер-меню
function toggleBurgerMenu() {
    const $burgerContainer = $('.burger-container');
    const $navLinks = $('.nav-links');
    const $burger = $('.burger');
    const $body = $('body');
    
    $burgerContainer.toggleClass('active');
    $navLinks.toggleClass('active');
    $body.toggleClass('no-scroll');
    $burger.toggleClass('toggle');
    
    if($('body').hasClass('vision-mode')) {
        $navLinks.css({
            'background-color': '#fff',
            'border': '3px solid #000'
        });
        $('.nav-links a').css({
            'font-size': '28px !important',
            'padding': '20px !important'
        });
    }
}

function closeBurgerMenu() {
    const $burger = $('.burger');
    const $navLinks = $('.nav-links');
    const $burgerContainer = $('.burger-container');
    
    $burgerContainer.removeClass('active');
    $navLinks.removeClass('active');
    $('body').removeClass('no-scroll');
    $burger.removeClass('toggle');
}

function handleResponsiveMenu() {
    const windowWidth = $(window).width();
    
    if (windowWidth > 1100) {
        closeBurgerMenu();
    }
}