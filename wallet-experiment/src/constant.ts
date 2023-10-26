const ENV = import.meta.env;

const parseENV: { [key: string]: string } = {};

Object.entries(ENV).map((env) => {
  if (env[0].includes('VITE')) {
    parseENV[env[0]] = env[1]
  }
});

export const { VITE_TEMPLATE_CLIENT_ID, VITE_FACTORY_ADDRESS } = parseENV;