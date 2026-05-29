import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Logo from '../components/Common/Logo';
import authService from '../services/authService';

const RegisterPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    nif: '',
    cc: '',
    birth_date: '',
    address: '',
    postal_code: '',
    phone: '',
    nationality: 'Portuguesa'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.register(formData);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || t('errors.registrationFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex justify-center mb-6">
            <Logo size="md" />
          </div>

          <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
            {t('auth.registerTitle')}
          </h1>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">{t('register.fullName')}</label>
                <input name="full_name" value={formData.full_name} onChange={handleChange} className="input-field" required />
              </div>
              <div>
                <label className="label">{t('auth.email')}</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="input-field" required />
              </div>
              <div>
                <label className="label">{t('auth.password')}</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} className="input-field" required />
              </div>
              <div>
                <label className="label">{t('register.nif')}</label>
                <input name="nif" value={formData.nif} onChange={handleChange} className="input-field" placeholder="123456789" required />
              </div>
              <div>
                <label className="label">{t('register.cc')}</label>
                <input name="cc" value={formData.cc} onChange={handleChange} className="input-field" placeholder="12345678 9 ZZ1" required />
              </div>
              <div>
                <label className="label">{t('register.birthDate')}</label>
                <input type="date" name="birth_date" value={formData.birth_date} onChange={handleChange} className="input-field" required />
              </div>
              <div className="md:col-span-2">
                <label className="label">{t('register.address')}</label>
                <input name="address" value={formData.address} onChange={handleChange} className="input-field" required />
              </div>
              <div>
                <label className="label">{t('register.postalCode')}</label>
                <input name="postal_code" value={formData.postal_code} onChange={handleChange} className="input-field" placeholder="1000-100" required />
              </div>
              <div>
                <label className="label">{t('register.phone')}</label>
                <input name="phone" value={formData.phone} onChange={handleChange} className="input-field" placeholder="912345678" required />
              </div>
              <div className="md:col-span-2">
                <label className="label">{t('register.nationality')}</label>
                <input name="nationality" value={formData.nationality} onChange={handleChange} className="input-field" required />
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full btn-primary disabled:opacity-50">
              {loading ? t('common.loading') : t('register.submit')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {t('auth.alreadyHaveAccount')}{' '}
              <Link to="/" className="text-primary-600 hover:text-primary-700 font-semibold">
                {t('auth.loginHere')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

