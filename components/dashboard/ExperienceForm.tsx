'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Loader2, Plus, Edit } from 'lucide-react';

interface ExperienceFormProps {
  experience?: any;
  onUpdate: () => void;
}

export default function ExperienceForm({ experience, onUpdate }: ExperienceFormProps) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: experience?.title || '',
    company: experience?.company || '',
    start_date: experience?.start_date || '',
    end_date: experience?.end_date || '',
    description: experience?.description || '',
    technologies: experience?.technologies?.join(', ') || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      const technologiesArray = formData.technologies
        .split(',')
        .map(item => item.trim())
        .filter(item => item.length > 0);

      const data = {
        user_id: user.id,
        title: formData.title,
        company: formData.company,
        start_date: formData.start_date || null,
        end_date: formData.end_date || null,
        description: formData.description || null,
        technologies: technologiesArray.length > 0 ? technologiesArray : null,
      };

      let error;
      if (experience) {
        ({ error } = await supabase
          .from('experiences')
          .update(data)
          .eq('id', experience.id));
      } else {
        ({ error } = await supabase
          .from('experiences')
          .insert([data]));
      }

      if (error) throw error;

      setOpen(false);
      onUpdate();
      
      if (!experience) {
        setFormData({
          title: '',
          company: '',
          start_date: '',
          end_date: '',
          description: '',
          technologies: '',
        });
      }
    } catch (error) {
      console.error('Error saving experience:', error);
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
          {experience ? <Edit className="w-4 h-4" /> : <Plus className="w-4 h-4 mr-2" />}
          {experience ? '' : 'Add Experience'}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-cyan-400">
            {experience ? 'Edit Experience' : 'Add Experience'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-gray-300">Job Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-cyan-400"
                placeholder="Senior Flutter Developer"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company" className="text-gray-300">Company</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => handleChange('company', e.target.value)}
                className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-cyan-400"
                placeholder="Company Name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="start_date" className="text-gray-300">Start Date</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => handleChange('start_date', e.target.value)}
                className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-cyan-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_date" className="text-gray-300">End Date</Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) => handleChange('end_date', e.target.value)}
                className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-cyan-400"
                placeholder="Leave empty if current"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="technologies" className="text-gray-300">Technologies</Label>
            <Input
              id="technologies"
              value={formData.technologies}
              onChange={(e) => handleChange('technologies', e.target.value)}
              className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-cyan-400"
              placeholder="Flutter, Dart, Firebase, REST APIs (comma separated)"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-gray-300">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-cyan-400"
              placeholder="Describe your role, responsibilities, and achievements..."
              rows={4}
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