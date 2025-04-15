# construct-tasks
Задания по конструированию ПО
## Описание

Проект использует приложение на базе NestJS с использованием PostgreSQL в качестве базы данных. Для локальной разработки используется Docker и Docker Compose.

## Требования

Перед началом убедитесь, что у вас установлены следующие инструменты:

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

## Запуск приложения локально

1. Клонируйте репозиторий:

   ```bash
   git clone https://github.com/MikhailovAlexander/construct-tasks.git
   cd construct-tasks
   ```

2. В файле `.env.local` указаны настройки приложения и базы данных.
3. Приложение запускается в докере:
    
    ```bash
    docker-compose -f docker-compose.local.yml --env-file .env.local up -d
    ```

4. Доступ к приложению:
    - Swagger для приложения будет доступно по адресу: http://localhost:3000/api
    - Менеджер базы данных pgAdmin будет доступен по адресу: http://localhost:5050, для входа нужно использовать параметры из файла `.env.local`, а также:
        * Email: admin@local.com
        * Password: admin
    
Для остановки контейнеров выполните:

```bash
docker-compose -f docker-compose.local.yml --env-file .env.local down
```

Для остановки контейнеров и удаления всех данных (volumes) выполните:

```bash
docker-compose -f docker-compose.local.yml --env-file .env.local down -v
```