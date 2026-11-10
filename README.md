# Marketplace - Multi-vendor E-commerce

Laravel 12, Inertia.js 2, React, TypeScript, and Tailwind CSS application for managing shops and a shared product catalog.

Public repository: [github.com/fmtawhid/CSN-Task-small-ecommerce](https://github.com/fmtawhid/CSN-Task-small-ecommerce)

## Features

- **Admin panel:** session-based login; create, edit, activate/deactivate, and delete shops and global products; create and manage shop-owner accounts; review shop listings; manage homepage banners and customer reviews.
- **Shop-owner panel:** browse active products in the shared catalog, list catalog products in the owner's shop, create new products, and customize each shop listing's price, description, thumbnail, and visibility.
- **Customer storefront:** browse active shops and products, and view a shop's active listings with shop-specific price and image. Products are shown to customers only when assigned to an active shop and both the listing and global product are active.
- **Orders:** guest cash-on-delivery checkout; mixed-shop carts are split into shop orders, and owners can view their orders and update valid order statuses.
- **Access and data integrity:** admin and owner routes are role-protected; owners can manage only their own shop listings; database constraints prevent duplicate listings.

## Requirements

- PHP 8.2 or newer with the Laravel-required PHP extensions. Enable `pdo_mysql` for the application; `pdo_sqlite` is only needed if you run the automated test suite.
- Composer 2
- Node.js 20 or newer and npm
- Git

This project uses MySQL for local development. The test suite uses an isolated in-memory SQLite database.

## Fresh setup (MySQL)

The commands below are for Windows PowerShell (including Laragon). Run them from the repository root. Start Laragon's MySQL service and create a MySQL database named `small_ecommerce` before migrating.

### 1. Get the code and install dependencies

```powershell
git clone https://github.com/fmtawhid/CSN-Task-small-ecommerce.git
cd CSN-Task-small-ecommerce
composer install
npm ci
```

Create your local environment file from the example:

```powershell
Copy-Item .env.example .env
```

In `.env`, set `APP_URL` to `http://csn-task-small-ecommerce.test` when using Laragon's virtual host, and update the `DB_*` values if your MySQL credentials differ from the defaults. Then generate the application key:

```powershell
php artisan key:generate
```

### 2. Run migrations and seeders

Create the schema and seed permissions, roles, and starter homepage banners:

```powershell
php artisan migrate --seed
```

Add local demo accounts, shops, products, and listings:

```powershell
php artisan db:seed --class=MarketplaceDemoSeeder
php artisan storage:link
```

If you want to check migration status before or after migrating:

```powershell
php artisan migrate:status
```

### 3. Start the application

Start the Laravel server, queue worker, and Vite development server together:

```powershell
composer run dev
```

With Laragon's virtual host enabled, open [http://csn-task-small-ecommerce.test](http://csn-task-small-ecommerce.test). Otherwise, the Laravel development server is available at [http://127.0.0.1:8000](http://127.0.0.1:8000). To build production assets instead, run `npm run build`.

Sign in at `/login`; the admin dashboard is `/admin/dashboard`. Create shops at `/admin/shops` by entering the owner's name, email, and password; the owner account is created together with the shop. Use `/admin/owners` to manage existing owners.

## Demo login credentials

The `MarketplaceDemoSeeder` creates the following accounts. Use these credentials for local testing only; never use them in production.

| Role                    | Email                         | Password          |
| ----------------------- | ----------------------------- | ----------------- |
| Admin                   | `demo-admin@example.test`   | `AdminDemo123!` |
| User                    | `demo-user@example.test`    | `UserDemo123!`  |
| Shop owner (first shop) | `demo-owner-1@example.test` | `OwnerDemo123!` |

The other four shop owners use `demo-owner-2@example.test` through `demo-owner-5@example.test` with the same owner password. When creating a shop in the admin panel, enter the owner's name, email, and password in the shop form; the owner account and shop are created together.

## Main routes

| Route                | Purpose                                               |
| -------------------- | ----------------------------------------------------- |
| `/`                | Customer marketplace home                             |
| `/products`        | Searchable catalog of products listed by active shops |
| `/stores`          | Searchable directory of active shops                  |
| `/shop/{slug}`     | Shop storefront                                       |
| `/login`           | Admin, user, and shop-owner sign in                   |
| `/admin/dashboard` | Admin dashboard                                       |
| `/owner/dashboard` | Shop-owner dashboard                                  |

## Tests and checks

```powershell
php artisan test
npm run build
```

## Generated and local files

`.env` contains machine-specific configuration and must not be committed; `.env.example` is the safe template. Composer creates `vendor` with `composer install`, and Vite creates `public/build` with `npm run build`. These generated files, uploaded files, local SQLite databases, and `node_modules` should remain local and are excluded from Git.
