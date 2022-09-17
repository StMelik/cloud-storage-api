# Проект: Облачное хранилище (серверная часть)

## Описание
Серверная часть облачного хранилища

## Функциональность
* Регистрация
* JWT Авторизация
* Создание папок
* Загрузка и удаление файлов на сервер и БД
* Скачивание файлов
* Поиск файлов
* Загрузка и удаление аватара
* Раздача статики

## Технологии
* JavaScript
* NodeJS
* Express
* MongoDB
* JWT

## Адреса
Сервер - [https://cloud-storage-api.stmelik.repl.co/](https://cloud-storage-api.stmelik.repl.co/)

Проект - [https://cloud23.netlify.app/](https://cloud23.netlify.app/)

## Установка и запуск сервера
1. Клонировать репозиторий:  
  `clone https://github.com/StMelik/cloud-storage-api.git`

2. Перейти в папку с сервером:  
  `cd cloud-storage-api`

3. Установить зависимости:  
  `npm install`

4. Запустить сервер:  
  `npm run start`

## Маршруты

* Авторизация по токену  
  `GET /auth`

* Получения списка файлов  
  `GET /files`

* Скачивание файла  
  `GET /files/download`

* Поиск файла  
  `GET /files/search`

* Регистрация  
  `POST /sign-up`

* Авторизация  
  `POST /sign-in`

* Создание папки  
  `POST /files`

* Загрузка файла  
  `POST /files/upload`

* Загрузка аватара  
  `POST /files/avatar`

* Удаление файла  
  `DELETE /files`

* Удаление аватара  
  `DELETE /files/avatar`