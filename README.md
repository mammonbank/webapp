# Mammonbank
Веб-приложение с насыщенным функционалом, симулирующим кредитно-депозитный портфель банка.

## Установка
* `git clone https://github.com/mammonbank/webapp.git`
* `cd webapp`
* `npm i`
* `cd client && bower i`
* Установите PostgreSQL под свою ОС
* Создайте базу с именем mammonbank и пользователя с полными правами на эту базу
* `NODE_DB_USERNAME=[имя_пользователя] NODE_DB_PASSWORD=[пароль_пользователя] npm start`

API-сервер: [`3000`](http://localhost:3000)
Главная: [`3001`](http://localhost:3001)
Админка: [`3002`](http://localhost:3002)

Клиентский сервер:
* `npm install`
запуск - `npm start -p 3001` или `bem server -p 3001`(нужны bem-tools)

Остановка серверов (демонов)
`pm2 kill`

## Дополнительно
Все команды начинать с `NODE_DB_USERNAME=[имя_пользователя] NODE_DB_PASSWORD=[пароль_пользователя]`
`npm run-script start-client` - запуск клиентской части НЕ в фоне + отладка
`npm run-script start-bank` - админка + отладка
`npm run-script start-api` - api-сервер + отладка

з.ы. будет время, нарисую как эта вся лабуда работает и почему тут аж 3 сервака
