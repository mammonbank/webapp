# Mammonbank
Хотим сдать проект про бановские системы. (переведено фаргус)

## Установка
* `git clone https://github.com/mammonbank/webapp.git`
* `cd webapp`
* `npm i`
* `cd client && bower i`
* Установите PostgreSQL под свою ОС
* `npm start`

Главная: [`3000`](http://localhost:3000)
Админка: [`3001`](http://localhost:3001)

Остановка сервера (демонов)
`pm2 kill`

## Дополнительно
`npm run-script start-client` - запуск клиентской части НЕ в фоне + отладка
`npm run-script start-admin` - админка + отладка


# Mammonbank
Modern web-based application which simulates real banking operations

## Installing
* `git clone https://github.com/mammonbank/webapp.git`
* `cd webapp`
* `npm i`
* `sudo npm i pm2 -g`
* install PostgreSQL
* run following commands in PostgreSQL prompt
  * `CREATE DATABASE mammonbank;`
  * `CREATE USER wiranoid WITH password 'nevergiveup';`
  * `GRANT ALL privileges ON DATABASE mammonbank TO wiranoid;`
* exit PostgreSQL prompt
* `npm start`

Visit `http://localhost:3000` and `http://localhost:3001` to check that all works

To stop servers run
`pm2 kill`

## Additional
`npm start` command will start both servers (client and admin) without logging.

To launch particular server instance with logging enabled run
`npm run-script start-client` or
`npm run-script start-admin`
