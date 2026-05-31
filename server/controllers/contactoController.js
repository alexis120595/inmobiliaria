const { Contacto, Propiedad } = require('../models');

exports.getAll = async (req, res) => {
  try {
    const contactos = await Contacto.findAll({ include: [{ model: Propiedad }] });
    res.json(contactos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const contacto = await Contacto.findByPk(req.params.id, { include: [{ model: Propiedad }] });
    if (!contacto) return res.status(404).json({ error: 'Contacto no encontrado' });
    res.json(contacto);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const contacto = await Contacto.create(req.body);
    
    // Intentar enviar el email de notificación en segundo plano
    let propiedad = null;
    if (req.body.propiedad_id) {
      try {
        propiedad = await Propiedad.findByPk(req.body.propiedad_id);
      } catch (dbErr) {
        console.error('Error al buscar la propiedad asociada para enviar el email:', dbErr);
      }
    }

    const { sendContactEmail } = require('../services/emailService');
    sendContactEmail(contacto.toJSON ? contacto.toJSON() : contacto, propiedad ? (propiedad.toJSON ? propiedad.toJSON() : propiedad) : null);

    res.status(201).json(contacto);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const contacto = await Contacto.findByPk(req.params.id);
    if (!contacto) return res.status(404).json({ error: 'Contacto no encontrado' });
    await contacto.update(req.body);
    res.json(contacto);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const contacto = await Contacto.findByPk(req.params.id);
    if (!contacto) return res.status(404).json({ error: 'Contacto no encontrado' });
    await contacto.destroy();
    res.json({ message: 'Contacto eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
