# SQL Analytics Package

This folder contains a production-style SQL analytics workflow for API/system performance monitoring.

## Prerequisites

- MySQL 8.0+ (uses window functions such as CUME_DIST and window aggregates)
- A database user with permissions to create tables, indexes, and procedures

## Execution Order

Run scripts in this order:

1. `00_schema.sql`
2. `00_reset_data.sql` (optional, for clean reruns)
3. `01_basic_analytics.sql`
4. `02_advanced_analytics.sql`
5. `03_kpi_analytics.sql`
6. `04_master_analytics.sql`

## Data Assumptions

- `execution_time` in `system_logs` is stored in milliseconds.
- Most latency outputs are standardized in seconds (`*_sec`).
- Default SLA breach threshold used in KPI/master scripts is `0.5` seconds.

## Quick Validation Queries

After loading data, you can validate quickly with:

```sql
USE performance_monitoring;
SELECT COUNT(*) AS total_logs FROM system_logs;
SELECT COUNT(*) AS total_etl_runs FROM etl_metrics;
SELECT COUNT(*) AS total_rejected FROM rejected_logs;
```

## Notes

- `04_master_analytics.sql` includes consolidated KPI and anomaly detection outputs.
- `sp_archive_old_system_logs` in `00_schema.sql` can archive logs older than 90 days.