
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
*   Config jwt
*
*   @JWT.token.time
*   @JWT.token.secret.key
*
* */

process.env.TOKEN_CADUCIDAD = 60 * 60 * 24 * 30; // seg min hrs days
process.env.TOKEN_SECRET_KEY = process.env.TOKEN_SECRET_KEY || 'j2dFWPYdnsU@MGpsg$'



/*
*   Config database
* */

let urlDB;

if( process.env.NODE_ENV === 'dev' ){
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;
