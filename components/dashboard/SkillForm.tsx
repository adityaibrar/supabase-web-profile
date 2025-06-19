'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Loader2, Plus, Edit } from 'lucide-react';

interface SkillFormProps {
  skill?: any;
  onUpdate: () => void;
}

export default function SkillForm({ skill, onUpdate }: SkillFormProps) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    category: skill?.category || '',
    name: skill?.name || '',
    level: skill?.level || 1,
  });

  const categories = [
    'Mobile Development',
    'Backend & Database',
    'Cloud & DevOps',
    'Programming Languages',
    'Frontend Development',
    'Tools & Frameworks',
    'Design & UI/UX',
    'Other'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      const data = {
        user_id: user.id,
        category: formData.category,
        name: formData.name,
        level: formData.level,
      };

      let error;
      if (skill) {
        ({ error } = await supabase
          .from('skills')
          .update(data)
          .eq('id', skill.id));
      } else {
        ({ error } = await supabase
          .from('skills')
          .insert([data]));
      }

      if (error) throw error;

      setOpen(false);
      onUpdate();
      
      if (!skill) {
        setFormData({
          category: '',
          name: '',
          level: 1,
        });
      }
    } catch (error) {
      console.error('Error saving skill:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
        >
          {skill ? <Edit className="w-4 h-4" /> : <Plus className="w-4 h-4 mr-2" />}
          {skill ? '' : 'Add Skill'}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-900 border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-cyan-400">
            {skill ? 'Edit Skill' : 'Add Skill'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category" className="text-gray-300">Category</Label>
            <Select value={formData.category} onValueChange={(value) => handleChange('category', value)}>
              <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                {categories.map((category) => (
                  <SelectItem key={category} value={category} className="text-white hover:bg-gray-700">
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-300">Skill Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-cyan-400"
              placeholder="Flutter"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="level" className="text-gray-300">Skill Level (1-5)</Label>
            <Select value={formData.level.toString()} onValueChange={(value) => handleChange('level', parseInt(value))}>
              <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white">
                <SelectValue placeholder="Select skill level" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="1" className="text-white hover:bg-gray-700">1 - Beginner</SelectItem>
                <SelectItem value="2" className="text-white hover:bg-gray-700">2 - Basic</SelectItem>
                <SelectItem value="3" className="text-white hover:bg-gray-700">3 - Intermediate</SelectItem>
                <SelectItem value="4" className="text-white hover:bg-gray-700">4 - Advanced</SelectItem>
                <SelectItem value="5" className="text-white hover:bg-gray-700">5 - Expert</SelectItem>
              </SelectContent>
            </Select>
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