export const logger = (url) => {
  console.log(`[${new Date().toString()}] ✅ Usuario accedió a ${url}`);
};

export const loggerError = (req) => {
  console.error(`[${new Date().toString()}] ❌ Usuario recibió un error al acceder a ${req.url}`);
};

export const data = [
  { id: 1, titulo: 'Película A', año: 2023 },
  { id: 2, titulo: 'Película B', año: 2024 }
];