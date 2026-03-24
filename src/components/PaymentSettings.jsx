import React, { useState, useEffect } from 'react';
import { getPaymentSettingsAPI, updatePaymentSettingsAPI } from '../services/allAPI';

function PaymentSettings() {
  const [settings, setSettings] = useState({
    cod_enabled: true,
    online_enabled: false,
    instructions: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const result = await getPaymentSettingsAPI();
      if (result.status === 200) {
        setSettings(result.data);
      }
    } catch (error) {
      console.error("Error fetching payment settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = sessionStorage.getItem("token");
      const reqHeader = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      };
      const result = await updatePaymentSettingsAPI(settings, reqHeader);
      
      if (result.status === 200) {
        alert("Payment settings successfully updated!");
      } else {
        alert("Failed to update payment settings.");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Error saving settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-8 py-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Checkout Configuration</h2>
          <p className="text-sm text-gray-500 mt-1">Manage accepted payment methods and customer checkout instructions</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 disabled:opacity-50 flex items-center gap-2"
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      <div className="p-8 space-y-10">
        
        {/* Payment Methods */}
        <section>
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Payment Methods Allowed</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* COD Toggle */}
            <div className={`border-2 rounded-2xl p-6 transition-colors cursor-pointer ${settings.cod_enabled ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'}`} onClick={() => setSettings({...settings, cod_enabled: !settings.cod_enabled})}>
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${settings.cod_enabled ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                </div>
                <div className={`w-12 h-6 rounded-full transition-colors relative ${settings.cod_enabled ? 'bg-green-500' : 'bg-gray-300'}`}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.cod_enabled ? 'right-1' : 'left-1'}`}></div>
                </div>
              </div>
              <h4 className={`text-lg font-bold ${settings.cod_enabled ? 'text-green-900' : 'text-gray-900'}`}>Cash on Delivery</h4>
              <p className={`text-sm mt-1 ${settings.cod_enabled ? 'text-green-700' : 'text-gray-500'}`}>Allow customers to pay in person when the order is delivered.</p>
            </div>

            {/* Online Toggle */}
            <div className={`border-2 rounded-2xl p-6 transition-colors cursor-pointer ${settings.online_enabled ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`} onClick={() => setSettings({...settings, online_enabled: !settings.online_enabled})}>
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${settings.online_enabled ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                </div>
                <div className={`w-12 h-6 rounded-full transition-colors relative ${settings.online_enabled ? 'bg-blue-500' : 'bg-gray-300'}`}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.online_enabled ? 'right-1' : 'left-1'}`}></div>
                </div>
              </div>
              <h4 className={`text-lg font-bold ${settings.online_enabled ? 'text-blue-900' : 'text-gray-900'}`}>Online Payment</h4>
              <p className={`text-sm mt-1 ${settings.online_enabled ? 'text-blue-700' : 'text-gray-500'}`}>Enable digital transfers or third-party bank transactions.</p>
            </div>
            
          </div>
        </section>

        {/* Instructions */}
        <section>
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Checkout Instructions & Bank Details</h3>
          <p className="text-sm text-gray-500 mb-4">Enter any required information customers must see before placing their order (e.g. Bank Account details for un-automated Online Transfers, or location warnings). Leave empty if not required.</p>
          <textarea
            rows="6"
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 text-gray-800 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none resize-y"
            placeholder="Example: We currently only accept Cash on Delivery for valid addresses inside standard shipping zones..."
            value={settings.instructions}
            onChange={(e) => setSettings({...settings, instructions: e.target.value})}
          ></textarea>
        </section>

      </div>
    </div>
  );
}

export default PaymentSettings;
