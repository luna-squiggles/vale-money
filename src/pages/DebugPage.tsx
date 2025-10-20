import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { submitConsultationData } from '../services/submissionService';

const DebugPage: React.FC = () => {
  const [testResult, setTestResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setTestResult('Testing...');
    
    try {
      // Test 1: Check environment variables
      const url = import.meta.env.VITE_SUPABASE_URL;
      const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      let result = `✅ Environment Variables:\n`;
      result += `URL: ${url ? 'Present (' + url + ')' : '❌ Missing'}\n`;
      result += `Key: ${key ? 'Present (length: ' + key.length + ')' : '❌ Missing'}\n\n`;
      
      // Test 2: Check table exists
      result += `📋 Testing table access...\n`;
      const { data: tableData, error: tableError } = await supabase
        .from('consultation_submissions')
        .select('*')
        .limit(1);
      
      if (tableError) {
        result += `❌ Table error: ${tableError.message}\n`;
        result += `Code: ${tableError.code}\n`;
        result += `Details: ${JSON.stringify(tableError.details)}\n\n`;
      } else {
        result += `✅ Table accessible! Found ${tableData.length} records\n\n`;
      }
      
      // Test 3: Try to insert a test pin
      result += `📝 Testing insert...\n`;
      const testPin = {
        x: 50,
        y: 50,
        label: 'Test Pin ' + new Date().toLocaleTimeString(),
      };
      
      try {
        await submitConsultationData([testPin], {
          submitted_at: new Date().toISOString(),
          test: true,
        });
        result += `✅ Test pin inserted successfully!\n`;
      } catch (insertError: any) {
        result += `❌ Insert error: ${insertError.message}\n`;
      }
      
      // Test 4: Count all submissions
      result += `\n📊 Checking all submissions...\n`;
      const { count, error: countError } = await supabase
        .from('consultation_submissions')
        .select('*', { count: 'exact', head: true });
      
      if (countError) {
        result += `❌ Count error: ${countError.message}\n`;
      } else {
        result += `Total submissions in database: ${count}\n`;
      }
      
      // Test 5: Get approved submissions
      result += `\n✅ Checking approved submissions...\n`;
      const { data: approvedData, error: approvedError } = await supabase
        .from('consultation_submissions')
        .select('*')
        .eq('approved', true);
      
      if (approvedError) {
        result += `❌ Approved query error: ${approvedError.message}\n`;
      } else {
        result += `Approved submissions: ${approvedData.length}\n`;
      }
      
      setTestResult(result);
    } catch (error: any) {
      setTestResult(`❌ Test failed: ${error.message}\n${error.stack}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-16 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Supabase Debug Page</h1>
        
        <button
          onClick={testConnection}
          disabled={loading}
          className="px-6 py-3 bg-brand-blue text-white rounded-lg hover:bg-brand-blue/90 disabled:opacity-50 mb-6"
        >
          {loading ? 'Testing...' : 'Run Connection Test'}
        </button>
        
        {testResult && (
          <pre className="bg-gray-100 p-4 rounded-lg overflow-auto whitespace-pre-wrap font-mono text-sm">
            {testResult}
          </pre>
        )}
      </div>
    </div>
  );
};

export default DebugPage;

