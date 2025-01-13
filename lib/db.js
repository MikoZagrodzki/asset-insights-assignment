import { Client } from 'pg';

const client = new Client({
  //! Normally that would be in .env
  connectionString: 'postgres://default:ZiAOxtb4I9mg@ep-plain-band-a2vt5ez8.eu-central-1.aws.neon.tech:5432/verceldb?sslmode=require',
});

client.connect();

export default client;