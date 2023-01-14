# Kanban App

This is the frontend of the Kanban App. It is built with [Vue 3](https://v3.vuejs.org/) and [Vite](https://vitejs.dev/). It runs on a flask API backend build by me which can be found [here](https://www.github.com/kumar-shivang/Kanban-API-backend).

## Features

* Create, edit, and delete tasks
* Create, edit, and delete task lists
* Mark tasks as complete and incomplete
* Responsive design
* export tasks as a CSV file
* daily task reminders
* monthly user summary
* user authentication
* caching

## Project Structure

```sh
.
├── file_structure.txt
├── index.html
├── package.json
├── package-lock.json
├── public
│   └── favicon.ico
├── README.md
├── src
│   ├── App.vue
│   ├── assets
│   │   ├── base.css
│   │   ├── logo.svg
│   │   └── main.css
│   ├── components
│   │   ├── cardCreationFrom.vue
│   │   ├── CardEditForm.vue
│   │   ├── Card.vue
│   │   ├── ListSummary.vue
│   │   ├── List.vue
│   │   └── navbar.vue
│   ├── main.js
│   ├── router
│   │   └── index.js
│   ├── scss
│   │   └── styles.scss
│   ├── stores
│   │   └── counter.js
│   └── views
│       ├── HomeView.vue
│       ├── LoginView.vue
│       ├── RegisterView.vue
│       └── SummaryView.vue
└── vite.config.js

9 directories, 25 files
```

## Installation

* Clone the repository

    ```sh
    git clone https://www.github.com/kumar-shivang/Kanban-vue3-frontend
    ```

* Install the dependencies

    ```sh
    npm install
    ```

* Run the project

    ```sh
    npm run dev
    ```

### Compile and Minify for Production

```sh
npm run build
```
