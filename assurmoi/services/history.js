const { History, dbInstance } = require('../models');

const getAllHistories = async (req, res) => {
  try {
    const histories = await History.findAll();

    res.status(200).json({ histories });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur récupération historique', error: err.message });
  }
};

const getHistoryById = async (req, res) => {
  try {
    const id = req.params.id;
    const history = await History.findOne();

    if (!history) return res.status(404).json({ message: 'Historique introuvable' });

    res.status(200).json({ history });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur récupération historique', error: err.message });
  }
};

const createHistory = async (req, res) => {
  const transaction = await dbInstance.transaction();
  try {
    const { entity, field, value, user_id } = req.body;

    if (!entity || !user_id) {
      return res.status(400).json({ message: 'entity et user_id requis' });
    }

    const history = await History.create(
      { entity, field, value, user_id },
      { transaction }
    );

    await transaction.commit();
    res.status(201).json({ history });
  } catch (err) {
    await transaction.rollback();
    console.error(err);
    res.status(500).json({ message: 'Erreur création historique', error: err.message });
  }
};

const updateHistory = async (req, res) => {
  const transaction = await dbInstance.transaction();
  try {
    const id = req.params.id;
    const { entity, field, value, user_id } = req.body;

    const [updatedRows] = await History.update(
      { entity, field, value, user_id },
      { where: { id }, transaction }
    );

    if (!updatedRows) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Historique introuvable' });
    }

    const updatedHistory = await History.findByPk(id);
    await transaction.commit();
    res.status(200).json({ message: 'Historique mis à jour', history: updatedHistory });
  } catch (err) {
    await transaction.rollback();
    console.error(err);
    res.status(500).json({ message: 'Erreur mise à jour historique', error: err.message });
  }
};

const deleteHistory = async (req, res) => {
  const transaction = await dbInstance.transaction();
  try {
    const id = req.params.id;

    const deletedRows = await History.destroy({ where: { id }, transaction });
    if (!deletedRows) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Historique introuvable' });
    }

    await transaction.commit();
    res.status(200).json({ message: 'Historique supprimé' });
  } catch (err) {
    await transaction.rollback();
    console.error(err);
    res.status(500).json({ message: 'Erreur suppression historique', error: err.message });
  }
};

module.exports = {
  getAllHistories,
  getHistoryById,
  createHistory,
  updateHistory,
  deleteHistory,
};