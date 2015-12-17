module.exports = {
    block: 'page',
    title: 'signup',
    head: [
        { elem: 'css', url: 'signup.min.css' }
    ],
    scripts: [{ elem: 'js', url: 'signup.min.js' }],
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
            block: 'step0',
            js: true,
            content: [
                {
                    elem: 'title',
                    content: 'Шаг 1: Соглашение'
                },
                {
                    elem: 'agreement',
                    content: 'Ваш возраст на момент заполнения заявки составляет не менее 18 лет и до даты окончательного срока погашения кредита не превысит 65 лет;<br>' +
                    'Вы являетесь гражданином РБ либо иностранным гражданином, имеющим вид на жительство;<br>'+
                    'Вы официально трудоустроены на последнем месте работы не менее 3 (трех) месяцев и получаете доходы на территории РБ (в случае принятия предварительного положительного решения готовы подтвердить это документально). В качестве получаемого дохода, Банк не принимает в расчет доходы, получаемые от индивидуальной предпринимательской деятельности;<br>'+
                    'Сведения, содержащиеся в настоящей анкете, являются верными и точными на момент отправки анкеты;<br>'+
                    'Заявитель предоставляет Банку право проверки достоверности и полноты любой сообщаемой Заявителем информации, в соответствии с процедурами, принятыми в Банке, право на получение Банком самостоятельно иных необходимых Банку сведений о Заявителе в государственных и иных органах, по месту работы, проживания и из других источников;<br>'+
                    'Все сведения, содержащиеся в настоящей анкете, представлены исключительно для получения кредита, однако Банк оставляет за собой право использовать их как доказательство при судебном разбирательстве;<br>'+
                    'По данной заявке Банк принимает предварительное решение и не делает никаких заявлений и не дает никаких выраженных или подразумеваемых гарантий Заявителю по поводу приобретаемых услуг и имущества (предоставление кредита), а также окончательных условий кредитования. Принятие Банком данного заявления к рассмотрению, а также возможные расходы Заявителя на оформление необходимых для получения кредита, документов, проведение экспертиз и т.п. не является обязательством Банка предоставить кредит или возместить понесенные издержки;<br>'+
                    'Банк имеет право не объяснять Заявителю причины отказа в выдаче кредита;<br>'+
                    'Запрашиваемая сумма может быть изменена с учетом фактических данных согласно документам при подаче их в Банк.'
                },
                {
                    block: 'button',
                    mods: { theme: 'islands', size: 'm', type: 'submit' },
                    text: 'Отказываюсь'
                },
                {
                    block: 'button',
                    mods: { theme: 'islands', size: 'm', type: 'submit', view: 'action' },
                    text: 'Согласен(а)'
                }
            ]
        },
        {
            block: 'reg-form',
            mods: { hide: true },
            js: true,
            content: [
                {
                    block: 'step1',
                    content: [
                        {
                            elem: 'title',
                            content: 'Шаг 2: Введите данные'
                        },
                        {
                            elem: 'group',
                            mix: { block: 'line2' },
                            content: [
                                {
                                    block: 'label',
                                    for: 'lastName',
                                    content: 'Фамилия:'
                                },
                                {
                                    block: 'input',
                                    id: 'lastName',
                                    mods: { theme: 'islands', size: 'm', id: 'lastName' }
                                },
                                {
                                    block: 'popup',
                                    mods: { theme: 'islands', autoclosable: true, target: 'anchor' },
                                    directions: ['right-center']
                                }
                            ]
                        },
                        {
                            elem: 'group',
                            mix: { block: 'line2' },
                            content: [
                                {
                                    block: 'label',
                                    for: 'firstName',
                                    content: 'Имя:'
                                },
                                {
                                    block : 'input',
                                    mods : { theme : 'islands', size : 'm', id: 'firstName' }
                                },
                                {
                                    block: 'popup',
                                    mods: { theme: 'islands', autoclosable: true, target: 'anchor' },
                                    directions: ['right-center']
                                }
                            ]
                        },
                        {
                            elem: 'group',
                            mix: { block: 'line2' },
                            content: [
                                {
                                    block: 'label',
                                    for: 'patronymic',
                                    content: 'Отчество:'
                                },
                                {
                                    block: 'input',
                                    mods: { theme: 'islands', size: 'm', id: 'patronymic' }
                                },
                                {
                                    block: 'popup',
                                    mods: { theme: 'islands', autoclosable: true, target: 'anchor' },
                                    directions: ['right-center']
                                }
                            ]
                        },
                        {
                            elem: 'group',
                            mix: { block: 'line2' },
                            content: [
                                {
                                    block: 'label',
                                    for: 'dateOfBirth',
                                    content: 'Дата рождения:'
                                },
                                {
                                    block: 'input',
                                    mods: { theme: 'islands', size: 'm', type: 'date', id: 'dateOfBirth' }
                                },
                                {
                                    block: 'popup',
                                    mods: { theme: 'islands', autoclosable: true, target: 'anchor' },
                                    directions: ['right-center']
                                }
                            ]
                        },
                        {
                            elem: 'group',
                            mix: { block: 'line2' },
                            content: [
                                {
                                    block: 'label',
                                    for: 'phoneNumber',
                                    content: 'Номер телефона:'
                                },
                                {
                                    block: 'input',
                                    mods: { theme: 'islands', size: 'm', id: 'phoneNumber' }
                                },
                                {
                                    block: 'popup',
                                    mods: { theme: 'islands', autoclosable: true, target: 'anchor' },
                                    directions: ['right-center']
                                }
                            ]
                        },
                        {
                            elem: 'group',
                            mix: { block: 'line2' },
                            content: [
                                {
                                    block: 'label',
                                    for: 'email',
                                    content: 'Почта (email):'
                                },
                                {
                                    block: 'input',
                                    mods: { theme: 'islands', size: 'm', id: 'email' }
                                },
                                {
                                    block: 'popup',
                                    mods: { theme: 'islands', autoclosable: true, target: 'anchor' },
                                    directions: ['right-center']
                                }
                            ]
                        },
                        {
                            elem: 'group',
                            mix: { block: 'line2' },
                            content: [
                                {
                                    block: 'label',
                                    for: 'password',
                                    content: 'Пароль:'
                                },
                                {
                                    block: 'input',
                                    mods: { theme: 'islands', size: 'm', type: 'password', id: 'password' }
                                },
                                {
                                    block: 'popup',
                                    mods: { theme: 'islands', autoclosable: true, target: 'anchor' },
                                    directions: ['right-center']
                                }
                            ]
                        },
                        {
                            elem: 'group',
                            mix: { block: 'line2' },
                            content: [
                                {
                                    block: 'label',
                                    for: 'passportNumber',
                                    content: 'Номер пасспорта:'
                                },
                                {
                                    block: 'input',
                                    mods: { theme: 'islands', size: 'm', id: 'passportNumber' }
                                },
                                {
                                    block: 'popup',
                                    mods: { theme: 'islands', autoclosable: true, target: 'anchor' },
                                    directions: ['right-center']
                                }
                            ]
                        },
                        {
                            elem: 'group',
                            mix: { block: 'line2' },
                            content: [
                                {
                                    block: 'label',
                                    for: 'passportIdNumber',
                                    content: 'Личный (идентификационный) номер:'
                                },
                                {
                                    block: 'input',
                                    mods: { theme: 'islands', size: 'm', id: 'passportIdNumber' }
                                },
                                {
                                    block: 'popup',
                                    mods: { theme: 'islands', autoclosable: true, target: 'anchor' },
                                    directions: ['right-center']
                                }
                            ]
                        },
                        {
                            elem: 'group',
                            mix: { block: 'line2' },
                            content: [
                                {
                                    block: 'label',
                                    for: 'mothersMaidenName',
                                    content: 'Девичья фамилия матери:'
                                },
                                {
                                    block: 'input',
                                    mods: { theme: 'islands', size: 'm', id: 'mothersMaidenName' }
                                },
                                {
                                    block: 'popup',
                                    mods: { theme: 'islands', autoclosable: true, target: 'anchor' },
                                    directions: ['right-center']
                                }
                            ]
                        },
                        {
                            block: 'button',
                            mods: { theme: 'islands', size: 'm', type: 'submit', view: 'action' },
                            mix: { block: 'step1', elem: 'button' },
                            text: 'Зарегистрироваться'
                        }
                    ]
                },
                {
                    block: 'qr',
                    js: true,
                    mods: { hide: 'yes' },
                    content: [
                        {
                            block: 'image',
                            url: ''
                        },
                        {
                            block : 'control-group',
                            content: [
                                {
                                    block: 'input',
                                    mods: { theme: 'islands', size: 'm' },
                                    placeholder: 'Введите пароль с телефона'
                                },
                                {
                                    block: 'button',
                                    mods : { theme : 'islands', size : 'm', type : 'submit', view: 'action' },
                                    text: 'Отправить'
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
};
