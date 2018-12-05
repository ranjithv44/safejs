'use strict'
const hash = require('crypto').createHash;

module.exports = {
    createHash:function(data) {
        console.log(process.env.CRYPTO_ALG);
        console.log(process.env.CRYPTO_DIGEST);
        return hash(process.env.CRYPTO_ALG).update(data).digest(process.env.CRYPTO_DIGEST);
    }
}