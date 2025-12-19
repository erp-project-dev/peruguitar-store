# Peru Guitar — Project Flow Overview

This project is split into **two clearly defined parts** designed to keep the platform fast, secure, and easy to maintain.

---

## Backoffice

The **backoffice** is responsible for **all data management**.

Here you:

- create and edit products
- manage brands, merchants, types, and settings
- upload and remove images
- enable or disable products

The backoffice works directly with the database and is the **only place where data is written or modified**.

When data changes are ready to be published, the backoffice generates an **encrypted data file**.

---

## Frontoffice

The **frontoffice** is the public website.

It **does not connect to the database** and **cannot modify data**.

Instead, it reads a **decrypted JSON file generated at build/runtime**.

This approach makes the website:

- extremely fast
- stable
- easy to deploy
- safe from direct database access

The frontoffice is strictly read-only.

---

## Data Flow

1. Data is created or updated in the backoffice
2. A sync command generates an encrypted file (`store.enc`)
3. A worker decrypts `store.enc` and generates `store.json`
4. The frontoffice reads `store.json` to render the site

---

## Why This Architecture

- No database access from the public site
- Encrypted data at rest between systems
- Clear separation of responsibilities
- Easy static deployment (GitHub Pages, CDN, etc.)
- Simple rollback and versioning
- Zero hosting cost for the whole project

---

Simple, secure, and easy to maintain.
