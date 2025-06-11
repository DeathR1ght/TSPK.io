$(document).ready(function() {
    // Инициализация модулей
    function initModules() {
        $('.module_card').each(function() {
            const $card = $(this);
            const $button = $card.find('.module-more_btn');
            const $topics = $card.find('.module-topics');
            
            // Проверяем, есть ли темы для показа
            if ($topics.children().length === 0) {
                $button.hide();
            }
            
            // Устанавливаем начальное состояние
            $button.attr('aria-expanded', 'false');
        });
    }
    
    // Обработчик клика по кнопке
    $(document).on('click', '.module-more_btn', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const $button = $(this);
        const $card = $button.closest('.module_card');
        const $topics = $card.find('.module-topics');
        
        // Переключаем состояние
        $card.toggleClass('expanded');
        const isExpanded = $card.hasClass('expanded');
        $button.attr('aria-expanded', isExpanded);
        
        // Плавная анимация
        if (isExpanded) {
            $topics.css('max-height', $topics.prop('scrollHeight') + 'px');
        } else {
            $topics.css('max-height', '0');
        }
    });
    
    // Обработчик клика по заголовку модуля
    $(document).on('click', '.module-text', function(e) {
        if (!$(e.target).is('.module-more_btn') && !$(e.target).closest('.module-more_btn').length) {
            $(this).find('.module-more_btn').trigger('click');
        }
    });
    
    // Инициализация при загрузке
    initModules();
    
    // Обработчик ресайза окна (для корректировки высоты)
    $(window).on('resize', function() {
        $('.module_card.expanded').each(function() {
            const $card = $(this);
            const $topics = $card.find('.module-topics');
            $topics.css('max-height', $topics.prop('scrollHeight') + 'px');
        });
    });
});