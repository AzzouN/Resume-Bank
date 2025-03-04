# Resume Bank
Store resumes and search them in an easy, reliable and fast way

## Installation
### Requirements
- node.js
- npm
- vue.js
- elasticsearch
---

Clone the repository :
```bash
$ git clone https://github.com/AzzouN/Resume-Bank.git
```

Install dependencies :
```bash
$ cd Resume-Bank
$ cd back-end
$ npm install
$ cd ../front-end/front-end
$ npm install
```

## Execution
Start ElasticSearch instance

Start Node.js REST API
```bash
$ cd Resume-Bank/back-end
$ npm run start
```
Start the Vue.js application
```bash
$ cd Resume-Bank/front-end/front-end
$ npm run serve
```
### Important
> The REST API runs on port 5000

> The Vue.js application runs on port 8080

> The ElasticSearch instance runs on port 9200

If you are using one of those ports for anything else, you must change the configuration files.

To change the REST API port :
```bash
$ cd Resume-Bank/back-end
$ nano .env
```
Add the following line and replace "value" with the desired port number :
> PORT=value

After changing the REST API port you must update the configuration file in Vue.js application :
```bash
$ cd Resume-Bank/front-end/front-end
$ nano .env
```
and update the variable VUE_APP_ENV_API

If you changed the ElasticSearch port :
```bash
$ cd Resume-Bank/back-end
$ nano .env
```
and update the variable ES_API

## Features
* Store and index resumes in diffirents formats (PDF files, MS Word files, Pictures)
* Find resumes based on criteria that you specify in real time
* The most relevant results are shown first
## Use case
Searching is done by providing keywords seperated by comma.

Three search input categories are provided :
1. Must: The candidate must have all of them
2. Optional: It's better if the candidate have them (affects the score of the resume)
3. Alternatives: The candidate must have one of them at least

>Example

You want to get all the profiles that knows html, css and javascript, and knows either react or angular for front-end development, and knows either express.js or hapi.js for back-end development and show those who knows docker and kubernetes first :

![search_criteria](https://raw.githubusercontent.com/AzzouN/Resume-Bank/main/search.png?token=AFUF422S5C5S5GIQFW27NB272ZLII)


## Contributors
- NACER Azzeddine
- CHATAL Ikram
- Fares Khattab
## Outlook
- Add fuzzy queries
- Store resumes in a more categorized manner to optimize searching speed
