GMTU - Give Me Tiny URL
========================

Intro
--------
* A simple project for memcached demo.
* Tutorial article: [Memcached 實作示範 — 用Memory Cache優化系統效能](https://www.onejar99.com/memcached-memory-cache-optimize-performance/)

![](./figures/gmtu.png)

Tech Stack
--------
* Node.js + Express + MongoDB
* Memory Cache Tool: memcached

Usage
--------
| Type       | URL                             | Description                               |
| ---------- | ------------------------------- | ----------------------------------------- |
| View Page  | /gmtu                           | Main GUI for this applicaiotn             |
| View Page  | /gmtu/{hashCode}                | Direct shorten urls to real websites      |
| API        | POST /tinyUrl                   | Create a shorten url                      |
| API        | GET /tinyUrl/{hashCode}         | Query url by shorten code                 |
| API        | GET /tinyUrlCached/{hashCode}   | Query url by shorten code (with cache)    |

Experiment
--------

### Commands:

* Call by libraries:
    - `$ node src-experiment/client-by-lib.js bWgYoBVv --mode=orig`
    - `$ node src-experiment/client-by-lib.js bWgYoBVv --mode=cache`
* Call by Web APIs:
    - `$ node src-experiment/client-by-api.js bWgYoBVv --mode=orig`
    - `$ node src-experiment/client-by-api.js bWgYoBVv --mode=cache`

### Experiment Results:

* Memory cache can improve over 50% performace.

* `$ node src-experiment/client-by-lib.js bWgYoBVv --mode=orig`

![](./figures/exper-by-lib-orig.png)

* `$ node src-experiment/client-by-lib.js bWgYoBVv --mode=cache`

![](./figures/exper-by-lib-cache.png)
