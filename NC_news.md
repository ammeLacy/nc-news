
# NC_news

An API for interacting with the nc_news application, which uses a PostgresSQL ,interactions with the databasenter image description heree are undertaken by K'nex. The application consists of articles, topics and users. Articles can be created, filtered and sorted and have their votes updated, Comments can be commented made on articles and these in turn can be updated, and deleted. Users and topics can also be created and deleted.

If you want to embed images, this is how you do it:

## Link
- *insert link to herouk*

### Prerequisites
This project assumes that Node and PostgresSQL are installed, if not follow [https://nodejs.org/en/download/](https://nodejs.org/en/download/) for downloading Node and [https://www.postgresql.org/](https://www.postgresql.org/) for downloading PostgresSQL 

 2. Express - [https://expressjs.com/en/starter/installing.html](https://expressjs.com/en/starter/installing.html)
 3. Knex [https://knexjs.org/](https://knexjs.org/)

## Installation 
#### Git
 1. On GitHub if you require your own repository set that up before cloning the repository
  2. Clone the repo from https://github.com/ammeLacy/nc-news and then (if requiring your own repository *git remote remove origin* then **<YOUR-GITHUB_URL>**) git remote add origin 
  #### Dependencies
  3. The project provides the following dependencies
      - express : 4.17.1
	 - knex: 0.19.0
	 - pg 7.11.0
 run npm install
 #### Configuration 
 4.  While the dependencies are installing open the .gitignore  file and add the following *knexfile.js*
 5. Create the knexfile.js in the root directory and add the following 

```
 const ENV = process.env.NODE_ENV || 'development';
	const  baseConfig  =  {
		client:  'pg',
		migrations:  {
			directory:  './db/migrations'
		},
		seeds:  {
		directory:  './db/seeds'
		}
	};
	const  customConfig  =  {
		development:  {
		connection:  {
		database:  'nc_news',
		user:  postgres username // only required if using linux
		password: postgres password // only required if using linux
		}
	},
	test:  {
		connection:  {
			database:  'nc_news_test',
			user:  postgres username // only required if using linux
			password:  postgress password // only required if using linux
		}
	}
};
module.exports = { ...customConfig[ENV], ...baseConfig };
```
#### Database  set up and seeding 
6. Once the dependencies have finished installing set up the database by running *npm run setup-dbs* which will create both the development and test databases. 
7. To create the tables on both the development and test databases use *npm run migrate-latest*
8. To populate data  run *knex seed run*

##### To restart the database use the following 
a) *npm run setup-dbs*
b) *npm run  migrate-rollback**
c) *npm migrate-latest*
d)  *knex seed run*

#### Testing 
 9. To make use use of the testing suite, the following developer dependencies are required
	 - chai:  4.2.0
	- chai-sorted: 0.2.0
	- mocha: 6.1.4
	- supertest: 4.0.2
run *npm i -D mocha chai chai chai-sorted supertest*

##### Testing explanation 
All tests exist in the spec folder and are split into files devoted to tests for the functions required to manipulate the data from data files into the database, tests per end-point and testing for utility functions required by the models. 
```
describe('/api', ()  => {
	describe('/articles', ()  => {
		describe('GET', ()  => {
		it('returns 200 and an array of article objects, each of which has an author,title,article_id,topic, created_at,votes and comment_count keys,',()  => {
		return request(app)
		.get('/api/articles')
		.expect(200)
		.then(({
			body: {
			articles
		}}) => expect(articles).to.be.a("array");
		expect(articles[articles.length - 1]).to.include.keys('author','title','topic','created_at','votes');

```
Each file is further divided into path, functionality for each path and corresponding error testing. 
 - To run **only** the tests for the utility functions that manipulate the data run *npm run test-utils*
 - To run **all** tests use *npm t* 
 
 ***Optional*** to host the application locally 
a) install as a dev dependency nodemon: 1.19.1 *npm -D nodemon* 
b) create a listen.js file in the root folder 
c) in the listen,js file insert the following 
```
const app = require('./app');
const PORT = 9090; // or other available port
app.listen(PORT,() => {
console.log(`listening on port ${PORT}`);
});
```
d) to run the development environment use  *npm run dev*
