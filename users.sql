DROP DATABASE IF EXISTS users;
CREATE DATABASE users;

\c users;

CREATE TABLE client(
    ID SERIAL PRIMARY KEY,
    name VARCHAR,
    surname VARCHAR,
    phone INT,
    email VARCHAR,
    dob DATE,
    job VARCHAR,
    possessions VARCHAR,
    primaryHouseLoc VARCHAR,
    maritalStatus VARCHAR
);

INSERT INTO client (name,surname,phone,job)
    VALUES ('Panos','Panagiotidis','94218521','cook');
    
    
function getUser(req,res,next){
    var clientID = parseInt(req.params.id);
    app.one('select * from users where id = $0',clientID)
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
