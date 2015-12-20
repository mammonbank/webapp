module.exports = {
    block: 'page',
    title: 'dashboard',
    head: [
        { elem: 'css', url: 'dashboard.min.css' }
    ],
    scripts: [{ elem: 'js', url: 'dashboard.min.js' }, { elem: 'js', url: 'dashboard.bemhtml.js' }],
    content: [
        {
            block: 'header',
            js: true,
            content: [
                {
                    block: 'link',
                    url: '/',
                    mix: { block: 'header', elem: 'logo' },
                    content: 'Mammonbank'
                }
            ]
        },
        {
            block: 'spin',
            mods: { theme: 'islands', size: 'xl', visible: true, pos: 'center' }
        },
        {
            block: 'auth-form',
            js: true,
            mods: { hide: true },
            content: [
                {
                    block: 'modal',
                    mods: { theme: 'islands', autoclosable: true }
                },
                {
                    block: 'group',
                    content: [
                        {
                            block: 'label',
                            content: 'Личный (идентификационный) номер:'
                        },
                        {
                            block: 'input',
                            mods: { theme: 'islands', size: 'm', id: 'idNumber' }
                        }
                    ]
                },
                {
                    block: 'group',
                    content: [
                        {
                            block: 'label',
                            content: 'Пароль:'
                        },
                        {
                            block: 'input',
                            mods: { theme: 'islands', size: 'm', type: 'password', id: 'password' }
                        }
                    ]
                },
                {
                    block: 'group',
                    mods: { align: 'right' },
                    content: [
                        {
                            block: 'button',
                            mods: { theme: 'islands', size: 'm', type: 'submit', view: 'action' },
                            text: 'Вход'
                        }
                    ]
                }
            ]
        },
        {
            block: 'one-time-password',
            js: true,
            mods: { hide: true },
            content: [
                {
                    block: 'modal',
                    mods: { theme: 'islands', autoclosable: true }
                },
                {
                    block: 'group',
                    content: [
                        {
                            block: 'label',
                            content: '6-ти значный пароль'
                        },
                        {
                            block: 'input',
                            mods: { theme: 'islands', size: 'm' }
                        }
                    ]
                },
                {
                    block: 'group',
                    mods: { align: 'right' },
                    content: [
                        {
                            block: 'button',
                            mods: { theme: 'islands', size: 'm', type: 'submit', view: 'action' },
                            text: 'Вход'
                        }
                    ]
                }
            ]
        },
        {
            block: 'main-left',
            js: true,
            mods: { hide: true },
            content: [
                {
                    block: 'menu',
                    mods: { theme: 'islands', size: 'm' },
                    content: [
                        {
                            elem: 'group',
                            title: 'Общее',
                            content: [
                                {
                                    block: 'menu-item',
                                    mods: { active: 'yes' },
                                    mix: { block: 'main-left', elem: 'main' },
                                    content: 'Главная'
                                }
                            ]
                        },
                        {
                            elem: 'group',
                            title: 'Кредиты',
                            content: [
                                {
                                    block: 'menu-item',
                                    mix: { block: 'main-left', elem: 'credit_new' },
                                    content: 'Подать заявку'
                                },
                                {
                                    block: 'menu-item',
                                    mix: { block: 'main-left', elem: 'credit_all' },
                                    content: 'Заявки в обработке'
                                },
                                {
                                    block: 'menu-item',
                                    mix: { block: 'main-left', elem: 'credit_active' },
                                    content: 'Текущие кредиты'
                                },
                                {
                                    block: 'menu-item',
                                    mix: { block: 'main-left', elem: 'credit_archive' },
                                    content: 'Архив'
                                },
                                {
                                    block: 'menu-item',
                                    mix: { block: 'main-left', elem: 'credit_pay' },
                                    content: 'Платежи'
                                }
                            ]
                        },
                        {
                            elem: 'group',
                            title: 'Депозиты',
                            content: [
                                {
                                    block: 'menu-item',
                                    mix: { block: 'main-left', elem: 'deposit_new' },
                                    content: 'Подать заявку'
                                },
                                {
                                    block: 'menu-item',
                                    mix: { block: 'main-left', elem: 'deposit_all' },
                                    content: 'Заявки в обработке'
                                },
                                {
                                    block: 'menu-item',
                                    mix: { block: 'main-left', elem: 'deposit_active' },
                                    content: 'Текущие депозиты'
                                },
                                {
                                    block: 'menu-item',
                                    mix: { block: 'main-left', elem: 'deposit_archive' },
                                    content: 'Архив'
                                }
                            ]
                        },
                        {
                            elem: 'group',
                            title: 'Пользователь',
                            content: [
                                {
                                    block: 'menu-item',
                                    mix: { block: 'main-left', elem: 'settings' },
                                    content: 'Учетная запись'
                                },
                                {
                                    block: 'menu-item',
                                    mix: { block: 'main-left', elem: 'reset' },
                                    content: 'Сменить пароль'
                                },
                                {
                                    block: 'menu-item',
                                    mix: { block: 'main-left', elem: 'help' },
                                    content: 'Помощь'
                                },
                                {
                                    block: 'menu-item',
                                    mix: { block: 'main-left', elem: 'logout' },
                                    content: 'Выход'
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            block: 'main-right',
            mods: { hide: true },
            content: [
                {
                    block: 'info-bar',
                    js: true,
                    content: [
                        {
                            elem: 'name',
                            content: ''
                        },
                        {
                            elem: 'status',
                            content: ''
                        }
                    ]
                },
                {
                    block: 'content',
                    js: true,
                    content: []
                }
            ]
        }
    ]
};
