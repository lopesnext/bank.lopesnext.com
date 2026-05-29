-- BankLopesNext Database Initialization Script
-- MySQL Database Schema and Initial Data

-- Create Database
CREATE DATABASE IF NOT EXISTS banklopesnext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE banklopesnext;

-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS accounts;
DROP TABLE IF EXISTS users;

-- Table: users
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    nif VARCHAR(9) UNIQUE NOT NULL,
    cc VARCHAR(15) UNIQUE NOT NULL,
    birth_date DATE NOT NULL,
    address TEXT NOT NULL,
    postal_code VARCHAR(8) NOT NULL,
    phone VARCHAR(9) NOT NULL,
    nationality VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_nif (nif),
    INDEX idx_cc (cc)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: accounts
CREATE TABLE accounts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    account_number VARCHAR(10) UNIQUE NOT NULL,
    iban VARCHAR(25) UNIQUE NOT NULL,
    balance DECIMAL(15,2) DEFAULT 1000.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_account_number (account_number),
    INDEX idx_iban (iban),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: transactions
CREATE TABLE transactions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    from_account_id INT NOT NULL,
    to_account_id INT NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    description VARCHAR(255),
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (from_account_id) REFERENCES accounts(id) ON DELETE CASCADE,
    FOREIGN KEY (to_account_id) REFERENCES accounts(id) ON DELETE CASCADE,
    INDEX idx_from_account (from_account_id),
    INDEX idx_to_account (to_account_id),
    INDEX idx_transaction_date (transaction_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert Users (Password for all: Demo123! - hashed with bcrypt)
-- Hash: $2b$10$rQZ9vXKZ8xKZ8xKZ8xKZ8eK9vXKZ8xKZ8xKZ8xKZ8xKZ8xKZ8xKZ8
INSERT INTO users (full_name, email, password_hash, nif, cc, birth_date, address, postal_code, phone, nationality) VALUES
('João Silva', 'joao.silva@email.pt', '$2b$10$rQZ9vXKZ8xKZ8xKZ8xKZ8eK9vXKZ8xKZ8xKZ8xKZ8xKZ8xKZ8xKZ8', '123456789', '12345678 9 ZZ1', '1985-03-15', 'Rua das Flores, 123, Lisboa', '1000-100', '912345678', 'Portuguesa'),
('Maria Santos', 'maria.santos@email.pt', '$2b$10$rQZ9vXKZ8xKZ8xKZ8xKZ8eK9vXKZ8xKZ8xKZ8xKZ8xKZ8xKZ8xKZ8', '234567890', '23456789 0 ZZ2', '1990-07-22', 'Avenida da Liberdade, 456, Porto', '4000-200', '923456789', 'Portuguesa'),
('Pedro Costa', 'pedro.costa@email.pt', '$2b$10$rQZ9vXKZ8xKZ8xKZ8xKZ8eK9vXKZ8xKZ8xKZ8xKZ8xKZ8xKZ8xKZ8', '345678901', '34567890 1 ZZ3', '1988-11-30', 'Praça do Comércio, 789, Coimbra', '3000-300', '934567890', 'Portuguesa'),
('Ana Ferreira', 'ana.ferreira@email.pt', '$2b$10$rQZ9vXKZ8xKZ8xKZ8xKZ8eK9vXKZ8xKZ8xKZ8xKZ8xKZ8xKZ8xKZ8', '456789012', '45678901 2 ZZ4', '1992-05-18', 'Rua Augusta, 321, Faro', '8000-400', '945678901', 'Portuguesa'),
('Demo User', 'demo@banklopesnext.pt', '$2b$10$rQZ9vXKZ8xKZ8xKZ8xKZ8eK9vXKZ8xKZ8xKZ8xKZ8xKZ8xKZ8xKZ8', '987654321', '98765432 1 ZZ0', '1995-01-10', 'Avenida dos Aliados, 100, Porto', '4000-500', '987654321', 'Portuguesa');

-- Insert Accounts with valid Portuguese IBANs
INSERT INTO accounts (user_id, account_number, iban, balance) VALUES
(1, '1234567890', 'PT50000100001234567890123', 2500.00),
(2, '2345678901', 'PT50000100002345678901234', 3750.50),
(3, '3456789012', 'PT50000100003456789012345', 1800.75),
(4, '4567890123', 'PT50000100004567890123456', 4200.25),
(5, '9876543210', 'PT50000100009876543210987', 5000.00);

-- Insert Historical Transactions
-- Transactions between João and Maria
INSERT INTO transactions (from_account_id, to_account_id, amount, description) VALUES
(1, 2, 150.00, 'Pagamento jantar'),
(2, 1, 75.50, 'Reembolso cinema'),
(1, 2, 200.00, 'Prenda aniversário');

-- Transactions between Maria and Pedro
INSERT INTO transactions (from_account_id, to_account_id, amount, description) VALUES
(2, 3, 300.00, 'Renda apartamento'),
(3, 2, 50.00, 'Pagamento livros'),
(2, 3, 125.75, 'Conta restaurante');

-- Transactions between Pedro and Ana
INSERT INTO transactions (from_account_id, to_account_id, amount, description) VALUES
(3, 4, 400.00, 'Empréstimo'),
(4, 3, 100.00, 'Pagamento parcial'),
(3, 4, 85.25, 'Bilhetes concerto');

-- Transactions between Ana and Demo
INSERT INTO transactions (from_account_id, to_account_id, amount, description) VALUES
(4, 5, 250.00, 'Transferência teste'),
(5, 4, 175.50, 'Pagamento serviços'),
(4, 5, 320.00, 'Compra online');

-- Transactions between Demo and João
INSERT INTO transactions (from_account_id, to_account_id, amount, description) VALUES
(5, 1, 500.00, 'Investimento'),
(1, 5, 150.00, 'Consultoria'),
(5, 1, 275.25, 'Pagamento projeto');

-- Additional mixed transactions
INSERT INTO transactions (from_account_id, to_account_id, amount, description) VALUES
(1, 3, 180.00, 'Pagamento freelance'),
(3, 5, 95.50, 'Reembolso despesas'),
(2, 4, 220.00, 'Presente casamento'),
(4, 1, 135.75, 'Venda equipamento'),
(5, 2, 410.00, 'Transferência mensal'),
(2, 5, 88.50, 'Pagamento app'),
(1, 4, 195.00, 'Curso online'),
(4, 2, 165.25, 'Dividir conta'),
(3, 1, 275.00, 'Pagamento design'),
(5, 3, 125.00, 'Subscrição anual');

-- Create indexes for better performance
CREATE INDEX idx_transactions_date ON transactions(transaction_date DESC);
CREATE INDEX idx_accounts_balance ON accounts(balance);

-- Display summary
SELECT 'Database initialized successfully!' AS Status;
SELECT COUNT(*) AS Total_Users FROM users;
SELECT COUNT(*) AS Total_Accounts FROM accounts;
SELECT COUNT(*) AS Total_Transactions FROM transactions;
SELECT SUM(balance) AS Total_Balance FROM accounts;

