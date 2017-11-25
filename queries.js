var promise = require('bluebird');

var options = {
  // Initialization Options
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
const connectionString = 'postgres://rumafcgcwsyjlb:eaf3365f4a05d93e258be549c003895fd324a558615609168a13fcbe403da14b@ec2-54-247-120-169.eu-west-1.compute.amazonaws.com:5432/dc3qigg78skadb';
var db = pgp(connectionString);

// add query functions

function getUser(req,res,next){
    var clientID = parseInt(req.params.id);
    db.one('select * from users where id = $0',clientID)
        .then(function(data){
            res.status(200)
            .json({
                status:'success',
                data:data,
                message: 'Retrieved user'
            });
        })
        .catch(function(err){
            return next(err);
        });
}

module.exports = {
  getUser
};