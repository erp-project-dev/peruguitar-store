# Peru Guitar — Project Flow Overview

This project is split into **two clearly defined parts** that work together to keep the website fast, simple, and easy to maintain:

## Backoffice

The **backoffice** is used to manage the content of the site.

Here you:

- create and edit products
- manage brands, merchants, types, and settings
- upload and remove images
- enable or disable products

The backoffice works directly with the database and is the **only place where data changes**.

## Frontoffice

The **frontoffice** is the public website.

It does not connect to the database.
Instead, it reads a generated `data.json` file.

This makes the website:

- fast
- stable
- easy to deploy

The frontoffice only shows the data.

## Data Flow

1. Data is updated in the backoffice
2. A worker generates `data.json`
3. The frontoffice uses this file to render the site

---

Simple, fast, and easy to maintain.
