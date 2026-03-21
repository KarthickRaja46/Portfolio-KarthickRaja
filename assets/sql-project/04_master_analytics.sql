USE performance_monitoring;

-- =============================================================================
-- MERGED ANALYTICS MASTER
-- =============================================================================

-- ===== From analytics_basic.sql =====

-- =============================================================================
-- BASIC ANALYTICS
-- =============================================================================

-- Total Requests
SELECT COUNT(*) AS total_requests
FROM system_logs;

-- Success Rate (%)
SELECT ROUND(
    SUM(CASE WHEN status = 200 THEN 1 ELSE 0 END) * 100.0
    / NULLIF(COUNT(*), 0),
2) AS success_rate_pct
FROM system_logs;

-- Error Rate (%)
SELECT ROUND(
    SUM(CASE WHEN status = 500 THEN 1 ELSE 0 END) * 100.0
    / NULLIF(COUNT(*), 0),
2) AS error_rate_pct
FROM system_logs;

-- Average Response Time (seconds)
SELECT ROUND(AVG(execution_time) / 1000.0, 3) AS avg_latency_sec
FROM system_logs;

-- Slow Requests (>1 sec)
SELECT COUNT(*) AS slow_requests
FROM system_logs
WHERE execution_time > 1000;

-- Daily Average Latency
SELECT
    DATE(`timestamp`) AS request_date,
    ROUND(AVG(execution_time) / 1000.0, 3) AS avg_latency_sec
FROM system_logs
GROUP BY request_date
ORDER BY request_date;

-- Requests Per Minute
SELECT
    DATE_FORMAT(`timestamp`, '%Y-%m-%d %H:%i:00') AS minute_bucket,
    COUNT(*) AS requests_per_minute
FROM system_logs
GROUP BY minute_bucket
ORDER BY minute_bucket DESC
LIMIT 60;

-- Hourly Error Rate
SELECT
    HOUR(`timestamp`) AS hour,
    ROUND(
        SUM(CASE WHEN status = 500 THEN 1 ELSE 0 END) * 100.0
        / NULLIF(COUNT(*), 0),
    2) AS error_rate_pct
FROM system_logs
GROUP BY hour
ORDER BY hour;

-- Daily Status Trend
SELECT
    DATE(`timestamp`) AS request_date,
    status,
    COUNT(*) AS request_count
FROM system_logs
GROUP BY request_date, status
ORDER BY request_date DESC;

-- Top Endpoints
SELECT endpoint, COUNT(*) AS request_count
FROM system_logs
GROUP BY endpoint
ORDER BY request_count DESC
LIMIT 10;

-- Endpoint Latency Summary
SELECT
    endpoint,
    ROUND(AVG(execution_time) / 1000.0, 3) AS avg_latency_sec,
    ROUND(MAX(execution_time) / 1000.0, 3) AS max_latency_sec
FROM system_logs
GROUP BY endpoint
ORDER BY avg_latency_sec DESC;

-- Endpoint Error Rate
SELECT
    endpoint,
    ROUND(
        SUM(CASE WHEN status = 500 THEN 1 ELSE 0 END) * 100.0
        / NULLIF(COUNT(*), 0),
    2) AS error_rate_pct
FROM system_logs
GROUP BY endpoint
ORDER BY error_rate_pct DESC;

-- SLA Breach Rate (>500 ms)
SELECT
    endpoint,
    ROUND(
        SUM(CASE WHEN execution_time > 500 THEN 1 ELSE 0 END) * 100.0
        / NULLIF(COUNT(*), 0),
    2) AS sla_breach_pct
FROM system_logs
GROUP BY endpoint
ORDER BY sla_breach_pct DESC;

-- ===== From analytics_advanced.sql =====

-- =============================================================================
-- ADVANCED ANALYTICS
-- =============================================================================

-- Latency Distribution
SELECT
    CASE
        WHEN execution_time <= 100 THEN 'Excellent'
        WHEN execution_time <= 300 THEN 'Good'
        WHEN execution_time <= 700 THEN 'Moderate'
        ELSE 'Slow'
    END AS latency_bucket,
    COUNT(*) AS request_count
FROM system_logs
GROUP BY latency_bucket
ORDER BY request_count DESC;

-- P95 Latency (seconds)
WITH ranked AS (
    SELECT
        execution_time,
        CUME_DIST() OVER (ORDER BY execution_time) AS cd
    FROM system_logs
)
SELECT ROUND(
    MIN(CASE WHEN cd >= 0.95 THEN execution_time END) / 1000.0,
3) AS p95_latency_sec
FROM ranked;

-- P99 Latency (seconds)
WITH ranked AS (
    SELECT
        execution_time,
        CUME_DIST() OVER (ORDER BY execution_time) AS cd
    FROM system_logs
)
SELECT ROUND(
    MIN(CASE WHEN cd >= 0.99 THEN execution_time END) / 1000.0,
3) AS p99_latency_sec
FROM ranked;

-- Endpoint P95 Latency
WITH endpoint_ranked AS (
    SELECT
        endpoint,
        execution_time,
        CUME_DIST() OVER (PARTITION BY endpoint ORDER BY execution_time) AS cd
    FROM system_logs
)
SELECT
    endpoint,
    ROUND(MIN(CASE WHEN cd >= 0.95 THEN execution_time END) / 1000.0, 3) AS p95_latency_sec
FROM endpoint_ranked
GROUP BY endpoint
ORDER BY p95_latency_sec DESC;

-- Endpoint Risk Mix
SELECT
    endpoint,
    COUNT(*) AS total_requests,
    ROUND(SUM(CASE WHEN status = 500 THEN 1 ELSE 0 END) * 100.0 / NULLIF(COUNT(*), 0), 2) AS error_rate_pct,
    ROUND(SUM(CASE WHEN execution_time > 500 THEN 1 ELSE 0 END) * 100.0 / NULLIF(COUNT(*), 0), 2) AS sla_breach_pct
FROM system_logs
GROUP BY endpoint
ORDER BY error_rate_pct DESC, sla_breach_pct DESC;

-- Rejected Distribution
SELECT
    reason,
    COUNT(*) AS rejected_count,
    ROUND(COUNT(*) * 100.0 / NULLIF((SELECT COUNT(*) FROM rejected_logs), 0), 2) AS rejected_share_pct
FROM rejected_logs
GROUP BY reason
ORDER BY rejected_count DESC;

-- ===== From analytics_kpi.sql =====

-- =============================================================================
-- KPI & ETL ANALYTICS
-- =============================================================================

-- ETL Inserted vs Rejected (%)
SELECT
    run_id,
    source_type,
    total_rows,
    inserted_rows,
    rejected_rows,
    ROUND(inserted_rows * 100.0 / NULLIF(total_rows, 0), 2) AS inserted_pct,
    ROUND(rejected_rows * 100.0 / NULLIF(total_rows, 0), 2) AS rejected_pct,
    load_time
FROM etl_metrics
ORDER BY load_time DESC;

-- Rejected Data by Reason
SELECT
    reason,
    COUNT(*) AS rejected_count
FROM rejected_logs
GROUP BY reason
ORDER BY rejected_count DESC;

-- ETL Freshness (minutes since last load)
SELECT ROUND(
    TIMESTAMPDIFF(SECOND, MAX(load_time), NOW()) / 60.0,
2) AS minutes_since_last_load
FROM etl_metrics;

-- Overall System Health Score
SELECT
    COUNT(*) AS total_requests,
    ROUND(AVG(execution_time) / 1000.0, 3) AS avg_latency_sec,
    ROUND(SUM(status = 200) * 100.0 / NULLIF(COUNT(*), 0), 2) AS success_rate_pct,
    ROUND(SUM(status = 500) * 100.0 / NULLIF(COUNT(*), 0), 2) AS error_rate_pct,
    ROUND(SUM(execution_time > 500) * 100.0 / NULLIF(COUNT(*), 0), 2) AS sla_breach_pct,
    ROUND(
        (
            (SUM(status = 200) * 1.0 / NULLIF(COUNT(*), 0) * 0.5) +
            ((1 - SUM(status = 500) * 1.0 / NULLIF(COUNT(*), 0)) * 0.3) +
            ((1 - SUM(execution_time > 500) * 1.0 / NULLIF(COUNT(*), 0)) * 0.2)
        ) * 100,
    2) AS health_score_pct
FROM system_logs;

-- Query Category Summary
SELECT 'basic_query_count' AS metric, 14 AS value
UNION ALL
SELECT 'advanced_query_count' AS metric, 6 AS value
UNION ALL
SELECT 'other_query_count' AS metric, 0 AS value
UNION ALL
SELECT 'total_query_count' AS metric, 20 AS value;
