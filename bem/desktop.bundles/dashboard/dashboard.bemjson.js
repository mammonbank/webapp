module.exports = {
    block: 'page',
    title: 'dashboard',
    head: [
        { elem: 'css', url: 'dashboard.min.css' }
    ],
    scripts: [{ elem: 'js', url: 'dashboard.min.js' }],
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
                    block: 'input',
                    mods: { theme: 'islands', size: 'm' },
                    mix: { block: 'auth-form', elem: 'id', js: true },
                    placeholder: 'Идентификационный номер'
                },
                {
                    block: 'input',
                    mods: { theme: 'islands', size: 'm', type: 'password' },
                    mix: { block: 'auth-form', elem: 'password' },
                    placeholder: 'Пароль'
                },
                {
                    block: 'button',
                    mods: { theme: 'islands', size: 'm', type: 'submit' },
                    text: 'Вход'
                }
            ]
        },
        {
            block: 'one-time-password',
            js: true,
            mods: { hide: true },
            content: [
                {
                    block: 'input',
                    mods: { theme: 'islands', size: 'm' },
                    placeholder: '6-ти значный пароль'
                },
                {
                    block: 'button',
                    mods: { theme: 'islands', size: 'm', type: 'submit' },
                    text: 'Вход'
                }
            ]
        },
        {
            block: 'info-bar',
            js: true,
            mods: { hide: true },
            content: [
                {
                    elem: 'name'
                }
            ]
        }
    ]
};
