# Med Indication Project

## Project Structure (Monorepo)

```
med-indication-project/
├── drug-service-py/        # Python microservice for parsing, mapping, and ingestion
├── api-gateway-node/       # NestJS backend API with auth, roles, and Mongo integration
├── web-frontend/
├── docker-compose.yml 
└── README.md
```

## Responsibilities Split

| Service           | Language | Responsibilities                                        |
|------------------|----------|----------------------------------------------------------|
| `med-service-py` | Python   | Parse drug labels, map indications, extract eligibility  |
| `api-gateway-node` | Node.js | API access, authentication, RBAC, CRUD on mappings      |
| `web-frontend`     | React   | Frontend for drug search, program visualization (optional) |

## Planned Features
- [x] Scrape or parse DailyMed drug labels for Dupixent. Extract relevant sections describing indications.
- [x] Parse the MyWay Copay Card. Extract structured information. Infer missing details using rule-based transformations or generative AI. Standardize the format according to the example output included in this
document
- [x] Map extracted indications to ICD-10 codes using an open-source dataset.
- [ ] Handle edge cases like: synonyms, drugs with multiple indications, and unmappable conditions.
- [ ] Use generative AI to parse and summarize the EligibilityDetails text field into structured
requirements
- [x] Convert free-text eligibility conditions into structured JSON key-value pairs.
- [ ] Store structured drug-indication mappings in a database or NoSQL store.
- [ ] Make mappings queryable via an API.
- [ ] Implement CRUD operations: Create, read, update, and delete drug-indication mappings.
- [ ] Users should be able to register and log in
- [ ] Implement role-based access control.
- [ ] Include Swagger or Postman workspace for API testing
- [ ] Ensure consistent data types (e.g., true/false, numbers as strings).
- [ ] Implement validation rules for missing or ambiguous data.
- [ ] Provide an endpoint (/programs/<program_id>) returning structured JSON.
- [ ] Supports querying program details dynamically.
- [x] Use a database (SQL or NoSQL) to store: Drug-indication mappings and User authentication data
- [ ] Keep business rules independent of the API and data layers.
- [ ] Implement validation logic for incoming data.

##  Extra Features
- [ ] AI Extraction Improvement: Use an LLM (GPT, Claude, etc.) to extract more nuanced eligibility criteria. For example, detect age limits, geographic restrictions, or insurance conditions from free-text fields.
- [ ] Data Enrichment: Implement additional rules-based logic for missing fields. Example: If expiration date is missing, assume default end-of-year.
- [ ] Performance Optimization: Preprocess and cache structured data for API efficiency. Allow filtering results dynamically based on parameters. Implement rate-limiting and security best practices.
