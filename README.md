# Neko Sama History

> Save your watched episodes !

## Contribute to project

### Requirement

- [Node.js 18](https://nodejs.org/fr)
- [Git](https://git-scm.com/)
- [pnpm 8.x](https://pnpm.io/fr/)

### Clone project

```bash
git clone https://github.com/Jokay03J/neko-sama-history.git
```

### Install dependencies

On project directory.

```bash
pnpm i
```

###  Run extension

This project use `web-ext` for run firefox or chrome with extension.

#### Select target

Available target:

- chrome
- firefox

For choose extension target(firefox or chrome).  
 Create `.env` file and type this:

```bash
SELECT_TARGET="<available target>"
```

#### Build dev project

After select your platform. Type this inside your terminal:

```bash
pnpm run watch
```

#### Run builded extension

```bash
pnpm run serve:<chrome or firefox>
```

#### Build extension for production.

You must [select your platform target](#select-target) before build extension.  
Type this inside your terminal:

```bash
pnpm run build
```

### Create changelog

This project use changetsets for make changelog easier.  
Refer [here](https://github.com/changesets/changesets/blob/main/docs/intro-to-using-changesets.md#adding-changesets) for make changelog.
