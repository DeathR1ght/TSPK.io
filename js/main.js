$(document).ready(function() {
    initPage();
    setupEventHandlers();
    handleInitialHash();
});

function initPage() {
    // Инициализация для страницы programmsite.html
    if (window.location.pathname.includes('programmsite.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const courseTitle = urlParams.get('title');
        
        if (courseTitle) {
            loadCourseDetailsByTitle(courseTitle);
        }
        
        // Инициализация модулей, если они есть
        if ($('.module_card').length) {
            initModules();
        }
    } 
    // Инициализация для других страниц
    else {
        loadInitialCards();
    }
    
    // Общие инициализации
    initSmoothScroll();
    initFormHandler();
}

function setupEventHandlers() {
    $(document).on('click', '.all_dops .dop_programm', function() {
        handleProgramButtonClick($(this));
    });
    
    $(window).on('resize', movePriceOnMobile);
    
    $(document).on('click', '.card', function() {
        if ($(window).width() <= 1024 && !window.location.pathname.includes('programmsite.html') && 
            !window.location.pathname.includes('pedagogysite.html')) {
            handleMobileCardClick($(this));
        }
    });
    
    $(document).on('click', '.load-more-btn', function() {
        handleLoadMoreClick($(this));
    });
    
    $(document).on('click', '.more_details a', function(e) {
        e.preventDefault();
        const courseTitle = $(this).closest('.card').find('h3').text().trim();
        const isPedagogyCourse = $(this).closest('.card').attr('id') === 'pedagogy' || 
                                $(this).closest('.card').attr('id') === 'correction';

        if (isPedagogyCourse) {
            window.location.href = `pedagogysite.html?title=${encodeURIComponent(courseTitle)}`;
        } else {
            window.location.href = `programmsite.html?title=${encodeURIComponent(courseTitle)}`;
        }

        $('html, body').animate({scrollTop: 0}, 'slow');
    });
}

// Остальные функции остаются без изменений
function handleInitialHash() {
    if (window.location.hash) {
        const target = window.location.hash;
        scrollToTarget(target);
    }
    
    const pendingScroll = localStorage.getItem('pendingScroll');
    if (pendingScroll) {
        localStorage.removeItem('pendingScroll');
        scrollToTarget(pendingScroll);
    }
}

function initSmoothScroll() {
    $(document).on('click', 'a[href^="#"], a[href*="#"]', function(e) {
        e.preventDefault();
        
        const href = $(this).attr('href');
        
        if (href.includes('.html#')) {
            const [path, hash] = href.split('#');
            window.location.href = path;
            localStorage.setItem('pendingScroll', '#' + hash);
        } 
        else if (href.startsWith('#')) {
            scrollToTarget(href);
        }
    });
}

function scrollToTarget(target) {
    if ($(target).length) {
        $('html, body').animate({
            scrollTop: $(target).offset().top - 100
        }, 800);
    }
}

function initFormHandler() {
    $(document).on('submit', '#contactForm', function(e) {
        e.preventDefault();
        handleFormSubmit($(this));
    });
}

function handleFormSubmit($form) {
    const submitBtn = $form.find('input[type="submit"]');
    submitBtn.addClass('loading');
    submitBtn.prop('disabled', true);
    
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
    $('section.second').css({
        'opacity': '0',
        'transition': 'opacity 0.3s ease'
    });
    
    setTimeout(() => {
        $.get(sectionFile)
            .done(function(data) {
                const $newSection = $(data);
                const bgColor = $newSection.data('bg-color');
                
                $('.register_window, section.first').css('transition', 'background-color 0.5s ease')
                    .removeClass('blue-bg green-bg orange-bg')
                    .addClass(bgColor + '-bg');
                
                $('section.first h1').text(buttonText);
                
                $newSection.css('opacity', '0');
                $('section.second').replaceWith($newSection);
                
                setTimeout(() => {
                    $newSection.css({
                        'opacity': '1',
                        'transition': 'opacity 0.5s ease'
                    });
                }, 50);
                
                movePriceOnMobile();
            })
            .fail(function(jqXHR, textStatus, errorThrown) {
                console.error('Ошибка загрузки файла:', textStatus, errorThrown);
                $('section.second').css('opacity', '1');
            });
    }, 300);
}

function loadAllPrograms() {
    $('section.second').css({
        'opacity': '0',
        'transition': 'opacity 0.3s ease'
    });
    
    setTimeout(() => {
        const allCards = [];
        const requests = [
            $.get('card/programming.html'),
            $.get('card/sport.html'),
            $.get('card/pedagogy.html')
        ];
        
        $.when(...requests)
            .done(function(progData, sportData, pedData) {
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
            })
            .fail(function(jqXHR, textStatus, errorThrown) {
                console.error('Ошибка загрузки файлов:', textStatus, errorThrown);
                $('section.second').css('opacity', '1');
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

$(document).ready(function() {
    // Инициализация скроллинга модулей
    initModulesScrolling();
});

function initModulesScrolling() {
    const $modulesContainer = $('.modules-container');
    const $cards = $('.module_ped_card');
    const $dots = $('.switch_module span');
    const cardWidth = $cards.outerWidth(true);
    const gap = 70; // Расстояние между карточками
    const visibleCards = 3; // Показываем 3 карточки
    const totalCards = $cards.length;
    let currentPosition = 0;
    
    // Рассчитываем максимальную позицию для прокрутки
    let maxPosition = totalCards - visibleCards;

    // Устанавливаем ширину контейнера для правильного выравнивания
    $modulesContainer.css('width', `${(cardWidth + gap) * totalCards}px`);

    // Обновляем точки навигации
    function updateDots() {
        $dots.removeClass('active');
        // Создаем точки только для видимых позиций
        $dots.each(function(index) {
            if (index <= maxPosition) {
                $(this).show();
                if (index === currentPosition) {
                    $(this).addClass('active');
                }
            } else {
                $(this).hide();
            }
        });
    }

    // Прокрутка к позиции
    function scrollToPosition(pos) {
        currentPosition = Math.max(0, Math.min(pos, maxPosition));
        const scrollAmount = currentPosition * (cardWidth + gap);
        $modulesContainer.css('transform', `translateX(-${scrollAmount}px)`);
        updateDots();
    }

    // Обработчики кнопок
    $('.switch_module .left').on('click', function() {
        if (currentPosition > 0) {
            scrollToPosition(currentPosition - 1);
        }
    });

    $('.switch_module .right').on('click', function() {
        if (currentPosition < maxPosition) {
            scrollToPosition(currentPosition + 1);
        }
    });

    // Обработчики точек
    $dots.on('click', function() {
        const index = $dots.index(this);
        scrollToPosition(index);
    });

    // Инициализация
    updateDots();
    
    // Адаптация при изменении размера окна
    $(window).on('resize', function() {
        const newCardWidth = $cards.outerWidth(true);
        $modulesContainer.css('width', `${(newCardWidth + gap) * totalCards}px`);
        scrollToPosition(currentPosition);
    });
}


