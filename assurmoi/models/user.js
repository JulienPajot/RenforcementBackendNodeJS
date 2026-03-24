const { Model, DataTypes, Sequelize } = require('sequelize')
const { dbInstance } = require('.')

const User = (Sequelize, DataTypes) =>{
    class User extends Model {}

    User.init({
        username:{
            type: DataTypes.STRING(50),
            allowNull: false
        },
        password:{
            type: DataTypes.STRING,
            allowNull: false
        },
        firstname:{
            type: DataTypes.STRING(50),
            allowNull: true
        },
        lastname:{
            type: DataTypes.STRING(50),
            allowNull: true
        },
        email: DataTypes.STRING
    },{
        sequelize:dbInstance,
        modelName: 'User'
    }
    )
    return User
}

module.exports = User