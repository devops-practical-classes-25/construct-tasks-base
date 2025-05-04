# Задания по конструированию программного обеспечения

Данный репозиторий содержит практические задания, направленные на освоение ключевых аспектов проектирования и разработки программных систем.

1. `cats` - Изучение принципов REST API на примере веб-сервиса для работы с данными о кошках;
2. `user` - Разработка нового микросервиса с интеграцией в существующую систему (сервис cats)

## Требования

Перед началом убедитесь, что у вас установлены следующие инструменты:

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

## Запуск приложения локально

1. Клонируйте репозиторий:

   ```bash
   git clone https://github.com/devops-practical-classes-25/construct-tasks-base.git
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
