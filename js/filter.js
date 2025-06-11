function initFilters() {
    function shuffleCards($container) {
        const $cards = $container.find('.card');
        const cardsArray = $cards.get();
        
        for (let i = cardsArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cardsArray[i], cardsArray[j]] = [cardsArray[j], cardsArray[i]];
        }
        
        $container.empty().append(cardsArray);
    }

    function filterCards(section, category) {
        const $section = $(section);
        const $cards = $section.find('.card');
        
        if (category === 'all' && $section.find('.additional_btn').length === 0) {
            shuffleCards($section.find('.table_card'));
        }
        
        $cards.hide();
        
        if (category === 'all') {
            $cards.fadeIn(300);
        } else {
            $section.find(`.card[id="${category}"]`).fadeIn(300);
        }
    }

    $(document).off('click', '.dop_btn').on('click', '.dop_btn', function() {
        const $btn = $(this);
        const $section = $btn.closest('.second');
        
        $section.find('.dop_btn').removeClass('active_blue');
        $btn.addClass('active_blue');
        
        let category = 'all';
        const btnText = $btn.text().trim();
        const bgColor = $section.data('bg-color');
        
        switch(bgColor) {
            case 'blue':
                switch(btnText) {
                    case 'Программная разработка': category = 'working'; break;
                    case 'Веб-технологии и Дизайн': category = 'web-tehnologies'; break;
                    case 'Графический и 3D Дизайн': category = 'graphic-design'; break;
                    case 'Цифровой маркетинг': category = 'market-analyst'; break;
                }
                break;
            case 'green':
                switch(btnText) {
                    case 'Тренерская деятельность': category = 'trainer'; break;
                    case 'Менджмент и Предпринимательство': category = 'management'; break;
                }
                break;
            case 'orange':
                switch(btnText) {
                    case 'Педагогическая деятельность': category = 'pedagogy'; break;
                    case 'Коррекционная педагогика': category = 'correction'; break;
                }
                break;
        }
        
        filterCards($section, category);
    });
}

$(document).ready(function() {
    initFilters();
    
    // Показываем все карточки в текущей секции
    const $currentSection = $('.second');
    if ($currentSection.length) {
        filterCards($currentSection[0], 'all');
    }
});