const nodemailer = require('nodemailer');

// Verificar si las variables de SMTP están configuradas y no son los valores por defecto
const isEmailConfigured = () => {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  return !!(
    host && host !== 'smtp.example.com' &&
    user && user !== 'user@example.com' &&
    pass && pass !== 'password'
  );
};

const getEmailTo = () => {
  return process.env.EMAIL_TO || process.env.SMTP_USER;
};

const getTransporter = () => {
  if (!isEmailConfigured()) {
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: parseInt(process.env.SMTP_PORT || '587', 10) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

/**
 * Envía un correo de notificación sobre un nuevo contacto recibido.
 * @param {Object} contacto - Datos del contacto
 * @param {Object} [propiedad] - Propiedad asociada (opcional)
 */
const sendContactEmail = async (contacto, propiedad = null) => {
  try {
    if (!isEmailConfigured()) {
      console.log('📬 [Email Service] El envío de correos no está configurado o tiene valores por defecto. Se omitirá el envío.');
      return false;
    }

    const transporter = getTransporter();
    if (!transporter) return false;

    const emailTo = getEmailTo();
    const emailFrom = process.env.EMAIL_FROM || `"Inmobiliaria" <${process.env.SMTP_USER}>`;

    const subject = propiedad 
      ? `Nueva consulta por propiedad: ${propiedad.titulo}`
      : `Nueva consulta de contacto general`;

    // Armar el diseño HTML premium del correo
    const htmlContent = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        <div style="background-color: #dc2626; color: white; padding: 24px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 0.5px;">Nueva Consulta de Contacto</h1>
          <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.9;">Inmobiliaria Premium</p>
        </div>
        <div style="padding: 24px; background-color: #ffffff;">
          <h2 style="color: #1e293b; font-size: 18px; margin-top: 0; margin-bottom: 20px; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px;">Detalles del Contacto</h2>
          
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-weight: 600; width: 140px; vertical-align: top;">Nombre:</td>
              <td style="padding: 8px 0; color: #1e293b; vertical-align: top;">${contacto.nombre}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-weight: 600; vertical-align: top;">Email:</td>
              <td style="padding: 8px 0; color: #1e293b; vertical-align: top;">
                <a href="mailto:${contacto.email}" style="color: #2563eb; text-decoration: none;">${contacto.email || 'No proporcionado'}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-weight: 600; vertical-align: top;">Teléfono:</td>
              <td style="padding: 8px 0; color: #1e293b; vertical-align: top;">${contacto.telefono || 'No proporcionado'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-weight: 600; vertical-align: top;">Fecha:</td>
              <td style="padding: 8px 0; color: #1e293b; vertical-align: top;">${new Date().toLocaleString('es-AR')}</td>
            </tr>
          </table>

          ${propiedad ? `
            <h2 style="color: #1e293b; font-size: 18px; margin-top: 0; margin-bottom: 20px; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px;">Propiedad de Interés</h2>
            <div style="background-color: #f8fafc; border-left: 4px solid #dc2626; padding: 15px; border-radius: 4px; margin-bottom: 24px;">
              <p style="margin: 0 0 5px 0; font-weight: bold; color: #1e293b;">${propiedad.titulo}</p>
              <p style="margin: 0 0 5px 0; color: #475569; font-size: 13px;">Tipo: ${propiedad.tipo_propiedad} | Operación: ${propiedad.operacion}</p>
              <p style="margin: 0; color: #64748b; font-size: 13px;">Precio: ${propiedad.moneda || 'U$D'} ${propiedad.precio ? Number(propiedad.precio).toLocaleString('es-AR') : 'Consultar'}</p>
            </div>
          ` : ''}

          <h2 style="color: #1e293b; font-size: 18px; margin-top: 0; margin-bottom: 12px; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px;">Mensaje de Consulta</h2>
          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 16px; color: #334155; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${contacto.mensaje || 'Sin mensaje.'}</div>
        </div>
        <div style="background-color: #f1f5f9; color: #64748b; font-size: 12px; text-align: center; padding: 16px; border-top: 1px solid #e2e8f0;">
          Este es un correo automático enviado desde el sitio web de Inmobiliaria Premium.
        </div>
      </div>
    `;

    const info = await transporter.sendMail({
      from: emailFrom,
      to: emailTo,
      subject: subject,
      html: htmlContent,
      replyTo: contacto.email || undefined,
    });

    console.log(`✉️ [Email Service] Correo enviado con éxito. ID: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error('❌ [Email Service] Error al enviar el correo:', error);
    return false;
  }
};

module.exports = {
  sendContactEmail,
  isEmailConfigured
};
