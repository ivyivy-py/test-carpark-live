import React, { useState } from 'react';
import { X, Key, ShieldCheck, ExternalLink, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

interface LtaSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isKeyConfigured: boolean;
  dataSource: 'lta_datamall' | 'fallback_demo';
  onTestOrSaveKey: (key: string) => Promise<boolean>;
  onRefreshData: () => void;
}

export const LtaSettingsModal: React.FC<LtaSettingsModalProps> = ({
  isOpen,
  onClose,
  isKeyConfigured,
  dataSource,
  onTestOrSaveKey,
  onRefreshData,
}) => {
  const [customKey, setCustomKey] = useState('');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  const handleTestKey = async () => {
    if (!customKey.trim()) {
      setTestResult({ success: false, message: 'Please enter an LTA AccountKey to test.' });
      return;
    }
    setTesting(true);
    setTestResult(null);
    try {
      const ok = await onTestOrSaveKey(customKey.trim());
      if (ok) {
        setTestResult({ success: true, message: 'AccountKey verified! Streaming live from LTA DataMall.' });
        onRefreshData();
      } else {
        setTestResult({
          success: false,
          message: 'Unable to authenticate with LTA DataMall. Check key or verify permissions.',
        });
      }
    } catch (err) {
      setTestResult({
        success: false,
        message: err instanceof Error ? err.message : 'Connection failed',
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div
      id="lta-settings-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div
        id="lta-settings-modal-card"
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">LTA DataMall Configuration</h3>
              <p className="text-[11px] text-slate-500">Official Singapore Government Transport Feed</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Status Banner */}
          <div
            className={`p-3 rounded-2xl border flex items-start gap-3 ${
              dataSource === 'lta_datamall'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}
          >
            {dataSource === 'lta_datamall' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            )}
            <div className="text-xs">
              <div className="font-bold">
                {dataSource === 'lta_datamall'
                  ? 'Connected to LTA DataMall Live Feed'
                  : 'Running in Verified SG Fallback Mode'}
              </div>
              <p className="mt-0.5 text-slate-600 text-[11px] leading-relaxed">
                {dataSource === 'lta_datamall'
                  ? 'Real-time carpark lots availability is actively fetched from endpoint CarParkAvailabilityv2.'
                  : 'High-quality Singapore parking dataset is active. Set LTA_ACCOUNT_KEY to stream directly from the government portal.'}
              </p>
            </div>
          </div>

          {/* Endpoint Documentation */}
          <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200/80 text-xs space-y-1.5">
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Configured Endpoint
            </div>
            <div className="font-mono text-[11px] text-blue-700 break-all bg-white p-2 rounded-lg border border-slate-200">
              https://datamall2.mytransport.sg/ltaodataservice/CarParkAvailabilityv2
            </div>
            <div className="text-[11px] text-slate-500">
              Header: <span className="font-mono font-medium text-slate-700">AccountKey: &lt;LTA_ACCOUNT_KEY&gt;</span>
            </div>
          </div>

          {/* Key Input Field */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Custom AccountKey (Optional)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={customKey}
                onChange={(e) => setCustomKey(e.target.value)}
                placeholder="Enter 32-character AccountKey"
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              />
              <button
                onClick={handleTestKey}
                disabled={testing || !customKey.trim()}
                className="px-3 py-2 rounded-xl bg-blue-600 text-white font-medium text-xs hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1 shrink-0"
              >
                {testing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : 'Connect'}
              </button>
            </div>
          </div>

          {/* Test result message */}
          {testResult && (
            <div
              className={`p-2.5 rounded-xl text-xs flex items-center gap-2 ${
                testResult.success
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{testResult.message}</span>
            </div>
          )}

          {/* Link to apply for free LTA key */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Need an LTA DataMall Key?</span>
            <a
              href="https://datamall.lta.gov.sg/content/datamall/en/request-for-api.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline flex items-center gap-1 font-medium"
            >
              <span>Request free key</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-50/80 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
