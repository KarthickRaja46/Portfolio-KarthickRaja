-- Create and use the database
CREATE DATABASE IF NOT EXISTS performance_monitoring;
USE performance_monitoring;

-- Main log table
CREATE TABLE IF NOT EXISTS system_logs (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    ip VARCHAR(45) NOT NULL,
    endpoint VARCHAR(255) NOT NULL,
    status SMALLINT NOT NULL,
    `timestamp` DATETIME(3) NOT NULL,
    execution_time INT NOT NULL,
    rows_scanned INT NULL,
    joins_count INT NULL,
    etl_run_id VARCHAR(36) NULL,
    ingested_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CHECK (execution_time >= 0),
    CHECK (rows_scanned IS NULL OR rows_scanned >= 0),
    CHECK (joins_count IS NULL OR joins_count >= 0),
    CHECK (status IN (200, 404, 500))
);

-- ETL run summary table
CREATE TABLE IF NOT EXISTS etl_metrics (
    run_id VARCHAR(36) NOT NULL,
    source_type VARCHAR(20) NOT NULL,
    total_rows INT NOT NULL,
    inserted_rows INT NOT NULL,
    rejected_rows INT NOT NULL,
    load_time DATETIME(3) NOT NULL,
    notes VARCHAR(500) NULL,
    PRIMARY KEY (run_id),
    CHECK (total_rows >= 0),
    CHECK (inserted_rows >= 0),
    CHECK (rejected_rows >= 0),
    CHECK (source_type IN ('csv', 'api', 'batch', 'manual'))
);

-- Rejected row details table
CREATE TABLE IF NOT EXISTS rejected_logs (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    etl_run_id VARCHAR(36) NOT NULL,
    source_type VARCHAR(20) NOT NULL,
    line_number INT NOT NULL,
    reason VARCHAR(100) NOT NULL,
    raw_payload JSON NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_rejected_logs_run_id FOREIGN KEY (etl_run_id) REFERENCES etl_metrics(run_id)
);

-- Archive table for long-term log retention
CREATE TABLE IF NOT EXISTS system_logs_archive (
    id BIGINT UNSIGNED NOT NULL,
    ip VARCHAR(45) NOT NULL,
    endpoint VARCHAR(255) NOT NULL,
    status SMALLINT NOT NULL,
    `timestamp` DATETIME(3) NOT NULL,
    execution_time INT NOT NULL,
    rows_scanned INT NULL,
    joins_count INT NULL,
    etl_run_id VARCHAR(36) NULL,
    ingested_at TIMESTAMP NOT NULL,
    archived_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

-- Focus table for slow-query analysis
CREATE TABLE IF NOT EXISTS slow_queries (
    id BIGINT UNSIGNED NOT NULL,
    ip VARCHAR(45) NOT NULL,
    endpoint VARCHAR(255) NOT NULL,
    status SMALLINT NOT NULL,
    `timestamp` DATETIME(3) NOT NULL,
    execution_time INT NOT NULL,
    rows_scanned INT NULL,
    joins_count INT NULL,
    etl_run_id VARCHAR(36) NULL,
    ingested_at TIMESTAMP NOT NULL,
    extracted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CHECK (execution_time > 1000)
);

-- Indexes for faster analytics and filtering
CREATE INDEX idx_system_logs_timestamp ON system_logs(`timestamp`);
CREATE INDEX idx_system_logs_endpoint ON system_logs(endpoint);
CREATE INDEX idx_system_logs_status ON system_logs(status);
CREATE INDEX idx_system_logs_etl_run_id ON system_logs(etl_run_id);
CREATE INDEX idx_endpoint_timestamp ON system_logs(endpoint, `timestamp`);
CREATE INDEX idx_etl_metrics_load_time ON etl_metrics(load_time);
CREATE INDEX idx_rejected_logs_reason ON rejected_logs(reason);
CREATE INDEX idx_system_logs_archive_timestamp ON system_logs_archive(`timestamp`);
CREATE INDEX idx_slow_queries_timestamp ON slow_queries(`timestamp`);

-- Refresh slow-query focus table from the main log table
REPLACE INTO slow_queries (
    id, ip, endpoint, status, `timestamp`, execution_time, rows_scanned, joins_count, etl_run_id, ingested_at
)
SELECT
    id, ip, endpoint, status, `timestamp`, execution_time, rows_scanned, joins_count, etl_run_id, ingested_at
FROM system_logs
WHERE execution_time > 1000;

-- Procedure to archive and purge logs older than 90 days
DROP PROCEDURE IF EXISTS sp_archive_old_system_logs;
DELIMITER $$
CREATE PROCEDURE sp_archive_old_system_logs()
BEGIN
    INSERT IGNORE INTO system_logs_archive (
        id, ip, endpoint, status, `timestamp`, execution_time, rows_scanned, joins_count, etl_run_id, ingested_at
    )
    SELECT
        id, ip, endpoint, status, `timestamp`, execution_time, rows_scanned, joins_count, etl_run_id, ingested_at
    FROM system_logs
    WHERE `timestamp` < NOW() - INTERVAL 90 DAY;

    DELETE FROM system_logs
    WHERE `timestamp` < NOW() - INTERVAL 90 DAY;
END $$
DELIMITER ;

-- Optional manual CSV load command (run manually only when you want to import CSV)
-- LOAD DATA LOCAL INFILE 'D:/SQL_PROJECT/data/system_logs.csv'
-- INTO TABLE system_logs
-- FIELDS TERMINATED BY ','
-- ENCLOSED BY '"'
-- LINES TERMINATED BY '\n'
-- IGNORE 1 LINES
-- (ip, endpoint, status, @ts, execution_time, rows_scanned, joins_count, etl_run_id)
-- SET `timestamp` = STR_TO_DATE(@ts, '%Y-%m-%d %H:%i:%s.%f');
