$(document).ready(function() {
    // Инициализация при загрузке страницы
    initPage();
    
    // Обработчики событий
    setupEventHandlers();
    
    // Проверяем хеш в URL при загрузке страницы
    handleInitialHash();
});

function initPage() {
    // Загружаем начальные карточки
    loadInitialCards();
    
    // Инициализируем плавный скролл
    initSmoothScroll();
    
    // Инициализируем обработку формы
    initFormHandler();
}

function setupEventHandlers() {
    // Обработчик клика на кнопки в секции first
    $(document).on('click', '.all_dops .dop_programm', function() {
        handleProgramButtonClick($(this));
    });
    
    // Обработчик ресайза окна
    $(window).on('resize', function() {
        movePriceOnMobile();
    });
    
    // Обработчик клика по карточкам на мобильных устройствах
    $(document).on('click', '.card', function() {
        if ($(window).width() <= 1024) {
            handleMobileCardClick($(this));
        }
    });
    
    // Обработчик кнопки "Ещё"
    $(document).on('click', '.load-more-btn', function() {
        handleLoadMoreClick($(this));
    });
}

function handleInitialHash() {
    // Если страница загружена с хешем в URL (например, index.html#second)
    if (window.location.hash) {
        const target = window.location.hash;
        scrollToTarget(target);
    }
}

function initSmoothScroll() {
    // Плавный скролл для всех внутренних ссылок
    $(document).on('click', 'a[href^="#"], a[href*="#"]', function(e) {
        e.preventDefault();
        
        const href = $(this).attr('href');
        
        // Если ссылка содержит путь к другой странице (например, index.html#second)
        if (href.includes('.html#')) {
            const [path, hash] = href.split('#');
            
            // Переходим на новую страницу
            window.location.href = path;
            
            // Сохраняем хеш для прокрутки после загрузки
            localStorage.setItem('pendingScroll', '#' + hash);
        } 
        // Обычная якорная ссылка на текущей странице
        else if (href.startsWith('#')) {
            scrollToTarget(href);
        }
    });
    
    // Проверяем, есть ли сохраненный хеш для прокрутки после перехода между страницами
    const pendingScroll = localStorage.getItem('pendingScroll');
    if (pendingScroll) {
        localStorage.removeItem('pendingScroll');
        scrollToTarget(pendingScroll);
    }
}

function scrollToTarget(target) {
    if ($(target).length) {
        $('html, body').animate({
            scrollTop: $(target).offset().top - 100
        }, 800);
    }
}

function initFormHandler() {
    $('#contactForm').on('submit', function(e) {
        e.preventDefault();
        handleFormSubmit($(this));
    });
}

function handleFormSubmit($form) {
    const submitBtn = $form.find('input[type="submit"]');
    submitBtn.addClass('loading');
    submitBtn.prop('disabled', true);
    
    // Симуляция отправки формы
    setTimeout(function() {
        submitBtn.removeClass('loading');
        submitBtn.val('Отправлено!');
        
        showSuccessMessage($form.closest('.register_window'));
    }, 1500);
}

function showSuccessMessage($container) {
    $container.append(`
        <div class="success-message">
            <h2>Спасибо!</h2>
            <p>Ваше сообщение успешно отправлено. Наш специалист свяжется с вами в ближайшее время.</p>
            <button onclick="location.reload()">Отправить ещё</button>
        </div>
    `);
}

function handleProgramButtonClick($button) {
    $('.all_dops .dop_programm').removeClass('active_black');
    $button.addClass('active_black');
    
    const sectionFile = $button.data('section');
    const buttonText = $button.text().trim();
    
    if (sectionFile === 'card/all_programs.html') {
        loadAllPrograms();
    } else {
        loadSingleSection(sectionFile, buttonText);
    }
}

function handleMobileCardClick($card) {
    const programTitle = $card.find('h3').text().trim();
    const programUrl = `programmsite.html?title=${encodeURIComponent(programTitle)}`;
    window.location.href = programUrl;
}

function handleLoadMoreClick($button) {
    const $btn = $button;
    const $tableCard = $btn.closest('.second').find('.table_card');
    const currentCount = $tableCard.find('.card').length;
    const allCards = $btn.data('all-cards') || [];
    const nextCards = allCards.slice(currentCount, currentCount + 6);
    
    $tableCard.append(nextCards.join(''));
    
    if (currentCount + 6 >= allCards.length) {
        $btn.parent('.load-more-container').hide();
    }
}

function movePriceOnMobile() {
    if ($(window).width() <= 1024) {
        $('.card').each(function() {
            const $card = $(this);
            const $price = $card.find('.main_card .price');
            
            if ($price.length && !$card.find('.mobile-price-container').length) {
                const $mobilePriceContainer = $('<div class="mobile-price-container"></div>');
                $price.clone()
                    .addClass('mobile-price')
                    .appendTo($mobilePriceContainer);
                $card.find('.head_card').after($mobilePriceContainer);
            }
        });
    } else {
        $('.mobile-price-container').remove();
    }
}

function loadInitialCards() {
    const defaultSection = 'card/programming.html';
    const defaultButtonText = 'Информационные технологии и программирование';
    
    $(`.all_dops .dop_programm[data-section="${defaultSection}"]`).addClass('active_black');
    loadSingleSection(defaultSection, defaultButtonText);
}

function loadSingleSection(sectionFile, buttonText) {
    // Анимация исчезновения текущей секции
    $('section.second').css({
        'opacity': '0',
        'transition': 'opacity 0.3s ease'
    });
    
    setTimeout(() => {
        $.get(sectionFile, function(data) {
            const $newSection = $(data);
            const bgColor = $newSection.data('bg-color');
            
            // Анимация изменения цвета фона
            $('.register_window, section.first').css('transition', 'background-color 0.5s ease')
                .removeClass('blue-bg green-bg orange-bg')
                .addClass(bgColor + '-bg');
            
            $('section.first h1').text(buttonText);
            
            // Вставляем новую секцию с прозрачностью
            $newSection.css('opacity', '0');
            $('section.second').replaceWith($newSection);
            
            // Анимация появления новой секции
            setTimeout(() => {
                $newSection.css({
                    'opacity': '1',
                    'transition': 'opacity 0.5s ease'
                });
            }, 50);
            
            movePriceOnMobile();
            $.getScript('./js/filter.js');
        }).fail(function() {
            console.error('Ошибка загрузки файла:', sectionFile);
            $('section.second').css('opacity', '1');
        });
    }, 300);
}

function loadAllPrograms() {
    // Анимация исчезновения текущей секции
    $('section.second').css({
        'opacity': '0',
        'transition': 'opacity 0.3s ease'
    });
    
    setTimeout(() => {
        const allCards = [];
        
        $.when(
            $.get('card/programming.html'),
            $.get('card/sport.html'),
            $.get('card/pedagogy.html')
        ).done(function(progData, sportData, pedData) {
            const $progCards = $(progData[0]).find('.card');
            const $sportCards = $(sportData[0]).find('.card');
            const $pedCards = $(pedData[0]).find('.card');
            
            $progCards.each(function() { allCards.push($(this).prop('outerHTML')); });
            $sportCards.each(function() { allCards.push($(this).prop('outerHTML')); });
            $pedCards.each(function() { allCards.push($(this).prop('outerHTML')); });
            
            shuffleArray(allCards);
            
            const $newSection = $('<section class="second" data-bg-color="blue" id="second"></section>');
            $newSection.append('<h2>Все программы</h2>');
            
            const $tableCard = $('<div class="table_card"></div>');
            const initialCards = allCards.slice(0, 6);
            $tableCard.append(initialCards.join(''));
            $newSection.append($tableCard);
                    
            if (allCards.length > 6) {
                const $loadMoreContainer = $('<div class="load-more-container"></div>');
                const $loadMoreBtn = $('<button class="load-more-btn"><img src="./image/more.svg" alt="more"><p>Ещё</p></button>');
                $loadMoreBtn.data('all-cards', allCards);
                $loadMoreContainer.append($loadMoreBtn);
                $newSection.append($loadMoreContainer);
            }
            
            $newSection.css('opacity', '0');
            $('section.second').replaceWith($newSection);
            
            $('.register_window, section.first').css('transition', 'background-color 0.5s ease')
                .removeClass('blue-bg green-bg orange-bg')
                .addClass('blue-bg');
            
            $('section.first h1').text('Все программы');
            
            setTimeout(() => {
                $newSection.css({
                    'opacity': '1',
                    'transition': 'opacity 0.5s ease'
                });
            }, 50);
            
            movePriceOnMobile();
            $.getScript('./js/filter.js');
        });
    }, 300);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}