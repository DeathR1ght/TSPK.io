$(document).ready(function() {
    const urlParams = new URLSearchParams(window.location.search);
    const courseTitle = urlParams.get('title');
    
    if (courseTitle) {
        if (window.location.pathname.includes('pedagogysite.html')) {
            loadPedagogyCourseDetailsByTitle(courseTitle);
        } else if (window.location.pathname.includes('sportsite.html')) {
            loadSportCourseDetailsByTitle(courseTitle);
        } else {
            loadCourseDetailsByTitle(courseTitle);
        }
    }
    
    if ($('.module_card').length) {
        initModules();
    }
    
    // Добавляем инициализацию для спортивных модулей
    if ($('.module_cardSP').length) {
        initSportModules();
    }
    
    if ($('.module_ped_card').length) {
        initPedagogyModulesScrolling();
    }
});

// Добавляем новую функцию для инициализации спортивных модулей
function initSportModules() {
    $('.module_cardSP').each(function() {
        const $card = $(this);
        const $themes = $card.find('.main_theme');
        const $work = $card.find('.block_work');
        
        // Скрываем темы и работы по умолчанию
        $themes.hide();
        $work.hide();
        
        // Добавляем обработчик клика на заголовок модуля
        $card.find('h2').on('click', function() {
            $themes.slideToggle(300);
            $work.slideToggle(300);
        });
    });
}

function loadCourseDetailsByTitle(courseTitle) {
    const courseFiles = {
        'Блокчейн разработчик': 'blockchain.html',
        'Веб-дизайн (верстальщик)': 'web-design.html',
        '3D моделлер': '3d-model.html',
        'UX/UI дизайнер': 'design.html',
        'Графический дизайнер': 'graf-design.html',
        'Интернет-маркетолог': 'marketolog.html'
    };

    const fileName = courseFiles[courseTitle];
    if (!fileName) return;

    $.get(`ITmore/${fileName}`)
        .done(function(data) {
            const $content = $(data);
            const $mainInfoModule = $content.filter('section.main_info_module');
            const $mainContent = $content.filter('main');

            $('section.main_info_module').replaceWith($mainInfoModule);
            $('main').replaceWith($mainContent);

            if ($('.module_card').length) {
                initModules();
            }
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            console.error('Ошибка загрузки файла курса:', textStatus, errorThrown);
        });
}

function loadSportCourseDetailsByTitle(courseTitle) {
    // Нормализуем название курса: удаляем переносы строк, лишние пробелы, приводим к нижнему регистру
    const normalizedTitle = courseTitle
        .replace(/\s+/g, ' ') // Заменяем множественные пробелы на один
        .replace(/\n/g, '')   // Удаляем переносы строк
        .trim()               // Удаляем пробелы в начале и конце
        .toLowerCase();       // Приводим к нижнему регистру
    
    const sportCourseFiles = {
        'фитнес-тренер универсал': 'trener.html',
        'инструктор по реабилитации': 'instructor.html',
        'предпринимательство в сфере спортивно-оздоровительных клубов': 'enterprise.html',
        'менеджмент в сфере физической культуры и спорта': 'management.html'
    };

    // Ищем совпадение в нормализованных названиях
    const fileName = Object.entries(sportCourseFiles).find(([key]) => 
        normalizedTitle.includes(key.toLowerCase())
    )?.[1];

    if (!fileName) {
        console.error('Файл курса не найден для:', courseTitle);
        return;
    }

    $.get(`SPmore/${fileName}`)
        .done(function(data) {
            const $content = $(data);
            const $mainInfoModule = $content.filter('section.main_info_module');
            const $mainContent = $content.filter('main');

            $('section.main_info_module').replaceWith($mainInfoModule);
            $('main').replaceWith($mainContent);

            $('.register_window').removeClass('blue-bg orange-bg').addClass('green-bg');
            
            console.log('Контент курса успешно загружен:', fileName);
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            console.error('Ошибка загрузки файла курса:', textStatus, errorThrown);
            // Можно добавить fallback-контент здесь
        });
}

function loadPedagogyCourseDetailsByTitle(courseTitle) {
    const pedagogyCourseFiles = {
        'Педагог-репетитор': 'tutor.html',
        'Педагог дополнительного образования': 'dop_pedagog.html',
        'Логопед': 'therapist.html'
    };

    const fileName = pedagogyCourseFiles[courseTitle];
    if (!fileName) return;

    $.get(`PDmore/${fileName}`)
        .done(function(data) {
            const $content = $(data);
            const $mainInfoModule = $content.filter('section.main_info_module');
            const $mainContent = $content.filter('main');

            $('section.main_info_module').replaceWith($mainInfoModule);
            $('main').replaceWith($mainContent);

            // Устанавливаем оранжевый цвет для окна регистрации
            $('.register_window').removeClass('blue-bg green-bg').addClass('orange-bg');

            if ($('.module_ped_card').length) {
                initModulesScrolling();
            }
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            console.error('Ошибка загрузки файла педагогического курса:', textStatus, errorThrown);
        });
}

function initModules() {
    $(document).on('click', '.module-more_btn', function() {
        const $btn = $(this);
        const $topics = $btn.closest('.module_card').find('.module-topics');
        const $arrow = $btn.find('.arrow-icon');
        
        $topics.slideToggle(300);
        $arrow.toggleClass('rotated');
        
        if ($arrow.hasClass('rotated')) {
            $arrow.css('transform', 'rotate(180deg)');
        } else {
            $arrow.css('transform', 'rotate(0deg)');
        }
    });
}

function initPedagogyModulesScrolling() {
    const $modulesContainer = $('.modules-container');
    const $cards = $('.module_ped_card');
    const $dots = $('.switch_module span');
    const cardWidth = $cards.outerWidth(true);
    const gap = 70;
    const visibleCards = 3;
    const totalCards = $cards.length;
    let currentPosition = 0;
    let maxPosition = totalCards - visibleCards;

    $modulesContainer.css('width', `${(cardWidth + gap) * totalCards}px`);

    function updateDots() {
        $dots.removeClass('active');
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

    function scrollToPosition(pos) {
        currentPosition = Math.max(0, Math.min(pos, maxPosition));
        const scrollAmount = currentPosition * (cardWidth + gap);
        $modulesContainer.css('transform', `translateX(-${scrollAmount}px)`);
        updateDots();
    }

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

    $dots.on('click', function() {
        const index = $dots.index(this);
        scrollToPosition(index);
    });

    updateDots();
    
    $(window).on('resize', function() {
        const newCardWidth = $cards.outerWidth(true);
        $modulesContainer.css('width', `${(newCardWidth + gap) * totalCards}px`);
        scrollToPosition(currentPosition);
    });
}

window.loadPedagogyCourseDetailsByTitle = loadPedagogyCourseDetailsByTitle;
window.loadSportCourseDetailsByTitle = loadSportCourseDetailsByTitle;
window.initPedagogyModulesScrolling = initPedagogyModulesScrolling;