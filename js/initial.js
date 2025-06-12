// initial.js
function loadCourseDetailsByTitle(courseTitle) {
    // Определяем соответствие между названиями курсов и файлами
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

    // Загружаем соответствующий файл
    $.get(`ITmore/${fileName}`)
        .done(function(data) {
            // Парсим HTML и извлекаем нужные секции
            const $content = $(data);
            const $mainInfoModule = $content.filter('section.main_info_module');
            const $mainContent = $content.filter('main');

            // Очищаем и обновляем содержимое на странице
            $('section.main_info_module').replaceWith($mainInfoModule);
            $('main').replaceWith($mainContent);

            // Инициализируем модули, если они есть
            if ($('.module_card').length) {
                initModules();
            }
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            console.error('Ошибка загрузки файла курса:', textStatus, errorThrown);
        });
}

function initModules() {
    // Обработчик для кнопок раскрытия/скрытия тем модуля
    $(document).on('click', '.module-more_btn', function() {
        const $btn = $(this);
        const $topics = $btn.closest('.module_card').find('.module-topics');
        const $arrow = $btn.find('.arrow-icon');
        
        $topics.slideToggle(300);
        $arrow.toggleClass('rotated');
        
        // Анимация поворота стрелки
        if ($arrow.hasClass('rotated')) {
            $arrow.css('transform', 'rotate(180deg)');
        } else {
            $arrow.css('transform', 'rotate(0deg)');
        }
    });
}

// Инициализация при загрузке страницы
$(document).ready(function() {
    // Если есть параметр title в URL, загружаем соответствующий курс
    const urlParams = new URLSearchParams(window.location.search);
    const courseTitle = urlParams.get('title');
    
    if (courseTitle) {
        loadCourseDetailsByTitle(courseTitle);
    }
    
    // Инициализация модулей, если они есть
    if ($('.module_card').length) {
        initModules();
    }
});

// initial.js
function loadPedagogyCourseDetailsByTitle(courseTitle) {
    // Определяем соответствие между названиями педагогических курсов и файлами
    const pedagogyCourseFiles = {
        'Логопед': 'therapist.html',
        'Педагог': 'pedagog.html',
        'Тьютор': 'tutor.html'
    };

    const fileName = pedagogyCourseFiles[courseTitle];
    if (!fileName) return;

    // Загружаем соответствующий файл
    $.get(`PDmore/${fileName}`)
        .done(function(data) {
            // Парсим HTML и извлекаем нужные секции
            const $content = $(data);
            const $mainInfoModule = $content.filter('section.main_info_module');
            const $mainContent = $content.filter('main');

            // Очищаем и обновляем содержимое на странице
            $('section.main_info_module').replaceWith($mainInfoModule);
            $('main').replaceWith($mainContent);

            // Инициализируем модули, если они есть
            if ($('.module_card').length) {
                initModules();
            }
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            console.error('Ошибка загрузки файла педагогического курса:', textStatus, errorThrown);
        });
}