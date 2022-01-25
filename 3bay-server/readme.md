## 🛠️ Set up the project

**1. Install npm dependency**
```bash
npm ci
```

**2. Load database schema, sample data**
* Make sure MariaDB (or MySQL) is installed in the local machine.
* It is recommend to use MariaDB since the database script is generated from MariaDB, and it might not work when using MySQL.

* Load the database structure from `prisma/structure.sql`.
* Load the sample data from `prisma/sample_data/sample_data.sql`.

**3. Configure `.env`, `prisma`**

3.1. Configure `.env`
Create an `.env` file from `.env.example`.

3.1.1. Set value for `DATABASE_URL`:

```
 DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"
```

* USER: The name of your database user
* PASSWORD: The password for your database user
* PORT: The port where your database server is running (typically 3306 for MySQL)
* DATABASE: The name of the database


3.1.2. Set up mail service

```
# Enable the mail service, "false" to disable it
MAIL_ENABLE_SERVICE="true" 	

# Your email address, it is recommend to use gmail address 
MAIL_USER=""			

# Mail password
MAIL_PWD=""
```

3.1.3. Set up recaptcha

```
# Enable recaptcha verification
RECAPTCHA_ENABLE="true"

# Your recaptcha secret key
RECAPTCHA_SECRET_KEY=""

```

✏️ You can skip mail service or recaptcha setup if you don't want to use them.

3.2. Configure prisma

✏️ The project has contained the prisma model already, so you just need to load the model from `prisma/schema.prisma`.

```bash
npx prisma generate 
```

See also: 
* https://www.prisma.io/docs/guides