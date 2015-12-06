module.exports = {
    block: 'page',
    title: 'index',
    head: [
        { elem: 'css', url: 'index.min.css' }
    ],
    scripts: [{ elem: 'js', url: 'index.min.js' }],
    content: [
        {
            block: 'header',
            js: true,
            content: [
                {
                    block: 'link',
                    url: '../index/index.html',
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
                                        url: '../signup/signup.html',
                                        content: 'Регистрация'
                                    }
                                },
                                {
                                    block: 'menu-item',
                                    content: {
                                        block: 'link',
                                        mods: { theme: 'islands', size: 'm' },
                                        url: '../dashboard/dashboard.html',
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
