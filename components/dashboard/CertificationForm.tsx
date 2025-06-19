'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Loader2, Plus, Edit } from 'lucide-react';

interface CertificationFormProps {
  certification?: any;
  onUpdate: () => void;
}

export default function CertificationForm({ certification, onUpdate }: CertificationFormProps) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: certification?.title || '',
    issuer: certification?.issuer || '',
    issue_date: certification?.issue_date || '',
    credential_url: certification?.credential_url || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      const data = {
        user_id: user.id,
        title: formData.title,
        issuer: formData.issuer,
        issue_date: formData.issue_date || null,
        credential_url: formData.credential_url || null,
      };

      let error;
      if (certification) {
        ({ error } = await supabase
          .from('certifications')
          .update(data)
          .eq('id', certification.id));
      } else {
        ({ error } = await supabase
          .from('certifications')
          .insert([data]));
      }

      if (error) throw error;

      setOpen(false);
      onUpdate();
      
      if (!certification) {
        setFormData({
          title: '',
          issuer: '',
          issue_date: '',
          credential_url: '',
        });
      }
    } catch (error) {
      console.error('Error saving certification:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
        >
          {certification ? <Edit className="w-4 h-4" /> : <Plus className="w-4 h-4 mr-2" />}
          {certification ? '' : 'Add Certification'}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-900 border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-cyan-400">
            {certification ? 'Edit Certification' : 'Add Certification'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-gray-300">Certification Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-cyan-400"
              placeholder="Google Associate Android Developer"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="issuer" className="text-gray-300">Issuing Organization</Label>
            <Input
              id="issuer"
              value={formData.issuer}
              onChange={(e) => handleChange('issuer', e.target.value)}
              className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-cyan-400"
              placeholder="Google"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="issue_date" className="text-gray-300">Issue Date</Label>
            <Input
              id="issue_date"
              type="date"
              value={formData.issue_date}
              onChange={(e) => handleChange('issue_date', e.target.value)}
              className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-cyan-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="credential_url" className="text-gray-300">Credential URL</Label>
            <Input
              id="credential_url"
              value={formData.credential_url}
              onChange={(e) => handleChange('credential_url', e.target.value)}
              className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-cyan-400"
              placeholder="https://credentials.example.com/cert/123"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}