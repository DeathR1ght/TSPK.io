$(document).ready(function() {
    // Инициализация версии для слабовидящих
    initVisionMode();
    
    // Бургер-меню с анимациями
    $('.burger').click(function(e) {
        e.stopPropagation(); // Предотвращаем всплытие события
        toggleBurgerMenu();
    });

    // Закрытие меню при клике на ссылку
    $('.nav-links a').click(function(e) {
        // Для ссылок с якорями обрабатываем плавный скролл
        if ($(this).attr('href').includes('#')) {
            e.preventDefault();
            const href = $(this).attr('href');
            
            if (href.includes('.html#')) {
                const [path, hash] = href.split('#');
                window.location.href = path;
                localStorage.setItem('pendingScroll', '#' + hash);
            } else {
                scrollToTarget(href);
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

// Добавляем функцию для прокрутки к цели (аналогичную из main.js)
function scrollToTarget(target) {
    if ($(target).length) {
        $('html, body').animate({
            scrollTop: $(target).offset().top - 100
        }, 800);
    }
}

// Функции для версии для слабовидящих
function initVisionMode() {
    // Проверяем сохраненные настройки
    if(localStorage.getItem('visionMode') === 'enabled') {
        $('body').addClass('vision-mode');
    }
    
    // Обработчик клика на кнопку
    $('.vision-btn').click(function(e) {
        e.preventDefault();
        toggleVisionMode();
    });
    
    // Обновляем текст кнопки при загрузке
    updateVisionButtonText();
}

function toggleVisionMode() {
    $('body').toggleClass('vision-mode');
    
    // Сохраняем состояние в localStorage
    if($('body').hasClass('vision-mode')) {
        localStorage.setItem('visionMode', 'enabled');
    } else {
        localStorage.removeItem('visionMode');
    }
    
    // Обновляем текст кнопки
    updateVisionButtonText();
}

function updateVisionButtonText() {
    const isActive = $('body').hasClass('vision-mode');
    const text = isActive ? 'Обычная версия' : 'Версия для слабовидящих';
    $('.vision-text').html(text.replace(' ', '<br>'));
}

// Функции для бургер-меню
function toggleBurgerMenu() {
    const $burgerContainer = $('.burger-container');
    const $navLinks = $('.nav-links');
    const $burger = $('.burger');
    const $body = $('body');
    
    // Переключаем классы для анимации
    $burgerContainer.toggleClass('active');
    $navLinks.toggleClass('active');
    $body.toggleClass('no-scroll');
    
    // Анимация иконки бургера
    $burger.toggleClass('toggle');
    
    // Для версии для слабовидящих - дополнительные стили
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
    
    // Анимация закрытия
    $burgerContainer.removeClass('active');
    $navLinks.removeClass('active');
    $('body').removeClass('no-scroll');
    
    // Возвращаем бургер в исходное состояние
    $burger.removeClass('toggle');
}

function handleResponsiveMenu() {
    const windowWidth = $(window).width();
    
    if (windowWidth > 1100) {
        closeBurgerMenu();
    }
}