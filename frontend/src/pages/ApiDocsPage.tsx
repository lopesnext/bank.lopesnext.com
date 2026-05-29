import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Logo from '../components/Common/Logo';
import authService from '../services/authService';

const ApiDocsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);
  
  const user = authService.getCurrentUser();
  const token = localStorage.getItem('token');
  const API_BASE_URL = 'http://localhost:3000/api';

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  const copyToClipboard = (text: string, endpoint: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEndpoint(endpoint);
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  const CodeBlock: React.FC<{ code: string; language?: string; endpoint?: string }> = ({ code, language = 'json', endpoint }) => (
    <div className="relative">
      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
        <code className={`language-${language}`}>{code}</code>
      </pre>
      {endpoint && (
        <button
          onClick={() => copyToClipboard(code, endpoint)}
          className="absolute top-2 right-2 px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded transition-colors"
        >
          {copiedEndpoint === endpoint ? t('api.copied') : t('api.copy')}
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Logo size="sm" />
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="text-primary-600 hover:text-primary-700">
              {t('nav.dashboard')}
            </Link>
            <button onClick={() => changeLanguage('pt')} className={`px-2 py-1 rounded text-sm ${i18n.language === 'pt' ? 'bg-primary-600 text-white' : 'text-gray-600'}`}>PT</button>
            <button onClick={() => changeLanguage('en')} className={`px-2 py-1 rounded text-sm ${i18n.language === 'en' ? 'bg-primary-600 text-white' : 'text-gray-600'}`}>EN</button>
            <span className="text-gray-700">{user?.full_name}</span>
            <button onClick={handleLogout} className="text-red-600 hover:text-red-700">{t('nav.logout')}</button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{t('api.title')}</h1>
        <p className="text-gray-600 mb-8">{t('api.description')}</p>

        {/* Authentication Section */}
        <section className="card mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('api.authentication.title')}</h2>
          <p className="text-gray-600 mb-4">{t('api.authentication.description')}</p>
          
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
            <p className="text-sm text-yellow-800">
              <strong>{t('api.yourToken')}:</strong>
            </p>
            <code className="block mt-2 p-2 bg-white rounded text-xs break-all">{token}</code>
          </div>

          <p className="text-sm text-gray-600 mb-4">{t('api.authentication.usage')}</p>
          <CodeBlock 
            code={`Authorization: Bearer ${token}`}
            language="http"
            endpoint="auth-header"
          />
        </section>

        {/* Base URL */}
        <section className="card mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('api.baseUrl')}</h2>
          <CodeBlock 
            code={API_BASE_URL}
            language="text"
            endpoint="base-url"
          />
        </section>

        {/* Register User */}
        <section className="card mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">1. {t('api.endpoints.register.title')}</h2>
          <p className="text-gray-600 mb-4">{t('api.endpoints.register.description')}</p>
          
          <div className="mb-4">
            <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded font-mono text-sm font-semibold">POST</span>
            <span className="ml-2 font-mono text-gray-700">/auth/register</span>
          </div>

          <h3 className="font-semibold text-gray-800 mb-2">{t('api.requestBody')}:</h3>
          <CodeBlock 
            code={`{
  "email": "user@example.com",
  "password": "SecurePass123",
  "full_name": "João Silva",
  "nif": "123456789",
  "cc": "12345678 9 ZZ1",
  "birth_date": "1990-01-15",
  "address": "Rua Example, 123",
  "postal_code": "1000-100",
  "phone": "912345678",
  "nationality": "Portuguesa"
}`}
            endpoint="register-request"
          />

          <h3 className="font-semibold text-gray-800 mb-2 mt-4">{t('api.response')}:</h3>
          <CodeBlock 
            code={`{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "full_name": "João Silva"
  },
  "account": {
    "id": 1,
    "account_number": "0001234567",
    "iban": "PT50000100000001234567890"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}`}
            endpoint="register-response"
          />
        </section>

        {/* Login */}
        <section className="card mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">2. {t('api.endpoints.login.title')}</h2>
          <p className="text-gray-600 mb-4">{t('api.endpoints.login.description')}</p>
          
          <div className="mb-4">
            <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded font-mono text-sm font-semibold">POST</span>
            <span className="ml-2 font-mono text-gray-700">/auth/login</span>
          </div>

          <h3 className="font-semibold text-gray-800 mb-2">{t('api.requestBody')}:</h3>
          <CodeBlock 
            code={`{
  "email": "user@example.com",
  "password": "SecurePass123"
}`}
            endpoint="login-request"
          />

          <h3 className="font-semibold text-gray-800 mb-2 mt-4">{t('api.response')}:</h3>
          <CodeBlock 
            code={`{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "full_name": "João Silva"
  },
  "account": {
    "id": 1,
    "account_number": "0001234567",
    "iban": "PT50000100000001234567890"
  }
}`}
            endpoint="login-response"
          />
        </section>

        {/* Get Balance */}
        <section className="card mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">3. {t('api.endpoints.balance.title')}</h2>
          <p className="text-gray-600 mb-4">{t('api.endpoints.balance.description')}</p>
          
          <div className="mb-4">
            <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded font-mono text-sm font-semibold">GET</span>
            <span className="ml-2 font-mono text-gray-700">/accounts/balance</span>
          </div>

          <h3 className="font-semibold text-gray-800 mb-2">{t('api.headers')}:</h3>
          <CodeBlock 
            code={`Authorization: Bearer ${token}`}
            language="http"
            endpoint="balance-headers"
          />

          <h3 className="font-semibold text-gray-800 mb-2 mt-4">{t('api.response')}:</h3>
          <CodeBlock 
            code={`{
  "balance": 1000.00,
  "account_number": "0001234567",
  "iban": "PT50000100000001234567890"
}`}
            endpoint="balance-response"
          />
        </section>

        {/* Get Transactions */}
        <section className="card mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">4. {t('api.endpoints.transactions.title')}</h2>
          <p className="text-gray-600 mb-4">{t('api.endpoints.transactions.description')}</p>
          
          <div className="mb-4">
            <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded font-mono text-sm font-semibold">GET</span>
            <span className="ml-2 font-mono text-gray-700">/accounts/transactions?limit=10</span>
          </div>

          <h3 className="font-semibold text-gray-800 mb-2">{t('api.headers')}:</h3>
          <CodeBlock 
            code={`Authorization: Bearer ${token}`}
            language="http"
            endpoint="transactions-headers"
          />

          <h3 className="font-semibold text-gray-800 mb-2 mt-4">{t('api.response')}:</h3>
          <CodeBlock 
            code={`[
  {
    "id": 1,
    "amount": 50.00,
    "type": "outgoing",
    "description": "Payment to store",
    "date": "2026-05-29T10:30:00.000Z",
    "counterparty": {
      "name": "Store ABC",
      "iban": "PT50000200000009876543210"
    }
  },
  {
    "id": 2,
    "amount": 100.00,
    "type": "incoming",
    "description": "Salary",
    "date": "2026-05-28T09:00:00.000Z",
    "counterparty": {
      "name": "Company XYZ",
      "iban": "PT50000300000001111111111"
    }
  }
]`}
            endpoint="transactions-response"
          />
        </section>

        {/* Create Transfer */}
        <section className="card mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">5. {t('api.endpoints.transfer.title')}</h2>
          <p className="text-gray-600 mb-4">{t('api.endpoints.transfer.description')}</p>
          
          <div className="mb-4">
            <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded font-mono text-sm font-semibold">POST</span>
            <span className="ml-2 font-mono text-gray-700">/transfers</span>
          </div>

          <h3 className="font-semibold text-gray-800 mb-2">{t('api.headers')}:</h3>
          <CodeBlock 
            code={`Authorization: Bearer ${token}
Content-Type: application/json`}
            language="http"
            endpoint="transfer-headers"
          />

          <h3 className="font-semibold text-gray-800 mb-2 mt-4">{t('api.requestBody')}:</h3>
          <CodeBlock 
            code={`{
  "recipient_iban": "PT50000200000009876543210",
  "amount": 50.00,
  "description": "Payment for services"
}`}
            endpoint="transfer-request"
          />

          <h3 className="font-semibold text-gray-800 mb-2 mt-4">{t('api.response')}:</h3>
          <CodeBlock 
            code={`{
  "message": "Transfer completed successfully",
  "transaction": {
    "id": 3,
    "amount": 50.00,
    "description": "Payment for services",
    "date": "2026-05-29T11:45:00.000Z",
    "recipient": {
      "name": "Maria Santos",
      "iban": "PT50000200000009876543210"
    }
  },
  "new_balance": 950.00
}`}
            endpoint="transfer-response"
          />
        </section>

        {/* Validate IBAN */}
        <section className="card mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">6. {t('api.endpoints.validateIban.title')}</h2>
          <p className="text-gray-600 mb-4">{t('api.endpoints.validateIban.description')}</p>
          
          <div className="mb-4">
            <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded font-mono text-sm font-semibold">POST</span>
            <span className="ml-2 font-mono text-gray-700">/transfers/validate-iban</span>
          </div>

          <h3 className="font-semibold text-gray-800 mb-2">{t('api.headers')}:</h3>
          <CodeBlock 
            code={`Authorization: Bearer ${token}
Content-Type: application/json`}
            language="http"
            endpoint="validate-headers"
          />

          <h3 className="font-semibold text-gray-800 mb-2 mt-4">{t('api.requestBody')}:</h3>
          <CodeBlock 
            code={`{
  "iban": "PT50000200000009876543210"
}`}
            endpoint="validate-request"
          />

          <h3 className="font-semibold text-gray-800 mb-2 mt-4">{t('api.response')}:</h3>
          <CodeBlock 
            code={`{
  "valid": true,
  "account": {
    "name": "Maria Santos",
    "iban": "PT50000200000009876543210"
  }
}`}
            endpoint="validate-response"
          />
        </section>

        {/* Error Responses */}
        <section className="card mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('api.errors.title')}</h2>
          <p className="text-gray-600 mb-4">{t('api.errors.description')}</p>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">400 - {t('api.errors.badRequest')}</h3>
              <CodeBlock 
                code={`{
  "error": "Invalid request data",
  "details": "Amount must be greater than 0"
}`}
                endpoint="error-400"
              />
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-2">401 - {t('api.errors.unauthorized')}</h3>
              <CodeBlock 
                code={`{
  "error": "Unauthorized",
  "message": "Invalid or expired token"
}`}
                endpoint="error-401"
              />
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-2">404 - {t('api.errors.notFound')}</h3>
              <CodeBlock 
                code={`{
  "error": "Not found",
  "message": "Account not found"
}`}
                endpoint="error-404"
              />
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-2">500 - {t('api.errors.serverError')}</h3>
              <CodeBlock 
                code={`{
  "error": "Internal server error",
  "message": "An unexpected error occurred"
}`}
                endpoint="error-500"
              />
            </div>
          </div>
        </section>

        {/* cURL Examples */}
        <section className="card mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('api.curlExamples.title')}</h2>
          <p className="text-gray-600 mb-4">{t('api.curlExamples.description')}</p>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">{t('api.curlExamples.login')}</h3>
              <CodeBlock 
                code={`curl -X POST ${API_BASE_URL}/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123"
  }'`}
                language="bash"
                endpoint="curl-login"
              />
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-2">{t('api.curlExamples.balance')}</h3>
              <CodeBlock 
                code={`curl -X GET ${API_BASE_URL}/accounts/balance \\
  -H "Authorization: Bearer ${token}"`}
                language="bash"
                endpoint="curl-balance"
              />
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-2">{t('api.curlExamples.transfer')}</h3>
              <CodeBlock 
                code={`curl -X POST ${API_BASE_URL}/transfers \\
  -H "Authorization: Bearer ${token}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "recipient_iban": "PT50000200000009876543210",
    "amount": 50.00,
    "description": "Payment for services"
  }'`}
                language="bash"
                endpoint="curl-transfer"
              />
            </div>
          </div>
        </section>

        {/* Back to Dashboard */}
        <div className="text-center">
          <Link to="/dashboard" className="btn-primary inline-block">
            {t('common.back')} {t('nav.dashboard')}
          </Link>
        </div>
      </main>
    </div>
  );
};

export default ApiDocsPage;

// Made with Bob
