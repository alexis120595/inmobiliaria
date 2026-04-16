import React from 'react';

const AgentesTable = ({ agentes, onEdit, onDelete }) => (
  <div className="table-container">
    <table className="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Email</th>
          <th>Teléfono</th>
          <th>Foto</th>
          <th style={{ textAlign: 'center' }}>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {agentes.map((a) => (
          <tr key={a.id}>
            <td>{a.id}</td>
            <td>{a.nombre}</td>
            <td>{a.email}</td>
            <td>{a.telefono}</td>
            <td>{a.foto_url ? <img src={a.foto_url} alt="foto" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} /> : '-'}</td>
            <td>
              <div className="table-actions">
                <button onClick={() => onEdit(a)} className="btn btn-primary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>Editar</button>
                <button onClick={() => onDelete(a)} className="btn btn-danger" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>Eliminar</button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default AgentesTable;
