const getAllUsers = (req,res)=>{
    res.status(200).json ({
            user: []
        })
}

const getUser = (req,res)=>{
    res.status(200).json ({
            user: req.params.id
        })
}

const createUser = (req,res)=>{
    const result = validationResult(req)
        if (!result.isEmpty()){
            res.status(400).json({
                message: "missing username"
            })
        }
        const user = req.body
        res.status(201).json({
            user: user 
        })
}

const updateUser = (req,res)=>{
    res.status(200).json ({
            message: "succesfully update",
            user: req.body
        })
}

const deleteUser = (req,res)=>{
    res.status(200).json ({
            message: "succesfully delete"
        })
}

module.exports = {
    getAllUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser
}