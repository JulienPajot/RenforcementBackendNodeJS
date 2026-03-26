const { Sinister, Request } = require("../models");
const getAllSinisters = async (req, res) => {
  try {
    const sinisters = await Sinister.findAll();

    res.json(sinisters);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur récupération sinistres" });
  }
};

const getSinisterById = async (req, res) => {
  try {
    const sinister = await Sinister.findByPk(req.params.id);

    if (!sinister) {
      return res.status(404).json({ message: "Sinistre introuvable" });
    }

    res.json(sinister);
  } catch (error) {
    res.status(500).json({ message: "Erreur récupération sinistre" });
  }
};

const createSinister = async (req, res) => {
  try {
    const data = req.body;
    const userId = req.user?.id || null;

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
    });

    res.status(201).json(sinister);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur création sinistre" });
  }
};

const updateSinister = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const userId = req.user?.id || null;

    const sinister = await Sinister.findByPk(id);
    if (!sinister) {
      return res.status(404).json({ message: "Sinistre introuvable" });
    }

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

    res.json(sinister);
  } catch (error) {
    res.status(500).json({ message: "Erreur update" });
  }
};

const validateSinister = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id || null;

    const sinister = await Sinister.findByPk(id);
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
    const { id } = req.params;
    const userId = req.user?.id || null;

    const sinister = await Sinister.findByPk(id);
    if (!sinister) {
      return res.status(404).json({ message: "Sinistre introuvable" });
    }

    await sinister.destroy();

    res.json({ message: "Supprimé" });
  } catch (error) {
    res.status(500).json({ message: "Erreur suppression" });
  }
};

module.exports = {
  getAllSinisters,
  getSinisterById,
  createSinister,
  updateSinister,
  validateSinister,
  deleteSinister,
};