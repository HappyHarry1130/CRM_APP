import React, { useState, useEffect } from 'react';
import { Copy, Check, Mail, MessageSquare } from 'lucide-react';
import { VCContact } from '../types/api';

interface MessageGeneratorProps {
  contact: VCContact;
  type: 'email' | 'social';
  onClose: () => void;
}

export function MessageGenerator({ contact, type, onClose }: MessageGeneratorProps) {
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState({ subject: '', body: '' });

  useEffect(() => {
    generateMessage();
  }, [contact, type]);

  const generateMessage = () => {
    if (type === 'email') {
      const sectors = contact.sectors?.slice(0, 2).join(' and ') || 'your focus areas';
      setMessage({
        subject: `Connecting: AI-Powered Enterprise Solution for ${contact.name}`,
        body: `Dear ${contact.team?.[0]?.name || 'Investment Team'},

I noticed ${contact.name}'s focus on ${sectors} aligns perfectly with our AI-powered enterprise solution. We're helping companies process unstructured data 5x faster with 95% accuracy.

Quick highlights:
• 25 enterprise customers including 2 Fortune 500
• $1.2M ARR, growing 30% MoM
• 95% customer retention rate

Would you be open to a brief conversation next week to explore potential synergies?

Best regards,
[Your name]`
      });
    } else {
      setMessage({
        subject: '',
        body: `Hi ${contact.team?.[0]?.name?.split(' ')[0] || ''} 👋 

Noticed ${contact.name}'s investments in ${contact.sectors?.[0] || 'enterprise tech'}. We're building an AI platform that's helping enterprises process unstructured data 5x faster. Would love to share our traction (25 enterprise customers, 30% MoM growth) and explore if there's mutual interest in connecting.`
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          {type === 'email' ? (
            <>
              <Mail className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Email Template</h3>
            </>
          ) : (
            <>
              <MessageSquare className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">Social Message</h3>
            </>
          )}
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-500"
        >
          ×
        </button>
      </div>

      {type === 'email' && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">Subject</label>
            <button
              onClick={() => copyToClipboard(message.subject)}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              Copy
            </button>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg text-gray-800 font-medium">
            {message.subject}
          </div>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">Message</label>
          <button
            onClick={() => copyToClipboard(message.body)}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            Copy
          </button>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap text-gray-800">
          {message.body}
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <button
          onClick={generateMessage}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
        >
          Regenerate
        </button>
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          Done
        </button>
      </div>
    </div>
  );
}