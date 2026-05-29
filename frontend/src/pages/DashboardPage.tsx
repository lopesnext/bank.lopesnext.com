import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Logo from '../components/Common/Logo';
import authService from '../services/authService';
import accountService, { Transaction } from '../services/accountService';

const DashboardPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const user = authService.getCurrentUser();
  const account = authService.getCurrentAccount();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [balanceData, transactionsData] = await Promise.all([
        accountService.getBalance(),
        accountService.getTransactions(10)
      ]);
      setBalance(balanceData.balance);
      setTransactions(transactionsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-PT');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">{t('common.loading')}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Logo size="sm" />
          <div className="flex items-center gap-4">
            <button onClick={() => changeLanguage('pt')} className={`px-2 py-1 rounded text-sm ${i18n.language === 'pt' ? 'bg-primary-600 text-white' : 'text-gray-600'}`}>PT</button>
            <button onClick={() => changeLanguage('en')} className={`px-2 py-1 rounded text-sm ${i18n.language === 'en' ? 'bg-primary-600 text-white' : 'text-gray-600'}`}>EN</button>
            <span className="text-gray-700">{user?.full_name}</span>
            <button onClick={handleLogout} className="text-red-600 hover:text-red-700">{t('nav.logout')}</button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          {t('dashboard.welcome')}, {user?.full_name}!
        </h1>

        {/* Account Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <h3 className="text-sm text-gray-600 mb-2">{t('dashboard.balance')}</h3>
            <p className="text-3xl font-bold text-primary-600">{formatCurrency(balance)}</p>
          </div>
          <div className="card">
            <h3 className="text-sm text-gray-600 mb-2">{t('dashboard.accountNumber')}</h3>
            <p className="text-xl font-mono">{account?.account_number}</p>
          </div>
          <div className="card">
            <h3 className="text-sm text-gray-600 mb-2">{t('dashboard.iban')}</h3>
            <p className="text-sm font-mono break-all">{account?.iban}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="mb-8">
          <Link to="/transfer" className="btn-primary inline-block">
            {t('transfers.title')}
          </Link>
        </div>

        {/* Transactions */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-800 mb-4">{t('dashboard.recentTransactions')}</h2>
          {transactions.length === 0 ? (
            <p className="text-gray-500">{t('dashboard.noTransactions')}</p>
          ) : (
            <div className="space-y-3">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold">{tx.counterparty.name}</p>
                    <p className="text-sm text-gray-600">{tx.description}</p>
                    <p className="text-xs text-gray-500">{formatDate(tx.date)}</p>
                  </div>
                  <div className={`text-lg font-bold ${tx.type === 'incoming' ? 'text-green-600' : 'text-red-600'}`}>
                    {tx.type === 'incoming' ? '+' : '-'}{formatCurrency(tx.amount)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;

