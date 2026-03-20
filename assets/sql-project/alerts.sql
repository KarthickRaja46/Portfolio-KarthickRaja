USE performance_monitoring;

-- Alert settings table

CREATE TABLE IF NOT EXISTS alert_threshold_config (
    id TINYINT NOT NULL,
    threshold_ms INT NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CHECK (threshold_ms > 0)
);

INSERT INTO alert_threshold_config (id, threshold_ms)
VALUES (1, 1000)
ON DUPLICATE KEY UPDATE threshold_ms = VALUES(threshold_ms);

-- Alerts table

CREATE TABLE IF NOT EXISTS alerts (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    log_id BIGINT UNSIGNED NOT NULL,
    alert_type VARCHAR(20) NOT NULL,
    severity ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') NOT NULL DEFAULT 'MEDIUM',
    message VARCHAR(500) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_alerts_log_id FOREIGN KEY (log_id) REFERENCES system_logs(id)
);

ALTER TABLE alerts
ADD COLUMN severity ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') NOT NULL DEFAULT 'MEDIUM';

CREATE INDEX idx_alerts_created_at ON alerts(created_at);
CREATE INDEX idx_alerts_type ON alerts(alert_type);
CREATE INDEX idx_alerts_log_id ON alerts(log_id);
CREATE INDEX idx_alerts_severity ON alerts(severity);

DROP TRIGGER IF EXISTS trg_system_logs_alert;

-- Trigger to auto-create alerts for slow requests

DELIMITER $$
CREATE TRIGGER trg_system_logs_alert
AFTER INSERT ON system_logs
FOR EACH ROW
BEGIN
    DECLARE v_threshold INT;

    SELECT COALESCE(MAX(threshold_ms), 1000)
    INTO v_threshold
    FROM alert_threshold_config
    WHERE id = 1;

    IF NEW.execution_time > v_threshold THEN
        INSERT INTO alerts (log_id, alert_type, severity, message)
        VALUES (
            NEW.id,
            'SLOW_QUERY',
            'MEDIUM',
            CONCAT('Execution time ', NEW.execution_time, ' ms exceeded threshold ', v_threshold, ' ms')
        );
    END IF;
END $$
DELIMITER ;
