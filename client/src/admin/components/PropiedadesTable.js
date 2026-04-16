import React from 'react';

const PropiedadesTable = ({ propiedades, onEdit, onDelete }) => (
  <div className="table-container">
    <table className="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Título</th>
          <th>Descripción</th>
          <th>Tipo</th>
          <th>Operación</th>
          <th>Dirección</th>
          <th>Localidad</th>
          <th>Provincia</th>
          <th>País</th>
          <th>Precio</th>
          <th>Moneda</th>
          <th>Sup. Cubierta</th>
          <th>Sup. Total</th>
          <th>Dormitorios</th>
          <th>Baños</th>
          <th>Ambientes</th>
          <th>Plantas</th>
          <th>Garaje</th>
          <th>Antigüedad</th>
          <th>Condición</th>
          <th>Estado</th>
          <th>Agente</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {propiedades.map((p) => (
          <tr key={p.id}>
            <td>{p.id}</td>
            <td>{p.titulo}</td>
            <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.descripcion}</td>
            <td>{p.tipo_propiedad}</td>
            <td>{p.operacion}</td>
            <td>{p.direccion}</td>
            <td>{p.localidad}</td>
            <td>{p.provincia}</td>
            <td>{p.pais}</td>
            <td>{p.precio}</td>
            <td>{p.moneda}</td>
            <td>{p.superficie_cubierta}</td>
            <td>{p.superficie_total}</td>
            <td>{p.dormitorios}</td>
            <td>{p.banos}</td>
            <td>{p.ambientes}</td>
            <td>{p.plantas}</td>
            <td>{p.garaje}</td>
            <td>{p.antiguedad}</td>
            <td>{p.condicion}</td>
            <td>{p.estado}</td>
            <td>{p.Usuario ? p.Usuario.nombre : '-'}</td>
            <td>
              <div className="table-actions">
                <button onClick={() => onEdit(p)} className="btn btn-primary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>Editar</button>
                <button onClick={() => onDelete(p)} className="btn btn-danger" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>Eliminar</button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default PropiedadesTable;
