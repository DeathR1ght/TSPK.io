// initial.js
function loadCourseDetailsByTitle(courseTitle) {
    const courseMap = {
        'Блокчейн разработчик': 'blockchain.html',
        'Разработчик мобильных приложений': 'mobile.html',
        'Веб-дизайн (верстальщик)': 'web-design.html',
        '3D моделлер': '3d-model.html',
        'UX/UI дизайнер': 'design.html',
        'Графический дизайнер': 'graf-design.html',
        'Интернет-маркетолог': 'marketolog.html'
    };

    const fileName = courseMap[courseTitle] || 'programmsite.html';
    
    // Показываем индикатор загрузки
    $('main').html('<div class="loading-indicator">Загрузка данных...</div>');
    
    // Загружаем соответствующий файл
    $.get(`./ITmore/${fileName}`)
        .done(function(data) {
            // Создаем временный элемент для парсинга HTML
            const $temp = $('<div>').html(data);
            
            // Находим нужные элементы в загруженных данных
            const $mainInfoModule = $temp.find('section.main_info_module').first();
            const $mainContent = $temp.find('main').html();
            
            // Заменяем содержимое на текущей странице
            if ($mainInfoModule.length) {
                $('section.main_info_module').replaceWith($mainInfoModule);
            }
            
            if ($mainContent) {
                $('main').html($mainContent);
            } else {
                // Если main контента нет, используем весь документ кроме header и footer
                $('main').html($temp.find('body').children().not('header, footer, script').html());
            }
            
            // Инициализируем необходимые компоненты
            if (typeof initPage === 'function') {
                initPage();
            }
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            console.error('Ошибка загрузки данных курса:', textStatus, errorThrown);
            $('main').html('<div class="error-message">Ошибка загрузки данных курса. Пожалуйста, попробуйте позже.</div>');
        });
}

// Инициализация при загрузке страницы
$(document).ready(function() {
    // Обработка кликов на кнопках "Подробнее"
    $(document).on('click', '.more_details a', function(e) {
        e.preventDefault();
        const courseTitle = $(this).closest('.card').find('h3').text().trim();
        loadCourseDetailsByTitle(courseTitle);
        
        // Прокрутка к верху страницы после загрузки
        $('html, body').animate({scrollTop: 0}, 'slow');
    });

    // Загрузка данных при открытии страницы с параметром title
    const urlParams = new URLSearchParams(window.location.search);
    const courseTitle = urlParams.get('title');
    
    if (courseTitle) {
        loadCourseDetailsByTitle(courseTitle);
    }
});