# Marketplace - Multi-vendor E-commerce

Laravel 12, Inertia.js 2, React, TypeScript, and Tailwind CSS application for managing shops and a shared product catalog.

Public repository: [github.com/fmtawhid/CSN-Task-small-ecommerce-](https://github.com/fmtawhid/CSN-Task-small-ecommerce-)

## Features

- **Admin panel:** session-based login; create, edit, activate/deactivate, and delete shops and global products; create and manage shop-owner accounts; review shop listings; manage homepage banners and customer reviews.
- **Shop-owner panel:** browse active products in the shared catalog, list catalog products in the owner's shop, create new products, and customize each shop listing's price, description, thumbnail, and visibility.
- **Customer storefront:** browse active shops and products, and view a shop's active listings with shop-specific price and image. Products are shown to customers only when assigned to an active shop and both the listing and global product are active.
- **Orders:** guest cash-on-delivery checkout; mixed-shop carts are split into shop orders, and owners can view their orders and update valid order statuses.
- **Access and data integrity:** admin and owner routes are role-protected; owners can manage only their own shop listings; database constraints prevent duplicate listings.

## Requirements

- PHP 8.2 or newer with the Laravel-required PHP extensions. Enable `pdo_mysql` for MySQL and `pdo_sqlite` for the test suite.
- Composer 2
- Node.js 20 or newer and npm
- Git

This project uses MySQL for local development. The test suite uses an isolated in-memory SQLite database.

## Fresh setup (MySQL)

The commands below are for Windows PowerShell (including Laragon). Run them from the repository root.

### 1. Get the code and install dependencies

```powershell
git clone https://github.com/fmtawhid/CSN-Task-small-ecommerce-.git
cd CSN-Task-small-ecommerce-
composer install
npm ci
```

If you already have the project, open PowerShell in its root folder and continue below.

### 2. Create a MySQL database

Start MySQL from Laragon, then create an empty database named `small_ecommerce` in phpMyAdmin. Alternatively, run this in the phpMyAdmin SQL tab:

```sql
CREATE DATABASE small_ecommerce
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;
```

### 3. Configure Laravel

Create `.env` only if it does not already exist; do not overwrite an existing one:

```powershell
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
```

In `.env`, confirm the MySQL values match your Laragon setup:

```dotenv
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=small_ecommerce
DB_USERNAME=root
DB_PASSWORD=
```

Set a unique admin email and a strong password as well. These values are used by the administrator seeder:

```dotenv
ECOMMERCE_ADMIN_NAME="Store Administrator"
ECOMMERCE_ADMIN_EMAIL=admin@example.com
ECOMMERCE_ADMIN_PASSWORD=replace-with-a-unique-strong-password
```

Use your own email and password; do not commit `.env` or use development credentials in production. Then generate the application key and clear cached configuration:

```powershell
php artisan key:generate
php artisan config:clear
```

### 4. Run migrations and seeders

Run the schema migrations first:

```powershell
php artisan migrate
```

Seed permissions, roles, and the starter homepage banners:

```powershell
php artisan db:seed
```

Create the initial administrator from the `ECOMMERCE_ADMIN_*` values in `.env`:

```powershell
php artisan db:seed --class=SuperAdminSeeder
php artisan storage:link
```

For a one-command migration plus standard seed run, use `php artisan migrate --seed` instead of running `migrate` and `db:seed` separately. The administrator seeder remains a separate command so the admin account is created only when you explicitly run it.

If you want to check migration status before or after migrating:

```powershell
php artisan migrate:status
```

### 5. Build assets and start the application

For a production asset build:

```powershell
npm run build
php artisan serve
```

Open <http://127.0.0.1:8000>. For local development with the server, queue worker, and Vite dev server running together, use:

```powershell
composer run dev
```

Sign in at `/login`; the admin dashboard is `/admin/dashboard`. From the admin panel, create shop-owner accounts at `/admin/owners` and then create shops at `/admin/shops`, assigning each shop to its owner.

## Optional demo data

After running the migrations and standard seeders, you can create a demo admin, five owner accounts, five shops, and sample catalog products/listings:

```powershell
php artisan db:seed --class=MarketplaceDemoSeeder
```

The seeder generates new passwords each time it runs and writes the local login details to `storage/app/private/demo-credentials.txt`. Use this only for local development; do not use demo accounts in production or publish that credentials file.

## Main routes

| Route | Purpose |
| --- | --- |
| `/` | Customer marketplace home |
| `/products` | Searchable catalog of products listed by active shops |
| `/stores` | Searchable directory of active shops |
| `/shop/{slug}` | Shop storefront |
| `/login` | Admin and shop-owner sign in |
| `/admin/dashboard` | Admin dashboard |
| `/owner/dashboard` | Shop-owner dashboard |

## Tests and checks

The feature tests use an in-memory SQLite database. Ensure the PHP CLI has `pdo_sqlite` enabled, then run:

```powershell
php artisan test
npm run types
npm run build
```

## Repository safety

`.env` contains machine-specific configuration and secrets. Keep it out of commits; `.env.example` is the safe configuration template. Uploaded files, local SQLite databases, dependencies, and generated demo credentials should also remain local.
