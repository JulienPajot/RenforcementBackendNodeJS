const {Document,dbInstance} = require('../models')

const getDocumentById = async (req,res)=>{
    const id = req.params.id
    const document = await Document.findOne({
        where: {id}
    })
    res.status(200).json ({
            document
        })
}

const createDocument = async (req,res)=>{
    const transaction = await dbInstance.transaction()
    try{
        const {type, path,validated} =req.body
        const document = await Document.create({
            type,
            path,
            validated
        },{transaction})
        transaction.commit()
        return res.status(201).json({
            document 
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


const updateDocument = async(req,res)=>{
    const transaction = await dbInstance.transaction()
    try{
        const {type, path,validated} =req.body
        const document_id = req.params.id
        const document = await Document.update({
            type,
            path,
            validated
        },{
            where: (id),
            transaction
        })
        transaction.commit()
        return res.status(200).json({
            message: "Document succesfuly update",
            document 
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

const deleteDocument = async (req, res) => {
  const transaction = await dbInstance.transaction();

  try {
    const document_id = req.params.id;

    const deleted = await Document.destroy({
      where: { id: document_id },
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
    getDocumentById,
    createDocument,
    updateDocument,
    deleteDocument
}