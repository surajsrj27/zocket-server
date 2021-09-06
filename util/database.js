const Sequelize = require('sequelize');

const sequelize = new Sequelize(
    'heroku_a58052e788c132e', 
    'b8c57c77b234d9', 
    'd1811cf3',
    {
    dialect: 'mysql',
    host: 'us-cdbr-east-04.cleardb.com'
});

module.exports = sequelize;
