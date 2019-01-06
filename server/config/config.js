
/*
*  Config
*
*  @ServerPort          3000
*  @ServerDeployment    dev
*
* */

process.env.PORT = process.env.PORT || 3000;
process.env.NODE_ENV = process.env.NODE_ENV ||'dev';



/*
*   Config database
* */

let urlDB;

if( process.env.NODE_ENV === 'dev' ){
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb://cafe-user:123456F@ds161304.mlab.com:61304/cafe';
}

process.env.URLDB = urlDB;
