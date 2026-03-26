const {User,dbInstance} = require('../models')
const bcrypt = require('bcrypt')
require('dotenv').config()

const getAllUsers = async (req,res)=>{
    let queryParam = {}
    if (req.query?.search){
        queryParam ={
            where: {
                firstname: {
                    [Op.like]:`%${req.query.search}%`
                }
            }
        }
    }
    const users = await User.findAll(queryParam);
    res.status(200).json ({
            users
        })
}

const getUser = async (req,res)=>{
    const id = req.params.id
    const user = await User.findOne({
        where: {id}
    })
    res.status(200).json ({
            user
        })
}

const createUser = async (req,res)=>{
    const transaction = await dbInstance.transaction()
    try{
        const {username, firstname,lastname,email,password} =req.body
        const hashedPassword = await bcrypt.hash(password,parseInt(process.env.ENCRYPT_SALT))
        const user = await User.create({
            username,
            firstname,
            lastname,
            email,
            password: hashedPassword
        },{transaction})

        transaction.commit()
        return res.status(201).json({
            user: user.clean()
        })
    }
    catch(err){
        transaction.rollback();
        console.log(err.errors)
        return res.status(400).json({
                message: "User not created",
                stacktrace: err.errors,
            });
    }
        
}

const updateUser = async(req,res)=>{
    const transaction = await dbInstance.transaction()
    try{
        const {username, firstname,lastname,email} =req.body
        const user_id = req.params.id
        const user = await User.update({
            username,
            firstname,
            lastname,
            email
        },{
            where: ({ id: user_id}),
            transaction
        })
        transaction.commit()
        return res.status(200).json({
            message: "User succesfuly update",
            user 
        })
    }
    catch(err){
        transaction.rollback()
        return res.status(400).json({
                message: "missing username",
                stacktrace: err.errors
            })
    }
}

const deleteUser = async (req, res) => {
  const transaction = await dbInstance.transaction();

  try {
    const user_id = req.params.id;

    const deleted = await User.destroy({
      where: { id: user_id },
      transaction
    });

    await transaction.commit();

    if (!deleted) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    return res.status(200).json({
      message: "User successfully deleted"
    });

  } catch (err) {
    await transaction.rollback();

    return res.status(500).json({
      message: err.message
    });
  }
};

const desactivateUser = async (req, res)=> {
    const transaction = await dbInstance.transaction();
    try {
        const user_id = req.params.id;

        const user = await User.update({
            active: false
        },  
        {
            where: { id: user_id },
            transaction
        });

        await transaction.commit();
        return res.status(200).json({
            message: "Successfully deactivated",
            user
        });
    } catch (error) {
        await transaction.rollback();
        return res.status(400).json({
            message: "Error on user deactivation",
            stacktrace: error.errors
        });
    }
 
}

module.exports = {
    getAllUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    desactivateUser
}