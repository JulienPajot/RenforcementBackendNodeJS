const { Request, Sinister, dbInstance } = require('../models');

const advanceExpertise = async (req, res) => {
  const transaction = await dbInstance.transaction();
  try {
    const request_id = req.params.id;

    const current = await Request.findOne({ where: { id: request_id }, transaction });
    if (!current) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Dossier introuvable' });
    }

    let updateData = {};
    let message = '';

    switch (current.status) {
      case 'PENDING':
        updateData = { status: 'IN_PROGRESS' };
        message = 'Expertise en attente de retour';
        break;

      case 'IN_PROGRESS': {
        const { expertise_plan_date } = req.body;
        updateData = { status: 'EXPERTISE_PLANNED', expertise_plan_date };
        message = 'Expertise planifiée';
        break;
      }

      case 'EXPERTISE_PLANNED': {
        const { expertise_effective_date } = req.body;
        updateData = { status: 'EXPERTISE_DONE', expertise_effective_date };
        message = 'Expertise réalisée';
        break;
      }

      case 'EXPERTISE_DONE': {
        const { expertise_report_recieved, diagnostic, diagnostic_report_file } = req.body;
        const nextStatus = diagnostic === 'REPAIRABLE' ? 'REPAIR_PLANNED' : 'EXPERTISE_DONE';
        updateData = { status: nextStatus, expertise_report_recieved, diagnostic, diagnostic_report_file };
        message = `Rapport enregistré — diagnostic: ${diagnostic}`;
        break;
      }

      default:
        await transaction.rollback();
        return res.status(400).json({ message: `Statut "${current.status}" non géré par le workflow Expertise` });
    }

    await Request.update(updateData, { where: { id: request_id }, transaction });
    await transaction.commit();
    return res.status(200).json({ message, status: updateData.status });

  } catch (err) {
    await transaction.rollback();
    return res.status(400).json({ message: err.message, stacktrace: err.errors });
  }
};

const advanceScenario1 = async (req, res) => {
  const transaction = await dbInstance.transaction();
  try {
    const request_id = req.params.id;

    const current = await Request.findOne({
      where: { id: request_id },
      include: [{ model: Sinister, as: 'sinister' }],
      transaction,
    });

    if (!current) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Dossier introuvable' });
    }

    let updateData = {};
    let message = '';

    if (!current.case1_date_of_service_plan) {
      const { case1_date_of_service_plan } = req.body;
      updateData = { case1_date_of_service_plan };
      message = 'Intervention planifiée';

    } else if (!current.case1_pickup_plan_date) {
      const { case1_pickup_plan_date } = req.body;
      updateData = { case1_pickup_plan_date };
      message = 'Prise en charge du véhicule planifiée';

    } else if (!current.case1_pickup_effective_date) {
      const { case1_pickup_effective_date } = req.body;
      updateData = { case1_pickup_effective_date };
      message = 'Prise en charge du véhicule réalisée';

    } else if (!current.case1_date_of_service_effective) {
      const { case1_date_of_service_effective } = req.body;
      updateData = { status: 'REPAIR_DONE', case1_date_of_service_effective };
      message = 'Intervention démarrée';

    } else if (!current.case1_end_date_of_service) {
      const { case1_end_date_of_service } = req.body;
      updateData = { case1_end_date_of_service };
      message = 'Intervention terminée';

    } else if (!current.case1_return_date_plan) {
      const { case1_return_date_plan } = req.body;
      updateData = { case1_return_date_plan };
      message = 'Restitution planifiée';

    } else if (!current.case1_return_date_effective) {
      const { case1_return_date_effective } = req.body;
      updateData = { case1_return_date_effective };
      message = 'Véhicule restitué';

    } else if (!current.case1_contractor_invoice) {
      const { case1_contractor_invoice_date, case1_contractor_invoice } = req.body;
      updateData = { case1_contractor_invoice_date, case1_contractor_invoice };
      message = 'Facture prestataire reçue';

    } else if (!current.case1_date_contractor_invoice_paid) {
      const { case1_date_contractor_invoice_paid } = req.body;
      updateData = { case1_date_contractor_invoice_paid };
      message = 'Règlement enregistré';

    } else {
      const { case1_third_party_invoice_paid } = req.body;
      const responsability = current.sinister?.driver_engaged_responsability ?? 100;

      if (responsability === 100) {
        updateData = { status: 'CLOSED', closed: true };
        message = 'Dossier clôturé';
      } else {
        const paid = case1_third_party_invoice_paid === true;
        updateData = {
          case1_third_party_invoice_paid: paid,
          closed: paid,
          status: paid ? 'CLOSED' : current.status,
        };
        message = paid ? 'Refacturation tiers validée — dossier clôturé' : 'En attente de règlement tiers';
      }
    }

    await Request.update(updateData, { where: { id: request_id }, transaction });
    await transaction.commit();
    return res.status(200).json({ message, closed: updateData.closed ?? false });

  } catch (err) {
    await transaction.rollback();
    return res.status(400).json({ message: err.message, stacktrace: err.errors });
  }
};

const advanceScenario2 = async (req, res) => {
  const transaction = await dbInstance.transaction();
  try {
    const request_id = req.params.id;

    const current = await Request.findOne({
      where: { id: request_id },
      include: [{ model: Sinister, as: 'sinister' }],
      transaction,
    });

    if (!current) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Dossier introuvable' });
    }

    let updateData = {};
    let message = '';

    if (current.case2_estimated_compensation === null) {
      const { case2_estimated_compensation } = req.body;
      updateData = { case2_estimated_compensation };
      message = 'Estimation communiquée à l\'assuré';

    } else if (current.case2_approved_compensation === null) {
      const { case2_approved_compensation } = req.body;
      updateData = { case2_approved_compensation };
      message = 'Approbation de l\'estimation enregistrée';

    } else if (!current.case2_pickup_plan_date) {
      const { case2_pickup_plan_date, case2_insured_rib } = req.body;
      updateData = { case2_pickup_plan_date, case2_insured_rib };
      message = 'Prise en charge planifiée — RIB enregistré';

    } else if (!current.case2_pickup_effective_date) {
      const { case2_pickup_effective_date } = req.body;
      updateData = { case2_pickup_effective_date };
      message = 'Prise en charge réalisée';

    } else {
      const { case2_compensation_payment_date, case2_third_party_invoice_paid } = req.body;
      const responsability = current.sinister?.driver_engaged_responsability ?? 100;

      if (responsability === 100) {
        updateData = { case2_compensation_payment_date, status: 'CLOSED', closed: true };
        message = 'Indemnisation réglée — dossier clôturé';
      } else {
        const paid = case2_third_party_invoice_paid === true;
        updateData = {
          case2_compensation_payment_date,
          case2_third_party_invoice_paid: paid,
          closed: paid,
          status: paid ? 'CLOSED' : current.status,
        };
        message = paid ? 'Refacturation tiers validée — dossier clôturé' : 'En attente de règlement tiers';
      }
    }

    await Request.update(updateData, { where: { id: request_id }, transaction });
    await transaction.commit();
    return res.status(200).json({ message, closed: updateData.closed ?? false });

  } catch (err) {
    await transaction.rollback();
    return res.status(400).json({ message: err.message, stacktrace: err.errors });
  }
};

module.exports = {
  advanceExpertise,
  advanceScenario1,
  advanceScenario2,
};