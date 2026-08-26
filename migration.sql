-- ============================================================
-- GaavConnect Auth Service
-- MySQL Table Migration - Run once on your database
-- Database: gaavconnect
-- ============================================================

CREATE DATABASE IF NOT EXISTS gaavconnect;
USE gaavconnect;

CREATE TABLE IF NOT EXISTS users (
    id          INT UNSIGNED    NOT NULL AUTO_INCREMENT,
    full_name   VARCHAR(150)    NOT NULL,
    mobile      VARCHAR(15)     NOT NULL,
    email       VARCHAR(255)    NOT NULL,
    address     TEXT            NOT NULL,
    pincode     CHAR(6)         NOT NULL,
    state       VARCHAR(100)    NOT NULL,
    profession  VARCHAR(150)    NOT NULL,
    password    VARCHAR(255)    NOT NULL,
    user_type   ENUM('gavkari', 'sarpanch')NOT NULL DEFAULT 'gavkari',
    status      ENUM('active', 'inactive', 'suspended') NOT NULL DEFAULT 'active',
    created_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    UNIQUE KEY uq_email  (email),
    UNIQUE KEY uq_mobile (mobile),
    INDEX idx_user_type (user_type),
    INDEX idx_status    (status)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
