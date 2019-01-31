/*
 *  Config
 *
 *  @ServerPort          3000
 *  @ServerDeployment    dev
 *
 * */

process.env.PORT = process.env.PORT || 3000;
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

/*
 *   Config jwt
 *
 *   @JWT.token.time
 *   @JWT.token.secret.key
 *
 * */

process.env.TOKEN_CADUCIDAD = 60 * 60 * 24 * 30; // seg min hrs days
process.env.TOKEN_SECRET_KEY = process.env.TOKEN_SECRET_KEY || 'j2dFWPYdnsU@MGpsg$'

/**
 * 
 *  Google client ID
 * 
 * */

process.env.CLIENT_ID = process.env.CLIENT_ID || '1021435588613-m0016js3ofoe0tkpv75sl6h6fhb52f7n.apps.googleusercontent.com';


/*
 *   Config database
 * */

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;