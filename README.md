# BloggyWeb

Angular frontend for the Bloggy application.
This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 22.1.7.

## Overview

Bloggy is a simple blogging platform where users can browse published blogs and manage their own posts.

The application provides:

* **Blog listing** — Browse available blog posts.
* **Blog details** — View the full content of a blog post.
* **Authentication** — Users can register and log in through Keycloak.
* **My Blogs** — Authenticated users can view the posts they have created.
* **Create Blog** — Authenticated users can create a new blog post.
* **Edit Blog** — Users can update their own posts.
* **Delete Blog** — Users can delete their own posts.
* **Authorization** — Users can only manage their own blogs.

The frontend communicates with the Bloggy .NET API and uses Keycloak for authentication.

## Requirements

* Node.js
* npm
* Angular CLI

## Install

```bash
npm install
```

## Run

```bash
ng serve
```

The application will be available at:

```text
http://localhost:4200
```

## Configuration

The application is configured to connect to:

* **Backend:** `https://localhost:7084`
* **Keycloak:** `http://localhost:8080`
* **Realm:** `bloggy`
* **Client:** `angular-client`
