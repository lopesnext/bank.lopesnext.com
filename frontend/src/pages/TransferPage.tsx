import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Logo from '../components/Common/Logo';
import authService from '../services/authService';
import transferService from '../services/transferService';

const TransferPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [iban, setIban] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const account = authService.getCurrentAccount();

  const handleValidate = async () => {
    setError('');
    setRecipientName('');
    setValidated(false);
    setLoading(true);

    try {
      const result = await transferService.validateRecipient(iban);
      setRecipientName(result.recipient.name);
      setValidated(true);
    } catch (err: any) {
      setError(err.response?.data?.error || t('errors.invalidIBAN'));
    } finally {
      setLoading(false);
    }
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const result = await transferService.createTransfer({
        iban,
        amount: parseFloat(amount),
        description
      });
      setSuccess(t('transfers.success'));
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || t('errors.transferFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Logo size="sm" />
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="text-primary-600 hover:text-primary-700">{t('nav.dashboard')}</Link>
            <button onClick={handleLogout} className="text-red-600 hover:text-red-700">{t('nav.logout')}</button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">{t('transfers.title')}</h1>

        {/* Current Balance */}
        <div className="card mb-6">
          <p className="text-sm text-gray-600">{t('dashboard.balance')}</p>
          <p className="text-2xl font-bold text-primary-600">
            {new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(account?.balance || 0)}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        <div className="card">
          <form onSubmit={handleTransfer} className="space-y-4">
            {/* IBAN Input */}
            <div>
              <label className="label">{t('transfers.recipientIban')}</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={iban}
                  onChange={(e) => {
                    setIban(e.target.value);
                    setValidated(false);
                    setRecipientName('');
                  }}
                  className="input-field flex-1"
                  placeholder="PT50000100001234567890123"
                  required
                />
                <button
                  type="button"
                  onClick={handleValidate}
                  disabled={loading || !iban}
                  className="btn-secondary disabled:opacity-50"
                >
                  {t('transfers.validate')}
                </button>
              </div>
            </div>

            {/* Recipient Name */}
            {validated && recipientName && (
              <div className="bg-green-50 border border-green-200 rounded p-4">
                <p className="text-sm text-green-800 font-semibold">{t('transfers.recipientName')}</p>
                <p className="text-green-900">{recipientName}</p>
              </div>
            )}

            {/* Amount */}
            <div>
              <label className="label">{t('transfers.amount')}</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="input-field"
                placeholder="100.00"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="label">{t('transfers.description')}</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input-field"
                placeholder={t('transfers.description')}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !validated}
              className="w-full btn-primary disabled:opacity-50"
            >
              {loading ? t('common.loading') : t('transfers.send')}
            </button>
          </form>
        </div>

        <div className="mt-6 text-center">
          <Link to="/dashboard" className="text-primary-600 hover:text-primary-700">
            ← {t('common.back')}
          </Link>
        </div>
      </main>
    </div>
  );
};

export default TransferPage;

