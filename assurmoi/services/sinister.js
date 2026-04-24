const { Sinister, Request, Document} = require("../models");

const getAllSinisters = async (req, res) => {
  try {
    const sinisters = await Sinister.findAll({
      where: { user_id: req.user.id },
      include: [
        {
          model: Request,
          as: "requests",
          attributes: ["id", "status"],
        },
      ],
    });

    res.json({ sinisters });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur récupération sinistres" });
  }
};

const getSinisterById = async (req, res) => {
  try {
    const sinister = await Sinister.findOne({
      where: { id: req.params.id, user_id: req.user.id },
      include: [
        {
          model: Request,
          as: "requests",
          attributes: ["id", "status"],
        },
      ],
    });

    if (!sinister) {
      return res.status(404).json({ message: "Sinistre introuvable" });
    }

    res.json({ sinister });
  } catch (error) {
    res.status(500).json({ message: "Erreur récupération sinistre" });
  }
};

const createSinister = async (req, res) => {
  try {
    const data = req.body;

    const sinister = await Sinister.create({
      plate: data.plate,
      driver_firstname: data.driver_firstname,
      driver_lastname: data.driver_lastname,
      driver_is_insured: data.driver_is_insured,
      call_datetime: new Date(data.call_datetime),
      sinister_datetime: new Date(data.sinister_datetime),
      context: data.context,
      driver_responsability: data.driver_responsability,
      driver_engaged_responsability: data.driver_responsability
        ? data.driver_engaged_responsability
        : 0,
      cni_driver: data.cni_driver ?? null,
      vehicule_registration_certificate: data.vehicule_registration_certificate ?? null,
      insurance_certificate: data.insurance_certificate ?? null,
      validated: false,
      user_id: req.user.id,
    });

    res.status(201).json({ sinister });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur création sinistre" });
  }
};

const updateSinister = async (req, res) => {
  try {
    const sinister = await Sinister.findOne({
      where: { id: req.params.id, user_id: req.user.id },
    });

    if (!sinister) {
      return res.status(404).json({ message: "Sinistre introuvable" });
    }

    const data = req.body;
    await sinister.update({
      ...data,
      ...(data.call_datetime && { call_datetime: new Date(data.call_datetime) }),
      ...(data.sinister_datetime && { sinister_datetime: new Date(data.sinister_datetime) }),
      ...(data.driver_responsability !== undefined && {
        driver_engaged_responsability: data.driver_responsability
          ? data.driver_engaged_responsability
          : 0,
      }),
    });

    res.json({ sinister });
  } catch (error) {
    res.status(500).json({ message: "Erreur update" });
  }
};

const validateSinister = async (req, res) => {
  try {
    const sinister = await Sinister.findOne({
      where: { id: req.params.id, user_id: req.user.id },
    });

    if (!sinister) {
      return res.status(404).json({ message: "Sinistre introuvable" });
    }

    await sinister.update({ validated: true });

    res.json({ sinister });
  } catch (error) {
    res.status(500).json({ message: "Erreur validation" });
  }
};

const deleteSinister = async (req, res) => {
  try {
    const sinister = await Sinister.findOne({
      where: { id: req.params.id, user_id: req.user.id },
    });

    if (!sinister) {
      return res.status(404).json({ message: "Sinistre introuvable" });
    }

    await sinister.destroy();

    res.json({ message: "Supprimé" });
  } catch (error) {
    res.status(500).json({ message: "Erreur suppression" });
  }
};


const LABEL_TO_FIELD = {
  CNI:          'cni_driver',
  REGISTRATION: 'vehicule_registration_certificate',
  INSURANCE:    'insurance_certificate',
};

const LABEL_TO_TYPE = {
  CNI:          'CNI',
  REGISTRATION: 'REGISTRATION',
  INSURANCE:    'INSURANCE',
};

const uploadSinisterDocument = async (req, res) => {
  try {
    const sinister_id = req.params.id;
    const { label }   = req.body;
    const file        = req.file;

    if (!file) {
      return res.status(400).json({ message: 'Aucun fichier reçu' });
    }

    if (!LABEL_TO_FIELD[label]) {
      return res.status(400).json({ message: `Libellé invalide : ${label}` });
    }

    const sinister = await Sinister.findByPk(sinister_id);
    if (!sinister) {
      return res.status(404).json({ message: 'Sinistre introuvable' });
    }
    const document = await Document.create({
      type:      LABEL_TO_TYPE[label],
      path:      file.path,
      validated: false,
    });
    await sinister.update({ [LABEL_TO_FIELD[label]]: document.id });

    return res.status(201).json({
      message:  'Document enregistré',
      document,
    });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
module.exports = {
  getAllSinisters,
  getSinisterById,
  createSinister,
  updateSinister,
  validateSinister,
  uploadSinisterDocument,
  deleteSinister,
};