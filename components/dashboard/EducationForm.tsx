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

interface EducationFormProps {
  education?: any;
  onUpdate: () => void;
}

export default function EducationForm({ education, onUpdate }: EducationFormProps) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    degree: education?.degree || '',
    institution: education?.institution || '',
    start_date: education?.start_date || '',
    end_date: education?.end_date || '',
    description: education?.description || '',
    gpa: education?.gpa || '',
    achievements: education?.achievements?.join(', ') || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      const achievementsArray = formData.achievements
        .split(',')
        .map(item => item.trim())
        .filter(item => item.length > 0);

      const data = {
        user_id: user.id,
        degree: formData.degree,
        institution: formData.institution,
        start_date: formData.start_date || null,
        end_date: formData.end_date || null,
        description: formData.description || null,
        gpa: formData.gpa || null,
        achievements: achievementsArray.length > 0 ? achievementsArray : null,
      };

      let error;
      if (education) {
        ({ error } = await supabase
          .from('education')
          .update(data)
          .eq('id', education.id));
      } else {
        ({ error } = await supabase
          .from('education')
          .insert([data]));
      }

      if (error) throw error;

      setOpen(false);
      onUpdate();
      
      if (!education) {
        setFormData({
          degree: '',
          institution: '',
          start_date: '',
          end_date: '',
          description: '',
          gpa: '',
          achievements: '',
        });
      }
    } catch (error) {
      console.error('Error saving education:', error);
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
          {education ? <Edit className="w-4 h-4" /> : <Plus className="w-4 h-4 mr-2" />}
          {education ? '' : 'Add Education'}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-cyan-400">
            {education ? 'Edit Education' : 'Add Education'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="degree" className="text-gray-300">Degree</Label>
              <Input
                id="degree"
                value={formData.degree}
                onChange={(e) => handleChange('degree', e.target.value)}
                className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-cyan-400"
                placeholder="Bachelor of Computer Science"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="institution" className="text-gray-300">Institution</Label>
              <Input
                id="institution"
                value={formData.institution}
                onChange={(e) => handleChange('institution', e.target.value)}
                className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-cyan-400"
                placeholder="University Name"
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
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gpa" className="text-gray-300">GPA</Label>
              <Input
                id="gpa"
                value={formData.gpa}
                onChange={(e) => handleChange('gpa', e.target.value)}
                className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-cyan-400"
                placeholder="3.8/4.0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="achievements" className="text-gray-300">Achievements</Label>
              <Input
                id="achievements"
                value={formData.achievements}
                onChange={(e) => handleChange('achievements', e.target.value)}
                className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-cyan-400"
                placeholder="Magna Cum Laude, Dean's List (comma separated)"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-gray-300">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-cyan-400"
              placeholder="Describe your studies, specializations, etc."
              rows={3}
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