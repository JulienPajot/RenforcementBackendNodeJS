const {User,dbInstance} = require('../models')
const getAllUsers = async (req,res)=>{
    let queryParam = {}
    if (req.query?.search){
        queryParam ={
            where: {

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
        const user = await User.create({
            username,
            firstname,
            lastname,
            email,
            password
        },{transaction})
        transaction.commit()
        return res.status(201).json({
            user 
        })
    }
    catch(err){
        transaction.rollback();
        return res.status(400).json({
                message: "missing username",
                stacktrace: err.errors
            });
    }
        
}

const updateUser = async(req,res)=>{
    const transaction = await dbInstance.transaction()
    try{
        const {username, firstname,lastname,email,password} =req.body
        const user_id = req.params.id
        const user = await User.update({
            username,
            firstname,
            lastname,
            email,
            password
        },{
            where: (id),
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

module.exports = {
    getAllUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser
}