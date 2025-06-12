// initial.js - Скрипт для загрузки контента курсов в programmsite.html

$(document).ready(function() {
    // Сопоставление названий курсов с файлами
    const courseFiles = {
        'Блокчейн разработчик': 'blockchain.html',
        'Веб-дизайн (верстальщик)': 'web-design.html',
        '3D моделлер': '3d-model.html',
        'UX/UI дизайнер': 'design.html',
        'Графический дизайнер': 'graf-design.html',
        'Интернет-маркетолог': 'marketolog.html'
    };

    // Функция для загрузки содержимого курса
    function loadCourseDetailsByTitle(courseTitle) {
        const fileName = courseFiles[courseTitle];
        if (!fileName) return;

        $.get(fileName)
            .done(function(data) {
                const $content = $(data);
                
                // Обновляем заголовок
                const $mainInfoModule = $content.filter('.main_info_module').first();
                $('section.main_info_module').replaceWith($mainInfoModule);
                
                // Обновляем основное содержимое
                const $mainContent = $content.filter('main').first();
                $('main').replaceWith($mainContent);
                
                // Инициализируем модули (если есть)
                if ($('.module_card').length) {
                    initModules();
                }
            })
            .fail(function(jqXHR, textStatus, errorThrown) {
                console.error('Ошибка загрузки файла курса:', textStatus, errorThrown);
            });
    }

    // Функция для инициализации работы модулей (раскрытие/скрытие)
    function initModules() {
        $('.module-more_btn').on('click', function() {
            const $module = $(this).closest('.module_card');
            $module.toggleClass('expanded');
            
            // Анимация стрелки
            $(this).find('.arrow-icon').toggleClass('rotated');
            
            // Плавное раскрытие списка тем
            $module.find('.module-topics').slideToggle(300);
        });
    }

    // Обработчик для кнопок "Подробнее" на карточках
    $(document).on('click', '.more_details a', function(e) {
        e.preventDefault();
        const courseTitle = $(this).closest('.card').find('h3').text().trim();
        
        if (window.location.pathname.includes('programmsite.html')) {
            loadCourseDetailsByTitle(courseTitle);
        } else {
            window.location.href = `programmsite.html?title=${encodeURIComponent(courseTitle)}`;
        }
    });

    // Если мы на странице programmsite.html, загружаем соответствующий курс
    if (window.location.pathname.includes('programmsite.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const courseTitle = urlParams.get('title');
        
        if (courseTitle) {
            loadCourseDetailsByTitle(courseTitle);
        } else {
            // Загружаем первый курс по умолчанию, если не указан параметр
            loadCourseDetailsByTitle('Блокчейн разработчик');
        }
    }
});
