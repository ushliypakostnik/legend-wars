'use strict';


var DesignLayout = (function($, Logger, ScreenHelper, BootstrapModal) {
    var module = {};

    var settings = {
        moduleName: 'DesignLayout',
        debug: true
    };

    var ui = {
        page: '.page',

        // modals registration
        startModal: '#start-modal',
        joinModalTrigger: '.join-modal-trigger',
        loginModalTrigger: '.login-modal-trigger',
        fullWidthElements: '',
        positionedElements: '',

        // top menu tooltip
        topMenuTooltip: '.top-menu-tooltip',

        // checkbox in start modal
        checkbox: '.checkbox'
    };

    var logger;

    var modalClick = 0;

    // Основной пересчёт/перерисовка
    function redraw() {
        logger.log('redraw');

        if (document.documentElement.clientWidth >= ScreenHelper.screenLG - ScreenHelper.getScrollbarWidth()) {
            if (!ui.page.hasClass('soon')) {

                var heightAll = document.documentElement.clientHeight - (ui.page.find('.heroes').height() * 2 / 3);

                var heightInner = 0;
                ui.page.find('.inner-item').each(function() {
                    heightInner = heightInner + $(this).innerHeight();
                });

                ui.page.find('main .spacing-item').css('margin-top', (heightAll - heightInner) / 5);
                ui.page.find('main .logo.spacing-item').css('margin-top', (heightAll - heightInner) / 2.5);
            } else {
                ui.page.find('main .spacing-item').css('margin-top', (document.documentElement.clientHeight - ui.page.find('main .spacing-item').innerHeight()) / 2);
            }
        }
    }

    function init() {
        $(document).ready(function() {
            logger.log('event: DOM ready');

            // prepare jquery ui objects
            for (var pr in ui) {
                ui[pr] = $(ui[pr]);
            }

            // Фиксация клика для сенсорных устройств
            $(document).on('touchend', function(evt){
                evt.preventDefault();

                var $trigger = $(evt.target);

                evt.target.click();

                if ($trigger.hasClass('form-control')) {
                    $trigger.focus();
                }
            });

            ui.topMenuTooltip.tooltip();

            // init module
            BootstrapModal.init({
                debug: debug
            });

            // modals registration

            // modal template
            BootstrapModal.register($(ui.startModal), $(ui.joinModalTrigger),
                                    $(ui.fullWidthElements), $(ui.positionedElements));

            BootstrapModal.register($(ui.startModal), $(ui.loginModalTrigger),
                        $(ui.fullWidthElements), $(ui.positionedElements));

            ui.joinModalTrigger.on('click', function(evt){
                evt.preventDefault();
                modalClick = 1;
            });

            ui.loginModalTrigger.on('click', function(evt){
                evt.preventDefault();
                modalClick = 2;
            });

            // Показ модали - отступ и фокус на правильном поле
            ui.startModal.on('shown.bs.modal', function (evt) {

                $(this).find('.modal-dialog').css('margin-top', Math.round((document.documentElement.clientHeight - $(this).find('.modal-dialog').height()) * 1/3));

                window.setTimeout(function() {
                    if (modalClick == 1) {
                        $('#regFocusControl').focus();
                    }
                    if (modalClick == 2) {
                        $('#logFocusControl').focus();
                    }
                    modalClick = 0;
                }, 0);
            });

            // Подсветка формы на которой фокус
            ui.startModal.find('.form-control').on('focus', function(){
                if (!$(this).closest('.row > div').hasClass('infocus')) {
                    $(this).closest('.row > div').siblings('.row > div').removeClass('infocus');
                    $(this).closest('.row > div').addClass('infocus');
                }
            });

            // Чекбокс в стартовой модали
            ui.checkbox.on('click', function(evt){
                evt.preventDefault();
                if (!$(this).hasClass('checked')) {
                    $(this).addClass('checked');
                    $(this).find('input').attr('checked', 'checked').prop('checked', true);
                } else {
                    $(this).removeClass('checked');
                    $(this).find('input').removeAttr('checked').prop('checked', false);
                }
            });


            redraw();
        });

        $(window).load(function() {
            logger.log('event: window load');

            redraw();

            window.setTimeout(function() {
                redraw();
            }, 0);
        });

        $(window).scroll(function() {
            logger.log('event: window scroll');

            // теоретически событие может наступить до того, как будет готова DOM модель,
            // поэтому, чтобы избежать ошибок, используем здесь $(ui.el) вместо ui.el
        });

        $(window).resize(function() {
            logger.log('event: window resize');

            redraw();
        });
    }

    module.init = function(_settings) {
        _settings = _settings || {};

        for (var pr in _settings) {
            settings[pr] = _settings[pr];
        }

        logger = new Logger(settings);

        init();

        logger.log('init');
    };

    return module;
}(jQuery, Logger, ScreenHelper, BootstrapModal));
