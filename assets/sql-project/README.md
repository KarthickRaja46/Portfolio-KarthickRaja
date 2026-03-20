# Database Performance Insights

Production-style SQL monitoring project with analytics, alerting, ETL visibility, and health scoring.

## Highlights

- MySQL 8+ schema for logs, alerts, ETL runs, rejected rows, and archives
- 36 curated analytics queries grouped by business priority
- Manual CSV ingestion workflow for full operator control
- Query outputs standardized with explicit units:
	- Percent fields: `_pct`
	- Time fields in seconds: `_sec`
	- Count fields: `_count`

## Repository Structure

- [log_simulator.py](log_simulator.py): data simulation and CSV generation
- [data/system_logs.csv](data/system_logs.csv): source CSV dataset
- [sql/schema.sql](sql/schema.sql): schema, indexes, archive procedure, manual load template
- [sql/alerts.sql](sql/alerts.sql): alert threshold config and trigger
- [sql/analytics.sql](sql/analytics.sql): analytics query catalog (36 queries)

## Quick Start

### 1) Prerequisites

- Python 3.12+
- MySQL 8.0+

### 2) Create Database Objects

Run SQL scripts in this order:

1. [sql/schema.sql](sql/schema.sql)
2. [sql/alerts.sql](sql/alerts.sql)
3. [sql/analytics.sql](sql/analytics.sql)

### 3) Generate or Extend CSV Data

```bash
python log_simulator.py csv --csv data/system_logs.csv --ensure-base 100 --append 50
```

### 4) Load CSV Manually

Use the manual `LOAD DATA LOCAL INFILE` block in [sql/schema.sql](sql/schema.sql).

## Analytics Sections

- Basic Metrics
- Advanced Metrics
- Priority Metrics
- Expanded Metrics

## Professional Standards Used

- GitHub Actions CI for Python syntax and SQL file checks
- Contribution guide, security policy, and issue/PR templates
- License included

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## Security

See [SECURITY.md](SECURITY.md).

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE).
