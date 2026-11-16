async function runTests() {
  const baseUrl = 'http://localhost:3001/api/movimientos';

  console.log('--- TEST 1: Intento de préstamo de equipo en Mantenimiento (id_equipo: 12) ---');
  let res = await fetch(`${baseUrl}/prestamo`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id_equipo: 12, ubicacion_destino_id: 8 })
  });
  let data = await res.json();
  console.log(`Status: ${res.status}, Esperado: 400. Respuesta:`, data);

  console.log('\n--- TEST 2: Intento de préstamo de equipo ya en uso (id_equipo: 9) ---');
  res = await fetch(`${baseUrl}/prestamo`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id_equipo: 9, ubicacion_destino_id: 8 })
  });
  data = await res.json();
  console.log(`Status: ${res.status}, Esperado: 400. Respuesta:`, data);

  console.log('\n--- TEST 3: Préstamo exitoso de equipo disponible (id_equipo: 1 - Bomba Lexx #1) ---');
  res = await fetch(`${baseUrl}/prestamo`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id_equipo: 1,
      ubicacion_destino_id: 9, // Hab 101 Cama B
      usuario_id: 2,
      observaciones: 'Préstamo urgente paciente post-quirúrgico'
    })
  });
  data = await res.json();
  console.log(`Status: ${res.status}, Esperado: 201. Respuesta:`, data.success, data.message, data.data?.nombre_ubicacion_destino);

  console.log('\n--- TEST 4: Intento de reingreso SIN Bioseguridad LT8 ---');
  res = await fetch(`${baseUrl}/retorno`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id_equipo: 1,
      desinfeccion_realizada: false
    })
  });
  data = await res.json();
  console.log(`Status: ${res.status}, Esperado: 400. Respuesta:`, data);

  console.log('\n--- TEST 5: Reingreso exitoso CON Bioseguridad LT8 ---');
  res = await fetch(`${baseUrl}/retorno`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id_equipo: 1,
      desinfeccion_realizada: true,
      usuario_id: 1,
      observaciones: 'Desinfección con pulverizado LT8 conforme protocolo 5 min'
    })
  });
  data = await res.json();
  console.log(`Status: ${res.status}, Esperado: 200. Respuesta:`, data.success, data.message, data.data?.estado_movimiento);

  console.log('\n--- TEST 6: Consultar historial del equipo 1 ---');
  res = await fetch(`${baseUrl}/historial?id_equipo=1`);
  data = await res.json();
  console.log(`Historial count: ${data.count}. Último movimiento:`, data.data[0]?.estado_movimiento, data.data[0]?.desinfeccion_realizada);
}

runTests().catch(console.error);
