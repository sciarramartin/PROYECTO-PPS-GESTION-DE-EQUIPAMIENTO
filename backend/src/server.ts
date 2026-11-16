import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors({
  origin: '*', // Permitir llamadas desde la app web o desde el móvil/Capacitor
}));
app.use(express.json());

// Logging middleware
app.use((req, _res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// Rutas de la API
app.use('/api', routes);

// Ruta de health check
app.get('/health', (_req, res) => {
  res.json({
    status: 'OK',
    service: 'CPVS - API Gestión de Equipamiento Biomédico',
    institution: 'Clínica Privada Vélez Sarsfield',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`  SISTEMA DE GESTIÓN Y TRAZABILIDAD BIOMÉDICA (CPVS)`);
  console.log(`  Backend API REST iniciado en: http://localhost:${PORT}`);
  console.log(`  Health Check: http://localhost:${PORT}/health`);
  console.log(`======================================================\n`);
});

export default app;
