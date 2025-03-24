# Med Indication Project

## Postman Workspace
[![Run in Postman](https://run.pstmn.io/button.svg)](https://www.postman.com/hugoalkimimdev/med-indication-project/collection/797qg5s/med-project)

## Project Structure (Monorepo)

```
med-indication-project/
├── drug-service-py/        # Python microservice for parsing, mapping, and ingestion
├── api-gateway-node/       # NestJS backend API with auth, roles, and Mongo integration
├── docker-compose.yml 
└── README.md
```

## Responsibilities Split

| Service           | Language | Responsibilities                                        |
|------------------|----------|----------------------------------------------------------|
| `med-service-py` | Python   | Parse drug labels, map indications, extract eligibility  |
| `api-gateway-node` | Node.js | API access, authentication, RBAC, CRUD on mappings      |
