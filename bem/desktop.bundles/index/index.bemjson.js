module.exports = {
    block: 'page',
    title: 'index',
    head: [
        { elem: 'css', url: 'index/index.min.css' }
    ],
    scripts: [{ elem: 'js', url: 'index/index.min.js' }],
    content: [
        {
            block: 'header',
            js: true,
            content: [
                {
                    block: 'link',
                    url: '/',
                    content: {
                        block: 'header',
                        elem: 'logo',
                        content: 'Mammonbank'
                    }
                }
            ]
        },
        {
            block: 'main-left',
            content: [
                {
                    block: 'menu',
                    mods: { theme: 'islands', size: 'm' },
                    content: [
                        {
                            elem: 'group',
                            title: 'Навигация',
                            content: [
                                {
                                    block: 'menu-item',
                                    content: {
                                        block: 'link',
                                        mods: { theme: 'islands', size: 'm' },
                                        url: '/signup',
                                        content: 'Регистрация'
                                    }
                                },
                                {
                                    block: 'menu-item',
                                    content: {
                                        block: 'link',
                                        mods: { theme: 'islands', size: 'm' },
                                        url: '/dashboard',
                                        content: 'Панель управления'
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            block: 'main-right',
            content: 'right block'
        }
    ]
};
