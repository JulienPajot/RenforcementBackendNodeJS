const { Request, Sinister, Document, dbInstance } = require('../models')

const getAllRequests = async (req, res) => {

    const requests = await Request.findAll()

    res.status(200).json({
        requests
    })
}

const getRequest = async (req, res) => {
    const id = req.params.id

    const request = await Request.findOne({
        where: { id },
        include: [
            { model: Sinister, as: 'sinister' },
            { model: Document, as: 'diagnosticReport' },
            { model: Document, as: 'contractorInvoice' },
            { model: Document, as: 'insuredRib' }
        ]
    })

    if (!request) {
        return res.status(404).json({
            message: "Request not found"
        })
    }

    res.status(200).json({
        request
    })
}


const createRequest = async (req, res) => {
    const transaction = await dbInstance.transaction()

    try {
        const { sinister_id } = req.body

        const request = await Request.create({
            sinister_id,
            status: "PENDING"
        }, { transaction })

        await transaction.commit()

        return res.status(201).json({
            request
        })

    } catch (err) {
        await transaction.rollback()

        return res.status(400).json({
            message: "Error creating request",
            stacktrace: err.errors
        })
    }
}


const updateRequest = async (req, res) => {
    const transaction = await dbInstance.transaction()

    try {
        const request_id = req.params.id

        const request = await Request.update(
            req.body,
            {
                where: { id: request_id },
                transaction
            }
        )

        await transaction.commit()

        return res.status(200).json({
            message: "Request successfully updated",
            request
        })

    } catch (err) {
        await transaction.rollback()

        return res.status(400).json({
            message: "Error updating request",
            stacktrace: err.errors
        })
    }
}


const deleteRequest = async (req, res) => {
    const transaction = await dbInstance.transaction()

    try {
        const request_id = req.params.id

        const deleted = await Request.destroy({
            where: { id: request_id },
            transaction
        })

        await transaction.commit()

        if (!deleted) {
            return res.status(404).json({
                message: "Request not found"
            })
        }

        return res.status(200).json({
            message: "Request successfully deleted"
        })

    } catch (err) {
        await transaction.rollback()

        return res.status(500).json({
            message: err.message
        })
    }
}


module.exports = {
    getAllRequests,
    getRequest,
    createRequest,
    updateRequest,
    deleteRequest
}