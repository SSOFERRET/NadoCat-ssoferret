import { Client, Connection } from "@opensearch-project/opensearch";
import dotenv from "dotenv";

dotenv.config();

const opensearch = new Client({
  node: process.env.OPENSEARCH_URL as string,
  auth: {
    username: process.env.OPENSEARCH_USERNAME as string,
    password: process.env.OPENSEARCH_PASSWORD as string,
  },
  ssl: {
    rejectUnauthorized: false
  }
});

export default opensearch;